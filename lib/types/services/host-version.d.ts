/** 从命令输出里抽出版本号本体：pnpm/npm 直接打印 `11.7.0`，而 `git --version` 打印
 *  `git version 2.55.0.windows.5` —— 原样取首行会让 issue 正文拼成 `vgit version …`。
 *  只取版本号，顺带兼容 `v1.2.3` 这类自带前缀的输出。 */
export declare function versionOf(output: string): string | null;
/** 探测命令行工具版本：未安装 / 不在 PATH / 超时一律 null。
 *  Windows 上 pnpm/npm 是 .cmd shim，不走 shell 起不来；参数是固定的 `--version`，没有注入面。 */
export declare function toolVersion(cmd: string, args: string[]): string | null;
/** 宿主 dsh 版本：优先 `dsh --version`；拿不到再从入口 `process.argv[1]` 向上找 package.json
 *  （dsh 不在 PATH 时使用）。探测成功即缓存，失败不缓存以便下次重试。 */
export declare function hostDshVersion(): string | null;
