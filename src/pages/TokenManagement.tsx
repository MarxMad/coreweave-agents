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
    <div className="min-h-screen bg-gray-900">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <img 
                src="/CorewL.png" 
                alt="CoreWeave Logo" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold">{mockTokenData.name}</h1>
                <p className="text-muted-foreground">${mockTokenData.symbol} • {mockTokenData.address.slice(0, 10)}...{mockTokenData.address.slice(-8)}</p>
              </div>
            </div>
          </div>
          {isOwner && (
            <Badge variant="secondary" className="gap-1">
              <Settings className="h-3 w-3" />
              Owner
            </Badge>
          )}
        </div>

        {/* Token Info Card */}
        <Card className="border border-gray-700/50 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Información del Token
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                <div>
                  <Label className="text-sm text-muted-foreground">Market Cap</Label>
                  <p className="text-lg font-semibold text-green-400">{mockTokenData.marketCap}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Precio Actual</Label>
                  <p className="text-lg font-semibold">{mockTokenData.price}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Cambio 24h</Label>
                  <p className="text-lg font-semibold text-green-400">{mockTokenData.priceChange24h}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Holders</Label>
                  <p className="text-lg font-semibold">{mockTokenData.holders.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Volumen 24h</Label>
                  <p className="text-lg font-semibold">{mockTokenData.volume24h}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Creado</Label>
                  <p className="text-lg font-semibold">{mockTokenData.createdAt}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="management" disabled={!isOwner}>Gestión</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price Chart Placeholder */}
              <Card className="border border-gray-700/50 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Gráfica de Precio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Gráfica de precio disponible próximamente</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border border-gray-700/50 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="gap-2 bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4" />
                      Comprar
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Vender
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700/50">
                    <p className="text-sm text-muted-foreground mb-3">Enlaces útiles:</p>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Ver en CoreScan
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2">
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
                <Card className="border border-gray-700/50 bg-gray-800/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Gestión del Token
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button onClick={handleBurn} className="gap-2 bg-red-600 hover:bg-red-700">
                        <Flame className="h-4 w-4" />
                        Quemar Tokens
                      </Button>
                      <Button onClick={handleMint} className="gap-2 bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4" />
                        Mintear Tokens
                      </Button>
                      <Button onClick={handleVerify} className="gap-2 bg-purple-600 hover:bg-purple-700">
                        <Shield className="h-4 w-4" />
                        Verificar Contrato
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Token Settings */}
                <Card className="border border-gray-700/50 bg-gray-800/50">
                  <CardHeader>
                    <CardTitle>Configuración del Token</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea 
                          id="description"
                          placeholder="Describe tu token y su propósito..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website"
                          placeholder="https://tu-website.com"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button className="gap-2">
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
