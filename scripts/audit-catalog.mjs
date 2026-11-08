#!/usr/bin/env node
/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 目录审核增量（只读 · advisory · 非阻断）：对目录里带 npm 包名的条目跑
 * dsh-standards 的 ENTRY 静态检查，产出 audit-report.json 与 step-summary.md。
 *
 * 三条硬边界（代码里也强制）：
 *   1. 只读：npm pack 只下载 tarball（--ignore-scripts，不 install、不跑被检包的
 *      lifecycle），checker 带 --no-exec，全程不执行被检查包的任何代码。
 *   2. advisory：报告只是「某次抽样里静态 ENTRY 检查的原始结论」，不是排名、
 *      评分、认证或安全结论；脚本永远 exit 0，失败只记 not_run。
 *   3. 非阻断：不写目录、不改准入、不改排序，不提交任何文件到 git。
 *
 * 用法：
 *   node scripts/audit-catalog.mjs [--limit 20] [--catalog <file|url>] [--out <dir>]
 *
 * 目录来源默认取应用正在用的在线目录（见 src/server/http/catalog.ts：
 * https://api.dsh-plugin.org/plugins.zh.json），可用 --catalog 换成
 * 本地 JSON 文件或 file:// URL（离线 / 固定快照复现）。
 */

import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join, posix, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gunzipSync } from 'node:zlib'

/** 目录来源：与 src/server/http/catalog.ts 的 /dsh-plugin-hub/catalog 代理目标一致。 */
export const DEFAULT_CATALOG = 'https://api.dsh-plugin.org/plugins.zh.json'
/** checker 版本固定，保证同一份目录多次运行结论可比。 */
export const CHECKER_SPEC = 'dsh-standards@1.6.9'
export const CHECKER_VERSION = '1.6.9'
export const DEFAULT_LIMIT = 20
export const MAX_LIMIT = 50
export const REPORT_SCHEMA = 'dsh-plugin-hub/catalog-audit/1'
const CHECKER_SCOPE = 'entry'
const ENTRY_CLAIM = 'static'
/** 单个包的硬上限：下载 + 解包 + 检查。超时记 not_run/timeout，不中断整轮。 */
const PACKAGE_TIMEOUT_MS = 180_000
const CHECKER_TIMEOUT_MS = 180_000
const CATALOG_TIMEOUT_MS = 120_000
/** 防 tarball 解压炸弹：解包后总字节上限。 */
const MAX_UNPACKED_BYTES = 256 * 1024 * 1024
const MAX_CHILD_OUTPUT = 64 * 1024 * 1024
const NPM_REGISTRY = 'https://registry.npmjs.org/'
const VALID_STATUSES = new Set(['pass', 'warn', 'incomplete', 'fail'])

const DISCLAIMER =
  'Advisory static sample only: this is not a ranking, score, certification, or security conclusion. '
  + 'It reports what the pinned checker said about a deterministic sample of catalog entries at one point in time; '
  + 'coverage is partial (ENTRY scope, static claim, no execution), and a passing entry is not endorsed by this audit.'

// ---------------------------------------------------------------------------
// 纯函数（tests/audit-catalog.test.mjs 直接测这些）
// ---------------------------------------------------------------------------

/** 目录条目的 npm 包名：只认 `r.npmPackage`；缺省 / 空串 / 非字符串返回 null。 */
export function npmPackageOf(entry) {
  const source = entry && typeof entry === 'object' ? entry.r : null
  if (!source || typeof source !== 'object') return null
  const name = typeof source.npmPackage === 'string' ? source.npmPackage.trim() : ''
  return name === '' ? null : name
}

/** 目录条目的仓库身份（`owner/repo` 或完整 URL）：`r` 支持字符串与对象两种形态。 */
export function catalogRepoOf(entry) {
  const source = entry && typeof entry === 'object' ? entry.r : null
  if (typeof source === 'string') return source.trim() === '' ? null : source.trim()
  if (!source || typeof source !== 'object') return null
  const repo = typeof source.repo === 'string' ? source.repo.trim() : ''
  return repo === '' ? null : repo
}

/**
 * 候选包名：按目录顺序取带 npm 包名的条目，按包名去重（保留首次出现的位置）。
 * 目录顺序即抽样顺序 —— 规则确定，报告里也会写明。
 */
