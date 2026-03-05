import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        <div className="nav-logo">
          <span className="logo-icon">🌱</span>
          <h2>AgroFresh</h2>
        </div>

        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/marketplace">Marketplace</a></li>
          <li><a href="/schemes">Schemes</a></li>
          <li><a href="/contact">Contact Us</a></li>
        </ul>

        <div className="login-btn">
          <a href="/login">Login</a>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;