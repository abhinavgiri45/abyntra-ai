@echo off
title Installing Girionix AI Desktop Workstation (Verified Setup)
color 0b
echo ========================================================
echo  GIRIONIX AI - VERIFIED DESKTOP WORKSTATION INSTALLER
echo  Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
echo ========================================================
echo.
echo [*] Automatically unblocking downloaded files...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem -Path '%~dp0' | Unblock-File -ErrorAction SilentlyContinue"
echo [*] Installing to: %LocalAppData%\Girionix AI
powershell -NoProfile -ExecutionPolicy Bypass -Command "& {
  $installDir = [System.IO.Path]::Combine($env:LOCALAPPDATA, 'Girionix AI')
  $appDir = [System.IO.Path]::Combine($installDir, 'app')
  if (!(Test-Path $appDir)) { New-Item -ItemType Directory -Path $appDir -Force | Out-Null }
  
  Write-Host '[*] Extracting standalone web components...' -ForegroundColor Cyan
  $exePath = [System.IO.Path]::Combine($installDir, 'GirionixAI.exe')
  $icoPath = [System.IO.Path]::Combine($installDir, 'app.ico')
  
  if (Test-Path '%~dp0GirionixAI.exe') { Copy-Item '%~dp0GirionixAI.exe' -Destination $exePath -Force; Unblock-File $exePath -ErrorAction SilentlyContinue }
  if (Test-Path '%~dp0app.ico') { Copy-Item '%~dp0app.ico' -Destination $icoPath -Force }
  
  $desktop = [System.Environment]::GetFolderPath('Desktop')
  $shortcutPath = [System.IO.Path]::Combine($desktop, 'Girionix AI.lnk')
  $WshShell = New-Object -ComObject WScript.Shell
  $Shortcut = $WshShell.CreateShortcut($shortcutPath)
  $Shortcut.TargetPath = $exePath
  $Shortcut.IconLocation = $icoPath
  $Shortcut.Description = 'Girionix AI Desktop Workstation'
  $Shortcut.Save()
  
  Write-Host '✅ Girionix AI successfully installed!' -ForegroundColor Green
  Write-Host '[*] Launching Girionix AI...' -ForegroundColor Cyan
  Start-Process $exePath
}"
timeout /t 3 >nul
