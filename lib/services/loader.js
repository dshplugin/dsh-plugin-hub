/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 运行中 loader 的读取、停用与热挂载：卸载成功后对匹配条目做 live-disable、
 * 安装成功后把新插件条目热挂进运行中的 loader，让两类操作都尽量立即生效
 * （刷新页面即可，无需重启宿主）。
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { profileDirectory } from './profile/profile.js';
/** 运行中 loader 的全部条目（id + options.name），诊断用。 */
export function dumpLoaderEntries(loader) {
    if (!loader)
        return [];
    const entries = [];
    for (const entry of Array.from(loader.entries())) {
        entries.push({ id: entry.id, name: entry.options?.name });
    }
    return entries;
}
/**
 * 判断某 npm 包名是否已加载进运行中 loader（宽匹配：条目名存在别名变体）。
 * 官方 `ctx.loader.entries()` 遍历整棵树（reference.md §1.3），条目名 == 插件作者声明的名字。
 * 安装完成但未重启时条目不在 loader → 返回 false，UI 据此标「待重启/未加载」。
 */
export function isEntryLoaded(loader, name) {
    if (!loader)
        return false;
    for (const entry of Array.from(loader.entries())) {
        if (nameMatches(entry.options?.name, name))
            return true;
    }
    return false;
}
/**
 * 卸载目标（npm 包名，如 `@scope/widget`）与 loader 条目名的匹配。
 * loader 条目名由插件作者/工具写入，形式不可控，常见变体：
 *  - 完整 npm 名：`@scope/widget`
 *  - 去 `@` 前缀：`scope/widget`
 *  - 去 scope 的短名：`widget`
 *  - scope 分隔符变 `-`：`scope-widget`
 *  - 包内模块路径：`widget/extensions/dsh/index.js`（bundle patch 的 name 常写成模块路径）
 * 因此归一化后比较全串、短名、路径前缀三个维度。profile 内包名唯一，宽松匹配不会误伤其它包。
 */
function nameMatches(entryName, target) {
    if (!entryName)
        return false;
    // 归一化：去 @、非 [a-z0-9-] 一律换 `-`、小写
    const norm = (s) => s.trim().replace(/^@+/, '').replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const e = norm(entryName);
    if (!e)
        return false;
    const t = norm(target); // @scope/pkg → scope-pkg
    const tShort = norm(target.replace(/^@[^/]+\//, '')); // @scope/pkg → pkg（无 scope 时与原串一致）
    // 1) 全串相等：覆盖 完整名 == 完整名 / 去@ == 去@ / scope-pkg == scope/pkg 归一化
    if (e === t)
        return true;
    // 2) 条目是去 scope 的短名（bundle patch 手写短名最常见）
    if (e === tShort)
        return true;
    // 3) 反向变体：目标短名可能就是条目的完整形式（条目 `scope-widget`，
    //    目标短名 `widget` 是它的尾段）——用「条目名以短名结尾」收口，避免误伤。
    if (tShort.length >= 2 && e.endsWith(`-${tShort}`))
        return true;
    // 4) 条目名是目标包内的模块路径（`aegis/extensions/dsh/index.js` 属于包 `aegis`，
    //    `@scope/pkg/dist/x.js` 属于 `@scope/pkg`）：归一化会吞掉路径分隔符，
    //    必须在归一化前用原始形态做「target/」前缀判断（大小写不敏感）。
    const rawE = entryName.trim().toLowerCase();
    const rawT = target.trim().toLowerCase();
    if (rawE === rawT || rawE.startsWith(`${rawT}/`))
        return true;
    return false;
}
/**
 * 卸载成功后从运行中 loader 停用指定包的条目。做法：按 name 扫描
 * `loader.entries()`（含嵌套子树），对每个匹配条目
 * `entry.update({ disabled: true })` 做 live-disable —— fiber 被 dispose，
 * client-modules 对账后不再把它写进 `__DSH_BOOT__`，页面刷新即恢复。
 * 返回 `{ ok, live }`：
 *  - `{ ok: true, live: false }`：宿主从未加载过它（磁盘已干净），无需刷新/重启；
 *  - `{ ok: true, live: true }`：曾在 loader 中存活且已 live-disable —— 服务端即时卸载；
 *    带客户端 UI 的插件面板要页面刷新才摘除（由调用方按 `hadClientUi` 决定 needsReload）；
 *  - `{ ok: false, live: true }`：disable 失败 / 超时，需宿主重启兜底清理。
 * 宿主关键包（@deepseek-ai/* 与本插件自身）一律跳过。
 */
export async function removeLoadedEntry(loader, name) {
    if (name === 'dsh-plugin' || name.startsWith('@deepseek-ai/'))
        return { ok: false, live: true };
    // 5s 超时兜底：fiber dispose 卡住时不能让卸载任务（乃至整个队列）被拖死
    const removal = (async () => {
        const entries = dumpLoaderEntries(loader);
        const match = entries.find((e) => e.name === name);
        console.log(`[hub-uninstall] loader=${entries.length} entries; target=${name}; match=${match ? match.id : 'none'}; names=${entries.map((e) => e.name ?? '').join(',')}`);
        let found = false;
        for (const entry of Array.from(loader.entries())) {
            if (!nameMatches(entry.options?.name, name))
                continue;
            found = true;
            // force=true：disable 可能落在 init 进行中，options 翻转但 fiber 仍会起来，
            // 重试直到实际状态与目标一致
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    await entry.update({ disabled: true }, false, true);
                    break;
                }
                catch (error) {
                    console.log(`[hub-uninstall] disable ${name} attempt ${attempt + 1} failed: ${error instanceof Error ? error.message : String(error)}`);
                    if (attempt === 2)
                        return { ok: false, live: true };
                    await new Promise((resolvePromise) => setTimeout(resolvePromise, 200));
                }
            }
        }
        if (!found) {
            // 运行中 loader 无该条目：宿主从未加载过它（装完未重启），磁盘已干净，无需刷新/重启
            console.log(`[hub-uninstall] no live entry for ${name}; nothing to disable`);
            return { ok: true, live: false };
        }
        // 找到并停用了 live entry：逻辑层已卸载（刷新页面不再加载其 client bundle），
        // 带 UI 的插件面板由调用方按 hadClientUi 决定是否需要刷新摘除
        console.log(`[hub-uninstall] disabled live entry for ${name}`);
        return { ok: true, live: true };
    })();
    const result = await Promise.race([
        removal.catch((error) => {
            console.log(`[hub-uninstall] disable failed: ${error instanceof Error ? error.message : String(error)}`);
            return { ok: false, live: true };
        }),
        new Promise((resolve) => setTimeout(() => resolve({ ok: false, live: true }), 5_000)),
    ]);
    console.log(`[hub-uninstall] disable ${name} -> ${result.ok ? (result.live ? 'disabled live entry' : 'nothing live') : 'timed out or failed'}`);
    return result;
}
/**
 * 安装成功后把新插件热挂进运行中 loader（等价 profile bundle patch 的
 * `- insert: - name: <pkg>` 行），让插件无需重启宿主即可生效。
 * 做法：在 Loader 根组新建条目并启动 —— Loader.write() 为空实现，不写盘；
 * 重启后由 profile 的 bundles 清单重新挂载，不会重复。
 * `Entry._init` 的 import 失败只 `logger.error` 后 return（不抛），条目会建出来但
 * fiber 为空 / 条目可能被标记 disabled —— 必须用 `loader.resolve(id)` 校验真的起来了。
 * 返回 true = 已在运行中（本次新建或此前已加载）。
 */
