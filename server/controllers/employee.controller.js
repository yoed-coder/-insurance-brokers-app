const employeeService = require('../services/employee.service');
const loginService = require('../services/login.service')

async function loginEmployee(req, res, next) {
  try {
    const { employee_email, employee_password } = req.body;
    console.log('Login attempt:', employee_email);

    if (!employee_email || !employee_password) {
      console.log('Missing credentials');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await loginService.login({ employee_email, employee_password });

    if (!result || !result.token) {
      console.log('Invalid credentials or missing token');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Login Employee Error:', error);
    return res.status(500).json({
      error: `Something went wrong during login: ${error.message}`,
    });
  }
}

async function createEmployee(req, res, next) {
  try {
    const employeeExists = await employeeService.checkIfEmployeeExists(req.body.employee_email);

    if (employeeExists) {
      return res.status(400).json({
        error: 'This email address is already associated with another employee',
      });
    }

    const employeeData = req.body;
    const employee = await employeeService.createEmployee(employeeData);

    if (!employee) {
      return res.status(400).json({
        error: 'Failed to add the employee',
      });
    }

    return res.status(201).json({
      status: 'success',
      message: 'Employee created successfully',
    });

  } catch (error) {
    console.error('Create Employee Error:', error);
    return res.status(500).json({
      error: `Something went wrong: ${error.message}`,
    });
  }
}


async function getAllEmployees(req, res, next) {
  try {
    const employees = await employeeService.getAllEmployees();

    if (!employees || employees.length === 0) {
      return res.status(404).json({
        error: 'No employees found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: employees,
    });

  } catch (error) {
    console.error('Get All Employees Error:', error);
    return res.status(500).json({
      error: `Something went wrong: ${error.message}`,
    });
  }
}

async function updateEmployee(req, res) {
  try {
    const { id } = req.params; 
    const updatedData = req.body;

    const result = await employeeService.updateEmployee(id, updatedData);

    if (result.success) {
      return res.status(200).json({ message: "Employee updated successfully", result });
    } else {
      return res.status(400).json({ message: "Update failed" });
    }
  } catch (err) {
    console.error("Controller updateEmployee error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  updateEmployee, 
};

async function deleteEmployee(req, res, next) {
  try {
    const employeeId = req.params.id;

    const deleted = await employeeService.deleteEmployee(employeeId);

    if (!deleted) {
      return res.status(400).json({ error: 'Failed to delete employee' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    console.error('Delete Employee Error:', error);
    return res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}


module.exports = {
  loginEmployee,
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
};
