/** 预检结果：ok=false 表示分发改入口文件缺失，missing 为该文件在包内的相对路径。 */
export interface PreflightResult {
    ok: boolean;
    missing: string | null;
}
export declare function preflightTarget(target: string): Promise<PreflightResult>;
