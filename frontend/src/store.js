import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  login: (user, token) => set({ user, token, error: null }),
  logout: () => set({ user: null, token: null }),
}))

export const useChatStore = create((set) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  contacts: [],
  activeUsers: [],
  typingUsers: {},

  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  setContacts: (contacts) => set({ contacts }),
  setActiveUsers: (activeUsers) => set({ activeUsers }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  addConversation: (conversation) => set((state) => ({
    conversations: [conversation, ...state.conversations]
  })),

  addTypingUser: (userId, username) => set((state) => ({
    typingUsers: { ...state.typingUsers, [userId]: username }
  })),

  removeTypingUser: (userId) => set((state) => {
    const { [userId]: _, ...rest } = state.typingUsers
    return { typingUsers: rest }
  }),
}))
