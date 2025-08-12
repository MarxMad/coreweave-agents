// Simple in-memory user model (in production, use a proper database like MongoDB or PostgreSQL)

class User {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.username = data.username;
    this.email = data.email;
    this.displayName = data.displayName;
    this.avatar = data.avatar;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    
    // Social media connections
    this.socialAccounts = {
      twitter: {
        connected: false,
        id: null,
        username: null,
        accessToken: null,
        accessTokenSecret: null,
        connectedAt: null
      },
      discord: {
        connected: false,
        id: null,
        username: null,
        accessToken: null,
        refreshToken: null,
        guilds: [],
        connectedAt: null
      },
      telegram: {
        connected: false,
        botToken: null,
        chatId: null,
        botUsername: null,
        connectedAt: null
      }
    };
    
    // Token launch history
    this.tokenLaunches = [];
    
    // AI agent configurations
    this.aiAgents = [];
  }
  
  // Connect social media account
  connectSocialAccount(provider, accountData) {
    if (this.socialAccounts[provider]) {
      this.socialAccounts[provider] = {
        ...this.socialAccounts[provider],
        ...accountData,
        connected: true,
        connectedAt: new Date()
      };
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }
  
  // Disconnect social media account
  disconnectSocialAccount(provider) {
    if (this.socialAccounts[provider]) {
      this.socialAccounts[provider] = {
        connected: false,
        id: null,
        username: null,
        accessToken: null,
        accessTokenSecret: null,
        refreshToken: null,
        guilds: [],
        botToken: null,
        chatId: null,
        botUsername: null,
        connectedAt: null
      };
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }
  
  // Get connected accounts summary
  getConnectedAccounts() {
    const connected = {};
    Object.keys(this.socialAccounts).forEach(provider => {
      connected[provider] = {
        connected: this.socialAccounts[provider].connected,
        username: this.socialAccounts[provider].username,
        connectedAt: this.socialAccounts[provider].connectedAt
      };
    });
    return connected;
  }
  
  // Add token launch
  addTokenLaunch(launchData) {
    const launch = {
      id: Date.now().toString(),
      ...launchData,
      createdAt: new Date(),
      status: 'pending'
    };
    this.tokenLaunches.push(launch);
    this.updatedAt = new Date();
    return launch;
  }
  
  // Add AI agent configuration
  addAIAgent(agentData) {
    const agent = {
      id: Date.now().toString(),
      ...agentData,
      createdAt: new Date(),
      status: 'active'
    };
    this.aiAgents.push(agent);
    this.updatedAt = new Date();
    return agent;
  }
  
  // Get public profile (safe to send to frontend)
  getPublicProfile() {
    return {
      id: this.id,
      username: this.username,
      displayName: this.displayName,
      avatar: this.avatar,
      createdAt: this.createdAt,
      connectedAccounts: this.getConnectedAccounts(),
      tokenLaunchCount: this.tokenLaunches.length,
      activeAgents: this.aiAgents.filter(agent => agent.status === 'active').length
    };
  }
}

// In-memory storage (replace with database in production)
class UserStore {
  constructor() {
    this.users = new Map();
    this.usersByProvider = new Map(); // Map provider IDs to user IDs
  }
  
  // Create new user
  create(userData) {
    const user = new User(userData);
    this.users.set(user.id, user);
    return user;
  }
  
  // Find user by ID
  findById(id) {
    return this.users.get(id);
  }
  
  // Find user by username
  findByUsername(username) {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }
  
  // Find user by social provider ID
  findByProviderId(provider, providerId) {
    const key = `${provider}:${providerId}`;
    const userId = this.usersByProvider.get(key);
    return userId ? this.users.get(userId) : null;
  }
  
  // Link provider ID to user
  linkProvider(userId, provider, providerId) {
    const key = `${provider}:${providerId}`;
    this.usersByProvider.set(key, userId);
  }
  
  // Update user
  update(id, updateData) {
    const user = this.users.get(id);
    if (user) {
      Object.assign(user, updateData);
      user.updatedAt = new Date();
      return user;
    }
    return null;
  }
  
  // Delete user
  delete(id) {
    return this.users.delete(id);
  }
  
  // Get all users (admin function)
  getAll() {
    return Array.from(this.users.values());
  }
}

// Export singleton instance
const userStore = new UserStore();

module.exports = {
  User,
  UserStore,
  userStore
};