const insuredService = require('../services/insured.service');


exports.createInsured = async (req, res) => {
  try {
    const { insured_name } = req.body;

    if (!insured_name) {
      return res.status(400).json({ message: 'insured_name is required' });
    }

    const result = await insuredService.createInsured({ insured_name });
    res.status(201).json({ message: 'Insured created', insuredId: result.insertId });
  } catch (error) {
    console.error('Error creating insured:', error);
    res.status(500).json({ message: 'Failed to create insured' });
  }
};


exports.getAllInsureds = async (req, res) => {
  try {
    const insureds = await insuredService.getAllInsureds();
    res.status(200).json(insureds);
  } catch (error) {
    console.error('Error fetching insureds:', error);
    res.status(500).json({ message: 'Failed to get insureds' });
  }
};

exports.updateInsured = async (req, res) => {
  try {
    const { id } = req.params;
    const { insured_name } = req.body;

    if (!insured_name) {
      return res.status(400).json({ message: 'insured_name is required' });
    }

    const result = await insuredService.updateInsured(id, { insured_name });
    res.status(200).json({ message: 'Insured updated' });
  } catch (error) {
    console.error('Error updating insured:', error);
    res.status(500).json({ message: 'Failed to update insured' });
  }
};

exports.deleteInsured = async (req, res) => {
  try {
    const { id } = req.params;
    await insuredService.deleteInsured(id);
    res.status(200).json({ message: 'Insured deleted' });
  } catch (error) {
    console.error('Error deleting insured:', error);
    res.status(500).json({ message: 'Failed to delete insured' });
  }
};
