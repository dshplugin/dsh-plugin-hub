/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 插件中心的弹窗层：安装确认弹窗、卸载弹窗与全局 Toast。两个弹窗在变更执行期间
 * 自我锁定，随后切到只有一个动作的结果视图 —— 常见情况给「完成」（关闭时刷新页面即生效），
 * 刷新解决不了的少数情况才给单个「立即重启」。
 */
import { createElement as h } from 'react'
import type { MouseEvent } from 'react'
import styles from '../../styles/Modal.module.css'
import type { EnvInfo, HubPlugin, TaskState, ToastState, Translate } from '../../types.ts'
import { CloseIcon, ConfirmIcon, CopyIcon, LinkIcon } from '../ui/icons.tsx'
import { ProgressView } from './ProgressView.tsx'
import { installCommandOf } from '../../logic/install-command.ts'
import { pluginDetailUrl, pluginIssueUrl, pluginSiteUrl, hubIssueUrl } from '../../logic/urls.ts'
import { classifyFailure, formatFailureMessage, missingRegistryPackageOf, npmTooLowVersion, pnpmPolicyHintOf, pnpmPolicyHintParams, registryMissingHintOf, unreachableTargetOf, registryHostOf, authRegistryHostOf, exclusiveProfileOf, desktopCliFallbackOf, dshTooOldInfoOf, unresolvedBundleOf, missingLocalDirOf } from '../../logic/failures.ts'
import type { FailureAction } from '../../logic/failures.ts'

/** 完成结果视图：绿色对勾 + 标题/描述；
 *  终态只有两种：
 *  - needsRestart=true（刷新解决不了：热挂载失败 / 非 dsh 插件 / 更新）→ 仅一个「立即重启」
 *    按钮（重启会中断进行中的任务，故仍需用户确认），关闭即放弃；
 *  - 其余（含 needsReload=true 的「已热挂载、仅剩客户端 UI」）→ 仅「完成」按钮：关闭结果弹窗时
 *    上层自动刷新页面让插件生效，不再给「稍后/立即刷新」手动选择。 */
