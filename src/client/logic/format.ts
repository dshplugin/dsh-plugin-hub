/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 目录列表与卡片共用的展示格式化函数。
 */
import type { LocaleId, Translate } from '../types.ts'

/** 绝对时间（安装时间、发布时间）用的 Intl locale：每种自带字典的界面语言用自己的区域习惯。 */
export function intlLocaleOf(lang: LocaleId): string {
  if (lang === 'zh') return 'zh-CN'
  if (lang === 'pt') return 'pt-BR'
  return 'en-US'
}

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

/** 具体时刻：当天只给「时:分」，跨天再补「月/日」，用于「暂缓到何时可更新」。 */
export function clockTime(ms: number): string {
  const at = new Date(ms)
  const now = new Date()
  const hh = String(at.getHours()).padStart(2, '0')
  const mm = String(at.getMinutes()).padStart(2, '0')
  const sameDay = at.getFullYear() === now.getFullYear() && at.getMonth() === now.getMonth() && at.getDate() === now.getDate()
  return sameDay ? `${hh}:${mm}` : `${at.getMonth() + 1}/${at.getDate()} ${hh}:${mm}`
}
