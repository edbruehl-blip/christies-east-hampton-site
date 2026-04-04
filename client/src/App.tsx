/**
 * App.tsx — Christie's East Hampton Re-platform
 *
 * Routes:
 *   /        → Seven-tab dashboard (HOME · MARKET · MAPS · IDEAS · PIPE · FUTURE · INTEL)
 *   /report  → Full six-section Live Market Report (separate destination, no nav chrome)
 *   /public  → Public-facing surface (founding letter, Auction House Services, hamlet cards)
 *              NO INTEL, NO PIPE, NO internal data — safe for external sharing
 *
 * Design tokens in index.css. No inline styles.
 *
 * Sprint 9 P0: PIPE and INTEL are gated behind Manus OAuth via PrivateTabGate.
 * HOME, MARKET, MAPS, and FUTURE are public — no auth required.
 * /public is the external-safe surface for sharing with prospects and partners.
 */

import { useState } from "react";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DashboardLayout, type TabId } from "./components/DashboardLayout";
import { PrivateTabGate } from "./components/PrivateTabGate";

// Tab pages
import HomeTab   from "./pages/tabs/HomeTab";
import MarketTab from "./pages/tabs/MarketTab";
import MapsTab   from "./pages/tabs/MapsTab";
import IdeasTab  from "./pages/tabs/IdeasTab";
import PipeTab   from "./pages/tabs/PipeTab";
import FutureTab from "./pages/tabs/FutureTab";
import IntelTab  from "./pages/tabs/IntelTab";

// Standalone pages
import ReportPage from "./pages/ReportPage";
import PublicPage from "./pages/PublicPage";

function TabContent({ activeTab }: { activeTab: TabId }) {
  switch (activeTab) {
    case "home":   return <HomeTab />;
    case "market": return <MarketTab />;
    case "maps":   return <MapsTab />;
    case "ideas":  return <IdeasTab />;
    // PIPE — private: operational pipeline data, deal records, recruiting targets
    case "pipe":   return (
      <PrivateTabGate tabLabel="PIPE">
        <PipeTab />
      </PrivateTabGate>
    );
    case "future": return <FutureTab />;
    // INTEL — private: relationship intelligence, whale registry, attorney database, family offices
    case "intel":  return (
      <PrivateTabGate tabLabel="INTEL">
        <IntelTab />
      </PrivateTabGate>
    );
    default:       return <HomeTab />;
  }
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <TabContent activeTab={activeTab} />
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Switch>
            <Route path="/report" component={ReportPage} />
            <Route path="/public" component={PublicPage} />
            <Route component={Dashboard} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
