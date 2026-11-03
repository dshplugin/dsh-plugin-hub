/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Hub 元数据仓库：自我更新检查与「关注我们」内容背后的 Cloudflare Worker 接口。
 * 失败降级为 null —— 由调用方决定失败时如何显示（不显示徽标、占位文案），绝不抛错。
 */
import type { HubAboutInfo, HubUpdateInfo, HubUpdateVersion } from '../types.ts'
import { HUB_ABOUT_URL, HUB_UPDATE_URL } from '../logic/constants.ts'

/** 版本接口是 Pages 静态文件，默认带 CDN 缓存（Cache-Control: public, max-age=43200，
 *  即 12 小时），客户端 no-store 管不到 CDN 边缘，会拿到旧公告。
 *  静态资产请求免费且无限，因此所有版本检查一律带时间戳 query：URL 每次不同 →
 *  CDN 缓存 key 不同 → 强制回源拉到最新公告，无任何配额顾虑。 */
function busted(url: string): string {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}_t=${Date.now()}`
}

/** 归一化接口下发的 recentVersions：只保留带版本号的条目，其余字段按类型补。
 *  这条数据是「最新版还在 24.5h 冷却期内时回退到更早的已过冷却期版本」的唯一依据；
 *  入口处漏传会让候选只剩最新版，整体变成 pending —— 用户就永远看不到更新入口。 */
function recentVersionsOf(value: unknown): HubUpdateVersion[] {
  if (!Array.isArray(value)) return []
  const list: HubUpdateVersion[] = []
  for (const item of value) {
    if (item === null || typeof item !== 'object') continue
    const entry = item as { version?: unknown; publishedAt?: unknown; notes?: unknown }
    if (typeof entry.version !== 'string' || entry.version === '') continue
    list.push({
      version: entry.version,
      ...(typeof entry.publishedAt === 'string' ? { publishedAt: entry.publishedAt } : {}),
      ...(entry.notes === undefined ? {} : { notes: entry.notes as HubUpdateVersion['notes'] }),
    })
  }
  return list
}

/** 版本控制中心：最新版本 + Markdown 变更记录 + 最近发版（冷却期回退用）；不可用返回 null。 */
export async function fetchHubUpdate(): Promise<HubUpdateInfo | null> {
  try {
    const res = await fetch(busted(HUB_UPDATE_URL), { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json() as HubUpdateInfo | null
    if (!data) return null
    const version = typeof data.version === 'string' && data.version.length > 0 ? data.version : null
    if (version === null) return null
    return {
      version,
      publishedAt: data.publishedAt ?? null,
      notes: data.notes ?? null,
      recentVersions: recentVersionsOf(data.recentVersions),
    }
  } catch {
    return null
  }
}

/** Worker「关注我们」内容（平台介绍 + 反馈群二维码，Markdown）；未推送返回 null。 */
export async function fetchHubAbout(): Promise<HubAboutInfo | null> {
  try {
    const res = await fetch(busted(HUB_ABOUT_URL), { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json() as HubAboutInfo | null
    if (!data || data.content === null || data.content === undefined) return null
    const content = typeof data.content === 'string' || typeof data.content === 'object' ? data.content : null
    if (content === null) return null
    return { content, updatedAt: data.updatedAt ?? null }
  } catch {
    return null
  }
}
