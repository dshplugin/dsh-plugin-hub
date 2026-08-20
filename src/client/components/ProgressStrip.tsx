/**
 * Inline progress panel: a queue-summary strip (click to expand/collapse)
 * showing each queued/running install-remove task with its progress and a
 * cancel button. Only rendered while no dialog is open.
 */
import { createElement as h } from 'react'
import styles from '../styles/Section.module.css'
import type { Translate } from '../types.ts'
import type { QueueTask } from '../hooks/useTaskQueue.ts'

export function ProgressStrip({ queue, stripSummary, showProgress, setShowProgress, cancelTask, t }: {
  queue: QueueTask[]
  stripSummary: string
  showProgress: boolean
  setShowProgress: (value: boolean) => void
  cancelTask: (id: number) => void
  t: Translate
}) {
  return h('div', { className: styles.progressStrip },
    h('button', {
      className: styles.progressStripMain,
      onClick: () => setShowProgress(!showProgress),
      title: t('runningTask'),
    },
      h('span', { className: styles.progressStripDot }),
      h('span', { className: styles.progressStripText }, stripSummary),
      h('span', { className: styles.progressStripToggle }, showProgress ? t('progressHide') : t('progressShow')),
    ),
    showProgress
      ? h('div', { className: styles.queueList },
        queue.map((q) => h('div', { key: q.id, className: styles.queueRow },
          // 插件名独占一行，右侧放取消按钮
          h('div', { className: styles.queueRowHead },
            h('span', { className: styles.queueRowTarget, title: q.target }, q.target),
            h('button', {
              className: styles.stripCancel,
              onClick: () => cancelTask(q.id),
            }, t('cancelTask')),
          ),
          // 状态 + 蓝色进度条 + 百分比：与插件名分开、单独一行
          h('div', { className: styles.queueRowBody },
            h('span', { className: styles.queueRowStatus },
              q.status === 'running'
                ? (q.kind === 'install' ? t('installing') : t('uninstalling'))
                : t('queuedTitle')),
            h('div', { className: `${styles.progressTrack} ${styles.queueRowTrack}` },
              h('div', { className: styles.progressFill, style: { width: `${q.progress}%` } }),
            ),
            h('span', { className: styles.queueRowPct }, `${q.progress}%`),
          ),
        )),
      )
      : null,
  )
}
