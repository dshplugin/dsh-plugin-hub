/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Feedback loop for "queue disappears after refresh".
 * Simulates: enqueue install -> read /active (server truth) ->
 * "page reload" by re-fetching /active and asserting tasks still present.
 * Red when server returns empty while a mutation should still be active.
 */
import assert from 'node:assert/strict'

const BASE = process.env.DSH_BASE || 'http://127.0.0.1:7923'
const ORIGIN = BASE

async function j(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...(init.method === 'POST' ? { Origin: ORIGIN, 'content-type': 'application/json' } : {}),
    },
  })
  const text = await res.text()
  let body
  try { body = JSON.parse(text) } catch { body = text }
  return { status: res.status, body }
}

const repo = process.env.QUEUE_REPO || 'octocat/Spoon-Knife'
console.log('[loop] enqueue', repo)
const start = await j('/dsh-plugin-hub/install', { method: 'POST', body: JSON.stringify({ repo }) })
console.log('[loop] install =>', start.status, start.body)
assert.equal(start.status, 200, 'install should 200')
assert.equal(start.body.ok, true, 'install ok')
assert.equal(typeof start.body.task, 'number', 'task id')

const before = await j('/dsh-plugin-hub/active')
console.log('[loop] active before simulated reload =>', JSON.stringify(before.body))
assert.ok(Array.isArray(before.body.tasks), 'tasks array')
assert.ok(before.body.tasks.length >= 1, 'RED: queue empty immediately after enqueue (server lost task)')
assert.ok(before.body.tasks.some((t) => t.id === start.body.task), 'enqueued task missing from /active')

// Simulate page refresh: client state gone; only /active can restore UI.
await new Promise((r) => setTimeout(r, 200))
const after = await j('/dsh-plugin-hub/active')
console.log('[loop] active after simulated reload =>', JSON.stringify(after.body))
assert.ok(after.body.tasks.length >= 1, 'RED: after refresh /active is empty — UI would show no queue')
assert.ok(after.body.tasks.some((t) => t.id === start.body.task), 'RED: task vanished from /active after refresh window')

console.log('[loop] GREEN: server queue survives refresh window')

// cleanup
const cancel = await j('/dsh-plugin-hub/cancel', { method: 'POST', body: JSON.stringify({ id: start.body.task }) })
console.log('[loop] cancel =>', cancel.status, cancel.body)
