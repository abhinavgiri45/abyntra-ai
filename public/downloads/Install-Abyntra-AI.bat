@echo off
title Installing Abyntra AI Desktop Workstation (Verified Setup)
color 0b
echo ========================================================
echo  ABYNTRA AI - VERIFIED DESKTOP WORKSTATION INSTALLER
echo  Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
echo ========================================================
echo.
echo [*] Installing to: %LocalAppData%\Abyntra AI
powershell -NoProfile -ExecutionPolicy Bypass -Command "& {
  $installDir = [System.IO.Path]::Combine($env:LOCALAPPDATA, 'Abyntra AI')
  $appDir = [System.IO.Path]::Combine($installDir, 'app')
  if (!(Test-Path $appDir)) { New-Item -ItemType Directory -Path $appDir -Force | Out-Null }
  
  Write-Host '[*] Extracting standalone web components...' -ForegroundColor Cyan
  $exePath = [System.IO.Path]::Combine($installDir, 'AbyntraAI.exe')
  $icoPath = [System.IO.Path]::Combine($installDir, 'app.ico')
  
  if (Test-Path 'AbyntraAI.exe') { Copy-Item 'AbyntraAI.exe' -Destination $exePath -Force }
  if (Test-Path 'app.ico') { Copy-Item 'app.ico' -Destination $icoPath -Force }
  
  $desktop = [System.Environment]::GetFolderPath('Desktop')
  $shortcutPath = [System.IO.Path]::Combine($desktop, 'Abyntra AI.lnk')
  $WshShell = New-Object -ComObject WScript.Shell
  $Shortcut = $WshShell.CreateShortcut($shortcutPath)
  $Shortcut.TargetPath = $exePath
  $Shortcut.IconLocation = $icoPath
  $Shortcut.Description = 'Abyntra AI Desktop Workstation'
  $Shortcut.Save()
  
  Write-Host '✅ Abyntra AI successfully installed!' -ForegroundColor Green
  Write-Host '[*] Launching Abyntra AI...' -ForegroundColor Cyan
  Start-Process $exePath
}"
timeout /t 3 >nul
exit
