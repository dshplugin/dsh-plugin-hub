/**
 * Unit tests for the install progress estimation helpers (src/server/progress.ts).
 *
 * Run with the Node built-in test runner: `npm test` (Node >= 22.6 with
 * type stripping). No extra test dependencies required.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cleanLine, estimateProgress } from '../src/server/services/progress.ts'

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

test('estimateProgress parses pnpm Progress lines', () => {
  assert.equal(estimateProgress('Progress: resolved 100, reused 40, downloaded 30, added 20'), 90)
  assert.equal(estimateProgress('Progress: resolved 10, downloaded 5'), 50)
  assert.equal(estimateProgress('Progress: resolved 4, reused 1, imported 3'), 90)
})

test('estimateProgress caps the resolved phase at 90%', () => {
  // done can momentarily exceed total; the cap keeps room for the install phase
  assert.equal(estimateProgress('Progress: resolved 10, reused 10, downloaded 10, added 10'), 90)
})

test('estimateProgress ignores empty Progress lines', () => {
  assert.equal(estimateProgress('Progress: resolved 0, downloaded 0'), 0)
})

test('estimateProgress maps phase lines towards done', () => {
  assert.equal(estimateProgress('dependencies:'), 92)
  assert.equal(estimateProgress('Packages:'), 92)
  assert.equal(estimateProgress('Done in 1.2s'), 96)
})

test('estimateProgress returns 0 for unrelated lines', () => {
  assert.equal(estimateProgress('Fetching packages...'), 0)
  assert.equal(estimateProgress(''), 0)
  assert.equal(estimateProgress('[timed out]'), 0)
})

test('estimateProgress handles ANSI-wrapped Progress lines after cleaning', () => {
  const raw = '[out] \x1b[2K\x1b[1GProgress: resolved 20, reused 4, downloaded 6'
  assert.equal(estimateProgress(cleanLine(raw)), 50)
})
