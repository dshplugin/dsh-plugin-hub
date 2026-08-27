/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Dialog layer for the Plugin Hub: the install-confirm dialog, the uninstall
 * dialog and the global toast. Both dialogs lock themselves while a mutation
 * or restart is running, then switch to a result view offering an immediate
 * restart or a "later" deferral.
 */
import { createElement as h } from 'react'
import type { MouseEvent } from 'react'
import styles from '../../styles/Modal.module.css'
import type { EnvInfo, HubPlugin, TaskState, ToastState, Translate } from '../../types.ts'
import { CloseIcon, ConfirmIcon, CopyIcon, LinkIcon } from '../ui/icons.tsx'
import { ProgressView } from './ProgressView.tsx'
import { installCommandOf } from '../../logic/install-command.ts'
import { pluginDetailUrl, pluginIssueUrl, pluginSiteUrl } from '../../logic/urls.ts'
import { classifyFailure, npmTooLowVersion, unreachableTargetOf } from '../../logic/failures.ts'

/** 完成结果视图：绿色对勾 + 标题/描述；
 *  needsRestart=true（插件需重启才生效）→ 「稍后重启 / 立即重启」按钮对，点稍后重启后
 *  通知中心待重启条目常驻（服务端登记，内存态），直到用户点「立即重启」真正重启后才消失；
 *  needsRestart=false（卸载已即时生效）→ 仅「完成」关闭。 */
function ResultView({
  title, desc, t, restarting, needsRestart, onRestart, onClose,
}: {
  title: string
  desc: string
  t: Translate
  restarting: boolean
  needsRestart: boolean
  onRestart: () => void
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
    desc ? h('div', { className: styles.resultDesc }, desc) : null,
    needsRestart
      ? h('div', null, [
        h('div', { className: styles.resultRestarting }, restarting ? t('restarting') : t('restartHint')),
        h('div', { className: styles.modalActions },
          h('button', { className: styles.restartLater, onClick: onClose, disabled: restarting }, t('restartLater')),
          h('button', { className: styles.restartNowWarning, onClick: onRestart, disabled: restarting },
            restarting ? t('restarting') : t('restartNow')),
        ),
      ])
      : h('div', { className: styles.modalActions },
        h('button', { className: styles.restartNow, onClick: onClose }, t('done'))),
  )
}

export interface InstallModalProps {
  /** 目录插件（有完整元数据）；命令行安装（custom）传 null 走 customTarget 模式 */
  plugin: HubPlugin | null
  /** 命令行安装目标（无目录元数据）：提供时按裸目标展示确认/进度/结果，命令条显示 pnpm add <target> */
  customTarget?: string
  /** 全局 npm 安装（官方 README 的 `npm install -g <pkgs>`）：提供时按包列表展示确认/进度/结果，
   *  命令条显示 npm install -g <pkgs> —— 装的是系统级 CLI 工具，不进插件列表、无需重启 */
  globalNpm?: string[]
  done: boolean
  task: TaskState | null
  t: Translate
  langPath: string
  restarting: boolean
  /** 已安装插件的覆盖更新（走同一条 add 命令原位重装，文案区分安装/更新） */
  update: boolean
  /** 仅命令行插件（webInstallable=false）：不提供一键安装，只展示命令供复制到 dsh 终端 */
  cliOnly: boolean
  /** 安装请求在途（fetch 等待响应）：此时任务尚未入队，需禁用确认按钮防止二次点击 */
  submitting: boolean
  /** 完成结果是否需重启才生效：true → 「稍后重启 / 立即重启」；false → 仅「完成」 */
  needsRestart: boolean
  onClose: () => void
  onCopy: () => void
  onInstall: () => void
  onRestart: () => void
}

/**
 * 信任确认弹窗：安装进入后台队列后弹窗仍可关闭（任务继续），
 * 只在本任务执行中展示实时进度；完成后切换为结果视图，与卸载一致。
 * 目录插件与命令行安装（customTarget 模式）共用同一套确认/进度/结果流程。
 */
