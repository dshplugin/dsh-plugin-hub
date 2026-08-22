/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Toolbar above the list: search input + sort dropdown + installed / not
 * installed filter buttons + the notifications entry. All buttons share the
 * same size (24px high, like the notification entry button).
 */
import { createElement as h, Fragment } from 'react'
import type { FormEvent } from 'react'
import styles from '../styles/Header.module.css'
import type { Translate } from '../types.ts'
import { SORTS } from '../lib/catalog.ts'
import type { SortKey } from '../lib/catalog.ts'
import { Dropdown } from './Dropdown.tsx'

export function CatalogControls({ query, setQuery, sort, setSort, installedFilter, setInstalledFilter, installedCount, notInstalledCount, t, resultText, noticeCount, onOpenNotifications }: {
  query: string
  setQuery: (value: string) => void
  sort: SortKey
  setSort: (value: SortKey) => void
  installedFilter: 'all' | 'installed' | 'notInstalled'
  setInstalledFilter: (value: 'all' | 'installed' | 'notInstalled') => void
  installedCount: number
  notInstalledCount: number
  t: Translate
  resultText: string | null
  noticeCount: number
  onOpenNotifications: () => void
}) {
  return h(Fragment, null,
    h('div', { className: styles.searchRow },
      h('input', {
        className: styles.search,
        type: 'search',
        placeholder: t('search'),
        value: query,
        spellCheck: false,
        onInput: (e: FormEvent<HTMLInputElement>) =>
          setQuery((e.target as HTMLInputElement).value),
      }),
    ),
    h('div', { className: styles.controls },
      // 筛选结果数：位于排序下拉之前，选中分类后提示「筛选出 N 条插件」；
      // 数字单独等宽显示并预留 5 位宽度，数字变化时整行不左右跳动
      resultText ? h('span', { className: styles.filterResults },
        ...resultText.split(/(\d+)/).map((part, i) =>
          /^\d+$/.test(part)
            ? h('span', { key: i, className: styles.resultCount }, part)
            : part)) : null,
      // 全部 / 已安装 / 未安装：互斥单选组，点击直接切换选中态，「全部」即默认恢复项；
      // 已安装/未安装计数跟随当前分类，为 0 时置灰不可点
      h('button', {
        className: installedFilter === 'all'
          ? styles.installedBtnActive
          : styles.installedBtn,
        onClick: () => setInstalledFilter('all'),
        title: t('filterAllHint'),
        'aria-pressed': installedFilter === 'all',
      }, t('all')),
      // 排序下拉框：紧跟「全部」之后，按需切换排序方式
      Dropdown<SortKey>({
        value: sort,
        options: SORTS.map((key) => ({ value: key, label: t(key) })),
        onChange: setSort,
      }),
      h('button', {
        className: installedFilter === 'installed'
          ? styles.installedBtnActive
          : installedCount === 0
            ? styles.installedBtnDisabled
            : styles.installedBtn,
        onClick: () => setInstalledFilter('installed'),
        disabled: installedCount === 0,
        title: installedCount === 0 ? t('filterInstalledNone') : t('filterInstalledHint'),
        'aria-pressed': installedFilter === 'installed',
      },
        t('installed'),
        h('span', {
          className: installedFilter === 'installed' ? styles.segCountActive : styles.segCount,
        }, installedCount)),
      h('button', {
        className: installedFilter === 'notInstalled'
          ? styles.installedBtnActive
          : notInstalledCount === 0
            ? styles.installedBtnDisabled
            : styles.installedBtn,
        onClick: () => setInstalledFilter('notInstalled'),
        disabled: notInstalledCount === 0,
        title: notInstalledCount === 0 ? t('filterNotInstalledNone') : t('filterNotInstalledHint'),
        'aria-pressed': installedFilter === 'notInstalled',
      },
        t('notInstalled'),
        h('span', {
          className: installedFilter === 'notInstalled' ? styles.segCountActive : styles.segCount,
        }, notInstalledCount)),
      // 通知中心入口：整行控件最右侧、贴右对齐；有任何通知时右上角悬浮红圈白字计数；
      // 按钮文字用短文案（notificationsBtn），避免英文长标题挤占工具栏空间被截断
      h('button', {
        className: styles.failBtn,
        onClick: onOpenNotifications,
        title: t('notificationsHint'),
        'aria-label': t('notificationsHint'),
      }, t('notificationsBtn'), noticeCount > 0 ? h('span', { className: styles.failBadge }, noticeCount) : null),
    ),
  )
}
