/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 宿主运行时路径：需要 spawn 一个「和宿主同款」的 Node/Electron 进程时用它取可执行文件。
 */
/** Android 动态链接器的错误信息形如 `error: expected absolute path: "--expose-internals"`：
 *  linker64 的第一个参数必须是「被加载的可执行文件绝对路径」，传选项就会被拒绝。 */
const LINKER_RE = /(^|[\\/])linker(32|64)?$/i;
/**
 * 宿主进程自身的可执行文件路径。
 *
 * 大多数平台就是 `process.execPath`；但 Android（bionic）上它常常是
 * `/system/bin/linker64`（宿主由 `linker64 node …` 拉起）。这时拿 execPath 去 spawn
 * 任何带参数的命令（如 `--expose-internals <cli.js>`）都会把第一个参数当成可执行文件，
 * 直接报 `expected absolute path`，子进程什么都跑不起来。这类环境里真正的程序路径在
 * `process.argv0`，故检测到链接器时改用它。
 */
export function runtimeExecPath(exec = process.execPath, argv0 = process.argv0) {
    if (!LINKER_RE.test(exec))
        return exec;
    return argv0 && argv0 !== exec ? argv0 : exec;
}
