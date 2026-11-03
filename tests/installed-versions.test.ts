/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Unit tests for the installed-plugin version tracking
 * (src/server/services/installed-versions.ts).
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import {
  readInstalledVersions,
  recordInstalledVersion,
  recordResolvedNpmPackage,
  removeInstalledVersion,
  versionsFilePath,
} from '../src/server/services/profile/installed-versions.ts'

/** 每个测试用独立临时 DSH_HOME，互不污染、也不碰真实 ~/.dsh */
function withTempHome(run: () => void): void {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-hub-versions-'))
  const prev = process.env.DSH_HOME
  process.env.DSH_HOME = dir
  try {
    run()
  } finally {
    if (prev === undefined) delete process.env.DSH_HOME
    else process.env.DSH_HOME = prev
    rmSync(dir, { recursive: true, force: true })
  }
}

test('npm 包名映射 + 客户端版本同步合并：npmPackage 不被覆盖', () => {
  withTempHome(() => {
    recordResolvedNpmPackage('web', 'ccch1mneyyy/dsh-tui', '@deepseek-harness-tui/dsh-tui')
    // 客户端安装成功后同步版本信号：合并写入，不能丢 npm 包名映射
    recordInstalledVersion('web', 'ccch1mneyyy/dsh-tui', 'v0.8.8', '2026-08-01T00:00:00.000Z')
    const rec = readInstalledVersions('web')['ccch1mneyyy/dsh-tui']
    assert.ok(rec, '记录应存在')
    assert.equal(rec?.npmPackage, '@deepseek-harness-tui/dsh-tui')
    assert.equal(rec?.version, 'v0.8.8')
  })
})

test('卸载移除整条记录，npmPackage 映射一并清除', () => {
  withTempHome(() => {
    recordResolvedNpmPackage('web', 'ccch1mneyyy/dsh-tui', '@deepseek-harness-tui/dsh-tui')
    removeInstalledVersion('web', 'ccch1mneyyy/dsh-tui')
    const rec = readInstalledVersions('web')['ccch1mneyyy/dsh-tui']
    assert.equal(rec, undefined)
  })
})

test('写入是原子的：不留临时文件，内容完整可读', () => {
  withTempHome(() => {
    recordInstalledVersion('web', 'owner/repo', '1.2.3', '2026-10-25T00:00:00.000Z')
    const file = versionsFilePath('web')
    // 先写 tmp 再 rename：成功后不能残留 .tmp，否则下次 rename 前的半成品可能被误读
    assert.equal(existsSync(`${file}.tmp`), false)
    // 文件本身必须是完整 JSON（截断会让整份账本失效、更新检测随之失效）
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as Record<string, { version?: string }>
    assert.equal(parsed['owner/repo']?.version, '1.2.3')
  })
})

test('读取时归一化：只带 npmPackage 的残缺记录补成完整形状', () => {
  withTempHome(() => {
    const file = versionsFilePath('web')
    mkdirSync(dirname(file), { recursive: true })
    // 复现真实盘上形态：安装开始时就写了包名映射，任务还没结束（没有版本字段）
    writeFileSync(file, JSON.stringify({ 'owner/repo': { npmPackage: '@scope/pkg' } }))
    const rec = readInstalledVersions('web')['owner/repo']
    assert.equal(rec?.version, '')
    assert.equal(rec?.updatedAt, '')
    assert.equal(rec?.npmPackage, '@scope/pkg')
  })
})
