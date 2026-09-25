/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
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
 *
 * 注意：npm search 接口并没有 `repository:` 限定符 —— 它被当作普通词元参与全文
 * 检索，结果按下载量/质量分排序。只发这一条查询时，「包名就等于仓库名但热度低」
 * 的插件进不了第一页，反查会得出「该仓库没有 npm 包」的错误结论，安装于是回落到
 * git 通道 —— 而 git 分发恰恰是那些缺构建产物、需要认证、或用户网络受限时最容易
 * 失败的通道。因此改成按序猜名，把 `repository:` 写法降级为兼容用的最后一条
 * （见 {@link npmResolveQueries}）。
 */
import { get } from 'node:https'

/** 反查缓存：repo 小写 → npm 包名（null 表示已确认无对应 npm 包；网络异常不缓存）。 */
const cache = new Map<string, string | null>()

/** 单次 registry 查询超时（ms）：慢网络下失败返回 null，不阻塞安装流程。 */
const REQUEST_TIMEOUT_MS = 8000

/** 单次检索取回的候选条数：铁证校验要能看到热度排名靠后的包，第一页 10 条不够。 */
const QUERY_SIZE = 25

/**
 * 反查按序尝试的检索词。
 *
 * 1. 仓库名 —— 绝大多数插件包的包名就等于仓库名，通常第一条就命中；
 * 2. 作者名 —— 组织 scope 与 GitHub 用户名不一致、包名猜不到时，repository
 *    字段里仍然带着 owner，按 owner 检索能把候选压到几十条；
 * 3. `repository:owner/name` —— npm 官方源不支持这个限定符，保留它只为兼容
 *    个别真把它当限定符实现的镜像源。
 *
 * 每条结果都要过 {@link searchOnce} 里的铁证校验（包元数据必须指回该仓库），
 * 所以检索词宽一点也不会误命中。
 * @param owner - GitHub 所有者。
 * @param name - GitHub 仓库名。
 * @returns 依次尝试的检索词。
 */
export function npmResolveQueries(owner: string, name: string): string[] {
  return [name, owner, `repository:${owner}/${name}`]
}

/**
 * 反查 repo（`owner/repo`）对应的官方 npm 包名；未命中、网络异常或超时返回 null。
 * 返回 null 不代表仓库一定没有 npm 包，只代表本次未能确认 —— 调用方应保留
 * 原有错误路径，反查只是额外的一次尝试。只有「已确认」的结果（包名，或 200
 * 响应下确认无匹配）会进缓存；网络异常/超时/解析失败不缓存，同一会话内下次
 * 安装仍会重试反查，避免一次瞬时故障把整个会话锁死在 git 通道。
 * registry 参数：npm 镜像源地址，空串 = 官方源；与安装通道吃同一 registry，
 * 保证「配置了镜像」时反查和安装走同一个源（镜像节点同步完整时结果一致）。
 * 慢网络下失败不阻塞安装。
 */
export function resolveNpmPackage(repo: string, registry = ''): Promise<string | null> {
  const key = repo.toLowerCase()
  if (cache.has(key)) return Promise.resolve(cache.get(key) ?? null)
  const found = searchRepo(repo, registry)
  void found.then((value) => {
    if (value !== undefined) cache.set(key, value)
  })
  return found.then((value) => value ?? null)
}

/**
 * 逐个检索词反查，命中即在第一个结果返回。
 * 返回：包名 = 命中；null = 每个检索词都拿到了 200 且都没有匹配；undefined = 至少
 * 有一条查询没能给出答案（网络/超时/解析失败）—— 此时不能宣称「该仓库没有 npm 包」，
 * 否则这次不确切的结论会被缓存成「确认无包」，整个会话都退回 git 通道。
 */
function searchRepo(repo: string, registry: string): Promise<string | null | undefined> {
  const parts = repo.split('/')
  if (parts.length !== 2) return Promise.resolve(null)
  const [owner, name] = parts
  if (owner === '' || name === '') return Promise.resolve(null)
  const base = registry === '' ? 'https://registry.npmjs.org' : registry.replace(/\/+$/, '')
  const needle = `github.com/${owner}/${name}`.toLowerCase()
  return (async () => {
    let unanswered = false
    for (const text of npmResolveQueries(owner, name)) {
      const found = await searchOnce(base, text, needle)
      if (typeof found === 'string') return found
      if (found === undefined) unanswered = true
    }
    return unanswered ? undefined : null
  })()
}

/**
 * 用 npm search 接口查一条检索词，并按 repository 地址做铁证校验（包元数据必须指向该仓库）。
 * 返回：包名 = 命中；null = 200 响应下确认无匹配；undefined = 本次未能确认（网络/超时/解析失败）。
 */
function searchOnce(base: string, text: string, needle: string): Promise<string | null | undefined> {
  const url = `${base}/-/v1/search?text=${encodeURIComponent(text)}&size=${QUERY_SIZE}`
  return new Promise((resolve) => {
    const req = get(url, { timeout: REQUEST_TIMEOUT_MS }, (res) => {
      if (res.statusCode !== 200) {
        res.resume()
        resolve(undefined)
        return
      }
      let body = ''
      res.on('data', (chunk: Buffer) => { body += chunk.toString() })
      res.on('end', () => {
        try {
          const data = JSON.parse(body) as { objects?: Array<{ package?: { name?: unknown; links?: { repository?: unknown }; repository?: { url?: unknown } } }> }
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
          resolve(undefined)
        }
      })
    })
    req.on('timeout', () => req.destroy())
    req.on('error', () => resolve(undefined))
  })
}
