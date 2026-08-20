/**
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
    let total = 0
    let done = 0
    for (const part of progress[1].split(',')) {
      // pnpm emits `label count` tokens, e.g. `resolved 100, reused 40`
      const [label, raw] = part.trim().split(/\s+/)
      const value = Number(raw)
      if (label === 'resolved') total = value
      else if (label === 'reused' || label === 'downloaded' || label === 'added' || label === 'imported') {
        done += value
      }
    }
    if (total > 0) return Math.min(90, Math.round((done / total) * 100))
  }
  if (/^dependencies:|^Packages:/i.test(line)) return 92
  if (/^Done in\b/i.test(line)) return 96
  return 0
}
