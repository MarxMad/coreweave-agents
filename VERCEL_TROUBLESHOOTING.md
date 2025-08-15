# 🚀 Guía de Solución de Problemas para Vercel

## 🔍 Problema Común: "Funciona en local pero no en Vercel"

Esta guía te ayudará a diagnosticar y resolver los problemas más comunes cuando tu aplicación funciona perfectamente en desarrollo local pero falla en Vercel.

## 📋 Lista de Verificación Rápida

### ✅ 1. Variables de Entorno

**Problema:** Las variables de entorno no están configuradas en Vercel.

**Solución:**
1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Navega a **Settings** → **Environment Variables**
3. Agrega estas variables esenciales:

```bash
# Variables críticas para CoreWeave Agents
VITE_WALLETCONNECT_PROJECT_ID=tu_project_id_aqui
VITE_COREWEAVE_API_URL=https://api.coreweave.com
VITE_DEV_MODE=false
VITE_FRONTEND_URL=https://tu-app.vercel.app
VITE_BACKEND_URL=https://tu-backend.vercel.app
```

4. **Importante:** Marca todas las variables para **Production**, **Preview**, y **Development**
5. Redeploy tu aplicación después de agregar las variables

### ✅ 2. Configuración de Build

**Problema:** Configuración incorrecta de build o framework.

**Solución:**
Verifica que tu `vercel.json` tenga esta configuración:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### ✅ 3. Dependencias y Package.json

**Problema:** Dependencias faltantes o versiones incompatibles.

**Solución:**
1. Verifica que todas las dependencias estén en `dependencies` (no en `devDependencies`)
2. Ejecuta localmente:
```bash
npm ci
npm run build
npm run preview
```
3. Si funciona localmente con `preview`, debería funcionar en Vercel

### ✅ 4. Rutas y SPA (Single Page Application)

**Problema:** Las rutas de React Router no funcionan en Vercel.

**Solución:**
Asegúrate de tener la configuración de `rewrites` en `vercel.json` (ver punto 2)

## 🔧 Diagnóstico Avanzado

### 📊 Usar el Componente de Diagnóstico

Tu aplicación ahora incluye un componente de diagnóstico automático que:
- Se muestra automáticamente cuando hay problemas críticos
- Verifica variables de entorno
- Comprueba conectividad de APIs
- Proporciona sugerencias específicas

### 📝 Revisar Logs de Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a la pestaña **Functions** o **Deployments**
3. Haz clic en el deployment problemático
4. Revisa los logs de **Build** y **Runtime**

### 🌐 Probar con Preview Deployments

1. Crea una rama de prueba:
```bash
git checkout -b test-vercel-fix
git push origin test-vercel-fix
```
2. Vercel creará automáticamente un preview deployment
3. Prueba la funcionalidad en el preview antes de hacer merge a main

## 🚨 Errores Comunes y Soluciones

### Error: "Module not found"

**Causa:** Imports incorrectos o dependencias faltantes.

**Solución:**
1. Verifica que todos los imports usen rutas correctas
2. Asegúrate de que las dependencias estén en `package.json`
3. Revisa que no haya imports de archivos que no existen

### Error: "Environment variable not defined"

**Causa:** Variables de entorno no configuradas en Vercel.

**Solución:**
1. Configura las variables en Vercel Dashboard (ver punto 1)
2. Usa valores por defecto en tu código:
```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'https://default-api.com'
```

### Error: "Network request failed" o "CORS"

**Causa:** URLs incorrectas o problemas de CORS.

**Solución:**
1. Verifica que `VITE_BACKEND_URL` apunte a la URL correcta
2. Asegúrate de que tu backend permita requests desde tu dominio de Vercel
3. Configura headers CORS en `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
```

### Error: "Internal JSON-RPC error"

**Causa:** Problemas con la conexión a la blockchain o WalletConnect.

**Solución:**
1. Verifica `VITE_WALLETCONNECT_PROJECT_ID`
2. Asegúrate de que la configuración de red sea correcta
3. Revisa que los RPCs estén accesibles desde Vercel

## 🔄 Proceso de Debugging Paso a Paso

### Paso 1: Reproducir Localmente
```bash
# Simular entorno de producción
npm run build
npm run preview
```

### Paso 2: Verificar Variables
```bash
# Crear archivo .env.production.local con las mismas variables que Vercel
cp .env .env.production.local
# Editar y ajustar URLs para producción
```

### Paso 3: Revisar Network Tab
1. Abre DevTools en tu deployment de Vercel
2. Ve a la pestaña **Network**
3. Busca requests fallidos (rojos)
4. Revisa los errores específicos

### Paso 4: Comparar Entornos
```bash
# En local (desarrollo)
console.log('Environment:', import.meta.env)

# En Vercel (producción)
# El componente de diagnóstico mostrará esta información automáticamente
```

## 📞 Obtener Ayuda

Si sigues teniendo problemas:

1. **Copia el diagnóstico:** Usa el botón "Copiar Diagnóstico" en el componente
2. **Revisa los logs:** Vercel Dashboard → Tu proyecto → Deployments → Logs
3. **Crea un issue:** Incluye el diagnóstico y los logs de Vercel

## 🎯 Consejos de Prevención

1. **Siempre prueba con `npm run preview`** antes de deployar
2. **Usa variables de entorno para todas las URLs**
3. **Configura alertas en Vercel** para deployments fallidos
4. **Mantén un deployment de staging** para testing
5. **Documenta todas las variables de entorno** necesarias

---

💡 **Tip:** El componente de diagnóstico se mostrará automáticamente cuando detecte problemas. ¡Úsalo como tu primera herramienta de debugging!