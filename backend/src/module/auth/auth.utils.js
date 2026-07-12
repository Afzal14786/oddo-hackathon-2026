import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for a user.
 */
export const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Get cookie options (secure, httpOnly, etc.)
 */
export const getCookieOptions = () => ({
  httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});