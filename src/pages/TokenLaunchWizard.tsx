import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Rocket, Bot, Target, CheckCircle, AlertTriangle, Share2, Wallet, Copy, ExternalLink, Plus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWallet } from "@/hooks/use-wallet"
import { useCoreWeaveTokenFactory } from "@/hooks/use-core-weave-token-factory"
import { switchChain } from '@wagmi/core'
import { config } from '@/lib/wagmi'
import { parseEther } from 'viem'
import SocialMediaIntegration from "@/components/social-media-integration"
import { TokenLaunchConfirmation } from "@/components/token-launch-confirmation"
import { WalletConnect } from "@/components/wallet-connect"
import { ContractDiagnostics } from "@/components/contract-diagnostics"

const steps = [
  { id: 1, title: "Configuración del Token", icon: Rocket },
  { id: 2, title: "Agentes AI", icon: Bot },
  { id: 3, title: "Confirmación", icon: CheckCircle },
]

const aiAgentTemplates = [
  {
    id: "community",
    name: "Community Manager",
    description: "Community management and automatic engagement",
    channels: ["Discord", "Telegram"],
    features: ["Automatic responses", "Moderation", "Events"]
  },
  {
    id: "marketing",
    name: "Marketing AI",
    description: "Automated campaigns and promotion",
    channels: ["Twitter", "Reddit"],
    features: ["Scheduled posts", "Influencer outreach", "Trends"]
  },
  {
    id: "analytics",
    name: "Data Analyst",
    description: "Market analysis and metrics",
    channels: ["Dashboard"],
    features: ["Automatic reports", "Alerts", "Predictions"]
  },
  {
    id: "trader",
    name: "Trading Assistant",
    description: "Trading and liquidity support",
    channels: ["DEX"],
    features: ["Market making", "Arbitrage", "Price alerts"]
  }
]

const marketingStrategies = [
  {
    id: "viral",
    name: "Viral Strategy",
    description: "Focus on viral content and trends",
    tactics: ["Memes", "Challenges", "Influencers"]
  },
  {
    id: "utility",
    name: "Utility Focus",
    description: "Highlight use cases and functionality",
    tactics: ["Demos", "Tutorials", "Partnerships"]
  },
  {
    id: "community",
    name: "Community First",
    description: "Building a solid community",
    tactics: ["AMAs", "Contests", "Rewards"]
  }
]

