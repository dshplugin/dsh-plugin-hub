/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 预构建 GitHub release 安装目标（目录权威命令 → 可安装直链）。
 * 部分插件（如 loopx）把构建产物发布成 GitHub release 的 .tgz，仓库 HEAD 反而是
 * monorepo 根、走 git 直装会因缺入口文件失败；目录下发的权威安装命令直接指向该
 * release 包。这里把「目录命令」解析成安全的 release 目标，供客户端选路与服务端
 * 校验共用（单一事实来源，避免两端口径漂移）。
 *
 * 只接受固定形态的 HTTPS `github.com/<owner>/<repo>/releases/download/<tag>/<asset>.tgz`：
 * 目录命令是展示数据、绝非 shell 代码，绝不执行命令文本；跨仓跳转、外部主机、凭据、
 * 移动的 latest 链接、query/fragment、多余 CLI 参数与 shell 片段一律拒绝。
 */

/** release 包目标及其所属仓库身份（owner/repo）；非法返回 null。 */
export interface GithubReleaseTarget {
  /** 规范化后的安装目标（HTTPS 直链） */
  target: string
  /** 该直链所属仓库（owner/repo）：供已装态读回、队列去重与展示身份复用 */
  repo: string
}

/** 目录权威命令：`dsh plugin --profile <p> add|update <target>`（与 profile.ts installTargetOf 同口径）。 */
const DSH_PLUGIN_CMD_RE = /^dsh[ \t]+plugin[ \t]+--profile(?:[ \t]+|=)[A-Za-z0-9_-]+[ \t]+(?:add|update)[ \t]+(.+)$/i

/** 固定形态的 release .tgz 直链：主机、路径段与扩展名全部锁死。 */
const RELEASE_URL_RE = /^https:\/\/github\.com\/([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)\/releases\/download\/([A-Za-z0-9._+-]+)\/([A-Za-z0-9._+-]+\.tgz)$/

/**
 * 解析一个 release 安装目标。
 * @param value - 目录命令（`dsh plugin --profile web add <url>`）或裸直链。
 * @returns 命中返回 `{ target, repo }`，否则 null。
 */
export function githubReleaseTarget(value: string): GithubReleaseTarget | null {
  const input = typeof value === 'string' ? value.trim() : ''
  if (input === '') return null
  const command = DSH_PLUGIN_CMD_RE.exec(input)
  const raw = command !== null ? command[1].trim() : input
  const match = RELEASE_URL_RE.exec(raw)
  if (match === null) return null
  // 拒绝 `.` / `..` 路径段，杜绝借路径穿越跳出 release 目录
  if (match.slice(1).some((part) => part === '.' || part === '..')) return null
  return { target: raw, repo: `${match[1]}/${match[2]}` }
}
