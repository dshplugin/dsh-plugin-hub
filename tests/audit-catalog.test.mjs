/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Unit tests for the pure helpers in scripts/audit-catalog.mjs. No network, no
 * child processes: the npm/checker calls are exercised only by the manual
 * workflow, and every decision they feed into is tested here with fixtures.
 *
 * The subject is plain ESM with no build step, so this file is .mjs too:
 * tsconfig.test.json is `strict` without `allowJs`, which would reject a typed
 * import of an untyped .mjs with TS7016 (keeping the repo config untouched).
 *
 * Run with `npm test` (Node built-in runner).
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
import {
  CHECKER_VERSION,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  candidatePackages,
  catalogRepoOf,
  clampLimit,
  githubRepoOf,
  mapCheckerOutcome,
  npmPackageOf,
  parseTarEntries,
  renderStepSummary,
  safeExtractPath,
  sameRepo,
  selectSample,
  summarizeCounts,
  summarizeReport,
} from '../scripts/audit-catalog.mjs'

// ---------------------------------------------------------------------------
// Entry filtering
// ---------------------------------------------------------------------------

test('npmPackageOf: reads the catalog r.npmPackage field and nothing else', () => {
  assert.equal(npmPackageOf({ r: { npmPackage: 'dsh-whale-widget' } }), 'dsh-whale-widget')
  assert.equal(npmPackageOf({ r: { npmPackage: '  dsh-padded  ' } }), 'dsh-padded')
  assert.equal(npmPackageOf({ r: { npmPackage: '   ' } }), null)
  assert.equal(npmPackageOf({ r: { npmPackage: 42 } }), null)
  assert.equal(npmPackageOf({ r: { repo: 'owner/repo' } }), null)
  assert.equal(npmPackageOf({ r: 'owner/repo' }), null)
  assert.equal(npmPackageOf({}), null)
  assert.equal(npmPackageOf(null), null)
})

test('catalogRepoOf: accepts both catalog source shapes', () => {
  assert.equal(catalogRepoOf({ r: 'owner/repo' }), 'owner/repo')
  assert.equal(catalogRepoOf({ r: { repo: 'owner/repo', npmPackage: 'x' } }), 'owner/repo')
  assert.equal(catalogRepoOf({ r: { repo: '  ' } }), null)
  assert.equal(catalogRepoOf({ r: { npmPackage: 'x' } }), null)
  assert.equal(catalogRepoOf(null), null)
})

test('candidatePackages: keeps catalog order, skips non-npm entries, dedupes by name', () => {
  const entries = [
    { s: 'b-plugin', r: { npmPackage: 'b', repo: 'o/b' } },
    { s: 'a-plugin', r: { npmPackage: 'a', repo: 'o/a' } },
    { s: 'b-duplicate', r: { npmPackage: 'b', repo: 'o/b2' } },
    { s: 'git-only', r: { repo: 'o/git-only' } },
    { s: 'c-plugin', r: { npmPackage: 'c', repo: 'o/c' } },
  ]
  assert.deepEqual(candidatePackages(entries), ['b', 'a', 'c'])
  assert.deepEqual(candidatePackages([]), [])
  assert.deepEqual(candidatePackages(undefined), [])
})

// ---------------------------------------------------------------------------
// Sampling
// ---------------------------------------------------------------------------

test('clampLimit: default 20, hard cap 50, floor 1, garbage falls back', () => {
  assert.equal(DEFAULT_LIMIT, 20)
  assert.equal(MAX_LIMIT, 50)
  assert.equal(clampLimit(20), 20)
  assert.equal(clampLimit('7'), 7)
  assert.equal(clampLimit(0), 1)
  assert.equal(clampLimit(-3), 1)
  assert.equal(clampLimit(51), 50)
  assert.equal(clampLimit('999'), 50)
  assert.equal(clampLimit('nope'), DEFAULT_LIMIT)
  assert.equal(clampLimit(undefined), DEFAULT_LIMIT)
  assert.equal(clampLimit(7.9), 7)
})

test('selectSample: deterministic prefix of the candidate list', () => {
  const candidates = ['a', 'b', 'c', 'd']
  assert.deepEqual(selectSample(candidates, 2), ['a', 'b'])
  assert.deepEqual(selectSample(candidates, 50), candidates)
  assert.deepEqual(selectSample(candidates, 0), ['a'])
  assert.deepEqual(selectSample([], 20), [])
  assert.deepEqual(selectSample(undefined, 20), [])
})

// ---------------------------------------------------------------------------
// Checker outcome mapping
// ---------------------------------------------------------------------------

function checkerReport(status, overrides = {}) {
  return {
    schema: 'dsh-conformance/1',
    conclusion: { status, level: 'DSH-ENTRY recognized', headline: 'headline', reason: 'WARN: DSC-01', exitCode: status === 'fail' ? 1 : 0 },
    coverage: { total: 14, mandatory: 5, checked: 5, pass: 2, warn: 3, advisory: 2, fail: 0, na: 3, notRun: 6, partial: 1, error: 6 },
    ...overrides,
  }
}

