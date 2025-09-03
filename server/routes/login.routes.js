const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const loginController = require('../controllers/login.controller');


router.post(
  '/employees/login',
  [
    body('employee_email').isEmail().withMessage('Valid email is required'),
    body('employee_password').notEmpty().withMessage('Password is required')
  ],
  loginController.login
);

module.exports = router;
