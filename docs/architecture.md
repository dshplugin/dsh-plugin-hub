# Architecture

DSH-Plugin Hub is a [cordis](https://github.com/cordiverse/cordis) plugin
for DeepSeek Harness. It ships two runtime artifacts:

| Artifact  | Source                | Build            | Output   |
| --------- | --------------------- | ---------------- | -------- |
| Server    | `src/server/`         | `tsc`            | `lib/`   |
| Browser   | `src/client/`         | `tsdown`         | `client/`|

The server runs inside the harness process and owns every side effect;
the browser bundle is a settings-page widget that talks to the server
over same-origin HTTP.

## Server (`src/server/`)

```
index.ts        cordis apply(): inject the host web server, mount routes
http/routes.ts  local HTTP API: /install /uninstall /status /installed /restart
services/install.ts   background task runner: spawns the official dsh CLI
services/progress.ts  pure helpers: cleanLine() + estimateProgress() (unit-tested)
```

- **`http/routes.ts`** validates every mutation (profile grammar, repo/package
  grammar, origin check, running-task mutex) before delegating to
  `services/install.ts`. `readInstalled()` lists non-official dependencies
  from the profile manifest.
- **`services/install.ts`** spawns `dsh plugin --profile <p> <add|remove>
  <target>` asynchronously. When the plugin runs inside a booted harness
  entry it reuses that entry (`process.argv[1]`) so the CLI works even if
  `dsh` is not on `PATH`. Every mutation becomes a tracked task: the caller
  gets an `id` immediately and polls `/status` for progress.
- **`services/progress.ts`** turns raw CLI fragments into clean lines and a
  0-100 estimate. pnpm refreshes its `Progress:` line in place with carriage
  returns, so fragments are split on both `\n` and `\r`, ANSI escapes are
  stripped, and the estimate is a floor the task never regresses below.

### Progress model

```
Progress: resolved N, reused X, downloaded Y, added Z   → (done/total), capped 90
dependencies: / Packages:                               → 92
Done in …                                              → 96
[exit 0]                                               → 100
```

Two fallbacks keep the bar honest when the CLI is quiet: each output line
advances the estimate up to 85%, and a 500 ms timer bumps it one point at
a time (capped at 85) so it never freezes on 0.

### Restart

`POST /restart` spawns a detached `/bin/sh -c` script that finds the
listener pid on the request port, sends `TERM`, waits for the port to free
up, then relaunches `dsh web` with `nohup`. The script survives the death
of the current harness process, so the host restarts itself cleanly.

## Browser client (`src/client/`)

```
index.tsx            thin entry: wires apply() → slots + locale
types.ts             shared client types
locales.ts           zh/en dictionaries
components/          PluginHubSection (state) · modals · ProgressView · icons
lib/                 catalog (API normalization) · format · markup (log colouring)
styles/              Section.module.css (hashed class map, injected <style>)
```

The bundle is emitted by tsdown with a `window.__ModuleLoader__.load`
wrapper (see `tsdown.config.ts`). CSS Modules are compiled inline via
lightningcss: importing `Section.module.css` yields the hashed class map
and auto-injects a `<style data-plugin-css>` tag. `react` and
`react/jsx-runtime` are resolved from the host loader at runtime.

### Install flow (end to end)

1. User clicks **Install** → `InstallModal` opens with command + progress.
2. `POST /dsh-plugin-hub/install {repo}` → server returns `{task}`.
3. The dialog polls `GET /status?task=<id>` every 600 ms; the terminal
   panel renders the newest lines, the bar renders `task.progress`.
4. On `done` the modal switches to a result view: **Restart now** calls
   `POST /restart` (the host auto-refreshes), **Later** just closes it.