export function candidatePackages(entries) {
  if (!Array.isArray(entries)) return []
  const seen = new Set()
  const names = []
  for (const entry of entries) {
    const name = npmPackageOf(entry)
    if (name === null || seen.has(name)) continue
    seen.add(name)
    names.push(name)
  }
  return names
}

/** `--limit` 归一：非数字回退默认值，越界夹到 [1, MAX_LIMIT]。 */
export function clampLimit(value) {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return DEFAULT_LIMIT
  return Math.max(1, Math.min(MAX_LIMIT, Math.trunc(n)))
}

/** 抽样：目录顺序前 N 个（candidates 已去重）。 */
export function selectSample(candidates, limit) {
  if (!Array.isArray(candidates)) return []
  return candidates.slice(0, clampLimit(limit))
}

/** 把 `github.com/owner/repo(.git)`、`git+https://…`、`git@github.com:…`、`github:owner/repo`、
 *  `owner/repo` 归一为小写 `owner/repo`；识别不出返回 null。只用于归属校验，不联网。 */
export function githubRepoOf(value) {
  if (typeof value !== 'string') return null
  let text = value.trim()
  if (text === '') return null
  text = text.replace(/^git\+/i, '')
  text = text.replace(/^github:/i, '')
  text = text.replace(/\/+$/, '')
  const ssh = /^git@github\.com:(.+)$/i.exec(text)
  if (ssh) return normalizeRepoPath(ssh[1])
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(text)) {
    let url
    try {
      url = new URL(text)
    } catch {
      return null
    }
    if (!/^(www\.)?github\.com$/i.test(url.hostname)) return null
    return normalizeRepoPath(url.pathname)
  }
  if (/^[^/:]+\/[^/]+$/.test(text)) return normalizeRepoPath(text)
  return null
}

/** `owner/repo` 归一（小写、去 `.git` 与尾斜杠）。 */
function normalizeRepoPath(value) {
  const parts = value.replace(/^\/+/, '').replace(/\/+$/, '').split('/')
  if (parts.length < 2) return null
  const owner = parts[0].trim()
  const repo = parts[1].trim().replace(/\.git$/i, '')
  if (owner === '' || repo === '') return null
  return `${owner}/${repo}`.toLowerCase()
}

/** 归属比较：两边都能识别出 `owner/repo` 且相等才算匹配。 */
export function sameRepo(left, right) {
  const a = githubRepoOf(left)
  const b = githubRepoOf(right)
  return a !== null && b !== null && a === b
}

/**
 * checker 结果 → 报告状态。
 * - 运行成功且 conclusion.status 合法 → 原样保留 pass/warn/incomplete/fail；
 * - 超时 / 起不来 / 无非 JSON / 未知状态 → not_run + 原因，绝不让整轮中断。
 * `counts` 取 1.6.9 的 coverage 计数（1.6.9 没有顶层 counts 字段，顶层有则优先）。
 */
export function mapCheckerOutcome({ timedOut = false, spawnError = null, stdout = '', stderr = '', code = null } = {}) {
  if (timedOut) {
    return { status: 'not_run', notRunReason: 'timeout', detail: `checker exceeded ${CHECKER_TIMEOUT_MS} ms` }
  }
  if (spawnError) {
    return { status: 'not_run', notRunReason: 'checker_spawn_failed', detail: String(spawnError.message ?? spawnError) }
  }
  const report = parseJsonObject(stdout)
  if (report === null) {
    const detail = (stderr.trim() || stdout.trim()).slice(-400)
    return {
      status: 'not_run',
      notRunReason: 'unparseable_report',
      detail: detail === '' ? `checker exited ${code} without JSON` : detail,
    }
  }
  const status = report.conclusion && typeof report.conclusion === 'object' ? report.conclusion.status : null
  if (!VALID_STATUSES.has(status)) {
    return { status: 'not_run', notRunReason: 'unexpected_status', detail: `conclusion.status=${String(status)}` }
  }
  const conclusion = report.conclusion
  return {
    status,
    notRunReason: null,
    conclusion: {
      status,
      level: typeof conclusion.level === 'string' ? conclusion.level : null,
      headline: typeof conclusion.headline === 'string' ? conclusion.headline : null,
      reason: typeof conclusion.reason === 'string' ? conclusion.reason : null,
      exitCode: typeof conclusion.exitCode === 'number' ? conclusion.exitCode : null,
    },
    counts: summarizeCounts(report),
    coverage: summarizeCoverage(report),
  }
}

