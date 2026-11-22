/**
 * 子进程输出解码（services/install/decode-output.ts）单测：
 * UTF-8 多字节字符跨 chunk 不能被误判，GBK 输出要能正确还原成中文。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { OutputDecoder } from '../src/server/services/install/decode-output.ts'

test('OutputDecoder: UTF-8 output passes through unchanged', () => {
  const d = new OutputDecoder()
  assert.equal(d.push(Buffer.from('安装失败 — ERR_PNPM_FETCH_404\n', 'utf8')), '安装失败 — ERR_PNPM_FETCH_404\n')
})

test('OutputDecoder: a multi-byte UTF-8 char split across chunks is not treated as GBK', () => {
  const d = new OutputDecoder()
  const bytes = Buffer.from('安装', 'utf8')
  const first = d.push(bytes.subarray(0, 2))
  const second = d.push(bytes.subarray(2))
  assert.equal(first + second, '安装')
})

test('OutputDecoder: GBK output (Chinese Windows) is decoded back to readable text', () => {
  const d = new OutputDecoder()
  // GBK 编码的「安装失败」
  const gbk = Buffer.from([0xb0, 0xb2, 0xd7, 0xb0, 0xca, 0xa7, 0xb0, 0xdc])
  assert.equal(d.push(gbk), '安装失败')
})

test('OutputDecoder: a GBK char split across chunks still decodes to readable text', () => {
  const d = new OutputDecoder()
  // GBK 编码的「安装」= B0 B2 D7 B0；首字节止于第一个 chunk 尾，
  // 不得把两段各留成一个替换字符
  const gbk = Buffer.from([0xb0, 0xb2, 0xd7, 0xb0])
  const first = d.push(gbk.subarray(0, 1))
  const second = d.push(gbk.subarray(1))
  assert.equal(first + second, '安装')
})

test('OutputDecoder: plain ASCII stays ASCII', () => {
  const d = new OutputDecoder()
  assert.equal(d.push(Buffer.from('ERR_PNPM_FETCH_404\n')), 'ERR_PNPM_FETCH_404\n')
})
