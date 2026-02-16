# ✅ Setup & Verification Checklist

Use this checklist to verify your WhatsApp Clone setup is complete and working correctly.

## 🎯 Pre-Setup Checklist

- [ ] Docker Desktop installed and running
- [ ] macOS (or Linux/WSL 2 for Windows)
- [ ] Terminal/shell ready
- [ ] Project folder accessible
- [ ] At least 4GB free disk space
- [ ] Internet connection available for downloading images
- [ ] VS Code installed (optional, for Dev Container)

## 📦 Project Files Setup

### Essential Files Created
- [ ] `.devcontainer/devcontainer.json` - Dev container config
- [ ] `.devcontainer/Dockerfile` - RHEL 9 image
- [ ] `.devcontainer/post-create.sh` - Setup script
- [ ] `docker-compose.yml` - Service orchestration
- [ ] `backend/package.json` - Backend dependencies
- [ ] `backend/src/server.js` - Express app
- [ ] `frontend/package.json` - Frontend dependencies
- [ ] `frontend/vite.config.js` - Build configuration
- [ ] `frontend/index.html` - HTML entry point
- [ ] `scripts/init-db.sql` - Database schema
- [ ] `.env.example` - Environment template
- [ ] `.gitignore` - Git exclusions

### Documentation Files Created
- [ ] `README.md` - Main documentation
- [ ] `QUICKSTART.md` - Quick start guide
- [ ] `ARCHITECTURE.md` - Architecture diagrams
- [ ] `DEPLOYMENT.md` - Deployment guide
- [ ] `DEVELOPMENT_WORKFLOW.md` - Development guide
- [ ] `PROJECT_SUMMARY.md` - Project overview
- [ ] `DOCUMENTATION_INDEX.md` - Doc index

### Configuration Files Created
- [ ] `Makefile` - Development commands
- [ ] `backend/.eslintrc.json` - Backend linting
- [ ] `frontend/.eslintrc.json` - Frontend linting
- [ ] `frontend/tailwind.config.js` - CSS config
- [ ] `frontend/postcss.config.js` - PostCSS config

## 🚀 Initial Setup & Start

### Step 1: Prepare Environment
```bash
cd /Users/rakeshkoripella/Desktop/projects/docker-ai-workspace
cp .env.example .env
```
- [ ] `.env` file created
- [ ] Reviewed `.env` for required variables
- [ ] All main variables have values

### Step 2: Build & Start Services
```bash
make setup
# Or: docker-compose up -d
```
- [ ] No build errors
- [ ] All containers started successfully
- [ ] Checked with `docker-compose ps`

### Step 3: Verify Services Running
```bash
make status
# Or: docker-compose ps
```

Verify all services:
- [ ] **dev** container - RUNNING
- [ ] **postgres** container - RUNNING
- [ ] **redis** container - RUNNING
- [ ] **pgadmin** container - RUNNING

### Step 4: Verify Database
```bash
make psql
# In psql shell:
\l
\dt
SELECT COUNT(*) FROM users;
```
- [ ] Can connect to PostgreSQL
- [ ] `whatsapp_db` database exists
- [ ] Tables created (users, conversations, etc.)
- [ ] Sample data exists (~4 users)

## 🌐 Service Connectivity Checks

### Frontend Service
```bash
curl http://localhost:3000
```
- [ ] HTTP 200 response
- [ ] HTML content returned
- [ ] Browser can access http://localhost:3000

### Backend API
```bash
curl http://localhost:5000/health
```
- [ ] HTTP 200 response
- [ ] JSON response: `{"status":"OK"}`

### PostgreSQL
```bash
docker-compose exec postgres pg_isready
```
- [ ] Returns: "accepting connections"

### Redis
```bash
docker-compose exec redis redis-cli ping
```
- [ ] Returns: "PONG"

### pgAdmin
- [ ] Browser access http://localhost:5050 works
- [ ] Login with email: `admin@admin.com`
- [ ] Can see PostgreSQL server in pgAdmin

