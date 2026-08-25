/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Hub settings persistence: one `hub-settings.json` per active profile
 * (next to pnpm-workspace.yaml). All fields optional; missing keys fall
 * back to DEFAULT_SETTINGS so old files stay readable as new options land.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { profileDirectory } from './profile/profile.ts'

export interface HubSettings {
  /** 启动时检查目录插件更新，发现可更新时在通知中心提示（安装不自动进行） */
  checkUpdatesOnStart: boolean
  /** npm 镜像源 registry 地址（空串 = 官方 https://registry.npmjs.org） */
  npmRegistry: string
  /** HTTP(S) 代理地址，用于 npm / git / 目录请求（空串 = 直连） */
  proxy: string
  /** 启用命令行安装 NPM 包（默认开；关掉后输入 npm 包名安装被拦截） */
  enableNpmInstall: boolean
  /** 启用命令行安装 GitHub 源码（默认开；关掉后输入 GitHub 地址安装被拦截） */
  enableGitInstall: boolean
  /** 启用命令行粘贴 dsh plugin 命令安装（默认开；关掉后命令输入被禁用） */
  enableDshInstall: boolean
  /** 日志存放位置覆盖（空串 = 默认 ~/.dsh/profiles/<profile>/hub.log；可填目录或 .log 文件路径） */
  logPath: string
}

export const DEFAULT_SETTINGS: HubSettings = {
  checkUpdatesOnStart: true,
  npmRegistry: '',
  proxy: '',
  enableNpmInstall: true,
  enableGitInstall: true,
  enableDshInstall: true,
  logPath: '',
}

export function settingsFile(profile: string): string {
  return join(profileDirectory(profile), 'hub-settings.json')
}

/** 读取当前 profile 的设置；文件缺失/损坏时回退默认值（只读路径绝不抛错）。 */
export function loadSettings(profile: string): HubSettings {
  try {
    const raw = JSON.parse(readFileSync(settingsFile(profile), 'utf8')) as Partial<HubSettings>
    return {
      ...DEFAULT_SETTINGS,
      ...(typeof raw === 'object' && raw !== null ? raw : {}),
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

/** 合并并持久化设置（部分更新），返回合并后的完整设置。 */
export function saveSettings(profile: string, patch: Partial<HubSettings>): HubSettings {
  const next = { ...loadSettings(profile), ...patch }
  const file = settingsFile(profile)
  try {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`)
  } catch {
    // 持久化失败不阻断本次会话：内存值仍生效，下次写入再试
  }
  return next
}

/** 重置为默认设置：删除设置文件，下次读取全部回退默认值（陈旧/白名单外键一并清除）。 */
export function resetSettings(profile: string): HubSettings {
  try {
    rmSync(settingsFile(profile), { force: true })
  } catch {
    // 删除失败不阻断：loadSettings 仍回退默认值
  }
  return { ...DEFAULT_SETTINGS }
}
