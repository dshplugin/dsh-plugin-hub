/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Failure classification, issue-body summarization and persistent
 * install/remove notifications.
 *
 * Every settled task is recorded two ways: the server-side system log
 * (hub.log) and a client-side localStorage record that feeds the
 * notification center — so a result is never lost even when the dialog
 * was dismissed or nobody was watching the progress strip.
 */
export interface NotificationRecord {
  id: number
  kind: 'install' | 'uninstall' | 'update'
  /** true = 成功（轻量记录）；false = 失败（message 携带完整错误日志） */
  ok: boolean
  /** owner/repo（可能为空：请求层失败但拿不到仓库时） */
  repo: string
  /** 实际动作（install/update/uninstall）：成功/失败通知据此区分「安装成功」与「更新成功」。
   *  缺省按 kind 兜底（历史记录可能没有该字段）。更新提醒（kind='update'）不用此字段。 */
  action?: 'install' | 'update' | 'uninstall'
  /** 失败时的完整错误日志；成功记录为空串 */
  message: string
  /** 更新提醒：目录里的新版本号（展示用；其余通知省略） */
  version?: string
  /** 实际执行的安装/卸载命令（issue 预填时如实展示）；历史记录可能缺失 */
  command?: string
  /** 尝试过的安装方式（npm registry 反查 + 实际执行命令，按先后顺序）：失败提 Issue 时贴给作者，便于反推正确的 npm 包名 */
  attempts?: string[]
  /** 结束时间（epoch ms） */
  at: number
}

const KEY = 'gro.ngilp-hsd.failure-records'
const MAX = 50

/** 运行时 localStorage 访问：类型上不依赖 DOM lib（Node 测试环境也能编译），浏览器里取 window。 */
const storage = (): Storage | undefined =>
  (globalThis as { localStorage?: Storage }).localStorage

/** 读取本地通知记录（损坏/不可用时返回空列表，不抛错）。列表最新在前，全部保留，只由「清空」按钮手动移除。 */
export function loadNotifications(): NotificationRecord[] {
  try {
    const raw = storage()?.getItem(KEY)
    if (!raw) return []
    const list = JSON.parse(raw) as unknown
    if (!Array.isArray(list)) return []
    return list
      .filter((r): r is NotificationRecord =>
        !!r && typeof r === 'object' && typeof (r as { message?: unknown }).message === 'string')
      // ok 字段缺省时按失败渲染
      .map((r) => ({ ...r, ok: r.ok === true }))
  } catch {
    return []
  }
}

function save(list: NotificationRecord[]): void {
  try {
    storage()?.setItem(KEY, JSON.stringify(list))
  } catch {
    /* storage full / unavailable：仅保留内存态，界面仍可查看 */
  }
}

/** 追加一条通知记录并持久化，返回更新后的完整列表（最新在前，超上限裁剪）。
 *  每次成功/失败都各自留痕：同一插件的安装/卸载记录都完整保留、只由「清空」按钮手动移除，
 *  不会因后续操作被自动覆盖清除。 */
export function addNotification(record: Omit<NotificationRecord, 'id' | 'at'>): NotificationRecord[] {
  const prev = loadNotifications()
  let id = Date.now()
  while (prev.some((r) => r.id === id)) id += 1
  const next = [{ ...record, id, at: id }, ...prev].slice(0, MAX)
  save(next)
  return next
}

/** 记录一次失败：携带完整错误日志，供通知中心查看/复制/提 Issue。 */
export function addFailure(record: Omit<NotificationRecord, 'id' | 'at' | 'ok'>): NotificationRecord[] {
  return addNotification({ ...record, ok: false })
}

/** 记录一次成功：轻量记录，不带日志。 */
export function addSuccess(record: Omit<NotificationRecord, 'id' | 'at' | 'ok' | 'message'>): NotificationRecord[] {
  return addNotification({ ...record, ok: true, message: '' })
}

/** 记录一条「发现新版本」更新提醒：成功类轻量记录，携带目录新版本号供通知中心展示。
 *  同一插件同一新版本已在通知中心时跳过：宿主重载会重新触发启动检查，不更新时
 *  通知里已有的提醒保持单条，不重复追加。 */
export function addUpdateNotice(record: Omit<NotificationRecord, 'id' | 'at' | 'ok' | 'message'>): NotificationRecord[] {
  const prev = loadNotifications()
  const dup = prev.some((r) =>
    r.kind === 'update' && r.repo === record.repo && (r.version ?? undefined) === (record.version ?? undefined))
  if (dup) return prev
  return addNotification({ ...record, ok: true, message: '' })
}

