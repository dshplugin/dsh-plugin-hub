/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Hub meta repository: the Cloudflare Worker endpoints behind the self-update
 * check and the "About us" content. Failures degrade to null — the caller
 * decides how to fall back (no badge, placeholder copy), never throws.
 */
import type { HubAboutInfo, HubUpdateInfo } from '../types.ts'
import { HUB_ABOUT_URL, HUB_UPDATE_URL } from '../logic/constants.ts'

/** 版本接口是 Pages 静态文件，默认带 CDN 缓存（Cache-Control: public, max-age=43200，
 *  即 12 小时），客户端 no-store 管不到 CDN 边缘，会拿到旧公告。
 *  静态资产请求免费且无限，因此所有版本检查一律带时间戳 query：URL 每次不同 →
 *  CDN 缓存 key 不同 → 强制回源拉到最新公告，无任何配额顾虑。 */
function busted(url: string): string {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}_t=${Date.now()}`
}

/** Worker 版本控制中心：最新版本 + Markdown 变更记录；不可用返回 null。 */
export async function fetchHubUpdate(): Promise<HubUpdateInfo | null> {
  try {
    const res = await fetch(busted(HUB_UPDATE_URL), { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json() as HubUpdateInfo | null
    if (!data) return null
    const version = typeof data.version === 'string' && data.version.length > 0 ? data.version : null
    if (version === null) return null
    return { version, publishedAt: data.publishedAt ?? null, notes: data.notes ?? null }
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
