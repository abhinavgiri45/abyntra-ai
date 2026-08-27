#!/bin/bash
# ==========================================================
# Abyntra AI Pro - macOS 1-Click Verified Installer
# Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
# ==========================================================
echo "🚀 Installing Abyntra AI for macOS..."
DIR="$(cd "$(dirname "$0")" && pwd)"
APP_PATH="$HOME/Applications/Abyntra AI.app"
DATA_DIR="$HOME/Library/Application Support/Abyntra AI/Data"

mkdir -p "$APP_PATH/Contents/MacOS"
mkdir -p "$APP_PATH/Contents/Resources"
mkdir -p "$DATA_DIR"

# Copy Launcher
cat << 'EOF' > "$APP_PATH/Contents/MacOS/AbyntraAI"
#!/bin/bash
PORT=49153
DIR="$(cd "$(dirname "$0")/../Resources" && pwd)"
DATA_DIR="$HOME/Library/Application Support/Abyntra AI/Data"
if command -v python3 &>/dev/null; then
  (cd "$DIR" && python3 -m http.server $PORT --bind 127.0.0.1 &>/dev/null) &
fi
sleep 0.3
TARGET_URL="http://127.0.0.1:$PORT/?app=true"
if [ -d "/Applications/Google Chrome.app" ]; then
  open -n -a "Google Chrome" --args "--app=$TARGET_URL" "--user-data-dir=$DATA_DIR"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
  open -n -a "Microsoft Edge" --args "--app=$TARGET_URL" "--user-data-dir=$DATA_DIR"
else
  open "$TARGET_URL"
fi
EOF

chmod +x "$APP_PATH/Contents/MacOS/AbyntraAI"

# Remove macOS Gatekeeper Quarantine Flag
xattr -dr com.apple.quarantine "$APP_PATH" 2>/dev/null
xattr -cr "$APP_PATH" 2>/dev/null

echo "✅ Abyntra AI installed to $APP_PATH (Gatekeeper quarantine cleared)."
echo "🚀 Launching Abyntra AI..."
open "$APP_PATH"
