/**
 * Section header: brand title row (H1 + open-site button) + tagline, followed
 * by the purple ad banner that promotes the catalog stats.
 */
import { createElement as h, Fragment } from 'react'
import styles from '../styles/Header.module.css'
import type { Translate } from '../types.ts'
import { GITHUB_URL, PLUGIN_VERSION, SITE_URL } from '../lib/catalog.ts'
import { GitHubIcon, LogoIcon } from './icons.tsx'

export function CatalogHeader({ t, langPath, statsTotal, statsVerified, onToggleLang, hubUpdate, onVersionClick, onAboutClick }: {
  t: Translate
  langPath: string
  statsTotal: number
  statsVerified: number
  onToggleLang: () => void
  /** Hub 自身是否有可用更新：有则版本号后紧跟红色「可更新」徽标（整体一个可点入口） */
  hubUpdate: boolean
  /** 点击版本号（含红色徽标，同一入口）：无论有无更新都打开更新记录弹窗 */
  onVersionClick: () => void
  /** 点击「关注我们」：打开平台介绍 + 用户反馈群二维码弹窗 */
  onAboutClick: () => void
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
          h('h1', { className: styles.title }, t('title')),
        ),
        // 版本号：紧跟标题「DSH-Plugin Hub」之后，常驻可点入口（<a> 内不能嵌套按钮，故从官网链接里移出放在旁边）。
        // 点击打开更新记录弹窗 —— 有更新看新版本内容，无更新看当前版本内容。
        // 有更新时版本号后直接跟一个红色「可更新」徽标（同一按钮内，不分开成两个元素），静态显示不闪烁。
        h('button', {
          className: styles.versionBtn,
          type: 'button',
          onClick: onVersionClick,
          title: t(hubUpdate ? 'hubUpdateHint' : 'versionHint'),
          'aria-label': t(hubUpdate ? 'hubUpdateHint' : 'versionHint'),
        },
          `v${PLUGIN_VERSION}`,
          hubUpdate && h('span', { className: styles.hubUpdateBadge }, t('update')),
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
          // 「关注我们」：点击打开平台介绍 + 用户反馈群二维码弹窗
          h('button', {
            className: styles.aboutBtn,
            type: 'button',
            onClick: onAboutClick,
            title: t('aboutDesc'),
            'aria-label': t('aboutTitle'),
          }, t('followUs')),
          // GitHub 源码图标：独立链接（brandTitle 是官网 <a> 不能嵌套），放在控件组最后
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
