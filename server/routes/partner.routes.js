const express = require('express');
const router = express.Router();
const insurerController = require('../controllers/partner.controller');

// List all insurers
router.get('/insurer', insurerController.getAllInsurers);

// Generate letter for insurer
router.post('/insurer/letter', insurerController.generateLetter);

module.exports = router;
