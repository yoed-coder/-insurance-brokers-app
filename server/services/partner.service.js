const { pool } = require('../config/db.config');

exports.getAllInsurers = async () => {
  const [rows] = await pool.query(
    'SELECT insurer_id, insurer_name FROM insurer ORDER BY insurer_name ASC'
  );
  return rows;
};

exports.getInsurerById = async (insurerId) => {
  const [rows] = await pool.query(
    `SELECT insurer_id, insurer_name 
     FROM insurer
     WHERE insurer_id = ?`,
    [insurerId]
  );
  return rows[0] || null;
};
