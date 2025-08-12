const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Mock user database (in production, use a real database)
const users = [];
let userIdCounter = 1;

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

// Twitter Strategy
if (process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET) {
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/twitter/callback`
  },
  async (token, tokenSecret, profile, done) => {
    try {
      // Check if user already exists
      let user = users.find(u => u.twitterId === profile.id);
      
      if (user) {
        // Update tokens
        user.twitterToken = token;
        user.twitterTokenSecret = tokenSecret;
        return done(null, user);
      }
      
      // Create new user
      user = {
        id: userIdCounter++,
        twitterId: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        provider: 'twitter',
        twitterToken: token,
        twitterTokenSecret: tokenSecret,
        createdAt: new Date()
      };
      
      users.push(user);
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// Discord Strategy
if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
  passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/discord/callback`,
    scope: ['identify', 'guilds']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = users.find(u => u.discordId === profile.id);
      
      if (user) {
        // Update tokens
        user.discordAccessToken = accessToken;
        user.discordRefreshToken = refreshToken;
        return done(null, user);
      }
      
      // Create new user
      user = {
        id: userIdCounter++,
        discordId: profile.id,
        username: profile.username,
        displayName: profile.global_name || profile.username,
        provider: 'discord',
        discordAccessToken: accessToken,
        discordRefreshToken: refreshToken,
        avatar: profile.avatar,
        createdAt: new Date()
      };
      
      users.push(user);
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// Local Strategy (for testing)
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = users.find(u => u.username === username);
      
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid password' });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

module.exports = passport;