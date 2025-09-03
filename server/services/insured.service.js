const { pool } = require('../config/db.config');


exports.createInsured = async ({ insured_name }) => {
  const [result] = await pool.execute(
    `INSERT INTO insured (insured_name) VALUES (?)`,
    [insured_name]
  );
  return result;
};

exports.getAllInsureds = async () => {
  const [rows] = await pool.execute(`SELECT * FROM insured ORDER BY insured_id DESC`);
  return rows;
};

exports.updateInsured = async (id, { insured_name }) => {
  const [result] = await pool.execute(
    `UPDATE insured SET insured_name = ? WHERE insured_id = ?`,
    [insured_name, id]
  );
  return result;
};

exports.deleteInsured = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM insured WHERE insured_id = ?`,
    [id]
  );
  return result;
};
