/**
 * Plugin Hub section: wires the catalog data pipeline, the background task
 * queue and the feedback state together. Data/queue logic lives in hooks/,
 * rendering is delegated to the small presentational components in this
 * folder; only the dialogs/toast and the section-level copy actions remain.
 */
import { createElement as h, useEffect, useState } from 'react'
import styles from '../styles/Section.module.css'
import { en, zh } from '../locales.ts'
import type { EnvInfo, HubPlugin, LocaleId, SectionProps, ToastState } from '../types.ts'
import { langPathOf } from '../lib/catalog.ts'
import { getEnv } from '../lib/env.ts'
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
  /** 结果视图「立即重启」：请求宿主重启后进入等待，服务回来后整页刷新 */
  const [restarting, setRestarting] = useState(false)
  /** 操作失败完整信息 + 所属插件仓库 + 失败类型（决定弹窗标题「安装失败/卸载失败」） */
  const [errorMsg, setErrorMsg] = useState<{ message: string; repo: string | null; kind: 'install' | 'uninstall' } | null>(null)
  /** 安装/卸载失败记录：localStorage 持久化，失败即落盘，即使错过弹窗也能回来查看 */
  const [failures, setFailures] = useState<FailureRecord[]>(() => loadFailures())
  const [showFailures, setShowFailures] = useState(false)
  /** 宿主机器环境快照：提交 bug 的 issue 正文附带；取不到为 null（链接少环境段，不阻塞） */
  const [env, setEnv] = useState<EnvInfo | null>(null)
  useEffect(() => {
    let alive = true
    void getEnv().then((info) => { if (alive) setEnv(info) })
    return () => { alive = false }
  }, [])

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
    // 待重启项展示信息补齐：从目录按 owner/repo 解析插件简介/版本（找不到返回 null，行内只显示仓库名）
    resolvePending: (repo) => {
      const p = catalog.plugins?.find((x) => x.source?.repo === repo)
      return p ? { desc: p.description, version: p.version } : null
    },
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
    const ok = await doCopy(`dsh plugin add github:${repo}`)
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

  /** 「立即重启」：POST 同源 /restart，宿主进程自杀重启；随后轮询服务恢复后整页刷新。 */
  const requestRestart = async () => {
    if (restarting) return
    setRestarting(true)
    try {
      // 响应可能在宿主进程被 kill 前返回，也可能直接断连 —— 两种都属正常
      await fetch('/dsh-plugin-hub/restart', { method: 'POST' })
    } catch {
      /* 服务已终止，无需处理 */
    }
    // 轮询同源端点，服务恢复后整页 reload（让新挂载的 bundle 完全初始化）
    let attempts = 0
    const poll = async () => {
      attempts += 1
      try {
        const res = await fetch('/dsh-plugin-hub/active', { method: 'GET', cache: 'no-store' })
        if (res.ok) {
          window.location.reload()
          return
        }
      } catch {
        /* 服务尚未恢复 */
      }
      if (attempts < 60) {
        window.setTimeout(poll, 1000)
      } else {
        setRestarting(false)
        setToast({ id: Date.now(), kind: 'fail' })
      }
    }
    window.setTimeout(poll, 1200)
  }

  const { total, installedName, installedVersion, hasUpdate } = catalog
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
    // 待重启任务常驻：装完没重启时状态条一直显示「N 个插件待重启」，直到宿主真正重启。
    (queue.queue.length > 0 || queue.pendingRestarts.length > 0) && !confirmPlugin && !uninstallPlugin
      ? h(ProgressStrip, {
        queue: queue.queue,
        pendingRestarts: queue.pendingRestarts,
        stripSummary: queue.stripSummary,
        showProgress: queue.showProgress,
        setShowProgress: queue.setShowProgress,
        cancelTask: queue.cancelTask,
        onRestart: () => { void requestRestart() },
        restarting,
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
      installedVersion,
      hasUpdate,
      langKey,
      onInstall: (p) => {
        setInstallDone(false)
        // 与卸载一致：重置弹窗关联任务，避免新弹窗误匹配到进行中的任务而禁用安装按钮
        queue.clearModalTask()
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
      restarting,
      onClose: () => setConfirmPlugin(null),
      onCopy: () => copyCommand(confirmPlugin),
      onInstall: () => queue.installNow(confirmPlugin),
      onRestart: () => { void requestRestart() },
    }),
    // 卸载确认弹窗：确认/进度/结果视图逻辑收敛在 modals.tsx
    uninstallPlugin && h(UninstallModal, {
      plugin: uninstallPlugin,
      done: uninstallDone,
      task: queue.uninstallModalTask,
      t,
      langPath,
      restarting,
      onClose: () => {
        setUninstallDone(false)
        setUninstallPlugin(null)
      },
      onCancel: () => setUninstallPlugin(null),
      onCopyCommand: copyUninstallCommand,
      onConfirm: () => queue.uninstallNow(uninstallPlugin),
      onRestart: () => { void requestRestart() },
    }),
    toast && h(Toast, { toast, t }),
    // 操作失败：完整错误弹窗（重复安装、CLI 失败、请求错误等），可复制并去插件仓库反馈
    errorMsg && h(ErrorModal, {
      message: errorMsg.message,
      repo: errorMsg.repo,
      kind: errorMsg.kind,
      t,
      env,
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
      env,
      onClose: () => setShowFailures(false),
      onCopy: (text) => {
        doCopy(text)
        setToast({ id: Date.now(), kind: 'errCopied' })
      },
      onClear: () => setFailures(clearFailures()),
    }),
  )
}
