/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 运行中 loader 的读取与停用：卸载成功后对匹配条目做 live-disable，
 * 使卸载立即生效（刷新页面不再加载已卸载的 client bundle，也无需重启）。
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
 * 返回 true = 无需重启（仅当宿主从未加载过它：磁盘已干净）；
 * 其余一律 false = 需要重启：要么 disable 失败需「待重启清理」兜底，
 * 要么 disable 成功但该插件曾在 loader 中存活——带 UI 的插件（侧边栏面板等
 * 宿主启动时渲染的槽位）disable 后不会主动摘除，不重启面板一直残留。
 * 宿主关键包（@deepseek-ai/* 与本插件自身）一律跳过。
 */
export async function removeLoadedEntry(loader, name) {
    if (name === 'dsh-plugin' || name.startsWith('@deepseek-ai/'))
        return false;
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
                        return false;
                    await new Promise((resolvePromise) => setTimeout(resolvePromise, 200));
                }
            }
        }
        if (!found) {
            // 运行中 loader 无该条目：宿主从未加载过它（装完未重启），磁盘已干净，无需重启
            console.log(`[hub-uninstall] no live entry for ${name}; nothing to disable`);
            return true;
        }
        // 找到并停用了 live entry：逻辑层已卸载（刷新页面不再加载其 client bundle），
        // 但带 UI 的插件（侧边栏面板等）是宿主启动时渲染的槽位，disable 不会主动摘除，
        // 不重启面板会一直残留 → 返回「需要重启」，弹窗给出「立即重启」，面板立即消失
        console.log(`[hub-uninstall] disabled live entry for ${name}; UI may persist until restart`);
        return false;
    })();
    const result = await Promise.race([
        removal.catch((error) => {
            console.log(`[hub-uninstall] disable failed: ${error instanceof Error ? error.message : String(error)}`);
            return false;
        }),
        new Promise((resolve) => setTimeout(() => resolve(false), 5_000)),
    ]);
    console.log(`[hub-uninstall] disable ${name} -> ${result ? 'ok/clean' : 'timed out or failed'}`);
    return result;
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
        if (Array.isArray(profilePkg.dsh?.profile?.bundles)) {
            if (profilePkg.dsh.profile.bundles.includes(name))
                return true;
        }
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
