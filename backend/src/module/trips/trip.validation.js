import { body, param, query } from 'express-validator';

export const createTripValidation = [
  body('source').notEmpty().withMessage('Source is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('cargoWeight')
    .isNumeric().withMessage('Cargo weight must be a number')
    .isInt({ min: 0 }).withMessage('Cargo weight cannot be negative'),
  body('plannedDistance')
    .isNumeric().withMessage('Planned distance must be a number')
    .isInt({ min: 0 }).withMessage('Planned distance cannot be negative'),
  body('vehicleId').isMongoId().withMessage('Invalid vehicle ID'),
  body('driverId').isMongoId().withMessage('Invalid driver ID'),
  body('revenue').optional().isNumeric().withMessage('Revenue must be a number'),
];

export const updateTripValidation = [
  param('id').isMongoId().withMessage('Invalid trip ID'),
  body('source').optional().notEmpty().withMessage('Source cannot be empty'),
  body('destination').optional().notEmpty().withMessage('Destination cannot be empty'),
  body('cargoWeight')
    .optional()
    .isNumeric().withMessage('Cargo weight must be a number')
    .isInt({ min: 0 }).withMessage('Cargo weight cannot be negative'),
  body('plannedDistance')
    .optional()
    .isNumeric().withMessage('Planned distance must be a number')
    .isInt({ min: 0 }).withMessage('Planned distance cannot be negative'),
  body('vehicleId').optional().isMongoId().withMessage('Invalid vehicle ID'),
  body('driverId').optional().isMongoId().withMessage('Invalid driver ID'),
  body('revenue').optional().isNumeric().withMessage('Revenue must be a number'),
];

export const tripIdValidation = [
  param('id').isMongoId().withMessage('Invalid trip ID'),
];

export const completeTripValidation = [
  param('id').isMongoId().withMessage('Invalid trip ID'),
  body('actualDistance')
    .isNumeric().withMessage('Actual distance must be a number')
    .isInt({ min: 0 }).withMessage('Actual distance cannot be negative'),
  body('fuelConsumed')
    .isNumeric().withMessage('Fuel consumed must be a number')
    .isInt({ min: 0 }).withMessage('Fuel consumed cannot be negative'),
  body('revenue').optional().isNumeric().withMessage('Revenue must be a number'),
];

export const listTripsValidation = [
  query('status').optional().isIn(['draft', 'dispatched', 'completed', 'cancelled']),
  query('vehicleId').optional().isMongoId().withMessage('Invalid vehicle ID'),
  query('driverId').optional().isMongoId().withMessage('Invalid driver ID'),
  query('fromDate').optional().isISO8601().withMessage('Invalid from date'),
  query('toDate').optional().isISO8601().withMessage('Invalid to date'),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('skip').optional().isInt({ min: 0 }),
];