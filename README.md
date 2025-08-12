<div align="center">
  <h1>🚀 CoreWeave Agents</h1>
  <p><strong>Plataforma de Lanzamiento de Tokens con Agentes IA Inteligentes</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-5.4.19-purple?style=for-the-badge&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind-3.4.17-cyan?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
  </p>
</div>

## 📋 Descripción

**CoreWeave Agents** es una plataforma revolucionaria que permite a los usuarios crear, lanzar y gestionar tokens de criptomonedas en CoreDAO con la asistencia de **agentes de inteligencia artificial** completamente automatizados.

### ✨ Características Principales

- 🤖 **Agentes IA Especializados**: Community Manager, Marketing AI, Data Analyst y Trading Assistant
- 🚀 **Wizard de Lanzamiento**: Proceso guiado en 4 pasos para crear tokens
- 📊 **Analytics Avanzados**: Métricas en tiempo real y análisis de rendimiento
- 🔍 **Monitoreo 24/7**: Logs del sistema, actividad blockchain y alertas
- 🎨 **UI Moderna**: Diseño responsivo con modo oscuro/claro
- ⚡ **Automatización Total**: Marketing, comunidad y trading automatizados

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de construcción rápida
- **React Router DOM** - Enrutamiento del lado del cliente

### UI/UX
- **shadcn/ui** - Componentes de interfaz de usuario
- **Tailwind CSS** - Framework de CSS utilitario
- **Radix UI** - Componentes primitivos accesibles
- **Lucide React** - Iconos modernos
- **next-themes** - Soporte para temas

### Estado y Datos
- **TanStack Query** - Gestión de estado del servidor
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Recharts** - Gráficos y visualizaciones

