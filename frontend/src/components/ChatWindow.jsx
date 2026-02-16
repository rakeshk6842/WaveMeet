import { useState, useEffect, useRef } from 'react'
import { useChatStore } from '../store'
import { chatAPI } from '../api'
import { 
  subscribeToMessages, 
  subscribeToTyping, 
  emitMessage, 
  emitTyping, 
  emitStopTyping 
} from '../socket'
import MessageBubble from './MessageBubble'
import toast from 'react-hot-toast'

export default function ChatWindow({ user }) {
  const { currentConversation, messages, setMessages, typingUsers, addMessage } = useChatStore()
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load messages when conversation changes
  useEffect(() => {
    if (!currentConversation) return

    const loadMessages = async () => {
      try {
        setIsLoading(true)
        const response = await chatAPI.getMessages(currentConversation.id)
        setMessages(response.data)
      } catch (error) {
        console.error('Failed to load messages:', error)
        toast.error('Failed to load messages')
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()

    // Subscribe to new messages
    const unsubscribe = subscribeToMessages(currentConversation.id, (message) => {
      addMessage(message)
    })

    // Subscribe to typing indicators
    const unsubscribeTyping = subscribeToTyping(currentConversation.id, (data) => {
      // Handle typing indicators
    })

    return () => {
      unsubscribe?.()
      unsubscribeTyping?.()
    }
  }, [currentConversation, setMessages, addMessage])

  // Handle typing
  const handleInputChange = (e) => {
    const value = e.target.value
    setInputMessage(value)

    if (!isTyping && value.length > 0) {
      setIsTyping(true)
      emitTyping(currentConversation.id, user.id, user.username)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      emitStopTyping(currentConversation.id, user.id)
    }, 3000)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!inputMessage.trim() || !currentConversation) return

    emitMessage(currentConversation.id, user.id, inputMessage)
    setInputMessage('')
    setIsTyping(false)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  if (!currentConversation) {
    return (
      <div className="chat-area flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-xl font-semibold">Select a conversation</p>
          <p className="text-sm">Choose a chat from the left to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-area">
      {/* Chat Header */}
      <div className="chat-header">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {currentConversation.username}
          </h2>
          <p className="text-sm text-gray-600">
            {Object.keys(typingUsers).length > 0
              ? 'typing...'
              : 'Active now'}
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-whatsapp-green mx-auto mb-2"></div>
              <p>Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">No messages yet</p>
              <p className="text-sm">Start the conversation by sending a message</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_id === user.id}
                senderName={message.username}
              />
            ))}
            {Object.entries(typingUsers).map(([userId, username]) => (
              <div key={userId} className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="animate-bounce">●</span>
                <span>{username} is typing...</span>
              </div>
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="message-input-area">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          className="px-6 py-2 bg-whatsapp-green text-white rounded-full hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  )
}
