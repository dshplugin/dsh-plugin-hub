/**
 * 后台安装/卸载任务队列：内存任务注册表 + FIFO 串行 worker + 子进程生命周期管理。
 * 每个任务一次 `dsh plugin --profile <profile> <action> <target>` 子进程，
 * 输出流式收集到任务上；卸载成功时尝试从运行中 loader 即时停用（见 loader.ts）。
 */
import { spawn } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { CAPTURE_LIMIT_BYTES, MAX_TASKS, MAX_TASK_LINES } from './install-types.js';
import { cleanLine, estimateProgress } from './progress.js';
import { removeLoadedEntry } from './loader.js';
import { addPendingRestart, clearPendingRestart } from './pending-restart.js';
import { addAllowBuildsKey, parseAllowBuildsKey, profileDirectory } from './profile.js';
/** In-memory task registry, keyed by task id. */
const tasks = new Map();
let nextTaskId = 1;
/** Pending tasks awaiting their turn (FIFO). The queue worker runs at most one mutation at a time. */
const queue = [];
/** Child processes of currently running tasks (for cancel). */
const runningChildren = new Map();
/** Snapshot of a task (keeps the live object untouched by consumers). */
export function getTask(id) {
    const task = tasks.get(id);
    if (!task)
        return undefined;
    return { ...task, lines: task.lines.slice(0, MAX_TASK_LINES) };
}
/** All non-terminal tasks in queue order (running first, then pending). Lets the client resume a queue after a page reload. */
export function activeTask() {
    const found = [];
    for (const item of queue) {
        const task = item.task;
        if (task.status === 'pending') {
            found.push({ id: task.id, target: task.target, action: task.action, status: 'pending', progress: task.progress, lines: task.lines.slice(0, MAX_TASK_LINES) });
        }
    }
    tasks.forEach((task) => {
        if (task.status === 'running') {
            found.unshift({ id: task.id, target: task.target, action: task.action, status: 'running', progress: task.progress, lines: task.lines.slice(0, MAX_TASK_LINES) });
        }
    });
    return found;
}
/**
 * True while a mutation child process is still alive. The concurrent slot is
 * keyed off the live child set rather than task.status: cancelling a running
 * task flips its status immediately, but the child may still be shutting down
 * (the close event lands later) — the slot must stay held until then, otherwise
 * a new task would start while the old pnpm still runs in the same profile dir.
 */
export function hasRunningTask() {
    return runningChildren.size > 0;
}
/** Whether the target already has a non-terminal task in the queue (install/uninstall dedupe). */
export function hasQueuedTarget(target) {
    return queue.some((it) => it.task.target === target && (it.task.status === 'pending' || it.task.status === 'running'));
}
/**
 * Cancel a queued or running task.
 * - pending: removed from the queue immediately (never spawned).
 * - running: kills the child process; the queue worker then picks the next one.
 * Returns false when the task is unknown or already finished.
 */
