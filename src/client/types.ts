/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * dsh-plugin 浏览器客户端的共享类型。保持零依赖，任何客户端模块都能直接引入，
 * 而不会连带拉入组件或样式。
 */

export type LocaleId = 'zh' | 'en' | 'pt'

/** 自定义安装入口渠道：仅 NPM 包。
 *  客户端提交时显式上报，服务端落日志/报错提示据此溯源「从哪个入口发起」。 */
export type InstallChannel = 'npm'

/** 宿主绑定与组件内字典共用的翻译函数签名。 */
export type Translate = (key: string, params?: Record<string, string | number>) => string

/** 本插件用到的 locale 服务子集。 */
export interface LocaleService {
  register(namespace: string, dicts: { zh: Record<string, string>; en: Record<string, string>; pt?: Record<string, string> }): unknown
  /** 把非内置语言加进宿主语言目录（内置只有 zh / en）；返回移除该定义的 disposer。 */
  addLanguage(input: { id: string; label: string; fallback: string }): () => void
  bind(namespace: string): (key: string, params?: Record<string, string | number>) => string
  getSnapshot(): { active: LocaleId }
  subscribe(fn: () => void): () => void
  /** 切换宿主（系统）语言偏好：Hub 语言跟随宿主，右上角语言按钮直接写入宿主偏好，
   *  宿主左侧菜单/设置弹窗与 Hub 面板一起切换，与宿主语言保持一致 */
  setLocale(id: string): void
}

/** 本插件用到的 slots 服务子集。 */
export interface SlotsService {
  inject(slot: string, register: () => unknown): void
  register(meta: Record<string, unknown>, component: () => unknown): unknown
}

/** 本插件依赖的客户端 cordis 上下文形态（结构化）。 */
export interface HubClientContext {
  effect(callback: () => unknown, label?: string): void
  slots: SlotsService
  locale: LocaleService
}

export interface SectionProps {
  t: Translate
  locale: LocaleService
}

/** 官网 DirectoryPlugin 条目的精简投影。 */
export interface HubPlugin {
  /** 作者小写 key，与 slug 共同构成唯一身份（两级路径 /plugins/{ownerSlug}/{slug}）；可能缺省 */
  ownerSlug?: string
  slug: string
  displayName?: string
  /** 仓库已发布版本（GitHub release tag，如 v1.2.3）；无 release 的仓库无此字段 */
  version?: string
  category?: string
  topics?: string[]
  features?: string[]
  description?: string
  source?: { repo?: string; npmPackage?: string }
  /** 安装信息：能否网页一键安装（false = 仅支持命令行/专属 profile，缺省视为 true）；
   *  manualInstall = 人工干预标记（网页端一键安装替代不了终端的构建/装配，必须用户自己去终端装）；
   *  command/githubCommand = 目录下发的权威安装命令，
   *  仅供展示/复制 —— CLI-only 插件（如 dsh-tui）需专属 profile（--profile dsh-tui），
   *  无法从 repo/npm 包名推断，必须用目录命令。 */
  install?: { webInstallable?: boolean; manualInstall?: boolean; command?: string; githubCommand?: string }
  compatibility?: { status?: string }
  dates?: { repoUpdatedAt?: string; addedAt?: string }
  stats?: { stargazers_count?: number; forks_count?: number }
}

/** 后台安装/卸载任务快照：进度 0-100 + 实时输出行（服务端估算，客户端轮询）。 */
export interface TaskState {
  id: number
  /** pending 排队中 / running 执行中 / cancelling 取消中（客户端过渡态）/ done 完成 / failed 失败 / cancelled 已取消 */
  status: 'pending' | 'running' | 'cancelling' | 'done' | 'failed' | 'cancelled'
  progress: number
  lines: string[]
}

export type ToastKind = 'copied' | 'errCopied' | 'done' | 'fail' | 'removed' | 'removeFail' | 'revealFail' | 'restartDesktop' | 'installedLive' | 'installedReload'

export interface ToastState {
  id: number
  kind: ToastKind
}

/** 宿主机器环境快照（后端 /dsh-plugin-hub/env）：提交 bug 时拼进 issue 正文，便于作者复现。 */
export interface EnvInfo {
  dshVersion: string | null
  nodeVersion: string
  /** 本机 pnpm 版本（pnpm --version 首行；缺失返回 null）—— 排查 ERR_PNPM_UNEXPECTED_STORE 等 pnpm 环境问题 */
  pnpmVersion: string | null
  /** 本机 npm 版本（npm --version 首行；缺失返回 null） */
  npmVersion: string | null
  /** 本机 git 版本（git --version 首行；缺失返回 null） */
  gitVersion: string | null
  /** 安装实际会用的 npm 源（设置镜像 → 本机 npm 配置 → 官方）：失败上报要带上它 */
  npmRegistry?: string | null
  platform: string
  arch: string
  release: string
  profile: string
  dshHome: string
}

/** Worker 版本控制中心返回的 Hub 自我更新信息（notes 为 Markdown 变更记录）。 */
export interface HubUpdateInfo {
  version: string
  publishedAt?: string | null
  /** Markdown 变更记录；可传字符串，或 { zh, en } 双语言对象按界面语言取 */
  notes?: string | Record<string, string> | null
  /**
   * 最近若干发版（含最新版），按版本号降序无关、由客户端自行排序。
   * 用途：连续快速发版时，最新版往往还在 pnpm 的 24h 发布冷却期内；
   * 客户端据此回退到「更早、但已过冷却期」的版本提示更新，而不是整体跳过。
   */
  recentVersions?: HubUpdateVersion[]
}

/** 单个发版记录：版本号 + 与 npm registry 同源的发布时间 + 该版本变更记录。 */
export interface HubUpdateVersion {
  version: string
  publishedAt?: string | null
  notes?: string | Record<string, string> | null
}

/**
 * Hub 自我更新状态 —— 供版本弹窗选文案与按钮，四态互斥：
 *  - `none`      未取到接口中心信息（拉取失败）→ 只说当前版本，不提示更新
 *  - `available` 远端有更新且已过发布冷却期 → 提示更新
 *  - `pending`   远端有更新但发布还不满冷却期（见 useCatalog）→ 暂缓提示并说明原因
 *  - `latest`    与远端最新版一致 → 确已最新
 * 「有新版但暂缓提示」必须与「确已最新」分开：两者若共用文案，弹窗会在本机版本落后时
 * 谎称「你正在使用 v{远端最新版}，已是最新」。
 */
export type HubUpdateState = 'none' | 'available' | 'pending' | 'latest'

/** Worker 返回的「关注我们」内容（content 为 Markdown，可字符串或 {zh,en} 双语言对象）。 */
export interface HubAboutInfo {
  /** Markdown 平台介绍 + 反馈群二维码；可传字符串，或 { zh, en } 双语言对象按界面语言取 */
  content?: string | Record<string, string> | null
  updatedAt?: string | null
}
