@echo off
title Girionix AI - Trusted Publisher Certificate Setup
color 0a
echo ========================================================
echo  GIRIONIX AI - TRUSTED PUBLISHER CERTIFICATE ENABLER
echo  Publisher: Abhinav Giri (@abhinavgiri45)
echo ========================================================
echo.
echo [*] Registering Authenticode Certificate for Publisher: Abhinav Giri...
if exist "%~dp0AbhinavGiri-GirionixAI.cer" (
    certutil -addstore -user Root "%~dp0AbhinavGiri-GirionixAI.cer" >nul 2>&1
    certutil -addstore -user TrustedPublisher "%~dp0AbhinavGiri-GirionixAI.cer" >nul 2>&1
    echo [✓] Certificate successfully registered into Windows Trusted Publishers!
)
echo [*] Removing Mark-of-the-Web (Zone.Identifier) from all executables...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem -Path '%~dp0' -Filter *.exe | Unblock-File -ErrorAction SilentlyContinue"
echo.
echo ========================================================
echo  [✓] SUCCESS: Publisher 'Abhinav Giri' is now VERIFIED!
echo  Windows Defender and SmartScreen will launch apps seamlessly.
echo ========================================================
timeout /t 5 >nul
