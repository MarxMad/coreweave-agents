import { Rocket, TrendingUp, Users, Bot, MoreVertical, Eye, Play, Pause } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type TokenStatus = "launching" | "live" | "completed" | "paused"

export interface TokenLaunch {
  id: string
  name: string
  symbol: string
  description: string
  status: TokenStatus
  progress: number
  marketCap: string
  holders: number
  aiAgents: number
  socialScore: number
  launchDate: string
  creator: string
  image?: string
}

interface TokenCardProps {
  token: TokenLaunch
  onView: (id: string) => void
  onManage: (id: string) => void
  onToggleStatus: (id: string) => void
}

const statusConfig = {
  launching: {
    label: "Lanzando",
    variant: "default" as const,
    bgColor: "bg-primary/10",
    textColor: "text-primary",
    icon: Rocket
  },
  live: {
    label: "En Vivo", 
    variant: "default" as const,
    bgColor: "bg-success/10",
    textColor: "text-success",
    icon: TrendingUp
  },
  completed: {
    label: "Completado",
    variant: "secondary" as const,
    bgColor: "bg-muted",
    textColor: "text-muted-foreground",
    icon: TrendingUp
  },
  paused: {
    label: "Pausado",
    variant: "outline" as const,
    bgColor: "bg-warning/10",
    textColor: "text-warning",
    icon: Pause
  }
}

export function TokenCard({ token, onView, onManage, onToggleStatus }: TokenCardProps) {
  const config = statusConfig[token.status]
  const StatusIcon = config.icon

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-700/50 bg-gray-800/50 hover:bg-gray-700/50 overflow-hidden">
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${config.bgColor} flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {token.image ? (
                <img src={token.image} alt={token.name} className="h-10 w-10 rounded-full" />
              ) : (
                <Rocket className={`h-6 w-6 ${config.textColor}`} />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground truncate text-lg group-hover:text-primary transition-colors">{token.name}</h3>
                <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30 text-primary font-mono">${token.symbol}</Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate mt-1">{token.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant={config.variant} className="gap-1 shadow-lg">
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/20 transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-900/95 backdrop-blur-sm border-gray-700">
                <DropdownMenuItem onClick={() => onView(token.id)} className="hover:bg-primary/20">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onManage(token.id)} className="hover:bg-primary/20">
                  <Bot className="h-4 w-4 mr-2" />
                  Gestionar AI
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStatus(token.id)} className="hover:bg-primary/20">
                  {token.status === "paused" ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Reanudar
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Progress Bar for Launching Status */}
        {token.status === "launching" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso del Lanzamiento</span>
              <span className="font-medium text-primary">{token.progress}%</span>
            </div>
            <Progress value={token.progress} className="h-2 bg-gray-700" />
          </div>
        )}
        
        {/* Metrics Grid - Estilo pump.fun */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <p className="text-xs text-muted-foreground font-medium">Market Cap</p>
            <p className="text-lg font-bold text-green-400">{token.marketCap}</p>
          </div>
          <div className="space-y-1 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <p className="text-xs text-muted-foreground font-medium">Holders</p>
            <p className="text-lg font-bold text-blue-400">{token.holders.toLocaleString()}</p>
          </div>
        </div>
        
        {/* AI & Social Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl border border-gray-600/50">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Agentes AI</p>
              <p className="text-sm font-bold text-primary">{token.aiAgents} activos</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl border border-gray-600/50">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Users className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Social Score</p>
              <p className="text-sm font-bold text-green-400">{token.socialScore}/100</p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link to={`/token/${token.id}`} className="flex-1">
            <Button 
              size="sm" 
              variant="outline"
              className="w-full bg-gray-800/50 border-gray-600 hover:bg-primary/20 hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver
            </Button>
          </Link>
          
          <Link to={`/token/${token.id}`} className="flex-1">
            <Button 
              size="sm" 
              className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Bot className="h-4 w-4 mr-2" />
              Gestionar
            </Button>
          </Link>
        </div>
        
        {/* Footer Info - Estilo pump.fun */}
        <div className="flex justify-between items-center text-xs text-muted-foreground pt-3 border-t border-gray-700/50 bg-gray-800/30 -mx-6 px-6 py-3 rounded-b-lg">
          <span className="font-mono text-gray-400">Creado por {token.creator}</span>
          <span className="text-primary font-medium">{token.launchDate}</span>
        </div>
      </CardContent>
    </Card>
  )
}