/** 已忽略的更新提醒持久化 key：`owner/repo@version` 字符串数组。 */
const IGNORE_KEY = 'gro.ngilp-hsd.ignored-updates'

/** 读取已忽略的更新提醒（`owner/repo@version` 字符串集合）；损坏/不可用时返回空集合。 */
export function loadIgnoredUpdates(): Set<string> {
  try {
    const raw = storage()?.getItem(IGNORE_KEY)
    if (!raw) return new Set()
    const list = JSON.parse(raw) as unknown
    if (!Array.isArray(list)) return new Set()
    return new Set(list.filter((x): x is string => typeof x === 'string'))
  } catch {
    return new Set()
  }
}

function saveIgnoredUpdates(ignored: Set<string>): void {
  try {
    storage()?.setItem(IGNORE_KEY, JSON.stringify([...ignored]))
  } catch {
    /* storage full / unavailable：仅保留内存态 */
  }
}

/** 忽略某插件本次更新（repo+version 持久化入忽略集）：本次版本不再提醒，直到下一个新版本发布。 */
export function ignoreUpdate(repo: string, version?: string): Set<string> {
  const next = loadIgnoredUpdates()
  next.add(`${repo}@${version ?? ''}`)
  saveIgnoredUpdates(next)
  return next
}

/** 移除某插件某版本的更新提醒记录（忽略本次更新时一并清理通知），返回更新后的列表。 */
export function removeUpdateNotice(repo: string, version?: string): NotificationRecord[] {
  const next = loadNotifications().filter((r) =>
    !(r.kind === 'update' && r.repo === repo && (r.version ?? undefined) === (version ?? undefined)))
  save(next)
  return next
}

/** 清空全部通知记录，返回空列表。 */
export function clearNotifications(): NotificationRecord[] {
  save([])
  return []
}

/** 按 id 删除单条通知记录，返回更新后的列表（仅移除该条，不影响其余记录）。 */
export function removeNotification(id: number): NotificationRecord[] {
  const next = loadNotifications().filter((r) => r.id !== id)
  save(next)
  return next
}

export type FailureKind = 'npmTooOld' | 'dshMissing' | 'gitMissing' | 'pnpmMissing' | 'npmMissing' | 'pnpmStore' | 'pnpmPolicy' | 'pnpmIgnoredBuild' | 'pluginPrepare' | 'network' | 'repo'

