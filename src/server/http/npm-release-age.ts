/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * npm 包发布时间查询路由：按已安装插件的 npm 包名按需查询最新版本的发布时间，
 * 供客户端判定 pnpm 24h 供应链门禁（发布未满门槛的版本不提示更新）。
 */
import { systemProxy } from '../services/probe.ts'
import { lookupReleaseAge, parseReleaseAgeRequest } from '../services/npm-release-age.ts'
import { userNpmRegistry } from '../services/install/registry-fallback.ts'
import { profileDirectory } from '../services/profile/profile.ts'
import { loadSettings } from '../services/settings.ts'
import { readJsonBody, requireTrustedPost, sendJson, type WebRoute, type WebServerService } from './shared.ts'

export function registerNpmReleaseAgeRoutes(webServer: WebServerService, profile: string): WebRoute[] {
  return [
    {
      kind: 'exact',
      path: '/dsh-plugin-hub/npm-release-age',
      handler: async (request, response) => {
        if (!requireTrustedPost(request, response)) return
        try {
          const packages = parseReleaseAgeRequest(await readJsonBody(request))
          if (packages === null) {
            sendJson(response, 400, { error: 'invalid package list' })
            return
          }
          const settings = loadSettings(profile)
          // 代理口径与安装/目录一致：设置里的代理 → 系统代理 → 环境变量 → 直连
          const proxy = settings.proxy !== ''
            ? settings.proxy
            : (systemProxy() ?? process.env.HTTPS_PROXY ?? process.env.https_proxy ?? '')
          // 并发查询：单包各自带超时且失败即 null，整体不因任一包失败而失败
          // 查询源与安装首选源同口径（设置 → 本机 npm 配置）：安装钉住的版本必须来自真正要用的那个源
          const registry = settings.npmRegistry !== ''
            ? settings.npmRegistry
            : userNpmRegistry(profileDirectory(profile))
          const results = await Promise.all(packages.map(async (name) =>
            [name, await lookupReleaseAge(name, registry, proxy)] as const))
          sendJson(response, 200, { packages: Object.fromEntries(results) })
        } catch (error) {
          sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) })
        }
      },
    },
  ]
}
