import jwt from 'jsonwebtoken';

/**
 * Generate signed JWT token with minimal non-sensitive payload
 */
export const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const payload = {
    userId: user._id ? user._id.toString() : user.id,
    email: user.email,
    role: user.role || 'customer',
    tokenVersion: user.tokenVersion !== undefined ? user.tokenVersion : 0,
  };

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export default generateToken;
