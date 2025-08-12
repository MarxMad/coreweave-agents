import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Twitter, MessageCircle, Send, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SocialAccount {
  platform: string
  connected: boolean
  username?: string
}

interface SocialMediaIntegrationProps {
  onAccountsChange?: (accounts: SocialAccount[]) => void
  connectedAccounts?: SocialAccount[]
}

const BACKEND_URL = 'http://localhost:3001'

export default function SocialMediaIntegration({ onAccountsChange, connectedAccounts: initialConnectedAccounts = [] }: SocialMediaIntegrationProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>(initialConnectedAccounts)
  const [telegramBot, setTelegramBot] = useState({ token: '', chatId: '' })
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [telegramConnecting, setTelegramConnecting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchConnectedAccounts()
  }, [])

  const fetchConnectedAccounts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/connected-accounts`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setConnectedAccounts(data.accounts || [])
        onAccountsChange?.(data.accounts || [])
      }
    } catch (error) {
      console.error('Error fetching connected accounts:', error)
    }
  }

  const connectTwitter = () => {
    setIsConnecting('twitter')
    window.open(`${BACKEND_URL}/auth/twitter`, '_blank', 'width=600,height=600')
    
    // Listen for the popup to close
    const checkClosed = setInterval(() => {
      try {
        // Check if authentication was successful by polling our API
        fetchConnectedAccounts()
      } catch (error) {
        console.error('Error checking auth status:', error)
      }
    }, 2000)
    
    setTimeout(() => {
      clearInterval(checkClosed)
      setIsConnecting(null)
    }, 30000) // Stop checking after 30 seconds
  }

  const connectDiscord = () => {
    setIsConnecting('discord')
    window.open(`${BACKEND_URL}/auth/discord`, '_blank', 'width=600,height=600')
    
    // Listen for the popup to close
    const checkClosed = setInterval(() => {
      try {
        fetchConnectedAccounts()
      } catch (error) {
        console.error('Error checking auth status:', error)
      }
    }, 2000)
    
    setTimeout(() => {
      clearInterval(checkClosed)
      setIsConnecting(null)
    }, 30000)
  }

  const connectTelegram = async () => {
    if (!telegramBot.token || !telegramBot.chatId) {
      toast({
        title: "Error",
        description: "Por favor ingresa el token del bot y el chat ID",
        variant: "destructive"
      })
      return
    }

    setTelegramConnecting(true)
    
    try {
      const response = await fetch(`${BACKEND_URL}/auth/telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          botToken: telegramBot.token,
          chatId: telegramBot.chatId
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "¡Éxito!",
          description: `Bot de Telegram conectado: ${data.botInfo.username}`
        })
        setTelegramBot({ token: '', chatId: '' })
        fetchConnectedAccounts()
      } else {
        throw new Error(data.error || 'Error connecting Telegram bot')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error conectando bot de Telegram",
        variant: "destructive"
      })
    } finally {
      setTelegramConnecting(false)
    }
  }

  const isAccountConnected = (platform: string) => {
    return connectedAccounts.some(account => account.platform === platform && account.connected)
  }

  const getAccountUsername = (platform: string) => {
    const account = connectedAccounts.find(acc => acc.platform === platform)
    return account?.username
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Integración de Redes Sociales</h3>
        <p className="text-sm text-muted-foreground">
          Conecta tus cuentas de redes sociales para que el agente AI pueda gestionar automáticamente tu presencia online.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> Tus credenciales se almacenan de forma segura y solo se usan para automatizar las acciones del agente AI.
        </AlertDescription>
      </Alert>

      {/* Twitter Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Twitter className="h-5 w-5 text-blue-500" />
            Twitter / X
            {isAccountConnected('twitter') && (
              <Badge className="bg-success text-success-foreground">
                <CheckCircle className="h-3 w-3 mr-1" />
                Conectado
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAccountConnected('twitter') ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Conectado como: <strong>@{getAccountUsername('twitter')}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                El agente puede publicar tweets, responder menciones y gestionar tu presencia en Twitter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Conecta tu cuenta de Twitter para permitir que el agente publique contenido automáticamente.
              </p>
              <Button 
                onClick={connectTwitter}
                disabled={isConnecting === 'twitter'}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {isConnecting === 'twitter' ? 'Conectando...' : 'Conectar Twitter'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Discord Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-indigo-500" />
            Discord
            {isAccountConnected('discord') && (
              <Badge className="bg-success text-success-foreground">
                <CheckCircle className="h-3 w-3 mr-1" />
                Conectado
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAccountConnected('discord') ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Conectado como: <strong>{getAccountUsername('discord')}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                El agente puede gestionar servidores, responder mensajes y moderar comunidades.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Conecta tu cuenta de Discord para gestión automática de servidores y comunidades.
              </p>
              <Button 
                onClick={connectDiscord}
                disabled={isConnecting === 'discord'}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {isConnecting === 'discord' ? 'Conectando...' : 'Conectar Discord'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Telegram Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-400" />
            Telegram Bot
            {isAccountConnected('telegram') && (
              <Badge className="bg-success text-success-foreground">
                <CheckCircle className="h-3 w-3 mr-1" />
                Conectado
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAccountConnected('telegram') ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Bot de Telegram configurado y activo.
              </p>
              <p className="text-xs text-muted-foreground">
                El agente puede enviar mensajes y gestionar canales/grupos de Telegram.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configura un bot de Telegram para automatizar mensajes y gestión de canales.
              </p>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Cómo obtener un bot token:</strong><br />
                  1. Habla con @BotFather en Telegram<br />
                  2. Usa /newbot para crear un nuevo bot<br />
                  3. Copia el token que te proporciona<br />
                  4. Para el Chat ID, envía un mensaje a tu bot y usa la API de Telegram
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telegram-token">Bot Token</Label>
                  <Input
                    id="telegram-token"
                    type="password"
                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                    value={telegramBot.token}
                    onChange={(e) => setTelegramBot(prev => ({ ...prev, token: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram-chat">Chat ID</Label>
                  <Input
                    id="telegram-chat"
                    placeholder="-1001234567890"
                    value={telegramBot.chatId}
                    onChange={(e) => setTelegramBot(prev => ({ ...prev, chatId: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={connectTelegram}
                  disabled={telegramConnecting || !telegramBot.token || !telegramBot.chatId}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {telegramConnecting ? 'Conectando...' : 'Conectar Bot de Telegram'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Una vez conectadas las cuentas, el agente AI podrá gestionar automáticamente tu presencia en redes sociales.
        </p>
      </div>
    </div>
  )
}