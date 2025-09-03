import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/authContext';
import loginService from '../../../../services/login.service';
import getAuth from '../../../../util/auth';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [employee_email, setEmail] = useState('');
  const [employee_password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    let valid = true;

    // ✅ Email validation
    if (!employee_email) {
      setEmailError('Please enter your email address');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee_email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError('');
    }

    // ✅ Password validation
    if (!employee_password || employee_password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    setIsLoading(true);
    
    try {
      const data = await loginService.login({ employee_email, employee_password });

      if (data.token) {
        localStorage.setItem('employee_token', data.token);

        const employeeData = await getAuth();
        if (employeeData) {
          login({ data: employeeData, token: data.token });
          navigate('/menu');
        } else {
          setServerError('Failed to decode token.');
        }
      } else {
        setServerError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error(err);
      setServerError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-heading">Login to your account<span className="red-dot">.</span></h1>
        <form onSubmit={handleSubmit}>
          <div className="login-form">
            {serverError && <div className="server-error">{serverError}</div>}

            <div className="input-group">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="text"
                placeholder="Email"
                className="login-input"
                value={employee_email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              {emailError && <div className="validation-error">{emailError}</div>}
            </div>

            <div className="input-group password-group">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="login-input"
                value={employee_password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6.71277 6.7226C3.66479 8.79539 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M14 14.2362C13.4692 14.7111 12.7684 15 12 15C10.3431 15 9 13.6569 9 12C9 11.2316 9.28885 10.5308 9.76381 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12C2 12 5.63636 5 12 5C18.3636 5 22 12 22 12C22 12 18.3636 19 12 19C5.63636 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>
              {passwordError && <div className="validation-error">{passwordError}</div>}
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;