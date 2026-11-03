/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 安装目标/命令工具：为目录条目取 npm 包名、构造展示命令，并把原始安装 spec 归一化回 owner/repo 身份。
 */
import type { HubPlugin } from '../types.ts'
import { githubReleaseTarget } from '../../server/services/install/release-target.ts'

/** 后端 attempts 按时间先后排列：取最后一次实际执行的命令，取不到再回退到展示用命令。
 * 这里匹配的是任务队列记录的指令形态，不是要在此执行的命令。
 */
export function executedCommandOf(command?: string, attempts?: string[]): string | undefined {
  if (attempts === undefined) return command
  return attempts.slice().reverse().find((attempt) =>
    /^dsh plugin --profile(?:=| )\S+ (?:add|remove|update) \S/.test(attempt)
    || /^npm install -g \S/.test(attempt))
}

/**
 * 目录条目的安装目标（用户无感知）：目录条目必带 npm 包名，直接用该包名安装
 * （走 npm registry tarball）。
 * 返回值即传给后端 /install 的安装目标（npm 包名）。
 */
export function installTargetOf(p: HubPlugin): string {
  return (p.source?.npmPackage ?? '').trim()
}

/** 展示用安装命令（复制/弹窗）：目录下发的权威命令优先（CLI-only 插件如 dsh-tui
 *  需专属 profile（--profile dsh-tui），无法从 npm 包名推断，必须用官方命令）；
 *  常规插件无目录命令时用 npm 包名回退生成。
 *  version 为已过供应链门禁的版本：带上它，手抄命令与一键安装的执行结果一致。 */
export function installCommandOf(p: HubPlugin, withProfile = false, version?: string): string {
  const cmd = p.install?.command
  if (cmd) return cmd
  const prefix = `dsh plugin${withProfile ? ' --profile web' : ''} add `
  const target = installTargetOf(p)
  return `${prefix}${version === undefined || version === '' ? target : `${target}@${version}`}`
}

/** 把任务/安装目标归一化为 owner/repo 展示身份。 */
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
