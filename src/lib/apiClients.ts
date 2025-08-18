import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URI || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor để tự động gắn token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
