/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 宿主 profile 与目标校验工具：解析当前 profile、目录定位、安装目标语法校验，
 * 以及 pnpm allowBuilds 白名单的写入（失败恢复路径）。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { PACKAGE_RE, REPO_RE } from './install-types.js';
/** Resolve the active profile from the booted CLI args, falling back to `web`. */
export function readProfileArg(fallback = 'web') {
    const index = process.argv.indexOf('--profile');
    const candidate = index >= 0 ? process.argv[index + 1] : undefined;
    return candidate !== undefined && !candidate.startsWith('-') ? candidate : fallback;
}
/** Resolve a profile directory (`DSH_HOME` or `~/.dsh`). */
export function profileDirectory(profile) {
    return join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'profiles', profile);
}
/** Build a safe `github:<owner>/<repo>` target, or null when the repo is unsafe. */
export function githubTarget(repo) {
    if (typeof repo !== 'string' || !REPO_RE.test(repo))
        return null;
    return `github:${repo}`;
}
/** Validate an npm package name (uninstall target grammar). */
export function validPackageName(name) {
    return typeof name === 'string' && PACKAGE_RE.test(name);
}
/**
 * The exact `allowBuilds` key pnpm printed in its
 * `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` hint. For `github:` installs pnpm
 * matches against `name@<resolved fetch URL>` — the URL it actually fetches,
 * e.g. `https://codeload.github.com/<owner>/<repo>/tar.gz/<commit>` — not the
 * `git+ssh://`/branch spec. A bare name or a `git+` spec does not match, so
 * the only reliable key is the one pnpm prints verbatim. Null when absent.
 */
export function parseAllowBuildsKey(output) {
    const m = /^[ \t]*(\S+@\S+):[ \t]*true[ \t]*$/m.exec(output);
    return m === null ? null : m[1].trim();
}
/** Quote a YAML block-mapping key when a plain scalar would be invalid. */
function quoteYamlKey(key) {
    if (/^[-?:,[\]{}#&*!|>'"%@`]/.test(key) || /:(\s|$)/.test(key)) {
        return `'${key.replace(/'/g, "''")}'`;
    }
    return key;
}
/**
 * Add one `allowBuilds` entry to the profile's pnpm-workspace.yaml, merging
 * with existing entries and leaving the rest of the yaml intact. Broken
 * placeholder entries (pnpm's failed-install bug writes a literal
 * `set this to true or false` value) are dropped on rewrite.
 */
export function addAllowBuildsKey(profile, key) {
    const file = join(profileDirectory(profile), 'pnpm-workspace.yaml');
    let yaml = '';
    try {
        yaml = readFileSync(file, 'utf8');
    }
    catch { /* created below */ }
    const eol = /\r\n/.test(yaml) ? '\r\n' : '\n';
    const blockRe = /allowBuilds:[ \t]*\r?\n((?:[ \t]+[^\r\n]*\r?\n?)*)/g;
    const map = new Map();
    for (const match of Array.from(yaml.matchAll(blockRe))) {
        for (const line of match[1].split(/\r?\n/)) {
            const m = /^[ \t]+(\S.*?)\s*:\s*(true|false)?\s*$/.exec(line);
            if (m === null || m[1] === '')
                continue;
            let k = m[1];
            if (k.length >= 2 && ((k[0] === "'" && k[k.length - 1] === "'") || (k[0] === '"' && k[k.length - 1] === '"'))) {
                k = k.slice(1, -1);
            }
            map.set(k, m[2] ?? 'true');
        }
    }
    map.set(key, 'true');
    const block = Array.from(map).map(([k, v]) => `  ${quoteYamlKey(k)}: ${v}`).join(eol);
    const blockText = `allowBuilds:${eol}${block}${eol}`;
    let next;
    if (/allowBuilds:[ \t]*\r?\n/.test(yaml)) {
        let seen = 0;
        next = yaml.replace(blockRe, () => (seen++ === 0 ? blockText : ''));
    }
    else {
        next = `${yaml.replace(/\r?\n?$/, eol)}${blockText}`;
    }
    writeFileSync(file, next);
}
