const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// ✅ Get expiring policies within 30 days
router.get('/expiring', verifyToken, reportController.getExpiringPolicies);

module.exports = router;
