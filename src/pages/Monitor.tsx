import { useState, useEffect } from "react"
import { ArrowLeft, Activity, MessageSquare, Wallet, Zap, Send, Download, RefreshCw } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAIAgentManager } from "@/hooks/use-ai-agent-manager"
import { useCoreWeaveToken } from "@/hooks/use-core-weave-token"
import { useWallet } from "@/hooks/use-wallet"
import { formatTokenAmount } from "@/lib/contracts"

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
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { isConnected } = useWallet()
  const { agents, isLoading: agentsLoading, refetch: refetchAgents } = useAIAgentManager()
  const { tokens, isLoading: tokensLoading } = useCoreWeaveToken()

  const handleSendMessage = () => {
    if (testMessage.trim()) {
      console.log("Sending test message:", testMessage)
      setTestMessage("")
    }
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetchAgents()
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Calculate real-time stats from agents and tokens
  const activeAgents = agents?.filter(agent => agent.isActive).length || 0
  const totalAgents = agents?.length || 0
  const systemHealth = totalAgents > 0 ? (activeAgents / totalAgents) * 100 : 0
  
  // Generate activity logs from agent data
  const activityLogs = agents?.slice(0, 10).map((agent, index) => ({
    id: index + 1,
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    type: agent.isActive ? "info" : "warning",
    message: agent.isActive 
      ? `Agent started successfully`
      : `Agent is currently inactive`,
    agent: `Agent ${agent.name || 'Unknown'}`
  })) || mockLogs

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
      case "confirmed": return <Badge variant="default" className="bg-success text-success-foreground">Confirmed</Badge>
      case "pending": return <Badge variant="secondary" className="bg-warning text-warning-foreground">Pending</Badge>
      case "failed": return <Badge variant="destructive">Failed</Badge>
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
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/CorewL.png" 
              alt="CoreWeave Logo" 
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-3xl font-bold text-foreground">Monitoring Panel</h1>
          </div>
          <p className="text-muted-foreground">
            Monitor activity and logs in real time
          </p>
        </div>
      </div>

      {/* Agent Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="ml-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={isConnected ? "default" : "secondary"} className={isConnected ? "bg-success text-success-foreground" : ""}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            <span className="text-sm text-muted-foreground">Active Agents: {activeAgents}/{totalAgents}</span>
            <span className="text-sm text-muted-foreground">Tokens: {tokens?.length || 0}</span>
            <span className="text-sm text-muted-foreground">Health: {systemHealth.toFixed(1)}%</span>
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
            Messages
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-2">
            <Wallet className="h-4 w-4" />
            Blockchain
          </TabsTrigger>
          <TabsTrigger value="test" className="gap-2">
            <Send className="h-4 w-4" />
            Tests
          </TabsTrigger>
        </TabsList>

        {/* Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>System Logs</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                      <div className="text-xs text-muted-foreground min-w-[80px]">
                        {new Date(log.timestamp).toLocaleTimeString()}
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
                  {activityLogs.length === 0 && (
                    <div className="text-center py-8">
                      <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {isConnected ? 'No activity logs available' : 'Connect wallet to view activity'}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Message History</CardTitle>
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
              <CardTitle>Blockchain Activity</CardTitle>
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
              <CardTitle>Send Test Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Write a message to test the agent..."
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} className="gap-2">
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" onClick={() => setTestMessage("What is the current CORE price?")}>
                    Check Price
                  </Button>
                  <Button variant="outline" onClick={() => setTestMessage("Analyze the best DeFi opportunities")}>
                    DeFi Analysis
                  </Button>
                  <Button variant="outline" onClick={() => setTestMessage("Execute a test operation")}>
                    Test Operation
                  </Button>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Useful Commands:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <code>/status</code> - Agent status</li>
                    <li>• <code>/balance</code> - Wallet balance</li>
                    <li>• <code>/price [token]</code> - Token price</li>
                    <li>• <code>/stop</code> - Pause agent</li>
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