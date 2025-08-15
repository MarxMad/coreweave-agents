import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Copy, ExternalLink, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { usePublicClient } from 'wagmi'
import { decodeEventLog, type Log } from 'viem'

interface TokenLaunchConfirmationProps {
  transactionHash: string
  tokenName: string
  tokenSymbol: string
  onGoToDashboard: () => void
  onCreateAnother: () => void
}

export function TokenLaunchConfirmation({
  transactionHash,
  tokenName,
  tokenSymbol,
  onGoToDashboard,
  onCreateAnother
}: TokenLaunchConfirmationProps) {
  const { toast } = useToast()
  const [tokenAddress, setTokenAddress] = useState<string | null>(null)
  const [isLoadingAddress, setIsLoadingAddress] = useState(true)
  const publicClient = usePublicClient()

  useEffect(() => {
    const getTokenAddress = async () => {
      if (!publicClient || !transactionHash) return

      try {
        // Obtener el recibo de la transacción
        const receipt = await publicClient.getTransactionReceipt({
          hash: transactionHash as `0x${string}`
        })

        // ABI del evento TokenCreated
        const tokenCreatedAbi = {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'tokenAddress',
              type: 'address'
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'creator',
              type: 'address'
            },
            {
              indexed: false,
              internalType: 'string',
              name: 'name',
              type: 'string'
            },
            {
              indexed: false,
              internalType: 'string',
              name: 'symbol',
              type: 'string'
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'totalSupply',
              type: 'uint256'
            }
          ],
          name: 'TokenCreated',
          type: 'event'
        }

        // Buscar el evento TokenCreated en los logs
        for (const log of receipt.logs) {
          try {
            // Convertir el log al tipo correcto
            const logWithTopics = log as Log
            
            const decodedLog = decodeEventLog({
              abi: [tokenCreatedAbi],
              data: logWithTopics.data,
              topics: logWithTopics.topics
            })

            if (decodedLog.eventName === 'TokenCreated') {
              const args = decodedLog.args as { tokenAddress: string; creator: string; name: string; symbol: string; totalSupply: bigint }
              setTokenAddress(args.tokenAddress)
              break
            }
          } catch (error) {
            // Este log no es el evento TokenCreated, continuar
            continue
          }
        }
      } catch (error) {
        console.error('Error obteniendo dirección del token:', error)
      } finally {
        setIsLoadingAddress(false)
      }
    }

    getTokenAddress()
  }, [publicClient, transactionHash])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado",
      description: `${label} copiado al portapapeles`,
    })
  }

  const openInExplorer = (hash: string) => {
    // Aquí puedes cambiar la URL según la red que estés usando
    const explorerUrl = `https://etherscan.io/tx/${hash}`
    window.open(explorerUrl, '_blank')
  }

  const openTokenInExplorer = (address: string) => {
    const explorerUrl = `https://etherscan.io/token/${address}`
    window.open(explorerUrl, '_blank')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header de éxito */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-green-600">¡Token Creado Exitosamente!</h1>
          <p className="text-muted-foreground mt-2">
            Tu token <strong>{tokenName} ({tokenSymbol})</strong> ha sido desplegado en la blockchain
          </p>
        </div>
      </div>

      {/* Información de la transacción */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Detalles de la Transacción
          </CardTitle>
          <CardDescription>
            Información sobre el despliegue de tu token
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hash de transacción */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Hash de Transacción</label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="flex-1 text-sm font-mono break-all">
                {transactionHash}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(transactionHash, 'Hash de transacción')}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openInExplorer(transactionHash)}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Dirección del token */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Dirección del Contrato</label>
            {isLoadingAddress ? (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Obteniendo dirección del contrato...</span>
              </div>
            ) : tokenAddress ? (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <code className="flex-1 text-sm font-mono break-all">
                  {tokenAddress}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(tokenAddress, 'Dirección del contrato')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openTokenInExplorer(tokenAddress)}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  No se pudo obtener la dirección del contrato. Puedes encontrarla en el explorador de bloques.
                </p>
              </div>
            )}
          </div>

          {/* Estado */}
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Confirmado
            </Badge>
            <span className="text-sm text-muted-foreground">
              Tu token está ahora disponible en la blockchain
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Próximos pasos */}
      <Card>
        <CardHeader>
          <CardTitle>¿Qué sigue?</CardTitle>
          <CardDescription>
            Explora las opciones disponibles para tu nuevo token
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Ver en Dashboard</h4>
                <p className="text-sm text-muted-foreground">
                  Monitorea el rendimiento y estadísticas de tu token
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Configurar AI Agents</h4>
                <p className="text-sm text-muted-foreground">
                  Activa y configura los agentes de IA para tu token
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Compartir Token</h4>
                <p className="text-sm text-muted-foreground">
                  Comparte la dirección del contrato con tu comunidad
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onGoToDashboard} className="flex-1">
          <ArrowRight className="w-4 h-4 mr-2" />
          Ir al Dashboard
        </Button>
        <Button variant="outline" onClick={onCreateAnother} className="flex-1">
          Crear Otro Token
        </Button>
      </div>
    </div>
  )
}