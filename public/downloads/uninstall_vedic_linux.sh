#!/bin/bash
echo "Uninstalling Vedic AI from Linux..."
rm -rf "$HOME/.local/share/vedic-ai"
rm -f "$HOME/.local/bin/vedic-ai"
rm -f "$HOME/.local/share/applications/vedic-ai.desktop"
echo "✅ Vedic AI completely removed from Linux."