/** 计数：优先顶层 `counts`（未来版本的兼容位），否则从 `coverage` 取同名计数。 */
export function summarizeCounts(report) {
  const source = report && typeof report === 'object' ? report.counts : null
  const coverage = report && typeof report === 'object' ? report.coverage : null
  const pick = (key) => {
    if (source && typeof source === 'object' && typeof source[key] === 'number') return source[key]
    if (coverage && typeof coverage === 'object' && typeof coverage[key] === 'number') return coverage[key]
    return null
  }
  return {
    total: pick('total'),
    pass: pick('pass'),
    warn: pick('warn'),
    fail: pick('fail'),
    na: pick('na'),
    notRun: pick('notRun'),
    error: pick('error'),
    advisory: pick('advisory'),
    partial: pick('partial'),
  }
}

/** coverage 视图（只取报告里要展示的字段）。 */
export function summarizeCoverage(report) {
  const coverage = report && typeof report === 'object' ? report.coverage : null
  if (!coverage || typeof coverage !== 'object') return null
  const entryBlocking = coverage.entryBlocking && typeof coverage.entryBlocking === 'object'
    ? {
        required: typeof coverage.entryBlocking.required === 'number' ? coverage.entryBlocking.required : null,
        pass: coverage.entryBlocking.pass === true,
        notChecked: Array.isArray(coverage.entryBlocking.notChecked) ? coverage.entryBlocking.notChecked : [],
      }
    : null
  return {
    total: numberOrNull(coverage.total),
    checked: numberOrNull(coverage.checked),
    mandatory: numberOrNull(coverage.mandatory),
    notRun: numberOrNull(coverage.notRun),
    partial: numberOrNull(coverage.partial),
    entryBlocking,
  }
}

function numberOrNull(value) {
  return typeof value === 'number' ? value : null
}

/** 从 stdout 里取 checker 的 JSON 对象（容忍 npx 的提示行）；取不到返回 null。 */
export function parseJsonObject(text) {
  if (typeof text !== 'string') return null
  const trimmed = text.trim()
  if (trimmed === '') return null
  const direct = tryParse(trimmed)
  if (direct !== null) return direct
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start === -1 || end <= start) return null
  return tryParse(trimmed.slice(start, end + 1))
}

