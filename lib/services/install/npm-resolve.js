/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * npm 包反查：git 分发不完整（缺构建产物/子模块）导致安装失败时，用 npm
 * registry 的搜索接口按 repository 地址反查该仓库对应的官方 npm 包。
 *
 * 这是通用机制，不针对任何具体插件：只要作者发布了 repository 指向该
 * GitHub 仓库的 npm 包（scope 名与 GitHub 用户名是否一致无所谓），就能命中，
 * 从而把 git 分发不完整的插件切换到 npm 通道安装。命中结果带内存缓存，
 * 避免同一会话内重复查询 registry。
 */
import { get } from 'node:https';
import { githubRepoOf } from '../profile/profile.js';
/** 反查缓存：repo 小写 → npm 包名（null 表示已确认无对应 npm 包；网络异常不缓存）。 */
const cache = new Map();
/** 单次 registry 查询超时（ms）：慢网络下失败返回 null，不阻塞安装流程。 */
const REQUEST_TIMEOUT_MS = 8000;
/** npm search 是相关性搜索而非 repository 精确索引；拉满单页结果后再本地做严格 repo 过滤。 */
const SEARCH_RESULT_LIMIT = 250;
/**
 * 反查 repo（`owner/repo`）对应的官方 npm 包名；未命中、网络异常或超时返回 null。
 * 返回 null 不代表仓库一定没有 npm 包，只代表本次未能确认 —— 调用方应保留
 * 原有错误路径，反查只是额外的一次尝试。只有「已确认」的结果（包名，或 200
 * 响应下确认无匹配）会进缓存；网络异常/超时/解析失败不缓存，同一会话内下次
 * 安装仍会重试反查，避免一次瞬时故障把整个会话锁死在 git 通道。
 * registry 参数：npm 镜像源地址，空串 = 官方源；与安装通道吃同一 registry，
 * 保证「配置了镜像」时反查和安装走同一个源（镜像节点同步完整时结果一致）。
 * 慢网络下失败不阻塞安装。
 */
export function resolveNpmPackage(repo, registry = '') {
    const key = repo.toLowerCase();
    if (cache.has(key))
        return Promise.resolve(cache.get(key) ?? null);
    const name = searchRepo(repo, registry);
    void name.then((found) => {
        if (found !== undefined)
            cache.set(key, found);
    });
    return name.then((found) => found ?? null);
}
/**
 * Pick the installable npm package for one GitHub repository. npm search is a
 * relevance-ranked text search, not an exact repository index, so first filter
 * by repository URL. If a monorepo publishes both a CLI/helper package and a
 * DSH plugin, prefer the package that explicitly advertises the `dsh-plugin`
 * keyword instead of whichever result npm happened to rank first.
 */
function repositoryUrlOf(pkg) {
    if (typeof pkg.repository === 'string')
        return pkg.repository;
    if (pkg.repository !== null && typeof pkg.repository === 'object') {
        const url = pkg.repository.url;
        if (typeof url === 'string')
            return url;
    }
    return String(pkg.links?.repository ?? '');
}
export function isDshPackageMetadataForRepo(pkg, repo) {
    if (githubRepoOf(repositoryUrlOf(pkg))?.toLowerCase() !== repo.toLowerCase())
        return false;
    const keywords = Array.isArray(pkg.keywords) ? pkg.keywords : [];
    const keywordMarked = keywords.some((keyword) => typeof keyword === 'string' && keyword.toLowerCase() === 'dsh-plugin');
    const manifestMarked = pkg.dsh !== null && typeof pkg.dsh === 'object';
    return keywordMarked || manifestMarked;
}
export function isDshNpmPackageForRepo(packageName, repo, registry = '') {
    if (packageName === '' || repo === '')
        return Promise.resolve(false);
    const base = registry === '' ? 'https://registry.npmjs.org' : registry.replace(/\/+$/, '');
    const url = `${base}/${encodeURIComponent(packageName)}/latest`;
    return new Promise((resolve) => {
        const req = get(url, { timeout: REQUEST_TIMEOUT_MS }, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                resolve(false);
                return;
            }
            let body = '';
            res.on('data', (chunk) => { body += chunk.toString(); });
            res.on('end', () => {
                try {
                    resolve(isDshPackageMetadataForRepo(JSON.parse(body), repo));
                }
                catch {
                    resolve(false);
                }
            });
        });
        req.on('timeout', () => req.destroy());
        req.on('error', () => resolve(false));
    });
}
function matchingPackagesForRepo(objects, repo) {
    const matches = [];
    for (const obj of objects) {
        const pkg = obj.package;
        if (typeof pkg?.name !== 'string' || pkg.name === '')
            continue;
        const repoUrl = repositoryUrlOf(pkg);
        if (githubRepoOf(repoUrl)?.toLowerCase() !== repo.toLowerCase())
            continue;
        const keywords = Array.isArray(pkg.keywords) ? pkg.keywords : [];
        matches.push({
            name: pkg.name,
            isDshPlugin: keywords.some((keyword) => typeof keyword === 'string' && keyword.toLowerCase() === 'dsh-plugin'),
        });
    }
    return matches;
}
export function selectNpmPackageForRepo(objects, repo) {
    const matches = matchingPackagesForRepo(objects, repo);
    return matches.find((candidate) => candidate.isDshPlugin)?.name ?? matches[0]?.name ?? null;
}
/** 用 npm search 接口按 repository 地址反查，并做铁证校验（包元数据必须指向该仓库）。
 * 返回：包名 = 命中；null = 200 响应下确认无匹配；undefined = 本次未能确认（网络/超时/解析失败）。 */
function searchRepo(repo, registry) {
    const [owner, name] = repo.split('/');
    if (owner === undefined || name === undefined || name === '')
        return Promise.resolve(null);
    const base = registry === '' ? 'https://registry.npmjs.org' : registry.replace(/\/+$/, '');
    const url = `${base}/-/v1/search?text=${encodeURIComponent(`repository:${owner}/${name}`)}&size=${SEARCH_RESULT_LIMIT}`;
    return new Promise((resolve) => {
        const req = get(url, { timeout: REQUEST_TIMEOUT_MS }, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                resolve(undefined);
                return;
            }
            let body = '';
            res.on('data', (chunk) => { body += chunk.toString(); });
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    resolve(selectNpmPackageForRepo(data.objects ?? [], `${owner}/${name}`));
                }
                catch {
                    resolve(undefined);
                }
            });
        });
        req.on('timeout', () => req.destroy());
        req.on('error', () => resolve(undefined));
    });
}