/**
 * 失败归类，七态。无论底层机制如何（pnpm 白名单拦截 / 构建脚本被忽略 / prepare 失败），
 * 对用户而言结果都一样 —— 当前安装通道（npm 或 git）装不上，就是插件分发/依赖的问题，
 * 一律引导提 Issue；唯一的例外是本机环境问题（npm 版本过低 / 找不到 dsh / 找不到 pnpm / 网络不通）：
 * - npmTooOld：失败输出含 npm arborist 的 `edgesOut` 崩溃特征（build-ideal-tree.js 解 peer 依赖时
 *   内部抛错，npm 11.6.0 前必现的已知缺陷，npm/cli#8261、#9787），或服务端已核实本机版本低于
 *   阈值并打了 `[npm-too-low]` 标记 —— 是本机 npm 版本过低/自身缺陷，不是插件问题 → 引导升级 npm
 * - dshMissing：安装器 spawn 的 `dsh` 命令找不到（Windows cmd「不是内部或外部命令」/ POSIX
 *   「command not found」/ spawn ENOENT）—— 是本机 DSH 未正确安装或不在 PATH，不是插件问题
 *   → 提示检查 PATH/重装 DSH，不引导提 Issue
 * - gitMissing：安装器调用 `git` 时找不到可执行文件（Windows cmd「'git' is not recognized」/
 *   POSIX「git: command not found」/ spawn ENOENT）—— 是本机 Git 未安装或不在 PATH，不是插件
 *   问题。pnpm 会把缺失 git 报成 `ERR_PNPM_GIT_RESOLVE_FAILED`（git ls-remote failed），若只看
 *   错误码会误归插件侧失败；且 dshMissing 的通用「not recognized」模式会先把它吞成 dsh 缺失，
 *   所以必须在 dshMissing 之前判断（dsh-plugin-hub#21：Win 下装 git 源插件，
 *   `'git' is not recognized` 被误归仓库问题引导去提 Issue）→ 提示安装 Git / 加入 PATH，不引导提 Issue
 * - pnpmMissing：dsh 存在但调用的 `pnpm` 找不到（dsh 报 `pnpm not found on PATH`/POSIX
 *   「pnpm: command not found」/ spawn ENOENT）—— 本机缺 pnpm（dsh 用 pnpm 管理 profile 插件），
 *   不是插件问题（dsh-plugin-hub#13：Linux 下 `dsh: pnpm not found on PATH` 被误归插件侧失败）
 *   → 提示安装/开启 pnpm，不引导提 Issue
 * - npmMissing：全局 npm 安装通道（`npm install -g ...`）spawn 的 `npm` 命令找不到
 *   （Windows cmd「'npm' is not recognized」/ POSIX「npm: command not found」/ spawn ENOENT）——
 *   本机 npm 未安装或不在 PATH，不是插件问题。dshMissing 的通用「not recognized」模式会把
 *   `'npm' is not recognized` 吞成 dsh 缺失，所以必须在 dshMissing 之前判断
 *   → 提示安装 npm（Node.js 自带）/加入 PATH，不引导提 Issue
 * - pnpmStore：pnpm 存在但报 store / virtual store 位置不匹配（`ERR_PNPM_UNEXPECTED_STORE` /
 *   `ERR_PNPM_UNEXPECTED_VIRTUAL_STORE` / `Unexpected store location`）—— profile 目录的 node_modules
 *   是用不同大版本的 pnpm 生成的（或 profile 目录被复制/移动、virtual-store-dir 配置变化），
 *   当前 pnpm 不认，任何插件装进该 profile 都会失败；不是插件问题（dsh-plugin-hub#14：macOS 下
 *   `ERR_PNPM_UNEXPECTED_STORE` 被误归插件侧失败；dsh-plugin-hub#30：`ERR_PNPM_UNEXPECTED_VIRTUAL_STORE`
 *   漏判被误归插件侧失败）→ 提示清理 profile 依赖目录重建，不引导提 Issue
 * - pnpmPolicy：pnpm 11 的供应链安全策略拒绝安装（`ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` /
 *   `Minimum release age` —— 锁文件里包的发布时间还不满 24 小时被拒；`untrusted origin` —— 依赖来源未被
 *   本机 pnpm 信任）。拦的是「刚发布的新包」与「未被信任的来源」，装任何新插件都会撞墙，不是
 *   插件问题（dsh-plugin-hub#15/#16：用户装官方 dsh-plugin 也被这两类策略拦下并误归插件侧失败）
 *   → 提示按子场景给解法（发布未满 24 小时 → `minimumReleaseAge: 0` 豁免或等满 24 小时；untrusted
 *   origin → 删除 profile 的 node_modules + pnpm-lock.yaml 清掉不受信任来源后重装），不引导提 Issue
 * - network：安装前连通性预检拦截（服务端 `[network]` 标记）或底层连接失败
 *   （ERR_PNPM_GIT_FETCH_FAILED / ETIMEDOUT / DNS 解析 / TLS 握手 / 代理拒绝）——
 *   是本机网络不通/被墙/代理有问题，不是插件问题 → 提示检查网络，不引导提 Issue
 * - pnpmIgnoredBuild：插件自身或依赖的构建脚本被 pnpm 安全白名单（allowBuilds）默认拦截
 *   （`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` / `ERR_PNPM_IGNORED_BUILDS`）。只影响带安装期
 *   构建的插件，其他插件不受影响 —— 差异在插件的依赖/打包方式，属插件依赖/打包问题
 *   → 引导去仓库提 Issue（建议改用预编译版本或关闭安装期构建）
 * - pluginPrepare：插件的 prepare/构建脚本实际执行失败（git tarball 常因缺失子模块或
 *   构建产物导致）—— 属插件打包/分发问题，应引导去仓库提 Issue
 * - repo：其余失败（含 git prepare 被 pnpm 白名单拦截等），默认按插件仓库问题引导提 Issue
 */
