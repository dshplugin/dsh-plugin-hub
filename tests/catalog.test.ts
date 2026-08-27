/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Unit tests for the catalog normalizer (src/client/logic/normalize.ts), focusing
 * on the short-key payload from dsh-plugin.org/api/plugins.{lang}.json — in
 * particular the `vr` version key added for update detection.
 *
 * Run with the Node built-in test runner: `npm test` (Node >= 22.6 with
 * type stripping). No extra test dependencies required.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { installCommandOf, repoFromInstallTarget } from '../src/client/logic/install-command.ts'
import { normalize } from '../src/client/logic/normalize.ts'
import { pluginIssueUrl } from '../src/client/logic/urls.ts'

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
  const url = pluginIssueUrl('ccch1mneyyy/dsh-tui', 'prepare failed', null, 'dsh plugin --profile web add git+https://github.com/ccch1mneyyy/dsh-tui.git', attempts)
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

test('pluginIssueUrl: 标题点明错误原因，不再用 Install/Remove 动作词', () => {
  // 网络失败 → 标题带 network 原因
  const netUrl = pluginIssueUrl('adoresever/graph-memory', '[ERR_PNPM_GIT_FETCH_FAILED] Failed to connect to github.com port 443 after 21027 ms: Timed out')
  const netTitle = decodeURIComponent(netUrl.split('title=')[1].split('&')[0])
  assert.match(netTitle, /\[dsh-plugin\.org \| dsh-plugin-hub\] network failure on the user side: adoresever\/graph-memory/)
  assert.ok(!netTitle.includes('Install/Remove'))
  // 构建白名单拦截 → 标题带 build scripts blocked 原因
  const buildUrl = pluginIssueUrl('adoresever/graph-memory', '[ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED] needs to execute build scripts but is not in the "allowBuilds" allowlist')
  const buildTitle = decodeURIComponent(buildUrl.split('title=')[1].split('&')[0])
  assert.match(buildTitle, /build scripts blocked by pnpm allowlist: adoresever\/graph-memory/)
})

test('installCommandOf: GitHub source uses an explicit HTTPS URL', () => {
  const p = normalize({ s: 'aegis', n: 'Aegis', r: 'ganyuanran/aegis' })
  assert.equal(installCommandOf(p), 'dsh plugin add git+https://github.com/ganyuanran/aegis.git')
  assert.equal(installCommandOf(p, true), 'dsh plugin --profile web add git+https://github.com/ganyuanran/aegis.git')
})

test('repoFromInstallTarget: keeps catalog identity across Git target formats', () => {
  for (const value of [
    'ganyuanran/aegis',
    'github:ganyuanran/aegis',
    'git+https://github.com/ganyuanran/aegis.git',
    'git+ssh://github.com/ganyuanran/aegis.git',
  ]) {
    assert.equal(repoFromInstallTarget(value), 'ganyuanran/aegis')
  }
})
