// Error handler para reducir logs excesivos en consola

interface ErrorConfig {
  maxErrors: number
  timeWindow: number // en milisegundos
  suppressDuplicates: boolean
}

class ErrorHandler {
  private errorCounts: Map<string, { count: number; lastSeen: number }> = new Map()
  private config: ErrorConfig

  constructor(config: ErrorConfig = {
    maxErrors: 3,
    timeWindow: 10000, // 10 segundos
    suppressDuplicates: true
  }) {
    this.config = config
  }

  shouldLogError(error: Error | string): boolean {
    const errorKey = typeof error === 'string' ? error : error.message
    const now = Date.now()
    
    // Limpiar errores antiguos
    this.cleanOldErrors(now)
    
    const errorInfo = this.errorCounts.get(errorKey)
    
    if (!errorInfo) {
      this.errorCounts.set(errorKey, { count: 1, lastSeen: now })
      return true
    }
    
    // Si está dentro de la ventana de tiempo
    if (now - errorInfo.lastSeen < this.config.timeWindow) {
      errorInfo.count++
      errorInfo.lastSeen = now
      
      // No mostrar si excede el máximo
      if (errorInfo.count > this.config.maxErrors) {
        return false
      }
    } else {
      // Reiniciar contador si ha pasado la ventana de tiempo
      errorInfo.count = 1
      errorInfo.lastSeen = now
    }
    
    return true
  }

  private cleanOldErrors(now: number) {
    for (const [key, info] of this.errorCounts.entries()) {
      if (now - info.lastSeen > this.config.timeWindow * 2) {
        this.errorCounts.delete(key)
      }
    }
  }

  logError(error: Error | string, context?: string) {
    if (this.shouldLogError(error)) {
      const errorMessage = typeof error === 'string' ? error : error.message
      const prefix = context ? `[${context}]` : '[Error]'
      console.error(`${prefix} ${errorMessage}`)
      
      // Solo mostrar stack trace para errores únicos
      if (typeof error === 'object' && error.stack) {
        console.error(error.stack)
      }
    }
  }

  // Método para errores de red/blockchain específicos
  logNetworkError(error: Error | string, operation?: string) {
    const context = operation ? `Network-${operation}` : 'Network'
    
    // Filtrar errores comunes de red que no son críticos
    const errorMessage = typeof error === 'string' ? error : error.message
    
    if (this.isNonCriticalNetworkError(errorMessage)) {
      // Solo log en desarrollo
      if (process.env.NODE_ENV === 'development') {
        this.logError(error, context)
      }
      return
    }
    
    this.logError(error, context)
  }

  private isNonCriticalNetworkError(message: string): boolean {
    const nonCriticalPatterns = [
      'network timeout',
      'connection refused',
      'rate limit',
      'cors',
      'fetch failed',
      'network error',
      'timeout',
      'aborted'
    ]
    
    return nonCriticalPatterns.some(pattern => 
      message.toLowerCase().includes(pattern)
    )
  }

  // Método para limpiar todos los errores
  reset() {
    this.errorCounts.clear()
  }
}

// Instancia global
export const errorHandler = new ErrorHandler()

// Hook personalizado para manejo de errores
export const useErrorHandler = () => {
  const logError = (error: Error | string, context?: string) => {
    errorHandler.logError(error, context)
  }

  const logNetworkError = (error: Error | string, operation?: string) => {
    errorHandler.logNetworkError(error, operation)
  }

  return {
    logError,
    logNetworkError,
    reset: () => errorHandler.reset()
  }
}

// Función helper para envolver funciones async con manejo de errores
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      errorHandler.logError(error as Error, context)
      throw error
    }
  }) as T
}

export default errorHandler