/**
 * npm 换源：当前源是公共镜像时，传输层失败后按「当前源 → 官方 → npmmirror」
 * 自动换源重试；自定义/内网源不换源，避免私有包名泄露给公共源。
 */
import { spawnSync } from 'node:child_process'

/** 允许自动切换的公共源：只放官方与大厂/高校镜像。 */
const PUBLIC_REGISTRIES = [
  'https://registry.npmjs.org',
  'https://registry.npmmirror.com',
  'https://mirrors.cloud.tencent.com/npm',
  'https://mirrors.tuna.tsinghua.edu.cn/npm',
]

const PUBLIC_HOSTS = new Set([
  'registry.npmjs.org',
  'registry.npmmirror.com',
  'mirrors.cloud.tencent.com',
  'mirrors.tuna.tsinghua.edu.cn',
])

/** 去掉尾部斜杠，避免同一源因写法不同被当成两个候选。 */
export function normalizeRegistry(value: string): string {
  return value.trim().replace(/\/+$/, '')
}

/** 是否属于允许自动切换的公共源白名单。 */
export function isPublicRegistry(value: string): boolean {
  const v = normalizeRegistry(value)
  if (!/^https?:\/\//i.test(v)) return false
  try {
    return PUBLIC_HOSTS.has(new URL(v).hostname.toLowerCase())
  } catch {
    return false
  }
}

/**
 * 依次尝试的源：显式配置 → 本机 npm 配置 → 官方源。
 * 只有公共源才追加后备（最多 3 个）；关闭换源或源不在白名单时只返回它自己。
 */
export function registryCandidates(configured: string, userRegistry: string, enabled: boolean): string[] {
  const base = normalizeRegistry(configured) || normalizeRegistry(userRegistry) || PUBLIC_REGISTRIES[0]!
  if (!enabled || !isPublicRegistry(base)) return [base]
  const out = [base]
  for (const candidate of PUBLIC_REGISTRIES) {
    if (out.length >= 3) break
    if (!out.includes(candidate)) out.push(candidate)
  }
  return out
}

/** 本机 npm 实际生效的源（含 profile 目录的 .npmrc）；读不到返回空串。 */
export function userNpmRegistry(cwd: string): string {
  try {
    const res = spawnSync('npm', ['config', 'get', 'registry'], {
      cwd,
      encoding: 'utf8',
      timeout: 3000,
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    if (res.status !== 0) return ''
    const value = (res.stdout ?? '').trim()
    return /^https?:\/\//i.test(value) ? normalizeRegistry(value) : ''
  } catch {
    return ''
  }
}

/**
 * 传输层失败才值得换源：超时、连接重置、DNS、5xx。
 * 404 / 版本不存在 / 鉴权失败必须保持原样 —— 换源只会掩盖作者侧问题或装到滞后版本。
 * 本机证书链不被信任（TLS 校验失败）同样不换源：换哪个公共镜像都会以同样方式失败，
 * 白白多等两轮超时、把真正的根因淹进换源噪音里。
 */
export function isTransportFailure(text: string): boolean {
  if (/\b(?:ERR_PNPM_FETCH_404|E404|ERR_PNPM_NO_MATCHING_VERSION|ETARGET|ERR_PNPM_FETCH_401|ERR_PNPM_FETCH_403|E401|E403)\b/i.test(text)) {
    return false
  }
  if (/unable to verify the first certificate|SELF_SIGNED_CERT_IN_CHAIN|UNABLE_TO_VERIFY_LEAF_SIGNATURE|ERR_TLS_CERT_ALTNAME_INVALID|CERT_HAS_EXPIRED|CERT_UNTRUSTED|UNABLE_TO_GET_ISSUER_CERT/i.test(text)) {
    return false
  }
  return /\b(?:ETIMEDOUT|ECONNRESET|ECONNREFUSED|EAI_AGAIN|ENOTFOUND|EHOSTUNREACH|ENETUNREACH|EPIPE)\b|socket hang up|getaddrinfo|network request failed|connect timeout|request to .+ failed|FetchError|ERR_PNPM_FETCH_5\d\d|ERR_PNPM_META_FETCH_FAIL/i.test(text)
}

/** 日志里展示用的源主机名（不打印可能带凭据的完整 URL）。 */
export function registryHost(value: string): string {
  try {
    return new URL(value).host
  } catch {
    return value
  }
}
