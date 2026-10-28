/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 已安装视图：管理安装进当前 profile 的插件。沿用主流扩展管理器模式（VSCode 已安装 tab）——
 * 可搜索、可排序的已安装清单，混排目录插件（完整元数据）与命令行自定义安装（目录之外，
 * 只有运行时信息，打「自定义」徽标）。工具栏含搜索框与两组分段单选：来源筛选
 * （全部/目录/自定义）与排序（名称/最近安装/Star/Fork）。每行带重启（待重启时）、更新与
 * 卸载动作，并打开含完整安装元数据的详情弹窗。
 *
 * 纯展示组件：只持有本地搜索/排序状态；InstalledItem 模型来自目录 hook，动作经回调上抛。
 */
import { createElement as h, useMemo, useState } from 'react'
import type { FormEvent, MouseEvent, ReactNode } from 'react'
import styles from '../../styles/InstalledView.module.css'
import type { LocaleId, Translate } from '../../types.ts'
import type { InstalledItem } from '../../logic/installed.ts'
import { CATEGORY_LABELS, categoryLabel } from '../../logic/constants.ts'
import { clockTime } from '../../logic/format.ts'
import { SortArrowIcon } from '../ui/icons.tsx'

const INSTALLED_SORTS = ['sortName', 'sortInstalledAt', 'sortStars', 'sortForks'] as const
type InstalledSortKey = (typeof INSTALLED_SORTS)[number]

/** 各排序的默认方向：名称按字母正序，最近安装 / Star / Fork 按数值倒序 */
const SORT_DEFAULT_DIR: Record<InstalledSortKey, 'asc' | 'desc'> = {
  sortName: 'asc', sortInstalledAt: 'desc', sortStars: 'desc', sortForks: 'desc',
}

/** 已安装列表的来源筛选：全部 / 目录收录 / 自定义安装 */
type SourceFilter = 'all' | 'catalog' | 'custom'

/** 单选按钮组中的一个按钮（segmented control，与排序/来源筛选共用）；
    可带尾随图标（排序按钮激活时显示当前方向箭头） */
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

