// routes/employee.routes.js
const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employee.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// ✅ LOGIN (Public)
router.post('/employees/login', employeeController.loginEmployee);

// ✅ CREATE employee (Admin only)
router.post('/employee', verifyToken, isAdmin, employeeController.createEmployee);

// ✅ READ all employees (Admin only)
router.get('/employees', verifyToken, isAdmin, employeeController.getAllEmployees);

// ✅ UPDATE employee by ID (Admin only)
router.put('/employees/:id', verifyToken, isAdmin, employeeController.updateEmployee);

// ✅ DELETE employee by ID (Admin only)
router.delete('/employees/:id', verifyToken, isAdmin, employeeController.deleteEmployee);

module.exports = router;
