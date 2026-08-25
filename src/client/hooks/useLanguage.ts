/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Language state for the section: follows the host (system) locale by
 * default, with an optional manual toggle that wins until the user changes
 * it back. Exposes the localized dictionary lookup `t()` plus the zh/en
 * language flag and the /zh/ URL path prefix.
 */
import { useState } from 'react'
import type { LocaleId, SectionProps } from '../types.ts'
import { en, zh } from '../locales.ts'
import { langPathOf } from '../logic/urls.ts'

export function useLanguage(locale: SectionProps['locale']) {
  /** 界面语言：默认跟随宿主（系统）语言；右上角按钮可手动切换，切换后以手动选择为准 */
  const [manualLang, setManualLang] = useState<LocaleId | null>(null)
  const lang: LocaleId = manualLang ?? locale.getSnapshot().active
  const langKey: LocaleId = lang === 'en' ? 'en' : 'zh'
  // dsh-plugin.org keeps zh pages under the /zh/ prefix; en is the root.
  const langPath = langPathOf(lang)

  // 界面语言跟随宿主（系统）locale 自动切换；宿主的 t() 绑定宿主 locale，
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
    toggleLang: () => setManualLang(lang === 'en' ? 'zh' : 'en'),
  }
}
