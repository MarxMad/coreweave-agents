import { useAccount, useBalance, useDisconnect, useChainId } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export const useWallet = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const chainId = useChainId();
  
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
  });

  const isCoreDaoChain = chainId === 1116;

  const connectWallet = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  return {
    // Account info
    address,
    isConnected,
    isConnecting,
    
    // Balance
    balance,
    isBalanceLoading,
    
    // Chain info
    chainId,
    isCoreDaoChain,
    
    // Actions
    connectWallet,
    disconnectWallet,
  };
};