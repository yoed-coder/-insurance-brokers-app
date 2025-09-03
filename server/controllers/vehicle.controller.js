const vehicleService = require('../services/vehicle.service');

exports.addPlatesForPolicy = async (req, res) => {
  try {
    const { policy_id, plates } = req.body;

    if (!policy_id || !Array.isArray(plates) || plates.length === 0) {
      return res.status(400).json({ success: false, message: 'Policy ID and plates are required' });
    }

    await vehicleService.addPlatesForPolicy(policy_id, plates);

    res.status(200).json({ success: true, message: 'Plate numbers saved successfully' });
  } catch (error) {
    console.error('Error saving plates:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to save plates' });
  }
};
