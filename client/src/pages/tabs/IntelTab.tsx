/**
 * INTEL TAB — Operating Control Room
 * Sprint 2 — March 31, 2026
 *
 * Layer 1 — Master Calendar: live from Podcast + Event Google Sheets, no seeded data
 * Layer 2 — Four-panel sheet grid: Agent Recruiting · Social/Podcast · Contact Database · Auction Events
 * Layer 3 — Canon Documents: org chart, wireframes, council briefs, PDFs
 *
 * Rules:
 * - One continuous surface, no scroll traps
 * - Viewport-height CSS for sheet panels
 * - No boxed layouts that trap scroll
 * - Sheets must be recognizable and usable as real spreadsheets
 */

import { useState, useEffect } from 'react';
import { MatrixCard } from '@/components/MatrixCard';
import { usePdfAssets } from '@/hooks/usePdfAssets';

// ─── Source-of-Truth Sheet IDs (locked March 31, 2026) ────────────────────────

const SHEET_IDS = {
  podcast:         '1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8',  // Layer 1 calendar source
  event:           '1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s',  // Layer 1 calendar source + Layer 2 embed
  agentRecruiting: '1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA',  // corrected ID (lowercase h)
  socialPodcast:   '1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I',
  contactDatabase: '1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI',
};

function sheetEmbedUrl(id: string) {
  return `https://docs.google.com/spreadsheets/d/${id}/edit?usp=sharing&rm=minimal&widget=true&headers=false`;
}

function sheetOpenUrl(id: string) {
  return `https://docs.google.com/spreadsheets/d/${id}/edit`;
}

// ─── Calendar Layer — live from Google Sheets ─────────────────────────────────
// The calendar renders the Podcast and Event sheets as full embeds side by side
// above the fold, with filter tabs. No seeded data.

type CalFilter = 'All' | 'Podcast' | 'Event' | 'Internal' | 'Social';

