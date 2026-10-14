@echo off
title Zycord Desktop - Build Windows Installer (EXE)
cd /d "%~dp0"
echo ========================================================
echo   Building Zycord Desktop Windows Installer (EXE)...
echo ========================================================
echo.
echo [1/3] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error during npm install!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Packaging Windows Installer (ZycordSetup.exe)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error during electron-builder!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo   BUILD COMPLETED SUCCESSFULLY!
echo   Installer: platform\desktop\dist\ZycordSetup.exe
echo ========================================================
pause
