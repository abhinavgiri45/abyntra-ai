#!/bin/bash
# ==========================================================
# Vedic AI Pro - Linux 1-Click Native Desktop Installer
# Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
# ==========================================================
echo "🚀 Installing Vedic AI for Linux..."
INSTALL_DIR="$HOME/.local/share/vedic-ai"
BIN_DIR="$HOME/.local/bin"
DESKTOP_DIR="$HOME/.local/share/applications"

mkdir -p "$INSTALL_DIR"
mkdir -p "$BIN_DIR"
mkdir -p "$DESKTOP_DIR"

cat << 'EOF' > "$INSTALL_DIR/vedic-ai"
#!/bin/bash
PORT=49154
HERE="$(dirname "$(readlink -f "${0}")")"
DATA_DIR="$HOME/.local/share/vedic-ai/data"
mkdir -p "$DATA_DIR"
if command -v python3 &>/dev/null; then
  (cd "$HERE" && python3 -m http.server $PORT --bind 127.0.0.1 &>/dev/null) &
fi
sleep 0.3
TARGET_URL="http://127.0.0.1:$PORT/?app=true"
if command -v google-chrome &>/dev/null; then
  google-chrome --app="$TARGET_URL" --user-data-dir="$DATA_DIR" &
elif command -v chromium-browser &>/dev/null; then
  chromium-browser --app="$TARGET_URL" --user-data-dir="$DATA_DIR" &
elif command -v microsoft-edge &>/dev/null; then
  microsoft-edge --app="$TARGET_URL" --user-data-dir="$DATA_DIR" &
else
  xdg-open "$TARGET_URL" &
fi
EOF

chmod +x "$INSTALL_DIR/vedic-ai"
ln -sf "$INSTALL_DIR/vedic-ai" "$BIN_DIR/vedic-ai"

# Create .desktop entry
cat << EOF > "$DESKTOP_DIR/vedic-ai.desktop"
[Desktop Entry]
Name=Vedic AI
Comment=Sovereign AI Polymath Desktop Workstation
Exec=$INSTALL_DIR/vedic-ai
Terminal=false
Type=Application
Categories=Development;Education;Graphics;AudioVideo;
StartupNotify=true
EOF

chmod +x "$DESKTOP_DIR/vedic-ai.desktop"

echo "✅ Vedic AI installed successfully with native application menu launcher."
echo "🚀 Launching Vedic AI..."
"$INSTALL_DIR/vedic-ai" &
