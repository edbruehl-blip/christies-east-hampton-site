/**
 * App.tsx — Christie's East Hampton Re-platform
 *
 * Seven-tab architecture: HOME · MARKET · MAPS · IDEAS · PIPE · FUTURE · INTEL
 * No eighth tab. Design tokens in index.css. No inline styles.
 */

import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DashboardLayout, type TabId } from "./components/DashboardLayout";

// Tab pages — stubs only until wireframe spec arrives
import HomeTab   from "./pages/tabs/HomeTab";
import MarketTab from "./pages/tabs/MarketTab";
import MapsTab   from "./pages/tabs/MapsTab";
import IdeasTab  from "./pages/tabs/IdeasTab";
import PipeTab   from "./pages/tabs/PipeTab";
import FutureTab from "./pages/tabs/FutureTab";
import IntelTab  from "./pages/tabs/IntelTab";

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

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
            <TabContent activeTab={activeTab} />
          </DashboardLayout>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
