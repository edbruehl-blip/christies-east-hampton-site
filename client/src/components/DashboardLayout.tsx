/**
 * DashboardLayout — Christie's East Hampton
 *
 * Design System: Navy #1B2A4A · Gold #C8AC78 · Charcoal #384249 · Cream #FAF8F4
 * Five-layer instrument panel header — matches production christiesrealestategroupeh.com
 *
 * Layer 1: Tab row — CIREG logo · 7 tabs · PUBLIC toggle · Ed headshot
 * Layer 2: Institutional ticker — "Stewarding Hamptons legacies…" marquee, 55s loop
 * Layer 3: Primary data strip — S&P 500 · Bitcoin · 30Y Fixed Mtg · Gold
 * Layer 4: Secondary data strip — Silver · VIX · 30Y Treasury · Hamptons Median
 * Layer 5: Social + office/weather strip — 7 social icons · 26 Park Place · live weather
 *
 * Data sources (matching production):
 *   Server proxy /api/market-data: S&P, Treasury, Gold, Silver, VIX, Bitcoin, Mortgage
 *   Open-Meteo: East Hampton weather (lat 40.9637, lng -72.1848)
 *   Hamptons Median: static $2.34M (updated manually per market report cycle)
 */

import { useState, useEffect, type ReactNode } from "react";
import { LOGO_WHITE, ED_HEADSHOT_PRIMARY } from "@/lib/cdn-assets";

export type TabId = "home" | "market" | "maps" | "ideas" | "pipe" | "future" | "intel";

const TABS: { id: TabId; label: string }[] = [
  { id: "home",   label: "HOME"   },
  { id: "market", label: "MARKET" },
  { id: "maps",   label: "MAPS"   },
  { id: "ideas",  label: "IDEAS"  },
  { id: "pipe",   label: "PIPE"   },
  { id: "future", label: "FUTURE" },
  { id: "intel",  label: "INTEL"  },
];

// ── Social icon SVGs ──────────────────────────────────────────────────────────
const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/edbruehlrealestate",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  },
  {
    label: "Threads",
    href: "https://www.threads.net/@edbruehl",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.048.216.098.321.149 1.392.661 2.505 1.637 3.098 2.773.942 1.767.896 4.557-1.181 6.586-1.784 1.75-3.966 2.48-7.075 2.504z"/></svg>,
  },
  {
    label: "X / Twitter",
    href: "https://twitter.com/edbruehlre",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@edbruehlrealestate",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCRNUlNy2hkJFvo1IFTY4otg",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/edbruehlrealestate",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/edbruehl",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
];

// ── Weather code → description map (WMO codes) ───────────────────────────────
function weatherDesc(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code <= 9) return "Foggy";
  if (code <= 19) return "Drizzle";
  if (code <= 29) return "Rain";
  if (code <= 39) return "Snow";
  if (code <= 49) return "Fog";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 84) return "Showers";
  if (code <= 94) return "Thunderstorm";
  return "Storm";
}

// ── Market data hook ──────────────────────────────────────────────────────────
// All financial feeds are fetched via the server-side proxy /api/market-data,
// which bypasses Yahoo Finance CORS restrictions on the deployed domain.
// Fields are null until the proxy responds; null fields are hidden (no dashes).
interface MarketData {
  sp500: string | null;
  btc: string | null;
  mortgage: string | null;
  gold: string | null;
  silver: string | null;
  vix: string | null;
  treasury: string | null;
  weather: string | null;
  updatedAt: string | null;
}

