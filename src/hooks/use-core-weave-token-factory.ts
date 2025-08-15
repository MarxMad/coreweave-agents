import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId, useChains } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useToast } from '@/hooks/use-toast'
import { useCallback } from 'react'
import { CONTRACT_ADDRESSES } from '@/lib/contracts'
import { useErrorHandler } from '@/lib/error-handler'

// CoreWeaveTokenFactory ABI
const FACTORY_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalSupply",
        "type": "uint256"
      }
    ],
    "name": "TokenCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "allTokens",
    "outputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "totalSupply",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "hasAIAgents",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "creationFee",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "creationFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "totalSupply",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "enableAIAgents",
        "type": "bool"
      }
    ],
    "name": "createToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeRecipient",
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
    "inputs": [],
    "name": "getAllTokens",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "totalSupply",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "hasAIAgents",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "creationFee",
            "type": "uint256"
          }
        ],
        "internalType": "struct CoreWeaveTokenFactory.TokenInfo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserTokens",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "totalSupply",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "hasAIAgents",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "creationFee",
            "type": "uint256"
          }
        ],
        "internalType": "struct CoreWeaveTokenFactory.TokenInfo[]",
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
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      }
    ],
    "name": "setCreationFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      }
    ],
    "name": "setFeeRecipient",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "name": "tokenDetails",
    "outputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "totalSupply",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "hasAIAgents",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "creationFee",
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
    "name": "userTokens",
    "outputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "totalSupply",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "hasAIAgents",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "creationFee",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Types
interface AIAgentConfig {
  communityManager: boolean
  marketingAI: boolean
  dataAnalyst: boolean
  tradingAssistant: boolean
}

interface CreateTokenParams {
  name: string
  symbol: string
  totalSupply: string
  enableAIAgents: boolean
}

interface TokenInfo {
  tokenAddress: string
  name: string
  symbol: string
  totalSupply: bigint
  creator: string
  createdAt: bigint
  hasAIAgents: boolean
  creationFee: bigint
}

