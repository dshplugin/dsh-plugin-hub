/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * URL 构造：目录详情页、插件官网链接，以及失败弹窗用的预填 GitHub Issue 链接。
 * 均为纯函数，保证 issue URL 不超过 GitHub 8192 字节的请求上限。
 */
import type { EnvInfo, HubPlugin, LocaleId } from '../types.ts'
import { GITHUB_URL, HUB_REPO, PLUGIN_VERSION, SITE_URL } from './constants.ts'
import { MAX_CORE_CHARS, actionWordEn, actionWordZh, classifyFailure, coreErrorCode, pnpmPolicyHintOf, summarizeError } from './failures.ts'
import { executedCommandOf } from './install-command.ts'
import type { FailureAction, FailureKind } from './failures.ts'

/** dsh-plugin.org 中文页挂在 /zh/ 前缀下，英文在根路径。 */
export function langPathOf(lang: LocaleId): string {
  return lang === 'zh' ? 'zh/' : ''
}

/** 官网链接统一携带 `?ref=hub` 来源参数：统计有多少访问是从插件商城跳转而来。
 *  所有「从商城跳官网」的链接（详情页/首页）都应经由此函数拼接，避免来源参数散落各处。 */
export function siteUrl(path: string): string {
  return `${SITE_URL}${path}?ref=hub`
}

/**
 * 官网详情页两级路径：/plugins/{ownerSlug}/{slug}；
 * 缺 ownerSlug 时从 repo 推导（卡片详情按钮与弹窗来源行共用）。
 */
export function pluginDetailUrl(plugin: HubPlugin, langPath: string): string {
  const repo = plugin.source?.repo ?? ''
  return siteUrl(`${langPath}plugins/${plugin.ownerSlug ?? repo.split('/')[0]?.toLowerCase() ?? ''}/${plugin.slug}`)
}

/**
 * 失败弹窗里仓库地址的跳转目标：官网详情页（含插件收录信息），
 * 与 issue 正文的 Catalog 链接同一形式（单级 /plugins/{repo}）。
 * 官网静态导出只生成全小写路径，GitHub 仓库名大小写不敏感，这里统一转小写，
 * 否则 HuaGuoXingKong/dsh-prompt-rewriter 这类仓库的链接会落到 404。
 */
export function pluginSiteUrl(repo: string): string {
  return siteUrl(`plugins/${repo.toLowerCase()}`)
}

/** 错误原因标题（对外英文）：点明问题出在哪一侧，便于 issue 列表分流；
 *  动作级原因（未分类/超时…）带动作词，卸载失败不写成 install failed。 */
function reasonTitleOf(kind: FailureKind, action: FailureAction): string {
  const word = actionWordEn(action)
  switch (kind) {
    case 'npmTooOld': return `npm too old for this ${word}`
    case 'nodeEngine': return `Node / pnpm on the user machine is below the version this ${word} requires`
    case 'profileState': return `the user profile's pnpm metadata does not match the local pnpm for this ${word}`
    case 'profileYamlCorrupted': return 'the user profile has a corrupted YAML config (duplicated mapping key)'
    case 'profileLocalBuild': return 'a local (file:/link:) plugin already in the user profile has a failing build script'
    case 'dshMissing': return 'dsh command not found on the user machine'
    case 'pnpmMissing': return 'pnpm command not found on the user machine'
    case 'pnpmStore': return 'pnpm store version mismatch on the user machine'
    case 'pnpmModulesMismatch': return 'the profile modules directory was built with a different pnpm config on the user machine'
    case 'pnpmWorkspace': return `pnpm workspace-root check blocked the ${word} on the user machine`
    case 'originRejected': return 'request origin rejected by the local service on the user machine'
    case 'pnpmPolicy': return `pnpm supply-chain policy blocked the ${word} on the user machine`
    case 'pnpmUnusedPatch': return 'stale pnpm patch entry on the user machine'
    case 'pnpmMissingDep': return 'dependency not found on the npm registry on the user machine'
    case 'registryVersionStale': return `requested version not available on the npm registry in use on the user machine`
    case 'registryAuth': return `npm registry rejected the credentials for this ${word} on the user machine`
    case 'profileExclusive': return `the desktop profile is managed only by the Electron app, so the CLI refused the ${word}`
    case 'pnpmLinkedDirMissing': return 'dangling local (link:) dependency in the user profile'
    case 'fileLocked': return 'file locked by another process on the user machine'
    case 'accessDenied': return 'file write access denied on the user machine'
    case 'fsUnavailable': return 'local file system unavailable on the user machine'
    case 'pnpmIgnoredBuild': return 'build scripts blocked by pnpm allowlist'
    case 'pluginPrepare': return 'plugin distribution incomplete'
    case 'hostIncompatible': return 'plugin does not support the DSH version in use'
    case 'network': return 'network failure on the user side'
    case 'tlsTrust': return `TLS certificate verification failed on the user machine during the ${word}`
    case 'hostCliSpawn': return 'the DSH host could not be launched on the user machine'
    case 'hubState': return `stale ${word} state in the plugin hub`
    case 'profileBundleMissing': return 'the DSH profile is missing a bundle it declares'
    case 'timeout': return `${word} timed out`
    case 'profileLock': return 'DSH profile is locked by another process'
    case 'pluginMissingDep': return 'a dependency of the plugin is not published on npm'
    case 'dshTooOld': return 'the plugin requires a newer DSH than the host runs'
    case 'localEnv': return `no plugin-side cause found — the failure points at the local environment for this ${word}`
    case 'hub': return `${word} failed (cause unclassified)`
    default: return `plugin ${word} failed`
  }
}

