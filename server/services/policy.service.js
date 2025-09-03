// services/policy.service.js
const { pool } = require('../config/db.config');
const auditService = require('./audit.service'); // use addLog

// -------------------- Helper --------------------
// Convert value to number or null
function safeNumber(val) {
  if (val === undefined || val === null || val === '') return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

// Find or create entity (insured, insurer, policy_type)
async function findOrCreateEntity(table, column, value) {
  if (!value) return null;

  const [rows] = await pool.execute(
    `SELECT ${table}_id AS id FROM ${table} WHERE ${column} = ? LIMIT 1`,
    [value]
  );

  if (rows.length > 0) return rows[0].id;

  const [result] = await pool.execute(
    `INSERT INTO ${table} (${column}) VALUES (?)`,
    [value]
  );

  return result.insertId;
}

// -------------------- CREATE POLICY --------------------
exports.createPolicy = async (data) => {
  const {
    policy_number = null,
    insured_name = null,
    insurer_name = null,
    policy_type = null,
    expire_date = null,
    premium = null,
    commission = null,
    plates = [],
    employee_id = null,
  } = data;

  const insured_id = await findOrCreateEntity('insured', 'insured_name', insured_name);
  const insurer_id = await findOrCreateEntity('insurer', 'insurer_name', insurer_name);
  const policy_type_id = await findOrCreateEntity('policy_type', 'type_name', policy_type);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [policyResult] = await conn.execute(
      `INSERT INTO policy 
        (policy_number, insured_id, insurer_id, policy_type_id, expire_date, premium, commission) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        policy_number || null,
        insured_id,
        insurer_id,
        policy_type_id,
        expire_date || null,
        safeNumber(premium),
        safeNumber(commission)
      ]
    );

    const policyId = policyResult.insertId;

    // Insert vehicle plates
    if (plates && plates.length > 0) {
      for (const plate of plates) {
        if (plate && plate.trim() !== '') {
          await conn.execute(
            `INSERT INTO vehicle (policy_id, plate_number) VALUES (?, ?)`,
            [policyId, plate.trim()]
          );
        }
      }
    }

    await conn.commit();

    // Audit log - use insured name instead of policy number
    await auditService.addLog(
      employee_id,
      'CREATE',
      'Policy',
      policyId,
      `Created insured ${insured_name || '(no insured)'}`
    );
    return { insertId: policyId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// -------------------- UPDATE POLICY --------------------
exports.updatePolicy = async (id, data) => {
  const {
    policy_number = null,
    insured_name = null,
    insurer_name = null,
    policy_type = null,
    expire_date = null,
    premium = null,
    commission = null,
    plates = [],
    employee_id = null,
  } = data;

  const insured_id = await findOrCreateEntity('insured', 'insured_name', insured_name);
  const insurer_id = await findOrCreateEntity('insurer', 'insurer_name', insurer_name);
  const policy_type_id = await findOrCreateEntity('policy_type', 'type_name', policy_type);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(
      `UPDATE policy 
       SET policy_number = ?, insured_id = ?, insurer_id = ?, policy_type_id = ?,
           expire_date = ?, premium = ?, commission = ?
       WHERE policy_id = ?`,
      [
        policy_number || null,
        insured_id,
        insurer_id,
        policy_type_id,
        expire_date || null,
        safeNumber(premium),
        safeNumber(commission),
        id
      ]
    );

    // Update vehicle plates
    await conn.execute(`DELETE FROM vehicle WHERE policy_id = ?`, [id]);
    if (plates && plates.length > 0) {
      for (const plate of plates) {
        if (plate && plate.trim() !== '') {
          await conn.execute(
            `INSERT INTO vehicle (policy_id, plate_number) VALUES (?, ?)`,
            [id, plate.trim()]
          );
        }
      }
    }

    await conn.commit();

    // Audit log - use insured name
    await auditService.addLog(
      employee_id,
      'UPDATE',
      'Policy',
      id,
      `Updated insured ${insured_name || '(no insured)'}`
    );

    return { success: true };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// -------------------- DELETE POLICY --------------------
exports.deletePolicy = async (id, employee_id = null, insured_name = null) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(`DELETE FROM vehicle WHERE policy_id = ?`, [id]);
    await conn.execute(`DELETE FROM policy WHERE policy_id = ?`, [id]);

    await conn.commit();

    // Audit log - pass insured name if available
    await auditService.addLog(
      employee_id,
      'DELETE',
      'Policy',
      id,
      `Deleted insured ${insured_name || '(no insured)'}`
    );

    return { success: true };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// -------------------- GET ALL POLICIES --------------------
exports.getAllPolicies = async () => {
  const [rows] = await pool.execute(
    `SELECT 
      p.policy_id,
      p.policy_number,
      i.insured_name,
      ins.insurer_name,
      pt.type_name AS policy_type,
      p.expire_date,
      p.premium,
      p.commission,
      GROUP_CONCAT(v.plate_number) AS plates
     FROM policy p
     LEFT JOIN insured i ON p.insured_id = i.insured_id
     LEFT JOIN insurer ins ON p.insurer_id = ins.insurer_id
     LEFT JOIN policy_type pt ON p.policy_type_id = pt.policy_type_id
     LEFT JOIN vehicle v ON p.policy_id = v.policy_id
     GROUP BY p.policy_id
     ORDER BY p.policy_id DESC`
  );

  return rows.map(row => ({
    ...row,
    plates: row.plates ? row.plates.split(',') : [],
    premium: safeNumber(row.premium),
    commission: safeNumber(row.commission),
  }));
};

// -------------------- GET EXPIRING POLICIES --------------------
exports.getExpiringPolicies = async () => {
  try {
    const query = `
      SELECT 
        p.policy_id,
        p.policy_number,
        i.insured_name,
        pt.type_name AS policy_type,
        p.expire_date
      FROM policy p
      LEFT JOIN insured i ON p.insured_id = i.insured_id
      LEFT JOIN policy_type pt ON p.policy_type_id = pt.policy_type_id
      WHERE p.expire_date IS NOT NULL
        AND p.expire_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      ORDER BY p.expire_date ASC
    `;

    const [rows] = await pool.execute(query);
    return rows;
  } catch (err) {
    console.error('Error in getExpiringPolicies:', err);
    throw err;
  }
};
