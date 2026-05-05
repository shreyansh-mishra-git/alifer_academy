const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ message: 'User not found' });

      // Check if subscription has expired
      const isSubscribed = req.user.subscriptionExpiry && req.user.subscriptionExpiry > new Date();
      req.user.isSubscribed = !!isSubscribed;

      // Single Device Login Check
      // The token's sessionId must match the activeSessionId stored in the database
      if (decoded.sessionId && req.user.activeSessionId !== decoded.sessionId) {
        return res.status(401).json({ message: 'Session expired or logged in from another device' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

module.exports = { protect, adminOnly };