function CalendarLayer() {
  const [filter, setFilter] = useState<CalFilter>('All');
  const filters: CalFilter[] = ['All', 'Podcast', 'Event', 'Internal', 'Social'];

  // Determine which sheets to show based on filter
  const showPodcast = filter === 'All' || filter === 'Podcast';
  const showEvent   = filter === 'All' || filter === 'Event';
  const showBoth    = showPodcast && showEvent;

  return (
    <div className="mb-0">
      {/* Layer header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ background: '#fff', borderColor: 'rgba(200,172,120,0.25)' }}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
              Layer 1 · Master Calendar · Above the fold · Always visible
            </div>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.2rem' }}>
              Master Calendar
            </div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.78rem', marginTop: 2 }}>
              Podcast · Event · Internal · Social — live from Google Sheets
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1 text-[9px] uppercase tracking-widest border transition-all"
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  letterSpacing: '0.16em',
                  background: filter === f ? '#1B2A4A' : 'transparent',
                  color: filter === f ? '#C8AC78' : '#384249',
                  borderColor: filter === f ? '#C8AC78' : '#D3D1C7',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex gap-4 text-[10px]" style={{ fontFamily: 'monospace', color: '#bbb' }}>
          <span>Podcast: {SHEET_IDS.podcast.slice(0, 16)}…</span>
          <span>Event: {SHEET_IDS.event.slice(0, 16)}…</span>
          <span style={{ color: '#C8AC78' }}>Wednesday = anchor day</span>
        </div>
      </div>

      {/* Calendar sheet embeds — side by side when both visible */}
      {(showPodcast || showEvent) && (
        <div
          className={showBoth ? 'grid grid-cols-2' : 'grid grid-cols-1'}
          style={{ borderBottom: '1px solid rgba(200,172,120,0.2)' }}
        >
          {showPodcast && (
            <div style={{ borderRight: showBoth ? '1px solid rgba(200,172,120,0.2)' : 'none' }}>
              <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: '#1B2A4A', borderColor: 'rgba(200,172,120,0.2)' }}>
                <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Podcast Pipeline
                </span>
                <a href={sheetOpenUrl(SHEET_IDS.podcast)} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.5)', fontSize: 9, letterSpacing: '0.12em' }}>
                  Open Sheet ↗
                </a>
              </div>
              <iframe
                src={sheetEmbedUrl(SHEET_IDS.podcast)}
                title="Podcast Pipeline"
                width="100%"
                style={{ display: 'block', height: 'calc(40vh)', minHeight: 280, border: 'none' }}
                allowFullScreen
              />
            </div>
          )}
          {showEvent && (
            <div>
              <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: '#1B2A4A', borderColor: 'rgba(200,172,120,0.2)' }}>
                <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Event Calendar
                </span>
                <a href={sheetOpenUrl(SHEET_IDS.event)} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.5)', fontSize: 9, letterSpacing: '0.12em' }}>
                  Open Sheet ↗
                </a>
              </div>
              <iframe
                src={sheetEmbedUrl(SHEET_IDS.event)}
                title="Event Calendar"
                width="100%"
                style={{ display: 'block', height: 'calc(40vh)', minHeight: 280, border: 'none' }}
                allowFullScreen
              />
            </div>
          )}
          {/* Internal/Social filters show a note since those live inside the sheets */}
          {!showPodcast && !showEvent && (
            <div className="px-6 py-8 text-center" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.85rem' }}>
              Internal and Social items are tracked inside the Podcast and Event sheets above.
              <br />
              <button onClick={() => setFilter('All')} className="mt-3 underline" style={{ color: '#C8AC78' }}>Show all sheets</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Live Sheet Panel (Layer 2) ───────────────────────────────────────────────

interface SheetPanelProps {
  title: string;
  subtitle: string;
  sheetId: string;
  badge?: string;
}

function SheetPanel({ title, subtitle, sheetId, badge }: SheetPanelProps) {
  return (
    <div className="flex flex-col" style={{ border: '0.5px solid #D3D1C7', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: '#1B2A4A' }}>
        <div>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 10, letterSpacing: '1.2px', textTransform: 'uppercase', fontWeight: 600 }}>
            {title}
          </div>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.5)', fontSize: 9, marginTop: 1 }}>
            {subtitle}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {badge && (
            <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 7, color: 'rgba(200,172,120,0.5)', background: 'rgba(200,172,120,0.1)', padding: '1px 6px', borderRadius: 2, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {badge}
            </span>
          )}
          <a
            href={sheetOpenUrl(sheetId)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.6)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}
          >
            Open ↗
          </a>
        </div>
      </div>
      {/* Sheet embed — viewport height so it fills the laptop screen */}
      <iframe
        src={sheetEmbedUrl(sheetId)}
        title={title}
        width="100%"
        style={{ display: 'block', height: 'calc(50vh)', minHeight: 320, border: 'none', flex: 1 }}
        allowFullScreen
      />
      {/* Footer */}
      <div className="flex justify-between px-3 py-2" style={{ background: '#FAF8F4', borderTop: '0.5px solid #f0f0f0' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 7, color: '#bbb' }}>{sheetId.slice(0, 22)}…</span>
        <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, color: '#C8AC78', letterSpacing: '0.5px' }}>LIVE SHEET</span>
      </div>
    </div>
  );
}

function LiveSheetsLayer() {
  return (
    <div className="px-6 py-8 border-b" style={{ background: '#FAF8F4', borderColor: 'rgba(200,172,120,0.2)' }}>
      {/* Layer header */}
      <div className="mb-1 uppercase" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
        Layer 2 · Operating Intelligence
      </div>
      <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.2rem' }}>
        Live Working Sheets
      </div>
      <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.78rem', marginTop: 2, marginBottom: 20 }}>
        Viewport-height optimized · Full laptop visibility · No cramped scroll boxes
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-4">
        <SheetPanel
          title="Agent Recruiting"
          subtitle="Future agents · Active targets · Status tracking"
          sheetId={SHEET_IDS.agentRecruiting}
          badge="Live Sheet"
        />
        <SheetPanel
          title="Social / Podcast Pipeline"
          subtitle="Content calendar · William Records · Platform scheduling"
          sheetId={SHEET_IDS.socialPodcast}
          badge="Live Sheet"
        />
        <SheetPanel
          title="Contact Database"
          subtitle="Attorneys · Press · Christie's · Strategic contacts"
          sheetId={SHEET_IDS.contactDatabase}
          badge="Live Sheet"
        />
        <SheetPanel
          title="Auction Events"
          subtitle="Christie's East Hampton · Events · Auction schedule"
          sheetId={SHEET_IDS.event}
          badge="Live Sheet"
        />
      </div>
    </div>
  );
}

// ─── Document Library (Layer 3) ───────────────────────────────────────────────

interface DocItem {
  id: string;
  label: string;
  description: string;
  url: string | null;
  pinned?: boolean;
}

