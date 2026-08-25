/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Catalog repository: fetches the plugin directory and the collection stats
 * from the online API and normalizes them. Components never see URLs or
 * fetch — the repository is the only place that knows where data lives.
 */
import type { HubPlugin, LocaleId } from '../types.ts'
import { normalize } from '../logic/normalize.ts'

// 目录/统计数据经服务端 /catalog 代理路由获取（curl 子进程注入设置里的代理），
// 与 npm / git 安装通道同一代理口径 —— 浏览器不再直连 api.dsh-plugin.org。
const PROXY_BASE = '/dsh-plugin-hub/catalog'
const PLUGINS_URL = (lang: LocaleId) => `${PROXY_BASE}?lang=${lang}`
const STATS_URL = `${PROXY_BASE}?stats=1`

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
