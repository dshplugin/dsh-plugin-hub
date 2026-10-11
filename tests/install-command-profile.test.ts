/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Regression tests for profile targeting in the commands the Hub shows and
 * copies. The catalog stamps `--profile web` onto every entry as a publishing
 * placeholder, so a host serving another profile (DSH Desktop runs `desktop`)
 * must re-point the command it hands the user; a profile a plugin pins for
 * itself (CLI-only plugins such as dsh-tui) must survive untouched.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  getActiveProfile,
  installCommandOf,
  retargetProfile,
  setActiveProfile,
  uninstallCommandOf,
} from '../src/client/logic/install-command.ts'
import type { HubPlugin } from '../src/client/types.ts'

/** A catalog entry as published today: both commands carry the web placeholder. */
const catalogPlugin = {
  slug: 'billion-context',
  source: { repo: 'ranxianglei/billion-context', npmPackage: 'billion-context' },
  install: {
    command: 'dsh plugin --profile web add billion-context',
    githubCommand: 'dsh plugin --profile web add github:ranxianglei/billion-context',
  },
} as HubPlugin

/** A CLI-only plugin whose own profile cannot be inferred from the package name. */
const pinnedProfilePlugin = {
  slug: 'dsh-tui',
  source: { repo: 'someone/dsh-tui', npmPackage: 'pkg-dsh-tui' },
  install: { command: 'dsh plugin --profile dsh-tui add dsh-tui', githubCommand: '' },
} as HubPlugin

test('retargetProfile: rewrites the catalog placeholder, keeps a pinned profile', () => {
  assert.equal(
    retargetProfile('dsh plugin --profile web add billion-context', 'desktop'),
    'dsh plugin --profile desktop add billion-context',
  )
  // `--profile=<name>` 等号形式同样改写
  assert.equal(
    retargetProfile('dsh plugin --profile=web add billion-context', 'desktop'),
    'dsh plugin --profile=desktop add billion-context',
  )
  // 插件自带的专属档位是作者意图，不能被改写
  assert.equal(
    retargetProfile('dsh plugin --profile dsh-tui add dsh-tui', 'desktop'),
    'dsh plugin --profile dsh-tui add dsh-tui',
  )
  // 没有 --profile 的命令没有可改写的目标
  assert.equal(retargetProfile('npm install -g foo', 'desktop'), 'npm install -g foo')
})

test('retargetProfile: leaves the command alone when the target is unknown', () => {
  // profile 未知（/env 未返回）或与占位符相同时原样返回，绝不猜一个档位
  assert.equal(retargetProfile('dsh plugin --profile web add x', ''), 'dsh plugin --profile web add x')
  assert.equal(retargetProfile('dsh plugin --profile web add x', 'web'), 'dsh plugin --profile web add x')
  assert.equal(retargetProfile('', 'desktop'), '')
})

test('installCommandOf: targets the profile the host serves', () => {
  setActiveProfile('desktop')
  assert.equal(getActiveProfile(), 'desktop')
  // 目录下发的权威命令被改写到宿主档位
  assert.equal(installCommandOf(catalogPlugin, true), 'dsh plugin --profile desktop add billion-context')
  // 专属档位原样保留
  assert.equal(installCommandOf(pinnedProfilePlugin, true), 'dsh plugin --profile dsh-tui add dsh-tui')

  setActiveProfile('web')
  assert.equal(installCommandOf(catalogPlugin, true), 'dsh plugin --profile web add billion-context')

  setActiveProfile(undefined)
  assert.equal(getActiveProfile(), '')
})

test('installCommandOf: never names a profile before /env has answered', () => {
  setActiveProfile(undefined)
  // 目录命令里的占位档位保持原样（那是目录语义），生成的命令则干脆不带 --profile
  assert.equal(installCommandOf(catalogPlugin, true), 'dsh plugin --profile web add billion-context')
  assert.equal(
    installCommandOf({ slug: 'x', source: { repo: 'a/x' }, install: {} } as HubPlugin, true),
    'dsh plugin add git+https://github.com/a/x.git',
  )
})

test('uninstallCommandOf: names the profile the official CLI requires', () => {
  // 官方 CLI 的 --profile 是必填长选项：缺省会以 exit 1 被直接拒绝
  assert.equal(
    uninstallCommandOf('billion-context', 'desktop'),
    'dsh plugin --profile desktop remove billion-context',
  )
  assert.equal(
    uninstallCommandOf('billion-context', 'web'),
    'dsh plugin --profile web remove billion-context',
  )
  // 档位未知时保留旧形态，仍可由用户自行补 --profile
  assert.equal(uninstallCommandOf('billion-context', ''), 'dsh plugin remove billion-context')
})
