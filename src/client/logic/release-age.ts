/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 供应链门禁的时间判定（纯函数）：pnpm 会静默回退发布未满门槛的版本，
 * 故发布太新的版本不该提示更新。Hub 自身更新与插件更新共用同一门槛。
 */
import type { HubUpdateInfo, HubUpdateState, HubUpdateVersion } from '../types.ts'

/** pnpm 供应链门禁：dsh profile 默认 minimumReleaseAge=1440（分钟）；+30 分钟缓冲抵消网络/CDN 边缘时间偏差。 */
export const MIN_RELEASE_AGE_MS = 24 * 60 * 60 * 1000 + 30 * 60 * 1000

/** 发布时间是否仍在门禁窗口内（太新 → 暂缓提示）；无值/解析不出返回 false（不拦真实更新）。 */
export function isReleaseTooFresh(publishedAt: string | null | undefined, now: number): boolean {
  if (typeof publishedAt !== 'string' || publishedAt === '') return false
  const ms = Date.parse(publishedAt)
  if (Number.isNaN(ms)) return false
  return now - ms < MIN_RELEASE_AGE_MS
}

/** 版本号比较（逐段数字；缺失段按 0）。返回负数/0/正数，非法输入按相等处理。
 *  兼容目录里的 `v1.1.8` 与 npm 的 `1.1.8`：每段先剥掉前导非数字，再取整。
 *  预发布后缀单独处理：`1.0.0` 高于 `1.0.0-beta.1`，两个预发布版按标识符比较
 *  （纯数字段按数值，数字段低于字母段）。 */
export function compareVersions(a: string | null | undefined, b: string | null | undefined): number {
  const core = (v: string | null | undefined): number[] =>
    (v ?? '').split('+')[0]!.split('-')[0]!
      .split('.')
      .map((part) => Number.parseInt(part.replace(/^[^\d]+/, ''), 10))
      .filter((n) => !Number.isNaN(n))
  const pre = (v: string | null | undefined): string[] => {
    const rest = (v ?? '').split('+')[0]!.split('-').slice(1)
    return rest.length === 0 ? [] : rest.join('-').split('.')
  }
  const va = core(a)
  const vb = core(b)
  const len = Math.max(va.length, vb.length)
  for (let i = 0; i < len; i++) {
    const d = (va[i] ?? 0) - (vb[i] ?? 0)
    if (d !== 0) return d
  }
  const pa = pre(a)
  const pb = pre(b)
  if (pa.length === 0 && pb.length === 0) return 0
  if (pa.length === 0) return 1
  if (pb.length === 0) return -1
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i]
    const y = pb[i]
    if (x === undefined) return -1
    if (y === undefined) return 1
    const nx = /^\d+$/.test(x) ? Number(x) : null
    const ny = /^\d+$/.test(y) ? Number(y) : null
    if (nx !== null && ny !== null) {
      if (nx !== ny) return nx - ny
    } else if (x !== y) {
      return x < y ? -1 : 1
    }
  }
  return 0
}

/** 「可更新」判定结果：是否提示，以及被供应链门禁拦下时的到期时刻。 */
export interface UpdateDecision {
  offered: boolean
  /** 发布未满门槛 → 可重试时刻（毫秒）；非门禁原因（npm 上没有更高版本）→ null */
  pendingUntil: number | null
}

/**
 * 是否值得提示「可更新」：npm 上最新可安装版本确实比已装版本新，且已过供应链门禁。
 *
 * 更新命令执行的是 `pkg@latest`，所以「目录里标的版本」不是最终能装上的版本：
 * 作者可能只打了 GitHub release 没发 npm —— 此时提示会变成永远点不掉的循环。
 * 任一信息缺失（查不到发布信息 / 没有已装版本记录）返回 offered，交回调用方原有判定：
 * 宁可提示，也不因为一次查询失败把真实更新吃掉。
 */
export function updateDecision(
  release: { version: string; publishedAt: string } | null,
  installedVersion: string | null,
  now: number,
): UpdateDecision {
  if (release === null) return { offered: true, pendingUntil: null }
  if (isReleaseTooFresh(release.publishedAt, now)) {
    const ms = Date.parse(release.publishedAt)
    return { offered: false, pendingUntil: Number.isNaN(ms) ? null : ms + MIN_RELEASE_AGE_MS }
  }
  if (installedVersion !== null && compareVersions(release.version, installedVersion) <= 0) {
    return { offered: false, pendingUntil: null }
  }
  return { offered: true, pendingUntil: null }
}

/** 是否提示「可更新」（只要布尔结果的场景）。 */
export function isUpdateOffered(
  release: { version: string; publishedAt: string } | null,
  installedVersion: string | null,
  now: number,
): boolean {
  return updateDecision(release, installedVersion, now).offered
}

/**
 * 选出本次真正该提示的更新版本。
 *
 * 只看最新版会漏更新：连续发版时间隔小于供应链门禁时，最新版永远「太新」，
 * 提示被整体跳过。这里把最新版与 recentVersions 一起当候选，取「高于当前版本且已过门禁」
 * 的最高版本；一个都没有但仍存在更高版本 → pending（暂缓，不谎称已是最新）。
 */
export function pickHubUpdate(info: HubUpdateInfo, currentVersion: string, now: number): { state: HubUpdateState; target: HubUpdateVersion | null } {
  if (currentVersion === '') return { state: 'latest', target: null }
  const seen = new Set<string>()
  const candidates: HubUpdateVersion[] = []
  for (const entry of [{ version: info.version, publishedAt: info.publishedAt, notes: info.notes }, ...(info.recentVersions ?? [])]) {
    if (typeof entry.version !== 'string' || entry.version === '' || seen.has(entry.version)) continue
    seen.add(entry.version)
    candidates.push(entry)
  }
  const higher = candidates
    .filter((c) => compareVersions(c.version, currentVersion) > 0)
    .sort((a, b) => compareVersions(b.version, a.version))
  if (higher.length === 0) return { state: 'latest', target: null }
  const ready = higher.find((c) => !isReleaseTooFresh(c.publishedAt, now))
  return ready !== undefined
    ? { state: 'available', target: ready }
    : { state: 'pending', target: higher[0]! }
}
