#!/usr/bin/env pwsh
# InnerLoop - Local Setup Script (PowerShell)
# Works on: Windows PowerShell 5.1+, PowerShell Core 7+, Windows Terminal

$ErrorActionPreference = "Stop"

function Write-Header {
    Write-Host ""
    Write-Host "  ===================================================" -ForegroundColor Cyan
    Write-Host "   InnerLoop - Local Setup" -ForegroundColor White
    Write-Host "   Helping the Inner as a Looper" -ForegroundColor DarkGray
    Write-Host "  ===================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step($num, $msg) {
    Write-Host "  [$num] " -ForegroundColor Green -NoNewline
    Write-Host $msg
}

function Write-Err($msg) {
    Write-Host "  ERROR: $msg" -ForegroundColor Red
}

function Write-Warn($msg) {
    Write-Host "  WARNING: $msg" -ForegroundColor Yellow
}

function Write-Ok($msg) {
    Write-Host "  $msg" -ForegroundColor Green
}

# ──────────── Start ────────────
Write-Header

# ──────────── Check Node.js ────────────
Write-Step "1/5" "Checking Node.js..."

try {
    $nodeVersion = (node -v 2>$null)
    if (-not $nodeVersion) { throw "not found" }
    Write-Host "  Found Node.js $nodeVersion" -ForegroundColor DarkGray

    $major = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($major -lt 18) {
        Write-Warn "Node.js 18+ recommended. You have $nodeVersion."
    }
} catch {
    Write-Err "Node.js is not installed."
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "  Press Enter to exit"
    exit 1
}

# ──────────── Check Git ────────────
try {
    $null = git --version 2>$null
} catch {
    Write-Err "Git is not installed."
    Write-Host "  Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "  Press Enter to exit"
    exit 1
}

# ──────────── Clone or find repo ────────────
Write-Host ""
Write-Step "2/5" "Setting up project..."

if (Test-Path "InnerLoop/package.json") {
    Write-Host "  InnerLoop folder found, using it." -ForegroundColor DarkGray
    Set-Location "InnerLoop"
} elseif (Test-Path "package.json") {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    if ($pkg.name -eq "innerloop") {
        Write-Host "  Already in InnerLoop directory." -ForegroundColor DarkGray
    }
} else {
    Write-Host "  Cloning repository..." -ForegroundColor DarkGray
    git clone https://github.com/InnerLoopChi/InnerLoop.git
    Set-Location "InnerLoop"
}

# ──────────── Install deps ────────────
Write-Host ""
Write-Step "3/5" "Installing dependencies..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Err "npm install failed. Check your internet connection."
    Read-Host "  Press Enter to exit"
    exit 1
}
Write-Ok "Dependencies installed."

# ──────────── Setup .env ────────────
Write-Host ""
Write-Step "4/5" "Firebase configuration..."

$createEnv = $true
if (Test-Path ".env") {
    Write-Host "  .env file already exists." -ForegroundColor DarkGray
    $overwrite = Read-Host "  Overwrite? (y/N)"
    if ($overwrite -ne "y") {
        $createEnv = $false
        Write-Host "  Keeping existing .env." -ForegroundColor DarkGray
    }
}

if ($createEnv) {
    Write-Host ""
    Write-Host "  Get your Firebase config from:" -ForegroundColor White
    Write-Host "  https://console.firebase.google.com/" -ForegroundColor Cyan
    Write-Host "  (Project Settings > General > Your apps > Web app > Config)" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  Paste each value (or leave blank to fill later):" -ForegroundColor DarkGray
    Write-Host ""

    $apiKey      = Read-Host "  VITE_FIREBASE_API_KEY"
    $authDomain  = Read-Host "  VITE_FIREBASE_AUTH_DOMAIN"
    $projectId   = Read-Host "  VITE_FIREBASE_PROJECT_ID"
    $storageBkt  = Read-Host "  VITE_FIREBASE_STORAGE_BUCKET"
    $senderId    = Read-Host "  VITE_FIREBASE_MESSAGING_SENDER_ID"
    $appId       = Read-Host "  VITE_FIREBASE_APP_ID"

    @"
VITE_FIREBASE_API_KEY=$apiKey
VITE_FIREBASE_AUTH_DOMAIN=$authDomain
VITE_FIREBASE_PROJECT_ID=$projectId
VITE_FIREBASE_STORAGE_BUCKET=$storageBkt
VITE_FIREBASE_MESSAGING_SENDER_ID=$senderId
VITE_FIREBASE_APP_ID=$appId
"@ | Set-Content -Path ".env" -Encoding UTF8

    Write-Host ""
    Write-Ok ".env file created! Edit it anytime with: notepad .env"
}

# ──────────── Start server ────────────
Write-Host ""
Write-Step "5/5" "Starting InnerLoop..."
Write-Host ""
Write-Host "  ===================================================" -ForegroundColor Cyan
Write-Host "   InnerLoop is starting!" -ForegroundColor White
Write-Host "   Open: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "   Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host "  ===================================================" -ForegroundColor Cyan
Write-Host ""

npm run dev
