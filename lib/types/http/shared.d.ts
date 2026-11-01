/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 共享 HTTP 工具：路由/服务类型、请求校验助手，以及守卫每个 POST 变更的同源校验。
 * 由本目录其它路由模块引入。
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
/**
 * 跨平台宿主重启脚本（以 `node -e` 运行，独立于宿主进程）。
 * 不用 `/bin/sh -c`：Windows 无 /bin/sh，且 lsof/nohup 仅 POSIX 存在。
 * 由 `spawn(runtimeExecPath(), ['-e', SCRIPT, port], { detached, stdio:'ignore' })` 孵化，
 * 宿主进程被 kill 后仍能完成「停旧 → 等端口释放 → 拉起新 dsh web」。
 * 端口探测不到监听进程时不再假装重启（记一行日志后退出，见脚本内注释）。
 */
export declare const HOST_RESTART_SCRIPT: string;
/**
 * 宿主是否由桌面应用壳托管（`ELECTRON_RUN_AS_NODE=1`：壳用 Electron 二进制以 Node 模式跑宿主）。
 * 桌面端的宿主归应用壳管，插件重启不了它，也不该去 kill —— 详见 /restart 路由。
 */
export declare function isDesktopHost(): boolean;
export interface WebRoute {
    kind: 'exact';
    path: string;
    handler: (request: IncomingMessage, response: ServerResponse) => void | Promise<void>;
}
/** 本插件用到的宿主 web-server 服务子集。 */
export interface WebServerService {
    register(route: WebRoute): () => void;
}
export declare const PROFILE_RE: RegExp;
export declare const COMMAND_TIMEOUT_MS: number;
/** 目录/统计数据代理的本地缓存时长：1 小时内重复打开插件市场直接读盘，
 *  不重复走 curl 拉远程 —— 重启宿主后首次打开同样秒开（缓存跨重启存活）。 */
export declare const CATALOG_CACHE_TTL_MS: number;
export declare function sendJson(response: ServerResponse, status: number, value: unknown): void;
/** POST 变更只接受来自本地 web server 来源或桌面宿主页面。转出供测试（tests/routes.test.ts）使用 ——
 *  来源校验就是全部的 CSRF 防御。 */
export declare function isSameOrigin(request: IncomingMessage): boolean;
export declare function requireMethod(request: IncomingMessage, response: ServerResponse, method: 'GET' | 'POST'): boolean;
export declare function requireTrustedPost(request: IncomingMessage, response: ServerResponse): boolean;
export declare function readJsonBody(request: IncomingMessage): Promise<unknown>;
