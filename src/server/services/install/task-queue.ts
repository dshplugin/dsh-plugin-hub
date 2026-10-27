/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 后台安装/卸载任务队列：内存任务注册表 + FIFO 串行 worker + 子进程生命周期管理。
 * 每个任务一次 `dsh plugin --profile <profile> <action> <target>` 子进程，
 * 输出流式收集到任务上；卸载成功时尝试从运行中 loader 即时停用（见 loader.ts）。
 */
import { spawn, spawnSync } from 'node:child_process'
import { requiredDistributionFiles, resolveBundlePatchFiles, type PackageManifest } from './package-entry.ts'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import type { InstallResult, InstallTask, Invocation, QueueItem } from './install-types.ts'
import { CAPTURE_LIMIT_BYTES, MAX_TASKS, MAX_TASK_LINES } from './install-types.ts'
import { npmTooLowMarker } from './npm-check.ts'
import { registryMissingMarker } from './registry-check.ts'
import { backfillOperationLog, createOperationLogTap, hasSubstantiveOutput, operationLogPathOf } from './operation-log.ts'
import { cleanLine, estimateProgress } from '../profile/progress.ts'
import type { LoaderHandle } from '../loader.ts'
import { hasClientUi, isDshPlugin, mountLoadedEntry, removeLoadedEntry } from '../loader.ts'
import { addPendingRestart, clearPendingRestart } from '../profile/pending-restart.ts'
import { addAllowBuildsKey, bundleIncludes, githubRepoOf, parseAllowBuildsKey, profileDirectory, validPackageName } from '../profile/profile.ts'
import { appendLog } from '../log.ts'
import { commandOnPath, gitMissingDetail } from './preflight.ts'
import { isTransportFailure, registryHost } from './registry-fallback.ts'
import { dshTooOldMarker } from './dsh-compat.ts'
import { OutputDecoder } from './decode-output.ts'

/** 内存任务注册表，按任务 id 索引。 */
const tasks = new Map<number, InstallTask>()
let nextTaskId = 1
/** 等待轮到的排队任务（FIFO）。队列 worker 同一时刻最多跑一个变更。 */
const queue: QueueItem[] = []
/** 当前运行任务的子进程（用于取消）。 */
const runningChildren = new Map<number, ReturnType<typeof spawn>>()

/** 任务快照（避免消费方改动实时对象）。 */
export function getTask(id: number): InstallTask | undefined {
  const task = tasks.get(id)
  if (!task) return undefined
  return { ...task, lines: task.lines.slice(0, MAX_TASK_LINES) }
}

export interface ActiveTaskInfo {
  id: number
  target: string
  action: 'add' | 'remove' | 'update'
  status: 'pending' | 'running'
  progress: number
  lines: string[]
  /** 尝试过的安装方式（实际执行过的命令）：失败时前端 issue 预填需要 */
  attempts: string[]
  /** 自定义安装入口渠道（NPM 包卡片）：前端刷新恢复后仍能精准溯源 */
  installChannel?: 'npm'
}

/** 全部未终态任务，按队列顺序（running 在前、pending 在后）。供客户端刷新页面后恢复队列。 */
export function activeTask(): ActiveTaskInfo[] {
  const found: ActiveTaskInfo[] = []
  // 展示目标用 displayTarget（owner/repo）：安装 target 是 npm 包名，
  // 队列恢复/待重启展示对用户保持仓库名无感知
  const show = (task: InstallTask): string => task.displayTarget ?? task.target
  for (const item of queue) {
    const task = item.task
    if (task.status === 'pending') {
      found.push({
        id: task.id,
        target: show(task),
        action: task.action,
        status: 'pending',
        progress: task.progress,
        lines: task.lines.slice(0, MAX_TASK_LINES),
        attempts: task.attempts,
        installChannel: task.installChannel,
      })
    }
  }
  tasks.forEach((task) => {
    if (task.status === 'running') {
      found.unshift({
        id: task.id,
        target: show(task),
        action: task.action,
        status: 'running',
        progress: task.progress,
        lines: task.lines.slice(0, MAX_TASK_LINES),
        attempts: task.attempts,
        installChannel: task.installChannel,
      })
    }
  })
  return found
}

/**
 * 变更子进程仍存活时为 true。并发占位以存活子进程集合为准，而非 task.status：
 * 取消运行中任务会立即翻转其状态，但子进程可能仍在退出中（close 事件稍后才到）——
 * 占位必须维持到那时，否则旧 pnpm 还在同一 profile 目录跑，新任务就开始了。
 */
export function hasRunningTask(): boolean {
  return runningChildren.size > 0
}

/** 目标在队列里是否已有未终态任务（安装/卸载去重）。 */
export function hasQueuedTarget(target: string): boolean {
  return queue.some((it) => it.task.target === target && (it.task.status === 'pending' || it.task.status === 'running'))
}

/**
 * 取消排队中或运行中的任务。
 * - pending：立即移出队列（从未 spawn）。
 * - running：杀掉子进程；队列 worker 随后取下一个。
 * 任务不存在或已结束时返回 false。
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

/** spawn 的 cwd：profile 目录（asar 路径不能作 cwd）；目录不存在时回退进程工作目录，
 *  否则 Node 报的是 `spawn <file> ENOENT`，与「可执行文件不存在」无法区分。 */
function spawnCwdFor(profile: string): string {
  const dir = profileDirectory(profile)
  return existsSync(dir) ? dir : process.cwd()
}

