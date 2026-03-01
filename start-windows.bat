@echo off
setlocal enabledelayedexpansion
title InnerLoop - Local Setup
color 0A

echo.
echo  ===================================================
echo   InnerLoop - Local Setup for Windows
echo   Helping the Inner as a Looper
echo  ===================================================
echo.

:: ──────────── Check Node.js ────────────
echo [1/5] Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo  ERROR: Node.js is not installed or not in PATH.
    echo  Download it from: https://nodejs.org/
    echo  Install the LTS version, then re-run this script.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo  Found Node.js %NODE_VER%

:: Check Node version is 18+
for /f "tokens=1 delims=.v" %%a in ("%NODE_VER%") do set NODE_MAJOR=%%a
if %NODE_MAJOR% lss 18 (
    echo.
    echo  WARNING: Node.js 18+ is recommended. You have %NODE_VER%.
    echo  Things may still work, but consider upgrading.
    echo.
)

:: ──────────── Check if already cloned ────────────
echo.
echo [2/5] Setting up project...

if exist "InnerLoop\package.json" (
    echo  InnerLoop folder already exists, using it.
    cd InnerLoop
) else if exist "package.json" (
    echo  Already in InnerLoop directory.
) else (
    echo  Cloning repository...
    git clone https://github.com/InnerLoopChi/InnerLoop.git
    if %errorlevel% neq 0 (
        echo.
        echo  ERROR: Git clone failed. Make sure Git is installed.
        echo  Download Git: https://git-scm.com/download/win
        echo.
        pause
        exit /b 1
    )
    cd InnerLoop
)

:: ──────────── Install dependencies ────────────
echo.
echo [3/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo  ERROR: npm install failed. Check your internet connection.
    pause
    exit /b 1
)
echo  Dependencies installed successfully.

:: ──────────── Setup .env ────────────
echo.
echo [4/5] Firebase configuration...

if exist ".env" (
    echo  .env file already exists.
    set /p OVERWRITE="  Overwrite it? (y/N): "
    if /i not "!OVERWRITE!"=="y" (
        echo  Keeping existing .env file.
        goto :start_server
    )
)

echo.
echo  You need Firebase credentials. Get them from:
echo  https://console.firebase.google.com/
echo  (Project Settings ^> General ^> Your apps ^> Web app ^> Config)
echo.
echo  Paste each value and press Enter.
echo  (Leave blank to skip - you can edit .env later)
echo.

set /p FB_API_KEY="  VITE_FIREBASE_API_KEY: "
set /p FB_AUTH_DOMAIN="  VITE_FIREBASE_AUTH_DOMAIN: "
set /p FB_PROJECT_ID="  VITE_FIREBASE_PROJECT_ID: "
set /p FB_STORAGE="  VITE_FIREBASE_STORAGE_BUCKET: "
set /p FB_SENDER="  VITE_FIREBASE_MESSAGING_SENDER_ID: "
set /p FB_APP_ID="  VITE_FIREBASE_APP_ID: "

(
echo VITE_FIREBASE_API_KEY=!FB_API_KEY!
echo VITE_FIREBASE_AUTH_DOMAIN=!FB_AUTH_DOMAIN!
echo VITE_FIREBASE_PROJECT_ID=!FB_PROJECT_ID!
echo VITE_FIREBASE_STORAGE_BUCKET=!FB_STORAGE!
echo VITE_FIREBASE_MESSAGING_SENDER_ID=!FB_SENDER!
echo VITE_FIREBASE_APP_ID=!FB_APP_ID!
) > .env

echo.
echo  .env file created! You can edit it later in any text editor.

:: ──────────── Start dev server ────────────
:start_server
echo.
echo [5/5] Starting InnerLoop dev server...
echo.
echo  ===================================================
echo   InnerLoop is starting!
echo   Open your browser to: http://localhost:5173
echo.
echo   Press Ctrl+C to stop the server.
echo  ===================================================
echo.

call npm run dev
