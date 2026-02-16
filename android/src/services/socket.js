import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

let socket = null;

export const initializeSocket = async () => {
  if (socket) return socket;

  const token = await AsyncStorage.getItem('authToken');
  
  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket() first.');
  }
  return socket;
};

export const socketListeners = {
  // Message events
  onMessageReceive: (callback) => {
    getSocket().on('message:receive', callback);
  },

  onTypingStart: (callback) => {
    getSocket().on('typing:start', callback);
  },

  onTypingStop: (callback) => {
    getSocket().on('typing:stop', callback);
  },

  // User status events
  onUserOnline: (callback) => {
    getSocket().on('user:online', callback);
  },

  onUserOffline: (callback) => {
    getSocket().on('user:offline', callback);
  },

  // Conversation events
  onConversationCreated: (callback) => {
    getSocket().on('conversation:created', callback);
  },

  onConversationUpdated: (callback) => {
    getSocket().on('conversation:updated', callback);
  },
};

export const socketEmitters = {
  // Emit message
  sendMessage: (conversationId, content) => {
    getSocket().emit('message:send', { conversationId, content });
  },

  // Typing indicators
  startTyping: (conversationId) => {
    getSocket().emit('typing:start', { conversationId });
  },

  stopTyping: (conversationId) => {
    getSocket().emit('typing:stop', { conversationId });
  },

  // Status updates
  setOnline: () => {
    getSocket().emit('user:online');
  },

  setOffline: () => {
    getSocket().emit('user:offline');
  },
};

// Clean up listeners
export const removeSocketListener = (eventName) => {
  getSocket().off(eventName);
};

export const removeAllSocketListeners = () => {
  if (socket) {
    socket.removeAllListeners();
  }
};
