/**
 * Catalog list: the scrollable container with the loading / failed / empty
 * states, the plugin cards, and the count footer. Resets scroll position when
 * the category or install-status filter changes so the replaced content is
 * not mistaken for a no-op update.
 */
import { createElement as h, useEffect, useRef } from 'react'
import styles from '../styles/List.module.css'
import type { HubPlugin, LocaleId, Translate } from '../types.ts'
import { SITE_URL } from '../lib/catalog.ts'
import { PluginCard } from './PluginCard.tsx'

export function CatalogList({ plugins, failed, visible, total, t, langPath, reload, category, installedFilter, copied, installedName, installedVersion, hasUpdate, langKey, onInstall, onUninstall }: {
  plugins: HubPlugin[] | null
  failed: boolean
  visible: HubPlugin[]
  total: number
  t: Translate
  langPath: string
  reload: () => void
  category: string
  installedFilter: 'all' | 'installed' | 'notInstalled'
  copied: string | null
  installedName: (p: HubPlugin) => string | null
  installedVersion: (p: HubPlugin) => string | null
  hasUpdate: (p: HubPlugin) => boolean
  langKey: LocaleId
  onInstall: (p: HubPlugin, opts?: { update?: boolean }) => void
  onUninstall: (p: HubPlugin) => void
}) {
  /** 列表滚动容器：分类/搜索切换后列表内容替换但 scrollTop 保留，会让用户误以为列表没更新，需重置回顶部 */
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 })
  }, [category, installedFilter])

  return h('div', { className: styles.body },
    h('div', { ref: listRef, className: styles.list },
      plugins === null && !failed && h('div', { className: styles.state }, t('loading')),
      failed && h('div', { className: styles.state },
        h('div', { className: styles.stateTitle }, t('failed')),
        h('div', { className: styles.stateDesc }, t('failedDesc')),
        h('button', { className: styles.retryBtn, onClick: () => reload() }, t('retry')),
      ),
      plugins !== null && !failed && visible.length === 0 && h('div', { className: styles.state },
        h('div', { className: styles.stateTitle }, t('noResult')),
        h('div', { className: styles.stateDesc }, t('noResultDesc')),
      ),
      plugins !== null && !failed && visible.map((p) => h(PluginCard, {
        // 唯一 key：数据重构后同一 slug 可能对应多个作者仓库，仅用 slug 会撞 key，
        // 导致切换分类时 React 复用旧 DOM、列表不刷新。
        key: p.ownerSlug ? `${p.ownerSlug}/${p.slug}` : p.slug,
        plugin: p,
        copied,
        installedName,
        installedVersion,
        hasUpdate,
        t,
        langKey,
        langPath,
        onInstall,
        onUninstall,
      })),
    ),
    plugins !== null && !failed && h('div', { className: styles.footer },
      h('a', {
        className: styles.footLink,
        href: `${SITE_URL}${langPath}`,
        target: '_blank',
        rel: 'noopener noreferrer',
      }, t('browseAll', { n: total })),
    ),
  )
}
