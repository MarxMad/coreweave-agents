import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Rocket, Users, TrendingUp, Bot, Settings, ExternalLink, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCoreWeaveTokenFactory } from "@/hooks/use-core-weave-token-factory"
import { useWallet } from "@/hooks/use-wallet"
import { formatTokenAmount } from "@/lib/utils"
import { WalletConnect } from "@/components/wallet-connect"

interface TokenInfo {
  tokenAddress: string
  name: string
  symbol: string
  totalSupply: bigint
  creator: string
  createdAt: bigint
  aiAgentsConfig?: {
    communityManager: boolean
    marketingAI: boolean
    dataAnalyst: boolean
    tradingAssistant: boolean
  }
}

export default function TokenFactory() {
  const { address, isConnected } = useWallet()
  const { getAllTokens, getUserTokens, creationFee, isLoading } = useCoreWeaveTokenFactory()
  const [allTokens, setAllTokens] = useState<TokenInfo[]>([])
  const [userTokens, setUserTokens] = useState<TokenInfo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [viewMode, setViewMode] = useState<"all" | "my">("all")

  useEffect(() => {
    // getAllTokens y getUserTokens son objetos con data, no funciones
    if (getAllTokens.data) {
      setAllTokens(getAllTokens.data || [])
    }
    
    if (address && getUserTokens.data) {
      setUserTokens(getUserTokens.data || [])
    }
  }, [getAllTokens.data, getUserTokens.data, address])

  const tokensToShow = viewMode === "my" ? userTokens : allTokens
  
  const filteredTokens = tokensToShow.filter(token => {
    const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterBy === "all") return matchesSearch
    if (filterBy === "ai-enabled") {
      const hasAI = token.aiAgentsConfig ? Object.values(token.aiAgentsConfig).some(enabled => enabled) : false
      return matchesSearch && hasAI
    }
    return matchesSearch
  })

  const getActiveAgents = (config: TokenInfo['aiAgentsConfig']) => {
    if (!config) return []
    const agents = []
    if (config.communityManager) agents.push("Community")
    if (config.marketingAI) agents.push("Marketing")
    if (config.dataAnalyst) agents.push("Analytics")
    if (config.tradingAssistant) agents.push("Trading")
    return agents
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-8 p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                Token Factory
              </h1>
              <p className="text-muted-foreground mt-1">
                Crea y gestiona tokens con IA en CoreDAO
              </p>
            </div>
            {isConnected ? (
              <Link to="/launch">
                <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-lg">
                  <Plus className="h-4 w-4" />
                  Create New Token
                </Button>
              </Link>
            ) : (
              <Button disabled className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Token
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Wallet Connection Alert */}
      {!isConnected && (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <Wallet className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <div className="flex items-center justify-between">
              <span>Conecta tu billetera para crear y gestionar tokens</span>
              <WalletConnect />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-blue-50 dark:from-primary/20 dark:to-blue-950/20 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tokens</p>
                <p className="text-3xl font-bold text-primary">{allTokens.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mis Tokens</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{userTokens.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Con IA</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {allTokens.filter(token => 
                    token.aiAgentsConfig ? Object.values(token.aiAgentsConfig).some(enabled => enabled) : false
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tarifa Creación</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {creationFee ? `${Number(creationFee) / 1e18}` : '0'} CORE
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            onClick={() => setViewMode("all")}
            size="sm"
          >
            All Tokens
          </Button>
          <Button
            variant={viewMode === "my" ? "default" : "outline"}
            onClick={() => setViewMode("my")}
            size="sm"
          >
            My Tokens
          </Button>
        </div>
        
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Search tokens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ai-enabled">AI-Enabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tokens Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading tokens...</p>
        </div>
      ) : filteredTokens.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {viewMode === "my" ? "You haven't created any tokens yet." : "No tokens found."}
          </p>
          <Link to="/launch">
            <Button className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Token
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTokens.map((token) => {
            const activeAgents = getActiveAgents(token.aiAgentsConfig)
            
            return (
              <Card key={token.tokenAddress} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{token.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">${token.symbol}</p>
                    </div>
                    <div className="flex gap-1">
                      {activeAgents.length > 0 && (
                        <Badge variant="secondary" className="gap-1">
                          <Bot className="h-3 w-3" />
                          AI
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Supply</p>
                      <p className="font-medium">
                        {formatTokenAmount(token.totalSupply, 18)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Creator</p>
                      <p className="font-medium font-mono text-xs">
                        {token.creator.slice(0, 6)}...{token.creator.slice(-4)}
                      </p>
                    </div>
                  </div>
                  
                  {activeAgents.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Active AI Agents</p>
                      <div className="flex flex-wrap gap-1">
                        {activeAgents.map((agent) => (
                          <Badge key={agent} variant="outline" className="text-xs">
                            {agent}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 gap-1">
                      <ExternalLink className="h-3 w-3" />
                      View
                    </Button>
                    {address === token.creator && (
                      <Button size="sm" variant="outline" className="gap-1">
                        <Settings className="h-3 w-3" />
                        Manage
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}