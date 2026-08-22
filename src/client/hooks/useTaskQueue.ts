/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Background install/remove task queue for the Plugin Hub.
 *
 * Mirrors the server-side FIFO active queue by polling /active, settles
 * vanished tasks against /status, and exposes the queue actions (install,
 * uninstall, cancel) plus the modal task lookups used by the dialogs.
 */
import { useEffect, useRef, useState } from 'react'
import type { HubPlugin, Translate } from '../types.ts'
import { installCommandOf, installTargetOf } from '../lib/catalog.ts'

/** 客户端任务队列项：镜像服务端 active 任务（running 在前、pending 在后）。 */
export interface QueueTask {
  id: number
  kind: 'install' | 'uninstall'
  /** 展示目标：owner/repo（安装）或 npm 包名（卸载） */
  target: string
  /** 插件中文简介（入队时从插件数据带过来，轮询合并时保留）：展示在仓库名下方，让人知道排队的到底是什么 */
  desc?: string
  /** 所属插件仓库（owner/repo）：失败时错误弹窗据此提供「去仓库反馈」入口；卸载为 null */
  repo: string | null
  /** 安装时的目录信号快照（版本 + 仓库更新时间）：任务成功后在本地记录，供「有更新」比对 */
  version?: string
  updatedAt?: string
  /** pending 排队中 / running 执行中 / cancelling 取消中（客户端乐观过渡态） */
  status: 'pending' | 'running' | 'cancelling'
  progress: number
  lines: string[]
  /** 乐观入队条目：点击安装后立即显示「正在安装中」，等 POST 响应回来再换成真实任务 id。
   *  服务端还没登记（preflight 中），轮询合并/消失检测都必须跳过，避免被当作已结束任务收尾。 */
  optimistic?: boolean
  /** 实际执行的安装命令（npm/git 通道随插件数据决定）：失败时 issue 预填如实展示 */
  command?: string
  /** 尝试过的安装方式（npm registry 反查 + 实际执行命令，按先后顺序）：失败时 issue 预填一并贴给作者 */
  attempts?: string[]
  /** 完成结果是否需要重启才生效（服务端任务终态带出；默认 true 保持老行为：弹窗给重启选项）。
   *  卸载时 loader 已即时移除 → false，结果视图只显示「完成」；true 时弹窗给「稍后重启/立即重启」，
   *  通知中心待重启条目（服务端登记）同步常驻，直到用户点「立即重启」。 */
  needsRestart: boolean
}

/** 客户端待重启项：镜像服务端内存列表 + 本地补齐的展示信息（简介/版本）。 */
export interface PendingRestart {
  /** owner/repo（展示用，已去 github: 前缀） */
  target: string
  /** 待重启语义：install 装完等挂载 / uninstall 卸完等清理 */
  kind: 'install' | 'uninstall'
  at: number
  desc?: string
  version?: string
}

export interface TaskQueueOptions {
  t: Translate
  refreshInstalled: () => void
  /** 任务成功完成：viaModal 表示任务对应当前打开弹窗（弹窗切结果视图），否则走 Toast；repo 供成功通知记录；
   *  needsRestart 表示该任务完成后是否仍需宿主重启（结果视图据此给「重启 / 仅完成」）。 */
  onInstallDone: (viaModal: boolean, repo: string | null, needsRestart: boolean) => void
  onUninstallDone: (viaModal: boolean, repo: string | null, needsRestart: boolean) => void
  /** 任务失败：完整输出或兜底文案 + 所属插件仓库 + 操作类型（安装/卸载）+ 实际执行的安装命令（issue 预填用，可缺省）+ 尝试过的安装方式（npm 反查/执行命令，可缺省）。 */
  onError: (message: string, repo: string | null, kind: 'install' | 'uninstall', command?: string, attempts?: string[]) => void
  /** 当前打开的安装/卸载弹窗插件：用于在弹窗内匹配进行中的任务。 */
  installPlugin: HubPlugin | null
  uninstallPlugin: HubPlugin | null
  installedName: (p: HubPlugin) => string | null
  /** 待重启项展示信息补齐：按 owner/repo 从插件目录解析简介/版本；找不到返回 null。 */
  resolvePending: (repo: string) => { desc?: string; version?: string } | null
}

