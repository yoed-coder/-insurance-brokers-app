import api from './api';

const commissionService = {
  // ✅ Get all policies commission status
  getCommissionStatus: async (token) => {
    try {
      const response = await api.get('/commission/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching commission status:", error);
      throw error;
    }
  },

  // ✅ Add a commission payment
  addCommissionPayment: async (formData, token) => {
    try {
      const response = await api.post('/commission/add', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error adding commission payment:", error);
      throw error;
    }
  },

  // ✅ Update commission status
  updateCommissionStatus: async (policyId, status, token) => {
    try {
      const response = await api.put(
        `/commission/${policyId}/status`,
        { commission_status: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error updating commission status:", error);
      throw error;
    }
  },

  // ✅ Update commission details (inline edit)
  updateCommissionDetails: async (policyId, updateData, token) => {
    try {
      const response = await api.put(
        `/commission/${policyId}`,   // matches backend route
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error updating commission details:", error);
      throw error;
    }
  },
};

export default commissionService;
