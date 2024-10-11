import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use(
  (config) => {
    console.log(config);
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
