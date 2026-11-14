/**
 * 单测：zh / en 字典必须逐键对齐。
 *
 * 失败归因的文案是按 `failKind_<kind>` / `failReason_<kind>` 动态取的：任一侧漏一个键，
 * 界面上就会直接显示键名 —— 而且只在对应失败类型真正发生时才会暴露，平时看不出来。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { en, pt, zh } from '../src/client/locales.ts'

/** 全部字典，键为语言标记；以 zh（键的来源）为准逐份比对。 */
const DICTS = { zh, en, pt } as const
const LOCALES = Object.keys(DICTS) as (keyof typeof DICTS)[]

test('locales: zh / en / pt 的键集合完全一致', () => {
  const zhKeys = Object.keys(zh).sort()
  for (const locale of LOCALES) {
    if (locale === 'zh') continue
    const keys = Object.keys(DICTS[locale]).sort()
    const missing = zhKeys.filter((k) => !(k in DICTS[locale]))
    const extra = keys.filter((k) => !(k in zh))
    assert.deepEqual(missing, [], `这些键缺少 ${locale} 文案`)
    assert.deepEqual(extra, [], `这些键不属于 ${locale}`)
  }
})

test('locales: 每种失败类型的标题与原因成对存在', () => {
  for (const locale of LOCALES) {
    const dict = DICTS[locale]
    for (const key of Object.keys(dict)) {
      if (!key.startsWith('failKind_')) continue
      const kind = key.slice('failKind_'.length)
      assert.ok(`failReason_${kind}` in dict, `${locale} 缺少 failReason_${kind}`)
    }
    for (const key of Object.keys(dict)) {
      if (!key.startsWith('failReason_')) continue
      const kind = key.slice('failReason_'.length)
      assert.ok(`failKind_${kind}` in dict, `${locale} 缺少 failKind_${kind}`)
    }
  }
})

test('locales: 非中文界面语言的新字典里不应残留汉字', () => {
  // 防止机翻时漏掉一段：pt 文案里出现汉字，说明那一句根本没翻译
  const cjk = /[\u4e00-\u9fff]/
  const leaked = Object.entries(pt)
    .filter(([, value]) => cjk.test(value))
    .map(([key]) => key)
  assert.deepEqual(leaked, [], '这些 pt 文案仍含汉字')
})

test('locales: failKind 的每个后缀都是真实存在的失败类型', () => {
  // 从分类器源码里取联合类型，避免测试里再抄一份（抄的那份迟早和实现对不上）
  const source = readFileSync(new URL('../src/client/logic/failures.ts', import.meta.url), 'utf8')
  const union = /export type FailureKind = ([^\n]+)/.exec(source)?.[1] ?? ''
  assert.ok(union !== '', '未能解析 FailureKind 联合类型')
  for (const key of Object.keys(zh)) {
    if (!key.startsWith('failKind_')) continue
    const kind = key.slice('failKind_'.length)
    assert.ok(union.includes(`'${kind}'`), `failKind_${kind} 不是 FailureKind 的成员`)
  }
})
