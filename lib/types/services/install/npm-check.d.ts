/** npm arborist 内部崩溃特征：`Cannot read properties of null (reading 'edgesOut')`。 */
export declare const NPM_CRASH_EDGES_OUT_RE: RegExp;
/** 该缺陷在 npm 11.6.0 起不再复现；低于此版本遇到 edgesOut 崩溃即判「本机 npm 版本过低」。 */
export declare const NPM_MIN_VERSION: number[];
/** 读本机 npm 版本（major.minor.patch）；npm 不在 PATH 或执行失败/超时时返回 null（不妄下结论）。 */
export declare function npmVersionOf(env: NodeJS.ProcessEnv | undefined): [number, number, number] | null;
/**
 * 安装失败输出含 npm arborist edgesOut 崩溃特征，且本机 npm 版本低于阈值时，返回
 * `[npm-too-low] npm@X.Y.Z …` 标记行；否则返回 null。前端据此展示「本机 npm 版本过低」
 * 的准确原因，避免该报错被误判成插件打包/分发问题。
 */
export declare function npmTooLowMarker(output: string, env?: NodeJS.ProcessEnv): string | null;
