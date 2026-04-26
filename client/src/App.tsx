/**
 * App.tsx — Christie's East Hampton Re-platform
 *
 * Routes:
 *   /        → Six-tab dashboard (HOME · MARKET · MAPS · PIPE · FUTURE · INTEL)
 *   /report  → Full six-section Live Market Report (separate destination, no nav chrome)
 *   /pro-forma → Pro Forma live renderer (DashboardLayout navy shell · D65 canonical)
 *   /future           → FUTURE tab via Dashboard initialTab="future" (global nav chrome · S2 fix Apr 23 2026)
 *   /letters/flagship   → Flagship AI-Letter live renderer (no nav chrome, Puppeteer PDF target)
 *   /letters/christies  → Christie's Letter to the Families (no nav chrome, Puppeteer PDF target)
 *   /cards/uhnw-path     → UHNW Wealth Path Card (no nav chrome, Puppeteer PDF target)
 *
 * /public removed Sprint 11 — platform is private. Public subscription site is a separate future track.
 *
 * Design tokens in index.css. No inline styles.
 */

import { useState } from "react";
import { Route, Switch, useLocation } from "wouter";
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
import FlagshipLetterPage      from "./pages/FlagshipLetterPage";
import ChristiesLetterPage     from "./pages/ChristiesLetterPage";
import AngelLetterPage         from "./pages/AngelLetterPage";
import NeighborhoodLetterPage  from "./pages/NeighborhoodLetterPage";
import CouncilBriefPage    from "./pages/CouncilBriefPage";
import UHNWPathCardPage    from "./pages/UHNWPathCardPage";
import NeighborhoodCardPage from "./pages/NeighborhoodCardPage";
import ArchitectureOfWealthPage from "./pages/ArchitectureOfWealthPage";
import CorkPage from "./pages/CorkPage";

// S2 Shell Purge (Apr 23 2026): ProtectedFutureRoute deleted.
// /future now routes through Dashboard initialTab="future" — gets global nav chrome.
// Auth gate may be re-scaffolded inside Dashboard when FUTURE_AUTH_ENABLED is needed.


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

function Dashboard({ initialTab = "home" }: { initialTab?: TabId }) {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab); // HOME is the front door — default on refresh (D34)
  const [, navigate] = useLocation();
  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    // Keep URL in sync so /pipe, /maps, /intel etc. deep-link correctly (P0-1 fix)
    navigate(tab === "home" ? "/" : "/" + tab);
  };
  return (
    <>
      <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
        <TabContent activeTab={activeTab} />
      </DashboardLayout>
      {/* D16: FloatingDashboardIntro scoped to HOME tab only (Apr 19 2026) */}
      {activeTab === "home" && <FloatingDashboardIntro />}
    </>
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
            <Route path="/market">{() => <Dashboard initialTab="market" />}</Route>
            <Route path="/maps">{() => <Dashboard initialTab="maps" />}</Route>
            <Route path="/pipe">{() => <Dashboard initialTab="pipe" />}</Route>
            <Route path="/intel">{() => <Dashboard initialTab="intel" />}</Route>
            <Route path="/pro-forma" component={ProFormaPage} />
            <Route path="/letters/flagship" component={FlagshipLetterPage} />
            <Route path="/letters/christies" component={ChristiesLetterPage} />
            <Route path="/letters/angel" component={AngelLetterPage} />
            {/* Legacy short-form routes — redirect to canonical /letters/* paths */}
            <Route path="/angel-letter">{() => { window.location.replace('/letters/angel'); return null; }}</Route>
            <Route path="/council-letter">{() => { window.location.replace('/letters/flagship'); return null; }}</Route>
            <Route path="/letters/welcome" component={NeighborhoodLetterPage} />
            <Route path="/architecture-of-wealth" component={ArchitectureOfWealthPage} />
            <Route path="/council-brief" component={CouncilBriefPage} />
            {/* S2 Shell Purge (Apr 23 2026): /future routed through Dashboard so it gets global nav chrome.
                ProtectedFutureRoute deleted — auth gate scaffolded in Dashboard if FUTURE_AUTH_ENABLED.
                /future now pixel-identical to /market /maps /pipe /intel in nav presence. */}
            <Route path="/future">{() => <Dashboard initialTab="future" />}</Route>
            <Route path="/cards/uhnw-path" component={UHNWPathCardPage} />
            <Route path="/cards/bike" component={NeighborhoodCardPage} />
            {/* /cork — Christie's Flagship Corkboard live route (D23 Work Order Apr 26 2026) */}
            <Route path="/cork" component={CorkPage} />
            <Route component={Dashboard} />
          </Switch>
          {/* D16: FloatingDashboardIntro moved to Dashboard component, HOME tab only (Apr 19 2026) */}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
