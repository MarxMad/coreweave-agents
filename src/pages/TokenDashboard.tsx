import { useState, useEffect } from "react"
import { Rocket, TrendingUp, Users, Bot, Plus, Filter, Search, Settings, Factory, User, Sparkles } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useCoreWeaveToken, AIAgentConfig } from "@/hooks/use-core-weave-token"
import { useCoreWeaveTokenFactory, TokenInfo } from "@/hooks/use-core-weave-token-factory"
import { useWallet } from "@/hooks/use-wallet"
import { formatTokenAmount } from "@/lib/contracts"
import { useToast } from "@/hooks/use-toast"
import { useErrorHandler } from "@/lib/error-handler"
import { formatEther } from "viem"

// Mock data for all tokens
const mockAllTokens: TokenLaunch[] = [
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
    launchDate: "1 week ago",
    creator: "0x3456...mnop"
  }
]

// Mock data for user's tokens (subset of all tokens)
const mockUserTokens: TokenLaunch[] = mockAllTokens.filter(token => 
  token.creator === "0x1234...abcd" || token.creator === "0x5678...efgh"
)

export default function TokenDashboard() {
  const [allTokens, setAllTokens] = useState<TokenLaunch[]>([])
  const [userTokens, setUserTokens] = useState<TokenLaunch[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")
  const [showAIConfig, setShowAIConfig] = useState(false)
  const [aiConfig, setAiConfig] = useState<AIAgentConfig>({
    communityManager: false,
    marketingAI: false,
    dataAnalyst: false,
    tradingAssistant: false
  })
  const [isLoadingTokens, setIsLoadingTokens] = useState(true)

  const { address, isConnected } = useWallet()
  const { toast } = useToast()
  const { logNetworkError } = useErrorHandler()
  
  // Hook del factory para obtener tokens
  const factory = useCoreWeaveTokenFactory()
  
  // Hook del contrato CoreWeaveToken (para configuración AI)
  const {
    useTokenInfo,
    useAIAgentsConfig,
    useOwner,
    useTotalSupply,
    configureAIAgents,
    isPending,
    isConfirmed,
    error
  } = useCoreWeaveToken()

  // Datos del contrato
  const { data: tokenInfo, isLoading: isLoadingTokenInfo } = useTokenInfo()
  const { data: currentAIConfig, isLoading: isLoadingAIConfig } = useAIAgentsConfig()
  const { data: owner } = useOwner()
  const { data: totalSupply } = useTotalSupply()

  // Verificar si el usuario es el owner del contrato
  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase()

  // Función para convertir TokenInfo a TokenLaunch
  const convertTokenInfoToTokenLaunch = (tokenInfo: TokenInfo, index: number): TokenLaunch => {
    const createdDate = new Date(Number(tokenInfo.createdAt) * 1000)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - createdDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    let launchDate = "Hoy"
    if (diffDays === 1) launchDate = "Ayer"
    else if (diffDays > 1) launchDate = `Hace ${diffDays} días`
    
    return {
      id: tokenInfo.tokenAddress,
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
      description: `Token ${tokenInfo.hasAIAgents ? 'con agentes AI' : 'estándar'} creado en CoreWeave`,
      status: "live" as const,
      progress: 100,
      marketCap: `${formatEther(tokenInfo.totalSupply)} ${tokenInfo.symbol}`,
      holders: Math.floor(Math.random() * 1000) + 100, // Placeholder
      aiAgents: tokenInfo.hasAIAgents ? Math.floor(Math.random() * 5) + 1 : 0,
      socialScore: Math.floor(Math.random() * 40) + 60, // Placeholder
      launchDate,
      creator: `${tokenInfo.creator.slice(0, 6)}...${tokenInfo.creator.slice(-4)}`
    }
  }

  // Cargar todos los tokens del factory con debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const loadAllTokens = async () => {
      console.log('=== DEBUG loadAllTokens ===')
      console.log('factory.getAllTokens:', factory.getAllTokens)
      console.log('factory.getAllTokens?.data:', factory.getAllTokens?.data)
      console.log('factory.getAllTokens?.isLoading:', factory.getAllTokens?.isLoading)
      console.log('factory.getAllTokens?.error:', factory.getAllTokens?.error)
      
      // Solo cargar si hay datos disponibles del hook
      if (!factory.getAllTokens?.data) {
        console.log('No hay datos de getAllTokens disponibles')
        return
      }
      
      try {
        setIsLoadingTokens(true)
        const tokens = factory.getAllTokens.data
        console.log('Tokens obtenidos:', tokens)
        console.log('Tipo de tokens:', typeof tokens, Array.isArray(tokens))
        console.log('Longitud de tokens:', tokens?.length)
        
        if (Array.isArray(tokens) && tokens.length > 0) {
          const convertedTokens = tokens.map((token, index) => convertTokenInfoToTokenLaunch(token, index))
          console.log('Tokens convertidos:', convertedTokens)
          setAllTokens(convertedTokens)
        } else {
          console.log('No hay tokens para mostrar')
          setAllTokens([])
        }
      } catch (error) {
        console.error('Error en loadAllTokens:', error)
        logNetworkError(error as Error, 'loadAllTokens')
        // Solo mostrar toast si es un error real, no de conectividad
        if (!error?.message?.includes('fetch')) {
          toast({
            title: "Error",
            description: "Error al cargar los tokens del factory",
            variant: "destructive",
          })
        }
      } finally {
        setIsLoadingTokens(false)
      }
    }

    // Debounce para evitar llamadas excesivas
    timeoutId = setTimeout(() => {
      if (factory.getAllTokens?.data && !factory.getAllTokens.isLoading) {
        loadAllTokens()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [factory.getAllTokens?.data, factory.getAllTokens?.isLoading, factory.getAllTokens?.error, toast])

  // Cargar tokens del usuario con debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const loadUserTokens = async () => {
      console.log('=== DEBUG loadUserTokens ===')
      console.log('address:', address)
      console.log('factory.getUserTokens:', factory.getUserTokens)
      console.log('factory.getUserTokens?.data:', factory.getUserTokens?.data)
      console.log('factory.getUserTokens?.isLoading:', factory.getUserTokens?.isLoading)
      console.log('factory.getUserTokens?.error:', factory.getUserTokens?.error)
      
      if (!address) {
        console.log('No hay address, limpiando userTokens')
        setUserTokens([])
        return
      }
      
      // Solo cargar si hay datos disponibles del hook
      if (!factory.getUserTokens?.data) {
        console.log('No hay datos de getUserTokens disponibles')
        return
      }
      
      try {
        const tokens = factory.getUserTokens.data
        console.log('User tokens obtenidos:', tokens)
        console.log('Tipo de user tokens:', typeof tokens, Array.isArray(tokens))
        console.log('Longitud de user tokens:', tokens?.length)
        
        if (Array.isArray(tokens) && tokens.length > 0) {
          const convertedTokens = tokens.map((token, index) => convertTokenInfoToTokenLaunch(token, index))
          console.log('User tokens convertidos:', convertedTokens)
          setUserTokens(convertedTokens)
        } else {
          console.log('No hay user tokens para mostrar')
          setUserTokens([])
        }
      } catch (error) {
        console.error('Error en loadUserTokens:', error)
        logNetworkError(error as Error, 'loadUserTokens')
      }
    }

    // Debounce para evitar llamadas excesivas
    timeoutId = setTimeout(() => {
      if (factory.getUserTokens?.data && !factory.getUserTokens.isLoading) {
        loadUserTokens()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [address, factory.getUserTokens?.data, factory.getUserTokens?.isLoading])

  useEffect(() => {
    if (currentAIConfig) {
      setAiConfig(currentAIConfig)
    }
  }, [currentAIConfig])

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Configuración actualizada",
        description: "Los agentes AI han sido configurados exitosamente.",
      })
      setShowAIConfig(false)
    }
  }, [isConfirmed, toast])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Error al configurar los agentes AI.",
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleView = (id: string) => {
    console.log("View token:", id)
  }

  const handleManage = (id: string) => {
    console.log("Manage token:", id)
  }

  const handleToggleStatus = (id: string) => {
    setAllTokens(prev => prev.map(token => 
      token.id === id 
        ? { 
            ...token, 
            status: token.status === "paused" ? "live" : "paused" as const 
          }
        : token
    ))
    setUserTokens(prev => prev.map(token => 
      token.id === id 
        ? { 
            ...token, 
            status: token.status === "paused" ? "live" : "paused" as const 
          }
        : token
    ))
  }

  const handleConfigureAI = () => {
    if (!isConnected) {
      toast({
        title: "Wallet no conectada",
        description: "Por favor conecta tu wallet para continuar.",
        variant: "destructive",
      })
      return
    }

    if (!isOwner) {
      toast({
        title: "Sin permisos",
        description: "Solo el owner del contrato puede configurar los agentes AI.",
        variant: "destructive",
      })
      return
    }

    configureAIAgents(
      aiConfig.communityManager,
      aiConfig.marketingAI,
      aiConfig.dataAnalyst,
      aiConfig.tradingAssistant
    )
  }

  const filteredAllTokens = allTokens.filter(token => {
    const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || token.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredUserTokens = userTokens.filter(token => {
    const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || token.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const liveTokens = allTokens.filter(t => t.status === "live").length
  const launchingTokens = allTokens.filter(t => t.status === "launching").length
  const totalMarketCap = allTokens.reduce((sum, t) => sum + parseFloat(t.marketCap.replace(/[$M,K]/g, "")), 0)
  const totalHolders = allTokens.reduce((sum, t) => sum + t.holders, 0)

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-8 p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src="/CorewL.png" 
                  alt="CoreWeave Logo" 
                  className="h-12 w-12 object-contain"
                />
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Token Launchpad
                  </h1>
                  <p className="text-muted-foreground">
                    Lanza y gestiona tokens con agentes AI inteligentes
                  </p>
                </div>
              </div>
            </div>
            
            <Link to="/launch">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 shadow-lg">
                <Plus className="h-5 w-5" />
                Launch New Token
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-700/50 bg-gray-800/50 hover:bg-gray-700/50 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Tokens</CardTitle>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{liveTokens}</div>
            <p className="text-xs text-muted-foreground">activos ahora</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-700/50 bg-gray-800/50 hover:bg-gray-700/50 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lanzamientos</CardTitle>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Rocket className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{launchingTokens}</div>
            <p className="text-xs text-muted-foreground">en progreso</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-700/50 bg-gray-800/50 hover:bg-gray-700/50 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap Total</CardTitle>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">${totalMarketCap.toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">valor total</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-700/50 bg-gray-800/50 hover:bg-gray-700/50 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Holders</CardTitle>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Users className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">{totalHolders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">inversores únicos</p>
          </CardContent>
        </Card>
      </div>

      {/* CoreWeave Token Contract Info */}
      {tokenInfo && (
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-500" />
                Contrato CoreWeave Token Desplegado
              </CardTitle>
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAIConfig(!showAIConfig)}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Configurar AI
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-semibold">{tokenInfo[0]}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Símbolo</p>
                <p className="font-semibold">{tokenInfo[1]}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supply Total</p>
                <p className="font-semibold">
                  {totalSupply ? formatTokenAmount(totalSupply) : 'Cargando...'}
                </p>
              </div>
            </div>
            
            {currentAIConfig && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Agentes AI Configurados</p>
                <div className="flex flex-wrap gap-2">
                  {currentAIConfig.communityManager && (
                    <Badge variant="secondary">Community Manager</Badge>
                  )}
                  {currentAIConfig.marketingAI && (
                    <Badge variant="secondary">Marketing AI</Badge>
                  )}
                  {currentAIConfig.dataAnalyst && (
                    <Badge variant="secondary">Data Analyst</Badge>
                  )}
                  {currentAIConfig.tradingAssistant && (
                    <Badge variant="secondary">Trading Assistant</Badge>
                  )}
                  {!currentAIConfig.communityManager && !currentAIConfig.marketingAI && 
                   !currentAIConfig.dataAnalyst && !currentAIConfig.tradingAssistant && (
                    <Badge variant="outline">Sin agentes configurados</Badge>
                  )}
                </div>
              </div>
            )}

            {showAIConfig && isOwner && (
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-semibold">Configuración de Agentes AI</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="community-manager">Community Manager</Label>
                    <Switch
                      id="community-manager"
                      checked={aiConfig.communityManager}
                      onCheckedChange={(checked) => 
                        setAiConfig(prev => ({ ...prev, communityManager: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing-ai">Marketing AI</Label>
                    <Switch
                      id="marketing-ai"
                      checked={aiConfig.marketingAI}
                      onCheckedChange={(checked) => 
                        setAiConfig(prev => ({ ...prev, marketingAI: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="data-analyst">Data Analyst</Label>
                    <Switch
                      id="data-analyst"
                      checked={aiConfig.dataAnalyst}
                      onCheckedChange={(checked) => 
                        setAiConfig(prev => ({ ...prev, dataAnalyst: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trading-assistant">Trading Assistant</Label>
                    <Switch
                      id="trading-assistant"
                      checked={aiConfig.tradingAssistant}
                      onCheckedChange={(checked) => 
                        setAiConfig(prev => ({ ...prev, tradingAssistant: checked }))
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleConfigureAI}
                    disabled={isPending}
                    className="gap-2"
                  >
                    {isPending ? 'Configurando...' : 'Guardar Configuración'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAIConfig(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Launch Card */}
      <Card className="border border-gray-700/50 bg-gray-800/50 hover:bg-gray-700/50 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Sparkles className="h-6 w-6" />
            Lanzamiento Rápido
          </CardTitle>
          <p className="text-muted-foreground">
            Crea tu token en minutos con plantillas preconfiguradas y agentes AI inteligentes
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="h-4 w-4 text-primary" />
                <span className="font-semibold">Wizard</span>
              </div>
              <p className="text-sm text-muted-foreground">Guía paso a paso</p>
            </div>
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Factory className="h-4 w-4 text-primary" />
                <span className="font-semibold">Factory</span>
              </div>
              <p className="text-sm text-muted-foreground">Creación directa</p>
            </div>
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-4 w-4 text-primary" />
                <span className="font-semibold">AI Agents</span>
              </div>
              <p className="text-sm text-muted-foreground">Automatización</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/launch">
              <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-lg">
                <Rocket className="h-4 w-4" />
                Launch Wizard
              </Button>
            </Link>
            <Link to="/token-factory">
              <Button variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
                <Factory className="h-4 w-4" />
                Token Factory
              </Button>
            </Link>
            <Link to="/strategies">
              <Button variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
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
            placeholder="Search tokens by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="launching">Launching</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            All Tokens ({allTokens.length})
          </TabsTrigger>
          <TabsTrigger value="my" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            My Tokens ({userTokens.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {/* Sub-tabs for All Tokens */}
          <Tabs defaultValue="all-tokens" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all-tokens">All</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {isLoadingTokens ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredAllTokens.length === 0 ? (
                <Card className="p-12 text-center">
                  <Rocket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No tokens found</h3>
                  <p className="text-muted-foreground mb-4">
                    {allTokens.length === 0 
                      ? "No hay tokens lanzados aún. ¡Sé el primero!"
                      : "Intenta ajustar tus filtros o términos de búsqueda"
                    }
                  </p>
                  <Link to="/launch">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Launch First Token
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAllTokens.map((token) => (
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
                {allTokens
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
                {allTokens
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

            <TabsContent value="live" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allTokens
                  .filter(t => t.status === "live")
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
          </Tabs>
        </TabsContent>

        <TabsContent value="my" className="mt-6">
          {/* Stats Cards for My Tokens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Tokens</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userTokens.length}</div>
                <p className="text-xs text-muted-foreground">Tokens you created</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.75M</div>
                <p className="text-xs text-muted-foreground">Combined market cap</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Holders</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6.65K</div>
                <p className="text-xs text-muted-foreground">Across all tokens</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">AI agents running</p>
              </CardContent>
            </Card>
          </div>

          {/* Token Grid for My Tokens */}
          {isLoadingTokens ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredUserTokens.length === 0 ? (
            <Card className="p-12 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No tokens found</h3>
              <p className="text-muted-foreground mb-4">
                {userTokens.length === 0 
                  ? "No has creado ningún token aún"
                  : "Intenta ajustar tus filtros o términos de búsqueda"
                }
              </p>
              <Link to="/launch">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Launch Your First Token
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUserTokens.map((token) => (
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
      </Tabs>
    </div>
  )
}