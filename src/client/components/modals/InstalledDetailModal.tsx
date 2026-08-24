/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Installed-plugin detail dialog: opens from the Installed view (row click
 * or the detail button) and shows everything we know about an installed
 * entry — the catalog metadata (category, catalog entry, stars/forks,
 * latest version) merged with the host runtime facts (install path, installed
 * version, install time, last update). Update / uninstall actions are
 * offered from here too, mirroring the row actions.
 */
import { createElement as h } from 'react'
import type { MouseEvent } from 'react'
import styles from '../../styles/Modal.module.css'
import type { LocaleId, Translate } from '../../types.ts'
import type { InstalledItem } from '../../logic/installed.ts'
import { CATEGORY_LABELS, categoryLabel } from '../../logic/constants.ts'
import { pluginDetailUrl } from '../../logic/urls.ts'
import { fmtStars } from '../../logic/format.ts'
import { CloseIcon, CopyIcon, FolderIcon, LinkIcon } from '../ui/icons.tsx'

/** ISO 安装时间 → 本地可读；非法值返回 null（行内不显示）。 */
function fmtDate(iso: string | null, lang: LocaleId): string | null {
  if (!iso) return null
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d.toLocaleString(lang === 'en' ? 'en-US' : 'zh-CN')
}

export function InstalledDetailModal({ item, t, lang, langPath, onClose, onUpdate, onUninstall, onCopyPath, onReveal }: {
  item: InstalledItem
  t: Translate
  lang: LocaleId
  langPath: string
  onClose: () => void
  /** 更新：仅目录插件且有更新时展示（点击后关闭详情、走安装确认弹窗的更新语义） */
  onUpdate: (item: InstalledItem) => void
  onUninstall: (item: InstalledItem) => void
  /** 复制安装路径：成功提示由调用方 toast 反馈 */
  onCopyPath: (path: string) => void
  /** 在系统文件管理器里定位安装目录（服务端 spawn open）：失败提示由调用方 toast 反馈 */
  onReveal: (item: InstalledItem) => void
}) {
  const p = item.plugin
  const name = p?.displayName ?? item.name
  const installedAt = fmtDate(item.installedAt, lang)
  // 最后更新：目录插件取仓库最近提交时间（live 数据）；自定义安装无目录信号
  const lastUpdated = fmtDate(p?.dates?.repoUpdatedAt ?? null, lang)
  const hasUpdate = item.hasUpdate && item.plugin !== null

  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
  },
    h('div', { className: `${styles.modal} ${styles.detailModal}`, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        h('div', { className: styles.modalTitle }, name),
        h('button', {
          className: styles.modalClose,
          'aria-label': t('confirmCancel'),
          onClick: onClose,
        }, h(CloseIcon)),
      ),
      h('div', { className: styles.modalBody },
        // 描述：目录收录的插件简介
        p?.description ? h('div', { className: styles.modalDesc }, p.description) : null,
        // 有可用更新：醒目提示条（版本号存在时给出升级路径）
        hasUpdate
          ? h('div', { className: styles.detailUpdateHint },
            item.installedVersion && item.catalogVersion
              ? t('versionUpHint', { from: item.installedVersion, to: item.catalogVersion })
              : t('updateAvailableHint'))
          : null,
        // 详情信息网格：分类 / 状态 / 版本 / 收录入口 / 包名 / 统计 / 安装路径 / 安装时间 / 最后更新
        h('div', { className: styles.detailGrid },
          p?.category
            ? h('div', { className: styles.detailRow },
              h('span', { className: styles.detailLabel }, t('detailCategory')),
              h('span', { className: styles.detailValue },
                categoryLabel(CATEGORY_LABELS, p.category, lang)))
            : null,
          h('div', { className: styles.detailRow },
            h('span', { className: styles.detailLabel }, t('statusLabel')),
            h('span', { className: styles.detailValue },
              h('span', {
                className: item.loaded ? styles.detailStatusRunning : styles.detailStatusPending,
                'aria-hidden': 'true',
              }),
              h('span', { className: styles.detailStatusText },
                item.loaded ? t('statusRunning') : t('statusPending')))),
          item.installedVersion
            ? h('div', { className: styles.detailRow },
              h('span', { className: styles.detailLabel }, t('installedVersionLabel')),
              h('span', { className: styles.detailValue },
                h('span', { className: styles.detailMono }, item.installedVersion),
                // 目录有更新版本且与已装版本不同：给出「→ 目录最新」
                item.catalogVersion && item.catalogVersion !== item.installedVersion
                  ? h('span', { className: styles.detailArrow },
                    '\u2192', h('span', { className: styles.detailMono }, item.catalogVersion),
                    h('span', { className: styles.detailDim }, t('catalogLatest')))
                  : null))
            : null,
          // 收录入口：仓库名 → 官网详情页（目录插件跳收录页；自定义安装回退到 GitHub 仓库）
          item.repo
            ? h('div', { className: styles.detailRow },
              h('span', { className: styles.detailLabel }, t('detailCatalog')),
              h('a', {
                className: styles.detailLink,
                href: p ? pluginDetailUrl(p, langPath) : `https://github.com/${item.repo}`,
                target: '_blank',
                rel: 'noopener noreferrer',
                title: item.repo,
              }, h(LinkIcon), item.repo))
            : null,
          item.plugin?.source?.npmPackage
            ? h('div', { className: styles.detailRow },
              h('span', { className: styles.detailLabel }, t('packageName')),
              h('span', { className: styles.detailValue },
                h('span', { className: styles.detailMono }, item.plugin.source.npmPackage)))
            : null,
          p?.stats && (p.stats.stargazers_count ?? 0) > 0
            ? h('div', { className: styles.detailRow },
              h('span', { className: styles.detailLabel }, t('detailStats')),
              h('span', { className: styles.detailValue },
                h('span', { className: styles.detailStars }, '\u2605 ', fmtStars(p.stats.stargazers_count)),
                h('span', { className: styles.detailDim }, t('fork'), ' ', fmtStars(p.stats.forks_count))))
            : null,
          item.installPath
            ? h('div', { className: styles.detailRow },
              h('span', { className: styles.detailLabel }, t('installPath')),
              h('div', { className: styles.detailPath },
                // 整条点击复制路径（等宽文本省略号）
                h('span', {
                  className: styles.detailPathText,
                  title: t('copyPath'),
                  onClick: () => onCopyPath(item.installPath!),
                }, item.installPath),
                h('span', { className: styles.detailPathActions },
                  h('button', {
                    className: styles.detailPathBtn,
                    type: 'button',
                    title: t('copyPath'),
                    onClick: (e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation()
                      onCopyPath(item.installPath!)
                    },
                  }, h(CopyIcon)),
                  h('button', {
                    className: styles.detailPathBtn,
                    type: 'button',
                    title: t('openFolder'),
                    onClick: (e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation()
                      onReveal(item)
                    },
                  }, h(FolderIcon)),
                )))
            : null,
          installedAt
            ? h('div', { className: styles.detailRow },
              h('span', { className: styles.detailLabel }, t('installedAtLabel')),
              h('span', { className: styles.detailValue }, installedAt))
            : null,
          // 最后更新时间：与安装时间成对展示（目录插件才有）
          lastUpdated
            ? h('div', { className: styles.detailRow },
              h('span', { className: styles.detailLabel }, t('lastUpdatedLabel')),
              h('span', { className: styles.detailValue }, lastUpdated))
            : null,
        ),
      ),
      // 底部操作：完成 / 更新 / 卸载（复制路径与打开文件夹已在路径行内）
      h('div', { className: styles.modalActions },
        h('button', {
          className: styles.restartLater,
          onClick: onClose,
        }, t('done')),
        hasUpdate
          ? h('button', {
            className: styles.modalInstall,
            onClick: () => onUpdate(item),
          }, t('update'))
          : null,
        h('button', {
          className: styles.uninstallConfirm,
          onClick: () => onUninstall(item),
        }, t('uninstall')),
      ),
    ),
  )
}
