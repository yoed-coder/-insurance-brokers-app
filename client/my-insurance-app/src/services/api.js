import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3145/api',  // Adjust if needed
});

// Intercept every request and add token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('employee_token');  // Use your actual token key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
