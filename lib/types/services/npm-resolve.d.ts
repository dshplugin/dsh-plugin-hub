/**
 * 反查 repo（`owner/repo`）对应的官方 npm 包名；未命中、网络异常或超时返回 null。
 * 返回 null 不代表仓库一定没有 npm 包，只代表本次未能确认 —— 调用方应保留
 * 原有错误路径，反查只是额外的一次尝试。
 */
export declare function resolveNpmPackage(repo: string): Promise<string | null>;
