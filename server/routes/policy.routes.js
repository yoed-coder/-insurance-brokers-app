// routes/policy.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

const policyController = require('../controllers/policy.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Multer config for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// ✅ CREATE a new policy (Admin only)
router.post('/policy', verifyToken, policyController.createPolicy);

// ✅ GET all policies (Admin only)
router.get('/policies', verifyToken, policyController.getAllPolicies);

// ✅ GET policies expiring in the next 30 days
router.get('/policies/expiring', verifyToken, policyController.getExpiringPolicies);

// ✅ UPDATE a policy by ID (Admin only)
router.put('/policy/:id', verifyToken, policyController.updatePolicy);

// ✅ DELETE a policy by ID (Admin only)
router.delete('/policy/:id', verifyToken, policyController.deletePolicy);

// ✅ IMPORT policies from Excel (Admin only)
router.post('/policies/import', verifyToken, upload.single('file'), policyController.importPolicies);

module.exports = router;
