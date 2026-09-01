/** 预检结果：ok=false 表示分发改入口文件缺失，missing 为该文件在包内的相对路径；
 *  name 为 git 分发包 package.json 声明的包名（非 git 目标/无法确定时为 null），
 *  供安装路由做「包名冲突」检测 —— 同名包名已被其他来源占用时，pnpm 装前必然撞车，
 *  需要把晦涩的 CLI 报错转成明确的拦截。 */
export interface PreflightResult {
    ok: boolean;
    missing: string | null;
    name: string | null;
}
export declare function preflightTarget(target: string): Promise<PreflightResult>;
