import { useState, useMemo } from "react"
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, RefreshCw, Bot, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAIAgentManager } from "@/hooks/use-ai-agent-manager"
import { useCoreWeaveToken } from "@/hooks/use-core-weave-token"
import { useWallet } from "@/hooks/use-wallet"

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("7d")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { isConnected } = useWallet()
  const { agents, isLoading: agentsLoading, refetch: refetchAgents } = useAIAgentManager()
  const { tokens, isLoading: tokensLoading } = useCoreWeaveToken()

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

  // Calculate analytics from real data
  const analytics = useMemo(() => {
    const activeAgents = agents?.filter(agent => agent.isActive).length || 0
    const totalAgents = agents?.length || 0
    const totalTokens = tokens?.length || 0
    
    // Mock calculations for demonstration (would be real calculations in production)
    const totalVolume = totalTokens * 125000 // Simulated volume per token
    const totalUsers = totalTokens * 850 // Simulated users per token
    const avgPerformance = activeAgents > 0 ? (activeAgents / totalAgents) * 100 : 0
    
    return {
      totalVolume,
      totalUsers,
      activeAgents,
      totalAgents,
      totalTokens,
      avgPerformance,
      volumeChange: 12.5,
      usersChange: 8.3,
      agentsChange: activeAgents > 0 ? 15.2 : -5.1,
      performanceChange: avgPerformance > 80 ? 3.7 : -2.1
    }
  }, [agents, tokens])

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
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          </div>
          <p className="text-muted-foreground">
            Performance metrics and analysis of your agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agentsLoading || tokensLoading ? 'Loading...' : `$${(analytics.totalVolume / 1000000).toFixed(1)}M`}
            </div>
            <div className="flex items-center text-xs">
              {analytics.volumeChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.volumeChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                {analytics.volumeChange >= 0 ? '+' : ''}{analytics.volumeChange}%
              </span>
              <span className="text-muted-foreground ml-1">vs last {timeframe}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agentsLoading || tokensLoading ? 'Loading...' : analytics.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center text-xs">
              {analytics.usersChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.usersChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                {analytics.usersChange >= 0 ? '+' : ''}{analytics.usersChange}%
              </span>
              <span className="text-muted-foreground ml-1">vs last {timeframe}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agentsLoading ? 'Loading...' : `${analytics.activeAgents}/${analytics.totalAgents}`}
            </div>
            <div className="flex items-center text-xs">
              {analytics.agentsChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.agentsChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                {analytics.agentsChange >= 0 ? '+' : ''}{analytics.agentsChange}%
              </span>
              <span className="text-muted-foreground ml-1">vs last {timeframe}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agentsLoading ? 'Loading...' : `${analytics.avgPerformance.toFixed(1)}%`}
            </div>
            <div className="flex items-center text-xs">
              {analytics.performanceChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.performanceChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                {analytics.performanceChange >= 0 ? '+' : ''}{analytics.performanceChange}%
              </span>
              <span className="text-muted-foreground ml-1">vs last {timeframe}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground">Performance chart to be implemented</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents && agents.length > 0 ? (
                    agents.map((agent, index) => {
                      const performance = agent.isActive ? 85 + Math.random() * 15 : 0
                      const change = agent.isActive ? -5 + Math.random() * 15 : -10
                      return (
                        <div key={agent.tokenAddress} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              agent.isActive ? "bg-green-500" : "bg-red-500"
                            }`} />
                            <div>
                              <p className="font-medium">{agent.name || `Agent ${index + 1}`}</p>
                              <p className="text-sm text-muted-foreground">
                                {agent.tokenAddress.slice(0, 6)}...{agent.tokenAddress.slice(-4)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold">{performance.toFixed(1)}%</span>
                              {change >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {change >= 0 ? "+" : ""}{change.toFixed(1)}% this {timeframe}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {isConnected ? 'No AI agents found' : 'Connect wallet to view agents'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Token Usage by Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">Token usage chart to be implemented</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">Cost analysis to be implemented</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}