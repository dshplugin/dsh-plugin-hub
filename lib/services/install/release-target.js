/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 预构建 release 直链的仓库身份解析。部分插件（如 loopx）当初以 GitHub release 的 .tgz
 * 安装过，仓库 HEAD 反而是 monorepo 根、走 git 直装会因缺入口文件失败；老安装记录里留的
 * 就是这种 release 直链。这里把「历史安装目标」还原成所属仓库身份，供已装态读回、队列
 * 去重与展示复用（单一事实来源，避免两端规则漂移）。
 *
 * 只接受固定形态的 HTTPS `github.com/<owner>/<repo>/releases/download/<tag>/<asset>.tgz`：
 * 输入是记录/展示数据、绝非 shell 代码，绝不执行其文本；跨仓跳转、外部主机、凭据、
 * 移动的 latest 链接、query/fragment、多余 CLI 参数与 shell 片段一律拒绝。
 */
/** 完整命令前缀：`dsh plugin --profile <p> add|update <target>`（与 profile.ts installTargetOf 同一套规则）。 */
const DSH_PLUGIN_CMD_RE = /^dsh[ \t]+plugin[ \t]+--profile(?:[ \t]+|=)[A-Za-z0-9_-]+[ \t]+(?:add|update)[ \t]+(.+)$/i;
/** 固定形态的 release .tgz 直链：主机、路径段与扩展名全部锁死。 */
const RELEASE_URL_RE = /^https:\/\/github\.com\/([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)\/releases\/download\/([A-Za-z0-9._+-]+)\/([A-Za-z0-9._+-]+\.tgz)$/;
/**
 * 解析一个历史安装目标里的 release 直链。
 * @param value - 完整命令（`dsh plugin --profile web add <url>`）或裸直链。
 * @returns 命中返回 `{ target, repo }`，否则 null。
 */
export function githubReleaseTarget(value) {
    const input = typeof value === 'string' ? value.trim() : '';
    if (input === '')
        return null;
    const command = DSH_PLUGIN_CMD_RE.exec(input);
    const raw = command !== null ? command[1].trim() : input;
    const match = RELEASE_URL_RE.exec(raw);
    if (match === null)
        return null;
    // 拒绝 `.` / `..` 路径段，杜绝借路径穿越跳出 release 目录
    if (match.slice(1).some((part) => part === '.' || part === '..'))
        return null;
    return { target: raw, repo: `${match[1]}/${match[2]}` };
}
