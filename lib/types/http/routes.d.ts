import type { IncomingMessage, ServerResponse } from 'node:http';
import { readProfileArg, type LoaderHandle } from '../services/install.ts';
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
