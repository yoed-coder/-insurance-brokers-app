const insurerService = require('../services/partner.service');
const aiService = require('../services/ai.service');

// GET /insurer
exports.getAllInsurers = async (req, res) => {
  try {
    const insurers = await insurerService.getAllInsurers();
    res.json(insurers);
  } catch (err) {
    console.error("getAllInsurers error:", err);
    res.status(500).json({ message: 'Failed to fetch insurers' });
  }
};

// POST /insurer/letter
exports.generateLetter = async (req, res) => {
  try {
    const { insurerId, letterType, instructions } = req.body;
    if (!insurerId) return res.status(400).json({ message: 'insurerId is required' });

    const insurer = await insurerService.getInsurerById(insurerId);
    if (!insurer) return res.status(404).json({ message: 'Insurer not found' });

    const text = await aiService.generateLetter({ insurer, letterType, instructions });
    res.json({ text });
  } catch (err) {
    console.error("Letter generation error:", err);
    res.status(500).json({ message: 'Failed to generate insurer letter', error: err.message });
  }
};
