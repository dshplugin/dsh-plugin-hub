/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 系统日志：把关键操作以 JSONL 追加到 `~/.dsh/profiles/<profile>/hub.log`。
 *
 * 每一条日志 = 级别（严重程度）× 类别（功能域）：
 *   level    debug / info / success / warn / error —— 区分报错与正常
 *   category install（安装）/ uninstall（卸载）/ update（更新，预留）/
 *            diagnostics（诊断）/ settings（设置）/ system（系统）
 * 查看器按级别与类别过滤，就能针对性排查「安装时哪步不兼容」还是
 * 「卸载时哪步不兼容」。读取时超行数上限就地裁剪，防文件无限膨胀；
 * 写入失败绝不影响主流程（日志是辅助设施）。
 */
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { homedir } from 'node:os'
import { loadSettings } from './settings.ts'

export type LogCategory = 'install' | 'uninstall' | 'update' | 'diagnostics' | 'settings' | 'system'
export type LogLevel = 'debug' | 'info' | 'success' | 'warn' | 'error'

export interface LogEntry {
  /** 毫秒时间戳 */
  at: number
  level: LogLevel
  category: LogCategory
  /** 机器可读事件码，如 install.start / settings.update */
  event: string
  /** 人类可读描述 */
  message: string
}

/** 日志保留上限：超过后在读取时裁剪为最近 MAX_LOG_LINES 条 */
export const MAX_LOG_LINES = 2000

const CATEGORIES: LogCategory[] = ['install', 'uninstall', 'update', 'diagnostics', 'settings', 'system']

export interface ReadLogOptions {
  /** 分页偏移（过滤后倒序） */
  offset?: number
  limit?: number
  category?: LogCategory | 'all'
  level?: LogLevel | 'all'
  /** 关键词：大小写不敏感，匹配事件码或描述 */
  query?: string
}

export interface ReadLogResult {
  /** 倒序（最新在前） */
  entries: LogEntry[]
  /** 过滤后的总条数（分页前） */
  total: number
}

function profileDirectory(profile: string): string {
  return join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'profiles', profile)
}

/** `~` 开头路径展开为用户主目录（Node 不自动展开）。 */
function expandHome(p: string): string {
  if (p === '~') return homedir()
  if (p.startsWith('~/') || p.startsWith('~\\')) return join(homedir(), p.slice(2))
  return p
}

/**
 * 把用户填写的日志位置覆盖解析成实际文件路径：
 * 以 .log 结尾视为文件本身，否则视为目录并在其中写 hub.log；相对路径按当前目录归一化。
 */
export function customLogFile(override: string): string {
  const trimmed = override.trim()
  const expanded = expandHome(trimmed)
  const file = /\.log$/i.test(expanded) ? expanded : join(expanded, 'hub.log')
  return resolve(file)
}

/**
 * 真正默认的日志文件路径：`~/.dsh/profiles/<profile>/hub.log`（不受设置覆盖影响）。
 * 弹窗「恢复默认」、目录选择器起点等需要「未自定义时的位置」都从这里取 ——
 * 不同机器/平台（用户主目录不同）这个值都不同，必须动态计算而非写死。
 */
export function defaultLogFilePath(profile: string): string {
  return join(profileDirectory(profile), 'hub.log')
}

/**
 * 当前生效的日志文件路径：设置里填了 logPath 用自定义位置（目录或文件），
 * 否则默认 `~/.dsh/profiles/<profile>/hub.log`。默认位置永远合法可用，无需用户干预。
 */
export function logFilePath(profile: string): string {
  const custom = loadSettings(profile).logPath?.trim() ?? ''
  return custom === '' ? defaultLogFilePath(profile) : customLogFile(custom)
}

/** 追加一条系统日志（JSONL 一行一条）。 */
export function appendLog(profile: string, entry: LogEntry): void {
  try {
    const file = logFilePath(profile)
    mkdirSync(dirname(file), { recursive: true })
    appendFileSync(file, `${JSON.stringify(entry)}\n`)
  } catch {
    // 日志失败不阻断主流程
  }
}

/** 兼容旧格式：早期无 category（level 用 info/ok/fail/warn），归一化到新版。 */
function normalize(raw: unknown): LogEntry | null {
  if (typeof raw !== 'object' || raw === null) return null
  const e = raw as { at?: unknown; level?: unknown; category?: unknown; event?: unknown; message?: unknown }
  if (typeof e.at !== 'number') return null
  let level: LogLevel = 'info'
  if (e.level === 'ok' || e.level === 'success') level = 'success'
  else if (e.level === 'fail' || e.level === 'error') level = 'error'
  else if (e.level === 'warn') level = 'warn'
  else if (e.level === 'debug') level = 'debug'
  const category: LogCategory = CATEGORIES.includes(e.category as LogCategory) ? e.category as LogCategory : 'system'
  return {
    at: e.at,
    level,
    category,
    event: typeof e.event === 'string' ? e.event : '',
    message: typeof e.message === 'string' ? e.message : '',
  }
}

/** 读取系统日志（按时间正序，最新在末尾），超上限就地裁剪；支持过滤与分页。 */
export function readLog(profile: string, opts: ReadLogOptions = {}): ReadLogResult {
  const { offset = 0, limit = 200 } = opts
  try {
    const file = logFilePath(profile)
    const raw = readFileSync(file, 'utf8')
    let lines = raw.split('\n').filter((l) => l.trim() !== '')
    if (lines.length > MAX_LOG_LINES) {
      lines = lines.slice(-MAX_LOG_LINES)
      writeFileSync(file, `${lines.join('\n')}\n`)
    }
    // 正序解析后倒序（最新在前）再过滤分页
    let entries: LogEntry[] = []
    for (const line of lines) {
      let parsed: unknown = null
      try {
        parsed = JSON.parse(line)
      } catch {
        continue
      }
      const entry = normalize(parsed)
      if (entry !== null) entries.push(entry)
    }
    entries.reverse()
    const needle = opts.query?.trim().toLowerCase() ?? ''
    if (opts.category !== undefined && opts.category !== 'all') {
      entries = entries.filter((e) => e.category === opts.category)
    }
    if (opts.level !== undefined && opts.level !== 'all') {
      entries = entries.filter((e) => e.level === opts.level)
    }
    if (needle !== '') {
      entries = entries.filter((e) => e.event.toLowerCase().includes(needle) || e.message.toLowerCase().includes(needle))
    }
    const total = entries.length
    return { entries: entries.slice(offset, offset + limit), total }
  } catch {
    return { entries: [], total: 0 }
  }
}
