#!/bin/bash
echo "Uninstalling Abyntra AI from Linux..."
rm -rf "$HOME/.local/share/abyntra-ai"
rm -f "$HOME/.local/bin/abyntra-ai"
rm -f "$HOME/.local/share/applications/abyntra-ai.desktop"
echo "✅ Abyntra AI completely removed from Linux."
