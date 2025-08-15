# CoreWeaveToken.sol - Explicación del Contrato

## ¿Qué es CoreWeaveToken.sol?

El contrato `CoreWeaveToken.sol` es un **token ERC-20 individual** que sirve como plantilla base para todos los tokens que se crean a través del sistema CoreWeave Token Factory.

## Función en el Sistema

### 1. **Plantilla de Token Base**
- Es el contrato que se despliega cada vez que alguien crea un nuevo token usando el Token Factory
- Contiene toda la funcionalidad estándar ERC-20 (transfer, approve, balanceOf, etc.)
- Incluye funcionalidades adicionales específicas para tokens con agentes AI

### 2. **Funcionalidades Principales**

#### **Funcionalidad ERC-20 Estándar:**
- `transfer()` - Transferir tokens
- `approve()` - Aprobar gastos
- `balanceOf()` - Consultar balance
- `totalSupply()` - Supply total

#### **Funcionalidades AI Específicas:**
- `configureAIAgents()` - Configurar qué agentes AI están activos
- `getAIAgentsConfig()` - Obtener configuración actual de agentes
- Flags para diferentes tipos de agentes:
  - Community Manager
  - Marketing AI
  - Data Analyst
  - Trading Assistant

### 3. **Relación con el Factory**

```
CoreWeaveTokenFactory.sol
    |
    ├── createToken() ──► Despliega nuevo CoreWeaveToken.sol
    ├── getAllTokens() ──► Lista todos los tokens creados
    └── getUserTokens() ──► Lista tokens de un usuario
```

### 4. **Flujo de Creación**

1. **Usuario usa el Token Launcher** → Llena formulario con nombre, símbolo, supply
2. **Frontend llama a Factory** → `createToken(name, symbol, totalSupply, enableAIAgents)`
3. **Factory despliega nuevo CoreWeaveToken** → Crea instancia individual del contrato
4. **Token queda registrado** → Se guarda en la lista del Factory
5. **Dashboard muestra el token** → Aparece en la lista de tokens lanzados

### 5. **¿Por qué se necesita este contrato?

- **Separación de responsabilidades**: El Factory maneja la creación, cada token maneja su propia lógica
- **Escalabilidad**: Cada token es independiente y puede tener su propia configuración
- **Flexibilidad**: Permite diferentes configuraciones de AI por token
- **Estándar ERC-20**: Garantiza compatibilidad con wallets y exchanges

### 6. **Ejemplo Práctico**

Cuando creas un token llamado "MemeAI" con símbolo "MEMEAI":

1. Se despliega una nueva instancia de `CoreWeaveToken.sol`
2. Esta instancia tiene su propia dirección de contrato
3. El token "MemeAI" puede configurar sus propios agentes AI
4. Es completamente independiente de otros tokens creados

## Resumen

**CoreWeaveToken.sol** = Plantilla individual de token ERC-20 con funcionalidades AI
**CoreWeaveTokenFactory.sol** = Fábrica que crea múltiples instancias de CoreWeaveToken

Cada token creado es una instancia separada e independiente del contrato CoreWeaveToken.sol.