## 🔐 Authentication & User Tests

### Test User Registration
1. Open http://localhost:3000
2. Click "Sign up"
3. Enter test details:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `testpass123`
4. Click "Sign Up"

- [ ] Registration succeeds
- [ ] Redirected to chat page
- [ ] User appears in database

### Test User Login
1. Go to http://localhost:3000/login
2. Enter credentials:
   - Email: `john@example.com`
   - Password: (from database - likely hashed)
3. Click "Sign In"

- [ ] Can access login page
- [ ] Form submits without errors
- [ ] Note: May need to update password in DB if hashed

### Test Auth Token
1. Open browser DevTools
2. Go to Application/Storage → Local Storage
3. Check for `token` and `user` keys

- [ ] `token` value present and long string
- [ ] `user` contains user object with id, username, email

## 💬 Real-Time Messaging Tests

### Test WebSocket Connection
1. Open browser DevTools → Console
2. Run:
```javascript
const socket = io('http://localhost:5000');
socket.on('connect', () => console.log('Connected!'));
socket.on('users_online', (users) => console.log('Online users:', users));
```
- [ ] "Connected!" logged to console
- [ ] Online users list received

### Test Message Sending
1. Login with first user
2. Select a conversation from sidebar
3. Type test message
4. Click Send

- [ ] Message appears in chat
- [ ] Message persisted in database
- [ ] Timestamp shows correct time

### Test Typing Indicator
1. In message input, start typing
2. Watch for "typing..." indicator

- [ ] Indicator appears in chat header
- [ ] Disappears after stopping typing

## 📊 Database Verification

### Check Schema
```bash
make psql
\d                    # List all tables
\d users              # Check users table
SELECT * FROM users;  # View user data
```

Verify these tables exist:
- [ ] `users`
- [ ] `conversations`
- [ ] `conversation_participants`
- [ ] `messages`
- [ ] `media`

Verify indexes exist:
- [ ] `idx_messages_created_at`
- [ ] `idx_users_email`
- [ ] `idx_users_username`

### Check Data
```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM conversations;
SELECT COUNT(*) FROM messages;
```

- [ ] Users table has data
- [ ] Conversations created after login
- [ ] Messages table populated

## 🔧 Development Environment Tests

### Test Backend Dev Server
```bash
make dev-backend
# Check output for: "🚀 Server running on port 5000"
```
- [ ] Server starts without errors
- [ ] Listens on port 5000
- [ ] Auto-reloads on file changes

### Test Frontend Dev Server
```bash
make dev-frontend
# Check output for: "ready in ... ms"
```
- [ ] Dev server starts without errors
- [ ] Listens on port 3000
- [ ] Hot module replacement working

### Test Code Quality
```bash
make lint
```
- [ ] ESLint runs without major errors
- [ ] Code style warnings shown (optional)

## 🐛 Troubleshooting Verification

### Test Container Shell
```bash
make shell
# Should open bash in container
```
- [ ] Can access container shell
- [ ] Can run commands

### Test Database Shell
```bash
make psql
# Should open PostgreSQL
```
- [ ] Can connect to database
- [ ] Can run SQL commands

### Test Redis CLI
```bash
make redis-cli
# Should open Redis CLI
```
- [ ] Can connect to Redis
- [ ] Can run Redis commands

## 📝 API Endpoint Tests

