/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 安装/卸载路由：校验目标后 spawn 官方 dsh CLI（见 services/install/install.ts），
 * 并回传捕获的结果。自定义安装只接受 npm 包名。
 */
import { githubRepoOf, globalNpmPackagesOf, hasQueuedTarget, installTargetOf, startPluginMutation, validPackageName } from '../services/install/install.js';
import { recordResolvedNpmPackage } from '../services/profile/installed-versions.js';
import { isDshNpmPackageForRepo } from '../services/install/npm-resolve.js';
import { probeUrl, systemProxy } from '../services/probe.js';
import { loadSettings } from '../services/settings.js';
import { registryCandidates, registryHost, userNpmRegistry } from '../services/install/registry-fallback.js';
import { lookupReleaseAge } from '../services/npm-release-age.js';
import { profileDirectory } from '../services/profile/profile.js';
import { readInstalled } from './catalog.js';
import { COMMAND_TIMEOUT_MS, readJsonBody, requireTrustedPost, sendJson } from './shared.js';
/** 安装/卸载 CLI 的子进程环境：透传宿主环境并注入 HTTP(S) 代理，
 *  代理来源与诊断一致（设置代理 → 系统代理 → 宿主 env）；registry 由任务队列按候选源逐次注入。 */
function mutationEnv(settings) {
    const env = { ...process.env, CI: 'true' };
    const proxy = settings.proxy !== '' ? settings.proxy : (systemProxy() ?? '');
    if (proxy !== '') {
        env.HTTP_PROXY = proxy;
        env.HTTPS_PROXY = proxy;
        env.http_proxy = proxy;
        env.https_proxy = proxy;
    }
    return env;
}
export function registerInstallRoutes(webServer, profile, loader) {
    return [
        {
            kind: 'exact',
            path: '/dsh-plugin-hub/install',
            handler: async (request, response) => {
                if (!requireTrustedPost(request, response))
                    return;
                // 任务自动入队：即使已有插件操作在跑也接受请求（FIFO 串行执行），不做 409 拒绝
                try {
                    const body = await readJsonBody(request);
                    // mode: 'update' = 已安装目标的覆盖更新（放行 add，pnpm 对已存在依赖原位覆盖重装）。
                    let mode = body !== null && typeof body === 'object' && body.mode === 'update'
                        ? 'update'
                        : 'install';
                    // installTargetOf 把完整 DSH 命令剥成裸目标；自定义目标只接受 npm 包名，语法判定交给 validPackageName。
                    const rawRepo = typeof body === 'object' && body !== null && typeof body.repo === 'string'
                        ? installTargetOf(body.repo)
                        : '';
                    // 展示用仓库名（owner/repo）：npm 安装时 body.repo 是包名，display 供待重启行 / 任务恢复展示仓库名。
                    const displayRepo = typeof body === 'object' && body !== null && typeof body.display === 'string'
                        ? body.display.trim()
                        : rawRepo;
                    // 请求来源：目录插件安装（catalog）走目录白名单；命令行安装（custom）受安全开关控制
                    const source = typeof body === 'object' && body !== null && typeof body.source === 'string'
                        ? body.source
                        : '';
                    // 自定义安装入口渠道（仅 NPM 包）：日志/报错据此溯源发起入口。
                    const installChannel = (() => {
                        const raw = body !== null && typeof body === 'object' ? body.installChannel : undefined;
                        return raw === 'npm' ? 'npm' : undefined;
                    })();
                    const settings = loadSettings(profile);
                    // 界面语言（客户端随请求携带）：错误消息按用户当前语言提示（中文界面给中文，英文界面给英文）
                    const lang = typeof body === 'object' && body !== null && body.lang === 'en'
                        ? 'en'
                        : 'zh';
                    // 代理口径与诊断/安装通道一致：设置里的代理 → 系统代理 → 环境变量 → 直连。
                    const effectiveProxy = settings.proxy !== ''
                        ? settings.proxy
                        : (systemProxy() ?? process.env.HTTPS_PROXY ?? process.env.https_proxy ?? '');
                    // 安装用的 npm 源：设置里显式选择优先；未配置时读本机 npm 配置（与诊断同口径）。
                    // 只有公共源允许失败后换源；自定义/内网源保持单一候选，避免私有包名泄露给公共源。
                    const registries = registryCandidates(settings.npmRegistry, settings.npmRegistry === '' ? userNpmRegistry(profileDirectory(profile)) : '', settings.registryFallback);
                    // 全局 npm 安装（`npm install -g <pkgs>`）：不进任何 profile、无需宿主重启。
                    // 包列表优先取 body.globalNpm，兜底从 rawRepo 解析，保证直接调 API 传完整命令也能识别。
                    const bodyGlobalNpm = Array.isArray(body.globalNpm)
                        ? body.globalNpm.filter((x) => typeof x === 'string' && x !== '')
                        : [];
                    const globalNpm = bodyGlobalNpm.length > 0 ? bodyGlobalNpm : (globalNpmPackagesOf(rawRepo) ?? []);
                    if (globalNpm.length > 0) {
                        // 包名逐个按 npm 包名语法校验 + 拒绝以 - 开头的 token（npm 会把 --xxx 当参数而非包名），数量封顶防滥用
                        if (globalNpm.length > 20 || globalNpm.some((p) => !validPackageName(p) || p.startsWith('-'))) {
                            sendJson(response, 400, { error: 'unsupported install target' });
                            return;
                        }
                        // 通道校验与安装通道同构：全局安装本质是 npm 操作，吃「启用 NPM 安装」开关
                        if (source !== 'catalog' && !settings.enableNpmInstall) {
                            sendJson(response, 403, { error: 'npm installs are disabled by the security settings' });
                            return;
                        }
                        // 队列级去重：同一包列表已在排队/执行中时拒绝
                        const identity = globalNpm.join(' ');
                        if (hasQueuedTarget(identity)) {
                            sendJson(response, 409, { error: `already queued: ${identity}` });
                            return;
                        }
                        const task = startPluginMutation({
                            action: 'add',
                            profile,
                            target: identity,
                            displayTarget: identity,
                            globalNpm,
                            timeoutMs: COMMAND_TIMEOUT_MS,
                            env: mutationEnv(settings),
                            // 候选源（首选在前）：任务内遇到传输层失败时按顺序换源重试
                            registries,
                            // 全局 npm 安装由 NPM 包卡片/官方命令发起：日志体现入口渠道
                            installChannel: installChannel ?? 'npm',
                        });
                        sendJson(response, 200, { ok: true, task: task.id });
                        return;
                    }
                    // 自定义安装目标只接受 npm 包名（@scope/name 或 name）。
                    if (!validPackageName(rawRepo)) {
                        sendJson(response, 400, { error: 'unsupported install target: expected an npm package name' });
                        return;
                    }
                    const target = rawRepo;
                    // 钉住精确版本（Hub 自我更新）：最新版可能仍在 pnpm 发布冷却期内，
                    // 客户端提示的是「已过冷却期」的版本，服务端必须按该版本安装而不是 @latest。
                    const pinVersion = typeof body.version === 'string'
                        ? body.version.trim()
                        : '';
                    if (pinVersion !== '' && !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?$/.test(pinVersion)) {
                        sendJson(response, 400, { error: 'invalid version' });
                        return;
                    }
                    // 已尝试的安装方式（供失败提 Issue 预填）：保持为空
                    const attempts = [];
                    // 目录插件安装：目录数据可能滞后于打包拆分，确认目录下发的 npm 目标确为该仓库的 DSH 包，
                    // 命中则记录 repo → 包名映射，客户端据此把依赖 key 匹配回仓库、列表立即显示「已安装」。
                    const catalogRepo = source === 'catalog' ? githubRepoOf(displayRepo) : null;
                    if (catalogRepo !== null) {
                        const catalogTargetIsDsh = await isDshNpmPackageForRepo(rawRepo, catalogRepo, settings.npmRegistry, effectiveProxy);
                        if (catalogTargetIsDsh)
                            recordResolvedNpmPackage(profile, catalogRepo, rawRepo);
                    }
                    // 命令行安装（目录外）受「启用 NPM 安装」开关控制；目录插件安装走目录白名单，不受开关影响。
                    if (source !== 'catalog' && !settings.enableNpmInstall) {
                        sendJson(response, 403, { error: 'npm installs are disabled by the security settings' });
                        return;
                    }
                    // 命中已安装目标时按「更新」执行（pnpm add 对已存在依赖即原位覆盖重装）：
                    // 客户端已装列表可能与服务端不同步，覆盖重装比报错更友好且终态一致。
                    const installed = readInstalled(profile);
                    const already = installed[target] !== undefined ? target : null;
                    if (already !== null)
                        mode = 'update';
                    // 队列级去重：同一目标已在排队/执行中时拒绝，避免客户端防重竞态导致重复入队
                    if (hasQueuedTarget(target)) {
                        sendJson(response, 409, { error: `already queued: ${target}` });
                        return;
                    }
                    // 安装前网络探测：探 registry 根而非具体包（404 是「包不存在」而非网络不通）；仅新安装执行，更新跳过。
                    // 首选源不通时按候选顺序继续探下一个，能通的那个提到首位供实际安装使用。
                    // 全部不通则 400 拦下并打 [network] 标记，客户端据此提示网络问题，而非插件问题。
                    let ordered = registries;
                    if (already === null) {
                        const tried = [];
                        let chosen = null;
                        for (const candidate of registries) {
                            tried.push(candidate);
                            const net = await probeUrl(`${candidate}/`, effectiveProxy, 6000);
                            if (net.ok) {
                                chosen = candidate;
                                break;
                            }
                        }
                        if (chosen === null) {
                            // 错误消息按界面语言输出，让用户看清是网络问题而非插件问题
                            const hosts = tried.map(registryHost).join(' → ');
                            const error = lang === 'zh'
                                ? `[network] 安装已中止：安装前无法连接到 npm 源（${hosts}）—— 您的网络似乎不通或被拦截（断网 / DNS 解析失败 / 防火墙 / 代理配置问题）。这不是插件本身的问题，请检查网络连接或代理设置，运行「系统诊断」检测各通道连通性后重试。`
                                : `[network] install aborted: cannot reach the npm registry (${hosts}) before install — your network connection appears to be down or blocked (DNS / proxy / firewall). This is not a problem with the plugin itself. Check your connection or proxy settings, run the connectivity diagnostic, then retry.`;
                            sendJson(response, 400, { error, attempts });
                            return;
                        }
                        ordered = [chosen, ...registries.filter((r) => r !== chosen)];
                    }
                    // 新安装钉住「已过发布冷却期」的最高稳定版：pnpm 对发布还不满 24 小时的版本会静默回退，
                    // 钉住后装到的就是预期版本。更新已有目标时客户端已按冷却期筛选，继续走 @latest。
                    let installSpec = pinVersion !== '' ? `${target}@${pinVersion}` : undefined;
                    if (installSpec === undefined && already === null) {
                        // 解析源与安装首选源一致，钉住的版本一定存在于真正会用的那个源；解析失败则不钉，不阻断安装。
                        // 超时 5s：网络刚探通，卡住时也不能把安装请求拖到默认的 8s
                        const release = await lookupReleaseAge(target, ordered[0] ?? '', effectiveProxy, 5000);
                        if (release !== null && release.installable !== null)
                            installSpec = `${target}@${release.installable.version}`;
                    }
                    // 入队前复检：网络探测的 await 期间并发请求可能已通过上方检查，而此处到 startPluginMutation
                    // 之间无 await，JS 单线程保证同一目标至多一个任务，杜绝双击/并发双任务。
                    if (hasQueuedTarget(target)) {
                        sendJson(response, 409, { error: `already queued: ${target}` });
                        return;
                    }
                    // 后台启动 CLI；客户端轮询 /status 获取进度
                    const task = startPluginMutation({
                        // mode=update（已安装目标的覆盖更新）以 update 动作入队：
                        // 日志按 update 类别落盘（update.start/done/fail），实际 CLI 执行仍是 add <target>@latest
                        action: mode === 'update' ? 'update' : 'add',
                        profile,
                        target,
                        // npm 安装时 target 是包名：displayTarget 固定展示仓库名，待重启行/前端恢复不因安装目标形态而变
                        displayTarget: githubRepoOf(displayRepo) ?? undefined,
                        // 覆盖更新：npm 命令显式 @latest（pnpm add 无版本对已存在依赖是幂等的，不加版本不会真更新）
                        updateNpm: mode === 'update',
                        // 运行中 loader：安装成功后把新插件热挂进 loader，非桌面端 + 纯服务端插件无需重启即生效
                        loader,
                        timeoutMs: COMMAND_TIMEOUT_MS,
                        env: mutationEnv(settings),
                        // 候选源（首选在前）：任务内遇到传输层失败时按顺序换源重试
                        registries: ordered,
                        installSpec,
                        // 自定义安装入口渠道：日志/报错据此溯源
                        installChannel,
                    });
                    sendJson(response, 200, { ok: true, task: task.id });
                }
                catch (error) {
                    sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) });
                }
            },
        },
        {
            kind: 'exact',
            path: '/dsh-plugin-hub/uninstall',
            handler: async (request, response) => {
                if (!requireTrustedPost(request, response))
                    return;
                // 与安装一致：卸载也进入同一队列，FIFO 串行执行
                try {
                    const body = await readJsonBody(request);
                    const name = typeof body === 'object' && body !== null && typeof body.name === 'string'
                        ? body.name
                        : '';
                    // 展示用的 owner/repo：卸载命令只需要 npm 包名，但待重启行要与安装行一致地显示仓库名
                    const repo = typeof body === 'object' && body !== null && typeof body.repo === 'string'
                        ? body.repo
                        : '';
                    if (!validPackageName(name) || name === 'dsh-plugin') {
                        sendJson(response, 400, { error: 'plugin cannot be uninstalled here' });
                        return;
                    }
                    if (readInstalled(profile)[name] === undefined) {
                        sendJson(response, 400, { error: 'plugin is not installed' });
                        return;
                    }
                    // 队列级去重：同一包已在排队/执行中卸载时拒绝
                    if (hasQueuedTarget(name)) {
                        sendJson(response, 409, { error: `already queued: ${name}` });
                        return;
                    }
                    const task = startPluginMutation({
                        action: 'remove',
                        profile,
                        target: name,
                        // 卸载的 mutation 目标是 npm 包名；待重启行要显示 owner/repo（与安装行一致），非法/缺失时回退包名
                        displayTarget: githubRepoOf(repo) ?? undefined,
                        // 运行中 loader：卸载成功后主动移除条目，立即生效、无需重启
                        loader,
                        timeoutMs: COMMAND_TIMEOUT_MS,
                        env: mutationEnv(loadSettings(profile)),
                    });
                    sendJson(response, 200, { ok: true, task: task.id });
                }
                catch (error) {
                    sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) });
                }
            },
        },
    ];
}
