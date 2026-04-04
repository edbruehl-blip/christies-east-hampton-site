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
import { FamilyOfficeList } from '@/components/FamilyOfficeList';
import { LocalCharityTracker } from '@/components/LocalCharityTracker';
import { IntelSourceTemplate } from '@/components/IntelSourceTemplate';
import { NewsletterManager } from '@/components/NewsletterManager';
import { IntelligenceWebTabs } from '@/components/IntelligenceWebTabs';
import { AttorneyDatabase } from '@/components/AttorneyDatabase';

// ─── Source-of-Truth Sheet IDs (locked April 1, 2026) ─────────────────────────

const SHEET_IDS = {
  podcast:         '1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8',  // Layer 1 calendar source
  event:           '1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s',  // Layer 1 calendar source + Layer 2 embed
  agentRecruiting: '1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA',  // corrected ID (lowercase h)
  socialPodcast:   '1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I',
  hamptonsOutreachIntelligence: '1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI', // renamed: Hamptons Outreach Intelligence (UHNW targeting) — Sprint 6 Flag 1
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
  return (
    <div className="px-6 py-8">
      {/* Layer label */}
      <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
        Layer 1 · Master Calendar
      </div>

      {/* Christie's card module — navy border, constrained width, no raw embed feel */}
      <div style={{
        border: '1px solid #1B2A4A',
        borderRadius: 2,
        overflow: 'hidden',
        background: '#fff',
        maxWidth: 900,
      }}>
        {/* Card header — navy bar with gold label */}
        <div className="flex items-center justify-between px-5 py-3" style={{ background: '#1B2A4A' }}>
          <div>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600 }}>
              Master Calendar · Christie's East Hampton
            </div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.5)', fontSize: 9, marginTop: 2 }}>
              Podcast · Event · Internal · Social · Wednesday Circuit
            </div>
          </div>
          <a
            href="https://calendar.google.com/calendar/r"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.6)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}
          >
            Open in Google ↗
          </a>
        </div>

        {/* Calendar iframe — contained inside the card */}
        <iframe
          src="https://calendar.google.com/calendar/embed?src=b591e65ffdfeee02ac8b410880b54bfdd20f29bec8b910fcefa51dd3c8cc97ab%40group.calendar.google.com&ctz=America%2FNew_York&mode=MONTH&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&bgcolor=%231B2A4A&color=%23C8AC78"
          title="Christie's East Hampton · Master Calendar"
          width="100%"
          style={{ display: 'block', height: 480, border: 'none' }}
          allowFullScreen
        />

        {/* Card footer — sheet access buttons, no raw Google UI */}
        <div className="flex items-center gap-4 px-5 py-3 border-t" style={{ background: '#FAF8F4', borderColor: 'rgba(27,42,74,0.12)' }}>
          <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(27,42,74,0.4)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', marginRight: 4 }}>
            Source Sheets:
          </span>
          <a
            href={sheetOpenUrl(SHEET_IDS.podcast)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: '#1B2A4A',
              fontSize: 9,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              border: '1px solid rgba(27,42,74,0.25)',
              padding: '3px 10px',
              background: 'transparent',
              textDecoration: 'none',
            }}
          >
            Podcast Pipeline ↗
          </a>
          <a
            href={sheetOpenUrl(SHEET_IDS.event)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: '#1B2A4A',
              fontSize: 9,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              border: '1px solid rgba(27,42,74,0.25)',
              padding: '3px 10px',
              background: 'transparent',
              textDecoration: 'none',
            }}
          >
            Event Calendar ↗
          </a>
        </div>
      </div>
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

      {/* 3-panel grid — Auction Events removed (same sheet as Layer 1 right panel) */}
      <div className="grid grid-cols-3 gap-4">
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
          title="Hamptons Outreach Intelligence"
          subtitle="UHNW targeting · Outreach intelligence · Vendor network"
          sheetId={SHEET_IDS.hamptonsOutreachIntelligence}
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
    id: 'org-chart-v2',
    label: "CIREG Ecosystem · Organizational Map · April 2, 2026",
    description: "Five-tier institutional hierarchy: Artémis / Pinault Family → Christie's Auction House → CIH → CIREG Tri-State → Christie's East Hampton Flagship. CIREG Brand Guidelines compliant. Guillaume Cerutti marked departed March 30, 2026.",
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/cireg-org-chart-v2-april-2026_cf381d58.html',
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
  (window.location.hostname.includes('localhost') ||
    window.location.hostname.includes('manus.computer') ||
    window.location.hostname.includes('manus.space'));

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

