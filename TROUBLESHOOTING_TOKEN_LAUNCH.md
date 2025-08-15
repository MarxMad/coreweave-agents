# 🔧 Troubleshooting: Token Launch Issues

## Problema Identificado

El error "Internal JSON-RPC error" que estás experimentando indica un problema de conectividad o configuración con la blockchain CoreDAO.

### Error Específico:
```
MetaMask - RPC Error: Internal JSON-RPC error.
The contract function "createToken" reverted with the following reason:
Internal JSON-RPC error.
```

## Posibles Causas y Soluciones

### 1. 🌐 Problema de Conectividad RPC

**Causa**: Los endpoints RPC de CoreDAO pueden estar experimentando problemas de conectividad.

**Solución**:
- ✅ **Ya implementado**: Reorganicé los endpoints RPC priorizando `https://rpc.coredao.org`
- Verifica tu conexión a internet
- Intenta cambiar de red WiFi si es posible

### 2. 📍 Verificación del Contrato

**Causa**: El contrato puede no estar desplegado correctamente en la dirección especificada.

**Dirección actual del contrato**: `0x8aD6bEa6027a4006EDd49E86Ec6E5A8dEf0a63d2`

**Verificación manual**:
1. Ve a [CoreScan](https://scan.coredao.org/)
2. Busca la dirección: `0x8aD6bEa6027a4006EDd49E86Ec6E5A8dEf0a63d2`
3. Verifica que el contrato esté desplegado y verificado

### 3. 💰 Problemas de Gas y Fees

**Causa**: Insuficientes fondos CORE para pagar gas + creation fee.

**Verificación**:
- Creation fee actual: `0.01 CORE` (10000000000000000 wei)
- Gas estimado: ~0.005-0.01 CORE adicional
- **Total necesario**: ~0.015-0.02 CORE mínimo

**Solución**:
- Asegúrate de tener al menos 0.05 CORE en tu wallet
- Verifica el balance en MetaMask

### 4. 🔧 Configuración de MetaMask

**Verificación de Red CoreDAO**:
```
Network Name: Core Blockchain
RPC URL: https://rpc.coredao.org
Chain ID: 1116
Currency Symbol: CORE
Block Explorer: https://scan.coredao.org
```

**Pasos para verificar**:
1. Abre MetaMask
2. Verifica que estés en la red "Core Blockchain"
3. Si no aparece, agrégala manualmente con los datos de arriba

### 5. 🔄 Reinicio de Estado

**Causa**: Estado corrupto en la aplicación o MetaMask.

**Solución**:
1. Refresca la página (F5)
2. Desconecta y reconecta tu wallet
3. Si persiste, reinicia MetaMask:
   - Configuración → Avanzado → Restablecer cuenta

## 🚀 Pasos de Diagnóstico Recomendados

### Paso 1: Verificación Básica
- [ ] Verificar balance CORE (mínimo 0.05 CORE)
- [ ] Confirmar red CoreDAO (Chain ID: 1116)
- [ ] Verificar conexión a internet estable

### Paso 2: Verificación del Contrato
- [ ] Buscar `0x8aD6bEa6027a4006EDd49E86Ec6E5A8dEf0a63d2` en CoreScan
- [ ] Verificar que el contrato esté desplegado
- [ ] Verificar que el contrato esté verificado

### Paso 3: Prueba con Parámetros Simples
Intenta crear un token con:
- Nombre: "Test"
- Símbolo: "TEST"
- Supply: "1000"
- AI Agents: Deshabilitado

### Paso 4: Verificación de Logs
Abre las herramientas de desarrollador (F12) y revisa:
- Console tab para errores JavaScript
- Network tab para errores de red

## 🔧 Mejoras Implementadas

### ✅ Configuración RPC Mejorada
- Reorganización de endpoints RPC priorizando el oficial
- Mejor manejo de errores de conexión

### ✅ Manejo de Estados Mejorado
- Reset automático después de errores
- Timeout reducido de 5 a 3 minutos
- Botón de cancelar durante transacciones
- Visualización de errores en tiempo real

### ✅ UX Mejorada
- Indicadores visuales de estado
- Mensajes de error más descriptivos
- Botones de acción contextuales

## 📞 Próximos Pasos

1. **Verificar el contrato manualmente** en CoreScan
2. **Confirmar balance suficiente** de CORE
3. **Intentar transacción simple** con parámetros básicos
4. **Reportar hallazgos** para diagnóstico adicional

## 🆘 Si el Problema Persiste

Si después de seguir estos pasos el problema continúa:

1. **Redeployar contratos**: Puede ser necesario redesplegar en una nueva dirección
2. **Usar testnet**: Probar primero en CoreDAO testnet
3. **Contactar soporte**: Reportar el issue con logs específicos

---

**Nota**: Este documento se actualizará conforme se identifiquen y resuelvan más problemas.