import api from './api';

const aiService = {
  generateLetter: async ({ entityType, entityId, letterType, instructions }) => {
    // POST /insured/letter or /insurer/letter dynamically
    return api.post(`/${entityType}/letter`, {
      [`${entityType}Id`]: entityId,
      letterType,
      instructions
    });
  },
};

export default aiService;
