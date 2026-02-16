import io from 'socket.io-client'

let socket = null

export const connectSocket = (token) => {
  if (socket) return socket

  socket = io('http://localhost:5000', {
    auth: {
      token
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  })

  socket.on('connect', () => {
    console.log('Connected to WebSocket server')
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server')
  })

  socket.on('error', (error) => {
    console.error('WebSocket error:', error)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket

export const subscribeToMessages = (conversationId, callback) => {
  if (!socket) return

  socket.emit('join_conversation', conversationId)
  socket.on('message_received', callback)

  return () => {
    socket.off('message_received', callback)
    socket.emit('leave_conversation', conversationId)
  }
}

export const subscribeToTyping = (conversationId, callback) => {
  if (!socket) return

  socket.on('user_typing', callback)
  socket.on('user_stop_typing', callback)

  return () => {
    socket.off('user_typing', callback)
    socket.off('user_stop_typing', callback)
  }
}

export const subscribeToOnlineUsers = (callback) => {
  if (!socket) return

  socket.on('users_online', callback)

  return () => {
    socket.off('users_online', callback)
  }
}

export const emitMessage = (conversationId, senderId, content) => {
  if (!socket) return

  socket.emit('send_message', {
    conversationId,
    senderId,
    content
  })
}

export const emitTyping = (conversationId, userId, username) => {
  if (!socket) return

  socket.emit('typing', {
    conversationId,
    userId,
    username
  })
}

export const emitStopTyping = (conversationId, userId) => {
  if (!socket) return

  socket.emit('stop_typing', {
    conversationId,
    userId
  })
}

export const userOnline = (userId) => {
  if (!socket) return

  socket.emit('user_online', userId)
}
