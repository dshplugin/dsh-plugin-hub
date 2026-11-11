/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 宿主 profile 与目标校验工具：解析当前 profile、目录定位、安装目标语法校验，
 * 以及 pnpm allowBuilds 白名单的写入（失败恢复路径）。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { PACKAGE_RE, REPO_RE } from '../install/install-types.js';
import { githubReleaseTarget } from '../install/release-target.js';
/** 从启动参数解析当前 profile，取不到落回 `web`。 */
export function readProfileArg(fallback = 'web') {
    return profileFromArgv(process.argv, fallback);
}
/**
 * 从启动参数解析当前 profile，两种宿主形态都认：
 *  - 官方 CLI：`--profile <name>`（也兼容 `--profile=<name>` 等号形式）；
 *  - Electron 桌面宿主：不传 `--profile`，而是把 profile 目录作为位置参数传入
 *    （`… <dshRoot> <home>\profiles\desktop …`）。
 * 桌面端只认 `--profile` 会永远落回 fallback，把路由/日志/安装全挂到错误的 profile 上
 * （日志写进 profiles/web/hub.log、市场必然「插件数据加载失败」）。
 * 位置参数按「父目录名为 profiles」精确识别 profile 目录，避免误取其它位置参数。
 */
export function profileFromArgv(argv, fallback = 'web') {
    const index = argv.indexOf('--profile');
    const candidate = index >= 0 ? argv[index + 1] : undefined;
    if (candidate !== undefined && !candidate.startsWith('-'))
        return candidate;
    const equals = argv.find((arg) => arg.startsWith('--profile='));
    if (equals !== undefined) {
        const name = equals.slice('--profile='.length);
        if (name !== '')
            return name;
    }
    for (const arg of argv.slice(2)) {
        if (arg === '' || arg.startsWith('-'))
            continue;
        if (basename(dirname(arg)) !== 'profiles')
            continue;
        const name = basename(arg);
        if (name !== '')
            return name;
    }
    return fallback;
}
/** 解析 profile 目录（`DSH_HOME` 或 `~/.dsh`）。 */
export function profileDirectory(profile) {
    return join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'profiles', profile);
}
/** profile 的 dsh.profile.bundles 是否仍包含指定包：取消勾选后 bundle patch 不再执行。
 *  没有该清单或读取失败时返回 true —— 不归我们判断的情况不报警。 */
export function bundleIncludes(profile, name) {
    try {
        const pkg = JSON.parse(readFileSync(join(profileDirectory(profile), 'package.json'), 'utf8'));
        const bundles = pkg.dsh?.profile?.bundles;
        if (!Array.isArray(bundles))
            return true;
        return bundles.includes(name);
    }
    catch {
        return true;
    }
}
/** 把仓库身份转成规范的 GitHub 目标（git+https），仓库不合法时返回 null。
 *  带 ref 时按 Git ref（`#tag` / `#commit`）拼接；安装通道已不再使用 git 目标，此函数仅做身份规范化。 */
export function githubTarget(repo, ref) {
    if (typeof repo !== 'string' || !REPO_RE.test(repo))
        return null;
    const url = `git+https://github.com/${repo}.git`;
    return ref === undefined || ref === null || ref === '' ? url : `${url}#${ref}`;
}
/**
 * DSH 命令行前缀（官方唯一形式 `dsh plugin --profile <name> <add|update> <target>`）—— 提取其中的安装目标；
 * 非命令输入原样返回。兼容「直接粘贴完整命令」（防用户输错）：--profile 必填且只有长选项
 * （官方 CLI 无 -p 简写，省略即报错），支持 `--profile=<name>` 等号形式，命令大小写不敏感。
 * update = 更新已安装目标到最新；remove 不在此列（卸载走 /uninstall 路由，按已装包名直卸）。
 * 与客户端 CustomInstallView 规则一致。
 */
const DSH_PLUGIN_CMD_RE = /^dsh\s+plugin\s+--profile(?:\s+|=)\S+\s+(add|update)\s+(.+)$/i;
export function installTargetOf(value) {
    const input = typeof value === 'string' ? value.trim() : '';
    const match = DSH_PLUGIN_CMD_RE.exec(input);
    return match !== null ? match[2].trim() : input;
}
/**
 * npm 全局安装命令（官方 README 的 `npm install -g <pkgs>`，如 dsh-tui 的安装命令）——
 * 提取 -g 之后的包列表。支持 `npm install|i` 与 `-g|--global`；任一包名非法（或格式
 * 不匹配）返回 null，由调用方按「不支持的目标」处理。与客户端 CustomInstallView 同一套规则。
 */
