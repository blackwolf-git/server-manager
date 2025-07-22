const { check, validationResult } = require('express-validator');

exports.validateRegister = [
  check('full_name')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3, max: 50 }).withMessage('Full name must be between 3-50 characters'),
  
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  
  check('phone_number')
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone().withMessage('Please provide a valid phone number'),
  
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

exports.validateLogin = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  
  check('password')
    .notEmpty().withMessage('Password is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];
