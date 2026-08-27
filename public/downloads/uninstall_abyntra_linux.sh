#!/bin/bash
# ==========================================================
# Abyntra AI Pro - Linux Dedicated 1-Click Uninstaller
# ==========================================================
echo "Uninstalling Abyntra AI Pro from Linux system..."
rm -rf "$HOME/.local/share/abyntra-ai"
rm -f "$HOME/.local/share/applications/abyntra-ai.desktop"
rm -f "$HOME/Desktop/Abyntra AI.desktop"
echo "✅ Abyntra AI has been completely removed from your Linux system."