/**
 * 一键反馈 GitHub Issue 的预填链接：标题带「来自 dsh-plugin.org」标识 + 错误原因，
 * 正文只带核心信息 —— 原因判定 + 关键错误代码 + 尝试过的安装方式 + 宿主机器环境快照 +
 * 错误核心摘要（完整日志太长，塞进 URL 会被 GitHub 以「request URL too long」拒绝，
 * 故只收集重点）。错误弹窗、失败记录共用此逻辑。
 * env 取不到时为 null，链接照常生成、只是少环境段。
 * attempts（尝试过的安装方式，实际执行过的命令）：作者看到我们试过的命令，
 * 组织 scope 与 GitHub 用户名不一致时也能直接指认正确的 npm 包名。
 */
export function pluginIssueUrl(repo: string, message: string, env?: EnvInfo | null, command?: string, attempts?: string[], action: FailureAction = 'install'): string {
  // 原因判定：按失败类型归类，便于作者判断问题是否出在插件侧。
  // [packaging]（装后校验拦截）单独列：分发物不完整（package.json 声明的文件
  // 在发布物里缺失），作者照此补齐即可。
  const kind = classifyFailure(message)
  const executed = executedCommandOf(command, attempts)
  // 动作词：标题与正文的「安装/更新/卸载」统一取自这里
  const zhWord = actionWordZh(action)
  // 标题 = 错误原因（非动作词），让 issue 列表一眼可分流
  const title = `[dsh-plugin.org | dsh-plugin-hub] ${reasonTitleOf(kind, action)}: ${repo}`
  const reason = kind === 'hostIncompatible'
    ? 'the plugin declares a dsh compatibility range that does not include the runtime in use, so the host rejects it before installing anything; please extend the supported dsh versions or publish a compatible release'
    : /\[packaging\]/i.test(message)
    ? 'plugin distribution is incomplete — a file the package needs (its entry from main / exports, an entry a bundled patch mounts, or the patch declared by dsh.bundle.patch) is missing from the published npm package; please publish a complete package'
      : /\[registry-missing\]/i.test(message)
        // 服务端用官方 registry 复核过：缺的包在官方源上也不存在，且不是用户 profile 的残留依赖
        ? 'a dependency declared by the plugin is not published on the public npm registry (missing, removed, or never released); please publish or correct that dependency, or ship it with the plugin'
      : kind === 'network'
        ? 'network connectivity issue on the user side (DNS, proxy, firewall, or a blocked connection)'
      : kind === 'tlsTrust'
        ? 'the local certificate chain is not trusted by Node/pnpm (corporate SSL inspection, antivirus web shield, or a local MITM proxy) — local environment issue'
      : kind === 'profileLocalBuild'
        ? 'no plugin-side cause found — pnpm rejects a build script of a local (file:/link:) package that already exists in the user profile, so every install into that profile fails the same way (local environment issue)'
      : kind === 'localEnv'
        ? 'no evidence of a plugin-side cause; the log shows local-environment signals (system error codes, certificates/proxy, or a broken local config), so this is reported for triage of the classifier only'
      : kind === 'dshTooOld'
        ? 'the plugin declares a minimum DSH version this host does not meet — upgrade DSH first (local environment issue)'
      : kind === 'pnpmModulesMismatch'
        ? 'the profile node_modules was created with a different pnpm config (hoisting / virtual store settings), so pnpm refuses to reuse it (local environment issue)'
      : kind === 'profileBundleMissing'
        ? 'the profile declares a bundle that is not installed in it (interrupted install or incomplete app update), so the host aborts before installing anything (local environment issue)'
      : kind === 'registryAuth'
        ? 'the npm registry rejected the request with 401/403 — the configured registry needs credentials or blocks this network (local environment issue)'
      : kind === 'profileExclusive'
        ? 'the desktop profile can only be managed by the Electron app, and the install was attempted from an external CLI (local environment issue)'
        : kind === 'pluginPrepare'
          ? 'plugin prepare/build script failed during install (packaging/distribution issue)'
          : kind === 'pnpmIgnoredBuild'
            ? 'a package in this plugin\'s install tree (the plugin itself or one of its dependencies) declares a build script that pnpm blocks by default; pnpm fails the whole install until it is approved, and the blocked script is not necessarily a native module'
            : kind === 'originRejected'
                ? 'the request never reached the install flow — the local service rejected its origin (local environment issue)'
                : kind === 'pnpmPolicy'
                ? pnpmPolicyHintOf(message) === 'failPnpmTarballIntegrityHint'
                  ? 'pnpm rejected a lockfile entry without tarball integrity; inspect and back up the profile lockfile before resolving it again, keeping integrity checks enabled'
                  : 'the pnpm supply-chain policy on the user machine blocked the install (minimum release age for freshly published packages / untrusted origin)'
                : kind === 'pnpmUnusedPatch'
                  ? 'the profile keeps a pnpm patch entry for an older dsh-plugin version, so pnpm aborted the install (local config issue)'
                  : kind === 'fileLocked'
                    ? 'a file in the profile is locked by another process on the user machine (local environment issue)'
                    : kind === 'accessDenied'
                      ? 'the system denied write access to a file in the profile on the user machine (local environment issue)'
                      : kind === 'fsUnavailable'
                        ? 'the local file system could not accept the write — no space left, read-only volume, or too many open file handles on the user machine (local environment issue)'
                        : 'plugin-side install failure'
  const code = coreErrorCode(message)
  // 按给定核心摘要预算构建完整预填 URL（含 URL 编码）；预算可调，供超长时逐档缩小
  const build = (coreChars: number): string => {
    const body = [
      '## Summary',
      `- Cause: ${reason}`,
      ...(code ? [`- Key error: \`${code}\``] : []),
      '',
      // 来源说明：标题（链官网）+ 一句来源（链仓库）+ 实际执行的命令（含 --profile）与执行结果，链接由常量动态拼接
      `## [DSH Plugin 插件市场](${SITE_URL}) · ${zhWord} Plugin 失败错误信息`,
      `本错误信息由 [dsh-plugin-hub](${GITHUB_URL}) 插件市场的安装程序自动生成，随本次${zhWord}失败一并提交。`,
      `- 实际执行的${zhWord}命令：${executed ? `\`${executed}\`` : 'unknown (no executed command recorded)'}`,
      `- 执行结果：${zhWord}失败，未能${zhWord}该插件。`,
      // 尝试过的安装方式（实际执行过的命令，按先后顺序）：作者据此指认正确的 npm 包名。
      // 不写「安装」：卸载失败也走这条正文。
      ...(attempts && attempts.length > 0
        ? ['', '## Attempted channels（已尝试的方式）', ...attempts.map((a) => `- ${a}`)]
        : []),
      // [packaging] 场景：说明当前插件的 npm 分发物不完整
      ...(/\[packaging\]/i.test(message)
        ? [
          '',
          '## 安装方式说明',
          '当前插件的 npm 分发物缺少它需要的文件（`main` / `exports` 声明的入口、补丁按本包名 mount 的入口，或 `dsh.bundle.patch` 声明的补丁）。请发布包含完整构建产物的 npm 包后重试。',
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
          // 工具链版本：pnpm/npm/git —— 排查 ERR_PNPM_UNEXPECTED_STORE（store 大版本不匹配）
          // 这类环境问题，作者一眼就能对号入座；探测不到如实写 unknown
          `- pnpm: ${env.pnpmVersion ? `v${env.pnpmVersion}` : 'unknown'}`,
          `- npm: ${env.npmVersion ? `v${env.npmVersion}` : 'unknown'}`,
          `- git: ${env.gitVersion ? `v${env.gitVersion}` : 'unknown'}`,
          `- OS: ${env.platform} ${env.arch} (${env.release})`,
          `- Profile: \`${env.profile}\``,
          `- DSH Home: \`${env.dshHome}\``,
          // 完整安装日志在通知中心（hub.log 只有任务开始/结束，没有 pnpm 输出，别让用户白附）
          '- Full log: open the Hub notifications, select the failed record and press "Copy"',
        ]
        : []),
      // 该插件在插件市场的收录位置（详情页链接）
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

