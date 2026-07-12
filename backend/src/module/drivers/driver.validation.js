import { body, param, query } from 'express-validator';

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;

export const createDriverValidation = [
  body('name').notEmpty().withMessage('Driver name is required'),
  body('licenseNumber')
    .notEmpty()
    .withMessage('License number is required')
    .isLength({ max: 20 })
    .withMessage('License number too long'),
  body('licenseCategory')
    .notEmpty()
    .withMessage('License category is required')
    .isIn(['A', 'B', 'C', 'D', 'E', 'F'])
    .withMessage('Invalid license category'),
  body('licenseExpiryDate')
    .isISO8601()
    .withMessage('Invalid date format')
    .toDate()
    .custom((value) => {
      if (value <= new Date()) {
        throw new Error('License expiry date must be in the future');
      }
      return true;
    }),
  body('contactNumber')
    .notEmpty()
    .withMessage('Contact number is required')
    .matches(phoneRegex)
    .withMessage('Invalid phone number format'),
  body('safetyScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Safety score must be between 0 and 100'),
  body('status')
    .optional()
    .isIn(['available', 'on_trip', 'off_duty', 'suspended'])
    .withMessage('Invalid status'),
];

export const updateDriverValidation = [
  param('id').isMongoId().withMessage('Invalid driver ID'),
  body('licenseNumber')
    .optional()
    .isLength({ max: 20 })
    .withMessage('License number too long'),
  body('licenseCategory')
    .optional()
    .isIn(['A', 'B', 'C', 'D', 'E', 'F'])
    .withMessage('Invalid license category'),
  body('licenseExpiryDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .toDate()
    .custom((value) => {
      if (value <= new Date()) {
        throw new Error('License expiry date must be in the future');
      }
      return true;
    }),
  body('contactNumber')
    .optional()
    .matches(phoneRegex)
    .withMessage('Invalid phone number format'),
  body('safetyScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Safety score must be between 0 and 100'),
];

export const driverIdValidation = [
  param('id').isMongoId().withMessage('Invalid driver ID'),
];

export const listDriversValidation = [
  query('status')
    .optional()
    .isIn(['available', 'on_trip', 'off_duty', 'suspended']),
  query('licenseExpirySoon').optional().isBoolean(),
  query('search').optional().trim(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('skip').optional().isInt({ min: 0 }),
];