export function useTaskQueue(opts: TaskQueueOptions) {
  const {
    t, refreshInstalled, onInstallDone, onUninstallDone, onError,
    installPlugin, uninstallPlugin, installedName, resolvePending,
  } = opts
  const [queue, setQueue] = useState<QueueTask[]>([])
  const queueRef = useRef<QueueTask[]>([])
  /** 待重启列表（服务端内存态 + 本地展示信息补齐）；与 queue 一样以 ref 为唯一事实来源。 */
  const [pendingRestarts, setPendingRestarts] = useState<PendingRestart[]>([])
  const pendingRef = useRef<PendingRestart[]>([])
  /** 本次会话内安装成功插件的展示信息（目标 → 简介/版本）：轮询合并待重启列表时补齐，刷新后由 resolvePending 兜底。 */
  const pendingInfoRef = useRef<Map<string, { desc?: string; version?: string }>>(new Map())
  /** 保持最新的 resolvePending：轮询闭包捕获的是调用那一刻的目录状态，目录晚加载时也能补齐。 */
  const resolvePendingRef = useRef(resolvePending)
  resolvePendingRef.current = resolvePending
  /** 当前打开弹窗所对应的任务 id：该任务完成时弹窗切换为结果视图 */
  const modalTaskRef = useRef<number | null>(null)
  /** 已开始收尾但尚未结束的任务 id（服务端 /active 已消失 → 查 /status 中）：并发轮询时跳过，避免重复收尾 */
  const settlingRef = useRef<Set<number>>(new Set())
  /** 轮询定时器句柄（队列清空/组件卸载时清理） */
  const pollRef = useRef<number | null>(null)
  /** 请求在途的目标集合（同步防重）：双击安装/卸载时第二击直接忽略。
   *  本地队列任务要等 fetch 返回后才入队，仅靠 queueRef 检查拦不住请求窗口内的重复点击。 */
  const submittingRef = useRef<Set<string>>(new Set())
  /** 乐观入队临时 id 计数器：递减产生唯一负数，与服务端自增正数 id 永不冲突。 */
  const tempIdRef = useRef(0)
  /** 请求在途标记：弹窗据此禁用确认按钮，避免等待响应期间被再次点击。 */
  const [submitting, setSubmitting] = useState(false)

  /** 停止后台任务轮询（任务结束或组件卸载时清理）。 */
  const stopPoll = () => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  /** 队列与待重启都清空才停轮询：待重启期间持续轮询，宿主一重启（内存列表清空）立刻感知并消失。 */
  const maybeStopPoll = () => {
    if (queueRef.current.length === 0 && pendingRef.current.length === 0) stopPoll()
  }

  // 组件卸载时兜底清理轮询定时器
  useEffect(() => stopPoll, [])

  /** 更新队列（同步镜像到 ref：queueRef 是唯一事实来源，state 只负责触发渲染，
   *  避免依赖 React updater 的异步调度时序导致 gone/stopPoll/防重复入队读到旧值）。 */
  const applyQueue = (updater: (prev: QueueTask[]) => QueueTask[]) => {
    const next = updater(queueRef.current)
    queueRef.current = next
    setQueue(next)
  }

  /** 解析服务端待重启列表（`github:` 前缀已去掉，与安装任务的 target 对齐）。 */
  const parsePendingRestarts = (value: unknown): PendingRestart[] => {
    if (!Array.isArray(value)) return []
    const out: PendingRestart[] = []
    for (const x of value) {
      if (typeof x !== 'object' || x === null) continue
      const target = (x as { target?: unknown }).target
      if (typeof target !== 'string' || target === '') continue
      const at = (x as { at?: unknown }).at
      out.push({
        target: target.replace(/^github:/, ''),
        kind: (x as { kind?: unknown }).kind === 'uninstall' ? 'uninstall' : 'install',
        at: typeof at === 'number' ? at : 0,
      })
    }
    return out
  }

  /** 合并服务端待重启列表：保留已有展示信息，缺失时用会话内记录 / 目录解析补齐。 */
  const applyPending = (raw: PendingRestart[]) => {
    const prev = pendingRef.current
    const next = raw.map((p) => {
      const old = prev.find((q) => q.target === p.target)
      if (old?.desc !== undefined) return { ...p, desc: old.desc, version: old.version }
      const info = pendingInfoRef.current.get(p.target) ?? resolvePendingRef.current?.(p.target) ?? null
      return info ? { ...p, desc: info.desc, version: info.version } : p
    })
    pendingRef.current = next
    setPendingRestarts(next)
  }

  /** 向宿主记录某插件的安装时目录信号（version + updatedAt）；version 为空时清除记录（卸载）。 */
  const syncInstalledVersion = async (repo: string | null, version: string | undefined, updatedAt: string | undefined) => {
    if (!repo) return
    try {
      await fetch('/dsh-plugin-hub/installed-version', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ repo, version: version ?? null, updatedAt }),
      })
    } catch {
      // 宿主未挂本地路由：静默忽略，仅本机展示受影响
    }
  }

  /** 后台任务结束（active 中消失后查终态确认）：完成 → 刷新安装表 + 结果视图/toast；失败 → 完整错误弹窗 */
  const finishQueueTask = (ok: boolean, q: QueueTask, lines: string[]) => {
    applyQueue((prev) => prev.filter((x) => x.id !== q.id))
    if (ok) {
      refreshInstalled()
      if (q.kind === 'uninstall') {
        // 卸载成功：清掉本地版本记录
        void syncInstalledVersion(q.repo, undefined, undefined)
        onUninstallDone(modalTaskRef.current === q.id, q.repo, q.needsRestart)
      } else {
        // 安装成功：记录安装时的目录信号（版本 + 仓库更新时间），供「有更新」比对；
        // 同时缓存展示信息，待重启列表（服务端已登记）合并时直接补齐简介/版本
        void syncInstalledVersion(q.repo, q.version, q.updatedAt)
        pendingInfoRef.current.set(q.target, { desc: q.desc, version: q.version })
        onInstallDone(modalTaskRef.current === q.id, q.repo, q.needsRestart)
      }
    } else {
      // 失败：完整展示全部输出行（最新在前，逆序为日志阅读顺序），不裁剪
      const detail = lines.length > 0
        ? [...lines].reverse().join('\n')
        : q.kind === 'uninstall' ? t('uninstallFail') : t('installFail')
      onError(detail, q.repo, q.kind, q.command, q.attempts)
    }
    maybeStopPoll()
  }

  /** 卸载成功收尾前的进度过渡：任务已在服务端结束，但保留本地展示，
   *  让进度条在 ~2.4s 内缓缓跑到 100% 再切结果/Toast，给用户一个交互过程，
   *  而不是命令一执行进度条就一闪消失。 */
  const settleDone = (q: QueueTask, lines: string[]) => {
    // 收尾动画期间停止轮询：任务已从服务端 /active 消失，无需再查；
    // 停掉可避免 pollQueue 的 gone 检测把它当「再消失一次」而重复收尾
    stopPoll()
    const from = Math.min(q.progress, 90) // 起点最多 90，给进度条留出跑满的缓冲空间
    const steps = 20
    const stepMs = 120 // 20 步 × 120ms = 2.4s
    let step = 0
    // 动画期间固定显示「卸载中」：任务实已结束，但进度在跑，与「排队中」文案更协调
    applyQueue((prev) => prev.map((x) => (x.id === q.id ? { ...x, status: 'running' as const } : x)))
    const timer = window.setInterval(() => {
      step += 1
      const progress = Math.round(from + (100 - from) * (step / steps))
      applyQueue((prev) => prev.map((x) => (x.id === q.id ? { ...x, progress } : x)))
      if (step >= steps) {
        window.clearInterval(timer)
        finishQueueTask(true, q, lines)
        // 队列若还有其它已在排队/执行的任务，恢复轮询继续盯；已清空则自然停住
        if (queueRef.current.length > 0) pollQueue()
      }
    }, stepMs)
  }

  /** 任务在 /active 中消失 = 已结束：查 /status 拿终态并收尾（cancelled 静默移除）。 */
  const settleTask = async (q: QueueTask) => {
    let status = 'failed'
    let lines: string[] = []
    let attempts: string[] | undefined
    try {
      const res = await fetch(`/dsh-plugin-hub/status?task=${q.id}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json() as { task?: { status?: string; lines?: string[]; attempts?: string[]; needsRestart?: unknown } }
        const task = data.task
        if (task !== undefined) {
          status = task.status ?? 'failed'
          lines = task.lines ?? []
          attempts = Array.isArray(task.attempts) ? task.attempts : undefined
          // 终态带出的「是否需要重启」覆盖本地（服务端 done 时按 loader 即时移除情况设置）
          const needsRestart = typeof task.needsRestart === 'boolean' ? task.needsRestart : q.needsRestart
          if (status === 'done') {
            const settled = { ...q, needsRestart }
            // 卸载成功走进度过渡动画；安装成功直接收尾
            if (q.kind === 'uninstall') settleDone(settled, lines)
            else finishQueueTask(true, settled, lines)
            return
          }
          if (status === 'failed') {
            // 服务端终态带出的尝试记录覆盖本地：以实际执行为准
            finishQueueTask(false, { ...q, attempts }, lines)
            return
          }
        }
      }
    } catch { /* 服务端不可达：按失败处理 */ }
    applyQueue((prev) => prev.filter((x) => x.id !== q.id)) // cancelled / 未知
    maybeStopPoll()
  }

  /** 轮询整个队列：合并服务端 /active（running 在前、pending 在后），
   *  消失的任务查终态收尾；队列清空即停止轮询。 */
  const pollQueue = () => {
    stopPoll()
    pollRef.current = window.setInterval(async () => {
      try {
        const res = await fetch('/dsh-plugin-hub/active', { cache: 'no-store' })
        if (!res.ok) throw new Error(`active ${res.status}`)
        const data = await res.json() as {
          tasks?: { id?: unknown; action?: unknown; target?: unknown; status?: unknown; progress?: unknown; lines?: unknown; attempts?: unknown; needsRestart?: unknown }[]
          pendingRestarts?: unknown
        }
        const active = (data.tasks ?? []).filter((a) => typeof a.id === 'number')
        const byId = new Map(active.map((a) => [a.id as number, a]))
        // 先捕获旧队列：gone 是「旧队列里服务端已消失的任务」的差集，必须在 applyQueue 更新前取
        const prevQueue = queueRef.current
        // 待重启列表同步（服务端内存态：宿主重启后自然变空，这里随之清空 UI）
        applyPending(parsePendingRestarts(data.pendingRestarts))
        // 合并：running 在前、pending 在后（与服务端一致），新出现任务补入队列
          applyQueue((prev) => {
            const next: QueueTask[] = []
            for (const a of active) {
              const id = a.id as number
              const prevTask = prev.find((q) => q.id === id)
              const isRemove = a.action === 'remove'
              next.push({
                id,
                kind: isRemove ? 'uninstall' : 'install',
                target: typeof a.target === 'string' ? a.target.replace(/^github:/, '') : (prevTask?.target ?? ''),
                desc: prevTask?.desc,
                repo: prevTask?.repo ?? (isRemove ? null : (typeof a.target === 'string' ? a.target.replace(/^github:/, '') : null)),
                // 安装时快照的目录信号：轮询合并时保留，任务成功后记录到本地
                version: prevTask?.version,
                updatedAt: prevTask?.updatedAt,
                status: a.status === 'running' ? 'running' : 'pending',
                progress: typeof a.progress === 'number' ? a.progress : prevTask?.progress ?? 0,
                lines: Array.isArray(a.lines) ? (a.lines as string[]) : (prevTask?.lines ?? []),
                attempts: Array.isArray(a.attempts) ? (a.attempts as string[]) : (prevTask?.attempts ?? []),
                needsRestart: typeof a.needsRestart === 'boolean' ? a.needsRestart : (prevTask?.needsRestart ?? true),
              })
            }
            // 保留乐观条目：服务端尚未登记（preflight 中），无真实 id，不能因 active 缺它就被合并吞掉
            const keepOpt = prev.filter((q) => q.optimistic && !next.some((x) => x.id === q.id))
            if (keepOpt.length > 0) next.push(...keepOpt)
            // 保留「已从服务端消失、但尚未收尾」的任务：收尾（settleTask）负责移除。
            // 若在这里提前摘除，卸载/安装完成的那一瞬队列会先变空，弹窗闪回「确认」态
            // （busy=false 且未 done），表现为「卸载中 → 卸载 → 卸载完成」的中间回退。
            const keepGone = prev.filter((q) =>
              !byId.has(q.id) && !next.some((x) => x.id === q.id) && q.status !== 'cancelling' && !q.optimistic)
            if (keepGone.length > 0) next.push(...keepGone)
            return next
          })
          // 本地有、服务端已消失 → 已结束：逐个查终态收尾
          // （cancelling 是客户端乐观过渡态，交给 cancelTask 的定时移除，不在轮询里提前收敛；
          //   optimistic 是点击后尚未登记的占位，服务端 /status 查不到，跳过免误判成失败；
          //   settling 是上一轮已开始收尾的任务，并发轮询直接跳过，避免重复收尾）
          const gone = prevQueue.filter((q) =>
            !byId.has(q.id) && q.status !== 'cancelling' && !q.optimistic && !settlingRef.current.has(q.id))
        for (const q of gone) {
          // 防御：同 id 任务可能已被上一轮收尾移除（极端时序下轮询合并出的重复条目），跳过避免重复收尾
          if (!queueRef.current.some((x) => x.id === q.id)) continue
          settlingRef.current.add(q.id)
          try { await settleTask(q) } finally { settlingRef.current.delete(q.id) }
        }
      } catch {
        // 服务端暂不可达：静默等待下一轮
      }
    }, 600)
  }

  // 刷新后恢复任务队列与待重启列表：任务注册表在服务端内存里，只要宿主进程没重启就还在；
  // 重新拉取 /active（数组）继续轮询，界面上显示「进行中」状态条，可展开查看实时输出。
  useEffect(() => {
    let cancelled = false
    const restore = async () => {
      try {
        const res = await fetch('/dsh-plugin-hub/active', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json() as {
          tasks?: { id?: unknown; action?: unknown; target?: unknown; status?: unknown; progress?: unknown; lines?: unknown; attempts?: unknown; needsRestart?: unknown }[]
          pendingRestarts?: unknown
        }
        if (cancelled) return
        // 待重启：装完没重启的持久提醒，刷新页面也要恢复
        applyPending(parsePendingRestarts(data.pendingRestarts))
        const items: QueueTask[] = (data.tasks ?? [])
          .filter((a) => typeof a.id === 'number')
          .map((a) => {
            const isRemove = a.action === 'remove'
            // 服务端任务的 target：github:repo（git 安装）/ npm 包名（npm 安装/卸载）。
            // 恢复展示统一用 displayTarget（owner/repo，服务端固定传）：npm 安装时 target 是包名，
            // 直接展示会让用户看到「安装方式」的内部细节，违背无感知原则；卸载保持包名（匹配已装表）。
            const display = typeof (a as { displayTarget?: unknown }).displayTarget === 'string' ? (a as { displayTarget: string }).displayTarget.replace(/^github:/, '') : ''
            const fallback = typeof a.target === 'string' ? a.target.replace(/^github:/, '') : ''
            return {
              id: a.id as number,
              kind: (isRemove ? 'uninstall' : 'install') as 'install' | 'uninstall',
              target: isRemove ? fallback : (display || fallback),
              repo: isRemove ? null : (display || fallback),
              status: a.status === 'running' ? 'running' : 'pending',
              progress: typeof a.progress === 'number' ? a.progress : 0,
              lines: Array.isArray(a.lines) ? (a.lines as string[]) : [],
              attempts: Array.isArray((a as { attempts?: unknown }).attempts) ? ((a as { attempts: string[] }).attempts) : [],
              needsRestart: typeof (a as { needsRestart?: unknown }).needsRestart === 'boolean' ? (a as { needsRestart: boolean }).needsRestart : true,
            }
          })
        if (items.length > 0 || pendingRef.current.length > 0) {
          applyQueue((prev) => [...prev, ...items.filter((n) => !prev.some((p) => p.id === n.id))])
          // 刷新后恢复的任务同样保持折叠：摘要条提示进行中，点开才看明细/日志
          pollQueue()
        }
      } catch { /* host without the plugin's server routes */ }
    }
    void restore()
    return () => { cancelled = true }
  }, [])

  /** 弹窗动作：直接安装。请求宿主本地路由，任务进入服务端队列（FIFO），弹窗内实时显示进度。 */
  const installNow = async (p: HubPlugin, opts?: { update?: boolean }) => {
    const repo = p.source?.repo ?? ''
    if (!repo) return
    // 安装通道决策（用户无感知）：有 npm 包名 → 走 npm；否则 git 直装。
    // 队列条目一律用仓库名展示/防重，只有发给后端的实际安装目标随通道变化。
    const { target } = installTargetOf(p)
    if (!target) return
    // 防重复入队：同一目标已在排队/执行中则忽略
    if (queueRef.current.some((q) => q.kind === 'install' && q.target === repo)) return
    // 请求在途防重：任务要等响应回来才进本地队列，这之前再次点击（双击）直接忽略
    if (submittingRef.current.has(repo)) return
    submittingRef.current.add(repo)
    // 乐观入队：点击安装立即显示「正在安装中」，不等 POST 响应。
    // 服务端 /install 会先跑预检（preflight，可能耗时数秒）再入队，若等响应才入队列，
    // 用户点完安装立刻去通知中心会看不到任务 —— 只有刷新后 restore 才拉回来。
    // 用负临时 id 占位，响应回来换成真实 task id；失败/出错则移除该占位。
    tempIdRef.current -= 1
    const tempId = tempIdRef.current
    modalTaskRef.current = tempId
    applyQueue((prev) => [...prev, {
      id: tempId, kind: 'install', target: repo, repo, desc: p.description,
      version: p.version, updatedAt: p.dates?.repoUpdatedAt,
      status: 'running', progress: 0, lines: [], optimistic: true,
      command: installCommandOf(p, true),
      // 服务端登记后 /active 会带回真实尝试记录（npm 反查 + 执行命令），先占位空列表
      attempts: [], needsRestart: true,
    }])
    setSubmitting(true)
    try {
      const res = await fetch('/dsh-plugin-hub/install', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ repo: target, display: repo, mode: opts?.update ? 'update' : undefined }),
      })
      const data = await res.json() as { ok?: boolean; task?: number; error?: string; attempts?: string[] }
      if (!data.ok || typeof data.task !== 'number') {
        // 请求层失败（重复安装 409 / 参数错误等）：移除乐观条目 + 完整错误弹窗
        applyQueue((prev) => prev.filter((x) => x.id !== tempId))
        // 同步 400（如预检拦截）服务端会附上已尝试的安装方式，issue 预填一并展示
        onError(data.error ?? `HTTP ${res.status}`, repo, 'install', installCommandOf(p, true), data.attempts)
        return
      }
      const taskId = data.task
      modalTaskRef.current = taskId
      // 用真实任务 id 替换乐观占位，解除 optimistic 标记（此后归正常收尾/轮询处理）
      applyQueue((prev) => prev.map((x) => (x.id === tempId
        ? { ...x, id: taskId, optimistic: undefined }
        : x)))
      // 提前缓存展示信息：安装成功后服务端登记待重启，轮询合并时不用等目录解析
      pendingInfoRef.current.set(repo, { desc: p.description, version: p.version })
      // 摘要条常驻顶部（含实时进度），明细面板保持折叠，想看时再点开
      pollQueue()
    } catch {
      // 网络异常：移除乐观条目 + 兜底错误弹窗
      applyQueue((prev) => prev.filter((x) => x.id !== tempId))
      onError(t('installFail'), repo, 'install', installCommandOf(p, true))
    } finally {
      submittingRef.current.delete(repo)
      setSubmitting(false)
    }
  }

  /** 弹窗动作：直接卸载。与安装同一队列机制，弹窗内实时显示进度。 */
  const uninstallNow = async (p: HubPlugin) => {
    const name = installedName(p)
    if (!name) return
    const repo = p.source?.repo ?? null
    if (queueRef.current.some((q) => q.kind === 'uninstall' && q.target === name)) return
    // 请求在途防重：与安装一致，响应回来前再次点击直接忽略
    if (submittingRef.current.has(name)) return
    submittingRef.current.add(name)
    setSubmitting(true)
    try {
      const res = await fetch('/dsh-plugin-hub/uninstall', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, repo: repo ?? undefined }),
      })
      const data = await res.json() as { ok?: boolean; task?: number; error?: string }
      if (!data.ok || typeof data.task !== 'number') {
        onError(data.error ?? `HTTP ${res.status}`, repo, 'uninstall')
        return
      }
      const taskId = data.task
      modalTaskRef.current = taskId
      applyQueue((prev) => [...prev, { id: taskId, kind: 'uninstall', target: name, desc: p.description, repo, status: 'pending', progress: 0, lines: [], needsRestart: true }])
      // 摘要条常驻顶部（含实时进度），明细面板保持折叠，想看时再点开
      pollQueue()
    } catch {
      onError(t('uninstallFail'), repo, 'uninstall')
    } finally {
      submittingRef.current.delete(name)
      setSubmitting(false)
    }
  }

  /** 取消任务：排队中立即出队，执行中终止子进程；先标记「正在取消」短暂过渡后再移除。 */
  const cancelTask = async (id: number) => {
    if (modalTaskRef.current === id) modalTaskRef.current = null
    // 乐观标记「正在取消」，给用户一个可见反馈，而不是瞬间消失
    applyQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'cancelling' as const } : q)))
    try {
      await fetch('/dsh-plugin-hub/cancel', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      })
    } catch { /* 服务端不可达：仍按取消处理，稍后移除 */ }
    // 短暂展示「正在取消」后移除；队列清空则停止轮询
    window.setTimeout(() => {
      applyQueue((prev) => prev.filter((x) => x.id !== id))
      maybeStopPoll()
    }, 700)
  }

  /** 打开新弹窗前清空任务匹配：避免旧任务 id 误匹配到新弹窗。 */
  const clearModalTask = () => { modalTaskRef.current = null }

  // 弹窗对应任务：优先当前弹窗发起任务，其次按目标匹配（重新打开弹窗 / 目标已在队列时也能展示实时进度）
  // 排除 cancelling：取消中的任务不再关联到弹窗，弹窗回到「确认」态可重新操作
  const installModalTask = installPlugin
    ? (queue.find((q) => q.id === modalTaskRef.current && q.status !== 'cancelling')
      ?? queue.find((q) => q.kind === 'install' && q.target === (installPlugin.source?.repo ?? '') && q.status !== 'cancelling')
      ?? null)
    : null
  const uninstallModalTask = uninstallPlugin
    ? (queue.find((q) => q.id === modalTaskRef.current && q.status !== 'cancelling')
      ?? queue.find((q) => q.kind === 'uninstall' && q.target === (installedName(uninstallPlugin) ?? '') && q.status !== 'cancelling')
      ?? null)
    : null

  return {
    queue,
    pendingRestarts,
    installModalTask,
    uninstallModalTask,
    submitting,
    installNow,
    uninstallNow,
    cancelTask,
    clearModalTask,
  }
}
