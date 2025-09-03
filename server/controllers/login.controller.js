const loginService = require('../services/login.service');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

async function login(req, res) {
  try {
    console.log('Login request received for:', req.body.employee_email);

    const employeeData = req.body;
    const employee = await loginService.login(employeeData);
    console.log("LoginService returned:", employee);

    if (employee.status === 'fail') {
      console.warn('Login failed:', employee.message);
      return res.status(404).json({
        status: 'fail',
        message: employee.message,
      });
    }

    if (!employee || !employee.data) {
      console.error("Login response missing data");
      return res.status(500).json({
        status: 'error',
        message: 'Employee data missing',
      });
    }

    const payload = {
      sub: employee.data.employee_id,
      employee_email: employee.data.employee_email,
      employee_first_name: employee.data.employee_first_name,
      employee_role_id: employee.data.company_role_id,
      employee_role_name: employee.data.company_role_name
    };

    console.log("Creating JWT with payload:", payload);

    if (!jwtSecret) {
      console.error("JWT_SECRET is undefined!");
      return res.status(500).json({
        status: 'error',
        message: 'Server configuration error',
      });
    }

    let token;
    try {
      token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
    } catch (jwtError) {
      console.error("JWT signing failed:", jwtError.message);
      return res.status(500).json({
        status: 'error',
        message: 'Token generation failed',
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log("JWT created:", token);
    }

    return res.status(200).json({
      status: 'success',
      message: 'Employee logged in successfully',
      data: {
        employee_token: result.token
      }      
    });

  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    return res.status(500).json({
      status: 'error',
      message: 'Login failed due to server error',
    });
  }
}

module.exports = { login };
