/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * npm 包校验（isDshPackageMetadataForRepo）的单元测试。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isDshPackageMetadataForRepo, npmMetadataPath } from '../src/server/services/install/npm-resolve.ts'

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
