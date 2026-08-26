#!/usr/bin/env bash
# Production restart for the local dsh web instance.
#
# Always stops whatever is currently running on the target port, then boots a
# fresh instance. Unlike restart-dev.sh this does NOT overwrite the profile's
# node_modules/dsh-plugin with local build output — it runs the official npm
# package exactly as a normal user would.
#
# A sanity check guards the common footgun of launching a dev-mode profile
# "in production":
#   - file:/workspace:/link: dependency on this repo -> dev-only profile, warn
#   - installed copy version differs from the dependency spec
#                                        -> likely overwritten by a dev sync, warn
#
# Usage:
#   ./scripts/run/restart-prod.sh              # port 7923, profile web
#   ./scripts/run/restart-prod.sh --port=8080 --profile=dev
set -u

PORT=7923
PROFILE=web

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
PROFILE_DIR="$HOME/.dsh/profiles/$PROFILE"
LOG_DIR="$HOME/.dsh/logs"
LOG_FILE="$LOG_DIR/dsh-web-${PORT}.log"

for arg in "$@"; do
  case "$arg" in
    --port=*) PORT="${arg#*=}" ;;
    --profile=*) PROFILE="${arg#*=}" ;;
    *) echo "[restart-prod] unknown argument: $arg" >&2; exit 1 ;;
  esac
done

command -v dsh >/dev/null 2>&1 || {
  echo "[restart-prod] error: 'dsh' command not found in PATH — install the DeepSeek CLI first." >&2
  exit 1
}

mkdir -p "$LOG_DIR"

pids_on_port() {
  lsof -ti "tcp:$1" -sTCP:LISTEN 2>/dev/null || true
}

# A profile previously launched through restart-dev.sh has its
# node_modules/dsh-plugin copy overwritten by local build output; starting
# it "in production" would silently keep serving that dev build.
check_official() {
  [[ -f "$PROFILE_DIR/package.json" ]] || return 0
  PROFILE_DIR="$PROFILE_DIR" node -e '
    const fs = require("fs");
    const profile = process.env.PROFILE_DIR;
    const pkg = JSON.parse(fs.readFileSync(profile + "/package.json", "utf8"));
    const spec = (pkg.dependencies || {})["dsh-plugin"];
    if (!spec) return 0;
    if (/file:|workspace:|link:/.test(spec)) {
      console.log("[restart-prod] warning: dsh-plugin is a " + spec + " dependency — dev-only profile, the local repo copy will be used, not the official package.");
      return 0;
    }
    const pj = profile + "/node_modules/dsh-plugin/package.json";
    if (!fs.existsSync(pj)) {
      console.log("[restart-prod] warning: dsh-plugin is not installed — run `pnpm install` in the profile first.");
      return 0;
    }
    const want = (spec.match(/\d+\.\d+\.\d+/) || [])[0];
    const got = JSON.parse(fs.readFileSync(pj, "utf8")).version;
    if (want && got !== want) {
      console.log("[restart-prod] warning: dependency wants dsh-plugin@" + want + " but the installed copy is v" + got + " — it may have been overwritten by a dev sync; run `pnpm install` to restore the official package.");
    }
  '
}

# ── helpers ───────────────────────────────────────────────────────────────
# Stop whatever is listening on the target port, then any lingering
# `dsh web` process started for that port (same detection as before).
stop_existing() {
  local pids
  pids="$(pids_on_port "$PORT")"
  if [[ -z "$pids" ]]; then
    echo "[restart-prod] port $PORT is already free — nothing to stop."
    return
  fi
  echo "[restart-prod] stopping: ${pids//$'\n'/ } on port $PORT"
  # shellcheck disable=SC2086 # pids are trusted lsof output
  kill -TERM $pids 2>/dev/null || true
  for _ in $(seq 1 32); do # up to 8s
    [[ -z "$(pids_on_port "$PORT")" ]] && return
    sleep 0.25
  done
  echo "[restart-prod] still busy, forcing kill…"
  # shellcheck disable=SC2046 # single pid line expected
  kill -KILL $(pids_on_port "$PORT") 2>/dev/null || true
  for _ in $(seq 1 20); do # up to 5s
    [[ -z "$(pids_on_port "$PORT")" ]] && return
    sleep 0.25
  done
  echo "[restart-prod] error: port $PORT still busy — kill the process manually." >&2
}

# ── stop whatever is listening, then boot the official package ───────────
echo "[restart-prod] stopping any existing instance on port ${PORT}…"
stop_existing

check_official

nohup dsh web --port "$PORT" >>"$LOG_FILE" 2>&1 &
pid=$!
echo "[restart-prod] starting dsh web (pid $pid) on port $PORT"
for _ in $(seq 1 67); do # up to 20s
  if [[ -n "$(pids_on_port "$PORT")" ]]; then
    echo "[restart-prod] dsh web is up: http://localhost:$PORT"
    echo "[restart-prod] log: $LOG_FILE"
    # Quick HTTP health check. The listener can come up before the web app
    # is fully ready, so treat HTTP failures as a warning, not fatal.
    if command -v curl >/dev/null 2>&1; then
      curl -s -o /dev/null --max-time 15 "http://127.0.0.1:$PORT" \
        || echo "[restart-prod] warning: port is up but HTTP check failed — see $LOG_FILE" >&2
    fi
    exit 0
  fi
  sleep 0.3
done
echo "[restart-prod] dsh web did not report a listener within 20s — tail of $LOG_FILE:" >&2
tail -n 30 "$LOG_FILE" 2>/dev/null >&2 || true
exit 1
