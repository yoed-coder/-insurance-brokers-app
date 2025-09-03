const { pool } = require('../config/db.config');

// Create insurer
exports.createInsurer = async (insurer_name) => {
  const [result] = await pool.execute(
    `INSERT INTO insurer (insurer_name) VALUES (?)`,
    [insurer_name]
  );
  return result;
};

// Get all insurers
exports.getAllInsurers = async () => {
  const [rows] = await pool.execute(`SELECT * FROM insurer ORDER BY insurer_id DESC`);
  return rows;
};

// Update insurer
exports.updateInsurer = async (id, insurer_name) => {
  const [result] = await pool.execute(
    `UPDATE insurer SET insurer_name = ? WHERE insurer_id = ?`,
    [insurer_name, id]
  );
  return result;
};

// Delete insurer
exports.deleteInsurer = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM insurer WHERE insurer_id = ?`,
    [id]
  );
  return result;
};
