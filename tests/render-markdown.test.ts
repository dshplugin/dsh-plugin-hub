/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Unit tests for the lightweight Markdown renderer used by the Hub self-update
 * dialog (src/client/lib/renderMarkdown.ts). The renderer escapes all HTML
 * first and only whitelists http(s) links — these tests pin that contract.
 *
 * Run with the Node built-in test runner: `npm test` (Node >= 22.6 with
 * type stripping). No extra test dependencies required.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderMarkdown } from '../src/client/lib/renderMarkdown.ts'

test('renderMarkdown: headings map #~#### to h2~h5', () => {
  const out = renderMarkdown('# One\n## Two\n### Three\n#### Four\n')
  assert.match(out, /<h2>One<\/h2>/)
  assert.match(out, /<h3>Two<\/h3>/)
  assert.match(out, /<h4>Three<\/h4>/)
  assert.match(out, /<h5>Four<\/h5>/)
})

test('renderMarkdown: unordered and ordered lists', () => {
  const ul = renderMarkdown('- a\n- b\n- c\n')
  assert.equal(ul, '<ul><li>a</li><li>b</li><li>c</li></ul>')
  const ol = renderMarkdown('1. first\n2. second\n')
  assert.equal(ol, '<ol><li>first</li><li>second</li></ol>')
})

test('renderMarkdown: fenced code block stays escaped', () => {
  const out = renderMarkdown('```\nconst x = "<b>&";\n```\n')
  assert.equal(out, '<pre><code>const x = &quot;&lt;b&gt;&amp;&quot;;</code></pre>')
})

test('renderMarkdown: inline code is protected from other rules', () => {
  const out = renderMarkdown('run `npm i *x* [y](z)` now\n')
  assert.match(out, /<p>run <code>npm i \*x\* \[y\]\(z\)<\/code> now<\/p>/)
})

test('renderMarkdown: bold and italic', () => {
  const out = renderMarkdown('**strong** and *em*\n')
  assert.match(out, /<strong>strong<\/strong> and <em>em<\/em>/)
})

test('renderMarkdown: http(s) images allowed, dangerous protocols dropped', () => {
  const out = renderMarkdown('![扫码加入反馈群](https://cdn.example.com/qr.png) ![x](javascript:alert(1))\n')
  assert.match(out, /<img src="https:\/\/cdn.example.com\/qr.png" alt="扫码加入反馈群" loading="lazy">/)
  assert.ok(!out.includes('<img src="javascript:'))
})

test('renderMarkdown: http(s) links allowed, others dropped', () => {
  const out = renderMarkdown('[site](https://dsh-plugin.org/) [bad](javascript:alert(1))\n')
  assert.match(out, /<a href="https:\/\/dsh-plugin.org\/" target="_blank" rel="noopener noreferrer">site<\/a>/)
  // 危险协议不生成 <a>：原文按纯文本保留（无注入），但不产生可点击链接
  assert.ok(!out.includes('<a href="javascript:'))
  assert.ok(out.includes('[bad](javascript:alert(1))'))
})

test('renderMarkdown: raw HTML is escaped, never passed through', () => {
  const out = renderMarkdown('<script>alert(1)</script>\n')
  assert.ok(!out.includes('<script>'))
  assert.match(out, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)
})

test('renderMarkdown: blockquote', () => {
  const out = renderMarkdown('> note line\n')
  assert.equal(out, '<blockquote>note line</blockquote>')
})

test('renderMarkdown: consecutive text lines form one paragraph', () => {
  const out = renderMarkdown('line one\nline two\n\nnext para\n')
  assert.equal(out, '<p>line one<br>line two</p><p>next para</p>')
})
