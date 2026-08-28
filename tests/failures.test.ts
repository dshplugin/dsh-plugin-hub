/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Unit tests for the failure classifier and the core-error collector
 * (src/client/logic/failures.ts).
 *
 * Run with the Node built-in test runner: `npm test` (Node >= 22.6 with
 * type stripping). No extra test dependencies required.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { classifyFailure, coreErrorCode, npmTooLowVersion, summarizeError, unreachableTargetOf } from '../src/client/logic/failures.ts'

const dshTailHint = 'dsh: git-hosted plugins build on install via their prepare script, which pnpm blocks until allowed — add the exact key pnpm printed above under allowBuilds in /Users/x/.dsh/profiles/web/pnpm-workspace.yaml, then re-run'

test('classifyFailure: git prepare blocked by the allowlist is a plugin distribution issue (pnpmIgnoredBuild)', () => {
  assert.equal(classifyFailure('[ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED] ... not in the "allowBuilds" allowlist'), 'pnpmIgnoredBuild')
})

test('classifyFailure: [npm-too-low] marker from the server is a local npm issue, not a plugin issue', () => {
  const msg = [
    '[ERR_PNPM_PREPARE_PACKAGE] Failed to prepare git-hosted package fetched from "https://codeload.github.com/x/y/tar.gz/abc"',
    'npm error Cannot read properties of null (reading \'edgesOut\')',
    '[npm-too-low] npm@11.3.0 — npm arborist crashed while resolving peer deps (\'edgesOut\'); local npm is below 11.6.0; upgrade npm (npm install -g npm@latest) and retry',
    '[exit 1]',
  ].join('\n')
  assert.equal(classifyFailure(msg), 'npmTooOld')
})

test('classifyFailure: edgesOut crash inside ERR_PNPM_PREPARE_PACKAGE is npmTooOld, not pluginPrepare (history records without the marker)', () => {
  const msg = [
    '[ERR_PNPM_PREPARE_PACKAGE] Failed to prepare git-hosted package fetched from "https://codeload.github.com/meisam2236/agent-board/tar.gz/abc"',
    'npm error Cannot read properties of null (reading \'edgesOut\')',
    dshTailHint,
    '[exit 1]',
  ].join('\n')
  assert.equal(classifyFailure(msg), 'npmTooOld')
})

test('classifyFailure: ignored native-module builds are a plugin issue, even with the host hint attached', () => {
  const msg = [
    '[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: node-pty@1.1.0',
    'Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.',
    dshTailHint,
    '[exit 1]',
  ].join('\n')
  assert.equal(classifyFailure(msg), 'pnpmIgnoredBuild')
})

test('classifyFailure: prepare script actually failing is a plugin issue, even with the host hint attached', () => {
  const msg = [
    '[ERR_PNPM_PREPARE_PACKAGE] Failed to prepare git-hosted package fetched from "https://codeload.github.com/ccch1mneyyy/dsh-tui/tar.gz/abc": @deepseek-harness-tui/dsh-tui@0.8.6 pnpm-install: `pnpm install`',
    dshTailHint,
    '[exit 1]',
  ].join('\n')
  assert.equal(classifyFailure(msg), 'pluginPrepare')
})

test('classifyFailure: git fetch timeout (issue #10) is a network issue, not a plugin issue', () => {
  const msg = [
    'ERR_PNPM_GIT_FETCH_FAILED Git fetch failed: "git fetch https://github.com/adoresever/graph-memory HEAD ..."',
    'fatal: unable to access \'https://github.com/adoresever/graph-memory/\': Failed to connect to github.com port 443: Timed out',
    '[exit 1]',
  ].join('\n')
  assert.equal(classifyFailure(msg), 'network')
})

test('classifyFailure: [network] marker from the server pre-check is a network issue', () => {
  const msg = '[network] install aborted: cannot reach github.com (https://github.com/) before install — your network connection appears to be down or blocked (DNS / proxy / firewall).'
  assert.equal(classifyFailure(msg), 'network')
})

