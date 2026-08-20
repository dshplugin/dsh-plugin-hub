/**
 * Failure-record dialog: a persistent log of install/remove failures.
 *
 * Records are written to localStorage at failure time (see lib/failures.ts),
 * so a failed task is never lost even when the error dialog was dismissed or
 * the user was away when the task failed. Opened from the header entry button.
 */
import { createElement as h } from 'react'
import type { MouseEvent } from 'react'
import styles from '../styles/Section.module.css'
import type { Translate } from '../types.ts'
import type { FailureRecord } from '../lib/failures.ts'
import { pluginIssueUrl } from '../lib/catalog.ts'
import { CloseIcon } from './icons.tsx'

/** 记录时间紧凑展示：今年内 MM-DD HH:mm，跨年补年份前缀。 */
function fmtTime(at: number): string {
  const d = new Date(at)
  const pad = (n: number) => String(n).padStart(2, '0')
  const mmdd = `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  return d.getFullYear() === new Date().getFullYear() ? mmdd : `${d.getFullYear()}-${mmdd}`
}

export function FailuresModal({ records, t, onClose, onCopy, onClear }: {
  records: FailureRecord[]
  t: Translate
  onClose: () => void
  onCopy: (text: string) => void
  onClear: () => void
}) {
  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
  },
    h('div', { className: styles.modal, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        h('div', { className: styles.modalTitle }, t('failures')),
        h('button', {
          className: styles.modalClose,
          'aria-label': t('errorClose'),
          onClick: onClose,
        }, h(CloseIcon)),
      ),
      h('div', { className: styles.modalBody },
        h('div', { className: styles.errorHint }, t('failuresDesc')),
        records.length === 0
          ? h('div', { className: styles.failEmpty }, t('failuresEmpty'))
          : h('div', { className: styles.failList },
            records.map((r) => h('div', { key: r.id, className: styles.failRow },
              h('div', { className: styles.failHead },
                h('span', {
                  className: `${styles.failKind} ${r.kind === 'install' ? styles.failKindInstall : styles.failKindUninstall}`,
                }, r.kind === 'install' ? t('install') : t('uninstall')),
                r.repo
                  ? h('a', {
                    className: styles.failRepo,
                    href: `https://github.com/${r.repo}`,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    title: r.repo,
                  }, r.repo)
                  : null,
                h('span', {
                  className: styles.failTime,
                  title: new Date(r.at).toLocaleString(),
                }, fmtTime(r.at)),
                h('button', {
                  className: styles.failCopy,
                  onClick: () => onCopy(r.message),
                }, t('failCopy')),
              ),
              // 报错正文不展示了：每条记录就是一个灰字复制按钮 + 一键提交入口
              // 每条记录一个大按钮：一键提交 BUG 到 GitHub Issue（带着本条错误日志与官网外链）
              r.repo ? h('a', {
                className: styles.failBigIssue,
                href: pluginIssueUrl(r.repo, r.message),
                target: '_blank',
                rel: 'noopener noreferrer',
                title: t('failIssueHint'),
              }, t('failIssueBig')) : null,
            )),
          ),
        h('div', { className: styles.modalActions },
          records.length > 0 ? h('button', {
            className: styles.failClear,
            onClick: onClear,
          }, t('failuresClear')) : null,
          h('button', { className: styles.restartNow, onClick: onClose }, t('errorClose')),
        ),
      ),
    ),
  )
}
