const insurerService = require('../services/insurer.service');

// Create a new insurer
exports.createInsurer = async (req, res) => {
  try {
    const { insurer_name } = req.body;

    if (!insurer_name) {
      return res.status(400).json({ message: 'insurer_name is required' });
    }

    const result = await insurerService.createInsurer(insurer_name);
    res.status(201).json({ message: 'Insurer created', insurerId: result.insertId });
  } catch (error) {
    console.error('Error creating insurer:', error);
    res.status(500).json({ message: 'Failed to create insurer' });
  }
};

// Get all insurers
exports.getAllInsurers = async (req, res) => {
  try {
    const insurers = await insurerService.getAllInsurers();
    res.status(200).json(insurers);
  } catch (error) {
    console.error('Error fetching insurers:', error);
    res.status(500).json({ message: 'Failed to get insurers' });
  }
};

// Update an insurer by ID
exports.updateInsurer = async (req, res) => {
  try {
    const { id } = req.params;
    const { insurer_name } = req.body;

    if (!insurer_name) {
      return res.status(400).json({ message: 'insurer_name is required' });
    }

    await insurerService.updateInsurer(id, insurer_name);
    res.status(200).json({ message: 'Insurer updated' });
  } catch (error) {
    console.error('Error updating insurer:', error);
    res.status(500).json({ message: 'Failed to update insurer' });
  }
};

// Delete an insurer by ID
exports.deleteInsurer = async (req, res) => {
  try {
    const { id } = req.params;
    await insurerService.deleteInsurer(id);
    res.status(200).json({ message: 'Insurer deleted' });
  } catch (error) {
    console.error('Error deleting insurer:', error);
    res.status(500).json({ message: 'Failed to delete insurer' });
  }
};
