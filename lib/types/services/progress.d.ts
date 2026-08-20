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
export declare function cleanLine(raw: string): string;
/**
 * Estimate 0-100 progress from one CLI output line. pnpm emits
 * `Progress: resolved N, reused X, downloaded Y, added Z` during the fetch
 * phase; resolution/install phase lines bump the estimate towards done.
 */
export declare function estimateProgress(line: string): number;
