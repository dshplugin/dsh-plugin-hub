/**
 * 自动补回缺失的插件 CSS 标签。
 *
 * CSS 注入是 bundle 工厂的一次性副作用（以「标签已存在」为守卫）。宿主重启后页面仍在，
 * 但宿主 HMR 链可能移除 <style data-plugin> 标签，而内存模块缓存仍持有旧工厂，工厂不再
 * 重跑，样式就一直缺失，直到某次交互触发刷新才恢复。
 *
 * tsdown 的 `dsh-css-modules-inline` 构建插件会在工厂执行时把每个模块的 { tagId, css }
 * 登记进全局列表 `__DSH_PLUGIN_CSS__`。此工具随后比对列表与实时 DOM，补注入缺失的标签，
 * 把「点一圈才恢复」变成挂载 / 切换视图时自动完成。
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

/** 补注入 DOM 中缺失的已登记样式表，幂等。 */
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
