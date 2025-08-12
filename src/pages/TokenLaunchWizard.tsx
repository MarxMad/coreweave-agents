import { useState } from "react"
import { ArrowLeft, ArrowRight, Rocket, Bot, Target, CheckCircle, AlertTriangle, Share2 } from "lucide-react"
import { Link } from "react-router-dom"
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
import { useWallet } from "@/hooks/use-wallet"
import { switchChain } from '@wagmi/core'
import { config } from '@/lib/wagmi'
import SocialMediaIntegration from "@/components/social-media-integration"

const steps = [
  { id: 1, title: "Token Configuration", icon: Rocket },
  { id: 2, title: "Social Media", icon: Share2 },
  { id: 3, title: "AI Agents", icon: Bot },
  { id: 4, title: "Marketing Strategies", icon: Target },
  { id: 5, title: "Confirmation", icon: CheckCircle },
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
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Token Config
    name: "",
    symbol: "",
    description: "",
    totalSupply: "",
    initialPrice: "",
    liquidityPercent: "50",
    
    // Step 2: Social Media
    connectedAccounts: [] as any[],
    
    // Step 3: AI Agents
    selectedAgents: [] as string[],
    agentBudget: "100",
    autoMode: true,
    
    // Step 4: Marketing
    strategy: "",
    channels: [] as string[],
    budget: "500",
    duration: "30",
    
    // Custom prompts
    communityTone: "",
    marketingStyle: "",
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

  const handleChannelToggle = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }))
  }

  const progress = (currentStep / steps.length) * 100

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supply">Total Supply</Label>
                <Input
                  id="supply"
                  placeholder="1000000"
                  value={formData.totalSupply}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalSupply: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Initial Price (CORE)</Label>
                <Input
                  id="price"
                  placeholder="0.001"
                  value={formData.initialPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, initialPrice: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="liquidity">Initial Liquidity (%)</Label>
                <Select value={formData.liquidityPercent} onValueChange={(value) => setFormData(prev => ({ ...prev, liquidityPercent: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30%</SelectItem>
                    <SelectItem value="50">50%</SelectItem>
                    <SelectItem value="70">70%</SelectItem>
                    <SelectItem value="90">90%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Social Media Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SocialMediaIntegration 
              onAccountsChange={(accounts) => setFormData(prev => ({ ...prev, connectedAccounts: accounts }))}
              connectedAccounts={formData.connectedAccounts}
            />
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Agent Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agentBudget">AI Budget (CORE/month)</Label>
                <Input
                  id="agentBudget"
                  placeholder="100"
                  value={formData.agentBudget}
                  onChange={(e) => setFormData(prev => ({ ...prev, agentBudget: e.target.value }))}
                />
              </div>

              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5">
                  <Label>Automatic Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Agents act autonomously
                  </p>
                </div>
                <Switch
                  checked={formData.autoMode}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoMode: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Marketing Strategies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Main Strategy</Label>
              <div className="grid grid-cols-1 gap-3">
                {marketingStrategies.map((strategy) => (
                  <div
                    key={strategy.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.strategy === strategy.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-border/80'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, strategy: strategy.id }))}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{strategy.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{strategy.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {strategy.tactics.map(tactic => (
                            <Badge key={tactic} variant="outline" className="text-xs">
                              {tactic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        formData.strategy === strategy.id
                          ? 'bg-primary border-primary'
                          : 'border-border'
                      }`}>
                        {formData.strategy === strategy.id && (
                          <div className="w-3 h-3 rounded-full bg-primary-foreground m-0.5" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Marketing Channels</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Twitter", "Discord", "Telegram", "Reddit", "YouTube", "TikTok"].map(channel => (
                  <div
                    key={channel}
                    className={`p-3 rounded-lg border-2 cursor-pointer text-center transition-all ${
                      formData.channels.includes(channel)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-border/80'
                    }`}
                    onClick={() => handleChannelToggle(channel)}
                  >
                    <span className="text-sm font-medium">{channel}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marketingBudget">Marketing Budget (CORE)</Label>
                <Input
                  id="marketingBudget"
                  placeholder="500"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Campaign Duration (days)</Label>
                <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Launch Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Token Configuration</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{formData.name || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Symbol:</span>
                    <span>{formData.symbol || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Supply:</span>
                    <span>{formData.totalSupply || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Initial price:</span>
                    <span>{formData.initialPrice || "Not specified"} CORE</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Selected AI Agents</h3>
                <div className="space-y-2">
                  {formData.selectedAgents.length > 0 ? (
                    formData.selectedAgents.map(agentId => {
                      const agent = aiAgentTemplates.find(a => a.id === agentId)
                      return (
                        <div key={agentId} className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-primary" />
                          <span className="text-sm">{agent?.name}</span>
                        </div>
                      )
                    })
                  ) : (
                    <span className="text-sm text-muted-foreground">No agents selected</span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="font-semibold mb-2">Cost Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Token launch:</span>
                  <span>0.1 CORE</span>
                </div>
                <div className="flex justify-between">
                  <span>AI agents (month):</span>
                  <span>{formData.agentBudget || "0"} CORE</span>
                </div>
                <div className="flex justify-between">
                  <span>Initial marketing:</span>
                  <span>{formData.budget || "0"} CORE</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Estimated total:</span>
                  <span>{(0.1 + parseFloat(formData.agentBudget || "0") + parseFloat(formData.budget || "0")).toFixed(2)} CORE</span>
                </div>
              </div>
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
          Previous
        </Button>

        {currentStep === steps.length ? (
          <Button className="gap-2">
            <Rocket className="h-4 w-4" />
            Launch Token
          </Button>
        ) : (
          <Button onClick={handleNext} className="gap-2">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}