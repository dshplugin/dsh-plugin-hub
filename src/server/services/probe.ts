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
  /** 失败细分原因：仅当能确认为环境侧 TLS 问题时才有值，普通不可达为 null */
  reason?: ProbeFailReason | null
}

/**
 * 不可达的细分原因。把「证书吊销检查被挡」这类本机环境问题与「网络不通」分开，
 * 诊断列表才能给出对症提示，而不是笼统显示不可达。
 */
export type ProbeFailReason = 'tlsRevocation'

const probeFail = (): ProbeResult => ({ ok: false, ms: null, status: null })

/**
 * Windows 的 curl 走 Schannel 做 TLS：握手阶段强制获取证书吊销信息（CRL/OCSP），
 * 代理受限或吊销服务不可达时整个握手直接失败（CRYPT_E_NO_REVOCATION_CHECK），
 * 表现为 `curl: (35) schannel: next InitializeSecurityContext failed` —— 而 Node/npm/
 * 浏览器各有自己的 TLS 实现，照常可用，用户只会看到「插件市场打不开」。
 * --ssl-revoke-best-effort（curl ≥ 7.70）把吊销检查降级为尽力而为，握手不再被它拦死；
 * 其它平台后端（SecureTransport / OpenSSL）没有这个强制行为，不加参数。
 * 运行时读 process.platform（而非模块级常量），便于测试覆盖两条分支。
 */
export function curlTlsArgs(): string[] {
  return process.platform === 'win32' ? ['--ssl-revoke-best-effort'] : []
}

/** 本机 curl 太老、不认识 --ssl-revoke-best-effort（curl < 7.70）：退出码 2 + stderr 指向该参数。 */
export function curlRevokeFlagUnsupported(code: number | null, stderr: string): boolean {
  return code === 2 && /ssl-revoke-best-effort/i.test(stderr) && /unknown|unrecognized/i.test(stderr)
}

/** stderr 是否指向 Schannel 取不到证书吊销信息（据此归因为环境 TLS 问题，而非网络不通）。 */
export function tlsRevocationBlocked(stderr: string): boolean {
  return /CRYPT_E_NO_REVOCATION_CHECK|CRYPT_E_REVOCATION_OFFLINE|0x80092012/i.test(stderr)
}

/** 探测/安装同一套代理口径：curl 与 git 子进程都读 HTTP(S)_PROXY 环境变量。 */
function proxyEnv(proxy: string): NodeJS.ProcessEnv {
  if (proxy === '') return { ...process.env }
  return {
    ...process.env,
    HTTP_PROXY: proxy,
    HTTPS_PROXY: proxy,
    http_proxy: proxy,
    https_proxy: proxy,
  }
}

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

/** curl 一次调用的原始结果：退出码（进程没起来 / 超时被杀为 null）+ 两路输出。 */
interface CurlRun {
  code: number | null
  stdout: string
  stderr: string
}

/** 跑一次 curl 子进程，收集 stdout 与 stderr（stderr 是识别 Schannel 类 TLS 失败的唯一线索）。 */
function runCurl(args: string[], env: NodeJS.ProcessEnv, timeoutMs: number): Promise<CurlRun> {
  return new Promise((resolve) => {
    let stdout = ''
    let stderr = ''
    let done = false
    const finish = (code: number | null) => {
      if (done) return
      done = true
      clearTimeout(timer)
      resolve({ code, stdout, stderr })
    }
    const child = spawn('curl', args, { env })
    child.stdout.on('data', (c: Buffer) => { stdout += c.toString() })
    child.stderr.on('data', (c: Buffer) => { stderr += c.toString() })
    child.on('error', () => finish(null))
    child.on('close', (code) => finish(code))
    // 超时兜底：curl --max-time 到点自行退出，此处再设一个进程级超时防止悬挂
    const timer = setTimeout(() => { child.kill(); finish(null) }, timeoutMs + 1000)
  })
}

/** 带 TLS 兜底的 curl 调用：先按平台参数跑（Windows 带吊销检查降级），
 *  若本机 curl 不认这个参数（curl < 7.70）则去掉参数重跑一次，保证老版本不因此直接失败。 */
async function curlWithTlsFallback(args: string[], env: NodeJS.ProcessEnv, timeoutMs: number): Promise<CurlRun> {
  const tlsArgs = curlTlsArgs()
  const first = await runCurl([...tlsArgs, ...args], env, timeoutMs)
  if (tlsArgs.length === 0 || !curlRevokeFlagUnsupported(first.code, first.stderr)) return first
  return runCurl(args, env, timeoutMs)
}

