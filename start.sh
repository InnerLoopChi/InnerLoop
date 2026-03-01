#!/usr/bin/env bash
# InnerLoop - Local Setup Script
# Works on: Git Bash (Windows), WSL, macOS Terminal, Linux

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
WHITE='\033[1;37m'
DIM='\033[2m'
NC='\033[0m'

echo ""
echo -e "  ${CYAN}===================================================${NC}"
echo -e "  ${WHITE} InnerLoop - Local Setup${NC}"
echo -e "  ${DIM} Helping the Inner as a Looper${NC}"
echo -e "  ${CYAN}===================================================${NC}"
echo ""

# ──────────── Check Node.js ────────────
echo -e "  ${GREEN}[1/5]${NC} Checking Node.js..."

if ! command -v node &> /dev/null; then
    echo -e "  ${RED}ERROR: Node.js is not installed.${NC}"
    echo -e "  ${YELLOW}Download from: https://nodejs.org/${NC}"
    exit 1
fi

NODE_VER=$(node -v)
echo -e "  ${DIM}Found Node.js ${NODE_VER}${NC}"

NODE_MAJOR=$(echo "$NODE_VER" | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -lt 18 ] 2>/dev/null; then
    echo -e "  ${YELLOW}WARNING: Node.js 18+ recommended. You have ${NODE_VER}.${NC}"
fi

# ──────────── Check Git ────────────
if ! command -v git &> /dev/null; then
    echo -e "  ${RED}ERROR: Git is not installed.${NC}"
    echo -e "  ${YELLOW}Download from: https://git-scm.com/${NC}"
    exit 1
fi

# ──────────── Clone or find repo ────────────
echo ""
echo -e "  ${GREEN}[2/5]${NC} Setting up project..."

if [ -f "InnerLoop/package.json" ]; then
    echo -e "  ${DIM}InnerLoop folder found, using it.${NC}"
    cd InnerLoop
elif [ -f "package.json" ]; then
    PKG_NAME=$(grep -o '"name": *"[^"]*"' package.json | head -1 | cut -d'"' -f4)
    if [ "$PKG_NAME" = "innerloop" ]; then
        echo -e "  ${DIM}Already in InnerLoop directory.${NC}"
    fi
else
    echo -e "  ${DIM}Cloning repository...${NC}"
    git clone https://github.com/InnerLoopChi/InnerLoop.git
    cd InnerLoop
fi

# ──────────── Install dependencies ────────────
echo ""
echo -e "  ${GREEN}[3/5]${NC} Installing dependencies..."
npm install
echo -e "  ${GREEN}Dependencies installed.${NC}"

# ──────────── Setup .env ────────────
echo ""
echo -e "  ${GREEN}[4/5]${NC} Firebase configuration..."

CREATE_ENV=true
if [ -f ".env" ]; then
    echo -e "  ${DIM}.env file already exists.${NC}"
    read -p "  Overwrite? (y/N): " OVERWRITE
    if [ "$OVERWRITE" != "y" ] && [ "$OVERWRITE" != "Y" ]; then
        CREATE_ENV=false
        echo -e "  ${DIM}Keeping existing .env.${NC}"
    fi
fi

if [ "$CREATE_ENV" = true ]; then
    echo ""
    echo -e "  ${WHITE}Get your Firebase config from:${NC}"
    echo -e "  ${CYAN}https://console.firebase.google.com/${NC}"
    echo -e "  ${DIM}(Project Settings > General > Your apps > Web app > Config)${NC}"
    echo ""
    echo -e "  ${DIM}Paste each value (or leave blank to fill later):${NC}"
    echo ""

    read -p "  VITE_FIREBASE_API_KEY: " FB_API_KEY
    read -p "  VITE_FIREBASE_AUTH_DOMAIN: " FB_AUTH_DOMAIN
    read -p "  VITE_FIREBASE_PROJECT_ID: " FB_PROJECT_ID
    read -p "  VITE_FIREBASE_STORAGE_BUCKET: " FB_STORAGE
    read -p "  VITE_FIREBASE_MESSAGING_SENDER_ID: " FB_SENDER
    read -p "  VITE_FIREBASE_APP_ID: " FB_APP_ID

    cat > .env << EOF
VITE_FIREBASE_API_KEY=${FB_API_KEY}
VITE_FIREBASE_AUTH_DOMAIN=${FB_AUTH_DOMAIN}
VITE_FIREBASE_PROJECT_ID=${FB_PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=${FB_STORAGE}
VITE_FIREBASE_MESSAGING_SENDER_ID=${FB_SENDER}
VITE_FIREBASE_APP_ID=${FB_APP_ID}
EOF

    echo ""
    echo -e "  ${GREEN}.env file created!${NC} Edit anytime: ${DIM}nano .env${NC}"
fi

# ──────────── Start dev server ────────────
echo ""
echo -e "  ${GREEN}[5/5]${NC} Starting InnerLoop..."
echo ""
echo -e "  ${CYAN}===================================================${NC}"
echo -e "  ${WHITE} InnerLoop is starting!${NC}"
echo -e "  ${WHITE} Open: ${GREEN}http://localhost:5173${NC}"
echo ""
echo -e "  ${DIM} Press Ctrl+C to stop.${NC}"
echo -e "  ${CYAN}===================================================${NC}"
echo ""

npm run dev
