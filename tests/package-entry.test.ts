/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 回归测试：包入口解析（exports `./` 前缀、条件对象、main 回退）。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolvePackageEntry } from '../src/server/services/install/package-entry.ts'

test('resolvePackageEntry: strips the mandatory ./ prefix from exports string targets', () => {
  assert.equal(resolvePackageEntry({ exports: { '.': './lib/index.js' } }), 'lib/index.js')
  assert.equal(resolvePackageEntry({ exports: { '.': './lib/index.js' }, main: './other.js' }), 'lib/index.js')
})

test('resolvePackageEntry: reads condition objects via default/import/require', () => {
  assert.equal(resolvePackageEntry({ exports: { '.': { import: './lib/mjs.js', require: './lib/cjs.cjs' } } }), 'lib/mjs.js')
  assert.equal(resolvePackageEntry({ exports: { '.': { require: './lib/cjs.cjs' } } }), 'lib/cjs.cjs')
  assert.equal(resolvePackageEntry({ exports: { '.': { default: './lib/default.js', import: './lib/mjs.js' } } }), 'lib/default.js')
})

test('resolvePackageEntry: falls back to main then index.js', () => {
  assert.equal(resolvePackageEntry({ main: './lib/main.js' }), 'lib/main.js')
  assert.equal(resolvePackageEntry({ main: 'lib/main.js' }), 'lib/main.js')
  assert.equal(resolvePackageEntry({ exports: { './sub': './sub.js' } }), 'index.js')
  assert.equal(resolvePackageEntry({}), 'index.js')
})

test('resolvePackageEntry: non-string exports/main values are ignored', () => {
  assert.equal(resolvePackageEntry({ exports: { '.': { node: { import: './x.js' } } }, main: 42 }), 'index.js')
  assert.equal(resolvePackageEntry({ exports: ['./*'], main: null }), 'index.js')
})
