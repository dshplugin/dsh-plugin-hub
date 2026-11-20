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
import { en, zh } from './locales.ts'
import { PluginHubSection } from './components/PluginHubSection.tsx'
import './styles/tokens.module.css'

const NS = 'dsh-plugin'

export const name = NS
export const inject = ['slots', 'locale']

export function apply(ctx: HubClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), `${NS}: dictionaries`)
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