export function cancelTask(id) {
    const task = tasks.get(id);
    if (!task)
        return false;
    if (task.status === 'pending') {
        const index = queue.findIndex((it) => it.task === task);
        if (index >= 0)
            queue.splice(index, 1);
        task.status = 'cancelled';
        pushLine(task, '[cancelled]');
        return true;
    }
    if (task.status === 'running') {
        task.status = 'cancelled';
        pushLine(task, '[cancelled]');
        const child = runningChildren.get(id);
        if (child)
            stopChild(child);
        return true;
    }
    return false;
}
function pushLine(task, line) {
    const text = cleanLine(line);
    // pnpm 的 `Progress:` 行用 \r 原地刷新同一行：内容一变化就追加，
    // 日志像终端一样实时滚动（downloaded 0→1→2…）；内容与最新一条完全相同则跳过，
    // 避免同一进度反复刷新时无意义的重复堆积
    if (text !== task.lines[0]) {
        task.lines.unshift(text);
        if (task.lines.length > MAX_TASK_LINES)
            task.lines.length = MAX_TASK_LINES;
    }
    const estimate = estimateProgress(text);
    if (estimate > 0) {
        task.progress = Math.max(task.progress, estimate);
    }
    else if (task.status === 'running' && task.progress < 85) {
        // 兜底：行无解析格式也随输出量推进，保证进度条始终在动（不会卡在 0）
        task.progress = Math.max(task.progress, 6 + Math.min(79, task.lines.length * 2));
    }
}
function cliInvocation() {
    const entry = process.argv[1];
    if (entry !== undefined && /[\\/](?:bin\.(?:js|ts)|dsh)$/.test(entry)) {
        const absoluteEntry = resolve(entry);
        return {
            file: process.execPath,
            prefixArgs: [...process.execArgv, absoluteEntry],
            cwd: dirname(absoluteEntry),
            useShell: false,
        };
    }
    return { file: 'dsh', prefixArgs: [], cwd: process.cwd(), useShell: process.platform === 'win32' };
}
function stopChild(child) {
    if (process.platform === 'win32' && child.pid !== undefined) {
        const killer = spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' });
        killer.once('error', () => child.kill('SIGKILL'));
        return;
    }
    if (child.pid !== undefined) {
        // POSIX：dsh 内部会 fork pnpm，只杀 dsh 会让 pnpm 变成孤儿继续攥着管道，
        // close 事件永不到来、队列卡死。detached 让子进程成为进程组组长，
        // 对整组 SIGKILL 才能把 dsh + pnpm（及后代）一起清掉，close 随即触发。
        try {
            process.kill(-child.pid, 'SIGKILL');
            return;
        }
        catch { /* 进程已退出：忽略 */ }
    }
    child.kill('SIGKILL');
}
/**
 * Enqueue a plugin mutation and return its task. Tasks run strictly serially:
 * the queue worker starts the next one only after the previous finishes.
 * Progress is visible through `getTask(id)` / `activeTask()` until done.
 */
export function startPluginMutation(options) {
    const task = { id: nextTaskId, target: options.target, action: options.action, status: 'pending', timedOut: false, exitCode: null, progress: 0, lines: [] };
    nextTaskId = nextTaskId >= Number.MAX_SAFE_INTEGER ? 1 : nextTaskId + 1;
    tasks.set(task.id, task);
    if (tasks.size > MAX_TASKS) {
        let removed = false;
        tasks.forEach((candidate, id) => {
            if (!removed && candidate.status !== 'running' && candidate.status !== 'pending') {
                tasks.delete(id);
                removed = true;
            }
        });
    }
    queue.push({ task, options: { ...options } });
    pumpQueue();
    return task;
}
/** Queue worker: at most one mutation runs at a time; pick the next pending task when the slot frees up. */
function pumpQueue() {
    if (hasRunningTask())
        return;
    const item = queue.find((it) => it.task.status === 'pending');
    if (!item)
        return;
    const { task, options } = item;
    task.status = 'running';
    void runPluginMutation({ ...options, task }).finally(() => {
        runningChildren.delete(task.id);
        // 已终态的任务移出队列：既防 queue 数组无限增长（内存泄漏），也让下一轮 pump 干净
        const idx = queue.findIndex((it) => it.task === task);
        if (idx >= 0)
            queue.splice(idx, 1);
        pumpQueue();
    });
}
/**
 * Run one `dsh plugin --profile <profile> <action> <target>` spawn, stream
 * its output onto the tracked task and resolve with the captured result.
 * Never rejects; failures surface through the result / task state.
 */
