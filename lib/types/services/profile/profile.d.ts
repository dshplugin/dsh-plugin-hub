/** 从启动参数解析当前 profile，取不到落回 `web`。 */
export declare function readProfileArg(fallback?: string): string;
/**
 * 从启动参数解析当前 profile，两种宿主形态都认：
 *  - 官方 CLI：`--profile <name>`（也兼容 `--profile=<name>` 等号形式）；
 *  - Electron 桌面宿主：不传 `--profile`，而是把 profile 目录作为位置参数传入
 *    （`… <dshRoot> <home>\profiles\desktop …`）。
 * 桌面端只认 `--profile` 会永远落回 fallback，把路由/日志/安装全挂到错误的 profile 上
 * （日志写进 profiles/web/hub.log、市场必然「插件数据加载失败」）。
 * 位置参数按「父目录名为 profiles」精确识别 profile 目录，避免误取其它位置参数。
 */
export declare function profileFromArgv(argv: readonly string[], fallback?: string): string;
/** 解析 profile 目录（`DSH_HOME` 或 `~/.dsh`）。 */
export declare function profileDirectory(profile: string): string;
/** profile 的 dsh.profile.bundles 是否仍包含指定包：取消勾选后 bundle patch 不再执行。
 *  没有该清单或读取失败时返回 true —— 不归我们判断的情况不报警。 */
export declare function bundleIncludes(profile: string, name: string): boolean;
/** 把仓库身份转成规范的 GitHub 目标（git+https），仓库不合法时返回 null。
 *  带 ref 时按 Git ref（`#tag` / `#commit`）拼接；安装通道已不再使用 git 目标，此函数仅做身份规范化。 */
export declare function githubTarget(repo: string, ref?: string | null): string | null;
export declare function installTargetOf(value: string): string;
export declare function globalNpmPackagesOf(value: string): string[] | null;
/** 从目录值或已装 Git spec 中提取 owner/repo 身份。 */
export declare function githubRepoOf(value: string): string | null;
/** 校验 npm 包名（卸载目标的语法）。 */
export declare function validPackageName(name: string): boolean;
/**
 * 取 pnpm 在 `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` 提示里原样打印的 `allowBuilds` key。
 * Git 安装时 pnpm 按 `name@<实际 fetch URL>`（如
 * `https://codeload.github.com/<owner>/<repo>/tar.gz/<commit>`）匹配，而不是 `git+ssh://`
 * 或分支 spec —— 裸包名与 `git+` spec 都匹配不上，唯一可靠的 key 就是 pnpm 原样输出的那个。
 * 无则返回 null。
 */
export declare function parseAllowBuildsKey(output: string): string | null;
/**
 * `allowBuilds` 的 key 必须是 `包名@精确版本`。pnpm v11 在真正安装前会把每条规则解析成
 * 「包名 + 精确版本」，遇到 URL/git/file spec（`pkg@https://…`、`pkg@file:…`）直接抛
 * `ERR_PNPM_INVALID_VERSION_UNION` —— 该 profile 里之后**任何**安装都会失败（#730）。
 * 非 semver 的 spec 一律降级为裸包名（pnpm 按包名匹配所有版本）。
 */
export declare function safeAllowBuildsKey(key: string): string;
/**
 * 安装前修复**已有** `allowBuilds` 里的非法 key。pnpm 的报错发生在依赖解析之前，
 * 走不到 `addAllowBuildsKey` 的失败恢复路径，只能主动清理。返回是否改写了文件。
 */
export declare function sanitizeAllowBuilds(profile: string): boolean;
/**
 * 向 profile 的 pnpm-workspace.yaml 追加一条 `allowBuilds` 记录：与已有条目合并，
 * 其余 yaml 保持不变；重写时丢弃损坏的占位条目（pnpm 安装失败的 bug 会写入
 * 字面量 `set this to true or false`）。
 *
 * 任何形态的既有 `allowBuilds` 都会被**整体替换**成规范化块：块写法、行内数组
 * `allowBuilds: ["a@1"]`、以及末尾无换行的 `allowBuilds:` 都算命中。否则会在文件里
 * 再多写一个同名键 —— pnpm 解析时直接报 `duplicated mapping key`，该 profile 里
 * 所有插件都装不上（#562）。
 */
export declare function addAllowBuildsKey(profile: string, key: string): void;