const ORG_CHART_DOCS: DocItem[] = [
  {
    id: 'org-chart',
    label: "Christie's East Hampton · Institutional Hierarchy · March 2026",
    description: "Full organizational hierarchy from James Christie through the Auction House and Real Estate Division to the East Hampton team.",
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/TtcjzvhlJtbopxGm.html',
    pinned: true,
  },
];

const MARKET_REPORT_DOCS: DocItem[] = [
  {
    id: 'market-report-live-v2',
    label: "Christie's Hamptons Live Market Report · v2 · March 2026",
    description: "Full live market report wireframe — six sections, hamlet atlas, ANEW intelligence, rate environment, and resources. Council-approved March 29, 2026.",
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/vevzqEIvPqAYOdHz.html',
    pinned: true,
  },
  {
    id: 'hamlet-pdf-east-hampton',
    label: "Hamlet PDF · East Hampton Village · Wireframe",
    description: "Single-hamlet deep-dive PDF wireframe for East Hampton Village — market data, CIS, tier classification, and comparable sales.",
    url: null,
  },
];

const CONSTITUTION_DOCS: DocItem[] = [
  {
    id: 'website-wireframe-v2',
    label: "Christie's East Hampton · Website Wireframe · v2",
    description: "Full website architecture wireframe — seven-tab structure, nav layers, HOME/MARKET/MAPS/IDEAS/PIPE/FUTURE/INTEL spec. Council-approved.",
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/EOvOozncXWBiBwbL.html',
  },
  {
    id: 'estate-advisory-card',
    label: "Estate Advisory Card · PDF",
    description: "Christie's East Hampton estate advisory card — client-facing credential document. CIREG brand, Ed Bruehl, doctrine lines. Send as PDF in 30 seconds from any Christie's meeting.",
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/christies-estate-advisory-card_e0fc3254.pdf',
  },
  {
    id: '300day-ascension',
    label: "300-Day Ascension Plan · Wireframe",
    description: "Full 300-day growth arc from foundation through market authority — agent recruitment, GCI targets, institutional positioning milestones.",
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/WXzEqCTtWmVsElaB.html',
  },
];

const COUNCIL_BRIEF_DOCS: DocItem[] = [
  {
    id: 'council-brief-march-2026',
    label: "Council Brief · March 29, 2026 · FINAL",
    description: "Full council brief — five-layer header directive, PDF engine, MAPS hamlet spec, PIPE scaffold, and 300-day arc.",
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/JBBnSxvSjfkLOjlS.html',
    pinned: true,
  },
];

const ATTORNEY_DOCS: DocItem[] = [
  {
    id: 'attorney-database',
    label: "Attorney Database · East Hampton & South Fork",
    description: "Curated list of real estate attorneys, estate attorneys, and transaction counsel serving the South Fork market.",
    url: null,
  },
];

const IBC_DOCS: DocItem[] = [
  {
    id: 'ibc-overview',
    label: "Adam Kalb · IBC Materials · Overview",
    description: "International Business Council materials provided by Adam Kalb. Covers IBC structure, membership, and Christie's East Hampton integration strategy.",
    url: null,
  },
  {
    id: 'ibc-brief',
    label: "Adam Kalb · IBC Brief",
    description: "Detailed IBC brief and action items for Christie's East Hampton flagship participation.",
    url: null,
  },
];

const IS_STAGING =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('netlify') ||
    window.location.hostname.includes('localhost') ||
    window.location.hostname.includes('manus.computer'));

