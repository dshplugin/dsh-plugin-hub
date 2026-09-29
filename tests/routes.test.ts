/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Unit tests for the origin check guarding every POST mutation
 * (src/server/http/routes.ts). This predicate is the whole CSRF defence:
 * the desktop host page runs under the app's own scheme (origin
 * `dsh-app://app`) and always failed the old `url.host === host` test, so
 * the entire install path answered 403 untrusted origin on the Electron
 * build (dsh-plugin-hub#70).
 *
 * Run with the Node built-in test runner: `npm test` (Node >= 22.6 with
 * type stripping). No extra test dependencies required.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { IncomingMessage } from 'node:http'
import { isSameOrigin } from '../src/server/http/routes.ts'

/** Minimal request stand-in: the predicate only reads these two headers. */
function req(headers: { origin?: string; host?: string }): IncomingMessage {
  return { headers } as unknown as IncomingMessage
}

test('isSameOrigin: the desktop host page (dsh-app://) is accepted (issue #70)', () => {
  // 桌面端页面 origin 形如 `dsh-app://app`：自定义协议下 host 为第一个路径段（'app'），
  // 与 Host 头（localhost:3081）必然不等 —— 修复前这里恒返回 false，安装全链路 403
  assert.equal(isSameOrigin(req({ origin: 'dsh-app://app', host: 'localhost:3081' })), true)
  // 放行按协议判定，与具体 host 段无关
  assert.equal(isSameOrigin(req({ origin: 'dsh-app://anything', host: 'localhost:3081' })), true)
})

test('isSameOrigin: local web server origins stay accepted', () => {
  assert.equal(isSameOrigin(req({ origin: 'http://localhost:3081', host: 'localhost:3081' })), true)
  assert.equal(isSameOrigin(req({ origin: 'http://127.0.0.1:3081', host: '127.0.0.1:3081' })), true)
  assert.equal(isSameOrigin(req({ origin: 'http://[::1]:3081', host: '[::1]:3081' })), true)
})

test('isSameOrigin: foreign and mismatched origins are rejected', () => {
  // 外部网页把自己的 Origin 设成 https://evil.example：host 不等 → 拒
  assert.equal(isSameOrigin(req({ origin: 'https://evil.example', host: 'localhost:3081' })), false)
  // 同为 localhost 但端口不同（另一个本机进程）也不放行
  assert.equal(isSameOrigin(req({ origin: 'http://localhost:9999', host: 'localhost:3081' })), false)
  // 非本机主机名：即便 Host 头被改成一致，hostname 不在本地白名单 → 拒
  assert.equal(isSameOrigin(req({ origin: 'http://evil.example:3081', host: 'evil.example:3081' })), false)
})

test('isSameOrigin: missing and malformed headers are rejected', () => {
  assert.equal(isSameOrigin(req({ host: 'localhost:3081' })), false)
  assert.equal(isSameOrigin(req({ origin: 'http://localhost:3081' })), false)
  assert.equal(isSameOrigin(req({ origin: 'null', host: 'localhost:3081' })), false)
  assert.equal(isSameOrigin(req({ origin: 'not a url', host: 'localhost:3081' })), false)
})
