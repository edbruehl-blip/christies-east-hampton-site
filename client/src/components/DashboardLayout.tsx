/**
 * DashboardLayout — Christie's East Hampton
 *
 * Design System: Navy #1B2A4A · Gold #C8AC78 · Charcoal #384249 · Cream #FAF8F4
 * Nav uses Barlow Condensed (approved for nav labels). Logo uses white CIREG lockup.
 * Seven tabs only: HOME · MARKET · MAPS · IDEAS · PIPE · FUTURE · INTEL
 * No eighth tab. No inline styles. No exceptions.
 */

import { useState, type ReactNode } from "react";
import { LOGO_WHITE, ED_HEADSHOT_PRIMARY } from "@/lib/cdn-assets";

export type TabId = "home" | "market" | "maps" | "ideas" | "pipe" | "future" | "intel";

const TABS: { id: TabId; label: string }[] = [
  { id: "home",   label: "Home"   },
  { id: "market", label: "Market" },
  { id: "maps",   label: "Maps"   },
  { id: "ideas",  label: "Ideas"  },
  { id: "pipe",   label: "Pipe"   },
  { id: "future", label: "Future" },
  { id: "intel",  label: "Intel"  },
];

interface DashboardLayoutProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  children: ReactNode;
}

export function DashboardLayout({ activeTab, onTabChange, children }: DashboardLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream)]">
      {/* ── Top Nav Bar ── */}
      <header className="bg-[var(--color-navy)] sticky top-0 z-50 shadow-md">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-14">

          {/* Logo / Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            {/* White CIREG lockup — sourced from cdn-assets.ts, dark nav background */}
            <img
              src={LOGO_WHITE}
              alt="Christie's International Real Estate"
              className="h-6 w-auto"
            />
            <div className="hidden sm:block h-4 w-px bg-[rgba(200,172,120,0.4)]" />
            <span
              className="hidden sm:block text-[var(--color-cream)] opacity-80"
              style={{ fontFamily: "var(--font-condensed)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase" }}
            >
              East Hampton
            </span>
          </div>

          {/* Ed Bruehl headshot — confirmed PRIMARY (5A89ABA9) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <img
              src={ED_HEADSHOT_PRIMARY}
              alt="Ed Bruehl — Managing Director"
              className="h-8 w-8 rounded-full object-cover object-top border border-[rgba(200,172,120,0.4)]"
            />
            <span
              className="text-[var(--color-cream)] opacity-70"
              style={{ fontFamily: "var(--font-condensed)", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase" }}
            >
              Ed Bruehl
            </span>
          </div>

          {/* Desktop Tab Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`nav-tab ${activeTab === tab.id ? "nav-tab--active" : ""}`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <span className="block w-5 h-0.5 bg-[var(--color-cream)] opacity-80" />
            <span className="block w-5 h-0.5 bg-[var(--color-cream)] opacity-80" />
            <span className="block w-5 h-0.5 bg-[var(--color-cream)] opacity-80" />
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[var(--color-navy)] border-t border-[rgba(200,172,120,0.2)] px-4 pb-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { onTabChange(tab.id); setMobileNavOpen(false); }}
                className={`nav-tab block w-full text-left py-3 border-b border-[rgba(200,172,120,0.1)] ${activeTab === tab.id ? "nav-tab--active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[var(--color-navy)] py-4 px-6 mt-auto">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <span
            className="text-[rgba(250,248,244,0.4)]"
            style={{ fontFamily: "var(--font-condensed)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase" }}
          >
            Christie's East Hampton · 26 Park Place
          </span>
          <span
            className="text-[rgba(200,172,120,0.5)]"
            style={{ fontFamily: "var(--font-condensed)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase" }}
          >
            Private Access
          </span>
        </div>
      </footer>
    </div>
  );
}
