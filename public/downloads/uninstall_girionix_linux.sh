#!/bin/bash
echo "Uninstalling Girionix AI from Linux..."
rm -rf "$HOME/.local/share/girionix-ai"
rm -f "$HOME/.local/bin/girionix-ai"
rm -f "$HOME/.local/share/applications/girionix-ai.desktop"
echo "✅ Girionix AI completely removed from Linux."
