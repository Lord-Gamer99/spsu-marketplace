const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for user authentication
 * @param {string} id - User ID to encode in the token
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'spsu_marketplace_fallback_secret',
    { expiresIn: '30d' } // Token expires in 30 days
  );
};

module.exports = generateToken; 