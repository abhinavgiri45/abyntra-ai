#!/bin/bash
# ==========================================================
# Abyntra AI Pro - macOS Dedicated 1-Click Uninstaller
# ==========================================================
echo "Removing Abyntra AI from macOS..."
killall "Abyntra AI" 2>/dev/null
killall "Google Chrome" 2>/dev/null
rm -rf "$HOME/Applications/Abyntra AI.app"
rm -rf "$HOME/Library/Application Support/Abyntra AI"
echo "✅ Abyntra AI has been cleanly uninstalled from macOS."
