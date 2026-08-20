# Changelog

All notable changes to **dsh-plugin** are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Unit tests for the install progress estimation helpers (`node --test`).
- CI workflow running typecheck, tests and build on push/PR.

### Fixed
- Progress parsing now reads pnpm `Progress:` lines correctly (label-first
  tokens), so the resolved phase estimates a real percentage instead of
  relying on the fallback timers alone.

## [0.1.1] - 2026-07

### Added
- Install plugins directly from the hub with live progress, in a
  terminal-style output panel.
- Uninstall flow for already-installed plugins, with progress and restart
  guidance.
- One-click restart of the harness from the install/uninstall result dialog.
- "View details" action always available, linking to the marketplace site.

### Changed
- Refactored the client into single-responsibility modules.
- Progress fallbacks keep the bar moving even when the CLI stays quiet.

## [0.1.0] - 2026-06

### Added
- Launch of DSH-Plugin Hub: a community plugin marketplace for DeepSeek
  Harness, built to the official plugin spec.
- Browse and search 4000+ community plugins, sourced from live data.
- Copy-to-clipboard install command with a source-trust confirmation step.

[Unreleased]: https://github.com/dshplugin/dsh-plugin-hub/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/dshplugin/dsh-plugin-hub/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/dshplugin/dsh-plugin-hub/releases/tag/v0.1.0
