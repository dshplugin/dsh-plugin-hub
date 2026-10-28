/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 插件中心的数据 + 视图状态。
 *
 * 掌管在线数据管道（从 api.dsh-plugin.org 实时拉取）、本地已装插件表，以及
 * 筛选/搜索/排序/安装状态等视图状态，对外暴露派生出的可见列表与各分类计数。
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import type { HubPlugin, LocaleId } from '../types.ts'
import { HUB_REPO, PLUGIN_VERSION } from '../logic/constants.ts'
import type { HubAboutInfo, HubUpdateInfo, HubUpdateState } from '../types.ts'
import type { SortKey } from '../logic/constants.ts'
import { fetchCatalog, fetchStats } from '../data/catalog.ts'
import { fetchHubAbout, fetchHubUpdate } from '../data/hub.ts'
import { fetchInstalled, fetchNpmReleaseAge, type NpmReleaseInfo } from '../data/host.ts'
import { isReleaseTooFresh, pickHubUpdate, updateDecision } from '../logic/release-age.ts'
import {
  hasUpdateOf, installedItemsOf, installedNameOf, installedVersionOf, npmPackageOf,
} from '../logic/installed.ts'
import type { InstalledItem, InstalledVersionSignal } from '../logic/installed.ts'

/** 插件市场自身仓库：DSH Plugin Hub 不显示在目录里（自己不进自己的插件列表） */
const SELF_REPO = 'dshplugin/dsh-plugin-hub'

/** 共享的空发布信息表：无候选包时复用，避免每次渲染新建对象。 */
const EMPTY_RELEASES: Record<string, NpmReleaseInfo | null> = {}

/** 市场各排序的默认方向：全部按倒序（Star/Fork 多、更新/收录近的在前） */
const SORT_DEFAULT_DIR: Record<SortKey, 'asc' | 'desc'> = {
  sortStars: 'desc', sortForks: 'desc', sortUpdated: 'desc', sortNewest: 'desc',
}

