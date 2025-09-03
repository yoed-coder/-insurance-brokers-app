const { pool } = require('../config/db.config');
const bcrypt = require('bcrypt');

/**
 * Check if employee already exists by email
 */
async function checkIfEmployeeExists(email) {
  const [rows] = await pool.query(
    'SELECT employee_id FROM employee WHERE employee_email = ? LIMIT 1',
    [email]
  );
  return rows.length > 0;
}

/**
 * Create a new employee with all related records
 */
async function createEmployee(employee) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const requiredFields = [
      'employee_email',
      'employee_password',
      'employee_first_name',
      'employee_last_name',
      'employee_phone',
    ];

    for (const field of requiredFields) {
      if (!employee[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const company_role_id = employee.company_role_id ?? 1;

    // Hash password
    const hashedPassword = await bcrypt.hash(employee.employee_password, 10);

    // Insert employee base record
    const [result] = await connection.query(
      'INSERT INTO employee (employee_email, active_employee, added_date) VALUES (?, ?, ?)',
      [employee.employee_email, employee.active_employee ?? 1, new Date()]
    );
    const employee_id = result.insertId;

    // Insert info
    await connection.query(
      `INSERT INTO employee_info 
       (employee_id, employee_first_name, employee_last_name, employee_phone) 
       VALUES (?, ?, ?, ?)`,
      [employee_id, employee.employee_first_name, employee.employee_last_name, employee.employee_phone]
    );

    // Insert password
    await connection.query(
      'INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)',
      [employee_id, hashedPassword]
    );

    // Insert role
    await connection.query(
      'INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)',
      [employee_id, company_role_id]
    );

    await connection.commit();
    return {
      employee_id,
      employee_email: employee.employee_email,
      active_employee: employee.active_employee ?? 1,
      employee_first_name: employee.employee_first_name,
      employee_last_name: employee.employee_last_name,
      employee_phone: employee.employee_phone,
      company_role_id,
    };
  } catch (err) {
    await connection.rollback();
    console.error('Create Employee Error:', err.message);
    throw err;
  } finally {
    connection.release();
  }
}

/**
 * Get employee by email (with role info)
 */
async function getEmployeeByEmail(employee_email) {
  const query = `
    SELECT 
      e.employee_id,
      e.employee_email,
      e.active_employee,
      ei.employee_first_name,
      ei.employee_last_name,
      ei.employee_phone,
      ep.employee_password_hashed,
      er.company_role_id,
      cr.company_role_name
    FROM employee e
    INNER JOIN employee_info ei ON e.employee_id = ei.employee_id
    INNER JOIN employee_pass ep ON e.employee_id = ep.employee_id
    LEFT JOIN employee_role er ON e.employee_id = er.employee_id
    LEFT JOIN company_roles cr ON er.company_role_id = cr.company_role_id
    WHERE e.employee_email = ?
    LIMIT 1
  `;

  try {
    const [rows] = await pool.query(query, [employee_email]);
    return rows[0] || null;
  } catch (err) {
    console.error('Error in getEmployeeByEmail:', err.message);
    return null;
  }
}

/**
 * Get all employees (deduplicated)
 */
async function getAllEmployees() {
  const query = `
    SELECT 
      e.employee_id,
      e.employee_email,
      e.active_employee,
      e.added_date,
      ei.employee_first_name,
      ei.employee_last_name,
      ei.employee_phone,
      er.company_role_id,
      cr.company_role_name
    FROM employee e
    JOIN employee_info ei ON e.employee_id = ei.employee_id
    LEFT JOIN employee_role er ON e.employee_id = er.employee_id
    LEFT JOIN company_roles cr ON er.company_role_id = cr.company_role_id
    WHERE er.company_role_id = (
      SELECT er2.company_role_id 
      FROM employee_role er2 
      WHERE er2.employee_id = e.employee_id 
      LIMIT 1
    )
    ORDER BY e.employee_id DESC
    LIMIT 10
  `;

  try {
    const [rows] = await pool.query(query);
    return rows;
  } catch (err) {
    console.error('Error in getAllEmployees:', err);
    return [];
  }
}

/**
 * Update employee
 */
async function updateEmployee(employee_id, updatedData) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      employee_email,
      active_employee,
      employee_first_name,
      employee_last_name,
      employee_phone,
      company_role_id,
    } = updatedData;

    await connection.query(
      'UPDATE employee SET employee_email = ?, active_employee = ? WHERE employee_id = ?',
      [employee_email, active_employee ?? 1, employee_id]
    );

    await connection.query(
      'UPDATE employee_info SET employee_first_name = ?, employee_last_name = ?, employee_phone = ? WHERE employee_id = ?',
      [employee_first_name, employee_last_name, employee_phone, employee_id]
    );

    // Ensure role exists or update
    await connection.query(
      `INSERT INTO employee_role (employee_id, company_role_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE company_role_id = VALUES(company_role_id)`,
      [employee_id, company_role_id ?? 1]
    );

    await connection.commit();
    return { success: true };
  } catch (err) {
    await connection.rollback();
    console.error('Error updating employee:', err.message);
    throw err;
  } finally {
    connection.release();
  }
}

/**
 * Delete employee and related records
 */
async function deleteEmployee(employee_id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query('DELETE FROM employee_pass WHERE employee_id = ?', [employee_id]);
    await connection.query('DELETE FROM employee_info WHERE employee_id = ?', [employee_id]);
    await connection.query('DELETE FROM employee_role WHERE employee_id = ?', [employee_id]);
    await connection.query('DELETE FROM employee WHERE employee_id = ?', [employee_id]);

    await connection.commit();
    return true;
  } catch (err) {
    await connection.rollback();
    console.error('Error deleting employee:', err.message);
    return false;
  } finally {
    connection.release();
  }
}

module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeByEmail,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
};
