/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * dsh-plugin 客户端入口：通过模块加载器 bundle（见 tsdown.config.ts）把插件中心接入宿主设置。
 * 全部 UI 逻辑都在 PluginHubSection；本文件只做 cordis apply 接线。
 */
import { createElement as h } from 'react'
import type { HubClientContext } from './types.ts'
import { en, pt, zh } from './locales.ts'
import { PT_LANGUAGE } from './logic/locale-key.ts'
import { PluginHubSection } from './components/PluginHubSection.tsx'
import './styles/tokens.module.css'

const NS = 'dsh-plugin'

export const name = NS
export const inject = ['slots', 'locale']

export function apply(ctx: HubClientContext): void {
  // 宿主内置语言只有 zh / en；pt 必须先注册进语言目录，否则 setLocale('pt') 会抛
  // 「locale "pt" is not registered」。别的语言包可能已经注册过 pt（含 pt-BR 这类），
  // 重复注册会抛错 —— 那种情况沿用已有定义即可，不能因此让整个插件加载失败。
  ctx.effect(() => {
    try {
      return ctx.locale.addLanguage(PT_LANGUAGE)
    } catch {
      return undefined
    }
  }, `${NS}: pt language`)
  ctx.effect(() => ctx.locale.register(NS, { zh, en, pt }), `${NS}: dictionaries`)
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: NS,
    order: 60,
    label: () => t('nav'),
    locale: NS,
    inject: () => ({ t, locale: ctx.locale }),
  }, () => h(PluginHubSection, { t, locale: ctx.locale })))
}
