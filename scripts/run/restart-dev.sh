#!/usr/bin/env bash
# Development restart for the local dsh web instance.
#
# Always stops whatever is currently running on the target port, then boots a
# fresh instance from the current build: build -> stop -> sync the plugin copy
# -> restart. The profile's node_modules/dsh-plugin copy is overwritten with
# the local build output (dev mode); use restart-prod.sh to run the official
# npm package instead.
#
# Usage:
#   ./scripts/run/restart-dev.sh              # build + stop + sync + restart (port 7923, profile web)
#   ./scripts/run/restart-dev.sh --skip-build   # reuse the current build output
#   ./scripts/run/restart-dev.sh --port=8080 --profile=dev
set -u

PORT=7923
PROFILE=web
SKIP_BUILD=0

# Directory of the dsh-plugin repo owning this script (used to detect a
# file: dependency on it from the profile, and to re-sync the copied build).
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROFILE_DIR="$HOME/.dsh/profiles/$PROFILE"
TARGET="$PROFILE_DIR/node_modules/dsh-plugin"
LOG_DIR="$HOME/.dsh/logs"
LOG_FILE="$LOG_DIR/dsh-web-${PORT}.log"

for arg in "$@"; do
  case "$arg" in
    --port=*) PORT="${arg#*=}" ;;
    --profile=*) PROFILE="${arg#*=}" ;;
    --skip-build) SKIP_BUILD=1 ;;
    *) echo "[restart-dev] unknown argument: $arg" >&2; exit 1 ;;
  esac
done

# The whole script exists to boot `dsh web`; fail early with a clear message
# instead of a confusing nohup failure at the end.
command -v dsh >/dev/null 2>&1 || {
  echo "[restart-dev] error: 'dsh' command not found in PATH — install the DeepSeek CLI first." >&2
  exit 1
}

mkdir -p "$LOG_DIR"

pids_on_port() {
  lsof -ti "tcp:$1" -sTCP:LISTEN 2>/dev/null || true
}

# ── step 1: build ─────────────────────────────────────────────────────────
# The plugin must reflect the current source. A reload that re-syncs stale
# build output either keeps serving old code or — after file moves/renames —
# crashes on boot with ERR_MODULE_NOT_FOUND. Build unless explicitly skipped.
build_plugin() {
  [[ "$SKIP_BUILD" -eq 1 ]] && { echo "[restart-dev] skipping build (--skip-build)"; return 0; }
  echo "[restart-dev] building plugin (server + client)…"
  (cd "$REPO_DIR" && npm run build:server && npm run build:client) \
    || { echo "[restart-dev] build failed — aborting" >&2; exit 1; }
  echo "[restart-dev] build done."
}

# ── helpers ───────────────────────────────────────────────────────────────
stop_existing() {
  local pids
  pids="$(pids_on_port "$PORT")"
  if [[ -z "$pids" ]]; then
    echo "[restart-dev] port $PORT is already free — nothing to stop."
    return
  fi
  echo "[restart-dev] stopping: ${pids//$'\n'/ } on port $PORT"
  # shellcheck disable=SC2086 # pids are trusted lsof output
  kill -TERM $pids 2>/dev/null || true
  for _ in $(seq 1 32); do # up to 8s
    [[ -z "$(pids_on_port "$PORT")" ]] && return
    sleep 0.25
  done
  echo "[restart-dev] still busy, forcing kill…"
  # shellcheck disable=SC2046 # single pid line expected
  kill -KILL $(pids_on_port "$PORT") 2>/dev/null || true
  for _ in $(seq 1 20); do # up to 5s
    [[ -z "$(pids_on_port "$PORT")" ]] && return
    sleep 0.25
  done
}

