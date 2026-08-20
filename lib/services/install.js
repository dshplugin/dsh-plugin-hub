/**
 * Install runner: performs real plugin mutations by spawning the official
 * dsh CLI in a child process. When this plugin runs inside a booted dsh
 * entry (the common case), it reuses that entry via process.argv[1] so the
 * command works even when `dsh` is not on PATH; otherwise it falls back to
 * a plain `dsh` lookup. The child is always spawned asynchronously — never
 * spawnSync — so the harness event loop is never blocked.
 *
 * Mutations run as tracked background tasks: the caller gets a task id
 * immediately, output lines accumulate on the task, and consumers poll
 * `getTask(id)` for progress until the task reaches a terminal state.
 */
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { cleanLine, estimateProgress } from './progress.js';
/** Grammar of an accepted `github:<owner>/<repo>` install target. */
const REPO_RE = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/;
/** Grammar of an npm package name (used for uninstall targets). */
const PACKAGE_RE = /^(?:@[a-z0-9._-]+\/)?[A-Za-z0-9._-]+$/;
const CAPTURE_LIMIT_BYTES = 64 * 1024;
/** Max output lines kept per task (newest wins). */
const MAX_TASK_LINES = 200;
/** Max tracked tasks; oldest finished tasks are dropped first. */
const MAX_TASKS = 50;
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
/** True while any mutation is still running (the queue worker holds the single concurrent slot). */
export function hasRunningTask() {
    let running = false;
    tasks.forEach((task) => {
        if (task.status === 'running')
            running = true;
    });
    return running;
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
    task.lines.unshift(text);
    if (task.lines.length > MAX_TASK_LINES)
        task.lines.length = MAX_TASK_LINES;
    const estimate = estimateProgress(text);
    if (estimate > 0) {
        task.progress = Math.max(task.progress, estimate);
    }
    else if (task.status === 'running' && task.progress < 85) {
        // 兜底：行无解析格式也随输出量推进，保证进度条始终在动（不会卡在 0）
        task.progress = Math.max(task.progress, 6 + Math.min(79, task.lines.length * 2));
    }
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
/** Resolve the active profile from the booted CLI args, falling back to `web`. */
export function readProfileArg(fallback = 'web') {
    const index = process.argv.indexOf('--profile');
    const candidate = index >= 0 ? process.argv[index + 1] : undefined;
    return candidate !== undefined && !candidate.startsWith('-') ? candidate : fallback;
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
        pumpQueue();
    });
}
/**
 * Run `dsh plugin --profile <profile> <action> <target>`, stream its output
 * onto the tracked task and resolve with the captured result. Never rejects;
 * failures surface through the result / task state.
 */
export function runPluginMutation(options) {
    const { action, profile, target, timeoutMs = 5 * 60 * 1000, env, task } = options;
    const invocation = cliInvocation();
    const args = [...invocation.prefixArgs, 'plugin', '--profile', profile, action, target];
    return new Promise((resolvePromise) => {
        let stdout = '';
        let stderr = '';
        let timedOut = false;
        let child;
        try {
            child = spawn(invocation.file, args, {
                cwd: invocation.cwd,
                env,
                shell: invocation.useShell,
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
        const timer = setTimeout(() => {
            timedOut = true;
            stopChild(child);
        }, timeoutMs);
        // 时间兜底：即使 CLI 静默不吐进度行，进度条也单调推进，不会卡在 0
        const progressTimer = setInterval(() => {
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
                // pnpm 的 `Progress:` 行用 \r 原地刷新，需同时按 \r 与 \n 分块
                for (const line of text.split(/\r?\n|\r/)) {
                    if (line.trim() !== '')
                        pushLine(task, `${kind === 'stderr' ? '[err] ' : ''}${line.trimEnd()}`);
                }
            }
        };
        child.stdout?.on('data', (chunk) => collect('stdout', chunk));
        child.stderr?.on('data', (chunk) => collect('stderr', chunk));
        child.once('error', (error) => {
            clearTimeout(timer);
            clearInterval(progressTimer);
            if (task)
                runningChildren.delete(task.id);
            if (task && task.status !== 'cancelled') {
                task.status = 'failed';
                task.exitCode = null;
                pushLine(task, `[error] ${error.message}`);
            }
            resolvePromise({ exitCode: null, timedOut: false, error: error.message, stdout, stderr });
        });
        child.once('close', (code) => {
            clearTimeout(timer);
            clearInterval(progressTimer);
            if (task)
                runningChildren.delete(task.id);
            if (task) {
                task.exitCode = code;
                task.timedOut = timedOut;
                if (task.status !== 'cancelled') {
                    task.status = timedOut || code !== 0 ? 'failed' : 'done';
                    if (task.status === 'done')
                        task.progress = 100;
                    pushLine(task, timedOut ? '[timed out]' : `[exit ${code ?? '?'}]`);
                }
            }
            resolvePromise({ exitCode: code, timedOut, error: null, stdout, stderr });
        });
    });
}
