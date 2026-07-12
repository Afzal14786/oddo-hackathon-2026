import { body, param, query } from 'express-validator';

export const createMaintenanceValidation = [
  body('vehicleId').isMongoId().withMessage('Invalid vehicle ID'),
  body('type')
    .notEmpty()
    .withMessage('Maintenance type is required')
    .isIn(['oil_change', 'tyre_replacement', 'brake_service', 'engine_repair', 'general_service', 'other'])
    .withMessage('Invalid maintenance type'),
  body('description').optional().trim(),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('cost')
  .isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
];

export const updateMaintenanceValidation = [
  param('id').isMongoId().withMessage('Invalid maintenance ID'),
  body('type')
    .optional()
    .isIn(['oil_change', 'tyre_replacement', 'brake_service', 'engine_repair', 'general_service', 'other'])
    .withMessage('Invalid maintenance type'),
  body('description').optional().trim(),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('cost')
  .isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
];

export const maintenanceIdValidation = [
  param('id').isMongoId().withMessage('Invalid maintenance ID'),
];

export const closeMaintenanceValidation = [
  param('id').isMongoId().withMessage('Invalid maintenance ID'),
];

export const listMaintenanceValidation = [
  query('vehicleId').optional().isMongoId().withMessage('Invalid vehicle ID'),
  query('closed').optional().isBoolean().withMessage('closed must be true or false'),
  query('type')
    .optional()
    .isIn(['oil_change', 'tyre_replacement', 'brake_service', 'engine_repair', 'general_service', 'other']),
  query('fromDate').optional().isISO8601().withMessage('Invalid from date'),
  query('toDate').optional().isISO8601().withMessage('Invalid to date'),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('skip').optional().isInt({ min: 0 }),
];