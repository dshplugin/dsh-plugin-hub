/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Catalog repository: fetches the plugin directory and the collection stats
 * from the online API and normalizes them. Components never see URLs or
 * fetch — the repository is the only place that knows where data lives.
 */
import type { HubPlugin, LocaleId } from '../types.ts'
import { normalize } from '../logic/normalize.ts'

const PLUGINS_URL = (lang: LocaleId) => `https://dsh-plugin.org/api/plugins.${lang}.json`
const STATS_URL = 'https://dsh-plugin.org/api/stats.json'

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}

/** 目录插件列表（在线 API 已只返回 verified；过滤与排序由上层负责）。 */
export async function fetchCatalog(lang: LocaleId): Promise<HubPlugin[]> {
  const data = await fetchJson(PLUGINS_URL(lang))
  return (Array.isArray(data) ? data : []).map((item) => normalize(item as Record<string, unknown>))
}

/** 收录/精选统计（/api/stats.json）；字段不完整返回 null。 */
export async function fetchStats(): Promise<{ total: number; verified: number } | null> {
  const s = await fetchJson(STATS_URL) as { total?: number; verified?: number }
  if (s && typeof s.total === 'number' && typeof s.verified === 'number') {
    return { total: s.total, verified: s.verified }
  }
  return null
}
