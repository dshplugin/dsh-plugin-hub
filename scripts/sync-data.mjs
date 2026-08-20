/**
 * Refresh the bundled catalog snapshots from the dsh-plugin site repo.
 *
 * Copies src/data/plugins.{zh,en}.json (the directory slim projections the
 * /plugins page uses) into data/. Point DSH_PLUGIN_SITE at a checkout when
 * it does not live next to this repo.
 *
 *   npm run sync:data
 */
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const siteRoot = process.env.DSH_PLUGIN_SITE ?? join(root, '../dsh-plugin')
const out = join(root, 'data')
mkdirSync(out, { recursive: true })

const pairs = [
  ['plugins.zh.json', 'plugins.zh.json'],
  ['plugins.en.json', 'plugins.en.json'],
]

for (const [src, dst] of pairs) {
  const source = join(siteRoot, 'src/data', src)
  const target = join(out, dst)
  copyFileSync(source, target)
  console.log(`synced ${dst} <- ${source}`)
}
console.log('done — data snapshots refreshed')