export function InstallModal(props: InstallModalProps) {
  const { plugin, customTarget, globalNpm, done, task, t, langPath, restarting, submitting, update, cliOnly, needsRestart, onClose, onCopy, onInstall, onRestart } = props
  const busy = submitting || (task !== null && (task.status === 'pending' || task.status === 'running'))
  // 进行中标题带上插件名（中文「XX 插件安装中」；英文状态词在前更自然），并用状态色区分；
  // 命令行安装无插件元数据 → 直接用输入的目标展示；全局 npm 安装 → 包列表空格拼接
  const name = customTarget ?? (globalNpm !== undefined && globalNpm.length > 0 ? globalNpm.join(' ') : undefined) ?? plugin?.displayName ?? plugin?.slug ?? ''
  const busyTitle = (label: string) => langPath === 'zh/' ? `${name} 插件${label}` : `${label} ${name}`
  const title = busy
    ? task && task.status === 'pending'
      ? busyTitle(update ? t('queuedUpdateTitle') : t('queuedTitle'))
      : busyTitle(update ? t('updating') : t('installing'))
    : done
      ? update ? t('updateResultTitle') : t('installResultTitle')
      : update ? t('confirmUpdateTitle') : t('confirmTitle')
  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
  },
    h('div', { className: styles.modal, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        h('div', {
          className: busy
            ? `${styles.modalTitle} ${task && task.status === 'pending' ? styles.modalTitleQueued : styles.modalTitleBusy}`
            : styles.modalTitle,
        }, title),
        h('button', {
          className: styles.modalClose,
          'aria-label': t('confirmCancel'),
          onClick: () => onClose(),
        }, h(CloseIcon)),
      ),
      done
        // 安装完成：结果视图（成功即生效，仅「完成」关闭）；更新时标题/描述区分语义
        ? h(ResultView, {
          title: update ? t('updateResultTitle') : t('installResultTitle'),
          desc: update ? t('updateResultDesc') : t('installResultDesc'),
          t,
          restarting,
          needsRestart,
          onRestart,
          onClose,
        })
        // 确认/进行中：来源行 + 安装命令 + 实时进度 + 操作按钮
        : h('div', { className: styles.modalBody },
          // 安装/更新确认态：品牌蓝问号图标，一眼识别这是确认询问
          !busy ? h('div', { className: styles.confirmIconWrap },
            h(ConfirmIcon, { type: 'question' }),
          ) : null,
          h('div', { className: styles.trustHint }, t('confirmDesc')),
          h('div', { className: styles.modalRow },
            h('span', { className: styles.modalLabel }, t('confirmPlugin')),
            h('span', { className: styles.modalValue, title: name }, name),
          ),
          plugin?.source?.repo ? h('div', { className: styles.modalRow },
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
          // 手动命令条：整条点击即复制，右侧再放一个显式复制按钮；
          // 命令行安装（无目录数据）直接展示 pnpm add <target>；全局 npm 安装展示 npm install -g <pkgs>
          h('div', {
            className: styles.modalCmd,
            onClick: onCopy,
            title: t('copyInstallCommand'),
            role: 'button',
            tabIndex: 0,
          },
            h('span', { className: styles.modalCmdText },
              globalNpm !== undefined && globalNpm.length > 0
                ? `npm install -g ${globalNpm.join(' ')}`
                : customTarget ? `pnpm add ${customTarget}` : installCommandOf(plugin!)),
            h('span', { className: styles.modalCmdCopy }, h(CopyIcon), t('copyCmdLabel')),
          ),
          // 全局 npm 安装说明：装的是系统级 CLI 工具，不进插件列表、无需重启宿主
          globalNpm !== undefined && globalNpm.length > 0
            ? h('div', { className: styles.cliOnlyHint }, t('globalNpmHint'))
            : null,
          // AI 识别可能需要命令行辅助的插件（webInstallable=false）：提示但不拦截，仍允许尝试一键安装
          cliOnly ? h('div', { className: styles.cliOnlyHint }, t('cliOnlyHint')) : null,
          task && task.status === 'pending' ? h('div', { className: styles.queuedHint }, t('queuedHint')) : null,
          task ? h(ProgressView, { task }) : null,
          // 安装失败：引导用户复制上方命令到 dsh 终端手动安装（如 node-pty 等原生依赖构建脚本需人工放行）
          task && task.status === 'failed' ? h('div', { className: styles.failedCopyHint }, t('failedCopyHint')) : null,
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
            }, busy
              ? (task && task.status === 'pending'
                ? (update ? t('queuedUpdateTitle') : t('queuedTitle'))
                : (update ? t('updating') : t('installing')))
              : (update ? t('updateNow') : t('installNow'))),
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
  restarting: boolean
  /** 卸载请求在途（fetch 等待响应）：此时任务尚未入队，需禁用确认按钮防止二次点击 */
  submitting: boolean
  /** 完成结果是否需重启才生效：true → 「稍后重启 / 立即重启」；false（loader 已即时移除）→ 仅「完成」 */
  needsRestart: boolean
  onClose: () => void
  onCancel: () => void
  onCopyCommand: () => void
  onConfirm: () => void
  onRestart: () => void
}

