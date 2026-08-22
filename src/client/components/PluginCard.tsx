/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * One plugin card in the catalog list: name/category/verified badge,
 * description + topics, star/fork/date stats, and the detail/install/
 * uninstall actions.
 */
import { createElement as h } from 'react'
import styles from '../styles/List.module.css'
import type { HubPlugin, LocaleId, Translate } from '../types.ts'
import { CATEGORY_LABELS, categoryLabel, pluginDetailUrl } from '../lib/catalog.ts'
import { fmtStars, relTime } from '../lib/format.ts'

export function PluginCard({ plugin: p, copied, installedName, installedVersion, hasUpdate, t, langKey, langPath, onInstall, onUninstall }: {
  plugin: HubPlugin
  copied: string | null
  installedName: (p: HubPlugin) => string | null
  /** 已安装版本号（安装时从目录信号记录；无 release 的仓库为空，无版本号可展示） */
  installedVersion: (p: HubPlugin) => string | null
  /** 已安装且目录有更新（有版本比版本、无版本比仓库更新时间） */
  hasUpdate: (p: HubPlugin) => boolean
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
  // 版本号展示：已安装 → 当前已装版本（最能反映用户状态）；未安装 → 目录最新版本
  const versionShown = isInstalled ? installedVersion(p) : p.version

  return h('div', { className: styles.card },
    h('div', { className: styles.cardMain },
      h('div', { className: styles.cardHead },
        h('div', { className: styles.cardTitle, title: p.description ?? '' }, p.displayName ?? p.slug),
        // 版本号紧跟插件名称：有版本才显示（无 release 的仓库不展示版本号）
        versionShown ? h('span', { className: styles.versionBadge, title: t('version') }, versionShown) : null,
        // 已安装且有更新：醒目提示（有 release 比版本号、无 release 比仓库最近更新时间）
        update ? h('span', { className: styles.updateBadge, title: t('updateAvailableHint') }, t('updateAvailable')) : null,
        p.category ? h('span', { className: styles.categoryBadge }, categoryLabel(CATEGORY_LABELS, p.category, langKey)) : null,
        p.compatibility?.status === 'verified'
          ? h('span', { className: styles.verified }, t('verified'))
          : null,
      ),
      // 描述始终显示：站点英文数据缺翻译时 description 回退成中文也照常展示，
      // 描述是了解插件的第一入口，比隐藏更实用（不再为求语言一致而砍内容）。
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
            // 未安装：按钮恒为「安装」，点击先弹信任确认；AI 识别为「可能需要命令行辅助」
            // 的插件（webInstallable=false）不拦截，允许尝试一键安装，弹窗内会给出提示与
            // 复制命令通道，安装失败时引导去 dsh 终端手动执行
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
