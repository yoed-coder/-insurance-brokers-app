const express = require('express');
const router = express.Router();

const insuredController = require('../controllers/insured.controller');

// Create a new insured
router.post('/insured', insuredController.createInsured);

// Get all insureds
router.get('/insureds', insuredController.getAllInsureds);

// Update an insured by ID
router.put('/insured/:id', insuredController.updateInsured);

// Delete an insured by ID
router.delete('/insured/:id', insuredController.deleteInsured);

module.exports = router;
