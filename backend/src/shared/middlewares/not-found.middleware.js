import { AppError } from '../utils/app-error.js';
import { HTTP_STATUS } from '../constant/http-codes.js';

// middleware to catch all unmatched routes and return a 404 error.
export const notFoundHandler = (req, res, next) => {
  next(new AppError(HTTP_STATUS.NOT_FOUND, `Route ${req.originalUrl} not found`));
};