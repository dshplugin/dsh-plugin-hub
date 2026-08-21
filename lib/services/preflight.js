/**
 * 安装前预检：对 `github:` 源的插件，检查其分发（codeload tarball）里是否
 * 真的包含 package.json 声明的入口文件（main / exports["."].default）。
 * git 分发常不提交构建产物（lib/ 等），这类残缺包装完会让宿主重启加载插件树时
 * ERR_MODULE_NOT_FOUND 直接崩溃 —— 预检在动手安装前就把它们拦下，避免白装一次。
 * npm 包信任 registry 的完整性，直接放行；任何无法预检的情况也放行，交给装后
 * 校验（verifyInstalledEntry）兜底，保证预检自身失败不会卡死安装流程。
 */
import { execFile } from 'node:child_process';
import { createWriteStream, mkdtempSync, rmSync } from 'node:fs';
import { get } from 'node:https';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
export async function preflightTarget(target) {
    const m = /^github:([^/]+)\/([^/]+)$/.exec(target);
    if (m === null)
        return { ok: true, missing: null };
    const [, owner, repo] = m;
    let commit = '';
    try {
        const { stdout } = await execFileAsync('git', ['ls-remote', `https://github.com/${owner}/${repo}.git`, 'HEAD']);
        commit = stdout.split(/\s+/)[0] ?? '';
    }
    catch {
        return { ok: true, missing: null };
    }
    if (!commit)
        return { ok: true, missing: null };
    const dir = mkdtempSync(join(tmpdir(), 'dsh-preflight-'));
    try {
        const tar = join(dir, 'pkg.tar.gz');
        await download(`https://codeload.github.com/${owner}/${repo}/tar.gz/${commit}`, tar);
        const meta = await readTarJson(tar, 'package/package.json');
        if (meta === null)
            return { ok: true, missing: null };
        const dot = meta.exports?.['.'];
        const resolved = typeof dot === 'string'
            ? dot
            : dot !== null && typeof dot === 'object'
                ? dot.default
                : undefined;
        const entry = typeof resolved === 'string' ? resolved : typeof meta.main === 'string' ? meta.main : 'index.js';
        const inTar = await hasTarEntry(tar, `package/${entry}`);
        return { ok: inTar, missing: inTar ? null : entry };
    }
    catch {
        return { ok: true, missing: null };
    }
    finally {
        rmSync(dir, { recursive: true, force: true });
    }
}
function download(url, dest) {
    return new Promise((resolve, reject) => {
        get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
                res.resume();
                if (res.headers.location) {
                    void download(res.headers.location, dest).then(resolve, reject);
                    return;
                }
            }
            if (res.statusCode !== 200) {
                res.resume();
                reject(new Error(`download failed: HTTP ${res.statusCode ?? '?'}`));
                return;
            }
            void pipeline(res, createWriteStream(dest)).then(resolve, reject);
        }).on('error', reject);
    });
}
/** 从 tarball 提取并解析一个 JSON 文件；文件不存在或解析失败返回 null。 */
async function readTarJson(tar, entry) {
    try {
        const { stdout } = await execFileAsync('tar', ['-xzOf', tar, entry], { maxBuffer: 4 * 1024 * 1024 });
        return JSON.parse(stdout);
    }
    catch {
        return null;
    }
}
/** 检查 tarball 内是否存在指定 entry。 */
async function hasTarEntry(tar, entry) {
    try {
        const { stdout } = await execFileAsync('tar', ['-tzf', tar, entry], { maxBuffer: 1024 * 1024 });
        return stdout.split(/\r?\n/).some((line) => line === entry);
    }
    catch {
        return false;
    }
}
