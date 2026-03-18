import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
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

          <form>
            <div className="form-group">
              <input type="email" id="email" placeholder=" " required />
              <label htmlFor="email">Email Address</label>
            </div>

            <div className="form-group">
              <input type="password" id="password" placeholder=" " required />
              <label htmlFor="password">Password</label>
            </div>

            <button type="submit" className="login-btn">Login</button>
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