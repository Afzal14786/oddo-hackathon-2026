import { body, param, query } from 'express-validator';

export const createTripValidation = [
  body('source').notEmpty().withMessage('Source is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('cargoWeight')
    .isFloat({ min: 0 }).withMessage('Cargo weight must be a positive number'),
  body('plannedDistance')
    .isFloat({ min: 0 }).withMessage('Planned distance must be a positive number'),
  body('vehicleId').isMongoId().withMessage('Invalid vehicle ID'),
  body('driverId').isMongoId().withMessage('Invalid driver ID'),
  body('revenue')
    .optional()
    .isFloat({ min: 0 }).withMessage('Revenue must be a positive number'),
];

export const updateTripValidation = [
  param('id').isMongoId().withMessage('Invalid trip ID'),
  body('source').optional().notEmpty().withMessage('Source cannot be empty'),
  body('destination').optional().notEmpty().withMessage('Destination cannot be empty'),
  body('cargoWeight')
    .optional()
    .isFloat({ min: 0 }).withMessage('Cargo weight must be a positive number'),
  body('plannedDistance')
    .optional()
    .isFloat({ min: 0 }).withMessage('Planned distance must be a positive number'),
  body('vehicleId')
    .optional()
    .isMongoId().withMessage('Invalid vehicle ID'),
  body('driverId')
    .optional()
    .isMongoId().withMessage('Invalid driver ID'),
  body('revenue')
    .optional()
    .isFloat({ min: 0 }).withMessage('Revenue must be a positive number'),
];

export const tripIdValidation = [
  param('id').isMongoId().withMessage('Invalid trip ID'),
];

export const completeTripValidation = [
  param('id').isMongoId().withMessage('Invalid trip ID'),
  body('actualDistance')
    .isFloat({ min: 0 }).withMessage('Actual distance must be a positive number'),
  body('fuelConsumed')
    .isFloat({ min: 0 }).withMessage('Fuel consumed must be a positive number'),
  body('revenue')
    .optional()
    .isFloat({ min: 0 }).withMessage('Revenue must be a positive number'),
];

export const listTripsValidation = [
  query('status')
    .optional()
    .isIn(['draft', 'dispatched', 'completed', 'cancelled'])
    .withMessage('Invalid trip status'),
  query('vehicleId')
    .optional()
    .isMongoId().withMessage('Invalid vehicle ID'),
  query('driverId')
    .optional()
    .isMongoId().withMessage('Invalid driver ID'),
  query('fromDate')
    .optional()
    .isISO8601().withMessage('Invalid from date'),
  query('toDate')
    .optional()
    .isISO8601().withMessage('Invalid to date'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('skip')
    .optional()
    .isInt({ min: 0 }).withMessage('Skip must be 0 or greater'),
];