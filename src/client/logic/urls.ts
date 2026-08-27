/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * URL builders: catalog detail pages, plugin site links and the pre-filled
 * GitHub issue URL used by the failure modal. Pure functions — the issue
 * URL stays within GitHub's 8192-byte request limit.
 */
import type { EnvInfo, HubPlugin, LocaleId } from '../types.ts'
import { GITHUB_URL, PLUGIN_VERSION, SITE_URL } from './constants.ts'
import { MAX_CORE_CHARS, classifyFailure, coreErrorCode, summarizeError } from './failures.ts'
import type { FailureKind } from './failures.ts'

/** dsh-plugin.org 中文页挂在 /zh/ 前缀下，英文在根路径。 */
export function langPathOf(lang: LocaleId): string {
  return lang === 'zh' ? 'zh/' : ''
}

/**
 * 官网详情页两级路径：/plugins/{ownerSlug}/{slug}；
 * 缺 ownerSlug 时从 repo 推导（卡片详情按钮与弹窗来源行共用）。
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

/** 按失败类型给出简洁的错误原因标题（对外用英文）：
 *  标题直接点明问题出在哪一侧（构建白名单/分发物/本机 npm/网络/插件侧），
 *  作者与用户扫一眼列表就能分流 —— 不再用含糊的 Install/Remove 动作词。 */
function reasonTitleOf(kind: FailureKind): string {
  switch (kind) {
    case 'npmTooOld': return 'npm too old to install'
    case 'pnpmIgnoredBuild': return 'build scripts blocked by pnpm allowlist'
    case 'pluginPrepare': return 'plugin distribution incomplete'
    case 'network': return 'network failure on the user side'
    default: return 'plugin install failed'
  }
}

/**
 * 一键反馈 GitHub Issue 的预填链接：标题带「来自 dsh-plugin.org」标识 + 错误原因，
 * 正文只带核心信息 —— 原因判定 + 关键错误代码 + 尝试过的安装方式 + 宿主机器环境快照 +
 * 错误核心摘要（完整日志太长，塞进 URL 会被 GitHub 以「request URL too long」拒绝，
 * 故只收集重点）。错误弹窗、失败记录共用此逻辑。
 * env 取不到时为 null，链接照常生成、只是少环境段。
 * attempts（尝试过的安装方式，npm 反查 + 实际执行命令）：作者看到我们查过/试过的命令，
 * 组织 scope 与 GitHub 用户名不一致时也能直接指认正确的 npm 包名。
 */
export function pluginIssueUrl(repo: string, message: string, env?: EnvInfo | null, command?: string, attempts?: string[]): string {
  // 原因判定：按失败类型归类，便于作者判断问题是否出在插件侧。
  // [packaging]（预检/装后校验拦截）单独列：无论走 npm 还是 git 通道，都是分发物不完整
  // （package.json 声明的入口文件在发布物里缺失），作者照此补齐即可。
  const kind = classifyFailure(message)
  // 标题 = 错误原因（非动作词），让 issue 列表一眼可分流
  const title = `[dsh-plugin.org | dsh-plugin-hub] ${reasonTitleOf(kind)}: ${repo}`
  const reason = /\[packaging\]/i.test(message)
    ? 'plugin distribution is incomplete — the entry file declared in package.json is missing from the published package (github tarball or npm package); please commit build output or publish a complete package'
      : kind === 'network'
        ? 'network connectivity issue on the user side (DNS, proxy, firewall, or a blocked connection)'
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
      `## [DSH Plugin 插件中心](${SITE_URL}) · 安装 Plugin 失败错误信息`,
      `本错误信息由 [dsh-plugin-hub](${GITHUB_URL}) 插件中心的安装程序自动生成，随本次安装失败一并提交。`,
      `- 实际执行的安装命令：\`${command ?? `dsh plugin${env?.profile ? ` --profile ${env.profile}` : ''} add git+https://github.com/${repo}.git`}\``,
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
          'DSH 插件支持两种官方安装通道：`dsh plugin add <npm-package>`（npm 分发，需发布完整构建产物）与 `dsh plugin add git+https://github.com/owner/repo.git`（Git 直装，仓库需提交构建产物或在 package.json 提供 `prepare` 脚本）。当前插件的分发物缺少 package.json 声明的入口文件，请按所用通道补齐后重新发布。',
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

