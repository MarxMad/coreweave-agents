import { Rocket, TrendingUp, Users, Bot, MoreVertical, Eye, Play, Pause } from "lucide-react"
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
    <Card className="hover:shadow-lg transition-all duration-200 border-border/50 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bgColor} flex-shrink-0`}>
              {token.image ? (
                <img src={token.image} alt={token.name} className="h-8 w-8 rounded-full" />
              ) : (
                <Rocket className={`h-5 w-5 ${config.textColor}`} />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground truncate">{token.name}</h3>
                <Badge variant="outline" className="text-xs">${token.symbol}</Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{token.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant={config.variant} className="gap-1">
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(token.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onManage(token.id)}>
                  <Bot className="h-4 w-4 mr-2" />
                  Gestionar AI
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStatus(token.id)}>
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
              <span className="font-medium">{token.progress}%</span>
            </div>
            <Progress value={token.progress} className="h-2" />
          </div>
        )}
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Market Cap</p>
            <p className="text-sm font-semibold">{token.marketCap}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Holders</p>
            <p className="text-sm font-semibold">{token.holders.toLocaleString()}</p>
          </div>
        </div>
        
        {/* AI & Social Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Agentes AI</p>
              <p className="text-sm font-semibold">{token.aiAgents} activos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-success" />
            <div>
              <p className="text-xs text-muted-foreground">Social Score</p>
              <p className="text-sm font-semibold">{token.socialScore}/100</p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onView(token.id)}
            size="sm" 
            variant="outline"
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver
          </Button>
          
          <Button 
            onClick={() => onManage(token.id)}
            size="sm" 
            className="flex-1"
          >
            <Bot className="h-4 w-4 mr-2" />
            Gestionar
          </Button>
        </div>
        
        {/* Footer Info */}
        <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border/50">
          <span>Creado por {token.creator}</span>
          <span>{token.launchDate}</span>
        </div>
      </CardContent>
    </Card>
  )
}