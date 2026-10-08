/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 打包桌面端（Electron）CLI 引导脚本的路径推导测试（issue #71 缺陷 2）：
 * 宿主入口落在 app.asar 内时，必须找到官方引导脚本 desktop-cli.js，
 * 才能按内置终端/官方插件页同一条路径调起打包 CLI，而不是回退 PATH 上的 dsh。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { desktopCliBootstrap } from '../src/server/services/install/task-queue.ts'

/** 造一个临时 asar 目录树，返回其 app.asar 根路径；调用方负责清理。 */
function makeAsar(files: string[]): string {
  const root = mkdtempSync(join(tmpdir(), 'dsh-asar-'))
  const asar = join(root, 'app.asar')
  for (const rel of files) {
    const full = join(asar, rel)
    mkdirSync(join(full, '..'), { recursive: true })
    writeFileSync(full, '')
  }
  return asar
}

test('desktopCliBootstrap: 从宿主入口反推同级引导脚本（resources/app.asar/lib/desktop-cli.js）', () => {
  const asar = makeAsar(['lib/desktop-cli.js', 'node_modules/@deepseek-ai/dsh-desktop-host/lib/index.js'])
  try {
    const entry = join(asar, 'node_modules', '@deepseek-ai', 'dsh-desktop-host', 'lib', 'index.js')
    assert.equal(desktopCliBootstrap(entry), join(asar, 'lib', 'desktop-cli.js'))
  } finally {
    rmSync(join(asar, '..'), { recursive: true, force: true })
  }
})

test('desktopCliBootstrap: 认 dsh/ 子目录布局（app.asar/dsh/lib/desktop-cli.js）', () => {
  const asar = makeAsar(['dsh/lib/desktop-cli.js', 'dsh/node_modules/@deepseek-ai/dsh/lib/bin.js'])
  try {
    const entry = join(asar, 'dsh', 'lib', 'index.js')
    assert.equal(desktopCliBootstrap(entry), join(asar, 'dsh', 'lib', 'desktop-cli.js'))
  } finally {
    rmSync(join(asar, '..'), { recursive: true, force: true })
  }
})

test('desktopCliBootstrap: 认 DeepSeek Harness 0.2.x 布局（宿主包同目录的 cli.js）', () => {
  // 宿主入口 = @deepseek-ai/dsh-desktop-host/lib/index.js，保留档 CLI 就是它同目录的 cli.js
  const asar = makeAsar([
    'dsh/node_modules/@deepseek-ai/dsh-desktop-host/lib/index.js',
    'dsh/node_modules/@deepseek-ai/dsh-desktop-host/lib/cli.js',
  ])
  try {
    const entry = join(asar, 'dsh', 'node_modules', '@deepseek-ai', 'dsh-desktop-host', 'lib', 'index.js')
    assert.equal(
      desktopCliBootstrap(entry),
      join(asar, 'dsh', 'node_modules', '@deepseek-ai', 'dsh-desktop-host', 'lib', 'cli.js'),
    )
  } finally {
    rmSync(join(asar, '..'), { recursive: true, force: true })
  }
})

test('desktopCliBootstrap: 布局不认识时返回 null，调用方回退原逻辑', () => {
  // asar 内没有引导脚本（官方改版）：不猜路径，交给 PATH 上的 dsh 兜底
  const asar = makeAsar(['node_modules/@deepseek-ai/dsh-desktop-host/lib/index.js'])
  try {
    assert.equal(desktopCliBootstrap(join(asar, 'node_modules', '@deepseek-ai', 'dsh-desktop-host', 'lib', 'index.js')), null)
  } finally {
    rmSync(join(asar, '..'), { recursive: true, force: true })
  }
  // 非打包场景（源码/dev 运行）：干脆不进入桌面分支
  assert.equal(desktopCliBootstrap('/usr/local/lib/node_modules/@deepseek-ai/dsh/lib/bin.js'), null)
  assert.equal(desktopCliBootstrap(join(tmpdir(), 'app.asar.bak', 'lib', 'index.js')), null)
})
