/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Regression tests for canonical GitHub install targets and legacy matching.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { githubRepoOf, githubTarget, globalNpmPackagesOf, installTargetOf } from '../src/server/services/profile/profile.ts'

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
  // 官方唯一形式：`dsh plugin --profile <name> add <target>`（--profile 必填、无 -p 简写）；
  // 支持 --profile=<name> 等号形式；非命令/非官方输入原样返回
  assert.equal(installTargetOf('dsh plugin --profile web add github:dHR-P/dsh-safe-launch'), 'github:dHR-P/dsh-safe-launch')
  assert.equal(installTargetOf('dsh plugin --profile=web add github:dHR-P/dsh-safe-launch'), 'github:dHR-P/dsh-safe-launch')
  assert.equal(installTargetOf('DSH PLUGIN --profile web ADD https://github.com/owner/repo.git'), 'https://github.com/owner/repo.git')
  // 官方 CLI 不认 -p 简写、--profile 不可省略：这类输入不再剥命令，原样返回
  assert.equal(installTargetOf('dsh plugin -p web add github:dHR-P/dsh-safe-launch'), 'dsh plugin -p web add github:dHR-P/dsh-safe-launch')
  assert.equal(installTargetOf('dsh plugin add lodash'), 'dsh plugin add lodash')
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
