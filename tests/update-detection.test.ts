/**
 * 单测：「有更新」判定只认「目录版本 > 已装版本」，兼容 v 前缀。
 * 目录可能滞后于 npm，直接用 != 会把「已装 1.1.10、目录还写 1.1.8」判成有更新，引导用户降级。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { hasUpdateOf, installedItemsOf } from '../src/client/logic/installed.ts'
import { compareVersions, isUpdateOffered, MIN_RELEASE_AGE_MS, updateDecision } from '../src/client/logic/release-age.ts'
import type { HubPlugin } from '../src/client/types.ts'
import type { InstalledVersionSignal } from '../src/client/logic/installed.ts'

const REPO = 'michengai/dsh-archive-manager'
const PKG = '@michengai/dsh-archive-manager'

function plugin(catalogVersion?: string): HubPlugin {
  return {
    slug: 'dsh-archive-manager',
    source: { repo: REPO, npmPackage: PKG },
    ...(catalogVersion === undefined ? {} : { version: catalogVersion }),
  } as HubPlugin
}

function ledger(version: string): Record<string, InstalledVersionSignal> {
  return { [REPO.toLowerCase()]: { version, updatedAt: '2026-10-24T08:09:57Z' } }
}

// 已装表以 npm 包名为 key（scope 包保留 @scope/ 前缀）
const installed = { [PKG]: PKG }

test('hasUpdateOf: only a newer catalog version counts as an update', () => {
  // 目录落后：已装 1.1.10，目录写 v1.1.8 → 不是更新（否则会把用户引导到降级）
  assert.equal(hasUpdateOf(plugin('v1.1.8'), installed, ledger('1.1.10')), false)
  // v 前缀与无前缀视为同一版本
  assert.equal(hasUpdateOf(plugin('v1.1.10'), installed, ledger('1.1.10')), false)
  // 目录更新 → 有更新
  assert.equal(hasUpdateOf(plugin('v1.1.11'), installed, ledger('1.1.10')), true)
})

test('hasUpdateOf: without a version, the repo update time still drives updates', () => {
  const p = { slug: 'x', source: { repo: REPO, npmPackage: PKG }, dates: { repoUpdatedAt: '2026-10-25T00:00:00Z' } } as HubPlugin
  assert.equal(hasUpdateOf(p, installed, ledger('1.1.10')), true)
  const older = { slug: 'x', source: { repo: REPO, npmPackage: PKG }, dates: { repoUpdatedAt: '2026-10-20T00:00:00Z' } } as HubPlugin
  assert.equal(hasUpdateOf(older, installed, ledger('1.1.10')), false)
})

test('compareVersions: a prerelease ranks below the matching release', () => {
  assert.ok(compareVersions('1.0.0-beta.1', '1.0.0') < 0)
  assert.ok(compareVersions('1.0.0', '1.0.0-beta.1') > 0)
  assert.ok(compareVersions('1.0.0-rc.1', '1.0.0-beta.2') > 0)
  // build metadata 不参与比较；v 前缀仍视为同版本
  assert.equal(compareVersions('1.0.0+build.5', '1.0.0'), 0)
  assert.equal(compareVersions('v1.1.10', '1.1.10'), 0)
})

test('compareVersions: missing values never throw (runtime data can be dirty)', () => {
  assert.doesNotThrow(() => compareVersions(undefined, '1.0.0'))
  assert.doesNotThrow(() => compareVersions('1.0.0', undefined))
  assert.equal(compareVersions(undefined, undefined), 0)
  assert.equal(compareVersions('', ''), 0)
  // 缺值按 0.0.0 处理
  assert.ok(compareVersions(undefined, '1.0.0') < 0)
})

test('hasUpdateOf: a ledger record without a version does not throw', () => {
  // /install 一开始只写 npm 包名映射（版本要等任务结束才知道）：
  // 这种残缺记录曾让整个「插件市场」设置区白屏，必须退化成「无版本信号」
  const partial = { [REPO.toLowerCase()]: { npmPackage: PKG } as unknown as InstalledVersionSignal }
  assert.doesNotThrow(() => hasUpdateOf(plugin('v1.1.11'), installed, partial))
  // 无版本 + 无目录更新时间信号 → 不判为有更新
  assert.equal(hasUpdateOf(plugin('v1.1.11'), installed, partial), false)
  // 有目录更新时间时退回按更新时间判定
  const dated = { ...plugin('v1.1.11'), dates: { repoUpdatedAt: '2026-10-25T00:00:00Z' } } as HubPlugin
  assert.equal(hasUpdateOf(dated, installed, { [REPO.toLowerCase()]: { npmPackage: PKG, updatedAt: '2026-10-24T00:00:00Z' } as unknown as InstalledVersionSignal }), true)
})

test('installedItemsOf: a partial ledger record cannot break the list render', () => {
  // 复现白屏现场：账本里只有 npm 包名映射（安装刚开始就被写入），目录有版本。
  // 这条渲染链路必须完整跑通，任何异常都会被宿主按区块隔离 → 设置区白屏
  const partial = { [REPO.toLowerCase()]: { npmPackage: PKG } as unknown as InstalledVersionSignal }
  const items = installedItemsOf([plugin('v1.1.11')], installed, partial, null, null, null)
  assert.equal(items.length, 1)
  assert.equal(items[0]?.installedVersion, null)
  assert.equal(items[0]?.hasUpdate, false)
})

test('isUpdateOffered: only offer an update npm can actually install', () => {
  const now = Date.parse('2026-10-25T00:00:00Z')
  const matured = new Date(now - MIN_RELEASE_AGE_MS - 60_000).toISOString()
  const fresh = new Date(now - 60_000).toISOString()
  // 目录标到 1.2.0，但 npm 上只有 1.1.0（作者只打了 release 没发 npm）→ 不提示，否则永远点不掉
  assert.equal(isUpdateOffered({ version: '1.1.0', publishedAt: matured }, '1.1.0', now), false)
  // npm 上确实更高且已过门禁 → 提示
  assert.equal(isUpdateOffered({ version: '1.2.0', publishedAt: matured }, '1.1.0', now), true)
  // 发布不满 24h → 暂缓（pnpm 会静默回退，点了也装不上）
  assert.equal(isUpdateOffered({ version: '1.2.0', publishedAt: fresh }, '1.1.0', now), false)
  // 查询失败 / 没有账本记录 → 交回原有判定，不吞掉真实更新
  assert.equal(isUpdateOffered(null, '1.1.0', now), true)
  assert.equal(isUpdateOffered({ version: '1.2.0', publishedAt: matured }, null, now), true)
})

test('updateDecision: 只有门禁命中才给可重试时刻', () => {
  const now = Date.parse('2026-10-25T00:00:00Z')
  const fresh = new Date(now - 60_000).toISOString()
  const matured = new Date(now - MIN_RELEASE_AGE_MS - 60_000).toISOString()
  // 发布不满门禁：不提示，但给出确切可重试时刻（前端据此显示「暂缓到 xx:xx」）
  assert.deepEqual(updateDecision({ version: '1.2.0', publishedAt: fresh }, '1.1.0', now), {
    offered: false,
    pendingUntil: Date.parse(fresh) + MIN_RELEASE_AGE_MS,
  })
  // 已过门禁且确实更高：正常提示
  assert.deepEqual(updateDecision({ version: '1.2.0', publishedAt: matured }, '1.1.0', now), { offered: true, pendingUntil: null })
  // npm 上没有更高版本（作者只打了 release）：拦下但没有可等待的时刻
  assert.deepEqual(updateDecision({ version: '1.1.0', publishedAt: matured }, '1.1.0', now), { offered: false, pendingUntil: null })
  // 查不到发布信息：交回原有判定
  assert.deepEqual(updateDecision(null, '1.1.0', now), { offered: true, pendingUntil: null })
})
