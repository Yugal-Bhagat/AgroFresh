import Joi from 'joi';

export const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().required().trim().messages({
      'string.empty': 'Full name is required',
    }),
    email: Joi.string().email().required().lowercase().trim().messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required',
    }),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
      'string.pattern.base': 'Mobile number must be 10 digits',
      'string.empty': 'Mobile number is required',
    }),
    address: Joi.string().required().trim().messages({
      'string.empty': 'Address is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Please confirm your password',
    }),
    userType: Joi.string().valid('farmer', 'customer').required().messages({
      'any.only': 'User type must be either farmer or customer',
      'string.empty': 'Please select user type',
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors });
  }
  next();
};