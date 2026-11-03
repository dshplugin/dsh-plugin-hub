/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * npm-release-age 纯函数单测：packument → 版本/发布时间，以及请求体校验。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MAX_RELEASE_AGE_PACKAGES, latestReleaseOf, installableReleaseOf, parseReleaseAgeRequest } from '../src/server/services/npm-release-age.ts'

test('latestReleaseOf: 取 dist-tags.latest 对应版本与 time 中的发布时间', () => {
  assert.deepEqual(latestReleaseOf({
    'dist-tags': { latest: '1.2.3', next: '2.0.0-beta.1' },
    time: { '1.2.3': '2026-09-01T00:00:00.000Z', '2.0.0-beta.1': '2026-09-10T00:00:00.000Z' },
  }), { version: '1.2.3', publishedAt: '2026-09-01T00:00:00.000Z' })
})

test('latestReleaseOf: 缺版本、缺发布时间或输入非法一律返回 null', () => {
  assert.equal(latestReleaseOf(null), null)
  assert.equal(latestReleaseOf('not-an-object'), null)
  assert.equal(latestReleaseOf({}), null)
  // 有 dist-tags.latest 但 time 里没有该版本 → 判不了，返回 null
  assert.equal(latestReleaseOf({ 'dist-tags': { latest: '1.0.0' }, time: {} }), null)
  // latest 必须是字符串
  assert.equal(latestReleaseOf({ 'dist-tags': { latest: 1 }, time: { 1: '2026-09-01T00:00:00.000Z' } }), null)
})

test('installableReleaseOf: 取已过冷却期的最高稳定版，排除冷却期内与预发布版', () => {
  const now = Date.parse('2026-10-01T00:00:00.000Z')
  const packument = {
    time: {
      created: '2026-08-01T00:00:00.000Z',
      '0.1.0': '2026-08-01T00:00:00.000Z',
      '0.4.1': '2026-09-20T00:00:00.000Z',
      // 发布未满 24.5h → 落在冷却期内，不能锁定
      '0.4.5': '2026-09-30T20:00:00.000Z',
      // 预发布版不参与：冷却期回退到 beta 会把用户带到不兼容版本
      '0.5.0-beta.1': '2026-08-01T00:00:00.000Z',
      modified: '2026-09-30T20:00:00.000Z',
    },
  }
  assert.deepEqual(installableReleaseOf(packument, now), {
    version: '0.4.1',
    publishedAt: '2026-09-20T00:00:00.000Z',
  })
})

test('installableReleaseOf: 无满足项 / 缺时间表 / 输入非法一律返回 null', () => {
  const now = Date.parse('2026-10-01T00:00:00.000Z')
  // 全部在冷却期内
  assert.equal(installableReleaseOf({ time: { '1.0.0': '2026-09-30T20:00:00.000Z' } }, now), null)
  // 只有预发布版
  assert.equal(installableReleaseOf({ time: { '1.0.0-beta.1': '2026-08-01T00:00:00.000Z' } }, now), null)
  assert.equal(installableReleaseOf({}, now), null)
  assert.equal(installableReleaseOf({ time: 'x' }, now), null)
  assert.equal(installableReleaseOf(null, now), null)
})

test('parseReleaseAgeRequest: 接受合法包名并去重', () => {
  assert.deepEqual(parseReleaseAgeRequest({ packages: ['dsh-plugin', '@scope/pkg', 'dsh-plugin'] }), ['dsh-plugin', '@scope/pkg'])
  assert.deepEqual(parseReleaseAgeRequest({ packages: [] }), [])
})

test('parseReleaseAgeRequest: 非数组 / 超量 / 非法包名一律拒绝', () => {
  assert.equal(parseReleaseAgeRequest(null), null)
  assert.equal(parseReleaseAgeRequest({ packages: 'dsh-plugin' }), null)
  assert.equal(parseReleaseAgeRequest({ packages: ['ok', 123] }), null)
  assert.equal(parseReleaseAgeRequest({ packages: ['ok', '--foo'] }), null)
  assert.equal(parseReleaseAgeRequest({ packages: ['not a pkg'] }), null)
  assert.equal(parseReleaseAgeRequest({ packages: Array.from({ length: MAX_RELEASE_AGE_PACKAGES + 1 }, (_, i) => `p${i}`) }), null)
})
