import { useState } from "react"
import { ArrowLeft, Activity, MessageSquare, Wallet, Zap, Send, Download } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const mockLogs = [
  { id: 1, timestamp: "2024-01-20 14:30:25", type: "info", message: "Agent started successfully", agent: "Trading Bot Alpha" },
  { id: 2, timestamp: "2024-01-20 14:30:27", type: "activity", message: "Analyzing DEX prices on CoreDao", agent: "Trading Bot Alpha" },
  { id: 3, timestamp: "2024-01-20 14:30:30", type: "transaction", message: "Executed swap: 10 CORE -> 150 USDT", agent: "Trading Bot Alpha" },
  { id: 4, timestamp: "2024-01-20 14:30:45", type: "error", message: "Rate limit exceeded for OpenAI API", agent: "Analytics Agent" },
  { id: 5, timestamp: "2024-01-20 14:31:00", type: "warning", message: "High gas fees detected: 0.05 CORE", agent: "Trading Bot Alpha" },
]

const mockMessages = [
  { id: 1, timestamp: "14:30:25", sender: "user", content: "Check current CORE price" },
  { id: 2, timestamp: "14:30:27", sender: "agent", content: "Current CORE price is $1.23. Volume: $2.5M (24h)" },
  { id: 3, timestamp: "14:30:30", sender: "user", content: "Execute buy order for 5 CORE" },
  { id: 4, timestamp: "14:30:32", sender: "agent", content: "Executing buy order... Transaction pending: 0x1234...abcd" },
]

const mockTransactions = [
  { id: 1, hash: "0x1234...abcd", type: "Swap", amount: "10 CORE", status: "confirmed", gas: "0.002", timestamp: "14:30:30" },
  { id: 2, hash: "0x5678...efgh", type: "Approve", amount: "∞ USDT", status: "confirmed", gas: "0.001", timestamp: "14:29:15" },
  { id: 3, hash: "0x9012...ijkl", type: "Transfer", amount: "50 USDT", status: "pending", gas: "0.0015", timestamp: "14:28:45" },
]

export default function Monitor() {
  const [testMessage, setTestMessage] = useState("")

  const handleSendMessage = () => {
    if (testMessage.trim()) {
      console.log("Sending test message:", testMessage)
      setTestMessage("")
    }
  }

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case "error": return "text-destructive"
      case "warning": return "text-warning"
      case "transaction": return "text-success"
      case "activity": return "text-primary"
      default: return "text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed": return <Badge variant="default" className="bg-success text-success-foreground">Confirmado</Badge>
      case "pending": return <Badge variant="secondary" className="bg-warning text-warning-foreground">Pendiente</Badge>
      case "failed": return <Badge variant="destructive">Fallido</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
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
          <h1 className="text-3xl font-bold text-foreground">Panel de Monitoreo</h1>
          <p className="text-muted-foreground">
            Monitorea actividad y logs en tiempo real
          </p>
        </div>
      </div>

      {/* Agent Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Agente Activo: Trading Bot Alpha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant="default" className="bg-success text-success-foreground">Activo</Badge>
            <span className="text-sm text-muted-foreground">Uptime: 2d 14h 30m</span>
            <span className="text-sm text-muted-foreground">Tokens: 45,670</span>
            <span className="text-sm text-muted-foreground">Gas: 0.0234 CORE</span>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Tabs */}
      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logs" className="gap-2">
            <Activity className="h-4 w-4" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Mensajes
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-2">
            <Wallet className="h-4 w-4" />
            Blockchain
          </TabsTrigger>
          <TabsTrigger value="test" className="gap-2">
            <Send className="h-4 w-4" />
            Pruebas
          </TabsTrigger>
        </TabsList>

        {/* Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Logs del Sistema</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {mockLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                      <div className="text-xs text-muted-foreground min-w-[80px]">
                        {log.timestamp.split(' ')[1]}
                      </div>
                      <div className={`text-xs font-medium min-w-[60px] ${getLogTypeColor(log.type)}`}>
                        {log.type.toUpperCase()}
                      </div>
                      <div className="flex-1 text-sm">
                        {log.message}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {log.agent}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Mensajes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {mockMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Blockchain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{tx.type}</span>
                        <span className="text-xs text-muted-foreground">{tx.hash}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm">{tx.amount}</span>
                        <span className="text-xs text-muted-foreground">Gas: {tx.gas} CORE</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{tx.timestamp}</span>
                      {getStatusBadge(tx.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Tab */}
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Mensaje de Prueba</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Escribe un mensaje para probar el agente..."
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} className="gap-2">
                    <Send className="h-4 w-4" />
                    Enviar
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" onClick={() => setTestMessage("¿Cuál es el precio actual de CORE?")}>
                    Consultar Precio
                  </Button>
                  <Button variant="outline" onClick={() => setTestMessage("Analiza las mejores oportunidades DeFi")}>
                    Análisis DeFi
                  </Button>
                  <Button variant="outline" onClick={() => setTestMessage("Ejecuta una operación de prueba")}>
                    Operación Prueba
                  </Button>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Comandos Útiles:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <code>/status</code> - Estado del agente</li>
                    <li>• <code>/balance</code> - Balance de wallet</li>
                    <li>• <code>/price [token]</code> - Precio de token</li>
                    <li>• <code>/stop</code> - Pausar agente</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}