function ResultView({
  title, desc, t, restarting, needsRestart, needsReload, bundleDeselected, onRestart, onClose,
}: {
  title: string
  desc: string
  t: Translate
  restarting: boolean
  needsRestart: boolean
  /** 仅刷新页面即生效（插件已热挂载）：给一句自动刷新说明，按钮仍是「完成」 */
  needsReload?: boolean
  /** 市场自更新成功、但 bundle 被取消勾选：重启后市场不会出现，提示重新勾选 */
  bundleDeselected?: boolean
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
    bundleDeselected ? h('div', { className: styles.bundleDeselectedHint }, t('bundleDeselectedHint')) : null,
    needsRestart
      ? h('div', null, [
        h('div', { className: styles.resultRestarting }, restarting ? t('restarting') : t('restartHint')),
        h('div', { className: styles.modalActions },
          h('button', { className: styles.restartNowWarning, onClick: onRestart, disabled: restarting },
            restarting ? t('restarting') : t('restartNow')),
        ),
      ])
      : h('div', null, [
        needsReload ? h('div', { className: styles.resultRestarting }, t('reloadHint')) : null,
        h('div', { className: styles.modalActions },
          h('button', { className: styles.restartNow, onClick: onClose }, t('done'))),
      ]),
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
  /** 完成结果是否需重启才生效：true → 仅给「立即重启」；false → 仅「完成」（关闭即自动刷新） */
  needsRestart: boolean
  /** 完成结果是否只需刷新页面即生效（插件已热挂载）：true → 结果视图显示自动刷新说明 */
  needsReload: boolean
  /** 市场自更新成功、但 profile 的 bundle 列表已不含 dsh-plugin：结果页提示重新勾选 */
  bundleDeselected?: boolean
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
  const { plugin, customTarget, globalNpm, done, task, t, langPath, restarting, submitting, update, cliOnly, needsRestart, needsReload, bundleDeselected, onClose, onCopy, onInstall, onRestart } = props
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
          needsReload,
          bundleDeselected,
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
          // 需在终端手动安装的插件（webInstallable=false）：按钮位只给提示与复制通道，不提供一键安装；
          // 人工干预标记（manualInstall）另给一条更明确的终端引导
          cliOnly ? h('div', { className: styles.cliOnlyHint },
            t(plugin?.install?.manualInstall === true ? 'manualInstallOnlyHint' : 'cliOnlyHint')) : null,
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
            // 命令行插件（webInstallable=false）：网页端无法可靠代执行（如 npx 安装器），
            // 只给复制命令，不提供一键安装，避免装成无效插件
            cliOnly ? null : h('button', {
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
  /** 完成结果是否需重启才生效：true（停用失败等刷新解决不了的场景）→ 仅给「立即重启」；
   *  false（loader 已即时停用）→ 仅「完成」，关闭即自动刷新页面摘除插件面板 */
  needsRestart: boolean
  /** 卸载的插件带客户端 UI 且已即时停用：面板要刷新页面才摘除 → 结果视图给自动刷新说明 */
  needsReload?: boolean
  onClose: () => void
  onCancel: () => void
  onCopyCommand: () => void
  onConfirm: () => void
  onRestart: () => void
}

/** 卸载确认弹窗：确认/进行中（后台队列，可关闭）；完成后切换为结果视图（成功即生效，仅「完成」关闭）。 */
export function UninstallModal(props: UninstallModalProps) {
  const { plugin, done, task, t, langPath, restarting, submitting, needsRestart, needsReload, onClose, onCancel, onCopyCommand, onConfirm, onRestart } = props
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
          needsReload,
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

/** 安装/更新/卸载失败弹窗：标题、徽标、提示文案与 issue 正文都按传入的动作取词。 */
export function ErrorModal({ message, repo, action, command, attempts, t, env, onCopy, onClose, onRunDiagnostics }: {
  message: string
  repo: string | null
  action: FailureAction
  command?: string
  /** 实际执行/重试过的安装命令：issue 预填一并贴给作者 */
  attempts?: string[]
  t: Translate
  env: EnvInfo | null
  onCopy: (text: string) => void
  onClose: () => void
  /** 网络不通时的「去系统诊断」直达按钮：跳到设置 → 系统诊断跑连通性检测（由宿主提供） */
  onRunDiagnostics?: () => void
}) {
  // 失败归类：装不上 = 插件分发/依赖的问题，一律引导提 Issue
  const failureKind = classifyFailure(message)
  // 动作词：标题、徽标与提示里的 {action} 统一取这一个词
  const actionWord = t(action === 'uninstall' ? 'actionUninstall' : action === 'update' ? 'actionUpdate' : 'actionInstall')
  // 服务端 [npm-too-low] 标记里带的本机 npm 版本（无标记为 null，提示文案降级为「怀疑」）
  const npmVersion = npmTooLowVersion(message)
  // 复制完整错误：实际执行/尝试过的安装命令（如有）+ 完整错误正文。
  // 只复制 message 会丢上下文 —— 命令行安装输入的目标、执行过的命令都在 command/attempts 里，
  // 光拷一句「unsupported install target」出去没人看得懂
  // 展示与复制都用展开后的文本：宿主门禁消息里的 peerDependencies 是压缩 JSON，
  // 原样展示会挤成一整行；格式化只影响可读性，不改变归类与上报逻辑
  const displayMessage = formatFailureMessage(message)
  const copyText = [
    ...(command ? [command] : []),
    ...(attempts ?? []),
    displayMessage,
  ].join('\n')
  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
  },
    h('div', { className: styles.errorModal, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        // 标题按动作明确区分：安装失败 / 更新失败 / 卸载失败
        h('div', { className: styles.errorTitle },
          t(action === 'uninstall' ? 'errorTitleUninstall' : action === 'update' ? 'errorTitleUpdate' : 'errorTitleInstall')),
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
            // 跳官网「插件详情」页；文字里直接给出目标地址（去掉协议），点前就知道会去哪
            repo ? (() => {
              const url = pluginSiteUrl(repo)
              return h('a', {
                className: styles.failRepo,
                href: url,
                target: '_blank',
                rel: 'noopener noreferrer',
                title: url,
              },
                h('span', { className: styles.failRepoLabel }, `${t('detailTitle')} · `),
                h('span', { className: styles.failRepoUrl }, url.replace(/^https?:\/\//, '').split('?')[0]),
              )
            })() : null,
            // 复制按钮放最上面、浅灰隐蔽；报错正文不允许鼠标选择复制，只能点这里
            h('button', { className: styles.errorCopySoft, onClick: () => onCopy(copyText) }, t('errorCopy')),
          ),
          // 报错信息完整展示（可滚动），比失败记录的预览看得更多
          h('pre', { className: styles.errorBox }, displayMessage),
          // 统一失败卡片头部：报错类型 + 一句话原因（各类型的具体指引仍在下面的分支里）
          h('div', { className: styles.failKindTitle }, t(`failKind_${failureKind}`, failureKind === 'hostIncompatible'
            ? { version: /incompatible with dsh\s+([^\s:;,]+)/i.exec(message)?.[1] ?? '' }
            : undefined)),
          failureKind === 'hostIncompatible'
            ? null
            : h('div', { className: styles.failReason }, t(`failReason_${failureKind}`)),
          // npm 内部崩溃（edgesOut）＋ 本机 npm 版本过低：npm 自身已知缺陷，不是插件问题 ——
          // 直接给升级指引，不引导提 Issue（提了也是 npm 的问题，插件作者无法修复）
          failureKind === 'npmTooOld'
            ? h('div', { className: styles.failPrepareHint },
              t(npmVersion ? 'failNpmTooLowV' : 'failNpmTooLow', npmVersion ? { v: npmVersion } : undefined))
            : failureKind === 'dshMissing'
              // 本机缺 dsh，不是插件问题
              ? h('div', { className: styles.failPrepareHint }, t('failDshMissingHint'))
              : failureKind === 'gitMissing'
              // 本机缺 git，不是插件问题
              ? h('div', { className: styles.failPrepareHint }, t('failGitMissingHint'))
              : failureKind === 'pnpmMissing'
              // 本机缺 pnpm，不是插件问题
              ? h('div', { className: styles.failPrepareHint }, t('failPnpmMissingHint'))
              : failureKind === 'npmMissing'
              // 本机缺 npm，不是插件问题
              ? h('div', { className: styles.failPrepareHint }, t('failNpmMissingHint'))
              : failureKind === 'buildToolchainMissing'
              // 原生模块要本机编译，缺编译器属于用户环境，不引导提 Issue
              ? h('div', { className: styles.failPrepareHint }, t('failBuildToolchainHint'))
              : failureKind === 'pnpmWorkspace'
              // pnpm 拒绝把依赖装到 workspace 根目录（ERR_PNPM_ADDING_TO_ROOT）：宿主在 profile 目录
              // 调 pnpm add 时未声明在根操作，任何插件都会失败，不是插件问题 ——
              // 给 .npmrc 豁免指引，不引导提 Issue
              ? h('div', { className: styles.failPrepareHint }, t('failPnpmWorkspaceHint'))
              : failureKind === 'pnpmModulesMismatch'
              // profile 的 modules 目录与当前 pnpm 配置不一致（hoist / 虚拟目录长度 / node-linker 等）：
              // 该 profile 内的安装/卸载都会失败 —— 重建 modules 目录或统一配置即可，不引导提 Issue
              ? h('div', { className: styles.failPrepareHint }, t('failPnpmModulesMismatchHint'))
              : failureKind === 'pnpmStore'
              // pnpm 存在但 store 大版本不匹配（ERR_PNPM_UNEXPECTED_STORE）：profile 目录的依赖是
              // 另一大版本 pnpm 装的，当前 pnpm 不认，任何插件装进该 profile 都会失败 ——
              // 给清理重建指引，不引导提 Issue
              ? h('div', { className: styles.failPrepareHint }, t('failPnpmStoreHint'))
              : failureKind === 'pnpmPolicy'
              // pnpm 11 供应链安全策略拦截（minimumReleaseAge 拒收发布太新的包 / untrusted origin）：
              // 本机 pnpm 策略不放行，装任何「刚发布/新来源」插件都撞墙 —— 给豁免指引，不引导提 Issue
              ? h('div', { className: styles.failPrepareHint }, t(pnpmPolicyHintOf(message), pnpmPolicyHintParams(message)))
              : failureKind === 'pnpmUnusedPatch'
              // profile 里留着指向旧版本 dsh-plugin 的补丁声明（ERR_PNPM_UNUSED_PATCH）：pnpm 发现
              // 补丁没被用上就中止整次安装，任何插件都装不进来 —— 给删除条目的指引，不引导提 Issue
              ? h('div', { className: styles.failPrepareHint }, t('failPnpmUnusedPatchHint'))
              : failureKind === 'profileYamlCorrupted'
              // profile 里的 YAML 配置解析不了（pnpm-workspace.yaml / pnpm-lock.yaml 有重复键、缩进坏了）：
              // pnpm 在依赖解析之前就退出，该 profile 内的安装都会失败 —— 给修复/重建指引，不引导提 Issue
              ? h('div', { className: styles.failPrepareHint }, t('failProfileYamlHint'))
              : failureKind === 'profileState'
              // profile 的 pnpm 元数据与本机不一致（lockfile 过期 / packageManager 版本不符 /
              // 补丁未生效）：pnpm 在真正装插件之前就中止，该 profile 内的安装都会失败 ——
              // 给重建指引，不引导提 Issue
              ? h('div', { className: styles.failPrepareHint }, t('failProfileStateHint'))
              : failureKind === 'nodeEngine'
              // 本机 Node / pnpm 版本低于包声明的下限：升级即可解决，装任何同类插件都会失败 ——
              // 不引导提 Issue
              ? h('div', { className: styles.failPrepareHint }, t('failNodeEngineHint'))
              : failureKind === 'pnpmMissingDep'
              // profile 里留着指向 registry 上不存在（404）的包的依赖：pnpm 连得上 registry，
              // 是被明确告知包不存在 —— 该 profile 的任何安装都会先卡在这条依赖上，与本次要装的
              // 插件无关 → 点名缺失的包 + 删除条目指引，不引导提 Issue
              ? h('div', null, [
                (() => {
                  const pkg = missingRegistryPackageOf(message)
                  return pkg ? h('div', { className: styles.failNetworkTarget }, t('failPnpmMissingDepTarget', { pkg })) : null
                })(),
                h('div', { className: styles.failPrepareHint }, t(registryMissingHintOf(message))),
              ])
              : failureKind === 'pluginMissingDep'
              // 服务端用**官方** registry 复核过：插件依赖树里的某个包在官方源上也不存在，且不是用户
              // profile 的残留依赖 → 作者侧问题（依赖没发布/已被删除）。判据是源上的客观存在性，
              // 不是我们的启发式判断，故不给「市场误判」次要入口，直接引导到插件作者仓库提 Issue。
              ? h('div', null, [
                (() => {
                  const pkg = missingRegistryPackageOf(message)
                  return pkg ? h('div', { className: styles.failNetworkTarget }, t('failPluginMissingDepTarget', { pkg })) : null
                })(),
                h('div', { className: styles.failPrepareHint }, t('failPluginMissingDepHint')),
                repo ? h('a', {
                  className: styles.failBigIssue,
                  href: pluginIssueUrl(repo, message, env, command, attempts, action),
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  title: t('failIssueHint'),
                }, t('failIssueBig')) : null,
              ])
              : failureKind === 'hostIncompatible'
              // 宿主版本门禁：插件声明的兼容范围不含当前 dsh 版本，安装前就被宿主拒绝。
              // 这是作者能修的（把该版本加进兼容清单），故直接引导到作者仓库；同时说明本地可临时授权
              ? h('div', null, [
                (() => {
                  const version = /incompatible with dsh\s+([^\s:;,]+)/i.exec(message)?.[1] ?? ''
                  return h('div', null, [
                    h('div', { className: styles.failReason }, t('failHostIncompatibleReason', { version })),
                    h('div', { className: styles.failPrepareHint }, t('failHostIncompatibleHint')),
                  ])
                })(),
                repo ? h('a', {
                  className: styles.failBigIssue,
                  href: pluginIssueUrl(repo, message, env, command, attempts, action),
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  title: t('failIssueHint'),
                }, t('failIssueBig')) : null,
              ])
              : failureKind === 'registryVersionStale'
              // 要装的版本在「实际执行安装的那个源」里查不到（ERR_PNPM_NO_MATCHING_VERSION / ETARGET）：
              // 常见于镜像滞后 —— 实际安装沿用本机 ~/.npmrc 的源，
              // 官方源刚发布而镜像还没同步；也可能只是版本号写错。与插件作者无关 ——
              // 给「对齐源 / 那一次显式走官方源 / 用离线包」的指引，不引导提 Issue
              ? h('div', { className: styles.failPrepareHint }, t('failRegistryVersionStaleHint'))
              : failureKind === 'pnpmLinkedDirMissing'
              // profile 里留着指向不存在目录的本地依赖（ERR_PNPM_LINKED_PKG_DIR_NOT_FOUND / pnpm ENOENT lstat）：
              // 常见于 link:/本地路径装过开发中的插件、之后目录被删；pnpm 每次解析 profile 依赖都先卡在它上面，
              // 与本次要装的插件无关 —— 点名缺失目录 + 删除悬空条目的指引，不引导提 Issue
              ? h('div', null, [
                (() => {
                  const dir = missingLocalDirOf(message)
                  return dir ? h('div', { className: styles.failNetworkTarget }, t('failLinkedDirTarget', { path: dir })) : null
                })(),
                h('div', { className: styles.failPrepareHint }, t('failPnpmLinkedDirMissingHint')),
              ])
              : failureKind === 'fileLocked'
              // profile 文件被其他进程占用
              ? h('div', { className: styles.failPrepareHint }, t('failFileLockedHint'))
              : failureKind === 'accessDenied'
              // 系统拒绝写 profile
              ? h('div', { className: styles.failPrepareHint }, t('failAccessDeniedHint'))
              : failureKind === 'fsUnavailable'
              // 磁盘写不进去
              ? h('div', { className: styles.failPrepareHint }, t('failFsUnavailableHint'))
              : failureKind === 'originRejected'
              // 请求来源没通过本地 hub 服务的校验（服务端 403 untrusted origin）：请求根本没进
              // 安装流程，与插件无关 —— 引导从本机地址重新打开市场，不引导提 Issue
              ? h('div', { className: styles.failPrepareHint }, t('failOriginRejectedHint', { profile: env?.profile ?? '<profile>' }))
              : failureKind === 'profileExclusive'
              // desktop profile 只能由桌面应用管理：外部 dsh CLI 被宿主拒绝，属环境约束。
              // 但日志里有 [desktop-cli-fallback] 时是我们没找到应用内 CLI 引导脚本才退回 PATH
              // —— 那是安装器自身的问题，必须留一条回到插件中心的通道
              ? (() => {
                const profile = exclusiveProfileOf(message)
                const ourBug = desktopCliFallbackOf(message)
                return h('div', null, [
                  h('div', { className: styles.failPrepareHint },
                    t(profile ? 'failProfileExclusiveHint' : 'failProfileExclusiveHintNoProfile', profile ? { profile } : undefined)),
                  ourBug ? h('div', { className: styles.failPrepareHint }, t('failDesktopCliFallbackHint')) : null,
                  ourBug ? h('a', {
                    className: styles.failBigIssue,
                    href: hubIssueUrl(repo, message, env, command, attempts, 'triage', action),
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    title: t('failHubIssueHint'),
                  }, t('failIssueBig')) : null,
                ])
              })()
              : failureKind === 'registryAuth'
              // npm 源返回 401/403：私有源需要凭据，或当前网络/IP 不被允许 —— 本机环境问题，
              // 给「配认证 / 换回官方源 / 切公共镜像」指引，不引导提 Issue
              ? (() => {
                const host = authRegistryHostOf(message)
                return h('div', { className: styles.failPrepareHint },
                  t(host ? 'failRegistryAuthHint' : 'failRegistryAuthHintNoHost', host ? { host } : undefined))
              })()
              : failureKind === 'dshTooOld'
              // 安装器读插件 npm 元数据得出的结论：插件要求的 DSH 下限高于本机宿主。
              // 用户升级 DSH 即可解决，不属插件作者、也不属插件中心 —— 不引导提 Issue
              ? (() => {
                const info = dshTooOldInfoOf(message)
                return h('div', { className: styles.failPrepareHint },
                  t('failDshTooOldHint', info ?? { pkg: repo ?? 'plugin', floor: '?', current: '?' }))
              })()
              : failureKind === 'localEnv'
              // 未命中具体成因、但特征指向本机环境：给通用自查清单 + 直达系统诊断，不推给作者，
              // 也默认不推给我们 —— 只留小字反馈入口，防环境问题堆进插件中心的 issue 列表
              ? h('div', null, [
                h('div', { className: styles.failPrepareHint }, t('failLocalEnvHint')),
                onRunDiagnostics ? h('button', { className: styles.failDiagBtn, onClick: onRunDiagnostics }, t('failNetworkRunDiag')) : null,
                h('div', null, [
                  h('div', { className: styles.failPrepareHint }, t('failMisjudgeHint')),
                  h('a', {
                    className: styles.failMisjudgeLink,
                    href: hubIssueUrl(repo, message, env, command, attempts, 'triage', action),
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    title: t('failHubIssueHint'),
                  }, t('failMisjudgeLink')),
                ]),
              ])
              : failureKind === 'tlsTrust'
              // 本机证书链不被信任（公司 SSL 审计 / 杀软 / 抓包代理）：给 CA 与镜像的具体处置，
              // 不引导提 Issue —— 换任何插件都会一样失败
              ? h('div', null, [
                h('div', { className: styles.failPrepareHint }, t('failTlsTrustHint')),
                onRunDiagnostics ? h('button', { className: styles.failDiagBtn, onClick: onRunDiagnostics }, t('failNetworkRunDiag')) : null,
              ])
              : failureKind === 'network'
              // 安装前网络探测 / 安装日志里的连接失败（[network] / git fetch 超时 / DNS / TLS）：
              // 是本机网络不通或代理有问题，不是插件问题 —— 提示检查网络 + 直达「系统诊断」，
              // 不引导提 Issue
              ? h('div', null, [
                // 「无法访问 …」醒目行：精准告诉用户具体哪个地址连不上（消息里取不到地址就跳过这行）
                (() => { const target = unreachableTargetOf(message); return target ? h('div', { className: styles.failNetworkTarget }, t('failNetworkTarget', { url: target })) : null })(),
                // registry 被指向内网/自定义源（tarball 从非官方源下载失败）：直接给出换源指引，
                // 否则用户外网是通的会困惑「为什么连不上」
                (() => { const host = registryHostOf(message); return host ? h('div', { className: styles.failPrepareHint }, t('failNetworkRegistryHint', { host })) : null })(),
                h('div', { className: styles.failPrepareHint }, t('failNetworkHint', { action: actionWord })),
                onRunDiagnostics ? h('button', {
                  className: styles.failDiagBtn,
                  onClick: onRunDiagnostics,
                }, t('failNetworkRunDiag')) : null,
              ])
              : failureKind === 'pluginPrepare'
              ? h('div', null, [
                // [packaging]（装后校验拦截：分发缺产物）与
                // prepare 构建脚本实际执行失败：唯一确有证据的插件打包分发问题 —— 引导到插件仓库提 Issue
                h('div', { className: styles.failPrepareHint }, /\[packaging\]/i.test(message) ? t('failPackagingHint') : t('failPrepareHint')),
                repo ? h('a', {
                  className: styles.failBigIssue,
                  href: pluginIssueUrl(repo, message, env, command, attempts, action),
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  title: t('failIssueHint'),
                }, t('failIssueBig')) : null,
                // 次要入口：这条分支的判据（[packaging] 装后校验、prepare 摘要）是插件中心
                // 自己产出的，不是 pnpm 原文 —— 判错时用户会被送去作者仓库、我们永远收不到反馈，
                // 故另给一条「可能是市场误判」的反馈通道（正文自我说明它来自哪条分支）
                repo ? h('div', null, [
                  h('div', { className: styles.failPrepareHint }, t('failMisjudgeHint')),
                  h('a', {
                    className: styles.failMisjudgeLink,
                    href: hubIssueUrl(repo, message, env, command, attempts, 'misjudge', action),
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    title: t('failHubIssueHint'),
                  }, t('failMisjudgeLink')),
                ]) : null,
              ])
              : failureKind === 'profileBundleMissing'
              // profile 声明的某个 bundle 没装进 node_modules：宿主在安装前就中止，
              // 与本次插件无关 —— 给「让宿主补装 profile 依赖 / 重装应用」指引，不引导提 Issue
              ? (() => {
                const info = unresolvedBundleOf(message)
                return h('div', { className: styles.failPrepareHint },
                  t('failProfileBundleMissingHint', { pkg: info?.pkg ?? 'unknown', profile: env?.profile ?? '<profile>' }))
              })()
              : failureKind === 'hubState'
              ? h('div', null, [
                // 插件中心的列表状态已过期（安装器自身守卫消息）：不是插件问题、也不是 bug，只给可行动提示，不引导提 Issue
                h('div', { className: styles.failPrepareHint }, t('failHubStateHint', { action: actionWord })),
              ])
              : failureKind === 'timeout'
              ? h('div', null, [
                // 安装命令超时被强杀（日志里 pnpm 可能已 Done）：可能其实已装成功 —— 给可行动提示，不引导提 Issue
                h('div', { className: styles.failPrepareHint }, t('failTimeoutHint')),
              ])
              : failureKind === 'profileLock'
              ? h('div', null, [
                // DSH 写 profile 的锁超时（同一 profile 被别的 dsh/安装任务占着）：给可行动提示，不引导提 Issue
                h('div', { className: styles.failPrepareHint }, t('failProfileLockHint', { action: actionWord })),
              ])
              : failureKind === 'hostCliSpawn'
              ? h('div', null, [
                // 宿主自身入口起不来：环境问题，给提示、不引导提 Issue
                h('div', { className: styles.failPrepareHint }, t('failHostCliSpawnHint')),
              ])
              : failureKind === 'pnpmIgnoredBuild'
              // 该类型的插件依赖需要在用户机器上编译原生模块，pnpm 默认拦住；我们已自动放行
              // allowBuilds 并重试过一次，仍失败说明任何用户都装不上 —— 属作者侧（发预构建产物 / 走 release 包）。
              ? h('div', null, [
                h('div', { className: styles.failPrepareHint }, t('failIgnoredBuild')),
                repo ? h('a', {
                  className: styles.failBigIssue,
                  href: pluginIssueUrl(repo, message, env, command, attempts, action),
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  title: t('failIssueHint'),
                }, t('failIssueBig')) : null,
                // 这条判定里也有我们的动作（我们自动放行过 allowBuilds），判错时得留一条回到插件中心的路
                repo ? h('div', null, [
                  h('div', { className: styles.failPrepareHint }, t('failMisjudgeHint')),
                  h('a', {
                    className: styles.failMisjudgeLink,
                    href: hubIssueUrl(repo, message, env, command, attempts, 'misjudge', action),
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    title: t('failHubIssueHint'),
                  }, t('failMisjudgeLink')),
                ]) : null,
              ])
              : h('div', null, [
                // 未分类（hub）：不归到插件作者，改为引导到插件中心仓库分诊
                h('div', { className: styles.failPrepareHint }, t('failUnclassifiedHint', { action: actionWord })),
                h('a', {
                  className: styles.failBigIssue,
                  href: hubIssueUrl(repo, message, env, command, attempts, 'triage', action),
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  title: t('failHubIssueHint'),
                }, t('failHubIssueBig')),
              ]),
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
              : toast.kind === 'restartDesktop' ? t('toastRestartDesktop')
                : toast.kind === 'installedLive' ? t('toastInstalledLive')
                  : toast.kind === 'installedReload' ? t('toastInstalledReload')
                    : t('uninstallFail')
  const fail = toast.kind === 'fail' || toast.kind === 'removeFail' || toast.kind === 'revealFail' || toast.kind === 'restartDesktop'
  return h('div', {
    key: toast.id,
    className: fail ? `${styles.toast} ${styles.toastFail}` : styles.toast,
  }, text)
}

/** 待重启确认弹窗：已安装列表行内「重启」按钮点击后弹出，
 *  与通知中心待重启条目同一交互（红色警告说明 + 单个「立即重启」），
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
          // 关闭本弹窗即视为「稍后」，只保留单个「立即重启」
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
