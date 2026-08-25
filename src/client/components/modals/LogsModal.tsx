/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Built-in log viewer dialog: no external software needed — the app opens
 * its own window and loads the local system log (JSONL at
 * ~/.dsh/profiles/<profile>/hub.log) straight from the server, one page at
 * a time.
 *
 * Every line is categorized twice: a function area (install / uninstall /
 * update / diagnostics / settings / system) and a severity level (debug /
 * info / success / warn / error). Filtering on both axes lets you target,
 * say, only install errors — so the exact incompatible step of an install
 * (or uninstall) is easy to spot. Search narrows by event code or message.
 *
 * Server pagination: GET /dsh-plugin-hub/logs?offset=&limit=&category=
 * &level=&query= → { entries, total, hasMore, path }. The footer shows the
 * real file location and reveals it in the system file manager.
 */
import { createElement as h, useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import styles from '../../styles/Modal.module.css'
import view from '../../styles/LogsView.module.css'
import type { Translate } from '../../types.ts'
import { openLogFile } from '../../data/host.ts'
import { CloseIcon } from '../ui/icons.tsx'

/** 与服务端 /logs 返回的 LogEntry 对齐的客户端投影。 */
export interface LogEntryView {
  /** 毫秒时间戳 */
  at: number
  level: 'debug' | 'info' | 'success' | 'warn' | 'error'
  category: 'install' | 'uninstall' | 'update' | 'diagnostics' | 'settings' | 'system'
  /** 机器可读事件码，如 install.start */
  event: string
  message: string
}

export type LogCategoryFilter = 'all' | LogEntryView['category']
export type LogLevelFilter = 'all' | LogEntryView['level']

const PAGE = 100

/** 类别筛选标签：值 → 语言包 key（弹窗内 chip 与行内类别徽章共用）。 */
const CAT_LABEL: Record<LogEntryView['category'], string> = {
  install: 'logCatInstall',
  uninstall: 'logCatUninstall',
  update: 'logCatUpdate',
  diagnostics: 'logCatDiagnostics',
  settings: 'logCatSettings',
  system: 'logCatSystem',
}

const CAT_FILTERS: Array<{ value: LogCategoryFilter; key: string }> = [
  { value: 'all', key: 'logCatAll' },
  { value: 'install', key: 'logCatInstall' },
  { value: 'uninstall', key: 'logCatUninstall' },
  { value: 'update', key: 'logCatUpdate' },
  { value: 'diagnostics', key: 'logCatDiagnostics' },
  { value: 'settings', key: 'logCatSettings' },
  { value: 'system', key: 'logCatSystem' },
]

const LEVEL_FILTERS: Array<{ value: LogLevelFilter; key: string }> = [
  { value: 'all', key: 'logLvAll' },
  { value: 'error', key: 'logLvError' },
  { value: 'warn', key: 'logLvWarn' },
  { value: 'success', key: 'logLvSuccess' },
  { value: 'info', key: 'logLvInfo' },
  { value: 'debug', key: 'logLvDebug' },
]

/** 级别徽章文案：弹窗 chip 与行内级别徽章共用同一语言包 key。 */
const LEVEL_LABEL: Record<LogEntryView['level'], string> = {
  debug: 'logLvDebug',
  info: 'logLvInfo',
  success: 'logLvSuccess',
  warn: 'logLvWarn',
  error: 'logLvError',
}

/** 时间：YYYY-MM-DD HH:mm:ss（每条都精确到秒）。 */
export function fmtLogTime(at: number): string {
  const d = new Date(at)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** 导出文件名时间戳：2026-08-24_21-35-00。 */
function fmtFileStamp(at: number): string {
  const d = new Date(at)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`
}

/** 单条日志行：时间 + 级别徽章 + 类别徽章 + 事件码 + 描述。查看器弹窗与设置页预览共用。 */
export function LogEntryRow({ e, t }: { e: LogEntryView; t: Translate }) {
  return h('div', { className: view.entry, title: e.message },
    h('span', { className: view.time }, fmtLogTime(e.at)),
    h('span', { className: `${view.badge} ${view[`badge${e.level}`]}` }, t(LEVEL_LABEL[e.level])),
    h('span', { className: `${view.catBadge} ${view[`cat${e.category}`]}` }, t(CAT_LABEL[e.category])),
    h('span', { className: view.event }, e.event),
    h('span', { className: view.message }, e.message),
  )
}

export function LogsModal({ t, onClose }: {
  t: Translate
  onClose: () => void
}) {
  const [category, setCategory] = useState<LogCategoryFilter>('all')
  const [level, setLevel] = useState<LogLevelFilter>('all')
  const [query, setQuery] = useState('')
  const [entries, setEntries] = useState<LogEntryView[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [path, setPath] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [opening, setOpening] = useState(false)
  const [openFailed, setOpenFailed] = useState(false)
  const offsetRef = useRef(0)

  /** 拉一页：过滤参数取当前 state，偏移量由调用方给出。 */
  const fetchPage = useCallback(async (offset: number): Promise<{ entries: LogEntryView[]; total: number; hasMore: boolean; path: string } | null> => {
    try {
      const qs = new URLSearchParams({ offset: String(offset), limit: String(PAGE) })
      if (category !== 'all') qs.set('category', category)
      if (level !== 'all') qs.set('level', level)
      const q = query.trim()
      if (q !== '') qs.set('query', q)
      const res = await fetch(`/dsh-plugin-hub/logs?${qs.toString()}`, { cache: 'no-store' })
      if (!res.ok) return null
      return await res.json() as { entries: LogEntryView[]; total: number; hasMore: boolean; path: string }
    } catch {
      return null
    }
  }, [category, level, query])

  /** 从第一页重新加载（换筛选/搜索时）。 */
  const reload = useCallback(async () => {
    setLoading(true)
    const data = await fetchPage(0)
    if (data === null) {
      setError(true)
      setLoading(false)
      return
    }
    offsetRef.current = data.entries.length
    setEntries(data.entries)
    setTotal(data.total)
    setHasMore(data.hasMore)
    if (data.path !== '') setPath(data.path)
    setError(false)
    setLoading(false)
  }, [fetchPage])

  /** 追加下一页（「加载更多」）。 */
  const loadMore = useCallback(async () => {
    if (loading) return
    setLoading(true)
    const data = await fetchPage(offsetRef.current)
    if (data === null) {
      setError(true)
      setLoading(false)
      return
    }
    offsetRef.current += data.entries.length
    setEntries((prev) => [...prev, ...data.entries])
    setTotal(data.total)
    setHasMore(data.hasMore)
    setLoading(false)
  }, [fetchPage, loading])

  // 首次进入 + 类别/级别/搜索变化（搜索 280ms 防抖）都重查第一页
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      void reload()
      return
    }
    const id = window.setTimeout(() => { void reload() }, 280)
    return () => window.clearTimeout(id)
  }, [reload])

  /** 在系统文件管理器中定位日志文件（服务端 spawn open）。 */
  const openFile = async () => {
    if (opening) return
    setOpening(true)
    setOpenFailed(false)
    const ok = await openLogFile()
    setOpening(false)
    if (!ok) setOpenFailed(true)
  }

  /** 导出：拼纯文本 → Blob → 触发浏览器下载 .log 文件 */
  const exportFile = () => {
    const text = entries.map((e) => `[${fmtLogTime(e.at)}] [${e.level}] [${e.category}] [${e.event}] ${e.message}`).join('\n')
    if (text === '') return
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dsh-plugin-hub-log-${fmtFileStamp(Date.now())}.log`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
  },
    h('div', { className: `${styles.errorModal} ${styles.logModal}`, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        h('div', { className: styles.modalTitle }, t('logModalTitle')),
        h('button', {
          className: styles.modalClose,
          'aria-label': t('errorClose'),
          onClick: onClose,
        }, h(CloseIcon)),
      ),
      h('div', { className: styles.modalBody },
        // 类别筛选行：安装/卸载/更新… 功能域区分
        h('div', { className: view.filterBar },
          CAT_FILTERS.map((f) => h('button', {
            key: f.value,
            type: 'button',
            className: category === f.value ? `${view.filterChip} ${view.filterChipActive}` : view.filterChip,
            onClick: () => setCategory(f.value),
          }, t(f.key))),
        ),
        // 级别筛选行 + 搜索框：按级别区分报错与正常，便于针对性排查
        h('div', { className: view.filterBar },
          LEVEL_FILTERS.map((f) => h('button', {
            key: f.value,
            type: 'button',
            className: level === f.value ? `${view.filterChip} ${view.filterChipActive}` : view.filterChip,
            onClick: () => setLevel(f.value),
          }, t(f.key))),
          h('div', { className: view.search },
            h('input', {
              className: view.searchInput,
              type: 'search',
              value: query,
              placeholder: t('logSearchPlaceholder'),
              'aria-label': t('logSearchPlaceholder'),
              onChange: (e) => setQuery((e.target as HTMLInputElement).value),
            }),
          ),
        ),
        h('div', { className: view.logList },
          error
            ? h('div', { className: view.empty }, t('logsLoadFail'))
            : loading && entries.length === 0
              ? h('div', { className: view.empty }, t('logsLoading'))
              : entries.length === 0
                ? h('div', { className: view.empty }, t('logEmptyFilter'))
                : entries.map((e, i) => h(LogEntryRow, { key: `${e.at}-${i}`, e, t })),
          // 分页：还有就「加载更多」，拉完了给个总数收尾
          entries.length > 0 && (hasMore
            ? h('button', {
              type: 'button',
              className: view.more,
              disabled: loading,
              onClick: () => void loadMore(),
            }, loading ? t('logsLoading') : t('logLoadMore'))
            : h('div', { className: view.moreEnd }, t('logNoMore', { n: total }))),
        ),
      ),
      // 底部：日志真实路径 + 打开文件 / 导出日志
      h('div', { className: view.foot },
        h('span', { className: view.footPath, title: path },
          `${t('logPathLabel')}: ${path === '' ? '…' : path}`),
        openFailed
          ? h('span', { className: view.footFail }, t('logOpenFileFail'))
          : h('span', { className: view.footCount }, t('logCount', { n: total })),
        h('div', { className: view.footActions },
          h('button', {
            type: 'button',
            className: view.btn,
            disabled: opening || path === '',
            title: t('logOpenFileTip'),
            onClick: () => void openFile(),
          }, t('logOpenFile')),
          h('button', {
            type: 'button',
            className: `${view.btn} ${view.btnPrimary}`,
            disabled: entries.length === 0,
            onClick: exportFile,
          }, t('logsExport')),
        ),
      ),
    ),
  )
}
