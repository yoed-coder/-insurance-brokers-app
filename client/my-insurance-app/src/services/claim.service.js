// src/services/claim.service.js
import api from './api';

const claimService = {
  // ✅ Add a new claim
  addClaim: async (formData) => {
    try {
      const response = await api.post('/claim', formData);
      if (response.data && response.data.success !== false) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to create claim');
      }
    } catch (err) {
      console.error('Add claim failed:', err);
      throw new Error(err.response?.data?.message || err.message);
    }
  },

  // ✅ Get all claims (always returns an array)
  getAllClaims: async () => {
    try {
      const response = await api.get('/claims');
      const data = response.data;

      if (Array.isArray(data)) return data;
      if (Array.isArray(data.data)) return data.data;

      return [];
    } catch (err) {
      console.error('Get all claims failed:', err);
      return [];
    }
  },

  // ✅ Update a claim by ID
  updateClaim: async (claimId, updateData) => {
    try {
      const response = await api.put(`/claim/${claimId}`, updateData);
      return response.data;
    } catch (err) {
      console.error('Update claim failed:', err);
      throw new Error(err.response?.data?.message || 'Failed to update claim');
    }
  },

  // ✅ Delete a claim by ID
  deleteClaim: async (claimId) => {
    try {
      const response = await api.delete(`/claim/${claimId}`);
      return response.data;
    } catch (err) {
      console.error('Delete claim failed:', err);
      throw new Error(err.response?.data?.message || 'Failed to delete claim');
    }
  },
};

export default claimService;
