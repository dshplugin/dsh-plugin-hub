/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 安装/卸载运行时的公共类型与常量（无依赖，供各服务模块复用）。
 */
/** 一个 pnpm 安装子进程的结果快照。 */
export interface InstallResult {
    exitCode: number | null;
    timedOut: boolean;
    error: string | null;
    stdout: string;
    stderr: string;
}
export interface InstallTask {
    id: number;
    /** 操作目标：显式 HTTPS Git URL（安装）或 npm 包名（卸载），冲突/恢复时需要展示给用户 */
    target: string;
    /** 展示用目标（owner/repo）：npm 安装时 target 是包名，前端恢复用此字段显示仓库名，保持用户无感知 */
    displayTarget?: string;
    /** 尝试过的安装方式（npm registry 反查 + 实际执行的 CLI 命令，按先后顺序）：
     *  失败提 Issue 时如实贴给作者，作者据此反推正确的 npm 包名（组织 scope 与 GitHub 用户名不一致时
     *  仅凭仓库名猜不到，作者看到我们查过/试过的命令就能直接指认）。 */
    attempts: string[];
    /** 全局 npm 安装（官方 `npm install -g <pkgs>`）：非空时任务执行全局 npm 安装，不进任何 profile */
    globalNpm?: string[];
    action: 'add' | 'remove' | 'update';
    /** 自定义安装入口渠道（客户端三张卡片：NPM 包 / GitHub 源码 / DSH 命令）：
     *  任务输出行与系统日志据此溯源「从哪个入口发起」；目录插件安装无此字段。 */
    installChannel?: 'npm' | 'git' | 'dsh';
    /** 队列语义：pending 排队中 / running 执行中 / done / failed / cancelled（用户取消） */
    status: 'pending' | 'running' | 'done' | 'failed' | 'cancelled';
    timedOut: boolean;
    exitCode: number | null;
    /** 0-100 估算进度：解析 pnpm 的 `Progress: resolved…` 输出，阶段行兜底 */
    progress: number;
    /** Newest output lines first (consumer shows the tail). */
    lines: string[];
    /** 完成后是否仍需宿主重启才生效：卸载时 loader 已即时移除 → false；否则 true（弹窗据此给重启选项） */
    needsRestart: boolean;
}
/** 子进程启动参数（复用宿主 dsh 入口，或回退到 PATH 上的 `dsh`）。 */
export interface Invocation {
    file: string;
    prefixArgs: string[];
    cwd: string;
    useShell: boolean;
}
/** 排队中的变更任务及其启动参数。 */
export interface QueueItem {
    task: InstallTask;
    options: {
        action: 'add' | 'remove' | 'update';
        profile: string;
        target: string;
        timeoutMs?: number;
        env?: NodeJS.ProcessEnv;
        globalNpm?: string[];
        installChannel?: 'npm' | 'git' | 'dsh';
    };
}
/**
 * 安装成功但宿主尚未重启的插件（待重启后生效）。纯内存态：宿主进程一重启
 * 它自然清空，正好等于「重启后提醒消失」的语义，无需任何重启探测。
 */
export interface PendingRestart {
    /** Git 安装目标（与任务一致；卸载时为展示用的 owner/repo） */
    target: string;
    /** 待重启语义：install 装完等挂载生效 / uninstall 卸完等清理 loader 残留 */
    kind: 'install' | 'uninstall';
    /** 任务完成时刻（epoch ms） */
    at: number;
}
/** Grammar of a catalog GitHub repository identity (`owner/repo`). */
export declare const REPO_RE: RegExp;
/** Grammar of an npm package name (used for uninstall targets). */
export declare const PACKAGE_RE: RegExp;
/** 捕获输出上限：stdout/stderr 各保留尾部 N 字节。 */
export declare const CAPTURE_LIMIT_BYTES: number;
/** Max output lines kept per task (newest wins). */
export declare const MAX_TASK_LINES = 200;
/** Max tracked tasks; oldest finished tasks are dropped first. */
export declare const MAX_TASKS = 50;
