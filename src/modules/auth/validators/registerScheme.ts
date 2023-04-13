import { body } from 'express-validator';

const registerSchema = [
  body('username')
    .notEmpty()
    .withMessage('You forgot to enter username'),
  body('email')
    .isEmail()
    .withMessage('Email must contain a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export { registerSchema };