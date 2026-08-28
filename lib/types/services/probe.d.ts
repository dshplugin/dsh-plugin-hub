export interface ProbeResult {
    /** 是否可达（HTTP 状态码 100–399） */
    ok: boolean;
    /** 毫秒耗时；失败为 null */
    ms: number | null;
    /** HTTP 状态码；失败为 null */
    status: number | null;
}
/**
 * 操作系统级代理（macOS 系统网络设置 / Windows Internet 设置）。
 * Node 内置 http(s) 不读系统代理，浏览器挂的代理 Node 看不见 —— 这里读出来
 * 作为默认代理，保证「浏览器能开、安装/诊断就能通」。
 * Linux 没有统一的系统代理入口，返回 null（交给环境变量 / 设置里的代理）。
 */
export declare function systemProxy(): string | null;
/**
 * 探测一个 HTTPS 目标：proxy 非空注入给 curl 子进程走代理，否则直连。
 * 供系统诊断 /diagnostics 使用；目标 URL 非法返回不可达。
 */
export declare function probeUrl(url: string, proxy: string, timeoutMs: number): Promise<ProbeResult>;
/**
 * git 通道真实克隆握手探测：spawn git ls-remote（https 传输，与 pnpm 克隆前的
 * ref 握手一致），注入代理 env，GIT_TERMINAL_PROMPT=0 防凭据提示挂起。
 *
 * 为什么要真实 git 而非 curl 打网页：网页「能打开」和 git「能克隆」是两码事 ——
 * 防火墙/代理常按端口与协议区分，HTTP 页可达不代表 git 传输可达。这里测的就是
 * 克隆握手本身，回答「github:owner/repo 装不装得动」。
 * 供系统诊断 GitHub 通道使用；探测目标用 dshplugin/hello-dsh 小仓库（秒级完成，
 * 不打 17MB 的 dsh-plugin-hub 主页）。
 */
export declare function gitLsRemote(url: string, proxy: string, timeoutMs: number): Promise<ProbeResult>;
/**
 * curl 子进程抓取响应体（与 probeUrl 同一套代理 env 注入）。
 * 供服务端 /catalog 代理路由使用：目录/统计数据经此拉到服务端再转给浏览器，
 * 使「目录数据请求走设置里的代理」与 npm / git 安装通道口径一致。
 * 失败（curl 不存在 / 连接失败 / 超时 / 非零退出）时 ok=false，全程不抛错。
 */
export declare function fetchViaCurl(url: string, proxy: string, timeoutMs: number): Promise<{
    ok: boolean;
    body: string;
}>;
