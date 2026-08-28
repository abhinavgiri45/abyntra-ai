@echo off
title 1-Click Vedic AI SmartScreen Unblocker
color 0a
echo ========================================================
echo  VEDIC AI - 1-CLICK SMARTSCREEN UNBLOCK HELPER
echo ========================================================
echo.
echo [*] Clearing Mark-of-the-Web (Zone.Identifier) on downloaded installers...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem -Path '%~dp0' -Recurse | Unblock-File -ErrorAction SilentlyContinue"
echo.
echo [OK] All Vedic AI files are now completely unblocked!
echo [*] Launching setup wizard...
if exist "%~dp0Vedic_AI_Setup.exe" start "" "%~dp0Vedic_AI_Setup.exe"
timeout /t 3 >nul
exit
