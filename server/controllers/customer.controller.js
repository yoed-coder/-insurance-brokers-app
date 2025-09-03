const insuredService = require('../services/customer.service');
const aiService = require('../services/ai.service');


exports.getAllInsured = async (req, res) => {
  try {
    const insureds = await insuredService.getAllInsured();
    res.json(insureds);
  } catch (err) {
    console.error("getAllInsured error:", err);
    res.status(500).json({ message: 'Failed to fetch insureds' });
  }
};


exports.generateLetter = async (req, res) => {
  try {
    const { insuredId, letterType, instructions } = req.body;
    if (!insuredId) return res.status(400).json({ message: 'insuredId is required' });

    const insured = await insuredService.getInsuredById(insuredId);
    if (!insured) return res.status(404).json({ message: 'Insured not found' });

    const text = await aiService.generateLetter({ insured, letterType, instructions });
    res.json({ text });
  } catch (err) {
    console.error("Letter generation error:", err);
    res.status(500).json({ message: 'Failed to generate letter', error: err.message });
  }
};
