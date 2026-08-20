/**
 * Install runner: performs real plugin mutations by spawning the official
 * dsh CLI in a child process. When this plugin runs inside a booted dsh
 * entry (the common case), it reuses that entry via process.argv[1] so the
 * command works even when `dsh` is not on PATH; otherwise it falls back to
 * a plain `dsh` lookup. The child is always spawned asynchronously — never
 * spawnSync — so the harness event loop is never blocked.
 *
 * Mutations run as tracked background tasks: the caller gets a task id
 * immediately, output lines accumulate on the task, and consumers poll
 * `getTask(id)` for progress until the task reaches a terminal state.
 */
import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'

/** Grammar of an accepted `github:<owner>/<repo>` install target. */
const REPO_RE = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/
/** Grammar of an npm package name (used for uninstall targets). */
const PACKAGE_RE = /^(?:@[a-z0-9._-]+\/)?[A-Za-z0-9._-]+$/
const CAPTURE_LIMIT_BYTES = 64 * 1024
/** Max output lines kept per task (newest wins). */
const MAX_TASK_LINES = 200
/** Max tracked tasks; oldest finished tasks are dropped first. */
const MAX_TASKS = 50

export interface InstallResult {
  exitCode: number | null
  timedOut: boolean
  error: string | null
  stdout: string
  stderr: string
}

export interface InstallTask {
  id: number
  status: 'running' | 'done' | 'failed'
  timedOut: boolean
  exitCode: number | null
  /** Newest output lines first (consumer shows the tail). */
  lines: string[]
}

interface Invocation {
  file: string
  prefixArgs: string[]
  cwd: string
  useShell: boolean
}

/** In-memory task registry, keyed by task id. */
const tasks = new Map<number, InstallTask>()
let nextTaskId = 1

/** Snapshot of a task (keeps the live object untouched by consumers). */
export function getTask(id: number): InstallTask | undefined {
  const task = tasks.get(id)
  if (!task) return undefined
  return { ...task, lines: task.lines.slice(0, MAX_TASK_LINES) }
}

/** True while any mutation is still running (mutex for the install routes). */
export function hasRunningTask(): boolean {
  for (const task of tasks.values()) {
    if (task.status === 'running') return true
  }
  return false
}

function pushLine(task: InstallTask, line: string): void {
  task.lines.unshift(line)
  if (task.lines.length > MAX_TASK_LINES) task.lines.length = MAX_TASK_LINES
}

/** Build a safe `github:<owner>/<repo>` target, or null when the repo is unsafe. */
export function githubTarget(repo: string): string | null {
  if (typeof repo !== 'string' || !REPO_RE.test(repo)) return null
  return `github:${repo}`
}

/** Validate an npm package name (uninstall target grammar). */
export function validPackageName(name: string): boolean {
  return typeof name === 'string' && PACKAGE_RE.test(name)
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
 * Kick off a background mutation and return its task handle. The CLI runs
 * asynchronously; progress is visible through `getTask(id)` until done.
 */
export function startPluginMutation(options: {
  action: 'add' | 'remove'
  profile: string
  target: string
  timeoutMs?: number
  env?: NodeJS.ProcessEnv
}): InstallTask {
  const task: InstallTask = { id: nextTaskId, status: 'running', timedOut: false, exitCode: null, lines: [] }
  nextTaskId = nextTaskId >= Number.MAX_SAFE_INTEGER ? 1 : nextTaskId + 1
  tasks.set(task.id, task)
  if (tasks.size > MAX_TASKS) {
    for (const id of tasks.keys()) {
      if (tasks.get(id)?.status !== 'running') {
        tasks.delete(id)
        break
      }
    }
  }
  void runPluginMutation({ ...options, task })
  return task
}

/**
 * Run `dsh plugin --profile <profile> <action> <target>`, stream its output
 * onto the tracked task and resolve with the captured result. Never rejects;
 * failures surface through the result / task state.
 */
export function runPluginMutation(options: {
  action: 'add' | 'remove'
  profile: string
  target: string
  timeoutMs?: number
  env?: NodeJS.ProcessEnv
  task?: InstallTask
}): Promise<InstallResult> {
  const { action, profile, target, timeoutMs = 5 * 60 * 1000, env, task } = options
  const invocation = cliInvocation()
  const args = [...invocation.prefixArgs, 'plugin', '--profile', profile, action, target]
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
      if (task) {
        task.status = 'failed'
        task.exitCode = null
        pushLine(task, `[error] ${error instanceof Error ? error.message : String(error)}`)
      }
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
      if (task) {
        for (const line of text.split(/\r?\n/)) {
          if (line.trim() !== '') pushLine(task, `${kind === 'stderr' ? '[err] ' : ''}${line.trimEnd()}`)
        }
      }
    }
    child.stdout?.on('data', (chunk: Buffer) => collect('stdout', chunk))
    child.stderr?.on('data', (chunk: Buffer) => collect('stderr', chunk))
    child.once('error', (error) => {
      clearTimeout(timer)
      if (task) {
        task.status = 'failed'
        task.exitCode = null
        pushLine(task, `[error] ${error.message}`)
      }
      resolvePromise({ exitCode: null, timedOut: false, error: error.message, stdout, stderr })
    })
    child.once('close', (code) => {
      clearTimeout(timer)
      if (task) {
        task.exitCode = code
        task.timedOut = timedOut
        task.status = timedOut || code !== 0 ? 'failed' : 'done'
        pushLine(task, timedOut ? '[timed out]' : `[exit ${code ?? '?'}]`)
      }
      resolvePromise({ exitCode: code, timedOut, error: null, stdout, stderr })
    })
  })
}
