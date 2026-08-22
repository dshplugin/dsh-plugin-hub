/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Inline SVG icons used across the client. Icons inherit currentColor so
 * they adapt to themes and disabled states automatically.
 */
import { createElement as h } from 'react'
import headerStyles from '../styles/Header.module.css'
import modalStyles from '../styles/Modal.module.css'

/** 弹窗右上角关闭按钮图标：内联 SVG 十字（stroke 继承 currentColor），随按钮禁用态一起变淡。 */
export function CloseIcon() {
  return h('svg', {
    className: modalStyles.modalCloseIcon,
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
    className: modalStyles.linkIcon,
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
    className: headerStyles.logoIcon,
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

/** GitHub 图标：官方 GitHub Mark（octocat），fill 继承 currentColor，头部右上角源码链接用。 */
export function GitHubIcon() {
  return h('svg', {
    className: headerStyles.githubIcon,
    viewBox: '0 0 24 24',
    width: 18,
    height: 18,
    fill: 'currentColor',
    'aria-hidden': 'true',
  }, h('path', {
    d: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  }))
}

/** 复制图标：双层矩形（stroke 继承 currentColor），手动命令旁的复制按钮用。 */
export function CopyIcon() {
  return h('svg', {
    className: headerStyles.copyIcon,
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

/** 下拉箭头图标：向下 V 形（stroke 继承 currentColor），下拉框触发器右侧提示可展开。 */
export function ChevronDownIcon() {
  return h('svg', {
    viewBox: '0 0 16 16',
    width: 12,
    height: 12,
    fill: 'none',
    'aria-hidden': 'true',
  }, h('path', {
    d: 'M3.5 5.5L8 10l4.5-4.5',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }))
}
