/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Custom install view: a standalone top-level section for manually
 * installing npm packages or GitHub sources outside the catalog. Three
 * installer cards, one per channel — npm package (bare name or a full
 * npm/pnpm install command, including the official global `npm install -g`),
 * GitHub source and the official `dsh plugin ... add <target>` command —
 * each with a placeholder example above the input and its own format check.
 * The cards stay separate so a user never has to guess which format goes
 * where. Finished installs surface in the Installed view, marked as custom.
 *
 * Pure presentational: owns only the three local input/error states; the
 * actual install (custom source, gated by the security toggles) bubbles up
 * via onInstallCustom.
 */
import { createElement as h, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import styles from '../../styles/CustomInstallView.module.css'
import modal from '../../styles/Modal.module.css'
import type { InstallChannel, Translate } from '../../types.ts'
import { CloseIcon, HelpIcon } from '../ui/icons.tsx'

/* —— 自定义安装输入预检 ——
 * 提交前校验「输入是否符合该通道格式」，识别不了的输入不发请求，就地提示推荐格式。
 * 三个通道严格分开：npm 框认裸包名或完整 npm/pnpm 安装命令（含全局 `npm install -g`），
 * git 框只认 GitHub 地址，命令框只认官方 `dsh plugin --profile <name> <add|update> <target>`
 * （--profile 必填，无 -p 简写；update = 更新已安装目标到最新）。
 * 这里只做格式校验，真正归一化/安装由服务端完成。 */

/** GitHub 地址（带前缀形态）：github:、https://github.com/、git+https://github.com/、git@github.com: */
const GITHUB_URL_RE = /^(?:github:|https?:\/\/github\.com\/|git\+https?:\/\/github\.com\/|git@github\.com:)([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+?)(?:\.git)?$/
/** 裸 owner/repo（npm 包名只有 @scope/pkg 才带斜杠，无 @ 前缀的 a/b 一定是 GitHub 仓库） */
const GITHUB_BARE_RE = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/
/** npm 包名（含 @scope/pkg） */
const NPM_PACKAGE_RE = /^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/

/** DSH 命令行前缀（官方唯一形式 `dsh plugin --profile <name> <add|update> <target>`）—— 提取其中的动作与目标。
 * 官方 CLI（apps/cli/src/args.ts，commander）：--profile 为必填长选项（无 -p 简写，省略即报错），
 * 支持 `--profile=<name>` 等号形式；命令大小写不敏感。update = 已安装目标覆盖更新到最新；
 * remove 不走这里（卸载由「已安装」列表的卸载按钮执行，命令框不认卸载动词）。
 * 与 server 端 installTargetOf 口径一致。 */
const DSH_PLUGIN_CMD_RE = /^dsh\s+plugin\s+--profile(?:\s+|=)\S+\s+(add|update)\s+(.+)$/i

/** npm 全局安装命令（官方 README 格式，如 `npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui`）——
 * 提取 -g 之后的包列表；任一包名非法返回 null（交给格式错误提示）。与 server 端 globalNpmPackagesOf 口径一致。 */
const NPM_GLOBAL_CMD_RE = /^npm\s+(?:install|i)\s+(?:-g|--global)\s+(.+)$/i

/** 常规 npm/pnpm 安装命令（装进当前 profile，如 `npm install lodash`、`pnpm add @scope/pkg`）——
 * 提取命令后的包列表；包列表在 splitPackages 里逐个校验。 */
const NPM_INSTALL_CMD_RE = /^(?:npm\s+(?:install|i)|pnpm\s+(?:add|i|install))\s+(.+)$/i

/** 解析 DSH 命令：返回 { action, target }；非官方命令返回 null（交给格式错误提示）。 */
function parseDshCommand(raw: string): { action: 'add' | 'update'; target: string } | null {
  const input = raw.trim()
  const match = DSH_PLUGIN_CMD_RE.exec(input)
  if (match === null) return null
  return { action: match[1].toLowerCase() as 'add' | 'update', target: match[2].trim() }
}

/** 空格分隔的包列表：逐个按 npm 包名语法校验 + 拒绝以 - 开头的 token（npm 会把 --xxx 当参数而非包名），
 * 任一非法返回 null（交给格式错误提示）。与 server 端 globalNpmPackagesOf 同口径。 */
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

function isGitHubInput(raw: string): boolean {
  const input = raw.trim()
  return GITHUB_URL_RE.test(input) || GITHUB_BARE_RE.test(input)
}

/** 卡片标题旁的「帮助」弹窗：三块卡片各自的标题与格式清单语言包 key。 */
const HELP_CARDS = {
  npm: { titleKey: 'npmInstallLabel', contentKey: 'npmInstallHelp' },
  git: { titleKey: 'gitInstallLabel', contentKey: 'gitInstallHelp' },
  cmd: { titleKey: 'dshCmdLabel', contentKey: 'dshCmdHelp' },
} as const

type HelpTarget = keyof typeof HELP_CARDS

export function CustomInstallView({ t, onInstallCustom, enableNpm, enableGit, enableDsh, onOpenSettings, profile }: {
  t: Translate
  /** 命令行安装：输入 npm 包名 / npm、pnpm 安装命令 / GitHub 地址 / dsh plugin 命令即装
   *  （custom 源，受安全设置开关控制）。installChannel 必填 = 入口渠道（三张卡片之一）：
   *  服务端日志/报错提示据此溯源「从哪个入口发起」；opts.globalNpm 表示官方 npm 全局安装
   *  命令（npm install -g），附带解析出的包列表（仍属 NPM 包入口）。 */
  onInstallCustom: (raw: string, opts: { installChannel: InstallChannel; globalNpm?: string[] }) => void
  /** 安全信任三通道开关：关掉后对应输入卡片禁用（不提交），并引导去设置打开 */
  enableNpm: boolean
  enableGit: boolean
  enableDsh: boolean
  /** 引导去「设置 → 安全信任」打开被关闭的通道开关 */
  onOpenSettings: () => void
  /** 当前 dsh profile 名（宿主 /env 快照）：一键插入的更新命令用它拼 --profile */
  profile: string
}) {
  /** 自定义安装：NPM 包输入与格式错误（'' = 无错误） */
  const [npmQuery, setNpmQuery] = useState('')
  const [npmError, setNpmError] = useState('')
  /** 自定义安装：GitHub 源码输入与格式错误（'' = 无错误） */
  const [gitQuery, setGitQuery] = useState('')
  const [gitError, setGitError] = useState('')
  /** 自定义安装：DSH 命令输入与格式错误（'' = 无错误） */
  const [cmdQuery, setCmdQuery] = useState('')
  const [cmdError, setCmdError] = useState('')
  /** 卡片标题旁「帮助」弹窗：null = 未打开；'npm' | 'git' | 'cmd' = 打开对应卡片的格式清单 */
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

  // 三个通道分开校验 —— 识别不了的输入不发请求，就地提示推荐写法。
  // NPM 框认裸包名或完整 npm/pnpm 命令（含全局 npm install -g，走 globalNpm 通道）；
  // 命令框只认官方 dsh plugin 命令，提交时剥成裸目标发给服务端。
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
  const submitGit = () => {
    const target = gitQuery.trim()
    if (!target) return
    if (!isGitHubInput(target)) { setGitError(t('gitInstallInvalid')); return }
    onInstallCustom(target, { installChannel: 'git' })
    setGitQuery('')
    setGitError('')
  }
  const submitCmd = () => {
    const raw = cmdQuery.trim()
    if (!raw) return
    const parsed = parseDshCommand(raw)
    if (parsed === null) { setCmdError(t('dshCmdInvalid')); return }
    // add / update 统一走安装流程：目标已安装时弹窗自动转「更新」覆盖重装（服务端 mode=update 放行），
    // 未安装时即为普通安装 —— 粘贴 `dsh plugin --profile web update dsh-plugin` 这类命令即可更新到最新
    onInstallCustom(parsed.target, { installChannel: 'dsh' })
    setCmdQuery('')
    setCmdError('')
  }
  /** 一键插入 DSH Plugin Hub 自身的更新命令：按当前 profile 拼官方命令填进输入框，用户确认后提交 */
  const insertHubUpdate = () => {
    setCmdQuery(`dsh plugin --profile ${profile} update dsh-plugin`)
    setCmdError('')
  }

  return h('div', { className: styles.root },
    // 页面说明：独立一级导航，交代「装完去哪看」
    h('p', { className: styles.desc }, t('customViewDesc')),
    // 三块卡片（一行一个）：label + 文本框上方示例 + 输入行 + 错误区；
    // 安全信任开关关掉对应通道时，卡片禁用并显示「前往设置」提示行
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
      // GitHub 源码：输入仓库地址即装
      h('div', { className: enableGit ? styles.installCard : `${styles.installCard} ${styles.installCardDisabled}` },
        h('div', { className: styles.installCardHead },
          h('span', { className: styles.installLabel }, t('gitInstallLabel')),
          h('button', {
            type: 'button',
            className: styles.installHelpBtn,
            title: t('installHelp'),
            'aria-label': t('installHelp'),
            onClick: () => setHelpFor('git'),
          }, h(HelpIcon)),
        ),
        !enableGit
          ? channelOffRow
          : [
            h('div', { className: styles.installExample }, t('gitInstallExample')),
            h('div', { className: styles.installRow },
              h('input', {
                className: gitError ? `${styles.installInput} ${styles.installInputError}` : styles.installInput,
                type: 'text',
                placeholder: t('gitInstallPlaceholder'),
                value: gitQuery,
                spellCheck: false,
                onInput: (e: FormEvent<HTMLInputElement>) => {
                  setGitQuery((e.target as HTMLInputElement).value)
                  setGitError('')
                },
                onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter') submitGit() },
              }),
              h('button', {
                className: styles.installBtn,
                type: 'button',
                disabled: gitQuery.trim() === '',
                onClick: submitGit,
              }, t('installCliBtn')),
            ),
            gitError ? h('div', { className: styles.installError }, gitError) : null,
          ],
      ),
      // 命令卡片：粘贴官方 dsh plugin 命令即装/即更新 —— 只认完整命令
      // （--profile 必填，可含 = 等号，动词 add/update，剥成裸目标走安装流程）
      h('div', { className: enableDsh ? styles.installCard : `${styles.installCard} ${styles.installCardDisabled}` },
        h('div', { className: styles.installCardHead },
          h('span', { className: styles.installLabel }, t('dshCmdLabel')),
          h('button', {
            type: 'button',
            className: styles.installHelpBtn,
            title: t('installHelp'),
            'aria-label': t('installHelp'),
            onClick: () => setHelpFor('cmd'),
          }, h(HelpIcon)),
          // 一键插入 Hub 自身的更新命令：按当前 profile 拼 `dsh plugin --profile <p> update dsh-plugin`
          // 填入输入框（命令卡片被安全开关禁用时不显示，插入后也提交不了）
          enableDsh
            ? h('button', {
              type: 'button',
              className: styles.installInsertBtn,
              onClick: insertHubUpdate,
            }, t('dshCmdInsertHubUpdate'))
            : null,
        ),
        !enableDsh
          ? channelOffRow
          : [
            h('div', { className: styles.installExample }, t('dshCmdExample')),
            h('div', { className: styles.installRow },
              h('input', {
                className: cmdError ? `${styles.installInput} ${styles.installInputError}` : styles.installInput,
                type: 'text',
                placeholder: t('dshCmdPlaceholder'),
                value: cmdQuery,
                spellCheck: false,
                onInput: (e: FormEvent<HTMLInputElement>) => {
                  setCmdQuery((e.target as HTMLInputElement).value)
                  setCmdError('')
                },
                onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter') submitCmd() },
              }),
              h('button', {
                className: styles.installBtn,
                type: 'button',
                disabled: cmdQuery.trim() === '',
                onClick: submitCmd,
              }, t('installCliBtn')),
            ),
            cmdError ? h('div', { className: styles.installError }, cmdError) : null,
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
