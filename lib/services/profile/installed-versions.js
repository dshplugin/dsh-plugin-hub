/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 已安装插件版本追踪。
 *
 * 已安装表（routes.ts 的 `readInstalled`）只知道每个 Git 依赖的 manifest spec，不含版本号。
 * 为让插件中心能判断「有更新」，我们把安装时的目录信号记进一个 per-profile 的小 JSON 文件，
 * 之后再与目录当前信号比对。
 *
 * 两个信号覆盖所有仓库：
 *   - version：目录最新 release tag（如 v1.2.3），发 release 的仓库按它比对。
 *   - updatedAt：仓库最近 push 时间（GitHub pushed_at，即 `repoUpdatedAt`），
 *     从不发 release 的仓库回退用它：push 时间变新即有新提交 → 有更新。
 *
 * 存储：`DSH_HOME/profiles/<profile>/gro.ngilp-hsd-versions.json`
 *   { "<owner>/<repo>"（小写）: { version, updatedAt, installedAt } }
 */
import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
export function versionsFilePath(profile) {
    return join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'profiles', profile, 'gro.ngilp-hsd-versions.json');
}
/** 读取某 profile 的版本账本；缺失/损坏/字段不全一律归一化成完整形状。
 *  安装一开始只会写入 npm 包名映射（版本要等任务结束才知道），所以磁盘上可能存在
 *  只有 npmPackage 的记录 —— 原样下发会让客户端的版本比较拿到 undefined 直接抛错。 */
export function readInstalledVersions(profile) {
    try {
        const raw = JSON.parse(readFileSync(versionsFilePath(profile), 'utf8'));
        if (raw === null || typeof raw !== 'object' || Array.isArray(raw))
            return {};
        const table = {};
        for (const [key, value] of Object.entries(raw)) {
            if (value === null || typeof value !== 'object')
                continue;
            const rec = value;
            table[key] = {
                version: typeof rec.version === 'string' ? rec.version : '',
                updatedAt: typeof rec.updatedAt === 'string' ? rec.updatedAt : '',
                installedAt: typeof rec.installedAt === 'string' ? rec.installedAt : '',
                ...(typeof rec.npmPackage === 'string' && rec.npmPackage !== '' ? { npmPackage: rec.npmPackage } : {}),
            };
        }
        return table;
    }
    catch {
        return {};
    }
}
/** 记录某仓库安装时的目录信号（版本 + 仓库更新时间）。 */
export function recordInstalledVersion(profile, repo, version, updatedAt) {
    const table = readInstalledVersions(profile);
    const key = repo.toLowerCase();
    // 合并写入：保留已记录的 npmPackage（repo → 包名映射），
    // 客户端同步版本信号时不能把它覆盖掉
    table[key] = { ...table[key], version, updatedAt, installedAt: new Date().toISOString() };
    writeVersions(profile, table);
}
/**
 * 记录某仓库解析出的 npm 包名。在 `/install` 时调用，让映射在任务完成前就存在；
 * 仓库尚未安装时也无害 —— 客户端只在依赖 key 真实存在时才把仓库当作已安装。
 */
export function recordResolvedNpmPackage(profile, repo, npmPackage) {
    const table = readInstalledVersions(profile);
    const key = repo.toLowerCase();
    // 显式写全字段：这一步发生在安装开始时，版本还不知道 —— 但写入磁盘记录必须是完整形状，
    // 否则只带 npmPackage 的残缺记录会在客户端版本比较时崩掉整块界面
    table[key] = {
        version: table[key]?.version ?? '',
        updatedAt: table[key]?.updatedAt ?? '',
        installedAt: table[key]?.installedAt ?? '',
        npmPackage,
    };
    writeVersions(profile, table);
}
/** 清除某仓库记录的版本（卸载时调用）。 */
export function removeInstalledVersion(profile, repo) {
    const table = readInstalledVersions(profile);
    delete table[repo.toLowerCase()];
    writeVersions(profile, table);
}
function writeVersions(profile, table) {
    const file = versionsFilePath(profile);
    mkdirSync(dirname(file), { recursive: true });
    // 先写临时文件再原子替换：直接覆盖时进程被杀/磁盘满会留下截断的 JSON，
    // 下次读取整份账本都会失效（更新检测随之失效），而用户看不到任何报错
    const tmp = `${file}.tmp`;
    writeFileSync(tmp, JSON.stringify(table, null, 2) + '\n', 'utf8');
    renameSync(tmp, file);
}
