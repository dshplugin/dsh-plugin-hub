/**
 * Inline SVG icons used across the client. Icons inherit currentColor so
 * they adapt to themes and disabled states automatically.
 */
import { createElement as h } from 'react'
import styles from '../styles/Section.module.css'

/** 弹窗右上角关闭按钮图标：内联 SVG 十字（stroke 继承 currentColor），随按钮禁用态一起变淡。 */
export function CloseIcon() {
  return h('svg', {
    className: styles.modalCloseIcon,
    viewBox: '0 0 16 16',
    width: 14,
    height: 14,
    fill: 'none',
    'aria-hidden': 'true',
  }, h('path', {
    d: 'M3 3l10 10M13 3L3 13',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
  }))
}

/** 来源链接图标：链节（stroke 继承 currentColor），弹窗里官网收录地址旁提示「可点击跳转」。 */
export function LinkIcon() {
  return h('svg', {
    className: styles.linkIcon,
    viewBox: '0 0 24 24',
    width: 13,
    height: 13,
    fill: 'none',
    'aria-hidden': 'true',
  },
    h('path', {
      d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
      stroke: 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
    h('path', {
      d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
      stroke: 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }))
}

/** 品牌 logo 图标：蓝紫渐变圆角方块 + 白色拼图块（2x2 错落），标题左侧的品牌标识。 */
export function LogoIcon() {
  return h('svg', {
    className: styles.logoIcon,
    viewBox: '0 0 24 24',
    width: 20,
    height: 20,
    'aria-hidden': 'true',
  },
    h('defs', null,
      h('linearGradient', { id: 'dshLogoGrad', x1: '0', y1: '0', x2: '1', y2: '1' },
        h('stop', { offset: '0%', stopColor: '#4f46e5' }),
        h('stop', { offset: '100%', stopColor: '#7c3aed' }),
      ),
    ),
    h('rect', { x: 1, y: 1, width: 22, height: 22, rx: 6, fill: 'url(#dshLogoGrad)' }),
    h('rect', { x: 5.5, y: 5.5, width: 5.5, height: 5.5, rx: 1.5, fill: '#ffffff' }),
    h('rect', { x: 13, y: 5.5, width: 5.5, height: 5.5, rx: 1.5, fill: '#ffffff', opacity: 0.55 }),
    h('rect', { x: 5.5, y: 13, width: 5.5, height: 5.5, rx: 1.5, fill: '#ffffff', opacity: 0.55 }),
    h('rect', { x: 13, y: 13, width: 5.5, height: 5.5, rx: 1.5, fill: '#ffffff' }),
  )
}

/** 复制图标：双层矩形（stroke 继承 currentColor），手动命令旁的复制按钮用。 */
export function CopyIcon() {
  return h('svg', {
    className: styles.copyIcon,
    viewBox: '0 0 16 16',
    width: 12,
    height: 12,
    fill: 'none',
    'aria-hidden': 'true',
  },
    h('rect', {
      x: 5.5, y: 5.5, width: 7, height: 7, rx: 1.5,
      stroke: 'currentColor', strokeWidth: 1.4,
    }),
    h('path', {
      d: 'M10.5 5.5v-2a1.5 1.5 0 0 0-1.5-1.5H4.5A1.5 1.5 0 0 0 3 3.5v4A1.5 1.5 0 0 0 4.5 9h1',
      stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round',
    }),
  )
}
