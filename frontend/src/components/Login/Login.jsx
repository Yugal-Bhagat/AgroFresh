import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import { useCart } from "../../context/CartContext";

const Login = () => {
  const { mergeWithBackend } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.user.userType);
        localStorage.setItem("userName", data.user.fullName);
        localStorage.setItem("userId", data.user._id);

        // Merge guest cart with server-side cart
        await mergeWithBackend();

        // Redirect based on userType
        if (data.user.userType === "farmer") {
          navigate("/farmer-dashboard");
        } else if (data.user.userType === "admin") {
          navigate("/admin-dashboard");
        } else {
          // For customer, redirect to the page they came from or marketplace
          const from = location.state?.from?.pathname || "/marketplace";
          navigate(from);
        }
      } else {
        // Handle specific error messages
        if (data.message === "Invalid email or password") {
          setError("Invalid email or password. Please try again.");
        } else if (data.message === "User not found") {
          setError("No account found with this email. Please register first.");
        } else {
          setError(data.message || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to server. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Left Section */}
        <div className="login-left">
          <div className="overlay">
            <h1>AgroFresh</h1>
            <p>Connecting Farmers Directly With Consumers</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <h2>Welcome Back</h2>
          <p>Login to your AgroFresh account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder=" "
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <label htmlFor="email">Email Address</label>
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                placeholder=" "
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <label htmlFor="password">Password</label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account?</p>
            <Link to="/register">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;