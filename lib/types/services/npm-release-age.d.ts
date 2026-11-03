export interface NpmRelease {
    version: string;
    publishedAt: string;
}
/** 最新版 + 可锁定的安装版本：安装锁定后者，pnpm 才不会回退到旧版本。 */
export interface NpmReleaseWithInstallable extends NpmRelease {
    /** 已过发布冷却期的最高稳定版；时间表缺失或没有满足项时为 null（调用方退回不锁定版本）。 */
    installable: NpmRelease | null;
}
/** pnpm profile 默认 minimumReleaseAge=1440 分钟；+30 分钟缓冲与客户端 release-age 判定同一套规则。 */
export declare const MIN_RELEASE_AGE_MS: number;
/** 请求体包名数量上限：只为已安装插件按需查询，几十个足矣，封顶防滥用。 */
export declare const MAX_RELEASE_AGE_PACKAGES = 50;
/** 单包查询超时（ms）：慢网络下失败即返回 null，不拖住整个响应。 */
export declare const RELEASE_AGE_TIMEOUT_MS = 8000;
export declare const DEFAULT_NPM_REGISTRY = "https://registry.npmjs.org";
/** 从完整 packument 取 dist-tags.latest 对应版本及其发布时间；缺任一字段返回 null。 */
export declare function latestReleaseOf(packument: unknown): NpmRelease | null;
/**
 * 已过发布冷却期的最高稳定版本：安装锁定它，pnpm 不会回退到旧版本。
 * 只看纯 x.y.z（预发布版不参与，避免把用户带到不兼容预览版）；时间表缺失或无满足项返回 null。
 */
export declare function installableReleaseOf(packument: unknown, now?: number): NpmRelease | null;
/** 请求体 → 去重后的合法包名列表；非数组 / 超量 / 含非法包名一律 null（拒绝非法输入）。 */
export declare function parseReleaseAgeRequest(body: unknown): string[] | null;
/** 查询一个包的最新版本、发布时间与可锁定的安装版本（成功结果按源缓存 10 分钟）；registry 为空回退官方源，失败返回 null。 */
export declare function lookupReleaseAge(packageName: string, registry: string, proxy: string, timeoutMs?: number): Promise<NpmReleaseWithInstallable | null>;
