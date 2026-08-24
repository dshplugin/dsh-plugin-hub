/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Host repository: the local routes served by the DSH harness (installed
 * plugin table + environment snapshot). A host without the plugin's server
 * routes degrades to null / empty tables instead of throwing.
 */
import type { EnvInfo } from '../types.ts'
import type { InstalledVersionSignal } from '../logic/installed.ts'

export interface HostInstalled {
  installed: Record<string, string>
  versions: Record<string, InstalledVersionSignal>
  /** 每个依赖在系统上的安装目录（profile/node_modules/<包名>），宿主未提供为 null */
  paths: Record<string, string> | null
  /** 已加载进运行中 loader 的包名（官方 ctx.loader.entries() 对账）：装完未重启的新插件不在其中 */
  loaded: string[] | null
  /** 真正的 dsh 插件包名（包内声明 dsh 配置 / 在 profile bundles 清单）：非 dsh 插件（如官方示例仓库）装上也不会被宿主加载，不提示待重启 */
  dshCapable: string[] | null
}

/** 当前 profile 已安装插件表（npm 包名 -> manifest spec）+ 安装时记录的目录信号 + 安装路径 + 运行状态。 */
export async function fetchInstalled(): Promise<HostInstalled | null> {
  try {
    const res = await fetch('/dsh-plugin-hub/installed', { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json() as {
      installed?: Record<string, string>
      versions?: Record<string, InstalledVersionSignal>
      paths?: Record<string, string>
      loaded?: string[]
      dshCapable?: string[]
    }
    return {
      installed: data.installed ?? {},
      versions: data.versions ?? {},
      paths: data.paths ?? null,
      loaded: data.loaded ?? null,
      dshCapable: data.dshCapable ?? null,
    }
  } catch {
    return null
  }
}

let envPromise: Promise<EnvInfo | null> | null = null

/** 在系统文件管理器里定位并打开已安装插件的目录（服务端 spawn open，跨平台）；失败返回 false。 */
export async function revealInstallFolder(name: string): Promise<boolean> {
  try {
    const res = await fetch('/dsh-plugin-hub/open-path', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name }),
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}

/** 在系统文件管理器里定位日志文件（服务端 spawn open，跨平台）；失败返回 false。 */
export async function openLogFile(): Promise<boolean> {
  try {
    const res = await fetch('/dsh-plugin-hub/open-log', {
      method: 'POST',
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * 系统目录选择器：弹原生文件夹对话框让用户挑日志存放目录（服务端 spawn
 * osascript / FolderBrowserDialog / zenity）；选中返回绝对路径，取消或
 * 平台不支持（无 osascript / zenity）时返回 null。
 */
export async function chooseLogDir(): Promise<string | null> {
  try {
    const res = await fetch('/dsh-plugin-hub/choose-log-dir', {
      method: 'POST',
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json() as { path?: string }
    return typeof data.path === 'string' && data.path !== '' ? data.path : null
  } catch {
    return null
  }
}

/**
 * 宿主机器环境快照（/dsh-plugin-hub/env）：提交 bug 时拼进 issue 正文。
 * 懒加载 + 模块级缓存：环境在会话期间不会变化；拉取失败降级为 null
 * （issue 链接照常生成，只是少环境段）。
 */
export function getEnv(): Promise<EnvInfo | null> {
  envPromise ??= fetch('/dsh-plugin-hub/env', { cache: 'no-store' })
    .then((res) => (res.ok ? (res.json() as Promise<EnvInfo>) : null))
    .catch(() => null)
  return envPromise
}
