const { pool } = require('../config/db.config');

/* ---------------------- Get Commission Status ---------------------- */
exports.getCommissionStatus = async () => {
  const [rows] = await pool.query(`
    SELECT 
      p.policy_id,
      p.policy_number,
      ins.insured_name,
      ir.insurer_name,
      p.commission AS total_commission,
      p.premium,
      p.commission_status
    FROM policy p
    JOIN insured ins ON p.insured_id = ins.insured_id
    JOIN insurer ir ON p.insurer_id = ir.insurer_id
    ORDER BY p.policy_id DESC;
  `);
  return rows;
};

/* ---------------------- Add Commission Payment ---------------------- */
exports.addCommissionPayment = async (policy_id, payment_amount, paid_by) => {
  const [result] = await pool.query(
    `INSERT INTO commission_payment (policy_id, payment_amount, paid_by)
     VALUES (?, ?, ?)`,
    [policy_id, payment_amount, paid_by]
  );
  return { success: true, payment_id: result.insertId };
};

/* ---------------------- Update Commission Status ---------------------- */
exports.updateCommissionStatus = async (policyId, status) => {
  const [result] = await pool.query(
    `UPDATE policy SET commission_status = ? WHERE policy_id = ?`,
    [status, policyId]
  );
  if (result.affectedRows === 0) throw new Error("Policy not found");
};

/* ---------------------- Update Commission Details (inline edit) ---------------------- */
exports.updateCommissionDetails = async (policyId, { 
  insured_name, 
  insurer_name, 
  policy_number, 
  premium, 
  total_commission 
}) => {
  // 1️⃣ Update policy table
  const [policyResult] = await pool.query(
    `UPDATE policy 
     SET policy_number = ?, premium = ?, commission = ?
     WHERE policy_id = ?`,
    [policy_number, premium, total_commission, policyId]
  );

  if (policyResult.affectedRows === 0) throw new Error("Policy not found");

  // 2️⃣ Update insured name
  await pool.query(
    `UPDATE insured i
     JOIN policy p ON i.insured_id = p.insured_id
     SET i.insured_name = ?
     WHERE p.policy_id = ?`,
    [insured_name, policyId]
  );

  // 3️⃣ Update insurer name
  await pool.query(
    `UPDATE insurer ir
     JOIN policy p ON ir.insurer_id = p.insurer_id
     SET ir.insurer_name = ?
     WHERE p.policy_id = ?`,
    [insurer_name, policyId]
  );

  return { success: true };
};
