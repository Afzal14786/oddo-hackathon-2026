import { registerUser, loginUser } from './auth.service.js';
import { generateToken, getCookieOptions } from './auth.utils.js';
import { ApiResponse } from '../../shared/utils/api-response.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';
import { AppError } from '../../shared/utils/app-error.js';

/**
 * register a new user.
 */
export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    new ApiResponse(
      res,
      HTTP_STATUS.CREATED,
      'User registered successfully',
      user
    ).send();
  } catch (error) {
    next(error);
  }
};

/**
 * login user – sets httpOnly cookie with JWT.
 */
export const login = async (req, res, next) => {
  try {
    const { user, token } = await loginUser(req.body);

    // s cookie with token
    res.cookie('token', token, getCookieOptions());

    new ApiResponse(
      res,
      HTTP_STATUS.OK,
      'Login successful',
      { user } // token not sent in body, only cookie
    ).send();
  } catch (error) {
    next(error);
  }
};

/**
 * logout – clear the token cookie.
 */
export const logout = (req, res) => {
  res.clearCookie('token', getCookieOptions());
  new ApiResponse(res, HTTP_STATUS.OK, 'Logged out successfully', null).send();
};

export const getMe = async (req, res, next) => {
  try {
    // req.user is attached by authenticate middleware
    new ApiResponse(
      res,
      HTTP_STATUS.OK,
      'User fetched successfully',
      req.user
    ).send();
  } catch (error) {
    next(error);
  }
};