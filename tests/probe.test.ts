/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 连通性探测（probeUrl / systemProxy）的单元测试。
 *
 * probeUrl 走真实网络（spawn curl，走代理或直连），与 npm-resolve 一样标注
 * skip 策略：本地无网络时跳过，CI 可显式关闭。systemProxy 依赖本机系统代理
 * 设置，只在确实读取到代理时断言格式。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { probeUrl, systemProxy } from '../src/server/services/probe.ts'

const ONLINE = process.env.DSH_HUB_TEST_OFFLINE !== '1'

test('probeUrl: 非法 URL 直接不可达，不抛错', async () => {
  const r = await probeUrl('not a url', '', 1000)
  assert.equal(r.ok, false)
  assert.equal(r.ms, null)
})

test('probeUrl: 对不存在的代理走 curl，应归为不可达', async () => {
  const r = await probeUrl('https://registry.npmjs.org/dsh-plugin', 'http://127.0.0.1:1', 1500)
  assert.equal(r.ok, false)
})

test('probeUrl: 无代理直连已知站点（本地断网时跳过）', { skip: !ONLINE }, async () => {
  const r = await probeUrl('https://registry.npmjs.org/dsh-plugin', '', 6000)
  assert.equal(r.ok, true)
  assert.equal(r.status, 200)
})

test('systemProxy: 读到的代理必须是 http://host:port 形态（读不到时返回 null 也可接受）', () => {
  const p = systemProxy()
  if (p !== null) {
    assert.match(p, /^http:\/\/.+/)
    assert.ok(Number(p.slice(p.lastIndexOf(':') + 1)) > 0)
  }
})
