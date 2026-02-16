# Development Workflow Guide

## 🎯 Daily Development Workflow

### Morning: Start Development

```bash
# Navigate to project
cd /Users/rakeshkoripella/Desktop/projects/docker-ai-workspace

# Start all services
make setup

# Or if already running
make restart

# Watch logs
make logs-dev
```

### During Development

#### Working on Frontend

```bash
# Option 1: Using Vite dev server with hot reload
make dev-frontend

# Option 2: Inside container
make shell
cd /workspace/frontend
npm run dev

# Access at http://localhost:3000
```

**Frontend Development Tips:**
- Changes auto-reload with Vite
- React DevTools extension recommended
- Check browser console for errors
- Use React Router for navigation
- State persists via Zustand

#### Working on Backend

```bash
# Option 1: Using nodemon for auto-restart
make dev-backend

# Option 2: Inside container
make shell
cd /workspace/backend
npm run dev

# Access at http://localhost:5000/health
```

**Backend Development Tips:**
- Changes auto-reload with nodemon
- Check server logs for errors
- Use Postman/curl to test API
- Database queries logged to console
- WebSocket events visible in logs

#### Database Work

```bash
# Open PostgreSQL shell
make psql

# Common commands
\l                    # List databases
\dt                   # List tables
SELECT * FROM users;  # View data
\d users              # Table schema
```

