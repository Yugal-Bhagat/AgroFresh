import React from "react";
import { Link } from "react-router-dom";
import "./Register.css";

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const data = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    mobile: formData.get("mobile"),
    address: formData.get("address"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    userType: formData.get("userType"),
  };

  console.log("Sending Data:", data); // ✅ DEBUG

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      localStorage.setItem("token", result.token);
      window.location.href = "/";
    } else {
      alert(result.errors ? result.errors.join("\n") : result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

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

          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <input type="text" id="fullName" name="fullName" placeholder=" " required />
              <label htmlFor="fullName">Full Name</label>
            </div>

            <div className="form-group">
              <input type="email" id="email" name="email" placeholder=" " required />
              <label htmlFor="email">Email Address</label>
            </div>

            <div className="form-group">
              <input type="tel" id="mobile" name="mobile" placeholder=" " required />
              <label htmlFor="mobile">Mobile Number</label>
            </div>

            <div className="form-group">
              <input type="text" id="address" name="address" placeholder=" " required />
              <label htmlFor="address">Address</label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input type="password" id="password" name="password" placeholder=" " required />
                <label htmlFor="password">Password</label>
              </div>

              <div className="form-group">
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder=" " required />
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

            <button type="submit" className="register-btn">
              Register
            </button>
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