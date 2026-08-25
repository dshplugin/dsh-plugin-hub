/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Presentation formatters shared across the catalog list and the cards.
 */
import type { Translate } from '../types.ts'

/** 星数/分支数的紧凑展示：<1k 原样；千级 1.2k；十万级取整。 */
export function fmtStars(count?: number): string {
  if (!count || count <= 0) return '0'
  if (count < 1000) return String(count)
  const k = count / 1000
  return `${k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, '')}k`
}

/** 相对时间：今天 / N 天前 / N 个月前 / N 年前。 */
export function relTime(iso: string | undefined, t: Translate): string {
  if (!iso) return ''
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days <= 0) return t('today')
  if (days < 30) return t('daysAgo', { days })
  if (days < 365) return t('monthsAgo', { months: Math.floor(days / 30) })
  return t('yearsAgo', { years: Math.floor(days / 365) })
}
