import { Address } from 'viem';

// Direcciones de contratos desplegados
export const CONTRACT_ADDRESSES = {
  CORE_WEAVE_TOKEN: '0xe3b1b985422e56da480af78238c3bc4b82f1965b' as Address,
  CORE_WEAVE_TOKEN_FACTORY: '0x8ad6bea6027a4006edd49e86ec6e5a8def0a63d2' as Address,
  // Agregar aquí las direcciones de otros contratos cuando se desplieguen
  AI_AGENT_MANAGER: '0x7cbfe8528a7e1d5448add5eb66b175e796dedac4' as Address,
} as const;

// Configuración de la red CoreDAO
export const CORE_DAO_CHAIN_ID = 1116;

// Configuración de fees por defecto
export const DEFAULT_CREATION_FEE = '0.01'; // CORE

// Tipos de agentes AI disponibles
export const AI_AGENT_TYPES = {
  COMMUNITY_MANAGER: 'community',
  MARKETING_AI: 'marketing', 
  DATA_ANALYST: 'data',
  TRADING_ASSISTANT: 'trading',
} as const;

// Templates de agentes predefinidos
export const AGENT_TEMPLATES = {
  DEFI_TRADING_BOT: {
    name: 'DeFi Trading Bot',
    type: AI_AGENT_TYPES.TRADING_ASSISTANT,
    description: 'Automated trading strategies for DeFi protocols',
    defaultBudget: '100',
  },
  MARKET_ANALYST: {
    name: 'Market Analyst',
    type: AI_AGENT_TYPES.DATA_ANALYST,
    description: 'Real-time market analysis and insights',
    defaultBudget: '50',
  },
  SECURITY_MONITOR: {
    name: 'Security Monitor',
    type: AI_AGENT_TYPES.DATA_ANALYST,
    description: 'Monitor contract security and anomalies',
    defaultBudget: '75',
  },
  COMMUNITY_MANAGER: {
    name: 'Community Manager',
    type: AI_AGENT_TYPES.COMMUNITY_MANAGER,
    description: 'Engage with community and manage social presence',
    defaultBudget: '25',
  },
} as const;

// Configuración de proveedores AI
export const AI_PROVIDERS = {
  OPENAI: {
    name: 'OpenAI',
    models: ['gpt-4', 'gpt-3.5-turbo'],
    apiKeyRequired: true,
  },
  GOOGLE_GEMINI: {
    name: 'Google Gemini',
    models: ['gemini-pro', 'gemini-pro-vision'],
    apiKeyRequired: true,
  },
  ANTHROPIC_CLAUDE: {
    name: 'Anthropic Claude',
    models: ['claude-3-opus', 'claude-3-sonnet'],
    apiKeyRequired: true,
  },
  CUSTOM_API: {
    name: 'Custom API',
    models: ['custom'],
    apiKeyRequired: true,
  },
} as const;

// Utilidades para formateo
export const formatTokenAmount = (amount: bigint, decimals: number = 18): string => {
  const divisor = BigInt(10 ** decimals);
  const quotient = amount / divisor;
  const remainder = amount % divisor;
  
  if (remainder === 0n) {
    return quotient.toString();
  }
  
  const remainderStr = remainder.toString().padStart(decimals, '0');
  const trimmedRemainder = remainderStr.replace(/0+$/, '');
  
  return `${quotient}.${trimmedRemainder}`;
};

export const parseTokenAmount = (amount: string, decimals: number = 18): bigint => {
  const [whole, fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + paddedFraction);
};

// Validaciones
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const isValidTokenName = (name: string): boolean => {
  return name.length > 0 && name.length <= 50;
};

export const isValidTokenSymbol = (symbol: string): boolean => {
  return /^[A-Z]{2,10}$/.test(symbol);
};

export const isValidSupply = (supply: string): boolean => {
  const num = parseFloat(supply);
  return !isNaN(num) && num > 0 && num <= 1000000000; // Max 1B tokens
};