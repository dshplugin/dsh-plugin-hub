/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Regression tests for canonical GitHub install targets and legacy matching.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { githubRepoOf, githubTarget, installTargetOf } from '../src/server/services/profile/profile.ts'

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

test('installTargetOf: strips a full dsh plugin command down to its target', () => {
  // --profile 段可选，支持 -p 简写与 --profile=web 等号形式；非命令输入原样返回
  assert.equal(installTargetOf('dsh plugin --profile web add github:dHR-P/dsh-safe-launch'), 'github:dHR-P/dsh-safe-launch')
  assert.equal(installTargetOf('dsh plugin -p web add github:dHR-P/dsh-safe-launch'), 'github:dHR-P/dsh-safe-launch')
  assert.equal(installTargetOf('dsh plugin --profile=web add github:dHR-P/dsh-safe-launch'), 'github:dHR-P/dsh-safe-launch')
  assert.equal(installTargetOf('dsh plugin add lodash'), 'lodash')
  assert.equal(installTargetOf('DSH PLUGIN --profile web ADD https://github.com/owner/repo.git'), 'https://github.com/owner/repo.git')
  assert.equal(installTargetOf('lodash'), 'lodash')
  assert.equal(installTargetOf('https://github.com/owner/repo.git'), 'https://github.com/owner/repo.git')
  assert.equal(installTargetOf(''), '')
})