/** 卸载确认弹窗：确认/进行中（后台队列，可关闭）；完成后切换为结果视图（成功即生效，仅「完成」关闭）。 */
export function UninstallModal(props: UninstallModalProps) {
  const { plugin, done, task, t, langPath, restarting, submitting, needsRestart, onClose, onCancel, onCopyCommand, onConfirm, onRestart } = props
  const busy = submitting || (task !== null && (task.status === 'pending' || task.status === 'running'))
  // 进行中标题带上插件名，与安装弹窗一致，并用状态色区分
  const name = plugin.displayName ?? plugin.slug
  const busyTitle = (label: string) => langPath === 'zh/' ? `${name} 插件${label}` : `${label} ${name}`
  const title = busy
    ? task && task.status === 'pending' ? busyTitle(t('queuedUninstallTitle')) : busyTitle(t('uninstalling'))
    : done ? t('uninstallResultTitle') : t('uninstallTitle')
  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
  },
    h('div', { className: styles.modal, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        h('div', {
          className: busy
            // 注意 task 判空：submitting（请求在途）时任务尚未入队，task 为 null，不能直接解引用
            ? `${styles.modalTitle} ${task !== null && task.status === 'pending' ? styles.modalTitleQueued : styles.modalTitleBusy}`
            : styles.modalTitle,
        }, title),
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
          restarting,
          needsRestart,
          onRestart,
          onClose,
        })
        // 确认/进行中：来源行 + 实时进度 + 操作按钮
        : h('div', { className: styles.modalBody },
          // 卸载确认态：红色垃圾桶图标，删除类危险操作
          !busy ? h('div', { className: styles.confirmIconWrap },
            h(ConfirmIcon, { type: 'trash' }),
          ) : null,
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
            // 复制卸载命令：万一直接卸载失败，可去终端手动执行
            h('button', {
              className: styles.modalCopy,
              disabled: busy,
              onClick: onCopyCommand,
            }, t('copyUninstallCommand')),
            // 确认框语义：取消动作需明确指向「卸载」，避免歧义
            h('button', {
              className: styles.modalCancel,
              onClick: onCancel,
            }, t('cancelUninstall')),
            h('button', {
              className: styles.uninstallConfirm,
              disabled: busy,
              onClick: onConfirm,
            }, busy ? (task && task.status === 'pending' ? t('queuedUninstallTitle') : t('uninstalling')) : t('uninstallConfirm')),
          ),
        ),
    ),
  )
}

