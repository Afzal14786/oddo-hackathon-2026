import express from 'express';
import { register, login, logout, getMe } from './auth.controller.js';
import { authLimiter } from '../../shared/middlewares/rate-limit.middleware.js';
import { authenticate } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validation.middleware.js';
import { registerValidation, loginValidation } from './auth.validation.js';

const router = express.Router();

// apply stricter rate limiting to auth endpoints
router.use(authLimiter);

// public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// protected routes
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;