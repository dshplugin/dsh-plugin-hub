/**
 * Plugin Hub section: wires the catalog data pipeline, the background task
 * queue and the feedback state together. Data/queue logic lives in hooks/,
 * rendering is delegated to the small presentational components in this
 * folder; only the dialogs/toast and the section-level copy actions remain.
 */
import { createElement as h, useEffect, useState } from 'react'
import styles from '../styles/Section.module.css'
import { en, zh } from '../locales.ts'
import type { HubPlugin, LocaleId, SectionProps, ToastState } from '../types.ts'
import { langPathOf } from '../lib/catalog.ts'
import { useCatalog } from '../hooks/useCatalog.ts'
import { useTaskQueue } from '../hooks/useTaskQueue.ts'
import { ErrorModal, InstallModal, UninstallModal, Toast } from './modals.tsx'
import { FailuresModal } from './FailuresModal.tsx'
import { addFailure, clearFailures, loadFailures } from '../lib/failures.ts'
import type { FailureRecord } from '../lib/failures.ts'
import { CatalogHeader } from './CatalogHeader.tsx'
import { CategoryTabs } from './CategoryTabs.tsx'
import { CatalogControls } from './CatalogControls.tsx'
import { ProgressStrip } from './ProgressStrip.tsx'
import { CatalogList } from './CatalogList.tsx'

