/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 后台安装/卸载任务队列：内存任务注册表 + FIFO 串行 worker + 子进程生命周期管理。
 * 每个任务一次 `dsh plugin --profile <profile> <action> <target>` 子进程，
 * 输出流式收集到任务上；卸载成功时尝试从运行中 loader 即时停用（见 loader.ts）。
 */
import { spawn } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import type { InstallResult, InstallTask, Invocation, QueueItem } from './install-types.ts'
import { CAPTURE_LIMIT_BYTES, MAX_TASKS, MAX_TASK_LINES } from './install-types.ts'
import { npmTooLowMarker } from './npm-check.ts'
import { cleanLine, estimateProgress } from '../profile/progress.ts'
import type { LoaderHandle } from '../loader.ts'
import { removeLoadedEntry } from '../loader.ts'
import { addPendingRestart, clearPendingRestart } from '../profile/pending-restart.ts'
import { addAllowBuildsKey, githubRepoOf, parseAllowBuildsKey, profileDirectory } from '../profile/profile.ts'
import { appendLog } from '../log.ts'

/** In-memory task registry, keyed by task id. */
const tasks = new Map<number, InstallTask>()
let nextTaskId = 1
/** Pending tasks awaiting their turn (FIFO). The queue worker runs at most one mutation at a time. */
const queue: QueueItem[] = []
/** Child processes of currently running tasks (for cancel). */
const runningChildren = new Map<number, ReturnType<typeof spawn>>()

/** Snapshot of a task (keeps the live object untouched by consumers). */
export function getTask(id: number): InstallTask | undefined {
  const task = tasks.get(id)
  if (!task) return undefined
  return { ...task, lines: task.lines.slice(0, MAX_TASK_LINES) }
}

export interface ActiveTaskInfo {
  id: number
  target: string
  action: 'add' | 'remove'
  status: 'pending' | 'running'
  progress: number
  lines: string[]
  /** 尝试过的安装方式（npm 反查 + 实际执行命令）：失败时前端 issue 预填需要 */
  attempts: string[]
}

/** All non-terminal tasks in queue order (running first, then pending). Lets the client resume a queue after a page reload. */
export function activeTask(): ActiveTaskInfo[] {
  const found: ActiveTaskInfo[] = []
  // 展示目标用 displayTarget（owner/repo）：安装 target 可能被服务端切成 npm 包名
  // （npm 反查命中），队列恢复/待重启展示对用户保持仓库名无感知
  const show = (task: InstallTask): string => task.displayTarget ?? task.target
  for (const item of queue) {
    const task = item.task
    if (task.status === 'pending') {
      found.push({ id: task.id, target: show(task), action: task.action, status: 'pending', progress: task.progress, lines: task.lines.slice(0, MAX_TASK_LINES), attempts: task.attempts })
    }
  }
  tasks.forEach((task) => {
    if (task.status === 'running') {
      found.unshift({ id: task.id, target: show(task), action: task.action, status: 'running', progress: task.progress, lines: task.lines.slice(0, MAX_TASK_LINES), attempts: task.attempts })
    }
  })
  return found
}

/**
 * True while a mutation child process is still alive. The concurrent slot is
 * keyed off the live child set rather than task.status: cancelling a running
 * task flips its status immediately, but the child may still be shutting down
 * (the close event lands later) — the slot must stay held until then, otherwise
 * a new task would start while the old pnpm still runs in the same profile dir.
 */
export function hasRunningTask(): boolean {
  return runningChildren.size > 0
}

/** Whether the target already has a non-terminal task in the queue (install/uninstall dedupe). */
export function hasQueuedTarget(target: string): boolean {
  return queue.some((it) => it.task.target === target && (it.task.status === 'pending' || it.task.status === 'running'))
}

/**
 * Cancel a queued or running task.
 * - pending: removed from the queue immediately (never spawned).
 * - running: kills the child process; the queue worker then picks the next one.
 * Returns false when the task is unknown or already finished.
 */
