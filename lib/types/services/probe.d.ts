export interface ProbeResult {
    /** 是否可达（HTTP 状态码 100–399） */
    ok: boolean;
    /** 毫秒耗时；失败为 null */
    ms: number | null;
    /** HTTP 状态码；失败为 null */
    status: number | null;
    /** 失败细分原因：仅当能确认为环境侧 TLS 问题时才有值，普通不可达为 null */
    reason?: ProbeFailReason | null;
}
/**
 * 不可达的细分原因。把「证书吊销检查被挡」这类本机环境问题与「网络不通」分开，
 * 诊断列表才能给出对症提示，而不是笼统显示不可达。
 */
export type ProbeFailReason = 'tlsRevocation';
/**
 * Windows 的 curl 走 Schannel 做 TLS：握手阶段强制获取证书吊销信息（CRL/OCSP），
 * 代理受限或吊销服务不可达时整个握手直接失败（CRYPT_E_NO_REVOCATION_CHECK），
 * 表现为 `curl: (35) schannel: next InitializeSecurityContext failed` —— 而 Node/npm/
 * 浏览器各有自己的 TLS 实现，照常可用，用户只会看到「插件市场打不开」。
 * --ssl-revoke-best-effort（curl ≥ 7.70）把吊销检查降级为尽力而为，避免它拦死握手；
 * 其它平台后端（SecureTransport / OpenSSL）没有这个强制行为，不加参数。
 * 运行时读 process.platform（而非模块级常量），便于测试覆盖两条分支。
 */
export declare function curlTlsArgs(): string[];
/** 本机 curl 太老、不认识 --ssl-revoke-best-effort（curl < 7.70）：退出码 2 + stderr 指向该参数。 */
export declare function curlRevokeFlagUnsupported(code: number | null, stderr: string): boolean;
/** stderr 是否指向 Schannel 取不到证书吊销信息（据此归因为环境 TLS 问题，而非网络不通）。 */
export declare function tlsRevocationBlocked(stderr: string): boolean;
/**
 * 从 `reg query … /v ProxyServer` 的输出里解析出 `http://host:port`；解析不出返回 null。
 * 注册表里的值常见三种写法：`http://127.0.0.1:10793`（带 scheme）、`127.0.0.1:10793`、
 * `http=host:port;https=host:port`（按协议分别配置）。
 * 字符类必须同时排除 `/` 与 `=`：只排除 `=` 时，带 scheme 的值会让「主机名」吞掉 `//`，
 * 拼出 `http:////127.0.0.1:10793` 这种立刻失败的非法地址 —— 代理本来是通的，却把诊断、
 * 目录拉取、npm/git 预检全判成「不可达」。
 */
export declare function parseWinProxyServer(stdout: string): string | null;
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
 * 请求一个 URL 并返回重定向后的最终地址（curl -I -L -w %{url_effective}）。
 * 供 GitHub 仓库改名解析使用：对已改名仓库 GitHub 回 301，跟随跳转后的最终地址
 * 即规范地址。与其它 GitHub 访问同口径 —— curl 子进程注入代理 env（Node 内置
 * http(s) 读不到系统代理，直连在部分网络下不可达）。
 * 未发生跳转（200/404）、网络失败或 curl 不可用都返回 null，调用方保留原始地址。
 */
export declare function finalUrl(url: string, proxy: string, timeoutMs: number): Promise<string | null>;
/**
 * curl 子进程抓取响应体（与 probeUrl 同一套代理 env 注入与 TLS 参数兜底）。
 * 供服务端 /catalog 代理路由使用：目录/统计数据经此拉到服务端再转给浏览器，
 * 使「目录数据请求走设置里的代理」与 npm / git 安装通道口径一致。
 * 失败（curl 不存在 / 连接失败 / 超时 / 非零退出）时 ok=false，全程不抛错；
 * reason 区分「证书吊销受阻」这类环境 TLS 问题，供调用方决定兜底策略。
 */
export declare function fetchViaCurl(url: string, proxy: string, timeoutMs: number): Promise<{
    ok: boolean;
    body: string;
    reason: ProbeFailReason | null;
}>;
