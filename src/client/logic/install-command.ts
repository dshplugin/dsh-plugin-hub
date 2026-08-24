/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Install target/command helpers: decide the install channel (npm package
 * vs explicit-HTTPS GitHub), build the display command and normalize a raw
 * install spec back to its owner/repo identity.
 */
import type { HubPlugin } from '../types.ts'

/**
 * 安装通道决策（用户无感知）：目录探测到 npm 包名 → 用 npm 包名安装
 * （走 npm registry tarball，更快、与 GitHub 网络无关）；无 npm 包名 → git 直装。
 * 返回值 target 即传给后端 /install 的安装目标（npm 包名 或 owner/repo）。
 */
export function installTargetOf(p: HubPlugin): { target: string; via: 'npm' | 'github' } {
  const pkg = (p.source?.npmPackage ?? '').trim()
  const repo = (p.source?.repo ?? '').trim()
  if (pkg && repo) return { target: pkg, via: 'npm' }
  return { target: repo, via: 'github' }
}

/** 展示用安装命令（复制/弹窗）：npm 通道显示包名，git 通道显示显式 HTTPS URL。 */
export function installCommandOf(p: HubPlugin, withProfile = false): string {
  const { target, via } = installTargetOf(p)
  return via === 'npm'
    ? `dsh plugin${withProfile ? ' --profile web' : ''} add ${target}`
    : `dsh plugin${withProfile ? ' --profile web' : ''} add git+https://github.com/${target}.git`
}

/** Normalize a task/install target to its owner/repo display identity. */
export function repoFromInstallTarget(value: string): string {
  const input = value.trim()
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
