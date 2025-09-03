// services/customer.service.js
import api from './api';

const getAll = () => api.get('/customers'); // Adjust endpoint as per your backend

export default { getAll };
