import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaFileAlt, FaUsers, FaUserPlus, FaClipboardList,
  FaPlus, FaMoneyBillWave, FaBars, FaSignOutAlt, FaSignInAlt, FaRobot
} from 'react-icons/fa';
import './menu.css';
import { useAuth } from '../../../../context/authContext';

function Menu() {
  const [isOpen, setIsOpen] = useState(true);
  const { employee, logout } = useAuth();
  const navigate = useNavigate();

  // Typewriter effect
  const fullText = employee?.firstname ? `Welcome ${employee.firstname}` : 'Please login';
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [fullText]);

  const handleAuthClick = () => {
    if (employee) {
      logout();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  const goToAIAssistant = () => {
    navigate('/letter');
  };

  return (
    <div className="menu">
      {/* Typewriter welcome message */}
      <div className="welcome-container">
        <div className="welcome-text typewriter">{displayedText}</div>
      </div>

      {/* Sidebar */}
      <div className={`side-bar ${isOpen ? 'open' : 'collapsed'}`}>
        <div className="top-section">
          <h1 className="side-header">{isOpen ? "ADMIN MENU" : "AM"}</h1>
          <button 
            className="toggle-btn" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Collapse menu" : "Expand menu"}
          >
            <FaBars />
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/expiring" className="side-link">
            <FaTachometerAlt className="icon" /> 
            {isOpen && <span>Dashboard</span>}
          </Link>
          <Link to="/policy" className="side-link">
            <FaPlus className="icon" /> 
            {isOpen && <span>Add Policy</span>}
          </Link>
          <Link to="/policies" className="side-link">
            <FaFileAlt className="icon" /> 
            {isOpen && <span>Policies</span>}
          </Link>
          <Link to="/employee" className="side-link">
            <FaUserPlus className="icon" /> 
            {isOpen && <span>Add Employee</span>}
          </Link>
          <Link to="/employees" className="side-link">
            <FaUsers className="icon" /> 
            {isOpen && <span>Employees</span>}
          </Link>
          <Link to="/claim" className="side-link">
            <FaPlus className="icon" /> 
            {isOpen && <span>Add Claim</span>}
          </Link>
          <Link to="/claims" className="side-link">
            <FaClipboardList className="icon" /> 
            {isOpen && <span>Claims</span>}
          </Link>
          <Link to="/commission" className="side-link">
            <FaMoneyBillWave className="icon" /> 
            {isOpen && <span>Commission</span>}
          </Link>

          {/* Audit Logs Button - highlighted for Admins */}
          <Link 
            to="/audit" 
            className={`side-link audit-btn ${employee?.role === 'Admin' ? 'admin' : ''}`}
          >
            <FaClipboardList className="icon" /> 
            {isOpen && <span>Audit Logs</span>}
          </Link>
        </nav>

        {/* Login/Logout Button */}
        <button 
          className="side-link logout-btn" 
          onClick={handleAuthClick}
          aria-label={employee ? "Logout" : "Login"}
        >
          {employee ? (
            <>
              <FaSignOutAlt className="icon" /> 
              {isOpen && <span>Logout</span>}
            </>
          ) : (
            <>
              <FaSignInAlt className="icon" /> 
              {isOpen && <span>Login</span>}
            </>
          )}
        </button>
      </div>

      {/* Floating AI Button */}
      <button 
        className="ai-toggle-btn" 
        onClick={goToAIAssistant}
        aria-label="AI Assistant"
      >
        <FaRobot size={24} />
      </button>
    </div>
  );
}

export default Menu;
