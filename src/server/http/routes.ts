/**
 * Local HTTP routes exposing real installs to the in-app Plugin Hub UI.
 * The client fetches the same-origin `/dsh-plugin-hub/*` endpoints; the
 * install handler validates the target, then spawns the official dsh CLI
 * (see services/install.ts) and reports the captured result back.
 */
import { readFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { homedir, release } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { activeTask, cancelTask, dumpLoaderEntries, getTask, githubTarget, hasQueuedTarget, listPendingRestarts, readProfileArg, startPluginMutation, validPackageName, type LoaderHandle } from '../services/install.ts'
import { recordInstalledVersion, recordResolvedNpmPackage, readInstalledVersions, removeInstalledVersion } from '../services/installed-versions.ts'
import { resolveNpmPackage } from '../services/npm-resolve.ts'
import { preflightTarget } from '../services/preflight.ts'

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

/** 宿主 dsh CLI 版本：从入口（process.argv[1]）向上找最近的 dsh/harness 相关 package.json；找不到返回 null。 */
function hostDshVersion(): string | null {
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

/** 宿主环境快照：提交 bug 时随 issue 附上，便于作者复现（前端 /env 端点返回）。 */
function hostEnv(profile: string): Record<string, string | null> {
  return {
    dshVersion: hostDshVersion(),
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    release: release(),
    profile,
    dshHome: process.env.DSH_HOME ?? join(homedir(), '.dsh'),
  }
}

/** Match an install target (`github:<owner>/<repo>`) against the installed table; returns the package name when already installed. */
function installedByRepo(installed: Record<string, string>, target: string): string | null {
  const needle = target.toLowerCase()
  for (const [name, spec] of Object.entries(installed)) {
    if (spec.toLowerCase().includes(needle)) return name
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
          const rawRepo = typeof body === 'object' && body !== null && typeof (body as { repo?: unknown }).repo === 'string'
            ? (body as { repo: string }).repo.trim()
            : ''
          // 前端决策的展示用仓库名（owner/repo）：npm 安装时 body.repo 是包名，display 用于
          // 待重启行 / 任务恢复时展示仓库名，保证用户无感知（安装通道变化不改变所见目标）
          const displayRepo = typeof body === 'object' && body !== null && typeof (body as { display?: unknown }).display === 'string'
            ? (body as { display: string }).display.trim()
            : rawRepo
          // 目标语法两态：owner/repo → github 源（走装前预检）；npm 包名（@scope/name 或 name）→ 信任 registry 直接安装
          const repoTarget = githubTarget(rawRepo)
          let target: string | null = repoTarget ?? (repoTarget === null && validPackageName(rawRepo) ? rawRepo : null)
          if (target === null) {
            sendJson(response, 400, { error: 'unsupported install target' })
            return
          }
          // npm 优先：git 目标先反查该仓库的官方 npm 包，命中则改走 npm 通道。
          // git 分发常缺构建产物/子模块导致 prepare 必败，而 npm 包是作者发布的
          // 完整产物，成功率高得多；未命中或查询失败保留 github 直装（不阻塞安装，
          // 预检仍会兜底拦截 git 分发缺入口文件的情况）。通用机制，不针对具体插件。
          // 反查本身计入「已尝试的安装方式」：组织 scope 与 GitHub 用户名不一致时仅凭
          // 仓库名猜不到包名，失败提 Issue 时作者看到我们查过的命令就能直接指认正确包名。
          const attempts: string[] = []
          if (repoTarget !== null) {
            const npmName = await resolveNpmPackage(rawRepo)
            if (npmName !== null) {
              target = npmName
              attempts.push(`npm registry search: \`npm search repository:${rawRepo}\` → found \`${npmName}\``)
              // 持久化 repo → npm 包名映射：目录数据未下发 npmPackage（组织 scope 与 GitHub
              // 用户名不一致）时，客户端仍能通过 /installed 的 versions 把依赖 key 匹配回仓库，
              // 列表立即显示「已安装」，避免安装成功后仍显示可安装
              recordResolvedNpmPackage(profile, rawRepo, npmName)
            } else {
              attempts.push(`npm registry search: \`npm search repository:${rawRepo}\` → no matching package found (falling back to git install)`)
            }
          }
          // 重复安装防护：非更新请求命中已安装目标时直接拒绝，不重复跑 CLI
          // （否则 CLI 会因「已存在」失败，且用户看到的是莫名其妙的报错）；
          // 更新请求（mode: 'update'）放行，CLI 的 add 对已存在依赖是 pnpm 原位覆盖重装。
          // 命中判定双通道：npm 包名按 dependencies 键直接命中，github: 目标按 spec 值匹配。
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
            action: 'add',
            profile,
            target,
            // npm 安装时 target 是包名：displayTarget 固定展示仓库名，待重启行/前端恢复不受通道变化影响
            displayTarget: githubTarget(displayRepo) ?? undefined,
            // 已尝试的安装方式（npm 反查）：实际执行命令由 spawn 时追加，失败 issue 一并展示
            attempts,
            timeoutMs: COMMAND_TIMEOUT_MS,
            env: { ...process.env, CI: 'true' },
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
            displayTarget: githubTarget(repo) ?? undefined,
            // 运行中 loader：卸载成功后主动移除条目，立即生效、无需重启
            uninstallLoader: loader,
            timeoutMs: COMMAND_TIMEOUT_MS,
            env: { ...process.env, CI: 'true' },
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
        // detached 子 shell 完成「停旧进程 → 等端口释放 → 后台拉起 dsh web」，
        // 即使当前宿主（即本插件所在进程）被 kill，重启仍会继续执行
        const script = [
          `pids=$(lsof -ti tcp:${port} -sTCP:LISTEN 2>/dev/null)`,
          '[ -n "$pids" ] && kill -TERM $pids 2>/dev/null || true',
          `i=0; while [ -n "$(lsof -ti tcp:${port} -sTCP:LISTEN 2>/dev/null)" ] && [ $i -lt 20 ]; do sleep 0.25; i=$((i + 1)); done`,
          'mkdir -p "$HOME/.dsh/logs"',
          `nohup dsh web --port ${port} >>"$HOME/.dsh/logs/dsh-web-${port}.log" 2>&1 &`,
        ].join('\n')
        spawn('/bin/sh', ['-c', script], { detached: true, stdio: 'ignore' }).unref()
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
      path: '/dsh-plugin-hub/installed',
      handler: (request, response) => {
        if (!requireMethod(request, response, 'GET')) return
        // installed：依赖表（包名 → spec）；versions：安装时记录的目录版本（repo → 版本），
        // 客户端合并两者判断「是否有更新」
        sendJson(response, 200, { profile, installed: readInstalled(profile), versions: readInstalledVersions(profile) })
      },
    }),
  ]
  return () => {
    for (const dispose of disposers) dispose()
  }
}

/** Profile resolution shared with the client route docs. */
export { readProfileArg }
