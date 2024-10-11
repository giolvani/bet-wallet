import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wallet-token');
    if (token && config.url !== '/login' && config.url !== '/register') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
