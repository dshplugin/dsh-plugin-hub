/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 预构建 release 安装目标（src/server/services/install/release-target.ts）的单元测试：
 * release 直链的解析与安全边界（跨仓 / 外部主机 / shell 注入拒绝），以及装完后认回目录身份的归一化。
 *
 * Run with the Node built-in test runner: `npm test` (Node >= 22.6 with
 * type stripping). No extra test dependencies required.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { githubReleaseTarget } from '../src/server/services/install/release-target.ts'
import { githubRepoOf } from '../src/server/services/profile/profile.ts'
import { installCommandOf, installTargetOf, repoFromInstallTarget } from '../src/client/logic/install-command.ts'
import { installedItemsOf, installedNameOf } from '../src/client/logic/installed.ts'
import { normalize } from '../src/client/logic/normalize.ts'
import type { HubPlugin } from '../src/client/types.ts'

const TGZ = 'https://github.com/loopx-project/loopx/releases/download/dsh-loopx-plugin-v0.1.1-beta.5/dsh-loopx-plugin-0.1.1-beta.5.tgz'

test('githubReleaseTarget: 接受裸直链与完整 DSH 命令', () => {
  assert.deepEqual(githubReleaseTarget(TGZ), { target: TGZ, repo: 'loopx-project/loopx' })
  assert.deepEqual(
    githubReleaseTarget(`dsh plugin --profile web add ${TGZ}`),
    { target: TGZ, repo: 'loopx-project/loopx' },
  )
  // 等号形式的 --profile 与 update 动作同样识别
  assert.equal(githubReleaseTarget(`dsh plugin --profile=web update ${TGZ}`)?.target, TGZ)
})

test('githubReleaseTarget: 拒绝非法 / 危险形态', () => {
  for (const value of [
    'http://github.com/o/r/releases/download/v1/r.tgz',   // 非 https
    'https://evil.com/o/r/releases/download/v1/r.tgz',    // 外部主机
    'https://github.com/o/r/releases/download/v1/r.zip',  // 非 .tgz
    'https://github.com/o/r/releases/download/v1/r.tgz?x=1', // query/fragment
    'https://github.com/o/r/releases/latest/download/r.tgz', // 移动的 latest 链接
    `${TGZ} && rm -rf /`,                                  // 追加 shell 代码
    `${TGZ} --foo`,                                        // 追加 CLI 参数
    'https://github.com/o/r/releases/download/../x.tgz',  // 路径穿越
  ]) {
    assert.equal(githubReleaseTarget(value), null, value)
  }
})

test('githubRepoOf: release 直链归一到所属仓库身份', () => {
  assert.equal(githubRepoOf(TGZ), 'loopx-project/loopx')
  assert.equal(githubRepoOf('loopx-project/loopx'), 'loopx-project/loopx')
  assert.equal(githubRepoOf('git+https://github.com/a/b.git'), 'a/b')
})

test('installTargetOf: 目录条目直接用 npm 包名作为安装目标', () => {
  const p = {
    slug: 'x',
    source: { repo: 'a/x', npmPackage: 'x-pkg' },
    install: { command: 'dsh plugin --profile web add x-pkg', githubCommand: `dsh plugin --profile web add ${TGZ}` },
  } as HubPlugin
  // 目录条目必带 npm 包名：安装目标即包名，目录下发的 githubCommand 不再用于选路
  assert.equal(installTargetOf(p), 'x-pkg')
  // 展示命令优先用目录下发的权威命令
  assert.equal(installCommandOf(p), 'dsh plugin --profile web add x-pkg')
})

test('installCommandOf: 钉住已过冷却期的版本时命令带版本，目录权威命令保持不变', () => {
  const p = { slug: 'x', source: { repo: 'a/x', npmPackage: 'x-pkg' } } as HubPlugin
  assert.equal(installCommandOf(p), 'dsh plugin add x-pkg')
  assert.equal(installCommandOf(p, false, '1.2.3'), 'dsh plugin add x-pkg@1.2.3')
  assert.equal(installCommandOf(p, true, '1.2.3'), 'dsh plugin --profile web add x-pkg@1.2.3')
  // 目录下发命令（CLI-only 插件专属 profile）不追加版本，避免改坏官方命令
  const withCommand = {
    ...p,
    install: { command: 'dsh plugin --profile dsh-tui add dsh-tui' },
  } as HubPlugin
  assert.equal(installCommandOf(withCommand, false, '1.2.3'), 'dsh plugin --profile dsh-tui add dsh-tui')
})

