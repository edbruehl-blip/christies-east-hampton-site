/**
 * App.tsx — Christie's East Hampton Re-platform
 *
 * Routes:
 *   /        → Seven-tab dashboard (HOME · MARKET · MAPS · IDEAS · PIPE · FUTURE · INTEL)
 *   /report  → Full six-section Live Market Report (separate destination, no nav chrome)
 *
 * Design tokens in index.css. No inline styles.
 */

import { useState } from "react";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DashboardLayout, type TabId } from "./components/DashboardLayout";

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

function TabContent({ activeTab }: { activeTab: TabId }) {
  switch (activeTab) {
    case "home":   return <HomeTab />;
    case "market": return <MarketTab />;
    case "maps":   return <MapsTab />;
    case "ideas":  return <IdeasTab />;
    case "pipe":   return <PipeTab />;
    case "future": return <FutureTab />;
    case "intel":  return <IntelTab />;
    default:       return <HomeTab />;
  }
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  // make sure to consider if you need authentication for certain routes
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
            <Route component={Dashboard} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
