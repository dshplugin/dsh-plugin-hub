/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Language state for the section: the Hub shares the host (system) locale —
 * the header language toggle writes the host locale preference via setLocale,
 * so the host chrome (left sidebar, settings dialog) and the Hub panel switch
 * together instead of drifting apart. Exposes the localized dictionary lookup
 * `t()` plus the zh/en language flag and the /zh/ URL path prefix.
 */
import { useEffect, useState } from 'react'
import type { LocaleId, SectionProps } from '../types.ts'
import { en, zh } from '../locales.ts'
import { langPathOf } from '../logic/urls.ts'

export function useLanguage(locale: SectionProps['locale']) {
  // 界面语言 = 宿主（系统）语言：右上角按钮切换时直接写入宿主 locale 偏好，
  // 宿主左侧菜单/设置弹窗与 Hub 面板一起切换，不存在 Hub 内部语言与宿主语言脱节的情况。
  // subscribe 订阅宿主语言变化并触发重渲染，保证 Hub 界面随时跟随宿主。
  const [, setRev] = useState(0)
  useEffect(() => locale.subscribe(() => setRev((r) => r + 1)), [locale])
  const lang: LocaleId = locale.getSnapshot().active
  const langKey: LocaleId = lang === 'en' ? 'en' : 'zh'
  // dsh-plugin.org keeps zh pages under the /zh/ prefix; en is the root.
  const langPath = langPathOf(lang)

  // 界面语言跟随宿主（系统）locale；宿主的 t() 绑定宿主 locale，
  // 这里基于本地字典自建翻译函数，与宿主 locale 保持一致。
  // （settings.section 的导航 label 仍在 apply 里用宿主 t()，跟随宿主语言。）
  const dict: Record<string, string> = langKey === 'en' ? en : zh
  const t = (key: string, params?: Record<string, string | number>): string => {
    const raw = dict[key] ?? key
    return params ? raw.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? '')) : raw
  }

  return {
    lang,
    langKey,
    langPath,
    t,
    toggleLang: () => locale.setLocale(lang === 'en' ? 'zh' : 'en'),
  }
}
