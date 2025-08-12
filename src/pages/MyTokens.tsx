import { useState } from "react"
import { ArrowLeft, Plus, Filter, Search, Eye, Settings, Play, Pause } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenCard, TokenLaunch } from "@/components/token-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data for user's tokens
const mockUserTokens: TokenLaunch[] = [
  {
    id: "1",
    name: "MemeAI Coin",
    symbol: "MEMEAI",
    description: "AI-powered meme token with autonomous community management",
    status: "live",
    progress: 100,
    marketCap: "$2.3M",
    holders: 5420,
    aiAgents: 3,
    socialScore: 85,
    launchDate: "2 days ago",
    creator: "0x1234...abcd"
  },
  {
    id: "2", 
    name: "DeFi Helper",
    symbol: "DEFIHLP",
    description: "Smart DeFi assistant token with yield optimization AI",
    status: "launching",
    progress: 65,
    marketCap: "$450K",
    holders: 1230,
    aiAgents: 2,
    socialScore: 72,
    launchDate: "6 hours ago",
    creator: "0x5678...efgh"
  },
  {
    id: "3",
    name: "GameFi Master",
    symbol: "GAMEFI",
    description: "Gaming ecosystem token with AI-driven strategy optimization",
    status: "paused",
    progress: 40,
    marketCap: "$180K",
    holders: 890,
    aiAgents: 1,
    socialScore: 58,
    launchDate: "Yesterday",
    creator: "0x9012...ijkl"
  }
]

export default function MyTokens() {
  const [tokens, setTokens] = useState<TokenLaunch[]>(mockUserTokens)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const handleView = (id: string) => {
    console.log("View token:", id)
  }

  const handleManage = (id: string) => {
    console.log("Manage token:", id)
  }

  const handleToggleStatus = (id: string) => {
    setTokens(prev => prev.map(token => 
      token.id === id 
        ? { 
            ...token, 
            status: token.status === "paused" ? "live" : "paused" as const 
          }
        : token
    ))
  }

  const filteredTokens = tokens.filter(token => {
    const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || token.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const liveTokens = tokens.filter(t => t.status === "live").length
  const launchingTokens = tokens.filter(t => t.status === "launching").length
  const pausedTokens = tokens.filter(t => t.status === "paused").length
  const totalMarketCap = tokens.reduce((sum, t) => sum + parseFloat(t.marketCap.replace(/[$M,K]/g, "")), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/CorewL.png" 
              alt="CoreWeave Logo" 
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-3xl font-bold text-foreground">My Token Launches</h1>
          </div>
          <p className="text-muted-foreground">
            Manage and monitor your launched tokens
          </p>
        </div>
        
        <Link to="/launch">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Launch New Token
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Tokens</CardTitle>
            <Play className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveTokens}</div>
            <p className="text-xs text-muted-foreground">Active launches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Launching</CardTitle>
            <Settings className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{launchingTokens}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paused</CardTitle>
            <Pause className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pausedTokens}</div>
            <p className="text-xs text-muted-foreground">Temporarily stopped</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
            <div className="text-xs text-muted-foreground">USD</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMarketCap.toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Combined value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tokens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="launching">Launching</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tokens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTokens.map((token) => (
          <TokenCard
            key={token.id}
            token={token}
            onView={handleView}
            onManage={handleManage}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </div>

      {filteredTokens.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "No tokens match your search criteria" 
                  : "You haven't launched any tokens yet"
                }
              </div>
              <Link to="/launch">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Launch Your First Token
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}