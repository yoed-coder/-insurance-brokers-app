import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../context/authContext';
import employeeService from '../../../../services/employee.Service';
import './add.css';

function Add() {
  const [employee_email, setEmail] = useState('');
  const [employee_first_name, setFirstName] = useState('');
  const [employee_last_name, setLastName] = useState('');
  const [employee_phone, setPhone] = useState('');
  const [employee_password, setPassword] = useState('');
  const [active_employee, setActive_employee] = useState(1);
  const [company_role_id, setCompany_role_id] = useState(1);
  const [emailError, setEmailError] = useState('');
  const [firstNameRequired, setFirstNameRequired] = useState('');
  const [lastNameRequired, setLastNameRequired] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneNumberRequired, setPhoneNumberRequired] = useState('');
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { employee } = useAuth();
  const loggedInEmployeeToken = employee?.employee_token || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let valid = true;

    // ✅ Validations
    if (!employee_first_name) {
      setFirstNameRequired('First name is required');
      valid = false;
    } else {
      setFirstNameRequired('');
    }

    if (!employee_last_name) {
      setLastNameRequired('Last name is required');
      valid = false;
    } else {
      setLastNameRequired('');
    }

    if (!employee_email) {
      setEmailError('Email is required');
      valid = false;
    } else {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(employee_email)) {
        setEmailError('Invalid email format');
        valid = false;
      } else {
        setEmailError('');
      }
    }

    const phoneRegex = /^\d{9,15}$/;
    if (!employee_phone.trim()) {
      setPhoneNumberRequired('Phone number is required');
      valid = false;
    } else if (!phoneRegex.test(employee_phone.trim())) {
      setPhoneNumberRequired('Phone number must be numeric and valid format');
      valid = false;
    } else {
      setPhoneNumberRequired('');
    }

    if (!employee_password || employee_password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) {
      setIsSubmitting(false);
      return;
    }

    const formData = {
      employee_email,
      employee_first_name,
      employee_last_name,
      employee_phone,
      employee_password,
      active_employee,
      company_role_id,
    };

    try {
      // ✅ Create employee
      const data = await employeeService.createEmployee(formData, loggedInEmployeeToken);

      if (data?.error) {
        setServerError(data.error);
        setSuccess(false);
      } else {
        setSuccess(true);
        setServerError('');

        // ✅ Reset form fields
        setEmail('');
        setFirstName('');
        setLastName('');
        setPhone('');
        setPassword('');
        setActive_employee(1);
        setCompany_role_id(1);
      }
    } catch (error) {
      setServerError(
        error.response?.data?.error || error.message || 'An unexpected error occurred'
      );
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-container">
      <div className="add-card">
        <h1 className="add-heading">Add a New Employee <span className="heading-underline"></span></h1>
        
        <form onSubmit={handleSubmit} className="add-form">
          {serverError && <div className="error-message server-error">{serverError}</div>}
          {success && <div className="success-message">✅ Employee created successfully!</div>}

          <div className="form-grid">
            <div className="input-group">
              <input
                type="email"
                placeholder=" "
                className="form-input"
                value={employee_email}
                onChange={(e) => setEmail(e.target.value)}
                id="employee_email"
              />
              <label htmlFor="employee_email" className="input-label">Email Address</label>
              {emailError && <div className="error-message">{emailError}</div>}
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder=" "
                className="form-input"
                value={employee_first_name}
                onChange={(e) => setFirstName(e.target.value)}
                id="employee_first_name"
              />
              <label htmlFor="employee_first_name" className="input-label">First Name</label>
              {firstNameRequired && <div className="error-message">{firstNameRequired}</div>}
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder=" "
                className="form-input"
                value={employee_last_name}
                onChange={(e) => setLastName(e.target.value)}
                id="employee_last_name"
              />
              <label htmlFor="employee_last_name" className="input-label">Last Name</label>
              {lastNameRequired && <div className="error-message">{lastNameRequired}</div>}
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder=" "
                className="form-input"
                value={employee_phone}
                onChange={(e) => setPhone(e.target.value)}
                id="employee_phone"
              />
              <label htmlFor="employee_phone" className="input-label">Phone Number (555555555)</label>
              {phoneNumberRequired && <div className="error-message">{phoneNumberRequired}</div>}
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder=" "
                className="form-input"
                value={employee_password}
                onChange={(e) => setPassword(e.target.value)}
                id="employee_password"
              />
              <label htmlFor="employee_password" className="input-label">Password</label>
              {passwordError && <div className="error-message">{passwordError}</div>}
            </div>

            <div className="input-group">
              <label htmlFor="company_role_id" className="select-label">Role</label>
              <select
                className="form-select"
                value={company_role_id}
                onChange={(e) => setCompany_role_id(Number(e.target.value))}
                id="company_role_id"
              >
                <option value="1">Underwriter</option>
                <option value="2">Claim Officer</option>
                <option value="3">Admin</option>
              </select>
            </div>
          </div>

          <button 
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="button-spinner"></span>
                Adding Employee...
              </>
            ) : (
              'Add Employee'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Add;