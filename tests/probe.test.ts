/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 连通性探测（probeUrl / systemProxy / Windows 代理解析 / curl TLS 参数）的单元测试。
 *
 * probeUrl 走真实网络（spawn curl，走代理或直连），与 npm-resolve 一样标注
 * skip 策略：默认跳过（本机直连 GitHub/npm 常不通，会等满超时才失败、看着像卡死），
 * 显式设 DSH_HUB_TEST_ONLINE=1 才跑真实网络测试。systemProxy 依赖本机系统代理
 * 设置，只在确实读取到代理时断言格式。curlTlsArgs / curlRevokeFlagUnsupported /
 * tlsRevocationBlocked 是纯函数，离线全覆盖（Windows Schannel 吊销检查加固）。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { curlRevokeFlagUnsupported, curlTlsArgs, gitLsRemote, parseWinProxyServer, probeUrl, systemProxy, tlsRevocationBlocked } from '../src/server/services/probe.ts'

const ONLINE = process.env.DSH_HUB_TEST_ONLINE === '1'

/** 临时改 process.platform 跑一段断言（curlTlsArgs 运行时读取，便于覆盖各平台分支）。 */
function withPlatform(platform: string, fn: () => void): void {
  const original = Object.getOwnPropertyDescriptor(process, 'platform')
  Object.defineProperty(process, 'platform', { value: platform, configurable: true })
  try {
    fn()
  } finally {
    if (original !== undefined) Object.defineProperty(process, 'platform', original)
  }
}

test('curlTlsArgs: 仅 Windows 追加 --ssl-revoke-best-effort（Schannel 吊销检查降级为尽力而为）', () => {
  withPlatform('win32', () => {
    assert.deepEqual(curlTlsArgs(), ['--ssl-revoke-best-effort'])
  })
  // 其它平台后端（SecureTransport / OpenSSL）无强制吊销检查，不加参数，避免 curl 报未知参数
  withPlatform('darwin', () => {
    assert.deepEqual(curlTlsArgs(), [])
  })
  withPlatform('linux', () => {
    assert.deepEqual(curlTlsArgs(), [])
  })
})

test('curlRevokeFlagUnsupported: 只认「退出码 2 + stderr 指向该参数」这一种老 curl 症状', () => {
  const unsupported = 'curl: option --ssl-revoke-best-effort: is unknown'
  assert.equal(curlRevokeFlagUnsupported(2, unsupported), true)
  assert.equal(curlRevokeFlagUnsupported(2, 'curl: option --ssl-revoke-best-effort: is unknown option'), true)
  // 其它退出码 / 与该参数无关的报错：不是「参数不识别」，不应触发去掉参数重跑
  assert.equal(curlRevokeFlagUnsupported(35, unsupported), false)
  assert.equal(curlRevokeFlagUnsupported(2, 'curl: (2) Failed to initialize.'), false)
  assert.equal(curlRevokeFlagUnsupported(null, unsupported), false)
})

test('tlsRevocationBlocked: 认得出 Schannel 取不到吊销信息的握手失败，不误伤其它报错', () => {
  // #7093 里 Windows 用户的原始报错
  assert.equal(
    tlsRevocationBlocked('curl: (35) schannel: next InitializeSecurityContext failed: CRYPT_E_NO_REVOCATION_CHECK (0x80092012)'),
    true,
  )
  assert.equal(tlsRevocationBlocked('schannel: CRYPT_E_REVOCATION_OFFLINE'), true)
  // 普通网络失败 / 其它 TLS 错误不归为吊销检查问题
  assert.equal(tlsRevocationBlocked('curl: (7) Failed to connect to github.com port 443'), false)
  assert.equal(tlsRevocationBlocked('curl: (60) SSL certificate problem: unable to get local issuer certificate'), false)
  assert.equal(tlsRevocationBlocked(''), false)
})

test('parseWinProxyServer: 注册表值带 scheme 时不再把 // 吞进主机名（#66）', () => {
  // reg query 的真实输出形态：首行是键名，值行以若干空格 + 值名 + REG_SZ + 值分隔
  const regOut = (value: string) =>
    `HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\r\n    ProxyServer    REG_SZ    ${value}\r\n\r\n`
  // 此前解析成 http:////127.0.0.1:10793（非法地址，curl 立刻失败）→ 诊断/目录/npm 预检全判不可达
  assert.equal(parseWinProxyServer(regOut('http://127.0.0.1:10793')), 'http://127.0.0.1:10793')
  // 无 scheme 写法与按协议分别配置（http=host:port;https=host:port）都要认
  assert.equal(parseWinProxyServer(regOut('127.0.0.1:10793')), 'http://127.0.0.1:10793')
  assert.equal(parseWinProxyServer(regOut('http=10.0.0.5:8080;https=10.0.0.5:8443')), 'http://10.0.0.5:8080')
  // 取不到 host:port（空输出 / 未设置）：返回 null，调用方按「无系统代理」处理
  assert.equal(parseWinProxyServer(''), null)
  assert.equal(parseWinProxyServer(regOut('')), null)
})

test('probeUrl: 非法 URL 直接不可达，不抛错', async () => {
  const r = await probeUrl('not a url', '', 1000)
  assert.equal(r.ok, false)
  assert.equal(r.ms, null)
})

test('probeUrl: 对不存在的代理走 curl，应归为不可达', async () => {
  const r = await probeUrl('https://registry.npmjs.org/dsh-plugin', 'http://127.0.0.1:1', 1500)
  assert.equal(r.ok, false)
  // 连不上代理 ≠ 证书吊销受阻：不能顺带给 reason，否则诊断会指向错误的排查方向
  assert.equal(r.reason ?? null, null)
})

test('probeUrl: 无代理直连已知站点（本地断网时跳过）', { skip: !ONLINE }, async () => {
  const r = await probeUrl('https://registry.npmjs.org/dsh-plugin', '', 6000)
  assert.equal(r.ok, true)
  assert.equal(r.status, 200)
})

test('gitLsRemote: 对不存在的代理走真实 git 握手，应归为不可达', async () => {
  const r = await gitLsRemote('https://github.com/dshplugin/hello-dsh', 'http://127.0.0.1:1', 1500)
  assert.equal(r.ok, false)
})

test('gitLsRemote: 直连测试仓库返回真实克隆握手（本地断网时跳过）', { skip: !ONLINE }, async () => {
  const r = await gitLsRemote('https://github.com/dshplugin/hello-dsh', '', 8000)
  assert.equal(r.ok, true)
  assert.equal(r.status, 0)
})

test('systemProxy: 读到的代理必须是 http://host:port 形态（读不到时返回 null 也可接受）', () => {
  const p = systemProxy()
  if (p !== null) {
    assert.match(p, /^http:\/\/.+/)
    assert.ok(Number(p.slice(p.lastIndexOf(':') + 1)) > 0)
  }
})
