/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * profile 内 YAML 配置损坏的识别：pnpm 会在 profile 目录读 pnpm-workspace.yaml（构建设置）
 * 与 pnpm-lock.yaml（锁文件），任一含重复键或缩进错误时，解析阶段就直接退出，报错形如
 * `[ERROR] duplicated mapping key (10:3)`。此时依赖解析、registry 请求都还没开始，
 * 与插件、网络、源都无关 —— 只能由用户修本机文件，因此单独打 ASCII 标记，
 * 前端据此给处理步骤，且不引导向插件仓库提 Issue。
 */
/**
 * 输出里出现本机 YAML 解析失败 → 返回 ASCII 标记行；否则 null。
 * 纯 ASCII + 不提插件：前端按 `[profile-yaml]` 归类，Windows GBK 解码下同样能命中。
 */
export declare function profileYamlMarker(output: string): string | null;
