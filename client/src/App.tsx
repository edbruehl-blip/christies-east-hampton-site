/**
 * App.tsx — Christie's East Hampton Re-platform
 *
 * Routes:
 *   /        → Six-tab dashboard (HOME · MARKET · MAPS · PIPE · FUTURE · INTEL)
 *   /report  → Full six-section Live Market Report (separate destination, no nav chrome)
 *   /pro-forma → Pro Forma live renderer (no nav chrome, Puppeteer PDF target)
 *   /future           → FUTURE tab standalone renderer (no nav chrome, Puppeteer PDF target)
 *   /letters/flagship   → Flagship AI-Letter live renderer (no nav chrome, Puppeteer PDF target)
 *   /letters/christies  → Christie's Letter to the Families (no nav chrome, Puppeteer PDF target)
 *   /cards/uhnw-path     → UHNW Wealth Path Card (no nav chrome, Puppeteer PDF target)
 *
 * /public removed Sprint 11 — platform is private. Public subscription site is a separate future track.
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
import { FloatingDashboardIntro } from "./components/FloatingDashboardIntro";

// Tab pages
import HomeTab   from "./pages/tabs/HomeTab";
import MarketTab from "./pages/tabs/MarketTab";
import MapsTab   from "./pages/tabs/MapsTab";
import PipeTab   from "./pages/tabs/PipeTab";
import FutureTab from "./pages/tabs/FutureTab";
import IntelTab  from "./pages/tabs/IntelTab";

// Standalone pages
import ReportPage         from "./pages/ReportPage";
import ProFormaPage       from "./pages/ProFormaPage";
import FlagshipLetterPage from "./pages/FlagshipLetterPage";
import ChristiesLetterPage from "./pages/ChristiesLetterPage";
import AngelLetterPage     from "./pages/AngelLetterPage";
import CouncilBriefPage    from "./pages/CouncilBriefPage";
import UHNWPathCardPage    from "./pages/UHNWPathCardPage";

function TabContent({ activeTab }: { activeTab: TabId }) {
  switch (activeTab) {
    case "home":   return <HomeTab />;
    case "market": return <MarketTab />;
    case "maps":   return <MapsTab />;
    case "pipe":   return <PipeTab />;
    case "future": return <FutureTab />;
    case "intel":  return <IntelTab />;
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
            <Route path="/market" component={ReportPage} />
            <Route path="/pro-forma" component={ProFormaPage} />
            <Route path="/letters/flagship" component={FlagshipLetterPage} />
            <Route path="/letters/christies" component={ChristiesLetterPage} />
            <Route path="/letters/angel" component={AngelLetterPage} />
            <Route path="/council-brief" component={CouncilBriefPage} />
            <Route path="/future" component={FutureTab} />
            <Route path="/cards/uhnw-path" component={UHNWPathCardPage} />
            <Route component={Dashboard} />
          </Switch>
          {/* Floating Dashboard Introduction button — fixed bottom-right, all pages, z-index 9999 */}
          <FloatingDashboardIntro />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
