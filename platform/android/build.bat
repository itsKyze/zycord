@echo off
title Zycord Android - Build APK
cd /d "%~dp0"
echo ========================================================
echo   Building Zycord Android Release APK (Zycord.apk)...
echo ========================================================
echo.
node build-apk.mjs
if %ERRORLEVEL% NEQ 0 (
    echo Error during APK build!
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo ========================================================
echo   BUILD COMPLETED SUCCESSFULLY!
echo   APK: platform\android\Zycord.apk
echo ========================================================
pause
