// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     mobile: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     address: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     userType: {
//       type: String,
//       enum: ['farmer', 'customer'],
//       required: true,
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model('User', userSchema);
// export default User;

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['farmer', 'customer'],
    required: true,
  },
}, { timestamps: true });

// ✅ Yeh line export karti hai (default export)
const User = mongoose.model('User', userSchema);
export default User;