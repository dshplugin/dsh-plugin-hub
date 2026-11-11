/**
 * 从 DSH 输出里解析 operation 日志路径（`diagnostics: <path>`）。
 * 去掉首尾引号与句末标点（不同版本/语言的摘要行尾部可能带 `。`、`.`、`)`）；
 * 相对路径原样返回，由读取方按 profile 目录解析。
 */
export declare function operationLogPathOf(output: string): string | null;
/**
 * 回捞 operation 日志尾部，作为失败详情返回；拿不到（无路径 / 文件不存在 / 读失败 /
 * 内容为空 / 路径越界）返回 null。尾部截到与子进程输出相同的上限。
 */
export declare function backfillOperationLog(output: string, profileDir?: string): string | null;
/**
 * 输出里是否有 dsh 自己的内容 —— 只有 `[exit N]`、`[install-channel]`、`[timed out]`
 * 这类本队列自己打的标记时返回 false。用于把「宿主什么都没回显」的失败显式留痕，
 * 否则上报正文只剩退出码，无从排查。
 */
export declare function hasSubstantiveOutput(output: string): boolean;
/**
 * 失败输出里除包装噪声外没有任何可排查内容：只剩本队列标记，和
 * `Command failed with exit code N: pnpm add …` 这类外层包装（#6118 的形态 ——
 * pnpm 以 1 退出、operation 日志里只有这一行）。此时上报正文只会写出「安装失败」，
 * 作者与维护者都无从判断，调用方据此补一条带启动参数的诊断标记。
 */
export declare function lacksDiagnosticContent(output: string): boolean;
/**
 * 运行期抓取：宿主的 operation 日志只在命令运行期间存在，结束后可能被清理，
 * 退出后再按路径读往往已经拿不到。这里在安装过程中轮询 profile 下最新的
 * `.plugin-manager/logs/<operation>/pnpm.log`，用抓到的内容补全。
 * 只认本次运行产生的新文件（mtime 晚于启动基线），避免复述上一次安装的日志。
 */
export declare function createOperationLogTap(profileDir: string): {
    stop: () => string;
};
