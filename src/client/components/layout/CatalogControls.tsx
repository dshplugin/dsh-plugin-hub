/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Toolbar above the market list:
 * row 1 — full-width search input;
 * row 2 — result count on the left, sort segmented control on the right
 * (mirrors the Installed view: clicking the same sort toggles
 * ascending/descending, a new sort uses its default order; the active
 * button shows an up/down arrow for the current direction).
 */
import { createElement as h, Fragment } from 'react'
import type { FormEvent, ReactNode } from 'react'
import styles from '../../styles/Header.module.css'
import type { Translate } from '../../types.ts'
import { SORTS } from '../../logic/constants.ts'
import type { SortKey } from '../../logic/constants.ts'
import { SortArrowIcon } from '../ui/icons.tsx'

/** 单选按钮组中的一个按钮（segmented control，与已安装视图排序按钮同款） */
function SegBtn({ active, onClick, label, icon }: {
  active: boolean
  onClick: () => void
  label: string
  icon?: ReactNode
}) {
  return h('button', {
    type: 'button',
    className: active ? `${styles.segBtn} ${styles.segBtnActive}` : styles.segBtn,
    'aria-pressed': active,
    onClick,
  }, label, icon)
}

export function CatalogControls({ query, setQuery, sort, sortDir, toggleSort, t, resultText }: {
  query: string
  setQuery: (value: string) => void
  sort: SortKey
  /** 当前排序方向：决定激活排序按钮上的箭头朝上(正序)/朝下(倒序) */
  sortDir: 'asc' | 'desc'
  toggleSort: (value: SortKey) => void
  t: Translate
  resultText: string | null
}) {
  return h(Fragment, null,
    // 第一行：搜索框占满整行（搜插件名称、描述、标签）
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
    // 第二行：左侧筛选结果数「结果 N 条插件」（数字等宽预留 5 位不跳动），
    // 右侧排序按钮组（与已安装视图同款 segmented control，激活按钮带正/倒序箭头）
    h('div', { className: styles.controls },
      resultText ? h('span', { className: styles.resultSeg },
        ...resultText.split(/(\d+)/).map((part, i) =>
          /^\d+$/.test(part)
            ? h('span', { key: i, className: styles.resultCount }, part)
            : part)) : null,
      h('div', { className: styles.sortGroup },
        h('span', { className: styles.segLabel }, t('sortByLabel')),
        h('div', { className: styles.segGroup, role: 'radiogroup', 'aria-label': t('sortAria') },
          SORTS.map((key) => SegBtn({
            active: sort === key,
            onClick: () => toggleSort(key),
            label: t(key),
            icon: sort === key ? h(SortArrowIcon, { up: sortDir === 'asc' }) : null,
          })),
        ),
      ),
    ),
  )
}
