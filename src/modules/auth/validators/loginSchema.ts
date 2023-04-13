import { body } from 'express-validator';

const loginSchema = [
  body('username')
    .notEmpty()
    .withMessage('You forgot to enter username'),
  body('password')
    .notEmpty()
    .withMessage('You forgot to enter password'),
];

export { loginSchema }