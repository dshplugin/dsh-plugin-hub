export interface InstallResult {
    exitCode: number | null;
    timedOut: boolean;
    error: string | null;
    stdout: string;
    stderr: string;
}
export interface InstallTask {
    id: number;
    status: 'running' | 'done' | 'failed';
    timedOut: boolean;
    exitCode: number | null;
    /** 0-100 估算进度：解析 pnpm 的 `Progress: resolved…` 输出，阶段行兜底 */
    progress: number;
    /** Newest output lines first (consumer shows the tail). */
    lines: string[];
}
/** Snapshot of a task (keeps the live object untouched by consumers). */
export declare function getTask(id: number): InstallTask | undefined;
/** True while any mutation is still running (mutex for the install routes). */
export declare function hasRunningTask(): boolean;
/** Build a safe `github:<owner>/<repo>` target, or null when the repo is unsafe. */
export declare function githubTarget(repo: string): string | null;
/** Validate an npm package name (uninstall target grammar). */
export declare function validPackageName(name: string): boolean;
/** Resolve the active profile from the booted CLI args, falling back to `web`. */
export declare function readProfileArg(fallback?: string): string;
/**
 * Kick off a background mutation and return its task handle. The CLI runs
 * asynchronously; progress is visible through `getTask(id)` until done.
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
