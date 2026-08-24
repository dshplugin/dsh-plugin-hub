/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Regression tests for canonical GitHub install targets and legacy matching.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { githubRepoOf, githubTarget } from '../src/server/services/profile.ts'

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
