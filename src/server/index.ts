/**
 * dsh-plugin host entry: mounts the Plugin Hub HTTP routes once the host
 * web server service is available. The browser bundle (src/client) talks to
 * these same-origin routes to perform real installs from inside the app.
 */
import { readProfileArg, type LoaderHandle } from './services/install.ts'
import { mountPluginHubRoutes, type WebServerService } from './http/routes.ts'

export const name = 'dsh-plugin'

export interface Config {
  /** DSH profile that owns plugin mutations. Defaults to the booted profile. */
  profile?: string
}

/** The subset of the cordis host context this plugin touches. */
interface HostContext {
  webServer: WebServerService
  /** 运行中 loader：卸载成功后主动移除条目、立即生效（宿主未提供时卸载仍需重启） */
  loader?: LoaderHandle
  inject(services: string[], callback: (host: HostContext) => void): void
  effect(callback: () => void, label?: string): void
}

/**
 * Mount the Plugin Hub routes after the web server service becomes available.
 * @param ctx - cordis host context.
 * @param config - optional profile override.
 */
export function apply(ctx: HostContext, config: Config = {}): void {
  const profile = config.profile ?? readProfileArg('web')
  ctx.inject(['webServer'], (host) => {
    host.effect(() => mountPluginHubRoutes(host.webServer, profile, host.loader), 'dsh-plugin: http routes')
  })
}
