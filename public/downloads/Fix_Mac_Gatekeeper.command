#!/bin/bash
echo "🚀 Unblocking Vedic AI from macOS Gatekeeper & Quarantine..."
xattr -dr com.apple.quarantine "$HOME/Applications/Vedic AI.app" 2>/dev/null
xattr -cr "$HOME/Applications/Vedic AI.app" 2>/dev/null
xattr -dr com.apple.quarantine "/Applications/Vedic AI.app" 2>/dev/null
xattr -cr "/Applications/Vedic AI.app" 2>/dev/null
echo "✅ Quarantine cleared! Launching Vedic AI..."
open "$HOME/Applications/Vedic AI.app" 2>/dev/null || open "/Applications/Vedic AI.app" 2>/dev/null || open "https://vedic-ai.pages.dev"
