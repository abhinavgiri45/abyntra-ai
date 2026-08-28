#!/bin/bash
echo "Removing Vedic AI from macOS..."
killall "Vedic AI" 2>/dev/null
rm -rf "$HOME/Applications/Vedic AI.app"
rm -rf "$HOME/Library/Application Support/Vedic AI"
echo "✅ Vedic AI has been cleanly uninstalled from macOS."