function DocCard({ doc }: { doc: DocItem }) {
  const isLive = doc.url !== null;
  const showPending = IS_STAGING && !isLive;
  if (!IS_STAGING && !isLive) return null;
  return (
    <MatrixCard variant={doc.pinned ? 'active' : 'default'} className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1rem', lineHeight: 1.35 }}>
            {doc.label}
          </div>
          <div className="mt-1.5 text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
            {doc.description}
          </div>
        </div>
        <div className="shrink-0">
          {isLive ? (
            <a
              href={doc.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#C8AC78', color: '#1B2A4A', letterSpacing: '0.16em' }}
            >
              {doc.url?.endsWith('.html') ? 'Open Document' : 'Open PDF'}
            </a>
          ) : showPending ? (
            <span
              className="inline-block px-4 py-2 text-[10px] uppercase tracking-widest"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', background: 'rgba(27,42,74,0.06)', color: '#7a8a8e', letterSpacing: '0.16em' }}
            >
              Staging
            </span>
          ) : null}
        </div>
      </div>
    </MatrixCard>
  );
}

function DocSection({ title, docs }: { title: string; docs: DocItem[] }) {
  const visible = IS_STAGING ? docs : docs.filter(d => d.url !== null);
  if (visible.length === 0) return null;
  return (
    <div className="mb-8">
      <div className="uppercase mb-4" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
        {title}
      </div>
      <div className="flex flex-col gap-3">
        {visible.map(doc => <DocCard key={doc.id} doc={doc} />)}
      </div>
    </div>
  );
}

function CanonPdfSection() {
  const { visibleAssets, isStaging } = usePdfAssets();
  if (visibleAssets.length === 0) return null;
  return (
    <div className="mb-8">
      <div className="uppercase mb-4" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
        Canon Documents
      </div>
      <div className="flex flex-col gap-3">
        {visibleAssets.map(asset => (
          <MatrixCard key={asset.id} variant="default" className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1rem' }}>
                  {asset.label}
                </div>
                <div className="mt-1 text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
                  {asset.filename}
                </div>
              </div>
              <div className="shrink-0">
                {asset.url ? (
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
                    style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#C8AC78', color: '#1B2A4A', letterSpacing: '0.16em' }}
                  >
                    Open PDF
                  </a>
                ) : isStaging ? (
                  <span
                    className="inline-block px-4 py-2 text-[10px] uppercase tracking-widest"
                    style={{ fontFamily: '"Barlow Condensed", sans-serif', background: 'rgba(27,42,74,0.06)', color: '#7a8a8e', letterSpacing: '0.16em' }}
                  >
                    Staging
                  </span>
                ) : null}
              </div>
            </div>
          </MatrixCard>
        ))}
      </div>
    </div>
  );
}

// ─── Sprint 5 Horizon Banner ──────────────────────────────────────────────────

function Sprint5Banner() {
  return (
    <div className="flex items-center gap-6 px-6 py-4" style={{ background: '#1B2A4A' }}>
      <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>
        Sprint 5 Horizon
      </div>
      <div className="flex gap-6 flex-wrap">
        {[
          { label: 'Daily Listing Sync', detail: "Christie's profile → MAPS tab · automated" },
          { label: 'Canon Library', detail: 'Nine PDFs · Ed supplies files · auto-wire' },
          { label: 'Christie AI Tab', detail: 'Claude API native · inside dashboard' },
        ].map(item => (
          <div key={item.label} style={{ fontFamily: '"Source Sans 3", sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{item.label}</span> · {item.detail}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IntelTab() {
  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>

      {/* Header */}
      <div className="px-6 py-8 border-b" style={{ background: '#1B2A4A', borderColor: '#C8AC78' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
          Operating Control Room · Intelligence · Documents · SOPs
        </div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem' }}>Intel</h2>
        <p className="mt-2 text-sm" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)' }}>
          Calendar · Live operating sheets · Canon documents · Council briefs.
        </p>
      </div>

      {/* Layer 1 — Master Calendar (above the fold, no padding wrapper) */}
      <CalendarLayer />

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(200,172,120,0.2)' }} />

      {/* Layer 2 — Live Sheets */}
      <LiveSheetsLayer />

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(200,172,120,0.2)' }} />

      {/* Layer 3 — Canon Documents */}
      <div className="px-6 py-8">
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
          Layer 3 · Institutional Archive
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.2rem', marginBottom: 24 }}>
          Canon Documents
        </div>

        <DocSection title="Org Chart & Hierarchy" docs={ORG_CHART_DOCS} />
        <DocSection title="Market Report" docs={MARKET_REPORT_DOCS} />
        <CanonPdfSection />
        <DocSection title="Constitution & SOPs" docs={CONSTITUTION_DOCS} />
        <DocSection title="Council Briefs" docs={COUNCIL_BRIEF_DOCS} />
        <DocSection title="Attorney Database" docs={ATTORNEY_DOCS} />
        <DocSection title="Adam Kalb · IBC Materials" docs={IBC_DOCS} />
      </div>

      {/* Sprint 5 Horizon Banner */}
      <Sprint5Banner />

      {/* Doctrine footer */}
      <div className="px-6 py-4 text-center border-t" style={{ background: '#1B2A4A', borderColor: '#C8AC78' }}>
        <div style={{ fontFamily: '"Source Sans 3", sans-serif', fontStyle: 'italic', color: 'rgba(200,172,120,0.65)', fontSize: '0.72rem' }}>
          Christie's · Est. 1766 — Always the family's interest before the sale. The name follows.
        </div>
      </div>

    </div>
  );
}
