/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 失败回捞：DSH 有时只把一行摘要（`dsh: plugin command failed; diagnostics: <path>`）
 * 回显到控制台，真正的 pnpm 报错写进该路径的 operation 日志。这里从输出里解析出该路径
 * 并读取其尾部，补进失败信息 —— 否则前端拿不到任何错误特征，只能把失败归为「未知」。
 * 只允许读 profile 目录下的 pnpm.log（dsh 自己的 operation 日志），
 * 防止插件把任意路径打印进日志造成越权读取；任何异常都降级为 null，
 * 不改变原有失败处理。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join, resolve, sep } from 'node:path';
import { CAPTURE_LIMIT_BYTES } from './install-types.js';
/** 去掉 ANSI 颜色码：宿主的摘要行可能带终端着色，直接匹配路径会失败。 */
function stripAnsi(text) {
    return text.replace(/\x1b\[[0-9;]*m/g, '');
}
/**
 * 从 DSH 输出里解析 operation 日志路径（`diagnostics: <path>`）。
 * 去掉首尾引号与句末标点（不同版本/语言的摘要行尾部可能带 `。`、`.`、`)`）；
 * 相对路径原样返回，由读取方按 profile 目录解析。
 */
export function operationLogPathOf(output) {
    for (const raw of output.split(/\r?\n/)) {
        // 兼容纯文本与 JSON 包裹两种形态：`diagnostics: <path>` / `"diagnostics": "<path>"}`
        const m = /"?diagnostics"?\s*:\s*(.+)$/i.exec(stripAnsi(raw).trim());
        if (m === null)
            continue;
        let path = m[1]
            .trim()
            .replace(/[.,;:，。；、)\]}]+$/, '')
            .trim();
        // JSON 形态：引号包裹且反斜杠被转义过，按字符串字面量还原；普通文本里的引号直接剥掉
        if (path.startsWith('"') && path.endsWith('"')) {
            try {
                const parsed = JSON.parse(path);
                if (typeof parsed === 'string')
                    path = parsed;
            }
            catch {
                path = path.slice(1, -1);
            }
        }
        path = path.trim();
        // URL 不是本地日志：避免把网络地址当文件读
        if (/^[a-z][a-z0-9+.-]*:\/\//i.test(path))
            continue;
        if (path.toLowerCase().endsWith('pnpm.log'))
            return path;
    }
    return null;
}
/**
 * 只允许读 profile 目录下的 pnpm.log（dsh 自己的操作日志）：
 * 绝对路径必须落在该目录内，相对路径按该目录解析。
 * 未提供 profileDir 时退回旧规则（路径须含 .plugin-manager），防止插件打印任意路径造成越权读取。
 */
function allowedLogPath(raw, profileDir) {
    const path = resolve(profileDir ?? '', raw);
    if (basename(path).toLowerCase() !== 'pnpm.log')
        return null;
    if (profileDir === undefined)
        return path.includes('.plugin-manager') ? path : null;
    const root = resolve(profileDir);
    return path.startsWith(`${root}${sep}`) ? path : null;
}
/**
 * 回捞 operation 日志尾部，作为失败详情返回；拿不到（无路径 / 文件不存在 / 读失败 /
 * 内容为空 / 路径越界）返回 null。尾部截到与子进程输出相同的上限。
 */
export function backfillOperationLog(output, profileDir) {
    const raw = operationLogPathOf(output);
    if (raw === null)
        return null;
    const path = allowedLogPath(raw, profileDir);
    if (path === null)
        return null;
    try {
        const text = readFileSync(path, 'utf8').trim();
        if (text === '')
            return null;
        return text.length > CAPTURE_LIMIT_BYTES ? text.slice(-CAPTURE_LIMIT_BYTES) : text;
    }
    catch {
        return null;
    }
}
/** 本队列自己打的标记行（退出、渠道、超时、回捞…）：不含任何可排查信息。 */
const SELF_MARKER_RE = /^\[(?:exit\b|timed out\]|install-channel\]|stale pipe\]|error\]|pnpm log\]|registry-fallback\]|allow build\])/;
/** 外层包装行：`Command failed with exit code 1: pnpm add x` 只说明「子进程非零退出」，不含 pnpm 原因。
 *  宿主摘要（`dsh: plugin command failed; diagnostics: <path>`）另算：带路径的那行是回捞证据，不是噪音。 */
const WRAPPER_LINE_RE = /^Command failed with exit code \d+/i;
/**
 * 输出里是否有 dsh 自己的内容 —— 只有 `[exit N]`、`[install-channel]`、`[timed out]`
 * 这类本队列自己打的标记时返回 false。用于把「宿主什么都没回显」的失败显式留痕，
 * 否则上报正文只剩退出码，无从排查。
 */
export function hasSubstantiveOutput(output) {
    return output.split(/\r?\n/).some((raw) => {
        const line = raw.trim();
        return line !== '' && !SELF_MARKER_RE.test(line);
    });
}
/**
 * 失败输出里除包装噪声外没有任何可排查内容：只剩本队列标记，和
 * `Command failed with exit code N: pnpm add …` 这类外层包装（#6118 的形态 ——
 * pnpm 以 1 退出、operation 日志里只有这一行）。此时上报正文只会写出「安装失败」，
 * 作者与维护者都无从判断，调用方据此补一条带启动参数的诊断标记。
 */
export function lacksDiagnosticContent(output) {
    return output.split(/\r?\n/).every((raw) => {
        const line = raw.trim();
        return line === '' || SELF_MARKER_RE.test(line) || WRAPPER_LINE_RE.test(line);
    });
}
/**
 * 运行期抓取：宿主的 operation 日志只在命令运行期间存在，结束后可能被清理，
 * 退出后再按路径读往往已经拿不到。这里在安装过程中轮询 profile 下最新的
 * `.plugin-manager/logs/<operation>/pnpm.log`，用抓到的内容补全。
 * 只认本次运行产生的新文件（mtime 晚于启动基线），避免复述上一次安装的日志。
 */
export function createOperationLogTap(profileDir) {
    const logsDir = join(profileDir, '.plugin-manager', 'logs');
    const newestLog = () => {
        let newest = null;
        for (const entry of readdirSync(logsDir, { withFileTypes: true })) {
            if (!entry.isDirectory())
                continue;
            const file = join(logsDir, entry.name, 'pnpm.log');
            try {
                const mtimeMs = statSync(file).mtimeMs;
                if (newest === null || mtimeMs > newest.mtimeMs)
                    newest = { file, mtimeMs };
            }
            catch { /* 该 operation 还没有 pnpm.log */ }
        }
        return newest;
    };
    let baselineMs = 0;
    try {
        baselineMs = newestLog()?.mtimeMs ?? 0;
    }
    catch { /* logs 目录还不存在 */ }
    let captured = '';
    const tick = () => {
        try {
            const newest = newestLog();
            if (newest === null || newest.mtimeMs <= baselineMs)
                return;
            const text = readFileSync(newest.file, 'utf8');
            if (text.length > captured.length)
                captured = text;
        }
        catch { /* 读不到就放弃这一轮 */ }
    };
    const timer = setInterval(tick, 700);
    timer.unref();
    tick();
    return {
        stop: () => {
            clearInterval(timer);
            tick();
            return captured.length > CAPTURE_LIMIT_BYTES ? captured.slice(-CAPTURE_LIMIT_BYTES) : captured;
        },
    };
}