function tryParseValue(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function tryParse(text) {
  const value = tryParseValue(text)
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : null
}

// ---------------------------------------------------------------------------
// tar.gz 读取（只用 node:zlib，避免新增依赖；只写普通文件与目录）
// ---------------------------------------------------------------------------

function isGzip(buffer) {
  return buffer.length > 2 && buffer[0] === 0x1f && buffer[1] === 0x8b
}

function isZeroBlock(block) {
  for (const byte of block) if (byte !== 0) return false
  return true
}

function readString(buffer, offset, length) {
  let end = offset
  const limit = offset + length
  while (end < limit && buffer[end] !== 0) end += 1
  return buffer.toString('utf8', offset, end)
}

function readSize(field) {
  if ((field[0] & 0x80) !== 0) {
    // base-256：高位标记，其余为大端整数
    let size = 0
    for (let i = 1; i < field.length; i += 1) size = size * 256 + field[i]
    return size
  }
  const text = readString(field, 0, field.length).trim()
  if (text === '') return 0
  const size = Number.parseInt(text, 8)
  if (!Number.isFinite(size) || size < 0) throw new Error(`invalid tar size field: ${text}`)
  return size
}

/** pax 扩展头里取 `path=` 记录；取不到返回 null。 */
function paxPathOf(text) {
  const match = /^\d+ path=([^\n]*)\n/m.exec(text)
  return match === null ? null : match[1]
}

/**
 * 解析 tar（自动 gunzip）为条目列表。只返回普通文件与目录，符号链接/设备一律跳过；
 * 路径穿越直接抛错。测试用构造的小 tar 覆盖这一点。
 */
export function parseTarEntries(buffer, { maxUnpackedBytes = MAX_UNPACKED_BYTES } = {}) {
  const raw = isGzip(buffer) ? gunzipSync(buffer) : buffer
  const entries = []
  let offset = 0
  let unpacked = 0
  let longName = null
  let paxPath = null
  while (offset + 512 <= raw.length) {
    const header = raw.subarray(offset, offset + 512)
    if (isZeroBlock(header)) break
    const size = readSize(header.subarray(124, 136))
    const typeflag = header[156] === 0 ? '0' : String.fromCharCode(header[156])
    const dataStart = offset + 512
    const dataEnd = dataStart + size
    if (dataEnd > raw.length) throw new Error('tar entry extends past end of archive')
    const data = raw.subarray(dataStart, dataEnd)
    offset = dataStart + Math.ceil(size / 512) * 512

    if (typeflag === 'L') {
      longName = readString(data, 0, data.length)
      continue
    }
    if (typeflag === 'x') {
      paxPath = paxPathOf(data.toString('utf8')) ?? paxPath
      continue
    }
    if (typeflag === 'g') continue

    let name = readString(header, 0, 100)
    const prefix = readString(header, 345, 155)
    if (prefix !== '') name = `${prefix}/${name}`
    if (longName !== null) {
      name = longName
      longName = null
    }
    if (paxPath !== null) {
      name = paxPath
      paxPath = null
    }
    const directory = typeflag === '5' || name.endsWith('/')
    if (!directory && typeflag !== '0') continue
    unpacked += size
    if (unpacked > maxUnpackedBytes) throw new Error(`archive exceeds unpacked cap (${maxUnpackedBytes} bytes)`)
    entries.push({ path: name, data: directory ? null : data, directory })
  }
  return entries
}

/** 归档内相对路径 → 目标绝对路径；越界（绝对路径 / `..`）抛错。 */
export function safeExtractPath(root, entryPath) {
  if (typeof entryPath !== 'string' || entryPath.includes('\0')) throw new Error('invalid tar entry path')
  const portable = entryPath.replace(/\\/g, '/')
  if (posix.isAbsolute(portable) || /^[a-z]:\//i.test(portable)) {
    throw new Error(`absolute tar entry path: ${entryPath}`)
  }
  const relative = posix.normalize(portable)
  if (relative === '..' || relative.startsWith('../')) {
    throw new Error(`unsafe tar entry path: ${entryPath}`)
  }
  const target = join(root, ...relative.split('/').filter((part) => part !== '' && part !== '.'))
  const resolvedRoot = resolve(root)
  if (target !== resolvedRoot && !resolve(target).startsWith(resolvedRoot + '/') && !resolve(target).startsWith(resolvedRoot + '\\')) {
    throw new Error(`tar entry escapes extraction root: ${entryPath}`)
  }
  return target
}

async function extractTarball(tarball, destDir) {
  const entries = parseTarEntries(tarball)
  for (const entry of entries) {
    const target = safeExtractPath(destDir, entry.path)
    if (entry.directory) {
      await mkdir(target, { recursive: true })
      continue
    }
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, entry.data, { mode: 0o644 })
  }
  return entries.length
}

// ---------------------------------------------------------------------------
// 子进程
// ---------------------------------------------------------------------------

function npmBin(name) {
  return process.platform === 'win32' ? `${name}.cmd` : name
}

/** 跑一个子进程并收集输出；超时 kill，永不抛（结果里带 timedOut / error）。 */
function runCommand(command, args, { cwd, timeoutMs, env = {} } = {}) {
  return new Promise((resolvePromise) => {
    let child
    try {
      child = spawn(command, args, {
        cwd,
        env: { ...process.env, ...env },
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
      })
    } catch (error) {
      resolvePromise({ code: null, stdout: '', stderr: '', timedOut: false, error })
      return
    }
    let stdout = ''
    let stderr = ''
    let timedOut = false
    let settled = false
    const append = (current, chunk) => {
      const next = current + chunk.toString('utf8')
      return next.length > MAX_CHILD_OUTPUT ? next.slice(-MAX_CHILD_OUTPUT) : next
    }
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, timeoutMs)
    const finish = (result) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolvePromise(result)
    }
    child.stdout.on('data', (chunk) => { stdout = append(stdout, chunk) })
    child.stderr.on('data', (chunk) => { stderr = append(stderr, chunk) })
    child.on('error', (error) => finish({ code: null, stdout, stderr, timedOut, error }))
    child.on('close', (code, signal) => finish({ code, signal, stdout, stderr, timedOut, error: null }))
  })
}

// ---------------------------------------------------------------------------
// 目录来源
// ---------------------------------------------------------------------------

function isHttpUrl(value) {
  return /^https?:\/\//i.test(value)
}

function isFileUrl(value) {
  return /^file:\/\//i.test(value)
}

