import React from "react";
import "./Navbar.css";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    navigate("/login");
  };
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
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <button onClick={() => navigate("/login")}>Login</button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;