export function classifyFailure(message: string): FailureKind {
  // npm 内部崩溃（edgesOut）或服务端 [npm-too-low] 标记：是本机 npm 版本过低/自身缺陷，
  // 不是插件问题 —— 必须最先判，否则该报错会被外层 ERR_PNPM_PREPARE_PACKAGE 吞成
  // 「插件打包分发问题」，误导用户去提 Issue
  if (/\[npm-too-low\]|edgesOut/i.test(message)) return 'npmTooOld'
  // 找不到 pnpm 命令（dsh 报 `pnpm not found on PATH` —— dsh 用它管理 profile 插件 /
  // POSIX「pnpm: command not found」/ spawn pnpm ENOENT / Windows cmd 中英文报错）：
  // 本机缺 pnpm，不是插件问题。必须在 dshMissing 之前 —— dshMissing 正则含裸「command not
  // found」，会把 `pnpm: command not found` 吞成「dsh 缺失」，误引导用户去装 DSH
  // （dsh-plugin-hub#13：Linux 下 `dsh: pnpm not found on PATH` 被误归插件侧失败）
  if (/\[pnpm-missing\]|pnpm not found|pnpm: command not found|spawn pnpm ENOENT|'pnpm' 不是内部或外部命令|"pnpm" 不是内部或外部命令|pnpm['"]?\s*is not recognized/i.test(message)) return 'pnpmMissing'
  // 找不到 git 命令（服务端 [git-missing] 标记 / Windows cmd 中英文「'git' is not recognized」/
  // POSIX「git: command not found」/ spawn git ENOENT）：本机 Git 未安装或不在 PATH，不是插件问题。
  // 必须在 dshMissing 之前 —— dshMissing 正则含裸「is not recognized / command not found」，
  // 会把 git 缺失（'git' is not recognized as an internal or external command）吞成「dsh 缺失」，
  // 误导用户去装 DSH；且 pnpm 报 `ERR_PNPM_GIT_RESOLVE_FAILED`（git ls-remote failed）时
  // 若只看错误码会落到插件侧失败、引导去提 Issue（dsh-plugin-hub#21）
  if (/\[git-missing\]|spawn git ENOENT|'git' 不是内部或外部命令|"git" 不是内部或外部命令|git['"]?\s*is not recognized|git: command not found/i.test(message)) return 'gitMissing'
  // 找不到 npm 命令（全局 npm 安装通道 `npm install -g` spawn 的 npm 缺失 / Windows cmd 中英文
  // 「'npm' is not recognized」/ POSIX「npm: command not found」/ spawn npm ENOENT）：本机 npm 未安装
  // 或不在 PATH，不是插件问题。必须在 dshMissing 之前 —— dshMissing 正则含裸「is not recognized /
  // command not found」，会把 npm 缺失（'npm' is not recognized）吞成「dsh 缺失」，误导用户去装 DSH
  if (/\[npm-missing\]|spawn npm ENOENT|'npm' 不是内部或外部命令|"npm" 不是内部或外部命令|npm['"]?\s*is not recognized|npm: command not found/i.test(message)) return 'npmMissing'
  // 找不到 dsh 命令（服务端 [dsh-missing] 标记 —— 乱码免疫：Windows cmd 中文版输出 GBK，
  // 经 UTF-8 解码成乱码无法匹配原文，故服务端在 spawn 前用 which/where 探测并打 ASCII 标记；
  // 其余形态：Windows cmd「不是内部或外部命令」/ POSIX「command not found」/
  // node spawn ENOENT）：是本机 DSH 未正确安装或不在 PATH，不是插件问题 —— 必须先判，
  // 否则会被外层 "Command failed" 吞成「插件打包问题」，误导用户去提 Issue
  // （dsh-plugin-hub#12：Win 下 'dsh' 不在 PATH，cmd 报「不是内部或外部命令」被误归插件侧失败）
  if (/\[dsh-missing\]|不是内部或外部命令|is not recognized as an internal or external command|command not found|spawn dsh ENOENT/i.test(message)) return 'dshMissing'
  // pnpm 大版本/虚拟 store 位置不一致（ERR_PNPM_UNEXPECTED_STORE / ERR_PNPM_UNEXPECTED_VIRTUAL_STORE /
  // Unexpected store location）：profile 目录里旧依赖是另一个大版本 pnpm 生成的（或 profile 目录
  // 被复制/移动、virtual-store-dir 配置变化导致 virtual store 位置不匹配），当前 pnpm 出于安全
  // 不认旧 store —— 本机环境问题，任何插件装进该 profile 都会同样失败，不是插件问题
  // （dsh-plugin-hub#14：macOS 下 ERR_PNPM_UNEXPECTED_STORE 被误归插件侧失败；
  //  dsh-plugin-hub#30：ERR_PNPM_UNEXPECTED_VIRTUAL_STORE 漏判被误归插件侧失败）；
  // 提示清理依赖目录用当前 pnpm 重建，不引导提 Issue。必须在 pnpmMissing 之后 ——
  // pnpm 在（能跑起来报错），不是「找不到命令」。
  if (/ERR_PNPM_UNEXPECTED_(VIRTUAL_)?STORE|Unexpected (virtual )?store location/i.test(message)) return 'pnpmStore'
  // pnpm 供应链安全策略拦截（pnpm 11：minimumReleaseAge 拒收「刚发布」的包 /
  // untrusted origin 来源不受信任）：pnpm 在、也连得上，纯粹是本机策略不放行 ——
  // 装任何「新发布/非信任来源」的插件都会同样失败，不是插件问题（dsh-plugin-hub#15/#16）。
  // 必须在 pnpmIgnoredBuild 之前 —— 该策略优先于「构建脚本被白名单拦截」，且两者都不引导提 Issue。
  if (/ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION|Minimum release age|untrusted origin/i.test(message)) return 'pnpmPolicy'
  // 构建脚本被 pnpm 白名单（allowBuilds）拦截：插件的 prepare 脚本或依赖里的原生模块构建
  // 被默认拒绝（ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED / ERR_PNPM_IGNORED_BUILDS）。
  // 这类错误出现即说明 pnpm 已成功 fetch 到 tarball（网络是通的），主因是插件构建脚本
  // 被拦 —— 必须在 network 判定之前：日志尾部常混着重试残留的连接失败特征
  // （ETIMEDOUT / Failed to connect 等），若先判网络会把「插件分发问题」误报成
  // 「你的网络不通」（graph-memory issues #82-#84：PREPARE_NOT_ALLOWED + 尾随超时）。
  if (/ERR_PNPM_IGNORED_BUILDS|Ignored build scripts:|ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED/i.test(message)) return 'pnpmIgnoredBuild'
  // 网络问题（服务端 [network] 标记，或安装日志里的连接失败特征：git fetch 失败、
  // 连接超时/拒绝/重置、DNS 解析失败、TLS/SSL 握手失败）—— 是本机网络/代理问题，
  // 不是插件问题。必须在 prepare/Command failed 判定之前：git fetch 失败常被
  // 外层包成 "Command failed: git fetch ..."，先按网络特征归类才不会误判成插件问题。
  // 404 类「目标不存在」不含这些特征，仍归 repo（那是仓库/包的问题）。
  if (/\[network\]|ERR_PNPM_GIT_FETCH_FAILED|ETIMEDOUT|ECONNREFUSED|ECONNRESET|ENOTFOUND|EAI_AGAIN|EPIPE|EHOSTUNREACH|ENETUNREACH|getaddrinfo|Could not connect|Could not resolve host|Network unreachable|Failed to connect|socket hang up|CERT_HAS_EXPIRED|SSL certificate problem|\bTLS\b|\bSSL\b/i.test(message)) return 'network'
  // 装后校验拦截（服务端 verifyInstalledEntry 标记）：入口文件缺失 = git 分发缺构建产物，
  // 与 pluginPrepare 同类（插件打包/分发问题），引导去仓库提 Issue
  if (/\[packaging\]|entry file missing/i.test(message)) return 'pluginPrepare'
  // 再判 prepare 实际执行失败：只有构建脚本真的跑挂了才是插件问题
  if (/ERR_PNPM_PREPARE_PACKAGE|ELIFECYCLE|Command failed|prepare-guard/i.test(message)) return 'pluginPrepare'
  // 其余失败（含 git prepare 被 pnpm 白名单拦截）：当前通道装不上 = 插件分发/依赖的问题，一律提 Issue
  return 'repo'
}

/** 从服务端 `[npm-too-low]` 标记行提取本机 npm 版本（如 `[npm-too-low] npm@11.3.0` → "11.3.0"）；
 *  历史记录无标记时返回 null，前端据此决定提示文案是否带具体版本。 */
export function npmTooLowVersion(message: string): string | null {
  const m = message.match(/\[npm-too-low\]\s*npm@(\d+\.\d+\.\d+)/i)
  return m ? m[1] : null
}

/** 核心行特征：错误代码 / 生命周期脚本失败 / prepare 失败 / 描述性报错（子模块缺失、找不到等）/ 退出与宿主提示信息。 */
const CORE_LINE_RE = /ERR_[A-Z_]+|ELIFECYCLE|Command failed|prepare-guard|Failed to prepare|exit code|\bprepare\b|pnpm failed in profile|git-hosted plugins build|submodule|not found|cannot find|no such|unable to|fatal|missing|error/i
/** pnpm 的 peer 依赖告警行（`missing peer …` / `Issues with peer dependencies found` /
 *  `Peer dependencies that should be installed`）：宿主提供的 peer（@deepseek-ai/*、react、
 *  dsh-client-* 等，DSH profile 用 autoInstallPeers:false 不自动装）缺失是无害噪音，与插件本身
 *  无关 —— 抓核心错误时必须跳过，否则会被 CORE_LINE_RE 的 `missing` 分支误抓、淹没真正的
 *  错误码（如 git 源的 ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED），让 issue 正文只剩一堆 peer WARN
 *  （dsh-plugin-hub#28：anime-find 的 auto-issue 核心错误全是 missing-peer WARN 树，真正的
 *  prepare 错误被盖住）。 */
const PEER_WARN_RE = /missing peer|issues with peer dependencies|peer dependencies that should be installed/i
/** 提交 issue 时正文里错误摘要的上限字符数。GitHub 请求行上限 8192 字节，
 * 固定模板与 URL 编码开销约 1~2K，核心错误（以 ASCII 日志为主）可安全带到 ~5K；
 * 仍超长时 pluginIssueUrl 会逐档缩小核心预算，最终 URL 不会超限。 */
export const MAX_CORE_CHARS = 5000
/** 摘要里单行上限：允许构建 key 等长行也被截短。 */
const MAX_LINE_CHARS = 400

/**
 * 核心错误收集器：从完整安装输出里挑出真正说明问题的行（错误代码、构建脚本失败、
 * 退出与宿主提示），去重后拼接，单行与总量都截断 —— 只把「重点 + 原因」带进 issue 正文，
 * 避免完整日志塞进 URL 导致请求过长。无关键行时退化为「头部 + 尾部」快照。
 * maxChars 可由调用方按最终 URL 长度收紧（pluginIssueUrl 超限时逐档缩小）。
 */
export function summarizeError(message: string, maxChars: number = MAX_CORE_CHARS): string {
  const seen = new Set<string>()
  const core: string[] = []
  for (const raw of message.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || PEER_WARN_RE.test(line) || !CORE_LINE_RE.test(line)) continue
    const short = line.length > MAX_LINE_CHARS ? `${line.slice(0, MAX_LINE_CHARS)}…` : line
    if (!seen.has(short)) {
      seen.add(short)
      core.push(short)
    }
  }
  let out: string
  if (core.length === 0) {
    // 无关键行时退化为「头部 + 尾部」快照：优先保尾部完整，头部按预算压缩，总长不超上限
    const tail = message.trimEnd().slice(-1000)
    const sep = '\n…\n'
    const headBudget = Math.max(maxChars - tail.length - sep.length, 0)
    const head = message.slice(0, 500).trim()
    out = `${head.length > headBudget ? head.slice(0, headBudget) : head}${sep}${tail}`
  } else {
    out = core.join('\n')
  }
  return out.length > maxChars ? `${out.slice(0, maxChars)}\n… (truncated)` : out
}

/** 提取首个错误代码（如 ERR_PNPM_PREPARE_PACKAGE），无则 null。 */
export function coreErrorCode(message: string): string | null {
  const m = message.match(/\[?ERR_[A-Z_]+\]?/)
  return m ? m[0].replace(/^\[|\]$/g, '') : null
}

/**
 * 从网络类失败消息里提取「具体连不上的地址」，供弹窗精准提示（你的网络无法访问什么）。
 * 优先取服务端 [network] 预检消息括号里的探测地址（中文「（…）」/ 英文「(…)」），
 * 否则取消息里出现的第一个 URL（git fetch 的仓库地址、registry 域名等）。
 * 提取不到返回 null —— 调用方据此跳过地址行。
 */
export function unreachableTargetOf(message: string): string | null {
  // [network] 预检消息：`无法连接到 GitHub（https://github.com/）` / `cannot reach the npm registry (https://registry.npmjs.org/)`
  const paren = message.match(/[（(](https?:\/\/[^\s'"`<>（)+]+)[)）]/)
  if (paren) return paren[1]
  // 其余网络失败（git fetch / npm 连接失败）：取第一个 URL，去掉行尾标点
  const url = message.match(/https?:\/\/[^\s'"`<>（）()]+/)
  return url ? url[0].replace(/[.,;:）)\]]+$/, '') : null
}