test('mapCheckerOutcome: keeps conclusion.status and extracts counts from coverage', () => {
  const outcome = mapCheckerOutcome({ code: 0, stdout: JSON.stringify(checkerReport('warn')) })
  assert.equal(outcome.status, 'warn')
  assert.equal(outcome.notRunReason, null)
  assert.equal(outcome.conclusion.status, 'warn')
  assert.equal(outcome.conclusion.level, 'DSH-ENTRY recognized')
  assert.equal(outcome.counts.total, 14)
  assert.equal(outcome.counts.warn, 3)
  assert.equal(outcome.counts.notRun, 6)
})

test('mapCheckerOutcome: preserves pass / incomplete / fail', () => {
  for (const status of ['pass', 'incomplete', 'fail']) {
    const outcome = mapCheckerOutcome({ code: status === 'fail' ? 1 : 0, stdout: JSON.stringify(checkerReport(status)) })
    assert.equal(outcome.status, status)
  }
})

test('mapCheckerOutcome: tolerates npx noise around the JSON payload', () => {
  const noisy = `npm warn something\n${JSON.stringify(checkerReport('warn'))}\n`
  assert.equal(mapCheckerOutcome({ code: 0, stdout: noisy }).status, 'warn')
})

test('mapCheckerOutcome: timeout / spawn error / garbage / unknown status become not_run', () => {
  const timedOut = mapCheckerOutcome({ timedOut: true, stdout: '' })
  assert.equal(timedOut.status, 'not_run')
  assert.equal(timedOut.notRunReason, 'timeout')

  const spawnFailed = mapCheckerOutcome({ spawnError: new Error('ENOENT') })
  assert.equal(spawnFailed.status, 'not_run')
  assert.equal(spawnFailed.notRunReason, 'checker_spawn_failed')

  const garbage = mapCheckerOutcome({ code: 0, stdout: 'not json', stderr: 'boom' })
  assert.equal(garbage.status, 'not_run')
  assert.equal(garbage.notRunReason, 'unparseable_report')
  assert.match(garbage.detail, /boom/)

  const unknown = mapCheckerOutcome({ code: 0, stdout: JSON.stringify({ conclusion: { status: 'maybe' } }) })
  assert.equal(unknown.status, 'not_run')
  assert.equal(unknown.notRunReason, 'unexpected_status')
})

test('summarizeCounts: top-level counts win over the coverage fallback', () => {
  const fromCoverage = summarizeCounts(checkerReport('warn'))
  assert.equal(fromCoverage.pass, 2)
  assert.equal(fromCoverage.total, 14)

  const withCounts = summarizeCounts({ counts: { pass: 9 }, coverage: { pass: 2 } })
  assert.equal(withCounts.pass, 9)
  assert.equal(withCounts.warn, null)
})

test('summarizeReport: totals, status distribution and not_run reasons', () => {
  const totals = summarizeReport([
    { status: 'pass', durationMs: 10, checkerDurationMs: 1000 },
    { status: 'warn', durationMs: 20 },
    { status: 'fail' },
    { status: 'not_run', notRunReason: 'repository_mismatch' },
    { status: 'not_run', notRunReason: 'repository_mismatch' },
    { status: 'not_run', notRunReason: 'not_found' },
  ])
  assert.equal(totals.selected, 6)
  assert.equal(totals.checked, 3)
  assert.equal(totals.notRun, 3)
  assert.equal(totals.statusCounts.pass, 1)
  assert.equal(totals.statusCounts.warn, 1)
  assert.equal(totals.statusCounts.fail, 1)
  assert.equal(totals.statusCounts.not_run, 3)
  assert.equal(totals.notRunReasons.repository_mismatch, 2)
  assert.equal(totals.notRunReasons.not_found, 1)
  assert.equal(totals.checkerSeconds, 1)
})

// ---------------------------------------------------------------------------
// Repository (back-link) comparison
// ---------------------------------------------------------------------------

test('githubRepoOf: normalises the repository forms npm actually returns', () => {
  assert.equal(githubRepoOf('https://github.com/Owner/Repo'), 'owner/repo')
  assert.equal(githubRepoOf('https://github.com/Owner/Repo.git'), 'owner/repo')
  assert.equal(githubRepoOf('git+https://github.com/Owner/Repo.git'), 'owner/repo')
  assert.equal(githubRepoOf('git@github.com:Owner/Repo.git'), 'owner/repo')
  assert.equal(githubRepoOf('github:Owner/Repo'), 'owner/repo')
  assert.equal(githubRepoOf('Owner/Repo'), 'owner/repo')
  assert.equal(githubRepoOf('owner/repo/'), 'owner/repo')
  assert.equal(githubRepoOf('https://gitlab.com/owner/repo'), null)
  assert.equal(githubRepoOf('https://github.com/owner'), null)
  assert.equal(githubRepoOf('not a repo'), null)
  assert.equal(githubRepoOf(''), null)
  assert.equal(githubRepoOf(null), null)
})