export function useCatalog(lang: LocaleId) {
  /** 目录插件（仅保留人工验证通过的条目） */
  const [plugins, setPlugins] = useState<HubPlugin[] | null>(null)
  /** Hub 自身目录条目（dshplugin/dsh-plugin-hub）：目录过滤会排除自身（不进插件列表），
   *  此处单独保留，供头部「可更新」徽标 → 「直接更新」覆盖重装使用。 */
  const [hubPlugin, setHubPlugin] = useState<HubPlugin | null>(null)
  /** 收录/精选统计（官网 /api/stats.json 实时拉取） */
  const [stats, setStats] = useState<{ total: number; verified: number } | null>(null)
  const [failed, setFailed] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('sortStars')
  /** 当前排序方向：点同一个排序按钮切换 正序/倒序；点新排序用该排序的默认方向（与已安装视图一致） */
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  /** 目录加载「超时自动强制刷新」重试计数：宿主重启/代理未就绪时请求可能长时间挂起，
   *  界面停在「正在加载插件数据…」假死 —— 超时自动重拉，最多自动重试 2 次后转失败态；
   *  用户手动刷新（reload）时清零重新计数。 */
  const loadRetriesRef = useRef(0)
  /** 目录加载超时阈值：超过即判定挂起，强制刷新一次（服务端代理 curl 上限 60s，客户端 30s 先兜底） */
  const LOAD_TIMEOUT_MS = 30000
  /** 挂起后最多自动重试次数：避免代理持续不通时无限循环刷新（每次重试仍 30s，2 次后转失败界面可手动重试） */
  const MAX_LOAD_RETRIES = 2
  /** 本次 reload 是否强制回源（跳过服务端 1 小时缓存）：由「强制刷新」置位，读取后立即复位 */
  const forceRefreshRef = useRef(false)

  /** 点击排序按钮：同一按钮切换正/倒序，新按钮用默认方向 */
  function toggleSort(key: SortKey) {
    if (key === sort) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSort(key); setSortDir(SORT_DEFAULT_DIR[key]) }
  }
  /**
   * 强制刷新 Hub 版本与「关注我们」信息：点击头部版本号/徽标时触发。
   * 挂载期的 useEffect 只在进入/reload 时拉一次，发版后已打开的界面点版本号
   * 仍显示旧数据；此处重新拉接口中心，最新版本与变更记录点击即见。
   * 失败静默为 null（弹窗兜底展示当前版本号），与挂载期拉取口径一致。
   */
  const refreshHub = async () => {
    // 版本接口已恒带时间戳绕过 CDN，手动/自动拉取都能拿到最新公告
    const [info, about] = await Promise.all([fetchHubUpdate(), fetchHubAbout()])
    setHubUpdateInfo(info)
    setHubAboutInfo(about)
  }

  /** 当前 profile 已安装插件：npm 包名 -> manifest spec（来自宿主本地路由） */
  const [installed, setInstalled] = useState<Record<string, string>>({})
  /** 安装时记录的目录信号：repo(小写) -> { version, updatedAt }（来自宿主本地路由）；
   *  npmPackage 为安装时记录的包名映射（目录数据未下发时客户端靠它把依赖 key 匹配回仓库） */
  const [versions, setVersions] = useState<Record<string, InstalledVersionSignal>>({})
  /** 每个依赖在系统上的安装目录（profile/node_modules/<包名>），详情视图展示用 */
  const [installPaths, setInstallPaths] = useState<Record<string, string> | null>(null)
  /** 已加载进运行中 loader 的包名（官方 ctx.loader 对账）：装完未重启的新插件不在其中 */
  const [loadedNames, setLoadedNames] = useState<string[] | null>(null)
  /** 真正的 dsh 插件包名（包内声明 dsh 配置 / 在 profile bundles 清单）：非 dsh 插件不提示「待重启」 */
  const [dshCapableNames, setDshCapableNames] = useState<string[] | null>(null)
  /** Hub 自我更新信息：来自接口中心 Pages（api.dsh-plugin.org），与目录数据解耦 */
  const [hubUpdateInfo, setHubUpdateInfo] = useState<HubUpdateInfo | null>(null)
  /** 头部「关注我们」弹窗内容（平台介绍 + 反馈群二维码）：来自接口中心 /about，Markdown 推送非写死 */
  const [hubAboutInfo, setHubAboutInfo] = useState<HubAboutInfo | null>(null)

  // 拉取目录 + 统计。在线 API 已只返回 verified；再过滤一次，保证只展示人工验证通过的插件。
  useEffect(() => {
    let cancelled = false
    // 本次加载是否已收尾（成功或失败）：超时定时器只对「还在加载中」生效
    let settled = false
    // 中止控制器：请求挂起时（宿主重启/代理抖动）超时自动重试会换新请求，
    // 旧请求在此中止释放连接，避免挂起堆积
    const controller = new AbortController()
    const refresh = forceRefreshRef.current
    forceRefreshRef.current = false
    setPlugins(null)
    setHubPlugin(null)
    setStats(null)
    setFailed(false)
    // 此处只拉目录与统计；hub 自身版本由独立 Worker 版本控制中心提供（见 fetchHubUpdate）。
    const load = () => Promise.all([fetchCatalog(lang, controller.signal, refresh), fetchStats(controller.signal, refresh)])
    load()
      .then(([list, stats]) => {
        if (cancelled) return
        settled = true
        // 插件市场不显示自己：DSH Plugin Hub 从目录里排除自身条目，
        // 防止「自己出现在自己的插件列表里、还能自己安装自己」；统计计数同步减 1 保持与列表一致。
        // 目录数据已排除自身，此处再兜底过滤一次，防旧快照仍含自身条目。
        const hadSelf = list.some((p) => p.source?.repo === SELF_REPO)
        // 过滤前单独保留 hub 自身条目：它不进目录列表，但「可更新」徽标的直接更新需要它作为重装目标
        setHubPlugin(list.find((p) => p.source?.repo === SELF_REPO) ?? null)
        setPlugins(list.filter((p) => p.compatibility?.status === 'verified' && p.source?.repo !== SELF_REPO))
        if (stats) {
          setStats(hadSelf
            ? { total: stats.total - 1, verified: stats.verified - 1 }
            : { total: stats.total, verified: stats.verified })
        }
      })
      .catch(() => {
        if (cancelled) return
        settled = true
        setFailed(true)
      })
    // 加载超时兜底：宿主刚重启/代理未就绪时目录请求可能长时间挂起，界面停在「正在加载插件数据…」
    // 像假死。超过阈值未收尾 → 强制刷新列表（重拉一次，最多 MAX_LOAD_RETRIES 次自动重试），
    // 重试仍失败 → 转失败界面（显示「重试」按钮，手动刷新时计数清零重新开始）。
    const timer = window.setTimeout(() => {
      if (cancelled || settled) return
      if (loadRetriesRef.current < MAX_LOAD_RETRIES) {
        loadRetriesRef.current += 1
        setReloadKey((k) => k + 1)
      } else {
        setFailed(true)
      }
    }, LOAD_TIMEOUT_MS)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      controller.abort()
    }
    // lang 必须进依赖：切换界面语言要重新拉对应语言的数据文件，
    // 否则英文模式仍停留在 plugins.zh.json，描述/名称全是中文
  }, [reloadKey, lang])

  /** 刷新当前 profile 已安装插件表；宿主未挂本地路由时静默降级为空表。 */
  const refreshInstalled = async () => {
    const data = await fetchInstalled()
    if (data === null) return
    setInstalled(data.installed)
    setVersions(data.versions)
    setInstallPaths(data.paths)
    setLoadedNames(data.loaded)
    setDshCapableNames(data.dshCapable)
  }

  // 首次进入拉取已安装表（依赖宿主 webServer 服务）
  useEffect(() => { refreshInstalled() }, [])

  // Hub 自身版本检查走独立 Worker（版本控制中心）：发新版后写一次 Worker KV，
  // 所有已装用户立即看到「可更新」+ Markdown 变更记录，不经过主站目录数据管道。
  // 失败静默降级为 null（徽标不出现，不影响目录本身加载）。
  useEffect(() => {
    let cancelled = false
    void fetchHubUpdate().then((info) => { if (!cancelled) setHubUpdateInfo(info) })
    return () => { cancelled = true }
  }, [reloadKey])

  // 「关注我们」内容走同一套 Worker：作者写好 Markdown（平台介绍 + 反馈群二维码）推送 /admin/about，
  // 客户端下次进入拉 /about 即可看到最新，非写死。失败静默为 null（弹窗展示兜底文案，不阻塞）。
  useEffect(() => {
    let cancelled = false
    void fetchHubAbout().then((info) => { if (!cancelled) setHubAboutInfo(info) })
    return () => { cancelled = true }
  }, [reloadKey])

  /** 插件是否已安装：匹配 Git spec 中的 owner/repo，或 npm 安装的依赖包名；命中返回 npm 包名。 */
  const installedName = (p: HubPlugin): string | null => installedNameOf(p, installed, versions)

  /** 该插件安装时记录的目录版本（无记录/未安装 → null）。 */
  const installedVersion = (p: HubPlugin): string | null => installedVersionOf(p, versions)

  /**
   * 更新可用性校验状态：npm registry 上每个包的最新可安装版本与发布时间。
   * key 是这批候选包名的指纹，与已查出的 key 一致才算就绪，避免查询未回来时先显示更新。
   */
  const [releaseAge, setReleaseAge] = useState<{ key: string; releases: Record<string, NpmReleaseInfo | null> }>({ key: '', releases: EMPTY_RELEASES })

  /** 已安装项原始列表（未套校验）：先算出来才能收集需要查发布信息的候选包名。 */
  const rawInstalledItems = useMemo<InstalledItem[]>(
    () => installedItemsOf(plugins, installed, versions, installPaths, loadedNames, dshCapableNames),
    [plugins, installed, versions, installPaths, loadedNames, dshCapableNames],
  )

  /** 校验候选：有更新、且有 npm 包名（更新走 npm registry）的已安装插件包名。 */
  const releaseAgeCandidates = useMemo(() => {
    const names = new Set<string>()
    for (const item of rawInstalledItems) {
      if (!item.hasUpdate || !item.plugin) continue
      const pkg = npmPackageOf(item.plugin, versions)
      if (pkg !== null) names.add(pkg)
    }
    return [...names].sort()
  }, [rawInstalledItems, versions])
  const releaseAgeKey = releaseAgeCandidates.join('\n')
  /** 包名 → 已装版本：判断 npm 上最新版是否真的比已装版本新。 */
  const installedByPackage = useMemo(() => {
    const map = new Map<string, string>()
    for (const item of rawInstalledItems) {
      if (!item.plugin) continue
      const pkg = npmPackageOf(item.plugin, versions)
      const version = installedVersionOf(item.plugin, versions)
      if (pkg !== null && version !== null) map.set(pkg, version)
    }
    return map
  }, [rawInstalledItems, versions])

  useEffect(() => {
    if (releaseAgeKey === releaseAge.key) return
    if (releaseAgeCandidates.length === 0) {
      setReleaseAge({ key: '', releases: EMPTY_RELEASES })
      return
    }
    let cancelled = false
    // 批量一次查询；失败/返回 null 时按原逻辑照常提示，网络问题不吃掉真实更新
    void fetchNpmReleaseAge(releaseAgeCandidates).then((result) => {
      if (cancelled) return
      setReleaseAge({ key: releaseAgeKey, releases: result ?? EMPTY_RELEASES })
    })
    return () => { cancelled = true }
  }, [releaseAgeKey, releaseAge.key])

  /** 校验结果是否已就绪（候选为空也算就绪）：未就绪时不写更新提醒，等查询回来再定。 */
  const releaseAgeReady = releaseAgeKey === releaseAge.key

  /**
   * 不能提示更新的包：
   *  - npm 上最新版还没过供应链门禁（发布不满 24h，pnpm 会静默回退，点了也装不上）；
   *  - npm 上最新版并不高于已装版本 —— 更新走的是 `pkg@latest`，此时无论目录标到哪个 tag，
   *    都不可能装上（作者可能只打了 GitHub release 没发 npm），提示只会变成永远点不掉的循环。
   */
  const updateDecisions = useMemo(() => {
    const map = new Map<string, { offered: boolean; pendingUntil: number | null }>()
    if (!releaseAgeReady) return map
    const now = Date.now()
    for (const pkg of releaseAgeCandidates) {
      map.set(pkg, updateDecision(releaseAge.releases[pkg] ?? null, installedByPackage.get(pkg) ?? null, now))
    }
    return map
  }, [releaseAgeReady, releaseAgeCandidates, releaseAge.releases, installedByPackage])

  const updateBlocked = useMemo(() => {
    const blocked = new Set<string>()
    for (const [pkg, decision] of updateDecisions) {
      if (!decision.offered) blocked.add(pkg)
    }
    return blocked
  }, [updateDecisions])

  /**
   * 是否有更新：仅对已安装插件有意义。
   * 双信号判定——有 release 版本的比版本；无版本（repo 不打 tag）的比仓库最近更新时间
   * （repoUpdatedAt，ISO 字符串字典序 = 时间序），更新时间变新说明有新提交。
   * 再用 npm registry 的实际最新版本复核：装不上的（太新 / 不比已装新）不打更新标记。
   */
  const hasUpdate = (p: HubPlugin): boolean => {
    if (!hasUpdateOf(p, installed, versions)) return false
    const pkg = npmPackageOf(p, versions)
    if (pkg === null) return true
    // 复核没回来时先不亮：否则会出现「先亮有更新、几秒后又撤掉」
    return releaseAgeReady && !updateBlocked.has(pkg)
  }

  /** 更新被门禁暂缓时的可重试时刻（毫秒）；未安装/无更新/非门禁原因 → null。 */
  const updatePendingUntil = (p: HubPlugin): number | null => {
    if (!hasUpdateOf(p, installed, versions)) return null
    const pkg = npmPackageOf(p, versions)
    if (pkg === null) return null
    return updateDecisions.get(pkg)?.pendingUntil ?? null
  }

  /** 已安装项统一列表（目录元数据 + 运行时信息合并）：校验未就绪/被拦下的去掉更新标记、
   *  门禁暂缓的带上可重试时刻，驱动「已安装」tab。 */
  const installedItems = useMemo<InstalledItem[]>(() => {
    return rawInstalledItems.map((item) => {
      if (!item.hasUpdate || !item.plugin) return item
      const pkg = npmPackageOf(item.plugin, versions)
      if (pkg === null) return item
      if (!releaseAgeReady) return { ...item, hasUpdate: false }
      const decision = updateDecisions.get(pkg)
      return decision === undefined || decision.offered
        ? item
        : { ...item, hasUpdate: false, pendingUntil: decision.pendingUntil }
    })
  }, [rawInstalledItems, releaseAgeReady, updateDecisions, versions])

  /**
   * Hub 自身更新状态：Hub 就是当前运行的应用（始终已安装，无需 installedName 命中）。
   * 以 Worker 版本控制中心返回的「最新版本」为准，与当前运行的版本号比对——
   * 构建时注入的 PLUGIN_VERSION 是运行 bundle 的真实版本；测试/异常场景缺失时
   * 回退到安装时记录的版本。版本号不等即新版（版本号只在发版时变更，绝无降级场景）。
   *
   * 另加 pnpm 供应链安全门槛：新版本发布还不满 24 小时（+30 分钟缓冲）时，pnpm 会静默
   * 回退到旧版本，此时若提示「可更新」用户点了也更新不到。publishedAt 由接口中心按 npm
   * registry 真实发布时间下发（同源），据此判断最准。门槛命中要单列成 `pending` 而不是
   * 落回「无更新」——回落会让弹窗在本机版本落后时谎称「已是最新」。
   */
  const hubCurrentVersion = PLUGIN_VERSION || versions[HUB_REPO]?.version || ''
  // 候选含 recentVersions：最新版还在门禁内时回退到「更早、但已过门禁」的版本，
  // 避免连续快速发版把所有提示窗口都吞掉（见 pickHubUpdate）。
  const hubUpdateResult = hubUpdateInfo === null
    ? { state: 'none' as HubUpdateState, target: null }
    : pickHubUpdate(hubUpdateInfo, hubCurrentVersion, Date.now())
  const hubUpdateState: HubUpdateState = hubUpdateResult.state
  /** 本次提示的目标版本（available 时有值；pending 时是暂缓中的最高版本） */
  const hubUpdateTarget = hubUpdateResult.target
  const hubHasUpdate = hubUpdateState === 'available'

  /** 当前分类下的插件（「全部」时为整个目录）。 */
  const categoryPlugins = useMemo(() => {
    if (!plugins) return []
    if (category === 'all') return plugins
    return plugins.filter((p) => p.category === category)
  }, [plugins, category])

  const visible = useMemo(() => {
    if (!plugins) return []
    const q = query.trim().toLowerCase()
    const list = plugins.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (!q) return true
      return (
        (p.displayName ?? '').toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q) ||
        (p.topics ?? []).some((topic) => topic.toLowerCase().includes(q))
      )
    })
    const dir = sortDir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      // 比较器统一用「升序写法」再乘 dir：desc 时 dir=-1 翻成降序（Star/Fork 最多、更新/收录最近在前）
      if (sort === 'sortStars') return ((a.stats?.stargazers_count ?? 0) - (b.stats?.stargazers_count ?? 0)) * dir
      if (sort === 'sortForks') return ((a.stats?.forks_count ?? 0) - (b.stats?.forks_count ?? 0)) * dir
      if (sort === 'sortNewest') return (a.dates?.addedAt ?? '').localeCompare(b.dates?.addedAt ?? '') * dir
      return (a.dates?.repoUpdatedAt ?? '').localeCompare(b.dates?.repoUpdatedAt ?? '') * dir
    })
  }, [plugins, category, query, sort, sortDir, installed])

  /** 分类 chip 上展示的各分类插件计数。 */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of plugins ?? []) {
      if (p.category) counts[p.category] = (counts[p.category] ?? 0) + 1
    }
    return counts
  }, [plugins])

  return {
    plugins,
    hubPlugin,
    stats,
    failed,
    reload: () => { loadRetriesRef.current = 0; setReloadKey((k) => k + 1) },
    /** 强制刷新：跳过服务端 1 小时缓存直接回源，成功后覆盖缓存（失败仍回退旧缓存） */
    forceReload: () => { loadRetriesRef.current = 0; forceRefreshRef.current = true; setReloadKey((k) => k + 1) },
    installed,
    installedItems,
    installedName,
    installedVersion,
    hasUpdate,
    updatePendingUntil,
    hubHasUpdate,
    hubUpdateState,
    hubUpdateTarget,
    releaseAgeReady,
    hubCurrentVersion,
    hubUpdateInfo,
    hubAboutInfo,
    refreshHub,
    refreshInstalled,
    category,
    setCategory,
    query,
    setQuery,
    sort,
    sortDir,
    toggleSort,
    visible,
    total: plugins?.length ?? 0,
    categoryCounts,
  }
}
