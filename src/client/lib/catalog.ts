/**
 * Catalog constants and normalizers: site URLs, category metadata, sort keys
 * and the mapping from the online API's short-key payloads to HubPlugin.
 */
import type { EnvInfo, HubPlugin, LocaleId } from '../types.ts'
import { MAX_CORE_CHARS, classifyFailure, coreErrorCode, summarizeError } from './failures.ts'

/** 插件中心官网地址。 */
export const SITE_URL = 'https://dsh-plugin.org/'

/** 插件中心源码仓库：头部右上角 GitHub 图标的跳转地址 */
export const GITHUB_URL = 'https://github.com/dshplugin/dsh-plugin-hub'

/** 构建时由 tsdown 从 package.json 注入的插件版本号（见 tsdown.config.ts define）。 */
declare const __PLUGIN_VERSION__: string

/**
 * 插件当前版本号，供头部标题展示「DSH-Plugin Hub v0.1.1」。
 * tsdown 构建时用 define 把 __PLUGIN_VERSION__ 替换成 package.json 的版本号；
 * node --test 直接 import 本模块时该标识符不存在，typeof 守卫兜底为空串。
 */
export const PLUGIN_VERSION: string =
  typeof __PLUGIN_VERSION__ === 'string' ? __PLUGIN_VERSION__ : ''

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
 * 失败弹窗里仓库地址的跳转目标：官网详情页（含插件收录信息），
 * 与 issue 正文的 Catalog 链接同一形式（单级 /plugins/{repo}）。
 */
export function pluginSiteUrl(repo: string): string {
  return `${SITE_URL}plugins/${repo}`
}

/**
 * 一键反馈 GitHub Issue 的预填链接：标题带「来自 dsh-plugin.org」标识，正文只带
 * 核心信息 —— 原因判定 + 关键错误代码 + 尝试过的安装方式 + 宿主机器环境快照 +
 * 错误核心摘要（完整日志太长，塞进 URL 会被 GitHub 以「request URL too long」拒绝，
 * 故只收集重点）。错误弹窗、失败记录共用此逻辑。
 * env 取不到时为 null，链接照常生成、只是少环境段。
 * attempts（尝试过的安装方式，npm 反查 + 实际执行命令）：作者看到我们查过/试过的命令，
 * 组织 scope 与 GitHub 用户名不一致时也能直接指认正确的 npm 包名。
 */