test('classifyFailure: DNS / connection-reset / TLS failures are network issues, even wrapped by Command failed', () => {
  assert.equal(classifyFailure('Command failed: git fetch https://github.com/x/y\nfatal: unable to access: Could not resolve host: github.com'), 'network')
  assert.equal(classifyFailure('pnpm error code ECONNRESET\npnpm error network socket hang up'), 'network')
  assert.equal(classifyFailure('getaddrinfo ENOTFOUND registry.npmjs.org'), 'network')
  assert.equal(classifyFailure('SSL certificate problem: unable to get local issuer certificate'), 'network')
})

test('classifyFailure: allowBuilds rejection wins over trailing connection-failure noise (graph-memory #82-#84)', () => {
  // #84：主因是插件 prepare 脚本被 allowBuilds 拦截（tarball 已下载、网络是通的），
  // 日志尾部混着重试残留的 ETIMEDOUT / Failed to connect —— 不能误判成网络问题
  const mixed = [
    '[ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED] Failed to prepare git-hosted package fetched from "https://codeload.github.com/adoresever/graph-memory/tar.gz/66183143": The git-hosted package "graph-memory@1.6.0-beta.8" needs to execute build scripts but is not in the "allowBuilds" allowlist.',
    '[WARN] HEAD https://github.com/adoresever/graph-memory error (ETIMEDOUT). Will retry in 500 milliseconds. 2 retries left.',
    '[ERR_PNPM_GIT_RESOLVE_FAILED] Failed to resolve git dependency "git+https://github.com/adoresever/graph-memory.git": git ls-remote failed: fatal: unable to access \'https://github.com/adoresever/graph-memory.git/\': Failed to connect to github.com:443 after 21356 ms: Could not connect to server',
  ].join('\n')
  assert.equal(classifyFailure(mixed), 'pnpmIgnoredBuild')
  // #82 / #83：PREPARE_NOT_ALLOWED + PREPARE_PACKAGE（prepare 被白名单拦截后脚本链失败）
  assert.equal(classifyFailure('[ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED] ... needs to execute build scripts but is not in the "allowBuilds" allowlist.\n[ERR_PNPM_PREPARE_PACKAGE] Failed to prepare git-hosted package fetched from "...": graph-memory@1.6.0-beta.8 npm-install: `npm install`'), 'pnpmIgnoredBuild')
  // 纯 IGNORED_BUILDS（原生模块构建被忽略）仍是 pnpmIgnoredBuild
  assert.equal(classifyFailure('pnpm-install: [ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: node-pty, esbuild'), 'pnpmIgnoredBuild')
})

test('classifyFailure: pure git fetch timeout without allowBuilds noise stays a network issue (graph-memory #87)', () => {
  const msg = [
    '[WARN] HEAD https://github.com/adoresever/graph-memory error (ETIMEDOUT). Will retry in 500 milliseconds. 2 retries left.',
    '[ERR_PNPM_GIT_FETCH_FAILED] Failed to fetch from the git repository "https://github.com/adoresever/graph-memory.git": fatal: unable to access \'https://github.com/adoresever/graph-memory.git/\': Failed to connect to github.com port 443 after 21027 ms: Timed out',
    '[exit 1]',
  ].join('\n')
  assert.equal(classifyFailure(msg), 'network')
})

test('npmTooLowVersion extracts the version from the marker, null otherwise', () => {
  assert.equal(npmTooLowVersion('[npm-too-low] npm@11.3.0 — npm arborist crashed'), '11.3.0')
  assert.equal(npmTooLowVersion('no marker here'), null)
})

