/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Unit tests for the origin check guarding every POST mutation
 * (src/server/http/routes.ts). This predicate is the whole CSRF defence:
 * it must accept the desktop host page, whose origin is the app's own
 * scheme (`dsh-app://app`) rather than a localhost URL (dsh-plugin-hub#70).
 * Also covers the desktop-host predicate that keeps /restart from killing
 * the host it cannot restart (dsh-plugin-hub#139).
 *
 * Run with the Node built-in test runner: `npm test` (Node >= 22.6 with
 * type stripping). No extra test dependencies required.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { IncomingMessage } from 'node:http'
import { isDesktopHost, isSameOrigin } from '../src/server/http/routes.ts'

/** Minimal request stand-in: the predicate only reads these two headers. */
function req(headers: { origin?: string; host?: string }): IncomingMessage {
  return { headers } as unknown as IncomingMessage
}

test('isSameOrigin: the desktop host page (dsh-app://) is accepted (issue #70)', () => {
  // 桌面端页面 origin 形如 `dsh-app://app`：自定义协议下 host 为第一个路径段（'app'），
  // 与 Host 头（localhost:3081）必然不等，只能按协议放行
  assert.equal(isSameOrigin(req({ origin: 'dsh-app://app', host: 'localhost:3081' })), true)
  // 放行按协议判定，与具体 host 段无关
  assert.equal(isSameOrigin(req({ origin: 'dsh-app://anything', host: 'localhost:3081' })), true)
})

test('isSameOrigin: local web server origins stay accepted', () => {
  assert.equal(isSameOrigin(req({ origin: 'http://localhost:3081', host: 'localhost:3081' })), true)
  assert.equal(isSameOrigin(req({ origin: 'http://127.0.0.1:3081', host: '127.0.0.1:3081' })), true)
  assert.equal(isSameOrigin(req({ origin: 'http://[::1]:3081', host: '[::1]:3081' })), true)
})

test('isSameOrigin: loopback aliases of the same port are one origin (issue #72)', () => {
  // 页面入口 host 与请求 Host 头只要都是回环、端口相同就是同一来源：
  // `localhost` / `127.0.0.1` / `[::1]` 指向同一台机器的同一端口，逐字比较会
  // 把「市场能看能搜、一装就 403」这种组合放进来
  assert.equal(isSameOrigin(req({ origin: 'http://localhost:3081', host: '127.0.0.1:3081' })), true)
  assert.equal(isSameOrigin(req({ origin: 'http://127.0.0.1:3081', host: 'localhost:3081' })), true)
  assert.equal(isSameOrigin(req({ origin: 'http://[::1]:3081', host: '127.0.0.1:3081' })), true)
  assert.equal(isSameOrigin(req({ origin: 'http://LOCALHOST:3081', host: 'localhost:3081' })), true)
})

test('isSameOrigin: foreign and mismatched origins are rejected', () => {
  // 外部网页把自己的 Origin 设成 https://evil.example：host 不等 → 拒
  assert.equal(isSameOrigin(req({ origin: 'https://evil.example', host: 'localhost:3081' })), false)
  // 同为 localhost 但端口不同（另一个本机进程）也不放行
  assert.equal(isSameOrigin(req({ origin: 'http://localhost:9999', host: 'localhost:3081' })), false)
  // 带/不带端口是两个来源（http://localhost 等价于 80 端口）
  assert.equal(isSameOrigin(req({ origin: 'http://localhost', host: 'localhost:3081' })), false)
  // 非本机主机名：即便 Host 头被改成一致，hostname 不在本地白名单 → 拒
  assert.equal(isSameOrigin(req({ origin: 'http://evil.example:3081', host: 'evil.example:3081' })), false)
  // 局域网 IP 不是回环 → 拒（Host 侧同样拒）
  assert.equal(isSameOrigin(req({ origin: 'http://192.168.1.5:3081', host: '192.168.1.5:3081' })), false)
})

test('isSameOrigin: a missing Origin header is accepted only on a loopback Host (issue #72)', () => {
  // 桌面宿主转发 `/dsh-plugin-hub/*` 时可能剥掉 Origin 头：浏览器对 POST 请求必定携带
  // Origin，能省略该头的只有本机原生客户端（它们本来就能伪造任意 Origin）→ 放行
  assert.equal(isSameOrigin(req({ host: '127.0.0.1:3081' })), true)
  assert.equal(isSameOrigin(req({ host: 'localhost:3081', origin: '' })), true)
  // Host 不是回环时，无 Origin 仍然拒绝：局域网访问、DNS rebinding 域名都进不来
  assert.equal(isSameOrigin(req({ host: '192.168.1.5:3081' })), false)
  assert.equal(isSameOrigin(req({ host: 'evil.example:3081' })), false)
})

test('isSameOrigin: malformed headers are rejected', () => {
  assert.equal(isSameOrigin(req({ origin: 'http://localhost:3081' })), false)
  assert.equal(isSameOrigin(req({ origin: 'null', host: 'localhost:3081' })), false)
  assert.equal(isSameOrigin(req({ origin: 'not a url', host: 'localhost:3081' })), false)
})

test('isDesktopHost: only the Electron-managed desktop host counts as desktop (issue #139)', () => {
  // 只有 `ELECTRON_RUN_AS_NODE=1`（壳用 Electron 二进制以 Node 模式跑宿主）算桌面端：
  // 该分支下 /restart 不 kill 宿主，改由客户端提示退出重开
  const saved = process.env.ELECTRON_RUN_AS_NODE
  try {
    delete process.env.ELECTRON_RUN_AS_NODE
    assert.equal(isDesktopHost(), false)
    process.env.ELECTRON_RUN_AS_NODE = '0'
    assert.equal(isDesktopHost(), false)
    process.env.ELECTRON_RUN_AS_NODE = '1'
    assert.equal(isDesktopHost(), true)
  } finally {
    if (saved === undefined) delete process.env.ELECTRON_RUN_AS_NODE
    else process.env.ELECTRON_RUN_AS_NODE = saved
  }
})
