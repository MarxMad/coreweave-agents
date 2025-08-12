import { useState } from "react"
import { Plus, Bot, Activity, TrendingUp, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AgentCard, Agent } from "@/components/agent-card"
import { Badge } from "@/components/ui/badge"
import { WalletInfo } from "@/components/wallet-info"

// Mock data
const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Trading Bot Alpha",
    template: "DeFi Trading Assistant",
    provider: "OpenAI GPT-4",
    status: "active",
    lastActivity: "2 min ago",
    tokensUsed: 45670,
    gasUsed: 0.0234,
    uptime: "2d 14h"
  },
  {
    id: "2", 
    name: "Analytics Agent",
    template: "Market Research",
    provider: "Gemini Pro",
    status: "paused",
    lastActivity: "1h ago",
    tokensUsed: 12450,
    gasUsed: 0.0089,
    uptime: "5d 8h"
  },
  {
    id: "3",
    name: "Security Monitor",
    template: "Smart Contract Auditor",
    provider: "Claude-3",
    status: "stopped",
    lastActivity: "Yesterday",
    tokensUsed: 8930,
    gasUsed: 0.0156,
    uptime: "0m"
  }
]

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)

  const handleToggleStatus = (id: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === id 
        ? { ...agent, status: agent.status === "active" ? "paused" : "active" as const }
        : agent
    ))
  }

  const handleEdit = (id: string) => {
    console.log("Edit agent:", id)
  }

  const handleDelete = (id: string) => {
    setAgents(prev => prev.filter(agent => agent.id !== id))
  }

  const handleMonitor = (id: string) => {
    console.log("Monitor agent:", id)
  }

  const activeAgents = agents.filter(a => a.status === "active").length
  const totalAgents = agents.length
  const totalTokens = agents.reduce((sum, a) => sum + a.tokensUsed, 0)
  const totalGas = agents.reduce((sum, a) => sum + a.gasUsed, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/CorewL.png" 
              alt="CoreWeave Logo" 
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Manage and monitor your AI agents on CoreDao
          </p>
        </div>
        
        <Link to="/create">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Launch New Agent
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeAgents}</div>
            <p className="text-xs text-muted-foreground">of {totalAgents} agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activity</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">tokens processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gas Used</CardTitle>
            <Zap className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGas.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground">CORE en gas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+12.5%</div>
            <p className="text-xs text-muted-foreground">vs. last week</p>
          </CardContent>
        </Card>
        
        <WalletInfo />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link to="/create">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Agent
              </Button>
            </Link>
            <Link to="/monitor">
              <Button variant="outline" className="gap-2">
                <Activity className="h-4 w-4" />
                View Logs
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Agents Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Agents</h2>
          <div className="flex gap-2">
            <Badge variant="outline">{totalAgents} Total</Badge>
            <Badge variant="default">{activeAgents} Active</Badge>
          </div>
        </div>

        {agents.length === 0 ? (
          <Card className="p-12 text-center">
            <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">You don't have any agents yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI agent to start automating tasks on CoreDao
            </p>
            <Link to="/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Agent
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMonitor={handleMonitor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}