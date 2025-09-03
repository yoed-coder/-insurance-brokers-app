const { pool } = require('../config/db.config');

exports.addPlatesForPolicy = async (policy_id, plates) => {
  if (!policy_id || !Array.isArray(plates) || plates.length === 0) {
    throw new Error('Policy ID and plates array are required');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [policyRows] = await conn.query(
      'SELECT insured_id FROM policy WHERE policy_id = ?',
      [policy_id]
    );

    if (!policyRows.length) {
      throw new Error('Policy not found');
    }

    const insured_id = policyRows[0].insured_id;

    const insertPromises = plates.map(plate =>
      conn.query(
        'INSERT INTO vehicle (insured_id, policy_id, plate_number) VALUES (?, ?, ?)',
        [insured_id, policy_id, plate.trim()]
      )
    );

    await Promise.all(insertPromises);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    console.error('Failed to insert plates:', err);
    throw err;
  } finally {
    conn.release();
  }
};
