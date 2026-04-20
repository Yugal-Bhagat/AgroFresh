import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, mobile, address, password, confirmPassword, userType } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user exists
    const emailUsed = await User.findOne({ email });
    const mobileUsed = await User.findOne({ mobile });

    if (emailUsed && mobileUsed) {
      return res.status(400).json({
        message: "Email and mobile number already registered. Please use different credentials.",
      });
    }
    if (mobileUsed) {
      return res.status(400).json({ message: "Mobile number already registered" });
    }
    if (emailUsed) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      fullName,
      email,
      mobile,
      address,
      password: hashedPassword,
      userType,
    });
    await user.save();

    // Generate token for auto-login after registration
    const token = jwt.sign(
      { userId: user._id, role: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        userType: user.userType,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        message: `${field} already exists`,
      });
    }

    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        userType: user.userType,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

// Get current user (for authentication check)
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// Get current user profile (protected route example)
export const getProfile = async (req, res) => {
  try {
    // User is already attached by protect middleware
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName, mobile, address } = req.body;

    const user = await User.findById(req.user._id);

    if (fullName) user.fullName = fullName;
    if (mobile) user.mobile = mobile;
    if (address) user.address = address;

    await user.save();

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
      userType: user.userType,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};