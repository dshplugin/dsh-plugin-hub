#!/usr/bin/env node
/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Validates the plugin-count figures (indexed / verified) in the README and
 * release notes against an authoritative source before publishing, so the
 * numbers on the website, in the README and in the release notes never drift.
 *
 * Authoritative source (choose one):
 *   (default)  live stats endpoint   https://dsh-plugin.org/api/stats.json
 *   --expect   explicit figures      --expect 4605,4302
 *   --local    a dsh-plugin checkout --local ../dsh-plugin
 *                                     (counts src/data/plugins.zh.json)
 *
 * Scanned files (default: README.md) can be extended with --files a.md,b.md.
 * Lines carrying an indexed figure (收录 N 个) or a verified figure
 * (精选验证 M) are matched against the source; any deviation fails the check.
 */
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const DEFAULT_ENDPOINT = 'https://dsh-plugin.org/api/stats.json'
const DEFAULT_FILES = ['README.md']

function die(msg) {
  console.error(`[check-stats] ${msg}`)
  process.exit(1)
}

function printHelp() {
  console.log(`Usage: node scripts/tools/check-stats.mjs [options]

Options:
  --expect TOTAL,VERIFIED   use explicit figures, e.g. --expect 4605,4302
  --online URL              live stats endpoint (default: ${DEFAULT_ENDPOINT})
  --local DIR               count figures from a dsh-plugin checkout
  --files a.md,b.md         additional files to scan (default: ${DEFAULT_FILES.join(', ')})
  -h, --help                show this help

Exit code 0 when every figure matches the authoritative source, 1 otherwise.`)
}

function parseArgs(argv) {
  const opts = { expect: null, online: DEFAULT_ENDPOINT, local: null, files: null }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--expect') opts.expect = argv[++i]
    else if (a === '--online') opts.online = argv[++i] ?? DEFAULT_ENDPOINT
    else if (a === '--local') opts.local = argv[++i]
    else if (a === '--files') opts.files = argv[++i]
    else if (a === '--help' || a === '-h') { printHelp(); process.exit(0) }
    else die(`unknown argument: ${a}`)
  }
  return opts
}

function toNum(s) {
  return Number(String(s).replace(/,/g, ''))
}

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) die(`endpoint ${url} returned HTTP ${res.status}`)
  return res.json()
}

async function resolveExpected(opts) {
  if (opts.expect) {
    const [t, v] = opts.expect.split(',').map((x) => x.trim())
    if (!t || !v) die('--expect must be TOTAL,VERIFIED, e.g. --expect 4605,4302')
    return { total: toNum(t), verified: toNum(v), source: `--expect ${opts.expect}` }
  }
  if (opts.local) {
    const file = path.join(opts.local, 'src/data/plugins.zh.json')
    if (!existsSync(file)) die(`local data not found: ${file}`)
    const list = JSON.parse(await readFile(file, 'utf8'))
    const verified = list.filter((p) => p.compatibility?.status === 'verified').length
    return { total: list.length, verified, source: file }
  }
  const stats = await fetchJson(opts.online)
  if (typeof stats.total !== 'number' || typeof stats.verified !== 'number') {
    die(`unexpected payload from ${opts.online}: ${JSON.stringify(stats)}`)
  }
  return { total: stats.total, verified: stats.verified, source: opts.online }
}

/**
 * Extract the indexed / verified figures carried by a single line.
 * Handles both word orders: 收录 N 个 … 精选验证 M  and 收录 N 个 … M 已精选验证.
 */
function lineNumbers(line) {
  let indexed = null
  let verified = null
  const im = line.match(/收录\s*\*{0,2}([\d,]+)/)
  if (im) indexed = toNum(im[1])
  const vm = line.match(/精选验证\s*\*{0,2}([\d,]+)/) || line.match(/\*{0,2}([\d,]+)\*{0,2}\s*已人工精选验证/)
  if (vm) verified = toNum(vm[1])
  return { indexed, verified }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  const expected = await resolveExpected(opts)
  const files = opts.files ? opts.files.split(',') : DEFAULT_FILES
  let failed = false
  let scanned = 0

  for (const f of files) {
    if (!existsSync(f)) {
      console.error(`[check-stats] missing file: ${f}`)
      failed = true
      continue
    }
    const text = await readFile(f, 'utf8')
    text.split('\n').forEach((line, i) => {
      const { indexed, verified } = lineNumbers(line)
      if (indexed === null && verified === null) return
      scanned++
      if (indexed !== null && indexed !== expected.total) {
        failed = true
        console.error(`${f}:${i + 1}: indexed ${indexed} != ${expected.total} (source: ${expected.source})`)
      }
      if (verified !== null && verified !== expected.verified) {
        failed = true
        console.error(`${f}:${i + 1}: verified ${verified} != ${expected.verified} (source: ${expected.source})`)
      }
    })
  }

  console.log(`[check-stats] expected ${expected.total} indexed / ${expected.verified} verified (${expected.source})`)
  console.log(`[check-stats] scanned ${scanned} figure(s) across ${files.join(', ')}`)
  if (failed) {
    console.error('[check-stats] FAIL: figures deviate from the authoritative source')
    process.exit(1)
  }
  console.log('[check-stats] OK: all figures match')
}

main().catch((e) => {
  console.error('[check-stats]', e)
  process.exit(1)
})
