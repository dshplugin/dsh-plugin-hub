/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Catalog list: the scrollable container with the loading / failed / empty
 * states, the plugin cards, and the count footer. Resets scroll position when
 * the category or install-status filter changes so the replaced content is
 * not mistaken for a no-op update.
 */
import { createElement as h, useEffect, useRef } from 'react'
import styles from '../../styles/List.module.css'
import type { HubPlugin, LocaleId, Translate } from '../../types.ts'
import { SITE_URL } from '../../logic/constants.ts'
import { useIncrementalList } from '../../hooks/useIncrementalList.ts'
import { PluginCard } from './PluginCard.tsx'

export function CatalogList({ plugins, failed, visible, total, t, langPath, reload, category, copied, installedName, installedVersion, hasUpdate, langKey, onInstall, onUninstall, hasProxy, onOpenDiagnostics }: {
  plugins: HubPlugin[] | null
  failed: boolean
  visible: HubPlugin[]
  total: number
  t: Translate
  langPath: string
  reload: () => void
  category: string
  copied: string | null
  installedName: (p: HubPlugin) => string | null
  installedVersion: (p: HubPlugin) => string | null
  hasUpdate: (p: HubPlugin) => boolean
  langKey: LocaleId
  onInstall: (p: HubPlugin, opts?: { update?: boolean }) => void
  onUninstall: (p: HubPlugin) => void
  /** 设置里是否配置了 HTTP 代理：目录拉不出来时据此精准提示（网络不通 vs 代理不可达） */
  hasProxy: boolean
  /** 「去系统诊断检测网络」直达：跳到设置 → 系统诊断自动跑连通性检测 */
  onOpenDiagnostics: () => void
}) {
  /** 列表滚动容器：分类/搜索切换后列表内容替换但 scrollTop 保留，会让用户误以为列表没更新，需重置回顶部 */
  const listRef = useRef<HTMLDivElement | null>(null)
  /** 增量渲染：全量目录太大（4400+），只渲染首批，滚动接近底部时自动追加下一批 */
  const { shown, hasMore, sentinelRef } = useIncrementalList(visible)

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 })
  }, [category])

  return h('div', { className: styles.body },
    h('div', { ref: listRef, className: styles.list },
      plugins === null && !failed && h('div', { className: styles.state }, t('loading')),
      failed && h('div', { className: styles.state },
        h('div', { className: styles.stateTitle }, t('failed')),
        // 精准提示：配了代理 → 提示代理可能不可达；没配 → 直接提示网络不通
        h('div', { className: styles.stateDesc }, t(hasProxy ? 'failedDescProxy' : 'failedDescNoProxy')),
        h('div', { className: styles.stateActions },
          h('button', { className: styles.retryBtn, onClick: () => reload() }, t('retry')),
          h('button', { className: styles.diagBtn, onClick: onOpenDiagnostics }, t('failNetworkRunDiag')),
        ),
      ),
      plugins !== null && !failed && visible.length === 0 && h('div', { className: styles.state },
        h('div', { className: styles.stateTitle }, t('noResult')),
        h('div', { className: styles.stateDesc }, t('noResultDesc')),
      ),
      plugins !== null && !failed && shown.map((p) => h(PluginCard, {
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
      // 滚动加载哨兵：透明 1px 元素，进入视口即触发下一批渲染（加载是纯追加，无需按钮）
      hasMore && h('div', { ref: sentinelRef, className: styles.moreSentinel, 'aria-hidden': 'true' }),
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
