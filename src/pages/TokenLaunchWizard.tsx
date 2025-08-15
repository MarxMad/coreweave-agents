import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Rocket, Bot, Target, CheckCircle, AlertTriangle, Share2, Wallet } from "lucide-react"
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
  const { createToken, creationFee, isLoading, isSuccess, hash, error } = useCoreWeaveTokenFactory()
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
    if (isSuccess && hash && isCreating) {
      console.log('Transacción exitosa:', { hash, isSuccess })
      setLaunchData({
        transactionHash: hash,
        tokenName: formData.name,
        tokenSymbol: formData.symbol
      })
      setShowConfirmation(true)
      setIsCreating(false)
    }
  }, [isSuccess, hash, isCreating, formData.name, formData.symbol])

  // Timeout para evitar que se quede colgado indefinidamente
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    if (isCreating) {
      console.log('Iniciando timeout de 5 minutos para creación de token')
      timeoutId = setTimeout(() => {
        console.log('Timeout alcanzado, deteniendo creación')
        setIsCreating(false)
        // Mostrar mensaje de error por timeout
      }, 5 * 60 * 1000) // 5 minutos
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isCreating])

  // Log de estados para debugging
  useEffect(() => {
    console.log('Estados de transacción:', {
      isLoading,
      isSuccess,
      hash,
      isCreating,
      error: error?.message
    })
  }, [isLoading, isSuccess, hash, isCreating, error])

  const handleLaunchToken = async () => {
    if (!isConnected || !isCoreDaoChain) {
      return
    }

    setIsCreating(true)
    try {
      // Determinar si se habilitan agentes AI
      const enableAIAgents = formData.selectedAgents.length > 0 || formData.enableAIAgents

      await createToken({
        name: formData.name,
        symbol: formData.symbol,
        totalSupply: formData.totalSupply,
        enableAIAgents
      })
    } catch (error) {
      console.error('Error creating token:', error)
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
      <TokenLaunchConfirmation
        transactionHash={launchData.transactionHash}
        tokenName={launchData.tokenName}
        tokenSymbol={launchData.tokenSymbol}
        onGoToDashboard={handleGoToDashboard}
        onCreateAnother={handleCreateAnother}
      />
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
            <Button 
              onClick={handleLaunchToken}
              disabled={!isConnected || !isCoreDaoChain || isCreating || !formData.name || !formData.symbol}
              className="gap-2"
            >
              <Rocket className="h-4 w-4" />
              {isCreating ? 'Creando Token...' : 'Lanzar Token'}
            </Button>
            {isCreating && (
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span>Procesando transacción...</span>
                </div>
                {hash && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Hash: </span>
                    <span className="font-mono">{hash.slice(0, 10)}...{hash.slice(-8)}</span>
                  </div>
                )}
              </div>
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