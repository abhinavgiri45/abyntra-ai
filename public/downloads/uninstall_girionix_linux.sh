#!/bin/bash
echo "Uninstalling Girionix AI from Linux..."
rm -rf "$HOME/.local/share/girionix-ai"
rm -f "$HOME/.local/bin/girionix-ai"
rm -f "$HOME/.local/share/applications/girionix-ai.desktop"
rm -f "$HOME/Desktop/Girionix AI.desktop"
echo "✅ Girionix AI has been completely removed from your Linux system."
