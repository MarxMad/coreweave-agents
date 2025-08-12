# Wallet Integration Setup

Esta aplicación ahora incluye integración completa de wallet usando RainbowKit y Wagmi para conectar con CoreDAO y otras redes.

## Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura:

```env
# Obtén tu Project ID desde https://cloud.walletconnect.com/
VITE_WALLETCONNECT_PROJECT_ID=tu-project-id-aqui

# URL RPC de CoreDAO (opcional, usa el público por defecto)
VITE_COREDAO_RPC_URL=https://rpc.coredao.org

# Entorno de la aplicación
VITE_APP_ENV=development
```

### 2. Obtener WalletConnect Project ID

1. Ve a [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia el Project ID y úsalo en tu archivo `.env`

## Funcionalidades Implementadas

### 🔗 Conexión de Wallet
- Soporte para múltiples wallets (MetaMask, WalletConnect, Coinbase, etc.)
- Detección automática de red CoreDAO
- Cambio de red automático
- Desconexión de wallet

### 📊 Información de Wallet
- Dirección de wallet abreviada
- Balance de CORE tokens
- Estado de conexión en tiempo real
- Indicador de red correcta/incorrecta

### 🎯 Integración en la UI
- Botón de conexión en la sidebar
- Componente de información de wallet en el dashboard
- Sección de wallet en el formulario de creación de agentes
- Indicadores visuales de estado

## Componentes Principales

### `WalletConnect`
Componente principal para conectar/desconectar wallet con UI personalizada.

### `WalletInfo`
Muestra información detallada del wallet conectado en formato de tarjeta.

### `useWallet` Hook
Hook personalizado que proporciona:
- Estado de conexión
- Información de la cuenta
- Balance
- Funciones de conexión/desconexión
- Detección de red CoreDAO

## Redes Soportadas

- **CoreDAO Mainnet** (ID: 1116) - Red principal
- Ethereum Mainnet
- Polygon
- Optimism
- Arbitrum
- Base

## Uso en Desarrollo

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Conecta tu wallet usando el botón en la sidebar

5. Asegúrate de estar en la red CoreDAO para funcionalidad completa

## Estructura de Archivos

```
src/
├── components/
│   ├── wallet-connect.tsx     # Componente de conexión
│   └── wallet-info.tsx        # Información de wallet
├── hooks/
│   └── use-wallet.ts          # Hook personalizado
├── lib/
│   └── wagmi.ts              # Configuración de Wagmi
└── pages/
    ├── Dashboard.tsx         # Dashboard con info de wallet
    └── CreateAgent.tsx       # Formulario con integración
```

## Próximos Pasos

- [ ] Implementar transacciones reales
- [ ] Agregar soporte para tokens ERC-20
- [ ] Integrar con contratos inteligentes de agentes
- [ ] Añadir historial de transacciones
- [ ] Implementar firma de mensajes

## Troubleshooting

### Wallet no se conecta
- Verifica que el Project ID de WalletConnect sea válido
- Asegúrate de que tu wallet esté desbloqueada
- Revisa la consola del navegador para errores

### Red incorrecta
- Cambia manualmente a CoreDAO en tu wallet
- O usa el botón de cambio de red en la aplicación

### Balance no se muestra
- Verifica que estés en la red CoreDAO
- Asegúrate de tener algunos tokens CORE para gas