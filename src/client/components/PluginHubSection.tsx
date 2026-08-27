/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Plugin Hub section: wires the catalog data pipeline, the background task
 * queue and the feedback state together. Data/queue logic lives in hooks/,
 * rendering is delegated to the small presentational components in this
 * folder; it hosts the dialogs/toast and the section-level copy actions.
 */
import { createElement as h, useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import styles from '../styles/Header.module.css'
import modalStyles from '../styles/Modal.module.css'
import type { EnvInfo, HubPlugin, SectionProps, ToastState } from '../types.ts'
import { installCommandOf, repoFromInstallTarget } from '../logic/install-command.ts'
import { PLUGIN_VERSION } from '../logic/constants.ts'
import { ensurePluginCss } from '../logic/ensure-plugin-css.ts'
import { getEnv, revealInstallFolder } from '../data/host.ts'
import { useCatalog } from '../hooks/useCatalog.ts'
import { useLanguage } from '../hooks/useLanguage.ts'
import { useSettings } from '../hooks/useSettings.ts'
import { useTaskQueue } from '../hooks/useTaskQueue.ts'
import { ErrorModal, InstallModal, RestartConfirmModal, UninstallModal, Toast } from './modals/modals.tsx'
import { AboutModal } from './modals/AboutModal.tsx'
import { HubUpdateModal } from './modals/HubUpdateModal.tsx'
import { InstalledDetailModal } from './modals/InstalledDetailModal.tsx'
import { NotificationsModal } from './modals/NotificationsModal.tsx'
import { addFailure, addSuccess, addUpdateNotice, clearNotifications, ignoreUpdate, loadIgnoredUpdates, loadNotifications, removeNotification, removeUpdateNotice } from '../logic/failures.ts'
import type { NotificationRecord } from '../logic/failures.ts'
import { CatalogHeader } from './layout/CatalogHeader.tsx'
import { MarketView } from './views/MarketView.tsx'
import { SectionTabs } from './layout/SectionTabs.tsx'
import type { SectionView } from './layout/SectionTabs.tsx'
import { InstalledView } from './views/InstalledView.tsx'
import { CustomInstallView } from './views/CustomInstallView.tsx'
import { SettingsView } from './views/SettingsView.tsx'
import type { SettingsSection } from './views/SettingsView.tsx'
import { CloseIcon, ConfirmIcon } from './ui/icons.tsx'
import type { InstalledItem } from '../logic/installed.ts'
import { issueRepoOf, pluginOfItem } from '../logic/installed.ts'

export function PluginHubSection({ t: _hostT, locale }: SectionProps) {
  const { lang, langKey, langPath, t, toggleLang } = useLanguage(locale)
  const catalog = useCatalog(lang)
  /** 设置状态：服务端 hub-settings.json 持久化，本地乐观更新即时生效 */
  const { settings: hubSettings, ready: settingsReady, update: updateSettings, reset: resetSettings } = useSettings()

  /** 一级导航：插件中心 / 已安装 / 自定义安装 / 设置 */
  const [view, setView] = useState<SectionView>('market')
  /** 外部跳转设置分组的一次性信号（错误弹窗「去系统诊断」→ 设置 → 系统诊断）：
   *  传给 SettingsView 消费后即清空，避免下次进设置被强制带跳 */
  const [settingsSection, setSettingsSection] = useState<SettingsSection | null>(null)
  /** 网络不通提示的「去系统诊断」直达：关掉所有弹窗（错误/通知/安装确认进度等，
   *  否则 InstallModal 失败后仍停驻原地盖住设置页）→ 切到设置页 → 切到系统诊断分组（自动跑连通性检测） */
  const openDiagnostics = () => {
    setErrorMsg(null)
    setShowNotifications(false)
    setConfirmPlugin(null)
    setConfirmCustomTarget(null)
    setConfirmGlobalNpm(null)
    setUninstallPlugin(null)
    setUninstallItem(null)
    setDetailItem(null)
    setShowHubUpdate(false)
    setShowAbout(false)
    setIgnoreTarget(null)
    setShowRestartConfirm(false)
    setView('settings')
    setSettingsSection('diagnostics')
  }

  /** 全局反馈 Toast：{id} 用于重复触发时重新走入场动画，kind 决定文案与配色 */
  const [toast, setToast] = useState<ToastState | null>(null)
  /** 复制反馈：记录刚复制安装命令的仓库，按钮短暂切换为「已复制」样式 */
  const [copied, setCopied] = useState<string | null>(null)
  /** 信任确认弹窗：记录待安装的插件，确认后才执行复制 */
  const [confirmPlugin, setConfirmPlugin] = useState<HubPlugin | null>(null)
  /** 弹窗动作是否为「更新」：已安装插件点「更新」→ 走同一条 add 命令原位覆盖重装，文案区分安装/更新 */
  const [confirmIsUpdate, setConfirmIsUpdate] = useState(false)
  /** 命令行安装确认弹窗：记录待安装的裸目标（npm 包名 / GitHub 地址，DSH 命令已剥成裸目标）——
   *  与应用商店同一套确认/进度/结果弹窗，提供时 plugin 传 null 走 customTarget 模式 */
  const [confirmCustomTarget, setConfirmCustomTarget] = useState<string | null>(null)
  /** 全局 npm 安装确认弹窗（官方 `npm install -g <pkgs>`）：记录原始命令 + 解析出的包列表，
   *  走与应用商店同一套确认/进度/结果弹窗（plugin 传 null，InstallModal 走 globalNpm 模式） */
  const [confirmGlobalNpm, setConfirmGlobalNpm] = useState<{ raw: string; pkgs: string[] } | null>(null)
  /** Hub 自我更新说明弹窗：点「可更新」徽标先展示版本 + Markdown 变更记录，确认后再进安装弹窗 */
  const [showHubUpdate, setShowHubUpdate] = useState(false)
  /** 「关注我们」弹窗：GitHub 图标后按钮点击打开，展示平台介绍 + 用户反馈群二维码（Worker /about 推送） */
  const [showAbout, setShowAbout] = useState(false)
  /** 卸载确认弹窗：记录待卸载的插件（目录内） */
  const [uninstallPlugin, setUninstallPlugin] = useState<HubPlugin | null>(null)
  /** 卸载确认弹窗：记录待卸载的已安装项（自定义安装无目录数据，按包名直卸） */
  const [uninstallItem, setUninstallItem] = useState<InstalledItem | null>(null)
  /** 已安装详情弹窗：记录当前查看的已安装项（行点击 / 详情按钮打开） */
  const [detailItem, setDetailItem] = useState<InstalledItem | null>(null)
  /** 待重启确认弹窗：已安装列表行内「重启」先弹「立即重启 / 稍后重启」确认（与通知中心一致），
   *  确认后才真正触发宿主重启，避免误触 */
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)
  /** 安装/卸载完成后的结果视图：停留弹窗内，点「完成」关闭 */
  const [installDone, setInstallDone] = useState(false)
  const [uninstallDone, setUninstallDone] = useState(false)
  /** 结果视图是否给「立即重启」：服务端任务终态带出（卸载时 loader 已即时移除 → false 只给「完成」；
   *  true 时通知中心待重启条目同步常驻，直到用户点「立即重启」真正重启后才消失） */
  const [installNeedsRestart, setInstallNeedsRestart] = useState(true)
  const [uninstallNeedsRestart, setUninstallNeedsRestart] = useState(true)
  /** 结果视图「立即重启」：请求宿主重启后进入等待，服务回来后整页刷新 */
  const [restarting, setRestarting] = useState(false)
  /** 操作失败完整信息 + 所属插件仓库 + 失败类型（决定弹窗标题「安装失败/卸载失败」）+ 实际执行的安装命令 + 尝试过的安装方式（issue 预填用） */
  const [errorMsg, setErrorMsg] = useState<{ message: string; repo: string | null; kind: 'install' | 'uninstall'; command?: string; attempts?: string[] } | null>(null)
  /** 通知中心记录：localStorage 持久化，每次安装/卸载任务成败都留痕（启动时读回） */
  const [notifications, setNotifications] = useState<NotificationRecord[]>(() => loadNotifications())
  /** 通知中心弹窗：一级导航「设置」tab 后边的铃铛入口按钮打开 */
  const [showNotifications, setShowNotifications] = useState(false)
  /** 「忽略本次更新」确认弹窗：{ repo, version }；null = 关闭 */
  const [ignoreTarget, setIgnoreTarget] = useState<{ repo: string; version?: string } | null>(null)
  /** 宿主机器环境快照：提交 bug 的 issue 正文附带；取不到为 null（链接少环境段，不阻塞） */
  const [env, setEnv] = useState<EnvInfo | null>(null)
  useEffect(() => {
    let alive = true
    void getEnv().then((info) => { if (alive) setEnv(info) })
    return () => { alive = false }
  }, [])

  // 样式自愈：宿主重启/热更可能移除 <style> 标签而模块缓存未失效（factory 不重跑、CSS 不回来）。
  // 挂载与每次切换视图时比对全局 CSS 清单，把缺失的样式补注入回去 —— 用户无需再手动点击恢复。
  useEffect(() => { ensurePluginCss() }, [view])

  const queue = useTaskQueue({
    t,
    // 界面语言带给服务端：网络预检等错误消息按用户语言提示（中文界面给中文，英文界面给英文）
    langKey,
    refreshInstalled: catalog.refreshInstalled,
    onInstallDone: (viaModal, repo, needsRestart, update) => {
      setInstallNeedsRestart(needsRestart)
      if (viaModal) setInstallDone(true)
      else setToast({ id: Date.now(), kind: 'done' })
      // 安装成功也写入通知记录：通知中心里成功与失败都能看到。
      // action 区分「安装成功」与「更新成功」（更新 = 覆盖重装，同一执行通道）
      setNotifications(addSuccess({ kind: 'install', action: update ? 'update' : 'install', repo: repo ?? '' }))
    },
    onUninstallDone: (viaModal, repo, needsRestart) => {
      setUninstallNeedsRestart(needsRestart)
      if (viaModal) setUninstallDone(true)
      else setToast({ id: Date.now(), kind: 'removed' })
      setNotifications(addSuccess({ kind: 'uninstall', repo: repo ?? '' }))
    },
    onError: (message, repo, kind, command, attempts, update) => {
      // 提 Issue 目标先反查仓库身份：npm 包名能在已安装表/目录里反查到 owner/repo 才保留，
      // 反查不到置 null —— 错误弹窗据此不显示「一键提 Issue」按钮（防提到错误仓库）
      const issueRepo = issueRepoOf(repo ?? '', catalog.installedItems, catalog.plugins)
      setErrorMsg({ message, repo: issueRepo, kind, command, attempts })
      // 失败自动写入通知记录：任务在后台结束时没人盯着也能留痕。
      // 存原始 repo（可能只是裸包名）而非反查结果 —— 反查只服务于提 Issue，
      // 通知中心的展示反查由 NotificationsModal 做、查不到会回退显示原始值，
      // 若这里就丢掉原始值，通知里会连名字都看不到；action 区分「安装失败/更新失败」
      setNotifications(addFailure({ kind, action: update ? 'update' : 'install', repo: repo ?? '', message, command, attempts }))
    },
    installPlugin: confirmPlugin,
    installCustomTarget: confirmCustomTarget,
    installGlobalTarget: confirmGlobalNpm ? confirmGlobalNpm.pkgs.join(' ') : null,
    uninstallPlugin,
    uninstallName: uninstallItem ? uninstallItem.name : null,
    installedName: catalog.installedName,
    // 待重启项展示信息补齐：从目录按 owner/repo 解析插件简介/版本（找不到返回 null，行内只显示仓库名）
    resolvePending: (repo) => {
      const p = catalog.plugins?.find((x) => x.source?.repo === repo)
      return p ? { desc: p.description, version: p.version } : null
    },
  })

  /** 补齐更新提醒：把「当前有更新但通知中心还没有」的插件补写进通知（repo+version 去重）。
   *  返回本次实际新增的条数（0 = 无可更新或全部已提示过）。启动检查与打开通知中心共用，
   *  保证通知中心始终反映可更新状态：同一版本只一条、清空/删除后重开恢复、更新完成后消失。 */
  const syncUpdateNotices = (): number => {
    const updatable = catalog.installedItems.filter((i) => i.hasUpdate && i.plugin)
    if (updatable.length === 0) return 0
    const known = new Set(loadIgnoredUpdates())
    // 已忽略（repo+version 持久化）与通知中心已有的更新提醒都不再补写：
    // 忽略本次版本后不再提醒，直到下一个新版本（version 变化）才重新提示
    for (const r of loadNotifications()) {
      if (r.kind === 'update') known.add(`${r.repo}@${r.version ?? ''}`)
    }
    const fresh = updatable.filter((item) =>
      item.repo !== null && !known.has(`${item.repo}@${item.catalogVersion ?? ''}`))
    if (fresh.length === 0) return 0
    for (const item of fresh) {
      if (item.repo) addUpdateNotice({ kind: 'update', repo: item.repo, version: item.catalogVersion ?? undefined })
    }
    setNotifications(loadNotifications())
    return fresh.length
  }

  // 启动更新策略：目录数据与设置都就绪后触发一次 —— 开启「启动时检查更新」→ 发现可更新插件
  // 即写入通知中心（每条一条，点击可去更新），toast 同步提示已入通知。
  // 绝不自动安装：是否更新完全由用户决定。
  // ref 守卫保证只跑一次，后续目录刷新/设置变化不会重复打扰。
  const startupCheckedRef = useRef(false)
  useEffect(() => {
    if (startupCheckedRef.current) return
    if (!settingsReady || catalog.plugins === null || catalog.failed) return
    startupCheckedRef.current = true
    if (!hubSettings.checkUpdatesOnStart) return
    const added = syncUpdateNotices()
    if (added > 0) setToast({ id: Date.now(), kind: 'updates', n: added })
  }, [settingsReady, hubSettings, catalog.plugins, catalog.failed, catalog.installedItems, queue])

  // 信任/卸载/更新说明弹窗打开时按 Esc 关闭；任务进入后台队列后可随时关闭（任务继续）
  useEffect(() => {
    if (!confirmPlugin && !confirmCustomTarget && !confirmGlobalNpm && !uninstallPlugin && !uninstallItem && !detailItem && !showHubUpdate && !showAbout && !showNotifications && !ignoreTarget) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConfirmPlugin(null)
        setConfirmCustomTarget(null)
        setConfirmGlobalNpm(null)
        setUninstallPlugin(null)
        setUninstallItem(null)
        setDetailItem(null)
        setUninstallDone(false)
        setShowHubUpdate(false)
        setShowAbout(false)
        setShowNotifications(false)
        setIgnoreTarget(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmPlugin, confirmCustomTarget, uninstallPlugin, uninstallItem, detailItem, showHubUpdate, showAbout, showNotifications, ignoreTarget])

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

  /** 命令行安装目标是否已安装（与服务端 already 判定同口径）：GitHub 地址按仓库身份匹配
   *  （归一化后比对已装项的 repo/spec），npm 包名按依赖 key 直查。命中 → 弹窗转「更新」语义
   *  （mode=update 放行覆盖重装），避免重复点击撞 409 报错。 */
  const customTargetInstalled = (raw: string): boolean => {
    const target = raw.trim()
    if (!target) return false
    const repo = repoFromInstallTarget(target)
    const isRepo = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(repo)
    if (isRepo) {
      const needle = repo.toLowerCase()
      return catalog.installedItems.some((i) =>
        (i.repo !== null && i.repo.toLowerCase() === needle) ||
        repoFromInstallTarget(i.spec).toLowerCase() === needle)
    }
    // npm 包名（可带 @version）：剥掉版本号后同时查已安装列表与原始依赖表。
    // Hub 自身（file:/link: 安装）被 installedItems 刻意排除（防误卸载），列表里查不到，
    // 但依赖表真实存在——补齐后「命令窗口重装 hub 自身」也能转「更新」语义，不再撞 already installed
    const pkg = repo.replace(/@[^@]*$/, '').toLowerCase()
    return catalog.installedItems.some((i) => i.name.toLowerCase() === pkg) ||
      Object.keys(catalog.installed).some((k) => k.toLowerCase() === pkg)
  }

  /** 弹窗动作一：复制安装命令到剪贴板，引导去终端粘贴执行（npm 通道显示包名命令）。 */
  const copyCommand = async (p: HubPlugin) => {
    const repo = p.source?.repo ?? ''
    const ok = await doCopy(installCommandOf(p))
    if (ok) {
      setCopied(repo)
      setToast({ id: Date.now(), kind: 'copied' })
      window.setTimeout(() => setCopied((cur) => (cur === repo ? null : cur)), 1600)
    }
    setConfirmPlugin(null)
  }

  /** 卸载弹窗动作：复制卸载命令，万一直接卸载失败可去终端手动执行。
   *  自定义安装（无目录数据）按已安装项包名直卸，同样给复制通道。 */
  const copyUninstallCommand = async () => {
    const name = uninstallItem ? uninstallItem.name : (uninstallPlugin ? catalog.installedName(uninstallPlugin) : null)
    if (!name) return
    const ok = await doCopy(`dsh plugin remove ${name}`)
    if (ok) setToast({ id: Date.now(), kind: 'copied' })
  }

  /** 详情弹窗动作：在系统文件管理器里定位安装目录；服务端失败给 toast 提示。 */
  const revealFolder = async (item: InstalledItem) => {
    const ok = await revealInstallFolder(item.name)
    if (!ok) setToast({ id: Date.now(), kind: 'revealFail' })
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

  // Hub 自身条目（目录数据里的 dshplugin/dsh-plugin-hub）：头部「可更新」徽标的更新目标。
  // useCatalog 在过滤目录（自身不进插件列表）前单独保留该条目；目录可能尚未加载（此时为 null，徽标不渲染）。
  const hubEntry = catalog.hubPlugin

  return h('div', { className: styles.root },
    h(CatalogHeader, {
      t,
      langPath,
      statsTotal,
      statsVerified,
      onToggleLang: toggleLang,
      // Hub 自身版本信息入口：版本号常驻可点（无更新也看得到当前版本更新内容），
      // 有可用更新时版本号后紧跟红色「可更新」徽标（同一入口），点击都打开同一个更新说明弹窗。
      // 有更新弹窗显示新版本 + Markdown 变更记录，点「直接更新」进安装弹窗覆盖重装。
      hubUpdate: catalog.hubHasUpdate,
      // 点击版本号/徽标：先强制刷新拉取最新版本信息（发版后点击即见新版本），再打开弹窗
      onVersionClick: () => {
        void catalog.refreshHub().then(() => setShowHubUpdate(true))
      },
      onAboutClick: () => setShowAbout(true),
    }),
    // 一级导航行：tab 占满左侧，通知入口靠右（「设置」tab 后边，右对齐）
    h('div', { className: styles.tabsRow },
      // 「已安装」徽标 = 目录插件 + 自定义安装总数（installedItems 已排除 hub 自身）
      h(SectionTabs, {
        view,
        setView,
        installedCount: catalog.installedItems.length,
        t,
        // 通知中心入口：红圈徽标 = 记录数 + 进行中任务 + 待重启（有动静才醒目）
        noticeCount: notifications.length + queue.queue.length + queue.pendingRestarts.length,
        onOpenNotifications: () => {
          // 打开弹窗时补齐更新提醒（受「启动时检查更新」开关约束）：同一版本只一条，
          // 清空/删除后重开仍恢复，直到插件更新完成才消失
          if (hubSettings.checkUpdatesOnStart) syncUpdateNotices()
          setShowNotifications(true)
        },
      }),
    ),
    view === 'market'
      ? h(MarketView, {
          catalog,
          t,
          langPath,
          langKey,
          copied,
          // 列表头部「筛选出 N 条」：分类/搜索/安装状态筛选后的结果数；全部视图且未筛选时显示总数
          resultText: catalog.plugins === null || catalog.failed
            ? null
            : catalog.category === 'all' && count === total
              ? t('pluginsTotal', { n: count })
              : t('filterResults', { n: count }),
          onInstall: (p, opts) => {
            setInstallDone(false)
            setConfirmIsUpdate(opts?.update ?? false)
            // 与卸载一致：重置弹窗关联任务，避免新弹窗误匹配到进行中的任务而禁用安装按钮
            queue.clearModalTask()
            setConfirmPlugin(p)
          },
          onUninstall: (p) => {
            setUninstallDone(false)
            queue.clearModalTask()
            setUninstallPlugin(p)
          },
        })
      : view === 'installed'
        ? h(InstalledView, {
            items: catalog.installedItems,
            langKey,
            t,
            // 支持系统文件管理器定位的平台（macOS / Linux）上，行内「打开详情」替换为
            // 打开安装目录按钮（行点击本身即打开详情弹窗）；Windows 不支持则按钮不显示
            platform: env?.platform ?? '',
            // 行点击 / 详情按钮：打开已安装详情弹窗（完整元数据 + 运行时信息）
            onOpenDetail: (item) => setDetailItem(item),
            onReveal: (item) => { void revealFolder(item) },
            // 更新：已安装视图的「更新」= 目录插件覆盖重装，与市场列表内更新同一流程
            onUpdate: (item) => {
              if (!item.plugin) return
              setDetailItem(null)
              setInstallDone(false)
              setConfirmIsUpdate(true)
              queue.clearModalTask()
              setConfirmPlugin(item.plugin)
            },
            // 卸载：目录插件与自定义安装统一按已安装项走卸载确认弹窗（自定义无目录数据，按包名直卸）
            onUninstall: (item) => {
              setDetailItem(null)
              setUninstallDone(false)
              queue.clearModalTask()
              setUninstallItem(item)
            },
            // 重启：待重启条目行内按钮 → 先弹「立即重启 / 稍后重启」确认（与通知中心一致），确认后才触发宿主重启
            onRestart: () => setShowRestartConfirm(true),
          })
        : view === 'custom'
          ? h(CustomInstallView, {
              t,
              // 命令行安装：与应用商店同一套确认/进度/结果弹窗 —— 输入 npm 包名 / GitHub 地址 /
              // dsh plugin 命令即装（custom 源，受安全设置三开关控制）。点安装先弹确认窗，
              // 确认后走队列安装（实时进度 + 成功结果视图）；目标已安装 → 弹窗转「更新」覆盖重装，
              // 不再撞「already installed」报错（第一次安装没有反馈才导致用户重复点击）。
              // 安全信任开关关掉对应通道 → 卡片禁用并提示去设置打开（onOpenSettings 跳到设置页）。
              enableNpm: hubSettings.enableNpmInstall,
              enableGit: hubSettings.enableGitInstall,
              enableDsh: hubSettings.enableDshInstall,
              onOpenSettings: () => setView('settings'),
              // 当前 profile：一键插入的 Hub 更新命令用它拼 --profile
              profile: env?.profile ?? 'web',
              onInstallCustom: (raw, opts) => {
                const target = raw.trim()
                if (!target) return
                setInstallDone(false)
                // 与目录安装一致：重置弹窗关联任务，避免新弹窗误匹配到进行中的任务
                queue.clearModalTask()
                // 官方全局 npm 安装（npm install -g <pkgs>）：弹窗走 globalNpm 模式（系统级 CLI 工具，
                // 不进插件列表，不做「已安装→更新」判定 —— npm install -g 对已装包是原位覆盖更新，天然幂等）
                if (opts?.globalNpm && opts.globalNpm.length > 0) {
                  setConfirmCustomTarget(null)
                  setConfirmIsUpdate(false)
                  setConfirmGlobalNpm({ raw, pkgs: opts.globalNpm })
                  return
                }
                setConfirmGlobalNpm(null)
                setConfirmIsUpdate(customTargetInstalled(target))
                setConfirmCustomTarget(target)
              },
            })
          : h(SettingsView, {
            t,
            settings: hubSettings,
            update: updateSettings,
            reset: resetSettings,
            env,
            onCopy: (text: string) => {
              doCopy(text)
              setToast({ id: Date.now(), kind: 'copied' })
            },
            // 网络不通提示「去系统诊断」→ 设置页并切到系统诊断分组（DiagnosticsView 挂载即自动跑探测）
            openSection: settingsSection,
            onConsumedOpenSection: () => setSettingsSection(null),
          }),
    // Hub 版本信息弹窗：版本号/徽标点击打开 —— 有更新显示新版本 + 变更记录 + 「直接更新」，
    // 无更新显示当前版本 + 记录 + 「已是最新」。Worker 拉取失败时兜底展示当前版本号。
    showHubUpdate && h(HubUpdateModal, {
      info: catalog.hubUpdateInfo ?? { version: PLUGIN_VERSION },
      lang,
      t,
      hasUpdate: catalog.hubHasUpdate,
      onClose: () => setShowHubUpdate(false),
      onProceed: () => {
        setShowHubUpdate(false)
        // 与列表内更新同一流程：覆盖重装 dsh-plugin + 结果视图「立即重启」
        if (hubEntry) {
          setInstallDone(false)
          setConfirmIsUpdate(true)
          queue.clearModalTask()
          setConfirmPlugin(hubEntry)
        }
      },
    }),
    // 「关注我们」弹窗：GitHub 图标后按钮点击打开 —— 平台介绍 + 用户反馈群二维码，
    // 内容由 dsh-update Worker 的 /about 接口以 Markdown 形式推送，作者随时可改，非写死。
    // Worker 未推送（info 为 null）时弹窗仍能打开并展示兜底文案，不影响其他功能。
    showAbout && h(AboutModal, {
      info: catalog.hubAboutInfo ?? null,
      lang,
      t,
      onClose: () => setShowAbout(false),
    }),
    // 安装/卸载任务通知中心：本地持久化的成败清单，随时可回来查看/复制/清空；
    // 进行中的任务（实时进度）与待重启插件也一并展示，关掉任务弹窗后仍可盯着
    showNotifications && h(NotificationsModal, {
      records: notifications,
      tasks: queue.queue,
      pendingRestarts: queue.pendingRestarts,
      t,
      env,
      onClose: () => setShowNotifications(false),
      onCopy: (text) => {
        doCopy(text)
        setToast({ id: Date.now(), kind: 'errCopied' })
      },
      onClear: () => setNotifications(clearNotifications()),
      onRemove: (id: number) => setNotifications(removeNotification(id)),
      // 更新提醒通知：点击直接进该插件的更新确认弹窗（与已安装列表「更新」同一流程）
      onUpdate: (repo: string) => {
        const plugin = catalog.installedItems.find((i) => i.repo === repo)?.plugin
        if (!plugin) return
        setShowNotifications(false)
        setInstallDone(false)
        setConfirmIsUpdate(true)
        queue.clearModalTask()
        setConfirmPlugin(plugin)
      },
      // 更新提醒「忽略本次更新」：先弹确认弹窗，确认后该版本不再提醒（持久化），直到下一个新版本
      onIgnoreUpdate: (repo: string, version?: string) => setIgnoreTarget({ repo, version }),
      cancelTask: queue.cancelTask,
      restarting,
      onRestart: () => setShowRestartConfirm(true),
      // 网络不通记录的「去系统诊断」直达：关通知中心 → 设置 → 系统诊断
      onRunDiagnostics: openDiagnostics,
      // 失败记录仓库反查：历史记录可能存的是裸 npm 包名，反查成 owner/repo 才显示仓库链接
      // 与提 Issue 按钮；查不到则隐藏（防提到错误仓库）
      resolveRepo: (repo: string) => issueRepoOf(repo, catalog.installedItems, catalog.plugins),
    }),
    // 「忽略本次更新」确认弹窗：确认后该版本写入忽略集（持久化）并从通知中心移除，
    // 本次版本不再提醒，直到插件发布下一个新版本
    ignoreTarget && h('div', {
      className: modalStyles.overlay,
      onClick: (e: MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) setIgnoreTarget(null) },
    },
      h('div', { className: modalStyles.modal, role: 'dialog', 'aria-modal': 'true' },
        h('div', { className: modalStyles.modalHead },
          h('div', { className: modalStyles.modalTitle }, t('ignoreUpdateConfirmTitle')),
          h('button', {
            className: modalStyles.modalClose,
            type: 'button',
            'aria-label': t('errorClose'),
            onClick: () => setIgnoreTarget(null),
          }, h(CloseIcon)),
        ),
        h('div', { className: modalStyles.modalBody },
          // 忽略更新确认：品牌蓝问号图标，普通确认
          h('div', { className: modalStyles.confirmIconWrap },
            h(ConfirmIcon, { type: 'question' }),
          ),
          h('div', { className: modalStyles.failPrepareHint }, t('ignoreUpdateConfirmDetail')),
          h('div', { className: modalStyles.modalActions },
            h('button', {
              className: modalStyles.restartLater,
              type: 'button',
              onClick: () => setIgnoreTarget(null),
            }, t('confirmCancel')),
            h('button', {
              className: modalStyles.restartNow,
              type: 'button',
              onClick: () => {
                ignoreUpdate(ignoreTarget.repo, ignoreTarget.version)
                setNotifications(removeUpdateNotice(ignoreTarget.repo, ignoreTarget.version))
                setIgnoreTarget(null)
              },
            }, t('ignoreUpdateConfirm')),
          ),
        ),
      ),
    ),
    // 安装确认弹窗：锁定/进度/结果视图逻辑收敛在 modals.tsx；更新与安装同入口，仅标记 update
    confirmPlugin && h(InstallModal, {
      plugin: confirmPlugin,
      done: installDone,
      task: queue.installModalTask,
      t,
      langPath,
      restarting,
      update: confirmIsUpdate,
      // 仅命令行插件（webInstallable=false）：弹窗只展示命令供复制，不提供一键安装
      cliOnly: confirmPlugin.install?.webInstallable === false,
      submitting: queue.submitting,
      needsRestart: installNeedsRestart,
      onClose: () => setConfirmPlugin(null),
      onCopy: () => copyCommand(confirmPlugin),
      onInstall: () => queue.installNow(confirmPlugin, confirmIsUpdate ? { update: true } : undefined),
      // 重启：结果视图「立即重启」也会中断进行中的任务 → 先弹重启确认弹窗
      onRestart: () => setShowRestartConfirm(true),
    }),
    // 命令行安装确认弹窗：与目录安装同一套确认/进度/结果流程（plugin 传 null 走 customTarget 模式）。
    // 已安装目标 → update 标记，确认后走覆盖重装（服务端 mode=update 放行），不再 409 报错。
    confirmCustomTarget && h(InstallModal, {
      plugin: null,
      customTarget: confirmCustomTarget,
      done: installDone,
      task: queue.installModalTask,
      t,
      langPath,
      restarting,
      update: confirmIsUpdate,
      cliOnly: false,
      submitting: queue.submitting,
      needsRestart: installNeedsRestart,
      onClose: () => {
        setInstallDone(false)
        setConfirmCustomTarget(null)
      },
      onCopy: () => {
        doCopy(`pnpm add ${confirmCustomTarget}`)
        setToast({ id: Date.now(), kind: 'copied' })
      },
      onInstall: () => void queue.installCustom(confirmCustomTarget, confirmIsUpdate ? { update: true } : undefined),
      onRestart: () => setShowRestartConfirm(true),
    }),
    // 全局 npm 安装确认弹窗（官方 `npm install -g <pkgs>`）：与应用商店同一套确认/进度/结果流程。
    // 装的是系统级 CLI 工具（如 @deepseek-ai/dsh），不进任何 profile、无需宿主重启；
    // 服务端任务终态 needsRestart=false → 结果视图仅「完成」。
    confirmGlobalNpm && h(InstallModal, {
      plugin: null,
      globalNpm: confirmGlobalNpm.pkgs,
      done: installDone,
      task: queue.installModalTask,
      t,
      langPath,
      restarting,
      update: false,
      cliOnly: false,
      submitting: queue.submitting,
      needsRestart: installNeedsRestart,
      onClose: () => {
        setInstallDone(false)
        setConfirmGlobalNpm(null)
      },
      onCopy: () => {
        doCopy(`npm install -g ${confirmGlobalNpm.pkgs.join(' ')}`)
        setToast({ id: Date.now(), kind: 'copied' })
      },
      onInstall: () => void queue.installGlobalNpm(confirmGlobalNpm.pkgs),
      onRestart: () => setShowRestartConfirm(true),
    }),
    // 卸载确认弹窗：确认/进度/结果视图逻辑收敛在 modals.tsx。
    // 已安装视图的自定义安装（目录外）没有完整目录数据，按已安装项伪插件适配后走同一弹窗
    (uninstallPlugin || uninstallItem) && h(UninstallModal, {
      plugin: uninstallPlugin ?? pluginOfItem(uninstallItem!),
      done: uninstallDone,
      task: queue.uninstallModalTask,
      t,
      langPath,
      restarting,
      submitting: queue.submitting,
      needsRestart: uninstallNeedsRestart,
      onClose: () => {
        setUninstallDone(false)
        setUninstallPlugin(null)
        setUninstallItem(null)
      },
      onCancel: () => {
        setUninstallPlugin(null)
        setUninstallItem(null)
      },
      onCopyCommand: copyUninstallCommand,
      onConfirm: () => {
        if (uninstallItem) void queue.uninstallItem(uninstallItem)
        else if (uninstallPlugin) void queue.uninstallNow(uninstallPlugin)
      },
      onRestart: () => setShowRestartConfirm(true),
    }),
    // 已安装详情弹窗：目录元数据 + 宿主运行时信息的完整展示，操作（更新/卸载/复制路径）由此发起
    detailItem && h(InstalledDetailModal, {
      item: detailItem,
      t,
      lang: langKey,
      langPath,
      onClose: () => setDetailItem(null),
      onUpdate: (item) => {
        if (!item.plugin) return
        setDetailItem(null)
        setInstallDone(false)
        setConfirmIsUpdate(true)
        queue.clearModalTask()
        setConfirmPlugin(item.plugin)
      },
      onUninstall: (item) => {
        setDetailItem(null)
        setUninstallDone(false)
        queue.clearModalTask()
        setUninstallItem(item)
      },
      onCopyPath: (path) => {
        doCopy(path)
        setToast({ id: Date.now(), kind: 'copied' })
      },
      onReveal: (item) => { void revealFolder(item) },
    }),
    toast && h(Toast, { toast, t }),
    // 操作失败：完整错误弹窗（重复安装、CLI 失败、请求错误等），可复制并去插件仓库反馈
    errorMsg && h(ErrorModal, {
      message: errorMsg.message,
      repo: errorMsg.repo,
      kind: errorMsg.kind,
      command: errorMsg.command,
      attempts: errorMsg.attempts,
      t,
      env,
      onCopy: (text: string) => {
        doCopy(text)
        setToast({ id: Date.now(), kind: 'errCopied' })
      },
      // 网络不通错误的「去系统诊断」直达：关错误弹窗 → 设置 → 系统诊断
      onRunDiagnostics: openDiagnostics,
      onClose: () => setErrorMsg(null),
    }),
    // 待重启确认弹窗：已安装列表行内「重启」按钮点击后弹出，稍后重启 / 立即重启
    showRestartConfirm && h(RestartConfirmModal, {
      t,
      restarting,
      onClose: () => setShowRestartConfirm(false),
      onRestartNow: () => {
        setShowRestartConfirm(false)
        void requestRestart()
      },
    }),
  )
}
