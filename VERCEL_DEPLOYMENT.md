# 🚀 Guía de Deployment en Vercel

Esta guía te ayudará a resolver los problemas de deployment en Vercel y configurar correctamente tu aplicación CoreWeave Agents.

## 🔧 Problemas Comunes y Soluciones

### ❌ Problema: "Funciona en local pero no en Vercel"

**Causas principales:**
1. Variables de entorno no configuradas en Vercel
2. URLs hardcodeadas para localhost
3. Problemas de CORS
4. Configuración de build incorrecta

## 📋 Configuración Paso a Paso

### 1. Variables de Entorno en Vercel

Ve a tu proyecto en Vercel → Settings → Environment Variables y añade:

```bash
# OBLIGATORIAS
VITE_WALLETCONNECT_PROJECT_ID=9f496f77ab6a4b614b8cb58bf5bebc6c
VITE_COREWEAVE_API_URL=https://api.coreweave.com
VITE_DEV_MODE=false

# URLs DE PRODUCCIÓN (reemplaza con tu dominio real)
VITE_FRONTEND_URL=https://tu-app.vercel.app
VITE_BACKEND_URL=https://tu-app.vercel.app/api
```

### 2. Configuración de Build

Asegúrate de que tu `package.json` tenga:

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### 3. Configuración de Vite para Producción

Actualiza `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configuración específica para producción
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          wagmi: ['wagmi', '@rainbow-me/rainbowkit'],
        },
      },
    },
  },
  // Configuración para SPA routing
  preview: {
    port: 4173,
    host: true,
  },
}));
```

## 🔍 Debugging en Vercel

### 1. Revisar Logs de Build

1. Ve a tu proyecto en Vercel
2. Haz clic en "Deployments"
3. Selecciona el deployment fallido
4. Revisa los logs de "Build Logs" y "Function Logs"

### 2. Problemas Comunes de Build

**Error: "Module not found"**
```bash
# Solución: Verificar imports relativos
# ❌ Incorrecto
import Component from '../../../components/Component'

# ✅ Correcto
import Component from '@/components/Component'
```

**Error: "Environment variable not defined"**
```bash
# Solución: Verificar que todas las variables VITE_ estén en Vercel
# Y que no tengan valores undefined
```

### 3. Problemas de Runtime

**Error: "Network request failed"**
- Verificar que las URLs no apunten a localhost
- Configurar CORS correctamente
- Verificar que WalletConnect Project ID sea válido

## 🌐 Configuración de Red y Wallet

### Verificar Configuración de CoreDAO

En `src/lib/wagmi.ts`, asegúrate de que la configuración sea correcta:

```typescript
const coreDAO = {
  id: 1116,
  name: 'Core Blockchain',
  nativeCurrency: {
    decimals: 18,
    name: 'Core',
    symbol: 'CORE',
  },
  rpcUrls: {
    default: {
      http: [
        'https://rpc.coredao.org',
        'https://rpc.ankr.com/core',
        'https://core.public-rpc.com'
      ],
    },
  },
  blockExplorers: {
    default: { name: 'CoreScan', url: 'https://scan.coredao.org' },
  },
};
```

## 🧪 Testing en Vercel

### 1. Preview Deployments

Cada push a una branch crea un preview deployment:
- Úsalo para testing antes de mergear a main
- Verifica que las funcionalidades críticas funcionen

### 2. Checklist de Testing

- [ ] ✅ La aplicación carga correctamente
- [ ] ✅ WalletConnect funciona
- [ ] ✅ Cambio de red a CoreDAO funciona
- [ ] ✅ Creación de tokens funciona
- [ ] ✅ No hay errores en la consola del navegador
- [ ] ✅ Las transacciones se procesan correctamente

## 🚨 Solución de Problemas Específicos

### Problema: "Internal JSON-RPC error"

**En local funciona, en Vercel no:**

1. **Verificar variables de entorno:**
   ```bash
   # En Vercel, añadir:
   VITE_WALLETCONNECT_PROJECT_ID=tu-project-id-real
   ```

2. **Verificar configuración de red:**
   - Asegúrate de que los RPC endpoints sean públicos
   - No uses localhost en ninguna configuración

3. **Verificar contratos:**
   - Confirma que las direcciones de contratos sean correctas
   - Verifica que los contratos estén desplegados en CoreDAO mainnet

### Problema: "Wallet no se conecta"

1. **WalletConnect Project ID inválido:**
   - Ve a [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Crea un nuevo proyecto
   - Actualiza la variable de entorno en Vercel

2. **CORS issues:**
   - Verifica la configuración en `vercel.json`
   - Asegúrate de que los headers CORS estén correctos

## 📞 Soporte Adicional

Si después de seguir esta guía el problema persiste:

1. **Revisar logs detallados** en Vercel Dashboard
2. **Comparar configuración** entre local y producción
3. **Verificar contratos** en CoreScan
4. **Contactar soporte** con logs específicos

---

**💡 Tip:** Siempre prueba en un preview deployment antes de hacer deploy a producción.