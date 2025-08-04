import { Bot, Play, Pause, Square, MoreVertical, Activity, Clock, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type AgentStatus = "active" | "paused" | "stopped"

export interface Agent {
  id: string
  name: string
  template: string
  provider: string
  status: AgentStatus
  lastActivity: string
  tokensUsed: number
  gasUsed: number
  uptime: string
}

interface AgentCardProps {
  agent: Agent
  onToggleStatus: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onMonitor: (id: string) => void
}

const statusConfig = {
  active: {
    label: "Activo",
    variant: "default" as const,
    bgColor: "bg-success/10",
    textColor: "text-success",
    icon: Play
  },
  paused: {
    label: "Pausado", 
    variant: "secondary" as const,
    bgColor: "bg-warning/10",
    textColor: "text-warning",
    icon: Pause
  },
  stopped: {
    label: "Detenido",
    variant: "outline" as const,
    bgColor: "bg-muted",
    textColor: "text-muted-foreground",
    icon: Square
  }
}

export function AgentCard({ agent, onToggleStatus, onEdit, onDelete, onMonitor }: AgentCardProps) {
  const config = statusConfig[agent.status]
  const StatusIcon = config.icon

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              <Bot className={`h-5 w-5 ${config.textColor}`} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{agent.name}</h3>
              <p className="text-sm text-muted-foreground">{agent.template}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
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
                <DropdownMenuItem onClick={() => onMonitor(agent.id)}>
                  <Activity className="h-4 w-4 mr-2" />
                  Monitorear
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(agent.id)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(agent.id)} className="text-destructive">
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Proveedor IA</p>
            <p className="text-sm font-medium">{agent.provider}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Última Actividad</p>
            <p className="text-sm font-medium">{agent.lastActivity}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Uptime</span>
            </div>
            <p className="text-sm font-semibold">{agent.uptime}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Activity className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Tokens</span>
            </div>
            <p className="text-sm font-semibold">{agent.tokensUsed.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Gas</span>
            </div>
            <p className="text-sm font-semibold">{agent.gasUsed.toFixed(4)}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => onToggleStatus(agent.id)}
            size="sm" 
            className="flex-1"
            variant={agent.status === "active" ? "outline" : "default"}
          >
            {agent.status === "active" ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Reanudar
              </>
            )}
          </Button>
          
          <Button 
            onClick={() => onMonitor(agent.id)}
            size="sm" 
            variant="outline"
          >
            <Activity className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}