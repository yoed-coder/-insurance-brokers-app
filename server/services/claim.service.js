const { pool } = require('../config/db.config');
const { addLog } = require('./audit.Service'); // ✅ use addLog instead of logAudit

// =========================
// CREATE CLAIM (flexible)
// =========================
exports.createClaim = async (claim, performerId = null) => {
  const {
    insured_name,
    policy_number,
    plate_number,
    accident_date,
    accident_time,
    accident_place,
    accident_reason,
    status_name,
    subject_type_name,
    subject_detail,
  } = claim;

  let insured_id = null;
  let vehicle_id = null;
  let policy_id = null;

  // 1️⃣ Get or create insured
  if (insured_name) {
    const [insuredRows] = await pool.execute(
      'SELECT * FROM insured WHERE insured_name = ?',
      [insured_name]
    );
    insured_id = insuredRows.length
      ? insuredRows[0].insured_id
      : (await pool.execute('INSERT INTO insured (insured_name) VALUES (?)', [insured_name]))[0].insertId;
  }

  // 2️⃣ Get or create vehicle
  if (plate_number) {
    const [vehicleRows] = await pool.execute(
      'SELECT * FROM vehicle WHERE plate_number = ?',
      [plate_number]
    );
    vehicle_id = vehicleRows.length
      ? vehicleRows[0].vehicle_id
      : (await pool.execute(
          'INSERT INTO vehicle (insured_id, plate_number) VALUES (?, ?)',
          [insured_id ?? null, plate_number]
        ))[0].insertId;
  }

  // 3️⃣ Get or create policy
  if (policy_number) {
    const defaultPolicyTypeName = 'Auto';
    const [policyTypeRows] = await pool.execute(
      'SELECT * FROM policy_type WHERE type_name = ?',
      [defaultPolicyTypeName]
    );
    const policy_type_id = policyTypeRows.length
      ? policyTypeRows[0].policy_type_id
      : (await pool.execute('INSERT INTO policy_type (type_name) VALUES (?)', [defaultPolicyTypeName]))[0].insertId;

    const [policyRows] = await pool.execute(
      'SELECT * FROM policy WHERE policy_number = ?',
      [policy_number]
    );

    if (policyRows.length) {
      policy_id = policyRows[0].policy_id;
    } else {
      const defaultExpire = '2025-12-31';
      const defaultPremium = 5000;
      const defaultCommission = 500;
      const [res] = await pool.execute(
        `INSERT INTO policy (
           policy_number, insured_id, policy_type_id,
           expire_date, premium, commission
         ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          policy_number,
          insured_id ?? null,
          policy_type_id,
          defaultExpire,
          defaultPremium,
          defaultCommission
        ]
      );
      policy_id = res.insertId;
    }
  }

  // 4️⃣ Get or create claim status
  let status_id = null;
  if (status_name) {
    const [statusRows] = await pool.execute(
      'SELECT * FROM claim_status WHERE status_name = ?',
      [status_name]
    );
    status_id = statusRows.length
      ? statusRows[0].status_id
      : (await pool.execute('INSERT INTO claim_status (status_name) VALUES (?)', [status_name]))[0].insertId;
  }

  // 5️⃣ Get or create claim subject type
  let subject_type_id = null;
  if (subject_type_name) {
    const [subjectRows] = await pool.execute(
      'SELECT * FROM claim_subject_type WHERE type_name = ?',
      [subject_type_name]
    );
    subject_type_id = subjectRows.length
      ? subjectRows[0].subject_type_id
      : (await pool.execute('INSERT INTO claim_subject_type (type_name) VALUES (?)', [subject_type_name]))[0].insertId;
  }

  // 6️⃣ Insert claim
  const [result] = await pool.execute(
    `INSERT INTO claim (
       policy_id, insured_id, vehicle_id,
       accident_date, accident_time, accident_place, accident_reason,
       status_id, subject_type_id, subject_detail
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      policy_id ?? null,
      insured_id ?? null,
      vehicle_id ?? null,
      accident_date ?? null,
      accident_time ?? null,
      accident_place ?? null,
      accident_reason ?? null,
      status_id ?? null,
      subject_type_id ?? null,
      subject_detail ?? null
    ]
  );

  // 7️⃣ Log audit entry using addLog
  await addLog(
    performerId ?? null,
    'CREATE',
    'CLAIM',
    result.insertId,
    `Created claim for insured ${insured_name || 'Unknown'}`
  );

  return result;
};

// =========================
// GET ALL CLAIMS
// =========================
exports.getAllClaims = async () => {
  const [rows] = await pool.execute(`
    SELECT 
      c.claim_id,
      c.accident_date,
      c.accident_time,
      c.accident_place,
      c.accident_reason,
      c.subject_detail,
      i.insured_name, 
      p.policy_number, 
      v.plate_number,
      cs.status_name,
      cst.type_name AS subject_type_name
    FROM claim c
    LEFT JOIN insured i ON c.insured_id = i.insured_id
    LEFT JOIN policy p ON c.policy_id = p.policy_id
    LEFT JOIN vehicle v ON c.vehicle_id = v.vehicle_id
    LEFT JOIN claim_status cs ON c.status_id = cs.status_id
    LEFT JOIN claim_subject_type cst ON c.subject_type_id = cst.subject_type_id
    ORDER BY c.claim_id DESC
  `);
  return rows;
};

// =========================
// UPDATE CLAIM
// =========================
exports.updateClaim = async (claimId, updateData, performerId = null) => {
  // ... existing update logic ...

  // Log audit entry
  await addLog(
    performerId ?? null,
    'UPDATE',
    'CLAIM',
    claimId,
    `Updated claim ID ${claimId}`
  );

  return result;
};

// =========================
// DELETE CLAIM
// =========================
exports.deleteClaim = async (claimId, performerId = null) => {
  await pool.execute(`DELETE FROM claim WHERE claim_id = ?`, [claimId]);

  // Log audit entry
  await addLog(
    performerId ?? null,
    'DELETE',
    'CLAIM',
    claimId,
    `Deleted claim ID ${claimId}`
  );
};