export function useCoreWeaveTokenFactory() {
  const { toast } = useToast()
  const { address: userAddress } = useAccount()
  const chainId = useChainId()
  const chains = useChains()
  const chain = chains.find(c => c.id === chainId)
  const { logNetworkError } = useErrorHandler()
  
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
      retry: 3,
      retryDelay: 2000,
    },
  })
  
  // Contract configuration
  const contractConfig = {
    address: CONTRACT_ADDRESSES.CORE_WEAVE_TOKEN_FACTORY,
    abi: FACTORY_ABI,
    chainId,
  } as const

  // Read functions with error handling and reduced retry
  const creationFeeResult = useReadContract({
    ...contractConfig,
    functionName: 'creationFee',
    query: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000, // 30 seconds
      refetchInterval: false,
      refetchOnWindowFocus: false,
    },
  })

  const allTokensResult = useReadContract({
    ...contractConfig,
    functionName: 'getAllTokens',
    query: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 15000, // 15 seconds
      refetchInterval: false,
      refetchOnWindowFocus: false,
    },
  })

  const userTokensResult = useReadContract({
    ...contractConfig,
    functionName: 'getUserTokens',
    args: [userAddress || '0x0'],
    query: {
      enabled: !!userAddress,
      retry: 2,
      retryDelay: 1000,
      staleTime: 15000, // 15 seconds
      refetchInterval: false,
      refetchOnWindowFocus: false,
    },
  })

  const ownerResult = useReadContract({
    ...contractConfig,
    functionName: 'owner',
    query: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 60000, // 1 minute
      refetchInterval: false,
      refetchOnWindowFocus: false,
    },
  })

  const feeRecipientResult = useReadContract({
    ...contractConfig,
    functionName: 'feeRecipient',
    query: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 60000, // 1 minute
      refetchInterval: false,
      refetchOnWindowFocus: false,
    },
  })

  // Create token function
  const createToken = useCallback(async (params: CreateTokenParams) => {
    // Reset previous transaction state
    reset()
    
    if (!userAddress) {
      toast({
        title: "Error",
        description: "Por favor conecta tu wallet",
        variant: "destructive",
      })
      return
    }

    if (!creationFeeResult.data) {
      toast({
        title: "Error",
        description: "No se pudo obtener la tarifa de creación. Verifica que estés conectado a Core DAO.",
        variant: "destructive",
      })
      return
    }

    try {
      console.log('Iniciando creación de token:', {
        name: params.name,
        symbol: params.symbol,
        totalSupply: params.totalSupply,
        enableAIAgents: params.enableAIAgents,
        creationFee: creationFeeResult.data?.toString(),
        contractAddress: contractConfig.address
      })

      // El totalSupply debe ser un número entero, no en wei
      // El contrato ya maneja la conversión a decimales internamente
      const totalSupplyNumber = BigInt(params.totalSupply)
      
      console.log('Parámetros de contrato:', {
        name: params.name,
        symbol: params.symbol,
        totalSupply: totalSupplyNumber.toString(),
        enableAIAgents: params.enableAIAgents,
        value: creationFeeResult.data?.toString()
      })

      await writeContract({
        ...contractConfig,
        functionName: 'createToken',
        args: [
          params.name,
          params.symbol,
          totalSupplyNumber,
          params.enableAIAgents
        ],
        value: creationFeeResult.data, // Pay the creation fee
        chainId,
        account: userAddress,
        chain
      })

      toast({
        title: "Transacción enviada",
        description: `Creando token ${params.name} (${params.symbol}). Por favor confirma en tu wallet.`,
      })
    } catch (error) {
      logNetworkError(error as Error, 'createToken')
      
      let errorMessage = "Error al crear el token"
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          errorMessage = "Transacción cancelada por el usuario"
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = "Fondos insuficientes para pagar la tarifa de creación"
        } else if (error.message.includes('network')) {
          errorMessage = "Error de red. Verifica tu conexión a Core DAO."
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      
      // Reset state after error
      setTimeout(() => reset(), 1000)
    }
  }, [userAddress, creationFeeResult.data, writeContract, contractConfig, toast, reset])

  // Set creation fee (owner only)
  const setCreationFee = useCallback(async (feeInEther: string) => {
    if (!userAddress) {
      toast({
        title: "Error",
        description: "Por favor conecta tu wallet",
        variant: "destructive",
      })
      return
    }

    try {
      const feeWei = parseEther(feeInEther)
      
      await writeContract({
        ...contractConfig,
        functionName: 'setCreationFee',
        args: [feeWei],
        chainId,
        account: userAddress,
        chain
      })

      toast({
        title: "Actualizando tarifa",
        description: `Estableciendo nueva tarifa: ${feeInEther} CORE`,
      })
    } catch (error) {
      logNetworkError(error as Error, 'setCreationFee')
      toast({
        title: "Error",
        description: "Error al establecer la tarifa",
        variant: "destructive",
      })
    }
  }, [userAddress, writeContract, contractConfig, toast])

  // Set fee recipient (owner only)
  const setFeeRecipient = useCallback(async (recipient: string) => {
    if (!userAddress) {
      toast({
        title: "Error",
        description: "Por favor conecta tu wallet",
        variant: "destructive",
      })
      return
    }

    try {
      await writeContract({
        ...contractConfig,
        functionName: 'setFeeRecipient',
        args: [recipient as `0x${string}`],
        chainId,
        account: userAddress,
        chain
      })

      toast({
        title: "Actualizando destinatario",
        description: `Nuevo destinatario de tarifas: ${recipient}`,
      })
    } catch (error) {
      logNetworkError(error as Error, 'setFeeRecipient')
      toast({
        title: "Error",
        description: "Error al establecer el destinatario",
        variant: "destructive",
      })
    }
  }, [userAddress, writeContract, contractConfig, toast])

  // Helper functions
  const getAllTokens = useCallback(async (): Promise<TokenInfo[]> => {
    try {
      const result = await allTokensResult.refetch()
      return (result.data || []) as TokenInfo[]
    } catch (error) {
      logNetworkError(error as Error, 'getAllTokens')
      return []
    }
  }, [allTokensResult])

  const getUserTokens = useCallback(async (address: string): Promise<TokenInfo[]> => {
    try {
      const result = await userTokensResult.refetch()
      return (result.data || []) as TokenInfo[]
    } catch (error) {
      logNetworkError(error as Error, 'getUserTokens')
      return []
    }
  }, [userTokensResult])

  return {
    // Contract info
    contractAddress: CONTRACT_ADDRESSES.CORE_WEAVE_TOKEN_FACTORY,
    abi: FACTORY_ABI,
    
    // Read data
    creationFee: creationFeeResult.data,
    owner: ownerResult.data,
    feeRecipient: feeRecipientResult.data,
    
    // Write functions
    createToken,
    setCreationFee,
    setFeeRecipient,
    
    // Helper functions
    getAllTokens: {
      data: allTokensResult.data,
      isLoading: allTokensResult.isLoading,
      error: allTokensResult.error,
      refetch: allTokensResult.refetch
    },
    getUserTokens: {
      data: userTokensResult.data,
      isLoading: userTokensResult.isLoading,
      error: userTokensResult.error,
      refetch: userTokensResult.refetch
    },
    
    // Transaction state
    isLoading: isPending || isConfirming,
    isSuccess: isConfirmed,
    error: error || receiptError,
    hash,
    reset,
  }
}

// Export types
export type { CreateTokenParams, TokenInfo, AIAgentConfig }