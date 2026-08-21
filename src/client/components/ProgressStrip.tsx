/**
 * Progress strip + task queue dialog.
 *
 * The strip is a summary bar shown while tasks run; clicking it opens a
 * modal that lists every queued/running install-remove task with its
 * progress and a cancel button. The modal reuses the error-dialog width
 * (640px) and grows with its content. No live log pane — pnpm emits
 * nothing during the git clone/build phase, so a log window would sit
 * empty; failures surface their full output in the error dialog instead.
 */
import { createElement as h, type MouseEvent as ReactMouseEvent } from 'react'
import styles from '../styles/Section.module.css'
import type { Translate } from '../types.ts'
import type { PendingRestart, QueueTask } from '../hooks/useTaskQueue.ts'
import { CloseIcon } from './icons.tsx'

export function ProgressStrip({ queue, pendingRestarts, stripSummary, showProgress, setShowProgress, cancelTask, onRestart, restarting, t }: {
  queue: QueueTask[]
  pendingRestarts: PendingRestart[]
  stripSummary: string
  showProgress: boolean
  setShowProgress: (value: boolean) => void
  cancelTask: (id: number) => void
  /** 「立即重启」：请求宿主重启（与安装结果视图同一入口），重启后待重启列表自然清空 */
  onRestart: () => void
  /** 宿主重启进行中：按钮禁用，避免重复触发 */
  restarting: boolean
  t: Translate
}) {
  // 标题随内容切换：有待重启 → 「有待重启的任务」；纯进行中 → 「有任务正在进行中」；兜底「任务队列」
  const title = pendingRestarts.length > 0 ? t('restartPendingTitle') : queue.length > 0 ? t('activeTasksTitle') : t('taskQueueTitle')
  return h('div', { className: styles.progressStrip },
    h('button', {
      className: styles.progressStripMain,
      onClick: () => setShowProgress(true),
      title: t('runningTask'),
    },
      h('span', { className: styles.progressStripDot }),
      h('span', { className: styles.progressStripText }, stripSummary),
      h('span', { className: styles.progressStripToggle }, t('progressShow')),
    ),
    // 任务队列弹窗：宽度与失败记录弹窗一致（640px），高度随内容自适应，不再受侧栏宽度限制
    showProgress
      ? h('div', {
        className: styles.overlay,
        onClick: (e: ReactMouseEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) setShowProgress(false)
        },
      },
        h('div', { className: styles.errorModal, role: 'dialog', 'aria-modal': 'true' },
          h('div', { className: styles.modalHead },
            h('div', { className: styles.modalTitle }, title),
            h('button', {
              className: styles.modalClose,
              'aria-label': t('errorClose'),
              onClick: () => setShowProgress(false),
            }, h(CloseIcon)),
          ),
          h('div', { className: styles.modalBody },
            queue.length === 0 && pendingRestarts.length === 0
              ? h('div', { className: styles.failEmpty }, t('taskQueueEmpty'))
              : h('div', { className: styles.queueModalList },
                // 待重启分区：装完没重启的插件常驻提醒，无取消按钮，只能重启
                pendingRestarts.length > 0
                  ? h('div', { className: styles.queueSection },
                    h('div', { className: styles.queueSectionTitle }, t('sectionPendingRestart')),
                    pendingRestarts.map((p) => h('div', { key: `restart-${p.target}`, className: styles.queueRow },
                      h('div', { className: styles.queueRowHead },
                        h('span', {
                          className: `${styles.failKind} ${p.kind === 'uninstall' ? styles.failKindUninstall : styles.failKindInstall}`,
                        }, p.kind === 'uninstall' ? t('uninstall') : t('install')),
                        h('span', { className: styles.queueRowTarget, title: p.target }, p.target),
                      ),
                      p.desc ? h('div', { className: styles.queueRowDesc, title: p.desc }, p.desc) : null,
                      // 提示 + 操作按钮一行：左侧「重启后生效/重启后移除」，右侧「稍后重启 / 立即重启」
                      h('div', { className: styles.queueRowBody },
                        h('span', { className: styles.pendingRowStatus },
                          p.kind === 'uninstall' ? t('restartPendingHintUninstall') : t('restartPendingHint')),
                        h('span', { className: styles.pendingRowActions },
                          h('button', {
                            className: styles.restartLater,
                            disabled: restarting,
                            onClick: () => setShowProgress(false),
                          }, t('restartLater')),
                          h('button', {
                            className: styles.restartNow,
                            disabled: restarting,
                            onClick: onRestart,
                          }, restarting ? t('restarting') : t('restartNow')),
                        ),
                      ),
                    )),
                  )
                  : null,
                // 进行中/排队分区：原有的安装/卸载任务行
                queue.length > 0
                  ? h('div', { className: styles.queueSection },
                    h('div', { className: styles.queueSectionTitle }, t('sectionInProgress')),
                    queue.map((q) => h('div', { key: q.id, className: styles.queueRow },
                      // 插件名独占一行，右侧放取消按钮；左侧徽章一眼区分安装/卸载
                      h('div', { className: styles.queueRowHead },
                        h('span', {
                          className: `${styles.failKind} ${q.kind === 'install' ? styles.failKindInstall : styles.failKindUninstall}`,
                        }, q.kind === 'install' ? t('install') : t('uninstall')),
                        h('span', { className: styles.queueRowTarget, title: q.target }, q.target),
                        h('button', {
                          className: styles.stripCancel,
                          disabled: q.status === 'cancelling',
                          onClick: (e: ReactMouseEvent<HTMLButtonElement>) => { e.stopPropagation(); cancelTask(q.id) },
                        }, t('cancelTask')),
                      ),
                      // 仓库名下方的插件中文简介：光看名字不知道排队的什么，简介一眼说明
                      q.desc ? h('div', { className: styles.queueRowDesc, title: q.desc }, q.desc) : null,
                      // 状态 + 蓝色进度条 + 百分比：与插件名分开、单独一行
                      h('div', { className: styles.queueRowBody },
                        h('span', { className: styles.queueRowStatus },
                          q.status === 'running'
                            ? (q.kind === 'install' ? t('installing') : t('uninstalling'))
                            : q.status === 'cancelling'
                              ? t('cancelling')
                              : (q.kind === 'install' ? t('queuedTitle') : t('queuedUninstallTitle'))),
                        h('div', { className: `${styles.progressTrack} ${styles.queueRowTrack}` },
                          h('div', { className: styles.progressFill, style: { width: `${q.progress}%` } }),
                        ),
                        h('span', { className: styles.queueRowPct }, `${q.progress}%`),
                      ),
                    )),
                  )
                  : null,
              ),
          ),
        ),
      )
      : null,
  )
}
