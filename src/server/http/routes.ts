/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Local HTTP routes exposing real installs to the in-app Plugin Hub UI.
 * The client fetches the same-origin `/dsh-plugin-hub/*` endpoints; the
 * install handler validates the target, then spawns the official dsh CLI
 * (see services/install/install.ts) and reports the captured result back.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { homedir, release } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { fetchViaCurl, gitLsRemote, probeUrl, systemProxy } from '../services/probe.ts'
import { activeTask, cancelTask, dumpLoaderEntries, getTask, githubRepoOf, githubTarget, globalNpmPackagesOf, hasQueuedTarget, installTargetOf, listPendingRestarts, readProfileArg, startPluginMutation, validPackageName, type LoaderHandle } from '../services/install/install.ts'
import { recordInstalledVersion, recordResolvedNpmPackage, readInstalledVersions, removeInstalledVersion } from '../services/profile/installed-versions.ts'
import { resolveNpmPackage } from '../services/install/npm-resolve.ts'
import { preflightTarget } from '../services/install/preflight.ts'
import { isDshPlugin, isEntryLoaded } from '../services/loader.ts'
import { loadSettings, saveSettings, resetSettings, type HubSettings } from '../services/settings.ts'
import { appendLog, clearLog, readLog, logFilePath, defaultLogFilePath, customLogFile } from '../services/log.ts'

/**
 * 跨平台宿主重启脚本（以 `node -e` 运行，独立于宿主进程）。
 * 取代原先的 `/bin/sh -c`：Windows 无 /bin/sh，且 lsof/nohup 仅 POSIX 存在。
 * 由 `spawn(process.execPath, ['-e', SCRIPT, port], { detached, stdio:'ignore' })` 孵化，
 * 宿主进程被 kill 后仍能完成「停旧 → 等端口释放 → 拉起新 dsh web」。
 */
const HOST_RESTART_SCRIPT = String.raw`const C = require('node:child_process')
const F = require('node:fs')
const P = require('node:path')
const O = require('node:os')
const win = process.platform === 'win32'
const port = Number(process.argv[1])

function findPids() {
  if (win) {
    const out = C.spawnSync('netstat', ['-ano', '-p', 'tcp'], { encoding: 'utf8' })
    const found = []
    for (const line of String(out.stdout || '').split(/\r?\n/)) {
      if (!/LISTENING/i.test(line)) continue
      const parts = line.trim().split(/\s+/)
      const addr = parts[1] || ''
      if (!addr.endsWith(':' + port)) continue
      const pid = parts[parts.length - 1]
      if (pid && /\d+/.test(pid)) found.push(pid)
    }
    return found
  }
  const out = C.spawnSync('lsof', ['-ti', 'tcp:' + port, '-sTCP:LISTEN'], { encoding: 'utf8' })
  return String(out.stdout || '').split(/\s+/).filter(Boolean)
}

for (const pid of findPids()) {
  try {
    if (win) C.spawnSync('taskkill', ['/pid', pid, '/t', '/f'])
    else process.kill(Number(pid), 'SIGTERM')
  } catch {}
}

let tries = 0
;(function waitForStop() {
  if (findPids().length === 0 || ++tries > 20) return startHost()
  setTimeout(waitForStop, 250)
})()

function startHost() {
  const dir = P.join(O.homedir(), '.dsh', 'logs')
  F.mkdirSync(dir, { recursive: true })
  const fd = F.openSync(P.join(dir, 'dsh-web-' + port + '.log'), 'a')
  const child = C.spawn('dsh', ['web', '--port', String(port)], {
    detached: true,
    shell: win,
    stdio: ['ignore', fd, fd],
  })
  child.unref()
}`

export interface WebRoute {
  kind: 'exact'
  path: string
  handler: (request: IncomingMessage, response: ServerResponse) => void | Promise<void>
}

/** The subset of the host web-server service this plugin touches. */
export interface WebServerService {
  register(route: WebRoute): () => void
}

const PROFILE_RE = /^[A-Za-z0-9_-]+$/
const BODY_LIMIT_BYTES = 4 * 1024
const COMMAND_TIMEOUT_MS = 5 * 60 * 1000

/** 目录/统计数据代理的本地缓存时长：1 小时内重复打开插件市场直接读盘，
 *  不重复走 curl 拉远程 —— 重启宿主后首次打开同样秒开（缓存跨重启存活）。 */
const CATALOG_CACHE_TTL_MS = 60 * 60 * 1000

/** 磁盘缓存内容：原始响应字符串 + 写入时间戳（TTL 判定用）。 */
interface CatalogCacheEntry {
  at: number
  body: string
}

function catalogCacheFile(profile: string, key: string): string {
  return join(profileDirectory(profile), 'cache', `catalog-${key}.json`)
}

/** 读缓存：文件存在、JSON 合法、未过期 → 返回原始响应字符串；否则 null（视为 miss）。 */
function readCatalogCache(file: string): string | null {
  try {
    const entry = JSON.parse(readFileSync(file, 'utf8')) as CatalogCacheEntry
    if (entry && typeof entry.at === 'number' && typeof entry.body === 'string'
      && Date.now() - entry.at < CATALOG_CACHE_TTL_MS) {
      return entry.body
    }
  } catch {
    // 文件缺失 / 解析失败 / 字段不完整 → miss，重新拉取覆盖写盘
  }
  return null
}

/** 写缓存：目录不存在则创建；写失败静默忽略（缓存只是加速，不影响功能）。 */
function writeCatalogCache(file: string, body: string): void {
  try {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, JSON.stringify({ at: Date.now(), body } satisfies CatalogCacheEntry))
  } catch {
    // 磁盘只读/无权限等极端情况：忽略，继续走直连
  }
}

function profileDirectory(profile: string): string {
  return join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'profiles', profile)
}