test('classifyFailure: dsh command missing on the machine is an environment issue (issue #12), not a plugin issue', () => {
  // Windows cmd: 'dsh' 不是内部或外部命令
  assert.equal(classifyFailure("'dsh' \u4e0d\u662f\u5185\u90e8\u6216\u5916\u90e8\u547d\u4ee4\uff0c\u4e5f\u4e0d\u662f\u53ef\u8fd0\u884c\u7684\u7a0b\u5e8f\n\u6216\u6279\u5904\u7406\u6587\u4ef6\u3002"), 'dshMissing')
  // Windows cmd (English)
  assert.equal(classifyFailure("'dsh' is not recognized as an internal or external command,"), 'dshMissing')
  // POSIX shell
  assert.equal(classifyFailure('sh: dsh: command not found'), 'dshMissing')
  // node spawn ENOENT
  assert.equal(classifyFailure('spawn dsh ENOENT'), 'dshMissing')
  // 服务端 [dsh-missing] 标记（乱码免疫）：Windows cmd 中文版输出 GBK 被 UTF-8 误解码成乱码，
  // 原文匹配不了，服务端 spawn 前探测后打 ASCII 标记，前端据此归类
  assert.equal(classifyFailure('[dsh-missing] the dsh CLI was not found on this machine'), 'dshMissing')
  assert.equal(classifyFailure("'dsh' \u951f\u62b7\u6546\u662f\u9550\u5927\u90e8\u6216\u5916\u90e8\u547d\u4ee4 \u2026\n[dsh-missing] the dsh CLI was not found"), 'dshMissing')
  // 即使被外层 "Command failed" 包裹也必须归类为环境问题，不能被吞成插件问题
  assert.equal(classifyFailure("Command failed: dsh plugin add github:owner/repo\n'dsh' \u4e0d\u662f\u5185\u90e8\u6216\u5916\u90e8\u547d\u4ee4\uff0c\u4e5f\u4e0d\u662f\u53ef\u8fd0\u884c\u7684\u7a0b\u5e8f\u3002"), 'dshMissing')
})

test('classifyFailure: pnpm command missing is an environment issue (issue #13), not a plugin issue', () => {
  // dsh 存在但缺 pnpm（dsh 用它管理 profile 插件）：issue #13 的真实报错（Linux）
  assert.equal(classifyFailure('dsh: pnpm not found on PATH — install pnpm to manage profile plugins'), 'pnpmMissing')
  // POSIX shell
  assert.equal(classifyFailure('sh: pnpm: command not found'), 'pnpmMissing')
  // node spawn ENOENT
  assert.equal(classifyFailure('spawn pnpm ENOENT'), 'pnpmMissing')
  // Windows cmd 中英文
  assert.equal(classifyFailure("'pnpm' \u4e0d\u662f\u5185\u90e8\u6216\u5916\u90e8\u547d\u4ee4\uff0c\u4e5f\u4e0d\u662f\u53ef\u8fd0\u884c\u7684\u7a0b\u5e8f\u3002"), 'pnpmMissing')
  assert.equal(classifyFailure("'pnpm' is not recognized as an internal or external command"), 'pnpmMissing')
  // 服务端 [pnpm-missing] 标记（乱码免疫）
  assert.equal(classifyFailure('[pnpm-missing] the pnpm CLI was not found on this machine'), 'pnpmMissing')
  // 优先级：pnpm 缺失不能被 dshMissing（裸 command not found）或插件侧（Command failed）吞掉
  assert.equal(classifyFailure('Command failed: dsh plugin add github:owner/repo\nsh: pnpm: command not found'), 'pnpmMissing')
})

test('classifyFailure: pnpm store version mismatch is an environment issue (issue #14), not a plugin issue', () => {
  assert.equal(classifyFailure('[ERR_PNPM_UNEXPECTED_STORE] Unexpected store location\n(This error may happen if the node_modules was installed with a different major version of pnpm)\ndsh: pnpm failed in profile directory /Users/xxx/.dsh/profiles/web'), 'pnpmStore')
  assert.equal(classifyFailure('dsh: pnpm failed in profile directory /Users/xxx/.dsh/profiles/web\n[ERR_PNPM_UNEXPECTED_STORE] Unexpected store location'), 'pnpmStore')
  // 裸 Unexpected store location（无 ERR_ 前缀）也要能归到 pnpmStore
  assert.equal(classifyFailure('Unexpected store location: expected /Users/xxx/.pnpm-store, got /Users/xxx/.pnpm-store/v10'), 'pnpmStore')
})

test('classifyFailure: generic install failure falls back to repo', () => {
  assert.equal(classifyFailure('network error while fetching'), 'repo')
  assert.equal(classifyFailure(''), 'repo')
})

