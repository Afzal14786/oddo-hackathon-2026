import express from 'express';
import { create, close, list, getOne, update, remove} from './maintenance.controller.js';
import { createMaintenanceValidation, updateMaintenanceValidation, maintenanceIdValidation, closeMaintenanceValidation, listMaintenanceValidation} from './maintenance.validation.js';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validation.middleware.js';

const router = express.Router();

// all maintenance routes require authentication
router.use(authenticate);

// read endpoints -- any authenticated user can view
router.get('/', listMaintenanceValidation, validate, list);
router.get('/:id', maintenanceIdValidation, validate, getOne);

// write endpoints -- only fleet_manager can create/update/delete/close
router.use(authorize(['fleet_manager']));

router.post('/', createMaintenanceValidation, validate, create);
router.patch('/:id', updateMaintenanceValidation, validate, update);
router.delete('/:id', maintenanceIdValidation, validate, remove);
router.post('/:id/close', closeMaintenanceValidation, validate, close);

export default router;