function InstalledRow({ item, t, langKey, canReveal, revealLabel, pendingRestart, onOpenDetail, onReveal, onUpdate, onUninstall, onRestart }: {
  item: InstalledItem
  t: Translate
  langKey: LocaleId
  /** 系统文件管理器可定位安装目录的平台（macOS / Linux）：行内显示打开目录按钮 */
  canReveal: boolean
  /** 打开目录按钮文案（macOS = 在 Finder 中显示，Linux = 在文件夹中显示） */
  revealLabel: string
  /** 是否在服务端待重启列表里（装完未重启）；区分「待重启」与「已重启仍加载失败」 */
  pendingRestart: boolean
  onOpenDetail: (item: InstalledItem) => void
  /** 在系统文件管理器里定位安装目录（macOS Finder / Linux 文件管理器） */
  onReveal: (item: InstalledItem) => void
  onUpdate: (item: InstalledItem) => void
  onUninstall: (item: InstalledItem) => void
  /** 重启宿主：仅待重启（装完未挂载）条目展示，重启后该插件才生效 */
  onRestart: () => void
}) {
  const name = item.plugin?.displayName ?? item.name
  const repo = item.repo
  const category = item.plugin?.category
  const desc = item.plugin?.description
  // 命令行安装进来的插件没有目录元数据（plugin === null）：列表里打「自定义安装」标签区分
  const isCustom = item.plugin === null
  return h('li', {
    className: styles.row,
    onClick: () => onOpenDetail(item),
    role: 'button',
    tabIndex: 0,
    title: t('detail'),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onOpenDetail(item)
      }
    },
  },
    // 第一行：状态点 + 名称/版本/更新徽标 + 行尾来源标签列 + 右侧固定操作按钮组
    h('div', { className: styles.rowTitleLine },
      // 运行状态点：绿 = 已加载进 loader；橙 = 待重启（装完未挂载的 dsh 插件）；
      // 灰 = 未激活（声明是 dsh 插件但宿主加载失败，重启无效）或非 dsh 插件（示例项目）
      h('span', {
        className: item.loaded ? styles.statusDot
          : item.dshCapable && pendingRestart ? `${styles.statusDot} ${styles.statusPending}`
            : `${styles.statusDot} ${styles.statusInactive}`,
        title: item.loaded ? t('statusRunning')
          : item.dshCapable && pendingRestart ? t('statusPending')
            : item.dshCapable ? t('statusInactive')
              : t('exampleHint'),
        'aria-label': item.loaded ? t('statusRunning')
          : item.dshCapable && pendingRestart ? t('statusPending')
            : item.dshCapable ? t('statusInactive')
              : t('exampleHint'),
      }),
      // 主信息：名称 + 已装版本 + 有更新徽标（flex 撑满，超长省略）
      h('div', { className: styles.rowMain },
        h('span', { className: styles.rowTitle }, name),
        item.installedVersion
          ? h('span', { className: styles.versionBadge, title: t('installedVersionLabel') }, item.installedVersion)
          : null,
        item.hasUpdate
          ? h('span', { className: styles.updateBadge, title: t('updateAvailableHint') }, t('updateAvailable'))
          : item.pendingUntil != null
            // 门禁暂缓：更新存在但还装不上，给确切时刻，避免看起来「已是最新」
            ? h('span', { className: styles.updateBadge, title: t('updatePendingHint') }, t('updatePending', { time: clockTime(item.pendingUntil) }))
            : null,
      ),
      // 来源标签列（行尾、操作按钮前，右对齐固定）：目录插件 →「插件市场」（品牌色），
      // 命令行安装 →「手动安装」（琥珀色）；两词 4 字等宽，所有条目标签同列对齐
      h('span', {
        className: isCustom
          ? `${styles.rowSourceTag} ${styles.rowSourceTagManual}`
          : `${styles.rowSourceTag} ${styles.rowSourceTagHub}`,
        title: isCustom ? t('manualInstallHint') : t('hubInstallHint'),
      }, isCustom ? t('manualInstall') : t('hubInstall')),
      // 行操作：重启（dsh 插件待重启时）/ 详情 / 更新（有更新时）/ 卸载 —— 按钮点击不触发行打开详情
      h('div', { className: styles.rowActions },
        // 装完未挂载、且在待重启列表里的 dsh 插件：给「重启」入口，点了宿主重启后插件即生效；
        // 已重启但仍加载失败（不在待重启列表）不显示「重启」，改为灰点「未激活」
        !item.loaded && item.dshCapable && pendingRestart
          ? h('button', {
            className: styles.rowRestart,
            type: 'button',
            title: t('restartPendingHint'),
            onClick: (e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onRestart() },
          }, t('restart'))
          : null,
        // 支持文件管理器定位的平台（macOS / Linux）：行内该位改为打开安装目录按钮；
        // 行点击本身即打开详情弹窗，故不支持的平台（如 Windows）不显示此按钮
        canReveal
          ? h('button', {
            className: styles.rowDetail,
            type: 'button',
            onClick: (e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onReveal(item) },
          }, revealLabel)
          : null,
        item.hasUpdate && item.plugin
          ? h('button', {
            className: styles.rowUpdate,
            type: 'button',
            title: t('updateAvailableHint'),
            onClick: (e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onUpdate(item) },
          }, t('update'))
          : null,
        h('button', {
          className: styles.rowUninstall,
          type: 'button',
          onClick: (e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onUninstall(item) },
        }, t('uninstall')),
      ),
    ),
    // 示例项目徽标单独一行（非 dsh 插件）：标签较长也能完整显示，不挤压名称行
    !item.dshCapable
      ? h('div', { className: styles.exampleRow },
        h('span', { className: styles.exampleBadge, title: t('exampleHint') }, t('exampleLabel')),
      )
      : null,
    // 第二行：仓库 · 分类（与名称左对齐缩进，独立成行不再挤压名称）
    repo || category
      ? h('div', { className: styles.rowMeta },
        item.repo ? h('span', { className: styles.rowRepo }, item.repo) : null,
        category ? h('span', { className: styles.rowCategory },
          categoryLabel(CATEGORY_LABELS, category, langKey)) : null,
      )
      : null,
    // 第三行（仅目录插件）：简介单独一行展示，超长以省略号收尾
    desc ? h('div', { className: styles.rowDesc, title: desc }, desc) : null,
  )
}

