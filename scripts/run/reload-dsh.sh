#!/usr/bin/env bash
# One-shot reload for the local dsh web instance.
#
# Rebuilds the plugin (unless skipped), stops whatever is currently
# listening on the target port, re-syncs the profile's plugin copy, then
# boots a fresh `dsh web` in the background with its output redirected to
# a log file — the same effect as a manual stop + start.
#
# Usage:
#   ./scripts/run/reload-dsh.sh                # build + sync + restart (port 7923, profile web)
#   ./scripts/run/reload-dsh.sh --skip-build   # reuse the current build output
#   ./scripts/run/reload-dsh.sh --port=8080 --profile=dev
set -u

PORT=7923
PROFILE=web
SKIP_BUILD=0

# Directory of the dsh-plugin repo owning this script (used to detect a
# file: dependency on it from the profile, and to re-sync the copied build).
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROFILE_DIR="$HOME/.dsh/profiles/$PROFILE"

for arg in "$@"; do
  case "$arg" in
    --port=*) PORT="${arg#*=}" ;;
    --profile=*) PROFILE="${arg#*=}" ;;
    --skip-build) SKIP_BUILD=1 ;;
    *) echo "[reload] unknown argument: $arg" >&2; exit 1 ;;
  esac
done

LOG_DIR="$HOME/.dsh/logs"
LOG_FILE="$LOG_DIR/dsh-web-${PORT}.log"
mkdir -p "$LOG_DIR"

# ── step 1: build ─────────────────────────────────────────────────────────
# The plugin must reflect the current source. A reload that re-syncs stale
# build output either keeps serving old code or — after file moves/renames —
# crashes on boot with ERR_MODULE_NOT_FOUND. Build unless explicitly skipped.
build_plugin() {
  [[ "$SKIP_BUILD" -eq 1 ]] && { echo "[reload] skipping build (--skip-build)"; return 0; }
  echo "[reload] building plugin (server + client)…"
  (cd "$REPO_DIR" && npm run build:server && npm run build:client) \
    || { echo "[reload] build failed — aborting" >&2; exit 1; }
  echo "[reload] build done."
}

# ── helpers ───────────────────────────────────────────────────────────────
pids_on_port() {
  lsof -ti "tcp:$1" -sTCP:LISTEN 2>/dev/null || true
}

stop_existing() {
  local pids
  pids="$(pids_on_port "$PORT")"
  if [[ -z "$pids" ]]; then
    echo "[reload] port $PORT is already free — nothing to stop."
    return
  fi
  echo "[reload] stopping: $pids on port $PORT"
  # shellcheck disable=SC2086 # pids are trusted lsof output
  kill -TERM $pids 2>/dev/null || true
  for _ in $(seq 1 32); do # up to 8s
    [[ -z "$(pids_on_port "$PORT")" ]] && return
    sleep 0.25
  done
  echo "[reload] still busy, forcing kill…"
  # shellcheck disable=SC2046 # single pid line expected
  kill -KILL $(pids_on_port "$PORT") 2>/dev/null || true
  for _ in $(seq 1 20); do # up to 5s
    [[ -z "$(pids_on_port "$PORT")" ]] && return
    sleep 0.25
  done
}

# The profile installs dsh-plugin from a `file:` dep, but pnpm (hoisted
# linker) *copies* it into node_modules and does not refresh that copy
# after rebuilds — a stale lib/ makes the plugin fail to boot. Mirror the
# built artifacts over the copy so reloads always run the current build.
# Set DSH_RELOAD_SKIP_SYNC=1 to skip.
sync_profile_plugin() {
  [[ -n "${DSH_RELOAD_SKIP_SYNC:-}" ]] && return 0
  local pkg="$PROFILE_DIR/package.json"
  [[ -f "$pkg" ]] || return 0
  grep -q "dsh-plugin.*file:${REPO_DIR//\//\\/}" "$pkg" 2>/dev/null || return 0
  local target="$PROFILE_DIR/node_modules/dsh-plugin"
  echo "[reload] syncing $PROFILE plugin copy from $REPO_DIR …"
  if [[ ! -d "$target" ]]; then
    echo "[reload] plugin copy missing — reinstalling…"
    (cd "$PROFILE_DIR" && pnpm install --silent) || true
  fi
  if [[ ! -f "$REPO_DIR/lib/index.js" || ! -f "$REPO_DIR/client/client.js" ]]; then
    echo "[reload] error: build output missing — run the build step first" >&2
    exit 1
  fi
  [[ -d "$target" ]] || { echo "[reload] error: plugin copy still missing after install — aborting" >&2; exit 1; }
  rsync -a --delete "$REPO_DIR/lib/" "$target/lib/"
  rsync -a --delete "$REPO_DIR/client/" "$target/client/"
  cp -f "$REPO_DIR/package.json" "$target/package.json"
  echo "[reload] plugin copy is up to date."
}

start_fresh() {
  nohup dsh web --port "$PORT" >>"$LOG_FILE" 2>&1 &
  local pid=$!
  echo "[reload] starting dsh web (pid $pid) on port $PORT"
  for _ in $(seq 1 67); do # up to 20s
    if [[ -n "$(pids_on_port "$PORT")" ]]; then
      echo "[reload] dsh web is up: http://localhost:$PORT"
      echo "[reload] log: $LOG_FILE"
      # Quick HTTP health check. The listener can come up before the web app
      # is fully ready, so treat HTTP failures as a warning, not fatal.
      if command -v curl >/dev/null 2>&1; then
        curl -s -o /dev/null --max-time 15 "http://127.0.0.1:$PORT" \
          || echo "[reload] warning: port is up but HTTP check failed — see $LOG_FILE" >&2
      fi
      return
    fi
    sleep 0.3
  done
  echo "[reload] dsh web did not report a listener within 20s — tail of $LOG_FILE:" >&2
  tail -n 30 "$LOG_FILE" 2>/dev/null >&2 || true
  exit 1
}

build_plugin
stop_existing
sync_profile_plugin
start_fresh
