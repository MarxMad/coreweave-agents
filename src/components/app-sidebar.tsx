import { useState } from "react"
import { 
  Rocket, 
  LayoutDashboard, 
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
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Token Factory", url: "/token-factory", icon: Factory },
  { title: "Launch Token", url: "/launch", icon: Rocket },
  { title: "AI Agent Manager", url: "/ai-agent-manager", icon: Brain },
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
      ? "bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary font-medium border-r-2 border-primary shadow-lg backdrop-blur-sm relative overflow-hidden" 
      : "hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 text-muted-foreground hover:text-foreground hover:shadow-md transition-all duration-300 hover:backdrop-blur-sm"

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-600/50 relative overflow-hidden`}
      collapsible="icon"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-purple-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>
      <div className="absolute top-1/4 left-1/2 w-32 h-32 bg-primary/10 rounded-full blur-2xl transform -translate-x-1/2"></div>
      <div className="absolute bottom-1/4 left-1/2 w-24 h-24 bg-purple-500/10 rounded-full blur-xl transform -translate-x-1/2"></div>
      <SidebarContent className="pt-4 relative z-10">
        {/* Logo/Brand */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl border border-primary/30">
                <img 
                  src="/CorewL.png" 
                  alt="CoreWeave Logo" 
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-sm"></div>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  CoreWeave
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Token Launchpad
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Wallet Connection */}
        <div className={`${collapsed ? 'px-2' : 'px-6'} pb-4`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl blur-sm"></div>
            <div className="relative">
              <WalletConnect collapsed={collapsed} />
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent className="p-2">
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group relative rounded-lg mx-2 px-3 py-2 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-300">
                    <NavLink to={item.url} className={`${getNavCls} flex items-center gap-3 w-full`}>
                      <div className="relative">
                        <item.icon className="h-4 w-4 relative z-10" />
                        <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      {!collapsed && <span className="relative z-10">{item.title}</span>}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
              <div className="relative group">
                <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 px-4 py-3 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Rocket className="h-5 w-5 relative z-10" />
                  <span className="text-sm font-bold relative z-10">Launch Token</span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
              </div>
            </NavLink>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}