/** 行列表：单个已安装列表（自定义安装与目录插件混排，靠徽标区分）。 */
function RowList({ items, t, langKey, canReveal, revealLabel, pendingRestarts, onOpenDetail, onReveal, onUpdate, onUninstall, onRestart }: {
  items: InstalledItem[]
  t: Translate
  langKey: LocaleId
  canReveal: boolean
  revealLabel: string
  /** 待重启的 owner/repo 集合；用于区分「待重启」与「已重启仍加载失败」 */
  pendingRestarts: string[]
  onOpenDetail: (item: InstalledItem) => void
  onReveal: (item: InstalledItem) => void
  onUpdate: (item: InstalledItem) => void
  onUninstall: (item: InstalledItem) => void
  onRestart: () => void
}) {
  const pendingSet = new Set(pendingRestarts.map((r) => r.toLowerCase()))
  return h('ul', { className: styles.list },
    items.map((item) => h(InstalledRow, {
      key: item.name,
      item,
      t,
      langKey,
      canReveal,
      revealLabel,
      pendingRestart: item.repo !== null && pendingSet.has(item.repo.toLowerCase()),
      onOpenDetail,
      onReveal,
      onUpdate,
      onUninstall,
      onRestart,
    })),
  )
}

export function InstalledView({ items, t, langKey, platform, pendingRestarts, onOpenDetail, onReveal, onUpdate, onUninstall, onRestart }: {
  items: InstalledItem[]
  t: Translate
  langKey: LocaleId
  /** 宿主系统平台（node process.platform）：支持文件管理器定位（macOS / Linux）时行内显示打开目录按钮 */
  platform: string
  /** 待重启的 owner/repo 集合；用于区分「待重启」与「已重启仍加载失败」 */
  pendingRestarts: string[]
  onOpenDetail: (item: InstalledItem) => void
  onReveal: (item: InstalledItem) => void
  /** 更新：仅目录插件且有更新时触发（自定义安装无目录信号可比） */
  onUpdate: (item: InstalledItem) => void
  onUninstall: (item: InstalledItem) => void
  /** 重启宿主：待重启条目行内按钮触发（装完未挂载的插件重启后生效） */
  onRestart: () => void
}) {
  const [query, setQuery] = useState('')
  /** 默认按「最近安装」排序（最新在前）；点其他排序按钮用该排序的默认方向（Star/Fork 最多在前、名称正序） */
  const [sort, setSort] = useState<InstalledSortKey>('sortInstalledAt')
  /** 当前排序方向：点同一个排序按钮切换 正/倒序；点新排序用该排序的默认方向 */
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  /** 已安装列表的来源筛选：全部 / 目录收录 / 自定义安装（单选按钮组） */
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')

  /** 点击排序按钮：同一按钮切换正/倒序，新按钮用默认方向 */
  function pickSort(key: InstalledSortKey) {
    if (key === sort) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSort(key); setSortDir(SORT_DEFAULT_DIR[key]) }
  }

  // 搜索 + 排序后的展示列表：搜索命中名称/包名/仓库/描述；排序支持名称/最近安装/Star/Fork
  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = items.filter((item) => {
      if (!q) return true
      return (item.plugin?.displayName ?? item.name).toLowerCase().includes(q)
        || item.name.toLowerCase().includes(q)
        || (item.repo ?? '').toLowerCase().includes(q)
        || (item.plugin?.description ?? '').toLowerCase().includes(q)
    })
    const dir = sortDir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      if (sort === 'sortName') return (a.plugin?.displayName ?? a.name).localeCompare(b.plugin?.displayName ?? b.name) * dir
      // Star / Fork：目录插件按数量比较（正/倒序随 dir）；自定义安装（无目录数据，stats 缺失）永远排最后
      if (sort === 'sortStars' || sort === 'sortForks') {
        const metric = sort === 'sortStars' ? 'stargazers_count' : 'forks_count'
        const sa = a.plugin?.stats?.[metric]
        const sb = b.plugin?.stats?.[metric]
        if (sa == null && sb == null) return 0
        if (sa == null) return 1
        if (sb == null) return -1
        return (sa - sb) * dir
      }
      // 最近安装：按安装时间比较；无安装时间记录的永远排最后
      const av = a.installedAt ?? ''
      const bv = b.installedAt ?? ''
      if (av === bv) return 0
      if (av === '') return 1
      if (bv === '') return -1
      return av.localeCompare(bv) * dir
    })
  }, [items, query, sort, sortDir])

  const catalogItems = list.filter((item) => item.plugin !== null)
  const customItems = list.filter((item) => item.plugin === null)
  // 已安装列表：搜索 + 排序后，再按来源筛选（全部 / 目录收录 / 自定义安装）
  const filtered = sourceFilter === 'all' ? list
    : sourceFilter === 'catalog' ? catalogItems : customItems

  // 行列表公共参数：macOS 文案特指 Finder，Windows / Linux 用通用「在文件夹中显示」
  const rowListProps = {
    t, langKey,
    canReveal: platform === 'darwin' || platform === 'win32' || platform === 'linux',
    revealLabel: platform === 'darwin' ? t('revealFolder') : t('openFolder'),
    pendingRestarts,
    onOpenDetail, onReveal, onUpdate, onUninstall, onRestart,
  }

  // 工具栏：第一行搜索框撑满，第二行来源筛选按钮组 + 排序按钮组（单选按钮组形态）
  const listToolbar = h('div', { className: styles.toolbar },
    h('div', { className: styles.searchWrap },
      h('input', {
        className: styles.searchInput,
        type: 'search',
        placeholder: t('installedSearch'),
        value: query,
        spellCheck: false,
        onInput: (e: FormEvent<HTMLInputElement>) =>
          setQuery((e.target as HTMLInputElement).value),
      }),
    ),
    h('div', { className: styles.segRow },
      h('span', { className: styles.segLabel }, t('filterByLabel')),
      h('div', { className: styles.segGroup, role: 'radiogroup', 'aria-label': t('filterByLabel') },
        SegBtn({ active: sourceFilter === 'all', onClick: () => setSourceFilter('all'), label: t('all') }),
        SegBtn({ active: sourceFilter === 'catalog', onClick: () => setSourceFilter('catalog'), label: t('installedFilterCatalog') }),
        SegBtn({ active: sourceFilter === 'custom', onClick: () => setSourceFilter('custom'), label: t('customLabel') }),
      ),
      h('span', { className: styles.segLabel }, t('sortByLabel')),
      h('div', { className: styles.segGroup, role: 'radiogroup', 'aria-label': t('sortAria') },
        INSTALLED_SORTS.map((key) => SegBtn({
          active: sort === key,
          onClick: () => pickSort(key),
          label: t(key),
          icon: sort === key ? h(SortArrowIcon, { up: sortDir === 'asc' }) : null,
        })),
      ),
    ),
  )

  return h('div', { className: styles.root },
    listToolbar,
    // 筛选后的列表；一个都没装 → 引导空态，搜索/筛选无结果 → 无结果空态
    filtered.length === 0
      ? items.length === 0
        ? h('div', { className: styles.empty },
          h('div', { className: styles.emptyTitle }, t('installedEmpty')),
          h('div', { className: styles.emptyDesc }, t('installedEmptyDesc')),
        )
        : h('div', { className: styles.empty },
          h('div', { className: styles.emptyTitle }, t('noResult')),
          h('div', { className: styles.emptyDesc }, t('noResultDesc')),
        )
      : h(RowList, { items: filtered, ...rowListProps }),
  )
}