export function cancelTask(id: number): boolean {
  const task = tasks.get(id)
  if (!task) return false
  if (task.status === 'pending') {
    const index = queue.findIndex((it) => it.task === task)
    if (index >= 0) queue.splice(index, 1)
    task.status = 'cancelled'
    pushLine(task, '[cancelled]')
    return true
  }
  if (task.status === 'running') {
    task.status = 'cancelled'
    pushLine(task, '[cancelled]')
    const child = runningChildren.get(id)
    if (child) stopChild(child)
    return true
  }
  return false
}

function pushLine(task: InstallTask, line: string): void {
  const text = cleanLine(line)
  // pnpm 的 `Progress:` 行用 \r 原地刷新同一行：内容一变化就追加，
  // 日志像终端一样实时滚动（downloaded 0→1→2…）；内容与最新一条完全相同则跳过，
  // 避免同一进度反复刷新时无意义的重复堆积
  if (text !== task.lines[0]) {
    task.lines.unshift(text)
    if (task.lines.length > MAX_TASK_LINES) task.lines.length = MAX_TASK_LINES
  }
  const estimate = estimateProgress(text)
  if (estimate > 0) {
    task.progress = Math.max(task.progress, estimate)
  } else if (task.status === 'running' && task.progress < 85) {
    // 兜底：行无解析格式也随输出量推进，保证进度条始终在动（不会卡在 0）
    task.progress = Math.max(task.progress, 6 + Math.min(79, task.lines.length * 2))
  }
}

function cliInvocation(): Invocation {
  const entry = process.argv[1]
  if (entry !== undefined && /[\\/](?:bin\.(?:js|ts)|dsh)$/.test(entry)) {
    const absoluteEntry = resolve(entry)
    return {
      file: process.execPath,
      prefixArgs: [...process.execArgv, absoluteEntry],
      cwd: dirname(absoluteEntry),
      useShell: false,
    }
  }
  return { file: 'dsh', prefixArgs: [], cwd: process.cwd(), useShell: process.platform === 'win32' }
}

function stopChild(child: ReturnType<typeof spawn>): void {
  if (process.platform === 'win32' && child.pid !== undefined) {
    const killer = spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' })
    killer.once('error', () => child.kill('SIGKILL'))
    return
  }
  if (child.pid !== undefined) {
    // POSIX：dsh 内部会 fork pnpm，只杀 dsh 会让 pnpm 变成孤儿继续攥着管道，
    // close 事件永不到来、队列卡死。detached 让子进程成为进程组组长，
    // 对整组 SIGKILL 才能把 dsh + pnpm（及后代）一起清掉，close 随即触发。
    try {
      process.kill(-child.pid, 'SIGKILL')
      return
    } catch { /* 进程已退出：忽略 */ }
  }
  child.kill('SIGKILL')
}

/**
 * Enqueue a plugin mutation and return its task. Tasks run strictly serially:
 * the queue worker starts the next one only after the previous finishes.
 * Progress is visible through `getTask(id)` / `activeTask()` until done.
 */
export function startPluginMutation(options: {
  action: 'add' | 'remove'
  profile: string
  target: string
  timeoutMs?: number
  env?: NodeJS.ProcessEnv
  /** 全局 npm 安装（官方 `npm install -g <pkgs>`）：非空时执行全局安装，不进任何 profile、无需宿主重启 */
  globalNpm?: string[]
  /** 待重启行的展示目标（owner/repo）：卸载时用于把 npm 包名映射回仓库名 */
  displayTarget?: string
  /** 运行中 loader：卸载成功后主动移除条目、立即生效（缺失时卸载仍需重启清理） */
  uninstallLoader?: LoaderHandle
  /** 入队前已尝试的安装方式（npm registry 反查等）：失败提 Issue 时如实展示；实际执行的命令由 spawn 时追加 */
  attempts?: string[]
}): InstallTask {
  const task: InstallTask = { id: nextTaskId, target: options.target, displayTarget: options.displayTarget, globalNpm: options.globalNpm, action: options.action, status: 'pending', timedOut: false, exitCode: null, progress: 0, lines: [], attempts: options.attempts ?? [], needsRestart: false }
  nextTaskId = nextTaskId >= Number.MAX_SAFE_INTEGER ? 1 : nextTaskId + 1
  tasks.set(task.id, task)
  if (tasks.size > MAX_TASKS) {
    let removed = false
    tasks.forEach((candidate, id) => {
      if (!removed && candidate.status !== 'running' && candidate.status !== 'pending') {
        tasks.delete(id)
        removed = true
      }
    })
  }
  queue.push({ task, options: { ...options } })
  // 系统日志：记录任务入队（安装/卸载开始）
  const category = options.action === 'add' ? 'install' : 'uninstall'
  appendLog(options.profile, {
    at: Date.now(),
    level: 'info',
    category,
    event: `${category}.start`,
    message: `${options.action === 'add' ? '开始安装' : '开始卸载'} ${options.displayTarget ?? options.target}`,
  })
  pumpQueue()
  return task
}

