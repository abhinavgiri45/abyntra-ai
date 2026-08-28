#!/bin/bash
# Vedic AI Pro - macOS Standalone Launcher with Local Disk Storage
DATA_DIR="$HOME/Library/Application Support/Vedic AI/Data"
mkdir -p "$DATA_DIR"

if [ -d "/Applications/Google Chrome.app" ]; then
  open -n -a "Google Chrome" --args "--app=http://localhost:3000/?app=true" "--user-data-dir=$DATA_DIR" "--window-size=1366,850"
  exit 0
fi

if [ -d "/Applications/Microsoft Edge.app" ]; then
  open -n -a "Microsoft Edge" --args "--app=http://localhost:3000/?app=true" "--user-data-dir=$DATA_DIR" "--window-size=1366,850"
  exit 0
fi

open "http://localhost:3000/?app=true"
exit 0
