/**
 * Background install/remove task queue for the Plugin Hub.
 *
 * Mirrors the server-side FIFO active queue by polling /active, settles
 * vanished tasks against /status, and exposes the queue actions (install,
 * uninstall, cancel) plus the modal task lookups used by the dialogs.
 */
import { useEffect, useRef, useState } from 'react'
import type { HubPlugin, Translate } from '../types.ts'

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
  /** 任务成功完成：viaModal 表示任务对应当前打开弹窗（弹窗切结果视图），否则走 Toast；repo 供成功通知记录。 */
  onInstallDone: (viaModal: boolean, repo: string | null) => void
  onUninstallDone: (viaModal: boolean, repo: string | null) => void
  /** 任务失败：完整输出或兜底文案 + 所属插件仓库 + 操作类型（安装/卸载）。 */
  onError: (message: string, repo: string | null, kind: 'install' | 'uninstall') => void
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
  /** 轮询定时器句柄（队列清空/组件卸载时清理） */
  const pollRef = useRef<number | null>(null)
  /** 请求在途的目标集合（同步防重）：双击安装/卸载时第二击直接忽略。
   *  本地队列任务要等 fetch 返回后才入队，仅靠 queueRef 检查拦不住请求窗口内的重复点击。 */
  const submittingRef = useRef<Set<string>>(new Set())
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
        onUninstallDone(modalTaskRef.current === q.id, q.repo)
      } else {
        // 安装成功：记录安装时的目录信号（版本 + 仓库更新时间），供「有更新」比对；
        // 同时缓存展示信息，待重启列表（服务端已登记）合并时直接补齐简介/版本
        void syncInstalledVersion(q.repo, q.version, q.updatedAt)
        pendingInfoRef.current.set(q.target, { desc: q.desc, version: q.version })
        onInstallDone(modalTaskRef.current === q.id, q.repo)
      }
    } else {
      // 失败：完整展示全部输出行（最新在前，逆序为日志阅读顺序），不裁剪
      const detail = lines.length > 0
        ? [...lines].reverse().join('\n')
        : q.kind === 'uninstall' ? t('uninstallFail') : t('installFail')
      onError(detail, q.repo, q.kind)
    }
    maybeStopPoll()
  }

  /** 任务在 /active 中消失 = 已结束：查 /status 拿终态并收尾（cancelled 静默移除）。 */
  const settleTask = async (q: QueueTask) => {
    let status = 'failed'
    let lines: string[] = []
    try {
      const res = await fetch(`/dsh-plugin-hub/status?task=${q.id}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json() as { task?: { status?: string; lines?: string[] } }
        status = data.task?.status ?? 'failed'
        lines = data.task?.lines ?? []
      }
    } catch { /* 服务端不可达：按失败处理 */ }
    if (status === 'done') finishQueueTask(true, q, lines)
    else if (status === 'failed') finishQueueTask(false, q, lines)
    else {
      applyQueue((prev) => prev.filter((x) => x.id !== q.id)) // cancelled / 未知
      maybeStopPoll()
    }
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
          tasks?: { id?: unknown; action?: unknown; target?: unknown; status?: unknown; progress?: unknown; lines?: unknown }[]
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
            })
          }
          return next
        })
        // 本地有、服务端已消失 → 已结束：逐个查终态收尾
        // （cancelling 是客户端乐观过渡态，交给 cancelTask 的定时移除，不在轮询里提前收敛）
        const gone = prevQueue.filter((q) => !byId.has(q.id) && q.status !== 'cancelling')
        for (const q of gone) await settleTask(q)
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
          tasks?: { id?: unknown; action?: unknown; target?: unknown; status?: unknown; progress?: unknown; lines?: unknown }[]
          pendingRestarts?: unknown
        }
        if (cancelled) return
        // 待重启：装完没重启的持久提醒，刷新页面也要恢复
        applyPending(parsePendingRestarts(data.pendingRestarts))
        const items: QueueTask[] = (data.tasks ?? [])
          .filter((a) => typeof a.id === 'number')
          .map((a) => {
            const isRemove = a.action === 'remove'
            return {
              id: a.id as number,
              kind: (isRemove ? 'uninstall' : 'install') as 'install' | 'uninstall',
              target: typeof a.target === 'string' ? a.target.replace(/^github:/, '') : '',
              repo: isRemove ? null : (typeof a.target === 'string' ? a.target.replace(/^github:/, '') : null),
              status: a.status === 'running' ? 'running' : 'pending',
              progress: typeof a.progress === 'number' ? a.progress : 0,
              lines: Array.isArray(a.lines) ? (a.lines as string[]) : [],
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
    // 防重复入队：同一目标已在排队/执行中则忽略
    if (queueRef.current.some((q) => q.kind === 'install' && q.target === repo)) return
    // 请求在途防重：任务要等响应回来才进本地队列，这之前再次点击（双击）直接忽略
    if (submittingRef.current.has(repo)) return
    submittingRef.current.add(repo)
    setSubmitting(true)
    try {
      const res = await fetch('/dsh-plugin-hub/install', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ repo, mode: opts?.update ? 'update' : undefined }),
      })
      const data = await res.json() as { ok?: boolean; task?: number; error?: string }
      if (!data.ok || typeof data.task !== 'number') {
        // 请求层失败（重复安装 409 / 参数错误等）：完整错误弹窗
        onError(data.error ?? `HTTP ${res.status}`, repo, 'install')
        return
      }
      const taskId = data.task
      modalTaskRef.current = taskId
      applyQueue((prev) => [...prev, { id: taskId, kind: 'install', target: repo, repo, desc: p.description, version: p.version, updatedAt: p.dates?.repoUpdatedAt, status: 'pending', progress: 0, lines: [] }])
      // 提前缓存展示信息：安装成功后服务端登记待重启，轮询合并时不用等目录解析
      pendingInfoRef.current.set(repo, { desc: p.description, version: p.version })
      // 摘要条常驻顶部（含实时进度），明细面板保持折叠，想看时再点开
      pollQueue()
    } catch {
      onError(t('installFail'), repo, 'install')
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
      applyQueue((prev) => [...prev, { id: taskId, kind: 'uninstall', target: name, desc: p.description, repo, status: 'pending', progress: 0, lines: [] }])
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
