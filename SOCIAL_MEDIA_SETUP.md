# Social Media Integration Setup

This guide explains how to set up social media integration for the CoreWeave Agents token launch platform.

## Overview

The platform supports integration with:
- **Twitter/X**: OAuth authentication for automated posting and engagement
- **Discord**: OAuth authentication for community management
- **Telegram**: Bot integration for automated messaging

## Prerequisites

1. Node.js and npm installed
2. Backend server running on port 3001
3. Frontend running on port 5173

## Setup Instructions

### 1. Twitter/X Integration

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app or use an existing one
3. Navigate to "Keys and tokens"
4. Copy your:
   - API Key (Consumer Key)
   - API Key Secret (Consumer Secret)
5. In your app settings, add callback URL: `http://localhost:3001/auth/twitter/callback`
6. Add these to your `backend/.env` file:
   ```
   TWITTER_CONSUMER_KEY=your_api_key_here
   TWITTER_CONSUMER_SECRET=your_api_key_secret_here
   ```

### 2. Discord Integration

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "OAuth2" section
4. Copy your:
   - Client ID
   - Client Secret
5. Add redirect URI: `http://localhost:3001/auth/discord/callback`
6. Add these to your `backend/.env` file:
   ```
   DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_CLIENT_SECRET=your_client_secret_here
   ```

### 3. Telegram Bot Integration

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Use `/newbot` command to create a new bot
3. Follow the instructions to set up your bot
4. Copy the bot token provided by BotFather
5. Get your chat ID by:
   - Adding your bot to a group/channel, or
   - Messaging your bot and getting your user ID
6. Use these credentials in the frontend form (no .env needed for Telegram)

### 4. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Fill in your social media credentials in `backend/.env`:
   ```
   # OAuth Configuration
   TWITTER_CONSUMER_KEY=your_twitter_consumer_key_here
   TWITTER_CONSUMER_SECRET=your_twitter_consumer_secret_here
   
   DISCORD_CLIENT_ID=your_discord_client_id_here
   DISCORD_CLIENT_SECRET=your_discord_client_secret_here
   
   # Server Configuration
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   BACKEND_URL=http://localhost:3001
   
   # Security (change these in production!)
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   SESSION_SECRET=your_session_secret_key_here_change_in_production
   ```

### 5. Start the Servers

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend server (in another terminal):
   ```bash
   npm run dev
   ```

## How to Use

### In the Token Launch Wizard

1. Navigate to the "Launch Token" page
2. Complete Step 1 (Token Configuration)
3. In Step 2 (Social Media Integration):
   - Click "Connect Twitter" to authenticate with Twitter
   - Click "Connect Discord" to authenticate with Discord
   - For Telegram, enter your bot token and chat ID manually
4. Continue with the remaining steps

### Authentication Flow

- **Twitter/Discord**: Clicking the connect button redirects to the OAuth provider, then back to your app
- **Telegram**: Manual entry of bot credentials with verification

## API Endpoints

The backend provides these endpoints:

- `GET /auth/twitter` - Initiate Twitter OAuth
- `GET /auth/twitter/callback` - Twitter OAuth callback
- `GET /auth/discord` - Initiate Discord OAuth
- `GET /auth/discord/callback` - Discord OAuth callback
- `POST /auth/telegram/connect` - Connect Telegram bot
- `GET /auth/connected-accounts` - Get user's connected accounts
- `POST /auth/disconnect/:provider` - Disconnect a provider

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique secrets for JWT and session keys in production
- Consider using environment-specific callback URLs
- Implement proper error handling and rate limiting

## Troubleshooting

### Common Issues

1. **"Invalid callback URL"**: Ensure your OAuth app settings match your backend URL
2. **"CORS errors"**: Check that FRONTEND_URL in backend/.env matches your frontend URL
3. **"Invalid bot token"**: Verify your Telegram bot token with BotFather
4. **"Authentication failed"**: Check your OAuth credentials and callback URLs

### Debug Mode

Set `NODE_ENV=development` in your backend/.env for detailed error logs.

## Next Steps

After setting up social media integration, you can:

1. Implement AI agent creation (Step 2 of the original plan)
2. Add blockchain integration for token creation
3. Set up Uniswap liquidity pool creation
4. Implement automated social media posting through connected accounts

## Production Deployment

For production deployment:

1. Use HTTPS URLs for all callback URLs
2. Set `NODE_ENV=production`
3. Use secure, randomly generated secrets
4. Implement proper database storage instead of in-memory storage
5. Add comprehensive logging and monitoring
6. Implement proper user authentication and session management