function cliInvocation(profile: string): Invocation {
  const entry = process.argv[1]
  if (entry !== undefined) {
    // 打包桌面端（Electron）：宿主入口在 app.asar 内，机器上根本没有 `dsh` 可执行文件
    //（Windows 那条 dsh.cmd shim 只存在于宿主进程自己的 PATH 里），直接回退 PATH 必然
    // 报 [dsh-missing]。这里改用应用自己的 CLI 引导脚本调起同一份打包
    // CLI：Electron 可执行文件 + --expose-internals + desktop-cli.js，与内置终端、
    // 官方插件页安装完全同一条路径 —— desktop profile 由应用独占管理的授权也在其中。
    const bootstrap = desktopCliBootstrap(entry)
    if (bootstrap !== null) {
      return {
        file: process.execPath,
        prefixArgs: ['--expose-internals', bootstrap],
        // cwd 用 profile 目录（asar 路径不能作 cwd），不存在时由 spawnCwdFor 回退
        cwd: spawnCwdFor(profile),
        useShell: false,
        // Electron 可执行文件只有带这个变量才按 Node 运行引导脚本
        env: { ELECTRON_RUN_AS_NODE: '1' },
      }
    }
    if (/[\\/](?:bin\.(?:js|ts)|dsh)$/.test(entry)) {
      const absoluteEntry = resolve(entry)
      return {
        file: process.execPath,
        prefixArgs: [...process.execArgv, absoluteEntry],
        cwd: dirname(absoluteEntry),
        useShell: false,
      }
    }
  }
  return { file: 'dsh', prefixArgs: [], cwd: process.cwd(), useShell: process.platform === 'win32' }
}

/**
 * 打包桌面端宿主的 CLI 引导脚本路径（`<asar 根>/lib/desktop-cli.js`，即应用内
 * pnpm 服务的 dshBootstrapPath）。宿主入口落在 app.asar 内时按 asar 根反推候选路径，
 * 命中存在的那个才采用；布局不认识（官方改版）时返回 null，调用方回退原逻辑。
 * 导出供单测覆盖路径推导。
 */
export function desktopCliBootstrap(entry: string): string | null {
  const marker = /[\\/]app\.asar(?=[\\/]|$)/i.exec(entry)
  if (marker === null) return null
  const root = entry.slice(0, marker.index + marker[0].length)
  const candidates = [
    join(root, 'lib', 'desktop-cli.js'),
    join(root, 'dsh', 'lib', 'desktop-cli.js'),
    // DeepSeek Harness 0.2.x 的布局：宿主入口本身就是 @deepseek-ai/dsh-desktop-host/lib/index.js，
    // 保留档 CLI 是它同目录的 cli.js（内部以 manageDesktopProfile 放行 desktop 档的插件管理）。
    // 漏掉这个布局就会回退 PATH 上的 dsh，而 `dsh plugin --profile desktop …` 必被
    // 「profile desktop is managed exclusively by the Electron application」拒绝 —— 桌面端全部安装失败。
    join(dirname(entry), 'cli.js'),
  ]
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }
  return null
}

/**
 * 传给 CLI 的安装目标：钉住版本优先（Hub 自我更新提示的是已过供应链门禁的版本），
 * 其次 npm 的 add/update 都显式 `@latest`；git 源、全局安装、已带版本/tag 的 spec 保持原样。
 */
