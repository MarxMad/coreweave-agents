import { useWallet } from '@/hooks/use-wallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, AlertTriangle, CheckCircle } from 'lucide-react';
import { WalletConnect } from './wallet-connect';

export const WalletInfo = () => {
  const { isConnected, address, isCoreDaoChain, balance, isBalanceLoading } = useWallet();

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No Wallet Connected</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your wallet to start using AI agents
            </p>
            <WalletConnect />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Status
          <div className="ml-auto">
            {isCoreDaoChain ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                CoreDAO
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Wrong Network
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Address:</span>
            <span className="text-sm font-mono">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
          
          {balance && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Balance:</span>
              <span className="text-sm font-medium">
                {isBalanceLoading ? (
                  'Loading...'
                ) : (
                  `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
                )}
              </span>
            </div>
          )}
        </div>

        {!isCoreDaoChain && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Switch to CoreDAO network for full functionality
            </p>
          </div>
        )}

        <div className="pt-2">
          <WalletConnect />
        </div>
      </CardContent>
    </Card>
  );
};