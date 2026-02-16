#!/bin/bash
set -e

echo "🚀 Starting post-creation setup..."

# Update npm and install global packages
npm install -g @angular/cli @nestjs/cli typescript ts-node nodemon

# Create necessary directories
mkdir -p /workspace/{backend,frontend,shared,data,logs}

# Install backend dependencies
if [ -f "/workspace/backend/package.json" ]; then
    echo "📦 Installing backend dependencies..."
    cd /workspace/backend
    npm install
fi

# Install frontend dependencies
if [ -f "/workspace/frontend/package.json" ]; then
    echo "📦 Installing frontend dependencies..."
    cd /workspace/frontend
    npm install
fi

# Create .env file if it doesn't exist
if [ ! -f "/workspace/.env" ]; then
    cat > /workspace/.env << 'EOF'
# Backend Configuration
BACKEND_PORT=5000
BACKEND_ENV=development
BACKEND_LOG_LEVEL=debug

# Frontend Configuration
FRONTEND_PORT=3000
FRONTEND_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wavemeet_db
DB_USER=postgres
DB_PASSWORD=postgres

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# API Configuration
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret_here

# WebSocket Configuration
WS_HOST=0.0.0.0
WS_PORT=8000
EOF
    echo "✅ Created .env file"
fi

echo "✅ Post-creation setup completed!"
echo ""
echo "📝 Next steps:"
echo "   1. Run: npm run dev (to start all services)"
echo "   2. Open: http://localhost:3000 (Frontend)"
echo "   3. API: http://localhost:5000 (Backend API)"
