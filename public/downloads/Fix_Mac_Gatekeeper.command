#!/bin/bash
echo "🚀 Unblocking Girionix AI from macOS Gatekeeper & Quarantine..."
xattr -dr com.apple.quarantine "$HOME/Applications/Girionix AI.app" 2>/dev/null
xattr -cr "$HOME/Applications/Girionix AI.app" 2>/dev/null
xattr -dr com.apple.quarantine "/Applications/Girionix AI.app" 2>/dev/null
xattr -cr "/Applications/Girionix AI.app" 2>/dev/null
echo "✅ Quarantine cleared! Launching Girionix AI..."
open "$HOME/Applications/Girionix AI.app" 2>/dev/null || open "/Applications/Girionix AI.app" 2>/dev/null || open "https://girionix-ai.pages.dev"
