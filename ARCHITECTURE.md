# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Client Applications                          │
│                   (Web Browser - React)                         │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
            HTTP/REST          WebSocket (Socket.io)
                    │                     │
        ┌───────────▼──────────┬──────────▼──────────┐
        │                      │                     │
        │  ┌──────────────────┐│  ┌────────────────┐ │
        │  │  REST API Calls  ││  │  Real-time    │ │
        │  │  - Auth          ││  │  - Messaging  │ │
        │  │  - Contacts      ││  │  - Typing     │ │
        │  │  - Messages      ││  │  - Online     │ │
        │  └──────────────────┘│  └────────────────┘ │
        │                      │                     │
        │    Express.js + Socket.io Server (Node.js) │
        │           (Port 5000)                      │
        └───────────┬──────────┬──────────┬──────────┘
                    │          │          │
          ┌─────────▼─┐  ┌─────▼────┐    │
          │           │  │          │    │
          │PostgreSQL │  │  Redis   │    │
          │(Port 5432)│  │(6379)    │    │
          │           │  │          │    │
          │ ┌───────┐ │  │┌──────┐  │    │
          │ │Users  │ │  ││Cache │  │    │
          │ │       │ │  ││      │  │    │
          │ │Convs  │ │  ││Sess. │  │    │
          │ │       │ │  ││      │  │    │
          │ │Msgs   │ │  │└──────┘  │    │
          │ └───────┘ │  │          │    │
          │           │  │          │    │
          └───────────┘  └──────────┘    │
                                         │
                         ┌───────────────▘
                         │
                    ┌────▼─────┐
                    │ File     │
                    │ Storage  │
                    │ (future) │
                    └──────────┘
```

## Container Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Docker Compose Network                      │
│  (whatsapp-network - bridge network)                       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Dev Container (RHEL 9 UBI)                         │  │
│  │  - Node.js + npm                                    │  │
│  │  - Python 3 + pip                                   │  │
│  │  - Git, build tools                                 │  │
│  │  - Port: 3000, 5000, 8000, 8080, 9000              │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  Frontend (React + Vite)                       │ │  │
│  │  │  http://localhost:3000                         │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  Backend (Express.js + Socket.io)             │ │  │
│  │  │  http://localhost:5000                        │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL (Alpine)                                │  │
│  │  - Port: 5432                                       │  │
│  │  - Volume: postgres_data                            │  │
│  │  - Database: whatsapp_db                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Redis (Alpine)                                     │  │
│  │  - Port: 6379                                       │  │
│  │  - Volume: redis_data                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  pgAdmin 4                                          │  │
│  │  - Port: 5050                                       │  │
│  │  - URL: http://localhost:5050                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
```
User Input
    │
    ▼
┌─────────────────────┐
│ LoginPage/Register  │
│ (React Component)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ authAPI.login()     │
│ (axios request)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ POST /api/auth/     │
│ login or register   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Express Middleware  │
│ - Parse body        │
│ - Validate input    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Database Query      │
│ - Check credentials │
│ - Get user info     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Generate JWT Token  │
│ - Sign with secret  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Return Token + User │
│ - Send to client    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Store Token         │
│ - localStorage      │
│ - Zustand store     │
└─────────────────────┘
```

### Messaging Flow
```
User Types Message
       │
       ▼
┌──────────────────────┐
│ ChatWindow Component │
│ - Input handler      │
│ - Emit socket event  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ emitMessage()        │
│ - Socket.io client   │
│ - send_message event │
└──────┬───────────────┘
       │
       ▼ WebSocket
┌──────────────────────┐
│ Socket.io Server     │
│ - Receive event      │
│ - Validate data      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Database Insert      │
│ - INSERT messages    │
│ - Save to PostgreSQL │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Broadcast to Clients │
│ - message_received   │
│ - Send to room       │
└──────┬───────────────┘
       │
       ▼ WebSocket
┌──────────────────────┐
│ Client Receives      │
│ - Parse message      │
│ - Add to store       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Update UI            │
│ - Add message bubble │
│ - Scroll to bottom   │
└──────────────────────┘
```

## Database Schema

```
┌─────────────────────┐
│      USERS          │
├─────────────────────┤
│ id (UUID, PK)       │
│ username (VARCHAR)  │
│ email (VARCHAR)     │
│ password_hash       │
│ status (VARCHAR)    │
│ profile_photo       │
│ bio (TEXT)          │
│ created_at          │
│ updated_at          │
└─────────────────────┘
         │
         │ (1:N)
         ▼
