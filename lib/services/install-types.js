/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 安装/卸载运行时的公共类型与常量（无依赖，供各服务模块复用）。
 */
/** Grammar of an accepted `github:<owner>/<repo>` install target. */
export const REPO_RE = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/;
/** Grammar of an npm package name (used for uninstall targets). */
export const PACKAGE_RE = /^(?:@[a-z0-9._-]+\/)?[A-Za-z0-9._-]+$/;
/** 捕获输出上限：stdout/stderr 各保留尾部 N 字节。 */
export const CAPTURE_LIMIT_BYTES = 64 * 1024;
/** Max output lines kept per task (newest wins). */
export const MAX_TASK_LINES = 200;
/** Max tracked tasks; oldest finished tasks are dropped first. */
export const MAX_TASKS = 50;
