import type { IncomingMessage, ServerResponse } from 'node:http';
import { readProfileArg, type LoaderHandle } from '../services/install/install.ts';
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
/** The subset of the host web-server service this plugin touches. */
export interface WebServerService {
    register(route: WebRoute): () => void;
}
/** Read non-official dependencies installed into one profile. */
export declare function readInstalled(profile: string): Record<string, string>;
/** POST mutations are only accepted from the local web server origin or the desktop host page.
 *  Exported for tests (tests/routes.test.ts) — the origin check is the whole CSRF defence. */
export declare function isSameOrigin(request: IncomingMessage): boolean;
/**
 * Register the Plugin Hub API on the host web server and return a disposer.
 * @param webServer - DSH web server service.
 * @param profile - profile that owns plugin mutations.
 * @param loader - running loader (optional): lets uninstall remove the entry
 *   immediately so the page survives a refresh without a host restart.
 */
export declare function mountPluginHubRoutes(webServer: WebServerService, profile: string, loader?: LoaderHandle): () => void;
/** Profile resolution shared with the client route docs. */
export { readProfileArg };
