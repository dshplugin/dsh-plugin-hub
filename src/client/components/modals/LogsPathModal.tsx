/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 日志存放位置弹窗：设置页不内联长表单（挡视线），点「修改」弹窗编辑。
 * 两种输入方式并存 —— 手输目录 / .log 文件路径，或点「选择目录」调系统
 * 原生文件夹对话框（服务端 spawn osascript / FolderBrowserDialog / zenity）。
 * 文本框预填当前生效位置，目录选择器也从该位置打开 —— 默认地址是动态的
 * （随用户主目录/平台变化，如 ~/.dsh/profiles/<profile>/hub.log），必须实时展示。
 * 留空或点「恢复默认」= 回到默认；保存前服务端预验证可写。
 */
import { createElement as h, useEffect, useState } from 'react'
import styles from '../../styles/Modal.module.css'
import view from '../../styles/LogsView.module.css'
import type { Translate } from '../../types.ts'
import { chooseLogDir } from '../../data/host.ts'
import { CloseIcon } from '../ui/icons.tsx'

export function LogsPathModal({ t, defaultPath, currentPath, onSaved, onClose }: {
  t: Translate
  /** 真正默认位置（服务端动态算出的 ~/.dsh/profiles/<profile>/hub.log），跨机器/平台不同 */
  defaultPath: string
  /** 当前生效的真实路径（可能已被自定义覆盖） */
  currentPath: string
  /** 保存成功回调（写入设置；父级据此刷新生效路径与日志列表） */
  onSaved: (value: string) => void
  onClose: () => void
}) {
  // 打开即显示当前生效位置 —— 用户一眼看到日志现在存在哪，也方便在此基础上微调
  const [draft, setDraft] = useState(currentPath)
  const [saving, setSaving] = useState(false)
  const [fail, setFail] = useState(false)
  const [browsing, setBrowsing] = useState(false)
  const [browseFail, setBrowseFail] = useState(false)

  // Esc 关闭：与其它弹窗交互一致
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  /** 保存：空串 = 回默认；填回默认位置同样按「未自定义」处理（设置里保持干净）。
   * 服务端预建目录验证可写，失败给出反馈。 */
  const save = async () => {
    if (saving) return
    setSaving(true)
    setFail(false)
    try {
      const value = draft.trim()
      const normalized = value === '' || value === defaultPath ? '' : value
      const res = await fetch('/dsh-plugin-hub/settings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ logPath: normalized }),
        cache: 'no-store',
      })
      if (!res.ok) {
        setFail(true)
        return
      }
      // 保存成功即关：主界面路径行随即刷新为新位置，本身就是反馈
      onSaved(normalized)
      onClose()
    } catch {
      setFail(true)
    } finally {
      setSaving(false)
    }
  }

  /** 选择目录：系统对话框从默认位置打开，选中路径回填输入框（仍可手改）。 */
  const browse = async () => {
    if (browsing) return
    setBrowsing(true)
    setBrowseFail(false)
    const picked = await chooseLogDir()
    setBrowsing(false)
    if (picked !== null) {
      setDraft(picked)
      setFail(false)
    } else {
      setBrowseFail(true)
    }
  }

  return h('div', {
    className: styles.overlay,
    onClick: (e: { target: unknown; currentTarget: unknown }) => {
      if (e.target === e.currentTarget) onClose()
    },
  },
    h('div', { className: `${styles.modal} ${styles.modalWide}`, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        h('div', { className: styles.modalTitle }, t('logPathSettingTitle')),
        h('button', {
          className: styles.modalClose,
          'aria-label': t('errorClose'),
          onClick: onClose,
        }, h(CloseIcon)),
      ),
      h('div', { className: styles.modalBody },
        h('div', { className: view.pathDialog },
          h('div', { className: view.pathDialogDesc }, t('logPathSettingDesc')),
          // 手输路径 + 系统目录选择器两条路并行
          h('div', { className: view.pathDialogRow },
            h('input', {
              type: 'text',
              className: view.pathDraft,
              value: draft,
              placeholder: t('logPathPlaceholder'),
              spellCheck: false,
              onChange: (e: { currentTarget: HTMLInputElement }) => {
                setDraft(e.currentTarget.value)
                setFail(false)
                setBrowseFail(false)
              },
            }),
            h('button', {
              type: 'button',
              className: view.btn,
              disabled: browsing,
              title: t('logPathBrowse'),
              onClick: () => void browse(),
            }, browsing ? t('logPathSaving') : t('logPathBrowse')),
          ),
          // 提示 + 「恢复默认」：提示左、动作右，一行内不挤
          h('div', { className: view.pathDialogReset },
            h('span', { className: view.pathDialogHint }, t('logPathResetHint')),
            h('button', {
              type: 'button',
              className: view.linkBtn,
              onClick: () => {
                setDraft(defaultPath)
                setFail(false)
                setBrowseFail(false)
              },
            }, t('logPathReset')),
          ),
          browseFail && h('div', { className: view.footFail }, t('logPathBrowseFail')),
          fail && h('div', { className: view.footFail }, t('logPathSaveFail')),
          h('div', { className: view.pathDialogFoot },
            h('button', {
              type: 'button',
              className: view.btn,
              disabled: saving,
              onClick: onClose,
            }, t('confirmCancel')),
            h('button', {
              type: 'button',
              className: `${view.btn} ${view.btnPrimary}`,
              disabled: saving,
              onClick: () => void save(),
            }, saving ? t('logPathSaving') : t('logPathSave')),
          ),
        ),
      ),
    ),
  )
}
