/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Regression tests for canonical GitHub install targets and legacy matching.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { githubRepoOf, githubTarget, globalNpmPackagesOf, installTargetOf, profileFromArgv } from '../src/server/services/profile/profile.ts'
import { npmInstallTargetOf } from '../src/server/services/install/task-queue.ts'

test('githubTarget: emits an explicit HTTPS Git URL', () => {
  assert.equal(githubTarget('GanyuanRan/Aegis'), 'git+https://github.com/GanyuanRan/Aegis.git')
  assert.equal(githubTarget('unsafe/value/with/too/many/segments'), null)
})

test('githubTarget: preserves an explicitly pinned Git ref', () => {
  assert.equal(
    githubTarget('GanyuanRan/Aegis', 'v2.12.2'),
    'git+https://github.com/GanyuanRan/Aegis.git#v2.12.2',
  )
  assert.equal(
    githubTarget('GanyuanRan/Aegis', '490ffb7e91699238c1bf9bc7a4c569a1397b0bd0'),
    'git+https://github.com/GanyuanRan/Aegis.git#490ffb7e91699238c1bf9bc7a4c569a1397b0bd0',
  )
  // 空 / 缺省 ref 与旧行为一致（不给片段）
  assert.equal(githubTarget('GanyuanRan/Aegis', null), 'git+https://github.com/GanyuanRan/Aegis.git')
  assert.equal(githubTarget('GanyuanRan/Aegis', ''), 'git+https://github.com/GanyuanRan/Aegis.git')
})

test('githubRepoOf: recognizes canonical and legacy GitHub targets', () => {
  for (const value of [
    'GanyuanRan/Aegis',
    'github:GanyuanRan/Aegis',
    'git+https://github.com/GanyuanRan/Aegis.git',
    'https://github.com/GanyuanRan/Aegis.git',
    'git+ssh://github.com/GanyuanRan/Aegis.git',
    'git@github.com:GanyuanRan/Aegis.git',
  ]) {
    assert.equal(githubRepoOf(value), 'GanyuanRan/Aegis')
  }
  assert.equal(githubRepoOf('@scope/package'), null)
  assert.equal(githubRepoOf('https://example.com/owner/repo.git'), null)
})

test('npmInstallTargetOf: 钉住版本优先，其次 @latest，git/全局安装原样', () => {
  // Hub 自我更新：提示的是已过供应链门禁的版本，必须钉住安装
  assert.equal(npmInstallTargetOf('dsh-plugin', { update: true, global: false, pinned: 'dsh-plugin@2.0.5' }), 'dsh-plugin@2.0.5')
  // 普通更新没钉版本 → @latest（pnpm 对已存在依赖才真正升级）
  assert.equal(npmInstallTargetOf('dsh-plugin', { update: true, global: false }), 'dsh-plugin@latest')
  // 普通安装原样
  assert.equal(npmInstallTargetOf('dsh-plugin', { update: false, global: false }), 'dsh-plugin')
  // 钉版本对 git 源与全局 npm 不生效
  assert.equal(npmInstallTargetOf('owner/repo', { update: true, global: false, pinned: 'owner/repo@2.0.5' }), 'owner/repo')
  assert.equal(npmInstallTargetOf('dsh-tui', { update: true, global: true, pinned: 'dsh-tui@1.0.0' }), 'dsh-tui')
})

test('npm add explicitly selects latest even when the profile is not marked as an update', () => {
  const add = { update: false, global: false, add: true }
  assert.equal(npmInstallTargetOf('dsh-openwrite', add), 'dsh-openwrite@latest')
  assert.equal(npmInstallTargetOf('@scope/plugin', add), '@scope/plugin@latest')
  assert.equal(npmInstallTargetOf('dsh-plugin', { ...add, pinned: 'dsh-plugin@2.2.3' }), 'dsh-plugin@2.2.3')
  assert.equal(npmInstallTargetOf('dsh-openwrite@0.2.28', add), 'dsh-openwrite@0.2.28')
  assert.equal(npmInstallTargetOf('@scope/plugin@next', add), '@scope/plugin@next')
  assert.equal(npmInstallTargetOf('https://example.test/plugin.tgz', add), 'https://example.test/plugin.tgz')
  assert.equal(npmInstallTargetOf('owner/repo', add), 'owner/repo')
  assert.equal(npmInstallTargetOf('dsh-openwrite', { ...add, global: true }), 'dsh-openwrite')
  assert.equal(npmInstallTargetOf('dsh-openwrite', { update: false, global: false, add: false }), 'dsh-openwrite')
})

