import express from 'express';
import authRoutes from '../module/auth/auth.routes.js';
import vehicleRoutes from '../module/vehicles/vehicle.routes.js';
import driverRoutes from '../module/drivers/driver.routes.js';
import tripRoutes from '../module/trips/trip.routes.js';
import maintenanceRoutes from '../module/maintenance/maintenance.routes.js';

const router = express.Router();

// auth routes
router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/trips', tripRoutes);
router.use('/maintenance', maintenanceRoutes);

export default router;