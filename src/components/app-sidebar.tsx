import { useState } from "react"
import { 
  Rocket, 
  LayoutDashboard, 
  Plus, 
  Activity, 
  BarChart3, 
  Settings,
  Zap,
  Target,
  TrendingUp,
  Users,
  Factory,
  Brain,
  Home
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { WalletConnect } from "@/components/wallet-connect"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const mainItems = [
  { title: "Inicio", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Launch Token", url: "/launch", icon: Rocket },
  { title: "Token Factory", url: "/token-factory", icon: Factory },

  { title: "AI Monitoring", url: "/monitor", icon: Activity },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
]

const toolsItems = [
  { title: "AI Strategies", url: "/strategies", icon: Users },
  { title: "AI Agent Manager", url: "/ai-agent-manager", icon: Brain },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/"
    }
    return currentPath.startsWith(path)
  }

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="pt-4">
        {/* Logo/Brand */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center">
              <img 
                src="/CorewL.png" 
                alt="CoreWeave Logo" 
                className="h-8 w-8 object-contain"
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold">CoreWeave</span>
                <span className="text-xs text-muted-foreground">Token Launchpad</span>
              </div>
            )}
          </div>
        </div>

        {/* Wallet Connection */}
        <div className={`${collapsed ? 'px-2' : 'px-6'} pb-4`}>
          <WalletConnect collapsed={collapsed} />
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Action */}
        {!collapsed && (
          <div className="mt-auto p-4">
            <NavLink to="/launch">
              <div className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-colors hover:bg-primary-hover">
                <Rocket className="h-4 w-4" />
                <span className="text-sm font-medium">Launch Token</span>
              </div>
            </NavLink>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}