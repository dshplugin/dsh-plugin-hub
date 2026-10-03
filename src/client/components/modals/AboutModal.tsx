/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 头部「关注我们」弹窗：介绍 DSH Plugin Hub 的功能定位 + 用户反馈群二维码。
 * 内容以 Markdown 形式由 dsh-update Worker 的 /about 接口下发（key = hub:about），
 * 客户端按接口返回渲染，不内置固定文案。
 * 图片（反馈群二维码）经 renderMarkdown 的 ![](url) 语法嵌入，居中、最大高度受控。
 */
import { createElement as h, useMemo } from 'react'
import type { MouseEvent } from 'react'
import styles from '../../styles/Modal.module.css'
import type { HubAboutInfo } from '../../types.ts'
import type { LocaleId, Translate } from '../../types.ts'
import { renderMarkdown } from '../../logic/renderMarkdown.ts'
import { CloseIcon } from '../ui/icons.tsx'

/**
 * 反馈群二维码 URL 恒定（每次换码都是同名覆盖，文件名不变），浏览器 / CDN 会按
 * URL 缓存旧图。这里在渲染前给二维码 URL 实时拼一个新的时间戳，强制每次打开
 * 「关注我们」都回源拉取最新图片，无需重新构建 / 部署接口中心。
 * 匹配规则与 renderMarkdown 的二维码识别保持一致（dsh-plugin-user-group-qr 前缀）。
 */
function bustQrCache(md: string, ts: number): string {
  return md.replace(
    /(!\[[^\]]*\]\()([^)\s]*dsh-plugin-user-group-qr[^)\s]*)/g,
    (_m, pre, url) => `${pre}${String(url).split('?')[0]}?v=${ts}`,
  )
}

export function AboutModal({ info, lang, t, onClose }: {
  info: HubAboutInfo | null
  lang: LocaleId
  t: Translate
  onClose: () => void
}) {
  // 内容：字符串直接使用；{zh,en} 对象按界面语言取，缺哪种补哪种，全缺则展示兜底文案。
  // Worker 未推送（info 为 null / content 为空）时弹窗仍能打开，显示「暂未发布」而非报错。
  const contentRaw = info
    ? typeof info.content === 'string'
      ? info.content
      : info.content && typeof info.content === 'object'
        ? lang === 'en'
          ? (info.content.en ?? info.content.zh ?? '')
          : (info.content.zh ?? info.content.en ?? '')
        : ''
    : ''
  // 每次打开弹窗（组件重新挂载）生成一个时间戳，用于二维码破缓存；
  // 同一次打开内保持稳定，避免父组件重渲染导致图片被反复重载。
  const qrTs = useMemo(() => Date.now(), [])
  const contentHtml = contentRaw.trim() ? renderMarkdown(bustQrCache(contentRaw, qrTs)) : null
  // 更新时间：ISO 字符串转本地可读格式；非法值静默隐藏
  let updated: string | null = null
  if (info?.updatedAt) {
    const d = new Date(info.updatedAt)
    if (!Number.isNaN(d.getTime())) {
      updated = d.toLocaleString(lang === 'en' ? 'en-US' : 'zh-CN')
    }
  }

  return h('div', {
    className: styles.overlay,
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
  },
    h('div', { className: `${styles.modal} ${styles.aboutModal}`, role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: styles.modalHead },
        h('div', { className: styles.modalTitle }, t('aboutTitle')),
        h('button', {
          className: styles.modalClose,
          'aria-label': t('confirmCancel'),
          onClick: () => onClose(),
        }, h(CloseIcon)),
      ),
      h('div', { className: styles.modalDesc }, t('aboutDesc')),
      contentHtml
        ? h('div', {
          className: styles.aboutContent,
          dangerouslySetInnerHTML: { __html: contentHtml },
        })
        : h('div', { className: styles.aboutContent }, t('aboutEmpty')),
      updated
        ? h('div', { className: styles.aboutMeta }, `${t('aboutUpdated')} ${updated}`)
        : null,
      h('div', { className: styles.modalActions },
        h('button', { className: styles.modalInstall, onClick: onClose }, t('doneBtn')),
      ),
    ),
  )
}
