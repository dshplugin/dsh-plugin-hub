/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 安装/卸载运行时的公共类型与常量（无依赖，供各服务模块复用）。
 */

/** 一个 pnpm 安装子进程的结果快照。 */
export interface InstallResult {
  exitCode: number | null
  timedOut: boolean
  error: string | null
  stdout: string
  stderr: string
}

export interface InstallTask {
  id: number
  /** 操作目标：显式 HTTPS Git URL（安装）或 npm 包名（卸载），冲突/恢复时需要展示给用户 */
  target: string
  /** 展示用目标（owner/repo）：npm 安装时 target 是包名，前端恢复用此字段显示仓库名，保持用户无感知 */
  displayTarget?: string
  /** 尝试过的安装方式（npm registry 反查 + 实际执行的 CLI 命令，按先后顺序）：
   *  失败提 Issue 时如实贴给作者，作者据此反推正确的 npm 包名（组织 scope 与 GitHub 用户名不一致时
   *  仅凭仓库名猜不到，作者看到我们查过/试过的命令就能直接指认）。 */
  attempts: string[]
  /** 全局 npm 安装（官方 `npm install -g <pkgs>`）：非空时任务执行全局 npm 安装，不进任何 profile */
  globalNpm?: string[]
  action: 'add' | 'remove' | 'update'
  /** 自定义安装入口渠道（客户端三张卡片：NPM 包 / GitHub 源码 / DSH 命令）：
   *  任务输出行与系统日志据此溯源「从哪个入口发起」；目录插件安装无此字段。 */
  installChannel?: 'npm' | 'git' | 'dsh'
  /** 队列语义：pending 排队中 / running 执行中 / done / failed / cancelled（用户取消） */
  status: 'pending' | 'running' | 'done' | 'failed' | 'cancelled'
  timedOut: boolean
  exitCode: number | null
  /** 0-100 估算进度：解析 pnpm 的 `Progress: resolved…` 输出，阶段行兜底 */
  progress: number
  /** Newest output lines first (consumer shows the tail). */
  lines: string[]
  /** 完成后是否仍需宿主重启才生效：仅「热挂载失败 / 非 dsh 插件 / 更新（ESM 缓存取不到新代码）/
   *  无 loader」等刷新解决不了的兜底场景为 true（弹窗给「立即重启」）；其余一律 false。 */
  needsRestart: boolean
  /** 完成后是否只需刷新页面即生效（插件已热挂进运行中 loader，仅剩客户端 UI 待页面重新加载，
   *  网页端与桌面端一致）：true 时关闭结果弹窗即自动刷新页面，不给手动刷新按钮。 */
  needsReload?: boolean
  /** 卸载入队时该包是否带客户端 UI（`dsh.client`）：卸载后包已从磁盘删除，只能入队前快照，
   *  卸载成功且曾存活时据此决定是否需要刷新页面摘除插件面板。 */
  hadClientUi?: boolean
}

/** 子进程启动参数（复用宿主 dsh 入口，或回退到 PATH 上的 `dsh`）。 */
export interface Invocation {
  file: string
  prefixArgs: string[]
  cwd: string
  useShell: boolean
  /** 必须叠加到子进程环境上的变量（打包桌面端要带 ELECTRON_RUN_AS_NODE） */
  env?: NodeJS.ProcessEnv
}

/** 排队中的变更任务及其启动参数。 */
export interface QueueItem {
  task: InstallTask
  options: { action: 'add' | 'remove' | 'update'; profile: string; target: string; timeoutMs?: number; env?: NodeJS.ProcessEnv; globalNpm?: string[]; installChannel?: 'npm' | 'git' | 'dsh' }
}

/**
 * 安装成功但宿主尚未重启的插件（待重启后生效）。纯内存态：宿主进程一重启
 * 它自然清空，正好等于「重启后提醒消失」的语义，无需任何重启探测。
 */
export interface PendingRestart {
  /** Git 安装目标（与任务一致；卸载时为展示用的 owner/repo） */
  target: string
  /** 待重启语义：install 装完等挂载生效 / uninstall 卸完等清理 loader 残留 */
  kind: 'install' | 'uninstall'
  /** 任务完成时刻（epoch ms） */
  at: number
}

/** Grammar of a catalog GitHub repository identity (`owner/repo`). */
export const REPO_RE = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/
/** Grammar of an npm package name (used for uninstall targets). */
export const PACKAGE_RE = /^(?:@[a-z0-9._-]+\/)?[A-Za-z0-9._-]+$/
/** 捕获输出上限：stdout/stderr 各保留尾部 N 字节。 */
export const CAPTURE_LIMIT_BYTES = 64 * 1024
/** Max output lines kept per task (newest wins). */
export const MAX_TASK_LINES = 200
/** Max tracked tasks; oldest finished tasks are dropped first. */
export const MAX_TASKS = 50
