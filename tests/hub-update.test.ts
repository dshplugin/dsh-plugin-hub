/**
 * 单测：Hub 自我更新的数据入口。
 *
 * 接口下发的 `recentVersions` 是「最新版还在 24.5h 发布冷却期内时，回退到更早的已过冷却期版本」
 * 的唯一依据。`fetchHubUpdate` 归一化时漏传它，#350 的修复就永远不生效（#465）。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fetchHubUpdate } from '../src/client/data/hub.ts'
import { pickHubUpdate } from '../src/client/logic/release-age.ts'

const payload = {
  version: '2.2.2',
  publishedAt: '2026-10-26T10:01:27.312Z',
  notes: '# v2.2.2',
  recentVersions: [
    { version: '2.2.2', publishedAt: '2026-10-26T10:01:27.312Z', notes: 'n222' },
    { version: '2.2.1', publishedAt: '2026-10-25T03:10:17.896Z', notes: 'n221' },
    // 非法条目：版本不是字符串 / 缺版本 —— 必须被丢弃，而不是让下游崩或污染候选
    { version: 222 as unknown as string, publishedAt: '2026-10-26T10:01:27.312Z' },
    { publishedAt: '2026-10-20T00:00:00Z' },
  ],
}

/** 临时替换 globalThis.fetch，返回固定 JSON。 */
async function withFetch(body: unknown, run: () => Promise<void>): Promise<void> {
  const original = globalThis.fetch
  globalThis.fetch = (async () => ({ ok: true, json: async () => body })) as unknown as typeof fetch
  try {
    await run()
  } finally {
    globalThis.fetch = original
  }
}

test('fetchHubUpdate: keeps recentVersions and drops malformed entries', async () => {
  await withFetch(payload, async () => {
    const info = await fetchHubUpdate()
    assert.ok(info)
    assert.equal(info?.version, '2.2.2')
    assert.deepEqual(info?.recentVersions?.map((v) => v.version), ['2.2.2', '2.2.1'])
  })
})

test('pickHubUpdate: falls back to a matured version when the newest is too fresh', async () => {
  await withFetch(payload, async () => {
    const info = await fetchHubUpdate()
    assert.ok(info)
    // 复现 #465 的观测时刻：2.2.2 只发了 16.7h（未过冷却期），2.2.1 已过
    const picked = pickHubUpdate(info!, '2.1.0', Date.parse('2026-10-27T02:43:00Z'))
    assert.equal(picked.state, 'available')
    assert.equal(picked.target?.version, '2.2.1')
  })
})

test('fetchHubUpdate: missing or malformed recentVersions degrades to an empty list', async () => {
  await withFetch({ version: '2.2.2', publishedAt: '2026-10-26T10:01:27.312Z' }, async () => {
    const info = await fetchHubUpdate()
    assert.deepEqual(info?.recentVersions, [])
  })
  await withFetch({ version: '2.2.2', recentVersions: 'nope' }, async () => {
    const info = await fetchHubUpdate()
    assert.deepEqual(info?.recentVersions, [])
  })
})
