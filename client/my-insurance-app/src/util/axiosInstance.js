// src/util/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create();

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('employee_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
