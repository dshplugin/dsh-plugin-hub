/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 插件中心设置状态：从宿主本地 /settings 路由加载一次（持久化在
 * ~/.dsh/profiles/<profile>/hub-settings.json），并按乐观方式更新。
 * 每次改动立即 POST 补丁，切换过的开关刷新后仍在；宿主未挂服务端路由时退回默认值
 * 继续可用（设置不持久化而已）。
 */
import { useCallback, useEffect, useState } from 'react'

export interface HubSettings {
  /** 启动时检查目录插件更新，发现可更新时在通知中心提示（安装不自动进行） */
  checkUpdatesOnStart: boolean
  /** HTTP(S) 代理地址，用于 npm / git / 目录请求（空串 = 直连） */
  proxy: string
  /** npm 镜像源 registry 地址（空串 = 未配置，跟随用户本机 npm 配置） */
  npmRegistry: string
  /** 公共源传输失败时自动换下一个镜像重试（自定义/内网源不切换） */
  registryFallback: boolean
  /** 启用命令行安装 NPM 包（默认开） */
  enableNpmInstall: boolean
  /** 日志存放位置覆盖（空串 = 默认 ~/.dsh/profiles/<profile>/hub.log） */
  logPath: string
}

export const DEFAULT_SETTINGS: HubSettings = {
  checkUpdatesOnStart: true,
  proxy: '',
  npmRegistry: '',
  registryFallback: true,
  enableNpmInstall: true,
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

  /** 部分更新：本地立即生效（乐观），同时 POST 持久化；持久化失败不影响本次会话。 */
  const update = useCallback((patch: Partial<HubSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
    void fetch('/dsh-plugin-hub/settings', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(patch),
      cache: 'no-store',
    }).catch(() => { /* 宿主未挂路由：仅本次会话生效 */ })
  }, [])

  /** 重置为默认设置：本地立即回默认，同时通知服务端删除设置文件；失败不影响本地已重置的设置。 */
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