export function npmInstallTargetOf(target: string, opts: { update: boolean; global: boolean; pinned?: string; add?: boolean }): string {
  if (opts.global || githubRepoOf(target) !== null) return target
  if (opts.pinned !== undefined && opts.pinned !== '') return opts.pinned
  // 裸包名才补 @latest：pnpm 对已存在的精确 spec 是幂等的，不显式要求就会留用旧版本
  if (!(opts.update || opts.add) || !validPackageName(target)) return target
  return `${target}@latest`
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

/** 系统日志类别：安装/卸载/更新三分，针对性地判断「哪一步不兼容」。 */
function mutationCategory(action: 'add' | 'remove' | 'update'): 'install' | 'uninstall' | 'update' {
  return action === 'remove' ? 'uninstall' : action === 'update' ? 'update' : 'install'
}

/** 系统日志动作词：开始安装/开始卸载/开始更新。 */
function mutationVerb(action: 'add' | 'remove' | 'update'): string {
  return action === 'remove' ? '开始卸载' : action === 'update' ? '开始更新' : '开始安装'
}

/** 系统日志入口渠道后缀：自定义安装（带渠道）在日志里体现「从哪张卡片发起」，
 *  目录插件安装（无渠道）返回空串。日志中文语境，渠道名用中文口语。 */
function channelLabel(channel: 'npm' | undefined): string {
  if (channel === 'npm') return '（NPM 包入口）'
  return ''
}

/**
 * 插件变更入队并返回其任务。任务严格串行：队列 worker 只在上一个结束后才启动下一个。
 * 完成前可通过 `getTask(id)` / `activeTask()` 查看进度。
 */
export function startPluginMutation(options: {
  action: 'add' | 'remove' | 'update'
  profile: string
  target: string
  timeoutMs?: number
  env?: NodeJS.ProcessEnv
  /** 全局 npm 安装（官方 `npm install -g <pkgs>`）：非空时执行全局安装，不进任何 profile、无需宿主重启 */
  globalNpm?: string[]
  /** 待重启行的展示目标（owner/repo）：卸载时用于把 npm 包名映射回仓库名 */
  displayTarget?: string
  /** 运行中 loader：安装成功后热挂新条目、卸载成功后停用旧条目，两类操作都尽量立即生效
   *  （缺失时安装/卸载仍需重启） */
  loader?: LoaderHandle
  /** 入队前已尝试的安装方式：失败提 Issue 时如实展示；实际执行的命令由 spawn 时追加 */
  attempts?: string[]
  /** 更新已安装的 npm 包（mode=update）：命令显式带 @latest，让 pnpm 真正解析最新版本 */
  updateNpm?: boolean
  /** 自定义安装入口渠道（NPM 包卡片）：任务输出行与系统日志据此溯源「从哪个入口发起」；
   *  目录插件安装不传 */
  installChannel?: 'npm'
  /** npm 源候选（首选在前）：传输层失败时按顺序换源重试，空/单个表示不降级 */
  registries?: string[]
  /** 精确安装 spec（如 `dsh-plugin@2.0.5`）：Hub 自我更新提示的是已过供应链门禁的版本，
   *  必须钉住安装，不能再用 @latest 被带回门禁内的最新版 */
  installSpec?: string
}): InstallTask {
  // 卸载入队时先快照「该包是否带客户端 UI」：卸载完成后包已从磁盘删除，读不到 package.json，
  // 只能在此刻取；卸载成功且曾存活时据此决定是否要刷新页面摘除插件面板
  const hadClientUi = options.action === 'remove' ? hasClientUi(options.profile, options.target) : undefined
  const task: InstallTask = {
    id: nextTaskId,
    target: options.target,
    displayTarget: options.displayTarget,
    globalNpm: options.globalNpm,
    action: options.action,
    status: 'pending',
    timedOut: false,
    exitCode: null,
    progress: 0,
    lines: [],
    attempts: options.attempts ?? [],
    needsRestart: false,
    hadClientUi,
    installChannel: options.installChannel,
  }
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
  // 任务输出首行标记入口渠道（ASCII 标记，乱码免疫）：进度面板/失败明细里能溯源「从哪张卡片发起」
  if (options.installChannel !== undefined) {
    pushLine(task, `[install-channel] ${options.installChannel}`)
  }
  // 系统日志：记录任务入队（安装/卸载/更新开始），自定义安装带入口渠道后缀
  const category = mutationCategory(options.action)
  appendLog(options.profile, {
    at: Date.now(),
    level: 'info',
    category,
    event: `${category}.start`,
    message: `${mutationVerb(options.action)} ${options.displayTarget ?? options.target}${channelLabel(options.installChannel)}`,
  })
  pumpQueue()
  return task
}

/** 队列 worker：同一时刻最多跑一个变更；占位空出时取下一个 pending 任务。 */
function pumpQueue(): void {
  if (hasRunningTask()) return
  const item = queue.find((it) => it.task.status === 'pending')
  if (!item) return
  const { task, options } = item
  task.status = 'running'
  void runPluginMutation({ ...options, task })
    .catch((error) => {
      // runPluginMutation 的恢复路径（如 allowBuilds 写回 pnpm-workspace.yaml）
      // 可能抛出；落到 failed 终态并留痕，否则该 Promise 链成为未处理 rejection
      //（Node >= 15 默认直接终止进程），而队列自身却在 finally 里继续 pump。
      if (task.status !== 'cancelled') {
        task.status = 'failed'
        task.exitCode = null
        task.progress = 0
        pushLine(task, `[internal] ${error instanceof Error ? error.message : String(error)}`)
      }
    })
    .finally(() => {
    runningChildren.delete(task.id)
    // 系统日志：任务终态（成功/失败/取消），按动作归类安装/卸载/更新日志
    const show = task.displayTarget ?? task.target
    const category = mutationCategory(task.action)
    const verb = (v: '成功' | '失败') => task.action === 'remove' ? `卸载${v}` : task.action === 'update' ? `更新${v}` : `安装${v}`
    if (task.status === 'done') {
      appendLog(options.profile, {
        at: Date.now(),
        level: 'success',
        category,
        event: `${category}.done`,
        message: `${verb('成功')} ${show}${channelLabel(options.installChannel)}${task.needsRestart ? '（待重启生效）' : ''}`,
      })
    } else if (task.status === 'failed') {
      appendLog(options.profile, {
        at: Date.now(),
        level: 'error',
        category,
        event: `${category}.fail`,
        message: `${verb('失败')} ${show}${channelLabel(options.installChannel)}`,
      })
    } else if (task.status === 'cancelled') {
      appendLog(options.profile, {
        at: Date.now(),
        level: 'warn',
        category,
        event: 'task.cancel',
        message: `已取消 ${show}${channelLabel(options.installChannel)}`,
      })
    }
    // 已终态的任务移出队列：既防 queue 数组无限增长（内存泄漏），也让下一轮 pump 干净
    const idx = queue.findIndex((it) => it.task === task)
    if (idx >= 0) queue.splice(idx, 1)
    pumpQueue()
  })
}

/**
 * 执行一次 `dsh plugin --profile <profile> <action> <target>` spawn，把输出流式写到
 * 跟踪的任务上，并以捕获结果 resolve。绝不 reject；失败通过结果/任务状态体现。
 */
function spawnMutation(options: {
  action: 'add' | 'remove' | 'update'
  profile: string
  target: string
  timeoutMs?: number
  env?: NodeJS.ProcessEnv
  task?: InstallTask
  /** 待重启行的展示目标（owner/repo）：与 mutation 目标解耦——卸载的 mutation 目标是 npm 包名，展示要回退到仓库名 */
  displayTarget?: string
  /** 运行中 loader：安装成功后热挂新条目、卸载成功后停用旧条目（缺失时仍需重启） */
  loader?: LoaderHandle
  /** 全局 npm 安装（官方 `npm install -g <pkgs>`）：非空时执行全局安装，不进任何 profile、无需宿主重启 */
  globalNpm?: string[]
  /** 更新已安装的 npm 包（mode=update）：命令显式带 @latest，让 pnpm 真正解析最新版本 */
  updateNpm?: boolean
  /** npm 源候选（首选在前）：传输层失败时按顺序换源重试 */
  registries?: string[]
  /** 精确安装 spec（如 `dsh-plugin@2.0.5`）：见 startPluginMutation 同名说明 */
  installSpec?: string
}): Promise<InstallResult> {
  const { action, profile, target, timeoutMs = 5 * 60 * 1000, env, task, displayTarget, loader, globalNpm, updateNpm, registries, installSpec } = options
  // 全局 npm 安装：直接 spawn 本机 npm（`npm install -g <pkgs>`），不是 dsh plugin 命令
  const isGlobalNpm = (globalNpm ?? []).length > 0
  const invocation = isGlobalNpm
    ? { file: 'npm', prefixArgs: [], cwd: process.cwd(), useShell: process.platform === 'win32' }
    : cliInvocation(profile)
  // 打包桌面端却回退到 PATH 上的 dsh：说明 desktop CLI 引导路径没命中，desktop profile 必被宿主拒绝。
  // 留一行 ASCII 标记，后续同类上报可直接区分「用户自起 CLI」与「我们没走对引导路径」。
  if (task && task.status !== 'cancelled' && invocation.file === 'dsh'
    && (process.versions as Record<string, string | undefined>).electron !== undefined) {
    pushLine(task, '[desktop-cli-fallback] running inside Electron but no desktop CLI bootstrap was found — falling back to dsh on PATH (a desktop-managed profile will be rejected)')
  }
  // 安装/更新 npm 包都显式 @latest：pnpm add <pkg>（无版本）对已存在的精确 spec 是幂等的，
  // 会原样留用旧版本（更新不生效，普通安装也可能装回不支持当前宿主的旧包）。
  // update 动作同样执行 `add <target>@latest`，CLI 动词透传 add，不与官方 update 动词分叉。
  const isUpdate = action === 'update' || updateNpm === true
  const cliAction = action === 'update' ? 'add' : action
  // 钉住版本优先于 @latest：提示的是「已过门禁」的版本，装 latest 会被 pnpm 拒绝
  const npmUpdateTarget = npmInstallTargetOf(target, { update: isUpdate, global: isGlobalNpm, pinned: installSpec, add: cliAction === 'add' })
  const args = isGlobalNpm
    ? ['install', '-g', ...(globalNpm ?? [])]
    : [...invocation.prefixArgs, 'plugin', '--profile', profile, cliAction, npmUpdateTarget]
  // 记录实际执行的命令（显示包名），失败提 Issue 时作为「已尝试的安装方式」随附
  const executed = isGlobalNpm
    ? `npm install -g ${(globalNpm ?? []).join(' ')}`
    : `dsh plugin --profile ${profile} ${cliAction} ${npmUpdateTarget}`
  if (task && !task.attempts.includes(executed)) {
    task.attempts.push(executed)
  }
  // 单次 spawn 并捕获结果：流式输出打日志 + 超时/取消兜底，close 后 resolve。
  // 不做任何终态后处理（exitCode/status/needsRestart 由下方统一收尾），
  // 这样全局 npm 首次失败后可以干净地换参数重试一次。
  const spawnOnce = (attemptArgs: string[], registry?: string): Promise<InstallResult> => new Promise((resolveOnce) => {
    let stdout = ''
    let stderr = ''
    // 每次 spawn 独立解码器：中文 Windows 下 dsh/pnpm 可能输出 GBK，需按流判定编码
    const stdoutDecoder = new OutputDecoder()
    const stderrDecoder = new OutputDecoder()
    let timedOut = false
    let settled = false
    let child: ReturnType<typeof spawn>
    try {
      // 独立 CLI 场景（file: 'dsh'，宿主加载器走 node bin 不经过这里）：先探测 dsh 是否在 PATH。
      // 命令缺失时各平台报错形态不同（GBK 乱码 / spawn ENOENT），统一前置拦截并打 ASCII 标记
      // [dsh-missing]，前端据此精准提示「dsh 未加入 PATH」而不是笼统的插件失败。
      if (invocation.file === 'dsh' && !commandOnPath('dsh', env)) {
        const detail = '[dsh-missing] the dsh CLI was not found on this machine (DeepSeek Harness not installed, or dsh not on the PATH)'
        if (task) {
          task.status = 'failed'
          task.exitCode = null
          task.progress = 0
          pushLine(task, detail)
        }
        resolveOnce({ exitCode: 1, timedOut: false, error: detail, stdout: '', stderr: detail })
        return
      }
      // git 源安装：pnpm 需要调用 git 解析仓库；Windows 缺 git 只回 GBK 乱码，前端认不出来。
      // 前置探测并打 ASCII 标记 [git-missing]，给出装 git 的指引而不是笼统的安装失败。
      if (!isGlobalNpm && action !== 'remove') {
        const gitMissing = gitMissingDetail(target, env)
        if (gitMissing !== null) {
          if (task) {
            task.status = 'failed'
            task.exitCode = null
            task.progress = 0
            pushLine(task, gitMissing)
          }
          resolveOnce({ exitCode: 1, timedOut: false, error: gitMissing, stdout: '', stderr: gitMissing })
          return
        }
      }
      // invocation.env 是「必须叠加」的变量（打包桌面端的 ELECTRON_RUN_AS_NODE）：
      // 没有它时保持 env 原样透传，有它时必须基于完整环境叠加，否则子进程会丢掉 PATH。
      // registry 最后写入：换源重试只改这一层，pnpm/npm 都认 npm_config_registry。
      const childEnv: NodeJS.ProcessEnv = { ...(env ?? process.env), ...(invocation.env ?? {}) }
      if (registry !== undefined) {
        childEnv.npm_config_registry = registry
        childEnv.NPM_CONFIG_REGISTRY = registry
      }
      child = spawn(invocation.file, attemptArgs, {
        cwd: invocation.cwd,
        env: childEnv,
        shell: invocation.useShell,
        // detached 使子进程成为独立进程组组长：取消时能整组清理（见 stopChild），
        // 且宿主进程崩溃后安装任务不会被连带误杀
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error)
      // 宿主自身入口起不来 → 补标记，前端据此归因
      const marker = hostSpawnMarker(invocation, error)
      if (task) {
        task.status = 'failed'
        task.exitCode = null
        pushLine(task, `[error] ${detail}`)
        if (marker !== null) pushLine(task, marker)
      }
      resolveOnce({
        exitCode: null,
        timedOut: false,
        error: marker === null ? detail : `${detail}\n${marker}`,
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
      const text = kind === 'stdout' ? stdoutDecoder.push(chunk) : stderrDecoder.push(chunk)
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
      // 同同步抛出那条路径：宿主自身入口起不来 → 补标记
      const marker = hostSpawnMarker(invocation, error)
      if (task && task.status !== 'cancelled') {
        task.status = 'failed'
        task.exitCode = null
        pushLine(task, `[error] ${error.message}`)
        if (marker !== null) pushLine(task, marker)
      }
      settleOnce({ exitCode: null, timedOut: false, error: marker === null ? error.message : `${error.message}\n${marker}`, stdout, stderr })
    })

    child.once('close', (code) => {
      settleOnce({ exitCode: code, timedOut, error: null, stdout, stderr })
    })
  })

  return (async () => {
    // 超时复核用基线：本次任务开始前目标是否已在 profile 里。已安装的话，超时后核对无法区分
    // 「旧版本还在」与「刚装上」，那种情形（更新超时）不冒认成功。
    const wasInstalled = action !== 'remove' && !isGlobalNpm && verifyInstalledEntry(profile, target).name !== null
    // 候选源：卸载不拉包、git 源装的是仓库快照，都不受 npm 镜像影响，不参与换源
    const candidates = action === 'remove' || githubRepoOf(target) !== null ? [] : (registries ?? [])
    let activeRegistry = candidates[0]
    let result = await spawnOnce(args, activeRegistry)
    // 传输层失败（超时 / 连接重置 / DNS / 5xx）才换下一个公共镜像；404、版本不存在、鉴权错误
    // 保持原样，否则会掩盖作者侧问题或装到滞后版本。整段超时也不再换源，避免耗时翻倍。
    for (const candidate of candidates.slice(1)) {
      if (task?.status === 'cancelled' || result.exitCode === 0 || result.timedOut) break
      if (!isTransportFailure(`${result.stderr}\n${result.stdout}`)) break
      if (task) {
        pushLine(task, `[registry-fallback] ${registryHost(activeRegistry ?? '')} unreachable — retrying with ${registryHost(candidate)}`)
      }
      activeRegistry = candidate
      result = await spawnOnce(args, candidate)
    }
    // npm 11 的 arborist peer-set bug（`Cannot read properties of null (reading 'children')`）
    // 会让 `npm install -g` 在解析阶段直接崩溃。首次失败后自动带 `--legacy-peer-deps` 重试一次：
    // 跳过 peer 自动解析即可绕过该 bug；二次尝试仍失败则保留其错误信息，不掩盖真正的原因。
    if (isGlobalNpm && result.exitCode !== 0 && !result.timedOut && task?.status !== 'cancelled') {
      const retryArgs = ['install', '-g', '--legacy-peer-deps', ...(globalNpm ?? [])]
      const retryExecuted = `npm install -g --legacy-peer-deps ${(globalNpm ?? []).join(' ')}`
      if (task && !task.attempts.includes(retryExecuted)) task.attempts.push(retryExecuted)
      if (task) pushLine(task, '[npm] peer-set resolution crashed npm (known npm bug) — retrying with --legacy-peer-deps')
      result = await spawnOnce(retryArgs, activeRegistry)
    }
    // 超时被强杀 ≠ 没装上：命中的安装可能已经落盘（日志里 pnpm 已打印 Done，只是 dsh 进程迟迟不退出
    // 而被我们超时掐掉）。判失败之前先复核 profile —— 目标已在依赖里、且声明分发的入口文件都在，
    // 就按成功收尾，避免「其实装好了却报安装失败」并被自动归档成未知失败。
    if (result.timedOut && !wasInstalled && action !== 'remove' && !isGlobalNpm && task?.status !== 'cancelled') {
      const verified = verifyInstalledEntry(profile, target)
      if (verified.name !== null && verified.missing === null) {
        result = { ...result, timedOut: false, exitCode: 0, error: null }
        if (task) pushLine(task, '[timeout] the install had already completed — treating it as a success')
      }
    }
    // 统一终态后处理：exitCode/status/needsRestart 以最后一次尝试为准
    if (task) {
      task.exitCode = result.exitCode
      task.timedOut = result.timedOut
      if (task.status !== 'cancelled') {
        task.status = result.timedOut || result.exitCode !== 0 ? 'failed' : 'done'
        if (task.status === 'done') {
          task.progress = 100
          // 实际装上的版本：目录版本可能滞后，客户端账本必须记这个值，否则「有更新」永久失真
          if (!isGlobalNpm && action !== 'remove') {
            const installed = installedVersionOf(profile, target)
            if (installed !== null) task.installedVersion = installed
          }
          // 市场自更新：若 bundle 已被取消勾选，重启后市场不会出现，结果页要明确提示
          if ((action === 'add' || action === 'update') && (target === 'dsh-plugin' || target.startsWith('dsh-plugin@'))
            && !bundleIncludes(profile, 'dsh-plugin')) {
            task.bundleDeselected = true
          }
          if (isGlobalNpm) {
            // 全局 npm 安装：装的是本机 CLI 工具（如 dsh-tui），不进任何 profile，无需宿主重启
            task.needsRestart = false
          } else if (action === 'remove' && loader) {
            // 卸载成功 → 主动从运行中 loader 停用该包条目：
            //  - 停用成功：服务端即时卸载；带客户端 UI 的插件面板要页面刷新才摘除（无需重启宿主）
            //  - 停用失败 / 超时：回退「待重启」兜底清理（刷新解决不了，登记常驻提醒）
            const removal = await removeLoadedEntry(loader, target)
            task.needsRestart = !removal.ok
            task.needsReload = removal.ok && removal.live && task.hadClientUi === true
            if (task.needsRestart) addPendingRestart(displayTarget ?? target, 'uninstall')
            else clearPendingRestart(displayTarget ?? target)
          } else if (action !== 'remove' && !isUpdate && loader) {
            // 安装成功 → 尝试把新插件热挂进运行中 loader，让插件无需重启宿主即生效。
            // 挂上了：服务端即时生效；带客户端 UI 的插件还需页面重新加载（宿主按请求现场
            //   拼装 __DSH_BOOT__ 注入清单，网页端与桌面端一致，刷新即可）。
            // 挂不上 / 非 dsh 插件 / 无法定位包名：回退「待重启」提醒（保证不静默失效）。
            const { name } = verifyInstalledEntry(profile, target)
            if (name !== null && isDshPlugin(profile, name) && await mountLoadedEntry(loader, name)) {
              task.needsReload = hasClientUi(profile, name)
              task.needsRestart = false
            } else {
              task.needsRestart = true
              addPendingRestart(displayTarget ?? target, 'install')
            }
          } else {
            // 更新（ESM 缓存下热挂取不到新代码）/ 无 loader 的安装或卸载 → 登记待重启：
            // 插件要宿主重启才会挂载/卸载干净，重启前一直提醒；展示目标用 displayTarget（owner/repo）
            task.needsRestart = true
            addPendingRestart(displayTarget ?? target, action === 'remove' ? 'uninstall' : 'install')
          }
        }
        // 子进程一个字节都没吐时在退出行上标注：日志面板与失败上报都能看出「没有输出可排查」
        const printedNothing = `${result.stdout}${result.stderr}`.trim() === ''
        pushLine(task, result.timedOut ? '[timed out]' : `[exit ${result.exitCode ?? '?'}]${printedNothing ? ' (no output captured)' : ''}`)
      }
    }
    // 带上最终生效的源：后续注解（如 [dsh-too-old]）读元数据必须与安装同源，
    // 否则换过源之后会去另一个源查，查不到就静默漏报
    return activeRegistry === undefined ? result : { ...result, registry: activeRegistry }
  })()
}

/**
 * 安装成功后从 profile 的 `node_modules/<pkg>/package.json` 读**实际**版本；
 * 定位不到包名或读不到返回 null。客户端拿它写版本账本 —— 目录里的版本可能滞后。
 */
export function installedVersionOf(profile: string, target: string): string | null {
  const profileDir = profileDirectory(profile)
  let deps: Record<string, string> = {}
  try {
    const pkg = JSON.parse(readFileSync(join(profileDir, 'package.json'), 'utf8')) as { dependencies?: Record<string, string> }
    deps = pkg.dependencies ?? {}
  } catch {
    return null
  }
  const targetRepo = githubRepoOf(target)?.toLowerCase()
  const name = targetRepo !== undefined
    ? Object.keys(deps).find((k) => githubRepoOf(deps[k])?.toLowerCase() === targetRepo)
    : deps[target] !== undefined ? target : Object.keys(deps).find((k) => deps[k] === target)
  if (!name) return null
  try {
    const meta = JSON.parse(readFileSync(join(profileDir, 'node_modules', name, 'package.json'), 'utf8')) as { version?: unknown }
    return typeof meta.version === 'string' && meta.version !== '' ? meta.version : null
  } catch {
    return null
  }
}

/**
 * 安装后校验已装包里 package.json 声明的文件（main / exports["."].default 与
 * dsh.bundle.patch）是否真实存在。npm 包也可能漏发构建产物（lib/ 等），pnpm 装完没有
 * 报错，但宿主重启加载插件树时会 ERR_MODULE_NOT_FOUND 直接崩溃、网页打不开 —— 这里在
 * 登记「待重启」前就把这类残缺包拦下。没有声明过的文件不在这里追究：没声明入口的
 * bundle 包（只挂技能）本来就不需要入口，宿主读的是它的 package.json 与声明的补丁。
 * 返回 { name, missing }：name 为空表示无法定位目标包（跳过校验）；missing 为缺失文件的路径。
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
  let required: string[] = []
  try {
    const meta = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8')) as PackageManifest
    // 补丁按本包名 mount 自己时入口也是必须的，所以先读已装包里的补丁（读不到就当没有）。
    const patchTexts = resolveBundlePatchFiles(meta).flatMap((file) => {
      try {
        return [readFileSync(join(pkgDir, file), 'utf8')]
      } catch {
        return []
      }
    })
    required = requiredDistributionFiles(meta, patchTexts)
  } catch {
    return { name, missing: null }
  }
  for (const file of required) {
    try {
      if (!statSync(join(pkgDir, file)).isFile()) return { name, missing: file }
    } catch {
      return { name, missing: file }
    }
  }
  return { name, missing: null }
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
 *  误判成插件打包/分发问题。检测逻辑在独立的 npm-check.ts（本机 npm 环境职责）。 */
function annotateNpmTooLow(result: InstallResult, options: {
  action: 'add' | 'remove' | 'update'
  task?: InstallTask
  env?: NodeJS.ProcessEnv
}): InstallResult {
  if (options.action === 'remove' || result.exitCode === 0 || result.timedOut) return result
  const line = npmTooLowMarker(`${result.stderr}\n${result.stdout}`, options.env)
  if (line === null) return result
  if (options.task && options.task.status !== 'cancelled') pushLine(options.task, line)
  return { ...result, stderr: `${result.stderr}\n${line}`, error: result.error ? `${result.error}\n${line}` : line }
}

/** 安装失败且日志含 404 时，用官方源复查一次并注入标记（逻辑见 registry-check.ts）。
 *  异步是因为要联网；只在失败路径上发生。 */
async function annotateRegistryMissing(result: InstallResult, options: {
  action: 'add' | 'remove' | 'update'
  profile: string
  task?: InstallTask
}): Promise<InstallResult> {
  if (options.action === 'remove' || result.exitCode === 0 || result.timedOut) return result
  const line = await registryMissingMarker(`${result.stderr}\n${result.stdout}`, {
    profileDir: profileDirectory(options.profile),
  })
  if (line === null) return result
  if (options.task && options.task.status !== 'cancelled') pushLine(options.task, line)
  return { ...result, stderr: `${result.stderr}\n${line}`, error: result.error ? `${result.error}\n${line}` : line }
}

/** 安装失败且插件声明的最低 DSH 版本高于当前宿主 → 注入 [dsh-too-old] 标记。
 *  只在失败路径上发生：peer 不满足本身通常只是警告，装成功时不该冒这个提示。
 *  超时也算失败 —— 旧宿主上插件可能卡在半兼容状态，这个信息同样有用。 */
async function annotateDshTooOld(result: InstallResult, options: {
  action: 'add' | 'remove' | 'update'
  target: string
  task?: InstallTask
  globalNpm?: string[]
  registries?: string[]
}): Promise<InstallResult> {
  if (options.action === 'remove' || result.exitCode === 0) return result
  // 全局 npm 装的是本机 CLI 工具，不进 profile，没有宿主版本要求
  if ((options.globalNpm ?? []).length > 0) return result
  // 用安装**实际**使用的源读元数据：换源重试后候选表首位可能并不是真正生效的那个，
  // 用错源会读不到包而静默漏报；私有源/镜像里同样能读到包声明的 engines
  const line = await dshTooOldMarker(options.target, { registry: result.registry ?? options.registries?.[0] })
  if (line === null) return result
  if (options.task && options.task.status !== 'cancelled') pushLine(options.task, line)
  return { ...result, stderr: `${result.stderr}\n${line}`, error: result.error ? `${result.error}\n${line}` : line }
}

/**
 * 宿主自身 CLI 调不起来时的 ASCII 标记行：spawn 我们解析出的宿主入口报 ENOENT 时返回
 * `[host-spawn]`，供前端单独归因、不引导提 Issue。PATH 上的 dsh/npm 各有自己的标记，返回 null。
 * 导出供单测覆盖判据。
 */
export function hostSpawnMarker(invocation: Invocation, error: unknown): string | null {
  if ((error as NodeJS.ErrnoException | null)?.code !== 'ENOENT') return null
  if (invocation.file === 'dsh' || invocation.file === 'npm') return null
  return `[host-spawn] the DSH host could not be launched (${invocation.file}: ENOENT)`
}

/**
 * 执行插件变更，带一条恢复路径：当 `add` 因 pnpm 的 allowBuilds 门禁拦下构建脚本而失败 ——
 * 或是 git 源包自己的 `prepare`（`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`，key 取自打印的
 * key@url 提示），或是某依赖的原生构建（`ERR_PNPM_IGNORED_BUILDS`，key = 列出的 name@version）——
 * 就把确切的 key 写进 profile 的 pnpm-workspace.yaml 并重试一次。
 * 其它失败一律落到单次 spawn 的结果。
 */
export async function runPluginMutation(options: {
  action: 'add' | 'remove' | 'update'
  profile: string
  target: string
  timeoutMs?: number
  env?: NodeJS.ProcessEnv
  task?: InstallTask
  /** 待重启行的展示目标（owner/repo）：卸载时用于把 npm 包名映射回仓库名 */
  displayTarget?: string
  /** 运行中 loader：安装成功后热挂新条目、卸载成功后停用旧条目（缺失时仍需重启） */
  loader?: LoaderHandle
  /** 全局 npm 安装（官方 `npm install -g <pkgs>`）：非空时执行全局安装，不进任何 profile、无需宿主重启 */
  globalNpm?: string[]
  /** npm 源候选（首选在前）：传输层失败时按顺序换源重试 */
  registries?: string[]
  /** 精确安装 spec（如 `dsh-plugin@2.0.5`）：见 startPluginMutation 同名说明 */
  installSpec?: string
}): Promise<InstallResult> {
  // operation 日志只在运行期存在（宿主结束后可能清掉），先开抓取，退出后按路径读作兜底
  const profileDir = profileDirectory(options.profile)
  const logTap = createOperationLogTap(profileDir)
  let result = await spawnMutation(options)
  // allowBuilds 放行 / 装后入口校验都是 profile 专属（pnpm 装进 profile 的场景）；
  // 全局 npm 安装直接走 npm，无 pnpm allowBuilds 拦截、也不进 profile，跳过这两类恢复
  // 安装与更新（同为 add 通道执行）共享同一套恢复路径；卸载不适用
  if (options.action !== 'remove' && result.exitCode !== 0 && !result.timedOut && (options.globalNpm ?? []).length === 0) {
    const output = `${result.stderr}\n${result.stdout}`
    // git 源：pnpm 打印的 key@url 提示
    if (output.includes('ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED')) {
      const key = parseAllowBuildsKey(output)
      if (key !== null) {
        if (options.task) {
          // 首次尝试已把任务标为失败；重置它，让重试重新以 running 任务形式流式输出进度。
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
  // 重试会产生新的 operation 日志，运行期抓取到此为止
  const tappedLog = logTap.stop()
  // pnpm 安装本身成功，但目标包声明分发的文件缺失（分发物缺构建产物 / 缺声明的补丁）→ 判为失败：
  // 撤销刚登记的待重启，避免用户重启时宿主加载残缺包直接崩溃。
  // 全局 npm 安装不进 profile（profile deps 里没有这些包），跳过入口校验
  if (options.action !== 'remove' && result.exitCode === 0 && !result.timedOut && (options.globalNpm ?? []).length === 0) {
    const verified = verifyInstalledEntry(options.profile, options.target)
    if (verified.name !== null && verified.missing !== null) {
      clearPendingRestart(options.displayTarget ?? options.target)
      const detail = `[packaging] ${verified.name}: declared file missing: ${verified.missing} (the published package is missing this file — report it to the author)`
      if (options.task && options.task.status !== 'cancelled') {
        options.task.status = 'failed'
        options.task.exitCode = null
        options.task.progress = 0
        pushLine(options.task, detail)
      }
      return { exitCode: 1, timedOut: false, error: `declared file missing: ${verified.missing}`, stdout: result.stdout, stderr: `${result.stderr}\n${detail}` }
    }
  }
  // 宿主只把一行摘要（`dsh: plugin command failed; diagnostics: <path>`）回显到控制台、真正的报错
  // 写进该日志文件时，前端拿不到任何错误特征、只能归为「未知」。按该路径回捞日志尾部补进失败信息。
  // 只在输出本就不含错误码时回捞 —— pnpm 已回显报错时无需多读一次文件。
  // 超时同样回捞：被强杀前 pnpm 往往已经把真实原因写进 operation 日志。
  if ((result.exitCode !== 0 || result.timedOut) && !/\bERR_[A-Z0-9_]+\b/.test(`${result.stderr}\n${result.stdout}`)) {
    const output = `${result.stderr}\n${result.stdout}`
    const backfilled = tappedLog !== '' ? tappedLog : backfillOperationLog(output, profileDir)
    if (backfilled !== null) {
      if (options.task && options.task.status !== 'cancelled') {
        pushLine(options.task, '[pnpm log] DSH did not echo pnpm output — recovered the operation log from disk')
        for (const line of backfilled.split(/\r?\n/)) if (line.trim() !== '') pushLine(options.task, line.trimEnd())
      }
      result = { ...result, stderr: `${result.stderr}\n${backfilled}` }
    } else if (options.task && options.task.status !== 'cancelled') {
      if (operationLogPathOf(output) !== null) {
        // 诊断路径在、日志却取不到：留一行证据，否则下一次同类上报又只剩宿主那句摘要、看不出根因
        pushLine(options.task, '[pnpm log] the host-reported diagnostics log could not be read from disk (missing, empty, or unreadable)')
      } else if (!hasSubstantiveOutput(output)) {
        // 宿主连 diagnostics 路径都没回显：显式留痕，避免上报正文只剩一个退出码
        const what = result.timedOut
          ? 'printed nothing before the timeout'
          : `exited with code ${result.exitCode ?? '?'} without printing anything`
        pushLine(options.task, `[no-output] the dsh CLI ${what}, and no pnpm log was written under .plugin-manager/logs — attach ~/.dsh/profiles/${options.profile}/hub.log when reporting this`)
      }
    }
  }
  // 包在 registry 不存在（404）→ 官方源复查，区分「作者的依赖缺失/包被删」与「本机镜像源滞后」
  result = await annotateRegistryMissing(result, options)
  // 插件声明的最低 DSH 版本高于当前宿主 → 追加 [dsh-too-old] 标记，前端提示先升级 DSH
  result = await annotateDshTooOld(result, options)
  // npm arborist edgesOut 崩溃 + 本机 npm 版本过低 → 追加 [npm-too-low] 标记，前端据此给准确原因
  return annotateNpmTooLow(result, options)
}
