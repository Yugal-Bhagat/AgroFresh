import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { count } = useCart();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const fetchWishlistCount = async () => {
      const token = localStorage.getItem("token");
      const type = localStorage.getItem("userType");
      if (!token || type !== "customer") {
        setWishlistCount(0);
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setWishlistCount((data.products || []).filter(Boolean).length);
      } catch {
        /* ignore */
      }
    };
    fetchWishlistCount();
    const onStorage = () => fetchWishlistCount();
    window.addEventListener("focus", fetchWishlistCount);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("focus", fetchWishlistCount);
      window.removeEventListener("storage", onStorage);
    };
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("userType");
    setIsLoggedIn(!!token);
    setUserType(type);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    setUserType(null);
    navigate("/login");
  };

  const handleProfile = () => {
    if (userType === "farmer") {
      navigate("/farmer-dashboard");
    } else {
      navigate("/customer-dashboard");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Get profile icon based on user type
  const getProfileIcon = () => {
    if (userType === "farmer") {
      return "👨‍🌾"; // Farmer icon
    } else if (userType === "customer") {
      return "👤"; // Customer icon
    }
    return "👤"; // Default icon
  };

  // Get profile button text based on user type
  const getProfileText = () => {
    if (userType === "farmer") {
      return "Farmer Profile";
    } else if (userType === "customer") {
      return "My Profile";
    }
    return "Profile";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
          <span className="logo-icon">🌱</span>
          <h2>AgroFresh</h2>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className={`nav-links ${isMobileMenuOpen ? "mobile-active" : ""}`}>
          <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
          <li><a href="/#about" onClick={closeMobileMenu}>About</a></li>
          <li><Link to="/services" onClick={closeMobileMenu}>Services</Link></li>
          <li><Link to="/marketplace" onClick={closeMobileMenu}>Marketplace</Link></li>
          <li><Link to="/schemes" onClick={closeMobileMenu}>Schemes</Link></li>
          <li><Link to="/contact" onClick={closeMobileMenu}>Contact Us</Link></li>
        </ul>

        {/* Login/Profile Button */}
        <div className="nav-actions">
          {userType !== "farmer" && userType !== "admin" && (
            <Link
              to={isLoggedIn ? "/customer-dashboard" : "/login"}
              className="cart-nav-link"
              aria-label="Wishlist"
              onClick={(e) => {
                if (isLoggedIn) {
                  e.preventDefault();
                  navigate("/customer-dashboard", { state: { tab: "wishlist" } });
                }
              }}
              title="Wishlist"
            >
              <span className="cart-nav-icon">❤️</span>
              {wishlistCount > 0 && (
                <span className="cart-nav-badge">{wishlistCount}</span>
              )}
            </Link>
          )}
          <Link to="/cart" className="cart-nav-link" aria-label="Cart">
            <span className="cart-nav-icon">🛒</span>
            {count > 0 && <span className="cart-nav-badge">{count}</span>}
          </Link>
          {isLoggedIn ? (
            <div className="profile-menu">
              <button className="profile-btn" onClick={handleProfile}>
                <span className="profile-icon">{getProfileIcon()}</span>
                <span className="profile-text">{getProfileText()}</span>
              </button>
              <button className="logout-btn-desktop" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button
              className="login-btn"
              onClick={() => navigate("/login", { state: { from: location } })}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button className="mobile-menu-icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <ul>
            <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
            <li><a href="/#about" onClick={closeMobileMenu}>About</a></li>
            <li><Link to="/services" onClick={closeMobileMenu}>Services</Link></li>
            <li><Link to="/marketplace" onClick={closeMobileMenu}>Marketplace</Link></li>
            <li><Link to="/schemes" onClick={closeMobileMenu}>Schemes</Link></li>
            <li><Link to="/contact" onClick={closeMobileMenu}>Contact Us</Link></li>
            {isLoggedIn ? (
              <>
                <li>
                  <button onClick={() => {
                    handleProfile();
                    closeMobileMenu();
                  }}>
                    <span className="profile-icon">{getProfileIcon()}</span>
                    {getProfileText()}
                  </button>
                </li>
                <li>
                  <button onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={() => {
                  navigate("/login");
                  closeMobileMenu();
                }}>
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;