import React from "react";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  return (
    <div className="register-page">
      <div className="register-wrapper">
        {/* LEFT PANEL */}
        <div className="register-left">
          <div className="overlay">
            <h1>Join AgroFresh</h1>
            <p>Empowering Farmers & Connecting Fresh Produce To Everyone</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="register-right">
          <h2>Create Account</h2>
          <p>Register to start using AgroFresh</p>

          <form>
            <div className="form-group">
              <input type="text" id="fullName" placeholder=" " required />
              <label htmlFor="fullName">Full Name</label>
            </div>

            <div className="form-group">
              <input type="email" id="email" placeholder=" " required />
              <label htmlFor="email">Email Address</label>
            </div>

            <div className="form-group">
              <input type="tel" id="mobile" placeholder=" " required />
              <label htmlFor="mobile">Mobile Number</label>
            </div>

            <div className="form-group">
              <input type="text" id="address" placeholder=" " required />
              <label htmlFor="address">Address</label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input type="password" id="password" placeholder=" " required />
                <label htmlFor="password">Password</label>
              </div>
              <div className="form-group">
                <input type="password" id="confirmPassword" placeholder=" " required />
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>
            </div>

            {/* USER TYPE */}
            <div className="user-type">
              <span className="user-type-label">I am a:</span>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" name="userType" value="farmer" required />
                  <span className="radio-custom"></span>
                  Farmer
                </label>
                <label className="radio-option">
                  <input type="radio" name="userType" value="customer" />
                  <span className="radio-custom"></span>
                  Customer
                </label>
              </div>
            </div>

            <button type="submit" className="register-btn">Register</button>
          </form>

          <div className="register-footer">
            <p>Already have an account?</p>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;