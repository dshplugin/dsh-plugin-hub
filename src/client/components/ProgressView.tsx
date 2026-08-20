/**
 * Inline progress block shared by the install and uninstall dialogs:
 * a real percentage bar (server-estimated, client-polled) plus a
 * terminal-style output window with line-level keyword highlighting.
 */
import { createElement as h } from 'react'
import styles from '../styles/Section.module.css'
import type { TaskState } from '../types.ts'
import { logLineClass } from '../lib/markup.ts'

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
    task.lines.length > 0
      ? h('div', { className: styles.progressLog },
        // 终端窗口标题栏：进程名（黑窗 + 关键词高亮即足够，不做 macOS 红绿灯装饰）
        h('div', { className: styles.progressLogBar },
          h('span', { className: styles.progressLogTitle }, 'dsh'),
        ),
        h('div', { className: styles.progressLogLines },
          task.lines.slice(0, 6).reverse().map((line, i) =>
            h('div', { key: i, className: logLineClass(line) }, line)),
        ),
      )
      : null,
  )
}
