/**
 * Unit tests for the catalog normalizer (src/client/lib/catalog.ts), focusing
 * on the short-key payload from dsh-plugin.org/api/plugins.{lang}.json — in
 * particular the `vr` version key added for update detection.
 *
 * Run with the Node built-in test runner: `npm test` (Node >= 22.6 with
 * type stripping). No extra test dependencies required.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalize, pluginIssueUrl } from '../src/client/lib/catalog.ts'

test('normalize: parses the vr short key into version', () => {
  const p = normalize({
    s: 'widget',
    o: 'acme',
    n: 'Widget',
    vr: 'v3.22.1',
    c: 'tools',
    v: 'verified',
    u: '2026-08-20T20:05:55Z',
  } as Record<string, unknown>)
  assert.equal(p.version, 'v3.22.1')
  assert.equal(p.slug, 'widget')
  assert.equal(p.category, 'tools')
  assert.equal(p.compatibility?.status, 'verified')
  assert.equal(p.dates?.repoUpdatedAt, '2026-08-20T20:05:55Z')
})

test('normalize: missing vr leaves version undefined', () => {
  const p = normalize({ s: 'x', n: 'X', c: 'tools' } as Record<string, unknown>)
  assert.equal(p.version, undefined)
  assert.equal(p.slug, 'x')
})

test('pluginIssueUrl: 把尝试过的安装方式（npm 反查 + 实际执行命令）贴进 issue 正文', () => {
  const attempts = [
    'npm registry search: `npm search repository:ccch1mneyyy/dsh-tui` → found `@deepseek-harness-tui/dsh-tui`',
    'dsh plugin --profile web add @deepseek-harness-tui/dsh-tui',
  ]
  const url = pluginIssueUrl('ccch1mneyyy/dsh-tui', 'prepare failed', null, 'dsh plugin --profile web add github:ccch1mneyyy/dsh-tui', attempts)
  const body = decodeURIComponent(url.split('body=')[1])
  assert.match(body, /## Attempted install channels/)
  // 每条尝试都以 markdown 列表项出现在正文里（保留反引号）：作者据此反推正确的 npm 包名
  for (const a of attempts) assert.ok(body.includes(`- ${a}`))
})

test('pluginIssueUrl: 无尝试记录时正文不含该段落', () => {
  const url = pluginIssueUrl('owner/repo', 'error xyz')
  const body = decodeURIComponent(url.split('body=')[1])
  assert.ok(!body.includes('Attempted install channels'))
})
