import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId, useChains } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useToast } from '@/hooks/use-toast'
import { CONTRACT_ADDRESSES } from '@/lib/contracts'
import { useCallback } from 'react'

// AIAgentManager ABI
const AI_AGENT_MANAGER_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "agentId",
				"type": "bytes32"
			}
		],
		"name": "AgentActivated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "agentId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenContract",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "agentType",
				"type": "string"
			}
		],
		"name": "AgentCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "agentId",
				"type": "bytes32"
			}
		],
		"name": "AgentDeactivated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenContract",
				"type": "address"
			}
		],
		"name": "authorizeToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenContract",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "agentType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "budget",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "configuration",
				"type": "string"
			}
		],
		"name": "createAgent",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "agentId",
				"type": "bytes32"
			}
		],
		"name": "toggleAgent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "agents",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "agentId",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "agentType",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "tokenContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "budget",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "configuration",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastActivity",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "authorizedTokens",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenContract",
				"type": "address"
			}
		],
		"name": "getTokenAgents",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "agentId",
						"type": "bytes32"
					},
					{
						"internalType": "string",
						"name": "agentType",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "tokenContract",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "budget",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "configuration",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastActivity",
						"type": "uint256"
					}
				],
				"internalType": "struct AIAgentManager.Agent[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tokenAgents",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "agentId",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "agentType",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "tokenContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "budget",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "configuration",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastActivity",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] as const

// Types
interface Agent {
  agentId: string
  agentType: string
  tokenContract: string
  owner: string
  isActive: boolean
  budget: bigint
  configuration: string
  createdAt: bigint
  lastActivity: bigint
}

interface CreateAgentParams {
  tokenContract: string
  agentType: string
  budget: string
  configuration: string
}

export function useAIAgentManager() {
  const { toast } = useToast()
  const { address: userAddress } = useAccount()
  const chainId = useChainId()
  const chains = useChains()
  const chain = chains.find(c => c.id === chainId)
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })
  
  // Contract configuration
  const contractConfig = {
    address: CONTRACT_ADDRESSES.AI_AGENT_MANAGER,
    abi: AI_AGENT_MANAGER_ABI,
    chainId,
  } as const

  // Read functions
  const ownerResult = useReadContract({
    ...contractConfig,
    functionName: 'owner',
    query: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000, // 30 seconds
      refetchInterval: false,
      refetchOnWindowFocus: false,
    },
  })

  // Write functions
  const createAgent = useCallback(async (params: CreateAgentParams) => {
    if (!userAddress) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    try {
      const budgetWei = parseEther(params.budget)
      
      await writeContract({
        ...contractConfig,
        functionName: 'createAgent',
        args: [
          params.tokenContract as `0x${string}`,
          params.agentType,
          budgetWei,
          params.configuration
        ],
        account: userAddress,
        chainId,
        chain,
      })

      toast({
        title: "Agent Creation Initiated",
        description: "Your AI agent is being created...",
      })
    } catch (error) {
      console.error('Error creating agent:', error)
      toast({
        title: "Error",
        description: "Failed to create agent. Please try again.",
        variant: "destructive",
      })
    }
  }, [userAddress, writeContract, contractConfig, toast])

  const authorizeToken = useCallback(async (tokenContract: string) => {
    if (!userAddress) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    try {
      await writeContract({
        ...contractConfig,
        functionName: 'authorizeToken',
        args: [tokenContract as `0x${string}`],
        account: userAddress,
        chainId,
        chain,
      })

      toast({
        title: "Token Authorization Initiated",
        description: "Token is being authorized...",
      })
    } catch (error) {
      console.error('Error authorizing token:', error)
      toast({
        title: "Error",
        description: "Failed to authorize token. Please try again.",
        variant: "destructive",
      })
    }
  }, [userAddress, writeContract, contractConfig, toast])

  const toggleAgent = useCallback(async (agentId: string) => {
    if (!userAddress) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    try {
      await writeContract({
        ...contractConfig,
        functionName: 'toggleAgent',
        args: [agentId as `0x${string}`],
        account: userAddress,
        chainId,
        chain,
      })

      toast({
        title: "Agent Toggle Initiated",
        description: "Agent status is being updated...",
      })
    } catch (error) {
      console.error('Error toggling agent:', error)
      toast({
        title: "Error",
        description: "Failed to toggle agent. Please try again.",
        variant: "destructive",
      })
    }
  }, [userAddress, writeContract, contractConfig, toast])

  // Read contract hooks for specific queries
  const getTokenAgentsQuery = (tokenContract: string) => useReadContract({
    ...contractConfig,
    functionName: 'getTokenAgents',
    args: [tokenContract as `0x${string}`],
    query: {
      enabled: !!tokenContract,
      retry: 2,
      retryDelay: 1000,
      staleTime: 15000, // 15 seconds
      refetchInterval: false,
      refetchOnWindowFocus: false,
    },
  })

  const isTokenAuthorizedQuery = (tokenContract: string) => useReadContract({
    ...contractConfig,
    functionName: 'authorizedTokens',
    args: [tokenContract as `0x${string}`],
    query: {
      enabled: !!tokenContract,
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000, // 30 seconds
      refetchInterval: false,
      refetchOnWindowFocus: false,
    },
  })

  const getAgentQuery = (agentId: string) => useReadContract({
    ...contractConfig,
    functionName: 'agents',
    args: [agentId as `0x${string}`],
    query: {
      enabled: !!agentId,
      retry: 2,
      retryDelay: 1000,
      staleTime: 15000, // 15 seconds
      refetchInterval: false,
      refetchOnWindowFocus: false,
    },
  })

  // Helper functions
  const getTokenAgents = useCallback((tokenContract: string) => {
    return getTokenAgentsQuery(tokenContract)
  }, [])

  const isTokenAuthorized = useCallback((tokenContract: string) => {
    return isTokenAuthorizedQuery(tokenContract)
  }, [])

  const getAgent = useCallback((agentId: string) => {
    return getAgentQuery(agentId)
  }, [])

  return {
    // Contract info
    contractAddress: CONTRACT_ADDRESSES.AI_AGENT_MANAGER,
    abi: AI_AGENT_MANAGER_ABI,
    
    // Read data
    owner: ownerResult.data,
    
    // Write functions
    createAgent,
    authorizeToken,
    toggleAgent,
    
    // Helper functions
    getTokenAgents,
    isTokenAuthorized,
    getAgent,
    
    // Transaction state
    isLoading: isPending || isConfirming,
    isSuccess: isConfirmed,
    error,
    hash,
  }
}

// Export types
export type { CreateAgentParams, Agent }