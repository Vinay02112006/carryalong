import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for user authentication
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
