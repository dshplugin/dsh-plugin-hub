/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 目录代理路由：目录/统计载荷的服务端缓存，以及与安装/任务模块共享的 profile 级已装包读取。
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { githubRepoOf } from '../services/install/install.ts'
import { loadSettings } from '../services/settings.ts'
import { fetchViaCurl, systemProxy } from '../services/probe.ts'
import { CATALOG_CACHE_TTL_MS, requireMethod, sendJson, type WebRoute, type WebServerService } from './shared.ts'

/** 磁盘缓存内容：原始响应字符串 + 写入时间戳（TTL 判定用）。 */
interface CatalogCacheEntry {
  at: number
  body: string
}

function catalogCacheFile(profile: string, key: string): string {
  return join(profileDirectory(profile), 'cache', `catalog-${key}.json`)
}

/** 目录拉取超时：目录 JSON 约 3.6MB，20s 在弱网/代理链路上不够用；
 *  客户端会在超时后重试，重试必须共享同一次拉取（见 fetchCatalogOnce）。 */
const CATALOG_FETCH_TIMEOUT_MS = 60_000

/** 并发拉取去重：客户端超时重试会并发打进来，共享同一次 curl，
 *  避免多份 3.6MB 下载互相抢带宽、越重试越慢。 */
const inflightCatalog = new Map<string, ReturnType<typeof fetchViaCurl>>()

function fetchCatalogOnce(target: string, proxy: string): ReturnType<typeof fetchViaCurl> {
  const key = `${target}\n${proxy}`
  const running = inflightCatalog.get(key)
  if (running !== undefined) return running
  const task = fetchViaCurl(target, proxy, CATALOG_FETCH_TIMEOUT_MS)
    .finally(() => { inflightCatalog.delete(key) })
  inflightCatalog.set(key, task)
  return task
}

/** 读缓存：文件存在、JSON 合法、未超过 maxAgeMs → 返回原始响应字符串；否则 null（视为 miss）。
 *  maxAgeMs 传 Infinity 即「任意年龄的缓存」，供实时拉取失败时使用。 */
function readCatalogCache(file: string, maxAgeMs: number): string | null {
  try {
    const entry = JSON.parse(readFileSync(file, 'utf8')) as CatalogCacheEntry
    if (entry && typeof entry.at === 'number' && typeof entry.body === 'string'
      && Date.now() - entry.at < maxAgeMs) {
      return entry.body
    }
  } catch {
    // 文件缺失 / 解析失败 / 字段不完整 → miss，重新拉取覆盖写盘
  }
  return null
}

/** 写缓存：目录不存在则创建；写失败直接忽略（缓存只是加速，不影响功能）。 */
function writeCatalogCache(file: string, body: string): void {
  try {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, JSON.stringify({ at: Date.now(), body } satisfies CatalogCacheEntry))
  } catch {
    // 磁盘只读/无权限等极端情况：忽略，继续走直连
  }
}

export function profileDirectory(profile: string): string {
  return join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'profiles', profile)
}

/** 读取安装进某 profile 的非官方依赖。 */
export function readInstalled(profile: string): Record<string, string> {
  try {
    const manifest = JSON.parse(readFileSync(join(profileDirectory(profile), 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>
    }
    return Object.fromEntries(
      Object.entries(manifest.dependencies ?? {}).filter(([name]) => !name.startsWith('@deepseek-ai/')),
    )
  } catch {
    return {}
  }
}

/** 读已装依赖实际落在磁盘上的仓库身份（`owner/repo`）：解析 node_modules/<name>/package.json
 *  的 repository 字段。已装 spec 可能是纯版本号（丢了仓库身份），但真实包元数据仍指向来源仓库，
 *  据此可区分「同名依赖其实是同一仓库的残留（应转 update）」还是「跨仓库包名冲突（应报错）」。
 *  读不到 / 解析不出返回 null（交给调用方按冲突处理）。 */
export function installedRepoOf(profile: string, name: string): string | null {
  try {
    const pkg = JSON.parse(readFileSync(join(profileDirectory(profile), 'node_modules', name, 'package.json'), 'utf8')) as {
      repository?: string | { url?: string }
    }
    const repo = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url
    return repo ? githubRepoOf(repo) : null
  } catch {
    return null
  }
}

export function registerCatalogRoutes(webServer: WebServerService, profile: string): WebRoute[] {
  return [
    {
      kind: 'exact',
      path: '/dsh-plugin-hub/catalog',
      handler: async (request, response) => {
        if (!requireMethod(request, response, 'GET')) return
        // 目录/统计数据服务端代理：浏览器不直连 dsh-plugin.org，统一经此路由
        // 转发（curl 子进程注入代理 env），与 npm / git 安装通道走同一代理规则，
        // 「npm / git / 目录数据请求统一走该代理」的设置文案因此真实生效。
        const url = new URL(request.url ?? '/', 'http://localhost')
        const settings = loadSettings(profile)
        // 代理优先级与安装/诊断一致：设置里的代理 → 系统代理 → 环境变量 → 直连
        const proxy = settings.proxy !== ''
          ? settings.proxy
          : (systemProxy() ?? process.env.HTTPS_PROXY ?? process.env.https_proxy ?? '')
        const isStats = url.searchParams.get('stats') === '1'
        // 目录语言：只有中文目录和英文目录两份。除 zh 以外的界面语言（en、pt…）
        // 都取英文目录，避免非中文用户拿到中文插件描述。
        const lang = url.searchParams.get('lang') === 'zh' ? 'zh' : 'en'
        const target = isStats
          ? 'https://api.dsh-plugin.org/stats.json'
          : `https://api.dsh-plugin.org/plugins.${lang}.json`
        // 1 小时本地缓存：命中直接返回（跨重启生效，插件市场秒开），未命中才走 curl 拉远程。
        // refresh=1 跳过 TTL 缓存直接回源（「强制刷新」用）；成功后照样覆盖缓存，
        // 失败仍回退旧缓存，所以强制刷新不会把可用的旧数据弄丢。
        const cacheFile = catalogCacheFile(profile, isStats ? 'stats' : `plugins-${lang}`)
        const forceRefresh = url.searchParams.get('refresh') === '1'
        const cached = forceRefresh ? null : readCatalogCache(cacheFile, CATALOG_CACHE_TTL_MS)
        if (cached !== null) {
          try {
            sendJson(response, 200, JSON.parse(cached))
            return
          } catch {
            // 缓存正文损坏：忽略，走重新拉取并覆盖写盘
          }
        }
        const r = await fetchCatalogOnce(target, proxy)
        if (!r.ok || r.body === '') {
          // 实时拉取失败：退回任意年龄的本地缓存（上次成功数据），
          // 避免证书吊销受阻 / 网络抖动时整个插件市场打不开 —— 数据可能过期，但好过空白。
          const stale = readCatalogCache(cacheFile, Number.POSITIVE_INFINITY)
          if (stale !== null) {
            try {
              sendJson(response, 200, JSON.parse(stale))
              return
            } catch {
              // 备用缓存也损坏：落到下面的 502
            }
          }
          // 带上 curl 退出码与 stderr 末行：只回 error 字段时，用户贴出来的响应里
          // 没有任何可诊断信息
          sendJson(response, 502, { error: 'catalog fetch failed', detail: r.detail })
          return
        }
        try {
          sendJson(response, 200, JSON.parse(r.body))
          writeCatalogCache(cacheFile, r.body)
        } catch {
          sendJson(response, 502, { error: 'catalog fetch returned invalid JSON' })
        }
      },
    },
  ]
}
