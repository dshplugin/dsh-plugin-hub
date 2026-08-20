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
/** Snapshot of a task (keeps the live object untouched by consumers). */
export function getTask(id) {
    const task = tasks.get(id);
    if (!task)
        return undefined;
    return { ...task, lines: task.lines.slice(0, MAX_TASK_LINES) };
}
/** True while any mutation is still running (mutex for the install routes). */
export function hasRunningTask() {
    let running = false;
    tasks.forEach((task) => {
        if (task.status === 'running')
            running = true;
    });
    return running;
}
function pushLine(task, line) {
    task.lines.unshift(line);
    if (task.lines.length > MAX_TASK_LINES)
        task.lines.length = MAX_TASK_LINES;
    task.progress = Math.max(task.progress, estimateProgress(line));
}
/**
 * Estimate 0-100 progress from one CLI output line. pnpm emits
 * `Progress: resolved N, reused X, downloaded Y, added Z` during the fetch
 * phase; resolution/install phase lines bump the estimate towards done.
 */
function estimateProgress(line) {
    const progress = line.match(/Progress:\s*(.+)/);
    if (progress) {
        let total = 0;
        let done = 0;
        for (const part of progress[1].split(',')) {
            const [raw, label] = part.trim().split(/\s+/);
            const value = Number(raw);
            if (label === 'resolved')
                total = value;
            else if (label === 'reused' || label === 'downloaded' || label === 'added' || label === 'imported') {
                done += value;
            }
        }
        if (total > 0)
            return Math.min(90, Math.round((done / total) * 100));
    }
    if (/^dependencies:|^Packages:/.test(line))
        return 92;
    if (/^Done in\b/.test(line))
        return 96;
    return 0;
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
 * Kick off a background mutation and return its task handle. The CLI runs
 * asynchronously; progress is visible through `getTask(id)` until done.
 */
export function startPluginMutation(options) {
    const task = { id: nextTaskId, status: 'running', timedOut: false, exitCode: null, progress: 0, lines: [] };
    nextTaskId = nextTaskId >= Number.MAX_SAFE_INTEGER ? 1 : nextTaskId + 1;
    tasks.set(task.id, task);
    if (tasks.size > MAX_TASKS) {
        let removed = false;
        tasks.forEach((candidate, id) => {
            if (!removed && candidate.status !== 'running') {
                tasks.delete(id);
                removed = true;
            }
        });
    }
    void runPluginMutation({ ...options, task });
    return task;
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
        const timer = setTimeout(() => {
            timedOut = true;
            stopChild(child);
        }, timeoutMs);
        const collect = (kind, chunk) => {
            const text = chunk.toString();
            if (kind === 'stdout')
                stdout = (stdout + text).slice(-CAPTURE_LIMIT_BYTES);
            else
                stderr = (stderr + text).slice(-CAPTURE_LIMIT_BYTES);
            if (task) {
                for (const line of text.split(/\r?\n/)) {
                    if (line.trim() !== '')
                        pushLine(task, `${kind === 'stderr' ? '[err] ' : ''}${line.trimEnd()}`);
                }
            }
        };
        child.stdout?.on('data', (chunk) => collect('stdout', chunk));
        child.stderr?.on('data', (chunk) => collect('stderr', chunk));
        child.once('error', (error) => {
            clearTimeout(timer);
            if (task) {
                task.status = 'failed';
                task.exitCode = null;
                pushLine(task, `[error] ${error.message}`);
            }
            resolvePromise({ exitCode: null, timedOut: false, error: error.message, stdout, stderr });
        });
        child.once('close', (code) => {
            clearTimeout(timer);
            if (task) {
                task.exitCode = code;
                task.timedOut = timedOut;
                task.status = timedOut || code !== 0 ? 'failed' : 'done';
                if (task.status === 'done')
                    task.progress = 100;
                pushLine(task, timedOut ? '[timed out]' : `[exit ${code ?? '?'}]`);
            }
            resolvePromise({ exitCode: code, timedOut, error: null, stdout, stderr });
        });
    });
}
