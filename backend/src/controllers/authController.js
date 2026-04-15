import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, mobile, address, password, userType } = req.body;

    if (!fullName || !email || !mobile || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (!userType) {
      return res.status(400).json({ message: "Please select user type" });
    }

    // Check if user exists
    const emailUsed = await User.findOne({ email });
    const mobileUsed = await User.findOne({ mobile });

    if (emailUsed && mobileUsed) {
      return res
        .status(400)
        .json({
          message:
            "Email and mobile number already registered , Please use a different email and mobile number",
        });
    }
    if (mobileUsed)
      return res
        .status(400)
        .json({ message: "Mobile number already registered" });
    if (emailUsed)
      return res.status(400).json({ message: "Email already registered" });

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

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];

      return res.status(400).json({
        message: `${field} already exists`,
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        userType: user.userType,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
