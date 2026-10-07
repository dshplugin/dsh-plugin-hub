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

export type FailureKind = 'npmTooOld' | 'dshMissing' | 'gitMissing' | 'pnpmMissing' | 'npmMissing' | 'pnpmStore' | 'pnpmWorkspace' | 'originRejected' | 'pnpmPolicy' | 'pnpmUnusedPatch' | 'pnpmMissingDep' | 'fileLocked' | 'accessDenied' | 'fsUnavailable' | 'pnpmIgnoredBuild' | 'pluginPrepare' | 'network' | 'repo'

/** Match the pnpm error code, not a generic mention of checksum or integrity. */
function missingTarballIntegrity(message: string): boolean {
  return /\bERR_PNPM_MISSING_TARBALL_INTEGRITY\b/.test(message)
}

/** The same policy subtype selects recovery copy in live and saved failures. */
export function pnpmPolicyHintOf(message: string): 'failPnpmTarballIntegrityHint' | 'failPnpmPolicyHint' {
  return missingTarballIntegrity(message) ? 'failPnpmTarballIntegrityHint' : 'failPnpmPolicyHint'
}

/**
 * 失败归类：把安装输出归到具体成因，供弹窗文案、是否引导提 Issue 与 issue 预填原因使用。
 * 分界是「本机环境问题」（装任何插件都会同样失败 → 不引导提 Issue）与
 * 「插件分发/依赖问题」（只影响这个插件 → 引导去仓库提 Issue）；各分支的判定顺序有依赖，
 * 原因见 classifyFailure 内注释。
 *
 * 本机环境问题：
 * - npmTooOld：本机 npm 版本过低或自身缺陷 —— npm arborist 解 peer 依赖时抛 `edgesOut`
 *   （build-ideal-tree.js 内部报错），或服务端已核实版本低于阈值并打了 `[npm-too-low]` 标记
 *   → 引导升级 npm
 * - dshMissing：安装器 spawn 的 `dsh` 命令找不到（Windows cmd「不是内部或外部命令」/ POSIX
 *   「command not found」/ spawn ENOENT）→ 提示检查 PATH / 重装 DSH
 * - gitMissing：安装器调用 `git` 时找不到可执行文件（Windows cmd「'git' is not recognized」/
 *   POSIX「git: command not found」/ spawn ENOENT）→ 提示安装 Git / 加入 PATH
 * - pnpmMissing：dsh 存在但调用的 `pnpm` 找不到（dsh 报 `pnpm not found on PATH` / POSIX
 *   「pnpm: command not found」/ spawn ENOENT）—— dsh 用 pnpm 管理 profile 插件
 *   → 提示安装 / 开启 pnpm
 * - npmMissing：全局 npm 安装通道（`npm install -g …`）spawn 的 `npm` 命令找不到，形态同上
 *   → 提示安装 npm（Node.js 自带）/ 加入 PATH
 * - pnpmStore：pnpm 报 store / virtual store 位置不匹配（`ERR_PNPM_UNEXPECTED_STORE` /
 *   `ERR_PNPM_UNEXPECTED_VIRTUAL_STORE` / `Unexpected store location`）—— profile 目录里的依赖
 *   是另一个大版本的 pnpm 生成的（或 profile 目录被复制/移动、virtual-store-dir 配置变化），
 *   当前 pnpm 出于安全不认 → 提示清理 profile 依赖目录后用当前 pnpm 重建
 * - pnpmWorkspace：pnpm 拒绝在 workspace 根目录下安装（`ERR_PNPM_ADDING_TO_ROOT`）—— profile
 *   目录含 pnpm-workspace.yaml 即被 pnpm 视为 workspace 根，宿主调 `pnpm add` 时未声明在根
 *   操作（缺 `-w`/`--workspace-root`），整条命令被拒 → 提示在 profile 的 .npmrc 里加
 *   `ignore-workspace-root-check=true` 或升级宿主
 * - originRejected：请求的来源没通过本地 hub 服务的校验（服务端 403，正文是裸的
 *   `untrusted origin`）—— 请求在进入安装流程前就被拒，与 pnpm 无关；常见于用非 localhost 的
 *   地址（如局域网 IP）打开市场页面，或宿主页面的 origin 未被识别 → 提示从本机地址打开市场后重试
 * - pnpmPolicy：pnpm 的供应链安全策略拒绝安装（缺少 tarball integrity、`ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` /
 *   `Minimum release age` —— 锁文件里包的发布时间还不满 24 小时被拒；`untrusted origin` ——
 *   依赖来源未被本机 pnpm 信任）→ 提示按子场景给解法（发布未满 24 小时 → `minimumReleaseAge: 0`
 *   豁免或等满 24 小时；untrusted origin → 删除 profile 的 node_modules + pnpm-lock.yaml 清掉
 *   不受信任来源后重装）
 * - pnpmUnusedPatch：profile 里留着指向旧版本 dsh-plugin 的 patch 声明，本次安装解析到的版本
 *   已经不是它（`ERR_PNPM_UNUSED_PATCH` / `The following patches were not used: dsh-plugin@1.4.2`）
 *   —— pnpm 发现补丁没被用上即中止整次安装 → 提示删掉该条目后重试
 * - pnpmMissingDep：profile 里留着一条指向 registry 上不存在的包的依赖，pnpm 解析时收到 404
 *   （`ERR_PNPM_FETCH_404` / `Not Found - 404`）—— 该 profile 的任何安装都会先卡在这条依赖上
 *   → 提示按包名删掉该条目后重试（404 的包通常不是正在安装的插件，故不引导提 Issue）
 * - fileLocked：pnpm 无法替换 profile 里被其他进程占用的文件（Windows `os error 32`
 *   「另一个程序正在使用此文件」/ `EBUSY` / `resource busy or locked`）—— 通常是宿主进程或
 *   杀毒软件实时扫描持有句柄 → 提示完全退出宿主后重试
 * - accessDenied：pnpm 在 profile 里替换文件时被系统拒绝写入（Windows `os error 5`
 *   「拒绝访问」= ERROR_ACCESS_DENIED / Node 的 `EPERM` `EACCES` / `Access is denied`）——
 *   文件/目录被其他进程占用、只读属性、目录 ACL 受限，或杀毒软件实时防护拦截写入
 *   → 提示退出宿主 / 关杀软后重试，仍失败则检查只读属性并以管理员身份运行
 * - fsUnavailable：本机文件系统层面根本写不进去 —— 磁盘/分区空间耗尽（`ENOSPC` /
 *   `no space left on device`，Windows 为 `os error 112`）、目标分卷或挂载点为只读
 *   （`EROFS` / `read-only file system`，Windows 写保护为 `os error 19`）、进程可用的文件句柄
 *   被耗尽（`EMFILE` / `ENFILE` / `too many open files`），都发生在 pnpm 落盘阶段
 *   → 提示按报错代码对号入座（清空间 / 换可写目录 / 重启宿主释放句柄）
 * - network：安装前连通性预检拦截（服务端 `[network]` 标记）、底层连接失败
 *   （ERR_PNPM_GIT_FETCH_FAILED / ETIMEDOUT / DNS 解析 / TLS 握手 / 代理拒绝），或
 *   registry tarball 拉取失败（`fetch failed` / `GET …/-/…tgz error (n)` —— 常见于本机
 *   npm/pnpm 的 registry 被指向内网/自定义源，该源取不到包），或界面请求压根没送达宿主服务
 *   （浏览器 fetch 的 `Failed to fetch` —— 宿主未就绪/正在重启，或本地代理拦了回环地址）
 *   → 提示检查网络，registry 指向自定义源时给出换源指引
 *
 * 插件分发/依赖问题（引导去仓库提 Issue）：
 * - pnpmIgnoredBuild：插件自身或依赖的构建脚本被 pnpm 安全白名单（allowBuilds）默认拦截
 *   （`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` / `ERR_PNPM_IGNORED_BUILDS`）—— 只影响带安装期
 *   构建的插件 → 建议改用预编译版本或关闭安装期构建
 * - pluginPrepare：插件的 prepare/构建脚本实际执行失败（git tarball 常因缺失子模块或构建产物
 *   导致），或装后校验发现 package.json 声明的入口文件不在发布物里（服务端 `[packaging]` 标记）
 *   —— 属插件打包/分发问题
 * - repo：其余失败，默认按插件仓库问题处理
 */
