/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 已安装插件模型（纯逻辑，不依赖 React/UI）。
 *
 * 把宿主 `/installed` 路由下发的本地已装表（npm 包名 → manifest spec）与目录投影合并成
 * 统一的 `InstalledItem` 视图模型，供「已安装」视图消费；同时承载市场视图用的安装匹配
 * 与更新检测，让两个视图共享唯一数据源。
 */
import type { HubPlugin } from '../types.ts'
import { HUB_REPO } from './constants.ts'
import { repoFromInstallTarget } from './install-command.ts'
import { compareVersions } from './release-age.ts'

/** 安装时记录的目录信号（versions 表项）。 */
export interface InstalledVersionSignal {
  version: string
  updatedAt: string
  installedAt?: string
  npmPackage?: string
}

/** 已安装项统一模型：目录元数据 + 宿主运行时信息的合并视图（驱动「已安装」tab）。 */
export interface InstalledItem {
  /** npm 包名（profile 依赖 key） */
  name: string
  /** manifest spec（github:owner/repo、git+https://…、或 npm 版本号） */
  spec: string
  /** 目录里匹配到的插件；目录外/未收录的安装为 null */
  plugin: HubPlugin | null
  /** 仓库身份（owner/repo）；纯 npm 安装无法识别时为 null */
  repo: string | null
  /** 安装到系统上的路径（profile/node_modules/<包名>）；宿主未提供为 null */
  installPath: string | null
  /** 安装时记录的目录版本（无记录为 null） */
  installedVersion: string | null
  /** 安装时间（ISO，无记录为 null） */
  installedAt: string | null
  /** 目录当前最新版本（仓库无 release 为 null） */
  catalogVersion: string | null
  /** 是否有可用更新（有版本比版本，无版本比仓库更新时间） */
  hasUpdate: boolean
  /** 更新被供应链门禁暂缓时的可重试时刻（毫秒）；无更新/非门禁原因 → null */
  pendingUntil: number | null
  /** 是否已加载进运行中 loader（官方 ctx.loader 对账）；false = 已安装但未挂载（装完未重启） */
  loaded: boolean
  /** 是否真正的 dsh 插件（包内声明 dsh 配置 / 在 profile bundles 清单）：
   *  非 dsh 插件（如 GitHub 官方示例仓库）装上也不会被宿主加载，不提示「待重启」 */
  dshCapable: boolean
}

/** 本地路径安装（file:/link:/绝对或相对路径）：身份在本机，不能按 npm 包名认领目录条目。 */
function isLocalSpec(value: string): boolean {
  const v = value.trim()
  return /^(file|link):/i.test(v) || v.startsWith('.') || v.startsWith('/') || /^[A-Za-z]:[\\/]/.test(v)
}

/** 安装时记录的目录信号（按仓库小写 key 查表）。 */
function signalOf(repo: string | null, versions: Record<string, InstalledVersionSignal>): InstalledVersionSignal | null {
  if (!repo) return null
  return versions[repo.toLowerCase()] ?? null
}

/** 插件是否已安装：匹配 Git spec 中的 owner/repo，或 npm 安装的依赖包名；命中返回 npm 包名。 */
export function installedNameOf(
  plugin: HubPlugin,
  installed: Record<string, string>,
  versions: Record<string, InstalledVersionSignal>,
): string | null {
  const repo = plugin.source?.repo
  if (!repo) return null
  const needle = repo.toLowerCase()
  for (const [name, spec] of Object.entries(installed)) {
    if (repoFromInstallTarget(spec).toLowerCase() === needle) return name
  }
  // 只认 npm 安装的依赖（spec 无法解析出仓库身份、也不是本地路径）：git 安装的依赖身份由仓库
  // 匹配决定，file:/link: 安装的本地插件身份在本机 —— 包名同名不代表同仓库，否则「本地装 A」
  // 会被目录里同名的 B 认领，已安装页显示成 B 的信息。
  const pkg = ((plugin.source?.npmPackage || versions[repo.toLowerCase()]?.npmPackage) ?? '').toLowerCase()
  if (pkg) {
    for (const [name, spec] of Object.entries(installed)) {
      if (isLocalSpec(spec)) continue
      if (isRepoLike(repoFromInstallTarget(spec))) continue
      if (name.toLowerCase() === pkg) return name
    }
  }
  return null
}

