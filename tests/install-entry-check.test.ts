/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 「安装超时后复核是否其实已装成功」依赖 verifyInstalledEntry 的判定：
 * 目标包能在 profile 依赖里定位、且声明分发的入口文件真实存在 → 视为装上。
 * 这里用临时 DSH_HOME 造一个 profile 固化该判定，防止这条恢复路径随重构失效。
 *
 * Run with the Node built-in test runner: `npm test`.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { installedVersionOf, verifyInstalledEntry } from '../src/server/services/install/task-queue.ts'

const TARGET = 'git+https://github.com/owner/repo.git'

/** 在临时 DSH_HOME 里造一个 profile 跑断言（profileDirectory 运行时读 DSH_HOME）。 */
function withProfile(root: string, deps: Record<string, string>, installed: { name: string; manifest: string; files: string[] } | null, fn: () => void): void {
  const profileDir = join(root, 'profiles', 'test')
  mkdirSync(profileDir, { recursive: true })
  writeFileSync(join(profileDir, 'package.json'), JSON.stringify({ name: 'test', dependencies: deps }))
  if (installed) {
    const pkgDir = join(profileDir, 'node_modules', installed.name)
    mkdirSync(pkgDir, { recursive: true })
    writeFileSync(join(pkgDir, 'package.json'), installed.manifest)
    for (const file of installed.files) {
      const full = join(pkgDir, file)
      mkdirSync(join(full, '..'), { recursive: true })
      writeFileSync(full, 'export default {}\n')
    }
  }
  const prev = process.env.DSH_HOME
  process.env.DSH_HOME = root
  try {
    fn()
  } finally {
    if (prev === undefined) delete process.env.DSH_HOME
    else process.env.DSH_HOME = prev
  }
}

test('verifyInstalledEntry: a landed install with all declared files present counts as installed (timeout re-check)', () => {
  const root = mkdtempSync(join(tmpdir(), 'dsh-home-'))
  try {
    withProfile(root, { 'some-plugin': 'github:owner/repo' }, {
      name: 'some-plugin',
      manifest: JSON.stringify({ name: 'some-plugin', main: './lib/index.js' }),
      files: ['lib/index.js'],
    }, () => {
      const verified = verifyInstalledEntry('test', TARGET)
      // name 命中 + 没有缺失文件 → 超时复核据此判「其实已装成功」
      assert.equal(verified.name, 'some-plugin')
      assert.equal(verified.missing, null)
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('verifyInstalledEntry: a declared file that is not there is reported as missing (no false success)', () => {
  const root = mkdtempSync(join(tmpdir(), 'dsh-home-'))
  try {
    withProfile(root, { 'some-plugin': 'github:owner/repo' }, {
      name: 'some-plugin',
      manifest: JSON.stringify({ name: 'some-plugin', main: './lib/index.js' }),
      files: [],
    }, () => {
      const verified = verifyInstalledEntry('test', TARGET)
      assert.equal(verified.name, 'some-plugin')
      assert.notEqual(verified.missing, null)
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('verifyInstalledEntry: a target that is not installed yet yields no name (timeout re-check is skipped)', () => {
  const root = mkdtempSync(join(tmpdir(), 'dsh-home-'))
  try {
    withProfile(root, { 'other-plugin': 'github:someone/else' }, null, () => {
      const verified = verifyInstalledEntry('test', TARGET)
      assert.equal(verified.name, null)
      assert.equal(verified.missing, null)
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('installedVersionOf: reads the version that actually landed, not the catalog one', () => {
  const root = mkdtempSync(join(tmpdir(), 'dsh-home-'))
  try {
    withProfile(root, { 'some-plugin': 'github:owner/repo' }, {
      name: 'some-plugin',
      // 盘上真实版本与目录里显示的版本可能不同：账本必须用这个值
      manifest: JSON.stringify({ name: 'some-plugin', version: '1.1.10', main: './lib/index.js' }),
      files: ['lib/index.js'],
    }, () => {
      assert.equal(installedVersionOf('test', TARGET), '1.1.10')
      // 未安装的目标读不到版本
      assert.equal(installedVersionOf('test', 'git+https://github.com/other/repo.git'), null)
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
