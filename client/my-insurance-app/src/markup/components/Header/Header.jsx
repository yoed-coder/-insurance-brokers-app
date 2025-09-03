import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import './header.css';
import logo from '../../../assets/image/logo.png';

function HeaderPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { employee } = useAuth();
  const location = useLocation();
  // const title = "ABIY & BINYAM  INSURANCE  BROKERS";

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" className="abiy" />
        <span className="text" id='abib'>
          {/* {title.split("").map((char, index) => (
            <span key={index} style={{ '--i': index }}>{char}</span>
          ))} */}
            ABIY & BINYAM
        </span>
      </div>

      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/service" className="nav-link" onClick={() => setMenuOpen(false)}>Service</Link>
        <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</Link>

        {location.pathname === '/' && (
          <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
        )}

        {employee && (
          <>
            {/* Employee-only links */}
          </>
        )}
      </nav>
    </header>
  );
}

export default HeaderPage;
