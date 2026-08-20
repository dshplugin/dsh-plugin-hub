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
  status: 'pending' | 'running'
  progress: number
  lines: string[]
}

export interface TaskQueueOptions {
  t: Translate
  refreshInstalled: () => void
  /** 任务成功完成：viaModal 表示任务对应当前打开弹窗（弹窗切结果视图），否则走 Toast。 */
  onInstallDone: (viaModal: boolean) => void
  onUninstallDone: (viaModal: boolean) => void
  /** 任务失败：完整输出或兜底文案 + 所属插件仓库 + 操作类型（安装/卸载）。 */
  onError: (message: string, repo: string | null, kind: 'install' | 'uninstall') => void
  /** 当前打开的安装/卸载弹窗插件：用于在弹窗内匹配进行中的任务。 */
  installPlugin: HubPlugin | null
  uninstallPlugin: HubPlugin | null
  installedName: (p: HubPlugin) => string | null
}

export function useTaskQueue(opts: TaskQueueOptions) {
  const {
    t, refreshInstalled, onInstallDone, onUninstallDone, onError,
    installPlugin, uninstallPlugin, installedName,
  } = opts
  const [queue, setQueue] = useState<QueueTask[]>([])
  const queueRef = useRef<QueueTask[]>([])
  /** 当前打开弹窗所对应的任务 id：该任务完成时弹窗切换为结果视图 */
  const modalTaskRef = useRef<number | null>(null)
  /** 轮询定时器句柄（队列清空/组件卸载时清理） */
  const pollRef = useRef<number | null>(null)
  /** 当前安装/卸载操作的插件仓库：失败时归档到错误弹窗（操作结束时弹窗已关，需提前捕获） */
  const opRepoRef = useRef<string | null>(null)
  /** 进行中状态条是否展开（刷新后恢复的任务可点击展开查看实时输出） */
  const [showProgress, setShowProgress] = useState(false)

  /** 停止后台任务轮询（任务结束或组件卸载时清理）。 */
  const stopPoll = () => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  // 组件卸载时兜底清理轮询定时器
  useEffect(() => stopPoll, [])

  /** 更新队列（同步镜像到 ref，供轮询/防重复入队读取当前值）。 */
  const applyQueue = (updater: (prev: QueueTask[]) => QueueTask[]) => {
    setQueue((prev) => {
      const next = updater(prev)
      queueRef.current = next
      return next
    })
  }

  /** 后台任务结束（active 中消失后查终态确认）：完成 → 刷新安装表 + 结果视图/toast；失败 → 完整错误弹窗 */
  const finishQueueTask = (ok: boolean, q: QueueTask, lines: string[]) => {
    applyQueue((prev) => prev.filter((x) => x.id !== q.id))
    if (ok) {
      refreshInstalled()
      if (q.kind === 'uninstall') onUninstallDone(modalTaskRef.current === q.id)
      else onInstallDone(modalTaskRef.current === q.id)
    } else {
      // 失败：完整展示全部输出行（最新在前，逆序为日志阅读顺序），不裁剪
      const detail = lines.length > 0
        ? [...lines].reverse().join('\n')
        : q.kind === 'uninstall' ? t('uninstallFail') : t('installFail')
      if (q.kind === 'install' && q.target.includes('/')) opRepoRef.current = q.target
      onError(detail, opRepoRef.current, q.kind)
    }
    if (queueRef.current.length === 0) stopPoll()
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
    else applyQueue((prev) => prev.filter((x) => x.id !== q.id)) // cancelled / 未知
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
        }
        const active = (data.tasks ?? []).filter((a) => typeof a.id === 'number')
        const byId = new Map(active.map((a) => [a.id as number, a]))
        // 合并：running 在前、pending 在后（与服务端一致），新出现任务补入队列
        applyQueue((prev) => {
          const next: QueueTask[] = []
          for (const a of active) {
            const id = a.id as number
            const prevTask = prev.find((q) => q.id === id)
            next.push({
              id,
              kind: a.action === 'remove' ? 'uninstall' : 'install',
              target: typeof a.target === 'string' ? a.target.replace(/^github:/, '') : (prevTask?.target ?? ''),
              status: a.status === 'running' ? 'running' : 'pending',
              progress: typeof a.progress === 'number' ? a.progress : prevTask?.progress ?? 0,
              lines: Array.isArray(a.lines) ? (a.lines as string[]) : (prevTask?.lines ?? []),
            })
          }
          return next
        })
        // 本地有、服务端已消失 → 已结束：逐个查终态收尾
        const gone = queueRef.current.filter((q) => !byId.has(q.id))
        for (const q of gone) await settleTask(q)
      } catch {
        // 服务端暂不可达：静默等待下一轮
      }
    }, 600)
  }

  // 刷新后恢复任务队列：任务注册表在服务端内存里，只要宿主进程没重启就还在；
  // 重新拉取 /active（数组）继续轮询，界面上显示「进行中」状态条，可展开查看实时输出。
  useEffect(() => {
    let cancelled = false
    const restore = async () => {
      try {
        const res = await fetch('/dsh-plugin-hub/active', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json() as {
          tasks?: { id?: unknown; action?: unknown; target?: unknown; status?: unknown; progress?: unknown; lines?: unknown }[]
        }
        if (cancelled) return
        const items: QueueTask[] = (data.tasks ?? [])
          .filter((a) => typeof a.id === 'number')
          .map((a) => ({
            id: a.id as number,
            kind: (a.action === 'remove' ? 'uninstall' : 'install') as 'install' | 'uninstall',
            target: typeof a.target === 'string' ? a.target.replace(/^github:/, '') : '',
            status: a.status === 'running' ? 'running' : 'pending',
            progress: typeof a.progress === 'number' ? a.progress : 0,
            lines: Array.isArray(a.lines) ? (a.lines as string[]) : [],
          }))
        if (items.length > 0) {
          applyQueue((prev) => [...prev, ...items.filter((n) => !prev.some((p) => p.id === n.id))])
          // 刷新后恢复的任务同样展开状态条，直接看到每行的进度明细
          setShowProgress(true)
          pollQueue()
        }
      } catch { /* host without the plugin's server routes */ }
    }
    void restore()
    return () => { cancelled = true }
  }, [])

  /** 弹窗动作：直接安装。请求宿主本地路由，任务进入服务端队列（FIFO），弹窗内实时显示进度。 */
  const installNow = async (p: HubPlugin) => {
    const repo = p.source?.repo ?? ''
    if (!repo) return
    opRepoRef.current = repo
    // 防重复入队：同一目标已在排队/执行中则忽略
    if (queueRef.current.some((q) => q.kind === 'install' && q.target === repo)) return
    try {
      const res = await fetch('/dsh-plugin-hub/install', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ repo }),
      })
      const data = await res.json() as { ok?: boolean; task?: number; error?: string }
      if (!data.ok || typeof data.task !== 'number') {
        // 请求层失败（重复安装 409 / 参数错误等）：完整错误弹窗
        onError(data.error ?? `HTTP ${res.status}`, opRepoRef.current, 'install')
        return
      }
      const taskId = data.task
      modalTaskRef.current = taskId
      applyQueue((prev) => [...prev, { id: taskId, kind: 'install', target: repo, status: 'pending', progress: 0, lines: [] }])
      // 新任务入队即展开状态条：标题在上、每行一个插件明细在下
      setShowProgress(true)
      pollQueue()
    } catch {
      onError(t('installFail'), opRepoRef.current, 'install')
    }
  }

  /** 弹窗动作：直接卸载。与安装同一队列机制，弹窗内实时显示进度。 */
  const uninstallNow = async (p: HubPlugin) => {
    const name = installedName(p)
    if (!name) return
    opRepoRef.current = p.source?.repo ?? null
    if (queueRef.current.some((q) => q.kind === 'uninstall' && q.target === name)) return
    try {
      const res = await fetch('/dsh-plugin-hub/uninstall', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json() as { ok?: boolean; task?: number; error?: string }
      if (!data.ok || typeof data.task !== 'number') {
        onError(data.error ?? `HTTP ${res.status}`, opRepoRef.current, 'uninstall')
        return
      }
      const taskId = data.task
      modalTaskRef.current = taskId
      applyQueue((prev) => [...prev, { id: taskId, kind: 'uninstall', target: name, status: 'pending', progress: 0, lines: [] }])
      // 新任务入队即展开状态条：标题在上、每行一个插件明细在下
      setShowProgress(true)
      pollQueue()
    } catch {
      onError(t('uninstallFail'), opRepoRef.current, 'uninstall')
    }
  }

  /** 取消任务：排队中立即出队，执行中终止子进程。 */
  const cancelTask = async (id: number) => {
    if (modalTaskRef.current === id) modalTaskRef.current = null
    try {
      await fetch('/dsh-plugin-hub/cancel', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      })
    } catch { /* 服务端不可达：乐观移除，下轮轮询自然收敛 */ }
    applyQueue((prev) => prev.filter((x) => x.id !== id))
  }

  /** 打开新弹窗前清空任务匹配：避免旧任务 id 误匹配到新弹窗。 */
  const clearModalTask = () => { modalTaskRef.current = null }

  // 弹窗对应任务：优先当前弹窗发起任务，其次按目标匹配（重新打开弹窗 / 目标已在队列时也能展示实时进度）
  const installModalTask = installPlugin
    ? (queue.find((q) => q.id === modalTaskRef.current)
      ?? queue.find((q) => q.kind === 'install' && q.target === (installPlugin.source?.repo ?? ''))
      ?? null)
    : null
  const uninstallModalTask = uninstallPlugin
    ? (queue.find((q) => q.id === modalTaskRef.current)
      ?? queue.find((q) => q.kind === 'uninstall' && q.target === (installedName(uninstallPlugin) ?? ''))
      ?? null)
    : null

  // 状态条摘要：标题按当前任务类型区分（安装进行中/卸载进行中），展示进度；有排队任务时附加队列数
  const running = queue.find((q) => q.status === 'running')
  const pendingCount = queue.filter((q) => q.status === 'pending').length
  const stripSummary = running
    ? `${(running.kind === 'install' ? t('runningInstall') : t('runningUninstall'))} ${running.progress}%${pendingCount > 0 ? ` · ${t('queueMore', { n: pendingCount })}` : ''}`
    : t('queueWaiting', { n: queue.length })

  return {
    queue,
    running,
    pendingCount,
    stripSummary,
    installModalTask,
    uninstallModalTask,
    showProgress,
    setShowProgress,
    installNow,
    uninstallNow,
    cancelTask,
    clearModalTask,
  }
}
