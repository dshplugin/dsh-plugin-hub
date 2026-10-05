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
 *  常规插件无目录命令时按通道回退生成：npm 显示包名，git 显示显式 HTTPS URL。 */
export function installCommandOf(p: HubPlugin, withProfile = false): string {
  const { target, via } = installTargetOf(p)
  if (via === 'npm') {
    const cmd = p.install?.command
    if (cmd) return cmd
  } else {
    // release 与 git 通道共用目录下发的 githubCommand（git+ 显式 HTTPS 或 release 直链）
    const cmd = p.install?.githubCommand
    if (cmd) return cmd
  }
  const prefix = `dsh plugin${withProfile ? ' --profile web' : ''} add `
  if (via === 'npm' || via === 'release') return `${prefix}${target}`
  return `${prefix}git+https://github.com/${target}.git`
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
