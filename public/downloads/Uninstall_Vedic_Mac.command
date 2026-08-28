#!/bin/bash
# Vedic AI Pro - macOS Complete Uninstaller
echo "========================================================="
echo "  Uninstalling Vedic AI Pro from macOS..."
echo "========================================================="

rm -rf "/Applications/Vedic AI.app" 2>/dev/null
rm -rf "$HOME/Desktop/Vedic AI" 2>/dev/null
rm -rf "$HOME/Library/Application Support/Vedic AI" 2>/dev/null

echo "✅ Vedic AI Pro and local files cleanly uninstalled from macOS."
read -p "Press Enter to finish..."
