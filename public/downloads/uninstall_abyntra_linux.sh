#!/bin/bash
echo "Uninstalling Abyntra AI from Linux..."
rm -rf "$HOME/.local/share/abyntra-ai"
rm -f "$HOME/.local/bin/abyntra-ai"
rm -f "$HOME/.local/share/applications/abyntra-ai.desktop"
rm -f "$HOME/Desktop/Abyntra AI.desktop"
echo "✅ Abyntra AI has been completely removed from your Linux system."
