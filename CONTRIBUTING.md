# Contributing

Thanks for taking the time to contribute to DSH-Plugin Hub. This document
keeps the bar high so the marketplace stays safe and pleasant for everyone.

## Development setup

```sh
npm ci
npm run check        # typecheck + test + build, run this before opening a PR
```

- Node.js >= 22.6 (type stripping) is required for `npm test`.
- The harness must be restarted to pick up client changes:
  `npm run reload` (or `bash scripts/reload-dsh.sh`).

## How the project is organised

See [docs/architecture.md](docs/architecture.md) for the layering, and
[docs/development.md](docs/development.md) for the day-to-day workflow.

## Committing

- Commit messages are English, written as formal and concise as a release
  note. State the direction of the change, not its internals.
- Follow the conventional prefixes: `feat:`, `fix:`, `refactor:`,
  `docs:`, `chore:`, `build:`, `test:`.

## Opening a pull request

1. Fork the repository and create a branch from `main`.
2. Make your change; keep it focused and single-responsibility.
3. Add tests where behaviour is pure logic (progress estimation, validation).
4. Run `npm run check` locally — CI runs the same suite.
5. Open the PR with a short summary of what changed and why.

## Reporting bugs

Open an issue with:

- the harness version and the profile used,
- the exact steps that trigger the problem,
- a screenshot of the dialog if the issue is visual.
