/** 缺 git 的失败标记：前端按 `[git-missing]` 归类并给「安装 git」指引（乱码免疫）。 */
export declare const GIT_MISSING_DETAIL = "[git-missing] the git CLI was not found on this machine (install git and add it to the PATH, then retry)";
/** 命令存在性探测：which/where 找 PATH 里的命令。
 *  探测自身异常（which/where 不可用等）返回 true，不拦截安装，交给装后校验处理。 */
export declare function commandOnPath(cmd: string, env?: NodeJS.ProcessEnv): boolean;
/** 该安装目标是否需要 git：github: / git+ / git@ 与 owner/repo 简写都要先 clone；
 *  release 直链（https://…releases/download/…tgz）由 pnpm 直接下载，不需要 git。
 *  owner/repo 段首必须是字母数字：`./x`、`../x` 这类相对路径是本地目录，不能误判。 */
export declare function needsGit(target: string): boolean;
/** git 源安装前置检查：需要 git 但本机 PATH 里没有 → 返回 [git-missing] 文本；否则 null。 */
export declare function gitMissingDetail(target: string, env?: NodeJS.ProcessEnv): string | null;
