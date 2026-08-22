/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Hub 版本信息 / 自我更新说明弹窗：
 *  - 有更新（hasUpdate=true）：标题「有新版本」，展示新版本号、发布时间与 Worker 下发的
 *    Markdown 变更记录（renderMarkdown 渲染，双语言按界面语言取 {zh,en} 对象），
 *    按钮「稍后再说 / 直接更新」，确认后进入安装弹窗执行覆盖重装。
 *  - 无更新（hasUpdate=false）：标题「当前版本」，展示当前版本信息与更新记录，已是最新。
 * 点击头部版本号（或「可更新」徽标）打开 —— 无论有无更新都能看到更新内容。
 */
import { createElement as h } from 'react'
import type { MouseEvent } from 'react'
import styles from '../styles/Modal.module.css'
import type { HubUpdateInfo } from '../lib/catalog.ts'
import type { LocaleId, Translate } from '../types.ts'
import { renderMarkdown } from '../lib/renderMarkdown.ts'
import { CloseIcon } from './icons.tsx'

export function HubUpdateModal({ info, lang, t, hasUpdate, onProceed, onClose }: {
  info: HubUpdateInfo
  lang: LocaleId
  t: Translate
  /** 是否有可用更新：有则显示「直接更新」，无则显示「已是最新」 */
  hasUpdate: boolean
  /** 点「直接更新」：关闭本弹窗，进入安装弹窗的更新流程 */
  onProceed: () => void
  onClose: () => void
}) {
  // 变更记录：字符串直接使用；{zh,en} 对象按界面语言取，缺哪种补哪种，全缺则不出记录区
  const notesRaw = typeof info.notes === 'string'
    ? info.notes
    : info.notes && typeof info.notes === 'object'
      ? lang === 'en'
        ? (info.notes.en ?? info.notes.zh ?? '')
        : (info.notes.zh ?? info.notes.en ?? '')
      : ''
  const notesHtml = notesRaw.trim() ? renderMarkdown(notesRaw) : null
  // 发布时间：ISO 字符串转本地可读格式；非法值静默隐藏
  let published: string | null = null
  if (info.publishedAt) {
    const d = new Date(info.publishedAt)
    if (!Number.isNaN(d.getTime())) {
      published = d.toLocaleString(lang === 'en' ? 'en-US' : 'zh-CN')
    }
  }

  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
  },
    h('div', { className: `${styles.modal} ${styles.hubUpdateModal}`, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        h('div', { className: styles.modalTitle }, t(hasUpdate ? 'hubUpdateTitle' : 'hubCurrentTitle')),
        h('button', {
          className: styles.modalClose,
          'aria-label': t('confirmCancel'),
          onClick: () => onClose(),
        }, h(CloseIcon)),
      ),
      h('div', { className: styles.modalDesc },
        t(hasUpdate ? 'hubUpdateDesc' : 'hubCurrentDesc', { version: info.version })),
      h('div', { className: styles.hubUpdateMeta },
        h('span', { className: styles.hubUpdateMetaItem }, `${t('version')} ${info.version}`),
        published
          ? h('span', { className: styles.hubUpdateMetaItem }, `${t('hubUpdatePublished')} ${published}`)
          : null,
      ),
      notesHtml
        ? h('div', {
          className: styles.hubUpdateNotes,
          dangerouslySetInnerHTML: { __html: notesHtml },
        })
        : null,
      h('div', { className: styles.modalActions },
        hasUpdate
          ? [
            h('button', { className: styles.restartLater, onClick: onClose }, t('hubUpdateLater')),
            h('button', { className: styles.modalInstall, onClick: onProceed }, t('updateNow')),
          ]
          : h('button', { className: styles.modalInstall, onClick: onClose }, t('hubUpToDate')),
      ),
    ),
  )
}
