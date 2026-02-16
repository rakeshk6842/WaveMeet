# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Docker Desktop installed on your machine
- macOS, Linux, or Windows with WSL 2

### Step 1: Clone and Setup

```bash
cd WaveMeet
cp .env.example .env
```

### Step 2: Start the Application

Using Docker Compose:
```bash
docker-compose up -d
```

Or using Make (recommended):
```bash
make setup
```

### Step 3: Wait for Services to Initialize

```bash
# Check status
docker-compose ps

# Watch logs
docker-compose logs -f
```

Wait until you see: `🚀 Server running on port 5000`

### Step 4: Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/health
- **Database Admin**: http://localhost:5050 (pgAdmin)

### Step 5: Create Test Account or Login

#### Option A: Register a New Account
1. Go to http://localhost:3000
2. Click "Sign up"
3. Fill in the form:
   - Username: `john_doe`
   - Email: `john@example.com`
   - Password: `password123`
4. Click "Sign Up"

#### Option B: Use Pre-loaded Test Account
Credentials are automatically created in the database:
- Email: `john@example.com`
- Email: `jane@example.com`
- Email: `bob@example.com`
- Email: `alice@example.com`

**Note**: Passwords are hashed. For demo, modify the init script to use bcrypt in production.

### Step 6: Start Chatting

1. Login to the app
2. From the sidebar, select another user to start a conversation
3. Type messages and send in real-time
4. See typing indicators when others type

## 📊 Useful Commands

```bash
# View logs
make logs              # All services
make logs-dev         # Dev container only
make logs-db          # Database only
make logs-redis       # Redis only

# Access terminals
make shell            # Container shell
make psql             # PostgreSQL
make redis-cli        # Redis

# Database operations
make db-init          # Initialize database
make db-reset         # Reset database
make status           # Check services status

# Development
make dev-backend      # Start backend dev server
make dev-frontend     # Start frontend dev server

# Cleanup
make down             # Stop all services
make clean            # Remove all data
make prune            # Clean Docker system
```

## 🐛 Troubleshooting

### Services won't start
```bash
# Check if ports are in use
lsof -i :3000
lsof -i :5000
lsof -i :5432

# Kill process on port (macOS)
kill -9 <PID>
```

### Database connection error
```bash
# Rebuild everything
make clean
make setup
```

### Can't access frontend
1. Check if container is running: `docker-compose ps`
2. View logs: `docker-compose logs dev`
3. Restart: `docker-compose restart`

### WebSocket connection issues
- Check browser console for errors
- Ensure backend is running: http://localhost:5000/health
- Check firewall settings

## 📝 File Structure Reference

```
├── frontend/           # React app
│   └── src/
│       ├── pages/      # LoginPage, RegisterPage, ChatPage
│       ├── components/ # Sidebar, ChatWindow, MessageBubble
│       └── api.js      # API calls
├── backend/            # Node.js/Express server
│   └── src/
│       └── server.js   # Main application
├── scripts/
│   └── init-db.sql     # Database schema
└── docker-compose.yml  # Service configuration
```

## 🔑 Important Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend API | 5000 | http://localhost:5000 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |
| pgAdmin | 5050 | http://localhost:5050 |

## 🔐 Default Credentials

**pgAdmin:**
- Email: `admin@admin.com`
- Password: `admin`

**PostgreSQL:**
- User: `postgres`
- Password: `postgres`
- Database: `wavemeet_db`

## 📚 Next Steps

1. **Explore the codebase**
   - Check `README.md` for full documentation
   - Review `DEPLOYMENT.md` for production setup

2. **Make it your own**
   - Modify UI in `frontend/src/components/`
   - Add features to `backend/src/server.js`
   - Update database schema in `scripts/init-db.sql`

3. **Deploy to production**
   - Read `DEPLOYMENT.md`
   - Set up SSL/HTTPS
   - Configure environment variables
   - Use strong passwords

## ⚡ Performance Tips

- Use `make logs-dev` to monitor during development
- Frontend auto-reloads on file changes
- Backend requires manual restart if you modify `server.js`
- Redis helps with caching (currently basic setup)

## 🆘 Get Help

1. Check logs: `docker-compose logs`
2. Review README.md for detailed documentation
3. Check DEPLOYMENT.md for production issues
4. Verify all services: `docker-compose ps`

## 🎉 You're All Set!

Your WaveMeet application is now running. Start developing and enjoy real-time messaging! 

### Happy Coding! 🚀
