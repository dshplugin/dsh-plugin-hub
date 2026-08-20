import { type WebServerService } from './routes.ts';
export declare const name = "dsh-plugin";
export interface Config {
    /** DSH profile that owns plugin mutations. Defaults to the booted profile. */
    profile?: string;
}
/** The subset of the cordis host context this plugin touches. */
interface HostContext {
    webServer: WebServerService;
    inject(services: string[], callback: (host: HostContext) => void): void;
    effect(callback: () => void, label?: string): void;
}
/**
 * Mount the Plugin Hub routes after the web server service becomes available.
 * @param ctx - cordis host context.
 * @param config - optional profile override.
 */
export declare function apply(ctx: HostContext, config?: Config): void;
export {};
