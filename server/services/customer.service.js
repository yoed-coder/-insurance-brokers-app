const { pool } = require('../config/db.config');

exports.getAllInsured = async () => {
  const [rows] = await pool.query(
    'SELECT insured_id, insured_name FROM insured ORDER BY insured_name ASC'
  );
  return rows;
};

exports.getInsuredById = async (insuredId) => {
  const [rows] = await pool.query(
    `SELECT insured_id, insured_name 
     FROM insured
     WHERE insured_id = ?`,
    [insuredId]
  );
  return rows[0] || null;
};
