/**
 * Intel Source / Growth Model Template Consolidation — Sprint 7 Item 4
 *
 * Consolidates all homework scrubs, spreadsheets, and data sources into
 * one structured template that feeds the Growth Model's four pillars.
 *
 * Four pillars: Territory Intelligence · Relationship Capital ·
 *               Institutional Memory · Advisory Voice
 */

import { useState } from "react";

// ─── Data Model ───────────────────────────────────────────────────────────────

type Pillar = "territory" | "relationship" | "memory" | "voice";

interface IntelSource {
  id: string;
  pillar: Pillar;
  name: string;
  type: "Sheet" | "API" | "Scraper" | "Manual" | "Component";
  cadence: string;
  feedsInto: string;
  status: "Live" | "Scheduled" | "Manual" | "Pending";
  link?: string;
  notes?: string;
}

const SOURCES: IntelSource[] = [
  // ─── Territory Intelligence ───────────────────────────────────────────────
  {
    id: "hamlet-master",
    pillar: "territory",
    name: "Hamlet Master Atlas",
    type: "Manual",
    cadence: "Quarterly",
    feedsInto: "MAPS tab · CIS scores · PDF exports · Market Report",
    status: "Live",
    notes: "10 hamlets, CIS scores, price corridors, demographics. Single source of truth in hamlet-master.ts.",
  },
  {
    id: "fred-mortgage",
    pillar: "territory",
    name: "FRED Mortgage Rate (MORTGAGE30US)",
    type: "API",
    cadence: "Daily (24h cache)",
    feedsInto: "Market ticker · Market Report · IDEAS CIS Calculator",
    status: "Live",
    link: "https://fred.stlouisfed.org/series/MORTGAGE30US",
    notes: "Freddie Mac PMMS via FRED API. Fallback to last known value.",
  },
  {
    id: "market-ticker",
    pillar: "territory",
    name: "Market Data Strip",
    type: "API",
    cadence: "Real-time (server proxy)",
    feedsInto: "HOME ticker · MARKET tab · WhatsApp brief",
    status: "Live",
    notes: "S&P 500, Bitcoin, Gold, Silver, VIX, 30Y Treasury, Hamptons Median.",
  },
  {
    id: "christies-auction-scraper",
    pillar: "territory",
    name: "Christie's Auction Scraper",
    type: "Scraper",
    cadence: "Weekly (Monday Apps Script trigger)",
    feedsInto: "Event Calendar Sheet · Google Calendar · WhatsApp brief",
    status: "Scheduled",
    link: "https://christies.com/en/calendar",
    notes: "44 NY events identified. Writes sale title, date, URL, subtitle to Event Calendar sheet.",
  },
  {
    id: "listings-sync",
    pillar: "territory",
    name: "Christie's Listings Sync",
    type: "Scraper",
    cadence: "Daily (6AM server cron)",
    feedsInto: "MAPS tab · PIPE tab · WhatsApp brief",
    status: "Live",
    link: "https://www.christiesrealestategroup.com/realestate/agent/ed-bruehl/",
    notes: "4 active listings parsing correctly. JSON extracted from main tag.",
  },
  // ─── Relationship Capital ─────────────────────────────────────────────────
  {
    id: "office-pipeline-sheet",
    pillar: "relationship",
    name: "Office Pipeline Sheet",
    type: "Sheet",
    cadence: "Live (Google Sheets API)",
    feedsInto: "PIPE tab · WhatsApp brief · Deal Brief PDF",
    status: "Live",
    link: "https://docs.google.com/spreadsheets/d/1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag/edit",
    notes: "21 columns A-U. STATUS in E, DATE CLOSED in U. Single source of truth for pipeline.",
  },
  {
    id: "family-office-registry",
    pillar: "relationship",
    name: "UHNW Family Office Registry",
    type: "Component",
    cadence: "Manual (research-driven)",
    feedsInto: "INTEL Layer 3 · PIPE tab (Add to Pipeline) · Newsletter",
    status: "Live",
    notes: "12 principals, 5 tiers. Ed Bruehl / James Christie letter template. Copy-to-clipboard.",
  },
  {
    id: "hamptons-outreach-intel",
    pillar: "relationship",
    name: "Hamptons Outreach Intelligence Sheet",
    type: "Sheet",
    cadence: "Manual",
    feedsInto: "INTEL Layer 2 embed · Agent recruiting",
    status: "Live",
    link: "https://docs.google.com/spreadsheets/d/1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI/edit",
    notes: "UHNW targeting and outreach intelligence. Renamed from Contact Database (Sprint 6 Flag 1).",
  },
  {
    id: "agent-recruiting-sheet",
    pillar: "relationship",
    name: "Agent Recruiting Sheet",
    type: "Sheet",
    cadence: "Manual",
    feedsInto: "INTEL Layer 2 embed · FUTURE tab agent roster",
    status: "Live",
    link: "https://docs.google.com/spreadsheets/d/1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA/edit",
    notes: "Agent pipeline with QUADRANT column (added Sprint 5). Target: 15 agents by December 2026.",
  },
  {
    id: "charity-tracker",
    pillar: "relationship",
    name: "Local Charity Tracker",
    type: "Component",
    cadence: "Quarterly review",
    feedsInto: "INTEL Layer 3 · Newsletter community section",
    status: "Live",
    notes: "Highway 27 Safety + East Hampton Affordable Housing. 6 initiatives, 2 cause areas.",
  },
  // ─── Institutional Memory ─────────────────────────────────────────────────
  {
    id: "google-calendar",
    pillar: "memory",
    name: "Christie's East Hampton Google Calendar",
    type: "API",
    cadence: "Nightly sync (Apps Script)",
    feedsInto: "INTEL Layer 1 calendar embed · WhatsApp brief",
    status: "Live",
    notes: "25 auction events pushed. Wednesday Circuit recurring. Calendar ID locked.",
  },
  {
    id: "podcast-calendar-sheet",
    pillar: "memory",
    name: "Podcast Calendar Sheet",
    type: "Sheet",
    cadence: "Manual",
    feedsInto: "INTEL Layer 1 embed · WhatsApp brief · Newsletter",
    status: "Live",
    link: "https://docs.google.com/spreadsheets/d/1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8/edit",
    notes: "PUBLIC, PDF, DISPATCH columns added Sprint 5. Ep 13 (Balsam Farm) + Ep 14 (Green Thumb) confirmed.",
  },
  {
    id: "event-calendar-sheet",
    pillar: "memory",
    name: "Event Calendar Sheet",
    type: "Sheet",
    cadence: "Manual + Apps Script",
    feedsInto: "INTEL Layer 1 embed · Google Calendar sync · WhatsApp brief",
    status: "Live",
    link: "https://docs.google.com/spreadsheets/d/1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s/edit",
    notes: "Wednesday Circuit row added. Bridge Car Show updated to August 2026. Christie's auction events written weekly.",
  },
  {
    id: "growth-model-v2",
    pillar: "memory",
    name: "Growth Model v2 Sheet",
    type: "Sheet",
    cadence: "Manual (quarterly update)",
    feedsInto: "FUTURE tab GCI chart · 300-Day Arc · WhatsApp brief",
    status: "Live",
    link: "https://docs.google.com/spreadsheets/d/1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag/edit",
    notes: "2026 baseline: $3.95M GCI ($3.125M agent + $825K institutional). CONTACTS_STAGING tab built.",
  },
  // ─── Advisory Voice ───────────────────────────────────────────────────────
  {
    id: "whatsapp-briefs",
    pillar: "voice",
    name: "WhatsApp Automated Briefs",
    type: "Scraper",
    cadence: "8AM morning + 8PM evening (node-cron)",
    feedsInto: "William WhatsApp · Ed Bruehl WhatsApp",
    status: "Live",
    notes: "ElevenLabs TTS → S3 → Twilio WhatsApp media message. Voice ID fjnwTZkKtQOJaYzGLa6n.",
  },
  {
    id: "pdf-exports",
    pillar: "voice",
    name: "PDF Export Engine",
    type: "Component",
    cadence: "On-demand",
    feedsInto: "Client delivery · Council briefs · Deal briefs",
    status: "Live",
    notes: "5 export types: Market Report, ANEW Build Memo, CMA, Deal Brief, Investment Memo. Doctrine footer on all.",
  },
  {
    id: "newsletter",
    pillar: "voice",
    name: "Newsletter Infrastructure",
    type: "Manual",
    cadence: "Weekly (Monday)",
    feedsInto: "Beehiiv subscriber list · Gmail SMTP",
    status: "Pending",
    notes: "Sprint 7 Item 5. Beehiiv + Gmail SMTP. Christie's East Hampton Market Report delivered to inbox.",
  },
];

