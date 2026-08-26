#!/usr/bin/env bash
# Stop the development dsh web instance.
#
# Kills whatever is currently listening on the target port, waits for the
# port to free up, then force-kills anything still holding it. Also stops
# any lingering `dsh web` process started for that port. The log file is
# left in place for inspection.
#
# Usage:
#   ./scripts/run/stop-dev.sh                 # stop dsh web on port 7923 (profile web)
#   ./scripts/run/stop-dev.sh --port=8080 --profile=dev
set -u

PORT=7923
PROFILE=web

for arg in "$@"; do
  case "$arg" in
    --port=*) PORT="${arg#*=}" ;;
    --profile=*) PROFILE="${arg#*=}" ;;
    *) echo "[stop-dev] unknown argument: $arg" >&2; exit 1 ;;
  esac
done

LOG_DIR="$HOME/.dsh/logs"
LOG_FILE="$LOG_DIR/dsh-web-${PORT}.log"

# Listener PIDs on the target port.
pids_on_port() {
  lsof -ti "tcp:$1" -sTCP:LISTEN 2>/dev/null || true
}

stop_listener() {
  local pids
  pids="$(pids_on_port "$PORT")"
  [[ -z "$pids" ]] && return 0
  echo "[stop-dev] stopping: ${pids//$'\n'/ } on port $PORT"
  # shellcheck disable=SC2086 # pids are trusted lsof output
  kill -TERM $pids 2>/dev/null || true
  for _ in $(seq 1 32); do # up to 8s
    [[ -z "$(pids_on_port "$PORT")" ]] && return 0
    sleep 0.25
  done
  echo "[stop-dev] still busy, forcing kill…"
  # shellcheck disable=SC2046 # single pid line expected
  kill -KILL $(pids_on_port "$PORT") 2>/dev/null || true
  for _ in $(seq 1 20); do # up to 5s
    [[ -z "$(pids_on_port "$PORT")" ]] && return 0
    sleep 0.25
  done
  echo "[stop-dev] error: port $PORT still busy — kill the process manually." >&2
  return 1
}

# The `dsh web` CLI process can outlive its listener (e.g. it spawned the
# daemon); stop any such process started for this port as well.
stop_dsh_web_processes() {
  local matches line pid
  matches="$(ps -axww -o pid=,command= | grep "dsh web" | grep -E -- "--port[ =]${PORT}(\b|$)" | grep -v grep || true)"
  [[ -z "$matches" ]] && return
  while IFS= read -r line; do
    pid="$(printf '%s\n' "${line}" | awk '{print $1}')"
    [[ -z "$pid" ]] && continue
    echo "[stop-dev] stopping dsh web process: $pid"
    kill -TERM "$pid" 2>/dev/null || true
  done <<< "$matches"
}

stop_listener || exit 1
stop_dsh_web_processes

echo "[stop-dev] dsh web stopped (profile: $PROFILE, port: $PORT)."
[[ -f "$LOG_FILE" ]] && echo "[stop-dev] log kept at: $LOG_FILE"
