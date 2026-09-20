/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 包入口解析：从 package.json 的 exports["."] / main 推出用于校验的入口文件。
 * git 通道（tar 预检）与 npm 通道（装后 statSync 校验）共用，保证两条通道
 * 对同一个包判定一致。
 */

/** exports 条件对象里按优先级尝试的键；Node 语义下 default 最宽，import/require 次之。 */
const EXPORT_CONDITION_KEYS = ['default', 'import', 'require'] as const

/**
 * 解析包的入口文件（相对包根，不带 `./` 前缀）。
 *
 * Node 的 exports 规范要求字符串 target 以 `./` 开头（如 `"./lib/index.js"`），
 * 而 tar 成员名与磁盘路径都不带该前缀，因此统一剥掉；条件对象
 * （`{ "import": ..., "require": ... }`）按 default → import → require 取第一
 * 个字符串值。无 exports 时回退 main，再回退 index.js。
 */
export function resolvePackageEntry(meta: { main?: unknown; exports?: unknown }): string {
  const dot = (meta.exports as Record<string, unknown> | undefined)?.['.']
  const fromExports = typeof dot === 'string'
    ? dot
    : dot !== null && typeof dot === 'object'
      ? firstStringOf(dot as Record<string, unknown>)
      : undefined
  const candidate = typeof fromExports === 'string' ? fromExports
    : typeof meta.main === 'string' ? meta.main
      : 'index.js'
  return candidate.replace(/^\.\//u, '')
}

function firstStringOf(conditions: Record<string, unknown>): string | undefined {
  for (const key of EXPORT_CONDITION_KEYS) {
    const value = conditions[key]
    if (typeof value === 'string' && value !== '') return value
  }
  return undefined
}
