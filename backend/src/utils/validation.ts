import { body } from 'express-validator';

export const validateSignup = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('username').not().isEmpty().withMessage('Username is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').not().isEmpty().withMessage('Password is required'),
];
