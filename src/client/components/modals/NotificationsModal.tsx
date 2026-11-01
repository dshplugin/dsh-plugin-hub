/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 通知中心弹窗：每个已结算的安装/卸载任务（成功与失败）的持久化清单。
 *
 * 记录在结算时写入 localStorage（见 logic/failures.ts），即使弹窗被关闭或用户离开，
 * 结果也不会丢失。每条带圆形状态徽标（成功绿勾、失败红叉，白色图形）与消息文本；
 * 失败项保留复制/修复/提 Issue 动作。由头部入口按钮（「设置」tab 之后）打开。
 */
import { createElement as h, useState } from 'react'
import type { MouseEvent } from 'react'
import styles from '../../styles/Modal.module.css'
import type { EnvInfo, Translate } from '../../types.ts'
import type { NotificationRecord } from '../../logic/failures.ts'
import { actionOfRecord, classifyFailure, formatFailureMessage, missingRegistryPackageOf, npmTooLowVersion, pnpmPolicyHintOf, pnpmPolicyHintParams, registryMissingHintOf, unreachableTargetOf, registryHostOf, authRegistryHostOf, exclusiveProfileOf, desktopCliFallbackOf, dshTooOldInfoOf, unresolvedBundleOf, missingLocalDirOf } from '../../logic/failures.ts'
import type { PendingRestart, QueueTask } from '../../hooks/useTaskQueue.ts'
import { pluginIssueUrl, pluginSiteUrl, hubIssueUrl } from '../../logic/urls.ts'
import { CloseIcon } from '../ui/icons.tsx'
import { ConfirmDialog } from './ConfirmDialog.tsx'

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

