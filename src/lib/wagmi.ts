import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

// CoreDAO Chain Configuration
const coreDAO = {
  id: 1116,
  name: 'Core Blockchain',
  nativeCurrency: {
    decimals: 18,
    name: 'Core',
    symbol: 'CORE',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.coredao.org'],
    },
    public: {
      http: ['https://rpc.coredao.org'],
    },
  },
  blockExplorers: {
    default: { name: 'CoreScan', url: 'https://scan.coredao.org' },
  },
  testnet: false,
} as const;

export const config = getDefaultConfig({
  appName: 'CoreWeave Agents',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [coreDAO, mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});