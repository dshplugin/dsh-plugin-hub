/**
 * Catalog data + view state for the Plugin Hub section.
 *
 * Owns the online-data pipeline (live fetch from dsh-plugin.org), the local
 * installed-plugin table, and the filter/search/sort/install-status view
 * state, exposing the derived visible list and per-category counts.
 */
import { useEffect, useMemo, useState } from 'react'
import type { HubPlugin, LocaleId } from '../types.ts'
import { normalize } from '../lib/catalog.ts'
import type { SortKey } from '../lib/catalog.ts'

const PLUGINS_URL = (lang: LocaleId) => `https://dsh-plugin.org/api/plugins.${lang}.json`
const STATS_URL = 'https://dsh-plugin.org/api/stats.json'

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
  /** 安装时记录的目录信号：repo(小写) -> { version, updatedAt }（来自宿主本地路由） */
  const [versions, setVersions] = useState<Record<string, { version: string; updatedAt: string }>>({})

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
    fetchData(PLUGINS_URL(lang)).then((data) => {
      if (cancelled) return
      const list = (Array.isArray(data) ? data : []).map((item) => normalize(item as Record<string, unknown>))
      setPlugins(list.filter((p) => p.compatibility?.status === 'verified'))
    }).catch(() => {
      if (!cancelled) setFailed(true)
    })
    fetchData(STATS_URL).then((s) => {
      const stats = s as { total?: number; verified?: number }
      if (!cancelled && stats && typeof stats.total === 'number' && typeof stats.verified === 'number') {
        setStats({ total: stats.total, verified: stats.verified })
      }
    }).catch(() => {})
    return () => { cancelled = true }
  }, [reloadKey])

  /** 刷新当前 profile 已安装插件表；宿主未挂本地路由时静默降级为空表。 */
  const refreshInstalled = async () => {
    try {
      const res = await fetch('/dsh-plugin-hub/installed', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json() as { installed?: Record<string, string>; versions?: Record<string, { version: string; updatedAt: string }> }
      setInstalled(data.installed ?? {})
      setVersions(data.versions ?? {})
    } catch {
      // host without the plugin's server routes — keep the empty table
    }
  }

  // 首次进入拉取已安装表（依赖宿主 webServer 服务）
  useEffect(() => { refreshInstalled() }, [])

  /** 插件是否已安装：匹配 installed spec 中的 `github:<owner>/<repo>`；命中返回 npm 包名。 */
  const installedName = (p: HubPlugin): string | null => {
    const repo = p.source?.repo
    if (!repo) return null
    const needle = `github:${repo.toLowerCase()}`
    for (const [name, spec] of Object.entries(installed)) {
      if (spec.toLowerCase().includes(needle)) return name
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
