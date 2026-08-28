/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 本机 npm 环境检测：判断一次安装失败是否源于「本机 npm 版本过低」。
 *
 * 背景：pnpm 在 git 源插件的 prepare 阶段会调 npm 装依赖，npm arborist 在解 peer 依赖时
 * 有已知内部崩溃 —— `Cannot read properties of null (reading 'edgesOut')`（build-ideal-tree.js
 * 的 #loadPeerSet），官方标记 Cannot Reproduce（npm/cli#8261、#9787），npm 11.6.0 起不再复现。
 * 该报错会被 pnpm 包进 ERR_PNPM_PREPARE_PACKAGE 输出，若按插件打包问题引导提 Issue 就误导了用户。
 *
 * 这里的 `npmTooLowMarker` 是纯函数（输出文本 + 环境 → 标记行或 null），不触碰任务/队列，
 * 由调用方（task-queue.ts）负责把标记追加到任务输出；spawn 读 npm 版本是唯一副作用，独立可测。
 */
import { spawnSync } from 'node:child_process';
/** npm arborist 内部崩溃特征：`Cannot read properties of null (reading 'edgesOut')`。 */
export const NPM_CRASH_EDGES_OUT_RE = /Cannot read properties of null \(reading 'edgesOut'\)|edgesOut/i;
/** 该缺陷在 npm 11.6.0 起不再复现；低于此版本遇到 edgesOut 崩溃即判「本机 npm 版本过低」。 */
export const NPM_MIN_VERSION = [11, 6, 0];
/** 读本机 npm 版本（major.minor.patch）；npm 不在 PATH 或执行失败/超时时返回 null（不妄下结论）。 */
export function npmVersionOf(env) {
    try {
        // Windows 下 npm 是 npm.cmd：spawn 直接 exec 会拒绝，须 shell:true 解析（与 task-queue 的 useShell 一致）
        const res = spawnSync('npm', ['-v'], { env, encoding: 'utf8', timeout: 10_000, stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32' });
        if (res.error !== undefined || res.status !== 0)
            return null;
        const m = /(\d+)\.(\d+)\.(\d+)/.exec(res.stdout ?? '');
        return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
    }
    catch {
        return null;
    }
}
function belowMin(v) {
    for (let i = 0; i < NPM_MIN_VERSION.length; i++) {
        if (v[i] < NPM_MIN_VERSION[i])
            return true;
        if (v[i] > NPM_MIN_VERSION[i])
            return false;
    }
    return false;
}
/**
 * 安装失败输出含 npm arborist edgesOut 崩溃特征，且本机 npm 版本低于阈值时，返回
 * `[npm-too-low] npm@X.Y.Z …` 标记行；否则返回 null。前端据此展示「本机 npm 版本过低」
 * 的准确原因，避免该报错被误判成插件打包/分发问题。
 */
export function npmTooLowMarker(output, env) {
    if (!NPM_CRASH_EDGES_OUT_RE.test(output))
        return null;
    const v = npmVersionOf(env);
    if (v === null || !belowMin(v))
        return null;
    return `[npm-too-low] npm@${v.join('.')} — npm arborist crashed while resolving peer deps ('edgesOut'); local npm is below ${NPM_MIN_VERSION.join('.')}; upgrade npm (npm install -g npm@latest) and retry`;
}