**Database Tips:**
- Use pgAdmin (http://localhost:5050) for visual management
- Always backup before major changes
- Test migrations in dev first
- Index frequently queried columns
- Monitor slow queries with EXPLAIN

#### Redis/Caching

```bash
# Open Redis CLI
make redis-cli

# Common commands
KEYS *                # List all keys
GET key-name          # Get value
DEL key-name          # Delete key
FLUSHALL              # Clear all cache
MONITOR               # Watch commands
```

### Testing Your Changes

```bash
# Test API endpoints
curl http://localhost:5000/health

# Test WebSocket connection
# Use browser console in DevTools:
const socket = io('http://localhost:5000');
socket.on('users_online', console.log);

# Test database
make psql
SELECT COUNT(*) FROM users;

# Test frontend
# Open http://localhost:3000 in browser
```

### Evening: Before Committing

```bash
# Lint code
make lint

# Check for errors
npm run build

# View git status
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to remote
git push origin main
```

## 🔧 Common Development Tasks

### Adding a New API Endpoint

1. **Add route in backend/src/server.js:**
```javascript
app.post('/api/new-feature', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM table WHERE id = $1', [req.body.id])
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

2. **Add API method in frontend/src/api.js:**
```javascript
export const chatAPI = {
  // ... existing methods
  newFeature: (data) => apiClient.post('/new-feature', data),
}
```

3. **Use in component:**
```javascript
import { chatAPI } from '../api'

const response = await chatAPI.newFeature({ id: 123 })
```

4. **Test:**
```bash
curl -X POST http://localhost:5000/api/new-feature \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id": 123}'
```

### Adding a New React Component

1. **Create file** `frontend/src/components/NewComponent.jsx`:
```javascript
import { useState } from 'react'
import { useChatStore } from '../store'

export default function NewComponent() {
  const { data } = useChatStore()
  const [state, setState] = useState(null)

  return (
    <div className="p-4">
      {/* Component JSX */}
    </div>
  )
}
```

2. **Import in parent:**
```javascript
import NewComponent from '../components/NewComponent'

// In JSX
<NewComponent />
```

3. **Test in browser:**
- Open DevTools
- Check for errors
- Test interactions

### Modifying Database Schema

1. **Update schema in scripts/init-db.sql:**
```sql
ALTER TABLE users ADD COLUMN new_field VARCHAR(100);
CREATE INDEX idx_new_field ON users(new_field);
```

2. **Apply changes:**
```bash
make db-reset
```

3. **Update queries in backend:**
```javascript
const query = 'SELECT id, username, new_field FROM users WHERE id = $1'
```

4. **Update frontend types/usage as needed**

### Adding Dependencies

**Backend:**
```bash
cd backend
npm install new-package
git add package.json package-lock.json
```

**Frontend:**
```bash
cd frontend
npm install new-package
git add package.json package-lock.json
```

**Inside container:**
```bash
make shell
cd /workspace/backend  # or frontend
npm install new-package
```

## 🐛 Debugging Guide

### Frontend Issues

```javascript
// In browser console
// Check React state
import { useChatStore } from './store'
useChatStore.getState()

// Check Socket.io connection
const socket = io('http://localhost:5000')
socket.connected

// Check localStorage
localStorage.getItem('token')

// Check API calls
// Open Network tab in DevTools
```

### Backend Issues

```bash
# Check server logs
make logs-dev

# Check specific service logs
make logs-db
make logs-redis

# Connect to server
make shell

# Check node processes
ps aux | grep node

# Test database
make psql
```

### Database Issues

```bash
# Check database connection
make psql
SELECT 1;

# Check table structure
\d users

# Check data
SELECT * FROM users LIMIT 5;

# Check indexes
SELECT * FROM pg_indexes WHERE tablename = 'users';

# Monitor queries
EXPLAIN ANALYZE SELECT * FROM messages WHERE conversation_id = '...';
```

## 📊 Performance Optimization Workflow

### Profile Frontend

```javascript
// Use React DevTools Profiler
// Open DevTools → Profiler tab
// Record interactions
// Check component renders
```

### Profile Backend

```bash
# Check response times
curl -w "Response time: %{time_total}s\n" http://localhost:5000/api/contacts

# Monitor database queries
make psql
# Enable query logging in PostgreSQL
ALTER SYSTEM SET log_min_duration_statement = 100;

# Monitor memory usage
docker stats whatsapp-dev-container
```

### Optimize Queries

```bash
# Analyze slow queries
EXPLAIN ANALYZE SELECT * FROM messages WHERE created_at > NOW() - INTERVAL '1 day';

# Add indexes if needed
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

# Check index usage
SELECT * FROM pg_stat_user_indexes;
```

## 📝 Code Style & Quality

### Linting

```bash
# Check for issues
make lint

# Frontend
cd frontend && npm run lint

# Backend
cd backend && npm run lint
```

### Code Formatting

```bash
# Format code (if configured)
make format

# Manual format with prettier (if installed)
npx prettier --write src/
```

### Best Practices

- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Handle errors properly
- Use constants for magic numbers
- Write DRY (Don't Repeat Yourself) code

## 🚀 Deployment Workflow

### Pre-deployment Checklist

```bash
# ✅ Run tests
npm test

# ✅ Check linting
make lint

# ✅ Build for production
npm run build

# ✅ Check for console errors
# Review browser console

# ✅ Check database migrations
# Ensure all migrations applied

# ✅ Update environment variables
# Review .env for production values

# ✅ Create git tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# ✅ Push to remote
git push origin main
git push origin v1.0.0
```

### Deploy to Kubernetes

```bash
# Build images
docker build -t registry/backend:latest -f backend/Dockerfile .
docker build -t registry/frontend:latest -f frontend/Dockerfile .

# Push to registry
docker push registry/backend:latest
docker push registry/frontend:latest

# Deploy
kubectl apply -f k8s/

# Verify
kubectl get all -n whatsapp
kubectl logs deployment/backend -n whatsapp
```

## 🔄 Git Workflow

### Feature Development

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Keep updated with main
git fetch origin
git rebase origin/main

# Push branch
git push origin feature/new-feature

# Create pull request on GitHub

# After review and merge, delete branch
git branch -d feature/new-feature
```

### Bug Fixes

```bash
# Create hotfix branch
git checkout -b fix/bug-name

# Make fix and commit
git add .
git commit -m "fix: resolve bug"

# Push and create PR
git push origin fix/bug-name
```

## ⏰ Time-saving Tips

1. **Use Makefile** - Avoid typing long commands
2. **Terminal aliases** - `alias ws='cd /path && make shell'`
3. **Save API requests** - Use Postman/Insomnia
4. **Hot reload** - Vite reloads automatically
5. **Database backups** - Regular backups prevent disasters
6. **Docker cache** - Builds are faster after first build
7. **Multiple terminals** - One for logs, one for development

## 📚 Reference

### Useful Commands Cheat Sheet

```bash
# Docker
docker-compose up -d              # Start
docker-compose down               # Stop
docker-compose logs -f            # View logs
docker-compose ps                 # Status
docker exec -it container /bin/bash  # Shell

# Make
make help                          # Show all commands
make setup                         # Full setup
make shell                         # Container shell
make psql                          # Database shell
make redis-cli                     # Redis shell

# Git
git status                         # Check status
git diff                           # View changes
git log --oneline                  # View history
git reset --hard HEAD~1            # Undo last commit

# npm
npm install                        # Install dependencies
npm start                          # Start dev server
npm run build                      # Build for production
npm test                           # Run tests
npm run lint                       # Check code style

# curl
curl http://localhost:5000/health  # Test API
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass"}'
```

---

**Happy Coding! Remember to commit often and write meaningful commit messages.** 🚀