/** 预填插件仓库的 GitHub Issue 链接：标题带插件名，正文附完整错误信息，方便用户一键反馈。 */
/** 安装/卸载失败弹窗：布局与失败记录一致（类型徽标 + 仓库超链接 + 隐蔽复制按钮），报错完整展示，底部一键提交 Issue。 */
export function ErrorModal({ message, repo, kind, command, attempts, t, env, onCopy, onClose, onRunDiagnostics }: {
  message: string
  repo: string | null
  kind: 'install' | 'uninstall'
  command?: string
  /** 尝试过的安装方式（npm 反查 + 实际执行命令）：issue 预填一并贴给作者，便于反推正确的 npm 包名 */
  attempts?: string[]
  t: Translate
  env: EnvInfo | null
  onCopy: (text: string) => void
  onClose: () => void
  /** 网络不通时的「去系统诊断」直达按钮：跳到设置 → 系统诊断跑连通性检测（由宿主提供） */
  onRunDiagnostics?: () => void
}) {
  // 失败归类：当前安装通道（npm/git）装不上 = 插件分发/依赖的问题，一律引导提 Issue
  const failureKind = classifyFailure(message)
  // 服务端 [npm-too-low] 标记里带的本机 npm 版本（无标记为 null，提示文案降级为「怀疑」）
  const npmVersion = npmTooLowVersion(message)
  // 复制完整错误：实际执行/尝试过的安装命令（如有）+ 完整错误正文。
  // 只复制 message 会丢上下文 —— 命令行安装输入的目标、执行过的命令都在 command/attempts 里，
  // 光拷一句「unsupported install target」出去没人看得懂
  const copyText = [
    ...(command ? [command] : []),
    ...(attempts ?? []),
    message,
  ].join('\n')
  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
  },
    h('div', { className: styles.errorModal, role: 'dialog', 'aria-modal': 'true' },
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
            // 仓库地址（用户名/仓库）统一显示为可点击超链接，跳转到官网详情页（含插件收录信息），而非直接跳 GitHub
            repo ? h('a', {
              className: styles.failRepo,
              href: pluginSiteUrl(repo),
              target: '_blank',
              rel: 'noopener noreferrer',
              title: repo,
            }, repo) : null,
            // 复制按钮放最上面、浅灰隐蔽；报错正文不允许鼠标选择复制，只能点这里
            h('button', { className: styles.errorCopySoft, onClick: () => onCopy(copyText) }, t('errorCopy')),
          ),
          // 报错信息完整展示（可滚动），比失败记录的预览看得更多
          h('pre', { className: styles.errorBox }, message),
          // npm 内部崩溃（edgesOut）＋ 本机 npm 版本过低：npm 自身已知缺陷，不是插件问题 ——
          // 直接给升级指引，不引导提 Issue（提了也是 npm 的问题，插件作者无法修复）
          failureKind === 'npmTooOld'
            ? h('div', { className: styles.failPrepareHint },
              t(npmVersion ? 'failNpmTooLowV' : 'failNpmTooLow', npmVersion ? { v: npmVersion } : undefined))
            : failureKind === 'dshMissing'
              // 找不到 dsh 命令（Win「不是内部或外部命令」/ POSIX「command not found」/ spawn ENOENT）：
              // 本机 DeepSeek Harness 未正确安装或 dsh 不在 PATH，不是插件问题 —— 直接给环境修复指引，不引导提 Issue
              ? h('div', { className: styles.failPrepareHint }, t('failDshMissingHint'))
              : failureKind === 'network'
              // 安装前预检 / 安装日志里的连接失败（[network] / git fetch 超时 / DNS / TLS）：
              // 是本机网络不通或代理有问题，不是插件问题 —— 提示检查网络 + 直达「系统诊断」，
              // 不引导提 Issue
              ? h('div', null, [
                // 「无法访问 …」醒目行：精准告诉用户具体哪个地址连不上（消息里取不到地址就跳过这行）
                (() => { const target = unreachableTargetOf(message); return target ? h('div', { className: styles.failNetworkTarget }, t('failNetworkTarget', { url: target })) : null })(),
                h('div', { className: styles.failPrepareHint }, t('failNetworkHint')),
                onRunDiagnostics ? h('button', {
                  className: styles.failDiagBtn,
                  onClick: onRunDiagnostics,
                }, t('failNetworkRunDiag')) : null,
              ])
              : failureKind === 'pluginPrepare' || failureKind === 'pnpmIgnoredBuild'
              ? h('div', null, [
                // [packaging]（预检/装后校验拦截：git 分发缺产物）与
                // prepare 构建脚本实际执行失败 / 原生依赖构建被 pnpm 拦截：都是插件打包分发问题 —— 先说明原因，按钮在下方提交
                h('div', { className: styles.failPrepareHint }, failureKind === 'pnpmIgnoredBuild'
                  ? t('failIgnoredBuild')
                  : /\[packaging\]/i.test(message) ? t('failPackagingHint') : t('failPrepareHint')),
                repo ? h('a', {
                  className: styles.failBigIssue,
                  href: pluginIssueUrl(repo, message, env, command, attempts),
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  title: t('failIssueHint'),
                }, t('failIssueBig')) : null,
              ])
              : repo ? h('a', {
                className: styles.failBigIssue,
                href: pluginIssueUrl(repo, message, env, command, attempts),
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
            : toast.kind === 'revealFail' ? t('openFolderFail')
              : toast.kind === 'updates' ? t('updatesFound', { n: toast.n ?? 0 })
                  : t('uninstallFail')
  const fail = toast.kind === 'fail' || toast.kind === 'removeFail' || toast.kind === 'revealFail'
  return h('div', {
    key: toast.id,
    className: fail ? `${styles.toast} ${styles.toastFail}` : styles.toast,
  }, text)
}

/** 待重启确认弹窗：已安装列表行内「重启」按钮点击后弹出，
 *  与通知中心待重启条目同一交互（说明 + 稍后重启 / 立即重启），
 *  避免行内按钮误触直接触发宿主重启。 */
export function RestartConfirmModal({ t, restarting, onClose, onRestartNow }: {
  t: Translate
  restarting: boolean
  onClose: () => void
  onRestartNow: () => void
}) {
  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose() },
  },
    h('div', { className: styles.modal, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        h('div', { className: styles.modalTitle }, t('sectionPendingRestart')),
        h('button', {
          className: styles.modalClose,
          type: 'button',
          'aria-label': t('errorClose'),
          onClick: onClose,
        }, h(CloseIcon)),
      ),
      h('div', { className: styles.modalBody },
        // 重启确认：红色警告三角 —— 重启会中断正在进行的安装/卸载任务，风险提示
        h('div', { className: styles.confirmIconWrap },
          h(ConfirmIcon, { type: 'warning' }),
        ),
        h('div', { className: styles.failPrepareHint }, t('restartHint')),
        h('div', { className: styles.modalActions },
          h('button', {
            className: styles.restartLater,
            type: 'button',
            disabled: restarting,
            onClick: onClose,
          }, t('restartLater')),
          h('button', {
            className: styles.restartNowWarning,
            type: 'button',
            disabled: restarting,
            onClick: onRestartNow,
          }, restarting ? t('restarting') : t('restartNow')),
        ),
      ),
    ),
  )
}
