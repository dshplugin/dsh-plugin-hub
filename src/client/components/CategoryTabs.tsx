/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Category tabs: an "all" chip followed by one chip per catalog category.
 * The "all" chip carries the total plugin count; the per-category chips
 * carry no counts so their widths stay uniform.
 */
import { createElement as h } from 'react'
import styles from '../styles/Header.module.css'
import type { LocaleId } from '../types.ts'
import { CATEGORY_ORDER, CATEGORY_SHORT_LABELS, categoryLabel } from '../lib/catalog.ts'

export function CategoryTabs({ category, setCategory, allLabel, totalCount, langKey }: {
  category: string
  setCategory: (value: string) => void
  allLabel: string
  totalCount: number
  langKey: LocaleId
}) {
  return h('div', { className: styles.tabs },
    // 第一个按钮固定为「全部」：展示全部分类，直接显示插件总数；
    // 其余分类按钮不带数量，保持排版整齐
    h('button', {
      key: 'all',
      className: category === 'all' ? styles.tabActive : styles.tab,
      onClick: () => setCategory('all'),
    },
      allLabel,
      h('span', { className: styles.tabCount }, totalCount)),
    CATEGORY_ORDER.map((id) => h('button', {
      key: id,
      className: category === id ? styles.tabActive : styles.tab,
      onClick: () => setCategory(id),
    },
    categoryLabel(CATEGORY_SHORT_LABELS, id, langKey))),
  )
}
