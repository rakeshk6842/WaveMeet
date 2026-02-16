#!/bin/bash

# WaveMeet - Setup Verification Script
# This script verifies that all project files are in place

echo "════════════════════════════════════════════════════════════════"
echo "  🔍 WaveMeet - Project Verification"
echo "════════════════════════════════════════════════════════════════"
echo ""

PROJECT_DIR="/Users/rakeshkoripella/Desktop/projects/docker-ai-workspace"
cd "$PROJECT_DIR"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
PASSED=0
FAILED=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $1"
        ((FAILED++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $1/"
        ((FAILED++))
    fi
}

echo "📁 Checking Directory Structure..."
echo ""

check_dir ".devcontainer"
check_dir "backend"
check_dir "backend/src"
check_dir "frontend"
check_dir "frontend/src"
check_dir "frontend/src/components"
check_dir "frontend/src/pages"
check_dir "scripts"

echo ""
echo "📄 Checking Essential Files..."
echo ""

# Dev Container
check_file ".devcontainer/devcontainer.json"
check_file ".devcontainer/Dockerfile"
check_file ".devcontainer/post-create.sh"

# Docker & Config
check_file "docker-compose.yml"
check_file ".env.example"
check_file ".gitignore"
check_file "Makefile"

# Backend
check_file "backend/package.json"
check_file "backend/src/server.js"
check_file "backend/src/middleware.js"
check_file "backend/.eslintrc.json"

# Frontend
check_file "frontend/package.json"
check_file "frontend/vite.config.js"
check_file "frontend/tailwind.config.js"
check_file "frontend/postcss.config.js"
check_file "frontend/index.html"
check_file "frontend/src/main.jsx"
check_file "frontend/src/App.jsx"
check_file "frontend/src/App.css"
check_file "frontend/src/index.css"
check_file "frontend/src/api.js"
check_file "frontend/src/socket.js"
check_file "frontend/src/store.js"
check_file "frontend/src/pages/LoginPage.jsx"
check_file "frontend/src/pages/RegisterPage.jsx"
check_file "frontend/src/pages/ChatPage.jsx"
check_file "frontend/src/components/Sidebar.jsx"
check_file "frontend/src/components/ChatWindow.jsx"
check_file "frontend/src/components/MessageBubble.jsx"
check_file "frontend/.eslintrc.json"

# Database
check_file "scripts/init-db.sql"

# Documentation
check_file "README.md"
check_file "QUICKSTART.md"
check_file "ARCHITECTURE.md"
check_file "DEPLOYMENT.md"
check_file "DEVELOPMENT_WORKFLOW.md"
check_file "PROJECT_SUMMARY.md"
check_file "DOCUMENTATION_INDEX.md"
check_file "VERIFICATION_CHECKLIST.md"
check_file "VERIFICATION_REPORT.md"
check_file "QUICK_REFERENCE.md"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

# Summary
TOTAL=$((PASSED + FAILED))
echo "📊 Verification Results:"
echo "   ${GREEN}Passed: $PASSED${NC}"
echo "   ${RED}Failed: $FAILED${NC}"
echo "   Total: $TOTAL"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "🚀 Your WaveMeet is ready to run!"
    echo ""
    echo "Next steps:"
    echo "  1. cd $PROJECT_DIR"
    echo "  2. make setup"
    echo "  3. Visit http://localhost:3000"
    echo ""
    echo "For more info: cat QUICKSTART.md"
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED!${NC}"
    echo ""
    echo "Missing files detected. Please check the output above."
    exit 1
fi
