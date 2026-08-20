/**
 * Section header: brand title row (H1 + open-site button) + tagline, followed
 * by the purple ad banner that promotes the catalog stats.
 */
import { createElement as h, Fragment } from 'react'
import styles from '../styles/Section.module.css'
import type { Translate } from '../types.ts'
import { PLUGIN_VERSION, SITE_URL } from '../lib/catalog.ts'
import { LogoIcon } from './icons.tsx'

export function CatalogHeader({ t, langPath, statsTotal, statsVerified }: {
  t: Translate
  langPath: string
  statsTotal: number
  statsVerified: number
}) {
  return h(Fragment, null,
    h('div', { className: styles.header },
      // 整个头部（logo + 标题 + 副标题）即一个官网超链接：点任意位置跳 dsh-plugin.org，不再单放一个官网按钮
      h('a', {
        className: styles.brand,
        href: `${SITE_URL}${langPath}`,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: t('openHint'),
        'aria-label': t('openHint'),
      },
        h('div', { className: styles.brandText },
          h('div', { className: styles.titleRow },
            // 品牌 logo + 短标题：logo 在标题左侧，标题只保留品牌词；右侧版本号浅灰弱化，不喧宾夺主
            h(LogoIcon),
            h('h1', { className: styles.title },
              t('title'),
              h('span', { className: styles.version }, ` v${PLUGIN_VERSION}`),
            ),
          ),
          h('div', { className: styles.tagline }, t('tagline', { total: statsTotal, verified: statsVerified })),
        ),
      ),
    ),
    h('a', {
      className: styles.adBanner,
      href: `${SITE_URL}${langPath}`,
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    h('span', { className: styles.adBadge }, t('adBadge')),
    h('span', { className: styles.adText }, t('ad', { total: statsTotal, verified: statsVerified })),
    h('span', { className: styles.adArrow }, '\u2197')),
  )
}