function useMarketData(): MarketData {
  const [data, setData] = useState<MarketData>({
    sp500: null,
    btc: null,
    mortgage: null,
    gold: null,
    silver: null,
    vix: null,
    treasury: null,
    weather: null,
    updatedAt: null,
  });

  useEffect(() => {
    async function fetchAll() {
      // ── Server-side proxy (bypasses Yahoo Finance CORS on deployed domain) ──
      try {
        const r = await fetch("/api/market-data", { signal: AbortSignal.timeout(12000) });
        if (r.ok) {
          const j = await r.json();
          setData(d => ({
            ...d,
            sp500:    j.sp500    ?? null,
            gold:     j.gold     ?? null,
            silver:   j.silver   ?? null,
            vix:      j.vix      ?? null,
            treasury: j.treasury ?? null,
            btc:      j.btc      ?? null,
            mortgage: j.mortgage ?? null,
            updatedAt: j.updatedAt ?? null,
          }));
        }
      } catch { /* proxy unavailable — fields stay null and are hidden */ }

      // Weather — Open-Meteo, East Hampton (no CORS restriction, fetched client-side)
      try {
        const r = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=40.9637&longitude=-72.1848&current_weather=true&temperature_unit=fahrenheit",
          { signal: AbortSignal.timeout(6000) }
        );
        const j = await r.json();
        const cw = j?.current_weather;
        if (cw) {
          setData(d => ({ ...d, weather: `${Math.round(cw.temperature)}°F ${weatherDesc(cw.weathercode)}` }));
        }
      } catch { /* keep null */ }
    }

    fetchAll();
    // Refresh every 5 minutes
    const interval = setInterval(fetchAll, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return data;
}

interface DashboardLayoutProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  children: ReactNode;
}

export function DashboardLayout({ activeTab, onTabChange, children }: DashboardLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [publicMode, setPublicMode] = useState(false);
  const market = useMarketData();

  // Ticker content — exact production copy
  const TICKER_TEXT = "Stewarding Hamptons legacies\u2002·\u2002Enjoy it\u2002·\u2002Improve it\u2002·\u2002Pass it on\u2002·\u2002Art\u2002·\u2002Beauty\u2002·\u2002Provenance\u2002·\u2002Since 1766\u2002·\u2002Christie\u2019s East Hampton\u2002·\u2002Exceptional Service";

  // Format the updatedAt ISO string into a short local time stamp
  const updatedLabel = market.updatedAt
    ? `Updated ${new Date(market.updatedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" })}`
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream)]">

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 1 — Tab row: CIREG logo · 7 tabs · PUBLIC toggle · Ed headshot
          Background: Navy #1B2A4A
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="sticky top-0 z-50"
        style={{ background: "#1B2A4A", borderBottom: "1px solid rgba(200,172,120,0.18)" }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 72,
          }}
        >
          {/* Logo + wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, cursor: "pointer" }} onClick={() => onTabChange("home")}>
            <img src={LOGO_WHITE} alt="Christie's International Real Estate Group" style={{ height: 'clamp(52px, 5vw, 68px)', width: 'auto', maxWidth: 240, filter: 'brightness(0) invert(1)' }} />
            <div style={{ width: 1, height: 16, background: "rgba(200,172,120,0.35)", flexShrink: 0 }} className="hidden sm:block" />
            <span
              className="hidden sm:block"
              style={{ fontFamily: "var(--font-condensed)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(250,248,244,0.75)" }}
            >
              East Hampton
            </span>
          </div>

          {/* Desktop tab nav */}
          <nav className="hidden md:flex items-center" style={{ gap: 2 }} aria-label="Main navigation">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                style={{
                  fontFamily: "var(--font-condensed)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "6px 14px",
                  cursor: "pointer",
                  border: "none",
                  background: "transparent",
                  color: activeTab === tab.id ? "#C8AC78" : "rgba(250,248,244,0.65)",
                  borderBottom: activeTab === tab.id ? "2px solid #C8AC78" : "2px solid transparent",
                  transition: "color 0.15s, border-color 0.15s",
                }}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right: PUBLIC toggle + Ed headshot */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button
              onClick={() => setPublicMode(v => !v)}
              style={{
                fontFamily: "var(--font-condensed)",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "4px 12px",
                cursor: "pointer",
                borderRadius: 2,
                border: publicMode ? "1px solid #C8AC78" : "1px solid rgba(200,172,120,0.35)",
                background: publicMode ? "rgba(200,172,120,0.15)" : "transparent",
                color: publicMode ? "#C8AC78" : "rgba(250,248,244,0.6)",
                transition: "all 0.2s",
              }}
            >
              {publicMode ? "● PUBLIC" : "PUBLIC"}
            </button>
            <img
              src={ED_HEADSHOT_PRIMARY}
              alt="Ed Bruehl — Managing Director"
              style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", objectPosition: "center top", border: "2px solid #C8AC78", flexShrink: 0 }}
            />
            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMobileNavOpen(v => !v)}
              aria-label="Toggle navigation"
              style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, padding: 4 }}
            >
              <span style={{ display: "block", width: 20, height: 2, background: "rgba(250,248,244,0.8)" }} />
              <span style={{ display: "block", width: 20, height: 2, background: "rgba(250,248,244,0.8)" }} />
              <span style={{ display: "block", width: 20, height: 2, background: "rgba(250,248,244,0.8)" }} />
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div style={{ background: "#1B2A4A", borderTop: "1px solid rgba(200,172,120,0.2)", padding: "8px 16px 16px" }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { onTabChange(tab.id); setMobileNavOpen(false); }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  fontFamily: "var(--font-condensed)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "12px 0",
                  cursor: "pointer",
                  border: "none",
                  borderBottom: "1px solid rgba(200,172,120,0.1)",
                  background: "transparent",
                  color: activeTab === tab.id ? "#C8AC78" : "rgba(250,248,244,0.7)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            LAYER 2 — Institutional ticker marquee
            "Stewarding Hamptons legacies: Enjoy it · Improve it · Pass it on…"
            55s loop, navy background, gold text
        ══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            background: "#1B2A4A",
            borderBottom: "1px solid rgba(200,172,120,0.22)",
            overflow: "hidden",
            whiteSpace: "nowrap",
            padding: "7px 0",
          }}
        >
          <div style={{ display: "inline-block", animation: "christies-marquee 55s linear infinite" }}>
            <span
              style={{
                fontFamily: "var(--font-condensed)",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "#C8AC78",
                textTransform: "uppercase",
                padding: "0 60px",
              }}
            >
              {TICKER_TEXT}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{TICKER_TEXT}
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            LAYER 3 — Primary data strip
            S&P 500 · Bitcoin · 30Y Fixed Mtg · Gold
            Background: Charcoal #384249
        ══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            background: "#384249",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 38,
            padding: "4px 16px",
            overflowX: "auto",
            whiteSpace: "nowrap",
            gap: 20,
            fontSize: 11,
            color: "#fff",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <DataItem label="S&P 500" value={market.sp500} />
          {market.sp500 && market.btc && <Sep />}
          <DataItem label="Bitcoin" value={market.btc} />
          {market.btc && market.mortgage && <Sep />}
          <DataItem label="30Y Fixed Mtg" value={market.mortgage} />
          {market.mortgage && market.gold && <Sep />}
          <DataItem label="Gold" value={market.gold} />
          {updatedLabel && (
            <>
              <Sep />
              <span style={{ fontFamily: "var(--font-condensed)", fontSize: 10, color: "rgba(255,255,255,0.38)", letterSpacing: "0.06em" }}>
                {updatedLabel}
              </span>
            </>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            LAYER 4 — Secondary data strip
            Silver · VIX · 30Y Treasury · Hamptons Median
        ══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            background: "#384249",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 38,
            padding: "4px 16px",
            overflowX: "auto",
            whiteSpace: "nowrap",
            gap: 20,
            fontSize: 11,
            color: "#fff",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <DataItem label="Silver" value={market.silver} />
          {market.silver && market.vix && <Sep />}
          <DataItem label="VIX" value={market.vix} />
          {market.vix && market.treasury && <Sep />}
          <DataItem label="30Y Treasury" value={market.treasury} />
          <Sep />
          <DataItem label="Hamptons Median" value="$2.34M" gold />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            LAYER 5 — Social icons + office/weather strip
        ══════════════════════════════════════════════════════════════ */}
        {/* Social icons row */}
        <div
          style={{
            background: "#384249",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 38,
            padding: "4px 0",
            gap: 18,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            flexWrap: "wrap",
          }}
        >
          {SOCIAL_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label}
              style={{ color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              {link.svg}
            </a>
          ))}
        </div>

        {/* Office + weather bar */}
        <div
          style={{
            background: "#1B2A4A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 40,
            padding: "5px 24px",
            fontSize: 11.5,
            color: "rgba(255,255,255,0.82)",
            gap: 10,
            flexWrap: "wrap",
            borderBottom: "1px solid rgba(0,0,0,0.15)",
          }}
        >
          <span>Christie's East Hampton Office&nbsp;&nbsp;·&nbsp;&nbsp;26 Park Place, East Hampton, NY 11937&nbsp;&nbsp;·&nbsp;&nbsp;646-752-1233</span>
          {market.weather && (
            <span style={{ color: "#C8AC78", fontWeight: 600, flexShrink: 0 }}>{market.weather}</span>
          )}
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <main className="flex-1">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: "#1B2A4A", padding: "14px 24px", marginTop: "auto" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(250,248,244,0.35)" }}>
            Christie's · Est. 1766 — Always the family's interest before the sale. The name follows.
          </span>
          <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(200,172,120,0.45)" }}>
            Private Access
          </span>
        </div>
      </footer>
    </div>
  );
}

// ── Small presentational helpers ─────────────────────────────────────────────

function Sep() {
  return <span style={{ color: "rgba(255,255,255,0.2)", userSelect: "none" }}>|</span>;
}

/** Renders a label:value pair. Renders nothing if value is null (feed hidden). */
function DataItem({ label, value, gold }: { label: string; value: string | null; gold?: boolean }) {
  if (!value) return null;
  return (
    <span style={{ fontFamily: "var(--font-condensed)", letterSpacing: "0.04em" }}>
      {label}:{" "}
      <strong style={{ color: gold ? "#C8AC78" : "#fff" }}>{value}</strong>
    </span>
  );
}
