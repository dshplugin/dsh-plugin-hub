/**
 * Installed-plugin version tracking.
 *
 * The installed table (`readInstalled` in routes.ts) only knows the manifest
 * spec of each dependency (`github:<owner>/<repo>`), which carries no version.
 * To let the Plugin Hub tell "an update is available", we record the catalog
 * signal present at install time into a small per-profile JSON file, then
 * compare it against the catalog's current signal later.
 *
 * Two signals cover every repo:
 *   - version:  the catalog's latest release tag (e.g. v1.2.3). Repos that
 *     publish releases are compared on this.
 *   - updatedAt: the repo's last push time (GitHub pushed_at, `repoUpdatedAt`).
 *     Repos that never publish a release fall back to this: a newer push time
 *     means new commits → an update is available.
 *
 * Storage: `DSH_HOME/profiles/<profile>/gro.ngilp-hsd-versions.json`
 *   { "<owner>/<repo>" (lowercase): { version: string, updatedAt: string, installedAt: string } }
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
export function versionsFilePath(profile) {
    return join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'profiles', profile, 'gro.ngilp-hsd-versions.json');
}
export function readInstalledVersions(profile) {
    try {
        const raw = JSON.parse(readFileSync(versionsFilePath(profile), 'utf8'));
        return raw !== null && typeof raw === 'object' ? raw : {};
    }
    catch {
        return {};
    }
}
/** Record the catalog signals (version + repo updated time) present at install time for one repo. */
export function recordInstalledVersion(profile, repo, version, updatedAt) {
    const table = readInstalledVersions(profile);
    const key = repo.toLowerCase();
    // 合并写入：保留已记录的 npmPackage（npm 优先通道的 repo → 包名映射），
    // 客户端同步版本信号时不能把它覆盖掉
    table[key] = { ...table[key], version, updatedAt, installedAt: new Date().toISOString() };
    writeVersions(profile, table);
}
/**
 * Record the npm package name resolved for a repo (npm-first install channel).
 * Called at `/install` time so the mapping exists even before the task finishes;
 * harmless when the repo is not (yet) installed — the client only treats a repo
 * as installed when its dependency key actually exists.
 */
export function recordResolvedNpmPackage(profile, repo, npmPackage) {
    const table = readInstalledVersions(profile);
    const key = repo.toLowerCase();
    table[key] = { ...table[key], npmPackage };
    writeVersions(profile, table);
}
/** Forget the recorded version for one repo (called on uninstall). */
export function removeInstalledVersion(profile, repo) {
    const table = readInstalledVersions(profile);
    delete table[repo.toLowerCase()];
    writeVersions(profile, table);
}
function writeVersions(profile, table) {
    const file = versionsFilePath(profile);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(table, null, 2) + '\n', 'utf8');
}
