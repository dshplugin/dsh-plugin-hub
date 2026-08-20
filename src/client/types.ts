/**
 * Shared types for the dsh-plugin browser client. Kept dependency-free so
 * any client module can import them without pulling in components or styles.
 */

export type LocaleId = 'zh' | 'en'

/** Translation function signature shared by the host binder and the in-component dictionary. */
export type Translate = (key: string, params?: Record<string, string | number>) => string

/** The subset of the locale service this plugin touches. */
export interface LocaleService {
  register(namespace: string, dicts: { zh: Record<string, string>; en: Record<string, string> }): unknown
  bind(namespace: string): (key: string, params?: Record<string, string | number>) => string
  getSnapshot(): { active: LocaleId }
  subscribe(fn: () => void): () => void
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
  /** 作者小写 key，与 slug 共同构成唯一身份（两级路径 /plugins/{ownerSlug}/{slug}）；旧数据可能缺省 */
  ownerSlug?: string
  slug: string
  displayName?: string
  category?: string
  topics?: string[]
  features?: string[]
  description?: string
  source?: { repo?: string }
  compatibility?: { status?: string }
  dates?: { repoUpdatedAt?: string; addedAt?: string }
  stats?: { stargazers_count?: number; forks_count?: number }
}

/** 后台安装/卸载任务快照：进度 0-100 + 实时输出行（服务端估算，客户端轮询）。 */
export interface TaskState {
  id: number
  /** pending 排队中 / running 执行中 / done 完成 / failed 失败 / cancelled 已取消 */
  status: 'pending' | 'running' | 'done' | 'failed' | 'cancelled'
  progress: number
  lines: string[]
}

export type ToastKind = 'copied' | 'errCopied' | 'done' | 'fail' | 'removed' | 'removeFail'

export interface ToastState {
  id: number
  kind: ToastKind
}
