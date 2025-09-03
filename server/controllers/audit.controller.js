const auditService = require('../services/audit.service');

async function getLogs(req, res) {
  try {
    const logs = await auditService.getAllLogs();
    res.json(logs);
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
}

module.exports = { getLogs };
