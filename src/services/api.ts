import { Token } from '@/types/Token';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use(
  (config) => {
    const token: Token = JSON.parse(localStorage.getItem('wallet-token') || 'null') as Token;
    if (token && config.url !== '/login' && config.url !== '/register') {
      config.headers.Authorization = `Bearer ${token.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('wallet-token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
