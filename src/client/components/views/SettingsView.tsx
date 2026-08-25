/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Settings view: desktop-settings navigation — a fixed left sidebar lists
 * the sections (icon + label, click to switch), the right pane shows the
 * active section's rows. New settings only add rows, new areas only add a
 * sidebar entry.
 *
 * Sections mirror what the local server actually enforces:
 *   Updates & Sources — startup update check / npm mirror / HTTP proxy
 *                        (all wired into the install command path)
 *   Security & Trust  — restricted custom installs (server 403 gate)
 *   Diagnostics       — live connectivity probe + environment snapshot
 *   Logs              — system log viewer + storage location
 */
import { createElement as h, useState } from 'react'
import type { ChangeEvent, MouseEvent, ReactNode } from 'react'
import styles from '../../styles/SettingsView.module.css'
import modalStyles from '../../styles/Modal.module.css'
import { Dropdown } from '../ui/Dropdown.tsx'
import { Toggle } from '../ui/Toggle.tsx'
import { DiagnosticsView } from './DiagnosticsView.tsx'
import { LogsView } from './LogsView.tsx'
import {
  CloseIcon, DiagnosticsIcon, LogsIcon, ResetIcon, SecurityIcon, UpdatesIcon,
} from '../ui/icons.tsx'
import type { EnvInfo, Translate } from '../../types.ts'
import type { HubSettings } from '../../hooks/useSettings.ts'

type SettingsSection = 'updates' | 'security' | 'diagnostics' | 'logs' | 'reset'

/** 左侧导航：顺序即展示顺序；labelKey 是分组标题，icon 是行内小图标。 */
const NAV: Array<{ key: SettingsSection; labelKey: string; icon: () => ReturnType<typeof h> }> = [
  { key: 'updates', labelKey: 'settingsUpdate', icon: UpdatesIcon },
  { key: 'security', labelKey: 'settingsSecurity', icon: SecurityIcon },
  { key: 'diagnostics', labelKey: 'settingsDiagnostics', icon: DiagnosticsIcon },
  { key: 'logs', labelKey: 'settingsLogs', icon: LogsIcon },
  { key: 'reset', labelKey: 'settingsReset', icon: ResetIcon },
]

/** npm 镜像源预设：空串 = 官方源；值相等即视为选中对应预设，其余进入「自定义」输入。 */
const MIRROR_PRESETS: Array<{ value: string; labelKey: string }> = [
  { value: '', labelKey: 'mirrorOfficial' },
  { value: 'https://registry.npmmirror.com', labelKey: 'mirrorNpmmirror' },
  { value: 'https://mirrors.cloud.tencent.com/npm/', labelKey: 'mirrorTencent' },
]

/** 设置行：默认标签左控件右；stack=true 时控件独占一行（文本框整行显示），hairline 分隔。 */
function SettingRow({ title, desc, children, stack = false }: {
  title: string
  desc?: string
  children: ReactNode
  stack?: boolean
}) {
  return h('div', { className: stack ? styles.settingRowStack : styles.settingRow },
    h('div', { className: styles.settingLabel },
      h('div', { className: styles.settingTitle }, title),
      desc ? h('div', { className: styles.settingDesc }, desc) : null,
    ),
    h('div', { className: stack ? styles.settingControlStack : styles.settingControl }, children),
  )
}

