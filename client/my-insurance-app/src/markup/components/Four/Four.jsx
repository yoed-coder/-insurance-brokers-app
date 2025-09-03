import React from 'react';
import { Link } from 'react-router-dom';
import './404.css';

function Four() {
  return (
    <div className="page-container">
      <div className="content">
        <div className="number">4</div>
        <div className="moon"></div>
        <div className="number">4</div>
        
        <div className="text">Page not found</div>
        <p className="message">
          The page you are looking for might have been removed,<br/>
          had its name changed, or is temporarily unavailable.
        </p>
        
        <Link to="/" className="home-button">
          <span>Go Home</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </Link>
      </div>
      
      <div className="stars">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="star" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 5}s`
          }}></div>
        ))}
      </div>
    </div>
  );
}

export default Four;