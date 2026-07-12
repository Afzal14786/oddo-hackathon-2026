import express from 'express';
import authRoutes from '../module/auth/auth.routes.js';

const router = express.Router();

// auth routes
router.use('/auth', authRoutes);



export default router;