### Blockchain & Web3
- **Wagmi** - Hooks de React para Ethereum
- **RainbowKit** - Conexión de wallets
- **Ethers.js** - Biblioteca para interactuar con Ethereum
- **CoreDAO** - Blockchain principal (Chain ID: 1116)
- **Solidity ^0.8.19** - Lenguaje de contratos inteligentes
- **OpenZeppelin** - Contratos seguros y auditados

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Passport.js** - Autenticación OAuth
- **JWT** - Tokens de autenticación
- **Ethers.js** - Interacción con blockchain

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ ([instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <YOUR_GIT_URL>
cd coreweave-agents

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Construcción para producción
npm run build:dev  # Construcción en modo desarrollo
npm run lint       # Linter de código
npm run preview    # Vista previa de la construcción
```

## 🔧 Desarrollo y Deployment de Contratos

### 📝 Preparación del Entorno

#### 1. Configuración de Remix IDE
1. Abrir [Remix IDE](https://remix.ethereum.org)
2. Crear carpeta `contracts/`
3. Subir los archivos `.sol`
4. Configurar compilador:
   ```
   Solidity: 0.8.19
   EVM Version: paris
   Optimizer: Enabled (200 runs)
   ```

#### 2. Configuración de Wallet
1. Instalar MetaMask
2. Agregar red CoreDAO:
   - **Network Name**: CoreDAO Mainnet
   - **RPC URL**: https://rpc.coredao.org
   - **Chain ID**: 1116
   - **Currency**: CORE
   - **Explorer**: https://scan.coredao.org

### 🚀 Proceso de Deployment Paso a Paso

#### Paso 1: Deploy CoreWeaveToken
```solidity
// Constructor parameters:
string memory name = "Mi Token";
string memory symbol = "MTK";
uint256 initialSupply = 1000000; // 1M tokens
address owner = msg.sender;
```

#### Paso 2: Deploy CoreWeaveTokenFactory
```solidity
// Constructor parameters:
address tokenImplementation = [DIRECCION_DEL_TOKEN_PASO_1];
uint256 creationFee = 1000000000000000000; // 1 CORE
address feeRecipient = msg.sender;
```

#### Paso 3: Deploy AIAgentManager
```solidity
// Constructor parameters:
address tokenFactory = [DIRECCION_DEL_FACTORY_PASO_2];
uint256 agentCreationFee = 500000000000000000; // 0.5 CORE
```

#### Paso 4: Configuración Post-Deployment
1. **En TokenFactory**: Configurar fees
   ```solidity
   setCreationFee(newFee);
   setFeeRecipient(newRecipient);
   ```

2. **En AIAgentManager**: Autorizar tokens
   ```solidity
   authorizeToken(tokenAddress, true);
   ```

### 🧪 Testing y Verificación

#### Tests Básicos
1. **Token Creation**:
   ```javascript
   // Crear token via factory
   await factory.createToken("Test", "TST", 1000000);
   ```

2. **Agent Creation**:
   ```javascript
   // Crear agente para token
   await agentManager.createAgent(tokenAddress, agentType, budget);
   ```

#### Verificación en CoreScan
1. Ir a [CoreScan](https://scan.coredao.org)
2. Buscar dirección del contrato
3. Verificar código fuente
4. Confirmar transacciones

### 📊 Monitoreo y Mantenimiento

#### Métricas Importantes
- Gas usado por transacción
- Fees generados
- Tokens creados exitosamente
- Agentes activos
- Errores de deployment

#### Logs y Eventos
```solidity
// Eventos importantes a monitorear:
event TokenCreated(address indexed token, address indexed creator);
event AgentCreated(address indexed token, uint256 agentType);
event FeeUpdated(uint256 oldFee, uint256 newFee);
```

### 🔄 Actualización de Contratos

#### Estrategia de Upgrades
1. **Proxy Pattern**: Para contratos upgradeables
2. **Factory Pattern**: Para nuevas versiones
3. **Migration Scripts**: Para datos existentes

#### Backup y Recovery
- Backup de direcciones de contratos
- Backup de configuraciones
- Plan de contingencia para fallos

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base de shadcn/ui
│   ├── agent-card.tsx  # Tarjetas de agentes IA
│   ├── app-sidebar.tsx # Barra lateral de navegación
│   ├── layout.tsx      # Layout principal
│   └── token-card.tsx  # Tarjetas de tokens
├── pages/              # Páginas de la aplicación
│   ├── TokenDashboard.tsx     # Dashboard principal
│   ├── TokenLaunchWizard.tsx  # Wizard de lanzamiento
│   ├── Analytics.tsx          # Métricas y análisis
│   ├── Monitor.tsx            # Monitoreo en tiempo real
│   └── CreateAgent.tsx        # Creación de agentes
├── hooks/              # Hooks personalizados
│   ├── use-mobile.tsx  # Hook para detección móvil
│   └── use-toast.ts    # Hook para notificaciones
└── lib/                # Utilidades y configuración
    └── utils.ts        # Funciones utilitarias
```

## 🤖 Agentes IA Disponibles

| Agente | Descripción | Canales | Características |
|--------|-------------|---------|----------------|
| **Community Manager** | Gestión de comunidad automática | Discord, Telegram | Respuestas automáticas, Moderación, Eventos |
| **Marketing AI** | Campañas y promoción automatizada | Twitter, Reddit | Posts programados, Influencer outreach, Tendencias |
| **Data Analyst** | Análisis de mercado y métricas | Dashboard | Reportes automáticos, Alertas, Predicciones |
| **Trading Assistant** | Soporte para trading y liquidez | DEX | Market making, Arbitraje, Alertas de precio |

## 🔗 Arquitectura de Contratos Inteligentes

### 📋 Contratos Principales

La plataforma utiliza una arquitectura modular de contratos inteligentes desplegados en **CoreDAO**:

#### 1. **CoreWeaveToken.sol** - Token ERC-20 Mejorado
```solidity
// Características principales:
- ✅ Estándar ERC-20 con extensiones
- 🤖 Configuración de agentes IA integrada
- 🔐 Control de acceso para agentes autorizados
- 📊 Métricas de lanzamiento y actividad
- ⚡ Optimizado para gas en CoreDAO
```

#### 2. **CoreWeaveTokenFactory.sol** - Fábrica de Tokens
```solidity
// Funcionalidades:
- 🏭 Creación masiva de tokens
- 💰 Sistema de fees configurable
- 📝 Registro de todos los tokens creados
- 👤 Gestión de tokens por usuario
- 🔍 Consultas públicas de información
```

#### 3. **AIAgentManager.sol** - Gestor de Agentes IA
```solidity
// Capacidades:
- 🤖 Creación y gestión de agentes
- 💼 Control de presupuestos
- 🔄 Activación/desactivación de agentes
- 📊 Métricas de rendimiento
- 🔐 Autorización de tokens
```

### 🚀 Proceso de Deployment

#### Orden de Deployment (CRÍTICO)
1. **CoreWeaveToken.sol** (Primero)
2. **CoreWeaveTokenFactory.sol** (Segundo)
3. **AIAgentManager.sol** (Tercero)

#### Configuración de Red CoreDAO
```javascript
// Configuración para Remix/Hardhat
network: {
  chainId: 1116,
  rpc: "https://rpc.coredao.org",
  explorer: "https://scan.coredao.org",
  currency: "CORE"
}
```

#### Parámetros de Compilación
```solidity
// Configuración recomendada
Solidity: ^0.8.19
EVM Version: paris
Optimizer: 200 runs
License: MIT
```

### 💡 Funcionalidades Avanzadas

#### Token Factory Features
- **Creación Instantánea**: Deploy de tokens en una transacción
- **Configuración AI**: Habilitación automática de agentes
- **Fee Management**: Sistema de tarifas flexible
- **User Dashboard**: Tokens por usuario
- **Global Registry**: Registro público de todos los tokens

#### AI Agent Integration
- **Multi-Agent Support**: Hasta 4 tipos de agentes por token
- **Budget Control**: Gestión de presupuestos por agente
- **Real-time Monitoring**: Estado y actividad en tiempo real
- **Configuration Management**: Personalización de comportamiento
- **Authorization System**: Control de acceso granular

### 🔧 Integración con Frontend

#### Conexión de Contratos
```typescript
// Configuración en React
const CONTRACTS = {
  TOKEN_FACTORY: "0x...",
  AI_AGENT_MANAGER: "0x...",
  CORE_DAO_CHAIN_ID: 1116
};
```

#### Hooks Personalizados
- `useTokenFactory()` - Interacción con factory
- `useAIAgents()` - Gestión de agentes
- `useTokenData()` - Datos de tokens
- `useWallet()` - Conexión de wallet

### 📊 Métricas y Analytics

#### On-Chain Data
- Total de tokens creados
- Agentes activos por token
- Volumen de transacciones
- Fees generados
- Usuarios únicos

#### Real-time Monitoring
- Estado de agentes IA
- Actividad de contratos
- Gas utilizado
- Errores y eventos

## 📱 Páginas Principales

### 🏠 Dashboard de Tokens
- Vista general de todos los tokens lanzados
- Estadísticas de market cap, holders y agentes activos
- Filtros por estado: live, launching, paused, completed
- Búsqueda y ordenamiento avanzado

### 🧙‍♂️ Wizard de Lanzamiento
1. **Configuración del Token**: Nombre, símbolo, supply inicial
2. **Agentes IA**: Selección y configuración de agentes
3. **Estrategias de Marketing**: Campañas automatizadas
4. **Confirmación**: Revisión y lanzamiento

### 📊 Analytics
- Métricas de rendimiento en tiempo real
- Análisis de uso de tokens por agente
- Costos operativos y ROI
- Gráficos interactivos y reportes

### 🔍 Monitoreo
- Logs del sistema en tiempo real
- Historial de mensajes de agentes
- Actividad blockchain y transacciones
- Panel de pruebas para agentes

## 🎨 Características de UI/UX

- ✅ **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- 🌙 **Modo Oscuro/Claro**: Cambio automático según preferencias del sistema
- ♿ **Accesibilidad**: Componentes accesibles con Radix UI
- 🎭 **Animaciones Suaves**: Transiciones fluidas con Tailwind CSS
- 🔔 **Notificaciones**: Toasts y alertas en tiempo real
- 📱 **Sidebar Colapsible**: Navegación optimizada para espacios reducidos

## 🚀 Despliegue

### Desarrollo
```bash
npm run build:dev
npm run preview
```

### Producción
```bash
npm run build
```

### Plataformas Soportadas
- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**
- **Servidor propio**

## 🔐 Seguridad y Mejores Prácticas

### 🛡️ Consideraciones de Seguridad

#### Smart Contracts
- **Auditorías**: Realizar auditorías antes del deployment en mainnet
- **OpenZeppelin**: Usar contratos auditados y probados
- **Access Control**: Implementar roles y permisos adecuados
- **Reentrancy Guards**: Protección contra ataques de reentrancia
- **Integer Overflow**: Usar SafeMath o Solidity ^0.8.0

#### Frontend Security
- **Input Validation**: Validar todas las entradas del usuario
- **XSS Protection**: Sanitizar contenido dinámico
- **HTTPS**: Usar siempre conexiones seguras
- **Environment Variables**: No exponer claves privadas
- **Wallet Security**: Validar conexiones de wallet

### 📋 Checklist Pre-Deployment

#### Contratos Inteligentes
- [ ] Código auditado y revisado
- [ ] Tests unitarios completos (>90% coverage)
- [ ] Tests de integración funcionando
- [ ] Gas optimization implementado
- [ ] Eventos y logs configurados
- [ ] Access control verificado
- [ ] Parámetros de constructor validados
- [ ] Upgrade strategy definida

#### Frontend
- [ ] Conexión a red correcta (CoreDAO)
- [ ] Direcciones de contratos actualizadas
- [ ] Error handling implementado
- [ ] Loading states configurados
- [ ] Responsive design verificado
- [ ] Performance optimizado
- [ ] SEO básico implementado

### 🚨 Manejo de Errores

#### Errores Comunes de Contratos
```solidity
// Ejemplos de manejo de errores
require(amount > 0, "Amount must be greater than 0");
require(msg.value >= creationFee, "Insufficient fee");
require(authorizedTokens[token], "Token not authorized");
```

#### Errores de Frontend
```typescript
// Manejo de errores de wallet
try {
  const tx = await contract.createToken(name, symbol, supply);
  await tx.wait();
} catch (error) {
  if (error.code === 4001) {
    // Usuario rechazó transacción
  } else if (error.code === -32603) {
    // Error de red o contrato
  }
}
```

### 📊 Monitoring y Alertas

#### Métricas Críticas
- **Gas Price**: Monitorear precios de gas en CoreDAO
- **Contract Balance**: Verificar balances de contratos
- **Failed Transactions**: Alertas por transacciones fallidas
- **Unusual Activity**: Detectar patrones anómalos
- **Performance**: Tiempo de respuesta de la aplicación

#### Herramientas Recomendadas
- **Tenderly**: Debugging y monitoring
- **Defender**: Automatización y alertas
- **Sentry**: Error tracking en frontend
- **Analytics**: Google Analytics o Mixpanel

### 🔄 Plan de Contingencia

#### Escenarios de Emergencia
1. **Bug Crítico en Contrato**:
   - Pausar operaciones si es posible
   - Comunicar a usuarios inmediatamente
   - Preparar contrato de migración

2. **Problema de Red CoreDAO**:
   - Mostrar estado de red en UI
   - Implementar retry automático
   - Comunicación proactiva

3. **Ataque o Exploit**:
   - Protocolo de respuesta rápida
   - Contactos de emergencia
   - Plan de comunicación

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) por los componentes de UI
- [Tailwind CSS](https://tailwindcss.com/) por el framework de CSS
- [Lucide](https://lucide.dev/) por los iconos
- [Radix UI](https://www.radix-ui.com/) por los primitivos accesibles

---

<div align="center">
  <p>Hecho con ❤️ para la comunidad CoreDAO</p>
  <p>
    <a href="#">🌐 Website</a> •
    <a href="#">📚 Docs</a> •
    <a href="#">🐦 Twitter</a> •
    <a href="#">💬 Discord</a>
  </p>
</div>
