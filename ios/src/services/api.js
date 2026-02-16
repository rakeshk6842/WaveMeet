import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email, password, name) =>
    api.post('/auth/register', { email, password, name }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  verifyToken: () =>
    api.get('/auth/verify'),
};

export const contactsAPI = {
  getAll: () =>
    api.get('/contacts'),
  
  search: (query) =>
    api.get('/contacts/search', { params: { q: query } }),
};

export const conversationsAPI = {
  getAll: () =>
    api.get('/conversations'),
  
  create: (participantIds, name) =>
    api.post('/conversations', { participantIds, name }),
  
  getMessages: (conversationId, limit = 50, offset = 0) =>
    api.get(`/conversations/${conversationId}/messages`, {
      params: { limit, offset },
    }),
  
  sendMessage: (conversationId, content, mediaUrl = null) =>
    api.post(`/conversations/${conversationId}/messages`, {
      content,
      mediaUrl,
    }),
  
  updateStatus: (conversationId) =>
    api.put(`/conversations/${conversationId}/status`),
};

export const usersAPI = {
  getProfile: () =>
    api.get('/users/profile'),
  
  updateProfile: (name, status, avatar) =>
    api.put('/users/profile', { name, status, avatar }),
  
  getById: (userId) =>
    api.get(`/users/${userId}`),
};

export default api;
