/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 板块的语言状态：Hub 与宿主（系统）locale 共用 —— 头部语言开关通过 setLocale 写入
 * 宿主语言偏好，让宿主界面（左侧菜单、设置弹窗）与 Hub 面板一起切换、不会各说各话。
 * 对外暴露本地化字典查询 `t()`、zh/en 语言标记与 /zh/ URL 路径前缀。
 */
import { useEffect, useState } from 'react'
import type { LocaleId, SectionProps } from '../types.ts'
import { en, pt, zh } from '../locales.ts'
import { langPathOf } from '../logic/urls.ts'
import { dictKeyOf, nextLocaleOf } from '../logic/locale-key.ts'

/** Dictionaries this plugin ships, keyed by locale id. */
const DICTS: Record<LocaleId, Record<string, string>> = { en, zh, pt }

export function useLanguage(locale: SectionProps['locale']) {
  // 界面语言 = 宿主（系统）语言：右上角按钮切换时直接写入宿主 locale 偏好，
  // 宿主左侧菜单/设置弹窗与 Hub 面板一起切换，不存在 Hub 内部语言与宿主语言脱节的情况。
  // subscribe 订阅宿主语言变化并触发重渲染，保证 Hub 界面随时跟随宿主。
  const [, setRev] = useState(0)
  useEffect(() => locale.subscribe(() => setRev((r) => r + 1)), [locale])
  const lang: LocaleId = locale.getSnapshot().active
  // Only the locales this plugin ships have a dictionary. Any other host locale
  // (ja, de, ru…) falls back to English — falling back to zh showed Chinese to
  // every user whose language had no dictionary.
  const langKey: LocaleId = dictKeyOf(lang)
  // dsh-plugin.org 的 zh 页面挂在 /zh/ 前缀下，en 在根路径。
  const langPath = langPathOf(lang)

  // 界面语言跟随宿主（系统）locale；宿主的 t() 绑定宿主 locale，
  // 这里基于本地字典自建翻译函数，与宿主 locale 保持一致。
  // （settings.section 的导航 label 仍在 apply 里用宿主 t()，跟随宿主语言。）
  const dict: Record<string, string> = DICTS[langKey]
  const t = (key: string, params?: Record<string, string | number>): string => {
    const raw = dict[key] ?? key
    return params ? raw.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? '')) : raw
  }

  return {
    lang,
    langKey,
    langPath,
    t,
    toggleLang: () => locale.setLocale(nextLocaleOf(lang)),
  }
}
