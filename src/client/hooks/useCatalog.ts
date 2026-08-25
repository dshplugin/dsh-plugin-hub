/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Catalog data + view state for the Plugin Hub section.
 *
 * Owns the online-data pipeline (live fetch from api.dsh-plugin.org), the local
 * installed-plugin table, and the filter/search/sort/install-status view
 * state, exposing the derived visible list and per-category counts.
 */
import { useEffect, useMemo, useState } from 'react'
import type { HubPlugin, LocaleId } from '../types.ts'
import { HUB_REPO, PLUGIN_VERSION } from '../logic/constants.ts'
import type { HubAboutInfo, HubUpdateInfo } from '../types.ts'
import type { SortKey } from '../logic/constants.ts'
import { fetchCatalog, fetchStats } from '../data/catalog.ts'
import { fetchHubAbout, fetchHubUpdate } from '../data/hub.ts'
import { fetchInstalled } from '../data/host.ts'
import {
  hasUpdateOf, installedItemsOf, installedNameOf, installedVersionOf,
} from '../logic/installed.ts'
import type { InstalledItem, InstalledVersionSignal } from '../logic/installed.ts'

/** 插件市场自身仓库：DSH-Plugin Hub 不显示在目录里（自己不进自己的插件列表） */
const SELF_REPO = 'dshplugin/dsh-plugin-hub'

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

  /** 点击排序按钮：同一按钮切换正/倒序，新按钮用默认方向 */
  function toggleSort(key: SortKey) {
    if (key === sort) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSort(key); setSortDir(SORT_DEFAULT_DIR[key]) }
  }
  /** 当前 profile 已安装插件：npm 包名 -> manifest spec（来自宿主本地路由） */
  const [installed, setInstalled] = useState<Record<string, string>>({})
  /** 安装时记录的目录信号：repo(小写) -> { version, updatedAt }（来自宿主本地路由）；
   *  npmPackage 为 npm 优先通道反查命中的包名映射（目录数据未下发时客户端靠它把依赖 key 匹配回仓库） */
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
    setPlugins(null)
    setHubPlugin(null)
    setStats(null)
    setFailed(false)
    // 目录数据直拉：hub 自身版本由独立 Worker 版本控制中心管理，不再依赖主站版本号接口；
    // 数据接口 CDN 缓存 1 小时，发布新数据后最长 1 小时全网生效。
    const load = () => Promise.all([fetchCatalog(lang), fetchStats()])
    load()
      .then(([list, stats]) => {
        if (cancelled) return
        // 插件市场不显示自己：DSH-Plugin Hub 从目录里排除自身条目，
        // 防止「自己出现在自己的插件列表里、还能自己安装自己」；统计计数同步减 1 保持与列表一致。
        // 主站数据已同步排除自身，此处为 CDN 缓存期的兜底。
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
        if (!cancelled) setFailed(true)
      })
    return () => { cancelled = true }
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
  // 所有已装用户立即看到「可更新」+ Markdown 变更记录，不再依赖主站目录数据管道。
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

  /** 插件是否已安装：匹配 Git spec 中的 owner/repo，或 npm 通道安装的依赖包名；命中返回 npm 包名。 */
  const installedName = (p: HubPlugin): string | null => installedNameOf(p, installed, versions)

  /** 该插件安装时记录的目录版本（无记录/未安装 → null）。 */
  const installedVersion = (p: HubPlugin): string | null => installedVersionOf(p, versions)

  /**
   * 是否有更新：仅对已安装插件有意义。
   * 双信号判定——有 release 版本的比版本；无版本（repo 不打 tag）的比仓库最近更新时间
   * （repoUpdatedAt，ISO 字符串字典序 = 时间序），更新时间变新说明有新提交。
   */
  const hasUpdate = (p: HubPlugin): boolean => hasUpdateOf(p, installed, versions)

  /** 已安装项统一列表（目录元数据 + 运行时信息合并）：驱动「已安装」tab。 */
  const installedItems = useMemo<InstalledItem[]>(
    () => installedItemsOf(plugins, installed, versions, installPaths, loadedNames, dshCapableNames),
    [plugins, installed, versions, installPaths, loadedNames, dshCapableNames],
  )

  /**
   * Hub 自身是否有可用更新：Hub 就是当前运行的应用（始终已安装，无需 installedName 命中）。
   * 以 Worker 版本控制中心返回的「最新版本」为准，与当前运行的版本号比对——
   * 构建时注入的 PLUGIN_VERSION 是运行 bundle 的真实版本；测试/异常场景缺失时
   * 回退到安装时记录的版本。版本号不等即新版（版本号只在发版时变更，绝无降级场景）。
   */
  const hubHasUpdate = (() => {
    if (!hubUpdateInfo) return false
    const current = PLUGIN_VERSION || versions[HUB_REPO]?.version || null
    return current !== null && hubUpdateInfo.version !== current
  })()

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

  /** Per-category plugin counts shown on the category chips. */
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
    reload: () => setReloadKey((k) => k + 1),
    installed,
    installedItems,
    installedName,
    installedVersion,
    hasUpdate,
    hubHasUpdate,
    hubUpdateInfo,
    hubAboutInfo,
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