/** Read non-official dependencies installed into one profile. */
export function readInstalled(profile: string): Record<string, string> {
  try {
    const manifest = JSON.parse(readFileSync(join(profileDirectory(profile), 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>
    }
    return Object.fromEntries(
      Object.entries(manifest.dependencies ?? {}).filter(([name]) => !name.startsWith('@deepseek-ai/')),
    )
  } catch {
    return {}
  }
}

/** 宿主 dsh CLI 版本：优先直接跑 `dsh --version`（与 pnpm/npm/git 同款同步探测，1500ms 超时兜底，
 *  绝不挂起）—— 原先从 process.argv[1] 向上找 package.json 猜版本在部分宿主加载方式下取不到，
 *  导致 issue 环境快照 DSH: unknown；拿不到再退回入口 package.json 查找（dsh 不在 PATH 时兜底）。 */
function hostDshVersion(): string | null {
  const viaCli = toolVersion('dsh', ['--version'])
  if (viaCli) return viaCli
  const entry = process.argv[1]
  if (entry === undefined) return null
  let dir = dirname(resolve(entry))
  for (let depth = 0; depth < 4; depth++) {
    try {
      const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as { name?: string; version?: string }
      const name = manifest.name ?? ''
      if (typeof manifest.version === 'string' && (name === 'dsh' || name.includes('dsh') || name.includes('harness'))) {
        return manifest.version
      }
    } catch {
      /* not a package root — keep walking up */
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

/** 探测命令行工具的版本号（pnpm --version / npm --version / git --version）：
 *  未安装 / 不在 PATH / 超时一律返回 null —— issue 环境快照如实写 unknown，绝不挂起。
 *  （同步探测仅用于启动期/请求期的低频率 /env 快照，安装通道不经过这里。） */
function toolVersion(cmd: string, args: string[]): string | null {
  try {
    const r = spawnSync(cmd, args, { timeout: 1500, encoding: 'utf8' })
    if (r.error || r.status !== 0) return null
    const v = (r.stdout ?? '').trim().split(/\r?\n/)[0]
    return v || null
  } catch {
    return null
  }
}

/** 宿主环境快照：提交 bug 时随 issue 附上，便于作者复现（前端 /env 端点返回）。 */
function hostEnv(profile: string): Record<string, string | null> {
  return {
    dshVersion: hostDshVersion(),
    nodeVersion: process.version,
    pnpmVersion: toolVersion('pnpm', ['--version']),
    npmVersion: toolVersion('npm', ['--version']),
    gitVersion: toolVersion('git', ['--version']),
    platform: process.platform,
    arch: process.arch,
    release: release(),
    profile,
    dshHome: process.env.DSH_HOME ?? join(homedir(), '.dsh'),
  }
}

/** 安装/卸载 CLI 的子进程环境：透传宿主环境，并按设置注入 HTTP(S) 代理。
 *  npm registry 不再注入 —— 安装完全沿用用户本机 npm 配置（~/.npmrc / 全局配置）。
 *  代理优先级：设置里的代理 → 系统代理（macOS scutil / Windows 注册表）→ 宿主 env 原有值。
 *  使安装通道与诊断使用相同的代理来源。 */
function mutationEnv(settings: HubSettings): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env, CI: 'true' }
  const proxy = settings.proxy !== '' ? settings.proxy : (systemProxy() ?? '')
  if (proxy !== '') {
    env.HTTP_PROXY = proxy
    env.HTTPS_PROXY = proxy
    env.http_proxy = proxy
    env.https_proxy = proxy
  }
  return env
}

/** Match a GitHub install target against the installed table; returns the package name when already installed. */
function installedByRepo(installed: Record<string, string>, target: string): string | null {
  const repo = githubRepoOf(target)
  if (repo === null) return null
  const needle = repo.toLowerCase()
  for (const [name, spec] of Object.entries(installed)) {
    if (githubRepoOf(spec)?.toLowerCase() === needle) return name
  }
  return null
}

function sendJson(response: ServerResponse, status: number, value: unknown): void {
  response.writeHead(status, {
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(value))
}

/** POST mutations are only accepted from the local web server origin. */
function isSameOrigin(request: IncomingMessage): boolean {
  const origin = request.headers.origin
  const host = request.headers.host
  if (origin === undefined || host === undefined) return false
  try {
    const url = new URL(origin)
    const localHostnames = new Set(['localhost', '127.0.0.1', '[::1]'])
    return url.host === host && localHostnames.has(url.hostname)
  } catch {
    return false
  }
}

function requireMethod(request: IncomingMessage, response: ServerResponse, method: 'GET' | 'POST'): boolean {
  if (request.method === method) return true
  response.writeHead(405, { allow: method })
  response.end()
  return false
}

function requireTrustedPost(request: IncomingMessage, response: ServerResponse): boolean {
  if (!requireMethod(request, response, 'POST')) return false
  if (isSameOrigin(request)) return true
  sendJson(response, 403, { error: 'untrusted origin' })
  return false
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > BODY_LIMIT_BYTES) throw new Error('request body too large')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

/**
 * Register the Plugin Hub API on the host web server and return a disposer.
 * @param webServer - DSH web server service.
 * @param profile - profile that owns plugin mutations.
 * @param loader - running loader (optional): lets uninstall remove the entry
 *   immediately so the page survives a refresh without a host restart.
 */
export function mountPluginHubRoutes(webServer: WebServerService, profile: string, loader?: LoaderHandle): () => void {
  if (!PROFILE_RE.test(profile)) throw new Error(`invalid profile name: ${profile}`)
  console.log(`[hub] routes mounted (profile=${profile}, loader=${loader === undefined ? 'undefined' : 'provided'})`)
  // 系统日志：插件随宿主启动即记录一条 —— 保证「打开就有运行日志」，日志页永远有内容
  appendLog(profile, {
    at: Date.now(),
    level: 'info',
    category: 'system',
    event: 'system.start',
    message: `Plugin Hub 已启动（profile=${profile}）`,
  })
  const disposers = [
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/debug/loader-entries',
      handler: (request, response) => {
        if (!requireMethod(request, response, 'GET')) return
        sendJson(response, 200, { entries: dumpLoaderEntries(loader) })
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/settings',
      // GET 读 / POST 写：webServer.register 按 (kind, path) 唯一，多方法必须合并到同一个 handler 按 method 分派
      handler: async (request, response) => {
        if (request.method === 'GET') {
          sendJson(response, 200, loadSettings(profile))
          return
        }
        if (!requireTrustedPost(request, response)) return
        try {
          const body = await readJsonBody(request)
          // 白名单字段：只接受已知设置项，防客户端把任意键写进文件
          const patch: Record<string, unknown> = {}
          const source = typeof body === 'object' && body !== null ? body as Record<string, unknown> : {}
          for (const key of ['checkUpdatesOnStart', 'enableNpmInstall', 'enableGitInstall', 'enableDshInstall', 'npmRegistry', 'proxy', 'logPath'] as const) {
            if (source[key] !== undefined) patch[key] = source[key]
          }
          // 日志位置：非空时预建目录验证可写，失败直接 400 拦截（默认位置永远合法，空串 = 回默认）
          if (typeof patch.logPath === 'string' && patch.logPath.trim() !== '') {
            try {
              mkdirSync(dirname(customLogFile(patch.logPath)), { recursive: true })
            } catch {
              sendJson(response, 400, { error: 'log path is not writable' })
              return
            }
          }
          sendJson(response, 200, saveSettings(profile, patch))
          // 系统日志：设置项变更
          appendLog(profile, {
            at: Date.now(),
            level: 'info',
            category: 'settings',
            event: 'settings.update',
            message: `更新设置：${Object.keys(patch).join(', ')}`,
          })
        } catch (error) {
          sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) })
        }
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/settings/reset',
      handler: async (request, response) => {
        if (!requireTrustedPost(request, response)) return
        sendJson(response, 200, resetSettings(profile))
        appendLog(profile, {
          at: Date.now(),
          level: 'warn',
          category: 'settings',
          event: 'settings.reset',
          message: '恢复全部默认设置',
        })
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/logs',
      handler: (request, response) => {
        if (!requireMethod(request, response, 'GET')) return
        // 日志查看器分页接口：?offset=&limit=&category=&level=&query=，返回过滤后的倒序分页
        try {
          const url = new URL(request.url ?? '/', 'http://localhost')
          const num = (name: string): number | undefined => {
            const v = url.searchParams.get(name)
            if (v === null || v === '') return undefined
            const n = Number(v)
            return Number.isFinite(n) && n >= 0 ? Math.floor(n) : undefined
          }
          const limit = Math.min(num('limit') ?? 200, 500)
          const category = url.searchParams.get('category') ?? 'all'
          const level = url.searchParams.get('level') ?? 'all'
          const query = url.searchParams.get('query') ?? ''
          const result = readLog(profile, {
            offset: num('offset') ?? 0,
            limit,
            category: category as 'all' | 'install' | 'uninstall' | 'update' | 'diagnostics' | 'settings' | 'system',
            level: level as 'all' | 'debug' | 'info' | 'success' | 'warn' | 'error',
            query,
          })
          sendJson(response, 200, {
            entries: result.entries,
            total: result.total,
            offset: num('offset') ?? 0,
            limit,
            hasMore: result.total > (num('offset') ?? 0) + result.entries.length,
            path: logFilePath(profile),
            defaultPath: defaultLogFilePath(profile),
          })
        } catch {
          sendJson(response, 400, { error: 'invalid log query' })
        }
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/clear-log',
      handler: (request, response) => {
        if (!requireTrustedPost(request, response)) return
        // 清空所有日志：截断当前日志文件为空
        try {
          const ok = clearLog(profile)
          if (!ok) {
            sendJson(response, 500, { error: 'failed to clear log' })
            return
          }
          appendLog(profile, { at: Date.now(), level: 'info', category: 'system', event: 'system.clear', message: '日志已由用户清空' })
          sendJson(response, 200, { ok: true })
        } catch {
          sendJson(response, 500, { error: 'failed to clear log' })
        }
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/open-log',
      handler: (request, response) => {
        if (!requireTrustedPost(request, response)) return
        // 在系统文件管理器里定位日志文件（macOS Finder -R / Windows explorer /select, / Linux xdg-open）
        try {
          const file = logFilePath(profile)
          const bin = process.platform === 'darwin' ? 'open'
            : process.platform === 'win32' ? 'explorer'
              : 'xdg-open'
          const args = process.platform === 'darwin' ? ['-R', file]
            : process.platform === 'win32' ? ['/select,', file]
              : [file]
          const child = spawn(bin, args, { stdio: 'ignore', detached: true })
          child.once('error', () => sendJson(response, 500, { error: 'failed to open log file' }))
          child.once('spawn', () => sendJson(response, 200, { ok: true }))
        } catch {
          sendJson(response, 500, { error: 'failed to open log file' })
        }
      },
    }),
    // 系统目录选择器：弹原生文件夹对话框让用户挑日志存放目录（macOS osascript /
    // Windows FolderBrowserDialog / Linux zenity），选中返回绝对路径，取消返回 cancelled。
    // 与 open-log 不同，这里必须等对话框关闭才能拿结果，所以阻塞收集 stdout 再应答。
    // 对话框默认定位到当前日志文件所在目录 —— 每台机器/平台的默认位置都不同，
    // 这里动态取 logFilePath() 的目录，用户打开就在「它原来的位置」附近。
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/choose-log-dir',
      handler: (request, response) => {
        if (!requireTrustedPost(request, response)) return
        try {
          const title = 'DSH Plugin Hub — choose log folder'
          const startDir = dirname(logFilePath(profile))
          let bin: string
          let args: string[]
          if (process.platform === 'darwin') {
            bin = 'osascript'
            args = ['-e', `POSIX path of (choose folder with prompt "${title}" default location (POSIX file "${startDir}"))`]
          } else if (process.platform === 'win32') {
            bin = 'powershell.exe'
            args = ['-NoProfile', '-STA', '-Command', [
              'Add-Type -AssemblyName System.Windows.Forms',
              '$f = New-Object System.Windows.Forms.FolderBrowserDialog',
              `$f.Description = '${title}'`,
              // 初始定位到当前日志目录（单引号字符串内反斜杠不转义，Windows 路径原样传入）
              `$f.SelectedPath = '${startDir}'`,
              'if ($f.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { $f.SelectedPath } else { "" }',
            ].join('; ')]
          } else {
            bin = 'zenity'
            args = ['--file-selection', '--directory', `--title=${title}`, `--filename=${startDir}`]
          }
          const child = spawn(bin, args)
          let out = ''
          child.stdout.on('data', (d) => { out += String(d) })
          child.on('error', () => sendJson(response, 500, { error: 'directory picker unavailable' }))
          child.on('close', (code) => {
            // macOS osascript 输出带引号（如 "/Users/x"），统一剥掉首尾空白与引号
            const picked = out.trim().replace(/^"|"$/g, '')
            if (code === 0 && picked !== '') sendJson(response, 200, { path: picked })
            else sendJson(response, 200, { cancelled: true })
          })
        } catch {
          sendJson(response, 500, { error: 'directory picker unavailable' })
        }
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/diagnostics',
      handler: async (request, response) => {
        if (!requireTrustedPost(request, response)) return
        // 连通性自检：npm registry（镜像/官方）/ GitHub API / 目录站点，逐路探测并测速。
        // 与安装通道一一对应 —— npm 反查与 npm 安装走 registry、git 源走 github、目录数据走 dsh-plugin.org。
        // 流式（NDJSON）逐条上报：每个探测先发命令行，完成后发结果行，客户端以黑窗口终端实时展示。
        // 可选 body { key }：只重测指定通道（页面列表「重测」单项时用），缺省全量串行探测。
        let onlyKey = ''
        try {
          const body = await readJsonBody(request)
          if (body !== null && typeof body === 'object' && typeof (body as { key?: unknown }).key === 'string') {
            onlyKey = (body as { key: string }).key
          }
        } catch {
          // 空 body / 非 JSON：视为全量探测
        }
        const settings = loadSettings(profile)
        // npm 通道：设置里配置了镜像源就探测该镜像（安装通道吃同一个 registry）；
        // 未配置（空串）时探测官方源作为「跟随本机 npm 配置」的基础连通性参考。
        const registry = settings.npmRegistry.replace(/\/+$/, '') || 'https://registry.npmjs.org'
        // 连通性自检直接打安装通道真实访问的轻量资源：npm 源拉包元数据、git 通道探
        // 仓库主页、目录站探 badge 小文件，避免拉取目录全量 JSON。
        // npm 行 display：配置了镜像就显示镜像地址；未配置置空 —— 客户端显示「未配置（跟随本机 npm 配置）」。
        const allChecks: Array<{ key: string; url: string; display: string; cmd: string; proxy?: string; git?: boolean }> = [
          { key: 'npm', url: `${registry}/dsh-plugin`, display: settings.npmRegistry !== '' ? registry : '', cmd: `npm view dsh-plugin version --registry ${registry}` },
          // GitHub 行用真实 git 克隆握手（git ls-remote）打 dshplugin/hello-dsh 小仓库：
          // 「网页能打开」和「git 能克隆」是两码事，握手成功才算通道通；小仓库秒级完成，不打 17MB 的 dsh-plugin-hub。
          { key: 'github', url: 'https://github.com/dshplugin/hello-dsh', display: 'github.com', cmd: 'git ls-remote https://github.com/dshplugin/hello-dsh', git: true },
          { key: 'catalog', url: 'https://api.dsh-plugin.org/stats.json', display: '', cmd: 'curl -s https://api.dsh-plugin.org/stats.json' },
        ]
        // 配置了 HTTP 代理：追加一行代理诊断 —— 用该代理打 github.com（安装通道真实访问的地址），
        // 验证「代理能不能把请求带出去」。与安装同口径：curl 子进程注入该代理 env。
        // 设置里未配置代理时不显示该行（跟随系统代理/直连，无「代理本身」可验证）。
        if (settings.proxy !== '') {
          allChecks.push({ key: 'proxy', url: 'https://github.com', display: settings.proxy, cmd: `curl -s -o /dev/null -x ${settings.proxy} https://github.com`, proxy: settings.proxy })
        }
        const checks = onlyKey !== '' ? allChecks.filter((c) => c.key === onlyKey) : allChecks
        response.writeHead(200, {
          'content-type': 'application/x-ndjson; charset=utf-8',
          'cache-control': 'no-store',
        })
        const send = (line: unknown) => { response.write(`${JSON.stringify(line)}\n`) }
        // 探测走代理的优先级：设置里的代理 → 系统代理（macOS scutil / Windows 注册表）→ 环境变量 HTTPS_PROXY → 直连。
        // 与安装通道一致（npm/git 靠 HTTP_PROXY 环境变量走代理），且自动跟随系统代理 ——
        // 浏览器挂着代理能开、诊断就能测通，不用用户手动把代理填进设置。
        // proxy 行例外：它验证的正是「设置里配的那个代理」，必须显式用它（而非 effectiveProxy）去探测。
        const effectiveProxy = settings.proxy !== ''
          ? settings.proxy
          : (systemProxy() ?? process.env.HTTPS_PROXY ?? process.env.https_proxy ?? '')
        const probe = (url: string, proxy?: string) => probeUrl(url, proxy ?? effectiveProxy, 6000)
        // 逐路串行：一条命令一条结果地推送给终端，保持「程序在跑」的真实感
        const results: Array<{ key: string; ok: boolean }> = []
        for (const c of checks) {
          send({ type: 'probe', key: c.key, cmd: c.cmd, display: c.display })
          // git 行走真实克隆握手（gitLsRemote），其余走 curl 探测，两路都带超时兜底
          const r = c.git
            ? await gitLsRemote(c.url, c.proxy ?? effectiveProxy, 6000)
            : await probe(c.url, c.proxy)
          results.push({ key: c.key, ok: r.ok })
          // git 行的 status 是退出码，客户端 git 行只显示 OK / 不可达，不显示成 HTTP 码
          send({ type: r.ok ? 'ok' : 'fail', key: c.key, display: c.display, ms: r.ms, status: c.git ? null : r.status })
        }
        send({ type: 'end', at: Date.now() })
        response.end()
        // 系统日志：诊断汇总（全部通过 / 存在不可达）
        const failed = results.filter((r) => !r.ok)
        appendLog(profile, {
          at: Date.now(),
          level: failed.length === 0 ? 'success' : 'error',
          category: 'diagnostics',
          event: 'diagnostics.done',
          message: failed.length === 0
            ? `连通性检测通过（${results.length} 个通道）`
            : `连通性检测：${failed.length}/${results.length} 个通道不可达`,
        })
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/proxy-check',
      handler: async (request, response) => {
        if (!requireTrustedPost(request, response)) return
        // 代理连通性校验：用待测代理打 dshplugin/hello-dsh 真实仓库页（权威可达目标），
        // 供设置页输入代理时实时反馈「这个地址通不通」。不通过也允许保存 ——
        // 用户可能是先填地址后开代理，因此这里只报告探测结果、不拦截保存。
        let proxy = ''
        let target = 'https://github.com/dshplugin/hello-dsh'
        try {
          const body = await readJsonBody(request)
          if (body !== null && typeof body === 'object') {
            const b = body as { proxy?: unknown; target?: unknown }
            if (typeof b.proxy === 'string') proxy = b.proxy.trim()
            if (typeof b.target === 'string' && b.target.trim() !== '') target = b.target.trim()
          }
        } catch {
          // 空 body / 非 JSON：按默认目标探测
        }
        if (proxy === '') {
          sendJson(response, 200, { ok: false, ms: null, status: null, target, reason: 'empty' })
          return
        }
        // 探测走该代理本身（不是 effectiveProxy）：验证的就是用户填的这个地址
        const r = await probeUrl(target, proxy, 6000)
        sendJson(response, 200, { ok: r.ok, ms: r.ms, status: r.status, target })
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/catalog',
      handler: async (request, response) => {
        if (!requireMethod(request, response, 'GET')) return
        // 目录/统计数据服务端代理：浏览器不再直连 dsh-plugin.org，改经此路由
        // 转发（curl 子进程注入代理 env），与 npm / git 安装通道走同一代理口径，
        // 「npm / git / 目录数据请求统一走该代理」的设置文案因此真实生效。
        const url = new URL(request.url ?? '/', 'http://localhost')
        const settings = loadSettings(profile)
        // 代理优先级与安装/诊断一致：设置里的代理 → 系统代理 → 环境变量 → 直连
        const proxy = settings.proxy !== ''
          ? settings.proxy
          : (systemProxy() ?? process.env.HTTPS_PROXY ?? process.env.https_proxy ?? '')
        const isStats = url.searchParams.get('stats') === '1'
        const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'zh'
        const target = isStats
          ? 'https://api.dsh-plugin.org/stats.json'
          : `https://api.dsh-plugin.org/plugins.${lang}.json`
        // 1 小时本地缓存：命中直接返回（跨重启生效，插件市场秒开），未命中才走 curl 拉远程
        const cacheFile = catalogCacheFile(profile, isStats ? 'stats' : `plugins-${lang}`)
        const cached = readCatalogCache(cacheFile)
        if (cached !== null) {
          try {
            sendJson(response, 200, JSON.parse(cached))
            return
          } catch {
            // 缓存正文损坏：忽略，走重新拉取并覆盖写盘
          }
        }
        const r = await fetchViaCurl(target, proxy, 20000)
        if (!r.ok || r.body === '') {
          sendJson(response, 502, { error: 'catalog fetch failed' })
          return
        }
        try {
          sendJson(response, 200, JSON.parse(r.body))
          writeCatalogCache(cacheFile, r.body)
        } catch {
          sendJson(response, 502, { error: 'catalog fetch returned invalid JSON' })
        }
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/install',
      handler: async (request, response) => {
        if (!requireTrustedPost(request, response)) return
        // 任务自动入队：即使已有插件操作在跑也接受请求（FIFO 串行执行），不再 409 拒绝
        try {
          const body = await readJsonBody(request)
          // mode: 'update' = 已安装目标的覆盖更新（放行 add，pnpm 对已存在依赖原位覆盖重装）
          const mode = body !== null && typeof body === 'object' && (body as { mode?: unknown }).mode === 'update'
            ? 'update'
            : 'install'
          // installTargetOf 先把完整 DSH 命令（`dsh plugin [--profile <p>] add <target>`）剥成裸目标，
          // 兼容用户直接粘贴命令行（防输错），真正语法判定交给下面 githubRepoOf / validPackageName。
          const rawRepo = typeof body === 'object' && body !== null && typeof (body as { repo?: unknown }).repo === 'string'
            ? installTargetOf((body as { repo: string }).repo)
            : ''
          // 前端决策的展示用仓库名（owner/repo）：npm 安装时 body.repo 是包名，display 用于
          // 待重启行 / 任务恢复时展示仓库名，保证用户无感知（安装通道变化不改变所见目标）
          const displayRepo = typeof body === 'object' && body !== null && typeof (body as { display?: unknown }).display === 'string'
            ? (body as { display: string }).display.trim()
            : rawRepo
          // 请求来源：目录插件安装（catalog）走目录白名单；命令行安装（custom）按通道受安全开关控制
          const source = typeof body === 'object' && body !== null && typeof (body as { source?: unknown }).source === 'string'
            ? (body as { source: string }).source
            : ''
          // 自定义安装入口渠道（客户端三张卡片：NPM 包 / GitHub 源码 / DSH 命令）：
          // 客户端显式上报，服务端日志/报错据此精准溯源「从哪个入口发起」；目录插件安装不传。
          const installChannel = (() => {
            const raw = body !== null && typeof body === 'object' ? (body as { installChannel?: unknown }).installChannel : undefined
            return raw === 'git' || raw === 'dsh' || raw === 'npm' ? raw : undefined
          })()
          const settings = loadSettings(profile)
          // 界面语言（客户端随请求携带）：错误消息按用户当前语言提示（中文界面给中文，英文界面给英文）
          const lang = typeof body === 'object' && body !== null && (body as { lang?: unknown }).lang === 'en'
            ? 'en'
            : 'zh'
          // 全局 npm 安装（官方 README 的 `npm install -g <pkgs>`，如 dsh-tui 的安装命令）：
          // 直接从命令框输入格式执行全局安装，不进任何 profile、无需宿主重启。
          // 包列表优先取 body.globalNpm（客户端命令框解析后显式携带）；兜底再从 rawRepo 解析，
          // 保证直接调 API 传完整命令也能识别。
          const bodyGlobalNpm = Array.isArray((body as { globalNpm?: unknown }).globalNpm)
            ? (body as { globalNpm: unknown[] }).globalNpm.filter((x): x is string => typeof x === 'string' && x !== '')
            : []
          let globalNpm: string[] = bodyGlobalNpm.length > 0 ? bodyGlobalNpm : (globalNpmPackagesOf(rawRepo) ?? [])
          if (globalNpm.length > 0) {
            // 包名逐个按 npm 包名语法校验 + 拒绝以 - 开头的 token（npm 会把 --xxx 当参数而非包名），数量封顶防滥用
            if (globalNpm.length > 20 || globalNpm.some((p) => !validPackageName(p) || p.startsWith('-'))) {
              sendJson(response, 400, { error: 'unsupported install target' })
              return
            }
            // 通道门禁与安装通道同构：全局安装本质是 npm 操作，吃「启用 NPM 安装」开关
            if (source !== 'catalog' && !settings.enableNpmInstall) {
              sendJson(response, 403, { error: 'npm installs are disabled by the security settings' })
              return
            }
            // 队列级去重：同一包列表已在排队/执行中时拒绝
            const identity = globalNpm.join(' ')
            if (hasQueuedTarget(identity)) {
              sendJson(response, 409, { error: `already queued: ${identity}` })
              return
            }
            const task = startPluginMutation({
              action: 'add',
              profile,
              target: identity,
              displayTarget: identity,
              globalNpm,
              timeoutMs: COMMAND_TIMEOUT_MS,
              env: mutationEnv(settings),
              // 全局 npm 安装由 NPM 包卡片/官方命令发起：日志体现入口渠道
              installChannel: installChannel ?? 'npm',
            })
            sendJson(response, 200, { ok: true, task: task.id })
            return
          }
          // 目标语法两态：GitHub 地址（owner/repo、github:、https/ssh 链接等任意写法）→ 显式
          // HTTPS Git 源（走装前预检）；npm 包名（@scope/name 或 name）→ 信任 registry 直接安装。
          // githubRepoOf 先把各种 GitHub 地址归一成 owner/repo，让「输入地址即装」兼容粘贴完整链接。
          const gitRepo = githubRepoOf(rawRepo)
          const repoTarget = gitRepo !== null ? githubTarget(gitRepo) : null
          let target: string | null = repoTarget ?? (validPackageName(rawRepo) ? rawRepo : null)
          if (target === null) {
            sendJson(response, 400, { error: 'unsupported install target' })
            return
          }
          // npm 优先：git 目标先反查该仓库的官方 npm 包，命中则改走 npm 通道。
          // git 分发常缺构建产物/子模块，npm 包是作者发布的完整产物；未命中或
          // 查询失败保留 github 直装（不阻塞安装，预检仍会拦截缺入口文件的情况）。
          // 通用机制，不针对具体插件。
          // 反查本身计入「已尝试的安装方式」：组织 scope 与 GitHub 用户名不一致时仅凭
          // 仓库名猜不到包名，失败提 Issue 时作者看到我们查过的命令就能直接指认正确包名。
          const attempts: string[] = []
          if (repoTarget !== null) {
            // 反查/记录统一用归一化后的 owner/repo（gitRepo），保证「输入完整链接」也走同一套 npm 反查
            const repoIdentity = gitRepo ?? rawRepo
            const npmName = await resolveNpmPackage(repoIdentity, settings.npmRegistry)
            if (npmName !== null) {
              target = npmName
              attempts.push(`npm registry search: \`npm search repository:${repoIdentity}\` → found \`${npmName}\``)
              // 持久化 repo → npm 包名映射：目录数据未下发 npmPackage（组织 scope 与 GitHub
              // 用户名不一致）时，客户端仍能通过 /installed 的 versions 把依赖 key 匹配回仓库，
              // 列表立即显示「已安装」，避免安装成功后仍显示可安装
              recordResolvedNpmPackage(profile, repoIdentity, npmName)
            } else {
              attempts.push(`npm registry search: \`npm search repository:${repoIdentity}\` → no matching package found (falling back to git install)`)
            }
          }
          // 命令行安装（目录外）按通道门禁：GitHub 源码通道受「启用 GitHub 源码安装」控制，
          // npm 通道受「启用 NPM 安装」控制 —— 目录插件安装走目录白名单，不受开关影响。
          // 通道判定看反查后的最终 target：仍是 git 目标 = 走 GitHub 源码，否则走 npm。
          if (source !== 'catalog') {
            const isGitChannel = repoTarget !== null && target === repoTarget
            if (isGitChannel && !settings.enableGitInstall) {
              sendJson(response, 403, { error: 'git installs are disabled by the security settings' })
              return
            }
            if (!isGitChannel && !settings.enableNpmInstall) {
              sendJson(response, 403, { error: 'npm installs are disabled by the security settings' })
              return
            }
          }
          // 重复安装防护：非更新请求命中已安装目标时直接拒绝，不重复跑 CLI
          // （否则 CLI 会因「已存在」失败，且用户看到的是莫名其妙的报错）；
          // 更新请求（mode: 'update'）放行，CLI 的 add 对已存在依赖是 pnpm 原位覆盖重装。
          // 命中判定双通道：npm 包名按 dependencies 键直接命中，GitHub 目标按仓库身份匹配。
          const installed = readInstalled(profile)
          const already = installedByRepo(installed, target) ?? (installed[target] !== undefined ? target : null)
          if (already !== null && mode !== 'update') {
            sendJson(response, 409, { error: `already installed: ${already}` })
            return
          }
          // 队列级去重：同一目标已在排队/执行中时拒绝，避免客户端防重竞态导致重复入队
          if (hasQueuedTarget(target)) {
            sendJson(response, 409, { error: `already queued: ${target}` })
            return
          }
          // 安装前网络连通性预检：npm 通道探 registry、git 通道探 github.com 连通性。
          // 探测目标固定为通道的稳定入口（registry 根 / github.com 主页），不探具体包或仓库
          // 页 —— 404 表示「目标不存在」而非网络不通，不该被当成网络故障拦截。
          // 仅新安装预检（更新是已信任目标的覆盖重装，跳过）；不通直接 400 拦下并打
          // [network] 标记，客户端据此提示「你的网络不通」，而不是把网络失败当成
          // 插件侧问题引导去作者仓库提 Issue（issue #10：git fetch 超时被误报为插件问题）。
          // 代理口径与诊断一致：设置里的代理 → 系统代理 → 环境变量 → 直连。
          if (already === null) {
            const effectiveProxy = settings.proxy !== ''
              ? settings.proxy
              : (systemProxy() ?? process.env.HTTPS_PROXY ?? process.env.https_proxy ?? '')
            const isGitChannel = repoTarget !== null && target === repoTarget
            const probeTarget = isGitChannel
              ? 'https://github.com/'
              : `${(settings.npmRegistry.replace(/\/+$/, '') || 'https://registry.npmjs.org')}/`
            const net = await probeUrl(probeTarget, effectiveProxy, 6000)
            if (!net.ok) {
              // 错误消息按客户端界面语言提示：中文界面给中文、英文界面给英文，
              // 不再写死英文（用户一眼看懂是网络问题，而不是插件问题）
              const channelName = isGitChannel
                ? (lang === 'zh' ? 'GitHub' : 'github.com')
                : (lang === 'zh' ? 'npm 源' : 'the npm registry')
              const error = lang === 'zh'
                ? `[network] 安装已中止：安装前无法连接到 ${channelName}（${probeTarget}）—— 您的网络似乎不通或被拦截（断网 / DNS 解析失败 / 防火墙 / 代理配置问题）。这不是插件本身的问题，请检查网络连接或代理设置，运行「系统诊断」检测各通道连通性后重试。`
                : `[network] install aborted: cannot reach ${channelName} (${probeTarget}) before install — your network connection appears to be down or blocked (DNS / proxy / firewall). This is not a problem with the plugin itself. Check your connection or proxy settings, run the connectivity diagnostic, then retry.`
              sendJson(response, 400, { error, attempts })
              return
            }
          }
          // 安装前预检：仅新安装走预检（github 源分发改入口文件缺失时直接拦截）。
          // 更新是已信任目标的覆盖重装，跳过预检避免重复下载 tarball。
          // npm 包信任 registry 直接放行；github 源拦截时标记 [packaging] 前缀，
          // 供客户端归类为「插件分发不完整」并引导去仓库提 Issue
          if (already === null) {
            const preflight = await preflightTarget(target)
            if (!preflight.ok) {
              // 预检拦截（git 分发缺入口文件）：同步 400 返回，附上已尝试的安装方式，
              // 客户端失败弹窗提 Issue 时一并贴给作者
              sendJson(response, 400, {
                error: `[packaging] ${target}: plugin distribution is incomplete — the entry file ${preflight.missing ?? '?'} declared in package.json is not present in the git distribution (build output not committed). Report to the author.`,
                attempts,
              })
              return
            }
            // 包名冲突拦截（仅 git 通道）：git 目标包内声明的 name 若与 profile 已装依赖同名，
            // pnpm 会以该 name 做依赖键撞车，抛出的 CLI 报错晦涩难懂（issue #25：sandbase-harness
            // 声明 managed-agents，但该包名在 registry 上被另一仓库占用，npm 反查搜不到 → git 直装
            // 撞已装同名依赖）。到这里已装依赖要么来源不同仓库、要么 spec 是版本号解析不出仓库身份，
            // 都无法归并为同一插件 —— 在入队前转成明确的 409，指导用户先卸载或改装其 npm 包。
            if (preflight.name !== null && repoTarget !== null && target === repoTarget) {
              const declared = preflight.name
              if (installed[declared] !== undefined) {
                attempts.push(`package name conflict: \`${gitRepo}\` declares npm name \`${declared}\`, which is already present in the profile and cannot be matched to this repo (that npm name is likely registered by another repository)`)
                const error = lang === 'zh'
                  ? `already installed: ${declared} —— ${gitRepo} 声明的 npm 包名「${declared}」已存在于当前 profile，且无法匹配到本仓库（该包名在 npm 上可能被其他仓库占用）。请先移除现有的 ${declared}（dsh plugin remove ${declared}），再重新安装；或改装该包名对应的官方 npm 包。`
                  : `already installed: ${declared} — ${gitRepo} declares the npm package name "${declared}", which is already present in the profile and cannot be matched to this repo (that npm name is likely registered by another repository). Remove the existing ${declared} dependency (dsh plugin remove ${declared}) first, then retry; or install the official npm package under that name.`
                sendJson(response, 409, { error, attempts })
                return
              }
            }
          }
          // 入队前复检（与上方检查同语义，但必须在同步块内）：preflight 的 await 期间并发请求
          // 可能已通过上方检查、任务却尚未入队——此处检查与 startPluginMutation 之间无 await，
          // JS 单线程保证同一目标至多一个任务，杜绝双击/并发产生双任务
          if (hasQueuedTarget(target)) {
            sendJson(response, 409, { error: `already queued: ${target}` })
            return
          }
          // Kick off the CLI in the background; the client polls /status for progress
          const task = startPluginMutation({
            // mode=update（已安装目标的覆盖更新）以 update 动作入队：
            // 日志按 update 类别落盘（update.start/done/fail），实际 CLI 执行仍是 add <target>@latest
            action: mode === 'update' ? 'update' : 'add',
            profile,
            target,
            // npm 安装时 target 是包名：displayTarget 固定展示仓库名，待重启行/前端恢复不受通道变化影响
            displayTarget: githubRepoOf(displayRepo) ?? undefined,
            // 已尝试的安装方式（npm 反查）：实际执行命令由 spawn 时追加，失败 issue 一并展示
            attempts,
            timeoutMs: COMMAND_TIMEOUT_MS,
            env: mutationEnv(settings),
            // 覆盖更新：npm 通道命令显式 @latest（pnpm add 无版本对已存在依赖是幂等的，不加版本不会真更新）
            updateNpm: mode === 'update',
            // 自定义安装入口渠道（NPM 包 / GitHub 源码 / DSH 命令卡片）：日志/报错据此溯源
            installChannel,
          })
          sendJson(response, 200, { ok: true, task: task.id })
        } catch (error) {
          sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) })
        }
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/uninstall',
      handler: async (request, response) => {
        if (!requireTrustedPost(request, response)) return
        // 与安装一致：卸载也进入同一队列，FIFO 串行执行
        try {
          const body = await readJsonBody(request)
          const name = typeof body === 'object' && body !== null && typeof (body as { name?: unknown }).name === 'string'
            ? (body as { name: string }).name
            : ''
          // 展示用的 owner/repo：卸载命令只需要 npm 包名，但待重启行要与安装行一致地显示仓库名
          const repo = typeof body === 'object' && body !== null && typeof (body as { repo?: unknown }).repo === 'string'
            ? (body as { repo: string }).repo
            : ''
          if (!validPackageName(name) || name === 'dsh-plugin') {
            sendJson(response, 400, { error: 'plugin cannot be uninstalled here' })
            return
          }
          if (readInstalled(profile)[name] === undefined) {
            sendJson(response, 400, { error: 'plugin is not installed' })
            return
          }
          // 队列级去重：同一包已在排队/执行中卸载时拒绝
          if (hasQueuedTarget(name)) {
            sendJson(response, 409, { error: `already queued: ${name}` })
            return
          }
          const task = startPluginMutation({
            action: 'remove',
            profile,
            target: name,
            // 卸载的 mutation 目标是 npm 包名；待重启行要显示 owner/repo（与安装行一致），非法/缺失时回退包名
            displayTarget: githubRepoOf(repo) ?? undefined,
            // 运行中 loader：卸载成功后主动移除条目，立即生效、无需重启
            uninstallLoader: loader,
            timeoutMs: COMMAND_TIMEOUT_MS,
            env: mutationEnv(loadSettings(profile)),
          })
          sendJson(response, 200, { ok: true, task: task.id })
        } catch (error) {
          sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) })
        }
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/status',
      handler: (request, response) => {
        if (!requireMethod(request, response, 'GET')) return
        const url = new URL(request.url ?? '/', 'http://localhost')
        const id = Number(url.searchParams.get('task'))
        const task = Number.isInteger(id) ? getTask(id) : undefined
        if (!task) {
          sendJson(response, 404, { error: 'task not found' })
          return
        }
        sendJson(response, 200, { task })
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/active',
      handler: (request, response) => {
        if (!requireMethod(request, response, 'GET')) return
        // 整个任务队列（running 在前、pending 在后）+ 待重启列表：客户端刷新后据此恢复
        // 进行中/排队任务与「装完没重启」的持久提醒
        sendJson(response, 200, { tasks: activeTask(), pendingRestarts: listPendingRestarts() })
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/env',
      handler: (request, response) => {
        if (!requireMethod(request, response, 'GET')) return
        // 宿主机器环境快照：提交 bug 的 issue 正文会带上，便于作者复现
        sendJson(response, 200, hostEnv(profile))
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/cancel',
      handler: async (request, response) => {
        if (!requireTrustedPost(request, response)) return
        try {
          const body = await readJsonBody(request)
          const id = typeof body === 'object' && body !== null && typeof (body as { id?: unknown }).id === 'number'
            ? (body as { id: number }).id
            : NaN
          const ok = Number.isInteger(id) && cancelTask(id)
          sendJson(response, 200, { ok })
        } catch (error) {
          sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) })
        }
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/restart',
      handler: (request, response) => {
        if (!requireTrustedPost(request, response)) return
        // 当前宿主监听端口来自请求 Host 头（localhost:7923），解析失败回退 7923
        const host = request.headers.host ?? ''
        const portMatch = host.match(/:(\d+)$/)
        const port = portMatch ? Number(portMatch[1]) : 7923
        // detached 子进程完成「停旧进程 → 等端口释放 → 后台拉起 dsh web」，
        // 即使当前宿主（即本插件所在进程）被 kill，重启仍会继续执行。
        // 不用 /bin/sh：Windows 无此路径，且 lsof/nohup 等仅 POSIX 存在，
        // 故孵化 node(process.execPath) 跑跨平台脚本 —— Windows 用
        // netstat + taskkill + shell:true 解析 dsh.cmd，POSIX 用 lsof + SIGTERM。
        spawn(process.execPath, ['-e', HOST_RESTART_SCRIPT, String(port)], { detached: true, stdio: 'ignore' }).unref()
        sendJson(response, 200, { ok: true, port })
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/installed-version',
      handler: async (request, response) => {
        if (!requireTrustedPost(request, response)) return
        try {
          const body = await readJsonBody(request)
          const repo = typeof body === 'object' && body !== null && typeof (body as { repo?: unknown }).repo === 'string'
            ? (body as { repo: string }).repo
            : ''
          if (githubTarget(repo) === null) {
            sendJson(response, 400, { error: 'invalid install target' })
            return
          }
          // version 为空 = 卸载清理记录；否则记录安装时的目录信号（最新版本 + 仓库更新时间），
          // 供「有更新」比对：有版本比版本，无版本比更新时间
          const version = body !== null && typeof (body as { version?: unknown }).version === 'string'
            ? (body as { version: string }).version
            : null
          if (version === null) {
            removeInstalledVersion(profile, repo)
          } else {
            const updatedAt = body !== null && typeof (body as { updatedAt?: unknown }).updatedAt === 'string'
              ? (body as { updatedAt: string }).updatedAt
              : ''
            recordInstalledVersion(profile, repo, version, updatedAt)
          }
          sendJson(response, 200, { ok: true })
        } catch (error) {
          sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) })
        }
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/open-path',
      handler: async (request, response) => {
        if (!requireTrustedPost(request, response)) return
        // 在系统文件管理器里定位并打开已安装插件目录（详情视图「在文件夹中显示」）。
        // 只接受已安装依赖的包名、服务端自行拼接路径——杜绝任意路径注入
        try {
          const body = await readJsonBody(request)
          const name = typeof body === 'object' && body !== null && typeof (body as { name?: unknown }).name === 'string'
            ? (body as { name: string }).name
            : ''
          if (!validPackageName(name) || readInstalled(profile)[name] === undefined) {
            sendJson(response, 400, { error: 'plugin is not installed' })
            return
          }
          const dir = join(profileDirectory(profile), 'node_modules', name)
          // macOS Finder 用 -R 定位选中；Windows explorer 用 /select,；Linux 打开目录（xdg-open）
          const bin = process.platform === 'darwin' ? 'open'
            : process.platform === 'win32' ? 'explorer'
              : 'xdg-open'
          const args = process.platform === 'darwin' ? ['-R', dir]
            : process.platform === 'win32' ? ['/select,', dir]
              : [dir]
          spawn(bin, args, { detached: true, stdio: 'ignore' }).unref()
          sendJson(response, 200, { ok: true })
        } catch (error) {
          sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) })
        }
      },
    }),
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/installed',
      handler: (request, response) => {
        if (!requireMethod(request, response, 'GET')) return
        // installed：依赖表（包名 → spec）；versions：安装时记录的目录版本（repo → 版本）；
        // paths：每个依赖在系统上的安装目录（profile/node_modules/<包名>），详情视图展示用；
        // loaded：已加载进运行中 loader 的包名（官方 ctx.loader.entries()，未重启装的新插件不在其中）；
        // dshCapable：真正的 dsh 插件（包内声明 dsh 配置 / 在 profile bundles 清单）——
        //   非 dsh 插件（如 GitHub 官方示例仓库）装上也不会被宿主加载，客户端据此不再提示「待重启」。
        // 客户端合并这些判断「是否有更新」「运行状态」并展示安装路径/时间等运行时信息。
        const installed = readInstalled(profile)
        const paths: Record<string, string> = {}
        const loaded: string[] = []
        const dshCapable: string[] = []
        for (const name of Object.keys(installed)) {
          paths[name] = join(profileDirectory(profile), 'node_modules', name)
          if (isEntryLoaded(loader, name)) loaded.push(name)
          if (isDshPlugin(profile, name)) dshCapable.push(name)
        }
        sendJson(response, 200, { profile, installed, versions: readInstalledVersions(profile), paths, loaded, dshCapable })
      },
    }),
  ]
  return () => {
    for (const dispose of disposers) dispose()
  }
}

/** Profile resolution shared with the client route docs. */
export { readProfileArg }