/** 该插件安装时记录的目录版本（无记录/未安装 → null）。 */
export function installedVersionOf(plugin: HubPlugin, versions: Record<string, InstalledVersionSignal>): string | null {
  const repo = plugin.source?.repo
  if (!repo) return null
  return signalOf(repo, versions)?.version || null
}

/** 该插件对应的 npm 包名（目录下发，或安装时持久化的映射）；无则 null。决定更新是否走 npm registry。 */
export function npmPackageOf(plugin: HubPlugin, versions: Record<string, InstalledVersionSignal>): string | null {
  const repo = plugin.source?.repo
  const pkg = (plugin.source?.npmPackage || (repo ? versions[repo.toLowerCase()]?.npmPackage : undefined) || '').trim()
  return pkg === '' ? null : pkg
}

/**
 * 是否有更新：仅对已安装插件有意义。
 * 双信号判定——有 release 版本的比版本；无版本（repo 不打 tag）的比仓库最近更新时间
 * （repoUpdatedAt，ISO 字符串字典序 = 时间序），更新时间变新说明有新提交。
 * 版本用「目录 > 已装」判断，不做 != 比较：目录可能滞后于 npm，若直接用不等，
 * 会把「已装 1.1.10、目录还写 1.1.8」判成有更新，反而引导用户降级。
 */
export function hasUpdateOf(
  plugin: HubPlugin,
  installed: Record<string, string>,
  versions: Record<string, InstalledVersionSignal>,
): boolean {
  if (installedNameOf(plugin, installed, versions) === null) return false
  const repo = plugin.source?.repo
  if (!repo) return false
  const rec = versions[repo.toLowerCase()]
  if (!rec) return false
  // 账本记录可能是残缺的：安装一开始就会先写入 npm 包名映射，版本要等任务结束才知道。
  // 缺版本的记录按「无版本信号」处理、退回更新时间比较 —— 直接拿去比版本会让整个插件区块崩掉
  const recorded = typeof rec.version === 'string' ? rec.version : ''
  if (plugin.version && recorded !== '') return compareVersions(plugin.version, recorded) > 0
  const current = plugin.dates?.repoUpdatedAt
  const seen = typeof rec.updatedAt === 'string' ? rec.updatedAt : ''
  return Boolean(current && seen && current > seen)
}

/** 依赖 spec 能否解析出仓库身份（owner/repo 形态才算）。 */
function isRepoLike(value: string): boolean {
  return /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(value)
}

/**
 * 提 Issue 的仓库身份解析：失败目标可能是 owner/repo 也可能是 npm 包名（含 @scope/pkg、
 * 可带 @version，如 dsh-plugin、@scope/pkg@1.2.3）。
 *  - 目标本身就能解析出 owner/repo → 直接用；
 *  - npm 包名 → 反查仓库身份：先查已安装表（该包名的条目若带仓库身份即命中），再查目录插件
 *    （source.npmPackage 与包名一致，取目录收录的仓库身份）。
 * 反查到才返回，查不到返回 null —— 调用方据此不显示「一键提 Issue」按钮，避免把 Issue
 * 提到错误的地址（别人发的 npm 包名不是 GitHub 仓库，直接拼 github.com/<包名> 是打不开的）。
 */
export function issueRepoOf(
  target: string,
  installedItems: InstalledItem[],
  plugins: HubPlugin[] | null,
): string | null {
  const input = target.trim()
  if (!input) return null
  const parsed = repoFromInstallTarget(input)
  if (isRepoLike(parsed)) return parsed
  const pkg = parsed.replace(/@[^@]*$/, '').toLowerCase()
  // 已安装表：包名命中的条目（目录收录条目直接带仓库身份；自定义安装按 github: spec 解析）
  for (const item of installedItems) {
    if (item.name.toLowerCase() !== pkg) continue
    if (item.repo) return item.repo
    const repo = repoFromInstallTarget(item.spec)
    if (isRepoLike(repo)) return repo
  }
  // 目录插件：npmPackage 与包名一致 → 用目录收录的仓库身份
  for (const p of plugins ?? []) {
    const pkgName = (p.source?.npmPackage ?? '').trim()
    if (pkgName !== '' && pkgName.toLowerCase() === pkg && p.source?.repo) return p.source.repo
  }
  return null
}

/** 已安装项 → 弹窗可用的伪插件对象：卸载确认弹窗只读名称/来源行，
 *  自定义安装（目录外）没有完整目录数据，用它把 InstalledItem 适配成 HubPlugin。 */
