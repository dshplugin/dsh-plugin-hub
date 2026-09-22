/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 包入口解析：从 package.json 的 exports["."] / main 推出用于校验的入口文件。
 * git 通道（tar 预检）与 npm 通道（装后 statSync 校验）共用，保证两条通道
 * 对同一个包判定一致。
 */
/**
 * 解析包的入口文件（相对包根，不带 `./` 前缀）。
 *
 * Node 的 exports 规范要求字符串 target 以 `./` 开头（如 `"./lib/index.js"`），
 * 而 tar 成员名与磁盘路径都不带该前缀，因此统一剥掉；条件对象
 * （`{ "import": ..., "require": ... }`）按 default → import → require 取第一
 * 个字符串值。无 exports 时回退 main，再回退 index.js。
 */
export declare function resolvePackageEntry(meta: {
    main?: unknown;
    exports?: unknown;
}): string;