export function SettingsView({ t, settings, update, reset, env, onCopy }: {
  t: Translate
  settings: HubSettings
  update: (patch: Partial<HubSettings>) => void
  reset: () => void
  env: EnvInfo | null
  onCopy: (text: string) => void
}) {
  /** 当前激活的分组：左侧导航点击切换，右侧只渲染这一组 */
  const [section, setSection] = useState<SettingsSection>('updates')
  /** 恢复默认确认弹窗：点按钮先弹窗询问，确认后才真正 reset（不做两段式按钮） */
  const [resetConfirm, setResetConfirm] = useState(false)

  const mirrorCustom = !MIRROR_PRESETS.some((p) => p.value === settings.npmRegistry)
  const onMirrorChange = (value: string) => {
    if (value === 'custom') return // 进入自定义输入：保持当前值，下方出现输入框
    update({ npmRegistry: value })
  }
  const onMirrorInput = (e: ChangeEvent<HTMLInputElement>) => update({ npmRegistry: e.target.value })
  const onProxyChange = (e: ChangeEvent<HTMLInputElement>) => update({ proxy: e.target.value })

  /** 每个分组的页面副标题（导航标题之上再补一句说明，保持桌面设置质感） */
  const pageDesc: Record<SettingsSection, string> = {
    updates: t('settingsUpdateDesc'),
    security: t('settingsSecurityDesc'),
    diagnostics: t('settingsDiagnosticsDesc'),
    logs: t('settingsLogsDesc'),
    reset: t('settingsResetDesc'),
  }
  const activeNav = NAV.find((n) => n.key === section) ?? NAV[0]

  // —— 各分组的设置卡片（一页一个 card，内部一行一设置） ——

  const updatesCard = h('div', { className: styles.card },
    h(SettingRow, {
      title: t('settingsCheckOnStart'),
      desc: t('settingsCheckOnStartDesc'),
      children: h(Toggle, {
        checked: settings.checkUpdatesOnStart,
        onChange: (v) => update({ checkUpdatesOnStart: v }),
        title: t('settingsCheckOnStart'),
      }),
    }),
    h(SettingRow, {
      title: t('settingsMirror'),
      desc: t('settingsMirrorDesc'),
      children: h(Dropdown, {
        value: mirrorCustom ? 'custom' : settings.npmRegistry,
        options: [
          ...MIRROR_PRESETS.map((p) => ({ value: p.value, label: t(p.labelKey) })),
          { value: 'custom', label: t('mirrorCustom') },
        ],
        onChange: onMirrorChange,
        title: t('settingsMirror'),
        className: styles.controlDropdown,
      }),
    }),
    // 自定义镜像源：下拉选中「自定义」或已存非预设值时，追加一行输入框（文本框独占一行）
    mirrorCustom && h(SettingRow, {
      title: t('mirrorCustom'),
      stack: true,
      children: h('input', {
        className: styles.textInput,
        type: 'url',
        value: settings.npmRegistry,
        placeholder: 'https://registry.npmjs.org',
        spellCheck: false,
        onChange: onMirrorInput,
      }),
    }),
    // 代理地址：文本框独占一行，整行输入，便于粘贴长代理地址
    h(SettingRow, {
      title: t('settingsProxy'),
      desc: t('settingsProxyDesc'),
      stack: true,
      children: h('input', {
        className: styles.textInput,
        type: 'text',
        value: settings.proxy,
        placeholder: 'http://127.0.0.1:7890',
        spellCheck: false,
        onChange: onProxyChange,
      }),
    }),
  )

  const securityCard = h('div', { className: styles.card },
    // 安全与信任：命令行安装的三个通道开关（NPM 包 / GitHub 源码 / DSH 命令）——
    // 服务端按通道门禁 403 拦截（npm 目标吃 enableNpmInstall、git 目标吃 enableGitInstall），
    // DSH 命令框为纯客户端通道：关掉后命令输入卡片禁用并引导去设置打开；
    // 目录内收录的插件安装不受影响（默认全部开启）
    h(SettingRow, {
      title: t('settingsEnableNpm'),
      desc: t('settingsEnableNpmDesc'),
      children: h(Toggle, {
        checked: settings.enableNpmInstall,
        onChange: (v) => update({ enableNpmInstall: v }),
        title: t('settingsEnableNpm'),
      }),
    }),
    h(SettingRow, {
      title: t('settingsEnableGit'),
      desc: t('settingsEnableGitDesc'),
      children: h(Toggle, {
        checked: settings.enableGitInstall,
        onChange: (v) => update({ enableGitInstall: v }),
        title: t('settingsEnableGit'),
      }),
    }),
    h(SettingRow, {
      title: t('settingsEnableDsh'),
      desc: t('settingsEnableDshDesc'),
      children: h(Toggle, {
        checked: settings.enableDshInstall,
        onChange: (v) => update({ enableDshInstall: v }),
        title: t('settingsEnableDsh'),
      }),
    }),
  )

  const diagnosticsCard = h('div', { className: styles.card },
    // 系统版本（最顶部）+ 通道状态列表：进入页面自动探测一轮，整行可点击重测单项，实时反馈
    h(DiagnosticsView, { t, env, onCopy }),
  )

  const logsCard = h('div', { className: styles.card },
    // 系统日志列表：操作记录（安装/卸载/设置/诊断），可刷新/复制/导出，点击弹窗查看；
    // 日志存放位置可设置（留空用默认），改动会写入设置并立即生效
    h(LogsView, {
      t,
      logPath: settings.logPath,
      onLogPathSaved: (v: string) => update({ logPath: v }),
    }),
  )

  const resetCard = h('div', { className: styles.card },
    h(SettingRow, {
      title: t('settingsReset'),
      desc: t('settingsResetDetail'),
      children: h('button', {
        type: 'button',
        className: styles.resetBtn,
        onClick: () => setResetConfirm(true),
      }, t('settingsResetRun')),
    }),
  )

  return h('div', { className: styles.root },
    // 左侧导航：固定宽度菜单栏，图标 + 名称，点击切换右侧内容
    h('nav', { className: styles.sidebar, 'aria-label': t('viewSettings') },
      NAV.map((item) => h('button', {
        key: item.key,
        type: 'button',
        className: section === item.key ? styles.navItemActive : styles.navItem,
        onClick: () => setSection(item.key),
        'aria-current': section === item.key ? 'page' : undefined,
        title: t(item.labelKey),
      },
        h('span', { className: styles.navIcon }, h(item.icon)),
        h('span', { className: styles.navLabel }, t(item.labelKey)),
      )),
    ),
    // 右侧内容：只渲染当前分组，独立滚动
    h('div', { className: styles.content },
      h('div', { className: styles.pageHeader },
        h('div', { className: styles.pageTitle }, t(activeNav.labelKey)),
        h('div', { className: styles.pageDesc }, pageDesc[section]),
      ),
      section === 'updates' ? updatesCard
        : section === 'security' ? securityCard
          : section === 'diagnostics' ? diagnosticsCard
            : section === 'logs' ? logsCard
              : resetCard,
    ),
    // 恢复默认确认弹窗：点「恢复默认」先弹窗确认，确认后才真正 reset（替代两段式按钮）
    resetConfirm && h('div', {
      className: modalStyles.overlay,
      onClick: (e: MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) setResetConfirm(false) },
    },
      h('div', { className: modalStyles.modal, role: 'dialog', 'aria-modal': 'true' },
        h('div', { className: modalStyles.modalHead },
          h('div', { className: modalStyles.modalTitle }, t('settingsReset')),
          h('button', {
            className: modalStyles.modalClose,
            type: 'button',
            'aria-label': t('errorClose'),
            onClick: () => setResetConfirm(false),
          }, h(CloseIcon)),
        ),
        h('div', { className: modalStyles.modalBody },
          h('div', { className: modalStyles.failPrepareHint }, t('settingsResetConfirmDetail')),
          h('div', { className: modalStyles.modalActions },
            h('button', {
              className: modalStyles.restartLater,
              type: 'button',
              onClick: () => setResetConfirm(false),
            }, t('cancel')),
            h('button', {
              className: modalStyles.restartNowWarning,
              type: 'button',
              onClick: () => { setResetConfirm(false); reset() },
            }, t('settingsResetConfirm')),
          ),
        ),
      ),
    ),
  )
}
