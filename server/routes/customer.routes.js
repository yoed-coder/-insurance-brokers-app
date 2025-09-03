const express = require('express');
const router = express.Router();
const insuredController = require('../controllers/customer.controller');

router.get('/insured', insuredController.getAllInsured);
router.post('/insured/letter', insuredController.generateLetter);

module.exports = router;
