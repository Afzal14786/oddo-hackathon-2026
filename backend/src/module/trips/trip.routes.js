import express from 'express';
import {create, list, getOne, update, dispatch, complete, cancel, remove, } from './trip.controller.js';
import { createTripValidation, updateTripValidation, tripIdValidation, completeTripValidation, listTripsValidation } from './trip.validation.js';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validation.middleware.js';

const router = express.Router();

// all trip routes require authentication
router.use(authenticate);

// read endpoints - any authenticated user can view
router.get('/', listTripsValidation, validate, list);
router.get('/:id', tripIdValidation, validate, getOne);

// write endpoints – only fleet_manager can create/update/delete
router.use(authorize(['fleet_manager']));

router.post('/', createTripValidation, validate, create);
router.patch('/:id', updateTripValidation, validate, update);
router.delete('/:id', tripIdValidation, validate, remove);

// special actions – any authenticated user? actually PDF says driver creates trips? but we restrict to fleet_manager for MVP.
router.post('/:id/dispatch', tripIdValidation, validate, dispatch);
router.post('/:id/complete', completeTripValidation, validate, complete);
router.post('/:id/cancel', tripIdValidation, validate, cancel);

export default router;