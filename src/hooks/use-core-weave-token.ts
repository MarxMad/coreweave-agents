import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from 'wagmi';
import { Address } from 'viem';

// ABI del contrato CoreWeaveToken
const CORE_WEAVE_TOKEN_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_symbol", "type": "string" },
      { "internalType": "uint256", "name": "_initialSupply", "type": "uint256" },
      { "internalType": "address", "name": "_initialOwner", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "bool", "name": "communityManager", "type": "bool" },
      { "indexed": false, "internalType": "bool", "name": "marketingAI", "type": "bool" },
      { "indexed": false, "internalType": "bool", "name": "dataAnalyst", "type": "bool" },
      { "indexed": false, "internalType": "bool", "name": "tradingAssistant", "type": "bool" }
    ],
    "name": "AIAgentsConfigured",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "agent", "type": "address" }
    ],
    "name": "AgentAuthorized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "agent", "type": "address" }
    ],
    "name": "AgentRevoked",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "agent", "type": "address" }
    ],
    "name": "authorizeAgent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "authorizedAgents",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bool", "name": "_communityManager", "type": "bool" },
      { "internalType": "bool", "name": "_marketingAI", "type": "bool" },
      { "internalType": "bool", "name": "_dataAnalyst", "type": "bool" },
      { "internalType": "bool", "name": "_tradingAssistant", "type": "bool" }
    ],
    "name": "configureAIAgents",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAIAgentsConfig",
    "outputs": [
      {
        "components": [
          { "internalType": "bool", "name": "communityManager", "type": "bool" },
          { "internalType": "bool", "name": "marketingAI", "type": "bool" },
          { "internalType": "bool", "name": "dataAnalyst", "type": "bool" },
          { "internalType": "bool", "name": "tradingAssistant", "type": "bool" }
        ],
        "internalType": "struct CoreWeaveToken.AIAgentConfig",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTokenInfo",
    "outputs": [
      { "internalType": "string", "name": "tokenName", "type": "string" },
      { "internalType": "string", "name": "tokenSymbol", "type": "string" },
      { "internalType": "uint256", "name": "tokenTotalSupply", "type": "uint256" },
      { "internalType": "uint256", "name": "tokenDecimals", "type": "uint256" },
      { "internalType": "uint256", "name": "tokenLaunchTimestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "agent", "type": "address" }
    ],
    "name": "isAgentAuthorized",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "launchTimestamp",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "agent", "type": "address" }
    ],
    "name": "revokeAgent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "from", "type": "address" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Dirección del contrato desplegado
const CONTRACT_ADDRESS = '0xe3B1B985422E56Da480af78238C3bc4B82f1965B' as Address;

export interface AIAgentConfig {
  communityManager: boolean;
  marketingAI: boolean;
  dataAnalyst: boolean;
  tradingAssistant: boolean;
}

export interface TokenInfo {
  tokenName: string;
  tokenSymbol: string;
  tokenTotalSupply: bigint;
  tokenDecimals: bigint;
  tokenLaunchTimestamp: bigint;
}

export const useCoreWeaveToken = (tokenAddress?: Address) => {
  const contractAddress = tokenAddress || CONTRACT_ADDRESS;
  const { address: userAddress } = useAccount();
  const chainId = useChainId();
  
  // Hook para escribir en el contrato
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  // Hook para esperar confirmación de transacción
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Funciones de lectura directas
  const tokenInfoResult = useReadContract({
    address: contractAddress,
    abi: CORE_WEAVE_TOKEN_ABI,
    functionName: 'getTokenInfo',
    account: userAddress,
    query: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000, // 30 seconds
      refetchInterval: false,
      refetchOnWindowFocus: false,
    },
  });

  const aiAgentsConfigResult = useReadContract({
    address: contractAddress,
    abi: CORE_WEAVE_TOKEN_ABI,
    functionName: 'getAIAgentsConfig',
    account: userAddress,
    query: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000, // 30 seconds
      refetchInterval: false,
      refetchOnWindowFocus: false,
    },
  });

  const balanceOfResult = useReadContract({
    address: contractAddress,
    abi: CORE_WEAVE_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [userAddress || '0x0'],
    account: userAddress,
    query: {
      enabled: !!userAddress,
      retry: 2,
      retryDelay: 1000,
      staleTime: 15000, // 15 seconds
      refetchInterval: false,
      refetchOnWindowFocus: false,
    },
  });

  const totalSupplyResult = useReadContract({
    address: contractAddress,
    abi: CORE_WEAVE_TOKEN_ABI,
    functionName: 'totalSupply',
    account: userAddress,
    query: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000, // 30 seconds
      refetchInterval: false,
      refetchOnWindowFocus: false,
    },
  });

  const ownerResult = useReadContract({
    address: contractAddress,
    abi: CORE_WEAVE_TOKEN_ABI,
    functionName: 'owner',
    account: userAddress,
    query: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000, // 30 seconds
      refetchInterval: false,
      refetchOnWindowFocus: false,
    },
  });

  // Funciones de lectura como hooks
  const useTokenInfo = () => tokenInfoResult;
  const useAIAgentsConfig = () => aiAgentsConfigResult;
  const useBalanceOf = (account: Address) => {
    return useReadContract({
      address: contractAddress,
      abi: CORE_WEAVE_TOKEN_ABI,
      functionName: 'balanceOf',
      args: [account],
      account: userAddress,
      query: {
        enabled: !!account,
        retry: 2,
        retryDelay: 1000,
        staleTime: 15000, // 15 seconds
        refetchInterval: false,
        refetchOnWindowFocus: false,
      },
    });
  };
  const useTotalSupply = () => totalSupplyResult;
  const useOwner = () => ownerResult;
  const useIsAgentAuthorized = (agentAddress: Address) => {
    return useReadContract({
      address: contractAddress,
      abi: CORE_WEAVE_TOKEN_ABI,
      functionName: 'isAgentAuthorized',
      args: [agentAddress],
      account: userAddress,
    });
  };

  // Funciones de escritura
  const configureAIAgents = (
    communityManager: boolean,
    marketingAI: boolean,
    dataAnalyst: boolean,
    tradingAssistant: boolean
  ) => {
    writeContract({
      address: contractAddress,
      abi: CORE_WEAVE_TOKEN_ABI,
      functionName: 'configureAIAgents',
      args: [communityManager, marketingAI, dataAnalyst, tradingAssistant],
      chainId,
      account: userAddress,
    });
  };

  const authorizeAgent = (agentAddress: Address) => {
    writeContract({
      address: contractAddress,
      abi: CORE_WEAVE_TOKEN_ABI,
      functionName: 'authorizeAgent',
      args: [agentAddress],
      chainId,
      account: userAddress,
    });
  };

  const revokeAgent = (agentAddress: Address) => {
    writeContract({
      address: contractAddress,
      abi: CORE_WEAVE_TOKEN_ABI,
      functionName: 'revokeAgent',
      args: [agentAddress],
      chainId,
      account: userAddress,
    });
  };

  const transfer = (to: Address, amount: bigint) => {
    writeContract({
      address: contractAddress,
      abi: CORE_WEAVE_TOKEN_ABI,
      functionName: 'transfer',
      args: [to, amount],
      chainId,
      account: userAddress,
    });
  };

  const approve = (spender: Address, amount: bigint) => {
    writeContract({
      address: contractAddress,
      abi: CORE_WEAVE_TOKEN_ABI,
      functionName: 'approve',
      args: [spender, amount],
      chainId,
      account: userAddress,
    });
  };

  return {
    // Contract info
    contractAddress,
    abi: CORE_WEAVE_TOKEN_ABI,
    
    // Read data
    tokenInfo: tokenInfoResult.data,
    totalSupply: totalSupplyResult.data,
    owner: ownerResult.data,
    aiAgentsConfig: aiAgentsConfigResult.data,
    userBalance: balanceOfResult.data,
    isOwner: userAddress && ownerResult.data ? userAddress.toLowerCase() === ownerResult.data.toLowerCase() : false,
    
    // Loading states
    isLoading: tokenInfoResult.isLoading || totalSupplyResult.isLoading || ownerResult.isLoading || aiAgentsConfigResult.isLoading,
    
    // Read hooks
    useTokenInfo,
    useAIAgentsConfig,
    useIsAgentAuthorized,
    useBalanceOf,
    useTotalSupply,
    useOwner,
    
    // Write functions
    configureAIAgents,
    authorizeAgent,
    revokeAgent,
    transfer,
    approve,
    
    // Transaction state
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
};

export default useCoreWeaveToken;