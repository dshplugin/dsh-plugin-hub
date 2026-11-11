/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 上报文案（src/client/logic/urls.ts）：标题与正文按失败动作取词，卸载不得写成安装。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pluginIssueUrl, hubIssueUrl } from '../src/client/logic/urls.ts'

/** 宿主自身入口 spawn 不到时报错（服务端会补 [host-spawn] 标记） */
const spawnEnoent = [
  '[error] spawn D:\\DSH\\DSH Desktop\\DSH Desktop.exe ENOENT',
  '[host-spawn] the DSH host could not be launched (D:\\DSH\\DSH Desktop\\DSH Desktop.exe: ENOENT)',
].join('\n')
const executed = 'dsh plugin --profile web remove dsh-plugin-wallpaper-engine'

/** 预填 URL 的标题与正文（已解码），便于断言真实文案 */
function decodeTargets(url: string): { title: string; body: string } {
  const parsed = new URL(url)
  return {
    title: parsed.searchParams.get('title') ?? '',
    body: parsed.searchParams.get('body') ?? '',
  }
}

test('pluginIssueUrl: a failed removal reports a removal, not an install', () => {
  const url = pluginIssueUrl('elysia395/dsh-wallpaper-engine', spawnEnoent, null, executed, [executed], 'uninstall')
  const { title, body } = decodeTargets(url)
  assert.ok(title.includes('the DSH host could not be launched'), title)
  assert.ok(body.includes('卸载 Plugin 失败错误信息'), body)
  assert.ok(body.includes(`实际执行的卸载命令：\`${executed}\``), body)
  assert.ok(body.includes('执行结果：卸载失败，未能卸载该插件。'), body)
  assert.ok(body.includes('## Attempted channels（已尝试的方式）'), body)
  // 卸载上报里不应再出现「安装失败 / 未能安装该插件」这类错位措辞
  assert.ok(!body.includes('安装失败'), body)
  assert.ok(!body.includes('未能安装该插件'), body)
})

test('pluginIssueUrl: install and update take their own wording', () => {
  const install = decodeTargets(pluginIssueUrl('a/b', 'boom', null, 'dsh plugin --profile web add a', undefined, 'install'))
  assert.ok(install.body.includes('安装 Plugin 失败错误信息'), install.body)
  assert.ok(install.body.includes('执行结果：安装失败，未能安装该插件。'), install.body)
  const update = decodeTargets(pluginIssueUrl('a/b', 'boom', null, 'dsh plugin --profile web add a@latest', undefined, 'update'))
  assert.ok(update.body.includes('更新 Plugin 失败错误信息'), update.body)
  assert.ok(update.body.includes('执行结果：更新失败，未能更新该插件。'), update.body)
})

test('pluginIssueUrl: the default action keeps the historical install wording', () => {
  const { body } = decodeTargets(pluginIssueUrl('a/b', 'boom', null, undefined, undefined))
  assert.ok(body.includes('安装 Plugin 失败错误信息'), body)
})

test('pluginIssueUrl: an allowlist-blocked build is reported to the author as a plugin-side issue', () => {
  // 构建脚本被拦仍归插件侧（安装器已自动放行并重试过）；但正文只说清是被拦的构建脚本，
  // 不假定它是原生模块，也不假定它一定是插件的直接依赖
  const allowBlocked = '[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: node-pty@1.1.0'
  const { title, body } = decodeTargets(pluginIssueUrl('owner/repo', allowBlocked, null, 'dsh plugin add owner/repo'))
  assert.ok(title.includes('build scripts blocked by pnpm allowlist'), title)
  assert.ok(body.includes('declares a build script that pnpm blocks by default'), body)
  assert.ok(!body.includes('native module whose build script'), body)
})

test('hubIssueUrl: title and body follow the action (unclassified removal)', () => {
  const url = hubIssueUrl('elysia395/dsh-wallpaper-engine', spawnEnoent, null, executed, [executed], 'triage', 'uninstall')
  const { title, body } = decodeTargets(url)
  // 标题点明「调不起宿主」，并明确是卸载
  assert.ok(title.includes('the DSH host could not be launched'), title)
  assert.ok(body.includes('Auto-classified cause: the DSH host could not be launched'), body)
  assert.ok(body.includes('卸载 Plugin 失败错误信息'), body)
  assert.ok(body.includes('执行结果：卸载失败，未能卸载该插件。'), body)
  assert.ok(!body.includes('安装失败'), body)
})

test('hubIssueUrl: an unclassified install keeps "install failed (cause unclassified)"', () => {
  const { title, body } = decodeTargets(hubIssueUrl('a/b', 'boom', null, undefined, undefined, 'triage', 'install'))
  assert.ok(title.includes('install failed (cause unclassified)'), title)
  assert.ok(body.includes('Auto-classified cause: install failed (cause unclassified)'), body)
})

test('pluginIssueUrl: the environment section carries the npm registry in use', () => {
  // 网络/源不通类失败靠这一行分诊（#6118：报告里没有源地址，作者只能猜）
  const env = {
    dshVersion: '0.2.1-rc.5', nodeVersion: 'v24.22.1', pnpmVersion: null, npmVersion: 'v10.8.2', gitVersion: null,
    npmRegistry: 'https://registry.npmmirror.com', platform: 'win32', arch: 'x64', release: '10.0.26100',
    profile: 'desktop-017', dshHome: 'C:\\Users\\u\\.dsh',
  }
  const { body } = decodeTargets(pluginIssueUrl('a/b', 'boom', env, 'dsh plugin --profile desktop-017 add a'))
  assert.ok(body.includes('- npm registry: `https://registry.npmmirror.com`'), body)
  // 取不到时如实写 unknown，不编造
  const { body: noRegistry } = decodeTargets(pluginIssueUrl('a/b', 'boom', { ...env, npmRegistry: null }))
  assert.ok(noRegistry.includes('- npm registry: unknown'), noRegistry)
})
