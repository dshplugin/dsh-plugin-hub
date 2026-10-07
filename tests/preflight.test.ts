/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { rootPackageEntryOfTarList } from '../src/server/services/install/preflight.ts'

test('rootPackageEntryOfTarList: finds the root manifest in GitHub codeload layout', () => {
  const listing = [
    'repo-deadbeef/',
    'repo-deadbeef/README.md',
    'repo-deadbeef/package.json',
    'repo-deadbeef/packages/helper/package.json',
  ].join('\n')
  assert.equal(rootPackageEntryOfTarList(listing), 'repo-deadbeef/package.json')
})

test('rootPackageEntryOfTarList: rejects ambiguous or missing archive roots', () => {
  assert.equal(rootPackageEntryOfTarList('repo-a/package.json\nrepo-b/package.json\n'), null)
  assert.equal(rootPackageEntryOfTarList('repo-a/packages/helper/package.json\n'), null)
})
