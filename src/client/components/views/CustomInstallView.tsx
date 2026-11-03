/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 自定义安装视图：独立一级板块，用于手动安装目录之外的 npm 包。安装卡片接受裸包名或完整的
 * npm/pnpm 安装命令（含官方全局 `npm install -g`），输入框上方带示例并自带格式校验。
 * 装完的插件出现在「已安装」视图，标记为自定义安装。
 *
 * 纯展示组件：只持有本地输入/错误状态；真正的安装（custom 源，受安全开关控制）经
 * onInstallCustom 上抛。
 */
import { createElement as h, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import styles from '../../styles/CustomInstallView.module.css'
import modal from '../../styles/Modal.module.css'
import type { InstallChannel, Translate } from '../../types.ts'
import { CloseIcon, HelpIcon } from '../ui/icons.tsx'

/* —— 自定义安装输入校验 ——
 * 提交前校验「输入是否符合格式」，识别不了的输入不发请求，就地提示推荐格式。
 * npm 框认裸包名或完整 npm/pnpm 安装命令（含全局 `npm install -g`）。
 * 这里只做格式校验，真正归一化/安装由服务端完成。 */

/** npm 包名（含 @scope/pkg） */
const NPM_PACKAGE_RE = /^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/

/** npm 全局安装命令（官方 README 格式，如 `npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui`）——
 * 提取 -g 之后的包列表；任一包名非法返回 null（交给格式错误提示）。与 server 端 globalNpmPackagesOf 规则一致。 */
const NPM_GLOBAL_CMD_RE = /^npm\s+(?:install|i)\s+(?:-g|--global)\s+(.+)$/i

/** 常规 npm/pnpm 安装命令（装进当前 profile，如 `npm install lodash`、`pnpm add @scope/pkg`）——
 * 提取命令后的包列表；包列表在 splitPackages 里逐个校验。 */
const NPM_INSTALL_CMD_RE = /^(?:npm\s+(?:install|i)|pnpm\s+(?:add|i|install))\s+(.+)$/i

/** 空格分隔的包列表：逐个按 npm 包名语法校验 + 拒绝以 - 开头的 token（npm 会把 --xxx 当参数而非包名），
 * 任一非法返回 null（交给格式错误提示）。与 server 端 globalNpmPackagesOf 同一套规则。 */
function splitPackages(raw: string): string[] | null {
  const packages = raw.trim().split(/\s+/).filter((p) => p !== '')
  if (packages.length === 0 || packages.some((p) => !NPM_PACKAGE_RE.test(p) || p.startsWith('-'))) return null
  return packages
}

/** NPM 框输入解析结果：
 * - pkg：裸包名或常规安装命令（npm install / npm i / pnpm add / pnpm i），提取单个安装目标；
 * - global：官方全局安装命令（npm install -g <pkgs>），提取包列表走全局通道。 */
type NpmInputParse =
  | { kind: 'pkg'; target: string }
  | { kind: 'global'; pkgs: string[] }

function parseNpmInput(raw: string): NpmInputParse | null {
  const input = raw.trim()
  // 裸包名（含 @scope/pkg）
  if (NPM_PACKAGE_RE.test(input)) return { kind: 'pkg', target: input }
  // 官方全局安装 npm install -g <pkgs>（装系统级 CLI 工具）
  const global = NPM_GLOBAL_CMD_RE.exec(input)
  if (global !== null) {
    const pkgs = splitPackages(global[1])
    if (pkgs !== null) return { kind: 'global', pkgs }
    return null
  }
  // 常规安装命令 npm install <pkgs> / pnpm add <pkgs> —— 装进当前 profile，一次一个包
  const install = NPM_INSTALL_CMD_RE.exec(input)
  if (install !== null) {
    const pkgs = splitPackages(install[1])
    if (pkgs !== null && pkgs.length === 1) return { kind: 'pkg', target: pkgs[0] }
    return null
  }
  return null
}

/** 卡片标题旁的「帮助」弹窗：该卡片的标题与格式清单语言包 key。 */
const HELP_CARDS = {
  npm: { titleKey: 'npmInstallLabel', contentKey: 'npmInstallHelp' },
} as const

type HelpTarget = keyof typeof HELP_CARDS

export function CustomInstallView({ t, onInstallCustom, enableNpm, onOpenSettings }: {
  t: Translate
  /** 命令行安装：输入 npm 包名 / npm、pnpm 安装命令即装（custom 源，受安全设置开关控制）。
   *  installChannel 必填 = 入口渠道（NPM 包卡片）：服务端日志/报错提示据此溯源「从哪个入口发起」；
   *  opts.globalNpm 表示官方 npm 全局安装命令（npm install -g），附带解析出的包列表。 */
  onInstallCustom: (raw: string, opts: { installChannel: InstallChannel; globalNpm?: string[] }) => void
  /** 安全信任开关：关掉后输入卡片禁用（不提交），并引导去设置打开 */
  enableNpm: boolean
  /** 引导去「设置 → 安全信任」打开被关闭的通道开关 */
  onOpenSettings: () => void
}) {
  /** 自定义安装：NPM 包输入与格式错误（'' = 无错误） */
  const [npmQuery, setNpmQuery] = useState('')
  const [npmError, setNpmError] = useState('')
  /** 卡片标题旁「帮助」弹窗：null = 未打开；'npm' = 打开该卡片的格式清单 */
  const [helpFor, setHelpFor] = useState<HelpTarget | null>(null)

  /** 通道关闭提示行：开关关掉后替代示例与输入行，引导去设置打开 */
  const channelOffRow = h('div', { className: styles.channelOff },
    h('span', { className: styles.channelOffText }, t('channelDisabledHint')),
    h('button', {
      type: 'button',
      className: styles.channelOffBtn,
      onClick: onOpenSettings,
    }, t('goToSettings')),
  )

  // 只做格式校验 —— 识别不了的输入不发请求，就地提示推荐写法。
  // NPM 框认裸包名或完整 npm/pnpm 命令（含全局 npm install -g，走 globalNpm 通道）。
  const submitNpm = () => {
    const raw = npmQuery.trim()
    if (!raw) return
    const parsed = parseNpmInput(raw)
    if (parsed === null) { setNpmError(t('npmInstallInvalid')); return }
    if (parsed.kind === 'global') {
      onInstallCustom(raw, { installChannel: 'npm', globalNpm: parsed.pkgs })
    } else {
      onInstallCustom(parsed.target, { installChannel: 'npm' })
    }
    setNpmQuery('')
    setNpmError('')
  }

  return h('div', { className: styles.root },
    // 页面说明：独立一级导航，交代「装完去哪看」
    h('p', { className: styles.desc }, t('customViewDesc')),
    // NPM 包卡片：label + 文本框上方示例 + 输入行 + 错误区；
    // 安全信任开关关掉时，卡片禁用并显示「前往设置」提示行
    h('div', { className: styles.installCards },
      // NPM 包：输入包名或原生 npm/pnpm 安装命令即装（含官方全局 npm install -g）
      h('div', { className: enableNpm ? styles.installCard : `${styles.installCard} ${styles.installCardDisabled}` },
        h('div', { className: styles.installCardHead },
          h('span', { className: styles.installLabel }, t('npmInstallLabel')),
          // 标题旁帮助：点开该卡片的格式清单弹窗
          h('button', {
            type: 'button',
            className: styles.installHelpBtn,
            title: t('installHelp'),
            'aria-label': t('installHelp'),
            onClick: () => setHelpFor('npm'),
          }, h(HelpIcon)),
        ),
        !enableNpm
          ? channelOffRow
          : [
            // 文本框上方的示例：把支持的原生命令模式写清楚（两行）
            h('div', { className: styles.installExample },
              t('npmInstallExample'), h('br'), t('npmInstallExample2')),
            h('div', { className: styles.installRow },
              h('input', {
                className: npmError ? `${styles.installInput} ${styles.installInputError}` : styles.installInput,
                type: 'text',
                placeholder: t('npmInstallPlaceholder'),
                value: npmQuery,
                spellCheck: false,
                onInput: (e: FormEvent<HTMLInputElement>) => {
                  setNpmQuery((e.target as HTMLInputElement).value)
                  // 重新输入即清掉格式错误提示
                  setNpmError('')
                },
                onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter') submitNpm() },
              }),
              h('button', {
                className: styles.installBtn,
                type: 'button',
                disabled: npmQuery.trim() === '',
                onClick: submitNpm,
              }, t('installCliBtn')),
            ),
            // 格式错误：识别不了的包名就地说明，并给出推荐写法
            npmError ? h('div', { className: styles.installError }, npmError) : null,
          ],
      ),
    ),
    // 帮助弹窗：点卡片标题旁的问号打开 —— 宽窗（720px）把该通道支持的命令格式整行展示，防止折行
    helpFor !== null
      ? h('div', {
        className: modal.overlay,
        onClick: (e: MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) setHelpFor(null) },
      },
        h('div', { className: `${modal.errorModal} ${modal.helpModal}`, role: 'dialog', 'aria-modal': 'true' },
          h('div', { className: modal.modalHead },
            h('div', { className: modal.modalTitle }, `${t(HELP_CARDS[helpFor].titleKey)} · ${t('helpModalTitle')}`),
            h('button', {
              className: modal.modalClose,
              'aria-label': t('errorClose'),
              onClick: () => setHelpFor(null),
            }, h(CloseIcon)),
          ),
          h('div', { className: modal.modalBody },
            // 格式清单：一行一条；`命令\t说明` 的说明跟在命令后，纯说明行以 \t 开头
            h('div', { className: styles.helpBody },
              t(HELP_CARDS[helpFor].contentKey).split('\n').map((line, i) => {
                const [cmd, note] = line.split('\t')
                return h('div', { key: i, className: styles.helpLine },
                  cmd !== '' ? h('span', { className: styles.helpCmd }, cmd) : null,
                  note !== undefined ? h('span', { className: styles.helpNote }, note) : null,
                )
              }),
            ),
          ),
        ),
      )
      : null,
  )
}
