import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const getBaseUrl = () => {
  // 1. Explicitly configured server URL in app.json extra or environment
  const configuredUrl = Constants.expoConfig?.extra?.SERVER_URL || process.env.EXPO_PUBLIC_SERVER_URL;
  if (configuredUrl && configuredUrl.trim() !== '') {
    return configuredUrl.trim().replace(/\/$/, '');
  }

  // 2. Web Browser environment
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname || 'localhost';
    return `http://${host}:5000`;
  }

  // 3. Expo Go environment - extract host IP automatically
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:5000`;
  }

  // 4. Fallback Wi-Fi IP for standalone Android APKs
  const defaultWifiIp = '10.213.255.50';
  if (Platform.OS === 'android') {
    return `http://${defaultWifiIp}:5000`;
  }

  return 'http://localhost:5000';
};

export const API_BASE_URL = `${getBaseUrl()}/api`;
export const SOCKET_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Update base URL dynamically on each request
api.interceptors.request.use((config) => {
  config.baseURL = `${getBaseUrl()}/api`;
  return config;
});

// REST API Helper Methods
export const fetchChatHistory = async (limit = 100, offset = 0) => {
  const response = await api.get(`/messages?limit=${limit}&offset=${offset}`);
  return response.data.data;
};

export const sendMessageApi = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data.data;
};

export const loginUserApi = async (username) => {
  const response = await api.post('/users/login', { username });
  return response.data.data;
};

export const loginWithAuthApi = async (identifier, password) => {
  const response = await api.post('/users/login', { identifier, password });
  return response.data.data;
};

export const registerUserApi = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data.data;
};

export const forgotPasswordApi = async (identifier) => {
  const response = await api.post('/users/forgot-password', { identifier });
  return response.data;
};

export const resetPasswordApi = async ({ identifier, otp, newPassword }) => {
  const response = await api.post('/users/reset-password', { identifier, otp, newPassword });
  return response.data;
};

export const fetchUsersApi = async () => {
  const response = await api.get('/users');
  return response.data.data;
};

export const clearChatApi = async ({ userId1, userId2, targetId }) => {
  const response = await api.post('/messages/clear', { userId1, userId2, targetId });
  return response.data;
};

export const deleteUserApi = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export default api;
