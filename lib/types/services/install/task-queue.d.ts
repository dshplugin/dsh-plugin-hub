import type { InstallResult, InstallTask, Invocation } from './install-types.ts';
import type { LoaderHandle } from '../loader.ts';
/** 任务快照（避免消费方改动实时对象）。 */
export declare function getTask(id: number): InstallTask | undefined;
export interface ActiveTaskInfo {
    id: number;
    target: string;
    action: 'add' | 'remove' | 'update';
    status: 'pending' | 'running';
    progress: number;
    lines: string[];
    /** 尝试过的安装方式（实际执行过的命令）：失败时前端 issue 预填需要 */
    attempts: string[];
    /** 自定义安装入口渠道（NPM 包卡片）：前端刷新恢复后仍能精准溯源 */
    installChannel?: 'npm';
}
/** 全部未终态任务，按队列顺序（running 在前、pending 在后）。供客户端刷新页面后恢复队列。 */
export declare function activeTask(): ActiveTaskInfo[];
/**
 * 变更子进程仍存活时为 true。并发占位以存活子进程集合为准，而非 task.status：
 * 取消运行中任务会立即翻转其状态，但子进程可能仍在退出中（close 事件稍后才到）——
 * 占位必须维持到那时，否则旧 pnpm 还在同一 profile 目录跑，新任务就开始了。
 */
export declare function hasRunningTask(): boolean;
/** 目标在队列里是否已有未终态任务（安装/卸载去重）。 */
export declare function hasQueuedTarget(target: string): boolean;
/**
 * 取消排队中或运行中的任务。
 * - pending：立即移出队列（从未 spawn）。
 * - running：杀掉子进程；队列 worker 随后取下一个。
 * 任务不存在或已结束时返回 false。
 */
export declare function cancelTask(id: number): boolean;
/**
 * 打包桌面端宿主的 CLI 引导脚本路径（`<asar 根>/lib/desktop-cli.js`，即应用内
 * pnpm 服务的 dshBootstrapPath）。宿主入口落在 app.asar 内时按 asar 根反推候选路径，
 * 命中存在的那个才采用；布局不认识（官方改版）时返回 null，调用方回退原逻辑。
 * 导出供单测覆盖路径推导。
 */
export declare function desktopCliBootstrap(entry: string): string | null;
/**
 * 传给 CLI 的安装目标：钉住版本优先（Hub 自我更新提示的是已过供应链门禁的版本），
 * 其次 npm 的 add/update 都显式 `@latest`；git 源、全局安装、已带版本/tag 的 spec 保持原样。
 */
export declare function npmInstallTargetOf(target: string, opts: {
    update: boolean;
    global: boolean;
    pinned?: string;
    add?: boolean;
}): string;
/**
 * 插件变更入队并返回其任务。任务严格串行：队列 worker 只在上一个结束后才启动下一个。
 * 完成前可通过 `getTask(id)` / `activeTask()` 查看进度。
 */
export declare function startPluginMutation(options: {
    action: 'add' | 'remove' | 'update';
    profile: string;
    target: string;
    timeoutMs?: number;
    env?: NodeJS.ProcessEnv;
    /** 全局 npm 安装（官方 `npm install -g <pkgs>`）：非空时执行全局安装，不进任何 profile、无需宿主重启 */
    globalNpm?: string[];
    /** 待重启行的展示目标（owner/repo）：卸载时用于把 npm 包名映射回仓库名 */
    displayTarget?: string;
    /** 运行中 loader：安装成功后热挂新条目、卸载成功后停用旧条目，两类操作都尽量立即生效
     *  （缺失时安装/卸载仍需重启） */
    loader?: LoaderHandle;
    /** 入队前已尝试的安装方式：失败提 Issue 时如实展示；实际执行的命令由 spawn 时追加 */
    attempts?: string[];
    /** 更新已安装的 npm 包（mode=update）：命令显式带 @latest，让 pnpm 真正解析最新版本 */
    updateNpm?: boolean;
    /** 自定义安装入口渠道（NPM 包卡片）：任务输出行与系统日志据此溯源「从哪个入口发起」；
     *  目录插件安装不传 */
    installChannel?: 'npm';
    /** npm 源候选（首选在前）：传输层失败时按顺序换源重试，空/单个表示不降级 */
    registries?: string[];
    /** 精确安装 spec（如 `dsh-plugin@2.0.5`）：Hub 自我更新提示的是已过供应链门禁的版本，
     *  必须钉住安装，不能再用 @latest 被带回门禁内的最新版 */
    installSpec?: string;
}): InstallTask;
/**
 * 安装成功后从 profile 的 `node_modules/<pkg>/package.json` 读**实际**版本；
 * 定位不到包名或读不到返回 null。客户端拿它写版本账本 —— 目录里的版本可能滞后。
 */
export declare function installedVersionOf(profile: string, target: string): string | null;
/**
 * 安装后校验已装包里 package.json 声明的文件（main / exports["."].default 与
 * dsh.bundle.patch）是否真实存在。npm 包也可能漏发构建产物（lib/ 等），pnpm 装完没有
 * 报错，但宿主重启加载插件树时会 ERR_MODULE_NOT_FOUND 直接崩溃、网页打不开 —— 这里在
 * 登记「待重启」前就把这类残缺包拦下。没有声明过的文件不在这里追究：没声明入口的
 * bundle 包（只挂技能）本来就不需要入口，宿主读的是它的 package.json 与声明的补丁。
 * 返回 { name, missing }：name 为空表示无法定位目标包（跳过校验）；missing 为缺失文件的路径。
 */
export declare function verifyInstalledEntry(profile: string, target: string): {
    name: string | null;
    missing: string | null;
};
/**
 * 宿主自身 CLI 调不起来时的 ASCII 标记行：spawn 我们解析出的宿主入口报 ENOENT 时返回
 * `[host-spawn]`，供前端单独归因、不引导提 Issue。PATH 上的 dsh/npm 各有自己的标记，返回 null。
 * 导出供单测覆盖判据。
 */
export declare function hostSpawnMarker(invocation: Invocation, error: unknown): string | null;
/**
 * 执行插件变更，带一条恢复路径：当 `add` 因 pnpm 的 allowBuilds 门禁拦下构建脚本而失败 ——
 * 或是 git 源包自己的 `prepare`（`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`，key 取自打印的
 * key@url 提示），或是某依赖的原生构建（`ERR_PNPM_IGNORED_BUILDS`，key = 列出的 name@version）——
 * 就把确切的 key 写进 profile 的 pnpm-workspace.yaml 并重试一次。
 * 其它失败一律落到单次 spawn 的结果。
 */
export declare function runPluginMutation(options: {
    action: 'add' | 'remove' | 'update';
    profile: string;
    target: string;
    timeoutMs?: number;
    env?: NodeJS.ProcessEnv;
    task?: InstallTask;
    /** 待重启行的展示目标（owner/repo）：卸载时用于把 npm 包名映射回仓库名 */
    displayTarget?: string;
    /** 运行中 loader：安装成功后热挂新条目、卸载成功后停用旧条目（缺失时仍需重启） */
    loader?: LoaderHandle;
    /** 全局 npm 安装（官方 `npm install -g <pkgs>`）：非空时执行全局安装，不进任何 profile、无需宿主重启 */
    globalNpm?: string[];
    /** npm 源候选（首选在前）：传输层失败时按顺序换源重试 */
    registries?: string[];
    /** 精确安装 spec（如 `dsh-plugin@2.0.5`）：见 startPluginMutation 同名说明 */
    installSpec?: string;
}): Promise<InstallResult>;
