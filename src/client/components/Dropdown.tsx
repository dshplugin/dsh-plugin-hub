/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Custom dropdown (native <select> replacement).
 *
 * macOS/浏览器原生下拉无法跟随宿主主题，这里自绘：触发器按钮 + 绝对定位面板，
 * 点外部/Esc 关闭；选项 hover 加重底色、激活项深色实心高亮，全部走 --dsw-alias-* 主题变量。
 */
import { createElement as h, useEffect, useRef, useState } from 'react'
import type { JSX } from 'react'
import styles from '../styles/Dropdown.module.css'
import { ChevronDownIcon } from './icons.tsx'

export interface DropdownOption<T extends string> {
  value: T
  label: string
  /** 可选计数徽标（如「已安装 12」） */
  count?: number
}

interface DropdownProps<T extends string> {
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  title?: string
}

export function Dropdown<T extends string>({ value, options, onChange, title }: DropdownProps<T>): JSX.Element {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  // 面板展开时：点面板外部或按 Esc 关闭。
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = options.find((o) => o.value === value)

  return h('div', { className: styles.dropdown, ref: rootRef },
    h('button', {
      className: styles.dropdownBtn,
      type: 'button',
      title,
      'aria-haspopup': 'listbox',
      'aria-expanded': open,
      onClick: () => setOpen((v) => !v),
    },
      h('span', { className: styles.dropdownLabel }, current?.label ?? value),
      h('span', { className: open ? styles.dropdownArrowOpen : styles.dropdownArrow }, h(ChevronDownIcon)),
    ),
    open && h('div', { className: styles.dropdownPanel, role: 'listbox' },
      options.map((o) => h('button', {
        key: o.value,
        type: 'button',
        role: 'option',
        'aria-selected': o.value === value,
        className: o.value === value ? styles.dropdownItemActive : styles.dropdownItem,
        onClick: () => {
          onChange(o.value)
          setOpen(false)
        },
      },
        h('span', { className: styles.dropdownItemLabel }, o.label),
        typeof o.count === 'number'
          ? h('span', { className: o.value === value ? styles.dropdownCountActive : styles.dropdownCount }, o.count)
          : null,
      )),
    ),
  )
}
