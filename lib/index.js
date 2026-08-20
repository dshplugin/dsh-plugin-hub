/**
 * dsh-plugin-hub host entry.
 *
 * The browser half (src/client) renders the DSH-Plugin Hub catalog inside
 * the Settings panel via the `settings.section` slot. This node half exists
 * to serve the catalog data: it mounts exact HTTP routes that stream the
 * bundled directory snapshots (data/plugins.{zh,en}.json, refreshed with
 * `npm run sync:data`), so the browser half fetches the same-origin JSON
 * with no CORS and no dependency on dsh-plugin.org being reachable.
 */
import { readFileSync } from 'node:fs'

/** Route path → bundled data file (resolved relative to this file). */
const DATA_ROUTES = [
  ['/dsh-plugin-hub/data.zh.json', '../data/plugins.zh.json'],
  ['/dsh-plugin-hub/data.en.json', '../data/plugins.en.json'],
]

export const name = 'dsh-plugin-hub'

/**
 * @param ctx - Host context; may acquire the webServer service.
 */
export function apply(ctx) {
  ctx.inject(['webServer'], (hostCtx) => {
    const webServer = hostCtx.webServer
    const disposers = []
    for (const [path, rel] of DATA_ROUTES) {
      let content
      try {
        content = readFileSync(new URL(rel, import.meta.url), 'utf8')
      } catch {
        content = '[]'
      }
      disposers.push(webServer.register({
        kind: 'exact',
        path,
        handler: (_request, response) => {
          response.setHeader('content-type', 'application/json; charset=utf-8')
          response.setHeader('cache-control', 'no-cache')
          response.end(content)
        },
      }))
    }
    hostCtx.effect(() => () => {
      for (const dispose of disposers) dispose()
    }, 'dsh-plugin-hub: data routes')
  })
}
