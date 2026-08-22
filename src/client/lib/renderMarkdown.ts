/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 轻量 Markdown 渲染器：仅用于 Hub 自我更新的变更记录（Worker 下发的 notes）。
 *
 * 内容由插件作者自己编写、属可信内容，但渲染端仍先整体 HTML 转义，再按
 * Markdown 语法输出结构，杜绝任何未转义的原始 HTML 注入；链接仅放行 http(s)。
 *
 * 支持：标题(#~####)、有序/无序列表、代码块(```)、行内代码、加粗、斜体、
 * 链接、图片(![alt](url)，如反馈群二维码)、引用(>)、段落；其余语法一律按
 * 纯文本处理，不引入外部依赖。图片仅放行 http(s)，限定最大宽度不撑破弹窗。
 */

/** HTML 转义：所有文本先进这里，再进入结构变换，保证输出里没有未转义的用户输入。 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** 行内变换：链接 / 加粗 / 斜体 / 行内代码（代码先占位保护，最后还原）。 */
function inline(s: string): string {
  let out = escapeHtml(s)
  // 行内代码先占位：避免其中的 * [ ] 被后续链接/加粗/斜体规则破坏
  const codeSpans: string[] = []
  out = out.replace(/`([^`]+)`/g, (_m, code) => {
    codeSpans.push(String(code))
    return `\u0000${codeSpans.length - 1}\u0000`
  })
  // 图片 ![alt](url)：仅放行 http(s)，用于展示反馈群二维码等；limited by CSS
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, url) =>
    /^https?:\/\//i.test(String(url)) && !/[\u0000]/.test(String(url))
      ? `<img src="${String(url)}" alt="${String(alt)}" loading="lazy">`
      : m,
  )
  // 链接 [text](url)：仅放行 http(s)，新窗口打开
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, url) =>
    /^https?:\/\//i.test(String(url)) && !/[\u0000]/.test(String(url))
      ? `<a href="${String(url)}" target="_blank" rel="noopener noreferrer">${String(text)}</a>`
      : m,
  )
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
  return out.replace(/\u0000(\d+)\u0000/g, (_m, idx) => `<code>${codeSpans[Number(idx)]}</code>`)
}

/** 把变更记录 Markdown 渲染为安全的 HTML 字符串（由弹窗用 dangerouslySetInnerHTML 注入）。 */
export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n?/g, '\n').split('\n')
  const blocks: string[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    // 围栏代码块
    if (/^\s*```/.test(line)) {
      const buf: string[] = []
      i++
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        buf.push(lines[i])
        i++
      }
      i++ // 跳过闭合围栏
      blocks.push(`<pre><code>${escapeHtml(buf.join('\n'))}</code></pre>`)
      continue
    }
    // 空行：段落分隔符
    if (line.trim() === '') {
      i++
      continue
    }
    // 标题：# 到 #### 映射为 h2~h5（弹窗标题用 modalTitle，不与其冲突）
    const heading = line.match(/^(#{1,4})\s+(.*)/)
    if (heading) {
      const level = heading[1].length + 1
      blocks.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      i++
      continue
    }
    // 有序 / 无序列表（连续收集为一个列表块）
    if (/^\s*[-*+]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line)
      const items: string[] = []
      while (i < lines.length && (/^\s*[-*+]\s+/.test(lines[i]) || /^\s*\d+[.)]\s+/.test(lines[i]))) {
        items.push(`<li>${inline(lines[i].replace(/^\s*[-*+]|\s*\d+[.)]\s*/, '').trim())}</li>`)
        i++
      }
      blocks.push(`<${ordered ? 'ol' : 'ul'}>${items.join('')}</${ordered ? 'ol' : 'ul'}>`)
      continue
    }
    // 引用
    if (/^\s*>\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buf.push(inline(lines[i].replace(/^\s*>\s?/, '')))
        i++
      }
      blocks.push(`<blockquote>${buf.join('<br>')}</blockquote>`)
      continue
    }
    // 普通段落：收集连续非空、非特殊开头的行
    const buf: string[] = []
    while (
      i < lines.length
      && lines[i].trim() !== ''
      && !/^\s*```/.test(lines[i])
      && !/^#{1,4}\s+/.test(lines[i])
      && !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i])
    ) {
      buf.push(inline(lines[i]))
      i++
    }
    blocks.push(`<p>${buf.join('<br>')}</p>`)
  }
  return blocks.join('')
}
