#!/usr/bin/env node
/**
 * 将 README 中的插件数量从写死的约数自动更新为数据快照的真实值。
 *
 * 用法：npm run readme:stats   （sync:data 同步数据后会自动调用）
 * 数字口径：total = 收录总数；verified = 人工精选验证数（compatibility.status === 'verified'）。
 * 仅替换匹配关键词的行，避免误伤 README 中的其他数字。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// 以中文快照为准（zh/en 收录同一批插件）
const raw = JSON.parse(readFileSync(join(root, 'data/plugins.zh.json'), 'utf8'))
const list = Array.isArray(raw) ? raw : (raw.plugins ?? [])
const total = list.length
const verified = list.filter((p) => p.compatibility?.status === 'verified').length

const fmt = (n) => n.toLocaleString('en-US')
const totalStr = fmt(total)
const verifiedStr = fmt(verified)

// 只在这些关键词所在行内做替换，避免误伤其他数字
const LINE_HINT = /收录|人工精选验证|indexed|indexes|hand-verified|human-verified|DSH plugins|community plugins/
// 匹配完整数字（含千分位），末尾带 "+"；(?<![\d,]) 确保不从数字串中间开始匹配
const NUM_TEST = /(?<![\d,])\d+(?:,\d{3})*\+/
const NUM_RE = /(?<![\d,])\d+(?:,\d{3})*\+/g

function syncFile(file) {
  const path = join(root, file)
  const text = readFileSync(path, 'utf8')
  let lineChanges = 0
  const next = text.split('\n').map((line) => {
    if (!LINE_HINT.test(line) || !NUM_TEST.test(line)) return line
    let n = 0
    const out = line.replace(NUM_RE, (m) => {
      n += 1
      if (n === 1) return totalStr
      if (n === 2) return verifiedStr
      return m
    })
    if (out !== line) lineChanges += 1
    return out
  }).join('\n')
  if (next !== text) {
    writeFileSync(path, next)
    console.log(`✔ ${file}: 更新 ${lineChanges} 行（收录 ${totalStr} / 验证 ${verifiedStr}）`)
  } else {
    console.log(`· ${file}: 无需更新（收录 ${totalStr} / 验证 ${verifiedStr}）`)
  }
}

syncFile('README.md')
syncFile('README.en.md')
console.log(`统计：共收录 ${total} 个插件，人工精选验证 ${verified} 个`)