┌─────────────────────────────────┐
│ CONVERSATION_PARTICIPANTS       │
├─────────────────────────────────┤
│ id (UUID, PK)                   │
│ conversation_id (UUID, FK)      │
│ user_id (UUID, FK)              │
│ joined_at                       │
└─────────────────────────────────┘
         │
         │ (N:1)
         ▼
┌──────────────────────┐
│   CONVERSATIONS      │
├──────────────────────┤
│ id (UUID, PK)        │
│ name (VARCHAR)       │
│ is_group (BOOLEAN)   │
│ created_at           │
│ updated_at           │
└──────────────────────┘
         │
         │ (1:N)
         ▼
┌──────────────────────┐
│     MESSAGES         │
├──────────────────────┤
│ id (UUID, PK)        │
│ conversation_id (FK) │
│ sender_id (FK)       │
│ content (TEXT)       │
│ is_edited            │
│ is_deleted           │
│ created_at           │
│ updated_at           │
└──────────────────────┘
         │
         │ (1:N)
         ▼
┌──────────────────────┐
│      MEDIA           │
├──────────────────────┤
│ id (UUID, PK)        │
│ message_id (FK)      │
│ file_url (TEXT)      │
│ file_type (VARCHAR)  │
│ file_size (INTEGER)  │
│ created_at           │
└──────────────────────┘
```

## Frontend Component Tree

```
App
├── Router
│   ├── LoginPage
│   │   └── LoginForm
│   ├── RegisterPage
│   │   └── RegisterForm
│   └── ChatPage
│       ├── Sidebar
│       │   ├── Header
│       │   ├── SearchBar
│       │   └── ConversationList
│       │       └── ConversationItem (repeating)
│       └── ChatWindow
│           ├── ChatHeader
│           ├── MessageContainer
│           │   └── MessageBubble (repeating)
│           └── MessageInput
│               ├── Input field
│               └── Send button
```

## State Management (Zustand)

```
useAuthStore
├── user (User object)
├── token (JWT token)
├── isLoading (Boolean)
├── error (String or null)
├── setUser()
├── setToken()
├── login()
└── logout()

useChatStore
├── conversations (Array)
├── currentConversation (Object)
├── messages (Array)
├── contacts (Array)
├── activeUsers (Array)
├── typingUsers (Object)
├── setConversations()
├── setCurrentConversation()
├── setMessages()
├── setContacts()
├── setActiveUsers()
├── addMessage()
├── addConversation()
├── addTypingUser()
└── removeTypingUser()
```

## API Endpoints

```
Authentication
├── POST /api/auth/register
└── POST /api/auth/login

Conversations
├── GET /api/conversations
└── GET /api/conversations/:id/messages

Contacts
└── GET /api/contacts

Health
└── GET /health
```

## WebSocket Events

```
Client → Server
├── user_online (userId)
├── send_message ({ conversationId, senderId, content })
├── join_conversation (conversationId)
├── leave_conversation (conversationId)
├── typing ({ conversationId, userId, username })
└── stop_typing ({ conversationId, userId })

Server → Client
├── users_online ([userIds])
├── message_received ({ id, sender_id, content, created_at, conversationId })
├── user_typing ({ userId, username })
└── user_stop_typing ({ userId })
```

## Deployment Architecture

### Docker Compose (Development)
```
Docker Host
├── Network (whatsapp-network)
├── Dev Container (RHEL 9)
├── PostgreSQL Container
├── Redis Container
└── pgAdmin Container
```

### Kubernetes (Production)
```
K8s Cluster
├── Namespace: whatsapp
├── Deployments
│   ├── backend (3 replicas)
│   ├── frontend (2 replicas)
│   ├── postgres (1 replica)
│   └── redis (1 replica)
├── Services (LoadBalancer)
│   ├── backend-svc
│   └── frontend-svc
├── Secrets
│   ├── db-secrets
│   └── app-secrets
└── PersistentVolumeClaims
    ├── postgres-pvc
    └── redis-pvc
```

---

This architecture provides:
- ✅ Scalable microservices
- ✅ Real-time communication
- ✅ Data persistence
- ✅ Caching layer
- ✅ Container isolation
- ✅ Easy deployment
- ✅ Production-ready setup
