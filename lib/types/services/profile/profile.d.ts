/** Resolve the active profile from the booted CLI args, falling back to `web`. */
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
/** Resolve a profile directory (`DSH_HOME` or `~/.dsh`). */
export declare function profileDirectory(profile: string): string;
/** Build a safe explicit HTTPS Git target, or null when the repo is unsafe.
 *  When `ref` is given it is appended as a Git ref (`#tag` / `#commit`) so an
 *  explicitly pinned revision reaches the installer instead of being dropped. */
export declare function githubTarget(repo: string, ref?: string | null): string | null;
export declare function githubRefOf(value: string): string | null;
export declare function installTargetOf(value: string): string;
export declare function globalNpmPackagesOf(value: string): string[] | null;
/** Extract an owner/repo identity from a catalog value or an installed Git spec. */
export declare function githubRepoOf(value: string): string | null;
/** Validate an npm package name (uninstall target grammar). */
export declare function validPackageName(name: string): boolean;
/**
 * The exact `allowBuilds` key pnpm printed in its
 * `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` hint. For Git installs pnpm
 * matches against `name@<resolved fetch URL>` — the URL it actually fetches,
 * e.g. `https://codeload.github.com/<owner>/<repo>/tar.gz/<commit>` — not the
 * `git+ssh://`/branch spec. A bare name or a `git+` spec does not match, so
 * the only reliable key is the one pnpm prints verbatim. Null when absent.
 */
export declare function parseAllowBuildsKey(output: string): string | null;
/**
 * Add one `allowBuilds` entry to the profile's pnpm-workspace.yaml, merging
 * with existing entries and leaving the rest of the yaml intact. Broken
 * placeholder entries (pnpm's failed-install bug writes a literal
 * `set this to true or false` value) are dropped on rewrite.
 */
export declare function addAllowBuildsKey(profile: string, key: string): void;