const PILLAR_META: Record<Pillar, { label: string; description: string; color: string; bg: string }> = {
  territory: {
    label: "Territory Intelligence",
    description: "Market data, hamlet atlas, listings, auction events",
    color: "#C8AC78",
    bg: "rgba(200,172,120,0.06)",
  },
  relationship: {
    label: "Relationship Capital",
    description: "Pipeline, UHNW registry, agent recruiting, charity",
    color: "#1B2A4A",
    bg: "rgba(27,42,74,0.05)",
  },
  memory: {
    label: "Institutional Memory",
    description: "Calendar, podcast, events, growth model",
    color: "#384249",
    bg: "rgba(56,66,73,0.05)",
  },
  voice: {
    label: "Advisory Voice",
    description: "WhatsApp briefs, PDF exports, newsletter",
    color: "#7a8a8e",
    bg: "rgba(122,138,142,0.06)",
  },
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Live: { bg: "rgba(200,172,120,0.12)", color: "#C8AC78" },
  Scheduled: { bg: "rgba(27,42,74,0.08)", color: "#1B2A4A" },
  Manual: { bg: "rgba(56,66,73,0.08)", color: "#384249" },
  Pending: { bg: "rgba(122,138,142,0.1)", color: "#7a8a8e" },
};

const TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  Sheet: { bg: "rgba(34,139,34,0.08)", color: "#228B22" },
  API: { bg: "rgba(0,100,200,0.08)", color: "#0064C8" },
  Scraper: { bg: "rgba(200,100,0,0.08)", color: "#C86400" },
  Manual: { bg: "rgba(122,138,142,0.08)", color: "#7a8a8e" },
  Component: { bg: "rgba(200,172,120,0.1)", color: "#C8AC78" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function IntelSourceTemplate() {
  const [activePillar, setActivePillar] = useState<"all" | Pillar>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pillars: Pillar[] = ["territory", "relationship", "memory", "voice"];
  const visible = activePillar === "all" ? SOURCES : SOURCES.filter(s => s.pillar === activePillar);

  const liveCount = SOURCES.filter(s => s.status === "Live").length;
  const pendingCount = SOURCES.filter(s => s.status === "Pending").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
          Intelligence Architecture
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>
          Intel Source Registry · Growth Model Feed
        </div>
        <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.78rem' }}>
          All data sources, scrapes, sheets, and components mapped to the four Growth Model pillars.
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Sources", value: SOURCES.length },
          { label: "Live", value: liveCount },
          { label: "Pending", value: pendingCount },
          { label: "Pillars", value: 4 },
        ].map(stat => (
          <div key={stat.label} className="text-center p-3 rounded-sm" style={{ background: 'rgba(27,42,74,0.03)', border: '1px solid rgba(27,42,74,0.08)' }}>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 700, fontSize: '1.4rem' }}>
              {stat.value}
            </div>
            <div className="text-[9px] uppercase tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Pillar filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button
          onClick={() => setActivePillar("all")}
          className="px-3 py-1 text-[9px] uppercase tracking-widest border transition-all"
          style={{
            fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.16em',
            background: activePillar === "all" ? '#1B2A4A' : 'transparent',
            color: activePillar === "all" ? '#C8AC78' : '#384249',
            borderColor: activePillar === "all" ? '#C8AC78' : '#D3D1C7',
          }}
        >
          All ({SOURCES.length})
        </button>
        {pillars.map(p => {
          const meta = PILLAR_META[p];
          const count = SOURCES.filter(s => s.pillar === p).length;
          return (
            <button
              key={p}
              onClick={() => setActivePillar(p)}
              className="px-3 py-1 text-[9px] uppercase tracking-widest border transition-all"
              style={{
                fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.16em',
                background: activePillar === p ? meta.color : 'transparent',
                color: activePillar === p ? '#FAF8F4' : '#384249',
                borderColor: activePillar === p ? meta.color : '#D3D1C7',
              }}
            >
              {meta.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Source cards */}
      <div className="flex flex-col gap-2">
        {visible.map(source => {
          const pillarMeta = PILLAR_META[source.pillar];
          const statusStyle = STATUS_STYLES[source.status];
          const typeStyle = TYPE_STYLES[source.type];
          const isExpanded = expandedId === source.id;

          return (
            <div
              key={source.id}
              className="rounded-sm cursor-pointer transition-all"
              style={{
                background: isExpanded ? pillarMeta.bg : 'rgba(27,42,74,0.02)',
                border: `1px solid ${isExpanded ? pillarMeta.color + '40' : 'rgba(27,42,74,0.1)'}`,
                padding: '12px 16px',
              }}
              onClick={() => setExpandedId(isExpanded ? null : source.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="inline-block px-2 py-0.5 text-[8px] uppercase tracking-widest"
                      style={{ fontFamily: '"Barlow Condensed", sans-serif', background: statusStyle.bg, color: statusStyle.color, letterSpacing: '0.14em' }}>
                      {source.status}
                    </span>
                    <span className="inline-block px-2 py-0.5 text-[8px] uppercase tracking-widest"
                      style={{ fontFamily: '"Barlow Condensed", sans-serif', background: typeStyle.bg, color: typeStyle.color, letterSpacing: '0.14em' }}>
                      {source.type}
                    </span>
                    <span className="inline-block px-2 py-0.5 text-[8px] uppercase tracking-widest"
                      style={{ fontFamily: '"Barlow Condensed", sans-serif', background: pillarMeta.bg, color: pillarMeta.color, letterSpacing: '0.14em' }}>
                      {pillarMeta.label}
                    </span>
                  </div>
                  <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '0.92rem' }}>
                    {source.name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
                    {source.cadence} · Feeds: {source.feedsInto}
                  </div>
                </div>
                <div className="shrink-0 text-xs" style={{ color: '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif' }}>
                  {isExpanded ? '▲' : '▼'}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(200,172,120,0.15)' }}>
                  {source.notes && (
                    <div className="mb-3">
                      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78' }}>
                        Notes
                      </div>
                      <div className="text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A' }}>
                        {source.notes}
                      </div>
                    </div>
                  )}
                  {source.link && (
                    <a
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="inline-block px-3 py-1.5 text-[9px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
                      style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#C8AC78', color: '#1B2A4A', letterSpacing: '0.14em', textDecoration: 'none' }}
                    >
                      Open Source ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Growth Model feed summary */}
      <div className="mt-5 p-4 rounded-sm" style={{ background: 'rgba(200,172,120,0.05)', border: '1px solid rgba(200,172,120,0.2)' }}>
        <div className="text-[10px] uppercase tracking-widest mb-3" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78' }}>
          Growth Model Feed Map
        </div>
        <div className="grid grid-cols-2 gap-4">
          {pillars.map(p => {
            const meta = PILLAR_META[p];
            const sources = SOURCES.filter(s => s.pillar === p);
            const liveInPillar = sources.filter(s => s.status === "Live").length;
            return (
              <div key={p}>
                <div className="text-[9px] uppercase tracking-widest mb-1.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: meta.color }}>
                  {meta.label} · {liveInPillar}/{sources.length} live
                </div>
                <div className="text-[10px] leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
                  {meta.description}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(200,172,120,0.15)' }}>
          <a
            href="https://docs.google.com/spreadsheets/d/1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 text-[9px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#C8AC78', color: '#1B2A4A', letterSpacing: '0.16em', textDecoration: 'none' }}
          >
            Open Growth Model v2 Sheet ↗
          </a>
        </div>
      </div>
    </div>
  );
}
