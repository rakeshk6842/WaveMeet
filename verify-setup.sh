#!/bin/bash

# WaveMeet - Project Complete Setup Script
# This script verifies your project setup is complete

set -e

echo "═══════════════════════════════════════════════════════════════════"
echo "  WaveMeet - Project Completion Verification"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Counter
COMPLETED=0
TOTAL=0

check_file() {
    local file=$1
    local description=$2
    ((TOTAL++))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description"
        ((COMPLETED++))
    else
        echo -e "${RED}✗${NC} $description - NOT FOUND"
    fi
}

check_dir() {
    local dir=$1
    local description=$2
    ((TOTAL++))
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $description"
        ((COMPLETED++))
    else
        echo -e "${RED}✗${NC} $description - NOT FOUND"
    fi
}

# Check directories
echo -e "${BLUE}📁 Checking Directory Structure...${NC}"
check_dir ".devcontainer" "Dev Container Configuration"
check_dir "backend" "Backend Application"
check_dir "frontend" "Frontend Application"
check_dir "scripts" "Database Scripts"
echo ""

# Check configuration files
echo -e "${BLUE}⚙️  Checking Configuration Files...${NC}"
check_file ".env.example" "Environment Template"
check_file ".gitignore" "Git Ignore Rules"
check_file "docker-compose.yml" "Docker Compose"
check_file "Makefile" "Make Commands"
echo ""

# Check dev container files
echo -e "${BLUE}🐳 Checking Dev Container Files...${NC}"
check_file ".devcontainer/devcontainer.json" "VS Code Config"
check_file ".devcontainer/Dockerfile" "Container Image"
check_file ".devcontainer/post-create.sh" "Setup Script"
echo ""

# Check backend files
echo -e "${BLUE}🔙 Checking Backend Files...${NC}"
check_file "backend/package.json" "Backend Dependencies"
check_file "backend/src/server.js" "Express Server"
check_file "backend/src/middleware.js" "Error Handling"
check_file "backend/.eslintrc.json" "Linting Config"
echo ""

# Check frontend files
echo -e "${BLUE}🎨 Checking Frontend Files...${NC}"
check_file "frontend/package.json" "Frontend Dependencies"
check_file "frontend/vite.config.js" "Vite Config"
check_file "frontend/tailwind.config.js" "Tailwind Config"
check_file "frontend/postcss.config.js" "PostCSS Config"
check_file "frontend/index.html" "HTML Template"
check_file "frontend/src/App.jsx" "App Component"
check_file "frontend/src/main.jsx" "Entry Point"
check_file "frontend/src/api.js" "API Client"
check_file "frontend/src/socket.js" "WebSocket Client"
check_file "frontend/src/store.js" "State Management"
check_file "frontend/src/pages/LoginPage.jsx" "Login Page"
check_file "frontend/src/pages/RegisterPage.jsx" "Register Page"
check_file "frontend/src/pages/ChatPage.jsx" "Chat Page"
check_file "frontend/src/components/Sidebar.jsx" "Sidebar Component"
check_file "frontend/src/components/ChatWindow.jsx" "Chat Window"
check_file "frontend/src/components/MessageBubble.jsx" "Message Bubble"
check_file "frontend/.eslintrc.json" "Frontend Linting"
echo ""

# Check database files
echo -e "${BLUE}🗄️  Checking Database Files...${NC}"
check_file "scripts/init-db.sql" "Database Schema"
echo ""

# Check documentation
echo -e "${BLUE}📚 Checking Documentation Files...${NC}"
check_file "README.md" "Main Documentation"
check_file "QUICKSTART.md" "Quick Start Guide"
check_file "GETTING_STARTED.md" "Getting Started"
check_file "ARCHITECTURE.md" "Architecture Guide"
check_file "DEPLOYMENT.md" "Deployment Guide"
check_file "DEVELOPMENT_WORKFLOW.md" "Development Workflow"
check_file "PROJECT_SUMMARY.md" "Project Summary"
check_file "DOCUMENTATION_INDEX.md" "Documentation Index"
check_file "VERIFICATION_CHECKLIST.md" "Verification Checklist"
check_file "COMPLETION_SUMMARY.md" "Completion Summary"
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════════════"
echo -e "${BLUE}📊 Project Completion Status${NC}"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo -e "Completed: ${GREEN}${COMPLETED}${NC} / ${TOTAL}"
PERCENTAGE=$((COMPLETED * 100 / TOTAL))
echo -e "Progress: ${GREEN}${PERCENTAGE}%${NC}"
echo ""

if [ $COMPLETED -eq $TOTAL ]; then
    echo -e "${GREEN}✅ All files are in place!${NC}"
    echo ""
    echo "🚀 Your WaveMeet is ready to run!"
    echo ""
    echo "Next steps:"
    echo "1. cd /Users/rakeshkoripella/Desktop/projects/docker-ai-workspace"
    echo "2. make setup"
    echo "3. open http://localhost:3000"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠️  Some files are missing!${NC}"
    echo ""
    echo "Please check the missing files above."
    exit 1
fi
