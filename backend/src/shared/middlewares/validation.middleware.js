import { validationResult } from 'express-validator';
import { AppError } from '../utils/app-error.js';
import { HTTP_STATUS } from '../constant/http-codes.js';

/**
 * middleware to check validation results from express-validator.
 * if errors exist, throws an AppError with all error messages.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg).join(', ');
    return next(new AppError(HTTP_STATUS.BAD_REQUEST, messages));
  }
  next();
};