async function loadCatalog(source) {
  if (isHttpUrl(source)) {
    const response = await fetch(source, {
      redirect: 'follow',
      signal: AbortSignal.timeout(CATALOG_TIMEOUT_MS),
      headers: { accept: 'application/json' },
    })
    if (!response.ok) throw new Error(`catalog HTTP ${response.status}`)
    return { entries: await response.json(), resolvedFrom: 'url' }
  }
  const file = isFileUrl(source) ? fileURLToPath(source) : resolve(source)
  const text = await readFile(file, 'utf8')
  return { entries: JSON.parse(text), resolvedFrom: 'file' }
}

// ---------------------------------------------------------------------------
// 单包审核
// ---------------------------------------------------------------------------

function shortError(text) {
  return text.trim().split('\n').slice(-3).join(' ').slice(0, 400)
}

function classifyPackFailure(result) {
  if (result.timedOut) return { status: 'not_run', notRunReason: 'timeout', detail: `npm pack exceeded ${PACKAGE_TIMEOUT_MS} ms` }
  if (result.error) return { status: 'not_run', notRunReason: 'pack_failed', detail: shortError(String(result.error.message ?? result.error)) }
  const stderr = result.stderr ?? ''
  if (/\bE404\b|404 Not Found|is not in this registry/i.test(stderr)) {
    return { status: 'not_run', notRunReason: 'not_found', detail: shortError(stderr) }
  }
  return { status: 'not_run', notRunReason: 'pack_failed', detail: shortError(stderr) || `npm pack exited ${result.code}` }
}

function packFilenameOf(stdout) {
  const parsed = tryParseValue(stdout.trim())
  if (parsed === null || typeof parsed !== 'object') return null
  const list = Array.isArray(parsed) ? parsed : [parsed]
  for (const item of list) {
    if (item && typeof item.filename === 'string' && item.filename !== '') return item
  }
  return null
}

async function readPackedManifest(packageDir) {
  try {
    const text = await readFile(join(packageDir, 'package.json'), 'utf8')
    const manifest = JSON.parse(text)
    return manifest !== null && typeof manifest === 'object' ? manifest : null
  } catch {
    return null
  }
}

function repositoryValueOf(manifest) {
  const repository = manifest?.repository
  if (typeof repository === 'string') return repository
  if (repository && typeof repository === 'object' && typeof repository.url === 'string') return repository.url
  return null
}

async function auditPackage(name, ctx) {
  const started = Date.now()
  const slug = createHash('sha1').update(name).digest('hex').slice(0, 12)
  const workDir = join(ctx.tempRoot, `${ctx.index}-${slug}`)
  await mkdir(workDir, { recursive: true })
  const base = {
    name,
    catalog: ctx.catalog,
    durationMs: 0,
    checkerVersion: CHECKER_VERSION,
    status: 'not_run',
    notRunReason: null,
    detail: null,
  }

  const packArgs = [
    'pack', name,
    '--ignore-scripts',
    '--json',
    `--registry=${NPM_REGISTRY}`,
    '--pack-destination', workDir,
  ]
  const packed = await runCommand(npmBin('npm'), packArgs, { cwd: workDir, timeoutMs: PACKAGE_TIMEOUT_MS })
  if (packed.timedOut || packed.error || packed.code !== 0) {
    return { ...base, ...classifyPackFailure(packed), durationMs: Date.now() - started }
  }
  const packedInfo = packFilenameOf(packed.stdout)
  if (packedInfo === null) {
    return { ...base, ...classifyPackFailure({ ...packed, stderr: packed.stderr || packed.stdout }), durationMs: Date.now() - started }
  }
  const tarballName = basename(packedInfo.filename)
  const npmMeta = {
    version: typeof packedInfo.version === 'string' ? packedInfo.version : null,
    tarball: tarballName,
    unpackedSize: typeof packedInfo.unpackedSize === 'number' ? packedInfo.unpackedSize : null,
  }

  let tarball
  try {
    tarball = await readFile(join(workDir, tarballName))
  } catch (error) {
    return { ...base, npm: npmMeta, status: 'not_run', notRunReason: 'pack_failed', detail: `tarball missing: ${shortError(String(error.message ?? error))}`, durationMs: Date.now() - started }
  }

  const extractDir = join(workDir, 'package')
  try {
    await mkdir(extractDir, { recursive: true })
    await extractTarball(tarball, extractDir)
  } catch (error) {
    return { ...base, npm: npmMeta, status: 'not_run', notRunReason: 'extract_failed', detail: shortError(String(error.message ?? error)), durationMs: Date.now() - started }
  }

  const packageDir = join(extractDir, 'package')
  const manifest = await readPackedManifest(packageDir)
  const npmRepository = repositoryValueOf(manifest)
  const npm = { ...npmMeta, repository: npmRepository }
  const catalogRepo = ctx.catalog.repo
  if (catalogRepo !== null) {
    if (!sameRepo(catalogRepo, npmRepository)) {
      return {
        ...base,
        npm,
        status: 'not_run',
        notRunReason: 'repository_mismatch',
        detail: `catalog repo ${catalogRepo} vs npm repository ${npmRepository === null ? '(missing)' : npmRepository}`,
        durationMs: Date.now() - started,
      }
    }
  }

  const checkerStarted = Date.now()
  const checkerArgs = [
    '-y', CHECKER_SPEC,
    'check', packageDir,
    '--scope', CHECKER_SCOPE,
    '--entry-claim', ENTRY_CLAIM,
    '--no-exec',
    '--json',
  ]
  const checked = await runCommand(npmBin('npx'), checkerArgs, { cwd: workDir, timeoutMs: CHECKER_TIMEOUT_MS })
  const outcome = mapCheckerOutcome(checked)
  return {
    ...base,
    npm,
    status: outcome.status,
    notRunReason: outcome.notRunReason,
    detail: outcome.detail ?? null,
    conclusion: outcome.conclusion ?? null,
    counts: outcome.counts ?? null,
    coverage: outcome.coverage ?? null,
    checkerDurationMs: Date.now() - checkerStarted,
    durationMs: Date.now() - started,
  }
}

