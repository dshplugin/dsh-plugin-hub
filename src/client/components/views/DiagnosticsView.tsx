/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * System diagnostics list: one row per connectivity channel (npm registry /
 * GitHub API / catalog site), each with a live status badge — 200 OK in
 * green, Unreachable in red, Checking… while probing. The list runs
 * automatically when the page opens; every row is a button that re-probes
 * just that channel, so a click always yields visible feedback
 * (row pulses → badge flips → latency refreshes).
 */
import { createElement as h, useCallback, useEffect, useRef, useState } from 'react'
import styles from '../../styles/DiagnosticsView.module.css'
import type { EnvInfo, Translate } from '../../types.ts'
import { PLUGIN_VERSION } from '../../logic/constants.ts'

type ProbeKey = 'npm' | 'github' | 'catalog'

/** 系统版本文本：提交 Issue 时粘贴到正文，方便作者复现。 */
function formatEnv(env: EnvInfo): string {
  return [
    `DSH-Plugin Hub ${PLUGIN_VERSION}`,
    `DSH ${env.dshVersion ?? 'unknown'}`,
    `Node ${env.nodeVersion}`,
    `${env.platform} ${env.arch} (${env.release})`,
    `Profile ${env.profile}`,
    env.dshHome ? `Home ${env.dshHome}` : '',
  ].filter(Boolean).join('\n')
}

interface RowState {
  key: ProbeKey
  /** 目标地址展示（registry 地址 / github.com / dsh-plugin.org） */
  display: string
  nameKey: string
  status: 'idle' | 'running' | 'ok' | 'fail'
  ms: number | null
  statusCode: number | null
}

const INITIAL_ROWS: RowState[] = [
  { key: 'npm', display: 'registry.npmjs.org', nameKey: 'diagNpm', status: 'idle', ms: null, statusCode: null },
  { key: 'github', display: 'github.com', nameKey: 'diagGithub', status: 'idle', ms: null, statusCode: null },
  { key: 'catalog', display: 'dsh-plugin.org', nameKey: 'diagCatalog', status: 'idle', ms: null, statusCode: null },
]

export function DiagnosticsView({ t, env, onCopy }: {
  t: Translate
  env: EnvInfo | null
  onCopy: (text: string) => void
}) {
  const [rows, setRows] = useState<RowState[]>(INITIAL_ROWS)
  /** 当前探测请求：重测/卸载时 abort 旧请求，避免乱序结果覆盖 */
  const runningRef = useRef<AbortController | null>(null)

  const patchRows = (key: ProbeKey | undefined, patch: Partial<RowState>) => {
    setRows((prev) => prev.map((r) => (key === undefined || r.key === key ? { ...r, ...patch } : r)))
  }

  /** 探测：key 缺省 = 全量串行；传 key = 只重测该通道 */
  const run = useCallback((key?: ProbeKey) => {
    runningRef.current?.abort()
    const controller = new AbortController()
    runningRef.current = controller
    patchRows(key, { status: 'running', ms: null, statusCode: null })

    void (async () => {
      try {
        const res = await fetch('/dsh-plugin-hub/diagnostics', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: key === undefined ? '{}' : JSON.stringify({ key }),
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!res.ok || res.body === null) throw new Error(`http ${res.status}`)
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buf = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buf += decoder.decode(value, { stream: true })
          let nl = buf.indexOf('\n')
          while (nl !== -1) {
            const raw = buf.slice(0, nl).trim()
            buf = buf.slice(nl + 1)
            if (raw !== '') {
              const ev = JSON.parse(raw) as { type?: string; key?: string; ms?: number | null; status?: number | null }
              if (ev.type === 'ok' || ev.type === 'fail') {
                patchRows(ev.key as ProbeKey, {
                  status: ev.type === 'ok' ? 'ok' : 'fail',
                  ms: typeof ev.ms === 'number' ? ev.ms : null,
                  statusCode: typeof ev.status === 'number' ? ev.status : null,
                })
              }
            }
            nl = buf.indexOf('\n')
          }
        }
      } catch {
        // 连接本地服务失败：该项标记失败（被新请求 abort 的旧请求直接忽略）
        if (controller.signal.aborted) return
        patchRows(key, { status: 'fail', ms: null, statusCode: null })
      }
    })()
  }, [])

  // 进入页面自动全量探测一轮；卸载时中断
  useEffect(() => {
    run()
    return () => runningRef.current?.abort()
  }, [run])

  const anyRunning = rows.some((r) => r.status === 'running')
  const allOk = !anyRunning && rows.every((r) => r.status === 'ok')
  const anyFail = !anyRunning && rows.some((r) => r.status === 'fail')

  return h('div', { className: styles.panel },
    // 最顶部：系统版本 —— 复制当前宿主版本与系统信息，提 Issue 时粘贴到正文便于复现
    h('div', { className: styles.envRow },
      h('div', { className: styles.envLabel },
        h('div', { className: styles.envTitle }, t('settingsEnvSnapshot')),
        h('div', { className: styles.envDesc }, t('settingsEnvSnapshotDesc')),
      ),
      h('button', {
        type: 'button',
        className: styles.envCopyBtn,
        disabled: env === null,
        onClick: () => { if (env) onCopy(formatEnv(env)) },
      }, t('settingsEnvCopy')),
    ),
    // 头部：右侧「立即诊断」按钮，点击全量重测所有通道
    h('div', { className: styles.head },
      h('span', { className: styles.headHint }, t('diagHeadHint', { n: rows.length })),
      h('button', {
        type: 'button',
        className: styles.runBtn,
        disabled: anyRunning,
        onClick: () => run(),
      }, t('diagRunAll')),
    ),
    rows.map((r) => {
      const badge = r.status === 'running'
        ? h('span', { className: `${styles.badge} ${styles.badgeRunning}` }, t('diagChecking'))
        : r.status === 'ok'
          ? h('span', { className: `${styles.badge} ${styles.badgeOk}` },
            r.statusCode !== null ? `HTTP ${r.statusCode} ${t('diagOk')}` : t('diagOk'))
          : r.status === 'fail'
            ? h('span', { className: `${styles.badge} ${styles.badgeFail}` }, t('settingsDiagFail'))
            : h('span', { className: `${styles.badge} ${styles.badgeIdle}` }, t('diagIdle'))
      return h('button', {
        key: r.key,
        type: 'button',
        className: styles.row,
        disabled: r.status === 'running',
        onClick: () => run(r.key),
        title: t('diagRecheck'),
      },
        h('span', { className: styles.name }, t(r.nameKey)),
        h('span', { className: styles.display }, r.display),
        h('span', { className: styles.meta }, r.status === 'ok' && r.ms !== null ? `${r.ms} ms` : ''),
        badge,
      )
    }),
    // 底部总览：全部通过 / 存在异常 / 检测中，汇总整体状态
    h('div', {
      className: `${styles.summary} ${anyRunning ? styles.summaryRunning : allOk ? styles.summaryOk : styles.summaryFail}`,
    }, anyRunning ? t('diagSummaryRunning') : allOk ? t('diagSummaryOk') : t('diagSummaryFail')),
  )
}
