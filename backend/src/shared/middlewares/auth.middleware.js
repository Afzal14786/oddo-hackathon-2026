import jwt from 'jsonwebtoken';
import { AppError } from '../utils/app-error.js';
import { HTTP_STATUS } from '../constant/http-codes.js';
import { User } from '../../module/users/users.models.js';

/**
 * middleware to authenticate request.
 * checks cookie 'token' first, then falls back to authorization header.
 */
export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // try cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // if not in cookie, try Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'No token provided');
    }

    // verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired token');
    }

    // fetch user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware.
 */
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(HTTP_STATUS.UNAUTHORIZED, 'Not authenticated'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(HTTP_STATUS.FORBIDDEN, 'Insufficient permissions'));
    }
    next();
  };
};