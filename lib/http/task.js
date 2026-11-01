/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 任务/杂项路由：任务轮询、宿主重启、loader 条目调试，以及客户端用于对账列表的已装插件清单。
 */
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { activeTask, cancelTask, dumpLoaderEntries, getTask, githubTarget, listPendingRestarts, validPackageName } from '../services/install/install.js';
import { readInstalledVersions, recordInstalledVersion, removeInstalledVersion } from '../services/profile/installed-versions.js';
import { isDshPlugin, isEntryLoaded } from '../services/loader.js';
import { runtimeExecPath } from '../services/runtime-exec.js';
import { profileDirectory, readInstalled } from './catalog.js';
import { hostEnv } from './diagnostics.js';
import { HOST_RESTART_SCRIPT, isDesktopHost, readJsonBody, requireMethod, requireTrustedPost, sendJson } from './shared.js';
export function registerTaskRoutes(webServer, profile, loader) {
    return [
        {
            kind: 'exact',
            path: '/dsh-plugin-hub/debug/loader-entries',
            handler: (request, response) => {
                if (!requireMethod(request, response, 'GET'))
                    return;
                sendJson(response, 200, { entries: dumpLoaderEntries(loader) });
            },
        },
        {
            kind: 'exact',
            path: '/dsh-plugin-hub/status',
            handler: (request, response) => {
                if (!requireMethod(request, response, 'GET'))
                    return;
                const url = new URL(request.url ?? '/', 'http://localhost');
                const id = Number(url.searchParams.get('task'));
                const task = Number.isInteger(id) ? getTask(id) : undefined;
                if (!task) {
                    sendJson(response, 404, { error: 'task not found' });
                    return;
                }
                sendJson(response, 200, { task });
            },
        },
        {
            kind: 'exact',
            path: '/dsh-plugin-hub/active',
            handler: (request, response) => {
                if (!requireMethod(request, response, 'GET'))
                    return;
                // 整个任务队列（running 在前、pending 在后）+ 待重启列表：客户端刷新后据此恢复
                // 进行中/排队任务与「装完没重启」的持久提醒
                sendJson(response, 200, { tasks: activeTask(), pendingRestarts: listPendingRestarts() });
            },
        },
        {
            kind: 'exact',
            path: '/dsh-plugin-hub/env',
            handler: (request, response) => {
                if (!requireMethod(request, response, 'GET'))
                    return;
                // 宿主机器环境快照：提交 bug 的 issue 正文会带上，便于作者复现
                sendJson(response, 200, hostEnv(profile));
            },
        },
        {
            kind: 'exact',
            path: '/dsh-plugin-hub/cancel',
            handler: async (request, response) => {
                if (!requireTrustedPost(request, response))
                    return;
                try {
                    const body = await readJsonBody(request);
                    const id = typeof body === 'object' && body !== null && typeof body.id === 'number'
                        ? body.id
                        : NaN;
                    const ok = Number.isInteger(id) && cancelTask(id);
                    sendJson(response, 200, { ok });
                }
                catch (error) {
                    sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) });
                }
            },
        },
        {
            kind: 'exact',
            path: '/dsh-plugin-hub/restart',
            handler: (request, response) => {
                if (!requireTrustedPost(request, response))
                    return;
                // 桌面端：宿主由应用壳托管，插件重启不了它。Windows 上 `taskkill /T` 会把发起
                // 重启的助手一起结束（助手是宿主的子进程），壳再把这次外部 kill 判成宿主崩溃
                // 弹「应用无法启动或已意外停止」；退一步说，脱离壳拉起的 `dsh web` 也服务不了
                // 桌面 UI（缺壳注入的 desktop:boot）。故不 kill、不拉新宿主，由客户端改提示
                // 用户从菜单/托盘退出后重新打开。
                if (isDesktopHost()) {
                    sendJson(response, 200, { ok: false, desktop: true });
                    return;
                }
                // 当前宿主监听端口来自请求 Host 头（localhost:7923），解析失败回退 7923
                const host = request.headers.host ?? '';
                const portMatch = host.match(/:(\d+)$/);
                const port = portMatch ? Number(portMatch[1]) : 7923;
                // detached 子进程完成「停旧进程 → 等端口释放 → 后台拉起 dsh web」，
                // 即使当前宿主（即本插件所在进程）被 kill，重启仍会继续执行。
                // 不用 /bin/sh：Windows 无此路径，且 lsof/nohup 等仅 POSIX 存在，
                // 故孵化 node(runtimeExecPath()) 跑跨平台脚本 —— Windows 用
                // netstat + taskkill + shell:true 解析 dsh.cmd，POSIX 用 lsof + SIGTERM。
                spawn(runtimeExecPath(), ['-e', HOST_RESTART_SCRIPT, String(port)], { detached: true, stdio: 'ignore' }).unref();
                sendJson(response, 200, { ok: true, port });
            },
        },
        {
            kind: 'exact',
            path: '/dsh-plugin-hub/installed-version',
            handler: async (request, response) => {
                if (!requireTrustedPost(request, response))
                    return;
                try {
                    const body = await readJsonBody(request);
                    const repo = typeof body === 'object' && body !== null && typeof body.repo === 'string'
                        ? body.repo
                        : '';
                    if (githubTarget(repo) === null) {
                        sendJson(response, 400, { error: 'invalid install target' });
                        return;
                    }
                    // version 为空 = 卸载清理记录；否则记录安装时的目录信号（最新版本 + 仓库更新时间），
                    // 供「有更新」比对：有版本比版本，无版本比更新时间
                    const version = body !== null && typeof body.version === 'string'
                        ? body.version
                        : null;
                    if (version === null) {
                        removeInstalledVersion(profile, repo);
                    }
                    else {
                        const updatedAt = body !== null && typeof body.updatedAt === 'string'
                            ? body.updatedAt
                            : '';
                        recordInstalledVersion(profile, repo, version, updatedAt);
                    }
                    sendJson(response, 200, { ok: true });
                }
                catch (error) {
                    sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) });
                }
            },
        },
        {
            kind: 'exact',
            path: '/dsh-plugin-hub/open-path',
            handler: async (request, response) => {
                if (!requireTrustedPost(request, response))
                    return;
                // 在系统文件管理器里定位并打开已安装插件目录（详情视图「在文件夹中显示」）。
                // 只接受已安装依赖的包名、服务端自行拼接路径——杜绝任意路径注入
                try {
                    const body = await readJsonBody(request);
                    const name = typeof body === 'object' && body !== null && typeof body.name === 'string'
                        ? body.name
                        : '';
                    if (!validPackageName(name) || readInstalled(profile)[name] === undefined) {
                        sendJson(response, 400, { error: 'plugin is not installed' });
                        return;
                    }
                    const dir = join(profileDirectory(profile), 'node_modules', name);
                    // macOS Finder 用 -R 定位选中；Windows explorer 用 /select,；Linux 打开目录（xdg-open）
                    const bin = process.platform === 'darwin' ? 'open'
                        : process.platform === 'win32' ? 'explorer'
                            : 'xdg-open';
                    const args = process.platform === 'darwin' ? ['-R', dir]
                        : process.platform === 'win32' ? ['/select,', dir]
                            : [dir];
                    spawn(bin, args, { detached: true, stdio: 'ignore' }).unref();
                    sendJson(response, 200, { ok: true });
                }
                catch (error) {
                    sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) });
                }
            },
        },
        {
            kind: 'exact',
            path: '/dsh-plugin-hub/installed',
            handler: (request, response) => {
                if (!requireMethod(request, response, 'GET'))
                    return;
                // installed：依赖表（包名 → spec）；versions：安装时记录的目录版本（repo → 版本）；
                // paths：每个依赖在系统上的安装目录（profile/node_modules/<包名>），详情视图展示用；
                // loaded：已加载进运行中 loader 的包名（官方 ctx.loader.entries()，未重启装的新插件不在其中）；
                // dshCapable：真正的 dsh 插件（包内声明 dsh 配置 / 在 profile bundles 清单）——
                //   非 dsh 插件（如 GitHub 官方示例仓库）装上也不会被宿主加载，客户端据此不再提示「待重启」。
                // 客户端合并这些判断「是否有更新」「运行状态」并展示安装路径/时间等运行时信息。
                const installed = readInstalled(profile);
                const paths = {};
                const loaded = [];
                const dshCapable = [];
                for (const name of Object.keys(installed)) {
                    paths[name] = join(profileDirectory(profile), 'node_modules', name);
                    if (isEntryLoaded(loader, name))
                        loaded.push(name);
                    if (isDshPlugin(profile, name))
                        dshCapable.push(name);
                }
                sendJson(response, 200, { profile, installed, versions: readInstalledVersions(profile), paths, loaded, dshCapable });
            },
        },
    ];
}
