/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Primary navigation: a compact segmented control switching between the
 * four top-level sections — Market (browse), Installed (manage), Custom
 * (manual command installs) and Settings (network sources & preferences).
 * Kept visually distinct from the category chips so the hierarchy reads:
 * section → category → plugin.
 */
import { createElement as h } from 'react'
import styles from '../../styles/SectionTabs.module.css'
import { BellIcon, InstalledIcon, MarketIcon, SettingsIcon, TerminalIcon } from '../ui/icons.tsx'

export type SectionView = 'market' | 'installed' | 'custom' | 'settings'

const ORDER: Array<{ id: SectionView; labelKey: string; hintKey: string; Icon: () => ReturnType<typeof h> }> = [
  { id: 'market', labelKey: 'viewMarket', hintKey: 'viewMarketHint', Icon: MarketIcon },
  { id: 'installed', labelKey: 'viewInstalled', hintKey: 'viewInstalledHint', Icon: InstalledIcon },
  { id: 'custom', labelKey: 'viewCustom', hintKey: 'viewCustomHint', Icon: TerminalIcon },
  { id: 'settings', labelKey: 'viewSettings', hintKey: 'viewSettingsHint', Icon: SettingsIcon },
]

export function SectionTabs({ view, setView, installedCount, t, noticeCount, onOpenNotifications }: {
  view: SectionView
  setView: (value: SectionView) => void
  installedCount: number
  t: (key: string) => string
  /** 通知中心红圈计数（记录 + 进行中任务 + 待重启）；0 时不显示徽标 */
  noticeCount: number
  /** 点击打开通知中心 */
  onOpenNotifications: () => void
}) {
  return h('div', { className: styles.root, role: 'tablist' },
    ORDER.map(({ id, labelKey, hintKey, Icon }) => h('button', {
      key: id,
      role: 'tab',
      'aria-selected': view === id,
      title: t(hintKey),
      className: view === id ? styles.tabActive : styles.tab,
      onClick: () => setView(id),
    },
      h('span', { className: styles.tabIcon }, h(Icon)),
      t(labelKey),
      id === 'installed' && installedCount > 0
        ? h('span', { className: view === id ? styles.tabCountActive : styles.tabCount }, installedCount)
        : null)),
    // 通知入口：设置在最后一个 tab 后边，靠右对齐 —— 铃铛 + 红底白字计数（内联跟在铃铛后，不悬浮）
    h('button', {
      type: 'button',
      className: styles.noticeBtn,
      onClick: onOpenNotifications,
      title: t('notificationsHint'),
      'aria-label': t('notificationsHint'),
    },
      h('span', { className: styles.noticeIcon }, h(BellIcon)),
      noticeCount > 0 ? h('span', { className: styles.noticeCount }, noticeCount > 99 ? '99+' : String(noticeCount)) : null),
  )
}
