import { useState } from "react"
import { Rocket, TrendingUp, Users, Bot, Plus, Filter, Search } from "lucide-react"
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

// Mock data
const mockTokens: TokenLaunch[] = [
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
    launchDate: "Hace 2 días",
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
    launchDate: "Hace 6 horas",
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
    launchDate: "Ayer",
    creator: "0x9012...ijkl"
  },
  {
    id: "4",
    name: "Social Boost",
    symbol: "SOCIAL",
    description: "Community engagement token with viral AI marketing",
    status: "completed",
    progress: 100,
    marketCap: "$5.7M",
    holders: 12340,
    aiAgents: 5,
    socialScore: 92,
    launchDate: "Hace 1 semana",
    creator: "0x3456...mnop"
  }
]

export default function TokenDashboard() {
  const [tokens, setTokens] = useState<TokenLaunch[]>(mockTokens)
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
  const totalMarketCap = tokens.reduce((sum, t) => sum + parseFloat(t.marketCap.replace(/[$M,K]/g, "")), 0)
  const totalHolders = tokens.reduce((sum, t) => sum + t.holders, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Token Launchpad</h1>
          <p className="text-muted-foreground">
            Lanza y gestiona tokens con agentes AI inteligentes
          </p>
        </div>
        
        <Link to="/launch">
          <Button size="lg" className="gap-2">
            <Rocket className="h-5 w-5" />
            Lanzar Nuevo Token
          </Button>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens en Vivo</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{liveTokens}</div>
            <p className="text-xs text-muted-foreground">activos ahora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lanzamientos</CardTitle>
            <Rocket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{launchingTokens}</div>
            <p className="text-xs text-muted-foreground">en progreso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMarketCap.toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">valor total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holders Totales</CardTitle>
            <Users className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHolders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">inversores únicos</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Launch Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Lanzamiento AI Rápido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Crea tu token en minutos con agentes AI preconfigurados para marketing, comunidad y engagement automático.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/launch">
              <Button className="gap-2">
                <Rocket className="h-4 w-4" />
                Wizard de Lanzamiento
              </Button>
            </Link>
            <Link to="/strategies">
              <Button variant="outline" className="gap-2">
                <Bot className="h-4 w-4" />
                Ver Estrategias AI
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tokens por nombre o símbolo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="launching">Lanzando</SelectItem>
            <SelectItem value="live">En Vivo</SelectItem>
            <SelectItem value="paused">Pausado</SelectItem>
            <SelectItem value="completed">Completado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tokens Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos ({tokens.length})</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
          <TabsTrigger value="my-tokens">Mis Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {filteredTokens.length === 0 ? (
            <Card className="p-12 text-center">
              <Rocket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No hay tokens disponibles</h3>
              <p className="text-muted-foreground mb-4">
                Sé el primero en lanzar un token con agentes AI en CoreDao
              </p>
              <Link to="/launch">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Lanzar Primer Token
                </Button>
              </Link>
            </Card>
          ) : (
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
          )}
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens
              .filter(t => t.socialScore > 80)
              .map((token) => (
                <TokenCard
                  key={token.id}
                  token={token}
                  onView={handleView}
                  onManage={handleManage}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens
              .filter(t => t.status === "launching" || t.launchDate.includes("horas") || t.launchDate.includes("Ayer"))
              .map((token) => (
                <TokenCard
                  key={token.id}
                  token={token}
                  onView={handleView}
                  onManage={handleManage}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="my-tokens" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.slice(0, 2).map((token) => (
              <TokenCard
                key={token.id}
                token={token}
                onView={handleView}
                onManage={handleManage}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}