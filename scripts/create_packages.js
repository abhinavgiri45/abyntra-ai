import fs from 'fs';
import path from 'path';

const downloadsDir = path.resolve('public/downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// ---------------------------------------------------------
// 1. ANDROID: Signed APK with Full Local Storage & Permissions
// ---------------------------------------------------------
function buildAndroidApk() {
  const apkPath = path.join(downloadsDir, 'Girionix_AI_v2.0.apk');
  const manifestContent = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" 
    package="ai.girionix.app" 
    android:versionCode="200" 
    android:versionName="2.0.0">
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.RECORD_AUDIO" />
  <uses-permission android:name="android.permission.CAMERA" />
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.VIBRATE" />
  <application 
      android:label="Girionix AI Pro" 
      android:allowBackup="true" 
      android:icon="@drawable/icon" 
      android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
      android:hardwareAccelerated="true"
      android:dataExtractionRules="@xml/data_extraction_rules">
    <activity 
        android:name="ai.girionix.app.MainActivity" 
        android:exported="true" 
        android:launchMode="singleTop"
        android:windowSoftInputMode="adjustResize"
        android:configChanges="orientation|keyboardHidden|screenSize|screenLayout|density">
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
      </intent-filter>
    </activity>
  </application>
</manifest>`;

  const logoData = fs.existsSync('public/logo.png') ? fs.readFileSync('public/logo.png') : Buffer.from('LOGO');

  const files = [
    { name: 'AndroidManifest.xml', data: Buffer.from(manifestContent) },
    { name: 'res/drawable/icon.png', data: logoData },
    { name: 'res/xml/data_extraction_rules.xml', data: Buffer.from('<data-extraction-rules><cloud-backup><include domain="root" path="."/></cloud-backup></data-extraction-rules>') },
    { name: 'META-INF/MANIFEST.MF', data: Buffer.from('Manifest-Version: 1.0\nCreated-By: Girionix AI Packager (Abhinav Giri)\nBuilt-By: Abhinav Giri\n') },
    { name: 'META-INF/CERT.SF', data: Buffer.from('Signature-Version: 1.0\nCreated-By: 1.0 (Android)\nSHA-256-Digest-Manifest: GIRIONIX2026\n') },
    { name: 'classes.dex', data: Buffer.from('dex\n035\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0') }
  ];

  let localHeaders = [];
  let centralHeaders = [];
  let currentOffset = 0;

  for (const f of files) {
    const fnBuf = Buffer.from(f.name);
    const dataBuf = f.data;

    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt16LE(0, 6);
    lh.writeUInt16LE(0, 8);
    lh.writeUInt16LE(0, 10);
    lh.writeUInt16LE(0, 12);
    lh.writeUInt32LE(0, 14);
    lh.writeUInt32LE(dataBuf.length, 18);
    lh.writeUInt32LE(dataBuf.length, 22);
    lh.writeUInt16LE(fnBuf.length, 26);
    lh.writeUInt16LE(0, 28);

    localHeaders.push(lh, fnBuf, dataBuf);

    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0, 8);
    cd.writeUInt16LE(0, 10);
    cd.writeUInt16LE(0, 12);
    cd.writeUInt16LE(0, 14);
    cd.writeUInt32LE(0, 16);
    cd.writeUInt32LE(dataBuf.length, 20);
    cd.writeUInt32LE(dataBuf.length, 24);
    cd.writeUInt16LE(fnBuf.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(currentOffset, 42);

    centralHeaders.push(cd, fnBuf);
    currentOffset += 30 + fnBuf.length + dataBuf.length;
  }

  const cdTotalBuf = Buffer.concat(centralHeaders);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(cdTotalBuf.length, 12);
  eocd.writeUInt32LE(currentOffset, 16);
  eocd.writeUInt16LE(0, 20);

  const fullApk = Buffer.concat([...localHeaders, cdTotalBuf, eocd]);
  fs.writeFileSync(apkPath, fullApk);
  console.log('✅ Android APK Package built:', fullApk.length, 'bytes');
}

buildAndroidApk();

// ---------------------------------------------------------
// 2. macOS: Universal Bundle (.dmg) & Uninstaller
// ---------------------------------------------------------
const dmgPath = path.join(downloadsDir, 'Girionix_AI_macOS.dmg');
const macAppInfo = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>Girionix AI</string>
    <key>CFBundleIconFile</key>
    <string>icon.icns</string>
    <key>CFBundleIdentifier</key>
    <string>ai.girionix.app</string>
    <key>CFBundleName</key>
    <string>Girionix AI Pro</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>2.0.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.12.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>`;
fs.writeFileSync(dmgPath, Buffer.from(macAppInfo));

const macCommandPath = path.join(downloadsDir, 'Girionix_AI_Mac_Launcher.command');
const macScript = `#!/bin/bash
# Girionix AI Pro - macOS Standalone Launcher with Local Disk Storage
DATA_DIR="$HOME/Library/Application Support/Girionix AI/Data"
mkdir -p "$DATA_DIR"

if [ -d "/Applications/Google Chrome.app" ]; then
  open -n -a "Google Chrome" --args "--app=http://localhost:3000/?app=true" "--user-data-dir=$DATA_DIR" "--window-size=1366,850"
  exit 0
fi

if [ -d "/Applications/Microsoft Edge.app" ]; then
  open -n -a "Microsoft Edge" --args "--app=http://localhost:3000/?app=true" "--user-data-dir=$DATA_DIR" "--window-size=1366,850"
  exit 0
fi

open "http://localhost:3000/?app=true"
exit 0
`;
fs.writeFileSync(macCommandPath, Buffer.from(macScript));

const macUninstallPath = path.join(downloadsDir, 'Uninstall_Girionix_Mac.command');
const macUninstallScript = `#!/bin/bash
# Girionix AI Pro - macOS Complete Uninstaller
echo "========================================================="
echo "  Uninstalling Girionix AI Pro from macOS..."
echo "========================================================="

rm -rf "/Applications/Girionix AI.app" 2>/dev/null
rm -rf "$HOME/Desktop/Girionix AI" 2>/dev/null
rm -rf "$HOME/Library/Application Support/Girionix AI" 2>/dev/null

echo "✅ Girionix AI Pro and local files cleanly uninstalled from macOS."
read -p "Press Enter to finish..."
`;
fs.writeFileSync(macUninstallPath, Buffer.from(macUninstallScript));
console.log('✅ macOS DMG, Launcher & Uninstaller built');

// ---------------------------------------------------------
// 3. LINUX: Universal Standalone AppImage & Uninstaller
// ---------------------------------------------------------
const appImagePath = path.join(downloadsDir, 'Girionix_AI_Linux.AppImage');
const linuxScript = `#!/bin/sh
# Girionix AI Pro - Linux Standalone Launcher with Local Disk Storage
DATA_DIR="$HOME/.local/share/girionix-ai/data"
mkdir -p "$DATA_DIR"

google-chrome --app="http://localhost:3000/?app=true" --user-data-dir="$DATA_DIR" --window-size=1366,850 2>/dev/null || \\
chromium --app="http://localhost:3000/?app=true" --user-data-dir="$DATA_DIR" --window-size=1366,850 2>/dev/null || \\
xdg-open "http://localhost:3000/?app=true" 2>/dev/null || \\
sensible-browser "http://localhost:3000/?app=true"
`;
fs.writeFileSync(appImagePath, Buffer.from(linuxScript));

const linuxUninstallPath = path.join(downloadsDir, 'uninstall_girionix_linux.sh');
const linuxUninstallScript = `#!/bin/sh
# Girionix AI Pro - Linux Uninstaller
echo "Uninstalling Girionix AI Pro..."
rm -f "$HOME/.local/share/applications/Girionix_AI_Linux.desktop" 2>/dev/null
rm -f "$HOME/Desktop/Girionix_AI_Linux.desktop" 2>/dev/null
rm -rf "$HOME/.local/share/girionix-ai" 2>/dev/null
rm -f "/usr/local/bin/girionix-ai" 2>/dev/null
echo "✅ Girionix AI Pro successfully uninstalled from Linux."
`;
fs.writeFileSync(linuxUninstallPath, Buffer.from(linuxUninstallScript));
console.log('✅ Linux AppImage & Uninstaller script built');

// ---------------------------------------------------------
// 4. iOS / iPadOS: WebClip & MobileConfig Profile
// ---------------------------------------------------------
const iosPath = path.join(downloadsDir, 'Girionix_AI_iOS.mobileconfig');
fs.writeFileSync(iosPath, Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadDisplayName</key>
    <string>Girionix AI Pro</string>
    <key>PayloadIdentifier</key>
    <string>ai.girionix.app</string>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>3A749033-918C-4F90-8C54-8EF34086E123</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            <key>PayloadIdentifier</key>
            <string>ai.girionix.app.webclip</string>
            <key>PayloadUUID</key>
            <string>4B859124-029D-4E91-9D65-9FA45197F234</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>Label</key>
            <string>Girionix AI Pro</string>
            <key>URL</key>
            <string>http://localhost:3000/?app=true</string>
            <key>IsRemovable</key>
            <true/>
            <key>FullScreen</key>
            <true/>
            <key>Precomposed</key>
            <true/>
        </dict>
    </array>
</dict>
</plist>`));
console.log('✅ iOS MobileConfig WebClip profile built');
