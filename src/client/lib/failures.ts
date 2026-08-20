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

const KEY = 'dsh-plugin-hub.failure-records'
const MAX = 50

/** 读取本地失败记录（损坏/不可用时返回空列表，不抛错）。列表最新在前；同一仓库只保留最新一条，空 repo 无法定位插件，全部保留。 */
export function loadFailures(): FailureRecord[] {
  try {
    const raw = window.localStorage.getItem(KEY)
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
    window.localStorage.setItem(KEY, JSON.stringify(list))
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
