/**
 * dsh-plugin-hub client: a native "Plugin Hub" settings section that renders
 * the community marketplace (dsh-plugin.org) as a first-class catalog —
 * category tabs (11 categories + All), search, sorting and one-click
 * install-command copy. Plugin data is served same-origin by the node half
 * at /dsh-plugin-hub/data.{zh,en}.json, so the browser bundle stays small.
 *
 * Built by tsdown into the __ModuleLoader__ factory bundle at client/client.js.
 */
import { createElement as h, useEffect, useMemo, useRef, useState } from 'react'
import styles from './Section.module.css'
import { en, zh } from './locales.ts'

const NS = 'dsh-plugin-hub'
const SITE_URL = 'https://dsh-plugin.org/'

type LocaleId = 'zh' | 'en'

/** The subset of the locale service this plugin touches. */
interface LocaleService {
  register(namespace: string, dicts: { zh: Record<string, string>; en: Record<string, string> }): unknown
  bind(namespace: string): (key: string, params?: Record<string, string | number>) => string
  getSnapshot(): { active: LocaleId }
  subscribe(fn: () => void): () => void
}

/** The subset of the slots service this plugin touches. */
interface SlotsService {
  inject(slot: string, register: () => unknown): void
  register(meta: Record<string, unknown>, component: () => unknown): unknown
}

/** The client cordis context shape this plugin relies on (structural). */
interface HubClientContext {
  effect(callback: () => unknown, label?: string): void
  slots: SlotsService
  locale: LocaleService
}

interface SectionProps {
  t: (key: string, params?: Record<string, string | number>) => string
  locale: LocaleService
}

/** Slim projection of the site's DirectoryPlugin entries. */
interface HubPlugin {
  /** 作者小写 key，与 slug 共同构成唯一身份（两级路径 /plugins/{ownerSlug}/{slug}）；旧数据可能缺省 */
  ownerSlug?: string
  slug: string
  displayName?: string
  category?: string
  topics?: string[]
  features?: string[]
  description?: string
  source?: { repo?: string }
  compatibility?: { status?: string }
  dates?: { repoUpdatedAt?: string; addedAt?: string }
  stats?: { stargazers_count?: number; forks_count?: number }
}

const CATEGORY_ORDER = [
  'interface', 'session', 'memory', 'tools', 'agent', 'workflow',
  'integration', 'model', 'dev', 'knowledge', 'fun',
]

/**
 * 兼容两种数据源结构：
 *  - 在线 API（dsh-plugin.org/api/plugins.{lang}.json）：已过滤 verified，且字段为短 key（s/o/n/c/t/f/d/r/v/u/a/sg/fk）；
 *  - 内置快照（/dsh-plugin-hub/data.{lang}.json）：站点原始长字段。
 * 统一归一化为 HubPlugin，保证渲染逻辑只认一种结构。
 */
function normalize(raw: Record<string, unknown>): HubPlugin {
  if (typeof raw.s === 'string') {
    return {
      slug: raw.s,
      ownerSlug: typeof raw.o === 'string' ? raw.o : undefined,
      displayName: typeof raw.n === 'string' ? raw.n : undefined,
      category: typeof raw.c === 'string' ? raw.c : undefined,
      topics: Array.isArray(raw.t) ? (raw.t as string[]) : undefined,
      features: Array.isArray(raw.f) ? (raw.f as string[]) : undefined,
      description: typeof raw.d === 'string' ? raw.d : undefined,
      source: typeof raw.r === 'string' ? { repo: raw.r } : undefined,
      compatibility: typeof raw.v === 'string' ? { status: raw.v } : undefined,
      dates: {
        repoUpdatedAt: typeof raw.u === 'string' ? raw.u : undefined,
        addedAt: typeof raw.a === 'string' ? raw.a : undefined,
      },
      stats: {
        stargazers_count: typeof raw.sg === 'number' ? raw.sg : undefined,
        forks_count: typeof raw.fk === 'number' ? raw.fk : undefined,
      },
    }
  }
  return raw as unknown as HubPlugin
}

const CATEGORY_LABELS: Record<string, { zh: string; en: string }> = {
  interface: { zh: '界面与体验', en: 'UI & Experience' },
  session: { zh: '会话与消息', en: 'Sessions & Messages' },
  memory: { zh: '记忆与上下文', en: 'Memory & Context' },
  tools: { zh: '工具与能力', en: 'Tools & Capabilities' },
  agent: { zh: '技能与智能体', en: 'Skills & Agents' },
  workflow: { zh: '工作流与自动化', en: 'Workflow & Automation' },
  integration: { zh: '集成与连接', en: 'Integrations & Connections' },
  model: { zh: '模型与推理', en: 'Models & Reasoning' },
  dev: { zh: '开发与运维', en: 'Development & Operations' },
  knowledge: { zh: '数据与知识', en: 'Data & Knowledge' },
  fun: { zh: '娱乐', en: 'Entertainment' },
}