// ---------------------------------------------------------------------------
// 报告
// ---------------------------------------------------------------------------

/** 汇总：总数 / checked / not_run / 状态分布 / not_run 原因分布。 */
export function summarizeReport(packages) {
  const totals = {
    selected: packages.length,
    checked: 0,
    notRun: 0,
    statusCounts: { pass: 0, warn: 0, incomplete: 0, fail: 0, not_run: 0 },
    notRunReasons: {},
    checkerSeconds: 0,
  }
  for (const pkg of packages) {
    totals.statusCounts[pkg.status] = (totals.statusCounts[pkg.status] ?? 0) + 1
    if (pkg.status === 'not_run') {
      totals.notRun += 1
      const reason = pkg.notRunReason ?? 'unknown'
      totals.notRunReasons[reason] = (totals.notRunReasons[reason] ?? 0) + 1
    } else {
      totals.checked += 1
    }
    totals.checkerSeconds += (pkg.checkerDurationMs ?? 0) / 1000
  }
  totals.checkerSeconds = Math.round(totals.checkerSeconds * 10) / 10
  return totals
}

function mdCell(value) {
  return String(value ?? '—').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim()
}

export function renderStepSummary(report) {
  const { totals } = report
  const lines = []
  lines.push('# Catalog audit — advisory static sample')
  lines.push('')
  lines.push(`> ${DISCLAIMER}`)
  lines.push('')
  lines.push('## What ran')
  lines.push('')
  lines.push(`- Catalog source: \`${report.catalog.source}\` (${report.catalog.resolvedFrom}${report.catalog.error ? `, error: ${mdCell(report.catalog.error)}` : ''})`)
  lines.push(`- Catalog entries: ${report.catalog.entries} total, ${report.catalog.withNpmPackage} with an npm package name, ${report.catalog.uniqueNpmPackages} unique`)
  lines.push(`- Sampling rule: ${report.sampling.rule}`)
  lines.push(`- Sample size: ${report.sampling.selected} of ${report.sampling.candidates} candidates (requested limit ${report.sampling.requestedLimit}, applied ${report.sampling.appliedLimit})`)
  lines.push(`- Checker: \`${CHECKER_SPEC}\` — \`check <dir> --scope entry --entry-claim static --no-exec --json\``)
  lines.push(`- Generated: ${report.generatedAt}`)
  lines.push('')
  lines.push('## Totals')
  lines.push('')
  lines.push('| Metric | Count |')
  lines.push('| --- | --- |')
  lines.push(`| selected | ${totals.selected} |`)
  lines.push(`| checked | ${totals.checked} |`)
  lines.push(`| not_run | ${totals.notRun} |`)
  for (const status of ['pass', 'warn', 'incomplete', 'fail']) {
    lines.push(`| conclusion.status = ${status} | ${totals.statusCounts[status] ?? 0} |`)
  }
  lines.push('')
  lines.push('## not_run reasons')
  lines.push('')
  const reasons = Object.entries(totals.notRunReasons).sort((a, b) => b[1] - a[1])
  if (reasons.length === 0) {
    lines.push('None.')
  } else {
    lines.push('| Reason | Count |')
    lines.push('| --- | --- |')
    for (const [reason, count] of reasons) lines.push(`| ${mdCell(reason)} | ${count} |`)
  }
  lines.push('')
  lines.push('## Per-package results')
  lines.push('')
  lines.push('| # | Package | Status | Checker verdict | Checker time |')
  lines.push('| --- | --- | --- | --- | --- |')
  report.packages.forEach((pkg, index) => {
    // 通过项只显示 level（reason 里是每次相同的 partial/advisory 说明），
    // warn/fail 显示 reason，not_run 显示原因 + 细节。
    const verdict = pkg.status === 'not_run'
      ? `${pkg.notRunReason ?? 'unknown'}${pkg.detail ? `: ${pkg.detail}` : ''}`
      : pkg.status === 'pass'
        ? (pkg.conclusion?.level ?? 'pass')
        : (pkg.conclusion?.reason ?? pkg.conclusion?.level ?? '')
    const time = pkg.checkerDurationMs === undefined ? '—' : `${(pkg.checkerDurationMs / 1000).toFixed(1)}s`
    lines.push(`| ${index + 1} | \`${mdCell(pkg.name)}\` | ${pkg.status} | ${mdCell(verdict).slice(0, 240)} | ${time} |`)
  })
  lines.push('')
  lines.push('## Boundaries')
  lines.push('')
  lines.push('- Read-only: entries are downloaded with `npm pack` (`--ignore-scripts`, no install) into `os.tmpdir()`; the temporary tree is removed at the end of the run.')
  lines.push('- No package code is executed: the checker runs with `--no-exec` and reports static ENTRY checks only.')
  lines.push('- Advisory and non-blocking: this job is `workflow_dispatch`-only, holds `contents: read`, does not comment, commit, or change the catalog, admission rules, or ordering.')
  lines.push('- Not a ranking, score, certification, or security conclusion; `not_run` means "not assessed here", not "bad".')
  lines.push('')
  return `${lines.join('\n')}\n`
}

