/**
 * Line-level syntax coloring for the terminal-style output window shown
 * during install/remove. The server already strips source prefixes and ANSI
 * escapes, so lines arrive clean.
 */
import styles from '../styles/Section.module.css'

/** 命令行输出行着色：错误红 / 成功与进度绿 / 移除黄 / 其余浅灰，营造终端窗口高亮感。 */
export function logLineClass(line: string): string {
  const base = styles.logLine
  if (/^\[(?:err|error)\]|\[error\]|\[timed out\]|failed|ERR_/i.test(line)) return `${base} ${styles.logLineErr}`
  if (/^\[exit 0\]|^Done in|^Progress:|^dependencies:|^Packages:/i.test(line)) return `${base} ${styles.logLineOk}`
  if (/^-\s+/.test(line)) return `${base} ${styles.logLineWarn}`
  return `${base} ${styles.logLinePlain}`
}
