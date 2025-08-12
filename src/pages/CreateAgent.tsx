import { useState } from "react"
import { ArrowLeft, Bot, Brain, Wallet, Settings, Save } from "lucide-react"
import { Link } from "react-router-dom"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnect } from "@/components/wallet-connect"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const templates = [
  { id: "trading", name: "DeFi Trading Bot", description: "Automate trading on DEXs" },
  { id: "analytics", name: "Market Analyst", description: "Market analysis and data" },
  { id: "security", name: "Security Monitor", description: "Smart contract monitoring" },
  { id: "defi", name: "DeFi Manager", description: "DeFi protocol management" },
  { id: "custom", name: "Custom", description: "Configure from scratch" }
]

const providers = [
  { id: "openai", name: "OpenAI", models: ["GPT-4", "GPT-3.5-turbo"] },
  { id: "gemini", name: "Google Gemini", models: ["Gemini Pro", "Gemini Ultra"] },
  { id: "claude", name: "Anthropic Claude", models: ["Claude-3", "Claude-2"] },
  { id: "custom", name: "Custom API", models: ["Custom"] }
]

function WalletConnectSection() {
  const { isConnected, address, isCoreDaoChain, balance } = useWallet();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex-1">
          {isConnected ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Wallet Connected</span>
                {!isCoreDaoChain && (
                  <Badge variant="destructive" className="text-xs">Wrong Network</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
              {balance && (
                <p className="text-xs text-muted-foreground">
                  Balance: {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm font-medium">No Wallet Connected</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Connect your wallet to enable agent blockchain interactions
              </p>
            </div>
          )}
        </div>
        <WalletConnect />
      </div>
      
      {isConnected && !isCoreDaoChain && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Please switch to CoreDAO network to enable full functionality.
          </p>
        </div>
      )}
    </div>
  );
}

export default function CreateAgent() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    template: "",
    provider: "",
    model: "",
    walletConnect: false,
    autoTrade: false,
    gasLimit: "0.1",
    maxTokens: "1000",
    temperature: "0.7",
    systemPrompt: ""
  })

  const [selectedProvider, setSelectedProvider] = useState<typeof providers[0] | null>(null)

  const handleProviderChange = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId)
    setSelectedProvider(provider || null)
    setFormData(prev => ({ ...prev, provider: providerId, model: "" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating agent:", formData)
    // Here would go the actual agent creation logic
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
        <div>
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/CorewL.png" 
              alt="CoreWeave Logo" 
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-3xl font-bold text-foreground">Create New Agent</h1>
          </div>
          <p className="text-muted-foreground">
            Configure an autonomous AI agent for CoreDao
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Trading Bot Alpha"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select value={formData.template} onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex flex-col">
                          <span>{template.name}</span>
                          <span className="text-xs text-muted-foreground">{template.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose and functionality of your agent..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Provider Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">AI Provider</Label>
                <Select value={formData.provider} onValueChange={handleProviderChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProvider && (
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select value={formData.model} onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProvider.models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  placeholder="1000"
                  value={formData.maxTokens}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxTokens: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  placeholder="0.7"
                  value={formData.temperature}
                  onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gasLimit">Gas Limit (CORE)</Label>
                <Input
                  id="gasLimit"
                  type="number"
                  step="0.01"
                  placeholder="0.1"
                  value={formData.gasLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, gasLimit: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                placeholder="Define the agent's behavior and personality..."
                value={formData.systemPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Wallet & Blockchain Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Connect CoreDao Wallet</Label>
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to allow the agent to interact with smart contracts
                </p>
              </div>
              <WalletConnectSection />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Trading</Label>
                <p className="text-sm text-muted-foreground">
                  Allows the agent to execute transactions automatically
                </p>
              </div>
              <Switch
                checked={formData.autoTrade}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoTrade: checked }))}
              />
            </div>

            {formData.autoTrade && (
              <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-warning border-warning">
                    Caution
                  </Badge>
                </div>
                <p className="text-sm text-warning-foreground">
                  Automatic trading can result in losses. Make sure to set appropriate limits.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Execution Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="read-only" />
                    <Label htmlFor="read-only" className="text-sm">Read only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="limited-tx" />
                    <Label htmlFor="limited-tx" className="text-sm">Limited transactions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="full-access" />
                    <Label htmlFor="full-access" className="text-sm">Full access</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Scheduling</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="continuous" defaultChecked />
                    <Label htmlFor="continuous" className="text-sm">Run continuously</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="scheduled" />
                    <Label htmlFor="scheduled" className="text-sm">Schedule times</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="triggered" />
                    <Label htmlFor="triggered" className="text-sm">Event-triggered only</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4 justify-end">
          <Link to="/">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Create Agent
          </Button>
        </div>
      </form>
    </div>
  )
}