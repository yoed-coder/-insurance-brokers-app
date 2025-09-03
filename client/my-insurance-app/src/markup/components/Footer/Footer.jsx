import React from 'react';
import { Link } from 'react-router-dom';
import { MdEmail } from "react-icons/md";
import './foot.css';

function FooterPage() {
  return (

          <footer className="about-footer">
          <div className="footer-content">
            <div className="footer-column">
              <h3>Abiy & Binyam Insurance</h3>
              <p>Your trusted partner for all your insurance needs. We're committed to providing exceptional service and tailored coverage options.</p>
            </div>
            
            <div className="footer-column">
              <h3>Contact Us</h3>
              <p><i className="fas fa-map-marker-alt"></i> Flamingo, Addis Ababa</p>
              <p><i className="fas fa-phone"></i> +251 123 456 789</p>
              <p><i className="fas fa-envelope"></i> abinsurancebro@gmail.com</p>
            </div>
            
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/service">Service</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 Abiy & Binyam Insurance Brokers. All rights reserved.</p>
          </div>
        </footer>
  );
}

export default FooterPage;
