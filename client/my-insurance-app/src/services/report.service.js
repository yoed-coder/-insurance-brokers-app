import api from './api';

const reportService = {
  // ✅ Fetch expiring policies
  getExpiringPolicies: async (token) => {
    try {
      const response = await api.get('/expiring', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching expiring policies:", error);
      throw error;
    }
  },
};

export default reportService;
