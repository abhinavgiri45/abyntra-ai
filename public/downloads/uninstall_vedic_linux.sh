#!/bin/sh
# Vedic AI Pro - Linux Uninstaller
echo "Uninstalling Vedic AI Pro..."
rm -f "$HOME/.local/share/applications/Vedic_AI_Linux.desktop" 2>/dev/null
rm -f "$HOME/Desktop/Vedic_AI_Linux.desktop" 2>/dev/null
rm -rf "$HOME/.local/share/vedic-ai" 2>/dev/null
rm -f "/usr/local/bin/vedic-ai" 2>/dev/null
echo "✅ Vedic AI Pro successfully uninstalled from Linux."