test('sameRepo: catalog repo must match the npm repository', () => {
  assert.equal(sameRepo('meteornox/deepseek-balance-whale-widget', 'git+https://github.com/Meteornox/DeepSeek-Balance-Whale-Widget.git'), true)
  assert.equal(sameRepo('owner/repo', 'owner/repo'), true)
  assert.equal(sameRepo('owner/repo', 'https://github.com/someone-else/repo'), false)
  assert.equal(sameRepo('owner/repo', null), false)
  assert.equal(sameRepo(null, 'owner/repo'), false)
  assert.equal(sameRepo('owner', 'owner/repo'), false)
})

// ---------------------------------------------------------------------------
// tar.gz reading + extraction path safety
// ---------------------------------------------------------------------------

function tarHeader(name, size, typeflag = '0') {
  const header = Buffer.alloc(512)
  header.write(name.slice(0, 100), 0, 100, 'utf8')
  header.write('0000644\0', 100, 'ascii')
  header.write('0000000\0', 108, 'ascii')
  header.write('0000000\0', 116, 'ascii')
  header.write(`${size.toString(8).padStart(11, '0')}\0`, 124, 'ascii')
  header.write(`${Math.floor(Date.now() / 1000).toString(8).padStart(11, '0')}\0`, 136, 'ascii')
  header.write('        ', 148, 'ascii')
  header.write(typeflag, 156, 'ascii')
  header.write('ustar\0', 257, 'ascii')
  header.write('00', 263, 'ascii')
  let checksum = 0
  for (const byte of header) checksum += byte
  header.write(`${checksum.toString(8).padStart(6, '0')}\0 `, 148, 'ascii')
  return header
}

function tarArchive(files) {
  const blocks = []
  for (const [name, content] of Object.entries(files)) {
    const data = Buffer.from(content)
    blocks.push(tarHeader(name, data.length), data, Buffer.alloc((512 - (data.length % 512)) % 512))
  }
  blocks.push(Buffer.alloc(1024))
  return Buffer.concat(blocks)
}

test('parseTarEntries: reads a gzipped npm-style tarball', () => {
  const archive = gzipSync(tarArchive({
    'package/package.json': '{"name":"x","version":"1.0.0"}',
    'package/index.js': 'export const x = 1\n',
  }))
  const entries = parseTarEntries(archive)
  assert.deepEqual(entries.map((entry) => entry.path), ['package/package.json', 'package/index.js'])
  assert.equal(entries[0].data.toString('utf8'), '{"name":"x","version":"1.0.0"}')
  assert.equal(entries[1].directory, false)
})

test('checker version is pinned so runs stay comparable', () => {
  assert.equal(CHECKER_VERSION, '1.6.9')
})

test('safeExtractPath: rejects traversal and absolute entries, accepts package paths', () => {
  const root = resolve(tmpdir(), 'dsh-catalog-audit-root')
  assert.equal(safeExtractPath(root, 'package/index.js'), join(root, 'package', 'index.js'))
  assert.equal(safeExtractPath(root, './package/a.js'), join(root, 'package', 'a.js'))
  assert.throws(() => safeExtractPath(root, '../escape.txt'), /unsafe tar entry path/)
  assert.throws(() => safeExtractPath(root, 'package/../../escape.txt'), /unsafe tar entry path/)
  assert.throws(() => safeExtractPath(root, '/etc/passwd'), /absolute tar entry path/)
  assert.throws(() => safeExtractPath(root, 'C:/Windows/system32'), /absolute tar entry path/)
})

// ---------------------------------------------------------------------------
// Summary rendering
// ---------------------------------------------------------------------------

test('renderStepSummary: states the advisory boundary and the sampling rule', () => {
  const packages = [
    { name: 'dsh-pass', status: 'pass', conclusion: { reason: null, level: 'DSH-ENTRY recognized' }, counts: { pass: 5 }, checkerDurationMs: 2100 },
    { name: 'dsh-mismatch', status: 'not_run', notRunReason: 'repository_mismatch', detail: 'catalog repo a/b vs npm repository c/d' },
  ]
  const totals = summarizeReport(packages)
  const markdown = renderStepSummary({
    disclaimer: 'Advisory static sample only.',
    catalog: { source: 'fixture.json', resolvedFrom: 'file', error: null, entries: 4, withNpmPackage: 2, uniqueNpmPackages: 2 },
    sampling: { rule: 'catalog order as returned by the source; first N unique npm package names', requestedLimit: 20, appliedLimit: 20, candidates: 2, selected: 2 },
    generatedAt: '2026-11-08T00:00:00.000Z',
    totals,
    packages,
  })
  assert.match(markdown, /not a ranking, score, certification, or security conclusion/)
  assert.match(markdown, /catalog order as returned by the source/)
  assert.match(markdown, /repository_mismatch/)
  assert.match(markdown, /\| 1 \| `dsh-pass` \| pass \|/)
  assert.match(markdown, /not_run \| 1/)
})