export function classifyFailure(message: string): FailureKind {
  // npm 内部崩溃（edgesOut）或服务端 [npm-too-low] 标记：是本机 npm 版本过低/自身缺陷，
  // 不是插件问题 —— 必须最先判，否则该报错会被外层 ERR_PNPM_PREPARE_PACKAGE 吞成
  // 「插件打包分发问题」，误导用户去提 Issue
  if (/\[npm-too-low\]|edgesOut/i.test(message)) return 'npmTooOld'
  // 找不到 pnpm 命令（dsh 报 `pnpm not found on PATH` —— dsh 用它管理 profile 插件 /
  // POSIX「pnpm: command not found」/ spawn pnpm ENOENT / Windows cmd 中英文报错）：
  // 本机缺 pnpm。必须在 dshMissing 之前 —— dshMissing 正则含裸「command not found」，
  // 会把 `pnpm: command not found` 吞成「dsh 缺失」，误引导用户去装 DSH
  if (/\[pnpm-missing\]|pnpm not found|pnpm: command not found|spawn pnpm ENOENT|'pnpm' 不是内部或外部命令|"pnpm" 不是内部或外部命令|pnpm['"]?\s*is not recognized/i.test(message)) return 'pnpmMissing'
  // 找不到 git 命令（服务端 [git-missing] 标记 / Windows cmd 中英文「'git' is not recognized」/
  // POSIX「git: command not found」/ spawn git ENOENT）：本机 Git 未安装或不在 PATH。
  // 必须在 dshMissing 之前 —— dshMissing 正则含裸「is not recognized / command not found」，
  // 会把 git 缺失（'git' is not recognized as an internal or external command）吞成「dsh 缺失」，
  // 误导用户去装 DSH
  if (/\[git-missing\]|spawn git ENOENT|'git' 不是内部或外部命令|"git" 不是内部或外部命令|git['"]?\s*is not recognized|git: command not found/i.test(message)) return 'gitMissing'
  // 找不到 npm 命令（全局 npm 安装通道 `npm install -g` spawn 的 npm 缺失 / Windows cmd 中英文
  // 「'npm' is not recognized」/ POSIX「npm: command not found」/ spawn npm ENOENT）：本机 npm 未安装
  // 或不在 PATH，不是插件问题。必须在 dshMissing 之前 —— dshMissing 正则含裸「is not recognized /
  // command not found」，会把 npm 缺失（'npm' is not recognized）吞成「dsh 缺失」，误导用户去装 DSH
  if (/\[npm-missing\]|spawn npm ENOENT|'npm' 不是内部或外部命令|"npm" 不是内部或外部命令|npm['"]?\s*is not recognized|npm: command not found/i.test(message)) return 'npmMissing'
  // 找不到 dsh 命令（服务端 [dsh-missing] 标记 —— 乱码免疫：Windows cmd 中文版输出 GBK，
  // 经 UTF-8 解码成乱码无法匹配原文，故服务端在 spawn 前用 which/where 探测并打 ASCII 标记；
  // 其余形态：Windows cmd「不是内部或外部命令」/ POSIX「command not found」/
  // node spawn ENOENT）：是本机 DSH 未正确安装或不在 PATH —— 必须先判，
  // 否则会被外层 "Command failed" 吞成「插件打包问题」，误导用户去提 Issue
  if (/\[dsh-missing\]|不是内部或外部命令|is not recognized as an internal or external command|command not found|spawn dsh ENOENT/i.test(message)) return 'dshMissing'
  // pnpm 大版本/虚拟 store 位置不一致（ERR_PNPM_UNEXPECTED_STORE / ERR_PNPM_UNEXPECTED_VIRTUAL_STORE /
  // Unexpected store location）：profile 目录里的依赖是另一个大版本 pnpm 生成的（或 profile 目录
  // 被复制/移动、virtual-store-dir 配置变化导致 virtual store 位置不匹配），当前 pnpm 出于安全
  // 不认 —— 任何插件装进该 profile 都会同样失败 → 提示清理依赖目录用当前 pnpm 重建。
  // 必须在 pnpmMissing 之后 —— pnpm 在（能跑起来报错），不是「找不到命令」。
  if (/ERR_PNPM_UNEXPECTED_(VIRTUAL_)?STORE|Unexpected (virtual )?store location/i.test(message)) return 'pnpmStore'
  // pnpm 拒绝在 workspace 根目录下安装（ERR_PNPM_ADDING_TO_ROOT）：profile 目录被视为
  // pnpm workspace 根，宿主调 pnpm add 时没声明在根操作（缺 -w/--workspace-root），
  // pnpm 直接整条命令拒绝 —— 本机 profile/宿主调用方式问题，任何插件都装不上
  if (/ERR_PNPM_ADDING_TO_ROOT|add the dependency to the workspace root/i.test(message)) return 'pnpmWorkspace'
  // 本地 hub 服务的来源校验拒绝了请求（服务端 403，正文恰好是 `untrusted origin`）：
  // 请求在 requireTrustedPost 就被拦下，压根没进入安装流程，与 pnpm 无关。
  // 必须放在 pnpmPolicy 之前 —— 后者正则含同名裸文本，会把这条吞成「pnpm 供应链策略」，
  // 并建议用户删掉 profile 的 node_modules + pnpm-lock.yaml（无效且具破坏性）。
  // 用「整行以它结尾」来区隔 pnpm 的真实报错：pnpm 的形态后面一定跟着 dsh 的上下文
  // （如 `untrusted origin\ndsh: pnpm failed in profile directory …`），不会被本规则命中
  if (/(^|\n)untrusted origin\s*$/.test(message)) return 'originRejected'
  // pnpm 供应链安全策略拦截（缺少 tarball 校验值 / minimumReleaseAge 拒收「刚发布」的包 /
  // untrusted origin 来源不受信任）：pnpm 在、也连得上，纯粹是本机策略不放行 ——
  // 装任何「新发布/非信任来源」的插件都会同样失败。
  // 必须在 pnpmIgnoredBuild 之前 —— 该策略优先于「构建脚本被白名单拦截」，且两者都不引导提 Issue。
  if (missingTarballIntegrity(message) || /ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION|Minimum release age|untrusted origin/i.test(message)) return 'pnpmPolicy'
  // profile 里留着指向旧版本 dsh-plugin 的 patch 声明（ERR_PNPM_UNUSED_PATCH /
  // `The following patches were not used: dsh-plugin@1.4.2`）：本机 pnpm 配置与本次解析到的版本
  // 对不上，pnpm 出于安全直接中止整次安装 —— 任何插件都装不进来 → 提示删条目后重试。
  // 必须在兜底之前，否则被归成「插件侧失败」引导去提 Issue。
  if (/ERR_PNPM_UNUSED_PATCH|patches were not used/i.test(message)) return 'pnpmUnusedPatch'
  // profile 里的文件被其他进程占用，pnpm 无法替换（Windows `os error 32`
  // 「另一个程序正在使用此文件，进程无法访问」/ EBUSY / resource busy or locked）——
  // 通常是宿主进程或杀毒软件实时扫描持有句柄；`os error 32` 用 ASCII 特征，中文原文乱码也能命中
  // → 提示完全退出宿主后重试
  if (/os error 32|EBUSY|resource busy or locked|being used by another process/i.test(message)) return 'fileLocked'
  // profile 里的文件/目录被系统拒绝写入（Windows `os error 5`「拒绝访问」= ERROR_ACCESS_DENIED /
  // Node 的 EPERM、EACCES / 英文 `Access is denied`）：占用、只读属性、目录 ACL 或杀软拦截，
  // 任何插件都装不上。`os error 5` 只认 ASCII 特征 —— 中文原文经 GBK→UTF-8 解码会残缺，
  // 不能依赖「拒绝访问」四个字
  if (/os error 5\b|ERROR_ACCESS_DENIED|\bEPERM\b|\bEACCES\b|access is denied/i.test(message)) return 'accessDenied'
  // 本机文件系统层面根本写不进去：空间耗尽（ENOSPC / no space left on device / Windows os error 112）、
  // 目标盘或挂载点只读（EROFS / read-only file system / Windows 写保护 os error 19）、
  // 文件句柄耗尽（EMFILE / ENFILE / too many open files）。都在 pnpm 落盘阶段发生，
  // 空间不足、盘只读或句柄不够时任何插件都装不进来，不是插件问题 ——
  // 必须在 network / prepare 之前判：磁盘满时 pnpm 会在日志尾部混着重试与超时特征，
  // 先判网络会把「本机磁盘写不进去」误报成「你的网络不通」
  if (/os error 112\b|os error 19\b|ERROR_DISK_FULL|ERROR_WRITE_PROTECT|\bENOSPC\b|\bEROFS\b|\bEMFILE\b|\bENFILE\b|no space left on device|read-only file system|too many open files/i.test(message)) return 'fsUnavailable'
  // 构建脚本被 pnpm 白名单（allowBuilds）拦截：插件的 prepare 脚本或依赖里的原生模块构建
  // 被默认拒绝（ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED / ERR_PNPM_IGNORED_BUILDS）。
  // 这类错误出现即说明 pnpm 已成功 fetch 到 tarball（网络是通的），主因是插件构建脚本
  // 被拦 —— 必须在 network 判定之前：日志尾部常混着重试残留的连接失败特征
  // （ETIMEDOUT / Failed to connect 等），若先判网络会把「插件分发问题」误报成「你的网络不通」。
  if (/ERR_PNPM_IGNORED_BUILDS|Ignored build scripts:|ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED/i.test(message)) return 'pnpmIgnoredBuild'
  // 网络问题（服务端 [network] 标记，或安装日志里的连接失败特征：git fetch 失败、
  // 连接超时/拒绝/重置、DNS 解析失败、TLS/SSL 握手失败，或 registry tarball 拉取失败
  // —— `fetch failed` / `GET https://…/-/…tgz error (n)` 是 pnpm 下载包文件时的网络层失败，
  // 常见于本机 npm/pnpm registry 被指向内网/自定义源而取不到包）—— 是本机网络/代理/源
  // 配置问题，不是插件问题。必须在 prepare/Command failed 判定之前：git fetch 失败常被
  // 外层包成 "Command failed: git fetch ..."，先按网络特征归类才不会误判成插件问题。
  // 404 类「目标不存在」不含这些特征，仍归 repo（那是仓库/包的问题）。
  // 注意：fetch failed 只在 pnpm 拉取阶段出现；prepare/构建已跑起来（tarball 到手）的
  // 插件问题不带此特征，不会误伤（allowBuilds 拦截在上一分支先判）。
  // `Failed to fetch` 是浏览器 fetch 的 TypeError（词序与 Node 的 fetch failed 相反）：界面
  // 请求根本没送达宿主服务（宿主未就绪/正在重启、本地代理拦了回环地址）。
  if (/\[network\]|ERR_PNPM_GIT_FETCH_FAILED|ETIMEDOUT|ECONNREFUSED|ECONNRESET|ENOTFOUND|EAI_AGAIN|EPIPE|EHOSTUNREACH|ENETUNREACH|getaddrinfo|Could not connect|Could not resolve host|Network unreachable|Failed to connect|socket hang up|CERT_HAS_EXPIRED|SSL certificate problem|\bTLS\b|\bSSL\b|fetch failed|failed to fetch|\bGET https?:\/\/\S+\.tgz\s+error \(\d+\)/i.test(message)) return 'network'
  // 装后校验拦截（服务端 verifyInstalledEntry 标记）：入口文件缺失 = git 分发缺构建产物，
  // 与 pluginPrepare 同类（插件打包/分发问题），引导去仓库提 Issue
  if (/\[packaging\]|entry file missing/i.test(message)) return 'pluginPrepare'
  // 依赖在 registry 上不存在（`ERR_PNPM_FETCH_404` / `Not Found - 404`）：pnpm 连得上 registry，
  // 是被明确告知「这个包不存在」—— 属于 profile 的本地依赖问题，不是插件问题。profile 里留着
  // 一条指向未发布包的依赖条目时，该 profile 的**任何**安装都会先卡在这条依赖上。
  // 必须在 pluginPrepare 之前判定：此时宿主尾部只有通用的 `dsh: plugin command failed`，
  // 落到下面会被当成构建失败。
  // （两个形态：pnpm 的 `[ERR_PNPM_FETCH_404] GET <url>: Not Found - 404` 与 npm 的
  //   `npm error 404 Not Found - GET <url> - Not found`）
  if (/ERR_PNPM_FETCH_404|404 Not Found|Not Found - 404/i.test(message)) return 'pnpmMissingDep'
  // 再判 prepare 实际执行失败：只有构建脚本真的跑挂了才是插件问题。
  // `Command failed` 区分大小写 —— 只匹配 pnpm 包装出的报错，不匹配宿主那句小写的
  // `dsh: plugin command failed`（那只是「这条命令失败了」的通用说明）。
  if (/ERR_PNPM_PREPARE_PACKAGE|ELIFECYCLE|prepare-guard/i.test(message) || /Command failed/.test(message)) return 'pluginPrepare'
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
 *  错误码（如 git 源的 ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED），让 issue 正文只剩一堆 peer WARN。 */
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

/** 提取首个错误代码（如 ERR_PNPM_PREPARE_PACKAGE），无则 null。
 *  代码里可能含数字（ERR_PNPM_FETCH_404 / ERR_PNPM_EBADPLATFORM_...），字符类需带上 0-9，
 *  否则会被截断成 `ERR_PNPM_FETCH_`。 */
export function coreErrorCode(message: string): string | null {
  const m = message.match(/\[?ERR_[A-Z0-9_]+\]?/)
  return m ? m[0].replace(/^\[|\]$/g, '') : null
}

/** 提取「registry 上不存在的包名」：从 404 行（`ERR_PNPM_FETCH_404 GET <registry>/<pkg>: Not Found - 404`）
 *  里取请求路径中的包名（含 scope，如 `@scope/name`）；非 404 或提取不到返回 null。 */
export function missingRegistryPackageOf(message: string): string | null {
  for (const line of message.split(/\r?\n/)) {
    if (!/ERR_PNPM_FETCH_404|404/.test(line)) continue
    const m = line.match(/GET\s+https?:\/\/[^\s/]+\/((?:@[^/\s:]+\/)?[^/\s:]+)/)
    if (m) return m[1]
  }
  return null
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

/** npm registry 的官方/常见公开镜像主机名：tarball 从这里下载属正常配置，
 * 失败按「网络不通」提示即可，不需要额外的换源指引。 */
const PUBLIC_REGISTRY_HOSTS = new Set([
  'registry.npmjs.org',
  'registry.yarnpkg.com',
  'registry.npmmirror.com',
  'mirrors.cloud.tencent.com',
  'mirrors.huaweicloud.com',
])

/**
 * 网络类失败消息里，判断是否「npm/pnpm 的 registry 被指向了内网/自定义源导致拉包失败」。
 * pnpm 下载包文件的 URL 形如 `<registry>/<pkg>/-/<pkg>-<ver>.tgz`（路径含 `/-/`）；
 * 若该 tarball 的主机不属于官方/常见公开镜像，说明本机 registry 被配成了私有/内网源
 * （如公司 Artifactory）—— 常因源未同步该包、需内网认证或网络策略拦截而失败。
 * 返回该主机名供前端给出「检查 registry 配置」的精准提示；官方/公开源或提取不到返回 null，
 * 调用方按通用网络问题提示即可。
 */
export function registryHostOf(message: string): string | null {
  const m = message.match(/https?:\/\/([^/\s]+)\/[^\s'"`<>]*\/-\/[^\s'"`<>]+/)
  if (!m) return null
  const host = m[1].replace(/:\d+$/, '')
  return PUBLIC_REGISTRY_HOSTS.has(host) ? null : host
}
