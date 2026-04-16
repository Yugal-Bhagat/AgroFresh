
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        localStorage.setItem("token", data.token);
        // Optionally store user info
        localStorage.setItem("userType", data.user.userType);
        // window.location.href = "/";
        // Redirect based on userType
        if (data.user.userType === "admin") navigate("/admin-dashboard");
        else if (data.user.userType === "farmer") navigate("/farmer-dashboard");
        else navigate("/user-dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
    setLoading(false);
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
              />
              <label htmlFor="password">Password</label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
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