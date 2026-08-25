/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Unit tests for the install progress estimation helpers (src/server/progress.ts).
 *
 * Run with the Node built-in test runner: `npm test` (Node >= 22.6 with
 * type stripping). No extra test dependencies required.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cleanLine, estimateProgress } from '../src/server/services/profile/progress.ts'

test('cleanLine strips the source prefix', () => {
  assert.equal(cleanLine('[out] add foo'), 'add foo')
  assert.equal(cleanLine('[err] ENOENT'), 'ENOENT')
  assert.equal(cleanLine('[out]  keep leading intent'), 'keep leading intent')
})

test('cleanLine strips ANSI escape sequences', () => {
  assert.equal(cleanLine('\x1b[32mgreen\x1b[0m'), 'green')
  assert.equal(cleanLine('\x1b[2K\x1b[1GProgress: resolved 10'), 'Progress: resolved 10')
})

test('cleanLine trims surrounding whitespace', () => {
  assert.equal(cleanLine('  padded  '), 'padded')
  assert.equal(cleanLine('[out] done \n'), 'done')
})

test('estimateProgress parses pnpm Progress lines into a low fetch range', () => {
  assert.equal(estimateProgress('Progress: resolved 100, reused 40, downloaded 30, added 20'), 26)
  assert.equal(estimateProgress('Progress: resolved 10, downloaded 5'), 18)
  assert.equal(estimateProgress('Progress: resolved 4, reused 1, imported 3'), 28)
})

test('estimateProgress keeps the fetch phase well below the middle', () => {
  // resolved 与 handled 几乎总相等，fetch 只占安装的一小段，进度不应贴顶
  assert.equal(estimateProgress('Progress: resolved 10, reused 10, downloaded 10, added 10'), 30)
})

test('estimateProgress ignores empty Progress lines', () => {
  assert.equal(estimateProgress('Progress: resolved 0, downloaded 0'), 0)
})

test('estimateProgress maps phase lines towards done', () => {
  assert.equal(estimateProgress('dependencies:'), 85)
  assert.equal(estimateProgress('Packages:'), 85)
  assert.equal(estimateProgress('Done in 1.2s'), 96)
})

test('estimateProgress returns 0 for unrelated lines', () => {
  assert.equal(estimateProgress('Fetching packages...'), 0)
  assert.equal(estimateProgress(''), 0)
  assert.equal(estimateProgress('[timed out]'), 0)
})

test('estimateProgress handles ANSI-wrapped Progress lines after cleaning', () => {
  const raw = '[out] \x1b[2K\x1b[1GProgress: resolved 20, reused 4, downloaded 6'
  assert.equal(estimateProgress(cleanLine(raw)), 18)
})
