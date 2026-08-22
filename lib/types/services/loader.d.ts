/**
 * 运行中 loader 的读取与停用：卸载成功后对匹配条目做 live-disable，
 * 使卸载立即生效（刷新页面不再加载已卸载的 client bundle，也无需重启）。
 */
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
