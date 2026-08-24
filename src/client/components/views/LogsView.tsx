/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 系统日志入口视图：不在这里堆全文，而是给出「打开日志查看器」窗口入口 +
 * 日志文件真实路径（可一键在系统文件管理器中定位）+ 最近若干条预览。
 * 完整阅读/筛选/分页在 LogsModal 内置查看器弹窗里完成 —— 无需借助任何
 * 外部软件，点击即弹出自己的窗口加载本地 JSONL 日志。
 */
import { createElement as h, useCallback, useEffect, useRef, useState } from 'react'
import styles from '../../styles/LogsView.module.css'
import type { Translate } from '../../types.ts'
import { openLogFile } from '../../data/host.ts'
import { LogsModal, LogEntryRow, fmtLogTime, type LogEntryView } from '../modals/LogsModal.tsx'
import { LogsPathModal } from '../modals/LogsPathModal.tsx'

/** 设置页预览条数：只放最近一小段，给用户快速感观，完整内容进查看器。 */
const PREVIEW = 12

export function LogsView({ t, onCopy, logPath, onLogPathSaved }: {
  t: Translate
  onCopy: (text: string) => void
  /** 设置里已保存的日志位置覆盖（空串 = 默认位置） */
  logPath: string
  /** 保存自定义日志位置（写入设置，服务端同时预建目录验证可写） */
  onLogPathSaved: (value: string) => void
}) {
  const [entries, setEntries] = useState<LogEntryView[]>([])
  const [path, setPath] = useState('')
  // 真正默认位置（~/.dsh/profiles/<profile>/hub.log，跨机器/平台动态）：弹窗「恢复默认」用
  const [defaultPath, setDefaultPath] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(false)
  const [opening, setOpening] = useState(false)
  const [openFailed, setOpenFailed] = useState(false)
  // 日志存放位置弹窗：点「修改」打开，手输或选目录
  const [showPathModal, setShowPathModal] = useState(false)
  const mountedRef = useRef(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/dsh-plugin-hub/logs', { cache: 'no-store' })
      if (!res.ok) throw new Error(`http ${res.status}`)
      const data = await res.json() as { entries: LogEntryView[]; path: string; defaultPath?: string }
      if (mountedRef.current) {
        setEntries(data.entries)
        if (data.path !== '') setPath(data.path)
        if (data.defaultPath !== undefined) setDefaultPath(data.defaultPath)
        setError(false)
      }
    } catch {
      if (mountedRef.current) setError(true)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    void load()
    return () => { mountedRef.current = false }
  }, [load])

  /** 复制全文：完整日志的纯文本，粘贴给作者分析 bug。 */
  const copyAll = () => {
    const text = entries.map((e) => `[${fmtLogTime(e.at)}] [${e.level}] [${e.category}] [${e.event}] ${e.message}`).join('\n')
    if (text !== '') onCopy(text)
  }

  /** 导出：拼纯文本 → Blob → 触发浏览器下载 .log 文件 */
  const exportFile = () => {
    const text = entries.map((e) => `[${fmtLogTime(e.at)}] [${e.level}] [${e.category}] [${e.event}] ${e.message}`).join('\n')
    if (text === '') return
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dsh-plugin-hub-log.log'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  /** 在系统文件管理器中定位日志文件。 */
  const openFile = async () => {
    if (opening) return
    setOpening(true)
    setOpenFailed(false)
    const ok = await openLogFile()
    setOpening(false)
    if (!ok) setOpenFailed(true)
  }

  const preview = entries.slice(0, PREVIEW)
  return h('div', { className: styles.panel },
    h('div', { className: styles.head },
      h('span', { className: styles.headHint }, t('logsHeadHint')),
      h('div', { className: styles.actions },
        h('button', {
          type: 'button',
          className: `${styles.btn} ${styles.btnPrimary}`,
          onClick: () => setOpen(true),
        }, t('logViewerOpen')),
        h('button', { type: 'button', className: styles.btn, disabled: entries.length === 0, onClick: copyAll }, t('logsCopy')),
        h('button', { type: 'button', className: styles.btn, disabled: entries.length === 0, onClick: exportFile }, t('logsExport')),
        h('button', { type: 'button', className: styles.btn, disabled: loading, onClick: () => void load() }, t('logsRefresh')),
      ),
    ),
    // 日志存放位置：一行展示真实路径 + 「修改」弹窗编辑（手输 / 选目录）+ 一键定位文件
    h('div', { className: styles.pathRow },
      h('span', { className: styles.pathLabel }, t('logPathSettingTitle')),
      h('span', { className: styles.pathText, title: path }, path === '' ? '…' : path),
      openFailed && h('span', { className: styles.footFail }, t('logOpenFileFail')),
      h('button', {
        type: 'button',
        className: styles.btn,
        onClick: () => setShowPathModal(true),
      }, t('logPathChange')),
      h('button', {
        type: 'button',
        className: styles.btn,
        disabled: opening || path === '',
        title: t('logOpenFileTip'),
        onClick: () => void openFile(),
      }, t('logOpenFile')),
    ),
    error
      ? h('div', { className: styles.empty }, t('logsLoadFail'))
      : loading && entries.length === 0
        ? h('div', { className: styles.empty }, t('logsLoading'))
        : entries.length === 0
          ? h('div', { className: styles.empty }, t('logsEmpty'))
          : h('div', { className: styles.list },
            preview.map((e, i) => h('button', {
              key: `${e.at}-${i}`,
              type: 'button',
              className: styles.previewRow,
              onClick: () => setOpen(true),
              title: t('logViewerOpen'),
            }, h(LogEntryRow, { e, t }))),
          ),
    open && h(LogsModal, { t, onCopy, onClose: () => setOpen(false) }),
    showPathModal && h(LogsPathModal, {
      t,
      defaultPath,
      currentPath: path,
      onSaved: (v: string) => {
        onLogPathSaved(v)
        void load() // 刷新生效路径与最近日志（新位置若已写入则立即可见）
      },
      onClose: () => setShowPathModal(false),
    }),
  )
}
