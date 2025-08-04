import { useState } from "react"
import { ArrowLeft, Bot, Brain, Wallet, Settings, Save } from "lucide-react"
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

const templates = [
  { id: "trading", name: "DeFi Trading Bot", description: "Automatiza trading en DEXs" },
  { id: "analytics", name: "Market Analyst", description: "Análisis de mercado y datos" },
  { id: "security", name: "Security Monitor", description: "Monitoreo de contratos inteligentes" },
  { id: "defi", name: "DeFi Manager", description: "Gestión de protocolos DeFi" },
  { id: "custom", name: "Personalizado", description: "Configura desde cero" }
]

const providers = [
  { id: "openai", name: "OpenAI", models: ["GPT-4", "GPT-3.5-turbo"] },
  { id: "gemini", name: "Google Gemini", models: ["Gemini Pro", "Gemini Ultra"] },
  { id: "claude", name: "Anthropic Claude", models: ["Claude-3", "Claude-2"] },
  { id: "custom", name: "Custom API", models: ["Personalizado"] }
]

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
          <h1 className="text-3xl font-bold text-foreground">Crear Nuevo Agente</h1>
          <p className="text-muted-foreground">
            Configura un agente de IA autónomo para CoreDao
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Agente</Label>
                <Input
                  id="name"
                  placeholder="ej. Trading Bot Alpha"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template">Plantilla</Label>
                <Select value={formData.template} onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una plantilla" />
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
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe el propósito y funcionalidad de tu agente..."
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
              Configuración de IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Proveedor de IA</Label>
                <Select value={formData.provider} onValueChange={handleProviderChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un proveedor" />
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
                  <Label htmlFor="model">Modelo</Label>
                  <Select value={formData.model} onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un modelo" />
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
                <Label htmlFor="temperature">Temperatura</Label>
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
                <Label htmlFor="gasLimit">Límite de Gas (CORE)</Label>
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
              <Label htmlFor="systemPrompt">Prompt del Sistema</Label>
              <Textarea
                id="systemPrompt"
                placeholder="Define el comportamiento y personalidad del agente..."
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
              Configuración de Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Conectar Wallet CoreDao</Label>
                <p className="text-sm text-muted-foreground">
                  Permite al agente interactuar con contratos inteligentes
                </p>
              </div>
              <Switch
                checked={formData.walletConnect}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, walletConnect: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Trading Automático</Label>
                <p className="text-sm text-muted-foreground">
                  Permite al agente ejecutar transacciones automáticamente
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
                    Precaución
                  </Badge>
                </div>
                <p className="text-sm text-warning-foreground">
                  El trading automático puede resultar en pérdidas. Asegúrate de configurar límites apropiados.
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
              Configuración Avanzada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Permisos de Ejecución</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="read-only" />
                    <Label htmlFor="read-only" className="text-sm">Solo lectura</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="limited-tx" />
                    <Label htmlFor="limited-tx" className="text-sm">Transacciones limitadas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="full-access" />
                    <Label htmlFor="full-access" className="text-sm">Acceso completo</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Programación</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="continuous" defaultChecked />
                    <Label htmlFor="continuous" className="text-sm">Ejecutar continuamente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="scheduled" />
                    <Label htmlFor="scheduled" className="text-sm">Programar horarios</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="triggered" />
                    <Label htmlFor="triggered" className="text-sm">Solo por eventos</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4 justify-end">
          <Link to="/">
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Crear Agente
          </Button>
        </div>
      </form>
    </div>
  )
}