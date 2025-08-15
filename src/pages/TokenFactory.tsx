import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Rocket, Users, TrendingUp, Bot, Settings, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCoreWeaveTokenFactory } from "@/hooks/use-core-weave-token-factory"
import { useWallet } from "@/hooks/use-wallet"
import { formatTokenAmount } from "@/lib/utils"

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
  const { address } = useWallet()
  const { getAllTokens, getUserTokens, creationFee, isLoading } = useCoreWeaveTokenFactory()
  const [allTokens, setAllTokens] = useState<TokenInfo[]>([])
  const [userTokens, setUserTokens] = useState<TokenInfo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [viewMode, setViewMode] = useState<"all" | "my">("all")

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const tokens = await getAllTokens()
        setAllTokens(tokens || [])
        
        if (address) {
          const myTokens = await getUserTokens(address)
          setUserTokens(myTokens || [])
        }
      } catch (error) {
        console.error('Error fetching tokens:', error)
      }
    }

    fetchTokens()
  }, [getAllTokens, getUserTokens, address])

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Token Factory</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage AI-powered tokens on CoreDAO
          </p>
        </div>
        <Link to="/launch">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Token
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tokens</p>
                <p className="text-2xl font-bold">{allTokens.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Tokens</p>
                <p className="text-2xl font-bold">{userTokens.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Bot className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI-Enabled</p>
                <p className="text-2xl font-bold">
                  {allTokens.filter(token => 
                    token.aiAgentsConfig ? Object.values(token.aiAgentsConfig).some(enabled => enabled) : false
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Creation Fee</p>
                <p className="text-2xl font-bold">
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