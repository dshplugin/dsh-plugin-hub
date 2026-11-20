/**
 * 单测：宿主 locale → 字典 key 的回退规则，以及头部语言开关的循环顺序。
 *
 * 这是「界面切成 ja / de 就整片变中文」的根因所在：宿主的语言比本插件多，
 * 没有字典的语言必须回退到英文，而不是回退到 zh。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SHIPPED_LOCALES, dictKeyOf, nextLocaleOf } from '../src/client/logic/locale-key.ts'

test('locale-key: 只跟随宿主内置的 zh / en 两门语言', () => {
  assert.deepEqual(SHIPPED_LOCALES, ['en', 'zh'])
})

test('locale-key: 自带字典的语言原样返回', () => {
  for (const locale of SHIPPED_LOCALES) {
    assert.equal(dictKeyOf(locale), locale)
  }
})

test('locale-key: 没有字典的宿主语言回退到英文，不是中文', () => {
  for (const locale of ['ja', 'de', 'fr', 'es', 'ru', 'pt-BR']) {
    assert.equal(dictKeyOf(locale), 'en', `${locale} 应回退到 en`)
  }
  // 宿主传来的未知 id 也不能抛错
  assert.equal(dictKeyOf(''), 'en')
})

test('locale-key: 带区域的语言包按主语言子标签归位', () => {
  // 宿主的 id 可能带区域（zh-CN / en-US），不能因此被当成「没有字典」
  assert.equal(dictKeyOf('zh-CN'), 'zh')
  assert.equal(dictKeyOf('zh_TW'), 'zh')
  assert.equal(dictKeyOf('en-US'), 'en')
  assert.equal(dictKeyOf('EN'), 'en')
})

test('locale-key: 切换开关在中英之间循环', () => {
  assert.equal(nextLocaleOf('en'), 'zh')
  assert.equal(nextLocaleOf('zh'), 'en')
  // 未知语言先按字典 key 归位，再切成下一个
  assert.equal(nextLocaleOf('ja'), 'zh')
  assert.equal(nextLocaleOf('pt-BR'), 'zh')
})
