const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// Generate letter
router.post('/letter', aiController.generateLetter);

module.exports = router;
