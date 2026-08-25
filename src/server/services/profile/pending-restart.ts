/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 待重启列表的内存态管理（宿主进程一重启自然清空）。
 */
import type { PendingRestart } from '../install/install-types.ts'

const pendingRestarts: PendingRestart[] = []

/**
 * 登记一条待重启记录（同一目标去重）。
 * - 卸载：目标刚装完未重启（已有待重启记录）→ 宿主从未加载过它，卸完磁盘已干净、
 *   loader 无残留，无需再提醒重启，直接移除该条；否则（已被宿主加载过）登记「卸载后待重启清理」。
 * - 安装：已有记录则刷新为安装语义（如卸载后未重启又重装），否则新登记。
 */
export function addPendingRestart(target: string, kind: 'install' | 'uninstall'): void {
  const existing = pendingRestarts.find((p) => p.target === target)
  if (kind === 'uninstall') {
    if (existing) pendingRestarts.splice(pendingRestarts.indexOf(existing), 1)
    else pendingRestarts.push({ target, kind, at: Date.now() })
    return
  }
  if (existing) {
    existing.kind = 'install'
    existing.at = Date.now()
  } else {
    pendingRestarts.push({ target, kind, at: Date.now() })
  }
}

/** 当前待重启列表快照（副本，消费方不会污染内部数组）。 */
export function listPendingRestarts(): PendingRestart[] {
  return pendingRestarts.map((p) => ({ ...p }))
}

/** 清除某目标的待重启记录（卸载已即时生效、无需重启时调用）。 */
export function clearPendingRestart(target: string): void {
  const index = pendingRestarts.findIndex((p) => p.target === target)
  if (index >= 0) pendingRestarts.splice(index, 1)
}
