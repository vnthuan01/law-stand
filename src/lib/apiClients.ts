import axios from 'axios';
import { getAuthToken } from './cookies';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URI || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// interceptor để tự động gắn token
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    if (config.headers && typeof (config.headers as any).set === 'function') {
      (config.headers as any).set('Authorization', `Bearer ${token}`);
    } else {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});
