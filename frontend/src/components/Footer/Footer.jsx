import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo Section */}
        <div className="footer-section">
          <h2 className="footer-logo">AgroFresh</h2>
          <p>
            Connecting farmers directly with customers. 
            Fresh products, fair prices, and smart farming solutions.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/#about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/marketplace">Marketplace</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
          </ul>
        </div>

        {/* Information Links */}
        <div className="footer-section">
          <h3>Information</h3>
          <ul>
            <li><Link to="/schemes">Government Schemes</Link></li>
            <li><Link to="/tips">Farming Tips</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@agrofresh.com</p>
          <p>Phone: +91 9876543210</p>
          <p>India</p>

          <div className="social-icons">
            <a href="https://www.facebook.com/agrofresh" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://www.instagram.com/agrofresh" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com/agrofresh" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com/company/agrofresh" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 AgroFresh | All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;