test('repoFromInstallTarget: release 装完仍能认回目录身份（读回 / 更新 / 卸载）', () => {
  const plugin = normalize({ s: 'widget', r: 'acme/widget', vr: 'v1.2.3' })
  // 宿主记录的依赖 spec 就是当初安装的 release 直链（旧 pin 版本）
  const oldTarget = 'https://github.com/acme/widget/releases/download/v1.2.2/widget-1.2.2.tgz'
  const installed = { 'widget-plugin': oldTarget }
  const versions = { 'acme/widget': { version: 'v1.2.2', updatedAt: '2026-01-01' } }

  // 身份归一化认 release 直链 → 目录条目命中，已安装视图保留目录身份与更新信号
  assert.equal(repoFromInstallTarget(oldTarget), 'acme/widget')
  assert.equal(installedNameOf(plugin, installed, {}), 'widget-plugin')
  const rows = installedItemsOf([plugin], installed, versions, null, null, null)
  assert.equal(rows.length, 1)
  assert.equal(rows[0]!.plugin, plugin)
  assert.equal(rows[0]!.repo, 'acme/widget')
  assert.equal(rows[0]!.hasUpdate, true) // 装的 v1.2.2 < 目录 v1.2.3

  // 卸载（依赖表里已无该包名）后不再命中
  assert.equal(installedNameOf(plugin, {}, versions), null)
  assert.deepEqual(installedItemsOf([plugin], {}, versions, null, null, null), [])

  // 跨仓 / 外部主机 / 带 query 的非法直链不认领，回退为自定义安装（repo 为空）
  for (const spec of [
    oldTarget.replace('acme/widget/', 'other/widget/'),
    oldTarget.replace('github.com', 'example.com'),
    oldTarget + '?download=1',
  ]) {
    assert.equal(installedNameOf(plugin, { 'widget-plugin': spec }, versions), null)
  }
})

test('failure reports use the recorded release command after refresh instead of a Git display fallback', async () => {
  const { pluginIssueUrl } = await import('../src/client/logic/urls.ts')
  const { executedCommandOf } = await import('../src/client/logic/install-command.ts')
  const release = 'dsh plugin --profile desktop add https://github.com/example/sample/releases/download/v1/sample.tgz'
  const fallback = 'dsh plugin --profile desktop add git+https://github.com/example/sample.git'
  const attempts = ['npm registry search: no matching package found', release]
  const url = new URL(pluginIssueUrl('example/sample', 'ERR_PNPM_MISSING_TARBALL_INTEGRITY', null, fallback, attempts))
  const body = url.searchParams.get('body')!
  assert.equal(executedCommandOf(fallback, attempts), release)
  assert.match(body, /lockfile entry without tarball integrity/)
  assert.ok(body.includes(`实际执行的安装命令：\`${release}\``))
  assert.ok(!body.includes('git+https://github.com/example/sample.git'))
  assert.equal(executedCommandOf(undefined, [release, 'dsh plugin --profile desktop add sample@latest']), 'dsh plugin --profile desktop add sample@latest')
  assert.equal(executedCommandOf(undefined, ['npm install -g sample']), 'npm install -g sample')
  assert.equal(executedCommandOf(undefined, ['npm registry search: no matching package found']), undefined)
  assert.equal(executedCommandOf(fallback, ['npm registry search: no matching package found']), undefined)
  assert.equal(executedCommandOf(fallback, []), undefined)
  assert.equal(executedCommandOf(fallback), fallback)
  const unknown = new URL(pluginIssueUrl('example/sample', 'diagnostics only')).searchParams.get('body')!
  assert.match(unknown, /unknown \(no executed command recorded\)/)
  assert.ok(!unknown.includes('git+https://github.com/example/sample.git'))
})

test('installedNameOf: local file:/link: installs are not claimed by a same-named catalog entry', () => {
  // 目录条目的 npm 包名与用户本地插件同名，但本地安装的身份在本机（#337）
  const catalog = normalize({ s: 'widget', r: { repo: 'acme/widget', npmPackage: 'widget-plugin' }, vr: 'v1.2.3' })
  for (const spec of ['file:../my-widget', 'link:../my-widget', 'file:/Users/me/widget', 'C:\\workspace\\widget']) {
    assert.equal(installedNameOf(catalog, { 'widget-plugin': spec }, {}), null)
    const rows = installedItemsOf([catalog], { 'widget-plugin': spec }, {}, null, null, null)
    assert.equal(rows.length, 1)
    // 归为自定义安装：不显示目录插件的信息
    assert.equal(rows[0]!.plugin, null)
    assert.equal(rows[0]!.name, 'widget-plugin')
  }
  // 真正的 npm 安装（版本号 spec）仍然命中目录条目
  assert.equal(installedNameOf(catalog, { 'widget-plugin': '1.2.3' }, {}), 'widget-plugin')
})
