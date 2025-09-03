const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claim.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// ✅ Create a new claim
router.post('/claim', verifyToken, claimController.createClaim);

// ✅ Get all claims
router.get('/claims', verifyToken, claimController.getAllClaims);

// ✅ Get claims by insured ID
router.get('/claims/insured/:insuredId', verifyToken, claimController.getClaimsByInsuredId);

// ✅ Update a claim
router.put('/claim/:id', verifyToken, claimController.updateClaim);

// ✅ Delete a claim
router.delete('/claim/:id', verifyToken, claimController.deleteClaim);

module.exports = router;
