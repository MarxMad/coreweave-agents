import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Wallet, AlertTriangle } from 'lucide-react';

interface WalletConnectProps {
  collapsed?: boolean;
}

export const WalletConnect = ({ collapsed = false }: WalletConnectProps) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button 
                    onClick={openConnectModal} 
                    className={`flex items-center gap-2 ${collapsed ? 'w-10 h-10 p-0' : 'w-full'}`}
                    size={collapsed ? 'icon' : 'default'}
                  >
                    <Wallet className="h-4 w-4" />
                    {!collapsed && 'Connect Wallet'}
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button 
                    onClick={openChainModal} 
                    variant="destructive"
                    className={`flex items-center gap-2 ${collapsed ? 'w-10 h-10 p-0' : 'w-full'}`}
                    size={collapsed ? 'icon' : 'default'}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {!collapsed && 'Wrong network'}
                  </Button>
                );
              }

              if (collapsed) {
                return (
                  <div className="flex flex-col gap-1">
                    <Button
                      onClick={openChainModal}
                      variant="outline"
                      size="icon"
                      className="w-10 h-10 p-0"
                      title={chain.name}
                    >
                      {chain.hasIcon && chain.iconUrl ? (
                        <img
                          alt={chain.name ?? 'Chain icon'}
                          src={chain.iconUrl}
                          className="w-4 h-4 rounded-full"
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-primary" />
                      )}
                    </Button>
                    <Button 
                      onClick={openAccountModal} 
                      variant="outline" 
                      size="icon"
                      className="w-10 h-10 p-0"
                      title={`${account.displayName}${account.displayBalance ? ` (${account.displayBalance})` : ''}`}
                    >
                      <Wallet className="h-4 w-4" />
                    </Button>
                  </div>
                );
              }

              return (
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 w-full justify-start"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    <span className="truncate">{chain.name}</span>
                  </Button>

                  <Button 
                    onClick={openAccountModal} 
                    variant="outline" 
                    size="sm"
                    className="flex flex-col items-start w-full h-auto py-2 px-3"
                  >
                    <span className="text-xs font-medium truncate w-full text-left">
                      {account.displayName}
                    </span>
                    {account.displayBalance && (
                      <span className="text-xs text-muted-foreground truncate w-full text-left">
                        {account.displayBalance}
                      </span>
                    )}
                  </Button>
                </div>
              );
            })()} 
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};