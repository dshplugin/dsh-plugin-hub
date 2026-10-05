/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 预构建 release 安装目标（src/server/services/install/release-target.ts）的单元测试：
 * 目录下发的权威 release 命令 → 安装目标选路，以及安全边界（跨仓 / 外部主机 / shell 注入拒绝）。
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

test('installTargetOf: 无 npm 包但有同仓 release 命令 → 走 release 直链', () => {
  const p = {
    slug: 'loopx',
    source: { repo: 'loopx-project/loopx', npmPackage: '' },
    install: { githubCommand: `dsh plugin --profile web add ${TGZ}` },
  } as HubPlugin
  assert.deepEqual(installTargetOf(p), { target: TGZ, via: 'release' })
  // 展示命令用目录下发的权威命令，与实际安装目标一致
  assert.equal(installCommandOf(p), `dsh plugin --profile web add ${TGZ}`)
})

test('installTargetOf: npm 包优先，跨仓 release 命令不采信', () => {
  const npm = {
    slug: 'x',
    source: { repo: 'a/x', npmPackage: 'x-pkg' },
    install: { githubCommand: `dsh plugin --profile web add ${TGZ}` },
  } as HubPlugin
  assert.deepEqual(installTargetOf(npm), { target: 'x-pkg', via: 'npm' })

  const crossRepo = {
    slug: 'y',
    source: { repo: 'a/y', npmPackage: '' },
    install: { githubCommand: `dsh plugin --profile web add ${TGZ}` },
  } as HubPlugin
  assert.deepEqual(installTargetOf(crossRepo), { target: 'a/y', via: 'github' })
})

test('release installs remain visible after readback, catalog update and removal', () => {
  const plugin = normalize({ s: 'widget', r: 'acme/widget', vr: 'v1.2.3' })
  const oldTarget = 'https://github.com/acme/widget/releases/download/v1.2.2/widget-1.2.2.tgz'
  const installed = { 'widget-plugin': oldTarget }
  const versions = { 'acme/widget': { version: 'v1.2.2', updatedAt: '2026-01-01' } }
  assert.equal(repoFromInstallTarget(oldTarget), 'acme/widget')
  assert.equal(installedNameOf(plugin, installed, {}), 'widget-plugin')
  const rows = installedItemsOf([plugin], installed, versions, null, null, null)
  assert.equal(rows.length, 1)
  assert.equal(rows[0]!.plugin, plugin)
  assert.equal(rows[0]!.repo, 'acme/widget')
  assert.equal(rows[0]!.hasUpdate, true)
  assert.equal(installedNameOf(plugin, {}, versions), null)
  assert.deepEqual(installedItemsOf([plugin], {}, versions, null, null, null), [])
  for (const spec of [
    oldTarget.replace('acme/widget/', 'other/widget/'),
    oldTarget.replace('github.com', 'example.com'),
    oldTarget + '?download=1',
  ]) {
    assert.equal(installedNameOf(plugin, { 'widget-plugin': spec }, versions), null)
  }
})
