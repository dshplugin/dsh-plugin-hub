/**
 * npm 换源（services/install/registry-fallback.ts）单测。
 *
 * 锁定三件事：候选源只在公共源之间扩展、自定义/内网源绝不切换、
 * 只有传输层失败才换源（404 / 版本不存在 / 鉴权失败必须保持原样）。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isPublicRegistry, isTransportFailure, normalizeRegistry, registryCandidates, registryHost } from '../src/server/services/install/registry-fallback.ts'

const OFFICIAL = 'https://registry.npmjs.org'
const NPMMIRROR = 'https://registry.npmmirror.com'

test('normalizeRegistry: 去空白与尾部斜杠', () => {
  assert.equal(normalizeRegistry('  https://registry.npmjs.org/  '), OFFICIAL)
  assert.equal(normalizeRegistry('https://mirrors.cloud.tencent.com/npm///'), 'https://mirrors.cloud.tencent.com/npm')
})

test('isPublicRegistry: 只认公共源白名单', () => {
  assert.equal(isPublicRegistry(OFFICIAL), true)
  assert.equal(isPublicRegistry(NPMMIRROR), true)
  assert.equal(isPublicRegistry('https://mirrors.cloud.tencent.com/npm'), true)
  assert.equal(isPublicRegistry('https://mirrors.tuna.tsinghua.edu.cn/npm'), true)
  // 自定义 / 内网 / 非 http 形态都不在白名单
  assert.equal(isPublicRegistry('https://npm.corp.internal'), false)
  assert.equal(isPublicRegistry('http://192.168.1.10:4873'), false)
  assert.equal(isPublicRegistry('registry.npmjs.org'), false)
  assert.equal(isPublicRegistry(''), false)
})

test('registryCandidates: 公共源按「当前 → 官方 → npmmirror」扩展，最多 3 个', () => {
  assert.deepEqual(registryCandidates(NPMMIRROR, '', true), [NPMMIRROR, OFFICIAL, 'https://mirrors.cloud.tencent.com/npm'])
  assert.deepEqual(registryCandidates(OFFICIAL, '', true), [OFFICIAL, NPMMIRROR, 'https://mirrors.cloud.tencent.com/npm'])
  // 显式源优先于本机配置
  assert.equal(registryCandidates(NPMMIRROR, OFFICIAL, true)[0], NPMMIRROR)
  // 未配置时跟随本机 npm 配置
  assert.equal(registryCandidates('', OFFICIAL, true)[0], OFFICIAL)
  // 都没有时回官方源
  assert.equal(registryCandidates('', '', true)[0], OFFICIAL)
  // 尾部斜杠不会产生重复候选
  const dup = registryCandidates(`${OFFICIAL}/`, '', true)
  assert.equal(new Set(dup).size, dup.length)
})

test('registryCandidates: 关闭降级或自定义源时只有它自己', () => {
  assert.deepEqual(registryCandidates(NPMMIRROR, '', false), [NPMMIRROR])
  // 内网/私有源绝不自动切到公共源：私有包名会外泄
  assert.deepEqual(registryCandidates('https://npm.corp.internal', '', true), ['https://npm.corp.internal'])
  assert.deepEqual(registryCandidates('', 'http://192.168.1.10:4873', true), ['http://192.168.1.10:4873'])
})

test('isTransportFailure: 超时 / 连接 / DNS / 5xx 才换源', () => {
  for (const log of [
    'ERR_PNPM_META_FETCH_FAIL GET https://registry.npmjs.org/dsh-x: request to https://registry.npmjs.org/dsh-x failed, reason: connect ETIMEDOUT 104.16.26.34:443',
    'FetchError: network request failed, reason: getaddrinfo EAI_AGAIN registry.npmjs.org',
    'request to https://registry.npmjs.org/x failed, reason: socket hang up',
    'ERR_PNPM_FETCH_503 GET https://registry.npmjs.org/x: Service Unavailable',
    'connect ECONNRESET 104.16.26.34:443',
    'connect ECONNREFUSED 127.0.0.1:4873',
  ]) {
    assert.equal(isTransportFailure(log), true, log)
  }
})

test('isTransportFailure: 404 / 版本不存在 / 鉴权失败不换源', () => {
  for (const log of [
    'ERR_PNPM_FETCH_404 GET https://registry.npmjs.org/dsh-x: Not Found - 404',
    'ERR_PNPM_NO_MATCHING_VERSION No matching version found for dsh-x@2.0.0',
    'ETARGET No matching version found',
    'ERR_PNPM_FETCH_401 GET https://registry.npmjs.org/x: Unauthorized - 401',
    'ERR_PNPM_FETCH_403 GET https://registry.npmjs.org/x: Forbidden - 403',
    'Progress: resolved 417, reused 18, downloaded 11, added 1, done',
  ]) {
    assert.equal(isTransportFailure(log), false, log)
  }
})

test('isTransportFailure: 证书链不被信任时不换源（换哪个镜像都会同样失败）', () => {
  for (const log of [
    'ERR_PNPM_META_FETCH_FAIL GET https://registry.npmjs.org/x: request to https://registry.npmjs.org/x failed, reason: unable to verify the first certificate',
    'SELF_SIGNED_CERT_IN_CHAIN: self signed certificate in certificate chain',
    'CERT_HAS_EXPIRED: certificate has expired',
  ]) {
    assert.equal(isTransportFailure(log), false, log)
  }
})

test('registryHost: 只取主机名用于日志', () => {
  assert.equal(registryHost('https://registry.npmmirror.com/'), 'registry.npmmirror.com')
  assert.equal(registryHost('not a url'), 'not a url')
})
