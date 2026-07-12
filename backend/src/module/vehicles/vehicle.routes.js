import express from 'express';
import {create, list, getOne, update, remove} from './vehicle.controller.js';
import { createVehicleValidation, updateVehicleValidation, vehicleIdValidation, listVehiclesValidation} from './vehicle.validation.js';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validation.middleware.js';

const router = express.Router();

// all vehicle routes require authentication
router.use(authenticate);

// public read endpoints (any authenticated user)
router.get('/', listVehiclesValidation, validate, list);
router.get('/:id', vehicleIdValidation, validate, getOne);

// write endpoints restricted to fleet_manager
router.use(authorize(['fleet_manager']));

router.post('/', createVehicleValidation, validate, create);
router.patch('/:id', updateVehicleValidation, validate, update);
router.delete('/:id', vehicleIdValidation, validate, remove);

export default router;