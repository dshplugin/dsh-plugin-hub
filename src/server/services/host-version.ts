/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 宿主与命令行工具的版本探测：dsh 版本同时用于诊断快照和「插件要求更高 DSH」判定，
 * pnpm/npm/git 只用于诊断快照。同步探测 + 1500ms 超时保护，拿不到一律 null，绝不挂起。
 */
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

/** 从命令输出里抽出版本号本体：pnpm/npm 直接打印 `11.7.0`，而 `git --version` 打印
 *  `git version 2.55.0.windows.5` —— 原样取首行会让 issue 正文拼成 `vgit version …`。
 *  只取版本号，顺带兼容 `v1.2.3` 这类自带前缀的输出。 */
export function versionOf(output: string): string | null {
  const first = output.trim().split(/\r?\n/)[0]?.trim() ?? ''
  if (!first) return null
  const match = /\d+\.\d+[0-9A-Za-z.\-+]*/.exec(first)
  return match === null ? null : match[0]
}

/** 探测命令行工具版本：未安装 / 不在 PATH / 超时一律 null。
 *  Windows 上 pnpm/npm 是 .cmd shim，不走 shell 起不来；参数是固定的 `--version`，没有注入面。 */
export function toolVersion(cmd: string, args: string[]): string | null {
  try {
    const r = spawnSync(cmd, args, {
      timeout: 1500,
      encoding: 'utf8',
      shell: process.platform === 'win32',
    })
    if (r.error || r.status !== 0) return null
    return versionOf(r.stdout ?? '')
  } catch {
    return null
  }
}

let cachedDshVersion: string | null = null

/** 宿主 dsh 版本：优先 `dsh --version`；拿不到再从入口 `process.argv[1]` 向上找 package.json
 *  （dsh 不在 PATH 时使用）。探测成功即缓存，失败不缓存以便下次重试。 */
export function hostDshVersion(): string | null {
  if (cachedDshVersion !== null) return cachedDshVersion
  const viaCli = toolVersion('dsh', ['--version'])
  if (viaCli !== null) {
    cachedDshVersion = viaCli
    return viaCli
  }
  const entry = process.argv[1]
  if (entry === undefined) return null
  let dir = dirname(resolve(entry))
  for (let depth = 0; depth < 4; depth++) {
    try {
      const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as { name?: string; version?: string }
      const name = manifest.name ?? ''
      if (typeof manifest.version === 'string' && (name === 'dsh' || name.includes('dsh') || name.includes('harness'))) {
        cachedDshVersion = manifest.version
        return cachedDshVersion
      }
    } catch {
      /* 不是包根，继续向上查找 */
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}
