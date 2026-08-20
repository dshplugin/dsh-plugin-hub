/**
 * Dialog layer for the Plugin Hub: the install-confirm dialog, the uninstall
 * dialog and the global toast. Both dialogs lock themselves while a mutation
 * or restart is running, then switch to a result view offering an immediate
 * restart or a "later" deferral.
 */
import { createElement as h } from 'react'
import type { MouseEvent } from 'react'
import styles from '../styles/Section.module.css'
import type { HubPlugin, TaskState, ToastState, Translate } from '../types.ts'
import { CloseIcon, CopyIcon, LinkIcon } from './icons.tsx'
import { ProgressView } from './ProgressView.tsx'
import { pluginDetailUrl, pluginIssueUrl } from '../lib/catalog.ts'

/** 完成结果视图：绿色对勾 + 标题/描述 + 「完成」关闭按钮（安装/卸载本身已生效，无需提示重启） */
function ResultView({
  title, desc, t, onClose,
}: {
  title: string
  desc: string
  t: Translate
  onClose: () => void
}) {
  return h('div', { className: styles.result },
    h('div', { className: styles.resultCheck },
      h('svg', {
        className: styles.resultCheckIcon,
        viewBox: '0 0 16 16',
        width: 20,
        height: 20,
        fill: 'none',
        'aria-hidden': 'true',
      }, h('path', {
        d: 'M2.5 8.5l3.5 3.5 7.5-7.5',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      })),
    ),
    h('div', { className: styles.resultTitle }, title),
    h('div', { className: styles.resultDesc }, desc),
    h('div', { className: styles.modalActions },
      // 复用主按钮样式：单个「完成」即可，关闭后回到列表
      h('button', { className: styles.restartNow, onClick: onClose }, t('doneBtn')),
    ),
  )
}

export interface InstallModalProps {
  plugin: HubPlugin
  done: boolean
  task: TaskState | null
  t: Translate
  langPath: string
  onClose: () => void
  onCopy: () => void
  onInstall: () => void
}

/**
 * 信任确认弹窗：安装进入后台队列后弹窗仍可关闭（任务继续），
 * 只在本任务执行中展示实时进度；完成后切换为结果视图，与卸载一致。
 */
export function InstallModal(props: InstallModalProps) {
  const { plugin, done, task, t, langPath, onClose, onCopy, onInstall } = props
  const busy = task !== null && (task.status === 'pending' || task.status === 'running')
  const title = busy
    ? task!.status === 'pending' ? t('queuedTitle') : t('installing')
    : done ? t('installResultTitle') : t('confirmTitle')
  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
  },
    h('div', { className: styles.modal, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        h('div', { className: styles.modalTitle }, title),
        h('button', {
          className: styles.modalClose,
          'aria-label': t('confirmCancel'),
          onClick: () => onClose(),
        }, h(CloseIcon)),
      ),
      done
        // 安装完成：结果视图（成功即生效，仅「完成」关闭）
        ? h(ResultView, {
          title: t('installResultTitle'),
          desc: t('installResultDesc'),
          t,
          onClose,
        })
        // 确认/进行中：来源行 + 安装命令 + 实时进度 + 操作按钮
        : h('div', { className: styles.modalBody },
          h('div', { className: styles.trustHint }, t('confirmDesc')),
          h('div', { className: styles.modalRow },
            h('span', { className: styles.modalLabel }, t('confirmPlugin')),
            h('span', { className: styles.modalValue, title: plugin.displayName ?? plugin.slug },
              plugin.displayName ?? plugin.slug),
          ),
          plugin.source?.repo ? h('div', { className: styles.modalRow },
            h('span', { className: styles.modalLabel }, t('confirmSource')),
            // 来源仓库：可点击跳转官网收录详情页（新窗口打开）
            h('a', {
              className: styles.modalLink,
              href: pluginDetailUrl(plugin, langPath),
              target: '_blank',
              rel: 'noopener noreferrer',
              title: plugin.source.repo,
            }, h(LinkIcon), plugin.source.repo),
          ) : null,
          // 手动命令条：整条点击即复制，右侧再放一个显式复制按钮
          h('div', {
            className: styles.modalCmd,
            onClick: onCopy,
            title: t('copyInstallCommand'),
            role: 'button',
            tabIndex: 0,
          },
            h('span', { className: styles.modalCmdText }, `dsh plugin add ${plugin.source?.repo ?? ''}`),
            h('span', { className: styles.modalCmdCopy }, h(CopyIcon), t('copyCmdLabel')),
          ),
          task && task.status === 'pending' ? h('div', { className: styles.queuedHint }, t('queuedHint')) : null,
          task ? h(ProgressView, { task }) : null,
          h('div', { className: styles.modalActions },
            h('button', {
              className: styles.modalCopy,
              disabled: busy,
              onClick: onCopy,
            }, t('copyInstallCommand')),
            h('button', {
              className: styles.modalInstall,
              disabled: busy,
              onClick: onInstall,
            }, busy ? (task!.status === 'pending' ? t('queuedTitle') : t('installing')) : t('installNow')),
          ),
        ),
    ),
  )
}

