/**
 * profile 的 pnpm-workspace.yaml 写入（services/profile/profile.ts::addAllowBuildsKey）单测。
 *
 * 重点是「怎么都不会写出第二个 allowBuilds 键」：一旦出现重复键，pnpm 解析阶段就报
 * `duplicated mapping key`，该 profile 里任何插件都装不上（#562）。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { addAllowBuildsKey, sanitizeAllowBuilds } from '../src/server/services/profile/profile.ts'

/** 在临时 DSH_HOME 的 desktop profile 下写入规则文件，调用 addAllowBuildsKey 后回读。 */
function writeAndRead(content: string, key: string): string {
  const home = mkdtempSync(join(tmpdir(), 'dsh-allow-builds-'))
  const dir = join(home, 'profiles', 'desktop')
  mkdirSync(dir, { recursive: true })
  const file = join(dir, 'pnpm-workspace.yaml')
  writeFileSync(file, content)
  const previous = process.env.DSH_HOME
  process.env.DSH_HOME = home
  try {
    addAllowBuildsKey('desktop', key)
    return readFileSync(file, 'utf8')
  } finally {
    if (previous === undefined) delete process.env.DSH_HOME
    else process.env.DSH_HOME = previous
  }
}

/** 顶层 allowBuilds 键出现次数（>1 就是 pnpm 会拒绝解析的重复键）。 */
function countKeys(yaml: string): number {
  return yaml.split(/\r?\n/).filter((line) => /^[ \t]*allowBuilds:/.test(line)).length
}

test('addAllowBuildsKey: 块写法合并新条目，不产生重复键', () => {
  const out = writeAndRead('allowBuilds:\n  a@1.0.0: true\n', 'b@2.0.0')
  assert.equal(countKeys(out), 1)
  assert.match(out, /a@1\.0\.0: true/)
  assert.match(out, /b@2\.0\.0: true/)
})

test('addAllowBuildsKey: 行内数组写法被规范化，保留已有条目', () => {
  const out = writeAndRead('allowBuilds: ["a@1.0.0"]\n', 'new@1.0.0')
  assert.equal(countKeys(out), 1)
  assert.match(out, /a@1\.0\.0: true/)
  assert.match(out, /new@1\.0\.0: true/)
})

test('addAllowBuildsKey: 文件末尾的裸 allowBuilds:（无换行）不会变成两个键', () => {
  const out = writeAndRead('onlyBuiltDependencies:\n  - x\nallowBuilds:', 'new@1.0.0')
  assert.equal(countKeys(out), 1)
  assert.match(out, /onlyBuiltDependencies:\n {2}- x/)
  assert.match(out, /new@1\.0\.0: true/)
})

test('addAllowBuildsKey: 已存在的两个 allowBuilds 段被合成一个', () => {
  const out = writeAndRead('allowBuilds:\n  a@1.0.0: true\nallowBuilds:\n  b@2.0.0: true\n', 'c@3.0.0')
  assert.equal(countKeys(out), 1)
  for (const k of ['a@1.0.0', 'b@2.0.0', 'c@3.0.0']) assert.ok(out.includes(k), k)
})

test('addAllowBuildsKey: CRLF 文件保持 CRLF，且只写一个键', () => {
  const out = writeAndRead('packages:\r\n  - "."\r\n', 'node-pty@1.1.0')
  assert.equal(countKeys(out), 1)
  assert.match(out, /allowBuilds:\r\n {2}node-pty@1\.1\.0: true\r\n/)
})

test('addAllowBuildsKey: 文件不存在时新建', () => {
  const out = writeAndRead('', 'a@1.0.0')
  assert.equal(countKeys(out), 1)
  assert.match(out, /a@1\.0\.0: true/)
})

test('addAllowBuildsKey: git tarball 地址归一为 repo key，而不是降级成裸包名（#771）', () => {
  // 裸包名匹配不上 git-hosted 依赖，降级会让「自动放行并重试」永远无效；
  // 但 tarball 地址本身会被 pnpm 当版本联合解析（#730），所以归一成 git+<repo>.git
  const github = writeAndRead('', 'dsh-purge@https://codeload.github.com/x/y/tar.gz/abc')
  assert.match(github, /^ {2}dsh-purge@git\+https:\/\/github\.com\/x\/y\.git: true$/m)
  const gitlab = writeAndRead('', 'pkg@https://gitlab.com/g/sub/repo/-/archive/v1/repo-v1.tar.gz')
  assert.match(gitlab, /^ {2}pkg@git\+https:\/\/gitlab\.com\/g\/sub\/repo\.git: true$/m)
  const bitbucket = writeAndRead('', 'pkg@https://bitbucket.org/o/r/get/abc.tar.gz')
  assert.match(bitbucket, /^ {2}pkg@git\+https:\/\/bitbucket\.org\/o\/r\.git: true$/m)
  // 已经是 git+ 形态的 key 原样保留
  const keep = writeAndRead('', 'pkg@git+ssh://git@example.com/o/r.git')
  assert.match(keep, /^ {2}pkg@git\+ssh:\/\/git@example\.com\/o\/r\.git: true$/m)
})

test('addAllowBuildsKey: 无法识别的 spec 仍降级为裸包名（否则 pnpm 全盘失败）', () => {
  // `pkg@file:…` / 任意 tarball 无法映射成 git repo key，只能按包名放行（#730）
  const local = writeAndRead('', 'dsh-purge@file:../../vendor/dsh-purge')
  assert.match(local, /^ {2}dsh-purge: true$/m)
  const exact = writeAndRead('', 'node-pty@1.1.0')
  assert.match(exact, /^ {2}node-pty@1\.1\.0: true$/m)
})

test('sanitizeAllowBuilds: 清理已有非法 key，且可重复执行', () => {
  const home = mkdtempSync(join(tmpdir(), 'dsh-allow-builds-'))
  const dir = join(home, 'profiles', 'desktop')
  mkdirSync(dir, { recursive: true })
  const file = join(dir, 'pnpm-workspace.yaml')
  writeFileSync(file, 'packages:\n  - "."\nallowBuilds:\n  dsh-purge@https: true\n  a@1.0.0: true\n  b@file:../b: false\n')
  const previous = process.env.DSH_HOME
  process.env.DSH_HOME = home
  try {
    assert.equal(sanitizeAllowBuilds('desktop'), true)
    const out = readFileSync(file, 'utf8')
    assert.equal(countKeys(out), 1)
    assert.match(out, /^ {2}dsh-purge: true$/m)
    assert.match(out, /^ {2}a@1\.0\.0: true$/m)
    assert.match(out, /^ {2}b: false$/m)
    assert.match(out, /^ {2}- "\."$/m)
    // 再跑一次：已经合法，不该再写盘
    assert.equal(sanitizeAllowBuilds('desktop'), false)
  } finally {
    if (previous === undefined) delete process.env.DSH_HOME
    else process.env.DSH_HOME = previous
  }
})
