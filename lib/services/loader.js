/**
 * 运行中 loader 的读取与停用：卸载成功后对匹配条目做 live-disable，
 * 使卸载立即生效（刷新页面不再加载已卸载的 client bundle，也无需重启）。
 */
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
 * 卸载目标（npm 包名，如 `@scope/widget`）与 loader 条目名的匹配。
 * loader 条目名由插件作者/工具写入，形式不可控，常见变体：
 *  - 完整 npm 名：`@scope/widget`
 *  - 去 `@` 前缀：`scope/widget`
 *  - 去 scope 的短名：`widget`
 *  - scope 分隔符变 `-`：`scope-widget`
 * 因此归一化后比较全串与短名两个维度。profile 内包名唯一，宽松匹配不会误伤其它包。
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
    return false;
}
/**
 * 卸载成功后从运行中 loader 停用指定包的条目，使卸载立即生效（刷新页面不再
 * 加载已卸载的 client bundle，也无需重启）。做法：按 name 扫描
 * `loader.entries()`（含嵌套子树），对每个匹配条目
 * `entry.update({ disabled: true })` 做 live-disable —— fiber 被 dispose，
 * client-modules 对账后不再把它写进 `__DSH_BOOT__`，页面刷新即恢复。
 * 返回 true = 无需重启（条目已停用，或本就没加载过）；false = 未能停用，
 * 需登记「待重启清理」兜底。宿主关键包（@deepseek-ai/* 与本插件自身）一律跳过。
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
        }
        return true;
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
