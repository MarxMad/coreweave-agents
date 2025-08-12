import { useState } from "react"
import { ArrowLeft, Plus, Bot, Target, TrendingUp, Users, Settings, Play, Pause, Edit } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface Strategy {
  id: string
  name: string
  type: "marketing" | "trading" | "community" | "analytics"
  description: string
  status: "active" | "paused" | "draft"
  performance: number
  tokensUsed: number
  successRate: number
  lastActivity: string
  aiModel: string
}

const mockStrategies: Strategy[] = [
  {
    id: "1",
    name: "Viral Marketing Campaign",
    type: "marketing",
    description: "AI-driven viral content creation and social media engagement",
    status: "active",
    performance: 85,
    tokensUsed: 12450,
    successRate: 78,
    lastActivity: "2 min ago",
    aiModel: "GPT-4"
  },
  {
    id: "2",
    name: "DeFi Yield Optimization",
    type: "trading",
    description: "Automated yield farming and liquidity management strategy",
    status: "active",
    performance: 92,
    tokensUsed: 8930,
    successRate: 89,
    lastActivity: "5 min ago",
    aiModel: "Claude-3"
  },
  {
    id: "3",
    name: "Community Engagement Bot",
    type: "community",
    description: "24/7 community management and user engagement",
    status: "paused",
    performance: 67,
    tokensUsed: 15670,
    successRate: 72,
    lastActivity: "1 hour ago",
    aiModel: "Gemini Pro"
  },
  {
    id: "4",
    name: "Market Analysis Engine",
    type: "analytics",
    description: "Real-time market analysis and trend prediction",
    status: "active",
    performance: 94,
    tokensUsed: 6780,
    successRate: 91,
    lastActivity: "30 sec ago",
    aiModel: "GPT-4"
  }
]

const strategyTypeColors = {
  marketing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  trading: "bg-green-500/10 text-green-500 border-green-500/20",
  community: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  analytics: "bg-orange-500/10 text-orange-500 border-orange-500/20"
}

const strategyTypeIcons = {
  marketing: TrendingUp,
  trading: Target,
  community: Users,
  analytics: Bot
}

export default function Strategies() {
  const [strategies, setStrategies] = useState<Strategy[]>(mockStrategies)
  const [activeTab, setActiveTab] = useState("all")

  const handleToggleStatus = (id: string) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === id 
        ? { 
            ...strategy, 
            status: strategy.status === "active" ? "paused" : "active" as const 
          }
        : strategy
    ))
  }

  const handleEdit = (id: string) => {
    console.log("Edit strategy:", id)
  }

  const handleDelete = (id: string) => {
    setStrategies(prev => prev.filter(strategy => strategy.id !== id))
  }

  const filteredStrategies = strategies.filter(strategy => {
    if (activeTab === "all") return true
    return strategy.type === activeTab
  })

  const activeStrategies = strategies.filter(s => s.status === "active").length
  const totalTokensUsed = strategies.reduce((sum, s) => sum + s.tokensUsed, 0)
  const avgSuccessRate = strategies.reduce((sum, s) => sum + s.successRate, 0) / strategies.length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-success text-success-foreground">Active</Badge>
      case "paused": return <Badge variant="secondary">Paused</Badge>
      case "draft": return <Badge variant="outline">Draft</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

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
            <h1 className="text-3xl font-bold text-foreground">AI Strategies</h1>
          </div>
          <p className="text-muted-foreground">
            Manage and optimize your AI-powered strategies
          </p>
        </div>
        
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Create New Strategy
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
            <Bot className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStrategies}</div>
            <p className="text-xs text-muted-foreground">Running now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Strategies</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{strategies.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTokensUsed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStrategies.map((strategy) => {
              const IconComponent = strategyTypeIcons[strategy.type]
              return (
                <Card key={strategy.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${strategyTypeColors[strategy.type]}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{strategy.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {strategy.description}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(strategy.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Performance</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={strategy.performance} className="flex-1 h-2" />
                          <span className="font-medium">{strategy.performance}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success Rate</span>
                        <div className="font-medium mt-1">{strategy.successRate}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tokens Used</span>
                        <div className="font-medium mt-1">{strategy.tokensUsed.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">AI Model</span>
                        <div className="font-medium mt-1">{strategy.aiModel}</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Last activity: {strategy.lastActivity}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(strategy.id)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant={strategy.status === "active" ? "secondary" : "default"}
                        size="sm"
                        onClick={() => handleToggleStatus(strategy.id)}
                        className="flex-1"
                      >
                        {strategy.status === "active" ? (
                          <><Pause className="h-4 w-4 mr-1" />Pause</>
                        ) : (
                          <><Play className="h-4 w-4 mr-1" />Start</>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredStrategies.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">
                    No strategies found for this category
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Strategy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}