// ─── Relationship Intelligence Layer ────────────────────────────────────────
// Competitive intelligence only. Not mentor. Not prospect on any public surface.

interface CompetitorProfile {
  id: string;
  name: string;
  firm: string;
  title: string;
  territory: string;
  notableTransaction: string;
  notableTransactionYear: string;
  affiliations: string[];
  status: 'Active' | 'Inactive';
  notes: string;
}

const COMPETITOR_PROFILES: CompetitorProfile[] = [
  {
    id: 'frank-newbold',
    name: 'Frank Newbold',
    firm: "Sotheby's International Realty",
    title: 'Associate Broker',
    territory: 'East Hampton · South Fork',
    notableTransaction: '$70M · Further Lane, East Hampton',
    notableTransactionYear: '2025',
    affiliations: [
      'East Hampton Historical Society — Trustee',
    ],
    status: 'Active',
    notes: 'Dominant presence on Further Lane corridor. EHHS Trustee position provides institutional access to the same collector and estate networks Christie\'s targets. Monitor for listing activity on trophy parcels south of the highway.',
  },
];

function RelationshipIntelligenceLayer() {
  return (
    <div className="px-6 py-8 border-t" style={{ borderColor: 'rgba(200,172,120,0.2)' }}>
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
      <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
        Layer 4 · Relationship Intelligence
      </div>
      <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.2rem', marginBottom: 4 }}>
        Competitive Intelligence
      </div>
      <div className="mb-6 text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
        Internal use only. Not for client-facing surfaces.
      </div>
      <div className="flex flex-col gap-4">
        {COMPETITOR_PROFILES.map(profile => (
          <div key={profile.id} style={{ border: '1px solid rgba(27,42,74,0.12)', borderLeft: '3px solid #C8AC78', background: '#fff', padding: '20px 24px' }}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.05rem' }}>
                  {profile.name}
                </div>
                <div className="text-xs mt-0.5" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
                  {profile.title} · {profile.firm}
                </div>
              </div>
              <span
                className="shrink-0 px-3 py-1 text-[9px] uppercase tracking-widest"
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  background: profile.status === 'Active' ? '#1B2A4A' : 'rgba(27,42,74,0.08)',
                  color: profile.status === 'Active' ? '#C8AC78' : '#7a8a8e',
                  letterSpacing: '0.18em',
                }}
              >
                {profile.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4" style={{ maxWidth: 560 }}>
              <div>
                <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>Territory</div>
                <div className="text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>{profile.territory}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>Notable Transaction</div>
                <div className="text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>{profile.notableTransaction} · {profile.notableTransactionYear}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>Affiliations</div>
                <div className="text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>{profile.affiliations.join(' · ')}</div>
              </div>
            </div>
            <div className="pt-3 border-t text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', borderColor: 'rgba(27,42,74,0.08)' }}>
              {profile.notes}
            </div>
          </div>
        ))}
       </div>{/* /frame-max-w */}
      </div>
    </div>
  );
}
// ─── Sprint 6 Horizon Banner ─────────────────────────────────────────────────────────

