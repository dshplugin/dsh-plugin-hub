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

test('githubTarget: emits an explicit HTTPS Git URL', () => {
  assert.equal(githubTarget('GanyuanRan/Aegis'), 'git+https://github.com/GanyuanRan/Aegis.git')
  assert.equal(githubTarget('unsafe/value/with/too/many/segments'), null)
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
  // 非全局安装 / 非命令输入 → null（交回其它通道处理）
  assert.equal(globalNpmPackagesOf('npm install lodash'), null)
  assert.equal(globalNpmPackagesOf('dsh plugin --profile web add github:owner/repo'), null)
  assert.equal(globalNpmPackagesOf('lodash'), null)
  assert.equal(globalNpmPackagesOf(''), null)
  // 包名非法（含参数/路径等非包名内容）→ null（防注入任意参数）
  assert.equal(globalNpmPackagesOf('npm install -g lodash --save-dev'), null)
  assert.equal(globalNpmPackagesOf('npm install -g'), null)
})

test('profileFromArgv: CLI 的 --profile 优先，Electron 桌面宿主按位置参数里的 profile 目录识别（#65）', () => {
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
