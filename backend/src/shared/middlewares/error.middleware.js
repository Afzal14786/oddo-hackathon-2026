import { AppError } from '../utils/app-error.js';
import { HTTP_STATUS } from '../constant/http-codes.js';

export const errorHandler = (err, req, res, next) => {
  // default values
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let isOperational = false;

  // if it's our custom AppError, use its properties
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else if (err.name === 'ValidationError') {
    // mongoose validation error
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = Object.values(err.errors).map(e => e.message).join(', ');
    isOperational = true;
  } else if (err.code === 11000) {
    // mongoose duplicate key error
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
    isOperational = true;
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid ID format';
    isOperational = true;
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid or expired token';
    isOperational = true;
  }

  // log error 
  console.error(`[${new Date().toISOString()}]`, err);

  // Send response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    // only show stack trace
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    // include operational flag for frontend debugging
    isOperational,
  });
};