export function PluginHubSection({ t: _hostT, locale }: SectionProps) {
  /** 界面语言跟随宿主（系统）语言自动切换，不提供手动切换按钮 */
  const lang: LocaleId = locale.getSnapshot().active
  const langKey: LocaleId = lang === 'en' ? 'en' : 'zh'
  // dsh-plugin.org keeps zh pages under the /zh/ prefix; en is the root.
  const langPath = langPathOf(lang)

  // 界面语言跟随宿主（系统）locale 自动切换；宿主的 t() 绑定宿主 locale，
  // 这里基于本地字典自建翻译函数，与宿主 locale 保持一致。
  // （settings.section 的导航 label 仍在 apply 里用宿主 t()，跟随宿主语言。）
  const dict: Record<string, string> = langKey === 'en' ? en : zh
  const t = (key: string, params?: Record<string, string | number>): string => {
    const raw = dict[key] ?? key
    return params ? raw.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? '')) : raw
  }

  const catalog = useCatalog(lang)

  /** 全局反馈 Toast：{id} 用于重复触发时重新走入场动画，kind 决定文案与配色 */
  const [toast, setToast] = useState<ToastState | null>(null)
  /** 复制反馈：记录刚复制安装命令的仓库，按钮短暂切换为「已复制」样式 */
  const [copied, setCopied] = useState<string | null>(null)
  /** 信任确认弹窗：记录待安装的插件，确认后才执行复制 */
  const [confirmPlugin, setConfirmPlugin] = useState<HubPlugin | null>(null)
  /** 卸载确认弹窗：记录待卸载的插件 */
  const [uninstallPlugin, setUninstallPlugin] = useState<HubPlugin | null>(null)
  /** 安装/卸载完成后的结果视图：停留弹窗内，点「完成」关闭 */
  const [installDone, setInstallDone] = useState(false)
  const [uninstallDone, setUninstallDone] = useState(false)
  /** 操作失败完整信息 + 所属插件仓库 + 失败类型（决定弹窗标题「安装失败/卸载失败」） */
  const [errorMsg, setErrorMsg] = useState<{ message: string; repo: string | null; kind: 'install' | 'uninstall' } | null>(null)
  /** 安装/卸载失败记录：localStorage 持久化，失败即落盘，即使错过弹窗也能回来查看 */
  const [failures, setFailures] = useState<FailureRecord[]>(() => loadFailures())
  const [showFailures, setShowFailures] = useState(false)

  const queue = useTaskQueue({
    t,
    refreshInstalled: catalog.refreshInstalled,
    onInstallDone: (viaModal) => (viaModal ? setInstallDone(true) : setToast({ id: Date.now(), kind: 'done' })),
    onUninstallDone: (viaModal) => (viaModal ? setUninstallDone(true) : setToast({ id: Date.now(), kind: 'removed' })),
    onError: (message, repo, kind) => {
      setErrorMsg({ message, repo, kind })
      // 失败自动写入「安装失败记录」：任务在后台结束时没人盯着也能留痕
      setFailures(addFailure({ kind, repo: repo ?? '', message }))
    },
    installPlugin: confirmPlugin,
    uninstallPlugin,
    installedName: catalog.installedName,
  })

  // 信任/卸载/失败记录弹窗打开时按 Esc 关闭；任务进入后台队列后可随时关闭（任务继续）
  useEffect(() => {
    if (!confirmPlugin && !uninstallPlugin && !showFailures) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConfirmPlugin(null)
        setUninstallPlugin(null)
        setUninstallDone(false)
        setShowFailures(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmPlugin, uninstallPlugin, showFailures])

  // Toast 统一自动消失
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  /** 复制文本到剪贴板，返回是否成功（Clipboard API + 隐藏 textarea 兜底）。 */
  const doCopy = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Clipboard API unavailable (permissions/iframe) — fall back to the
      // legacy hidden-textarea trick, which works in any context.
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      let ok = false
      try {
        ok = document.execCommand('copy')
      } catch {
        ok = false
      }
      document.body.removeChild(ta)
      return ok
    }
  }

  /** 弹窗动作一：复制安装命令到剪贴板，引导去终端粘贴执行。 */
  const copyCommand = async (p: HubPlugin) => {
    const repo = p.source?.repo ?? ''
    const ok = await doCopy(`dsh plugin add ${repo}`)
    if (ok) {
      setCopied(repo)
      setToast({ id: Date.now(), kind: 'copied' })
      window.setTimeout(() => setCopied((cur) => (cur === repo ? null : cur)), 1600)
    }
    setConfirmPlugin(null)
  }

  /** 卸载弹窗动作：复制卸载命令，万一直接卸载失败可去终端手动执行。 */
  const copyUninstallCommand = async () => {
    const name = uninstallPlugin ? catalog.installedName(uninstallPlugin) : null
    if (!name) return
    const ok = await doCopy(`dsh plugin remove ${name}`)
    if (ok) setToast({ id: Date.now(), kind: 'copied' })
  }

  const { total, installedName } = catalog
  // 统计数字：官网 /api/stats.json 优先；拉取失败时用已加载列表兜底，避免展示 undefined。
  const statsTotal = catalog.stats?.total ?? total
  const statsVerified = catalog.stats?.verified ?? 0

  const count = catalog.visible.length

  return h('div', { className: styles.root },
    h(CatalogHeader, {
      t,
      langPath,
      statsTotal,
      statsVerified,
    }),
    h(CategoryTabs, {
      category: catalog.category,
      setCategory: catalog.setCategory,
      allLabel: t('all'),
      totalCount: catalog.total,
      langKey,
    }),
    h(CatalogControls, {
      query: catalog.query,
      setQuery: catalog.setQuery,
      sort: catalog.sort,
      setSort: catalog.setSort,
      installedFilter: catalog.installedFilter,
      setInstalledFilter: catalog.setInstalledFilter,
      // 已安装/未安装按钮计数跟随当前分类：切到某分类即显示该分类下的已装/未装数量
      installedCount: catalog.installedCountInCategory,
      notInstalledCount: catalog.notInstalledCountInCategory,
      t,
      // 列表头部「筛选出 N 条」：分类/搜索/安装状态筛选后的结果数；全部视图且未筛选时显示总数
      resultText: catalog.plugins === null || catalog.failed
        ? null
        : catalog.category === 'all' && count === total
          ? t('pluginsTotal', { n: count })
          : t('filterResults', { n: count }),
      failCount: failures.length,
      onOpenFailures: () => setShowFailures(true),
    }),
    // 进行中任务面板：弹窗内已有实时进度时不重复显示；刷新后恢复的任务同样走这里。
    queue.queue.length > 0 && !confirmPlugin && !uninstallPlugin
      ? h(ProgressStrip, {
        queue: queue.queue,
        stripSummary: queue.stripSummary,
        showProgress: queue.showProgress,
        setShowProgress: queue.setShowProgress,
        cancelTask: queue.cancelTask,
        t,
      })
      : null,
    h(CatalogList, {
      plugins: catalog.plugins,
      failed: catalog.failed,
      visible: catalog.visible,
      total,
      t,
      langPath,
      reload: catalog.reload,
      category: catalog.category,
      installedFilter: catalog.installedFilter,
      copied,
      installedName,
      langKey,
      onInstall: (p) => {
        setInstallDone(false)
        setConfirmPlugin(p)
      },
      onUninstall: (p) => {
        setUninstallDone(false)
        queue.clearModalTask()
        setUninstallPlugin(p)
      },
    }),
    // 安装确认弹窗：锁定/进度/结果视图逻辑收敛在 modals.tsx
    confirmPlugin && h(InstallModal, {
      plugin: confirmPlugin,
      done: installDone,
      task: queue.installModalTask,
      t,
      langPath,
      onClose: () => setConfirmPlugin(null),
      onCopy: () => copyCommand(confirmPlugin),
      onInstall: () => queue.installNow(confirmPlugin),
    }),
    // 卸载确认弹窗：确认/进度/结果视图逻辑收敛在 modals.tsx
    uninstallPlugin && h(UninstallModal, {
      plugin: uninstallPlugin,
      done: uninstallDone,
      task: queue.uninstallModalTask,
      t,
      langPath,
      onClose: () => {
        setUninstallDone(false)
        setUninstallPlugin(null)
      },
      onCancel: () => setUninstallPlugin(null),
      onCopyCommand: copyUninstallCommand,
      onConfirm: () => queue.uninstallNow(uninstallPlugin),
    }),
    toast && h(Toast, { toast, t }),
    // 操作失败：完整错误弹窗（重复安装、CLI 失败、请求错误等），可复制并去插件仓库反馈
    errorMsg && h(ErrorModal, {
      message: errorMsg.message,
      repo: errorMsg.repo,
      kind: errorMsg.kind,
      t,
      onCopy: () => {
        doCopy(errorMsg.message)
        setToast({ id: Date.now(), kind: 'errCopied' })
      },
      onClose: () => setErrorMsg(null),
    }),
    // 安装失败记录：本地持久化的失败清单，随时可回来查看/复制/清空
    showFailures && h(FailuresModal, {
      records: failures,
      t,
      onClose: () => setShowFailures(false),
      onCopy: (text) => {
        doCopy(text)
        setToast({ id: Date.now(), kind: 'errCopied' })
      },
      onClear: () => setFailures(clearFailures()),
    }),
  )
}
