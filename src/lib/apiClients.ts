import axios, { type AxiosRequestHeaders, type InternalAxiosRequestConfig } from 'axios';
import { getAuthToken } from './cookies';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URI || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// interceptor để tự động gắn token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) {
    // ép headers về đúng type AxiosRequestHeaders
    const headers = (config.headers || {}) as AxiosRequestHeaders;
    headers['Authorization'] = `Bearer ${token}`;
    config.headers = headers;
  }
  return config;
});
