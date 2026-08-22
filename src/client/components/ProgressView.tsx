/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Inline progress block shared by the install and uninstall dialogs:
 * a real percentage bar (server-estimated, client-polled). No live terminal
 * window — pnpm emits nothing during git clone/build, so a log pane would be
 * empty for most of the run; failures surface their full output in ErrorModal.
 */
import { createElement as h } from 'react'
import styles from '../styles/Modal.module.css'
import type { TaskState } from '../types.ts'

export function ProgressView({ task }: { task: TaskState }) {
  return h('div', { className: styles.progress },
    h('div', { className: styles.progressHead },
      h('span', { className: styles.progressText }, `${Math.round(task.progress)}%`),
    ),
    h('div', { className: styles.progressTrack },
      h('div', {
        className: task.status === 'failed' ? `${styles.progressFill} ${styles.progressFillFail}` : styles.progressFill,
        style: { width: `${task.progress}%` },
      }),
    ),
  )
}
