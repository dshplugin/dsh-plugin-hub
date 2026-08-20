<div align="center">

<p>
  <img src="docs/logo.svg" alt="DSH-Plugin Hub" width="96" height="96" />
</p>

# DSH-Plugin Hub for DeepSeek Harness

**A community plugin marketplace for DeepSeek Harness · 4,261 DSH plugins indexed · 2,487 human-verified**

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/dshplugin/dsh-plugin-hub.svg?style=flat-square)](https://github.com/dshplugin/dsh-plugin-hub)
[![Website](https://img.shields.io/badge/website-dsh--plugin.org-blue.svg?style=flat-square)](https://dsh-plugin.org)
[![Topic](https://img.shields.io/badge/topic-dsh--plugin-0e7490.svg?style=flat-square)](https://github.com/topics/dsh-plugin)

[Website](https://dsh-plugin.org) · [Issues](https://github.com/dshplugin/dsh-plugin-hub/issues) · [Submit a Plugin](https://dsh-plugin.org/submit)

[简体中文](README.md) · **English**

</div>

---

## What is DSH-Plugin Hub

DSH-Plugin Hub is a **community plugin marketplace for DeepSeek Harness**: an open-source plugin built to the official plugin development spec. Installed under **Settings → Plugin Hub**, it lets you browse, search and install community plugins without leaving the app. This is an independent community project, not affiliated with DeepSeek Harness.

<p align="center">
  <img src="docs/screenshot-plugin-hub-en.png" alt="DSH-Plugin Hub inside DeepSeek Harness" width="840">
</p>

## Plugin Hub Features

- **Native integration** — lives inside Harness **Settings → Plugin Hub**, with a bilingual UI that follows your system language
- **Curated · updated daily** — indexes **4,261** community plugins, **2,487** of which are hand-verified, curated and released every day by [dsh-plugin.org](https://dsh-plugin.org)
- **Always in sync** — same data source as the website; the catalog updates automatically, no manual upgrade needed
- **One-click access** — open any plugin's detail page instantly; share and bookmark from your browser
- **Lightweight & private** — browser-side only, no host dependencies, no telemetry, no data collection

## Why DSH-Plugin Hub

The DSH-Plugin Hub indexes **4,261** DeepSeek Harness plugins (DSH), **2,487** of which are hand-verified — updated daily, browse, search, download and install for free by category, fully sourced.

### Always Fresh

Newly released DSH plugins are indexed as soon as possible; descriptions, categories and compatibility status of existing plugins are refreshed on a regular basis. We keep tracking the DeepSeek Harness ecosystem so you always see the latest information.

### Human-Verified

Every DSH plugin is manually checked by a professional team — install commands, compatibility status (verified / unconfirmed) and target DSH version (dshTarget) are verified one by one, with capability categories labeled. Quality is guaranteed.

### Fully Sourced

Every DSH plugin links back to its GitHub source repository with stars, forks and last-update time; data is compiled from the DeepSeek Harness official site, official architecture docs and official repos — everything is traceable.

## Install DSH-Plugin Hub

Local install:

```bash
dsh plugin --profile web add dsh-plugin-hub
```

Install from GitHub:

```bash
dsh plugin --profile web add github:dshplugin/dsh-plugin-hub
```

> **Note**: when installing from GitHub, if pnpm ≥ 10 skips the build script, add `dsh-plugin-hub` to `pnpm.onlyBuiltDependencies` (or use `--allow-build` temporarily) so the browser bundle gets built.

## Getting Started: browse & install in DeepSeek Harness

Restart `dsh web` after installing, then open **Settings → Plugin Hub** to browse and install plugins. The catalog is same-source and in sync with [dsh-plugin.org](https://dsh-plugin.org).

## Submit your DSH plugin

Publish your plugin to GitHub and add the `dsh-plugin` topic — it will be discovered and indexed automatically. Requirements and the submission flow are on the [Submit a Plugin](https://dsh-plugin.org/submit) page.

## Development

```bash
npm install
npm run check        # typecheck + build
npm run build        # build client/client.js (committed artifact)
npm run readme:stats # refresh README plugin counts from the live website API
```

Structure:

```
src/client/       browser-side plugin (registers the settings.section slot)
lib/index.js      host loader entry (placeholder)
client/client.js  tsdown build artifact (committed & published)
cordis.patch.yml  dsh bundle patch (injects the plugin line into profiles)
scripts/          tooling scripts
```

## Contributing

- **Add your plugin**: tag it with the `dsh-plugin` topic to be auto-discovered — start on the [Submit a Plugin](https://dsh-plugin.org/submit) page
- **Fix data / suggest features**: open an [Issue](https://github.com/dshplugin/dsh-plugin-hub/issues)
- **Contribute code**: fork the repo and send a Pull Request

## Related

- [dsh-plugin.org](https://dsh-plugin.org) — the plugin hub website, same data source
- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) — DeepSeek Harness itself

## License

[MIT](LICENSE) © DSH-Plugin Hub contributors