function spawnMutation(options) {
    const { action, profile, target, timeoutMs = 5 * 60 * 1000, env, task, displayTarget, uninstallLoader } = options;
    const invocation = cliInvocation();
    const args = [...invocation.prefixArgs, 'plugin', '--profile', profile, action, target];
    return new Promise((resolvePromise) => {
        let stdout = '';
        let stderr = '';
        let timedOut = false;
        let settled = false;
        let child;
        try {
            child = spawn(invocation.file, args, {
                cwd: invocation.cwd,
                env,
                shell: invocation.useShell,
                // detached 使子进程成为独立进程组组长：取消时能整组清理（见 stopChild），
                // 且宿主进程崩溃后安装任务不会被连带误杀
                detached: true,
                stdio: ['ignore', 'pipe', 'pipe'],
            });
        }
        catch (error) {
            if (task) {
                task.status = 'failed';
                task.exitCode = null;
                pushLine(task, `[error] ${error instanceof Error ? error.message : String(error)}`);
            }
            resolvePromise({
                exitCode: null,
                timedOut: false,
                error: error instanceof Error ? error.message : String(error),
                stdout,
                stderr,
            });
            return;
        }
        if (task)
            runningChildren.set(task.id, child);
        // 兜底定时器句柄：整段超时 / exit 后 close 宽限 / 强制收尾
        let timer;
        let progressTimer;
        let exitWatch;
        let forceSettle;
        // 唯一收尾入口：close / error / 兜底超时 三者只放行一次，
        // 保证 runPluginMutation 必然 resolve、队列 worker 必然继续推进
        const settle = (result) => {
            if (settled)
                return;
            settled = true;
            if (timer !== undefined)
                clearTimeout(timer);
            if (progressTimer !== undefined)
                clearInterval(progressTimer);
            if (exitWatch !== undefined)
                clearTimeout(exitWatch);
            if (forceSettle !== undefined)
                clearTimeout(forceSettle);
            if (task)
                runningChildren.delete(task.id);
            resolvePromise(result);
        };
        timer = setTimeout(() => {
            timedOut = true;
            stopChild(child);
        }, timeoutMs);
        // 时间兜底：即使 CLI 静默不吐进度行，进度条也单调推进，不会卡在 0
        progressTimer = setInterval(() => {
            if (task && task.status === 'running' && task.progress < 85)
                task.progress += 1;
        }, 500);
        const collect = (kind, chunk) => {
            const text = chunk.toString();
            if (kind === 'stdout')
                stdout = (stdout + text).slice(-CAPTURE_LIMIT_BYTES);
            else
                stderr = (stderr + text).slice(-CAPTURE_LIMIT_BYTES);
            if (task) {
                // 原生透传 pnpm 输出：stdout/stderr 原样入日志，不做格式化，保证报错信息完整可见
                for (const line of text.split(/\r?\n|\r/)) {
                    if (line.trim() !== '')
                        pushLine(task, line.trimEnd());
                }
            }
        };
        child.stdout?.on('data', (chunk) => collect('stdout', chunk));
        child.stderr?.on('data', (chunk) => collect('stderr', chunk));
        child.once('exit', () => {
            // dsh 内部会 fork pnpm：pnpm 退出后仍攥着 stdout/stderr 管道时，
            // close 事件永不到来（历史队列卡死根因——取消路径曾因此卡死，用整组 SIGKILL 解决；
            // 自然失败路径没有兜底）。exit 后给 close 一段宽限，未按时触发则整组清理强制结束，
            // 保证任务必然进入终态、后续排队任务自动启动。
            exitWatch = setTimeout(() => {
                if (settled)
                    return;
                if (task && task.status !== 'cancelled')
                    pushLine(task, '[stale pipe] force closing child');
                stopChild(child);
                // 清理后极端情况下 close 仍未触发（kill 失败）：再兜底强制收尾
                forceSettle = setTimeout(() => {
                    if (settled)
                        return;
                    if (task && task.status !== 'cancelled') {
                        task.status = 'failed';
                        task.exitCode = null;
                        task.timedOut = true;
                        pushLine(task, '[timed out]');
                    }
                    settle({ exitCode: null, timedOut: true, error: 'child failed to close', stdout, stderr });
                }, 5_000);
            }, 3_000);
        });
        child.once('error', (error) => {
            if (task && task.status !== 'cancelled') {
                task.status = 'failed';
                task.exitCode = null;
                pushLine(task, `[error] ${error.message}`);
            }
            settle({ exitCode: null, timedOut: false, error: error.message, stdout, stderr });
        });
        child.once('close', async (code) => {
            try {
                if (task) {
                    task.exitCode = code;
                    task.timedOut = timedOut;
                    if (task.status !== 'cancelled') {
                        task.status = timedOut || code !== 0 ? 'failed' : 'done';
                        if (task.status === 'done') {
                            task.progress = 100;
                            if (action === 'remove' && uninstallLoader) {
                                // 卸载成功 → 主动从运行中 loader 移除该包条目，立即生效、无需重启；
                                // 移除失败（或从未加载过但 loader 不可用）才登记「待重启清理」兜底
                                const removed = await removeLoadedEntry(uninstallLoader, target);
                                if (removed)
                                    clearPendingRestart(displayTarget ?? target);
                                else
                                    addPendingRestart(displayTarget ?? target, 'uninstall');
                            }
                            else {
                                // 安装成功（或卸载但无 loader 引用）→ 登记待重启：
                                // 插件要宿主重启才会挂载/卸载干净，重启前一直提醒；展示目标用 displayTarget（owner/repo）
                                addPendingRestart(displayTarget ?? target, action === 'add' ? 'install' : 'uninstall');
                            }
                        }
                        pushLine(task, timedOut ? '[timed out]' : `[exit ${code ?? '?'}]`);
                    }
                }
            }
            finally {
                settle({ exitCode: code, timedOut, error: null, stdout, stderr });
            }
        });
    });
}
/**
 * 安装后校验已装包的入口文件（package.json 的 main / exports["."].default）是否真实存在。
 * git: 分发常不提交构建产物（lib/ 等），pnpm 装完没有报错，但宿主重启加载插件树时会
 * ERR_MODULE_NOT_FOUND 直接崩溃、网页打不开 —— 这里在登记「待重启」前就把这类残缺包拦下。
 * 返回 { name, missing }：name 为空表示无法定位目标包（跳过校验）；missing 为缺失的入口路径。
 */
