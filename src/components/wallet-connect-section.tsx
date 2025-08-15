import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletConnect } from "@/components/wallet-connect"
import { Wallet, Shield, Zap } from "lucide-react"

export const WalletConnectSection = () => {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Wallet className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Connect Your Wallet</CardTitle>
        <p className="text-sm text-muted-foreground">
          Connect your wallet to access all features and interact with your tokens and AI agents.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <WalletConnect />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <Shield className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-xs font-medium">Secure</p>
            <p className="text-xs text-muted-foreground">Your keys, your crypto</p>
          </div>
          <div className="text-center">
            <Zap className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-xs font-medium">Fast</p>
            <p className="text-xs text-muted-foreground">Instant transactions</p>
          </div>
          <div className="text-center">
            <Wallet className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-xs font-medium">Easy</p>
            <p className="text-xs text-muted-foreground">One-click connect</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}