/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 连通性探测：对单个 HTTPS 目标发 GET，测速并返回 HTTP 状态码。
 *
 * 实现方式：spawn 系统 curl 子进程并注入代理环境变量（HTTP_PROXY/HTTPS_PROXY），
 * 与安装通道（pnpm/git 子进程）使用同一套代理环境。
 *
 * 代理来源由调用方决定（routes.ts）：设置里的代理 → 系统代理 → 环境变量 → 直连。
 * systemProxy() 读取操作系统级代理（macOS scutil / Windows 注册表），
 * 使系统代理对 Node 进程可见。
 */
import { spawn, spawnSync } from 'node:child_process'

export interface ProbeResult {
  /** 是否可达（HTTP 状态码 100–399） */
  ok: boolean
  /** 毫秒耗时；失败为 null */
  ms: number | null
  /** HTTP 状态码；失败为 null */
  status: number | null
}

const probeFail = (): ProbeResult => ({ ok: false, ms: null, status: null })

/** macOS 系统代理：scutil --proxy 输出里的 HTTP(S) 代理；未开启返回 null。 */
function macSystemProxy(): string | null {
  try {
    const out = spawnSync('scutil', ['--proxy'], { encoding: 'utf8', timeout: 1500 })
    if (out.status !== 0) return null
    const txt = out.stdout ?? ''
    const val = (key: string): string | undefined => {
      const m = new RegExp(`^\\s*${key}\\s*:\\s*(.+)$`, 'm').exec(txt)
      const v = m?.[1]?.trim()
      return v !== undefined && v !== '' ? v : undefined
    }
    const enabled = (val('HTTPSEnable') ?? val('HTTPEnable')) === '1'
    const host = val('HTTPSProxy') ?? val('HTTPProxy')
    if (!enabled || host === undefined) return null
    const port = val('HTTPSPort') ?? val('HTTPPort') ?? '80'
    if (!/^\d+$/.test(port)) return null
    return `http://${host}:${port}`
  } catch {
    return null
  }
}

/** Windows 系统代理：WinINET Internet 设置注册表；未开启返回 null。 */
function winSystemProxy(): string | null {
  try {
    const key = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings'
    const enable = spawnSync('reg', ['query', key, '/v', 'ProxyEnable'], { encoding: 'utf8', timeout: 1500 })
    const server = spawnSync('reg', ['query', key, '/v', 'ProxyServer'], { encoding: 'utf8', timeout: 1500 })
    if (!/0x1/i.test(enable.stdout ?? '')) return null
    const m = /([^:\s=]+):(\d+)/.exec(server.stdout ?? '')
    if (m === null) return null
    return `http://${m[1]}:${m[2]}`
  } catch {
    return null
  }
}

/**
 * 操作系统级代理（macOS 系统网络设置 / Windows Internet 设置）。
 * Node 内置 http(s) 不读系统代理，浏览器挂的代理 Node 看不见 —— 这里读出来
 * 作为默认代理，保证「浏览器能开、安装/诊断就能通」。
 * Linux 没有统一的系统代理入口，返回 null（交给环境变量 / 设置里的代理）。
 */
export function systemProxy(): string | null {
  if (process.platform === 'darwin') return macSystemProxy()
  if (process.platform === 'win32') return winSystemProxy()
  return null
}

/**
 * curl 子进程探测：spawn curl -s -w '%{http_code}' 并注入代理 env。
 * curl 读 HTTP_PROXY/HTTPS_PROXY 是原生行为，与 pnpm/git 安装通道同一套代理口径；
 * 失败（curl 不存在 / 连接失败 / 超时）都归为不可达，全程不抛错。
 */
function curlProbe(url: string, proxy: string, timeoutMs: number): Promise<ProbeResult> {
  return new Promise((resolve) => {
    const started = Date.now()
    const env: NodeJS.ProcessEnv = { ...process.env }
    if (proxy !== '') {
      env.HTTP_PROXY = proxy
      env.HTTPS_PROXY = proxy
      env.http_proxy = proxy
      env.https_proxy = proxy
    }
    const discard = process.platform === 'win32' ? 'NUL' : '/dev/null'
    const child = spawn('curl', [
      '-s', '-o', discard, '-w', '%{http_code}',
      '--max-time', String(Math.max(1, Math.round(timeoutMs / 1000))),
      url,
    ], { env })
    let code = ''
    child.stdout.on('data', (c: Buffer) => { code += c.toString() })
    let done = false
    const finish = (r: ProbeResult) => {
      if (done) return
      done = true
      clearTimeout(timer)
      resolve(r)
    }
    child.on('error', () => finish(probeFail()))
    child.on('close', () => {
      const status = /^\d+$/.test(code.trim()) ? Number(code.trim()) : null
      finish({ ok: status !== null && status >= 100 && status < 400, ms: Date.now() - started, status })
    })
    // 超时兜底：curl --max-time 到点自行退出，此处再设一个进程级超时防止悬挂
    const timer = setTimeout(() => { child.kill(); finish(probeFail()) }, timeoutMs + 1000)
  })
}

/**
 * 探测一个 HTTPS 目标：proxy 非空注入给 curl 子进程走代理，否则直连。
 * 供系统诊断 /diagnostics 使用；目标 URL 非法返回不可达。
 */
export function probeUrl(url: string, proxy: string, timeoutMs: number): Promise<ProbeResult> {
  let target: URL
  try { target = new URL(url) } catch { return Promise.resolve(probeFail()) }
  return curlProbe(target.href, proxy, timeoutMs)
}

/**
 * curl 子进程抓取响应体（与 probeUrl 同一套代理 env 注入）。
 * 供服务端 /catalog 代理路由使用：目录/统计数据经此拉到服务端再转给浏览器，
 * 使「目录数据请求走设置里的代理」与 npm / git 安装通道口径一致。
 * 失败（curl 不存在 / 连接失败 / 超时 / 非零退出）时 ok=false，全程不抛错。
 */
export function fetchViaCurl(url: string, proxy: string, timeoutMs: number): Promise<{ ok: boolean; body: string }> {
  return new Promise((resolve) => {
    const env: NodeJS.ProcessEnv = { ...process.env }
    if (proxy !== '') {
      env.HTTP_PROXY = proxy
      env.HTTPS_PROXY = proxy
      env.http_proxy = proxy
      env.https_proxy = proxy
    }
    const child = spawn('curl', ['-s', '--max-time', String(Math.max(1, Math.round(timeoutMs / 1000))), url], { env })
    let body = ''
    child.stdout.on('data', (c: Buffer) => { body += c.toString() })
    let done = false
    const finish = (ok: boolean) => {
      if (done) return
      done = true
      clearTimeout(timer)
      resolve({ ok, body })
    }
    child.on('error', () => finish(false))
    child.on('close', (code) => finish(code === 0))
    // 超时兜底：curl --max-time 到点自行退出，此处再设一个进程级超时防止悬挂
    const timer = setTimeout(() => { child.kill(); finish(false) }, timeoutMs + 1000)
  })
}
