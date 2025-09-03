// src/services/login.service.js
import api from './api';

const loginService = {
  // ✅ Handle employee login
  login: async (formData) => {
    try {
      const response = await api.post('/employees/login', formData);

      // ✅ Save token only on success
      if (response.data?.token) {
        localStorage.setItem('employee_token', response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);

      return {
        status: 'error',
        message:
          error.response?.data?.message ||
          'Network or server error. Please try again.',
      };
    }
  },

  // ✅ Handle employee logout
  logOut: () => {
    localStorage.removeItem('employee_token');
  },
};

export default loginService;
