/**
 * 单测：宿主 locale → 字典 key 的回退规则，以及头部语言开关的循环顺序。
 *
 * 这是「界面切成 pt / ja / de 就整片变中文」的根因所在：宿主的语言比本插件多，
 * 没有字典的语言必须回退到英文，而不是回退到 zh。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SHIPPED_LOCALES, dictKeyOf, nextLocaleOf } from '../src/client/logic/locale-key.ts'

test('locale-key: 自带字典的语言原样返回', () => {
  for (const locale of SHIPPED_LOCALES) {
    assert.equal(dictKeyOf(locale), locale)
  }
})

test('locale-key: 没有字典的宿主语言回退到英文，不是中文', () => {
  for (const locale of ['ja', 'de', 'fr', 'es', 'ru']) {
    assert.equal(dictKeyOf(locale), 'en', `${locale} 应回退到 en`)
  }
  // 宿主传来的未知 id 也不能抛错
  assert.equal(dictKeyOf('pt-BR'), 'en')
  assert.equal(dictKeyOf(''), 'en')
})

test('locale-key: 切换开关在自带字典的语言之间循环', () => {
  assert.equal(nextLocaleOf('en'), 'zh')
  assert.equal(nextLocaleOf('zh'), 'pt')
  assert.equal(nextLocaleOf('pt'), 'en')
  // 未知语言先按字典 key 归位，再切成下一个
  assert.equal(nextLocaleOf('ja'), 'zh')
})
