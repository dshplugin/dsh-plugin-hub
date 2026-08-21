/**
 * Section header: brand title row (H1 + open-site button) + tagline, followed
 * by the purple ad banner that promotes the catalog stats.
 */
import { createElement as h, Fragment } from 'react'
import styles from '../styles/Header.module.css'
import type { Translate } from '../types.ts'
import { GITHUB_URL, PLUGIN_VERSION, SITE_URL } from '../lib/catalog.ts'
import { GitHubIcon, LogoIcon } from './icons.tsx'

export function CatalogHeader({ t, langPath, statsTotal, statsVerified, onToggleLang }: {
  t: Translate
  langPath: string
  statsTotal: number
  statsVerified: number
  onToggleLang: () => void
}) {
  return h(Fragment, null,
    h('div', { className: styles.header },
      // 第一行：logo + 标题（官网链接）与 GitHub 源码图标同行，GitHub 顶到标题行末尾
      h('div', { className: styles.headerTitleRow },
        h('a', {
          className: styles.brandTitle,
          href: `${SITE_URL}${langPath}`,
          target: '_blank',
          rel: 'noopener noreferrer',
          title: t('openHint'),
          'aria-label': t('openHint'),
        },
          h(LogoIcon),
          h('h1', { className: styles.title },
            t('title'),
            h('span', { className: styles.version }, ` v${PLUGIN_VERSION}`),
          ),
        ),
        // 右侧控件组：语言切换 + GitHub 源码图标（独立链接，brandTitle 是官网 <a> 不能嵌套），
        // 一起 space-between 顶到标题行最右
        h('div', { className: styles.headerRight },
          // 语言切换：按钮文字始终显示「要切到的语言」，点击即切，无需图标
          h('button', {
            className: styles.langBtn,
            type: 'button',
            onClick: onToggleLang,
            title: t('toggleLangHint'),
            'aria-label': t('toggleLangHint'),
          }, langPath === 'zh/' ? 'EN' : '中文'),
          h('a', {
            className: styles.githubLink,
            href: GITHUB_URL,
            target: '_blank',
            rel: 'noopener noreferrer',
            title: t('githubHint'),
            'aria-label': t('githubHint'),
          }, h(GitHubIcon)),
        ),
      ),
      // 第二行：副标题仍是官网链接，点击跳 dsh-plugin.org
      h('a', {
        className: styles.taglineLink,
        href: `${SITE_URL}${langPath}`,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: t('openHint'),
      },
        h('div', { className: styles.tagline }, t('tagline', { total: statsTotal, verified: statsVerified })),
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
