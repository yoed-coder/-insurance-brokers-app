const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const employeeService = require('./employee.service');

async function login(employeeData) {
  console.log("Login request received with:", employeeData);

  if (!employeeData || !employeeData.employee_email || !employeeData.employee_password) {
    console.log("Missing credentials");
    return {
      status: 'fail',
      message: 'Missing credentials'
    };
  }

  try {
    const employee = await employeeService.getEmployeeByEmail(employeeData.employee_email);
    console.log("Looking up employee by email:", employeeData.employee_email);
    console.log("Employee fetched from service:", employee);

    if (!employee) {
      console.log("Employee not found");
      return {
        status: 'fail',
        message: "Employee doesn't exist"
      };
    }

    console.log('Raw password from request:', JSON.stringify(employeeData.employee_password));
console.log('Hash from DB:', JSON.stringify(employee.employee_password_hashed));
console.log('Hash length:', employee.employee_password_hashed.length);

const passwordMatch = await bcrypt.compare(
  employeeData.employee_password,
  employee.employee_password_hashed.trim()
);

console.log('Compare result:', passwordMatch);
    

    if (!passwordMatch) {
      console.log("Password mismatch");
      return {
        status: 'fail',
        message: 'Incorrect password'
      };
    }
    // Exclude sensitive fields before returning
    const { employee_password_hashed, ...safeEmployee } = employee;

    // Generate JWT token (use your secret and payload as needed)
    const token = jwt.sign(
        {
          employee_id: safeEmployee.employee_id,
          employee_email: safeEmployee.employee_email,
          employee_first_name: safeEmployee.employee_first_name, // ✅ include this
          company_role_id: safeEmployee.company_role_id,          // ✅ include this if needed
          company_role_name: safeEmployee.company_role_name
        },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '1h' }
      );
      

    const response = {
      status: 'success',
      token,              // <-- Include the JWT token here
      data: safeEmployee
    };

    console.log("Login success response:", response);
    return response;

  } catch (error) {
    console.error("Login error:", error.message, error.stack);
    return {
      status: 'error',
      message: 'An unexpected error occurred'
    };
  }
}

module.exports = { login };
