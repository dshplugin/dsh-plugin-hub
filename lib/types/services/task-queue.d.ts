import type { InstallResult, InstallTask } from './install-types.ts';
import type { LoaderHandle } from './loader.ts';
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
/**
 * True while a mutation child process is still alive. The concurrent slot is
 * keyed off the live child set rather than task.status: cancelling a running
 * task flips its status immediately, but the child may still be shutting down
 * (the close event lands later) — the slot must stay held until then, otherwise
 * a new task would start while the old pnpm still runs in the same profile dir.
 */
export declare function hasRunningTask(): boolean;
/** Whether the target already has a non-terminal task in the queue (install/uninstall dedupe). */
export declare function hasQueuedTarget(target: string): boolean;
/**
 * Cancel a queued or running task.
 * - pending: removed from the queue immediately (never spawned).
 * - running: kills the child process; the queue worker then picks the next one.
 * Returns false when the task is unknown or already finished.
 */
export declare function cancelTask(id: number): boolean;
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
    /** 待重启行的展示目标（owner/repo）：卸载时用于把 npm 包名映射回仓库名 */
    displayTarget?: string;
    /** 运行中 loader：卸载成功后主动移除条目、立即生效（缺失时卸载仍需重启清理） */
    uninstallLoader?: LoaderHandle;
}): InstallTask;
/**
 * 安装后校验已装包的入口文件（package.json 的 main / exports["."].default）是否真实存在。
 * git: 分发常不提交构建产物（lib/ 等），pnpm 装完没有报错，但宿主重启加载插件树时会
 * ERR_MODULE_NOT_FOUND 直接崩溃、网页打不开 —— 这里在登记「待重启」前就把这类残缺包拦下。
 * 返回 { name, missing }：name 为空表示无法定位目标包（跳过校验）；missing 为缺失的入口路径。
 */
export declare function verifyInstalledEntry(profile: string, target: string): {
    name: string | null;
    missing: string | null;
};
/**
 * Run a plugin mutation with one recovery path: when `add` fails because a
 * git-hosted package's `prepare` script is blocked by pnpm's allowBuilds
 * gate (`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`), read the exact allowlist
 * key pnpm printed, write it into the profile's pnpm-workspace.yaml, and
 * retry once. Other failures fall through to the single-spawn result.
 */
export declare function runPluginMutation(options: {
    action: 'add' | 'remove';
    profile: string;
    target: string;
    timeoutMs?: number;
    env?: NodeJS.ProcessEnv;
    task?: InstallTask;
    /** 待重启行的展示目标（owner/repo）：卸载时用于把 npm 包名映射回仓库名 */
    displayTarget?: string;
    /** 运行中 loader：卸载成功后主动移除条目、立即生效（缺失时卸载仍需重启清理） */
    uninstallLoader?: LoaderHandle;
}): Promise<InstallResult>;
