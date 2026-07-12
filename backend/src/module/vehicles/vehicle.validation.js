import { body, param, query } from 'express-validator';

export const createVehicleValidation = [
  body('registrationNumber')
    .notEmpty().withMessage('Registration number is required')
    .isLength({ max: 20 }).withMessage('Registration number too long'),
  body('name').notEmpty().withMessage('Vehicle name is required'),
  body('model').notEmpty().withMessage('Vehicle model is required'),
  body('type')
    .notEmpty().withMessage('Vehicle type is required')
    .isIn(['truck', 'van', 'bus', 'car', 'motorcycle', 'other']).withMessage('Invalid vehicle type'),
  body('maxLoadCapacity')
    .isNumeric().withMessage('Capacity must be a number')
    .isInt({ min: 0 }).withMessage('Capacity cannot be negative'),
  body('acquisitionCost')
    .isNumeric().withMessage('Cost must be a number')
    .isInt({ min: 0 }).withMessage('Cost cannot be negative'),
  body('region').optional().trim(),
];

export const updateVehicleValidation = [
  param('id').isMongoId().withMessage('Invalid vehicle ID'),
  body('registrationNumber')
    .optional()
    .isLength({ max: 20 }).withMessage('Registration number too long'),
  body('type')
    .optional()
    .isIn(['truck', 'van', 'bus', 'car', 'motorcycle', 'other']).withMessage('Invalid vehicle type'),
  body('maxLoadCapacity')
    .optional()
    .isNumeric().withMessage('Capacity must be a number')
    .isInt({ min: 0 }).withMessage('Capacity cannot be negative'),
  body('acquisitionCost')
    .optional()
    .isNumeric().withMessage('Cost must be a number')
    .isInt({ min: 0 }).withMessage('Cost cannot be negative'),
  // status is not allowed to be updated here
];

export const vehicleIdValidation = [
  param('id').isMongoId().withMessage('Invalid vehicle ID'),
];

export const listVehiclesValidation = [
  query('type').optional().isIn(['truck', 'van', 'bus', 'car', 'motorcycle', 'other']),
  query('status').optional().isIn(['available', 'on_trip', 'in_shop', 'retired']),
  query('region').optional().trim(),
  query('search').optional().trim(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('skip').optional().isInt({ min: 0 }),
];