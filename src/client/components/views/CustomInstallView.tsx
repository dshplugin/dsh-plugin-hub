/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Custom install view: a standalone top-level section for manually
 * installing npm packages or GitHub sources outside the catalog. Three
 * installer cards, one per channel — npm package, GitHub source and a raw
 * DSH command (`dsh plugin ... add <target>`) — each with a placeholder
 * example above the input and its own format check. The cards stay
 * separate so a user never has to guess which format goes where. Finished
 * installs surface in the Installed view, marked as custom.
 *
 * Pure presentational: owns only the three local input/error states; the
 * actual install (custom source, gated by the security toggles) bubbles up
 * via onInstallCustom.
 */
import { createElement as h, useState } from 'react'
import type { FormEvent } from 'react'
import styles from '../../styles/CustomInstallView.module.css'
import type { Translate } from '../../types.ts'

/* —— 自定义安装输入预检 ——
 * 提交前校验「输入是否符合该通道格式」，识别不了的输入不发请求，就地提示推荐格式。
 * 三个通道严格分开：npm 框只认包名，git 框只认 GitHub 地址，DSH 命令框只认完整命令
 * （`dsh plugin [--profile|-p <p>] add <target>`）。这里只做格式校验，
 * 真正归一化/安装由服务端完成。 */

/** GitHub 地址（带前缀形态）：github:、https://github.com/、git+https://github.com/、git@github.com: */
const GITHUB_URL_RE = /^(?:github:|https?:\/\/github\.com\/|git\+https?:\/\/github\.com\/|git@github\.com:)([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+?)(?:\.git)?$/
/** 裸 owner/repo（npm 包名只有 @scope/pkg 才带斜杠，无 @ 前缀的 a/b 一定是 GitHub 仓库） */
const GITHUB_BARE_RE = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/
/** npm 包名（含 @scope/pkg） */
const NPM_PACKAGE_RE = /^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/

/** DSH 命令行前缀（`dsh plugin [--profile|-p <p>] add <target>`）—— 提取其中的安装目标；
 * 命令大小写不敏感，支持 `-p` 简写与 `--profile=web` 等号形式，与 server 端 installTargetOf 口径一致。 */
const DSH_PLUGIN_CMD_RE = /^dsh\s+plugin\s+(?:(?:--profile|-p)(?:=|\s+)\S+\s*)?add\s+(.+)$/i

function installTargetOf(raw: string): string {
  const input = raw.trim()
  const match = DSH_PLUGIN_CMD_RE.exec(input)
  return match !== null ? match[1].trim() : input
}

function isGitHubInput(raw: string): boolean {
  const input = raw.trim()
  return GITHUB_URL_RE.test(input) || GITHUB_BARE_RE.test(input)
}

function isNpmInput(raw: string): boolean {
  return NPM_PACKAGE_RE.test(raw.trim())
}

function isDshCommand(raw: string): boolean {
  return DSH_PLUGIN_CMD_RE.test(raw.trim())
}

export function CustomInstallView({ t, onInstallCustom }: {
  t: Translate
  /** 命令行安装：输入 npm 包名 / GitHub 地址 / dsh plugin 命令即装（custom 源，受安全设置两开关控制） */
  onInstallCustom: (raw: string) => void
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

  // 三个通道分开校验 —— 识别不了的输入不发请求，就地提示推荐写法。
  // NPM / GitHub 框只认各自裸目标；DSH 命令框只认完整命令，提交时剥成裸目标发给服务端。
  const submitNpm = () => {
    const target = npmQuery.trim()
    if (!target) return
    if (!isNpmInput(target)) { setNpmError(t('npmInstallInvalid')); return }
    onInstallCustom(target)
    setNpmQuery('')
    setNpmError('')
  }
  const submitGit = () => {
    const target = gitQuery.trim()
    if (!target) return
    if (!isGitHubInput(target)) { setGitError(t('gitInstallInvalid')); return }
    onInstallCustom(target)
    setGitQuery('')
    setGitError('')
  }
  const submitCmd = () => {
    const raw = cmdQuery.trim()
    if (!raw) return
    if (!isDshCommand(raw)) { setCmdError(t('dshCmdInvalid')); return }
    onInstallCustom(installTargetOf(raw))
    setCmdQuery('')
    setCmdError('')
  }

  return h('div', { className: styles.root },
    // 页面说明：独立一级导航，交代「装完去哪看」
    h('p', { className: styles.desc }, t('customViewDesc')),
    // 三块卡片（一行一个）：label + 文本框上方示例 + 输入行 + 错误区
    h('div', { className: styles.installCards },
      // NPM 包：输入包名即装
      h('div', { className: styles.installCard },
        h('div', { className: styles.installCardHead },
          h('span', { className: styles.installLabel }, t('npmInstallLabel')),
        ),
        // 文本框上方的示例：告诉用户怎么写
        h('div', { className: styles.installExample }, t('npmInstallExample')),
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
      ),
      // GitHub 源码：输入仓库地址即装
      h('div', { className: styles.installCard },
        h('div', { className: styles.installCardHead },
          h('span', { className: styles.installLabel }, t('gitInstallLabel')),
        ),
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
      ),
      // DeepSeek Harness 命令：粘贴完整 dsh plugin 命令即装（可含 --profile 段）
      h('div', { className: styles.installCard },
        h('div', { className: styles.installCardHead },
          h('span', { className: styles.installLabel }, t('dshCmdLabel')),
        ),
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
      ),
    ),
  )
}
