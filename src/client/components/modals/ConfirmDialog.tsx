/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Generic confirm dialog — the single entry point for every "are you sure?"
 * question in the app. Rule: any question must be a modal dialog, never an
 * in-button double-click.
 *
 * The icon in the middle tells the type at a glance: a blue question mark
 * for routine confirmations (install / update / restart / ignore), a red
 * action glyph for destructive ones (clear / delete / uninstall / reset).
 */
import { createElement as h } from 'react'
import type { MouseEvent } from 'react'
import styles from '../../styles/Modal.module.css'
import type { Translate } from '../../types.ts'
import { CloseIcon, ConfirmIcon, type ConfirmIconType } from '../ui/icons.tsx'

/** 通用确认弹窗：标题 + 类型图标 + 描述 + 取消/确认按钮。
 *  type='question' → 蓝问号 + 品牌蓝确认按钮；危险类型 → 红图形 + 红色确认按钮。 */
export function ConfirmDialog({ type, title, desc, confirmLabel, cancelLabel, busy, busyLabel, t, onConfirm, onCancel }: {
  type: ConfirmIconType
  title: string
  desc?: string
  confirmLabel: string
  cancelLabel?: string
  /** 确认动作在途：禁用按钮防止二次点击 */
  busy?: boolean
  /** 在途时确认按钮文案（如「清空中…」）；缺省沿用 confirmLabel */
  busyLabel?: string
  t: Translate
  onConfirm: () => void
  onCancel: () => void
}) {
  const danger = type !== 'question'
  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onCancel() },
  },
    h('div', { className: styles.modal, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        h('div', { className: styles.modalTitle }, title),
        h('button', {
          className: styles.modalClose,
          type: 'button',
          'aria-label': t('errorClose'),
          onClick: onCancel,
        }, h(CloseIcon)),
      ),
      h('div', { className: styles.modalBody },
        h('div', { className: styles.confirmIconWrap },
          h(ConfirmIcon, { type }),
        ),
        desc ? h('div', { className: styles.modalDesc }, desc) : null,
        h('div', { className: styles.modalActions },
          h('button', {
            className: styles.restartLater,
            type: 'button',
            disabled: busy,
            onClick: onCancel,
          }, cancelLabel ?? t('confirmCancel')),
          h('button', {
            className: danger ? styles.dangerConfirm : styles.confirmPrimary,
            type: 'button',
            disabled: busy,
            onClick: onConfirm,
          }, busy && busyLabel ? busyLabel : confirmLabel),
        ),
      ),
    ),
  )
}