/** Queue worker: at most one mutation runs at a time; pick the next pending task when the slot frees up. */
function pumpQueue(): void {
  if (hasRunningTask()) return
  const item = queue.find((it) => it.task.status === 'pending')
  if (!item) return
  const { task, options } = item
  task.status = 'running'
  void runPluginMutation({ ...options, task }).finally(() => {
    runningChildren.delete(task.id)
    // 系统日志：任务终态（成功/失败/取消），按动作归类安装/卸载日志
    const show = task.displayTarget ?? task.target
    const category = task.action === 'add' ? 'install' : 'uninstall'
    if (task.status === 'done') {
      appendLog(options.profile, {
        at: Date.now(),
        level: 'success',
        category,
        event: `${category}.done`,
        message: `${task.action === 'add' ? '安装成功' : '卸载成功'} ${show}${task.needsRestart ? '（待重启生效）' : ''}`,
      })
    } else if (task.status === 'failed') {
      appendLog(options.profile, {
        at: Date.now(),
        level: 'error',
        category,
        event: `${category}.fail`,
        message: `${task.action === 'add' ? '安装失败' : '卸载失败'} ${show}`,
      })
    } else if (task.status === 'cancelled') {
      appendLog(options.profile, {
        at: Date.now(),
        level: 'warn',
        category,
        event: 'task.cancel',
        message: `已取消 ${show}`,
      })
    }
    // 已终态的任务移出队列：既防 queue 数组无限增长（内存泄漏），也让下一轮 pump 干净
    const idx = queue.findIndex((it) => it.task === task)
    if (idx >= 0) queue.splice(idx, 1)
    pumpQueue()
  })
}

/**
 * Run one `dsh plugin --profile <profile> <action> <target>` spawn, stream
 * its output onto the tracked task and resolve with the captured result.
 * Never rejects; failures surface through the result / task state.
 */
