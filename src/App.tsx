import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { logEnvironmentStatus, getEnvironmentSummary } from './utils/environment-check';
import VercelDiagnostics from '@/components/vercel-diagnostics';
import { Layout } from "@/components/layout";
import Landing from "./pages/Landing";
import TokenDashboard from "./pages/TokenDashboard";
import TokenLaunchWizard from "./pages/TokenLaunchWizard";
import TokenFactory from './pages/TokenFactory';
import AIAgentManager from './pages/AIAgentManager';
import Monitor from "./pages/Monitor";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

import Strategies from "./pages/Strategies";
import Settings from "./pages/Settings";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const App = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    logEnvironmentStatus();
    
    // Mostrar diagnósticos si hay problemas críticos o si estamos en producción con errores
    const summary = getEnvironmentSummary();
    const shouldShow = summary.critical || (import.meta.env.PROD && (summary.errors > 0 || summary.warnings > 0));
    setShowDiagnostics(shouldShow);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider defaultTheme="system">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                {showDiagnostics && (
                  <div className="border-b bg-muted/30 p-4">
                    <div className="container mx-auto">
                      <VercelDiagnostics showOnlyErrors={true} autoRefresh={import.meta.env.PROD} />
                    </div>
                  </div>
                )}
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/dashboard" element={<Layout><TokenDashboard /></Layout>} />
                  <Route path="/launch" element={<Layout><TokenLaunchWizard /></Layout>} />
                  <Route path="/token-factory" element={<Layout><TokenFactory /></Layout>} />
                  <Route path="/ai-agent-manager" element={<Layout><AIAgentManager /></Layout>} />
                  <Route path="/monitor" element={<Layout><Monitor /></Layout>} />
                  <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
                  <Route path="/strategies" element={<Layout><Strategies /></Layout>} />
                  <Route path="/settings" element={<Layout><Settings /></Layout>} />
                  <Route path="*" element={<Layout><NotFound /></Layout>} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
