# WhatsApp Clone - RHEL 10 Development Container

A full-stack real-time messaging application built with Node.js, React, PostgreSQL, and Redis, running in a RHEL 10 development container.

## Features

- 🔐 User authentication (registration & login)
- 💬 Real-time messaging with WebSocket support
- 👥 Contact management
- 🔔 Typing indicators
- 📱 Responsive UI with Tailwind CSS
- 🗄️ PostgreSQL database
- 📦 Redis caching
- 🐳 Docker & Docker Compose setup

## Project Structure

```
.
├── .devcontainer/
│   ├── devcontainer.json      # Dev container configuration
│   ├── Dockerfile             # RHEL 10 based development image
│   └── post-create.sh         # Post-creation setup script
├── backend/
│   ├── src/
│   │   └── server.js          # Express + Socket.io server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── api.js            # API client
│   │   ├── socket.js         # WebSocket client
│   │   ├── store.js          # Zustand state management
│   │   ├── App.jsx           # Main App component
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── scripts/
│   └── init-db.sql           # Database initialization
├── docker-compose.yml        # Docker Compose configuration
└── .env.example              # Environment variables template
```

## Prerequisites

- Docker & Docker Compose installed
- macOS, Linux, or Windows with WSL 2
- VS Code (optional, for Dev Container support)

## Quick Start

### Option 1: Using Docker Compose

```bash
# Clone the repository
cd /path/to/docker-ai-workspace

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f dev

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# pgAdmin: http://localhost:5050 (admin@admin.com / admin)
# Redis: localhost:6379
```

### Option 2: Using VS Code Dev Container

1. Open the project in VS Code
2. Click the Remote Container icon in the bottom-left
3. Select "Reopen in Container"
4. Wait for the container to build and setup

## Services

### Development Container (RHEL 10)
- Node.js, npm, yarn
- Python 3 with Flask and tools
- Git, curl, wget, vim, nano
- Running on port 3000, 5000, 8000, 8080, 9000

### PostgreSQL
- Port: `5432`
- Database: `whatsapp_db`
- User: `postgres`
- Password: `postgres`
- Adminer UI: http://localhost:5050

### Redis
- Port: `6379`
- Used for caching and session management

### pgAdmin
- Port: `5050`
- Email: `admin@admin.com`
- Password: `admin`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Conversations
- `GET /api/conversations` - Get all user conversations
- `GET /api/conversations/:id/messages` - Get messages in conversation

### Contacts
- `GET /api/contacts` - Get available contacts

## WebSocket Events

### Client to Server
- `user_online` - User comes online
- `send_message` - Send a message
- `join_conversation` - Join a conversation room
- `leave_conversation` - Leave a conversation room
- `typing` - User is typing
- `stop_typing` - User stopped typing

### Server to Client
- `users_online` - List of online users
- `message_received` - New message received
- `user_typing` - User is typing
- `user_stop_typing` - User stopped typing

## Development

### Running in Dev Mode

Inside the container:

```bash
# Start backend (with auto-reload)
cd /workspace/backend
npm run dev

# In another terminal, start frontend
cd /workspace/frontend
npm run dev
```

### Building for Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Database Schema

### Users Table
- id (UUID)
- username (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- status (VARCHAR)
- profile_photo (TEXT)
- bio (TEXT)
- created_at, updated_at

### Conversations Table
- id (UUID)
- name (VARCHAR)
- is_group (BOOLEAN)
- created_at, updated_at

### Messages Table
- id (UUID)
- conversation_id (UUID, FK)
- sender_id (UUID, FK)
- content (TEXT)
- is_edited, is_deleted (BOOLEAN)
- created_at, updated_at

### Media Table
- id (UUID)
- message_id (UUID, FK)
- file_url (TEXT)
- file_type (VARCHAR)
- file_size (INTEGER)

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `BACKEND_PORT` - Express server port (default: 5000)
- `FRONTEND_PORT` - Vite dev server port (default: 3000)
- `DB_HOST` - PostgreSQL host
- `JWT_SECRET` - Secret key for JWT tokens
- `REDIS_HOST` - Redis connection host

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs dev

# Rebuild container
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database connection issues
```bash
# Check PostgreSQL is running
docker-compose logs postgres

# Reset database
docker-compose exec postgres dropdb whatsapp_db
docker-compose exec postgres createdb whatsapp_db
docker-compose exec postgres psql whatsapp_db < scripts/init-db.sql
```

### Port conflicts
Edit `docker-compose.yml` to use different ports:
```yaml
ports:
  - "3001:3000"  # Frontend
  - "5001:5000"  # Backend
```

## Testing

### Test user accounts (from init-db.sql):
- Email: `john@example.com` / Pass: `hashed_password_1`
- Email: `jane@example.com` / Pass: `hashed_password_2`
- Email: `bob@example.com` / Pass: `hashed_password_3`
- Email: `alice@example.com` / Pass: `hashed_password_4`

## Performance Tips

1. **Database Optimization**
   - Indexes are created on frequently queried columns
   - Use pagination for large message lists

2. **Frontend Optimization**
   - Vite is used for fast bundling
   - React lazy loading for components
   - Message virtualization for long conversations

3. **Redis Caching**
   - Cache conversation lists
   - Store online user status
   - Session management

## Security Considerations

⚠️ **This is a demo application. For production:**

1. Change `JWT_SECRET` to a strong random value
2. Hash passwords properly (use bcrypt in production)
3. Enable HTTPS/WSS
4. Add rate limiting
5. Implement proper authentication middleware
6. Use environment-specific configurations
7. Add CSRF protection
8. Validate and sanitize all inputs
9. Use secrets management for sensitive data

## Future Enhancements

- [ ] File/image uploads
- [ ] Group conversations
- [ ] Message encryption
- [ ] Voice/video calls
- [ ] User presence tracking
- [ ] Message reactions
- [ ] Search functionality
- [ ] User blocking
- [ ] Admin dashboard
- [ ] Mobile app (React Native)

## Contributing

Feel free to contribute to this project by opening issues and pull requests.

## License

MIT License

## Support

For issues and questions, please create a GitHub issue or contact the development team.

## Resources

- [Node.js Documentation](https://nodejs.org/)
- [React Documentation](https://react.dev/)
- [Socket.io Documentation](https://socket.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [RHEL Documentation](https://access.redhat.com/documentation/)

---

**Happy Coding! 🚀**