const CATEGORY_SHORT_LABELS: Record<string, { zh: string; en: string }> = {
  interface: { zh: '界面体验', en: 'UI Exp' },
  session: { zh: '会话消息', en: 'Sessions' },
  memory: { zh: '记忆上下文', en: 'Memory' },
  tools: { zh: '工具能力', en: 'Tools' },
  agent: { zh: '技能智能体', en: 'Agents' },
  workflow: { zh: '工作流', en: 'Workflow' },
  integration: { zh: '集成连接', en: 'Integrations' },
  model: { zh: '模型推理', en: 'Models' },
  dev: { zh: '开发运维', en: 'Dev' },
  knowledge: { zh: '数据知识', en: 'Knowledge' },
  fun: { zh: '娱乐', en: 'Fun' },
}

const SORTS = ['sortStars', 'sortUpdated', 'sortNewest'] as const
type SortKey = (typeof SORTS)[number]

function fmtStars(count?: number): string {
  if (!count || count <= 0) return '0'
  if (count < 1000) return String(count)
  const k = count / 1000
  return `${k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, '')}k`
}

function relTime(iso: string | undefined, t: SectionProps['t']): string {
  if (!iso) return ''
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days <= 0) return t('today')
  if (days < 30) return t('daysAgo', { days })
  if (days < 365) return t('monthsAgo', { months: Math.floor(days / 30) })
  return t('yearsAgo', { years: Math.floor(days / 365) })
}

