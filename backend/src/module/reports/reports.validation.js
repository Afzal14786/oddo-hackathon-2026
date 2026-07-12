import { query } from 'express-validator';

export const dashboardFiltersValidation = [
  query('type').optional().isIn(['truck', 'van', 'bus', 'car', 'motorcycle', 'other']),
  query('status').optional().isIn(['available', 'on_trip', 'in_shop', 'retired']),
  query('region').optional().trim(),
];

export const analyticsFiltersValidation = [
  query('vehicleId').optional().isMongoId().withMessage('Invalid vehicle ID'),
  query('fromDate').optional().isISO8601().withMessage('Invalid from date'),
  query('toDate').optional().isISO8601().withMessage('Invalid to date'),
];

export const exportCSVValidation = [
  query('vehicleId').optional().isMongoId().withMessage('Invalid vehicle ID'),
  query('fromDate').optional().isISO8601().withMessage('Invalid from date'),
  query('toDate').optional().isISO8601().withMessage('Invalid to date'),
];