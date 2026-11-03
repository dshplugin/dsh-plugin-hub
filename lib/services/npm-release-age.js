/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * npm 包最新版本的发布时间查询：为「已安装插件是否有更新」提供发布冷却期依据。
 * pnpm 对发布不满 24h（dsh profile minimumReleaseAge=1440）的版本会不提示地回退到旧版本，
 * 因此发布还不满 24 小时的版本不该提示更新（否则用户点了也装不上）。
 * 结果按包名内存缓存，同一次会话内不重复请求；失败/超时/响应过大一律返回 null，绝不抛错、绝不阻塞。
 */
import { get as httpsGet } from 'node:https';
import { validPackageName } from './profile/profile.js';
import { fetchViaCurl } from './probe.js';
/** pnpm profile 默认 minimumReleaseAge=1440 分钟；+30 分钟缓冲与客户端 release-age 判定同一套规则。 */
export const MIN_RELEASE_AGE_MS = 24 * 60 * 60 * 1000 + 30 * 60 * 1000;
/** 请求体包名数量上限：只为已安装插件按需查询，几十个足矣，封顶防滥用。 */
export const MAX_RELEASE_AGE_PACKAGES = 50;
/** 单包查询超时（ms）：慢网络下失败即返回 null，不拖住整个响应。 */
export const RELEASE_AGE_TIMEOUT_MS = 8000;
/** 响应体上限：完整 packument 可能达数 MB，超限直接放弃，避免异常大包拖垮服务。 */
const MAX_PACKUMENT_BYTES = 10 * 1024 * 1024;
export const DEFAULT_NPM_REGISTRY = 'https://registry.npmjs.org';
/** 会话内缓存（源 + 包名 → 结果）：只存成功结果，一次网络抖动不会把判断永久粘住。
 *  必须带过期时间 —— 插件中心可能连续开着几小时，作者发了新版本后不能一直沿用旧结果；
 *  也必须把源算进键 —— 同一个包在官方源与镜像上的 latest / 发布时间不同，混用会算错冷却期。 */
const CACHE_TTL_MS = 10 * 60 * 1000;
const releaseCache = new Map();
/** 从完整 packument 取 dist-tags.latest 对应版本及其发布时间；缺任一字段返回 null。 */
export function latestReleaseOf(packument) {
    if (packument === null || typeof packument !== 'object')
        return null;
    const doc = packument;
    const tags = doc['dist-tags'];
    const version = tags !== null && typeof tags === 'object' ? tags.latest : undefined;
    if (typeof version !== 'string' || version === '')
        return null;
    const time = doc.time;
    const publishedAt = time !== null && typeof time === 'object' ? time[version] : undefined;
    if (typeof publishedAt !== 'string' || publishedAt === '')
        return null;
    return { version, publishedAt };
}
/**
 * 已过发布冷却期的最高稳定版本：安装锁定它，pnpm 不会回退到旧版本。
 * 只看纯 x.y.z（预发布版不参与，避免把用户带到不兼容预览版）；时间表缺失或无满足项返回 null。
 */
export function installableReleaseOf(packument, now = Date.now()) {
    if (packument === null || typeof packument !== 'object')
        return null;
    const time = packument.time;
    if (time === null || typeof time !== 'object')
        return null;
    let best = null;
    for (const [version, published] of Object.entries(time)) {
        if (!/^\d+\.\d+\.\d+$/.test(version) || typeof published !== 'string')
            continue;
        const at = Date.parse(published);
        if (Number.isNaN(at) || now - at < MIN_RELEASE_AGE_MS)
            continue;
        if (best === null || compareVersion(version, best.version) > 0)
            best = { version, publishedAt: published };
    }
    return best;
}
/** 纯数字段版本比较（installableReleaseOf 只在 x.y.z 里用）。 */
function compareVersion(a, b) {
    const pa = a.split('.');
    const pb = b.split('.');
    for (let i = 0; i < 3; i++) {
        const d = Number.parseInt(pa[i] ?? '0', 10) - Number.parseInt(pb[i] ?? '0', 10);
        if (d !== 0)
            return d;
    }
    return 0;
}
/** 请求体 → 去重后的合法包名列表；非数组 / 超量 / 含非法包名一律 null（拒绝非法输入）。 */
export function parseReleaseAgeRequest(body) {
    if (body === null || typeof body !== 'object')
        return null;
    const raw = body.packages;
    if (!Array.isArray(raw) || raw.length > MAX_RELEASE_AGE_PACKAGES)
        return null;
    const names = new Set();
    for (const item of raw) {
        if (typeof item !== 'string' || item === '' || item.startsWith('-') || !validPackageName(item))
            return null;
        names.add(item);
    }
    return [...names];
}
/** node:https 直连 GET，仅接受 200；超时/超限/网络失败返回 null。 */
function getJson(url, timeoutMs) {
    return new Promise((resolve) => {
        let done = false;
        const finish = (value) => { if (!done) {
            done = true;
            resolve(value);
        } };
        const req = httpsGet(url, { timeout: timeoutMs, headers: { accept: 'application/json' } }, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                finish(null);
                return;
            }
            const declared = Number(res.headers['content-length']);
            if (Number.isFinite(declared) && declared > MAX_PACKUMENT_BYTES) {
                res.destroy();
                finish(null);
                return;
            }
            let body = '';
            let bytes = 0;
            res.on('data', (chunk) => {
                bytes += chunk.length;
                if (bytes > MAX_PACKUMENT_BYTES) {
                    res.destroy();
                    finish(null);
                    return;
                }
                body += chunk.toString();
            });
            res.on('end', () => finish(body));
            res.on('error', () => finish(null));
        });
        req.on('timeout', () => req.destroy());
        req.on('error', () => finish(null));
    });
}
/** 拉取一个包的完整 packument 正文；配了代理时复用与安装/目录同一套代理规则（curl 子进程注入 proxy env）。 */
async function fetchPackument(url, proxy, timeoutMs) {
    if (proxy !== '') {
        const r = await fetchViaCurl(url, proxy, timeoutMs);
        return r.ok && r.body !== '' && Buffer.byteLength(r.body) <= MAX_PACKUMENT_BYTES ? r.body : null;
    }
    return getJson(url, timeoutMs);
}
/** 查询一个包的最新版本、发布时间与可锁定的安装版本（成功结果按源缓存 10 分钟）；registry 为空回退官方源，失败返回 null。 */
export async function lookupReleaseAge(packageName, registry, proxy, timeoutMs = RELEASE_AGE_TIMEOUT_MS) {
    const base = registry.replace(/\/+$/, '') || DEFAULT_NPM_REGISTRY;
    const key = `${base}\n${packageName}`;
    const cached = releaseCache.get(key);
    if (cached !== undefined && Date.now() - cached.at < CACHE_TTL_MS)
        return cached.release;
    const body = await fetchPackument(`${base}/${encodeURIComponent(packageName)}`, proxy, timeoutMs);
    if (body === null)
        return null;
    let parsed;
    try {
        parsed = JSON.parse(body);
    }
    catch {
        return null;
    }
    const latest = latestReleaseOf(parsed);
    if (latest === null)
        return null;
    const release = { ...latest, installable: installableReleaseOf(parsed) };
    releaseCache.set(key, { at: Date.now(), release });
    return release;
}