export default function TokenLaunchWizard() {
  const { isConnected, isCoreDaoChain, chainId } = useWallet()
  const { createToken, creationFee, isLoading, isSuccess, hash, error, reset } = useCoreWeaveTokenFactory()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [launchData, setLaunchData] = useState<{
    transactionHash: string
    tokenName: string
    tokenSymbol: string
  } | null>(null)
  const [formData, setFormData] = useState({
    // Paso 1: Configuración del Token
    name: "",
    symbol: "",
    description: "",
    totalSupply: "1000000",
    
    // Paso 2: Agentes AI
    selectedAgents: [] as string[],
    enableAIAgents: false,
  })

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAgentToggle = (agentId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAgents: prev.selectedAgents.includes(agentId)
        ? prev.selectedAgents.filter(id => id !== agentId)
        : [...prev.selectedAgents, agentId]
    }))
  }

  const handleAIToggle = () => {
    setFormData(prev => ({
      ...prev,
      enableAIAgents: !prev.enableAIAgents,
      selectedAgents: !prev.enableAIAgents ? [] : prev.selectedAgents
    }))
  }

  // Detectar cuando la transacción es exitosa
  useEffect(() => {
    console.log('Verificando éxito de transacción:', { 
      isSuccess, 
      hash, 
      isCreating, 
      isLoading 
    })
    
    if (isSuccess && hash && isCreating) {
      console.log('✅ Transacción exitosa detectada:', { hash, isSuccess })
      setLaunchData({
        transactionHash: hash,
        tokenName: formData.name,
        tokenSymbol: formData.symbol
      })
      setShowConfirmation(true)
      setIsCreating(false)
    }
  }, [isSuccess, hash, isCreating, isLoading, formData.name, formData.symbol])

  // Manejar errores y timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    if (isCreating) {
      console.log('⏱️ Iniciando timeout de 3 minutos para creación de token')
      timeoutId = setTimeout(() => {
        console.log('⏰ Timeout alcanzado, deteniendo creación')
        setIsCreating(false)
        reset() // Reset wagmi state
      }, 3 * 60 * 1000) // 3 minutos
    }
    
    // Si hay error, resetear estado
    if (error && isCreating) {
      console.log('❌ Error detectado, reseteando estado:', {
        error: error.message,
        name: error.name
      })
      setIsCreating(false)
      setTimeout(() => reset(), 1000)
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isCreating, error, reset])

  // Log de estados para debugging
  useEffect(() => {
    console.log('📊 Estados de transacción:', {
      isLoading,
      isSuccess,
      hash,
      isCreating,
      error: error?.message,
      timestamp: new Date().toISOString()
    })
  }, [isLoading, isSuccess, hash, isCreating, error])

  // Verificación adicional para detectar transacciones confirmadas
  useEffect(() => {
    if (hash && !isLoading && !isSuccess && !error && isCreating) {
      console.log('🔍 Transacción con hash pero sin confirmación explícita:', {
        hash,
        isLoading,
        isSuccess,
        error,
        isCreating
      })
      
      // Esperar un poco más antes de considerar la transacción como exitosa
      const checkTimer = setTimeout(() => {
        if (!isSuccess && !error && isCreating) {
          console.log('⚠️ Asumiendo transacción exitosa por timeout de confirmación')
          setLaunchData({
            transactionHash: hash,
            tokenName: formData.name,
            tokenSymbol: formData.symbol
          })
          setShowConfirmation(true)
          setIsCreating(false)
        }
      }, 10000) // 10 segundos
      
      return () => clearTimeout(checkTimer)
    }
  }, [hash, isLoading, isSuccess, error, isCreating, formData.name, formData.symbol])

  const handleLaunchToken = async () => {
    if (!isConnected || !isCoreDaoChain) {
      console.log('❌ No se puede lanzar token: wallet no conectado o red incorrecta')
      return
    }

    console.log('🚀 Iniciando lanzamiento de token:', {
      name: formData.name,
      symbol: formData.symbol,
      totalSupply: formData.totalSupply,
      enableAIAgents: formData.selectedAgents.length > 0 || formData.enableAIAgents
    })

    setIsCreating(true)
    
    // Reset previous states
    reset()
    
    try {
      // Determinar si se habilitan agentes AI
      const enableAIAgents = formData.selectedAgents.length > 0 || formData.enableAIAgents

      await createToken({
        name: formData.name,
        symbol: formData.symbol,
        totalSupply: formData.totalSupply,
        enableAIAgents
      })
      
      console.log('✅ Función createToken ejecutada exitosamente')
    } catch (error) {
      console.error('❌ Error en handleLaunchToken:', error)
      setIsCreating(false)
    }
  }

  const handleGoToDashboard = () => {
    navigate('/dashboard')
  }

  const handleCreateAnother = () => {
    setShowConfirmation(false)
    setLaunchData(null)
    setIsCreating(false)
    setCurrentStep(1)
    reset() // Reset wagmi state
    setFormData({
      name: "",
      symbol: "",
      description: "",
      totalSupply: "1000000",
      selectedAgents: [],
      enableAIAgents: false
    })
  }

  const progress = (currentStep / steps.length) * 100

  // Mostrar pantalla de confirmación si el token fue creado exitosamente
  if (showConfirmation && launchData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-8">
            <div className="text-center space-y-6">
              {/* Icono de éxito animado */}
              <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 animate-pulse" />
              </div>
              
              {/* Título de éxito */}
              <div>
                <h1 className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">
                  🎉 ¡Token Creado Exitosamente!
                </h1>
                <p className="text-lg text-green-700 dark:text-green-300">
                  Tu token <strong>{launchData.tokenName} ({launchData.tokenSymbol})</strong> ha sido desplegado en CoreDAO
                </p>
              </div>

              {/* Información del token */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Detalles del Token
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nombre:</span>
                    <p className="font-medium">{launchData.tokenName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Símbolo:</span>
                    <p className="font-medium">{launchData.tokenSymbol}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Supply Total:</span>
                    <p className="font-medium">{Number(formData.totalSupply).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Hash de Transacción:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {launchData.transactionHash.slice(0, 10)}...{launchData.transactionHash.slice(-8)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(launchData.transactionHash)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones rápidas */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://scan.coredao.org/tx/${launchData.transactionHash}`, '_blank')}
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver en CoreScan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const tokenInfo = `🎉 ¡Nuevo token creado!\n\n📛 Nombre: ${launchData.tokenName}\n🔤 Símbolo: ${launchData.tokenSymbol}\n📊 Supply: ${Number(formData.totalSupply).toLocaleString()}\n🔗 Hash: ${launchData.transactionHash}\n\n#CoreDAO #DeFi #Token`
                      navigator.clipboard.writeText(tokenInfo)
                    }}
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Compartir Info
                  </Button>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handleCreateAnother}
                    variant="outline"
                    className="gap-2"
                  >
                    <Rocket className="h-4 w-4" />
                    Crear Otro Token
                  </Button>
                  <Button
                    onClick={handleGoToDashboard}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Target className="h-4 w-4" />
                    Ir al Dashboard
                  </Button>
                </div>
              </div>

              {/* Próximos pasos */}
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🚀 Próximos Pasos</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 text-left">
                  <li>• Añade liquidez en un DEX para permitir trading</li>
                  <li>• Configura los agentes AI si los habilitaste</li>
                  <li>• Comparte tu token en redes sociales</li>
                  <li>• Monitorea las métricas en el dashboard</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/">
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
            <h1 className="text-3xl font-bold text-foreground">Launch New Token</h1>
          </div>
          <p className="text-muted-foreground">
            Configure your token with intelligent AI agents
          </p>
        </div>
        {isConnected && !isCoreDaoChain && (
          <Button 
            variant="destructive" 
            onClick={async () => {
              try {
                await switchChain(config, { chainId: 1116 })
              } catch (error) {
                console.error('Error switching to CoreDAO:', error)
              }
            }}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Switch to Core Network
          </Button>
        )}
      </div>

      {/* Wallet Connection Alert */}
      {!isConnected && (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <Wallet className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <div className="flex items-center justify-between">
              <span>Necesitas conectar tu billetera para lanzar tokens</span>
              <WalletConnect />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Contract Diagnostics */}
      <ContractDiagnostics />

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Wizard Progress</span>
              <span className="font-medium">Step {currentStep} of {steps.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                const isActive = step.id === currentStep
                const isCompleted = step.id < currentStep
                
                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div className={`p-2 rounded-full ${
                      isCompleted ? 'bg-success text-success-foreground' :
                      isActive ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <span className={`text-xs text-center ${
                      isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Token Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Token Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. MemeAI Coin"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  placeholder="e.g. MEMEAI"
                  value={formData.symbol}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your token and its purpose..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supply">Total Supply</Label>
              <Input
                id="supply"
                placeholder="1000000"
                value={formData.totalSupply}
                onChange={(e) => setFormData(prev => ({ ...prev, totalSupply: e.target.value }))}
              />
              <p className="text-sm text-muted-foreground">
                Cantidad total de tokens que se crearán
              </p>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Información importante:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• El token será creado en la red CoreDAO</li>
                <li>• Se requiere pagar una tarifa de creación</li>
                <li>• Los agentes AI son opcionales y se configuran en el siguiente paso</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Agentes AI (Opcional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <h3 className="font-semibold">Habilitar Agentes AI</h3>
                <p className="text-sm text-muted-foreground">
                  Los agentes AI pueden ayudar a gestionar tu token automáticamente
                </p>
              </div>
              <Switch
                checked={formData.enableAIAgents}
                onCheckedChange={handleAIToggle}
              />
            </div>
            
            {formData.enableAIAgents && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiAgentTemplates.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.selectedAgents.includes(agent.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-border/80'
                  }`}
                  onClick={() => handleAgentToggle(agent.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">{agent.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      formData.selectedAgents.includes(agent.id)
                        ? 'bg-primary border-primary'
                        : 'border-border'
                    }`}>
                      {formData.selectedAgents.includes(agent.id) && (
                        <CheckCircle className="w-5 h-5 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {agent.channels.map(channel => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {agent.features.join(" • ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Confirmación de Lanzamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Configuración del Token</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span>{formData.name || "No especificado"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Símbolo:</span>
                    <span>{formData.symbol || "No especificado"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Suministro Total:</span>
                    <span>{formData.totalSupply || "No especificado"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Descripción:</span>
                    <span className="text-right max-w-[200px] truncate">{formData.description || "No especificado"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Agentes AI Seleccionados</h3>
                <div className="space-y-2">
                  {formData.enableAIAgents && formData.selectedAgents.length > 0 ? (
                    formData.selectedAgents.map(agentId => {
                      const agent = aiAgentTemplates.find(a => a.id === agentId)
                      return (
                        <div key={agentId} className="text-sm p-2 bg-muted/50 rounded">
                          <span className="font-medium">{agent?.name}</span>
                        </div>
                      )
                    })
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {formData.enableAIAgents ? "Ningún agente seleccionado" : "Agentes AI deshabilitados"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="font-semibold mb-2">Resumen de Costos</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Lanzamiento del token:</span>
                  <span>{creationFee ? `${Number(creationFee) / 1e18} CORE` : 'Cargando...'}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total estimado:</span>
                  <span>{creationFee ? `${Number(creationFee) / 1e18} CORE` : 'Cargando...'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">⚠️ Información importante:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• El token será creado en la red CoreDAO</li>
                <li>• La transacción es irreversible una vez confirmada</li>
                <li>• Asegúrate de tener suficiente CORE para la tarifa de creación</li>
                <li>• Los agentes AI se pueden configurar después del lanzamiento</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>

        {currentStep === steps.length ? (
          <div className="flex flex-col gap-2">
            {!isCreating ? (
              <Button 
                onClick={handleLaunchToken}
                disabled={!isConnected || !isCoreDaoChain || !formData.name || !formData.symbol}
                className="gap-2"
              >
                <Rocket className="h-4 w-4" />
                Lanzar Token
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  disabled
                  className="gap-2 flex-1"
                >
                  <Rocket className="h-4 w-4" />
                  Creando Token...
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false)
                    reset()
                  }}
                  className="gap-2"
                >
                  Cancelar
                </Button>
              </div>
            )}
            {isCreating && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Estado de procesamiento */}
                    {isLoading && !error && (
                      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex-shrink-0">
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100">Procesando Transacción</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            {!hash ? 'Esperando confirmación en wallet...' : 'Confirmando transacción en blockchain...'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Hash de transacción */}
                    {hash && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Transacción Enviada
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Hash:</span>
                            <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                              {hash.slice(0, 20)}...{hash.slice(-20)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigator.clipboard.writeText(hash)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`https://scan.coredao.org/tx/${hash}`, '_blank')}
                              className="gap-2"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Ver en Explorer
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Estado de error */}
                    {error && (
                      <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Error en la Transacción</h4>
                            <div className="space-y-2">
                              <p className="text-sm text-red-700 dark:text-red-300">
                                {error.message.includes('User rejected') 
                                  ? '❌ Transacción cancelada por el usuario'
                                  : error.message.includes('insufficient funds')
                                  ? '💰 Fondos insuficientes para pagar la tarifa'
                                  : error.message.includes('Internal JSON-RPC error')
                                  ? '🔧 Error de contrato - Verifica que la dirección del contrato sea correcta'
                                  : error.message.includes('network')
                                  ? '🌐 Error de red - Verifica tu conexión a CoreDAO'
                                  : `⚠️ ${error.message}`
                                }
                              </p>
                              
                              {error.message.includes('Internal JSON-RPC error') && (
                                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200 dark:border-yellow-800">
                                  <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">💡 Posibles soluciones:</h5>
                                  <ul className="text-xs text-yellow-800 dark:text-yellow-200 space-y-1">
                                    <li>• Verifica que tengas suficiente CORE para la tarifa</li>
                                    <li>• Asegúrate de estar conectado a la red CoreDAO</li>
                                    <li>• El contrato podría estar pausado temporalmente</li>
                                    <li>• Intenta reducir el gas limit o aumentar el gas price</li>
                                  </ul>
                                </div>
                              )}
                              
                              <div className="flex gap-2 mt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setIsCreating(false)
                                    reset()
                                  }}
                                  className="gap-2"
                                >
                                  🔄 Intentar de Nuevo
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigator.clipboard.writeText(error.message)}
                                  className="gap-2"
                                >
                                  <Copy className="h-3 w-3" />
                                  Copiar Error
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Información adicional durante el proceso */}
                    {isCreating && !error && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <h5 className="font-medium mb-2">ℹ️ Información:</h5>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• La transacción puede tardar unos minutos en confirmarse</li>
                          <li>• No cierres esta ventana hasta que se complete</li>
                          <li>• Si la transacción falla, puedes intentar de nuevo</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Button 
            onClick={handleNext} 
            disabled={!isConnected}
            className="gap-2"
          >
            Siguiente
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}