function buildReport({ source, resolvedFrom, catalogError, entries, candidates, requestedLimit, appliedLimit, packages, startedAt }) {
  const sample = packages.map((pkg) => pkg.name)
  return {
    schema: REPORT_SCHEMA,
    advisory: true,
    readOnly: true,
    disclaimer: DISCLAIMER,
    generatedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    catalog: {
      source,
      resolvedFrom,
      error: catalogError,
      entries: Array.isArray(entries) ? entries.length : 0,
      withNpmPackage: Array.isArray(entries) ? entries.filter((entry) => npmPackageOf(entry) !== null).length : 0,
      uniqueNpmPackages: candidates.length,
    },
    sampling: {
      rule: 'catalog order as returned by the source; first N unique npm package names (entries without an npm package name are skipped)',
      requestedLimit,
      appliedLimit,
      candidates: candidates.length,
      selected: sample.length,
    },
    checker: {
      spec: CHECKER_SPEC,
      version: CHECKER_VERSION,
      scope: CHECKER_SCOPE,
      entryClaim: ENTRY_CLAIM,
      noExec: true,
      command: `npx -y ${CHECKER_SPEC} check <dir> --scope ${CHECKER_SCOPE} --entry-claim ${ENTRY_CLAIM} --no-exec --json`,
    },
    totals: summarizeReport(packages),
    packages,
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const options = { limit: String(DEFAULT_LIMIT), catalog: DEFAULT_CATALOG, out: process.cwd(), help: false }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const take = () => {
      const value = argv[i + 1]
      if (value === undefined || value.startsWith('--')) throw new Error(`missing value for ${arg}`)
      i += 1
      return value
    }
    if (arg === '--help' || arg === '-h') options.help = true
    else if (arg === '--limit') options.limit = take()
    else if (arg.startsWith('--limit=')) options.limit = arg.slice('--limit='.length)
    else if (arg === '--catalog') options.catalog = take()
    else if (arg.startsWith('--catalog=')) options.catalog = arg.slice('--catalog='.length)
    else if (arg === '--out') options.out = take()
    else if (arg.startsWith('--out=')) options.out = arg.slice('--out='.length)
    else throw new Error(`unknown argument: ${arg}`)
  }
  return options
}

