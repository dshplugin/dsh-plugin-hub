/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * npm 包校验：确认某个 npm 包确实属于该 GitHub 仓库、且声明为 DSH 插件
 * （包元数据里的 repository 指向该仓库，并带 `dsh-plugin` 关键词或 `dsh` manifest）。
 *
 * 这是通用机制，不针对任何具体插件：只要作者发布了 repository 指向该
 * GitHub 仓库的 npm 包（scope 名与 GitHub 用户名是否一致无所谓），就能命中。
 */
import { get } from 'node:https';
import { githubRepoOf } from '../profile/profile.js';
import { finalUrl } from '../probe.js';
/** 单次 registry 查询超时（ms）：慢网络下失败返回 false，不阻塞安装流程。 */
const REQUEST_TIMEOUT_MS = 8000;
/** 从包元数据取 repository 地址：字符串或 `{ url }` 对象，缺省回退 search 结果的 links.repository。 */
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
/**
 * 校验包名对应的 npm 包确实属于该仓库且声明为 DSH 插件：取 registry 上的 `latest`
 * 元数据比对 repository 与插件标记。网络异常、超时、非 200 一律返回 false，不阻塞调用方。
 */
export function isDshNpmPackageForRepo(packageName, repo, registry = '', proxy = '') {
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
                void (async () => {
                    try {
                        const pkg = JSON.parse(body);
                        if (isDshPackageMetadataForRepo(pkg, repo)) {
                            resolve(true);
                            return;
                        }
                        // 仓库改名后包元数据指向新名：按原名不匹配时，用 GitHub 跳转后的规范名复核一次
                        const canonical = await canonicalRepo(repo, proxy);
                        resolve(canonical !== '' && isDshPackageMetadataForRepo(pkg, canonical));
                    }
                    catch {
                        resolve(false);
                    }
                })();
            });
        });
        req.on('timeout', () => req.destroy());
        req.on('error', () => resolve(false));
    });
}
/**
 * 解析仓库改名后的规范 `owner/repo`：GitHub 对已改名仓库返回 301，跟随跳转取最终地址。
 * 与其它 GitHub 访问同一套规则走 curl + 代理 env（Node 内置 https 读不到系统代理）。
 * 未改名、仓库不存在、网络失败或 curl 不可用都返回 ''，调用方按原名继续。
 */
async function canonicalRepo(repo, proxy) {
    if (githubRepoOf(repo) === null)
        return '';
    const key = repo.toLowerCase();
    const final = await finalUrl(`https://github.com/${repo}`, proxy, REQUEST_TIMEOUT_MS);
    const canonical = final === null ? null : githubRepoOf(final);
    return canonical !== null && canonical.toLowerCase() !== key ? canonical : '';
}
