#!/usr/bin/env pwsh
# InnerLoop - Local Setup Script (PowerShell)
# Run: powershell -ExecutionPolicy Bypass -File start-windows.ps1

$ErrorActionPreference = "Continue"

function Write-Step($num, $total, $msg) {
    Write-Host "  [$num/$total] " -ForegroundColor Green -NoNewline
    Write-Host $msg
}

Write-Host ""
Write-Host "  ===================================================" -ForegroundColor Cyan
Write-Host "   InnerLoop - Local Setup" -ForegroundColor White
Write-Host "   Helping the Inner as a Looper" -ForegroundColor DarkGray
Write-Host "  ===================================================" -ForegroundColor Cyan
Write-Host ""

# ──────────── Check Node.js ────────────
Write-Step 1 6 "Checking Node.js..."

$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host "  ERROR: Node.js is not installed." -ForegroundColor Red
    Write-Host "  Download from: " -NoNewline
    Write-Host "https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "  Install the LTS version, restart your terminal, then re-run." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "  Press Enter to exit"
    exit 1
}

$nodeVer = (node -v)
Write-Host "  Found Node.js $nodeVer" -ForegroundColor DarkGray

# ──────────── Check npm ────────────
$npmCmd = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmCmd) {
    Write-Host "  ERROR: npm not found. Reinstall Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "  Press Enter to exit"
    exit 1
}

# ──────────── Get project files ────────────
Write-Host ""
Write-Step 2 6 "Getting project files..."

$inProject = $false

# Check if already in project
if (Test-Path "package.json") {
    $pkg = Get-Content "package.json" -Raw
    if ($pkg -match '"name":\s*"innerloop"') {
        Write-Host "  Already in InnerLoop directory." -ForegroundColor DarkGray
        $inProject = $true
    }
}

# Check for subfolder
if (-not $inProject -and (Test-Path "InnerLoop\package.json")) {
    Write-Host "  InnerLoop folder found. Using it." -ForegroundColor DarkGray
    Set-Location "InnerLoop"
    $inProject = $true
}

if (-not $inProject) {
    # Try git
    $gitCmd = Get-Command git -ErrorAction SilentlyContinue
    if ($gitCmd) {
        Write-Host "  Cloning with git..." -ForegroundColor DarkGray
        git clone https://github.com/InnerLoopChi/InnerLoop.git 2>$null
        if ($LASTEXITCODE -eq 0 -and (Test-Path "InnerLoop\package.json")) {
            Set-Location "InnerLoop"
            $inProject = $true
        } else {
            Write-Host "  Git clone failed. Trying zip download..." -ForegroundColor Yellow
        }
    } else {
        Write-Host "  Git not installed. Downloading as zip..." -ForegroundColor Yellow
    }

    # Fallback: download zip
    if (-not $inProject) {
        try {
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            $url = "https://github.com/InnerLoopChi/InnerLoop/archive/refs/heads/main.zip"
            Write-Host "  Downloading from GitHub..." -ForegroundColor DarkGray
            Invoke-WebRequest -Uri $url -OutFile "InnerLoop.zip" -UseBasicParsing

            Write-Host "  Extracting..." -ForegroundColor DarkGray
            Expand-Archive -Path "InnerLoop.zip" -DestinationPath "." -Force

            if (Test-Path "InnerLoop-main\package.json") {
                Rename-Item "InnerLoop-main" "InnerLoop"
                Remove-Item "InnerLoop.zip"
                Set-Location "InnerLoop"
                $inProject = $true
            }
        } catch {
            Write-Host ""
            Write-Host "  ERROR: Could not download the project." -ForegroundColor Red
            Write-Host ""
            Write-Host "  Please download manually:" -ForegroundColor Yellow
            Write-Host "    1. Go to: https://github.com/InnerLoopChi/InnerLoop" -ForegroundColor White
            Write-Host "    2. Click green 'Code' button > 'Download ZIP'" -ForegroundColor White
            Write-Host "    3. Extract the zip" -ForegroundColor White
            Write-Host "    4. Open PowerShell in the extracted folder" -ForegroundColor White
            Write-Host "    5. Re-run this script" -ForegroundColor White
            Write-Host ""
            Read-Host "  Press Enter to exit"
            exit 1
        }
    }
}

