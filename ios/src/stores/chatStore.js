import { create } from 'zustand';
import { conversationsAPI } from '../services/api';

export const useChatStore = create((set, get) => ({
  conversations: [],
  messages: {},
  selectedConversation: null,
  isLoading: false,
  error: null,
  typingUsers: {},

  // Fetch all conversations
  fetchConversations: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await conversationsAPI.getAll();
      set({ conversations: response.data, isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch messages for a conversation
  fetchMessages: async (conversationId, limit = 50, offset = 0) => {
    try {
      set({ isLoading: true, error: null });
      const response = await conversationsAPI.getMessages(
        conversationId,
        limit,
        offset
      );
      
      const messages = get().messages;
      set({
        messages: {
          ...messages,
          [conversationId]: response.data,
        },
        isLoading: false,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Create new conversation
  createConversation: async (participantIds, name) => {
    try {
      set({ isLoading: true, error: null });
      const response = await conversationsAPI.create(participantIds, name);
      const conversation = response.data;

      set((state) => ({
        conversations: [conversation, ...state.conversations],
        isLoading: false,
      }));

      return { success: true, data: conversation };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Send message
  sendMessage: async (conversationId, content, mediaUrl = null) => {
    try {
      const response = await conversationsAPI.sendMessage(
        conversationId,
        content,
        mediaUrl
      );
      const message = response.data;

      set((state) => {
        const messages = state.messages[conversationId] || [];
        return {
          messages: {
            ...state.messages,
            [conversationId]: [...messages, message],
          },
        };
      });

      return { success: true, data: message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Add received message
  addMessage: (conversationId, message) => {
    set((state) => {
      const messages = state.messages[conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...messages, message],
        },
      };
    });
  },

  // Update typing users
  setTypingUser: (conversationId, userId, isTyping) => {
    set((state) => {
      const typingUsers = state.typingUsers[conversationId] || {};
      if (isTyping) {
        typingUsers[userId] = true;
      } else {
        delete typingUsers[userId];
      }

      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: typingUsers,
        },
      };
    });
  },

  // Select conversation
  selectConversation: (conversationId) => {
    set({ selectedConversation: conversationId });
  },

  clearError: () => set({ error: null }),
}));