/**
 * 插件中心自身仓库的预填 Issue 链接：用于「非插件侧」失败（无法识别的未知原因，
 * 以及判定由插件中心自己产出、可能误报时的次要反馈入口）。正文带上目标插件与完整
 * 错误摘要，供插件中心维护者分诊 —— 不再把环境问题/插件中心自身问题误投给插件作者。
 */
export type HubIssueVariant =
  /** 缺省：安装器主动把失败送到插件中心分诊（未分类时的默认去向） */
  | 'triage'
  /** 从判定由插件中心自己产出的分支（插件打包问题 / allowBuilds 拦截）的次要入口提交：用户怀疑是误报 */
  | 'misjudge'

export function hubIssueUrl(
  pluginRepo: string | null,
  message: string,
  env?: EnvInfo | null,
  command?: string,
  attempts?: string[],
  /** 见 HubIssueVariant；缺省 'triage'，既有正文保持不变 */
  variant: HubIssueVariant = 'triage',
  /** 上报动作：标题与正文按它取词 */
  action: FailureAction = 'install',
): string {
  const kind = classifyFailure(message)
  const executed = executedCommandOf(command, attempts)
  const zhWord = actionWordZh(action)
  const repo = pluginRepo && pluginRepo.trim() !== '' ? pluginRepo.trim() : 'unknown'
  const title = variant === 'misjudge'
    // 标题就点明「可能是误判」，维护者一眼能区分它和未分类时的默认去向
    ? `[dsh-plugin-hub] possible misjudgment: ${repo}`
    : `[dsh-plugin-hub] ${reasonTitleOf(kind, action)}: ${repo}`
  const code = coreErrorCode(message)
  const build = (coreChars: number): string => {
    const body = [
      '## Summary',
      `- Auto-classified cause: ${reasonTitleOf(kind, action)}`,
      `- Target plugin: \`${repo}\``,
      ...(code ? [`- Key error: \`${code}\``] : []),
      // 为什么投递到这里而非插件仓库：只有确有证据是插件自身构建/分发失败（pluginPrepare、
      // 或自动放行 allowBuilds 重试后仍失败的构建拦截）才投插件仓库
      ...(variant === 'misjudge'
        // 这些分支的判据由插件中心自己产出、或掺了我们的动作（自动放行 allowBuilds）——
        // 一旦我们自己误报，用户就被送去作者仓库、我们永远收不到反馈。
        // 正文写清它来自哪条分支、判据是谁给的，维护者才不会把它当成未分类时的默认去向。
        ? [
          '- Filed from: a branch that normally routes to the plugin repo — filed here because that verdict may be our own misjudgment.',
          '- Source of that verdict: produced by dsh-plugin-hub\'s own check or its auto-allow retry, not by plain pnpm output.',
        ]
        : ['- Why filed here: the installer only routes a failure to the plugin repo when the cause is demonstrably the plugin\'s own build/distribution (pluginPrepare, or build scripts pnpm blocks that even an auto-allow retry cannot get past). This failure does not match that, so it is routed here for triage.']),
      '',
      `## [DSH Plugin 插件市场](${SITE_URL}) · ${zhWord} Plugin 失败错误信息`,
      `本错误信息由 [dsh-plugin-hub](${GITHUB_URL}) 插件市场的安装程序自动生成，随本次${zhWord}失败一并提交。`,
      `- 实际执行的${zhWord}命令：${executed ? `\`${executed}\`` : 'unknown (no executed command recorded)'}`,
      `- 执行结果：${zhWord}失败，未能${zhWord}该插件。`,
      ...(attempts && attempts.length > 0
        ? ['', '## Attempted channels（已尝试的方式）', ...attempts.map((a) => `- ${a}`)]
        : []),
      '',
      '## Environment',
      `- Plugin: \`${repo}\``,
      ...(env
        ? [
          `- DSH: ${env.dshVersion ? `v${env.dshVersion}` : 'unknown'}`,
          `- Plugin Hub: v${PLUGIN_VERSION}`,
          `- Node: ${env.nodeVersion}`,
          `- pnpm: ${env.pnpmVersion ? `v${env.pnpmVersion}` : 'unknown'}`,
          `- npm: ${env.npmVersion ? `v${env.npmVersion}` : 'unknown'}`,
          `- git: ${env.gitVersion ? `v${env.gitVersion}` : 'unknown'}`,
          `- OS: ${env.platform} ${env.arch} (${env.release})`,
          `- Profile: \`${env.profile}\``,
          `- DSH Home: \`${env.dshHome}\``,
          '- Full log: open the Hub notifications, select the failed record and press "Copy"',
        ]
        : []),
      ...(repo !== 'unknown' ? [`- Catalog: [${pluginSiteUrl(repo)}](${pluginSiteUrl(repo)})`] : []),
      '',
      '## Error (core)',
      '',
      '```',
      summarizeError(message, coreChars),
      '```',
      '',
      '---',
      `This error was produced by the [dsh-plugin-hub](${GITHUB_URL}) installer bundled with DeepSeek Harness.`,
    ].join('\n')
    return `https://github.com/${HUB_REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
  }
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
