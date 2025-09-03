const claimService = require('../services/claim.service');

// ✅ Create a new claim
exports.createClaim = async (req, res) => {
  console.log('✅ [POST] /api/claim endpoint hit');
  try {
    const claimData = req.body;
    const performerId = req.employee?.employee_id ?? null; // employee performing the action
    const result = await claimService.createClaim(claimData, performerId);

    res.status(201).json({
      success: true,
      message: 'Claim created successfully',
      claimId: result.insertId
    });
  } catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create claim'
    });
  }
};

// ✅ Get all claims
exports.getAllClaims = async (req, res) => {
  try {
    const claims = await claimService.getAllClaims();
    res.status(200).json({ success: true, data: claims });
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch claims' });
  }
};

// ✅ Get claims by insured ID
exports.getClaimsByInsuredId = async (req, res) => {
  try {
    const { insuredId } = req.params;
    const claims = await claimService.getClaimsByInsuredId(insuredId);
    res.status(200).json({ success: true, data: claims });
  } catch (error) {
    console.error('Error fetching claims by insured ID:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch claims' });
  }
};

// ✅ Update claim by ID
exports.updateClaim = async (req, res) => {
  const { id } = req.params;
  try {
    const performerId = req.employee?.employee_id ?? null;
    const result = await claimService.updateClaim(id, req.body, performerId);

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: 'Claim not found or nothing updated' });
    }

    res.json({ success: true, message: 'Claim updated successfully' });
  } catch (err) {
    console.error('Error updating claim:', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete claim by ID
exports.deleteClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const performerId = req.employee?.employee_id ?? null;
    await claimService.deleteClaim(id, performerId);

    res.status(200).json({ success: true, message: 'Claim deleted successfully' });
  } catch (error) {
    console.error('Error deleting claim:', error);
    res.status(500).json({ success: false, message: 'Failed to delete claim' });
  }
};
