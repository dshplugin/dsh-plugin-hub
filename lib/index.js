/**
 * dsh-plugin host entry: mounts the Plugin Hub HTTP routes once the host
 * web server service is available. The browser bundle (src/client) talks to
 * these same-origin routes to perform real installs from inside the app.
 */
import { readProfileArg } from './install.js';
import { mountPluginHubRoutes } from './routes.js';
export const name = 'dsh-plugin';
/**
 * Mount the Plugin Hub routes after the web server service becomes available.
 * @param ctx - cordis host context.
 * @param config - optional profile override.
 */
export function apply(ctx, config = {}) {
    const profile = config.profile ?? readProfileArg('web');
    ctx.inject(['webServer'], (host) => {
        host.effect(() => mountPluginHubRoutes(host.webServer, profile), 'dsh-plugin: http routes');
    });
}
