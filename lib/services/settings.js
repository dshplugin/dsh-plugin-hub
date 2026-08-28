/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Hub settings persistence: one `hub-settings.json` per active profile
 * (next to pnpm-workspace.yaml). All fields optional; missing keys fall
 * back to DEFAULT_SETTINGS so old files stay readable as new options land.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { profileDirectory } from './profile/profile.js';
export const DEFAULT_SETTINGS = {
    checkUpdatesOnStart: true,
    proxy: '',
    npmRegistry: '',
    enableNpmInstall: true,
    enableGitInstall: true,
    enableDshInstall: true,
    logPath: '',
};
export function settingsFile(profile) {
    return join(profileDirectory(profile), 'hub-settings.json');
}
/** 读取当前 profile 的设置；文件缺失/损坏时回退默认值（只读路径绝不抛错）。 */
export function loadSettings(profile) {
    try {
        const raw = JSON.parse(readFileSync(settingsFile(profile), 'utf8'));
        return {
            ...DEFAULT_SETTINGS,
            ...(typeof raw === 'object' && raw !== null ? raw : {}),
        };
    }
    catch {
        return { ...DEFAULT_SETTINGS };
    }
}
/** 合并并持久化设置（部分更新），返回合并后的完整设置。 */
export function saveSettings(profile, patch) {
    const next = { ...loadSettings(profile), ...patch };
    const file = settingsFile(profile);
    try {
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`);
    }
    catch {
        // 持久化失败不阻断本次会话：内存值仍生效，下次写入再试
    }
    return next;
}
/** 重置为默认设置：删除设置文件，下次读取全部回退默认值（陈旧/白名单外键一并清除）。 */
export function resetSettings(profile) {
    try {
        rmSync(settingsFile(profile), { force: true });
    }
    catch {
        // 删除失败不阻断：loadSettings 仍回退默认值
    }
    return { ...DEFAULT_SETTINGS };
}
