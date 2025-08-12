const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Middleware to check if user is authenticated (for session-based auth)
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// Middleware to check if user has specific social media connected
const requireSocialMedia = (provider) => {
  return (req, res, next) => {
    // In a real app, check database for user's connected accounts
    // For now, check session
    if (req.session[`${provider}Connected`]) {
      return next();
    }
    res.status(403).json({ 
      error: `${provider} account not connected`,
      requiredProvider: provider 
    });
  };
};

// Rate limiting middleware for API calls
const rateLimit = require('express-rate-limit');

const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs, // 15 minutes default
    max, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Specific rate limits for different endpoints
const authRateLimit = createRateLimit(15 * 60 * 1000, 10); // 10 auth attempts per 15 minutes
const apiRateLimit = createRateLimit(15 * 60 * 1000, 100); // 100 API calls per 15 minutes
const socialMediaRateLimit = createRateLimit(60 * 1000, 5); // 5 social media actions per minute

module.exports = {
  verifyToken,
  requireAuth,
  requireSocialMedia,
  authRateLimit,
  apiRateLimit,
  socialMediaRateLimit
};