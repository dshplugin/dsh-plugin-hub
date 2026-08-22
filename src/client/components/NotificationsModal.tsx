/**
 * Notification-center dialog: a persistent log of every settled install /
 * remove task — successes and failures alike.
 *
 * Records are written to localStorage at settle time (see lib/failures.ts),
 * so a result is never lost even when the dialog was dismissed or the user
 * was away. Each entry carries a circular status badge (green check for
 * success, red cross for failure) with white glyph and message text;
 * failures keep their copy / fix / file-an-issue actions. Opened from the
 * header entry button.
 */
import { createElement as h } from 'react'
import type { MouseEvent } from 'react'
import styles from '../styles/Modal.module.css'
import type { EnvInfo, Translate } from '../types.ts'
import type { NotificationRecord } from '../lib/failures.ts'
import { classifyFailure } from '../lib/failures.ts'
import type { PendingRestart, QueueTask } from '../hooks/useTaskQueue.ts'
import { pluginIssueUrl, pluginSiteUrl } from '../lib/catalog.ts'
import { CloseIcon } from './icons.tsx'

/** 记录时间完整展示：YYYY-MM-DD HH:mm:ss（每条通知都带精确到秒的时间戳）。 */
function fmtTime(at: number): string {
  const d = new Date(at)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** 圆形状态徽标内的白色图形：成功为对勾、失败为叉。 */
function BadgeGlyph({ ok }: { ok: boolean }) {
  return h('svg', {
    className: styles.noticeBadgeIcon,
    viewBox: '0 0 16 16',
    width: 12,
    height: 12,
    fill: 'none',
    'aria-hidden': 'true',
  }, ok
    ? h('path', {
      d: 'M3 8.5l3.5 3.5 6.5-6.5',
      stroke: '#ffffff',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    })
    : h('path', {
      d: 'M4 4l8 8M12 4L4 12',
      stroke: '#ffffff',
      strokeWidth: 2,
      strokeLinecap: 'round',
    }))
}

export function NotificationsModal({ records, tasks, pendingRestarts, t, env, onClose, onCopy, onClear, onRemove, cancelTask, restarting, onRestart }: {
  records: NotificationRecord[]
  /** 进行中的安装/卸载任务（实时进度，与队列弹窗同一数据源） */
  tasks: QueueTask[]
  /** 待重启插件：装完没重启的常驻提醒 */
  pendingRestarts: PendingRestart[]
  t: Translate
  env: EnvInfo | null
  onClose: () => void
  onCopy: (text: string) => void
  onClear: () => void
  /** 删除单条通知记录 */
  onRemove: (id: number) => void
  cancelTask: (id: number) => void
  restarting: boolean
  onRestart: () => void
}) {
  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
  },
    h('div', { className: styles.errorModal, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        h('div', { className: styles.modalTitle }, t('notifications')),
        h('button', {
          className: styles.modalClose,
          'aria-label': t('errorClose'),
          onClick: onClose,
        }, h(CloseIcon)),
      ),
      h('div', { className: styles.modalBody },
        h('div', { className: styles.errorHint }, t('notificationsDesc')),
        // 进行中的安装/卸载任务实时进度也进通知中心：与队列弹窗同一套行结构，
        // 关掉任务弹窗后仍可在这里盯着进度；待重启插件可在此直接触发重启
        (tasks.length > 0 || pendingRestarts.length > 0)
          ? h('div', null, [
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
                  h('div', { className: styles.queueRowBody },
                    h('span', { className: styles.pendingRowStatus },
                      p.kind === 'uninstall' ? t('restartPendingHintUninstall') : t('restartPendingHint')),
                    h('span', { className: styles.pendingRowActions },
                      h('button', {
                        className: styles.restartLater,
                        disabled: restarting,
                        onClick: onClose,
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
            tasks.length > 0
              ? h('div', { className: styles.queueSection },
                h('div', { className: styles.queueSectionTitle }, t('sectionInProgress')),
                tasks.map((q) => h('div', { key: q.id, className: styles.queueRow },
                  h('div', { className: styles.queueRowHead },
                    h('span', {
                      className: `${styles.failKind} ${q.kind === 'install' ? styles.failKindInstall : styles.failKindUninstall}`,
                    }, q.kind === 'install' ? t('install') : t('uninstall')),
                    h('span', { className: styles.queueRowTarget, title: q.target }, q.target),
                    h('button', {
                      className: styles.stripCancel,
                      disabled: q.status === 'cancelling',
                      onClick: (e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); cancelTask(q.id) },
                    }, t('cancelTask')),
                  ),
                  q.desc ? h('div', { className: styles.queueRowDesc, title: q.desc }, q.desc) : null,
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
          ])
          : null,
        records.length === 0
          ? h('div', { className: styles.failEmpty }, t('notificationsEmpty'))
          : h('div', { className: styles.noticeList },
            records.map((r) => {
              return h('div', {
                key: r.id,
                className: r.ok ? `${styles.noticeRow} ${styles.noticeRowOk}` : styles.noticeRow,
              },
              h('div', { className: styles.noticeRowMain },
                h('div', {
                  className: r.ok ? styles.noticeBadgeOk : styles.noticeBadgeFail,
                }, h(BadgeGlyph, { ok: r.ok })),
                h('div', { className: styles.noticeMain },
                  h('div', { className: styles.noticeHead },
                    h('span', {
                      className: r.ok ? styles.noticeTextOk : styles.noticeTextFail,
                    }, r.ok
                      ? (r.kind === 'install' ? t('installDone') : t('uninstallDone'))
                      : (r.kind === 'install' ? t('errorTitleInstall') : t('errorTitleUninstall'))),
                    r.repo
                      ? h('a', {
                        className: styles.failRepo,
                        // 跳转到官网详情页（含插件收录信息），不在通知弹窗直接跳 GitHub
                        href: pluginSiteUrl(r.repo),
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        title: r.repo,
                      }, r.repo)
                      : null,
                    !r.ok && h('button', {
                      className: styles.failCopy,
                      onClick: () => onCopy(r.message),
                    }, t('failCopy')),
                    // 成功通知：时间戳并入本行右侧，与图标/文字垂直居中 ——
                    // 不再单独占底部一行，卡片只有一行内容，图标文字整体居中不顶头
                    r.ok
                      ? h('span', {
                        className: styles.noticeTime,
                        title: new Date(r.at).toLocaleString(),
                      }, fmtTime(r.at))
                      : null,
                    // 每条通知右侧的删除按钮：单独移除这一条
                    h('button', {
                      className: styles.noticeRemove,
                      'aria-label': t('removeNotification'),
                      title: t('removeNotification'),
                      onClick: (e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onRemove(r.id) },
                    }, h(CloseIcon)),
                  ),
                  // 每条失败记录是一个独立卡片：头部（状态/仓库/时间/复制完整日志）→ 修复或提 Issue 动作。
                  // 卡片不展示错误日志预览，完整日志靠「复制完整日志」按钮带走，避免每条卡片被日志撑高
                  !r.ok && (() => {
                    const kind = classifyFailure(r.message)
                    if (kind === 'pluginPrepare' || kind === 'pnpmIgnoredBuild') {
                      // [packaging]（预检/装后校验拦截：git 分发缺产物）与
                      // prepare 构建脚本实际执行失败 / 原生依赖构建被 pnpm 拦截：都是插件打包分发问题 —— 先说明原因，按钮在下方提交
                      return h('div', null, [
                        h('div', { className: styles.failPrepareHint }, kind === 'pnpmIgnoredBuild'
                          ? t('failIgnoredBuild')
                          : /\[packaging\]/i.test(r.message) ? t('failPackagingHint') : t('failPrepareHint')),
                        r.repo ? h('a', {
                          className: styles.failBigIssue,
                          href: pluginIssueUrl(r.repo, r.message, env, r.command, r.attempts),
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          title: t('failIssueHint'),
                        }, t('failIssueBig')) : null,
                      ])
                    }
                    return r.repo ? h('a', {
                      className: styles.failBigIssue,
                      href: pluginIssueUrl(r.repo, r.message, env, r.command, r.attempts),
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      title: t('failIssueHint'),
                    }, t('failIssueBig')) : null
                  })(),
                ),
              ),
              // 失败通知：时间戳保留独立底部行（右下角）；成功通知已并入头部行右侧
              !r.ok
                ? h('div', { className: styles.noticeFoot },
                  h('span', {
                    className: styles.noticeTime,
                    title: new Date(r.at).toLocaleString(),
                  }, fmtTime(r.at)),
                )
                : null,
            )
            }),
          ),
        h('div', { className: styles.modalActions },
          records.length > 0 ? h('button', {
            className: styles.failClear,
            onClick: onClear,
          }, t('notificationsClear')) : null,
          h('button', { className: styles.restartNow, onClick: onClose }, t('errorClose')),
        ),
      ),
    ),
  )
}
