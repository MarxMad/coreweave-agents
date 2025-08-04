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
