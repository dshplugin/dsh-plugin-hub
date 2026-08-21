/**
 * dsh-plugin client entry: wires the Plugin Hub into the host settings via
 * the module-loader bundle (see tsdown.config.ts). All UI logic lives in
 * PluginHubSection; this file only performs the cordis apply wiring.
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