export function pluginIssueUrl(repo: string, message: string, env?: EnvInfo | null, command?: string, attempts?: string[]): string {
  const title = `[dsh-plugin.org | dsh-plugin-hub] Install/Remove failed: ${repo}`
  // 原因判定：让作者一眼知道这是不是自己插件的问题。
  // [packaging]（预检/装后校验拦截）单独列：无论走 npm 还是 git 通道，都是分发物不完整
  // （package.json 声明的入口文件在发布物里缺失），作者照此补齐即可。
  const kind = classifyFailure(message)
  const reason = /\[packaging\]/i.test(message)
    ? 'plugin distribution is incomplete — the entry file declared in package.json is missing from the published package (github tarball or npm package); please commit build output or publish a complete package'
      : kind === 'pluginPrepare'
        ? 'plugin prepare/build script failed during install (packaging/distribution issue)'
        : kind === 'pnpmIgnoredBuild'
          ? 'plugin depends on a native module whose build script pnpm blocks by default (use a prebuilt variant)'
          : 'plugin-side install failure'
  const code = coreErrorCode(message)
  // 按给定核心摘要预算构建完整预填 URL（含 URL 编码）；预算可调，供超长时逐档缩小
  const build = (coreChars: number): string => {
    const body = [
      '## Summary',
      `- Cause: ${reason}`,
      ...(code ? [`- Key error: \`${code}\``] : []),
      '',
      // 来源说明：标题（链官网）+ 一句来源（链仓库）+ 实际执行的安装命令（含 --profile）与执行结果，链接由常量动态拼接
      `## [DSH-Plugin 插件中心](${SITE_URL}) · 安装 Plugin 失败错误信息`,
      `本错误信息由 [dsh-plugin-hub](${GITHUB_URL}) 插件中心的安装程序自动生成，随本次安装失败一并提交。`,
      `- 实际执行的安装命令：\`${command ?? `dsh plugin${env?.profile ? ` --profile ${env.profile}` : ''} add github:${repo}`}\``,
      `- 执行结果：安装失败，未能安装该插件。`,
      // 尝试过的安装方式（npm 反查 + 实际执行命令，按先后顺序）：作者据此反推正确的
      // npm 包名 —— 组织 scope 与 GitHub 用户名不一致时仅凭仓库名猜不到，作者看到我们
      // 查过/试过的命令就能直接指认
      ...(attempts && attempts.length > 0
        ? ['', '## Attempted install channels（已尝试的安装方式）', ...attempts.map((a) => `- ${a}`)]
        : []),
      // [packaging] 场景：说明两种官方安装通道（npm 包 / git 直装），当前插件在对应通道下分发不完整
      ...(/\[packaging\]/i.test(message)
        ? [
          '',
          '## 安装方式说明',
          'DSH 插件支持两种官方安装通道：`dsh plugin add <npm-package>`（npm 分发，需发布完整构建产物）与 `dsh plugin add github:owner/repo`（git 直装，仓库需提交构建产物或在 package.json 提供 `prepare` 脚本）。当前插件的分发物缺少 package.json 声明的入口文件，请按所用通道补齐后重新发布。',
        ]
        : []),
      '',
      '## Environment',
      `- Plugin: \`${repo}\``,
      // 宿主机器环境快照：便于作者本地复现；某字段缺失时如实写 unknown，不编造
      ...(env
        ? [
          `- DSH: ${env.dshVersion ? `v${env.dshVersion}` : 'unknown'}`,
          `- Plugin Hub: v${PLUGIN_VERSION}`,
          `- Node: ${env.nodeVersion}`,
          `- OS: ${env.platform} ${env.arch} (${env.release})`,
          `- Profile: \`${env.profile}\``,
          `- DSH Home: \`${env.dshHome}\``,
        ]
        : []),
      // 该插件在插件中心的收录位置（详情页链接）
      `- Catalog: [${pluginSiteUrl(repo)}](${pluginSiteUrl(repo)})`,
      '',
      '## Error (core)',
      '',
      '```',
      // 核心错误收集器：只挑关键行（错误代码/构建失败/退出信息），去重截断，URL 才不至于超长
      summarizeError(message, coreChars),
      '```',
      '',
      '---',
      // 底部署名：报错来自内置在 DeepSeek Harness 里的 dsh-plugin-hub 安装程序
      `This error was produced by the [dsh-plugin-hub](${GITHUB_URL}) installer bundled with DeepSeek Harness.`,
    ].join('\n')
    return `https://github.com/${repo}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
  }
  // GitHub 请求行上限 8192 字节：先用宽松预算（最多 ~5K 核心错误）构建，超长再逐档缩小，保证最终 URL 不超限
  const MAX_URL_CHARS = 7600
  let url = build(MAX_CORE_CHARS)
  if (url.length > MAX_URL_CHARS) {
    for (const budget of [4000, 2500, 1400, 800, 400]) {
      url = build(budget)
      if (url.length <= MAX_URL_CHARS) break
    }
  }
  return url
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
 * （s/o/n/vr/c/t/f/d/r/v/u/a/sg/fk），统一为 HubPlugin，保证渲染逻辑只认一种结构。
 */
export function normalize(raw: Record<string, unknown>): HubPlugin {
  if (typeof raw.s === 'string') {
    return {
      slug: raw.s,
      ownerSlug: typeof raw.o === 'string' ? raw.o : undefined,
      displayName: typeof raw.n === 'string' ? raw.n : undefined,
      version: typeof raw.vr === 'string' ? raw.vr : undefined,
      category: typeof raw.c === 'string' ? raw.c : undefined,
      topics: Array.isArray(raw.t) ? (raw.t as string[]) : undefined,
      features: Array.isArray(raw.f) ? (raw.f as string[]) : undefined,
      description: typeof raw.d === 'string' ? raw.d : undefined,
      // 投影输出两种形态：老数据 source 是 repo 字符串；新数据是 { repo, npmPackage }
      source: typeof raw.r === 'string'
        ? { repo: raw.r }
        : raw.r !== null && typeof raw.r === 'object'
          ? {
            repo: typeof (raw.r as { repo?: unknown }).repo === 'string' ? (raw.r as { repo: string }).repo : undefined,
            npmPackage: typeof (raw.r as { npmPackage?: unknown }).npmPackage === 'string' ? (raw.r as { npmPackage: string }).npmPackage : undefined,
          }
          : undefined,
      // 能否网页一键安装：API 仅在 false 时下发 wi（缺省视为 true），据此禁用一键安装、只提示命令行
      install: raw.wi === false ? { webInstallable: false } : undefined,
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

/**
 * 安装通道决策（用户无感知）：目录探测到 npm 包名 → 用 npm 包名安装
 * （走 npm registry tarball，更快、与 GitHub 网络无关）；无 npm 包名 → git 直装。
 * 返回值 target 即传给后端 /install 的安装目标（npm 包名 或 owner/repo）。
 */
export function installTargetOf(p: HubPlugin): { target: string; via: 'npm' | 'github' } {
  const pkg = (p.source?.npmPackage ?? '').trim()
  const repo = (p.source?.repo ?? '').trim()
  if (pkg && repo) return { target: pkg, via: 'npm' }
  return { target: repo, via: 'github' }
}

/** 展示用安装命令（复制/弹窗）：npm 通道显示包名，git 通道显示 github: 源。 */
export function installCommandOf(p: HubPlugin, withProfile = false): string {
  const { target, via } = installTargetOf(p)
  return via === 'npm'
    ? `dsh plugin${withProfile ? ' --profile web' : ''} add ${target}`
    : `dsh plugin${withProfile ? ' --profile web' : ''} add github:${target}`
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