export interface UninstallModalProps {
  plugin: HubPlugin
  done: boolean
  task: TaskState | null
  t: Translate
  langPath: string
  onClose: () => void
  onCancel: () => void
  onCopyCommand: () => void
  onConfirm: () => void
}

/** 卸载确认弹窗：确认/进行中（后台队列，可关闭）；完成后切换为结果视图（成功即生效，仅「完成」关闭）。 */
export function UninstallModal(props: UninstallModalProps) {
  const { plugin, done, task, t, langPath, onClose, onCancel, onCopyCommand, onConfirm } = props
  const busy = task !== null && (task.status === 'pending' || task.status === 'running')
  const title = busy
    ? task!.status === 'pending' ? t('queuedTitle') : t('uninstalling')
    : done ? t('uninstallResultTitle') : t('uninstallTitle')
  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
  },
    h('div', { className: styles.modal, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        h('div', { className: styles.modalTitle }, title),
        h('button', {
          className: styles.modalClose,
          'aria-label': t('confirmCancel'),
          onClick: () => onClose(),
        }, h(CloseIcon)),
      ),
      done
        // 卸载完成：结果视图（成功即生效，仅「完成」关闭）
        ? h(ResultView, {
          title: t('uninstallResultTitle'),
          desc: t('uninstallResultDesc'),
          t,
          onClose,
        })
        // 确认/进行中：来源行 + 实时进度 + 操作按钮
        : h('div', { className: styles.modalBody },
          h('div', { className: styles.modalDesc }, t('uninstallDesc')),
          h('div', { className: styles.modalRow },
            h('span', { className: styles.modalLabel }, t('confirmPlugin')),
            h('span', { className: styles.modalValue, title: plugin.displayName ?? plugin.slug },
              plugin.displayName ?? plugin.slug),
          ),
          // 显示仓库来源：github 用户名 + 仓库名，让用户确认卸载的是哪一个仓库
          plugin.source?.repo ? h('div', { className: styles.modalRow },
            h('span', { className: styles.modalLabel }, t('confirmSource')),
            // 来源仓库：可点击跳转官网收录详情页（新窗口打开）
            h('a', {
              className: styles.modalLink,
              href: pluginDetailUrl(plugin, langPath),
              target: '_blank',
              rel: 'noopener noreferrer',
              title: plugin.source.repo,
            }, h(LinkIcon), plugin.source.repo),
          ) : null,
          task && task.status === 'pending' ? h('div', { className: styles.queuedHint }, t('queuedHint')) : null,
          task ? h(ProgressView, { task }) : null,
          h('div', { className: styles.modalActions },
            h('button', {
              className: styles.modalCancel,
              onClick: onCancel,
            }, t('confirmCancel')),
            // 复制卸载命令：万一直接卸载失败，可去终端手动执行
            h('button', {
              className: styles.modalCopy,
              disabled: busy,
              onClick: onCopyCommand,
            }, t('copyUninstallCommand')),
            h('button', {
              className: styles.uninstallConfirm,
              disabled: busy,
              onClick: onConfirm,
            }, busy ? (task!.status === 'pending' ? t('queuedTitle') : t('uninstalling')) : t('uninstall')),
          ),
        ),
    ),
  )
}

