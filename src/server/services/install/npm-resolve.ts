/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * npm 包反查：git 分发不完整（缺构建产物/子模块）导致安装失败时，用 npm
 * registry 的搜索接口按 repository 地址反查该仓库对应的官方 npm 包。
 *
 * 这是通用机制，不针对任何具体插件：只要作者发布了 repository 指向该
 * GitHub 仓库的 npm 包（scope 名与 GitHub 用户名是否一致无所谓），就能命中，
 * 从而把 git 分发不完整的插件切换到 npm 通道安装。命中结果带内存缓存，
 * 避免同一会话内重复查询 registry。
 */
import { get } from 'node:https'

/** 反查缓存：repo 小写 → npm 包名（null 表示已确认无对应 npm 包）。 */
const cache = new Map<string, string | null>()

/** 单次 registry 查询超时（ms）：慢网络下失败返回 null，不阻塞安装流程。 */
const REQUEST_TIMEOUT_MS = 8000

/**
 * 反查 repo（`owner/repo`）对应的官方 npm 包名；未命中、网络异常或超时返回 null。
 * 返回 null 不代表仓库一定没有 npm 包，只代表本次未能确认 —— 调用方应保留
 * 原有错误路径，反查只是额外的一次尝试。
 * @param registry - npm 镜像源地址（空串 = 官方 https://registry.npmjs.org）
 */
export function resolveNpmPackage(repo: string, registry = ''): Promise<string | null> {
  const key = repo.toLowerCase()
  if (cache.has(key)) return Promise.resolve(cache.get(key) ?? null)
  const name = searchRepo(repo, registry)
  name.then((found) => cache.set(key, found)).catch(() => cache.set(key, null))
  return name
}

/** 用 npm search 接口按 repository 地址反查，并做铁证校验（包元数据必须指向该仓库）。 */
function searchRepo(repo: string, registry: string): Promise<string | null> {
  const [owner, name] = repo.split('/')
  if (owner === undefined || name === undefined || name === '') return Promise.resolve(null)
  const base = registry === '' ? 'https://registry.npmjs.org' : registry.replace(/\/+$/, '')
  const url = `${base}/-/v1/search?text=${encodeURIComponent(`repository:${owner}/${name}`)}&size=10`
  return new Promise((resolve) => {
    const req = get(url, { timeout: REQUEST_TIMEOUT_MS }, (res) => {
      if (res.statusCode !== 200) {
        res.resume()
        resolve(null)
        return
      }
      let body = ''
      res.on('data', (chunk: Buffer) => { body += chunk.toString() })
      res.on('end', () => {
        try {
          const data = JSON.parse(body) as { objects?: Array<{ package?: { name?: unknown; links?: { repository?: unknown }; repository?: { url?: unknown } } }> }
          const needle = `github.com/${owner}/${name}`.toLowerCase()
          for (const obj of data.objects ?? []) {
            const pkg = obj.package
            if (typeof pkg?.name !== 'string' || pkg.name === '') continue
            const repoUrl = String(pkg.repository?.url ?? pkg.links?.repository ?? '')
            if (repoUrl.toLowerCase().includes(needle)) {
              resolve(pkg.name)
              return
            }
          }
          resolve(null)
        } catch {
          resolve(null)
        }
      })
    })
    req.on('timeout', () => req.destroy())
    req.on('error', () => resolve(null))
  })
}
