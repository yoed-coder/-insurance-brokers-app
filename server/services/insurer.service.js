const { pool } = require('../config/db.config');


exports.createInsurer = async (insurer_name) => {
  const [result] = await pool.execute(
    `INSERT INTO insurer (insurer_name) VALUES (?)`,
    [insurer_name]
  );
  return result;
};

exports.getAllInsurers = async () => {
  const [rows] = await pool.execute(`SELECT * FROM insurer ORDER BY insurer_id DESC`);
  return rows;
};

exports.updateInsurer = async (id, insurer_name) => {
  const [result] = await pool.execute(
    `UPDATE insurer SET insurer_name = ? WHERE insurer_id = ?`,
    [insurer_name, id]
  );
  return result;
};

exports.deleteInsurer = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM insurer WHERE insurer_id = ?`,
    [id]
  );
  return result;
};
