import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useChatStore } from '../store'
import { chatAPI } from '../api'
import { connectSocket, disconnectSocket, userOnline } from '../socket'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import '../App.css'

export default function ChatPage() {
  const navigate = useNavigate()
  const { user, token, logout } = useAuthStore()
  const { setConversations, setCurrentConversation } = useChatStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || !token) {
      navigate('/login')
      return
    }

    // Connect to WebSocket
    const socket = connectSocket(token)
    userOnline(user.id)

    // Fetch initial data
    fetchConversations()
    
    return () => {
      // Cleanup on unmount
    }
  }, [user, token, navigate])

  const fetchConversations = async () => {
    try {
      setIsLoading(true)
      const response = await chatAPI.getConversations()
      setConversations(response.data)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    disconnectSocket()
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-whatsapp-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <Sidebar user={user} onLogout={handleLogout} onRefresh={fetchConversations} />
      <ChatWindow user={user} />
    </div>
  )
}
