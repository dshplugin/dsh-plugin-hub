export interface InstalledVersionRecord {
    /** 安装时的目录最新 release 版本（无 release 的仓库为空串） */
    version: string;
    /** 安装时的仓库最近更新时间（ISO，GitHub pushed_at）；无 release 仓库的更新依据 */
    updatedAt: string;
    installedAt: string;
}
export type InstalledVersionTable = Record<string, InstalledVersionRecord>;
export declare function versionsFilePath(profile: string): string;
export declare function readInstalledVersions(profile: string): InstalledVersionTable;
/** Record the catalog signals (version + repo updated time) present at install time for one repo. */
export declare function recordInstalledVersion(profile: string, repo: string, version: string, updatedAt: string): void;
/** Forget the recorded version for one repo (called on uninstall). */
export declare function removeInstalledVersion(profile: string, repo: string): void;
