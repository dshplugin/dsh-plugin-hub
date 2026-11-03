/**
 * 安装前置探测：命令是否存在、安装目标是否需要 git。
 *
 * 命令缺失时各平台报错形态不同（Windows 只回 GBK 乱码、POSIX 才抛 spawn ENOENT），
 * 统一在 spawn 前用 which/where 探测，缺失则打 ASCII 标记，前端归类不受编码影响。
 */
import { spawnSync } from 'node:child_process';
/** 缺 git 的失败标记：前端按 `[git-missing]` 归类并给「安装 git」指引（乱码免疫）。 */
export const GIT_MISSING_DETAIL = '[git-missing] the git CLI was not found on this machine (install git and add it to the PATH, then retry)';
/** 命令存在性探测：which/where 找 PATH 里的命令。
 *  探测自身异常（which/where 不可用等）返回 true，不拦截安装，交给装后校验处理。 */
export function commandOnPath(cmd, env) {
    try {
        const probe = process.platform === 'win32' ? 'where' : 'which';
        const res = spawnSync(probe, [cmd], { env, encoding: 'utf8', timeout: 3000, stdio: ['ignore', 'pipe', 'pipe'] });
        return res.status === 0 && (res.stdout ?? '').trim().length > 0;
    }
    catch {
        return true;
    }
}
/** 该安装目标是否需要 git：github: / git+ / git@ 与 owner/repo 简写都要先 clone；
 *  release 直链（https://…releases/download/…tgz）由 pnpm 直接下载，不需要 git。
 *  owner/repo 段首必须是字母数字：`./x`、`../x` 这类相对路径是本地目录，不能误判。 */
export function needsGit(target) {
    const v = target.trim();
    if (/^(github:|git\+|git@)/i.test(v))
        return true;
    return /^[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9._-]+$/.test(v);
}
/** git 源安装前置检查：需要 git 但本机 PATH 里没有 → 返回 [git-missing] 文本；否则 null。 */
export function gitMissingDetail(target, env) {
    if (!needsGit(target))
        return null;
    return commandOnPath('git', env) ? null : GIT_MISSING_DETAIL;
}
