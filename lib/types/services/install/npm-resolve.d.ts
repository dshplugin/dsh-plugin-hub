/**
 * 反查 repo（`owner/repo`）对应的官方 npm 包名；未命中、网络异常或超时返回 null。
 * 返回 null 不代表仓库一定没有 npm 包，只代表本次未能确认 —— 调用方应保留
 * 原有错误路径，反查只是额外的一次尝试。
 * registry 参数：npm 镜像源地址，空串 = 官方源；与安装通道吃同一 registry，
 * 保证「配置了镜像」时反查和安装走同一个源（镜像节点同步完整时结果一致）。
 * 慢网络下失败不阻塞安装。
 */
export declare function resolveNpmPackage(repo: string, registry?: string): Promise<string | null>;
