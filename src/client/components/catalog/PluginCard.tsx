/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 目录列表里的单张插件卡片：名称/分类/verified 徽标、描述 + 标签、Star/Fork/日期
 * 统计，以及详情/安装/卸载动作。
 */
import { createElement as h } from 'react'
import styles from '../../styles/List.module.css'
import type { HubPlugin, LocaleId, Translate } from '../../types.ts'
import { CATEGORY_LABELS, categoryLabel } from '../../logic/constants.ts'
import { pluginDetailUrl } from '../../logic/urls.ts'
import { fmtStars, clockTime, relTime } from '../../logic/format.ts'

export function PluginCard({ plugin: p, copied, installedName, installedVersion, hasUpdate, updatePendingUntil, t, langKey, langPath, onInstall, onUninstall }: {
  plugin: HubPlugin
  copied: string | null
  installedName: (p: HubPlugin) => string | null
  /** 已安装版本号（安装时从目录信号记录；无 release 的仓库为空，无版本号可展示） */
  installedVersion: (p: HubPlugin) => string | null
  /** 已安装且目录有更新（有版本比版本、无版本比仓库更新时间）；冷却期复核未就绪时为 false */
  hasUpdate: (p: HubPlugin) => boolean
  /** 更新暂缓（新版本还没过冷却期）的可重试时刻（毫秒）；无则 null */
  updatePendingUntil: (p: HubPlugin) => number | null
  t: Translate
  langKey: LocaleId
  langPath: string
  /** 第二个参数标记「更新」（已安装目标的覆盖安装）：按钮/弹窗据此走更新语义 */
  onInstall: (p: HubPlugin, opts?: { update?: boolean }) => void
  onUninstall: (p: HubPlugin) => void
}) {
  const repo = p.source?.repo ?? ''
  const isCopied = copied === repo
  const pkg = installedName(p)
  const isInstalled = pkg !== null
  const update = hasUpdate(p)
  // 冷却期未到：更新确实存在但现在装不上，给确切时刻而不是让徽标悄悄消失
  const pendingUntil = isInstalled && !update ? updatePendingUntil(p) : null
  // 版本号展示：已安装 → 当前已装版本（最能反映用户状态）；未安装 → 目录最新版本
  const versionShown = isInstalled ? installedVersion(p) : p.version
  // 目录只下发作者 GitHub 账号，缺省时从仓库地址推导
  const author = p.ownerSlug ?? repo.split('/')[0]?.toLowerCase() ?? ''

  return h('div', { className: styles.card },
    h('div', { className: styles.cardMain },
      // 第一行只放名称 + 版本 + 更新状态：这三样是判断「这是什么、我装没装、要不要更新」的全部依据，
      // 必须始终可见；长仓库名在此行内省略号收尾，不把版本与更新徽标挤出去
      h('div', { className: styles.cardTitleRow },
        // 名称本身是通往主站详情页的链接：悬停变色即可点，省掉「先找按钮再点」的一步。
        // 无仓库地址时退回纯文本（没有可跳转的目标）
        repo
          ? h('a', {
            className: styles.cardTitle,
            href: pluginDetailUrl(p, langPath),
            target: '_blank',
            rel: 'noopener noreferrer',
            title: p.description ?? '',
          }, p.displayName ?? p.slug)
          : h('div', { className: styles.cardTitle, title: p.description ?? '' }, p.displayName ?? p.slug),
        // 版本号紧跟插件名称：有版本才显示（无 release 的仓库不展示版本号）
        versionShown ? h('span', { className: styles.versionBadge, title: t('version') }, versionShown) : null,
        // 已安装且有更新：醒目提示（有 release 比版本号、无 release 比仓库最近更新时间）
        update ? h('span', { className: styles.updateBadge, title: t('updateAvailableHint') }, t('updateAvailable')) : null,
        pendingUntil !== null
          ? h('span', { className: styles.updateBadge, title: t('updatePendingHint') }, t('updatePending', { time: clockTime(pendingUntil) }))
          : null,
      ),
      // 作者与分类同属背景信息：单独一行，不与名称抢宽度，也不参与是否要装/更新的判断
      (author || p.category || p.compatibility?.status === 'verified')
        ? h('div', { className: styles.cardBadgeRow },
          author ? h('span', { className: styles.authorBadge, title: t('author') }, `@${author}`) : null,
          p.category ? h('span', { className: styles.categoryBadge }, categoryLabel(CATEGORY_LABELS, p.category, langKey)) : null,
          p.compatibility?.status === 'verified'
            ? h('span', { className: styles.verified }, t('verified'))
            : null,
        )
        : null,
      // 描述始终显示：站点英文数据缺翻译时 description 回退成中文也照常展示 ——
      // 描述是了解插件的第一入口，语言不一致也不该省略。
      p.description ? h('p', { className: styles.desc }, p.description) : null,
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
          // 查看详情：未安装/已安装都始终显示，跳转官网详情页
          h('a', {
            className: styles.detailBtn,
            // 两级路径：/plugins/{ownerSlug}/{slug}；缺 ownerSlug 时从 repo 推导
            href: pluginDetailUrl(p, langPath),
            target: '_blank',
            rel: 'noopener noreferrer',
            title: p.slug,
          }, t('detail')),
          isInstalled
            // 已安装且有更新：按钮变「可更新」，点击直接覆盖安装（安装完成自动记录新版本）
            ? (update
              ? h('button', {
                className: styles.installBtnUpdate,
                title: t('updateAvailableHint'),
                onClick: () => onInstall(p, { update: true }),
              }, t('update'))
              : h('button', {
                className: styles.installBtnInstalled,
                disabled: true,
                title: t('installed'),
              }, t('installed')))
            // 未安装：按钮恒为「安装」，点击先弹信任确认；需在终端手动安装的插件
            //（webInstallable=false）按钮不额外变形，但弹窗内只给提示与复制命令通道，
            // 不提供一键安装按钮
            : h('button', {
              className: isCopied ? styles.installBtnCopied : styles.installBtn,
              // 文字恒定避免按钮宽度变化导致卡片跳动；点击先弹信任确认，
              // 弹窗内可选择复制命令或直接安装
              onClick: () => onInstall(p),
            }, t('install')),
          isInstalled
            // 已安装：卸载按钮（危险色），保留明确状态语义
            ? h('button', {
              className: styles.uninstallBtn,
              onClick: () => onUninstall(p),
            }, t('uninstall'))
            : null,
        )
        : null,
    ),
  )
}