export function pluginOfItem(item: InstalledItem): HubPlugin {
  return {
    slug: item.name,
    displayName: item.plugin?.displayName ?? item.name,
    source: item.repo ? { repo: item.repo } : undefined,
    description: item.plugin?.description,
  }
}

/**
 * Hub 自身（本插件 dsh-plugin）的识别：三维互证，杜绝误伤同名第三方包。
 *  1) 依赖 key 固定为 `dsh-plugin`（本插件 npm 包名）；
 *  2) spec 为 `file:`/`link:` 本地链接（hub 以 file: 安装进宿主）；
 *  3) 或 spec 解析出的仓库身份就是自营仓库 `dshplugin/dsh-plugin-hub`。
 * 命中即视为宿主内置本体：永不出现在「自定义安装」里，卸载接口也早已对
 * 它 400 拒绝（服务端多维防线之一）——显示出来只会让用户误点卸载。
 */
function isHubSelf(name: string, spec: string): boolean {
  if (name !== 'dsh-plugin') return false
  if (spec.startsWith('file:') || spec.startsWith('link:')) return true
  const repo = repoFromInstallTarget(spec)
  if (isRepoLike(repo) && repo.toLowerCase() === HUB_REPO.toLowerCase()) return true
  // npm 覆盖重装 hub 自身后，file:/link: 本地链接会被替换成 registry 版本号/范围
  // （如 1.3.0、^1.3.0）——依赖 key `dsh-plugin` 在 npm 上唯一属于本插件（不存在第三方
  // 同名包），版本号形态与仓库身份同样视为 hub 自身：命令窗口「自己装自己」成功后，
  // 条目仍不进已安装列表（卸载接口对它的 400 拒绝是服务端最后一道防线）。
  return !isRepoLike(repo)
}

/**
 * 构建已安装项列表：目录插件按命中关系合并（拥有完整元数据），
 * 剩余未认领的依赖 key 归为自定义安装（目录外，仅运行时信息）。
 */
export function installedItemsOf(
  plugins: HubPlugin[] | null,
  installed: Record<string, string>,
  versions: Record<string, InstalledVersionSignal>,
  paths: Record<string, string> | null,
  loadedNames: string[] | null,
  dshCapableNames: string[] | null,
): InstalledItem[] {
  const items: InstalledItem[] = []
  // 已被目录条目认领的依赖 key：同一依赖只归属一个目录条目（React key 必须唯一，
  // 否则同名双条目排序一变化就渲染出幽灵行）；剩余未认领的归自定义安装。
  const claimed = new Set<string>()
  // 目录匹配：遍历目录插件，命中 installedNameOf 即视为已安装并合并元数据
  for (const p of plugins ?? []) {
    const name = installedNameOf(p, installed, versions)
    if (name === null || claimed.has(name)) continue
    claimed.add(name)
    const repo = p.source?.repo ?? null
    const rec = signalOf(repo, versions)
    items.push({
      name,
      spec: installed[name],
      plugin: p,
      repo,
      installPath: paths?.[name] ?? null,
      installedVersion: rec?.version || null,
      installedAt: rec?.installedAt ?? null,
      catalogVersion: p.version ?? null,
      hasUpdate: hasUpdateOf(p, installed, versions),
      pendingUntil: null,
      loaded: loadedNames?.includes(name) ?? false,
      dshCapable: dshCapableNames?.includes(name) ?? false,
    })
  }
  // 自定义安装：依赖表里没被任何目录插件认领的条目（命令行安装的目录外插件）
  for (const [name, spec] of Object.entries(installed)) {
    if (claimed.has(name)) continue
    // Hub 自身（本插件 dsh-plugin）由宿主内置加载，不是可管理的插件：永不进已安装列表，
    // 避免出现在「自定义安装」里被误点卸载（服务端卸载接口对它的 400 拒绝是最后一道防线）
    if (isHubSelf(name, spec)) continue
    const parsed = repoFromInstallTarget(spec)
    const repo = isRepoLike(parsed) ? parsed : null
    const rec = signalOf(repo, versions)
    items.push({
      name,
      spec,
      plugin: null,
      repo,
      installPath: paths?.[name] ?? null,
      installedVersion: rec?.version || null,
      installedAt: rec?.installedAt ?? null,
      catalogVersion: null,
      // 目录外没有目录信号可比，无法判断是否有更新
      hasUpdate: false,
      pendingUntil: null,
      loaded: loadedNames?.includes(name) ?? false,
      dshCapable: dshCapableNames?.includes(name) ?? false,
    })
  }
  return items
}
