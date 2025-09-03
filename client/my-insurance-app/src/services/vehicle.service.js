import api from './api'; // Axios instance

const addPlatesForPolicy = (policyId, plates) => {
  return api.post('/vehicle/add', {
    policy_id: policyId,
    plates
  });
};

export default { addPlatesForPolicy };
