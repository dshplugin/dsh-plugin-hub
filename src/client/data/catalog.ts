/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 目录数据仓库：从在线 API 拉取插件目录与收录统计并做归一化。
 * 组件不接触 URL 与 fetch —— 这里是唯一知道数据所在地的地方。
 */
import type { HubPlugin, LocaleId } from '../types.ts'
import { normalize } from '../logic/normalize.ts'

// 目录/统计数据经服务端 /catalog 代理路由获取（curl 子进程注入设置里的代理），
// 与 npm / git 安装通道同一代理规则 —— 浏览器不直连 api.dsh-plugin.org。
const PROXY_BASE = '/dsh-plugin-hub/catalog'
// refresh=1：跳过服务端 1 小时缓存直接回源（失败仍回退旧缓存），供「强制刷新」使用
const PLUGINS_URL = (lang: LocaleId, refresh: boolean) => `${PROXY_BASE}?lang=${lang}${refresh ? '&refresh=1' : ''}`
const STATS_URL = (refresh: boolean) => `${PROXY_BASE}?stats=1${refresh ? '&refresh=1' : ''}`

async function fetchJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const res = await fetch(url, { cache: 'no-store', signal })
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}

/** 目录插件列表（在线 API 已只返回 verified；过滤与排序由上层负责）。
 *  signal 可选：宿主重启/代理抖动导致请求挂起时，上层可中止旧请求释放连接。
 *  refresh=true 跳过服务端缓存，强制回源。 */
export async function fetchCatalog(lang: LocaleId, signal?: AbortSignal, refresh = false): Promise<HubPlugin[]> {
  const data = await fetchJson(PLUGINS_URL(lang, refresh), signal)
  return (Array.isArray(data) ? data : []).map((item) => normalize(item as Record<string, unknown>))
}

/** 收录/精选统计（/api/stats.json）；字段不完整返回 null。 */
export async function fetchStats(signal?: AbortSignal, refresh = false): Promise<{ total: number; verified: number } | null> {
  const s = await fetchJson(STATS_URL(refresh), signal) as { total?: number; verified?: number }
  if (s && typeof s.total === 'number' && typeof s.verified === 'number') {
    return { total: s.total, verified: s.verified }
  }
  return null
}
