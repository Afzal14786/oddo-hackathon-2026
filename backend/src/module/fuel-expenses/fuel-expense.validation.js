import { body, param, query } from 'express-validator';

// ----- Fuel -----

export const createFuelValidation = [
  body('vehicleId').isMongoId().withMessage('Invalid vehicle ID'),
  body('tripId').optional().isMongoId().withMessage('Invalid trip ID'),
  body('liters')
  .isFloat({ min: 0 }).withMessage('Liters must be a positive number'),
  body('cost')
  .isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
];

export const updateFuelValidation = [
  param('id').isMongoId().withMessage('Invalid fuel log ID'),
  body('liters')
  .isFloat({ min: 0 }).withMessage('Liters must be a positive number'),
  body('cost')
  .isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
];

export const fuelIdValidation = [
  param('id').isMongoId().withMessage('Invalid fuel log ID'),
];

export const listFuelValidation = [
  query('vehicleId').optional().isMongoId().withMessage('Invalid vehicle ID'),
  query('tripId').optional().isMongoId().withMessage('Invalid trip ID'),
  query('fromDate').optional().isISO8601().withMessage('Invalid from date'),
  query('toDate').optional().isISO8601().withMessage('Invalid to date'),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('skip').optional().isInt({ min: 0 }),
];

// ----- Expense -----

export const createExpenseValidation = [
  body('vehicleId').isMongoId().withMessage('Invalid vehicle ID'),
  body('tripId').optional().isMongoId().withMessage('Invalid trip ID'),
  body('type')
    .notEmpty().withMessage('Expense type is required')
    .isIn(['toll', 'maintenance', 'repair', 'other']).withMessage('Invalid expense type'),
  body('amount')
  .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('description').optional().trim(),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
];

export const updateExpenseValidation = [
  param('id').isMongoId().withMessage('Invalid expense ID'),
  body('type')
    .optional()
    .isIn(['toll', 'maintenance', 'repair', 'other']).withMessage('Invalid expense type'),
  body('amount')
  .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('description').optional().trim(),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
];

export const expenseIdValidation = [
  param('id').isMongoId().withMessage('Invalid expense ID'),
];

export const listExpenseValidation = [
  query('vehicleId').optional().isMongoId().withMessage('Invalid vehicle ID'),
  query('tripId').optional().isMongoId().withMessage('Invalid trip ID'),
  query('type').optional().isIn(['toll', 'maintenance', 'repair', 'other']),
  query('fromDate').optional().isISO8601().withMessage('Invalid from date'),
  query('toDate').optional().isISO8601().withMessage('Invalid to date'),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('skip').optional().isInt({ min: 0 }),
];