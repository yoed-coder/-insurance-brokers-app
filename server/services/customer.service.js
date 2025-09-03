const { pool } = require('../config/db.config');

// Get all insureds
exports.getAllInsured = async () => {
  const [rows] = await pool.query(
    'SELECT insured_id, insured_name FROM insured ORDER BY insured_name ASC'
  );
  return rows;
};

// Get insured by ID (only id + name available in schema)
exports.getInsuredById = async (insuredId) => {
  const [rows] = await pool.query(
    `SELECT insured_id, insured_name 
     FROM insured
     WHERE insured_id = ?`,
    [insuredId]
  );
  return rows[0] || null;
};
