const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');

router.post('/vehicle/add', vehicleController.addPlatesForPolicy);
module.exports = router;
