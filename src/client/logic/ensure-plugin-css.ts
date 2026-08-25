/**
 * Self-heal missing plugin CSS tags.
 *
 * CSS injection is a one-shot side effect of the bundle factory (guarded by
 * "tag already present"). When the host restarts the page survives, but the
 * host HMR chain may remove the <style data-plugin> tags while the in-memory
 * module cache still holds the old factory — so the factory never re-runs and
 * the styles never come back until some interaction triggers a reload.
 *
 * The tsdown `dsh-css-modules-inline` build plugin registers every module's
 * { tagId, css } into the global list `__DSH_PLUGIN_CSS__` at factory time.
 * This helper compares that list against the live DOM and re-injects any
 * missing tags, turning the "click around to fix it" self-heal into an
 * automatic one on mount / view switch.
 */

interface PluginCssEntry {
  tagId: string
  css: string
}

declare global {
  interface Window {
    __DSH_PLUGIN_CSS__?: PluginCssEntry[]
  }
}

/** Re-inject any registered stylesheet that is missing from the DOM. Idempotent. */
export function ensurePluginCss(): void {
  if (typeof document === 'undefined') return
  const registry = window.__DSH_PLUGIN_CSS__
  if (!registry || registry.length === 0) return
  for (const { tagId, css } of registry) {
    const selector = 'style[data-plugin-css=' + JSON.stringify(tagId) + ']'
    if (document.querySelector(selector) !== null) continue
    const tag = document.createElement('style')
    tag.dataset.plugin = 'dsh-plugin'
    tag.dataset.pluginCss = tagId
    tag.textContent = css
    document.head.appendChild(tag)
  }
}