function usage() {
  return `Usage: node scripts/audit-catalog.mjs [options]

Options:
  --limit <n>        Number of npm-backed catalog entries to sample (default ${DEFAULT_LIMIT}, max ${MAX_LIMIT})
  --catalog <src>    Catalog JSON: http(s) URL, file path, or file:// URL
                     (default ${DEFAULT_CATALOG})
  --out <dir>        Directory for audit-report.json and step-summary.md (default: cwd)
  -h, --help         Show this help

The audit is read-only and advisory: it always exits 0, never executes package
code, and its output is not a ranking, score, certification, or security conclusion.
`
}

async function main() {
  const startedAt = Date.now()
  let options
  try {
    options = parseArgs(process.argv.slice(2))
  } catch (error) {
    process.stderr.write(`audit-catalog: ${error.message}\n\n${usage()}`)
    return
  }
  if (options.help) {
    process.stdout.write(usage())
    return
  }

  const requestedLimit = Number(options.limit)
  const appliedLimit = clampLimit(options.limit)
  const outDir = resolve(options.out)
  await mkdir(outDir, { recursive: true })

  let entries = []
  let resolvedFrom = isHttpUrl(options.catalog) ? 'url' : 'file'
  let catalogError = null
  try {
    const loaded = await loadCatalog(options.catalog)
    entries = loaded.entries
    resolvedFrom = loaded.resolvedFrom
    if (!Array.isArray(entries)) throw new Error('catalog JSON is not an array')
  } catch (error) {
    catalogError = String(error.message ?? error)
    process.stderr.write(`audit-catalog: catalog unavailable (${catalogError}); writing an empty advisory report\n`)
  }

  const candidates = candidatePackages(entries)
  const selected = selectSample(candidates, appliedLimit)
  const tempRoot = await mkdtemp(join(tmpdir(), 'dsh-catalog-audit-'))
  const packages = []
  try {
    for (let index = 0; index < selected.length; index += 1) {
      const name = selected[index]
      const entry = entries.find((item) => npmPackageOf(item) === name)
      const catalog = { slug: typeof entry?.s === 'string' ? entry.s : null, repo: catalogRepoOf(entry) }
      process.stderr.write(`audit-catalog: [${index + 1}/${selected.length}] ${name}\n`)
      try {
        packages.push(await auditPackage(name, { tempRoot, index: index + 1, catalog }))
      } catch (error) {
        // 单包异常绝不中断整轮
        packages.push({
          name,
          catalog,
          status: 'not_run',
          notRunReason: 'internal_error',
          detail: shortError(String(error.message ?? error)),
          durationMs: 0,
          checkerVersion: CHECKER_VERSION,
        })
      }
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true })
  }

  const report = buildReport({
    source: options.catalog,
    resolvedFrom,
    catalogError,
    entries,
    candidates,
    requestedLimit: Number.isFinite(requestedLimit) ? requestedLimit : DEFAULT_LIMIT,
    appliedLimit,
    packages,
    startedAt,
  })
  await writeFile(join(outDir, 'audit-report.json'), `${JSON.stringify(report, null, 2)}\n`)
  await writeFile(join(outDir, 'step-summary.md'), renderStepSummary(report))

  const totals = report.totals
  process.stderr.write(
    `audit-catalog: done — selected ${totals.selected}, checked ${totals.checked}, not_run ${totals.notRun}`
    + ` (pass ${totals.statusCounts.pass}, warn ${totals.statusCounts.warn},`
    + ` incomplete ${totals.statusCounts.incomplete}, fail ${totals.statusCounts.fail})\n`,
  )
  process.stderr.write(`audit-catalog: wrote ${join(outDir, 'audit-report.json')} and ${join(outDir, 'step-summary.md')}\n`)
}

const invokedDirectly = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invokedDirectly) {
  main()
    .catch((error) => {
      // advisory：内部异常也只打印，不改变退出码（workflow 不是 required check）
      process.stderr.write(`audit-catalog: internal error: ${error?.stack ?? error}\n`)
    })
    .finally(() => {
      process.exitCode = 0
    })
}

export { auditPackage, extractTarball, loadCatalog }