export async function mountLoadedEntry(loader, name) {
    if (isEntryLoaded(loader, name))
        return true;
    const mounting = (async () => {
        const id = await loader.create({ name });
        const entry = loader.resolve(id);
        if (entry?.fiber !== undefined && entry?.fiber !== null && !entry.options?.disabled) {
            console.log(`[hub-install] hot mounted ${name} (entry ${id})`);
            return true;
        }
        console.log(`[hub-install] hot mount ${name}: entry ${id} created but not running (import failed?)`);
        return false;
    })();
    // 10s 超时兜底：import 卡住时不能让装完收尾（乃至整个队列）被拖死
    return Promise.race([
        mounting.catch((error) => {
            console.log(`[hub-install] hot mount ${name} failed: ${error instanceof Error ? error.message : String(error)}`);
            return false;
        }),
        new Promise((resolve) => setTimeout(() => resolve(false), 10_000)),
    ]);
}
/**
 * 已安装包是否带客户端 UI（package.json 的 `dsh.client` 声明）：client-modules 据它把
 * 客户端 bundle 注入宿主页面。带 UI 的插件热挂载后需要页面重新加载才会渲染，
 * 网页端与桌面端一致 —— `__DSH_BOOT__` 注入清单由宿主服务端按请求现场拼装，
 * 壳不缓存，所以桌面端刷新页面同样能拿到新清单，无需重开 App。
 */
export function hasClientUi(profile, name) {
    try {
        const pkg = JSON.parse(readFileSync(join(profileDirectory(profile), 'node_modules', name, 'package.json'), 'utf8'));
        return pkg.dsh?.client !== undefined && pkg.dsh?.client !== null;
    }
    catch {
        return false;
    }
}
/**
 * 判断某已安装包是否是真正的 dsh 插件（宿主会加载 / 值得提示「待重启」）：
 *  1) 包名已写进 profile 的 `dsh.profile.bundles`（宿主启动时按清单加载）；
 *  2) 或包内 package.json 声明了 dsh 配置（`dsh.bundle` / `dsh.profile` 等）或 dsh 相关 keywords。
 * 两者都满足不了（如 GitHub 官方示例仓库 octocat/Hello-World）说明它不是 dsh 插件，
 * 装上也不会被宿主加载——UI 据此不再提示「待重启」，避免误导用户反复重启一个不会生效的东西。
 */
export function isDshPlugin(profile, name) {
    // 1) profile 级 bundles 清单：包名在清单里 → 宿主启动会加载它
    try {
        const profilePkg = JSON.parse(readFileSync(join(profileDirectory(profile), 'package.json'), 'utf8'));
        const bundles = profilePkg.dsh?.profile?.bundles;
        if (Array.isArray(bundles) && bundles.includes(name))
            return true;
    }
    catch { /* profile 读取失败按无 bundles 处理 */ }
    // 2) 包内声明：dsh 字段（bundle patch / profile 配置）或 dsh 关键字
    try {
        const pkg = JSON.parse(readFileSync(join(profileDirectory(profile), 'node_modules', name, 'package.json'), 'utf8'));
        if (pkg.dsh)
            return true;
        if (Array.isArray(pkg.keywords)) {
            if (pkg.keywords.some((k) => typeof k === 'string' && /^(?:dsh|dsh-plugin)$/i.test(k)))
                return true;
        }
    }
    catch { /* 包缺失 / 无 package.json → 不是 dsh 插件 */ }
    return false;
}
