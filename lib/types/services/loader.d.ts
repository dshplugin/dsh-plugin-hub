/**
 * 运行中 loader 的最小接口：卸载成功后即时移除条目用。
 * 对应官方 `ctx.loader`（cordis-plugin-loader 的 Loader 服务）的读取面与移除面。
 * 移除方式：对匹配条目 live-disable（`entry.update({ disabled: true })`），
 * 而不是 `loader.remove(id)` —— disable 走 Entry.update 的 disabled 分支，不触发
 * tree.write()（不会把运行态条目烘焙回 cordis.yml），也不依赖嵌套子树的 id 解析。
 */
export interface LoaderHandle {
    /** 遍历当前插件树的全部条目（含嵌套子树）。 */
    entries(): Iterable<{
        id: string;
        options: {
            id?: string;
            name?: string;
            disabled?: boolean | null;
        };
        /** live-disable 一个条目（官方 Entry.update，force=true 覆盖初始化竞态）。 */
        update(options: {
            disabled: boolean | null;
        }, create?: boolean, force?: boolean): Promise<void>;
    }>;
    /** 停止并移除一个条目（官方 Loader API：resolve → EntryGroup.remove → tree.write）。 */
    remove(id: string): Promise<void>;
}
/** 运行中 loader 的全部条目（id + options.name），诊断用。 */
export declare function dumpLoaderEntries(loader: LoaderHandle | undefined): Array<{
    id: string;
    name?: string;
}>;
/**
 * 判断某 npm 包名是否已加载进运行中 loader（宽匹配：条目名存在别名变体）。
 * 官方 `ctx.loader.entries()` 遍历整棵树（reference.md §1.3），条目名 == 插件作者声明的名字。
 * 安装完成但未重启时条目不在 loader → 返回 false，UI 据此标「待重启/未加载」。
 */
export declare function isEntryLoaded(loader: LoaderHandle | undefined, name: string): boolean;
/**
 * 卸载成功后从运行中 loader 停用指定包的条目。做法：按 name 扫描
 * `loader.entries()`（含嵌套子树），对每个匹配条目
 * `entry.update({ disabled: true })` 做 live-disable —— fiber 被 dispose，
 * client-modules 对账后不再把它写进 `__DSH_BOOT__`，页面刷新即恢复。
 * 返回 true = 无需重启（仅当宿主从未加载过它：磁盘已干净）；
 * 其余一律 false = 需要重启：要么 disable 失败需「待重启清理」兜底，
 * 要么 disable 成功但该插件曾在 loader 中存活——带 UI 的插件（侧边栏面板等
 * 宿主启动时渲染的槽位）disable 后不会主动摘除，不重启面板一直残留。
 * 宿主关键包（@deepseek-ai/* 与本插件自身）一律跳过。
 */
export declare function removeLoadedEntry(loader: LoaderHandle, name: string): Promise<boolean>;
/**
 * 判断某已安装包是否是真正的 dsh 插件（宿主会加载 / 值得提示「待重启」）：
 *  1) 包名已写进 profile 的 `dsh.profile.bundles`（宿主启动时按清单加载）；
 *  2) 或包内 package.json 声明了 dsh 配置（`dsh.bundle` / `dsh.profile` 等）或 dsh 相关 keywords。
 * 两者都满足不了（如 GitHub 官方示例仓库 octocat/Hello-World）说明它不是 dsh 插件，
 * 装上也不会被宿主加载——UI 据此不再提示「待重启」，避免误导用户反复重启一个不会生效的东西。
 */
export declare function isDshPlugin(profile: string, name: string): boolean;
