const commissionService = require('../services/commission.service');

// ✅ Get all commission statuses
exports.getCommissionStatus = async (req, res) => {
  try {
    const data = await commissionService.getCommissionStatus();
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching commission status:", err);
    res.status(500).json({ message: "Error fetching commission status" });
  }
};

// ✅ Add a new commission payment
exports.addCommissionPayment = async (req, res) => {
  try {
    const { policy_id, payment_amount, paid_by } = req.body;

    if (!policy_id || !payment_amount) {
      return res.status(400).json({ message: "policy_id and payment_amount are required" });
    }

    const result = await commissionService.addCommissionPayment(policy_id, payment_amount, paid_by || "System");
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error adding commission payment:", err);
    res.status(500).json({ message: "Error adding commission payment" });
  }
};

// ✅ Update commission details (inline edit)
exports.updateCommissionDetails = async (req, res) => {
  try {
    const { policyId } = req.params;
    const updateData = req.body;

    await commissionService.updateCommissionDetails(policyId, updateData);

    res.json({ success: true, message: "Commission details updated" });
  } catch (err) {
    console.error("❌ Error updating commission details:", err);
    res.status(500).json({ message: "Error updating commission details" });
  }
};

// ✅ Update commission status
exports.updateCommissionStatus = async (req, res) => {
  try {
    const { policyId } = req.params;
    const { commission_status } = req.body;

    if (!["Paid", "Unpaid"].includes(commission_status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    await commissionService.updateCommissionStatus(policyId, commission_status);

    res.json({ success: true, message: "Commission status updated" });
  } catch (err) {
    console.error("❌ Error updating commission status:", err);
    res.status(500).json({ message: "Error updating commission status" });
  }
};
