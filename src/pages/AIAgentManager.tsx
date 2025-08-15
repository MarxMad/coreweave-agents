import { useState, useEffect } from "react"
import { Bot, Plus, Settings, ToggleLeft, ToggleRight, Wallet, Clock, DollarSign, CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAIAgentManager } from "@/hooks/use-ai-agent-manager"
import { useWallet } from "@/hooks/use-wallet"
import { formatTokenAmount } from "@/lib/utils"
import { formatEther } from "viem"

const agentTypes = [
  {
    id: "community-manager",
    name: "Community Manager",
    description: "Manages community interactions and engagement",
    icon: "👥",
    features: ["Auto-responses", "Moderation", "Event management"]
  },
  {
    id: "marketing-ai",
    name: "Marketing AI",
    description: "Automated marketing campaigns and promotion",
    icon: "📢",
    features: ["Social media posts", "Influencer outreach", "Trend analysis"]
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description: "Market analysis and performance metrics",
    icon: "📊",
    features: ["Performance reports", "Market insights", "Predictive analysis"]
  },
  {
    id: "trading-assistant",
    name: "Trading Assistant",
    description: "Trading support and liquidity management",
    icon: "💹",
    features: ["Market making", "Arbitrage detection", "Price alerts"]
  }
]

// Function to get configuration examples based on agent type
const getConfigurationExample = (agentType: string) => {
  const examples = {
    'community-manager': `{
  "autoMode": true,
  "responseTime": "fast",
  "language": "es",
  "moderationLevel": "medium",
  "welcomeMessage": "¡Bienvenido a nuestra comunidad!",
  "workingHours": "24/7"
}`,
    'marketing-ai': `{
  "platforms": ["twitter", "telegram"],
  "postFrequency": "daily",
  "contentStyle": "engaging",
  "hashtags": ["#crypto", "#defi"],
  "targetAudience": "crypto-enthusiasts"
}`,
    'data-analyst': `{
  "reportFrequency": "weekly",
  "metrics": ["price", "volume", "holders"],
  "alertThresholds": {
    "priceChange": 10,
    "volumeSpike": 50
  },
  "dashboardEnabled": true
}`,
    'trading-assistant': `{
  "strategy": "market-making",
  "riskLevel": "medium",
  "maxSlippage": 2,
  "minLiquidity": 1000,
  "tradingPairs": ["CORE/ETH"]
}`
  }
  return examples[agentType as keyof typeof examples] || `{
  "autoMode": true,
  "responseTime": "fast",
  "language": "es"
}`
}

