/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * npm 包校验（isDshPackageMetadataForRepo）的单元测试。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { isDshNpmPackageForRepo, isDshPackageMetadataForRepo, npmMetadataPath } from '../src/server/services/install/npm-resolve.ts'

test('isDshPackageMetadataForRepo: 目录纠错要求同仓库且确实是 DSH plugin', () => {
  assert.equal(isDshPackageMetadataForRepo({
    keywords: ['cli'],
    repository: { url: 'https://github.com/example/plugin.git' },
  }, 'example/plugin'), false)
  assert.equal(isDshPackageMetadataForRepo({
    keywords: ['DSH-Plugin'],
    repository: { url: 'https://github.com/example/plugin.git' },
  }, 'example/plugin'), true)
  assert.equal(isDshPackageMetadataForRepo({
    dsh: { bundle: {} },
    repository: 'git+https://github.com/example/plugin.git',
  }, 'example/plugin'), true)
  assert.equal(isDshPackageMetadataForRepo({
    keywords: ['dsh-plugin'],
    repository: { url: 'https://github.com/other/repo.git' },
  }, 'example/plugin'), false)
  assert.equal(isDshPackageMetadataForRepo({
    keywords: ['dsh-plugin'],
    repository: { url: 'https://github.com/example/plugin-extra.git' },
  }, 'example/plugin'), false)
})

test('npmMetadataPath: latest by default, exact version when provided, scoped names encoded', () => {
  assert.equal(npmMetadataPath('dsh-whale-widget'), 'dsh-whale-widget/latest')
  assert.equal(npmMetadataPath('dsh-whale-widget', '0.4.2'), 'dsh-whale-widget/0.4.2')
  assert.equal(npmMetadataPath('dsh-whale-widget', 'v0.4.2'), 'dsh-whale-widget/0.4.2')
  assert.equal(npmMetadataPath('@scope/name', '1.2.3'), '%40scope%2Fname/1.2.3')
})

test('isDshNpmPackageForRepo: http 源正常查询（不再抛 Protocol "http:" not supported）', async () => {
  const server = createServer((req, res) => {
    if (req.url === '/dsh-http-probe/latest') {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({
        keywords: ['dsh-plugin'],
        repository: { url: 'https://github.com/example/plugin.git' },
      }))
      return
    }
    res.writeHead(404)
    res.end()
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(undefined)))
  const { port } = server.address() as { port: number }
  try {
    const hit = await isDshNpmPackageForRepo('dsh-http-probe', 'example/plugin', `http://127.0.0.1:${port}`)
    assert.equal(hit, true)
  } finally {
    await new Promise((resolve) => server.close(() => resolve(undefined)))
  }
})

test('isDshNpmPackageForRepo: 缺协议的源直接返回 false，不发请求也不抛错', async () => {
  assert.equal(await isDshNpmPackageForRepo('dsh-x', 'example/plugin', 'registry.npmjs.org'), false)
})
