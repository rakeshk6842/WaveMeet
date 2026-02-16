import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { createClient } from 'redis';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = createServer(app);

// Parse allowed CORS origins from environment
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map(origin => origin.trim())
  .filter(origin => origin && origin !== '*');

// Initialize Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is not set');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no Origin header (e.g., curl, same-origin)
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'postgres',
  database: process.env.DB_NAME || 'wavemeet_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Redis client
const redisClient = createClient({
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error);

// Store active users
const activeUsers = new Map();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userId = uuidv4();
    
    const query = `
      INSERT INTO users (id, username, email, password_hash, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, username, email
    `;
    
    const result = await pool.query(query, [userId, username, email, password]);
    res.json({ user: result.rows[0], token: jwt.sign({ userId, username }, process.env.JWT_SECRET) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const query = 'SELECT id, username, email FROM users WHERE email = $1 AND password_hash = $2';
    const result = await pool.query(query, [email, password]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET);
    
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get contacts
app.get('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT id, username, email, status FROM users 
      WHERE id != $1 
      LIMIT 50
    `;
    const result = await pool.query(query, [req.user.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get conversations
app.get('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT c.id, c.created_at, u.username, u.email
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      JOIN users u ON u.id = CASE 
        WHEN cp.user_id = $1 THEN (
          SELECT user_id FROM conversation_participants 
          WHERE conversation_id = c.id AND user_id != $1 LIMIT 1
        ) 
        ELSE cp.user_id 
      END
      WHERE cp.user_id = $1
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query, [req.user.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a conversation
app.get('/api/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const query = `
      SELECT m.id, m.sender_id, m.content, m.created_at, u.username
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC
      LIMIT 100
    `;
    const result = await pool.query(query, [conversationId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.io connection handlers
io.on('connection', (socket) => {
  console.log(`New user connected: ${socket.id}`);

  socket.on('user_online', (userId) => {
    activeUsers.set(userId, socket.id);
    io.emit('users_online', Array.from(activeUsers.keys()));
  });

  socket.on('send_message', async (data) => {
    try {
      const { conversationId, senderId, content } = data;
      const messageId = uuidv4();
      
      const query = `
        INSERT INTO messages (id, conversation_id, sender_id, content, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id, sender_id, content, created_at
      `;
      
      const result = await pool.query(query, [messageId, conversationId, senderId, content]);
      const message = result.rows[0];
      
      io.to(`conversation_${conversationId}`).emit('message_received', {
        ...message,
        conversationId
      });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
  });

  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
  });

  socket.on('typing', (data) => {
    io.to(`conversation_${data.conversationId}`).emit('user_typing', {
      userId: data.userId,
      username: data.username
    });
  });

  socket.on('stop_typing', (data) => {
    io.to(`conversation_${data.conversationId}`).emit('user_stop_typing', {
      userId: data.userId
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    for (let [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
      }
    }
    io.emit('users_online', Array.from(activeUsers.keys()));
  });
});

// Start server
const PORT = process.env.BACKEND_PORT || process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 WebSocket server ready on ws://localhost:${PORT}`);
});

export default app;
