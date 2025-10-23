import { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { validateSignup, validateLogin } from '../utils/validation';

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

export default router;
