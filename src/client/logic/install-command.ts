/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Install target/command helpers: decide the install channel (npm package
 * vs prebuilt GitHub release vs explicit-HTTPS GitHub), build the display
 * command and normalize a raw install spec back to its owner/repo identity.
 */
import type { HubPlugin } from '../types.ts'
import { githubReleaseTarget } from '../../server/services/install/release-target.ts'

/** The profile the catalog stamps onto every entry that is not tied to a specific
 *  one. It is a publishing placeholder, not a chosen target: measured against the
 *  live catalog, all 13448 entries carry `--profile web` and none names another
 *  profile. Copying such a command on any other host — DSH Desktop runs the
 *  `desktop` profile — installs into the wrong profile, so it is re-pointed at
 *  the one this host actually serves. */
const CATALOG_DEFAULT_PROFILE = 'web'

/** The profile token of a `dsh plugin` command (`--profile web` / `--profile=web`). */
const PROFILE_ARG_RE = /(\s--profile(?:=|\s+))(\S+)(?=\s|$)/

/** The profile this host serves, learned from `GET /dsh-plugin-hub/env`.
 *  Held at module scope so every command builder — including the ones called from
 *  plain render paths — reads the same value without threading it through props. */
let activeProfile = ''

/** Record the profile the host reports, so generated commands target it.
 *  @param profile - profile name from the /env snapshot; anything else clears it. */
export function setActiveProfile(profile: string | undefined): void {
  activeProfile = typeof profile === 'string' ? profile.trim() : ''
}

/** The profile the host reports, or '' before `/env` has answered. */
export function getActiveProfile(): string {
  return activeProfile
}

/**
 * Re-point a catalog command at the profile this host serves.
 *
 * The catalog's command is authoritative for CLI-only plugins, which need their
 * own profile (`--profile dsh-tui`) that cannot be inferred from the package name.
 * Those name a profile other than {@link CATALOG_DEFAULT_PROFILE} and are kept
 * verbatim; only the blanket placeholder is replaced, so a Desktop user copying
 * it installs into `desktop` instead of `web`.
 *
 * @param command - a catalog command or any generated `dsh plugin ...` string.
 * @param profile - profile to target; '' leaves the command untouched.
 * @returns the command targeting `profile`, or the original when nothing applies.
 */
export function retargetProfile(command: string, profile: string): string {
  if (command === '' || profile === '' || profile === CATALOG_DEFAULT_PROFILE) return command
  return command.replace(PROFILE_ARG_RE, (match, prefix: string, name: string) =>
    name === CATALOG_DEFAULT_PROFILE ? `${prefix}${profile}` : match)
}

/** Backend attempts are chronological; report the last executed command before a display fallback.
 * These prefixes are the task queue's recorded command shapes, never commands to execute here.
 */
export function executedCommandOf(command?: string, attempts?: string[]): string | undefined {
  if (attempts === undefined) return command
  return attempts.slice().reverse().find((attempt) =>
    /^dsh plugin --profile(?:=| )\S+ (?:add|remove|update) \S/.test(attempt)
    || /^npm install -g \S/.test(attempt))
}

/**
 * 安装通道决策（用户无感知）：目录探测到 npm 包名 → 用 npm 包名安装
 * （走 npm registry tarball，更快、与 GitHub 网络无关）；其次用「同仓库」的权威
 * release 包直链（仓库 HEAD 往往是 monorepo 根、装不上，release .tgz 才是完整产物）；
 * 都没有 → git 直装。
 * 返回值 target 即传给后端 /install 的安装目标（npm 包名 / release URL / owner/repo）。
 */
export function installTargetOf(p: HubPlugin): { target: string; via: 'npm' | 'release' | 'github' } {
  const pkg = (p.source?.npmPackage ?? '').trim()
  const repo = (p.source?.repo ?? '').trim()
  if (pkg && repo) return { target: pkg, via: 'npm' }
  // 目录下发的权威命令若是「同仓库」的固定 release 直链，改走该预构建包；
  // 跨仓 / 非法 release 目标不采信，退回 git 直装。
  const release = githubReleaseTarget(p.install?.githubCommand ?? '')
  if (release !== null && repo !== '' && release.repo.toLowerCase() === repo.toLowerCase()) {
    return { target: release.target, via: 'release' }
  }
  return { target: repo, via: 'github' }
}

/** 展示用安装命令（复制/弹窗）：目录下发的权威命令优先（CLI-only 插件如 dsh-tui
 *  需专属 profile（--profile dsh-tui），无法从 repo/npm 包名推断，必须用官方命令）；
 *  常规插件无目录命令时按通道回退生成：npm 显示包名，git 显示显式 HTTPS URL。
 *  目录命令里的默认档位占位符会改写成宿主真实档位 —— 见 {@link retargetProfile}；
 *  插件自带的专属档位原样保留。
 *  @param profile - profile to target; defaults to the one `/env` reported.
 */
export function installCommandOf(p: HubPlugin, withProfile = false, profile = getActiveProfile()): string {
  const { target, via } = installTargetOf(p)
  const catalog = via === 'npm' ? p.install?.command : p.install?.githubCommand
  if (catalog) return retargetProfile(catalog, profile)
  const prefix = `dsh plugin${withProfile && profile !== '' ? ` --profile ${profile}` : ''} add `
  if (via === 'npm' || via === 'release') return `${prefix}${target}`
  return `${prefix}git+https://github.com/${target}.git`
}

/** 卸载命令（复制/弹窗）：官方 CLI 要求 --profile，缺省会被直接拒绝
 *  （`error: required option '--profile <name>' not specified`），故带上宿主档位。
 *  @param profile - profile to target; defaults to the one `/env` reported.
 */
export function uninstallCommandOf(name: string, profile = getActiveProfile()): string {
  return profile === '' ? `dsh plugin remove ${name}` : `dsh plugin --profile ${profile} remove ${name}`
}

/** Normalize a task/install target to its owner/repo display identity. */
export function repoFromInstallTarget(value: string): string {
  const input = value.trim()
  // release 直链（预构建 .tgz）走同一条身份归一化：解析出所属仓库，已装态/更新信号才能
  // 认回目录条目；仅接受固定形态直链，跨仓/非法目标不接受，继续走下面的常规解析。
  const release = githubReleaseTarget(input)
  if (release !== null) return release.repo
  if (/^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(input)) return input
  const patterns = [
    /^github:([^/]+)\/([^/]+)$/i,
    /^(?:git\+)?https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:[?#].*)?$/i,
    /^(?:git\+)?ssh:\/\/(?:git@)?github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:[?#].*)?$/i,
    /^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?(?:[?#].*)?$/i,
  ]
  for (const pattern of patterns) {
    const match = pattern.exec(input)
    if (match !== null) return `${match[1]}/${match[2]}`
  }
  return value
}