export function verifyInstalledEntry(profile, target) {
    let profilePkg = null;
    try {
        profilePkg = JSON.parse(readFileSync(join(profileDirectory(profile), 'package.json'), 'utf8'));
    }
    catch {
        return { name: null, missing: null };
    }
    const deps = (profilePkg?.dependencies ?? {});
    // target 自身是依赖名（npm 包），或通过 github: specifier 反查依赖名
    const name = deps[target] !== undefined ? target : Object.keys(deps).find((k) => deps[k] === target);
    if (!name)
        return { name: null, missing: null };
    const pkgDir = join(profileDirectory(profile), 'node_modules', name);
    let entry = null;
    try {
        const meta = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
        const dot = meta.exports?.['.'];
        const resolved = typeof dot === 'string' ? dot
            : dot !== null && typeof dot === 'object'
                ? dot.default
                : undefined;
        entry = typeof resolved === 'string' ? resolved : typeof meta.main === 'string' ? meta.main : 'index.js';
    }
    catch {
        return { name, missing: null };
    }
    try {
        return { name, missing: statSync(join(pkgDir, entry)).isFile() ? null : entry };
    }
    catch {
        return { name, missing: entry };
    }
}
/**
 * Run a plugin mutation with one recovery path: when `add` fails because a
 * git-hosted package's `prepare` script is blocked by pnpm's allowBuilds
 * gate (`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`), read the exact allowlist
 * key pnpm printed, write it into the profile's pnpm-workspace.yaml, and
 * retry once. Other failures fall through to the single-spawn result.
 */
export async function runPluginMutation(options) {
    const result = await spawnMutation(options);
    if (options.action === 'add' && result.exitCode !== 0 && !result.timedOut) {
        const output = `${result.stderr}\n${result.stdout}`;
        if (output.includes('ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED')) {
            const key = parseAllowBuildsKey(output);
            if (key !== null) {
                if (options.task) {
                    // First attempt already marked the task failed; reset it so the
                    // retry streams progress as a running task again.
                    options.task.status = 'running';
                    options.task.exitCode = null;
                    pushLine(options.task, `[allow build] ${key}`);
                }
                addAllowBuildsKey(options.profile, key);
                return spawnMutation(options);
            }
        }
    }
    // pnpm 安装本身成功，但目标包入口文件缺失（git 分发缺构建产物）→ 判为失败：
    // 撤销刚登记的待重启，避免用户重启时宿主加载残缺包直接崩溃
    if (options.action === 'add' && result.exitCode === 0 && !result.timedOut) {
        const verified = verifyInstalledEntry(options.profile, options.target);
        if (verified.name !== null && verified.missing !== null) {
            clearPendingRestart(options.displayTarget ?? options.target);
            const detail = `[packaging] ${verified.name}: entry file missing: ${verified.missing} (git distribution lacks build output — install the npm version or report to the author)`;
            if (options.task && options.task.status !== 'cancelled') {
                options.task.status = 'failed';
                options.task.exitCode = null;
                options.task.progress = 0;
                pushLine(options.task, detail);
            }
            return { exitCode: 1, timedOut: false, error: `entry file missing: ${verified.missing}`, stdout: result.stdout, stderr: `${result.stderr}\n${detail}` };
        }
    }
    return result;
}
