const express = require('express');
const router = express.Router();

const insurerController = require('../controllers/insurer.controller'); // Adjust if your folder is 'controller' instead of 'controllers'

// Create a new insurer
router.post('/insurer', insurerController.createInsurer);

// Get all insurers
router.get('/insurers', insurerController.getAllInsurers);

// Update an insurer by ID
router.put('/insurer/:id', insurerController.updateInsurer);

// Delete an insurer by ID
router.delete('/insurer/:id', insurerController.deleteInsurer);

module.exports = router;
