// src/services/policy.service.js
import api from './api';

const policyService = {
  // ✅ Get all policies
  getAllPolicies: async () => {
    try {
      console.log("📌 [PolicyService] Fetching policies...");
      const response = await api.get('/policies');
      console.log("✅ [PolicyService] Policies fetched:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ [PolicyService] Fetch failed:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to fetch policies');
    }
  },

  // ✅ Create policy
  createPolicy: async (formData) => {
    try {
      console.log("📌 [PolicyService] Creating policy:", formData);
      const response = await api.post('/policy', formData);
      console.log("✅ [PolicyService] Policy created:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ [PolicyService] Create failed:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to create policy');
    }
  },

  // ✅ Update policy
  updatePolicy: async (policyId, updateData) => {
    try {
      console.log(`📌 [PolicyService] Updating policy ID ${policyId}:`, updateData);
      const response = await api.put(`/policy/${policyId}`, updateData);
      console.log("✅ [PolicyService] Policy updated:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ [PolicyService] Update failed:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to update policy');
    }
  },

  // ✅ Delete policy
  deletePolicy: async (policyId) => {
    try {
      console.log(`📌 [PolicyService] Deleting policy ID ${policyId}`);
      const response = await api.delete(`/policy/${policyId}`);
      console.log("✅ [PolicyService] Policy deleted:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ [PolicyService] Delete failed:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to delete policy');
    }
  },
};

export default policyService;
