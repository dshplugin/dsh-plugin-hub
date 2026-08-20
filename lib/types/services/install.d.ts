export interface InstallResult {
    exitCode: number | null;
    timedOut: boolean;
    error: string | null;
    stdout: string;
    stderr: string;
}
export interface InstallTask {
    id: number;
    /** 操作目标：`github:<owner>/<repo>`（安装）或 npm 包名（卸载），冲突/恢复时需要展示给用户 */
    target: string;
    action: 'add' | 'remove';
    /** 队列语义：pending 排队中 / running 执行中 / done / failed / cancelled（用户取消） */
    status: 'pending' | 'running' | 'done' | 'failed' | 'cancelled';
    timedOut: boolean;
    exitCode: number | null;
    /** 0-100 估算进度：解析 pnpm 的 `Progress: resolved…` 输出，阶段行兜底 */
    progress: number;
    /** Newest output lines first (consumer shows the tail). */
    lines: string[];
}
/** Snapshot of a task (keeps the live object untouched by consumers). */
export declare function getTask(id: number): InstallTask | undefined;
export interface ActiveTaskInfo {
    id: number;
    target: string;
    action: 'add' | 'remove';
    status: 'pending' | 'running';
    progress: number;
    lines: string[];
}
/** All non-terminal tasks in queue order (running first, then pending). Lets the client resume a queue after a page reload. */
export declare function activeTask(): ActiveTaskInfo[];
/** True while any mutation is still running (the queue worker holds the single concurrent slot). */
export declare function hasRunningTask(): boolean;
/**
 * Cancel a queued or running task.
 * - pending: removed from the queue immediately (never spawned).
 * - running: kills the child process; the queue worker then picks the next one.
 * Returns false when the task is unknown or already finished.
 */
export declare function cancelTask(id: number): boolean;
/** Build a safe `github:<owner>/<repo>` target, or null when the repo is unsafe. */
export declare function githubTarget(repo: string): string | null;
/** Validate an npm package name (uninstall target grammar). */
export declare function validPackageName(name: string): boolean;
/** Resolve the active profile from the booted CLI args, falling back to `web`. */
export declare function readProfileArg(fallback?: string): string;
/**
 * Enqueue a plugin mutation and return its task. Tasks run strictly serially:
 * the queue worker starts the next one only after the previous finishes.
 * Progress is visible through `getTask(id)` / `activeTask()` until done.
 */
export declare function startPluginMutation(options: {
    action: 'add' | 'remove';
    profile: string;
    target: string;
    timeoutMs?: number;
    env?: NodeJS.ProcessEnv;
}): InstallTask;
/**
 * Run `dsh plugin --profile <profile> <action> <target>`, stream its output
 * onto the tracked task and resolve with the captured result. Never rejects;
 * failures surface through the result / task state.
 */
export declare function runPluginMutation(options: {
    action: 'add' | 'remove';
    profile: string;
    target: string;
    timeoutMs?: number;
    env?: NodeJS.ProcessEnv;
    task?: InstallTask;
}): Promise<InstallResult>;