export function NotificationsModal({ records, tasks, pendingRestarts, t, env, onClose, onCopy, onClear, onRemove, onUpdate, onIgnoreUpdate, cancelTask, restarting, onRestart, onRunDiagnostics, resolveRepo }: {
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
  /** 更新提醒通知点击：跳去该插件的更新确认弹窗 */
  onUpdate: (repo: string) => void
  /** 更新提醒「忽略本次更新」：先弹确认，确认后本次版本不再提醒，下一个新版本再通知 */
  onIgnoreUpdate: (repo: string, version?: string) => void
  cancelTask: (id: number) => void
  restarting: boolean
  onRestart: () => void
  /** 网络不通时的「去系统诊断」直达按钮：跳到设置 → 系统诊断跑连通性检测（由宿主提供） */
  onRunDiagnostics?: () => void
  /** 失败记录 repo 反查：npm 包名（历史记录存的是裸包名）反查成 owner/repo 再显示/提 Issue；
   *  查不到返回 null，按钮与仓库链接一并隐藏（防提到错误仓库）。不传则按记录原样展示。 */
  resolveRepo?: (repo: string) => string | null
}) {
  // 危险操作确认：清空全部 / 删除单条都必须先弹独立确认框（垃圾桶图标），禁止按钮内直接生效
  const [confirmClear, setConfirmClear] = useState(false)
  const [confirmRemoveId, setConfirmRemoveId] = useState<number | null>(null)

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
                      // 兜底项：刷新解决不了（热挂载失败 / 非 dsh 插件 / 更新）才登记待重启；
                      // 关闭本弹窗即视为「稍后」，只在真正需要时给单个「立即重启」
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
              const isUpdate = r.kind === 'update'
              // 展示用仓库：历史记录存的可能是裸 npm 包名，反查成 owner/repo 才显示/提 Issue；
              // 查不到为空 → 仓库链接与提 Issue 按钮都不渲染
              const shownRepo = resolveRepo ? (resolveRepo(r.repo) ?? '') : r.repo
              return h('div', {
                key: r.id,
                // 更新提醒：整行可点击直达更新确认弹窗；install/uninstall 记录维持原交互
                className: r.ok
                  ? `${styles.noticeRow} ${styles.noticeRowOk}${isUpdate ? ` ${styles.noticeRowUpdate}` : ''}`
                  : styles.noticeRow,
                ...(isUpdate ? { onClick: () => onUpdate(r.repo), title: t('updateNoticeGo') } : {}),
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
                      ? (isUpdate
                        ? t('updateNoticeTitle')
                        : (r.action === 'update' ? t('updateDone') : (r.kind === 'install' ? t('installDone') : t('uninstallDone'))))
                      : (r.action === 'update'
                        ? t('errorTitleUpdate')
                        : (r.kind === 'install' ? t('errorTitleInstall') : t('errorTitleUninstall')))),
                    // 更新提醒：新版本号紧随标题展示；repo 为纯文本（整行点击即去更新，不跳官网外链）
                    isUpdate && r.version
                      ? h('span', { className: styles.noticeVersion, title: r.version }, `v${r.version}`)
                      : null,
                    r.repo
                      ? (isUpdate
                        ? h('span', { className: styles.failRepo, title: r.repo }, r.repo)
                        : shownRepo
                          ? (() => {
                            const url = pluginSiteUrl(shownRepo)
                            return h('a', {
                              className: styles.failRepo,
                              // 跳官网「插件详情」页；文字里直接给出目标地址（去掉协议）
                              href: url,
                              target: '_blank',
                              rel: 'noopener noreferrer',
                              title: url,
                            },
                              h('span', { className: styles.failRepoLabel }, `${t('detailTitle')} · `),
                              h('span', { className: styles.failRepoUrl }, url.replace(/^https?:\/\//, '').split('?')[0]))
                          })()
                          // 反查不到仓库身份（如命令行安装的裸 npm 包名）：回退显示记录里的原始值，
                          // 保证通知永不只剩一句「安装/更新成功」没有名字 —— 只是不给官网外链（查不到不敢乱跳）
                          : h('span', { className: styles.failRepo, title: r.repo }, r.repo))
                      : null,
                    !r.ok && h('button', {
                      className: styles.failCopy,
                      onClick: () => onCopy(formatFailureMessage(r.message)),
                    }, t('failCopy')),
                    // 成功通知：时间戳在行右侧，与图标/文字垂直居中，卡片保持单行内容
                    r.ok
                      ? h('span', {
                        className: styles.noticeTime,
                        title: new Date(r.at).toLocaleString(),
                      }, fmtTime(r.at))
                      : null,
                    // 更新提醒：行尾「去更新」按钮直达更新确认弹窗（整行也可点击）
                    isUpdate
                      ? h('button', {
                        className: styles.noticeUpdateGo,
                        onClick: (e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onUpdate(r.repo) },
                      }, t('updateNoticeGo'))
                      : null,
                    // 更新提醒：「忽略本次更新」按钮 —— 先弹确认，确认后本次版本不再提醒
                    isUpdate
                      ? h('button', {
                        className: styles.noticeIgnore,
                        onClick: (e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onIgnoreUpdate(r.repo, r.version) },
                      }, t('ignoreUpdateRun'))
                      : null,
                    // 每条通知右侧的删除按钮：先弹确认框，确认后移除这一条
                    h('button', {
                      className: styles.noticeRemove,
                      'aria-label': t('removeNotification'),
                      title: t('removeNotification'),
                      onClick: (e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); setConfirmRemoveId(r.id) },
                    }, h(CloseIcon)),
                  ),
                  // 统一失败卡片头部：报错类型 + 一句话原因（具体指引在下面的分支里）
                  !r.ok && (() => {
                    const k = classifyFailure(r.message)
                    return h('div', null, [
                      h('div', { className: styles.failKindTitle }, t(`failKind_${k}`, k === 'hostIncompatible'
                        ? { version: /incompatible with dsh\s+([^\s:;,]+)/i.exec(r.message ?? '')?.[1] ?? '' }
                        : undefined)),
                      k === 'hostIncompatible' ? null : h('div', { className: styles.failReason }, t(`failReason_${k}`)),
                    ])
                  })(),
                  // 每条失败记录是一个独立卡片：头部（状态/仓库/时间/复制完整日志）→ 修复或提 Issue 动作。
                  // 卡片不展示错误日志预览，完整日志靠「复制完整日志」按钮带走，避免每条卡片被日志撑高
                  !r.ok && (() => {
                    const kind = classifyFailure(r.message)
                    // 动作词：该条提示与上报正文按真实动作取词
                    const action = actionOfRecord(r)
                    const actionWord = t(action === 'uninstall' ? 'actionUninstall' : action === 'update' ? 'actionUpdate' : 'actionInstall')
                    if (kind === 'npmTooOld') {
                      // npm 内部崩溃（edgesOut）＋ 本机 npm 版本过低：npm 自身已知缺陷，不是插件问题 ——
                      // 直接给升级指引，不引导提 Issue
                      const v = npmTooLowVersion(r.message)
                      return h('div', { className: styles.failPrepareHint },
                        t(v ? 'failNpmTooLowV' : 'failNpmTooLow', v ? { v } : undefined))
                    }
                    if (kind === 'dshMissing') {
                      // 找不到 dsh 命令：本机 DeepSeek Harness 未正确安装或 dsh 不在 PATH，
                      // 不是插件问题 —— 直接给环境修复指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failDshMissingHint'))
                    }
                    if (kind === 'gitMissing') {
                      // 找不到 git 命令：本机 Git 未安装或不在 PATH，不是插件问题 ——
                      // 直接给环境修复指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failGitMissingHint'))
                    }
                    if (kind === 'pnpmMissing') {
                      // 找到了 dsh 但缺 pnpm（dsh 用它管理 profile 插件；dsh 报 pnpm not found on PATH）：
                      // 本机缺 pnpm，不是插件问题 —— 给安装指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failPnpmMissingHint'))
                    }
                    if (kind === 'npmMissing') {
                      // 全局 npm 安装通道 spawn 的 npm 找不到：本机 npm 未安装或不在 PATH ——
                      // 给安装指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failNpmMissingHint'))
                    }
                    if (kind === 'buildToolchainMissing') {
                      // 原生模块要本机编译，缺编译器属于用户环境，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failBuildToolchainHint'))
                    }
                    if (kind === 'pnpmWorkspace') {
                      // pnpm 拒绝把依赖装到 workspace 根目录（ERR_PNPM_ADDING_TO_ROOT）：宿主在 profile
                      // 目录调 pnpm add 未声明在根操作，任何插件都会失败 ——
                      // 给 .npmrc 豁免指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failPnpmWorkspaceHint'))
                    }
                    if (kind === 'pnpmModulesMismatch') {
                      // profile 的 modules 目录与当前 pnpm 配置不一致（hoist / 虚拟目录长度 / node-linker 等）：
                      // 该 profile 内的安装/卸载都会失败 —— 重建 modules 目录或统一配置即可，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failPnpmModulesMismatchHint'))
                    }
                    if (kind === 'pnpmStore') {
                      // pnpm 存在但 store 大版本不匹配（ERR_PNPM_UNEXPECTED_STORE）：profile 目录的依赖是
                      // 另一大版本 pnpm 装的，当前 pnpm 不认，任何插件装进该 profile 都会失败 ——
                      // 给清理重建指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failPnpmStoreHint'))
                    }
                    if (kind === 'pnpmPolicy') {
                      // pnpm 11 供应链安全策略拦截（minimumReleaseAge 拒收发布太新的包 / untrusted origin）：
                      // 本机 pnpm 策略不放行，装任何「刚发布/新来源」插件都撞墙 —— 给豁免指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t(pnpmPolicyHintOf(r.message), pnpmPolicyHintParams(r.message)))
                    }
                    if (kind === 'pnpmUnusedPatch') {
                      // profile 里留着指向旧版本 dsh-plugin 的补丁声明（ERR_PNPM_UNUSED_PATCH）：pnpm
                      // 发现补丁没被用上就中止安装，任何插件都装不进来 —— 不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failPnpmUnusedPatchHint'))
                    }
                    if (kind === 'profileYamlCorrupted') {
                      // profile 里的 YAML 配置解析不了（pnpm-workspace.yaml / pnpm-lock.yaml 有重复键、
                      // 缩进坏了）：pnpm 在依赖解析之前就退出，该 profile 内的安装都会失败 ——
                      // 给修复/重建指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failProfileYamlHint'))
                    }
                    if (kind === 'profileState') {
                      // profile 的 pnpm 元数据与本机不一致（lockfile 过期 / packageManager 版本不符 /
                      // 补丁未生效）：pnpm 在真正装插件之前就中止，该 profile 内的安装都会失败 ——
                      // 给重建指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failProfileStateHint'))
                    }
                    if (kind === 'nodeEngine') {
                      // 本机 Node / pnpm 版本低于包声明的下限：升级即可解决 —— 不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failNodeEngineHint'))
                    }
                    if (kind === 'pnpmMissingDep') {
                      // profile 里留着指向 registry 上不存在（404）的包的依赖：pnpm 连得上 registry，
                      // 是被明确告知包不存在 —— 该 profile 的任何安装都会先卡在这条依赖上，与本次要装的
                      // 插件无关 → 点名缺失的包 + 删除条目指引，不引导提 Issue
                      const pkg = missingRegistryPackageOf(r.message)
                      return h('div', null, [
                        pkg ? h('div', { className: styles.failNetworkTarget }, t('failPnpmMissingDepTarget', { pkg })) : null,
                        h('div', { className: styles.failPrepareHint }, t(registryMissingHintOf(r.message))),
                      ])
                    }
                    if (kind === 'pluginMissingDep') {
                      // 服务端用**官方** registry 复核过：插件依赖树里的包在官方源上也不存在，且不是用户
                      // profile 的残留依赖 → 作者侧问题（依赖没发布/已被删除），引导到插件作者仓库提 Issue
                      //（判据是源上的客观存在性，不是我们的启发式判断，故不设「市场误判」次要入口）
                      const pkg = missingRegistryPackageOf(r.message)
                      return h('div', null, [
                        pkg ? h('div', { className: styles.failNetworkTarget }, t('failPluginMissingDepTarget', { pkg })) : null,
                        h('div', { className: styles.failPrepareHint }, t('failPluginMissingDepHint')),
                        r.repo && shownRepo ? h('a', {
                          className: styles.failBigIssue,
                          href: pluginIssueUrl(shownRepo, r.message, env, r.command, r.attempts, action),
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          title: t('failIssueHint'),
                        }, t('failIssueBig')) : null,
                      ])
                    }
                    if (kind === 'hostIncompatible') {
                      // 宿主版本门禁：插件声明的兼容范围不含当前 dsh 版本，安装前就被拒绝。
                      // 作者能修（把该版本加进兼容清单），故引导到作者仓库；同时说明本地可临时授权
                      const version = /incompatible with dsh\s+([^\s:;,]+)/i.exec(r.message ?? '')?.[1] ?? ''
                      return h('div', null, [
                        h('div', { className: styles.failReason }, t('failHostIncompatibleReason', { version })),
                        h('div', { className: styles.failPrepareHint }, t('failHostIncompatibleHint')),
                        r.repo && shownRepo ? h('a', {
                          className: styles.failBigIssue,
                          href: pluginIssueUrl(shownRepo, r.message, env, r.command, r.attempts, action),
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          title: t('failIssueHint'),
                        }, t('failIssueBig')) : null,
                      ])
                    }
                    if (kind === 'registryVersionStale') {
                      // 要装的版本在「实际执行安装的那个源」里查不到（ERR_PNPM_NO_MATCHING_VERSION / ETARGET）：
                      // 常见于镜像滞后 —— 实际安装沿用本机 ~/.npmrc 的源；
                      // 也可能只是版本号写错。与插件作者无关 —— 给对齐源 / 显式走官方源 / 离线包指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failRegistryVersionStaleHint'))
                    }
                    if (kind === 'pnpmLinkedDirMissing') {
                      // profile 里留着指向不存在目录的本地依赖（ERR_PNPM_LINKED_PKG_DIR_NOT_FOUND /
                      // pnpm ENOENT lstat）：点名缺失目录 + 删除悬空条目，不引导提 Issue
                      const dir = missingLocalDirOf(r.message)
                      return h('div', null, [
                        dir ? h('div', { className: styles.failNetworkTarget }, t('failLinkedDirTarget', { path: dir })) : null,
                        h('div', { className: styles.failPrepareHint }, t('failPnpmLinkedDirMissingHint')),
                      ])
                    }
                    if (kind === 'fileLocked') {
                      // profile 里的文件被其他进程占用（Windows os error 32）：通常是宿主或杀毒软件
                      // 持有句柄 —— 给出完全退出宿主的指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failFileLockedHint'))
                    }
                    if (kind === 'accessDenied') {
                      // profile 里的文件被系统拒绝写入（os error 5 / EPERM / EACCES）：
                      // 占用、只读属性、目录 ACL 或杀软拦截 —— 给退出宿主 + 检查权限的指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failAccessDeniedHint'))
                    }
                    if (kind === 'fsUnavailable') {
                      // 本机磁盘写不进去（ENOSPC / EROFS / EMFILE 及 Windows os error 112、19）：
                      // 空间不足、盘只读、句柄耗尽，任何插件都装不进来 —— 按子场景给指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failFsUnavailableHint'))
                    }
                    if (kind === 'originRejected') {
                      // 请求来源没通过本地 hub 服务的校验（服务端 403 untrusted origin）：请求根本没进
                      // 安装流程，与插件无关 —— 引导从本机地址重新打开市场，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failOriginRejectedHint', { profile: env?.profile ?? '<profile>' }))
                    }
                    if (kind === 'profileExclusive') {
                      // desktop profile 只能由桌面应用管理：外部 dsh CLI 被宿主拒绝，属环境约束。
                      // 带 [desktop-cli-fallback] 则是安装器没找到应用内 CLI 引导脚本 —— 我们的问题，给反馈入口
                      const profile = exclusiveProfileOf(r.message)
                      const ourBug = desktopCliFallbackOf(r.message)
                      return h('div', null, [
                        h('div', { className: styles.failPrepareHint },
                          t(profile ? 'failProfileExclusiveHint' : 'failProfileExclusiveHintNoProfile', profile ? { profile } : undefined)),
                        ourBug ? h('div', { className: styles.failPrepareHint }, t('failDesktopCliFallbackHint')) : null,
                        ourBug ? h('a', {
                          className: styles.failBigIssue,
                          href: hubIssueUrl(shownRepo || r.repo, r.message, env, r.command, r.attempts, 'triage', action),
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          title: t('failHubIssueHint'),
                        }, t('failIssueBig')) : null,
                      ])
                    }
                    if (kind === 'registryAuth') {
                      // npm 源返回 401/403：私有源需要凭据，或当前网络/IP 不被允许 —— 本机环境问题，
                      // 给「配认证 / 换回官方源 / 切公共镜像」指引，不引导提 Issue
                      const host = authRegistryHostOf(r.message)
                      return h('div', { className: styles.failPrepareHint },
                        t(host ? 'failRegistryAuthHint' : 'failRegistryAuthHintNoHost', host ? { host } : undefined))
                    }
                    if (kind === 'dshTooOld') {
                      // 插件要求的 DSH 下限高于本机宿主：升级 DSH 即可，不属作者、也不属插件中心
                      const info = dshTooOldInfoOf(r.message)
                      return h('div', { className: styles.failPrepareHint },
                        t('failDshTooOldHint', info ?? { pkg: shownRepo || r.repo || 'plugin', floor: '?', current: '?' }))
                    }
                    if (kind === 'localEnv') {
                      // 未命中具体成因、但特征指向本机环境：给通用自查清单 + 系统诊断，默认不推给我们，
                      // 只留小字反馈入口（判据是我们自己的启发式，可能误判）
                      return h('div', null, [
                        h('div', { className: styles.failPrepareHint }, t('failLocalEnvHint')),
                        onRunDiagnostics ? h('button', { className: styles.failDiagBtn, onClick: onRunDiagnostics }, t('failNetworkRunDiag')) : null,
                        h('div', null, [
                          h('div', { className: styles.failPrepareHint }, t('failMisjudgeHint')),
                          h('a', {
                            className: styles.failMisjudgeLink,
                            href: hubIssueUrl(shownRepo || r.repo, r.message, env, r.command, r.attempts, 'triage', action),
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            title: t('failHubIssueHint'),
                          }, t('failMisjudgeLink')),
                        ]),
                      ])
                    }
                    if (kind === 'tlsTrust') {
                      // 本机证书链不被信任（公司 SSL 审计 / 杀软 / 抓包代理）：给 CA 与镜像的具体处置，
                      // 不引导提 Issue —— 换任何插件都会一样失败
                      return h('div', null, [
                        h('div', { className: styles.failPrepareHint }, t('failTlsTrustHint')),
                        onRunDiagnostics ? h('button', { className: styles.failDiagBtn, onClick: onRunDiagnostics }, t('failNetworkRunDiag')) : null,
                      ])
                    }
                    if (kind === 'network') {
                      // 安装前网络探测 / 安装日志里的连接失败（[network] / git fetch 超时 / DNS / TLS）：
                      // 是本机网络不通或代理有问题，不是插件问题 —— 提示检查网络 + 直达「系统诊断」，
                      // 不引导提 Issue
                      return h('div', null, [
                        // 「无法访问 …」醒目行：精准告诉用户具体哪个地址连不上（消息里取不到地址就跳过这行）
                        (() => { const target = unreachableTargetOf(r.message); return target ? h('div', { className: styles.failNetworkTarget }, t('failNetworkTarget', { url: target })) : null })(),
                        // registry 被指向内网/自定义源（tarball 从非官方源下载失败）：直接给出换源指引，
                        // 否则用户外网是通的会困惑「为什么连不上」
                        (() => { const host = registryHostOf(r.message); return host ? h('div', { className: styles.failPrepareHint }, t('failNetworkRegistryHint', { host })) : null })(),
                        h('div', { className: styles.failPrepareHint }, t('failNetworkHint', { action: actionWord })),
                        onRunDiagnostics ? h('button', {
                          className: styles.failDiagBtn,
                          onClick: onRunDiagnostics,
                        }, t('failNetworkRunDiag')) : null,
                      ])
                    }
                    if (kind === 'pluginPrepare') {
                      // [packaging]（装后校验拦截：分发缺产物）与
                      // prepare 构建脚本实际执行失败：唯一确有证据的插件打包分发问题 —— 引导到插件仓库提 Issue
                      return h('div', null, [
                        h('div', { className: styles.failPrepareHint }, /\[packaging\]/i.test(r.message) ? t('failPackagingHint') : t('failPrepareHint')),
                        r.repo && shownRepo ? h('a', {
                          className: styles.failBigIssue,
                          href: pluginIssueUrl(shownRepo, r.message, env, r.command, r.attempts, action),
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          title: t('failIssueHint'),
                        }, t('failIssueBig')) : null,
                        // 次要入口：这条分支的判据（[packaging] 装后校验、prepare 摘要）是插件中心
                        // 自己产出的，不是 pnpm 原文 —— 判错时用户会被送去作者仓库、我们永远收不到反馈
                        r.repo && shownRepo ? h('div', null, [
                          h('div', { className: styles.failPrepareHint }, t('failMisjudgeHint')),
                          h('a', {
                            className: styles.failMisjudgeLink,
                            href: hubIssueUrl(shownRepo, r.message, env, r.command, r.attempts, 'misjudge', action),
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            title: t('failHubIssueHint'),
                          }, t('failMisjudgeLink')),
                        ]) : null,
                      ])
                    }
                    if (kind === 'profileBundleMissing') {
                      // profile 声明的某个 bundle 没装进 node_modules：宿主在安装前就中止，
                      // 与本次插件无关 —— 给「让宿主补装 profile 依赖 / 重装应用」指引，不引导提 Issue
                      const info = unresolvedBundleOf(r.message)
                      return h('div', { className: styles.failPrepareHint },
                        t('failProfileBundleMissingHint', { pkg: info?.pkg ?? 'unknown', profile: env?.profile ?? '<profile>' }))
                    }
                    if (kind === 'hubState') {
                      // 插件中心的列表状态已过期（安装器自身守卫消息）：非插件问题、也不是 bug，只给可行动提示，不引导提 Issue
                      return h('div', null, [
                        h('div', { className: styles.failPrepareHint }, t('failHubStateHint', { action: actionWord })),
                      ])
                    }
                    if (kind === 'timeout') {
                      // 安装命令超时被强杀（日志里 pnpm 可能已 Done）：可能其实已装成功 —— 只给可行动提示，不引导提 Issue
                      return h('div', null, [
                        h('div', { className: styles.failPrepareHint }, t('failTimeoutHint')),
                      ])
                    }
                    if (kind === 'profileLock') {
                      // DSH 写 profile 的锁超时（同一 profile 被别的 dsh/安装任务占着）：只给可行动提示，不引导提 Issue
                      return h('div', null, [
                        h('div', { className: styles.failPrepareHint }, t('failProfileLockHint', { action: actionWord })),
                      ])
                    }
                    if (kind === 'hostCliSpawn') {
                      // 宿主自身入口起不来：环境问题，给提示、不引导提 Issue
                      return h('div', null, [
                        h('div', { className: styles.failPrepareHint }, t('failHostCliSpawnHint')),
                      ])
                    }
                    if (kind === 'pnpmIgnoredBuild') {
                      // 插件的依赖需要在用户机器上编译原生模块，pnpm 默认拦住；我们已自动放行
                      // allowBuilds 并重试过一次，仍失败说明任何用户都装不上 —— 属作者侧（发预构建产物 / 走 release 包）
                      return h('div', null, [
                        h('div', { className: styles.failPrepareHint }, t('failIgnoredBuild')),
                        r.repo && shownRepo ? h('a', {
                          className: styles.failBigIssue,
                          href: pluginIssueUrl(shownRepo, r.message, env, r.command, r.attempts, action),
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          title: t('failIssueHint'),
                        }, t('failIssueBig')) : null,
                        // 这条判定里也有我们的动作（自动放行过 allowBuilds），判错时得留一条回到插件中心的路
                        r.repo && shownRepo ? h('div', null, [
                          h('div', { className: styles.failPrepareHint }, t('failMisjudgeHint')),
                          h('a', {
                            className: styles.failMisjudgeLink,
                            href: hubIssueUrl(shownRepo, r.message, env, r.command, r.attempts, 'misjudge', action),
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            title: t('failHubIssueHint'),
                          }, t('failMisjudgeLink')),
                        ]) : null,
                      ])
                    }
                    // 未知失败：不归到插件作者，改为引导到插件中心仓库排查
                    return h('div', null, [
                      h('div', { className: styles.failPrepareHint }, t('failUnclassifiedHint', { action: actionWord })),
                      h('a', {
                        className: styles.failBigIssue,
                        href: hubIssueUrl(shownRepo || r.repo, r.message, env, r.command, r.attempts, 'triage', action),
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        title: t('failHubIssueHint'),
                      }, t('failHubIssueBig')),
                    ])
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
            onClick: () => setConfirmClear(true),
          }, t('notificationsClear')) : null,
          h('button', { className: styles.restartNow, onClick: onClose }, t('errorClose')),
        ),
      ),
    ),
    // 清空全部通知确认弹窗：独立弹出框（垃圾桶图标，危险操作），确认后才真正清空
    confirmClear && h(ConfirmDialog, {
      type: 'trash',
      title: t('notificationsClearConfirmTitle'),
      desc: t('notificationsClearConfirmDesc'),
      confirmLabel: t('notificationsClear'),
      t,
      onConfirm: () => { setConfirmClear(false); onClear() },
      onCancel: () => setConfirmClear(false),
    }),
    // 删除单条通知确认弹窗：独立弹出框（垃圾桶图标），确认后才移除
    confirmRemoveId !== null && h(ConfirmDialog, {
      type: 'trash',
      title: t('removeNotificationConfirmTitle'),
      desc: t('removeNotificationConfirmDesc'),
      confirmLabel: t('removeNotification'),
      t,
      onConfirm: () => { onRemove(confirmRemoveId); setConfirmRemoveId(null) },
      onCancel: () => setConfirmRemoveId(null),
    }),
  )
}
