/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 本插件自带字典的语言集合，以及宿主 locale → 字典 key 的映射。
 *
 * 宿主内置语言只有 zh / en，其余语言由语言包通过 `locale.addLanguage` 注册，
 * 因此宿主报上来的 id 可能是 `pt`、`pt-BR`、`ja`、`de`… 所以入参按 string 收，
 * 先按主语言子标签归一（pt-BR → pt），没有对应字典时回退到英文 ——
 * 回退到 zh 会让所有非中文用户看到中文界面。
 */
import type { LocaleId } from '../types.ts'

/** 本插件实际提供字典的语言，按头部开关的切换顺序排列。 */
export const SHIPPED_LOCALES: LocaleId[] = ['en', 'zh', 'pt']

/** 巴西葡萄牙语的语言定义：pt 不是宿主内置语言，必须先注册进语言目录，
 *  `setLocale('pt')` 才不会抛「locale not registered」。 */
export const PT_LANGUAGE = { id: 'pt', label: 'Português (Brasil)', fallback: 'en' }

/** 取主语言子标签：`pt-BR` / `pt_BR` / `PT` 都归一为 `pt`。 */
function baseLangOf(lang: string): string {
  return lang.trim().toLowerCase().split(/[-_]/)[0] ?? ''
}

/** 宿主 locale → 字典 key；没有字典的语言一律回退到英文。 */
export function dictKeyOf(lang: string): LocaleId {
  const base = baseLangOf(lang)
  return (SHIPPED_LOCALES as string[]).includes(base) ? (base as LocaleId) : 'en'
}

/** 头部语言开关的下一站：在自带字典的语言之间循环。 */
export function nextLocaleOf(lang: string): LocaleId {
  const index = SHIPPED_LOCALES.indexOf(dictKeyOf(lang))
  return SHIPPED_LOCALES[(index + 1) % SHIPPED_LOCALES.length]
}
