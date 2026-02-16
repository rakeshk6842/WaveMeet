import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  // Initialize auth state from storage
  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      const token = await AsyncStorage.getItem('authToken');
      const user = await AsyncStorage.getItem('user');

      if (token && user) {
        set({
          token,
          user: JSON.parse(user),
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Register user
  register: async (email, password, name) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authAPI.register(email, password, name);
      const { user, token } = response.data;

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, data: user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authAPI.login(email, password);
      const { user, token } = response.data;

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, data: user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  updateProfile: async (updates) => {
    try {
      set({ isLoading: true });
      const currentUser = get().user;
      const updatedUser = { ...currentUser, ...updates };

      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });

      return { success: true, data: updatedUser };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  clearError: () => set({ error: null }),
}));
