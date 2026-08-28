#!/bin/bash
echo "Removing Girionix AI from macOS..."
killall "Girionix AI" 2>/dev/null
rm -rf "$HOME/Applications/Girionix AI.app"
rm -rf "$HOME/Library/Application Support/Girionix AI"
echo "✅ Girionix AI has been cleanly uninstalled from macOS."
