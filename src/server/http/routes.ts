/**
 * Local HTTP routes exposing real installs to the in-app Plugin Hub UI.
 * The client fetches the same-origin `/dsh-plugin-hub/*` endpoints; the
 * install handler validates the target, then spawns the official dsh CLI
 * (see services/install.ts) and reports the captured result back.
 */
import { readFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { spawn } from 'node:child_process'
import { activeTask, cancelTask, getTask, githubTarget, readProfileArg, startPluginMutation, validPackageName } from '../services/install.ts'

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
 */
export function mountPluginHubRoutes(webServer: WebServerService, profile: string): () => void {
  if (!PROFILE_RE.test(profile)) throw new Error(`invalid profile name: ${profile}`)
  const disposers = [
    webServer.register({
      kind: 'exact',
      path: '/dsh-plugin-hub/install',
      handler: async (request, response) => {
        if (!requireTrustedPost(request, response)) return
        // 任务自动入队：即使已有插件操作在跑也接受请求（FIFO 串行执行），不再 409 拒绝
        try {
          const body = await readJsonBody(request)
          const target = githubTarget(typeof body === 'object' && body !== null && typeof (body as { repo?: unknown }).repo === 'string'
            ? (body as { repo: string }).repo
            : '')
          if (target === null) {
            sendJson(response, 400, { error: 'unsupported install target' })
            return
          }
          // 重复安装防护：目标已在该 profile 依赖中时直接拒绝，不重复跑 CLI
          // （否则 CLI 会因「已存在」失败，且用户看到的是莫名其妙的报错）
          const already = installedByRepo(readInstalled(profile), target)
          if (already !== null) {
            sendJson(response, 409, { error: `already installed: ${already}` })
            return
          }
          // Kick off the CLI in the background; the client polls /status for progress
          const task = startPluginMutation({
            action: 'add',
            profile,
            target,
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
          if (!validPackageName(name) || name === 'dsh-plugin') {
            sendJson(response, 400, { error: 'plugin cannot be uninstalled here' })
            return
          }
          if (readInstalled(profile)[name] === undefined) {
            sendJson(response, 400, { error: 'plugin is not installed' })
            return
          }
          const task = startPluginMutation({
            action: 'remove',
            profile,
            target: name,
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
        // 整个任务队列（running 在前、pending 在后）：客户端刷新后据此恢复进行中/排队任务
        sendJson(response, 200, { tasks: activeTask() })
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
      path: '/dsh-plugin-hub/installed',
      handler: (request, response) => {
        if (!requireMethod(request, response, 'GET')) return
        sendJson(response, 200, { profile, installed: readInstalled(profile) })
      },
    }),
  ]
  return () => {
    for (const dispose of disposers) dispose()
  }
}

/** Profile resolution shared with the client route docs. */
export { readProfileArg }
