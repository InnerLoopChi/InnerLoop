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
    echo.
    echo  To fix this:
    echo    1. Go to https://nodejs.org/
    echo    2. Download the LTS version
    echo    3. Run the installer (keep all defaults checked)
    echo    4. CLOSE this window and any terminals
    echo    5. Re-open and run this script again
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo  Found Node.js %NODE_VER% - OK
echo.

:: ──────────── Find the project folder ────────────
echo [2/5] Locating project files...

:: CASE 1: package.json is right here (user is inside the project)
if exist "package.json" (
    echo  Found package.json in current directory - OK
    goto :do_install
)

:: CASE 2: There's an InnerLoop subfolder
if exist "InnerLoop\package.json" (
    echo  Found InnerLoop subfolder - entering it
    cd InnerLoop
    goto :do_install
)

:: CASE 3: There's an InnerLoop-main subfolder (from GitHub zip)
if exist "InnerLoop-main\package.json" (
    echo  Found InnerLoop-main subfolder (from zip) - entering it
    cd InnerLoop-main
    goto :do_install
)

:: CASE 4: Need to download the project
echo  Project files not found. Downloading from GitHub...
echo.

:: Use PowerShell to download (works on Win 10/11 without git)
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; try { Invoke-WebRequest -Uri 'https://github.com/InnerLoopChi/InnerLoop/archive/refs/heads/main.zip' -OutFile 'InnerLoop.zip' -UseBasicParsing; Write-Host 'OK' } catch { Write-Host 'FAIL'; exit 1 }"

if not exist "InnerLoop.zip" (
    echo.
    echo  ERROR: Download failed.
    echo.
    echo  Please download manually:
    echo    1. Open this URL in your browser:
    echo       https://github.com/InnerLoopChi/InnerLoop/archive/refs/heads/main.zip
    echo    2. Save the zip file
    echo    3. Extract it
    echo    4. Open the extracted folder
    echo    5. Double-click start-windows.bat
    echo.
    pause
    exit /b 1
)

echo  Extracting...
powershell -Command "Expand-Archive -Path 'InnerLoop.zip' -DestinationPath '.' -Force"

if exist "InnerLoop-main\package.json" (
    del "InnerLoop.zip"
    cd InnerLoop-main
    echo  Download and extract complete!
) else (
    echo  ERROR: Extraction failed. Please extract InnerLoop.zip manually.
    pause
    exit /b 1
)

:: ──────────── Install dependencies ────────────
:do_install
echo.
echo [3/5] Installing dependencies...
echo  (This takes 1-2 minutes the first time)
echo.

:: Double-check we have package.json
if not exist "package.json" (
    echo  ERROR: package.json not found at %cd%
    echo  Something went wrong with the project setup.
    pause
    exit /b 1
)

:: Skip install if node_modules already exists and looks complete
if exist "node_modules\.package-lock.json" (
    echo  node_modules already exists. Skipping install.
    echo  (Delete node_modules folder to force reinstall)
    goto :setup_env
)

call npm install
if %errorlevel% neq 0 (
    echo.
    echo  ERROR: npm install failed.
    echo.
    echo  Try these fixes:
    echo    1. Check your internet connection
    echo    2. Close all other terminals/editors
    echo    3. Run: npm cache clean --force
    echo    4. Delete the node_modules folder
    echo    5. Run this script again
    echo.
    pause
    exit /b 1
)
echo.
echo  Dependencies installed!

:: ──────────── Setup .env ────────────
:setup_env
echo.
echo [4/5] Firebase configuration...

if exist ".env" (
    echo  .env file already exists - OK
    goto :start_server
)

:: Check if user wants to set up Firebase now or later
echo.
echo  InnerLoop needs Firebase credentials to work.
echo  You can set them up now or later.
echo.
set /p SETUP_NOW="  Set up Firebase now? (Y/n): "
if /i "!SETUP_NOW!"=="n" (
    echo.
    echo  Skipping Firebase setup.
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo  Created blank .env from template.
    ) else (
        (
            echo VITE_FIREBASE_API_KEY=
            echo VITE_FIREBASE_AUTH_DOMAIN=
            echo VITE_FIREBASE_PROJECT_ID=
            echo VITE_FIREBASE_STORAGE_BUCKET=
            echo VITE_FIREBASE_MESSAGING_SENDER_ID=
            echo VITE_FIREBASE_APP_ID=
        ) > .env
        echo  Created blank .env file.
    )
    echo  Edit it later with: notepad .env
    goto :start_server
)

echo.
echo  =============================================
echo   Firebase Setup (free tier)
echo  =============================================
echo.
echo  If you don't have a Firebase project yet:
echo    1. Go to https://console.firebase.google.com/
echo    2. Click "Add project" - give it any name
echo    3. On the project home, click the Web icon (^</^>)
echo    4. Register an app (any nickname)
echo    5. Copy the config values shown
echo.
echo  Also enable these (under Build menu):
echo    - Authentication ^> Email/Password ^> Enable
echo    - Firestore Database ^> Create ^> Test mode
echo.
echo  Now paste your config values below.
echo  (Leave blank to skip - you can edit .env later)
echo.

set /p FB_API_KEY="  apiKey: "
set /p FB_AUTH_DOMAIN="  authDomain: "
set /p FB_PROJECT_ID="  projectId: "
set /p FB_STORAGE="  storageBucket: "
set /p FB_SENDER="  messagingSenderId: "
set /p FB_APP_ID="  appId: "

(
echo VITE_FIREBASE_API_KEY=!FB_API_KEY!
echo VITE_FIREBASE_AUTH_DOMAIN=!FB_AUTH_DOMAIN!
echo VITE_FIREBASE_PROJECT_ID=!FB_PROJECT_ID!
echo VITE_FIREBASE_STORAGE_BUCKET=!FB_STORAGE!
echo VITE_FIREBASE_MESSAGING_SENDER_ID=!FB_SENDER!
echo VITE_FIREBASE_APP_ID=!FB_APP_ID!
) > .env

echo.
echo  .env saved! Edit anytime with: notepad .env

:: ──────────── Start dev server ────────────
:start_server
echo.
echo [5/5] Starting InnerLoop...
echo.
echo  ===================================================
echo.
echo   InnerLoop is running!
echo.
echo   Open your browser to:
echo.
echo       http://localhost:5173
echo.
echo   Stop the server: Ctrl+C
echo   Edit Firebase config: notepad .env
echo.
echo  ===================================================
echo.

call npm run dev

echo.
echo  Server stopped. To restart run: npm run dev
pause
