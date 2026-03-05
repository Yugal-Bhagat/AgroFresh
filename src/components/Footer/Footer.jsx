import React from "react";
import "./Footer.css";

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
            <li><a href="/">Home</a></li>
            <li><a href="/">About</a></li>
            <li><a href="/">Services</a></li>
            <li><a href="/">Marketplace</a></li>
            <li><a href="/">Feedback</a></li>
          </ul>
        </div>

        {/* Farmer Services */}
        <div className="footer-section">
          <h3>Farmer Services</h3>
          <ul>
            <li><a href="/">Government Schemes</a></li>
            <li><a href="/">Farming Tips</a></li>
            <li><a href="/">Buy Seeds</a></li>
            <li><a href="/">Fertilizers</a></li>
            <li><a href="/">Farm Equipment</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@agrofresh.com</p>
          <p>Phone: +91 9876543210</p>
          <p>India</p>

          <div className="social-icons">
            <i className="fab fa-facebook"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-linkedin"></i>
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