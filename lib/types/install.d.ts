export interface InstallResult {
    exitCode: number | null;
    timedOut: boolean;
    error: string | null;
    stdout: string;
    stderr: string;
}
/** Build a safe `github:<owner>/<repo>` target, or null when the repo is unsafe. */
export declare function githubTarget(repo: string): string | null;
/** Resolve the active profile from the booted CLI args, falling back to `web`. */
export declare function readProfileArg(fallback?: string): string;
/**
 * Run `dsh plugin --profile <profile> add <target>` and resolve with the
 * captured output. Never rejects; failures surface through the result.
 */
export declare function runPluginInstall(options: {
    profile: string;
    target: string;
    timeoutMs?: number;
    env?: NodeJS.ProcessEnv;
}): Promise<InstallResult>;
