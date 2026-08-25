/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Pure progress-estimation helpers shared by the install runner.
 *
 * The dsh CLI wraps pnpm, which refreshes its `Progress: …` line in place
 * with carriage returns, so raw output arrives as a stream of partial
 * fragments. These helpers normalize one fragment into a clean terminal
 * line and map it onto a 0-100 estimate; keeping them free of I/O makes the
 * estimation logic directly unit-testable (see tests/progress.test.ts).
 */

/** Strip the `[out]` / `[err]` source prefix and ANSI escape sequences. */
export function cleanLine(raw: string): string {
  return raw.replace(/^\[(?:err|out)\]\s*/, '').replace(/\x1b\[[0-9;]*[A-Za-z]/g, '').trim()
}

/**
 * Estimate 0-100 progress from one CLI output line. pnpm emits
 * `Progress: resolved N, reused X, downloaded Y, added Z` during the fetch
 * phase; resolution/install phase lines bump the estimate towards done.
 */
export function estimateProgress(line: string): number {
  const progress = line.match(/Progress:\s*(.+)/)
  if (progress) {
    let resolved = 0
    let handled = 0
    for (const part of progress[1].split(',')) {
      // pnpm emits `label count` tokens, e.g. `resolved 100, reused 40`
      const [label, raw] = part.trim().split(/\s+/)
      const value = Number(raw)
      if (label === 'resolved') resolved = value
      else if (label === 'reused' || label === 'downloaded' || label === 'added' || label === 'imported') {
        handled += value
      }
    }
    // pnpm 的 resolved 是"解析出的包数"，reused/downloaded/added 是"已处理的包数"，
    // 两者几乎总是相等，比值没有进度区分度（一出现就贴满 100%）。
    // fetch 阶段只占安装总时长的一小部分（git 依赖之后还要 clone + 跑 prepare 构建），
    // 因此按已处理量在低区间（8-30）缓步推进，把中段留给真正的安装/构建阶段。
    if (resolved > 0 && handled > 0) {
      return Math.min(30, 8 + Math.round((handled / resolved) * 20))
    }
    return resolved > 0 ? 8 : 0
  }
  if (/^dependencies:|^Packages:/i.test(line)) return 85
  if (/^Running\b|prepare|build scripts/i.test(line)) return 60
  if (/^Done in\b/i.test(line)) return 96
  return 0
}
