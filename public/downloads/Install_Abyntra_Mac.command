#!/bin/bash
# ==========================================================
# Abyntra AI - macOS 1-Click Universal App Engine
# Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
# ==========================================================
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
DATA_DIR="$HOME/Library/Application Support/Abyntra AI/Data"
mkdir -p "$DATA_DIR"

PORT=49153
if command -v python3 &>/dev/null; then
  (cd "$APP_DIR" && python3 -m http.server $PORT --bind 127.0.0.1 &>/dev/null) &
  SERVER_PID=$!
elif command -v python &>/dev/null; then
  (cd "$APP_DIR" && python -m SimpleHTTPServer $PORT &>/dev/null) &
  SERVER_PID=$!
fi

sleep 0.4
TARGET_URL="http://127.0.0.1:$PORT/?app=true"

if [ -d "/Applications/Google Chrome.app" ]; then
  open -n -a "Google Chrome" --args "--app=$TARGET_URL" "--user-data-dir=$DATA_DIR" "--window-size=1366,850"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
  open -n -a "Microsoft Edge" --args "--app=$TARGET_URL" "--user-data-dir=$DATA_DIR" "--window-size=1366,850"
else
  open "$TARGET_URL"
fi
