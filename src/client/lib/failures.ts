/**
 * Persistent install/remove failure records.
 *
 * Failures are appended to localStorage the moment the backend reports them,
 * so a failed task is never lost even when the error dialog was dismissed or
 * nobody was watching the progress strip. Newest first, capped at MAX entries.
 */
export interface FailureRecord {
  id: number
  kind: 'install' | 'uninstall'
  /** owner/repo（可能为空：请求层失败但拿不到仓库时） */
  repo: string
  message: string
  /** 失败时间（epoch ms） */
  at: number
}

const KEY = 'gro.ngilp-hsd.failure-records'
const MAX = 50

export type FailureKind = 'pnpmAllowBuild' | 'pnpmIgnoredBuild' | 'pluginPrepare' | 'repo'

/**
 * 失败归类，四态：
 * - pnpmAllowBuild：git 插件自身 prepare 脚本被 pnpm 白名单拦截（机制：git 依赖默认禁跑
 *   prepare，宿主会解析 key 自动放行并重试）—— 所有 git 插件首次安装都会遇到，属宿主
 *   配置问题 → 给修复指引，不提 Issue
 * - pnpmIgnoredBuild：插件依赖里的原生模块构建脚本被 pnpm 默认拦截（如 node-pty，
 *   `ERR_PNPM_IGNORED_BUILDS`）。只影响带原生模块的插件，其他插件不受影响 —— 差异在
 *   插件的依赖选择，属插件依赖/打包问题 → 引导去仓库提 Issue（建议改用预编译版本）
 * - pluginPrepare：白名单放行后，插件的 prepare/构建脚本实际执行失败（git tarball 常因
 *   缺失子模块或构建产物导致）—— 属插件打包/分发问题，应引导去仓库提 Issue
 * - repo：其余失败，默认按插件仓库问题引导提 Issue
 */
export function classifyFailure(message: string): FailureKind {
  // 原生模块构建被忽略（IGNORED_BUILDS）要在 allowBuilds 提示语之前判定：dsh 尾部固定提示
  // 语永远带 allowBuilds/pnpm-workspace.yaml，不能据此把插件自身问题误判成宿主配置问题
  if (/ERR_PNPM_IGNORED_BUILDS|Ignored build scripts:/i.test(message)) return 'pnpmIgnoredBuild'
  // 再判 prepare 实际执行失败：只有构建脚本真的跑挂了才是插件问题
  if (/ERR_PNPM_PREPARE_PACKAGE|ELIFECYCLE|Command failed|prepare-guard/i.test(message)) return 'pluginPrepare'
  if (/ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED|allowBuilds|pnpm-workspace\.yaml/i.test(message)) return 'pnpmAllowBuild'
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

/** 读取本地失败记录（损坏/不可用时返回空列表，不抛错）。列表最新在前；同一仓库只保留最新一条，空 repo 无法定位插件，全部保留。 */
export function loadFailures(): FailureRecord[] {
  try {
    const raw = storage()?.getItem(KEY)
    if (!raw) return []
    const list = JSON.parse(raw) as unknown
    if (!Array.isArray(list)) return []
    const valid = list.filter((r): r is FailureRecord =>
      !!r && typeof r === 'object' && typeof r.message === 'string')
    // 兜底去重：旧数据可能已存有同仓库多条，只留最新（首次出现的）
    const seen = new Set<string>()
    const deduped: FailureRecord[] = []
    for (const r of valid) {
      if (r.repo && seen.has(r.repo)) continue
      if (r.repo) seen.add(r.repo)
      deduped.push(r)
    }
    return deduped
  } catch {
    return []
  }
}

function save(list: FailureRecord[]): void {
  try {
    storage()?.setItem(KEY, JSON.stringify(list))
  } catch {
    /* storage full / unavailable：仅保留内存态，界面仍可查看 */
  }
}

/** 追加一条失败记录并持久化，返回更新后的完整列表（最新在前，超上限裁剪）。同一仓库只保留最新一次失败。 */
export function addFailure(record: Omit<FailureRecord, 'id' | 'at'>): FailureRecord[] {
  const prev = loadFailures()
  let id = Date.now()
  while (prev.some((r) => r.id === id)) id += 1
  // 同一个仓库（同一插件）只保留最后一次失败：先剔除旧记录，再把新记录放到最前
  const rest = record.repo ? prev.filter((r) => r.repo !== record.repo) : prev
  const next = [{ ...record, id, at: id }, ...rest].slice(0, MAX)
  save(next)
  return next
}

/** 清空全部失败记录，返回空列表。 */
export function clearFailures(): FailureRecord[] {
  save([])
  return []
}
