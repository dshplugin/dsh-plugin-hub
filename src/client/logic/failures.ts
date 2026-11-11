/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 失败归类、Issue 正文摘要与持久化的安装/卸载通知。
 *
 * 每个结算后的任务都会双重留痕：服务端系统日志（hub.log）与馈送通知中心的客户端
 * localStorage 记录 —— 即使弹窗被关闭、无人盯着进度条，结果也不会丢失。
 */
export interface NotificationRecord {
  id: number
  kind: 'install' | 'uninstall' | 'update'
  /** true = 成功（轻量记录）；false = 失败（message 携带完整错误日志） */
  ok: boolean
  /** owner/repo（可能为空：请求层失败但拿不到仓库时） */
  repo: string
  /** 实际动作（install/update/uninstall）：成功/失败通知据此区分「安装成功」与「更新成功」。
   *  缺省按 kind 归类（历史记录可能没有该字段）。更新提醒（kind='update'）不用此字段。 */
  action?: 'install' | 'update' | 'uninstall'
  /** 失败时的完整错误日志；成功记录为空串 */
  message: string
  /** 更新提醒：目录里的新版本号（展示用；其余通知省略） */
  version?: string
  /** 实际执行的安装/卸载命令（issue 预填时如实展示）；历史记录可能缺失 */
  command?: string
  /** 尝试过的安装方式（实际执行过的命令，按先后顺序）：失败提 Issue 时贴给作者，便于反推正确的 npm 包名 */
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

export type FailureKind = 'npmTooOld' | 'nodeEngine' | 'dshMissing' | 'gitMissing' | 'pnpmMissing' | 'npmMissing' | 'pnpmStore' | 'pnpmModulesMismatch' | 'profileYamlCorrupted' | 'profileLocalBuild' | 'profileBadAllowBuilds' | 'profileState' | 'pnpmWorkspace' | 'originRejected' | 'pnpmPolicy' | 'pnpmUnusedPatch' | 'pnpmMissingDep' | 'pluginMissingDep' | 'registryVersionStale' | 'registryAuth' | 'profileExclusive' | 'pnpmLinkedDirMissing' | 'fileLocked' | 'accessDenied' | 'fsUnavailable' | 'buildToolchainMissing' | 'pnpmIgnoredBuild' | 'pluginPrepare' | 'hostIncompatible' | 'tlsTrust' | 'network' | 'hostCliSpawn' | 'hubState' | 'profileBundleMissing' | 'timeout' | 'profileLock' | 'dshTooOld' | 'localEnv' | 'hub'

/** 失败动作规则：标题、上报正文与提示文案按安装/更新/卸载取词，不写死「安装」。 */
export type FailureAction = 'install' | 'update' | 'uninstall'

/** 动作词（英文）：名词短语，标题与句子里都成立。 */
export function actionWordEn(action: FailureAction): string {
  return action === 'uninstall' ? 'removal' : action === 'update' ? 'update' : 'install'
}

/** 动作词（中文）：安装 / 更新 / 卸载。 */
export function actionWordZh(action: FailureAction): string {
  return action === 'uninstall' ? '卸载' : action === 'update' ? '更新' : '安装'
}

/** 记录的动作：老记录只有 kind，按 kind 归类。 */
export function actionOfRecord(rec: { kind: NotificationRecord['kind']; action?: FailureAction }): FailureAction {
  if (rec.action !== undefined) return rec.action
  return rec.kind === 'uninstall' ? 'uninstall' : rec.kind === 'update' ? 'update' : 'install'
}

/**
 * `Ignored build scripts:` 名单是否**全部**是 profile 本地的 file:/link: 依赖。
 * 已发布插件无法依赖用户机器上的本地路径，这类条目只可能来自 profile 里已有的别的插件；
 * 而 pnpm 每次 add 都会重校验整棵 profile 依赖树，本地包构建失败会让本次安装同样失败，
 * 与本次要装的插件无关。
 */
function localBuildScriptsOnly(message: string): boolean {
  const line = /Ignored build scripts:\s*([^\n]*)/i.exec(message)?.[1] ?? ''
  const specs = line.split(',').map((spec) => spec.trim()).filter((spec) => spec !== '')
  if (specs.length === 0) return false
  // pnpm 写成 `dsh-purge@file:../../vendor/dsh-purge`；容错无版本号的 `file:...` 裸写法
  return specs.every((spec) => /(?:^|@)(?:file|link):/i.test(spec))
}

/** 只匹配 pnpm 的错误码，不匹配泛泛出现的 checksum / integrity 字样。 */
function missingTarballIntegrity(message: string): boolean {
  return /\bERR_PNPM_MISSING_TARBALL_INTEGRITY\b/.test(message)
}

/** GitHub 分支 tarball 内容变了、锁文件里还是旧校验和（ERR_PNPM_TARBALL_INTEGRITY）。
 *  \b 保证不会命中 ERR_PNPM_MISSING_TARBALL_INTEGRITY：前者是有校验值但对不上，
 *  后者是锁文件里压根没有校验值。 */
function mismatchedTarballIntegrity(message: string): boolean {
  return /\bERR_PNPM_TARBALL_INTEGRITY\b/.test(message)
}

/** pnpm 拒收「刚发布」包时，报错里带着发布时间；这里从报错文本算出「发布满 24h」的可重试时刻（UTC，分钟精度）。 */
export function releaseAgeRetryAfter(message: string): string | null {
  const match = /published at (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)/.exec(message)
  if (match === null) return null
  const published = Date.parse(match[1])
  if (Number.isNaN(published)) return null
  return `${new Date(published + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}Z`
}

/**
 * 同一策略子类型也用于选择实时/已保存失败的提示文案：minimumReleaseAge 只有在能算出
 * 可重试时刻时才走专属文案（给出确切的「何时可再试」），算不出时退回通用文案，
 * 避免出现「预计可重试时间：」后接空值的残缺句子。
 */
export function pnpmPolicyHintOf(message: string): 'failPnpmTarballIntegrityHint' | 'failPnpmTarballMismatchHint' | 'failPnpmReleaseAgeHint' | 'failPnpmPolicyHint' {
  // 校验和对不上（分支 tarball 变了）：先于「缺校验值」，两者报错前缀不同但都叫 tarball integrity
  if (mismatchedTarballIntegrity(message)) return 'failPnpmTarballMismatchHint'
  if (missingTarballIntegrity(message)) return 'failPnpmTarballIntegrityHint'
  if (/ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION|ERR_PNPM_NO_MATURE_MATCHING_VERSION|Minimum release age|minimumReleaseAge/i.test(message)
      && releaseAgeRetryAfter(message) !== null) {
    return 'failPnpmReleaseAgeHint'
  }
  return 'failPnpmPolicyHint'
}

/** 与 pnpmPolicyHintOf 配套的文案参数：release-age 场景给出可重试时刻（{time}）。 */
export function pnpmPolicyHintParams(message: string): Record<string, string> {
  return { time: releaseAgeRetryAfter(message) ?? '' }
}

/**
 * 失败归类：把安装输出归到具体成因，供弹窗文案与是否引导提 Issue 使用。
 * 分界是「本机环境问题」（装任何插件都会同样失败 → 不引导提 Issue）与「插件分发问题」
 * （只影响这个插件 → 才引导提 Issue）。各分支判定顺序有依赖，见函数内注释。
 */
export function classifyFailure(message: string): FailureKind {
  // 宿主版本要求：插件声明的兼容范围不含当前 dsh 版本，宿主在安装前直接拒绝。
  // 必须最先判 —— 这是宿主自己给的结论，不是 pnpm 的安装失败
  if (/installation rejected:.*incompatible with dsh/i.test(message)) return 'hostIncompatible'
  // desktop profile 由桌面应用独占：外部 dsh CLI 无权管理，宿主在安装前直接拒绝。
  // 属宿主/环境约束，不是插件问题；必须在所有 pnpm 分支之前判（日志里没有 pnpm 报错）。
  if (/is managed exclusively by the Electron application|managed exclusively by the desktop app/i.test(message)) return 'profileExclusive'
  // npm 自身崩溃（edgesOut）或服务端标记的本机 npm 版本过低。必须最先判，否则会被外层
  // ERR_PNPM_PREPARE_PACKAGE 吞成「插件打包问题」
  if (/\[npm-too-low\]|edgesOut/i.test(message)) return 'npmTooOld'
  // 本机 Node / pnpm 版本低于包声明的下限：装任何声明了同样 engine 的插件都会失败，属本机环境。
  // 只认硬错误码 —— pnpm 的「WARN Unsupported Engine」只是告警，照着判会盖掉真实失败原因
  if (/ERR_PNPM_UNSUPPORTED_ENGINE|ERR_PNPM_INVALID_NODE_VERSION|\bEBADENGINE\b/i.test(message)) return 'nodeEngine'
  // 本机缺 pnpm。必须在 dshMissing 之前 —— 后者的裸「command not found」会吞掉 pnpm 缺失
  if (/\[pnpm-missing\]|pnpm not found|pnpm: command not found|spawn pnpm ENOENT|'pnpm' 不是内部或外部命令|"pnpm" 不是内部或外部命令|pnpm['"]?\s*is not recognized/i.test(message)) return 'pnpmMissing'
  // 本机缺 git。必须在 dshMissing 之前，原因同上（裸「is not recognized」会吞掉 git 缺失）
  if (/\[git-missing\]|spawn git ENOENT|'git' 不是内部或外部命令|"git" 不是内部或外部命令|git['"]?\s*is not recognized|git: command not found/i.test(message)) return 'gitMissing'
  // 本机缺 npm。必须在 dshMissing 之前，原因同上
  if (/\[npm-missing\]|spawn npm ENOENT|'npm' 不是内部或外部命令|"npm" 不是内部或外部命令|npm['"]?\s*is not recognized|npm: command not found/i.test(message)) return 'npmMissing'
  // 本机缺 dsh。服务端 [dsh-missing] 标记乱码免疫（Windows GBK 解码后无法匹配原文）
  if (/\[dsh-missing\]|不是内部或外部命令|is not recognized as an internal or external command|command not found|spawn dsh ENOENT/i.test(message)) return 'dshMissing'
  // profile 的 modules 目录与当前 pnpm 配置不一致（pnpm 会把 virtual-store-dir-max-length /
  // public-hoist-pattern / hoist 规则 / node-linker 等写进 node_modules/.modules.yaml，任一不一致就拒绝复用）。
  // 必须在 pnpmStore 之前：两者处置方式不同（这里只需按当前配置重建 modules 目录）。
  if (/ERR_PNPM_[A-Z0-9_]*DIFF\b|modules directory was created using a different/i.test(message)) return 'pnpmModulesMismatch'
  // store 版本不匹配：profile 依赖由另一大版本 pnpm 生成，当前 pnpm 不认。
  // 必须在 pnpmMissing 之后（pnpm 能跑起来报错，不是找不到命令）
  if (/ERR_PNPM_UNEXPECTED_(VIRTUAL_)?STORE|ERR_PNPM_UNEXPECTED_PKG_CONTENT_IN_STORE|Unexpected (virtual )?store location/i.test(message)) return 'pnpmStore'
  // pnpm 拒绝往 workspace 根装依赖：profile 被视为 workspace 根但未声明根操作
  if (/ERR_PNPM_ADDING_TO_ROOT|add the dependency to the workspace root/i.test(message)) return 'pnpmWorkspace'
  // 本地服务来源校验拒绝（403 untrusted origin），请求没进安装流程。必须在 pnpmPolicy 之前
  // —— 后者同名裸文本会把这条误判成供应链策略。用「整行以它结尾」区隔 pnpm 真实报错
  if (/(^|\n)untrusted origin\s*$/.test(message)) return 'originRejected'
  // pnpm 供应链策略拦截（缺 tarball integrity / 校验和不匹配 / minimumReleaseAge / untrusted origin）。
  // 必须在 pnpmIgnoredBuild 之前
  if (missingTarballIntegrity(message) || mismatchedTarballIntegrity(message) || /ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION|ERR_PNPM_NO_MATURE_MATCHING_VERSION|Minimum release age|minimumReleaseAge|untrusted origin/i.test(message)) return 'pnpmPolicy'
  // profile 残留旧版本 patch 声明，pnpm 中止安装。必须排在默认归类之前
  if (/ERR_PNPM_UNUSED_PATCH|patches were not used/i.test(message)) return 'pnpmUnusedPatch'
  // profile 里的 YAML 配置解析失败（pnpm-workspace.yaml / pnpm-lock.yaml 有重复键、缩进坏了）：
  // pnpm 在依赖解析之前就退出，装任何插件都会同样失败，属本机 profile 配置问题。
  // 必须在 profileState / pluginPrepare 之前 —— 日志尾部常带 `Command failed: … pnpm.mjs add …`
  if (/\[profile-yaml\]|duplicated mapping key|bad indentation of a (?:mapping|sequence) entry/i.test(message)) return 'profileYamlCorrupted'
  // profile 的 pnpm 元数据与本机不一致（lockfile 过期 / 找不到可安装的 manifest / packageManager
  // 版本不符 / 补丁未生效 / workspace 依赖缺失）：都是 profile 自身状态，这个 profile 里装任何
  // 插件都会同样失败。必须在 pluginPrepare 之前 —— 这类错误常被 pnpm 包一层 Command failed
  if (/ERR_PNPM_OUTDATED_LOCKFILE|ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND|ERR_PNPM_NO_PKG_MANIFEST|ERR_PNPM_BAD_PM_VERSION|ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY|ERR_PNPM_PATCH_NOT_APPLIED|ERR_PNPM_WORKSPACE_PKG_NOT_FOUND|ERR_PNPM_JSON_PARSE|ERR_PNPM_PKG_MANIFEST_IS_NOT_OBJECT|ERR_PNPM_MISSING_HOIST_PATTERN|Cannot install with "frozen-lockfile"/i.test(message)) return 'profileState'
  // profile 文件被其他进程占用（os error 32 / EBUSY）。ASCII 特征免疫乱码
  if (/os error 32|EBUSY|resource busy or locked|being used by another process/i.test(message)) return 'fileLocked'
  // 系统拒绝写 profile（os error 5 / EPERM / EACCES）。ASCII 特征免疫乱码
  if (/os error 5\b|ERROR_ACCESS_DENIED|\bEPERM\b|\bEACCES\b|access is denied/i.test(message)) return 'accessDenied'
  // 文件系统写不进去（ENOSPC/EROFS/EMFILE/ENFILE）。必须在 network 之前判：
  // 磁盘满时日志尾部混超时特征，先判网络会误报成「网络不通」
  if (/os error 112\b|os error 19\b|ERROR_DISK_FULL|ERROR_WRITE_PROTECT|\bENOSPC\b|\bEROFS\b|\bEMFILE\b|\bENFILE\b|no space left on device|read-only file system|too many open files/i.test(message)) return 'fsUnavailable'
  // 名单全是本地 file:/link: 依赖时，失败只能来自 profile 自身的包重校验：归本机状态，
  // 不能记到本次插件头上。必须在 pnpmIgnoredBuild 之前，否则会被它先按插件侧接走
  if (localBuildScriptsOnly(message)) return 'profileLocalBuild'
  // profile 的 allowBuilds 里有 pnpm 解析不了的 spec（`pkg@https://…` / `pkg@file:…`）：
  // pnpm v11 在依赖解析之前就把每条规则当成「包名@精确版本」解析并抛错，该 profile 里
  // 之后任何安装都会失败 —— 与本次要装的插件无关（#730）
  if (/ERR_PNPM_INVALID_VERSION_UNION|Invalid versions union/i.test(message)) return 'profileBadAllowBuilds'
  // 构建脚本被 allowBuilds 拦截。必须在 network 之前判：日志尾部混重试残留的连接失败特征
  if (/ERR_PNPM_IGNORED_BUILDS|Ignored build scripts:|ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED/i.test(message)) return 'pnpmIgnoredBuild'
  // npm 源拒绝了访问（401/403）：私有源要登录凭据，或当前网络/IP 不被源允许。
  // 必须在 network 之前判：pnpm 的 401/403 日志也常带 "fetch failed" 字样，先判网络会误报成「网络不通」
  if (/ERR_PNPM_FETCH_40[13]\b|\bE40[13]\b|(?:Unauthorized|Forbidden)\s*-\s*40[13]\b/i.test(message)) return 'registryAuth'
  // profile 里指向已删除目录的本地依赖（file:/link:）：pnpm 直接 ENOENT（lstat），任何安装都会失败。
  // 必须在 network 之前判 —— 同一份日志常混着 pnpm 重试产生的 UND_ERR_* 警告，先判网络会把根因盖掉。
  if (/ERR_PNPM_LINKED_PKG_DIR_NOT_FOUND|Could not install from .+ as it does not exist|pnpm:\s*ENOENT: no such file or directory,\s*(?:lstat|scandir|readlink)/i.test(message)) return 'pnpmLinkedDirMissing'
  // TLS 证书信任失败（公司 SSL 审计 / 杀软网页防护 / 本机代理替换证书）：属于本机证书链问题，
  // 必须在 network 之前 —— 否则会被当成「网络不通」，给出的排查方向完全不对。
  if (/unable to verify the first certificate|SELF_SIGNED_CERT_IN_CHAIN|UNABLE_TO_VERIFY_LEAF_SIGNATURE|ERR_TLS_CERT_ALTNAME_INVALID|CERT_HAS_EXPIRED|certificate has expired|UNABLE_TO_GET_ISSUER_CERT|CERT_UNTRUSTED|ERR_TLS_CERT/i.test(message)) return 'tlsTrust'
  // 网络/代理/源配置问题。必须在 prepare 之前判：git fetch 失败常被外层包成 "Command failed"
  // tarball 下载失败的括号里可能是数字码（pnpm 自己的）或符号码（undici 的 UND_ERR_*），两种都要认
  if (/\[network\]|ERR_PNPM_GIT_FETCH_FAILED|ERR_PNPM_FETCH_5\d\d|ERR_PNPM_META_FETCH_FAIL|ERR_SOCKET_TIMEOUT|ETIMEDOUT|ECONNREFUSED|ECONNRESET|ENOTFOUND|EAI_AGAIN|EPIPE|EHOSTUNREACH|ENETUNREACH|UND_ERR_[A-Z0-9_]+|getaddrinfo|Could not connect|Could not resolve host|Network unreachable|Failed to connect|socket hang up|CERT_HAS_EXPIRED|SSL certificate problem|SSL routines|TLS handshake|SSL handshake|ERR_SSL_|ssl_error|fetch failed|failed to fetch|\bGET https?:\/\/\S+\.tgz\s+error \([A-Za-z0-9_]+\)/i.test(message)) return 'network'
  // 浏览器端请求超时（客户端 fetch 被 abort）：请求没到宿主，属于连不上网络，与插件无关
  if (/\[request-timeout\]/i.test(message)) return 'network'
  // 装后校验发现入口文件缺失（[packaging]）= 分发物缺构建产物
  if (/\[packaging\]|entry file missing/i.test(message)) return 'pluginPrepare'
  // registry 上不存在的依赖（404），profile 任何安装都会卡在这条。必须在 pluginPrepare 之前判
  // [registry-missing]（服务端官方源复核后注入）= 作者侧缺依赖，须先于 pnpmMissingDep（同样含 404 文本）
  if (/\[registry-missing\]/i.test(message)) return 'pluginMissingDep'
  if (/ERR_PNPM_FETCH_404|404 Not Found|Not Found - 404/i.test(message)) return 'pnpmMissingDep'
  // 要装的版本在实际安装源里没有（镜像滞后或版本写错）。必须在 pluginPrepare 之前判
  if (/\bERR_PNPM_NO_MATCHING_VERSION\b|\bETARGET\b|No matching version found/i.test(message)) return 'registryVersionStale'
  // 原生模块需要本机编译，缺编译器/构建工具属于用户环境，不是插件的 prepare 失败。
  // 必须排在 pluginPrepare 之前：这类日志同样带 ELIFECYCLE，否则会被推给作者。
  if (/Unable to detect compiler type|gyp ERR!|Could not find any Visual Studio|No Xcode or CLT version detected|xcode-select|python(?:3)? is (?:not set|not found)|Could not find Python|\bmake: not found\b|\bgcc: not found\b|\bg\+\+: not found\b|\bMSB\d{4}\b/i.test(message)) return 'buildToolchainMissing'
  // 构建脚本真的跑挂了才算插件问题。必须带正向证据：`Command failed` 只是外层进程包装，
  // 单凭它不能说明 prepare 失败（Electron 内置 pnpm 崩溃时日志里往往只剩这一句，
  // 会把无关作者当成分发缺陷）。无证据的包装层失败交给 hub 分诊。
  if (/ERR_PNPM_PREPARE_PACKAGE|ELIFECYCLE|prepare-guard|prepare script failed|Failed to prepare/i.test(message)) return 'pluginPrepare'
  // 安装器自身产生的状态类消息（未安装 / 不在此处卸载 / 已在队列中 / 已安装）：这几句由本服务的
  // 守卫发出，不是 CLI 输出、也不是插件问题，而是插件中心的已安装列表与实读快照不同步。
  // 单独归类，让前端给「刷新后重试」这类可行动提示，而不是当作未知失败引导去提 Issue。
  // already installed 只认「整行就是它」的短形态；带「——」说明的
  // 包名冲突另有处置，不能按状态不同步提示。
  if (/plugin is not installed|plugin cannot be uninstalled here|already queued:|^already installed: \S+$/im.test(message)) return 'hubState'
  // 安装器自己的超时标记（命令跑满上限被强杀）：既不是插件问题、也不是用户环境问题，而且很可能是
  // 「其实已经装上了」——摆放位置在一切错误码分支之后，日志里真有 pnpm 报错时仍以真实报错为准。
  // 单独归类，给「刷新确认是否已安装」这类可行动提示，不引导提 Issue。
  if (/^\[timed out\]$/m.test(message)) return 'timeout'
  // DSH 自身的 profile 写锁超时（atomic-write 等不到 package.json.lock）：同一 profile 上还有另一个
  // dsh 进程或安装任务在写，锁一直没释放。既不是插件问题、也不是用户环境坏了 —— 把并发收掉重试即可。
  // 摆放位置同样在一切错误码分支之后：日志里真有 pnpm 报错时仍以真实报错为准。
  if (/atomic-write: timed out waiting for the writer lock|timed out waiting for the writer lock/i.test(message)) return 'profileLock'
  // 宿主自己的 allowBuilds 摘要行（pnpm 原文只写进 diagnostics 日志文件，终端只剩这一句）
  if (/git-hosted plugins build on install via their prepare script|add the exact key pnpm printed above under allowBuilds/i.test(message)) return 'pnpmIgnoredBuild'
  // 宿主启动插件管理时找不到某个 profile bundle（`cannot resolve profile bundle "<pkg>"`）：
  // 该 profile 声明的依赖没装全（node_modules 被删过 / 上次安装中断 / 桌面端更新不完整），
  // 与本次要装的插件无关 —— 必须排在 hub 的默认归类之前，否则又会被当成未知错误丢给我们
  if (/cannot resolve profile bundle/i.test(message)) return 'profileBundleMissing'
  // 宿主自身入口起不来（服务端 [host-spawn] 标记）：环境问题，给提示、不引导提 Issue。
  // 不匹配 `spawn … ENOENT` 文本 —— 那个形态任何 spawn（curl/git/taskkill…）都会产出
  if (/\[host-spawn\]/i.test(message)) return 'hostCliSpawn'
  // 安装器读插件 npm 元数据得出的客观结论：插件声明的 DSH 下限高于本机宿主。
  // 放在所有具体成因之后 —— 日志里有真实报错时仍以真实报错为准；但在「未分类」之前，
  // 否则这类本来能说清的失败又会变成未知。
  if (/\[dsh-too-old\]/i.test(message)) return 'dshTooOld'
  // 裸 `spawn <cmd> ENOENT`（无 [host-spawn] 标记）：分不清是用户机器上缺这个可执行文件，
  // 还是安装器解析错了路径 —— 不冒充环境问题，留给插件中心分诊
  if (/spawn .+ ENOENT/i.test(message)) return 'hub'
  // 未命中任何具体成因，但特征指向本机环境（系统调用错误码 / 证书代理 / 本地配置损坏）：
  // 归「本机环境」给自助排查，而不是丢进未分类让用户等着我们分析 —— 装任何插件都会同样失败，
  // 且这类误判代价低（用户自查重试即可）。位置必须在所有具体分支之后：能精确归因的优先精确。
  if (LOCAL_ENV_RE.test(message)) return 'localEnv'
  // 其余未知失败：没有任何环境/插件侧特征，可能是安装器或宿主的 bug —— 引导到插件中心仓库排查
  return 'hub'
}

/** 「特征指向本机环境但说不清具体哪一类」的最后的判断规则：系统调用错误码（权限/路径过长/设备异常）、
 *  证书与代理校验失败、本地配置文件（~/.npmrc、profile 的 package.json）损坏。
 *  只做排除用：命中它表示「不是插件侧问题」，不代表我们已经定位到原因。 */
const LOCAL_ENV_RE = /os error \d{1,3}\b|ERROR_[A-Z_]{4,}|\bE(?:ACCES|PERM|NOENT|NAMETOOLONG|INVAL|PROTO|ISDIR|NOTDIR|EXIST|BADF|NOTEMPTY|JSONPARSE|NOMEM)\b|JavaScript heap out of memory|Unexpected token .{0,60}in JSON|SELF_SIGNED_CERT_IN_CHAIN|UNABLE_TO_VERIFY_LEAF_SIGNATURE|ERR_TLS_CERT_ALTNAME_INVALID|unable to verify the first certificate|self[- ]signed certificate|ERR_INVALID_URL|invalid registry|proxy authentication|407 Proxy/i

/** 从服务端 `[npm-too-low]` 标记行提取本机 npm 版本（如 `[npm-too-low] npm@11.3.0` → "11.3.0"）；
 *  历史记录无标记时返回 null，前端据此决定提示文案是否带具体版本。 */
export function npmTooLowVersion(message: string): string | null {
  const m = message.match(/\[npm-too-low\]\s*npm@(\d+\.\d+\.\d+)/i)
  return m ? m[1] : null
}

/** 核心行特征：错误代码 / 生命周期脚本失败 / prepare 失败 / 描述性报错（子模块缺失、找不到等）/ 退出与宿主提示信息。 */
const CORE_LINE_RE = /ERR_[A-Z_]+|ELIFECYCLE|Command failed|prepare-guard|Failed to prepare|exit code|\bprepare\b|pnpm failed in profile|git-hosted plugins build|incompatible with dsh|submodule|not found|cannot find|no such|unable to|fatal|missing|error/i
/** pnpm 的 peer 依赖告警行（`missing peer …` / `Issues with peer dependencies found` /
 *  `Peer dependencies that should be installed`）：宿主提供的 peer（@deepseek-ai/*、react、
 *  dsh-client-* 等，DSH profile 用 autoInstallPeers:false 不自动装）缺失是无害噪音，与插件本身
 *  无关 —— 抓核心错误时必须跳过，否则会被 CORE_LINE_RE 的 `missing` 分支误抓、淹没真正的
 *  错误码（如 git 源的 ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED），让 issue 正文只剩一堆 peer WARN。 */
const PEER_WARN_RE = /missing peer|issues with peer dependencies|peer dependencies that should be installed/i
/** 安装器自己打的诊断标记行：它们本身就是「为什么没有日志 / 卡在哪一步」的证据，
 *  不含 CORE_LINE_RE 的关键词，必须无条件保留 —— 否则上报正文会退回成只剩宿主那句摘要，
 *  我们又拿不到任何可排查的信息（#382/#393 就是这样）。 */
const MARKER_LINE_RE = /^\[(?:pnpm log|no-output|desktop-cli-fallback|dsh-too-old|host-spawn|npm-too-low|git-missing|npm-missing|pnpm-missing|dsh-missing|network|packaging|profile-yaml|registry-missing|registry-mirror-lag|registry-fallback|allow build|stale pipe|install-channel|internal|exit\b|timed out)/i
/** 提交 issue 时正文里错误摘要的上限字符数。GitHub 请求行上限 8192 字节，
 * 固定模板与 URL 编码开销约 1~2K，核心错误（以 ASCII 日志为主）可安全带到 ~5K；
 * 仍超长时 pluginIssueUrl 会逐档缩小核心预算，最终 URL 不会超限。 */
export const MAX_CORE_CHARS = 5000
/** 摘要里单行上限：允许构建 key 等长行也被截短。 */
const MAX_LINE_CHARS = 400

/**
 * 展示用格式化：宿主兼容性提示里的 peerDependencies 是压缩成一行的 JSON，
 * 直接展示像一团乱码；展开成缩进格式，解析失败则原样返回。
 */
export function formatFailureMessage(message: string): string {
  return message.replace(/peerDependencies (\{.*?\})/g, (whole: string, json: string) => {
    try {
      return `peerDependencies ${JSON.stringify(JSON.parse(json), null, 2)}`
    } catch {
      return whole
    }
  })
}

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
    if (!line || PEER_WARN_RE.test(line)) continue
    if (!MARKER_LINE_RE.test(line) && !CORE_LINE_RE.test(line)) continue
    const short = line.length > MAX_LINE_CHARS ? `${line.slice(0, MAX_LINE_CHARS)}…` : line
    if (!seen.has(short)) {
      seen.add(short)
      core.push(short)
    }
  }
  let out: string
  if (core.length === 0) {
    // 整段本来就是短消息时直接给全量：head+tail 的截断方式会把同一段重复两遍，正文反而更难读
    const whole = message.trim()
    if (whole.length <= maxChars) return whole
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

/** 「包在 registry 不存在」失败的提示变体：服务端用官方源复核过（会注入 `[registry-mirror-lag]`）
 *  时，说明包在官方源上存在、是本机镜像源未同步 → 提示换源；否则按「profile 残留依赖」提示
 *  （删掉 profile 里那条依赖即可）。 */
export function registryMissingHintOf(message: string): 'failPnpmMissingDepHint' | 'failRegistryMirrorLagHint' {
  return /\[registry-mirror-lag\]/i.test(message) ? 'failRegistryMirrorLagHint' : 'failPnpmMissingDepHint'
}

/** 提取「registry 上不存在的包名」：从 404 行（`ERR_PNPM_FETCH_404 GET <registry>/<pkg>: Not Found - 404`）
 *  里取请求路径中的包名（含 scope，如 `@scope/name`）；非 404 或提取不到返回 null。 */
export function missingRegistryPackageOf(message: string): string | null {
  for (const line of message.split(/\r?\n/)) {
    if (!/ERR_PNPM_FETCH_404|404/.test(line)) continue
    const m = line.match(/GET\s+https?:\/\/[^\s/]+\/((?:@[^/\s:]+\/)?[^/\s:]+)/)
    // pnpm 输出里 scope 包是 URL 编码形态（`@scope%2Fname`）：还原成 `@scope/name` 再展示
    if (m) return m[1].replace(/%40/gi, '@').replace(/%2f/gi, '/')
  }
  return null
}

/**
 * 从网络类失败消息里提取「具体连不上的地址」，供弹窗精准提示（你的网络无法访问什么）。
 * 优先取服务端 [network] 网络探测消息括号里的探测地址（中文「（…）」/ 英文「(…)」），
 * 否则取消息里出现的第一个 URL（git fetch 的仓库地址、registry 域名等）。
 * 提取不到返回 null —— 调用方据此跳过地址行。
 */
export function unreachableTargetOf(message: string): string | null {
  // [network] 网络探测消息：`无法连接到 GitHub（https://github.com/）` / `cannot reach the npm registry (https://registry.npmjs.org/)`
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

/**
 * 「本地依赖目录不存在」失败里缺失的路径：
 * `pnpm: ENOENT: no such file or directory, lstat '<path>'`
 * 或 `Could not install from "<path>" as it does not exist`。取不到返回 null。
 */
export function missingLocalDirOf(message: string): string | null {
  const lstat = /ENOENT: no such file or directory,\s*(?:lstat|scandir|readlink)\s+'([^']+)'/i.exec(message)
  if (lstat !== null) return lstat[1]
  const quoted = /Could not install from\s+"([^"]+)"\s+as it does not exist/i.exec(message)
    ?? /Could not install from\s+'([^']+)'\s+as it does not exist/i.exec(message)
  return quoted === null ? null : quoted[1]
}

/**
 * 「profile 由桌面应用独占」错误里的 profile 名：
 * `error: profile "desktop" is managed exclusively by the Electron application`。
 * 取不到返回 null（提示文案退回通用说法）。
 */
export function exclusiveProfileOf(message: string): string | null {
  const m = /profile\s+"?([A-Za-z0-9_-]+)"?\s+is managed exclusively/i.exec(message)
  return m === null ? null : m[1]
}

/**
 * 日志里有安装器的 `[desktop-cli-fallback]` 标记：没找到桌面应用内置的 CLI 引导脚本，
 * 退回 PATH 上的 dsh 才被「profile 独占」拒绝 —— 是我们的路径推导问题，不是用户环境问题。
 */
export function desktopCliFallbackOf(message: string): boolean {
  return /\[desktop-cli-fallback\]/i.test(message)
}

/** `[dsh-too-old]` 标记里的三方信息（包名 / 插件要求的 DSH 下限 / 当前宿主版本）；取不到返回 null。 */
export function dshTooOldInfoOf(message: string): { pkg: string; floor: string; current: string } | null {
  const m = /\[dsh-too-old\]\s*(\S+)\s+requires DSH >= (\S+).*?runs (\S+)/i.exec(message)
  return m === null ? null : { pkg: m[1]!, floor: m[2]!, current: m[3]! }
}

/**
 * `cannot resolve profile bundle "<pkg>" from the dsh installation or <profileDir>` 里的
 * 缺失包名与 profile 目录；只取到包名也算成功（profile 目录可能被换行截断）。
 */
export function unresolvedBundleOf(message: string): { pkg: string; profileDir: string } | null {
  const m = /cannot resolve profile bundle\s+"([^"]+)"\s+from the dsh installation or\s+(.+?)\s*(?:;|$)/im.exec(message)
  if (m !== null) return { pkg: m[1]!, profileDir: m[2]!.trim() }
  const only = /cannot resolve profile bundle\s+"([^"]+)"/i.exec(message)
  return only === null ? null : { pkg: only[1]!, profileDir: '' }
}

/**
 * 鉴权失败（401/403）时被拒绝的源主机名：从 `ERR_PNPM_FETCH_401 GET https://host/pkg: Unauthorized - 401`
 * 里取，取不到返回 null（提示文案退回通用说法，不拼出残缺句子）。
 */
export function authRegistryHostOf(message: string): string | null {
  const m = /ERR_PNPM_FETCH_40[13]\s+GET\s+https?:\/\/([^\s/:]+)/i.exec(message)
    ?? /GET\s+https?:\/\/([^\s/:]+)\S*\s*:?\s*(?:Unauthorized|Forbidden)\s*-\s*40[13]/i.exec(message)
  return m === null ? null : m[1]
}
