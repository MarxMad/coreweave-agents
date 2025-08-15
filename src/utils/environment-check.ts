// Utilidad para verificar la configuración del entorno
// Especialmente útil para diagnosticar diferencias entre local y Vercel

export interface EnvironmentCheck {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
  fix?: string;
}

export function checkEnvironment(): EnvironmentCheck[] {
  const checks: EnvironmentCheck[] = [];

  // 1. Verificar variables de entorno críticas
  const walletConnectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
  if (!walletConnectId || walletConnectId === 'your_walletconnect_project_id_here') {
    checks.push({
      name: 'WalletConnect Project ID',
      status: 'error',
      message: 'WalletConnect Project ID no configurado',
      details: 'Esta variable es crítica para la conexión de wallets',
      fix: 'Configura VITE_WALLETCONNECT_PROJECT_ID en las variables de entorno'
    });
  } else {
    checks.push({
      name: 'WalletConnect Project ID',
      status: 'success',
      message: 'Configurado correctamente',
      details: `ID: ${walletConnectId.slice(0, 8)}...`
    });
  }

  // 2. Verificar URLs del entorno
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  if (frontendUrl?.includes('localhost') && import.meta.env.PROD) {
    checks.push({
      name: 'Frontend URL',
      status: 'warning',
      message: 'URL de frontend apunta a localhost en producción',
      details: `URL actual: ${frontendUrl}`,
      fix: 'Actualiza VITE_FRONTEND_URL para producción'
    });
  } else {
    checks.push({
      name: 'Frontend URL',
      status: 'success',
      message: 'URL configurada correctamente',
      details: frontendUrl || 'No configurada (usando defaults)'
    });
  }

  if (backendUrl?.includes('localhost') && import.meta.env.PROD) {
    checks.push({
      name: 'Backend URL',
      status: 'warning',
      message: 'URL de backend apunta a localhost en producción',
      details: `URL actual: ${backendUrl}`,
      fix: 'Actualiza VITE_BACKEND_URL para producción'
    });
  } else {
    checks.push({
      name: 'Backend URL',
      status: 'success',
      message: 'URL configurada correctamente',
      details: backendUrl || 'No configurada (usando defaults)'
    });
  }

  // 3. Verificar modo de desarrollo
  const devMode = import.meta.env.VITE_DEV_MODE;
  if (devMode === 'true' && import.meta.env.PROD) {
    checks.push({
      name: 'Modo de Desarrollo',
      status: 'warning',
      message: 'Modo de desarrollo activado en producción',
      details: 'Esto puede afectar el rendimiento',
      fix: 'Configura VITE_DEV_MODE=false en producción'
    });
  } else {
    checks.push({
      name: 'Modo de Desarrollo',
      status: 'success',
      message: import.meta.env.PROD ? 'Modo producción activo' : 'Modo desarrollo activo',
      details: `DEV_MODE: ${devMode || 'no configurado'}`
    });
  }

  // 4. Verificar disponibilidad de APIs web
  if (typeof window !== 'undefined') {
    // Verificar Web3/Ethereum
    if (typeof window.ethereum !== 'undefined') {
      checks.push({
        name: 'Ethereum Provider',
        status: 'success',
        message: 'Proveedor Ethereum detectado',
        details: 'MetaMask u otro wallet disponible'
      });
    } else {
      checks.push({
        name: 'Ethereum Provider',
        status: 'warning',
        message: 'No se detectó proveedor Ethereum',
        details: 'Es necesario instalar MetaMask u otro wallet',
        fix: 'Instala MetaMask o conecta un wallet compatible'
      });
    }

    // Verificar localStorage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      checks.push({
        name: 'Local Storage',
        status: 'success',
        message: 'Local Storage disponible'
      });
    } catch {
      checks.push({
        name: 'Local Storage',
        status: 'error',
        message: 'Local Storage no disponible',
        details: 'Necesario para guardar configuraciones',
        fix: 'Habilita cookies y almacenamiento local en el navegador'
      });
    }
  }

  // 5. Verificar conectividad de red (solo en cliente)
  if (typeof window !== 'undefined' && navigator.onLine !== undefined) {
    if (navigator.onLine) {
      checks.push({
        name: 'Conectividad de Red',
        status: 'success',
        message: 'Conexión a internet activa'
      });
    } else {
      checks.push({
        name: 'Conectividad de Red',
        status: 'error',
        message: 'Sin conexión a internet',
        fix: 'Verifica tu conexión a internet'
      });
    }
  }

  return checks;
}

// Función para mostrar un resumen de los checks
export function getEnvironmentSummary(): {
  total: number;
  success: number;
  warnings: number;
  errors: number;
  critical: boolean;
} {
  const checks = checkEnvironment();
  const summary = {
    total: checks.length,
    success: checks.filter(c => c.status === 'success').length,
    warnings: checks.filter(c => c.status === 'warning').length,
    errors: checks.filter(c => c.status === 'error').length,
    critical: false
  };

  // Determinar si hay problemas críticos
  const criticalChecks = ['WalletConnect Project ID', 'Local Storage', 'Conectividad de Red'];
  summary.critical = checks.some(check => 
    criticalChecks.includes(check.name) && check.status === 'error'
  );

  return summary;
}

// Función para logging automático en desarrollo
export function logEnvironmentStatus() {
  if (import.meta.env.DEV) {
    const checks = checkEnvironment();
    const summary = getEnvironmentSummary();
    
    console.group('🔍 Environment Check');
    console.log(`✅ Success: ${summary.success}`);
    console.log(`⚠️ Warnings: ${summary.warnings}`);
    console.log(`❌ Errors: ${summary.errors}`);
    
    if (summary.critical) {
      console.error('🚨 Critical issues detected!');
    }
    
    checks.forEach(check => {
      const icon = check.status === 'success' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
      console.log(`${icon} ${check.name}: ${check.message}`);
      if (check.details) console.log(`   Details: ${check.details}`);
      if (check.fix) console.log(`   Fix: ${check.fix}`);
    });
    
    console.groupEnd();
  }
}

// Auto-ejecutar en desarrollo
if (import.meta.env.DEV && typeof window !== 'undefined') {
  // Ejecutar después de que la página cargue
  window.addEventListener('load', () => {
    setTimeout(logEnvironmentStatus, 1000);
  });
}