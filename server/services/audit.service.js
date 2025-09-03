const { pool } = require('../config/db.config');

async function addLog(employeeId, action, entity, entityId, description) {
  const safeEmployeeId = employeeId ?? null;
  const safeAction = action ?? "UNKNOWN_ACTION";
  const safeEntity = entity ?? "UNKNOWN_ENTITY";
  const safeEntityId = entityId ?? null;
  const safeDescription = description ?? "";

  const sql = `
    INSERT INTO audit_logs (employee_id, action, entity, entity_id, description) 
    VALUES (?, ?, ?, ?, ?)
  `;

  await pool.execute(sql, [
    safeEmployeeId,
    safeAction,
    safeEntity,
    safeEntityId,
    safeDescription,
  ]);
}

async function getAllLogs() {
  const sql = `
    SELECT al.*, e.employee_first_name AS employee_name
    FROM audit_logs al
    LEFT JOIN employee_info e ON al.employee_id = e.employee_id
    ORDER BY al.timestamp DESC
  `;
  const [rows] = await pool.execute(sql);
  return rows;
}

module.exports = {
  addLog,
  getAllLogs,
};
