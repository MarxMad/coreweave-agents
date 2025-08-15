import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout";
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

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <ThemeProvider defaultTheme="system">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<TokenDashboard />} />
                  <Route path="/launch" element={<TokenLaunchWizard />} />
                  <Route path="/factory" element={<TokenFactory />} />
                  <Route path="/ai-agents" element={<AIAgentManager />} />
                  <Route path="/monitor" element={<Monitor />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/strategies" element={<Strategies />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
