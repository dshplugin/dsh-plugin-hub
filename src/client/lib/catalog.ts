/**
 * Catalog constants and normalizers: site URLs, category metadata, sort keys
 * and the mapping from the online API's short-key payloads to HubPlugin.
 */
import type { HubPlugin, LocaleId } from '../types.ts'

export const SITE_URL = 'https://dsh-plugin.org/'

/** 构建时由 tsdown 从 package.json 注入的插件版本号（见 tsdown.config.ts define）。 */
declare const __PLUGIN_VERSION__: string

/** 插件当前版本号，供头部标题展示「DSH-Plugin Hub v0.1.1」。 */
export const PLUGIN_VERSION: string = __PLUGIN_VERSION__

/** dsh-plugin.org 中文页挂在 /zh/ 前缀下，英文在根路径。 */
export function langPathOf(lang: LocaleId): string {
  return lang === 'zh' ? 'zh/' : ''
}

/**
 * 官网详情页两级路径：/plugins/{ownerSlug}/{slug}；
 * 旧数据缺 ownerSlug 时从 repo 推导（卡片详情按钮与弹窗来源行共用）。
 */
export function pluginDetailUrl(plugin: HubPlugin, langPath: string): string {
  const repo = plugin.source?.repo ?? ''
  return `${SITE_URL}${langPath}plugins/${plugin.ownerSlug ?? repo.split('/')[0]?.toLowerCase() ?? ''}/${plugin.slug}`
}

/**
 * 一键反馈 GitHub Issue 的预填链接：标题带「来自 dsh-plugin.org」标识，
 * 正文附上收录来源与详情页链接 —— 用户在作者仓库提交的 issue 里就带着
 * 我们网站的外链（错误弹窗、失败记录共用此逻辑）。
 */
export function pluginIssueUrl(repo: string, message: string): string {
  const title = `[dsh-plugin.org | dsh-plugin-hub] Install/Remove failed: ${repo}`
  const body = [
    '## Environment',
    `- Plugin: \`${repo}\``,
    // 明示来源：插件来自 dsh-plugin.org 收录，官网做成真实超链接才有外链效果
    '- Installed from: [dsh-plugin.org](https://dsh-plugin.org/) plugin catalog (in-app install via DSH-Plugin Hub)',
    // 该插件在我们网站的收录位置（详情页）：同样是超链接，提交后留在 issue 里
    `- Catalog: [https://dsh-plugin.org/plugins/${repo}](https://dsh-plugin.org/plugins/${repo})`,
    '',
    '## Error',
    '',
    '```',
    message,
    '```',
    '',
    '---',
    // 底部署名：报错来自内置在 DeepSeek Harness 里的 dsh-plugin-hub 安装程序，仓库做成超链接
    'This error was produced by the [dsh-plugin-hub](https://github.com/dshplugin/dsh-plugin-hub) installer bundled with DeepSeek Harness.',
  ].join('\n')
  return `https://github.com/${repo}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
}

export const CATEGORY_ORDER = [
  'interface', 'session', 'memory', 'tools', 'agent', 'workflow',
  'integration', 'model', 'dev', 'knowledge', 'fun',
]

/** 分类标签按界面语言取词；未知 key 原样返回。 */
export function categoryLabel(
  map: Record<string, { zh: string; en: string }>,
  key: string,
  lang: LocaleId,
): string {
  return map[key]?.[lang] ?? key
}

/**
 * 归一化在线 API（dsh-plugin.org/api/plugins.{lang}.json）返回的短 key 结构
 * （s/o/n/c/t/f/d/r/v/u/a/sg/fk），统一为 HubPlugin，保证渲染逻辑只认一种结构。
 */
export function normalize(raw: Record<string, unknown>): HubPlugin {
  if (typeof raw.s === 'string') {
    return {
      slug: raw.s,
      ownerSlug: typeof raw.o === 'string' ? raw.o : undefined,
      displayName: typeof raw.n === 'string' ? raw.n : undefined,
      category: typeof raw.c === 'string' ? raw.c : undefined,
      topics: Array.isArray(raw.t) ? (raw.t as string[]) : undefined,
      features: Array.isArray(raw.f) ? (raw.f as string[]) : undefined,
      description: typeof raw.d === 'string' ? raw.d : undefined,
      source: typeof raw.r === 'string' ? { repo: raw.r } : undefined,
      compatibility: typeof raw.v === 'string' ? { status: raw.v } : undefined,
      dates: {
        repoUpdatedAt: typeof raw.u === 'string' ? raw.u : undefined,
        addedAt: typeof raw.a === 'string' ? raw.a : undefined,
      },
      stats: {
        stargazers_count: typeof raw.sg === 'number' ? raw.sg : undefined,
        forks_count: typeof raw.fk === 'number' ? raw.fk : undefined,
      },
    }
  }
  return raw as unknown as HubPlugin
}

export const CATEGORY_LABELS: Record<string, { zh: string; en: string }> = {
  interface: { zh: '界面与体验', en: 'UI & Experience' },
  session: { zh: '会话与消息', en: 'Sessions & Messages' },
  memory: { zh: '记忆与上下文', en: 'Memory & Context' },
  tools: { zh: '工具与能力', en: 'Tools & Capabilities' },
  agent: { zh: '技能与智能体', en: 'Skills & Agents' },
  workflow: { zh: '工作流与自动化', en: 'Workflow & Automation' },
  integration: { zh: '集成与连接', en: 'Integrations & Connections' },
  model: { zh: '模型与推理', en: 'Models & Reasoning' },
  dev: { zh: '开发与运维', en: 'Development & Operations' },
  knowledge: { zh: '数据与知识', en: 'Data & Knowledge' },
  fun: { zh: '娱乐', en: 'Entertainment' },
}

/** 分类 Tab 的紧凑标签（英文模式空间受限时使用）。 */
export const CATEGORY_SHORT_LABELS: Record<string, { zh: string; en: string }> = {
  interface: { zh: '界面体验', en: 'UI Exp' },
  session: { zh: '会话消息', en: 'Sessions' },
  memory: { zh: '记忆上下文', en: 'Memory' },
  tools: { zh: '工具能力', en: 'Tools' },
  agent: { zh: '技能智能体', en: 'Agents' },
  workflow: { zh: '工作流', en: 'Workflow' },
  integration: { zh: '集成连接', en: 'Integrations' },
  model: { zh: '模型推理', en: 'Models' },
  dev: { zh: '开发运维', en: 'Dev' },
  knowledge: { zh: '数据知识', en: 'Knowledge' },
  fun: { zh: '娱乐', en: 'Fun' },
}

export const SORTS = ['sortStars', 'sortForks', 'sortUpdated', 'sortNewest'] as const
export type SortKey = (typeof SORTS)[number]
