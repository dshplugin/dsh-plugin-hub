/**
 * 运行中 loader 的最小接口：卸载即时停用 / 安装即时热挂载用。
 * 对应官方 `ctx.loader`（cordis-plugin-loader 的 Loader 服务）的读取、新建与移除面。
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
    /** 在运行中 loader 里新建一个条目并启动它。等价于 profile bundle patch 的
     *  `- insert: - name: <pkg>` 行；Loader.write() 为空实现，不会写盘（重启后由
     *  profile 的 bundles 清单重新挂载，不会重复挂载）。返回新条目的 id。 */
    create(options: {
        id?: string;
        name: string;
    }): Promise<string>;
    /** 按 id 解析条目：热挂载后确认 fiber 真的起来了（import 失败时条目在、但 fiber 为空）。 */
    resolve(id: string): {
        id: string;
        options?: {
            name?: string;
            disabled?: boolean | null;
        };
        fiber?: unknown;
        subgroup?: unknown;
    };
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
 * 返回 `{ ok, live }`：
 *  - `{ ok: true, live: false }`：宿主从未加载过它（磁盘已干净），无需刷新/重启；
 *  - `{ ok: true, live: true }`：曾在 loader 中存活且已 live-disable —— 服务端即时卸载；
 *    带客户端 UI 的插件面板要页面刷新才摘除（由调用方按 `hadClientUi` 决定 needsReload）；
 *  - `{ ok: false, live: true }`：disable 失败 / 超时，需宿主重启兜底清理。
 * 宿主关键包（@deepseek-ai/* 与本插件自身）一律跳过。
 */
export declare function removeLoadedEntry(loader: LoaderHandle, name: string): Promise<{
    ok: boolean;
    live: boolean;
}>;
/**
 * 安装成功后把新插件热挂进运行中 loader（等价 profile bundle patch 的
 * `- insert: - name: <pkg>` 行），让插件无需重启宿主即可生效。
 * 做法：在 Loader 根组新建条目并启动 —— Loader.write() 为空实现，不写盘；
 * 重启后由 profile 的 bundles 清单重新挂载，不会重复。
 * `Entry._init` 的 import 失败只 `logger.error` 后 return（不抛），条目会建出来但
 * fiber 为空 / 条目可能被标记 disabled —— 必须用 `loader.resolve(id)` 校验真的起来了。
 * 返回 true = 已在运行中（本次新建或此前已加载）。
 */
export declare function mountLoadedEntry(loader: LoaderHandle, name: string): Promise<boolean>;
/**
 * 已安装包是否带客户端 UI（package.json 的 `dsh.client` 声明）：client-modules 据它把
 * 客户端 bundle 注入宿主页面。带 UI 的插件热挂载后需要页面重新加载才会渲染，
 * 网页端与桌面端一致 —— `__DSH_BOOT__` 注入清单由宿主服务端按请求现场拼装，
 * 壳不缓存，所以桌面端刷新页面同样能拿到新清单，无需重开 App。
 */
export declare function hasClientUi(profile: string, name: string): boolean;
/**
 * 判断某已安装包是否是真正的 dsh 插件（宿主会加载 / 值得提示「待重启」）：
 *  1) 包名已写进 profile 的 `dsh.profile.bundles`（宿主启动时按清单加载）；
 *  2) 或包内 package.json 声明了 dsh 配置（`dsh.bundle` / `dsh.profile` 等）或 dsh 相关 keywords。
 * 两者都满足不了（如 GitHub 官方示例仓库 octocat/Hello-World）说明它不是 dsh 插件，
 * 装上也不会被宿主加载——UI 据此不再提示「待重启」，避免误导用户反复重启一个不会生效的东西。
 */
export declare function isDshPlugin(profile: string, name: string): boolean;
