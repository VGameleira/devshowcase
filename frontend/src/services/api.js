import axios from 'axios';
import { getToken } from './authHelper';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/devshowcase/backend/api',
});

// Anexa o token automaticamente em toda requisição
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;