function Sprint6Banner() {
  return (
    <div className="flex items-center gap-6 px-6 py-4" style={{ background: '#1B2A4A' }}>
      <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>
        Sprint 7 Horizon
      </div>
      <div className="flex gap-6 flex-wrap">
        {[
          { label: 'Family Office List', detail: '12 UHNW principals · 5 tiers · letter template · pipeline wired' },
          { label: 'Local Charity Tracker', detail: 'Highway 27 Safety · East Hampton Affordable Housing · 6 initiatives' },
          { label: 'Intel Source Registry', detail: '16 sources · 4 Growth Model pillars · cadence + feed map' },
          { label: 'Newsletter Infrastructure', detail: 'Beehiiv + Gmail SMTP · subscriber form · 5-step setup checklist' },
          { label: 'ElevenLabs Key', detail: 'Manny key · Text to Speech permission · TTS confirmed live' },
          { label: 'PIPE Tab Proxy', detail: 'Private Sheet · service account · full 12-col table · inline editor' },
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

      {/* Hero Slot — Relationship Intelligence (reserved for spiderweb — no build until approved spec + Ed GO) */}
      <div className="px-6 py-6 border-b" style={{ background: '#FAF8F4', borderColor: 'rgba(200,172,120,0.2)' }}>
        <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
          <div style={{
            border: '1px solid rgba(27,42,74,0.18)',
            borderLeft: '3px solid rgba(200,172,120,0.4)',
            borderRadius: 2,
            padding: '20px 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}>
            <div>
              <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.7)', letterSpacing: '0.22em', fontSize: 9 }}>
                Layer 4 · Reserved Slot
              </div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.1rem' }}>
                Relationship Intelligence
              </div>
              <div className="mt-1" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.78rem' }}>
                In Development — Awaiting approved spec and Ed GO.
              </div>
            </div>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(200,172,120,0.5)', whiteSpace: 'nowrap', border: '1px solid rgba(200,172,120,0.25)', borderRadius: 2, padding: '4px 10px' }}>
              Pending
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(200,172,120,0.2)' }} />

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
        <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
          Layer 3 · Institutional Archive
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.2rem', marginBottom: 24 }}>
          Canon Documents
        </div>

        {/* Perplexity Mastermind Map — Sprint 8 · always open, no click required */}
        <div className="mb-10">
          <div className="uppercase mb-3" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
            Mastermind Map · Christie's East Hampton · Perplexity Intelligence
          </div>
          <div style={{ border: '1px solid rgba(200,172,120,0.3)', borderRadius: 2, overflow: 'hidden', background: '#fff' }}>
            <iframe
              src="https://www.perplexity.ai/computer/a/christie-s-mastermind-map-0qAECI9PRi6bRbieIPaj_g"
              title="Christie's East Hampton · Mastermind Map · Perplexity"
              width="100%"
              style={{ display: 'block', height: 700, border: 'none' }}
              allowFullScreen
            />
          </div>
          <div className="mt-2 text-right">
            <a
              href="https://www.perplexity.ai/computer/a/christie-s-mastermind-map-0qAECI9PRi6bRbieIPaj_g"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.7)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}
            >
              Open in Perplexity ↗
            </a>
          </div>
        </div>

        <DocSection title="Org Chart & Hierarchy" docs={ORG_CHART_DOCS} />
        {/* Intel Source Registry — Sprint 7 Item 4 */}
        <div className="mb-8">
          <IntelSourceTemplate />
        </div>
        {/* Family Office Intelligence — Sprint 7 Item 2 */}
        <div className="mb-8">
          <FamilyOfficeList />
        </div>
        {/* Local Charity Tracker — Sprint 7 Item 3 */}
        <div className="mb-8">
          <LocalCharityTracker />
        </div>
        {/* Newsletter Infrastructure — Sprint 7 Item 5 */}
        <div className="mb-8">
          <NewsletterManager />
        </div>
        <DocSection title="Market Report" docs={MARKET_REPORT_DOCS} />
        <CanonPdfSection />
        <DocSection title="Constitution & SOPs" docs={CONSTITUTION_DOCS} />
        <DocSection title="Council Briefs" docs={COUNCIL_BRIEF_DOCS} />
        {/* Intelligence Web — Sprint 8 · Three filtered tabs (Jarvis Top Agents, Whale Intelligence, Auction Referrals) */}
        <IntelligenceWebTabs />
        {/* Attorney Database — Sprint 8 · Structured card module with four seed contacts */}
        <AttorneyDatabase />
        <DocSection title="Adam Kalb · IBC Materials" docs={IBC_DOCS} />
        </div>{/* /frame-max-w */}
      </div>

      {/* Layer 4 — Relationship Intelligence */}
      <RelationshipIntelligenceLayer />

      {/* Sprint 6 Horizon Banner */}
      <Sprint6Banner />

      {/* Doctrine footer */}
      <div className="px-6 py-4 text-center border-t" style={{ background: '#1B2A4A', borderColor: '#C8AC78' }}>
        <div style={{ fontFamily: '"Source Sans 3", sans-serif', fontStyle: 'italic', color: 'rgba(200,172,120,0.65)', fontSize: '0.72rem' }}>
          Art. Beauty. Provenance. · 26 Park Place, East Hampton, NY 11937 · 646-752-1233
        </div>
      </div>

    </div>
  );
}
