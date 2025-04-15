const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Middleware to verify JWT token and protect routes
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by id and remove password from the result
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }
      
      console.log(`[AUTH] User authenticated: ${req.user._id} (${req.user.name})`);
      next();
      return;
    } catch (error) {
      console.error('[AUTH] Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
        error: error.message,
      });
    }
  }

  if (!token) {
    console.error('[AUTH] No token provided in request');
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
};

/**
 * Middleware to check if user is admin
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as an admin',
    });
  }
};

module.exports = { protect, admin }; 