const NPM_GLOBAL_CMD_RE = /^npm\s+(?:install|i)\s+(?:-g|--global)\s+(.+)$/i;
export function globalNpmPackagesOf(value) {
    const input = typeof value === 'string' ? value.trim() : '';
    const match = NPM_GLOBAL_CMD_RE.exec(input);
    if (match === null)
        return null;
    const packages = match[1].trim().split(/\s+/).filter((p) => p !== '');
    // 包名逐个校验 + 拒绝以 - 开头的 token（npm 会把 --xxx 当参数而非包名，防注入任意 CLI 参数）
    if (packages.length === 0 || packages.some((p) => !validPackageName(p) || p.startsWith('-')))
        return null;
    return packages;
}
/** 从目录值或已装 Git spec 中提取 owner/repo 身份。 */
export function githubRepoOf(value) {
    if (typeof value !== 'string')
        return null;
    const input = value.trim();
    // release 直链先归一到仓库身份：目录命令里的固定 HTTPS release 包不是 git 地址，
    // 但它的所属仓库就是 owner/repo —— 已装态读回、去重、展示都要拿到这层身份。
    const release = githubReleaseTarget(input);
    if (release !== null)
        return release.repo;
    if (REPO_RE.test(input))
        return input;
    const patterns = [
        /^github:([^/]+)\/([^/]+)$/i,
        /^(?:git\+)?https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:[?#].*)?$/i,
        /^(?:git\+)?ssh:\/\/(?:git@)?github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:[?#].*)?$/i,
        /^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?(?:[?#].*)?$/i,
    ];
    for (const pattern of patterns) {
        const match = pattern.exec(input);
        if (match === null)
            continue;
        const repo = `${match[1]}/${match[2]}`;
        if (REPO_RE.test(repo))
            return repo;
    }
    return null;
}
/** 校验 npm 包名（卸载目标的语法）。 */
export function validPackageName(name) {
    return typeof name === 'string' && PACKAGE_RE.test(name);
}
/**
 * 取 pnpm 在 `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` 提示里原样打印的 `allowBuilds` key。
 * Git 安装时 pnpm 按 `name@<实际 fetch URL>`（如
 * `https://codeload.github.com/<owner>/<repo>/tar.gz/<commit>`）匹配，而不是 `git+ssh://`
 * 或分支 spec —— 裸包名与 `git+` spec 都匹配不上，唯一可靠的 key 就是 pnpm 原样输出的那个。
 * 无则返回 null。
 */
export function parseAllowBuildsKey(output) {
    const m = /^[ \t]*(\S+@\S+):[ \t]*true[ \t]*$/m.exec(output);
    return m === null ? null : m[1].trim();
}
/** 当裸标量非法时，为 YAML 块映射 key 加引号。 */
function quoteYamlKey(key) {
    if (/^[-?:,[\]{}#&*!|>'"%@`]/.test(key) || /:(\s|$)/.test(key)) {
        return `'${key.replace(/'/g, "''")}'`;
    }
    return key;
}
/** `allowBuilds` 段：header 行（可带行内数组值）+ 其后任意缩进条目行。 */
const ALLOW_BLOCK_RE = /^[ \t]*allowBuilds:[^\r\n]*(?:(?:\r?\n)[ \t]{2,}[^\r\n]*)*/gm;
function unquoteYamlKey(key) {
    const quoted = key.length >= 2 && ((key[0] === "'" && key[key.length - 1] === "'") || (key[0] === '"' && key[key.length - 1] === '"'));
    return quoted ? key.slice(1, -1) : key;
}
/** 读出 yaml 里所有 `allowBuilds` 段的条目（key → 值，缺省 true）。 */
function readAllowBuilds(yaml) {
    const map = new Map();
    for (const match of Array.from(yaml.matchAll(ALLOW_BLOCK_RE))) {
        const [header, ...rest] = match[0].split(/\r?\n/);
        for (const line of rest) {
            const m = /^[ \t]+(\S.*?)\s*:\s*(true|false)?\s*$/.exec(line);
            if (m === null || m[1] === '')
                continue;
            map.set(unquoteYamlKey(m[1]), m[2] ?? 'true');
        }
        // 行内数组写法：allowBuilds: ["a@1.0.0", 'b@2'] —— 保留已有条目，别丢
        const inline = /^[ \t]*allowBuilds:\s*\[(.*)\]\s*$/.exec(header);
        if (inline !== null) {
            for (const raw of inline[1].split(',')) {
                const k = raw.trim().replace(/^['"]|['"]$/g, '');
                if (k !== '')
                    map.set(k, 'true');
            }
        }
    }
    return map;
}
/** 把所有 `allowBuilds` 段合并写成一段规范化块，其余 yaml 原样保留；无该段时追加。 */
function writeAllowBuilds(yaml, map) {
    const eol = /\r\n/.test(yaml) ? '\r\n' : '\n';
    const block = Array.from(map).map(([k, v]) => `  ${quoteYamlKey(k)}: ${v}`).join(eol);
    const blockText = `allowBuilds:${eol}${block}${eol}`;
    let seen = 0;
    const next = yaml.replace(ALLOW_BLOCK_RE, () => (seen++ === 0 ? blockText : ''));
    return seen === 0 ? `${yaml.replace(/\r?\n?$/, eol)}${blockText}` : next;
}
/**
 * `allowBuilds` 的 key 必须是 `包名@精确版本`。pnpm v11 在真正安装前会把每条规则解析成
 * 「包名 + 精确版本」，遇到 URL/git/file spec（`pkg@https://…`、`pkg@file:…`）直接抛
 * `ERR_PNPM_INVALID_VERSION_UNION` —— 该 profile 里之后**任何**安装都会失败（#730）。
 * 非 semver 的 spec 一律降级为裸包名（pnpm 按包名匹配所有版本）。
 */
export function safeAllowBuildsKey(key) {
    const at = key.startsWith('@') ? key.indexOf('@', 1) : key.indexOf('@');
    if (at <= 0)
        return key;
    const spec = key.slice(at + 1);
    return /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(spec) ? key : key.slice(0, at);
}
/**
 * 安装前修复**已有** `allowBuilds` 里的非法 key。pnpm 的报错发生在依赖解析之前，
 * 走不到 `addAllowBuildsKey` 的失败恢复路径，只能主动清理。返回是否改写了文件。
 */
export function sanitizeAllowBuilds(profile) {
    const file = join(profileDirectory(profile), 'pnpm-workspace.yaml');
    let yaml = '';
    try {
        yaml = readFileSync(file, 'utf8');
    }
    catch {
        return false;
    }
    if (Array.from(yaml.matchAll(ALLOW_BLOCK_RE)).length === 0)
        return false;
    const before = readAllowBuilds(yaml);
    const after = new Map();
    for (const [k, v] of before)
        after.set(safeAllowBuildsKey(k), v);
    if (after.size === before.size && Array.from(after).every(([k, v]) => before.get(k) === v))
        return false;
    writeFileSync(file, writeAllowBuilds(yaml, after));
    return true;
}
/**
 * 向 profile 的 pnpm-workspace.yaml 追加一条 `allowBuilds` 记录：与已有条目合并，
 * 其余 yaml 保持不变；重写时丢弃损坏的占位条目（pnpm 安装失败的 bug 会写入
 * 字面量 `set this to true or false`）。
 *
 * 任何形态的既有 `allowBuilds` 都会被**整体替换**成规范化块：块写法、行内数组
 * `allowBuilds: ["a@1"]`、以及末尾无换行的 `allowBuilds:` 都算命中。否则会在文件里
 * 再多写一个同名键 —— pnpm 解析时直接报 `duplicated mapping key`，该 profile 里
 * 所有插件都装不上（#562）。
 */
export function addAllowBuildsKey(profile, key) {
    const file = join(profileDirectory(profile), 'pnpm-workspace.yaml');
    let yaml = '';
    try {
        yaml = readFileSync(file, 'utf8');
    }
    catch { /* 文件不存在，下方创建 */ }
    const map = readAllowBuilds(yaml);
    map.set(safeAllowBuildsKey(key), 'true');
    writeFileSync(file, writeAllowBuilds(yaml, map));
}
