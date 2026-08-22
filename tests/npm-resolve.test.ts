/**
 * npm 包反查（resolveNpmPackage）的单元测试。
 *
 * 反查走真实 npm registry 搜索接口（网络相关），断言尽量宽松：
 * - 对已知仓库反查应命中其官方 npm 包（ccch1mneyyy/dsh-tui 是当前目录中
 *   有 npm 包但官网数据未登记的典型用例）；
 * - 对不存在的仓库应返回 null（不抛错、不阻塞）。
 * 测试标注 skip 策略：本地无网络时跳过，CI 可显式关闭。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveNpmPackage } from '../src/server/services/npm-resolve.ts'

const ONLINE = process.env.DSH_HUB_TEST_OFFLINE !== '1'

test('resolveNpmPackage: 命中已发布 npm 包的仓库（组织 scope 与 GitHub 用户名不一致）', { skip: !ONLINE }, async () => {
  const name = await resolveNpmPackage('ccch1mneyyy/dsh-tui')
  // 该仓库的 npm 包 scope 是 @deepseek-harness-tui（不是 @ccch1mneyyy），
  // 恰好覆盖「猜名猜不到、只能靠 repository 反查」的场景
  assert.equal(name, '@deepseek-harness-tui/dsh-tui')
})

test('resolveNpmPackage: 不存在的仓库返回 null，不抛错', { skip: !ONLINE }, async () => {
  const name = await resolveNpmPackage('no-such-owner-xyz/dsh-no-such-repo-xyz')
  assert.equal(name, null)
})

test('resolveNpmPackage: 非法 repo 直接返回 null', async () => {
  assert.equal(await resolveNpmPackage(''), null)
  assert.equal(await resolveNpmPackage('norepo'), null)
  assert.equal(await resolveNpmPackage('a/b/c'), null)
})
