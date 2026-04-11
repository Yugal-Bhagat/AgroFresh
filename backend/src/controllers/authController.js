import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, address, password, userType } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
  if (userExists) {
    if (userExists.email === email) {
      res.status(400);
      throw new Error('Email already registered');
    }
    if (userExists.mobile === mobile) {
      res.status(400);
      throw new Error('Mobile number already registered');
    }
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    fullName,
    email,
    mobile,
    address,
    password: hashedPassword,
    userType,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
      userType: user.userType,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});