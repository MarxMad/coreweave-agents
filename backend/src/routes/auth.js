const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Twitter OAuth routes
router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    const token = jwt.sign(
      { userId: req.user.id, provider: 'twitter' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/launch?token=${token}&provider=twitter&connected=true`);
  }
);

// Discord OAuth routes
router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    const token = jwt.sign(
      { userId: req.user.id, provider: 'discord' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/launch?token=${token}&provider=discord&connected=true`);
  }
);

// Telegram bot integration
router.post('/telegram/connect', async (req, res) => {
  try {
    const { botToken, chatId } = req.body;
    
    if (!botToken || !chatId) {
      return res.status(400).json({ error: 'Bot token and chat ID are required' });
    }
    
    // Verify bot token by making a test API call
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const botInfo = await response.json();
    
    if (!botInfo.ok) {
      return res.status(400).json({ error: 'Invalid bot token' });
    }
    
    // Store the connection (in a real app, save to database)
    // For now, we'll just return success
    res.json({
      success: true,
      botInfo: {
        username: botInfo.result.username,
        firstName: botInfo.result.first_name
      },
      chatId
    });
  } catch (error) {
    console.error('Telegram connection error:', error);
    res.status(500).json({ error: 'Failed to connect to Telegram' });
  }
});

// Get user's connected accounts
router.get('/connected-accounts', (req, res) => {
  // In a real app, fetch from database based on user session
  // For now, return mock data
  res.json({
    twitter: req.session.twitterConnected || false,
    discord: req.session.discordConnected || false,
    telegram: req.session.telegramConnected || false
  });
});

// Disconnect account
router.post('/disconnect/:provider', (req, res) => {
  const { provider } = req.params;
  
  // In a real app, remove from database
  // For now, just update session
  req.session[`${provider}Connected`] = false;
  
  res.json({ success: true, message: `${provider} disconnected` });
});

// Get user info
router.get('/user', (req, res) => {
  if (req.user) {
    res.json({
      id: req.user.id,
      username: req.user.username,
      provider: req.user.provider
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;