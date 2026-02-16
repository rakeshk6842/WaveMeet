import { useState } from 'react'
import { useChatStore } from '../store'

export default function Sidebar({ user, onLogout, onRefresh }) {
  const { conversations, currentConversation, setCurrentConversation } = useChatStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredConversations = conversations.filter(conv =>
    conv.username?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Chats</h2>
          <div className="flex gap-2">
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              title="Refresh"
            >
              🔄
            </button>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          <p className="font-semibold text-gray-800">{user?.username}</p>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-wavemeet-green"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">No conversations yet</p>
              <p className="text-sm">Start a new chat to begin messaging</p>
            </div>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setCurrentConversation(conversation)}
              className={`conversation-item ${
                currentConversation?.id === conversation.id ? 'active' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-wavemeet-green flex items-center justify-center text-white font-semibold">
                  {conversation.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {conversation.username}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.email}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
