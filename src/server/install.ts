/**
 * Install runner: performs real plugin mutations by spawning the official
 * dsh CLI in a child process. When this plugin runs inside a booted dsh
 * entry (the common case), it reuses that entry via process.argv[1] so the
 * command works even when `dsh` is not on PATH; otherwise it falls back to
 * a plain `dsh` lookup. The child is always spawned asynchronously — never
 * spawnSync — so the harness event loop is never blocked.
 */
import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'

/** Grammar of an accepted `github:<owner>/<repo>` install target. */
const REPO_RE = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/
const CAPTURE_LIMIT_BYTES = 64 * 1024

export interface InstallResult {
  exitCode: number | null
  timedOut: boolean
  error: string | null
  stdout: string
  stderr: string
}

interface Invocation {
  file: string
  prefixArgs: string[]
  cwd: string
  useShell: boolean
}

/** Build a safe `github:<owner>/<repo>` target, or null when the repo is unsafe. */
export function githubTarget(repo: string): string | null {
  if (typeof repo !== 'string' || !REPO_RE.test(repo)) return null
  return `github:${repo}`
}

/** Resolve the active profile from the booted CLI args, falling back to `web`. */
export function readProfileArg(fallback = 'web'): string {
  const index = process.argv.indexOf('--profile')
  const candidate = index >= 0 ? process.argv[index + 1] : undefined
  return candidate !== undefined && !candidate.startsWith('-') ? candidate : fallback
}

function cliInvocation(): Invocation {
  const entry = process.argv[1]
  if (entry !== undefined && /[\\/](?:bin\.(?:js|ts)|dsh)$/.test(entry)) {
    const absoluteEntry = resolve(entry)
    return {
      file: process.execPath,
      prefixArgs: [...process.execArgv, absoluteEntry],
      cwd: dirname(absoluteEntry),
      useShell: false,
    }
  }
  return { file: 'dsh', prefixArgs: [], cwd: process.cwd(), useShell: process.platform === 'win32' }
}

function stopChild(child: ReturnType<typeof spawn>): void {
  if (process.platform === 'win32' && child.pid !== undefined) {
    const killer = spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' })
    killer.once('error', () => child.kill('SIGKILL'))
    return
  }
  child.kill('SIGKILL')
}

/**
 * Run `dsh plugin --profile <profile> add <target>` and resolve with the
 * captured output. Never rejects; failures surface through the result.
 */
export function runPluginInstall(options: {
  profile: string
  target: string
  timeoutMs?: number
  env?: NodeJS.ProcessEnv
}): Promise<InstallResult> {
  const { profile, target, timeoutMs = 5 * 60 * 1000, env } = options
  const invocation = cliInvocation()
  const args = [...invocation.prefixArgs, 'plugin', '--profile', profile, 'add', target]
  return new Promise((resolvePromise) => {
    let stdout = ''
    let stderr = ''
    let timedOut = false
    let child: ReturnType<typeof spawn>
    try {
      child = spawn(invocation.file, args, {
        cwd: invocation.cwd,
        env,
        shell: invocation.useShell,
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    } catch (error) {
      resolvePromise({
        exitCode: null,
        timedOut: false,
        error: error instanceof Error ? error.message : String(error),
        stdout,
        stderr,
      })
      return
    }
    const timer = setTimeout(() => {
      timedOut = true
      stopChild(child)
    }, timeoutMs)
    const collect = (kind: 'stdout' | 'stderr', chunk: Buffer): void => {
      const text = chunk.toString()
      if (kind === 'stdout') stdout = (stdout + text).slice(-CAPTURE_LIMIT_BYTES)
      else stderr = (stderr + text).slice(-CAPTURE_LIMIT_BYTES)
    }
    child.stdout?.on('data', (chunk: Buffer) => collect('stdout', chunk))
    child.stderr?.on('data', (chunk: Buffer) => collect('stderr', chunk))
    child.once('error', (error) => {
      clearTimeout(timer)
      resolvePromise({ exitCode: null, timedOut: false, error: error.message, stdout, stderr })
    })
    child.once('close', (code) => {
      clearTimeout(timer)
      resolvePromise({ exitCode: code, timedOut, error: null, stdout, stderr })
    })
  })
}
