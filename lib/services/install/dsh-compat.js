/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 「插件要求的 DSH 版本高于当前宿主」判定：安装失败后读一次 npm 元数据，取
 * peerDependencies（@deepseek-ai/dsh-*）与 engines.dsh 声明的最低版本里最高的那个，
 * 与宿主版本比较；宿主更低就产出 [dsh-too-old] 标记 —— 前端据此提示「先升级 DSH」，
 * 不再把这类失败归成「未分类」丢给用户或插件作者。
 *
 * 只在失败路径调用：peer 不满足本身通常只是警告，成功安装时不该出现这个提示；
 * 任何网络/解析异常都悄悄返回 null，不改变原有失败处理。
 */
import { hostDshVersion } from '../host-version.js';
/** 从安装目标里取 npm 包名：`@scope/pkg@1.2.3` → `@scope/pkg`。
 *  git / URL / 本地路径等非 npm 目标返回 null。 */
export function npmNameOf(target) {
    const raw = target.trim();
    if (raw === '')
        return null;
    if (/^(?:github:|git\+|https?:|file:|link:|\.{0,2}[\\/])/i.test(raw))
        return null;
    // owner/repo（非 scope）：git 目标的另一种写法，不是包名
    if (!raw.startsWith('@') && /^[^\s@]+\/[^\s]+$/.test(raw))
        return null;
    const at = raw.lastIndexOf('@');
    const name = at > 0 ? raw.slice(0, at) : raw;
    return /^(@[a-z0-9][\w.-]*\/)?[a-z0-9][\w.-]*$/i.test(name) ? name : null;
}
/** `0.2.1-rc.1` / `^0.2.1` / `>=0.2.0 <0.3.0` → [0,2,1]；解析不出返回 null。
 *  只取版本三段：DSH 的 prerelease 序号（rc.1）不参与「太低」判断，避免比较误差。 */
export function versionTriple(raw) {
    const m = /(\d+)\.(\d+)\.(\d+)/.exec(raw);
    return m === null ? null : [Number(m[1]), Number(m[2]), Number(m[3])];
}
function compareTriple(a, b) {
    for (let i = 0; i < 3; i++) {
        if (a[i] !== b[i])
            return a[i] - b[i];
    }
    return 0;
}
/** 插件声明的最低 DSH 版本：engines.dsh 与 peerDependencies 里 @deepseek-ai/dsh-* 的下限取最大。
 *  返回原始声明文本（如 `^0.2.1-rc.1`）供提示直接展示；没有声明返回 null。 */
export function dshFloorOf(manifest) {
    const m = manifest;
    const ranges = [];
    const engineDsh = m?.engines?.dsh;
    if (typeof engineDsh === 'string')
        ranges.push(engineDsh);
    for (const [name, range] of Object.entries(m?.peerDependencies ?? {})) {
        if (/^@deepseek-ai\/dsh(?:-|$)/.test(name) && typeof range === 'string')
            ranges.push(range);
    }
    let floor = null;
    let floorTriple = null;
    for (const range of ranges) {
        const triple = versionTriple(range);
        if (triple === null)
            continue;
        if (floorTriple === null || compareTriple(triple, floorTriple) > 0) {
            floor = range;
            floorTriple = triple;
        }
    }
    return floor;
}
/**
 * 产出「插件要求更高的 DSH」标记行；没有声明、读不到元数据、宿主版本未知或已满足时返回 null。
 * 用版本级 manifest（`/<pkg>/latest`）：packument 的精简形态不带 peerDependencies。
 */
export async function dshTooOldMarker(target, opts = {}) {
    const name = npmNameOf(target);
    if (name === null)
        return null;
    const current = opts.currentVersion ?? hostDshVersion();
    if (current === null)
        return null;
    const currentTriple = versionTriple(current);
    if (currentTriple === null)
        return null;
    const base = (opts.registry ?? 'https://registry.npmjs.org').replace(/\/+$/, '');
    // scope 包的路径要编码：`@scope/name` → `%40scope%2Fname`
    const url = `${base}/${name.replace('@', '%40').replace('/', '%2F')}/latest`;
    let manifest;
    try {
        const res = await (opts.fetchImpl ?? fetch)(url, {
            headers: { accept: 'application/json' },
            signal: AbortSignal.timeout(opts.timeoutMs ?? 4000),
        });
        if (!res.ok)
            return null;
        manifest = await res.json();
    }
    catch {
        return null;
    }
    const floor = dshFloorOf(manifest);
    const floorTriple = floor === null ? null : versionTriple(floor);
    if (floor === null || floorTriple === null)
        return null;
    if (compareTriple(currentTriple, floorTriple) >= 0)
        return null;
    return `[dsh-too-old] ${name} requires DSH >= ${floor} (declared in engines / peerDependencies), but this host runs ${current} — upgrade DSH before installing`;
}
