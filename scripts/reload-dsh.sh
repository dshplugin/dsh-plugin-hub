#!/usr/bin/env bash
# One-shot reload for the local dsh web instance.
#
# Stops whatever is currently listening on the target port, then boots a
# fresh `dsh web` in the background with its output redirected to a log
# file — the same effect as a manual stop + start.
#
# Usage:
#   ./scripts/reload-dsh.sh                # port 7923, profile web
#   ./scripts/reload-dsh.sh --port=8080    # custom port
set -u

PORT=7923
PROFILE=web

for arg in "$@"; do
  case "$arg" in
    --port=*) PORT="${arg#*=}" ;;
    --profile=*) PROFILE="${arg#*=}" ;;
    *) echo "[reload] unknown argument: $arg" >&2; exit 1 ;;
  esac
done

LOG_DIR="$HOME/.dsh/logs"
LOG_FILE="$LOG_DIR/dsh-web-${PORT}.log"
mkdir -p "$LOG_DIR"

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

start_fresh() {
  nohup dsh web --port "$PORT" >>"$LOG_FILE" 2>&1 &
  local pid=$!
  echo "[reload] starting dsh web (pid $pid) on port $PORT"
  for _ in $(seq 1 67); do # up to 20s
    if [[ -n "$(pids_on_port "$PORT")" ]]; then
      echo "[reload] dsh web is up: http://localhost:$PORT"
      echo "[reload] log: $LOG_FILE"
      return
    fi
    sleep 0.3
  done
  echo "[reload] dsh web did not report a listener within 20s — see $LOG_FILE" >&2
}

stop_existing
start_fresh