### Test Auth Endpoints
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"pass"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass"}'
```
- [ ] Register endpoint responds
- [ ] Login endpoint responds
- [ ] Tokens generated

### Test Protected Endpoints
```bash
# Get contacts (requires token)
curl http://localhost:5000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN"
```
- [ ] Requires authentication token
- [ ] Returns contact list when authenticated

## 🏗️ Container Health Checks

### Verify Health Checks
```bash
docker-compose ps
# Look at STATUS column
```

Each container should show:
- [ ] `dev` - healthy or running
- [ ] `postgres` - healthy
- [ ] `redis` - healthy
- [ ] `pgadmin` - running

### Check Docker Network
```bash
docker network ls
docker network inspect whatsapp-network
```

- [ ] `whatsapp-network` exists
- [ ] All containers connected to network
- [ ] Can ping between containers

## 📊 Performance Baseline

### Test Database Performance
```bash
make psql
EXPLAIN ANALYZE SELECT * FROM messages LIMIT 10;
```
- [ ] Queries execute in reasonable time
- [ ] No obvious performance issues

### Test API Response Time
```bash
time curl http://localhost:5000/health
```
- [ ] Response in under 100ms
- [ ] No timeouts

### Check Resource Usage
```bash
docker stats
```
- [ ] CPU usage reasonable (< 50% per container)
- [ ] Memory usage reasonable (< 300MB per container)

## 🔒 Security Verification

### Check Environment Variables
```bash
cat .env
```
- [ ] JWT_SECRET is set and not default
- [ ] DB_PASSWORD is set and not "postgres"
- [ ] No sensitive data in git

### Check .gitignore
```bash
git check-ignore .env node_modules package-lock.json
```
- [ ] .env is ignored
- [ ] node_modules ignored
- [ ] Lock files ignored

### Verify CORS
Open DevTools → Network tab and check API requests:
- [ ] No CORS errors
- [ ] `Access-Control-Allow-Origin` headers present

## 📚 Documentation Verification

- [ ] README.md exists and is readable
- [ ] QUICKSTART.md is clear and accurate
- [ ] ARCHITECTURE.md has diagrams
- [ ] DEPLOYMENT.md has deployment guides
- [ ] All docs have correct file paths
- [ ] All links work

## 🎯 Final Verification Checklist

### All Services Running
- [ ] Frontend: http://localhost:3000 ✅
- [ ] Backend: http://localhost:5000/health ✅
- [ ] Database: Connection works ✅
- [ ] Redis: Connection works ✅
- [ ] pgAdmin: http://localhost:5050 ✅

### All Features Working
- [ ] User registration ✅
- [ ] User login ✅
- [ ] Message sending ✅
- [ ] Message receiving (WebSocket) ✅
- [ ] Typing indicators ✅
- [ ] Online status ✅
- [ ] Conversation listing ✅
- [ ] Contact listing ✅

### All Documentation Present
- [ ] README.md ✅
- [ ] QUICKSTART.md ✅
- [ ] ARCHITECTURE.md ✅
- [ ] DEPLOYMENT.md ✅
- [ ] DEVELOPMENT_WORKFLOW.md ✅
- [ ] PROJECT_SUMMARY.md ✅
- [ ] DOCUMENTATION_INDEX.md ✅

### All Code Files Present
- [ ] Backend files (server.js, package.json, middleware.js) ✅
- [ ] Frontend files (components, pages, utilities) ✅
- [ ] Database schema (init-db.sql) ✅
- [ ] Configuration files (docker-compose.yml, Makefile) ✅

## 🎉 Completion Status

- [ ] All sections completed
- [ ] No critical issues found
- [ ] System is ready for development
- [ ] System is ready for deployment

**Date Completed**: ________________
**Verified By**: ________________
**Notes**: 
```
[Add any additional notes or issues found]
```

---

## 🆘 If Anything Fails

Refer to:
1. [QUICKSTART.md](QUICKSTART.md) - Quick fixes
2. [README.md](README.md) - Troubleshooting section
3. [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md) - Debugging guide
4. Check logs: `docker-compose logs -f`

## ✨ Next Steps After Verification

- [ ] Read [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md)
- [ ] Read [README.md](README.md) - API reference
- [ ] Start developing features
- [ ] Create test cases
- [ ] Plan deployment

---

**Congratulations!** Your WhatsApp Clone is now fully set up and verified! 🚀
