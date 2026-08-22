/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Install runner 的统一出口：执行真实插件变更（spawn 官方 dsh CLI 子进程）。
 * 实现按职责拆分在同目录子模块，本文件只做公共 API 的 re-export，保持外部
 * import 面稳定（routes.ts / index.ts 仍从 `services/install.ts` 引入）。
 *
 * 模块划分：
 *  - install-types.ts  公共类型与常量
 *  - pending-restart.ts  待重启列表内存态管理
 *  - loader.ts          运行中 loader 的读取与卸载即时停用
 *  - profile.ts         宿主 profile / 目标校验 / allowBuilds 写入
 *  - task-queue.ts      任务注册表 + FIFO 队列 worker + 子进程生命周期
 */
export type { InstallResult, InstallTask, Invocation, PendingRestart, QueueItem } from './install-types.ts'
export type { LoaderHandle } from './loader.ts'
export { addPendingRestart, clearPendingRestart, listPendingRestarts } from './pending-restart.ts'
export { dumpLoaderEntries, removeLoadedEntry } from './loader.ts'
export { addAllowBuildsKey, githubTarget, parseAllowBuildsKey, readProfileArg, validPackageName } from './profile.ts'
export { activeTask, cancelTask, getTask, hasQueuedTarget, hasRunningTask, runPluginMutation, startPluginMutation } from './task-queue.ts'
