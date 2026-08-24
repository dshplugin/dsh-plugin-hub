/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Compact switch used by the settings rows. Native-button based so it is
 * keyboard focusable and announces state via aria-checked; styling driven
 * by the --hub-* tokens (on = brand fill, off = neutral track).
 */
import { createElement as h } from 'react'
import styles from '../../styles/Toggle.module.css'

export function Toggle({ checked, onChange, title, disabled }: {
  checked: boolean
  onChange: (next: boolean) => void
  title?: string
  disabled?: boolean
}) {
  return h('button', {
    type: 'button',
    role: 'switch',
    'aria-checked': checked,
    disabled,
    title,
    className: checked ? styles.toggleOn : styles.toggle,
    onClick: () => onChange(!checked),
  }, h('span', { className: styles.knob }))
}
