/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Regression tests for UTF-8 BOM tolerance when reading profile manifests (#856 / #873).
 * Windows editors happily prepend a BOM, and `JSON.parse` rejects it outright.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { installedVersionOf, stripBomFromProfileManifest } from '../src/server/services/install/task-queue.ts'

/** 建一个临时 DSH_HOME，返回 desktop profile 目录。 */
function makeProfileDir(): string {
  const home = mkdtempSync(join(tmpdir(), 'dsh-bom-'))
  process.env.DSH_HOME = home
  const dir = join(home, 'profiles', 'desktop')
  mkdirSync(dir, { recursive: true })
  return dir
}

test('stripBomFromProfileManifest: 去掉 BOM 并且重复调用不再改写', () => {
  const dir = makeProfileDir()
  const file = join(dir, 'package.json')
  writeFileSync(file, '\uFEFF{"dependencies":{}}\n', 'utf8')

  assert.equal(stripBomFromProfileManifest('desktop'), true)
  assert.equal(readFileSync(file, 'utf8').startsWith('\uFEFF'), false)
  assert.equal(readFileSync(file, 'utf8'), '{"dependencies":{}}\n')

  // 幂等：已经没有 BOM 时返回 false，内容不动
  assert.equal(stripBomFromProfileManifest('desktop'), false)
})

test('stripBomFromProfileManifest: 没有 package.json 时安全返回 false', () => {
  makeProfileDir()
  assert.equal(stripBomFromProfileManifest('desktop'), false)
})

test('installedVersionOf: profile 与包清单带 BOM 时仍能读到版本', () => {
  const dir = makeProfileDir()
  writeFileSync(join(dir, 'package.json'), '\uFEFF{"dependencies":{"demo":"0.1.0"}}', 'utf8')
  mkdirSync(join(dir, 'node_modules', 'demo'), { recursive: true })
  writeFileSync(join(dir, 'node_modules', 'demo', 'package.json'), '\uFEFF{"version":"0.1.0"}', 'utf8')

  assert.equal(installedVersionOf('desktop', 'demo'), '0.1.0')
})
