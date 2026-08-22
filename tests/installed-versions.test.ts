import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  readInstalledVersions,
  recordInstalledVersion,
  recordResolvedNpmPackage,
  removeInstalledVersion,
} from '../src/server/services/installed-versions.ts'

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

test('npm 反查映射 + 客户端版本同步合并：npmPackage 不被覆盖', () => {
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
