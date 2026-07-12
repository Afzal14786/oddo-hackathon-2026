import express from 'express';
import authRoutes from '../module/auth/auth.routes.js';
import vehicleRoutes from '../module/vehicles/vehicle.routes.js';
import driverRoutes from '../module/drivers/driver.routes.js';

const router = express.Router();

// auth routes
router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);


export default router;