# Verify we're in the right place
if (-not (Test-Path "package.json")) {
    Write-Host ""
    Write-Host "  ERROR: package.json not found in $(Get-Location)" -ForegroundColor Red
    Write-Host "  Make sure you run this script from the InnerLoop folder" -ForegroundColor Yellow
    Write-Host "  or from a parent folder containing it." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "  Press Enter to exit"
    exit 1
}

Write-Host "  Project ready at: $(Get-Location)" -ForegroundColor DarkGray

# ──────────── Install dependencies ────────────
Write-Host ""
Write-Step 3 6 "Installing dependencies (this may take a minute)..."
npm install 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "  ERROR: npm install failed." -ForegroundColor Red
    Write-Host "  Try: " -NoNewline
    Write-Host "npm cache clean --force" -ForegroundColor White
    Write-Host "  Then delete node_modules/ and re-run this script." -ForegroundColor Yellow
    Read-Host "  Press Enter to exit"
    exit 1
}
Write-Host "  Dependencies installed!" -ForegroundColor Green

# ──────────── Setup .env ────────────
Write-Host ""
Write-Step 4 6 "Firebase configuration..."

$createEnv = $true
if (Test-Path ".env") {
    Write-Host "  .env file already exists." -ForegroundColor DarkGray
    $ow = Read-Host "  Overwrite? (y/N)"
    if ($ow -ne "y") {
        $createEnv = $false
        Write-Host "  Keeping existing .env." -ForegroundColor DarkGray
    }
}

if ($createEnv) {
    Write-Host ""
    Write-Host "  =============================================" -ForegroundColor White
    Write-Host "   You need a Firebase project (free tier)." -ForegroundColor White
    Write-Host ""
    Write-Host "   If you don't have one:" -ForegroundColor DarkGray
    Write-Host "   1. Go to: " -NoNewline -ForegroundColor DarkGray
    Write-Host "https://console.firebase.google.com/" -ForegroundColor Cyan
    Write-Host "   2. Create a project + add a Web app" -ForegroundColor DarkGray
    Write-Host "   3. Enable Email/Password auth" -ForegroundColor DarkGray
    Write-Host "   4. Create Firestore database (test mode)" -ForegroundColor DarkGray
    Write-Host "  =============================================" -ForegroundColor White
    Write-Host ""
    Write-Host "  Paste each value (leave blank to fill later):" -ForegroundColor DarkGray
    Write-Host ""

    $apiKey      = Read-Host "  API Key"
    $authDomain  = Read-Host "  Auth Domain (e.g. myapp.firebaseapp.com)"
    $projectId   = Read-Host "  Project ID"
    $storageBkt  = Read-Host "  Storage Bucket (e.g. myapp.appspot.com)"
    $senderId    = Read-Host "  Messaging Sender ID"
    $appId       = Read-Host "  App ID"

    @"
VITE_FIREBASE_API_KEY=$apiKey
VITE_FIREBASE_AUTH_DOMAIN=$authDomain
VITE_FIREBASE_PROJECT_ID=$projectId
VITE_FIREBASE_STORAGE_BUCKET=$storageBkt
VITE_FIREBASE_MESSAGING_SENDER_ID=$senderId
VITE_FIREBASE_APP_ID=$appId
"@ | Set-Content -Path ".env" -Encoding UTF8

    Write-Host ""
    Write-Host "  .env created! Edit later: " -ForegroundColor Green -NoNewline
    Write-Host "notepad .env" -ForegroundColor White
}

# ──────────── Verify config ────────────
Write-Host ""
Write-Step 5 6 "Checking configuration..."

if (-not (Test-Path ".env")) {
    Write-Host "  No .env found. Creating from template..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "  Created .env from template. Edit with: notepad .env" -ForegroundColor Yellow
    }
}

# ──────────── Start server ────────────
Write-Host ""
Write-Step 6 6 "Starting InnerLoop..."
Write-Host ""
Write-Host "  ===================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "   InnerLoop is running!" -ForegroundColor White
Write-Host ""
Write-Host "   Open: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "   Stop: Ctrl+C" -ForegroundColor DarkGray
Write-Host "   Edit config: notepad .env (then restart)" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  ===================================================" -ForegroundColor Cyan
Write-Host ""

npm run dev
