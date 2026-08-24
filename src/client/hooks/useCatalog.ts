/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Catalog data + view state for the Plugin Hub section.
 *
 * Owns the online-data pipeline (live fetch from dsh-plugin.org), the local
 * installed-plugin table, and the filter/search/sort/install-status view
 * state, exposing the derived visible list and per-category counts.
 */
import { useEffect, useMemo, useState } from 'react'
import type { HubPlugin, LocaleId } from '../types.ts'
import { HUB_ABOUT_URL, HUB_REPO, HUB_UPDATE_URL, normalize, PLUGIN_VERSION, repoFromInstallTarget } from '../lib/catalog.ts'
import type { HubAboutInfo, HubUpdateInfo } from '../lib/catalog.ts'
import type { SortKey } from '../lib/catalog.ts'

const PLUGINS_URL = (lang: LocaleId) => `https://dsh-plugin.org/api/plugins.${lang}.json`
const STATS_URL = 'https://dsh-plugin.org/api/stats.json'
/** 插件市场自身仓库：DSH-Plugin Hub 不显示在目录里（自己不进自己的插件列表） */
const SELF_REPO = 'dshplugin/dsh-plugin-hub'

export function useCatalog(lang: LocaleId) {
  /** 目录插件（仅保留人工验证通过的条目） */
  const [plugins, setPlugins] = useState<HubPlugin[] | null>(null)
  /** 收录/精选统计（官网 /api/stats.json 实时拉取） */
  const [stats, setStats] = useState<{ total: number; verified: number } | null>(null)
  const [failed, setFailed] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('sortStars')
  /** 列表安装状态筛选：全部 / 已安装 / 未安装（分段按钮，单列表内切换，不引入第二个列表） */
  const [installedFilter, setInstalledFilter] = useState<'all' | 'installed' | 'notInstalled'>('all')
  /** 当前 profile 已安装插件：npm 包名 -> manifest spec（来自宿主本地路由） */
  const [installed, setInstalled] = useState<Record<string, string>>({})
  /** 安装时记录的目录信号：repo(小写) -> { version, updatedAt }（来自宿主本地路由）；
   *  npmPackage 为 npm 优先通道反查命中的包名映射（目录数据未下发时客户端靠它把依赖 key 匹配回仓库） */
  const [versions, setVersions] = useState<Record<string, { version: string; updatedAt: string; npmPackage?: string }>>({})
  /** Hub 自我更新信息：来自 CF Worker 版本控制中心（hub.dsh-plugin.org），与目录数据解耦 */
  const [hubUpdateInfo, setHubUpdateInfo] = useState<HubUpdateInfo | null>(null)
  /** 头部「关注我们」弹窗内容（平台介绍 + 反馈群二维码）：来自同款 Worker /about，Markdown 推送非写死 */
  const [hubAboutInfo, setHubAboutInfo] = useState<HubAboutInfo | null>(null)

  // 拉取目录 + 统计。在线 API 已只返回 verified；再过滤一次，保证只展示人工验证通过的插件。
  useEffect(() => {
    let cancelled = false
    setPlugins(null)
    setStats(null)
    setFailed(false)
    const fetchData = (url: string): Promise<unknown> =>
      fetch(url, { cache: 'no-store' }).then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.json()
      })
    // 目录数据直拉：hub 自身版本由独立 Worker 版本控制中心管理，不再依赖主站版本号接口；
    // 数据接口 CDN 缓存 1 小时，发布新数据后最长 1 小时全网生效。
    const load = () =>
      Promise.all([fetchData(PLUGINS_URL(lang)), fetchData(STATS_URL)])
    load()
      .then(([data, s]) => {
        if (cancelled) return
        const list = (Array.isArray(data) ? data : []).map((item) => normalize(item as Record<string, unknown>))
        // 插件市场不显示自己：DSH-Plugin Hub 从目录里排除自身条目，
        // 防止「自己出现在自己的插件列表里、还能自己安装自己」；统计计数同步减 1 保持与列表一致。
        // 主站数据已同步排除自身，此处为 CDN 缓存期的兜底。
        const hadSelf = list.some((p) => p.source?.repo === SELF_REPO)
        setPlugins(list.filter((p) => p.compatibility?.status === 'verified' && p.source?.repo !== SELF_REPO))
        const stats = s as { total?: number; verified?: number }
        if (stats && typeof stats.total === 'number' && typeof stats.verified === 'number') {
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
    try {
      const res = await fetch('/dsh-plugin-hub/installed', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json() as { installed?: Record<string, string>; versions?: Record<string, { version: string; updatedAt: string; npmPackage?: string }> }
      setInstalled(data.installed ?? {})
      setVersions(data.versions ?? {})
    } catch {
      // host without the plugin's server routes — keep the empty table
    }
  }

  // 首次进入拉取已安装表（依赖宿主 webServer 服务）
  useEffect(() => { refreshInstalled() }, [])

  // Hub 自身版本检查走独立 Worker（版本控制中心）：发新版后写一次 Worker KV，
  // 所有已装用户立即看到「可更新」+ Markdown 变更记录，不再依赖主站目录数据管道。
  // 失败静默降级为 null（徽标不出现，不影响目录本身加载）。
  useEffect(() => {
    let cancelled = false
    fetch(HUB_UPDATE_URL, { cache: 'no-store' })
      .then((res): Promise<HubUpdateInfo | null> => (res.ok ? res.json() : Promise.resolve(null)))
      .then((data) => {
        if (cancelled || !data) { if (!cancelled) setHubUpdateInfo(null); return }
        const version = typeof data.version === 'string' && data.version.length > 0 ? data.version : null
        setHubUpdateInfo(version === null
          ? null
          : { version, publishedAt: data.publishedAt ?? null, notes: data.notes ?? null })
      })
      .catch(() => { if (!cancelled) setHubUpdateInfo(null) })
    return () => { cancelled = true }
  }, [reloadKey])

  // 「关注我们」内容走同一套 Worker：作者写好 Markdown（平台介绍 + 反馈群二维码）推送 /admin/about，
  // 客户端下次进入拉 /about 即可看到最新，非写死。失败静默为 null（弹窗展示兜底文案，不阻塞）。
  useEffect(() => {
    let cancelled = false
    fetch(HUB_ABOUT_URL, { cache: 'no-store' })
      .then((res): Promise<HubAboutInfo | null> => (res.ok ? res.json() : Promise.resolve(null)))
      .then((data) => {
        if (cancelled) return
        if (!data || data.content === null || data.content === undefined) { setHubAboutInfo(null); return }
        const content = typeof data.content === 'string' || typeof data.content === 'object' ? data.content : null
        setHubAboutInfo(content === null
          ? null
          : { content, updatedAt: data.updatedAt ?? null })
      })
      .catch(() => { if (!cancelled) setHubAboutInfo(null) })
    return () => { cancelled = true }
  }, [reloadKey])

  /** 插件是否已安装：匹配 Git spec 中的 owner/repo，或 npm 通道安装的依赖包名；命中返回 npm 包名。 */
  const installedName = (p: HubPlugin): string | null => {
    const repo = p.source?.repo
    if (!repo) return null
    const needle = repo.toLowerCase()
    for (const [name, spec] of Object.entries(installed)) {
      if (repoFromInstallTarget(spec).toLowerCase() === needle) return name
    }
    // npm 通道安装：profile 依赖 key 直接是 npm 包名。包名来源两处——目录数据（npmPackage），
    // 或服务端 npm 优先反查持久化的映射（versions[repo].npmPackage，覆盖组织 scope 与 GitHub
    // 用户名不一致、目录未下发包名的场景）；命中任一并依赖 key 真实存在即视为已安装
    const pkg = ((p.source?.npmPackage || versions[repo.toLowerCase()]?.npmPackage) ?? '').toLowerCase()
    if (pkg) {
      for (const name of Object.keys(installed)) {
        if (name.toLowerCase() === pkg) return name
      }
    }
    return null
  }

  /** 该插件安装时记录的目录版本（无记录/未安装 → null）。 */
  const installedVersion = (p: HubPlugin): string | null => {
    const repo = p.source?.repo
    if (!repo) return null
    return versions[repo.toLowerCase()]?.version ?? null
  }

  /**
   * 是否有更新：仅对已安装插件有意义。
   * 双信号判定——有 release 版本的比版本；无版本（repo 不打 tag）的比仓库最近更新时间
   * （repoUpdatedAt，ISO 字符串字典序 = 时间序），更新时间变新说明有新提交。
   */
  const hasUpdate = (p: HubPlugin): boolean => {
    if (installedName(p) === null) return false
    const repo = p.source?.repo
    if (!repo) return false
    const rec = versions[repo.toLowerCase()]
    if (!rec) return false
    if (p.version) return p.version !== rec.version
    const current = p.dates?.repoUpdatedAt
    return Boolean(current && rec.updatedAt && current > rec.updatedAt)
  }

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

  /** 当前分类下已安装插件数：已安装/未安装按钮上的计数跟随分类，不再用全局口径。 */
  const installedCountInCategory = useMemo(() => {
    return categoryPlugins.reduce((n, p) => n + (installedName(p) !== null ? 1 : 0), 0)
  }, [categoryPlugins, installed])

  /** 当前分类下未安装插件数。 */
  const notInstalledCountInCategory = Math.max(0, categoryPlugins.length - installedCountInCategory)

  // 自动重置：切换分类（或已安装表变化）后，若当前安装状态筛选在新分类下无结果，
  // 自动退回「全部」，避免列表空置死胡同、也避免 0 计数按钮被误触。
  useEffect(() => {
    if (installedFilter === 'all') return
    const count = installedFilter === 'installed'
      ? installedCountInCategory
      : notInstalledCountInCategory
    if (count === 0) setInstalledFilter('all')
  }, [installedFilter, installedCountInCategory, notInstalledCountInCategory])

  const visible = useMemo(() => {
    if (!plugins) return []
    const q = query.trim().toLowerCase()
    const list = plugins.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (installedFilter === 'installed' && installedName(p) === null) return false
      if (installedFilter === 'notInstalled' && installedName(p) !== null) return false
      if (!q) return true
      return (
        (p.displayName ?? '').toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q) ||
        (p.topics ?? []).some((topic) => topic.toLowerCase().includes(q))
      )
    })
    return [...list].sort((a, b) => {
      if (sort === 'sortStars') return (b.stats?.stargazers_count ?? 0) - (a.stats?.stargazers_count ?? 0)
      if (sort === 'sortForks') return (b.stats?.forks_count ?? 0) - (a.stats?.forks_count ?? 0)
      if (sort === 'sortNewest') return (b.dates?.addedAt ?? '').localeCompare(a.dates?.addedAt ?? '')
      return (b.dates?.repoUpdatedAt ?? '').localeCompare(a.dates?.repoUpdatedAt ?? '')
    })
  }, [plugins, category, query, sort, installed, installedFilter])

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
    stats,
    failed,
    reload: () => setReloadKey((k) => k + 1),
    installed,
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
    setSort,
    installedFilter,
    setInstalledFilter,
    visible,
    total: plugins?.length ?? 0,
    installedCountInCategory,
    notInstalledCountInCategory,
    categoryCounts,
  }
}
