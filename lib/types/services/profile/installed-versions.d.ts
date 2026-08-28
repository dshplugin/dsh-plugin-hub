export interface InstalledVersionRecord {
    /** 安装时的目录最新 release 版本（无 release 的仓库为空串） */
    version: string;
    /** 安装时的仓库最近更新时间（ISO，GitHub pushed_at）；无 release 仓库的更新依据 */
    updatedAt: string;
    installedAt: string;
    /** npm 优先通道反查命中的官方 npm 包名（repo → 包名映射）：目录数据可能未下发
     *  npmPackage（组织 scope 与 GitHub 用户名不一致），客户端据此把依赖 key 匹配回仓库 */
    npmPackage?: string;
}
export type InstalledVersionTable = Record<string, InstalledVersionRecord>;
export declare function versionsFilePath(profile: string): string;
export declare function readInstalledVersions(profile: string): InstalledVersionTable;
/** Record the catalog signals (version + repo updated time) present at install time for one repo. */
export declare function recordInstalledVersion(profile: string, repo: string, version: string, updatedAt: string): void;
/**
 * Record the npm package name resolved for a repo (npm-first install channel).
 * Called at `/install` time so the mapping exists even before the task finishes;
 * harmless when the repo is not (yet) installed — the client only treats a repo
 * as installed when its dependency key actually exists.
 */
export declare function recordResolvedNpmPackage(profile: string, repo: string, npmPackage: string): void;
/** Forget the recorded version for one repo (called on uninstall). */
export declare function removeInstalledVersion(profile: string, repo: string): void;
