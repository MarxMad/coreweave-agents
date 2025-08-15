import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, AlertCircle, RefreshCw, Copy } from 'lucide-react'
import { checkEnvironment, getEnvironmentSummary, type EnvironmentCheck } from '@/utils/environment-check'

interface VercelDiagnosticsProps {
  showOnlyErrors?: boolean
  autoRefresh?: boolean
}

export function VercelDiagnostics({ showOnlyErrors = false, autoRefresh = false }: VercelDiagnosticsProps) {
  const [checks, setChecks] = useState<EnvironmentCheck[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshChecks = async () => {
    setIsRefreshing(true)
    // Simular un pequeño delay para mostrar el loading
    await new Promise(resolve => setTimeout(resolve, 500))
    setChecks(checkEnvironment())
    setIsRefreshing(false)
  }

  useEffect(() => {
    refreshChecks()
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshChecks, 30000) // Refresh cada 30 segundos
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const summary = getEnvironmentSummary()
  const filteredChecks = showOnlyErrors 
    ? checks.filter(check => check.status === 'error' || check.status === 'warning')
    : checks

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const copyDiagnostics = () => {
    const diagnosticsText = [
      '🔍 CoreWeave Agents - Diagnóstico de Entorno',
      `📊 Resumen: ${summary.success} éxitos, ${summary.warnings} advertencias, ${summary.errors} errores`,
      `🌐 Entorno: ${import.meta.env.PROD ? 'Producción' : 'Desarrollo'}`,
      `📅 Fecha: ${new Date().toLocaleString()}`,
      '',
      '📋 Detalles:',
      ...checks.map(check => {
        const icon = check.status === 'success' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'
        return [
          `${icon} ${check.name}: ${check.message}`,
          check.details ? `   📝 ${check.details}` : '',
          check.fix ? `   🔧 ${check.fix}` : ''
        ].filter(Boolean).join('\n')
      }),
      '',
      '🔗 Variables de entorno relevantes:',
      `VITE_WALLETCONNECT_PROJECT_ID: ${import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ? 'Configurado' : 'No configurado'}`,
      `VITE_DEV_MODE: ${import.meta.env.VITE_DEV_MODE || 'No configurado'}`,
      `VITE_FRONTEND_URL: ${import.meta.env.VITE_FRONTEND_URL || 'No configurado'}`,
      `VITE_BACKEND_URL: ${import.meta.env.VITE_BACKEND_URL || 'No configurado'}`,
    ].join('\n')

    navigator.clipboard.writeText(diagnosticsText)
  }

  // Si no hay problemas y solo se muestran errores, no renderizar nada
  if (showOnlyErrors && summary.errors === 0 && summary.warnings === 0) {
    return null
  }

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">🔍 Diagnóstico de Entorno</CardTitle>
                {summary.critical && (
                  <Badge variant="destructive" className="animate-pulse">
                    Crítico
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <Badge className={getStatusColor('success')}>
                    {summary.success}
                  </Badge>
                  {summary.warnings > 0 && (
                    <Badge className={getStatusColor('warning')}>
                      {summary.warnings}
                    </Badge>
                  )}
                  {summary.errors > 0 && (
                    <Badge className={getStatusColor('error')}>
                      {summary.errors}
                    </Badge>
                  )}
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            {summary.critical && (
              <Alert className="mb-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700 dark:text-red-300">
                  <strong>Problemas críticos detectados.</strong> La aplicación puede no funcionar correctamente.
                  {import.meta.env.PROD && (
                    <span className="block mt-1">
                      💡 Si esto ocurre en Vercel, revisa las variables de entorno en el dashboard.
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshChecks}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Actualizando...' : 'Actualizar'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyDiagnostics}
                className="gap-2"
              >
                <Copy className="h-3 w-3" />
                Copiar Diagnóstico
              </Button>
            </div>

            <div className="space-y-3">
              {filteredChecks.map((check, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    check.status === 'error'
                      ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                      : check.status === 'warning'
                      ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20'
                      : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(check.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{check.name}</h4>
                        <Badge className={`text-xs ${getStatusColor(check.status)}`}>
                          {check.status === 'success' ? 'OK' : check.status === 'warning' ? 'Advertencia' : 'Error'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{check.message}</p>
                      {check.details && (
                        <p className="text-xs text-muted-foreground mb-1">
                          📝 {check.details}
                        </p>
                      )}
                      {check.fix && (
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                          🔧 {check.fix}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {import.meta.env.PROD && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Consejos para Vercel</h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Verifica las variables de entorno en el dashboard de Vercel</li>
                  <li>• Asegúrate de que todas las variables VITE_ estén configuradas</li>
                  <li>• Revisa los logs de build y runtime en Vercel</li>
                  <li>• Usa preview deployments para testing antes de producción</li>
                </ul>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export default VercelDiagnostics