import { User } from '../users/users.models.js';
import { generateToken } from './auth.utils.js';
import { AppError } from '../../shared/utils/app-error.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';

/**
 * registration
 */
export const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  // if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(HTTP_STATUS.CONFLICT, 'Email already registered');
  }

  // create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'driver',
  });

  // return user without password (toJSON already removes it)
  return user;
};

/**
 * login user.
 */
export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // find user with password field included
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
  }

  // compare passwords
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
  }

  // generate token
  const token = generateToken(user);

  return { user, token };
};