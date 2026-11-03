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
/** release 包目标及其所属仓库身份（owner/repo）；非法返回 null。 */
export interface GithubReleaseTarget {
    /** 规范化后的安装目标（HTTPS 直链） */
    target: string;
    /** 该直链所属仓库（owner/repo）：供已装态读回、队列去重与展示身份复用 */
    repo: string;
}
/**
 * 解析一个历史安装目标里的 release 直链。
 * @param value - 完整命令（`dsh plugin --profile web add <url>`）或裸直链。
 * @returns 命中返回 `{ target, repo }`，否则 null。
 */
export declare function githubReleaseTarget(value: string): GithubReleaseTarget | null;
