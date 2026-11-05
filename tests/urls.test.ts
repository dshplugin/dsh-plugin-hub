/**
 * 单测：官网链接必须全小写。
 *
 * 官网静态导出只生成小写 owner/slug 路径，repo 原样拼接会让混合大小写仓库
 * （如 HuaGuoXingKong/dsh-prompt-rewriter）的详情链接和失败报告里的 Catalog 链接落到 404。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { HubPlugin } from '../src/client/types.ts'
import { pluginDetailUrl, pluginSiteUrl } from '../src/client/logic/urls.ts'

test('pluginSiteUrl: 混合大小写的 repo 归一为小写', () => {
  assert.equal(
    pluginSiteUrl('HuaGuoXingKong/dsh-prompt-rewriter'),
    'https://dsh-plugin.org/plugins/huaguoxingkong/dsh-prompt-rewriter?ref=hub'
  )
})

test('pluginDetailUrl: ownerSlug 缺省时按小写 owner 推导', () => {
  const plugin = {
    slug: 'dsh-prompt-rewriter',
    source: { repo: 'HuaGuoXingKong/dsh-prompt-rewriter' },
  } as unknown as HubPlugin
  assert.equal(
    pluginDetailUrl(plugin, 'zh/'),
    'https://dsh-plugin.org/zh/plugins/huaguoxingkong/dsh-prompt-rewriter?ref=hub'
  )
})