# The profile installs dsh-plugin either from a `file:` dep or as a real npm
# package; pnpm *copies* it into node_modules in both cases and does not
# refresh that copy after rebuilds — a stale lib/ makes the plugin fail to
# boot or keeps serving old code. Mirror the built artifacts over the copy so
# reloads always run the current build.
sync_profile_plugin() {
  local pkg="$PROFILE_DIR/package.json"
  [[ -f "$pkg" ]] || return 0
  local target="$TARGET"
  # 目标拷贝不存在时：只有 profile 依赖是 file: 指向本仓库才补装（pnpm 装出的拷贝
  # 随后被覆盖成最新构建）；npm 装的旧版连拷贝都缺失属异常，交给安装流程处理，
  # 这里不越界重装。拷贝存在（无论 file: 还是 npm 装）一律用本地构建覆盖。
  if [[ ! -d "$target" ]] && ! grep -q "dsh-plugin.*file:${REPO_DIR//\//\\/}" "$pkg" 2>/dev/null; then
    return 0
  fi
  echo "[restart-dev] syncing $PROFILE plugin copy from $REPO_DIR …"
  if [[ ! -d "$target" ]]; then
    echo "[restart-dev] plugin copy missing — reinstalling…"
    (cd "$PROFILE_DIR" && pnpm install --silent) || true
  fi
  if [[ ! -f "$REPO_DIR/lib/index.js" || ! -f "$REPO_DIR/client/client.js" ]]; then
    echo "[restart-dev] error: build output missing — run the build step first" >&2
    exit 1
  fi
  [[ -d "$target" ]] || { echo "[restart-dev] error: plugin copy still missing after install — aborting" >&2; exit 1; }
  # `rsync --delete` interrupted mid-flight leaves the plugin copy half-synced
  # (missing entry files → dsh web crashes on boot with ERR_MODULE_NOT_FOUND).
  # Any sync failure aborts immediately so the copy is never left incomplete.
  rsync -a --delete "$REPO_DIR/lib/" "$target/lib/" \
    || { echo "[restart-dev] error: failed to sync lib/ — plugin copy may be incomplete, aborting" >&2; exit 1; }
  rsync -a --delete "$REPO_DIR/client/" "$target/client/" \
    || { echo "[restart-dev] error: failed to sync client/ — aborting" >&2; exit 1; }
  # Copy package.json with rsync too: some shells alias `cp` to -n
  # (no-clobber), which exits non-zero on an identical existing target and
  # would wrongly abort the reload here.
  rsync -a "$REPO_DIR/package.json" "$target/package.json" \
    || { echo "[restart-dev] error: failed to copy package.json — aborting" >&2; exit 1; }
  echo "[restart-dev] plugin copy is up to date."
}

start_fresh() {
  nohup dsh web --port "$PORT" >>"$LOG_FILE" 2>&1 &
  local pid=$!
  echo "[restart-dev] starting dsh web (pid $pid) on port $PORT"
  for _ in $(seq 1 67); do # up to 20s
    if [[ -n "$(pids_on_port "$PORT")" ]]; then
      echo "[restart-dev] dsh web is up: http://localhost:$PORT"
      echo "[restart-dev] log: $LOG_FILE"
      # Quick HTTP health check. The listener can come up before the web app
      # is fully ready, so treat HTTP failures as a warning, not fatal.
      if command -v curl >/dev/null 2>&1; then
        curl -s -o /dev/null --max-time 15 "http://127.0.0.1:$PORT" \
          || echo "[restart-dev] warning: port is up but HTTP check failed — see $LOG_FILE" >&2
      fi
      return
    fi
    sleep 0.3
  done
  echo "[restart-dev] dsh web did not report a listener within 20s — tail of $LOG_FILE:" >&2
  tail -n 30 "$LOG_FILE" 2>/dev/null >&2 || true
  exit 1
}

full_reload() {
  stop_existing
  sync_profile_plugin
  start_fresh
}

# ── main ──────────────────────────────────────────────────────────────────
# Start always means stop-then-restart: the previous instance is shut down
# and a fresh one boots from the current build.
build_plugin
full_reload
