const { pool } = require('../config/db.config');

// Get policies expiring in next 30 days with insured name, insurer branch name, and policy type
exports.fetchExpiringPolicies = async () => {
  const [rows] = await pool.query(`
    SELECT 
      p.policy_id,
      p.policy_number,
      ins.insured_name,
      ib.branch_name AS insurer_branch_name,
      pt.type_name AS policy_type,
      p.expire_date,
      DATEDIFF(p.expire_date, CURDATE()) AS days_remaining,
      p.sum_insured,
      p.premium,
      p.commission
    FROM policy p
    LEFT JOIN insured ins ON p.insured_id = ins.insured_id
    LEFT JOIN insurer_branch ib ON p.branch_id = ib.branch_id
    LEFT JOIN policy_type pt ON p.policy_type_id = pt.policy_type_id
    WHERE p.expire_date >= CURDATE()
      AND p.expire_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    ORDER BY p.expire_date ASC
  `);
  return rows;
};
