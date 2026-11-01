/**
 * profile YAML 配置损坏识别（services/install/profile-yaml.ts）单测。
 *
 * 复现 #562：pnpm 读 profile 里的 pnpm-workspace.yaml / pnpm-lock.yaml 时遇到重复键，
 * 在依赖解析前就退出。必须打出 ASCII 标记，前端据此归类为本机环境并给修复步骤，
 * 而不是当成插件分发问题提交到作者/插件中心仓库。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { profileYamlMarker } from '../src/server/services/install/profile-yaml.ts'

test('profileYamlMarker: duplicated mapping key → 打标记', () => {
  const output = `[ERROR] duplicated mapping key (10:3)\ndsh: plugin command failed; diagnostics: C:\\Users\\u\\.dsh\\profiles\\desktop\\.plugin-manager\\logs\\operation-x\\pnpm.log\n[exit 1]`
  const marker = profileYamlMarker(output)
  assert.notEqual(marker, null)
  assert.match(marker as string, /^\[profile-yaml\]/)
  // 纯 ASCII：Windows GBK 解码后仍可匹配
  assert.ok(/^[\x20-\x7E]+$/.test(marker as string))
  assert.match(marker as string, /local environment issue/)
})

test('profileYamlMarker: YAML 缩进错误同样命中', () => {
  assert.notEqual(profileYamlMarker('bad indentation of a mapping entry (12:5)'), null)
  assert.notEqual(profileYamlMarker('bad indentation of a sequence entry (3:1)'), null)
})

test('profileYamlMarker: 与 YAML 无关的失败不打标记', () => {
  assert.equal(profileYamlMarker('ERR_PNPM_FETCH_404  dsh-foo not found'), null)
  assert.equal(profileYamlMarker('Command failed with exit code 1'), null)
  assert.equal(profileYamlMarker(''), null)
})
