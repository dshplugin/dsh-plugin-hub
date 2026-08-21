/**
 * One-shot host environment snapshot for bug reports. Fetched lazily and
 * cached at module level: issue URLs embed this info, and the environment
 * does not change during a session. A failed fetch degrades to null so the
 * issue links still work — they just ship without the environment block.
 */
import type { EnvInfo } from '../types.ts'

let envPromise: Promise<EnvInfo | null> | null = null

export function getEnv(): Promise<EnvInfo | null> {
  envPromise ??= fetch('/dsh-plugin-hub/env', { cache: 'no-store' })
    .then((res) => (res.ok ? (res.json() as Promise<EnvInfo>) : null))
    .catch(() => null)
  return envPromise
}
