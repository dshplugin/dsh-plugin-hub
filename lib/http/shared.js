/**
 * 跨平台宿主重启脚本（以 `node -e` 运行，独立于宿主进程）。
 * 不用 `/bin/sh -c`：Windows 无 /bin/sh，且 lsof/nohup 仅 POSIX 存在。
 * 由 `spawn(runtimeExecPath(), ['-e', SCRIPT, port], { detached, stdio:'ignore' })` 孵化，
 * 宿主进程被 kill 后仍能完成「停旧 → 等端口释放 → 拉起新 dsh web」。
 * 端口探测不到监听进程时不再假装重启（记一行日志后退出，见脚本内注释）。
 */
export const HOST_RESTART_SCRIPT = String.raw `const C = require('node:child_process')
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

const targets = findPids()
// 一个监听进程都没找到 = 端口探测本身就失败了（netstat 输出格式 / 本地化差异），
// 旧宿主仍占着端口。此时再拉一个 dsh web 只会在日志里以 EADDRINUSE 无提示地退出，
// 用户却看到「重启完成」——不制造这种假象，留一行可诊断的记录后退出。
if (targets.length === 0) {
  logLine('restart aborted: no listener found on port ' + port)
  process.exit(0)
}

for (const pid of targets) {
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

function logLine(msg) {
  try {
    const dir = P.join(O.homedir(), '.dsh', 'logs')
    F.mkdirSync(dir, { recursive: true })
    F.appendFileSync(P.join(dir, 'dsh-web-' + port + '.log'), '[' + new Date().toISOString() + '] ' + msg + '\n')
  } catch {}
}

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
}`;
/**
 * 宿主是否由桌面应用壳托管（`ELECTRON_RUN_AS_NODE=1`：壳用 Electron 二进制以 Node 模式跑宿主）。
 * 桌面端的宿主归应用壳管，插件重启不了它，也不该去 kill —— 详见 /restart 路由。
 */
export function isDesktopHost() {
    return process.env.ELECTRON_RUN_AS_NODE === '1';
}
export const PROFILE_RE = /^[A-Za-z0-9_-]+$/;
const BODY_LIMIT_BYTES = 4 * 1024;
export const COMMAND_TIMEOUT_MS = 5 * 60 * 1000;
/** 目录/统计数据代理的本地缓存时长：1 小时内重复打开插件市场直接读盘，
 *  不重复走 curl 拉远程 —— 重启宿主后首次打开同样秒开（缓存跨重启存活）。 */
export const CATALOG_CACHE_TTL_MS = 60 * 60 * 1000;
export function sendJson(response, status, value) {
    response.writeHead(status, {
        'cache-control': 'no-store',
        'content-type': 'application/json; charset=utf-8',
    });
    response.end(JSON.stringify(value));
}
/** 本机回环主机名：`localhost` / `127.0.0.1` / `[::1]` 指向同一台机器的同一个端口，
 *  字符串不同但同源，必须按同一来源比较。 */
const LOOPBACK_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);
/** 把 `host[:port]` 形式的 authority 归一化成 `loopback:端口` —— 三个回环别名
 *  映射成同一个身份，端口缺省按 http 的 80 补齐；非回环主机名、以及解析不出来的值
 *  都返回 null。 */
function loopbackAuthority(authority) {
    try {
        const parsed = new URL(`http://${authority}`);
        if (!LOOPBACK_HOSTNAMES.has(parsed.hostname.toLowerCase()))
            return null;
        return `loopback:${parsed.port === '' ? '80' : parsed.port}`;
    }
    catch {
        return null;
    }
}
/** POST 变更只接受来自本地 web server 来源或桌面宿主页面。转出供测试（tests/routes.test.ts）使用 ——
 *  来源校验就是全部的 CSRF 防御。 */
export function isSameOrigin(request) {
    // 服务只绑定本机回环地址：Host 不是回环（局域网 IP、被改写的域名）一律拒绝，
    // 顺带挡掉 DNS rebinding（Host 是攻击者域名，即便解析到 127.0.0.1）。
    const host = request.headers.host;
    const hostKey = host === undefined ? null : loopbackAuthority(host);
    if (hostKey === null)
        return false;
    const origin = request.headers.origin;
    // 桌面端宿主把 `/dsh-plugin-hub/*` 转发给本地 http server 时可能不带 Origin 头，
    // 此时所有 POST 都会被判成 untrusted origin。浏览器对 POST 请求
    // 必定携带 Origin（含同源 POST 与跨站表单），能省略该头的只有本机原生客户端，
    // 而它们本来就能伪造任意 Origin，因此放行不扩大 CSRF 面。
    if (origin === undefined || origin === '')
        return true;
    try {
        const url = new URL(origin);
        // 桌面端（Electron 宿主）的页面跑在宿主自定义协议下，origin 形如 `dsh-app://app`，
        // 与 Host（如 localhost:3081）必然不等，因此必须显式放行该协议，否则桌面端全部 POST
        // 都会被判成 untrusted origin。该协议只有宿主自身能产生，外部网页无法把 Origin
        // 伪造成 `dsh-app://…`，放行不扩大 CSRF 面。
        if (url.protocol === 'dsh-app:')
            return true;
        // 按归一化后的「主机名:端口」比较：`localhost` / `127.0.0.1` / `[::1]` 不再互相拒绝，
        // 端口仍然必须一致（另一个本机进程不能被当成同一来源）。
        return loopbackAuthority(url.host) === hostKey;
    }
    catch {
        return false;
    }
}
export function requireMethod(request, response, method) {
    if (request.method === method)
        return true;
    response.writeHead(405, { allow: method });
    response.end();
    return false;
}
export function requireTrustedPost(request, response) {
    if (!requireMethod(request, response, 'POST'))
        return false;
    if (isSameOrigin(request))
        return true;
    sendJson(response, 403, { error: 'untrusted origin' });
    return false;
}
export async function readJsonBody(request) {
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        size += buffer.length;
        if (size > BODY_LIMIT_BYTES)
            throw new Error('request body too large');
        chunks.push(buffer);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
