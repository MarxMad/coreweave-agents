import { useState, useEffect } from "react"
import { ArrowRight, Bot, Zap, Shield, TrendingUp, Users, Code, Cpu, Network, ChevronDown, ExternalLink, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"

const features = [
  {
    icon: Bot,
    title: "AI Agents Autónomos",
    description: "Agentes inteligentes que operan 24/7 gestionando tu token de forma autónoma",
    details: ["Community Management", "Marketing Automation", "Data Analysis", "Trading Support"]
  },
  {
    icon: Shield,
    title: "Seguridad Blockchain",
    description: "Contratos inteligentes auditados en Core Chain para máxima seguridad",
    details: ["Smart Contracts Verificados", "Fondos Seguros", "Transparencia Total", "Sin Intermediarios"]
  },
  {
    icon: TrendingUp,
    title: "Crecimiento Escalable",
    description: "Impulsa el crecimiento de tu token con estrategias automatizadas",
    details: ["Marketing Inteligente", "Engagement Automático", "Análisis Predictivo", "Optimización Continua"]
  },
  {
    icon: Network,
    title: "Ecosistema Core",
    description: "Integración nativa con Core Chain para máximo rendimiento",
    details: ["Bajas Comisiones", "Transacciones Rápidas", "EVM Compatible", "Escalabilidad"]
  }
]

const benefits = [
  {
    title: "Para Proyectos de Tokens",
    items: [
      "Gestión automatizada de comunidad",
      "Marketing 24/7 sin intervención manual",
      "Análisis de mercado en tiempo real",
      "Reducción de costos operativos hasta 80%"
    ]
  },
  {
    title: "Para el Ecosistema Core",
    items: [
      "Mayor actividad en la red",
      "Incremento en transacciones",
      "Atracción de nuevos proyectos",
      "Fortalecimiento del ecosistema DeFi"
    ]
  },
  {
    title: "Para Inversores",
    items: [
      "Tokens con gestión profesional",
      "Transparencia total en operaciones",
      "Crecimiento sostenible",
      "Menor riesgo por automatización"
    ]
  }
]

const steps = [
  {
    number: "01",
    title: "Conecta tu Wallet",
    description: "Conecta tu wallet compatible con Core Chain",
    icon: Shield
  },
  {
    number: "02",
    title: "Autoriza tu Token",
    description: "Autoriza el contrato de tu token para crear agentes",
    icon: Code
  },
  {
    number: "03",
    title: "Configura tu Agente",
    description: "Selecciona el tipo de agente y configura sus parámetros",
    icon: Bot
  },
  {
    number: "04",
    title: "Despliega y Monitorea",
    description: "Tu agente comienza a trabajar automáticamente",
    icon: TrendingUp
  }
]

export default function Landing() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge variant="outline" className="mb-6 text-sm px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Powered by Core Chain
            </Badge>
            
            <h1 className="text-4xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              CoreWeave Agents
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              La primera plataforma de <span className="text-primary font-semibold">Agentes IA Autónomos</span> para tokens en Core Chain. 
              Automatiza la gestión, marketing y crecimiento de tu proyecto cripto.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 group"
                onClick={() => navigate('/token-factory')}
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => scrollToSection('how-it-works')}
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Cómo Funciona
              </Button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Operación Continua</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">80%</div>
                <div className="text-sm text-muted-foreground">Reducción de Costos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">4</div>
                <div className="text-sm text-muted-foreground">Tipos de Agentes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Automatizado</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Tecnología de Vanguardia</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Combinamos Inteligencia Artificial avanzada con la seguridad y escalabilidad de Core Chain
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {feature.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Cómo Funciona</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Un proceso simple y seguro para desplegar tu agente IA en minutos
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Beneficios para Todo el Ecosistema</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              CoreWeave Agents no solo beneficia a tu proyecto, sino que fortalece todo el ecosistema Core
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl mb-4">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {benefit.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-left">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Stack Tecnológico</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Construido con las mejores tecnologías para máximo rendimiento y seguridad
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                <Network className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Core Chain</h3>
              <p className="text-sm text-muted-foreground">Blockchain EVM compatible</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Smart Contracts</h3>
              <p className="text-sm text-muted-foreground">Solidity + Hardhat</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                <Cpu className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI Engine</h3>
              <p className="text-sm text-muted-foreground">Machine Learning</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">React + TypeScript</h3>
              <p className="text-sm text-muted-foreground">Frontend moderno</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">¿Listo para Revolucionar tu Token?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a la nueva era de gestión automatizada de tokens con IA. Comienza gratis hoy mismo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 group"
              onClick={() => navigate('/token-factory')}
            >
              Crear mi Primer Agente
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/ai-agent-manager')}
            >
              Ver Agentes Existentes
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>100% Seguro</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Despliegue Instantáneo</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span>IA Avanzada</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}