const reportService = require('../services/report.service');

// ✅ Fetch policies expiring soon
exports.getExpiringPolicies = async (req, res) => {
  try {
    const policies = await reportService.fetchExpiringPolicies();
    res.status(200).json(policies);
  } catch (error) {
    console.error('❌ Error fetching expiring policies:', error);
    res.status(500).json({ message: 'Failed to fetch expiring policies' });
  }
};