function spawnMutation(options: {
  action: 'add' | 'remove'
  profile: string
  target: string
  timeoutMs?: number
  env?: NodeJS.ProcessEnv
  task?: InstallTask
  /** 待重启行的展示目标（owner/repo）：与 mutation 目标解耦——卸载的 mutation 目标是 npm 包名，展示要回退到仓库名 */
  displayTarget?: string
  /** 运行中 loader：卸载成功后主动移除条目、立即生效（缺失时卸载仍需重启清理） */
  uninstallLoader?: LoaderHandle
  /** 全局 npm 安装（官方 `npm install -g <pkgs>`）：非空时执行全局安装，不进任何 profile、无需宿主重启 */
  globalNpm?: string[]
}): Promise<InstallResult> {
  const { action, profile, target, timeoutMs = 5 * 60 * 1000, env, task, displayTarget, uninstallLoader, globalNpm } = options
  // 全局 npm 安装：直接 spawn 本机 npm（`npm install -g <pkgs>`），不是 dsh plugin 命令
  const isGlobalNpm = (globalNpm ?? []).length > 0
  const invocation = isGlobalNpm
    ? { file: 'npm', prefixArgs: [], cwd: process.cwd(), useShell: process.platform === 'win32' }
    : cliInvocation()
  const args = isGlobalNpm
    ? ['install', '-g', ...(globalNpm ?? [])]
    : [...invocation.prefixArgs, 'plugin', '--profile', profile, action, target]
  // 记录实际执行的命令（npm 通道显示包名，git 通道显示 HTTPS 源），
  // 失败提 Issue 时作为「已尝试的安装方式」随附
  const executed = isGlobalNpm
    ? `npm install -g ${(globalNpm ?? []).join(' ')}`
    : `dsh plugin --profile ${profile} ${action} ${target}`
  if (task && !task.attempts.includes(executed)) {
    task.attempts.push(executed)
  }
  // 单次 spawn 并捕获结果：流式输出打日志 + 超时/取消兜底，close 后 resolve。
  // 不做任何终态后处理（exitCode/status/needsRestart 由下方统一收尾），
  // 这样全局 npm 首次失败后可以干净地换参数重试一次。
  const spawnOnce = (attemptArgs: string[]): Promise<InstallResult> => new Promise((resolveOnce) => {
    let stdout = ''
    let stderr = ''
    let timedOut = false
    let settled = false
    let child: ReturnType<typeof spawn>
    try {
      child = spawn(invocation.file, attemptArgs, {
        cwd: invocation.cwd,
        env,
        shell: invocation.useShell,
        // detached 使子进程成为独立进程组组长：取消时能整组清理（见 stopChild），
        // 且宿主进程崩溃后安装任务不会被连带误杀
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    } catch (error) {
      if (task) {
        task.status = 'failed'
        task.exitCode = null
        pushLine(task, `[error] ${error instanceof Error ? error.message : String(error)}`)
      }
      resolveOnce({
        exitCode: null,
        timedOut: false,
        error: error instanceof Error ? error.message : String(error),
        stdout,
        stderr,
      })
      return
    }
    if (task) runningChildren.set(task.id, child)

    // 兜底定时器句柄：整段超时 / exit 后 close 宽限 / 强制收尾
    let timer: ReturnType<typeof setTimeout> | undefined
    let progressTimer: ReturnType<typeof setInterval> | undefined
    let exitWatch: ReturnType<typeof setTimeout> | undefined
    let forceSettle: ReturnType<typeof setTimeout> | undefined

    // 唯一收尾入口：close / error / 兜底超时 三者只放行一次，确保任务持续推进
    const settleOnce = (result: InstallResult): void => {
      if (settled) return
      settled = true
      if (timer !== undefined) clearTimeout(timer)
      if (progressTimer !== undefined) clearInterval(progressTimer)
      if (exitWatch !== undefined) clearTimeout(exitWatch)
      if (forceSettle !== undefined) clearTimeout(forceSettle)
      if (task) runningChildren.delete(task.id)
      resolveOnce(result)
    }

    timer = setTimeout(() => {
      timedOut = true
      stopChild(child)
    }, timeoutMs)
    // 时间兜底：即使 CLI 静默不吐进度行，进度条也单调推进，不会卡在 0
    progressTimer = setInterval(() => {
      if (task && task.status === 'running' && task.progress < 85) task.progress += 1
    }, 500)
    const collect = (kind: 'stdout' | 'stderr', chunk: Buffer): void => {
      const text = chunk.toString()
      if (kind === 'stdout') stdout = (stdout + text).slice(-CAPTURE_LIMIT_BYTES)
      else stderr = (stderr + text).slice(-CAPTURE_LIMIT_BYTES)
      if (task) {
        // 原生透传 pnpm/npm 输出：stdout/stderr 原样入日志，不做格式化，保证报错信息完整可见
        for (const line of text.split(/\r?\n|\r/)) {
          if (line.trim() !== '') pushLine(task, line.trimEnd())
        }
      }
    }
    child.stdout?.on('data', (chunk: Buffer) => collect('stdout', chunk))
    child.stderr?.on('data', (chunk: Buffer) => collect('stderr', chunk))

    child.once('exit', () => {
      // dsh 内部会 fork pnpm：pnpm 退出后仍攥着 stdout/stderr 管道时，
      // close 事件不会到来。exit 后给 close 一段宽限，未按时触发则整组清理强制结束，
      // 确保任务进入终态、后续排队任务自动启动。
      exitWatch = setTimeout(() => {
        if (settled) return
        if (task && task.status !== 'cancelled') pushLine(task, '[stale pipe] force closing child')
        stopChild(child)
        // 清理后极端情况下 close 仍未触发（kill 失败）：再兜底强制收尾
        forceSettle = setTimeout(() => {
          if (settled) return
          if (task && task.status !== 'cancelled') {
            task.status = 'failed'
            task.exitCode = null
            task.timedOut = true
            pushLine(task, '[timed out]')
          }
          settleOnce({ exitCode: null, timedOut: true, error: 'child failed to close', stdout, stderr })
        }, 5_000)
      }, 3_000)
    })

    child.once('error', (error) => {
      if (task && task.status !== 'cancelled') {
        task.status = 'failed'
        task.exitCode = null
        pushLine(task, `[error] ${error.message}`)
      }
      settleOnce({ exitCode: null, timedOut: false, error: error.message, stdout, stderr })
    })

    child.once('close', (code) => {
      settleOnce({ exitCode: code, timedOut, error: null, stdout, stderr })
    })
  })

  return (async () => {
    let result = await spawnOnce(args)
    // npm 11 的 arborist peer-set bug（`Cannot read properties of null (reading 'children')`，npm/cli#9911）：
    // 某些包的 peerDependencies 用「双段 prerelease 范围」（如 dsh-tui@0.9.0 的 `^0.1.0-rc.6 || ^0.1.1-rc.1`，
    // 26 个必需 peer 全是这种形状）会让 `npm install -g` 在解析阶段直接崩溃 —— 退出码 1、什么都没装，
    // 与是不是从我们界面发起无关（终端里同样复现）。首次失败后自动带 `--legacy-peer-deps` 重试一次：
    // 跳过 peer 自动解析即可绕过该 bug（peer 通常由同装的 @deepseek-ai/dsh 依赖树天然提供）。
    // 二次尝试仍失败则保留其错误信息，不掩盖真正的原因。
    if (isGlobalNpm && result.exitCode !== 0 && !result.timedOut && task?.status !== 'cancelled') {
      const retryArgs = ['install', '-g', '--legacy-peer-deps', ...(globalNpm ?? [])]
      const retryExecuted = `npm install -g --legacy-peer-deps ${(globalNpm ?? []).join(' ')}`
      if (task && !task.attempts.includes(retryExecuted)) task.attempts.push(retryExecuted)
      if (task) pushLine(task, '[npm] peer-set resolution crashed npm (known npm bug) — retrying with --legacy-peer-deps')
      result = await spawnOnce(retryArgs)
    }
    // 统一终态后处理：exitCode/status/needsRestart 以最后一次尝试为准
    if (task) {
      task.exitCode = result.exitCode
      task.timedOut = result.timedOut
      if (task.status !== 'cancelled') {
        task.status = result.timedOut || result.exitCode !== 0 ? 'failed' : 'done'
        if (task.status === 'done') {
          task.progress = 100
          if (isGlobalNpm) {
            // 全局 npm 安装：装的是本机 CLI 工具（如 dsh-tui），不进任何 profile，无需宿主重启
            task.needsRestart = false
          } else if (action === 'remove' && uninstallLoader) {
            // 卸载成功 → 主动从运行中 loader 停用该包条目；
            // 仅当宿主从未加载过它（磁盘已干净）才判「无需重启」；
            // 只要曾在 loader 中存活（停用过 live entry）就仍要求重启——
            // 带 UI 的插件（侧边栏面板等宿主启动时渲染的槽位）disable 后不会
            // 主动消失，重启才能立即摘除面板
            const removed = await removeLoadedEntry(uninstallLoader, target)
            task.needsRestart = !removed
            if (removed) clearPendingRestart(displayTarget ?? target)
            else addPendingRestart(displayTarget ?? target, 'uninstall')
          } else {
            // 安装成功（或卸载但无 loader 引用）→ 登记待重启：
            // 插件要宿主重启才会挂载/卸载干净，重启前一直提醒；展示目标用 displayTarget（owner/repo）
            task.needsRestart = true
            addPendingRestart(displayTarget ?? target, action === 'add' ? 'install' : 'uninstall')
          }
        }
        pushLine(task, result.timedOut ? '[timed out]' : `[exit ${result.exitCode ?? '?'}]`)
      }
    }
    return result
  })()
}

/**
 * 安装后校验已装包的入口文件（package.json 的 main / exports["."].default）是否真实存在。
 * git: 分发常不提交构建产物（lib/ 等），pnpm 装完没有报错，但宿主重启加载插件树时会
 * ERR_MODULE_NOT_FOUND 直接崩溃、网页打不开 —— 这里在登记「待重启」前就把这类残缺包拦下。
 * 返回 { name, missing }：name 为空表示无法定位目标包（跳过校验）；missing 为缺失的入口路径。
 */
export function verifyInstalledEntry(profile: string, target: string): { name: string | null; missing: string | null } {
  let profilePkg: Record<string, unknown> | null = null
  try {
    profilePkg = JSON.parse(readFileSync(join(profileDirectory(profile), 'package.json'), 'utf8')) as Record<string, unknown>
  } catch {
    return { name: null, missing: null }
  }
  const deps = (profilePkg?.dependencies ?? {}) as Record<string, string>
  // target 自身是依赖名（npm 包），或通过 Git specifier 反查依赖名
  const targetRepo = githubRepoOf(target)?.toLowerCase()
  const name = targetRepo !== undefined
    ? Object.keys(deps).find((k) => githubRepoOf(deps[k])?.toLowerCase() === targetRepo)
    : deps[target] !== undefined ? target : Object.keys(deps).find((k) => deps[k] === target)
  if (!name) return { name: null, missing: null }
  const pkgDir = join(profileDirectory(profile), 'node_modules', name)
  let entry: string | null = null
  try {
    const meta = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8')) as {
      main?: unknown
      exports?: unknown
    }
    const dot = (meta.exports as Record<string, unknown> | undefined)?.['.']
    const resolved = typeof dot === 'string' ? dot
      : dot !== null && typeof dot === 'object'
        ? (dot as Record<string, unknown>).default
        : undefined
    entry = typeof resolved === 'string' ? resolved : typeof meta.main === 'string' ? meta.main : 'index.js'
  } catch {
    return { name, missing: null }
  }
  try {
    return { name, missing: statSync(join(pkgDir, entry)).isFile() ? null : entry }
  } catch {
    return { name, missing: entry }
  }
}

/** 从 pnpm `Ignored build scripts:` 提示行解析被拦截的构建脚本 key（name@version，逗号分隔）。 */
function ignoredBuildKeys(output: string): string[] {
  const m = /Ignored build scripts:\s*(.+)/i.exec(output)
  if (m === null) return []
  return m[1]
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
}

/** npm arborist edgesOut 崩溃 + 本机 npm 版本过低 → 把 [npm-too-low] 标记追加到任务输出，
 *  前端据此展示「本机 npm 版本过低」的准确原因 —— 避免该报错被外层 ERR_PNPM_PREPARE_PACKAGE
 *  误判成插件打包/分发问题、误导用户提 Issue。检测逻辑在独立的 npm-check.ts（本机 npm 环境职责）。 */
function annotateNpmTooLow(result: InstallResult, options: {
  action: 'add' | 'remove'
  task?: InstallTask
  env?: NodeJS.ProcessEnv
}): InstallResult {
  if (options.action !== 'add' || result.exitCode === 0 || result.timedOut) return result
  const line = npmTooLowMarker(`${result.stderr}\n${result.stdout}`, options.env)
  if (line === null) return result
  if (options.task && options.task.status !== 'cancelled') pushLine(options.task, line)
  return { ...result, stderr: `${result.stderr}\n${line}`, error: result.error ? `${result.error}\n${line}` : line }
}

/**
 * Run a plugin mutation with one recovery path: when `add` fails because
 * pnpm's allowBuilds gate blocks a build script — either the git-hosted
 * package's own `prepare` (`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`, key from
 * the printed key@url hint) or a dependency's native build
 * (`ERR_PNPM_IGNORED_BUILDS`, key = the listed name@version) — write the
 * exact keys into the profile's pnpm-workspace.yaml and retry once.
 * Other failures fall through to the single-spawn result.
 */
export async function runPluginMutation(options: {
  action: 'add' | 'remove'
  profile: string
  target: string
  timeoutMs?: number
  env?: NodeJS.ProcessEnv
  task?: InstallTask
  /** 待重启行的展示目标（owner/repo）：卸载时用于把 npm 包名映射回仓库名 */
  displayTarget?: string
  /** 运行中 loader：卸载成功后主动移除条目、立即生效（缺失时卸载仍需重启清理） */
  uninstallLoader?: LoaderHandle
  /** 全局 npm 安装（官方 `npm install -g <pkgs>`）：非空时执行全局安装，不进任何 profile、无需宿主重启 */
  globalNpm?: string[]
}): Promise<InstallResult> {
  let result = await spawnMutation(options)
  // allowBuilds 放行 / 装后入口校验都是 profile 专属（pnpm 装进 profile 的场景）；
  // 全局 npm 安装直接走 npm，无 pnpm allowBuilds 拦截、也不进 profile，跳过这两类恢复
  if (options.action === 'add' && result.exitCode !== 0 && !result.timedOut && (options.globalNpm ?? []).length === 0) {
    const output = `${result.stderr}\n${result.stdout}`
    // git 源：pnpm 打印的 key@url 提示
    if (output.includes('ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED')) {
      const key = parseAllowBuildsKey(output)
      if (key !== null) {
        if (options.task) {
          // First attempt already marked the task failed; reset it so the
          // retry streams progress as a running task again.
          options.task.status = 'running'
          options.task.exitCode = null
          pushLine(options.task, `[allow build] ${key}`)
        }
        addAllowBuildsKey(options.profile, key)
        result = await spawnMutation(options)
      }
    }
    // 依赖原生模块/构建脚本被 pnpm v11 拦截（ERR_PNPM_IGNORED_BUILDS）：git 与 npm 源都会出现。
    // allowBuilds 的 key 是输出里列出的 name@version（如 node-pty@1.1.0），逐个放行后重试一次；
    // 输出解析不到时回退用目标名（插件自身构建脚本被拦的 npm 场景）。
    // 用重试后的最终结果判断：git 源放行 prepare 后可能又在依赖层撞上原生构建拦截。
    if (result.exitCode !== 0 && !result.timedOut && `${result.stderr}\n${result.stdout}`.includes('ERR_PNPM_IGNORED_BUILDS')) {
      const keys = ignoredBuildKeys(`${result.stderr}\n${result.stdout}`)
      if (keys.length === 0 && githubRepoOf(options.target) === null) keys.push(options.target)
      if (keys.length > 0) {
        if (options.task) {
          options.task.status = 'running'
          options.task.exitCode = null
          pushLine(options.task, `[allow build] ${keys.join(', ')}`)
        }
        for (const key of keys) addAllowBuildsKey(options.profile, key)
        result = await spawnMutation(options)
      }
    }
  }
  // pnpm 安装本身成功，但目标包入口文件缺失（git 分发缺构建产物）→ 判为失败：
  // 撤销刚登记的待重启，避免用户重启时宿主加载残缺包直接崩溃。
  // 全局 npm 安装不进 profile（profile deps 里没有这些包），跳过入口校验
  if (options.action === 'add' && result.exitCode === 0 && !result.timedOut && (options.globalNpm ?? []).length === 0) {
    const verified = verifyInstalledEntry(options.profile, options.target)
    if (verified.name !== null && verified.missing !== null) {
      clearPendingRestart(options.displayTarget ?? options.target)
      const detail = `[packaging] ${verified.name}: entry file missing: ${verified.missing} (git distribution lacks build output — install the npm version or report to the author)`
      if (options.task && options.task.status !== 'cancelled') {
        options.task.status = 'failed'
        options.task.exitCode = null
        options.task.progress = 0
        pushLine(options.task, detail)
      }
      return { exitCode: 1, timedOut: false, error: `entry file missing: ${verified.missing}`, stdout: result.stdout, stderr: `${result.stderr}\n${detail}` }
    }
  }
  // npm arborist edgesOut 崩溃 + 本机 npm 版本过低 → 追加 [npm-too-low] 标记，前端据此给准确原因
  return annotateNpmTooLow(result, options)
}
