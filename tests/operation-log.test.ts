/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 失败回捞（src/server/services/install/operation-log.ts）的单元测试：
 * 从 DSH 输出里解析 operation 日志路径、只读白名单内的 DSH 日志、读不到时降级，
 * 以及回捞内容能被 classifyFailure 正确归类。
 *
 * Run with the Node built-in test runner: `npm test`.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { backfillOperationLog, hasSubstantiveOutput, operationLogPathOf } from '../src/server/services/install/operation-log.ts'
import { classifyFailure } from '../src/client/logic/failures.ts'

/** 造一个 DSH 的 operation 日志目录结构，返回 pnpm.log 的绝对路径。 */
function makeOperationLog(root: string, content: string): string {
  const dir = join(root, '.plugin-manager', 'logs', 'operation-cuZjxW')
  mkdirSync(dir, { recursive: true })
  const file = join(dir, 'pnpm.log')
  writeFileSync(file, content)
  return file
}

test('operationLogPathOf: extracts the path from the host summary line', () => {
  const line = 'dsh: plugin command failed; diagnostics: C:\\Users\\29491\\.dsh\\profiles\\desktop\\.plugin-manager\\logs\\operation-cuZjxW\\pnpm.log'
  assert.equal(
    operationLogPathOf(`some earlier line\n${line}\n`),
    'C:\\Users\\29491\\.dsh\\profiles\\desktop\\.plugin-manager\\logs\\operation-cuZjxW\\pnpm.log',
  )
})

test('operationLogPathOf: extracts any pnpm.log path; reading still enforces the profile boundary', () => {
  // 解析层不再限定 .plugin-manager（不同版本/相对路径都能识别），安全边界由读取层把关
  assert.equal(operationLogPathOf('diagnostics: /tmp/somewhere/pnpm.log'), '/tmp/somewhere/pnpm.log')
  assert.equal(operationLogPathOf('diagnostics: ~/.dsh/profiles/desktop/hub.log'), null)
  assert.equal(operationLogPathOf('some failure without the diagnostics line'), null)
  // 未提供 profileDir 时退回旧规则：只读 .plugin-manager 下的日志
  assert.equal(backfillOperationLog('diagnostics: /tmp/somewhere/pnpm.log'), null)
})

test('operationLogPathOf: tolerates quotes, trailing punctuation and ANSI color', () => {
  assert.equal(
    operationLogPathOf('dsh: failed; diagnostics: ".plugin-manager/logs/op-1/pnpm.log".'),
    '.plugin-manager/logs/op-1/pnpm.log',
  )
  assert.equal(
    operationLogPathOf('\u001b[31mdsh: plugin command failed; diagnostics: C:\\p\\.plugin-manager\\logs\\op\\pnpm.log\u001b[0m'),
    'C:\\p\\.plugin-manager\\logs\\op\\pnpm.log',
  )
})

test('operationLogPathOf: accepts JSON-wrapped diagnostics and rejects URLs', () => {
  assert.equal(
    operationLogPathOf('{"level":"error","diagnostics": "C:\\\\p\\\\.plugin-manager\\\\logs\\\\op\\\\pnpm.log"}'),
    'C:\\p\\.plugin-manager\\logs\\op\\pnpm.log',
  )
  // 网络地址不是本地日志，不能当文件读
  assert.equal(operationLogPathOf('diagnostics: https://example.com/pnpm.log'), null)
})

test('backfillOperationLog: resolves a relative path against the profile dir', () => {
  const root = mkdtempSync(join(tmpdir(), 'dsh-oplog-'))
  try {
    makeOperationLog(root, 'ERR_PNPM_IGNORED_BUILDS Ignored build scripts: node-pty\n')
    const relative = '.plugin-manager/logs/operation-cuZjxW/pnpm.log'
    const backfilled = backfillOperationLog(`diagnostics: ${relative}`, root)
    assert.ok(backfilled !== null)
    assert.match(backfilled, /ERR_PNPM_IGNORED_BUILDS/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('backfillOperationLog: rejects a log path outside the profile dir', () => {
  const root = mkdtempSync(join(tmpdir(), 'dsh-oplog-'))
  const outside = mkdtempSync(join(tmpdir(), 'dsh-oplog-outside-'))
  try {
    const file = join(outside, 'pnpm.log')
    writeFileSync(file, 'ERR_PNPM_FETCH_404 leaked\n')
    assert.equal(backfillOperationLog(`diagnostics: ${file}`, root), null)
  } finally {
    rmSync(root, { recursive: true, force: true })
    rmSync(outside, { recursive: true, force: true })
  }
})

test('backfillOperationLog: reads the operation log tail so the real pnpm error reaches the client', () => {
  const root = mkdtempSync(join(tmpdir(), 'dsh-oplog-'))
  try {
    const file = makeOperationLog(root, '[ERR_PNPM_FETCH_404] GET https://registry.npmjs.org/dsh-whale-pet: Not Found - 404\n')
    const output = `dsh: plugin command failed; diagnostics: ${file}`
    const backfilled = backfillOperationLog(output)
    assert.ok(backfilled !== null)
    // 回捞出的真实错误码能被自动归类（否则只能归到「未知失败」）
    assert.equal(classifyFailure(backfilled), 'pnpmMissingDep')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('backfillOperationLog: degrades to null when the log is missing or empty', () => {
  const root = mkdtempSync(join(tmpdir(), 'dsh-oplog-'))
  try {
    const missing = join(root, '.plugin-manager', 'logs', 'operation-nope', 'pnpm.log')
    assert.equal(backfillOperationLog(`diagnostics: ${missing}`), null)
    const empty = makeOperationLog(root, '   \n')
    assert.equal(backfillOperationLog(`diagnostics: ${empty}`), null)
    assert.equal(backfillOperationLog('no diagnostics line at all'), null)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('hasSubstantiveOutput: only our own markers means the host printed nothing', () => {
  // 宿主一个字节都没回显：只剩本队列自己打的退出/渠道标记
  assert.equal(hasSubstantiveOutput(''), false)
  assert.equal(hasSubstantiveOutput('[exit 1]'), false)
  assert.equal(hasSubstantiveOutput('[install-channel] npm\n[exit 1]'), false)
  assert.equal(hasSubstantiveOutput('[timed out]\n[exit ?]'), false)
  // 宿主的任何真实输出都算有内容（哪怕只是一行摘要）
  assert.equal(hasSubstantiveOutput('dsh: plugin command failed; diagnostics: C:\\x\\pnpm.log'), true)
  assert.equal(hasSubstantiveOutput('[exit 1]\nERR_PNPM_FETCH_404 GET https://registry.npmjs.org/x'), true)
})
