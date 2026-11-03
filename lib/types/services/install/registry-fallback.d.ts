/** 去掉尾部斜杠，避免同一源因写法不同被当成两个候选。 */
export declare function normalizeRegistry(value: string): string;
/** 是否属于允许自动切换的公共源白名单。 */
export declare function isPublicRegistry(value: string): boolean;
/**
 * 依次尝试的源：显式配置 → 本机 npm 配置 → 官方源。
 * 只有公共源才追加后备（最多 3 个）；关闭换源或源不在白名单时只返回它自己。
 */
export declare function registryCandidates(configured: string, userRegistry: string, enabled: boolean): string[];
/** 本机 npm 实际生效的源（含 profile 目录的 .npmrc）；读不到返回空串。 */
export declare function userNpmRegistry(cwd: string): string;
/**
 * 传输层失败才值得换源：超时、连接重置、DNS、5xx。
 * 404 / 版本不存在 / 鉴权失败必须保持原样 —— 换源只会掩盖作者侧问题或装到滞后版本。
 * 本机证书链不被信任（TLS 校验失败）同样不换源：换哪个公共镜像都会以同样方式失败，
 * 白白多等两轮超时、把真正的根因淹进换源噪音里。
 */
export declare function isTransportFailure(text: string): boolean;
/** 日志里展示用的源主机名（不打印可能带凭据的完整 URL）。 */
export declare function registryHost(value: string): string;
