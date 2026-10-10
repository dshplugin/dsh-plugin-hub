/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Hub 版本信息 / 自我更新说明弹窗：
 *  - 有更新（state='available'）：标题「有新版本」，展示新版本号、发布时间与 Worker 下发的
 *    Markdown 变更记录（renderMarkdown 渲染，双语言按界面语言取 {zh,en} 对象），
 *    按钮「稍后再说 / 直接更新」，确认后进入安装弹窗执行覆盖重装。
 *  - 暂缓提示（state='pending'）：远端确有新版本，但发布未满供应链安全门槛，pnpm 此时会
 *    静默回退到旧版本 —— 仍按「有新版本」展示，只给「稍后再说」，并说明稍后会自动提示。
 *  - 无更新 / 信息缺失（state='latest' / 'none'）：标题「当前版本」，版本号与本机版本取自
 *    currentVersion（构建注入的 PLUGIN_VERSION），**不得**用远端最新版号冒充本机版本。
 * 点击头部版本号（或「可更新」徽标）打开 —— 无论有无更新都能看到更新内容。
 */
import { createElement as h } from 'react'
import type { MouseEvent } from 'react'
import styles from '../../styles/Modal.module.css'
import type { HubUpdateInfo, HubUpdateState } from '../../types.ts'
import type { LocaleId, Translate } from '../../types.ts'
import { renderMarkdown } from '../../logic/renderMarkdown.ts'
import { CloseIcon } from '../ui/icons.tsx'

export function HubUpdateModal({ info, state, currentVersion, lang, t, onProceed, onClose }: {
  info: HubUpdateInfo
  lang: LocaleId
  t: Translate
  /** Hub 自我更新状态（见 types.ts）：决定标题 / 正文 / meta 版本号 / 按钮 */
  state: HubUpdateState
  /** 本机实际运行的版本 —— 「当前版本」与「暂缓提示」的版本号一律用它 */
  currentVersion: string
  /** 点「直接更新」：关闭本弹窗，进入安装弹窗的更新流程 */
  onProceed: () => void
  onClose: () => void
}) {
  const hasUpdate = state === 'available'
  const pending = state === 'pending'
  // 展示的版本号：提示更新/暂缓提示时是远端新版本；否则是本机当前版本
  const shownVersion = hasUpdate || pending ? info.version : currentVersion || info.version
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
        h('div', { className: styles.modalTitle }, t(hasUpdate || pending ? 'hubUpdateTitle' : 'hubCurrentTitle')),
        h('button', {
          className: styles.modalClose,
          'aria-label': t('confirmCancel'),
          onClick: () => onClose(),
        }, h(CloseIcon)),
      ),
      h('div', { className: styles.modalDesc },
        t(hasUpdate ? 'hubUpdateDesc' : pending ? 'hubPendingDesc' : 'hubCurrentDesc', { version: shownVersion })),
      h('div', { className: styles.hubUpdateMeta },
        h('span', { className: styles.hubUpdateMetaItem }, `${t('version')} ${shownVersion}`),
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
          : h('button', { className: styles.modalInstall, onClick: onClose }, t(pending ? 'hubUpdateLater' : 'hubUpToDate')),
      ),
    ),
  )
}
