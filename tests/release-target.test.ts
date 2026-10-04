import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer } from 'node:http'
import { githubReleaseTarget } from '../src/server/services/install/release-target.ts'
import { preflightTarget } from '../src/server/services/install/preflight.ts'
import { githubRepoOf } from '../src/server/services/profile/profile.ts'
import { installCommandOf, installTargetOf, repoFromInstallTarget } from '../src/client/logic/install-command.ts'
import { installedNameOf } from '../src/client/logic/installed.ts'
import { normalize } from '../src/client/logic/normalize.ts'
import { mountPluginHubRoutes, type WebRoute } from '../src/server/http/routes.ts'
import { saveSettings } from '../src/server/services/settings.ts'

const repo = 'acme/monorepo'
const artifact = `https://github.com/${repo}/releases/download/widget-v1.2.3/widget-1.2.3.tgz`
const command = `dsh plugin --profile web add ${artifact}`

test('catalog authoritative release command selects the prebuilt package, not repository HEAD', () => {
  const plugin = normalize({ s: 'widget', r: repo, igc: command })
  assert.deepEqual(installTargetOf(plugin), { target: artifact, via: 'release' })
  assert.equal(installCommandOf(plugin, true), command)
  assert.equal(installCommandOf(plugin), command)
  assert.deepEqual(githubReleaseTarget(`dsh plugin --profile=web add "${artifact}"`), { target: artifact, repo })
  assert.deepEqual(installTargetOf(normalize({ s: 'widget', r: { repo, npmPackage: 'widget' }, igc: command })),
    { target: 'widget', via: 'npm' })
})

test('catalog cannot redirect a listed repository to another author release', () => {
  const plugin = normalize({ s: 'widget', r: 'other/repo', igc: command })
  assert.deepEqual(installTargetOf(plugin), { target: 'other/repo', via: 'github' })
})

test('release grammar rejects shell code, other hosts, credentials, moving URLs and extra options', () => {
  for (const value of [
    artifact.replace('https:', 'http:'), artifact.replace('github.com', 'github.com.evil.example'),
    artifact.replace('github.com', 'user@github.com'), `${artifact}?download=1`, `${artifact}#fragment`,
    artifact.replace('/download/widget-v1.2.3/', '/latest/download/'), artifact.replace('.tgz', '.zip'),
    artifact.replace('/widget-v1.2.3/', '/../'), `${command} --ignore-scripts`, `${command}; echo injected`,
    `${command} && echo injected`, command.replace("web", "web;echo"), command.replace(" plugin ", "\nplugin "), `"${artifact}" extra`, artifact.replace('widget-v1.2.3', 'tag%2Fpart'),
  ]) assert.equal(githubReleaseTarget(value), null, value)
})

test('release identity supports installed readback, update matching and package-name removal', () => {
  assert.equal(githubRepoOf(artifact), repo)
  assert.equal(repoFromInstallTarget(artifact), repo)
  const plugin = normalize({ s: 'widget', r: repo, igc: command })
  assert.equal(installedNameOf(plugin, { widget: artifact }, {}), 'widget')
  assert.equal(installedNameOf(plugin, { widget: artifact.replace(repo, 'other/repo') }, {}), null)
})

test('release preflight never checks an unrelated monorepo root', async () => {
  assert.deepEqual(await preflightTarget(artifact), { ok: true, missing: null, name: null })
})

test('real HTTP admission preserves the GitHub security gate and release dedupe', async () => {
  const home = mkdtempSync(join(tmpdir(), 'hub-release-test-'))
  const previousHome = process.env.DSH_HOME
  process.env.DSH_HOME = home
  const routes = new Map<string, WebRoute>()
  const dispose = mountPluginHubRoutes({ register(route) { routes.set(route.path, route); return () => {} } }, 'web')
  const server = createServer((request, response) => {
    const route = routes.get(request.url ?? '')
    if (route) void route.handler(request, response)
    else { response.writeHead(404); response.end() }
  })
  try {
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
    const address = server.address()
    assert(address && typeof address !== 'string')
    const url = `http://127.0.0.1:${address.port}/dsh-plugin-hub/install`
    const post = (body: object) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    saveSettings('web', { enableGitInstall: false, enableNpmInstall: true })
    const denied = await post({ repo: artifact, source: 'custom' })
    assert.equal(denied.status, 403)
    assert.match(JSON.stringify(await denied.json()), /git installs are disabled/)
    assert.equal((await post({ repo: artifact.replace('github.com', 'evil.example'), source: 'catalog' })).status, 400)
    mkdirSync(join(home, 'profiles', 'web'), { recursive: true })
    writeFileSync(join(home, 'profiles', 'web', 'package.json'), JSON.stringify({ dependencies: { widget: artifact } }))
    const duplicate = await post({ repo: artifact, source: 'catalog', display: repo })
    assert.equal(duplicate.status, 409)
    assert.match(JSON.stringify(await duplicate.json()), /already installed: widget/)
  } finally {
    server.closeAllConnections()
    await new Promise<void>(resolve => server.close(() => resolve()))
    dispose()
    if (previousHome === undefined) delete process.env.DSH_HOME
    else process.env.DSH_HOME = previousHome
    rmSync(home, { recursive: true, force: true })
  }
})
