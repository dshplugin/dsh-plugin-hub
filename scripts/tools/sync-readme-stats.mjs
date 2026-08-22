#!/usr/bin/env node
/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 将 README 中的插件统计数字与官网在线 API 的真实值保持同步。
 *
 * 用法：npm run readme:stats
 * 数字口径：total = 收录总数（含未验证）；verified = 人工精选验证数。
 * 数据源：dsh-plugin.org 在线统计 API（/api/stats.json，构建期随数据更新），无需本地快照。
 * 仅替换匹配关键词的行，避免误伤 README 中的其他数字。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

// /api/stats.json 返回 { total, verified } 的权威统计（total 为收录总数，verified 为人工精选验证数）
const res = await fetch('https://dsh-plugin.org/api/stats.json')
if (!res.ok) {
  console.error(`readme:stats — 在线 API 拉取失败（HTTP ${res.status}），中止`)
  process.exit(1)
}
const raw = await res.json()
const total = raw.total ?? 0
const verified = raw.verified ?? 0

const fmt = (n) => n.toLocaleString('en-US')
const totalStr = fmt(total)
const verifiedStr = fmt(verified)

// 只在这些关键词所在行内做替换，避免误伤其他数字
const LINE_HINT = /收录|人工精选验证|indexed|indexes|hand-verified|human-verified|DSH plugins|community plugins/
// 匹配完整数字（含千分位，不带 +）；(?<![\d,]) 确保不从数字串中间开始匹配
const NUM_TEST = /(?<![\d,])\d+(?:,\d{3})*/
const NUM_RE = /(?<![\d,])\d+(?:,\d{3})*/g

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
