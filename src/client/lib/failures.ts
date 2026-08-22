/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Persistent install/remove notifications.
 *
 * Every settled task — success or failure — is appended to localStorage the
 * moment the backend reports it, so a result is never lost even when the
 * dialog was dismissed or nobody was watching the progress strip. Newest
 * first, capped at MAX entries. Failures keep their full output for the
 * issue-filing flow; successes are lightweight (no log).
 */
export interface NotificationRecord {
  id: number
  kind: 'install' | 'uninstall'
  /** true = 成功（轻量记录）；false = 失败（message 携带完整错误日志） */
  ok: boolean
  /** owner/repo（可能为空：请求层失败但拿不到仓库时） */
  repo: string
  /** 失败时的完整错误日志；成功记录为空串 */
  message: string
  /** 实际执行的安装/卸载命令（issue 预填时如实展示）；历史记录可能缺失 */
  command?: string
  /** 尝试过的安装方式（npm registry 反查 + 实际执行命令，按先后顺序）：失败提 Issue 时贴给作者，便于反推正确的 npm 包名 */
  attempts?: string[]
  /** 结束时间（epoch ms） */
  at: number
}

const KEY = 'gro.ngilp-hsd.failure-records'
const MAX = 50

export type FailureKind = 'pnpmIgnoredBuild' | 'pluginPrepare' | 'repo'

/**
 * 失败归类，三态。无论底层机制如何（pnpm 白名单拦截 / 构建脚本被忽略 / prepare 失败），
 * 对用户而言结果都一样 —— 当前安装通道（npm 或 git）装不上，就是插件分发/依赖的问题，
 * 一律引导提 Issue：
 * - pnpmIgnoredBuild：插件依赖里的原生模块构建脚本被 pnpm 默认拦截（如 node-pty，
 *   `ERR_PNPM_IGNORED_BUILDS`）。只影响带原生模块的插件，其他插件不受影响 —— 差异在
 *   插件的依赖选择，属插件依赖/打包问题 → 引导去仓库提 Issue（建议改用预编译版本）
 * - pluginPrepare：插件的 prepare/构建脚本实际执行失败（git tarball 常因缺失子模块或
 *   构建产物导致）—— 属插件打包/分发问题，应引导去仓库提 Issue
 * - repo：其余失败（含 git prepare 被 pnpm 白名单拦截等），默认按插件仓库问题引导提 Issue
 */
export function classifyFailure(message: string): FailureKind {
  // 装后校验拦截（服务端 verifyInstalledEntry 标记）：入口文件缺失 = git 分发缺构建产物，
  // 与 pluginPrepare 同类（插件打包/分发问题），引导去仓库提 Issue
  if (/\[packaging\]|entry file missing/i.test(message)) return 'pluginPrepare'
  // 原生模块构建被忽略（IGNORED_BUILDS）要在 prepare 判定之前：dsh 尾部固定提示语带
  // allowBuilds/pnpm-workspace.yaml，不能据此把插件自身问题误判成通用失败
  if (/ERR_PNPM_IGNORED_BUILDS|Ignored build scripts:/i.test(message)) return 'pnpmIgnoredBuild'
  // 再判 prepare 实际执行失败：只有构建脚本真的跑挂了才是插件问题
  if (/ERR_PNPM_PREPARE_PACKAGE|ELIFECYCLE|Command failed|prepare-guard/i.test(message)) return 'pluginPrepare'
  // 其余失败（含 git prepare 被 pnpm 白名单拦截）：当前通道装不上 = 插件分发/依赖的问题，一律提 Issue
  return 'repo'
}

/** 核心行特征：错误代码 / 生命周期脚本失败 / prepare 失败 / 描述性报错（子模块缺失、找不到等）/ 退出与宿主提示信息。 */
const CORE_LINE_RE = /ERR_[A-Z_]+|ELIFECYCLE|Command failed|prepare-guard|Failed to prepare|exit code|\bprepare\b|pnpm failed in profile|git-hosted plugins build|submodule|not found|cannot find|no such|unable to|fatal|missing|error/i
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
    if (!line || !CORE_LINE_RE.test(line)) continue
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