/** 预填插件仓库的 GitHub Issue 链接：标题带插件名，正文附完整错误信息，方便用户一键反馈。 */
/** 安装/卸载失败弹窗：布局与失败记录一致（类型徽标 + 仓库超链接 + 隐蔽复制按钮），报错完整展示，底部一键提交 Issue。 */
export function ErrorModal({ message, repo, kind, t, onCopy, onClose }: {
  message: string
  repo: string | null
  kind: 'install' | 'uninstall'
  t: Translate
  onCopy: () => void
  onClose: () => void
}) {
  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
  },
    h('div', { className: styles.modal, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        // 标题按操作类型明确区分：安装失败 / 卸载失败
        h('div', { className: styles.errorTitle }, kind === 'install' ? t('errorTitleInstall') : t('errorTitleUninstall')),
        h('button', {
          className: styles.modalClose,
          'aria-label': t('errorClose'),
          onClick: onClose,
        }, h(CloseIcon)),
      ),
      h('div', { className: styles.modalBody },
        // 与失败记录一致的布局：类型徽标 + 仓库超链接 + 顶部隐蔽复制按钮
        h('div', { className: styles.failRow },
          h('div', { className: styles.failHead },
            h('span', {
              className: kind === 'install' ? styles.failKindInstall : styles.failKindUninstall,
            }, kind === 'install' ? t('install') : t('uninstall')),
            // 仓库地址（用户名/仓库）统一显示为可点击超链接，指向插件 GitHub 仓库
            repo ? h('a', {
              className: styles.failRepo,
              href: `https://github.com/${repo}`,
              target: '_blank',
              rel: 'noopener noreferrer',
              title: repo,
            }, repo) : null,
            // 复制按钮放最上面、浅灰隐蔽；报错正文不允许鼠标选择复制，只能点这里
            h('button', { className: styles.errorCopySoft, onClick: onCopy }, t('errorCopy')),
          ),
          // 报错信息完整展示（可滚动），比失败记录的预览看得更多
          h('pre', { className: styles.errorBox }, message),
          // 底部大按钮：一键提交 BUG 到 GitHub Issue（正文带官网收录外链）
          repo ? h('a', {
            className: styles.failBigIssue,
            href: pluginIssueUrl(repo, message),
            target: '_blank',
            rel: 'noopener noreferrer',
            title: t('failIssueHint'),
          }, t('failIssueBig')) : null,
        ),
        h('div', { className: styles.modalActions },
          h('button', { className: styles.restartLater, onClick: onClose }, t('errorClose')),
        ),
      ),
    ),
  )
}

/** 全局反馈 Toast：复制成功（反色）/ 安装完成（反色）/ 安装失败（红色）/ 卸载结果 */
export function Toast({ toast, t }: { toast: ToastState; t: Translate }) {
  const text = toast.kind === 'copied' ? t('toastCopied')
    : toast.kind === 'errCopied' ? t('errCopied')
      : toast.kind === 'done' ? t('installDone')
        : toast.kind === 'fail' ? t('installFail')
          : toast.kind === 'removed' ? t('uninstallDone')
            : t('uninstallFail')
  const fail = toast.kind === 'fail' || toast.kind === 'removeFail'
  return h('div', {
    key: toast.id,
    className: fail ? `${styles.toast} ${styles.toastFail}` : styles.toast,
  }, text)
}
