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
  /** 实际执行安装用的 npm 源（换源重试后是最终那一个）：后续读元数据的注解要跟它同源 */
  registry?: string
}

export interface InstallTask {
  id: number
  /** 操作目标：npm 包名（安装、更新、卸载一致），冲突/恢复时需要展示给用户 */
  target: string
  /** 展示用目标（owner/repo）：npm 安装时 target 是包名，前端恢复用此字段显示仓库名，保持用户无感知 */
  displayTarget?: string
  /** 尝试过的安装方式（实际执行过的 CLI 命令，按先后顺序）：
   *  失败提 Issue 时如实贴给作者，作者据此判断我们真正执行了什么。 */
  attempts: string[]
  /** 全局 npm 安装（官方 `npm install -g <pkgs>`）：非空时任务执行全局 npm 安装，不进任何 profile */
  globalNpm?: string[]
  action: 'add' | 'remove' | 'update'
  /** 自定义安装入口渠道（NPM 包卡片）：
   *  任务输出行与系统日志据此溯源「从哪个入口发起」；目录插件安装无此字段。 */
  installChannel?: 'npm'
  /** 队列语义：pending 排队中 / running 执行中 / done / failed / cancelled（用户取消） */
  status: 'pending' | 'running' | 'done' | 'failed' | 'cancelled'
  timedOut: boolean
  exitCode: number | null
  /** 0-100 估算进度：解析 pnpm 的 `Progress: resolved…` 输出；没有进度行时按阶段行估算 */
  progress: number
  /** 输出行最新在前（消费方展示尾部）。 */
  lines: string[]
  /** 完成后是否仍需宿主重启才生效：仅「热加载失败 / 非 dsh 插件 / 更新（ESM 缓存取不到新代码）/
   *  无 loader」等刷新解决不了的例外场景为 true（弹窗给「立即重启」）；其余一律 false。 */
  needsRestart: boolean
  /** 完成结果是否只需刷新页面即生效（插件已热加载进运行中 loader，仅剩客户端 UI 待页面重新加载，
   *  网页端与桌面端一致）：true 时关闭结果弹窗即自动刷新页面，不给手动刷新按钮。 */
  needsReload?: boolean
  /** 自更新成功、但该 profile 的 dsh.profile.bundles 已不含 dsh-plugin：重启后市场不会出现 */
  bundleDeselected?: boolean
  /** 安装/更新成功后，从 profile 的 node_modules 读到的**实际**版本。
   *  客户端用它写版本账本（目录版本可能滞后，抄目录字段会让「有更新」永久失真）。 */
  installedVersion?: string
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
  options: {
    action: 'add' | 'remove' | 'update'
    profile: string
    target: string
    timeoutMs?: number
    env?: NodeJS.ProcessEnv
    globalNpm?: string[]
    installChannel?: 'npm'
    /** npm 源候选（首选在前）：传输层失败时按顺序换源重试 */
    registries?: string[]
    /** 精确安装 spec（Hub 自我更新时锁定版本） */
    installSpec?: string
  }
}

/**
 * 安装成功但宿主尚未重启的插件（待重启后生效）。纯内存态：宿主进程一重启
 * 它自然清空，正好等于「重启后提醒消失」的语义，无需任何重启探测。
 */
export interface PendingRestart {
  /** 安装目标（与任务一致；卸载时为展示用的 owner/repo） */
  target: string
  /** 待重启语义：install 装完等挂载生效 / uninstall 卸完等清理 loader 残留 */
  kind: 'install' | 'uninstall'
  /** 任务完成时刻（epoch ms） */
  at: number
}

/** 目录 GitHub 仓库身份（`owner/repo`）的语法。 */
export const REPO_RE = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/
/** npm 包名的语法（用于卸载目标）。 */
export const PACKAGE_RE = /^(?:@[a-z0-9._-]+\/)?[A-Za-z0-9._-]+$/
/** 捕获输出上限：stdout/stderr 各保留尾部 N 字节。 */
export const CAPTURE_LIMIT_BYTES = 64 * 1024
/** 每个任务保留的最大输出行数（最新优先）。 */
export const MAX_TASK_LINES = 200
/** 最多跟踪的任务数；超出时先丢弃最早结束的任务。 */
export const MAX_TASKS = 50