/**
 * curl 子进程探测：spawn curl -s -w '%{http_code}' 并注入代理 env。
 * curl 读 HTTP_PROXY/HTTPS_PROXY 是原生行为，与 pnpm/git 安装通道同一套代理口径；
 * 失败（curl 不存在 / 连接失败 / 超时）都归为不可达，全程不抛错。
 * 证书吊销检查受阻（Windows Schannel）另记 reason，供诊断给出对症提示。
 */
async function curlProbe(url: string, proxy: string, timeoutMs: number): Promise<ProbeResult> {
  const started = Date.now()
  const discard = process.platform === 'win32' ? 'NUL' : '/dev/null'
  // -sS（而非仅 -s）：silent 会把连接/TLS 错误一并吞掉，而识别证书吊销受阻正需要 stderr；
  // 子进程 stderr 由我们收集、不会回显给用户，所以补 -S 不产生噪音。
  const r = await curlWithTlsFallback([
    '-sS', '-o', discard, '-w', '%{http_code}',
    '--max-time', String(Math.max(1, Math.round(timeoutMs / 1000))),
    url,
  ], proxyEnv(proxy), timeoutMs)
  // 子进程没起来 / 超时被杀：没有任何可诊断信息，按不可达处理
  if (r.code === null) return probeFail()
  const status = /^\d+$/.test(r.stdout.trim()) ? Number(r.stdout.trim()) : null
  const ok = status !== null && status >= 100 && status < 400
  return {
    ok,
    ms: Date.now() - started,
    status,
    reason: !ok && tlsRevocationBlocked(r.stderr) ? 'tlsRevocation' : null,
  }
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
 * git 通道真实克隆握手探测：spawn git ls-remote（https 传输，与 pnpm 克隆前的
 * ref 握手一致），注入代理 env，GIT_TERMINAL_PROMPT=0 防凭据提示挂起。
 *
 * 为什么要真实 git 而非 curl 打网页：网页「能打开」和 git「能克隆」是两码事 ——
 * 防火墙/代理常按端口与协议区分，HTTP 页可达不代表 git 传输可达。这里测的就是
 * 克隆握手本身，回答「github:owner/repo 装不装得动」。
 * 供系统诊断 GitHub 通道使用；探测目标用 dshplugin/hello-dsh 小仓库（秒级完成，
 * 不打 17MB 的 dsh-plugin-hub 主页）。
 */
export function gitLsRemote(url: string, proxy: string, timeoutMs: number): Promise<ProbeResult> {
  return new Promise((resolve) => {
    const started = Date.now()
    const env: NodeJS.ProcessEnv = { ...proxyEnv(proxy), GIT_TERMINAL_PROMPT: '0' }
    const child = spawn('git', ['ls-remote', '--exit-code', url, 'HEAD'], { env })
    let out = ''
    child.stdout.on('data', (c: Buffer) => { out += c.toString() })
    // git 的报错不透传给终端：结果以退出码 + HEAD ref 是否返回为准
    child.stderr.on('data', () => {})
    let done = false
    const finish = (r: ProbeResult) => {
      if (done) return
      done = true
      clearTimeout(timer)
      resolve(r)
    }
    child.on('error', () => finish(probeFail()))
    child.on('close', (code) => {
      const ok = code === 0 && out.trim() !== ''
      // status 复用为 git 退出码（0 = 克隆握手成功）；客户端 git 行不把它显示成 HTTP 码
      finish({ ok, ms: Date.now() - started, status: code })
    })
    // 超时兜底：与 curlProbe 同口径，防止 git 挂起
    const timer = setTimeout(() => { child.kill(); finish(probeFail()) }, timeoutMs + 1000)
  })
}

/**
 * curl 子进程抓取响应体（与 probeUrl 同一套代理 env 注入与 TLS 参数兜底）。
 * 供服务端 /catalog 代理路由使用：目录/统计数据经此拉到服务端再转给浏览器，
 * 使「目录数据请求走设置里的代理」与 npm / git 安装通道口径一致。
 * 失败（curl 不存在 / 连接失败 / 超时 / 非零退出）时 ok=false，全程不抛错；
 * reason 区分「证书吊销受阻」这类环境 TLS 问题，供调用方决定兜底策略。
 */
export function fetchViaCurl(
  url: string, proxy: string, timeoutMs: number,
): Promise<{ ok: boolean; body: string; reason: ProbeFailReason | null }> {
  // 同样用 -sS：正文之外还要 stderr 里的 TLS 失败线索（被 stderr 收集，不外泄给用户）
  const args = ['-sS', '--max-time', String(Math.max(1, Math.round(timeoutMs / 1000))), url]
  return curlWithTlsFallback(args, proxyEnv(proxy), timeoutMs).then((r) => ({
    ok: r.code === 0,
    body: r.stdout,
    reason: r.code !== 0 && tlsRevocationBlocked(r.stderr) ? 'tlsRevocation' : null,
  }))
}