export default function AIAgentManager() {
  const { isConnected, address } = useWallet()
  const {
    createAgent,
    authorizeToken,
    toggleAgent,
    getTokenAgents,
    isTokenAuthorized,
    getAgent,
    isLoading,
    isSuccess,
    error,
    hash
  } = useAIAgentManager()

  const [agents, setAgents] = useState<any[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [selectedTab, setSelectedTab] = useState<'create' | 'manage'>('create')
  const [formData, setFormData] = useState({
    tokenContract: '',
    agentType: '',
    budget: '',
    configuration: ''
  })

  const [tokenToAuthorize, setTokenToAuthorize] = useState('')

  // Handle transaction status updates
  useEffect(() => {
    if (isLoading) {
      setTransactionStatus('pending')
    } else if (isSuccess) {
      setTransactionStatus('success')
      // Auto-hide success message after 5 seconds
      setTimeout(() => setTransactionStatus('idle'), 5000)
    } else if (error) {
      setTransactionStatus('error')
      // Auto-hide error message after 8 seconds
      setTimeout(() => setTransactionStatus('idle'), 8000)
    }
  }, [isLoading, isSuccess, error])

  // Load agents when component mounts or when success state changes
  useEffect(() => {
    if (isSuccess) {
      // Reload agents after successful transaction
      setTimeout(() => {
        loadAgents()
        setIsCreateDialogOpen(false)
        setFormData({
          tokenContract: '',
          agentType: '',
          budget: '',
          configuration: ''
        })
        // Switch to manage tab to show the created agents
        setSelectedTab('manage')
      }, 2000) // Wait for transaction to be mined
    }
  }, [isSuccess])

  const loadAgents = () => {
    if (formData.tokenContract) {
      const result = getTokenAgents(formData.tokenContract)
      if (result.data) {
        setAgents([...result.data])
      }
    }
  }

  const handleCreateAgent = async () => {
    if (!formData.tokenContract || !formData.agentType || !formData.budget) {
      return
    }

    // Use provided configuration or default based on agent type
    let configuration = formData.configuration
    if (!configuration.trim()) {
      // Parse the example to get a proper JSON object
      const example = getConfigurationExample(formData.agentType)
      try {
        JSON.parse(example) // Validate it's valid JSON
        configuration = example
      } catch {
        configuration = JSON.stringify({
          autoMode: true,
          responseTime: 'fast',
          language: 'es'
        })
      }
    }

    await createAgent({
      tokenContract: formData.tokenContract,
      agentType: formData.agentType,
      budget: formData.budget,
      configuration
    })
  }

  const handleAuthorizeToken = async () => {
    if (!tokenToAuthorize) return
    await authorizeToken(tokenToAuthorize)
  }

  const handleToggleAgent = async (agentId: string) => {
    await toggleAgent(agentId)
    // Reload agents after toggle
    setTimeout(() => loadAgents(), 2000)
  }

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString()
  }

  // Function to get blockchain explorer URL
  const getExplorerUrl = (txHash: string) => {
    // CoreDAO blockchain explorer
    return `https://scan.coredao.org/tx/${txHash}`
  }

  // Function to render transaction status alerts
  const renderTransactionStatus = () => {
    if (transactionStatus === 'idle') return null

    switch (transactionStatus) {
      case 'pending':
        return (
          <Alert className="mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Transacción pendiente... Por favor espera mientras se confirma en la blockchain.
            </AlertDescription>
          </Alert>
        )
      case 'success':
        return (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ¡Transacción exitosa! El agente ha sido creado correctamente.
              {hash && (
                <a
                  href={getExplorerUrl(hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 inline-flex items-center gap-1 text-green-600 hover:text-green-800 underline"
                >
                  Ver en explorador <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </AlertDescription>
          </Alert>
        )
      case 'error':
        return (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Error en la transacción: {error?.message || 'Error desconocido'}
              {hash && (
                <a
                  href={getExplorerUrl(hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 inline-flex items-center gap-1 text-red-600 hover:text-red-800 underline"
                >
                  Ver en explorador <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </AlertDescription>
          </Alert>
        )
      default:
        return null
    }
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
              <p className="text-muted-foreground">
                Please connect your wallet to manage AI agents
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Transaction Status Alert */}
      {renderTransactionStatus()}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Agent Manager</h1>
          <p className="text-muted-foreground">
            Create and manage AI agents for your tokens
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={transactionStatus === 'pending'}>
              <Plus className="h-4 w-4" />
              Create Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Create New AI Agent</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
              {/* Transaction Status in Dialog */}
              {renderTransactionStatus()}

              {/* Token Contract */}
              <div className="space-y-2">
                <Label htmlFor="tokenContract">Token Contract Address</Label>
                <Input
                  id="tokenContract"
                  placeholder="0x..."
                  value={formData.tokenContract}
                  onChange={(e) => setFormData(prev => ({ ...prev, tokenContract: e.target.value }))}
                  disabled={transactionStatus === 'pending'}
                />
              </div>

              {/* Agent Type */}
              <div className="space-y-2">
                <Label htmlFor="agentType">Agent Type</Label>
                <Select
                  value={formData.agentType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, agentType: value }))}
                  disabled={transactionStatus === 'pending'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent type" />
                  </SelectTrigger>
                  <SelectContent>
                    {agentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (CORE)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="100"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  disabled={transactionStatus === 'pending'}
                />
              </div>

              {/* Configuration */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="configuration">Configuration (JSON)</Label>
                  {formData.agentType && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        configuration: getConfigurationExample(formData.agentType) 
                      }))}
                      disabled={transactionStatus === 'pending'}
                    >
                      Usar Ejemplo
                    </Button>
                  )}
                </div>
                <Textarea
                  id="configuration"
                  placeholder={getConfigurationExample(formData.agentType)}
                  value={formData.configuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, configuration: e.target.value }))}
                  rows={8}
                  disabled={transactionStatus === 'pending'}
                />
                <p className="text-xs text-muted-foreground">
                  Configuración JSON para el agente. Puedes usar el ejemplo o crear tu propia configuración. Deja vacío para usar configuración por defecto.
                </p>
              </div>

              {/* Agent Type Info */}
              {formData.agentType && (
                <Card>
                  <CardContent className="pt-4">
                    {(() => {
                      const selectedType = agentTypes.find(t => t.id === formData.agentType)
                      return selectedType ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{selectedType.icon}</span>
                            <h4 className="font-semibold">{selectedType.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{selectedType.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedType.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null
                    })()} 
                  </CardContent>
                </Card>
              )}

            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={transactionStatus === 'pending'}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateAgent}
                disabled={transactionStatus === 'pending' || !formData.tokenContract || !formData.agentType || !formData.budget}
              >
                {transactionStatus === 'pending' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Agent'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'create' | 'manage')} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Agent
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Manage Agents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          {/* Token Authorization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Token Authorization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Token contract address to authorize"
                  value={tokenToAuthorize}
                  onChange={(e) => setTokenToAuthorize(e.target.value)}
                  className="flex-1"
                  disabled={transactionStatus === 'pending'}
                />
                <Button
                  onClick={handleAuthorizeToken}
                  disabled={transactionStatus === 'pending' || !tokenToAuthorize}
                >
                  {transactionStatus === 'pending' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Authorizing...
                    </>
                  ) : (
                    'Authorize'
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Authorize a token contract to create agents for it
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          {/* Load Agents Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Manage Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Token contract address to load agents"
                  value={formData.tokenContract}
                  onChange={(e) => setFormData(prev => ({ ...prev, tokenContract: e.target.value }))}
                  className="flex-1"
                  disabled={transactionStatus === 'pending'}
                />
                <Button
                  onClick={loadAgents}
                  disabled={!formData.tokenContract || transactionStatus === 'pending'}
                >
                  Load Agents
                </Button>
              </div>

              {/* Agents List */}
              {agents.length > 0 ? (
                <div className="grid gap-4">
                  {agents.map((agent, index) => {
                    const agentType = agentTypes.find(t => t.id === agent.agentType) || {
                      name: agent.agentType,
                      icon: "🤖",
                      description: "Custom agent type"
                    }
                    
                    return (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{agentType.icon}</span>
                              <div>
                                <h4 className="font-semibold">{agentType.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  ID: {agent.agentId.slice(0, 10)}...
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={agent.isActive ? "default" : "secondary"}>
                                {agent.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleAgent(agent.agentId)}
                                disabled={transactionStatus === 'pending'}
                              >
                                {agent.isActive ? (
                                  <ToggleRight className="h-4 w-4" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          <Separator className="my-3" />
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>Budget: {formatEther(agent.budget)} CORE</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Created: {formatDate(agent.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Bot className="h-4 w-4 text-muted-foreground" />
                              <span>Owner: {agent.owner.slice(0, 6)}...{agent.owner.slice(-4)}</span>
                            </div>
                          </div>
                          
                          {agent.configuration && (
                            <div className="mt-3">
                              <Label className="text-xs text-muted-foreground">Configuration:</Label>
                              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(JSON.parse(agent.configuration), null, 2)}
                              </pre>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : formData.tokenContract ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bot className="h-12 w-12 mx-auto mb-4" />
                  <p>No agents found for this token</p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bot className="h-12 w-12 mx-auto mb-4" />
                  <p>Enter a token contract address to load agents</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}