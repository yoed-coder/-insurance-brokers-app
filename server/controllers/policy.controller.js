const policyService = require('../services/policy.service');
const xlsx = require('xlsx');
const auditService = require('../services/audit.service'); // ensure correct import

// ✅ Create a new policy
exports.createPolicy = async (req, res) => {
  try {
    const policyData = req.body;

    // Inject employee_id from JWT
    policyData.employee_id = req.employee.employee_id;

    const result = await policyService.createPolicy(policyData);

    res.status(201).json({
      success: true,
      message: 'Policy created successfully',
      policyId: result.insertId,
    });
  } catch (error) {
    console.error('❌ Error creating policy:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create policy',
    });
  }
};

// ✅ Get all policies
exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await policyService.getAllPolicies();
    res.status(200).json({ success: true, data: policies });
  } catch (error) {
    console.error('❌ Error fetching policies:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch policies' });
  }
};

// ✅ Get policies expiring in next 30 days
exports.getExpiringPolicies = async (req, res) => {
  try {
    const policies = await policyService.getExpiringPolicies();
    res.status(200).json({ success: true, data: policies });
  } catch (error) {
    console.error('❌ Error fetching expiring policies:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch expiring policies' });
  }
};

// ✅ Update a policy by ID
exports.updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policyData = req.body;

    // Inject employee_id from JWT
    policyData.employee_id = req.employee.employee_id;

    const result = await policyService.updatePolicy(id, policyData);

    res.status(200).json({ success: true, message: 'Policy updated successfully' });
  } catch (error) {
    console.error('❌ Error updating policy:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update policy' });
  }
};


// ✅ Delete a policy by ID
exports.deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    // Get employee ID from authenticated JWT
    const employee_id = req.employee ? req.employee.employee_id : null;

    const result = await policyService.deletePolicy(id, employee_id);

    // Audit log
    await require('../services/audit.service').addLog(
      employee_id,
      'DELETE',
      'Policy',
      Number(id), // ensure integer
      `Deleted policy ${id}`
    );

    res.status(200).json({ success: true, message: 'Policy deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting policy:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete policy' });
  }
};

// ✅ Import policies from Excel
exports.importPolicies = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let importedCount = 0;

    const safeValue = (val) => (val && val.toString().trim() !== '' ? val.toString().trim() : null);
    const safeDate = (val) => (val ? new Date(val) : null);

    for (const row of rows) {
      let insurer = null;
      let branch = null;
      if (row["INSURER COMPANY"]) {
        const parts = row["INSURER COMPANY"].split(/[-|–]/);
        insurer = safeValue(parts[0]);
        branch = safeValue(parts[1]);
      }

      const result = await policyService.createPolicy({
        policy_number: safeValue(row['POLICY NO']),
        insured_name: safeValue(row['INSURED PERSON (COMPANY)']),
        insurer_name: insurer,
        branch_name: branch,
        policy_type: safeValue(row['INTEREST INSURED']),
        expire_date: safeDate(row['EXPIRY DATE']),
        premium: row['PREMIUM AMOUNT'] ? parseFloat(row['PREMIUM AMOUNT']) : null,
        commission: row['COMMISSION AMOUNT'] ? parseFloat(row['COMMISSION AMOUNT']) : null,
      });

      importedCount++;

      // Audit log for each imported policy
      await auditService.addLog(
        null,
        'CREATE',
        'Policy',
        result.insertId,
        `Imported policy ${row['POLICY NO'] || '(no number)'}`
      );
    }

    res.status(200).json({ success: true, message: `${importedCount} policies imported successfully` });
  } catch (error) {
    console.error('❌ Error importing policies:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to import policies' });
  }
};
