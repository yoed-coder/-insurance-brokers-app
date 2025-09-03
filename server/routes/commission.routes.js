const express = require('express');
const router = express.Router();
const commissionController = require('../controllers/commission.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// ✅ Get commission status for all policies
router.get('/commission/status', verifyToken, commissionController.getCommissionStatus);

// ✅ Add a new commission payment
router.post('/commission/add', verifyToken, commissionController.addCommissionPayment);

// ✅ Update commission status by policy ID
router.put('/commission/:policyId/status', verifyToken, commissionController.updateCommissionStatus);

// ✅ Update commission details (inline edit)
router.put('/commission/:policyId', verifyToken, commissionController.updateCommissionDetails);

module.exports = router;
