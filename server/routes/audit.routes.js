const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');

// GET all logs
router.get('/audits', auditController.getLogs);

module.exports = router;
