// import express from 'express';
// import { registerUser } from '../controllers/authController.js';
// import { validateRegister } from '../middleware/validationMiddleware.js';

// const router = express.Router();

// router.post('/register', validateRegister, registerUser);

// export default router;
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, mobile, address, password, confirmPassword, userType } = req.body;

    // Basic validation
    const errors = [];
    if (!fullName) errors.push('Full name is required');
    if (!email) errors.push('Email is required');
    if (!mobile) errors.push('Mobile number is required');
    if (!address) errors.push('Address is required');
    if (!password) errors.push('Password is required');
    if (!confirmPassword) errors.push('Confirm password is required');
    if (password !== confirmPassword) errors.push('Passwords do not match');
    if (!userType || !['farmer', 'customer'].includes(userType)) {
      errors.push('User type must be either farmer or customer');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      mobile,
      address,
      password: hashedPassword,
      userType,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, userType: newUser.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        userType: newUser.userType,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;