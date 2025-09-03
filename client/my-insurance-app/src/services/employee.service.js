// src/services/employee.service.js
import api from './api';

const employeeService = {
  // ✅ Get all employees
  getAllEmployees: async () => {
    try {
      console.log("📌 [EmployeeService] Fetching employees...");
      const response = await api.get('/employees');
      console.log("✅ [EmployeeService] Employees fetched:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ [EmployeeService] Fetch failed:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to fetch employees');
    }
  },

  // ✅ Create employee
  createEmployee: async (formData) => {
    try {
      console.log("📌 [EmployeeService] Creating employee:", formData);
      const response = await api.post('/employee', formData);
      console.log("✅ [EmployeeService] Employee created:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ [EmployeeService] Create failed:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to create employee');
    }
  },

  // ✅ Update employee
  updateEmployee: async (employeeId, updateData) => {
    try {
      console.log(`📌 [EmployeeService] Updating employee ID ${employeeId}:`, updateData);
      const response = await api.put(`/employees/${employeeId}`, updateData);
      console.log("✅ [EmployeeService] Employee updated:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ [EmployeeService] Update failed:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to update employee');
    }
  },

  // ✅ Delete employee
  deleteEmployee: async (employeeId) => {
    try {
      console.log(`📌 [EmployeeService] Deleting employee ID ${employeeId}`);
      const response = await api.delete(`/employees/${employeeId}`);
      console.log("✅ [EmployeeService] Employee deleted:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ [EmployeeService] Delete failed:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to delete employee');
    }
  },
};

export default employeeService;
