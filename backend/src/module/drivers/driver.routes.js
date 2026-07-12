import express from 'express';
import { create, list, getOne, update, remove, } from './driver.controller.js';
import { createDriverValidation, updateDriverValidation, driverIdValidation, listDriversValidation} from './driver.validation.js';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validation.middleware.js';

const router = express.Router();

// all driver routes require authentication
router.use(authenticate);

// read endpoints (any authenticated user)
router.get('/', listDriversValidation, validate, list);
router.get('/:id', driverIdValidation, validate, getOne);

// write endpoints restricted to fleet_manager
router.use(authorize(['fleet_manager']));

router.post('/', createDriverValidation, validate, create);
router.patch('/:id', updateDriverValidation, validate, update);
router.delete('/:id', driverIdValidation, validate, remove);

export default router;