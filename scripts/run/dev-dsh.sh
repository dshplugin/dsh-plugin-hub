#!/usr/bin/env bash
# Smart dev sync for the local dsh web instance.
#
# Rebuilds the plugin, then decides what actually needs to happen:
#   - server bundle (lib/) changed  -> full reload (stop + sync + restart); the
#     ESM modules can't be hot-swapped in the booted process, so a restart is
#     unavoidable.
#   - only the client bundle changed -> re-sync the browser bundle and check
#     whether the daemon is still up; boot it when the port is not listening.
#
# Usage:
#   ./scripts/run/dev-dsh.sh                 # smart sync (build + decide)
#   ./scripts/run/dev-dsh.sh --port=8080 --profile=dev
set -u

PORT=7923
PROFILE=web

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROFILE_DIR="$HOME/.dsh/profiles/$PROFILE"
TARGET="$PROFILE_DIR/node_modules/dsh-plugin"

for arg in "$@"; do
  case "$arg" in
    --port=*) PORT="${arg#*=}" ;;
    --profile=*) PROFILE="${arg#*=}" ;;
    *) echo "[dev] unknown argument: $arg" >&2; exit 1 ;;
  esac
done

echo "[dev] building plugin (server + client)…"
(cd "$REPO_DIR" && npm run build:server && npm run build:client) \
  || { echo "[dev] build failed — aborting" >&2; exit 1; }

# No plugin copy yet — fall back to a normal full reload.
if [[ ! -d "$TARGET" ]]; then
  echo "[dev] plugin copy missing — doing a full reload instead."
  exec bash "$REPO_DIR/scripts/run/reload-dsh.sh" --port="$PORT" --profile="$PROFILE"
fi

if diff -rq "$REPO_DIR/lib" "$TARGET/lib" >/dev/null 2>&1; then
  echo "[dev] server bundle unchanged — syncing the client bundle."
  rsync -a --delete "$REPO_DIR/client/" "$TARGET/client/" \
    || { echo "[dev] error: failed to sync client/ — aborting" >&2; exit 1; }
  # Use rsync (not cp) for package.json: some shells alias `cp` to -n, which
  # exits non-zero on an identical existing target and would abort here.
  rsync -a "$REPO_DIR/package.json" "$TARGET/package.json" \
    || { echo "[dev] error: failed to copy package.json — aborting" >&2; exit 1; }
  # Server code may be current while the daemon itself is not running
  # (killed manually, crashed, or a previous reload stopped it without a
  # successful restart). Only report "refresh" when the port is actually
  # listening; otherwise fall through to a full reload that boots it.
  if lsof -ti "tcp:$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "[dev] client synced. dsh web is running on http://localhost:$PORT — refresh the page."
  else
    echo "[dev] dsh web is not running on :$PORT — starting it."
    exec bash "$REPO_DIR/scripts/run/reload-dsh.sh" --skip-build --port="$PORT" --profile="$PROFILE"
  fi
else
  echo "[dev] server bundle changed — full reload (build already done)."
  exec bash "$REPO_DIR/scripts/run/reload-dsh.sh" --skip-build --port="$PORT" --profile="$PROFILE"
fi
