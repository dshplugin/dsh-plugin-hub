/**
 * Unit tests for the catalog normalizer (src/client/lib/catalog.ts), focusing
 * on the short-key payload from dsh-plugin.org/api/plugins.{lang}.json — in
 * particular the `vr` version key added for update detection.
 *
 * Run with the Node built-in test runner: `npm test` (Node >= 22.6 with
 * type stripping). No extra test dependencies required.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalize } from '../src/client/lib/catalog.ts'

test('normalize: parses the vr short key into version', () => {
  const p = normalize({
    s: 'widget',
    o: 'acme',
    n: 'Widget',
    vr: 'v3.22.1',
    c: 'tools',
    v: 'verified',
    u: '2026-08-20T20:05:55Z',
  } as Record<string, unknown>)
  assert.equal(p.version, 'v3.22.1')
  assert.equal(p.slug, 'widget')
  assert.equal(p.category, 'tools')
  assert.equal(p.compatibility?.status, 'verified')
  assert.equal(p.dates?.repoUpdatedAt, '2026-08-20T20:05:55Z')
})

test('normalize: missing vr leaves version undefined', () => {
  const p = normalize({ s: 'x', n: 'X', c: 'tools' } as Record<string, unknown>)
  assert.equal(p.version, undefined)
  assert.equal(p.slug, 'x')
})