function PluginHubSection({ t: _hostT, locale }: SectionProps) {
  const [lang, setLang] = useState<LocaleId>(locale.getSnapshot().active)
  const [plugins, setPlugins] = useState<HubPlugin[] | null>(null)
  /** 收录/精选统计（官网 /api/stats.json 实时拉取，失败时由本地快照兜底计算） */
  const [stats, setStats] = useState<{ total: number; verified: number } | null>(null)
  const [failed, setFailed] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('sortStars')
  const [copied, setCopied] = useState<string | null>(null)
  /** 全局复制成功 Toast：{id} 用于重复点击时重新触发入场动画 */
  const [toast, setToast] = useState<{ id: number } | null>(null)
  /** 列表滚动容器：分类/搜索切换后列表内容替换但 scrollTop 保留，会让用户误以为列表没更新，需重置回顶部 */
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 })
  }, [category])

  useEffect(() => locale.subscribe(() => setLang(locale.getSnapshot().active)), [locale])

  useEffect(() => {
    let cancelled = false
    setPlugins(null)
    setStats(null)
    setFailed(false)
    const apply = (data: unknown) => {
      if (cancelled) return
      // 在线 API 已只返回 verified；快照兜底时再过滤一次，保证只展示人工验证通过的插件。
      const list = (Array.isArray(data) ? data : []).map((item) => normalize(item as Record<string, unknown>))
      setPlugins(list.filter((p) => p.compatibility?.status === 'verified'))
    }
    const fail = () => {
      if (!cancelled) setFailed(true)
    }
    const fetchData = (url: string): Promise<unknown> =>
      fetch(url).then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.json()
      })
    // 优先在线拉取最新数据（dsh-plugin.org，走 CDN 缓存），插件不发布也能拿到每日更新；
    // 拉取失败时回退到插件内置快照，保证离线也能浏览。
    const remote = `https://dsh-plugin.org/api/plugins.${lang}.json`
    fetchData(remote).then(apply).catch(() => fetchData(`/dsh-plugin-hub/data.${lang}.json`).then(apply).catch(fail))
    // 收录/精选统计：在线 /api/stats.json 优先；失败时从内置完整快照本地计算，保证数字真实不写死。
    const applyStats = (s: { total: number; verified: number }) => {
      if (!cancelled && s && typeof s.total === 'number' && typeof s.verified === 'number') setStats(s)
    }
    fetchData('https://dsh-plugin.org/api/stats.json')
      .then((s) => applyStats(s as { total: number; verified: number }))
      .catch(() => fetchData(`/dsh-plugin-hub/data.${lang}.json`).then((data) => {
        const list = (Array.isArray(data) ? data : []).map((item) => normalize(item as Record<string, unknown>))
        applyStats({
          total: list.length,
          verified: list.filter((p) => p.compatibility?.status === 'verified').length,
        })
      }).catch(() => {}))
    return () => { cancelled = true }
  }, [lang, reloadKey])

  const visible = useMemo(() => {
    if (!plugins) return []
    const q = query.trim().toLowerCase()
    const list = plugins.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (!q) return true
      return (
        (p.displayName ?? '').toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q) ||
        (p.topics ?? []).some((topic) => topic.toLowerCase().includes(q))
      )
    })
    return [...list].sort((a, b) => {
      if (sort === 'sortStars') return (b.stats?.stargazers_count ?? 0) - (a.stats?.stargazers_count ?? 0)
      if (sort === 'sortNewest') return (b.dates?.addedAt ?? '').localeCompare(a.dates?.addedAt ?? '')
      return (b.dates?.repoUpdatedAt ?? '').localeCompare(a.dates?.repoUpdatedAt ?? '')
    })
  }, [plugins, category, query, sort])

  const langKey: LocaleId = lang === 'en' ? 'en' : 'zh'
  // dsh-plugin.org keeps zh pages under the /zh/ prefix; en is the root.
  const langPath = lang === 'zh' ? 'zh/' : ''

  // 插件界面语言由组件自身 lang 控制（左上角 EN/中文 按钮），宿主的 t() 绑定宿主 locale、
  // 不跟随组件内 lang，因此这里基于本地字典自建翻译函数，保证切换语言后所有文本即时刷新。
  // （settings.section 的导航 label 仍在 apply 里用宿主 t()，跟随宿主语言。）
  const dict: Record<string, string> = langKey === 'en' ? en : zh
  const t = (key: string, params?: Record<string, string | number>): string => {
    const raw = dict[key] ?? key
    return params ? raw.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? '')) : raw
  }
  const catLabel = (map: Record<string, { zh: string; en: string }>, key: string): string =>
    map[key]?.[langKey] ?? key

  const copyInstall = async (repo: string) => {
    const text = `dsh plugin add ${repo}`
    let ok = false
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      // Clipboard API unavailable (permissions/iframe) — fall back to the
      // legacy hidden-textarea trick, which works in any context.
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        ok = document.execCommand('copy')
      } catch {
        ok = false
      }
      document.body.removeChild(ta)
    }
    if (ok) {
      setCopied(repo)
      setToast({ id: Date.now() })
      window.setTimeout(() => setCopied((cur) => (cur === repo ? null : cur)), 1600)
      window.setTimeout(() => setToast(null), 1800)
    } else {
      setCopied(null)
    }
  }

  const total = plugins?.length ?? 0
  const count = visible.length

  // Per-category plugin counts shown on the category chips.
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: total }
    for (const p of plugins ?? []) {
      if (p.category) counts[p.category] = (counts[p.category] ?? 0) + 1
    }
    return counts
  }, [plugins, total])

  return h('div', { className: styles.root },
    h('div', { className: styles.header },
      h('div', { className: styles.brand },
        h('div', { className: styles.brandText },
          // 市场主标题即本区块的 H1：与官网首页 H1 同文案（DSH-Plugin Hub for DeepSeek
          // Harness），命中品牌词 DSH-Plugin + 产品词 DeepSeek Harness；关键词落在 tagline。
          h('h1', { className: styles.title }, t('title')),
          h('div', { className: styles.tagline }, t('tagline', { total: statsTotal, verified: statsVerified })),
        ),
      ),
      h('div', { className: styles.controls },
        h('input', {
          className: styles.search,
          type: 'search',
          placeholder: t('search'),
          value: query,
          spellCheck: false,
          onInput: (e: React.FormEvent<HTMLInputElement>) =>
            setQuery((e.target as HTMLInputElement).value),
        }),
        h('select', {
          className: styles.sort,
          value: sort,
          onChange: (e: React.FormEvent<HTMLSelectElement>) =>
            setSort((e.target as HTMLSelectElement).value as SortKey),
        }, SORTS.map((key) => h('option', { key, value: key }, t(key)))),
        h('button', {
          className: styles.langBtn,
          title: lang === 'zh' ? t('toEn') : t('toZh'),
          onClick: () => setLang(lang === 'zh' ? 'en' : 'zh'),
        }, lang === 'zh' ? 'EN' : '中文'),
        h('a', {
          className: styles.openBtn,
          href: `${SITE_URL}${langPath}`,
          target: '_blank',
          rel: 'noopener noreferrer',
          title: t('openHint'),
        }, t('openBtn'), h('span', { className: styles.openArrow }, '\u2197')),
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

    h('div', { className: styles.tabs },
      h('button', {
        key: 'all',
        className: category === 'all' ? styles.tabActive : styles.tab,
        onClick: () => setCategory('all'),
      },
      t('all'),
      h('span', { className: category === 'all' ? styles.tabCountActive : styles.tabCount }, total)),
      CATEGORY_ORDER.map((id) => h('button', {
        key: id,
        className: category === id ? styles.tabActive : styles.tab,
        onClick: () => setCategory(id),
      },
      catLabel(CATEGORY_SHORT_LABELS, id),
      h('span', { className: category === id ? styles.tabCountActive : styles.tabCount }, categoryCounts[id] ?? 0))),
    ),

    h('div', { className: styles.body },
      h('div', { ref: listRef, className: styles.list },
        plugins === null && !failed && h('div', { className: styles.state }, t('loading')),
        failed && h('div', { className: styles.state },
          h('div', { className: styles.stateTitle }, t('failed')),
          h('div', { className: styles.stateDesc }, t('failedDesc')),
          h('button', { className: styles.retryBtn, onClick: () => setReloadKey((k) => k + 1) }, t('retry')),
        ),
        plugins !== null && !failed && count === 0 && h('div', { className: styles.state },
          h('div', { className: styles.stateTitle }, t('noResult')),
          h('div', { className: styles.stateDesc }, t('noResultDesc')),
        ),
        plugins !== null && !failed && visible.map((p) => {
          const repo = p.source?.repo ?? ''
          const isCopied = copied === repo
          return h('div', {
            // 唯一 key：数据重构后同一 slug 可能对应多个作者仓库，仅用 slug 会撞 key，
            // 导致切换分类时 React 复用旧 DOM、列表不刷新。
            key: p.ownerSlug ? `${p.ownerSlug}/${p.slug}` : p.slug,
            className: styles.card,
          },
            h('div', { className: styles.cardMain },
              h('div', { className: styles.cardHead },
                h('div', { className: styles.cardTitle, title: p.description ?? '' }, p.displayName ?? p.slug),
                p.category ? h('span', { className: styles.categoryBadge }, catLabel(CATEGORY_LABELS, p.category)) : null,
                p.compatibility?.status === 'verified'
                  ? h('span', { className: styles.verified }, t('verified'))
                  : null,
              ),
              // 英文模式下隐藏仍为中文的描述：站点英文数据缺翻译时 description 会回退成中文，
              // 不显示可保证界面语言一致，不残留中文字符。
              p.description && (langKey === 'zh' || !/[\u4e00-\u9fff]/.test(p.description))
                ? h('p', { className: styles.desc }, p.description)
                : null,
              (p.topics?.length ?? 0) > 0
                ? h('div', { className: styles.topics },
                  p.topics!.slice(0, 3).map((topic) => h('span', { key: topic, className: styles.topic }, topic)),
                )
                : null,
            ),
            h('div', { className: styles.cardSide },
              h('div', { className: styles.stats },
                h('span', { className: styles.star }, '\u2605 ', fmtStars(p.stats?.stargazers_count)),
                h('span', { className: styles.fork }, t('fork'), ' ', fmtStars(p.stats?.forks_count)),
                h('span', { className: styles.date }, relTime(p.dates?.repoUpdatedAt, t)),
              ),
              repo
                ? h('div', { className: styles.actions },
                  h('a', {
                    className: styles.detailBtn,
                    // 两级路径：/plugins/{ownerSlug}/{slug}；旧数据缺 ownerSlug 时从 repo 推导
                    href: `${SITE_URL}${langPath}plugins/${p.ownerSlug ?? repo.split('/')[0]?.toLowerCase() ?? ''}/${p.slug}`,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    title: p.slug,
                  }, t('detail')),
                  h('button', {
                    className: isCopied ? styles.installBtnCopied : styles.installBtn,
                    // 文字恒定避免按钮宽度变化导致卡片跳动；成功反馈 = 蓝底高亮 + 右下角 Toast
                    onClick: () => copyInstall(repo),
                  }, t('copy')),
                )
                : null,
            ),
          )
        }),
      ),
      plugins !== null && !failed && h('div', { className: styles.footer },
        h('span', { className: styles.footText }, count === total ? t('pluginsTotal', { n: total }) : t('filteredCount', { n: count })),
        h('a', {
          className: styles.footLink,
          href: `${SITE_URL}${langPath}`,
          target: '_blank',
          rel: 'noopener noreferrer',
        }, t('browseAll', { n: total })),
      ),
    ),
    // 复制成功提示条：右下角纯黑色文字条，1800ms 后自动消失
    toast && h('div', { key: toast.id, className: styles.toast }, t('toastCopied')),
  )
}

export const name = NS
export const inject = ['slots', 'locale']

export function apply(ctx: HubClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-plugin-hub: dictionaries')
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: NS,
    order: 60,
    label: () => t('nav'),
    locale: NS,
    inject: () => ({ t, locale: ctx.locale }),
  }, () => h(PluginHubSection, { t, locale: ctx.locale })))
}
