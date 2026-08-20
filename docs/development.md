# Development

How to build, test and iterate on DSH-Plugin Hub locally.

## Prerequisites

- Node.js >= 22.6 (type stripping is used by the test runner).
- npm (lockfile is committed; keep it in sync when adding dependencies).
- A booted DeepSeek Harness to see the plugin in action.

## Commands

| Command                    | What it does                                    |
| -------------------------- | ----------------------------------------------- |
| `npm run build`            | compile server (`lib/`) + browser (`client/`)   |
| `npm run typecheck`        | type-check client, server and tests             |
| `npm test`                 | run unit tests (Node built-in runner)           |
| `npm run check`            | typecheck + test + build (same as CI)           |
| `npm run reload`           | restart the harness on port 7923                |
| `npm run readme:stats`     | refresh marketplace stats in the README         |
| `npm run verify:release`   | validate the package before publish             |

## Typical dev loop

The harness is a long-running process and loads the plugin bundle at
startup, so after every change:

```sh
npm run build && npm run reload
```

`reload` stops the running `dsh web` on port 7923, waits for the port to
release, and relaunches it detached. The development version is linked into
`~/.dsh/profiles/web/package.json` as a `file:` dependency.

## Testing

Tests live in `tests/` and target pure server logic — currently the
progress estimation helpers in `src/server/progress.ts`. They run with the
Node built-in test runner; no extra test framework is required.

```sh
npm test              # single run
npm run test:watch    # watch mode
```

When adding behaviour with clear inputs/outputs (parsing, validation,
estimation), add a test next to it.

## Releasing

1. Bump the version in `package.json` (and this project's `CHANGELOG.md`).
2. Run `npm run check` and `npm run verify:release`.
3. `npm publish` — `prepublishOnly` re-verifies and `prepack` rebuilds.

## Layout

```
src/server/    harness-side runtime + local HTTP API
src/client/    settings-page widget (browser bundle)
scripts/       helper scripts (reload, banner check, stats sync, release guard)
tests/         unit tests
docs/          architecture and development guides
```

See [architecture.md](architecture.md) for the full picture.
