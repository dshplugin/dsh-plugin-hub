/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Shared types for the dsh-plugin browser client. Kept dependency-free so
 * any client module can import them without pulling in components or styles.
 */

export type LocaleId = 'zh' | 'en'

/** 自定义安装入口渠道：三张卡片（NPM 包 / GitHub 源码 / DSH 命令）。
 * 客户端提交时显式上报，服务端落日志/报错提示据此溯源「从哪个入口发起」。 */
export type InstallChannel = 'npm' | 'git' | 'dsh'

/** Translation function signature shared by the host binder and the in-component dictionary. */
export type Translate = (key: string, params?: Record<string, string | number>) => string

/** The subset of the locale service this plugin touches. */
export interface LocaleService {
  register(namespace: string, dicts: { zh: Record<string, string>; en: Record<string, string> }): unknown
  bind(namespace: string): (key: string, params?: Record<string, string | number>) => string
  getSnapshot(): { active: LocaleId }
  subscribe(fn: () => void): () => void
  /** 切换宿主（系统）语言偏好：Hub 语言跟随宿主，右上角语言按钮直接写入宿主偏好，
   *  宿主左侧菜单/设置弹窗与 Hub 面板一起切换，不再与宿主语言脱节 */
  setLocale(id: string): void
}

/** The subset of the slots service this plugin touches. */
export interface SlotsService {
  inject(slot: string, register: () => unknown): void
  register(meta: Record<string, unknown>, component: () => unknown): unknown
}

/** The client cordis context shape this plugin relies on (structural). */
export interface HubClientContext {
  effect(callback: () => unknown, label?: string): void
  slots: SlotsService
  locale: LocaleService
}

export interface SectionProps {
  t: Translate
  locale: LocaleService
}

/** Slim projection of the site's DirectoryPlugin entries. */
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
   *  command/githubCommand = 目录下发的权威安装命令（npm/git 通道各一条），
   *  仅供展示/复制 —— CLI-only 插件（如 dsh-tui）需专属 profile（--profile dsh-tui），
   *  无法从 repo/npm 包名推断，必须用目录命令。 */
  install?: { webInstallable?: boolean; command?: string; githubCommand?: string }
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

export type ToastKind = 'copied' | 'errCopied' | 'done' | 'fail' | 'removed' | 'removeFail' | 'revealFail'

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
}

/** Worker 返回的「关注我们」内容（content 为 Markdown，可字符串或 {zh,en} 双语言对象）。 */
export interface HubAboutInfo {
  /** Markdown 平台介绍 + 反馈群二维码；可传字符串，或 { zh, en } 双语言对象按界面语言取 */
  content?: string | Record<string, string> | null
  updatedAt?: string | null
}
