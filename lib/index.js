/**
 * dsh-plugin-hub host entry.
 *
 * The browser half (src/client) renders the DSH-Plugin Hub catalog inside
 * the Settings panel and fetches it live from dsh-plugin.org — no bundled
 * data, no local routes. This node half is intentionally a no-op.
 */
export const name = 'dsh-plugin-hub'

export function apply() {}
