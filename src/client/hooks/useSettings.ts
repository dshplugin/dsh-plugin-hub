/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Hub settings state: loaded once from the host's local /settings route
 * (persisted at ~/.dsh/profiles/<profile>/hub-settings.json), updated
 * optimistically. Every change POSTs the patch immediately so a toggled
 * switch survives a reload; a host without the server routes falls back to
 * the defaults and keeps working (settings simply do not persist).
 */
import { useCallback, useEffect, useState } from 'react'

export interface HubSettings {
  /** 启动时检查目录插件更新，发现可更新时在通知中心提示（安装不自动进行） */
  checkUpdatesOnStart: boolean
  /** 检查到可用更新后自动安装（装完需重启宿主生效；默认关，规避「装完重启即崩」风险） */
  autoInstallUpdates: boolean
  /** npm 镜像源 registry 地址（空串 = 官方 https://registry.npmjs.org） */
  npmRegistry: string
  /** HTTP(S) 代理地址，用于 npm / git / 目录请求（空串 = 直连） */
  proxy: string
  /** 启用命令行安装 NPM 包（默认开） */
  enableNpmInstall: boolean
  /** 启用命令行安装 GitHub 源码（默认开） */
  enableGitInstall: boolean
  /** 日志存放位置覆盖（空串 = 默认 ~/.dsh/profiles/<profile>/hub.log） */
  logPath: string
}

export const DEFAULT_SETTINGS: HubSettings = {
  checkUpdatesOnStart: true,
  autoInstallUpdates: false,
  npmRegistry: '',
  proxy: '',
  enableNpmInstall: true,
  enableGitInstall: true,
  logPath: '',
}

async function loadRemote(): Promise<HubSettings> {
  try {
    const res = await fetch('/dsh-plugin-hub/settings', { cache: 'no-store' })
    if (!res.ok) throw new Error(`settings ${res.status}`)
    const data = await res.json() as Partial<HubSettings>
    return { ...DEFAULT_SETTINGS, ...data }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<HubSettings>(DEFAULT_SETTINGS)
  /** 服务端配置是否已加载：更新策略等启动期逻辑须等真实值，避免用默认值误触发 */
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    void loadRemote().then((s) => {
      if (!alive) return
      setSettings(s)
      setReady(true)
    })
    return () => { alive = false }
  }, [])

  /** 部分更新：本地立即生效（乐观），同时 POST 持久化；持久化失败静默（本次会话仍生效）。 */
  const update = useCallback((patch: Partial<HubSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
    void fetch('/dsh-plugin-hub/settings', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(patch),
      cache: 'no-store',
    }).catch(() => { /* 宿主未挂路由：仅本次会话生效 */ })
  }, [])

  /** 重置为默认设置：本地立即回默认，同时通知服务端删除设置文件；失败静默。 */
  const reset = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS })
    void fetch('/dsh-plugin-hub/settings/reset', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
      cache: 'no-store',
    }).catch(() => { /* 宿主未挂路由：仅本次会话回默认 */ })
  }, [])

  return { settings, ready, update, reset }
}
