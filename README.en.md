<div align="center">

<p>
  <img src="docs/assets/logo.svg" alt="DSH Plugin Hub" width="96" height="96" />
</p>

# DSH Plugin Hub - Download & Install DeepSeek Harness Plugins

**8,000+ DeepSeek Harness (DSH) plugins indexed, 4,500+ hand-verified, in one community hub, updated daily. Browse, search, download and install by category — free, human-verified, traceable.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/v/dsh-plugin.svg?style=flat-square)](https://www.npmjs.com/package/dsh-plugin)
[![CI](https://github.com/dshplugin/dsh-plugin-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/dshplugin/dsh-plugin-hub/actions)
[![Listed on DSH Plugin Hub](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/dshplugin/dsh-plugin-hub)
[![GitHub stars](https://img.shields.io/github/stars/dshplugin/dsh-plugin-hub.svg?style=flat-square)](https://github.com/dshplugin/dsh-plugin-hub)
[![Website](https://img.shields.io/badge/website-dsh--plugin.org-blue.svg?style=flat-square)](https://dsh-plugin.org)
[![Topic](https://img.shields.io/badge/topic-dsh--plugin-0e7490.svg?style=flat-square)](https://github.com/topics/dsh-plugin)

[Website](https://dsh-plugin.org) · [Issues](https://github.com/dshplugin/dsh-plugin-hub/issues) · [Submit a Plugin](https://dsh-plugin.org/submit)

[简体中文](README.md) · **English**

</div>

---

## What is DSH Plugin Hub

DSH Plugin Hub is a **community plugin marketplace for DeepSeek Harness**: an open-source plugin built to the official plugin development spec. Installed under **Settings → Plugin Hub**, it lets you browse, search and install community plugins without leaving the app. This is an independent community project, not affiliated with DeepSeek Harness.

<p align="center">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-market-en.png" alt="DSH Plugin Hub plugin market UI" width="840">
</p>

## Plugin Hub Features

**One-click everything · fully visualized**

- **One-click install** — click and done: a serial background queue with live progress in the dialog, cancellable anytime; most plugins take effect on page refresh, no restart needed
- **One-click upgrade** — new versions are detected automatically; the card turns into "Update" and overwrite-installs in one click
- **One-click uninstall** — fully visualized with live progress; changes take effect immediately
- **Full trace** — every install / upgrade / uninstall, success or failure, is recorded in the notification center for later review

**Notification center**

- Live progress and cancel for running tasks, pending restarts, and full success / failure history in one place
- Failed installs can be filed as a GitHub Issue in one click; pending restarts offer "later" or "restart now"

**Rich catalog · human-curated**

- Indexes **8,197** community plugins, **4,585** of which are hand-verified, curated and released every day by [dsh-plugin.org](https://dsh-plugin.org)
- Covers UI & experience, sessions & messages, memory & context, tooling and more — browse by category or search straight to it
- Every plugin shows its verification status (verified), star / fork ratings, version and last-update time — fully sourced

**Bilingual · easy to filter**

- The UI follows your system language by default and switches manually anytime from the top-right; copy and plugin data switch together
- Sort by popularity / newest / earliest indexed, with bilingual descriptions and capability tags at a glance
- Filter by installed / not installed and search across names, descriptions and tags

**Always in sync · lightweight & private**

- Same data source as the website; the catalog updates automatically, no manual upgrade needed
- Browser-side only, no host dependencies, no telemetry, no data collection

## Join the User Group · Feedback

Questions, feature ideas or just want to talk plugins? Scan the QR code to join the DSH Plugin Hub user group — report issues, share suggestions, and improve the hub with the community. The QR code is refreshed periodically; this one is valid until 2026-09-02.

<p align="center">
  <img src="https://api.dsh-plugin.org/images/dsh-plugin-user-group-qr-2026-09-02.png?v=2" alt="DSH Plugin Hub user group QR code" width="250" height="250">
</p>

## Feature Highlights

**Installed plugins · Custom install**

<p align="center">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-installed-en.png" alt="Installed plugins" width="400">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-custom-install-en.png" alt="Custom install" width="400">
</p>

Manages every installed plugin with search, source filters and sorting, plus update / uninstall and reveal-in-Finder per row · Installs any plugin outside the catalog via three channels: npm package, GitHub source and DSH command

**Settings · System logs**

<p align="center">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-settings-en.png" alt="Settings" width="400">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-system-logs-en.png" alt="System logs" width="400">
</p>

Centralizes update checks, npm mirror, proxy channel, trust toggles and log location · Records install / uninstall / settings / diagnostics trails, filterable by category and level, with a built-in viewer

**Confirm install · Confirm uninstall**

<p align="center">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-install-confirm-en.png" alt="Confirm install" width="400">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-uninstall-confirm-en.png" alt="Confirm uninstall" width="400">
</p>

Shows the plugin, its source repo and the command before anything runs; the install starts only after confirmation · Shows what will be removed and its source; nothing is removed until the user confirms

**Confirm update · Notifications**

<p align="center">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-update-confirm-en.png" alt="Confirm update" width="400">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-notifications-en.png" alt="Notifications" width="400">
</p>

Pops up when a newer version is found; confirming overwrite-installs in place to the latest release · Gathers install / remove / update history, live task progress and pending-restart reminders in one place

## Website Overview

The hub's catalog is curated and published by [dsh-plugin.org](https://dsh-plugin.org) and stays in sync with the site; on the website you can also see plugin details, ratings and links back to their GitHub sources.

**Homepage · Browse by category**

<p align="center">
  <img src="docs/screenshots/dsh-plugin-hub-site-home.png" alt="DSH Plugin website homepage" width="400">
  <img src="docs/screenshots/dsh-plugin-hub-site-categories.png" alt="DSH Plugin category browsing" width="400">
</p>

Same data source as the hub — human-verified, updated daily · Browse every indexed plugin by category, search straight to it

## Why DSH Plugin Hub

The DSH Plugin Hub indexes **8,197** DeepSeek Harness plugins (DSH), **4,585** of which are hand-verified — updated daily, browse, search, download and install for free by category, fully sourced.

### Always Fresh

Newly released DSH plugins are indexed as soon as possible; descriptions, categories and compatibility status of existing plugins are refreshed on a regular basis. We keep tracking the DeepSeek Harness ecosystem so you always see the latest information.

### Human-Verified

Every DSH plugin is manually checked by a professional team — install commands, compatibility status (verified / unconfirmed) and target DSH version (dshTarget) are verified one by one, with capability categories labeled. Quality is guaranteed.

### Fully Sourced

Every DSH plugin links back to its GitHub source repository with stars, forks and last-update time; data is compiled from the DeepSeek Harness official site, official architecture docs and official repos — everything is traceable.

## Install DSH Plugin Hub

Install from npm (recommended):

```bash
dsh plugin --profile web add dsh-plugin
```

The plugin is published to the npm registry as `dsh-plugin` — one command installs and it just works, no build step required.

Install from GitHub:

```bash
dsh plugin --profile web add git+https://github.com/dshplugin/dsh-plugin-hub.git
```

> **Note**: the browser bundle ships with the package, so installing from GitHub needs no build step or authorization — just restart `dsh web` and open Settings → Plugin Hub.

## Update DSH Plugin Hub

The plugin hub notifies you when a new version is available; if an older build's in-panel updater cannot pull the latest release, upgrade from the command line:

**Option 1: update in place (recommended)**

```bash
dsh plugin --profile web update dsh-plugin
```

**Option 2: force upgrade (when an older build cannot update)**

If the old build's updater cannot pull the latest version, force-reinstall the newest release with an explicit version:

```bash
dsh plugin --profile web add dsh-plugin@latest
```

**Option 3: reinstall the latest (most reliable)**

`add` does not overwrite an already-installed copy, so removing first and re-adding always fetches the newest version:

```bash
dsh plugin --profile web remove dsh-plugin
dsh plugin --profile web add dsh-plugin
```

> Restart `dsh web` after updating for the changes to take effect.

## Getting Started: browse & install in DeepSeek Harness

Restart `dsh web` after installing, then open **Settings → Plugin Hub** to browse and install plugins. The catalog is same-source and in sync with [dsh-plugin.org](https://dsh-plugin.org).

## Submit your DSH plugin

Publish your plugin to GitHub and add the `dsh-plugin` topic — it will be discovered and indexed automatically. Requirements and the submission flow are on the [Submit a Plugin](https://dsh-plugin.org/submit) page.

## Contributing

- **Add your plugin**: tag it with the `dsh-plugin` topic to be auto-discovered — start on the [Submit a Plugin](https://dsh-plugin.org/submit) page
- **Fix data / suggest features**: open an [Issue](https://github.com/dshplugin/dsh-plugin-hub/issues)
- **Contribute code**: fork the repo and send a Pull Request

## Related

- [dsh-plugin.org](https://dsh-plugin.org) — the plugin hub website, same data source
- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) — DeepSeek Harness itself

## License

[MIT](LICENSE) © DSH Plugin Hub contributors