test('installTargetOf: strips an official dsh plugin command down to its target', () => {
  // 官方唯一形式：`dsh plugin --profile <name> <add|update> <target>`（--profile 必填、无 -p 简写）；
  // 支持 --profile=<name> 等号形式；update 动词同样剥成裸目标（更新已安装目标到最新）；
  // 非命令/非官方输入原样返回
  assert.equal(installTargetOf('dsh plugin --profile web add github:dHR-P/dsh-safe-launch'), 'github:dHR-P/dsh-safe-launch')
  assert.equal(installTargetOf('dsh plugin --profile=web add github:dHR-P/dsh-safe-launch'), 'github:dHR-P/dsh-safe-launch')
  assert.equal(installTargetOf('DSH PLUGIN --profile web ADD https://github.com/owner/repo.git'), 'https://github.com/owner/repo.git')
  assert.equal(installTargetOf('dsh plugin --profile web update dsh-plugin'), 'dsh-plugin')
  assert.equal(installTargetOf('dsh plugin --profile=web UPDATE lodash'), 'lodash')
  // 官方 CLI 不认 -p 简写、--profile 不可省略：这类输入不再剥命令，原样返回
  assert.equal(installTargetOf('dsh plugin -p web add github:dHR-P/dsh-safe-launch'), 'dsh plugin -p web add github:dHR-P/dsh-safe-launch')
  assert.equal(installTargetOf('dsh plugin add lodash'), 'dsh plugin add lodash')
  // 命令卡片不认 remove 动词（卸载由「已安装」列表的卸载按钮执行）：不剥命令，原样返回
  assert.equal(installTargetOf('dsh plugin --profile web remove lodash'), 'dsh plugin --profile web remove lodash')
  assert.equal(installTargetOf('lodash'), 'lodash')
  assert.equal(installTargetOf('https://github.com/owner/repo.git'), 'https://github.com/owner/repo.git')
  assert.equal(installTargetOf(''), '')
})

test('globalNpmPackagesOf: extracts package lists from official `npm install -g` commands', () => {
  // 官方 README 格式：npm install -g <pkgs>（install/i 简写、-g/--global 双形态、大小写不敏感）
  assert.deepEqual(globalNpmPackagesOf('npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui'),
    ['@deepseek-ai/dsh', '@deepseek-harness-tui/dsh-tui'])
  assert.deepEqual(globalNpmPackagesOf('npm i -g lodash'), ['lodash'])
  assert.deepEqual(globalNpmPackagesOf('NPM INSTALL --global @scope/pkg lodash'), ['@scope/pkg', 'lodash'])
  assert.deepEqual(globalNpmPackagesOf('  npm install -g  a  b  '), ['a', 'b'])
  // 非全局安装 / 非命令输入 → null
  assert.equal(globalNpmPackagesOf('npm install lodash'), null)
  assert.equal(globalNpmPackagesOf('dsh plugin --profile web add github:owner/repo'), null)
  assert.equal(globalNpmPackagesOf('lodash'), null)
  assert.equal(globalNpmPackagesOf(''), null)
  // 包名非法（含参数/路径等非包名内容）→ null（防注入任意参数）
  assert.equal(globalNpmPackagesOf('npm install -g lodash --save-dev'), null)
  assert.equal(globalNpmPackagesOf('npm install -g'), null)
})

test('profileFromArgv: CLI 的 --profile 优先，Electron 桌面宿主按位置参数里的 profile 目录识别', () => {
  const node = '/usr/local/bin/node'
  const entry = '/app/dsh/node_modules/@deepseek-ai/dsh-desktop-host/lib/index.js'
  // Electron 桌面宿主：不传 --profile，把 profile 目录作为位置参数传入 ——
  // 认不出就会永远落回 fallback，把路由/日志/安装全挂到 web profile
  assert.equal(
    profileFromArgv([node, entry, '--expose-internals', '/app/dsh', '/home/u/.dsh/profiles/desktop', '/app/runtime/primary-runtime'], 'web'),
    'desktop',
  )
  // 官方 CLI：--profile <name>（含 --profile=<name> 等号形式）
  assert.equal(profileFromArgv([node, entry, 'plugin', '--profile', 'web', 'add', 'lodash'], 'web'), 'web')
  assert.equal(profileFromArgv([node, entry, '--profile=desktop'], 'web'), 'desktop')
  // 两者都有：--profile 标志优先（位置参数只是启动路径，不作数）
  assert.equal(profileFromArgv([node, entry, '--profile', 'desktop', '/home/u/.dsh/profiles/web'], 'web'), 'desktop')
  // 其它位置参数（dshRoot / runtime 路径）父目录不是 profiles，不得误取
  assert.equal(profileFromArgv([node, entry, '--expose-internals', '/app/dsh', '/app/runtime/primary-runtime'], 'web'), 'web')
  // 都没有：保持原 fallback 行为
  assert.equal(profileFromArgv([node, entry, '--port', '3080'], 'web'), 'web')
  assert.equal(profileFromArgv([node, entry], 'my-profile'), 'my-profile')
})
