/**
 * 反查 repo（`owner/repo`）对应的官方 npm 包名；未命中、网络异常或超时返回 null。
 * 返回 null 不代表仓库一定没有 npm 包，只代表本次未能确认 —— 调用方应保留
 * 原有错误路径，反查只是额外的一次尝试。只有「已确认」的结果（包名，或 200
 * 响应下确认无匹配）会进缓存；网络异常/超时/解析失败不缓存，同一会话内下次
 * 安装仍会重试反查，避免一次瞬时故障把整个会话锁死在 git 通道。
 * registry 参数：npm 镜像源地址，空串 = 官方源；与安装通道吃同一 registry，
 * 保证「配置了镜像」时反查和安装走同一个源（镜像节点同步完整时结果一致）。
 * 慢网络下失败不阻塞安装。
 */
export declare function resolveNpmPackage(repo: string, registry?: string): Promise<string | null>;
