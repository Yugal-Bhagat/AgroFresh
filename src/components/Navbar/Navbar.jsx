import React from "react";
import { Link } from "react-router-dom";
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
          <li><Link to="/">Home</Link></li>

          <li><a href="/#about">About</a></li>

          <li><Link to="/services">Services</Link></li>

          <li><Link to="/marketplace">Marketplace</Link></li>

          <li><Link to="/schemes">Schemes</Link></li>

          <li><Link to="/contact">Contact Us</Link></li>
        </ul>

        <div className="login-btn">
          <Link to="/login">Login</Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;