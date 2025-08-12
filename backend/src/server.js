const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

// Import configurations and routes
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const { apiRateLimit } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiRateLimit);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true
  }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);

// API endpoints
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'CoreWeave Agents Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log('📱 Social media OAuth endpoints:');
  console.log(`   Twitter: http://localhost:${PORT}/auth/twitter`);
  console.log(`   Discord: http://localhost:${PORT}/auth/discord`);
  console.log(`   Telegram: POST http://localhost:${PORT}/auth/telegram`);
});

module.exports = app;