/**
 * 宿主运行时路径（services/runtime-exec.ts）单测。
 *
 * 复现 Android（bionic）场景：process.execPath 指向 /system/bin/linker64 时，
 * 必须回退到 process.argv0，否则 spawn 出去的命令会把第一个参数当成可执行文件，
 * 报 `error: expected absolute path: "--expose-internals"`。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { runtimeExecPath } from '../src/server/services/runtime-exec.ts'

test('runtimeExecPath: 普通平台原样返回 execPath', () => {
  assert.equal(runtimeExecPath('/usr/local/bin/node', '/usr/local/bin/node'), '/usr/local/bin/node')
  assert.equal(
    runtimeExecPath('/Applications/DSH.app/Contents/MacOS/DSH', '/Applications/DSH.app/Contents/MacOS/DSH'),
    '/Applications/DSH.app/Contents/MacOS/DSH',
  )
  assert.equal(runtimeExecPath('C:\\Program Files\\DSH\\DSH.exe', 'C:\\Program Files\\DSH\\DSH.exe'), 'C:\\Program Files\\DSH\\DSH.exe')
})

test('runtimeExecPath: Android linker64 / linker32 → 回退 argv0', () => {
  assert.equal(runtimeExecPath('/system/bin/linker64', '/data/data/com.termux/files/usr/bin/node'), '/data/data/com.termux/files/usr/bin/node')
  assert.equal(runtimeExecPath('/system/bin/linker', '/usr/bin/node'), '/usr/bin/node')
  assert.equal(runtimeExecPath('/system/bin/LINKER64', '/usr/bin/node'), '/usr/bin/node')
})

test('runtimeExecPath: linker 但不是可执行文件本身（只是路径片段）→ 不替换', () => {
  assert.equal(runtimeExecPath('/opt/linker64/node', '/usr/bin/node'), '/opt/linker64/node')
  assert.equal(runtimeExecPath('/usr/lib/linker-helper/bin/node', '/usr/bin/node'), '/usr/lib/linker-helper/bin/node')
})

test('runtimeExecPath: 没有可用的 argv0 时保留 execPath（不抛错）', () => {
  assert.equal(runtimeExecPath('/system/bin/linker64', ''), '/system/bin/linker64')
  assert.equal(runtimeExecPath('/system/bin/linker64', '/system/bin/linker64'), '/system/bin/linker64')
})
