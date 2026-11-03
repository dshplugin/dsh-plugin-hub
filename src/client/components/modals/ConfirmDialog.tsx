/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 通用确认弹窗 —— 应用里所有「确定吗？」问题的唯一入口。规则：任何询问都必须是
 * 弹窗，绝不用按钮内双击。
 *
 * 中间的图标一眼说明类型：常规确认（安装/更新/重启/忽略）用蓝色问号，
 * 危险操作（清空/删除/卸载/重置）用红色动作图形。
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
  /** 确认动作进行中：禁用按钮防止二次点击 */
  busy?: boolean
  /** 进行中时确认按钮文案（如「清空中…」）；缺省沿用 confirmLabel */
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