test('unreachableTargetOf extracts the exact unreachable address for the dialog', () => {
  // 服务端 [network] 预检消息（中/英文括号）优先取括号里的探测地址
  assert.equal(
    unreachableTargetOf('[network] 安装已中止：安装前无法连接到 GitHub（https://github.com/）—— 您的网络似乎不通或被拦截。'),
    'https://github.com/')
  assert.equal(
    unreachableTargetOf('[network] install aborted: cannot reach the npm registry (https://registry.npmjs.org/) before install.'),
    'https://registry.npmjs.org/')
  // 安装日志里的连接失败：取第一个 URL（git 仓库地址）
  assert.equal(
    unreachableTargetOf('fatal: unable to access \'https://github.com/adoresever/graph-memory/\': Failed to connect to github.com port 443: Timed out'),
    'https://github.com/adoresever/graph-memory/')
  // 提取不到 URL → null（调用方据此跳过地址行）
  assert.equal(unreachableTargetOf('pnpm error code ECONNRESET'), null)
})

test('coreErrorCode extracts the first error code', () => {
  assert.equal(coreErrorCode('foo [ERR_PNPM_PREPARE_PACKAGE] bar'), 'ERR_PNPM_PREPARE_PACKAGE')
  assert.equal(coreErrorCode('no code here'), null)
})

test('summarizeError keeps only the diagnostic lines, deduplicated', () => {
  const msg = [
    'Progress: resolved 0, reused 1, downloaded 0, added 0',
    '[ERR_PNPM_PREPARE_PACKAGE] Failed to prepare git-hosted package fetched from "https://x/1.tar.gz"',
    'dsh: pnpm failed in profile directory /Users/x/.dsh/profiles/web',
    '[ERR_PNPM_PREPARE_PACKAGE] Failed to prepare git-hosted package fetched from "https://x/1.tar.gz"',
    dshTailHint,
    '[exit 1]',
  ].join('\n')
  const out = summarizeError(msg)
  assert.ok(!out.includes('Progress:'))
  assert.ok(out.includes('ERR_PNPM_PREPARE_PACKAGE'))
  assert.ok(out.includes('pnpm failed in profile'))
  assert.ok(out.includes('allowBuilds'))
  assert.equal(out.split('ERR_PNPM_PREPARE_PACKAGE').length, 2) // deduped
})

test('summarizeError keeps descriptive failure lines like a missing submodule', () => {
  const msg = [
    'Progress: resolved 42, reused 41, downloaded 1, added 0',
    '[ERR_PNPM_PREPARE_PACKAGE] Failed to prepare git-hosted package fetched from "https://codeload.github.com/ccch1mneyyy/dsh-tui/tar.gz/abc"',
    'prepare-guard: vendor/dsh-std submodule content is missing (git tarball excludes submodules)',
    dshTailHint,
    '[exit 1]',
  ].join('\n')
  const out = summarizeError(msg)
  assert.ok(out.includes('submodule content is missing'), 'descriptive submodule line must survive compression')
  assert.ok(out.includes('ERR_PNPM_PREPARE_PACKAGE'))
  assert.ok(out.includes('prepare-guard'))
  assert.ok(!out.includes('Progress:'))
})

test('summarizeError falls back to head+tail snapshot when nothing matches', () => {
  const head = 'line one start'
  const tail = 'last line end'
  const out = summarizeError(`${head}\n${'middle '.repeat(200)}\n${tail}`)
  assert.ok(out.startsWith('line one start'))
  assert.ok(out.endsWith('last line end'))
})

test('summarizeError truncates over-long single lines and total output', () => {
  const longLine = `ERR_PNPM_PREPARE_PACKAGE ${'x'.repeat(2000)}`
  assert.ok(summarizeError(longLine).length <= 5000 + 16)
  const many = Array.from({ length: 60 }, (_, i) => `Command failed (${'y'.repeat(80)} ${i})`).join('\n')
  assert.ok(summarizeError(many).endsWith('… (truncated)'))
})

test('summarizeError honors a caller-provided budget (issue URL clamp)', () => {
  const msg = `ERR_PNPM_PREPARE_PACKAGE ${'x'.repeat(2000)}`
  assert.ok(summarizeError(msg, 300).length <= 300 + 16)
})
