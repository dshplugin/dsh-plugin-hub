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
import type { EnvInfo, Translate } from '../types.ts'
import type { FailureRecord } from '../lib/failures.ts'
import { classifyFailure } from '../lib/failures.ts'
import { pluginIssueUrl, pluginSiteUrl } from '../lib/catalog.ts'
import { CloseIcon } from './icons.tsx'

/** 记录时间紧凑展示：今年内 MM-DD HH:mm，跨年补年份前缀。 */
function fmtTime(at: number): string {
  const d = new Date(at)
  const pad = (n: number) => String(n).padStart(2, '0')
  const mmdd = `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  return d.getFullYear() === new Date().getFullYear() ? mmdd : `${d.getFullYear()}-${mmdd}`
}

export function FailuresModal({ records, t, env, onClose, onCopy, onClear }: {
  records: FailureRecord[]
  t: Translate
  env: EnvInfo | null
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
    h('div', { className: styles.errorModal, role: 'dialog', 'aria-modal': 'true' },
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
                    // 跳转到官网详情页（含插件收录信息），不在失败弹窗直接跳 GitHub
                    href: pluginSiteUrl(r.repo),
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
              // 每条记录是一个独立卡片：头部（类型/仓库/时间/复制完整日志）→ 修复或提 Issue 动作。
              // 卡片不展示错误日志预览，完整日志靠「复制完整日志」按钮带走，避免每条卡片被日志撑高
              (() => {
                const kind = classifyFailure(r.message)
                if (kind === 'pnpmAllowBuild') {
                  return h('div', { className: styles.failAllowHint }, t('failAllowBuild'))
                }
                if (kind === 'pluginPrepare' || kind === 'pnpmIgnoredBuild') {
                  // prepare 构建脚本实际执行失败 / 原生依赖构建被 pnpm 拦截：都是插件打包分发问题 —— 先说明原因，按钮在下方提交
                  return h('div', null, [
                    h('div', { className: styles.failPrepareHint }, kind === 'pnpmIgnoredBuild' ? t('failIgnoredBuild') : t('failPrepareHint')),
                    r.repo ? h('a', {
                      className: styles.failBigIssue,
                      href: pluginIssueUrl(r.repo, r.message, env),
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      title: t('failIssueHint'),
                    }, t('failIssueBig')) : null,
                  ])
                }
                return r.repo ? h('a', {
                  className: styles.failBigIssue,
                  href: pluginIssueUrl(r.repo, r.message, env),
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  title: t('failIssueHint'),
                }, t('failIssueBig')) : null
              })(),
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
