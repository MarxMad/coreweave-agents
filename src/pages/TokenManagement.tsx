import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { 
  ArrowLeft, 
  Settings, 
  Flame, 
  Plus, 
  Shield, 
  TrendingUp, 
  Users, 
  Share2, 
  ExternalLink,
  Copy,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Globe,
  MessageSquare,
  Calendar,
  Target,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWallet } from "@/hooks/use-wallet"
import { useCoreWeaveToken } from "@/hooks/use-core-weave-token"
import { useToast } from "@/hooks/use-toast"

// Mock data para el token
const mockTokenData = {
  address: "0x1234567890abcdef1234567890abcdef12345678",
  name: "Test Token",
  symbol: "TEST",
  totalSupply: "1000000000000000000000000",
  decimals: 18,
  owner: "0xb761...9D0B",
  createdAt: "2024-01-15",
  marketCap: "$1,234,567",
  price: "$0.001234",
  holders: 1079,
  volume24h: "$45,678",
  priceChange24h: "+12.34%"
}

export default function TokenManagement() {
  const { tokenAddress } = useParams()
  const { address, isConnected } = useWallet()
  const { toast } = useToast()
  const [isOwner, setIsOwner] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  
  // Mock: verificar si el usuario es el owner
  useEffect(() => {
    if (address && mockTokenData.owner) {
      setIsOwner(address.toLowerCase() === mockTokenData.owner.toLowerCase())
    }
  }, [address])

  const handleBurn = () => {
    toast({
      title: "Función de Quema",
      description: "Esta funcionalidad estará disponible próximamente.",
    })
  }

  const handleMint = () => {
    toast({
      title: "Función de Minteo",
      description: "Esta funcionalidad estará disponible próximamente.",
    })
  }

  const handleVerify = () => {
    toast({
      title: "Verificación de Contrato",
      description: "Esta funcionalidad estará disponible próximamente.",
    })
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(mockTokenData.address)
    toast({
      title: "Dirección copiada",
      description: "La dirección del contrato ha sido copiada al portapapeles.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 space-y-6 p-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/50 p-6 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5"></div>
          <div className="relative z-10 flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="icon" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="relative">
                  <img 
                    src="/CorewL.png" 
                    alt="CoreWeave Logo" 
                    className="h-12 w-12 object-contain"
                  />
                  <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {mockTokenData.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      ${mockTokenData.symbol}
                    </Badge>
                    <code className="text-sm bg-gray-700/50 px-2 py-1 rounded font-mono text-gray-300">
                      {mockTokenData.address.slice(0, 10)}...{mockTokenData.address.slice(-8)}
                    </code>
                  </div>
                </div>
              </div>
            </div>
            {isOwner && (
              <Badge className="gap-2 bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg">
                <Settings className="h-3 w-3" />
                Owner
              </Badge>
            )}
          </div>
        </div>

        {/* Token Info Card */}
        <Card className="border border-gray-600/50 bg-gradient-to-br from-gray-800/80 to-gray-700/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-b border-gray-600/50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              Información del Token
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Dirección del Contrato</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-gray-700/50 px-2 py-1 rounded font-mono">
                      {mockTokenData.address.slice(0, 10)}...{mockTokenData.address.slice(-8)}
                    </code>
                    <Button variant="ghost" size="sm" onClick={copyAddress}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Supply Total</Label>
                  <p className="text-lg font-semibold">{Number(mockTokenData.totalSupply) / 1e18} {mockTokenData.symbol}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Decimales</Label>
                  <p className="text-lg font-semibold">{mockTokenData.decimals}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="relative p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                  <Label className="text-sm text-green-400 font-medium">Market Cap</Label>
                  <p className="text-2xl font-bold text-green-400 mt-1">{mockTokenData.marketCap}</p>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="relative p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                  <Label className="text-sm text-blue-400 font-medium">Precio Actual</Label>
                  <p className="text-2xl font-bold text-blue-400 mt-1">{mockTokenData.price}</p>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                <div className="relative p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                  <Label className="text-sm text-green-400 font-medium">Cambio 24h</Label>
                  <p className="text-2xl font-bold text-green-400 mt-1">{mockTokenData.priceChange24h}</p>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="relative p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                  <Label className="text-sm text-purple-400 font-medium">Holders</Label>
                  <p className="text-2xl font-bold text-purple-400 mt-1">{mockTokenData.holders.toLocaleString()}</p>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
                <div className="relative p-4 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-xl border border-orange-500/20">
                  <Label className="text-sm text-orange-400 font-medium">Volumen 24h</Label>
                  <p className="text-2xl font-bold text-orange-400 mt-1">{mockTokenData.volume24h}</p>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                </div>
                <div className="relative p-4 bg-gradient-to-br from-gray-500/10 to-gray-400/10 rounded-xl border border-gray-500/20">
                  <Label className="text-sm text-gray-400 font-medium">Creado</Label>
                  <p className="text-2xl font-bold text-gray-400 mt-1">{mockTokenData.createdAt}</p>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/50 p-2 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5"></div>
            <TabsList className="grid w-full grid-cols-4 bg-transparent border-0">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all duration-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="management" 
                disabled={!isOwner}
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                Gestión
              </TabsTrigger>
              <TabsTrigger 
                value="social"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all duration-300"
              >
                Social
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all duration-300"
              >
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price Chart Placeholder */}
              <Card className="border border-gray-600/50 bg-gradient-to-br from-gray-800/80 to-gray-700/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-gray-600/50">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    Gráfica de Precio
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64 bg-gradient-to-br from-gray-700/50 to-gray-600/50 rounded-xl flex items-center justify-center border border-gray-600/50">
                    <div className="text-center">
                      <div className="relative mb-4">
                        <BarChart3 className="h-16 w-16 mx-auto text-green-400" />
                        <div className="absolute -inset-2 bg-green-400/20 rounded-full blur-lg"></div>
                      </div>
                      <p className="text-muted-foreground font-medium">Gráfica de precio disponible próximamente</p>
                      <p className="text-sm text-muted-foreground mt-1">Análisis en tiempo real</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border border-gray-600/50 bg-gradient-to-br from-gray-800/80 to-gray-700/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-gray-600/50">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Zap className="h-5 w-5 text-blue-400" />
                    </div>
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300">
                      <Plus className="h-4 w-4" />
                      Comprar
                    </Button>
                    <Button variant="outline" className="gap-2 border-gray-600 hover:bg-gray-700/50 transition-all duration-300">
                      <Share2 className="h-4 w-4" />
                      Vender
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-600/50">
                    <p className="text-sm text-muted-foreground mb-4 font-medium">Enlaces útiles:</p>
                    <div className="space-y-3">
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-gray-700/30 hover:bg-gray-600/50 border-gray-600/50 transition-all duration-300">
                        <ExternalLink className="h-4 w-4" />
                        Ver en CoreScan
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-gray-700/30 hover:bg-gray-600/50 border-gray-600/50 transition-all duration-300">
                        <ExternalLink className="h-4 w-4" />
                        Añadir a Wallet
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Management Tab (Solo para owners) */}
          <TabsContent value="management" className="mt-6">
            {isOwner ? (
              <div className="space-y-6">
                {/* Management Actions */}
                <Card className="border border-gray-600/50 bg-gradient-to-br from-gray-800/80 to-gray-700/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-b border-gray-600/50">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <Settings className="h-5 w-5 text-red-400" />
                      </div>
                      Gestión del Token
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button onClick={handleBurn} className="gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Flame className="h-4 w-4" />
                        Quemar Tokens
                      </Button>
                      <Button onClick={handleMint} className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Plus className="h-4 w-4" />
                        Mintear Tokens
                      </Button>
                      <Button onClick={handleVerify} className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Shield className="h-4 w-4" />
                        Verificar Contrato
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Token Settings */}
                <Card className="border border-gray-600/50 bg-gradient-to-br from-gray-800/80 to-gray-700/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-gray-600/50">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Settings className="h-5 w-5 text-blue-400" />
                      </div>
                      Configuración del Token
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="description" className="text-sm font-medium text-gray-300">Descripción</Label>
                        <Textarea 
                          id="description"
                          placeholder="Describe tu token y su propósito..."
                          className="mt-2 bg-gray-700/50 border-gray-600/50 focus:border-primary/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website" className="text-sm font-medium text-gray-300">Website</Label>
                        <Input 
                          id="website"
                          placeholder="https://tu-website.com"
                          className="mt-2 bg-gray-700/50 border-gray-600/50 focus:border-primary/50"
                        />
                      </div>
                    </div>
                    <Button className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CheckCircle className="h-4 w-4" />
                      Guardar Configuración
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Solo el owner del token puede acceder a las funciones de gestión.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Social Links */}
              <Card className="border border-gray-700/50 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Enlaces Sociales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input 
                      id="twitter"
                      placeholder="https://twitter.com/tu-cuenta"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telegram">Telegram</Label>
                    <Input 
                      id="telegram"
                      placeholder="https://t.me/tu-grupo"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discord">Discord</Label>
                    <Input 
                      id="discord"
                      placeholder="https://discord.gg/tu-servidor"
                      className="mt-1"
                    />
                  </div>
                  <Button className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Guardar Enlaces
                  </Button>
                </CardContent>
              </Card>

              {/* Community Info */}
              <Card className="border border-gray-700/50 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Información de Comunidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="community">Descripción de Comunidad</Label>
                    <Textarea 
                      id="community"
                      placeholder="Describe tu comunidad y sus objetivos..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roadmap">Roadmap</Label>
                    <Textarea 
                      id="roadmap"
                      placeholder="Describe el roadmap de tu proyecto..."
                      className="mt-1"
                    />
                  </div>
                  <Button className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Guardar Información
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <Card className="border border-gray-700/50 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics del Token
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Analytics detallados disponibles próximamente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
