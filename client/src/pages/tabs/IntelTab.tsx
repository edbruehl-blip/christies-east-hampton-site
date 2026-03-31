/**
 * INTEL TAB — Operating Control Room
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 *
 * Layer 1 — Calendar (top, above fold): combined Podcast + Event + Internal + Social
 * Layer 2 — Live Sheet Embeds: Agent/Recruiting · Auction/Events · Social/Podcast
 * Layer 3 — Canon Documents: org chart, wireframes, council briefs, PDFs
 */

import { useState } from 'react';
import { MatrixCard } from '@/components/MatrixCard';
import { usePdfAssets } from '@/hooks/usePdfAssets';

// ─── Google Sheet IDs ─────────────────────────────────────────────────────────

const SHEETS = {
  agentRecruiting: '1a7arxf3_eTAnF7QlD3M-Fwnt7RhyRoaMWfLlTbA9MJ7mA',
  auctionEvents:   '1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s',
  socialPodcast:   '1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I',
};

function sheetEmbedUrl(id: string) {
  return `https://docs.google.com/spreadsheets/d/${id}/edit?usp=sharing&rm=minimal&widget=true&headers=false`;
}

// ─── Calendar Layer ───────────────────────────────────────────────────────────

type CalFilter = 'All' | 'Podcast' | 'Event' | 'Internal' | 'Social';

interface CalItem {
  date: string;       // "Mar 31"
  day: string;        // "Mon"
  type: CalFilter;
  title: string;
  detail: string;
}

const CALENDAR_ITEMS: CalItem[] = [
  { date: 'Apr 1',  day: 'Wed', type: 'Internal',  title: 'Q2 Strategy Review',                detail: 'Ed Bruehl · Council · 10:00 AM' },
  { date: 'Apr 3',  day: 'Fri', type: 'Podcast',   title: 'William Records · Episode 4',       detail: 'Recording · East Hampton Studio · 2:00 PM' },
  { date: 'Apr 5',  day: 'Sun', type: 'Event',     title: 'Christie\'s Spring Auction Preview', detail: 'Rockefeller Center · 6:00 PM' },
  { date: 'Apr 7',  day: 'Tue', type: 'Social',    title: 'Instagram · Market Report Drop',    detail: 'Scheduled post · 9:00 AM' },
  { date: 'Apr 9',  day: 'Thu', type: 'Internal',  title: 'Agent Pipeline Review',              detail: 'Ed Bruehl · 11:00 AM' },
  { date: 'Apr 10', day: 'Fri', type: 'Podcast',   title: 'William Records · Episode 5',       detail: 'Pre-production · Script due' },
  { date: 'Apr 12', day: 'Sun', type: 'Event',     title: 'East Hampton Village Fair',         detail: 'Main Street · All day' },
  { date: 'Apr 14', day: 'Tue', type: 'Social',    title: 'LinkedIn · Hamlet Atlas Feature',   detail: 'Scheduled post · 8:00 AM' },
  { date: 'Apr 15', day: 'Wed', type: 'Internal',  title: 'Christie\'s National Call',         detail: 'Managing Directors · 2:00 PM' },
  { date: 'Apr 17', day: 'Fri', type: 'Event',     title: 'Sag Harbor Arts Council Benefit',   detail: 'American Hotel · 7:00 PM' },
  { date: 'Apr 21', day: 'Tue', type: 'Podcast',   title: 'William Records · Episode 6',       detail: 'Recording · East Hampton Studio · 2:00 PM' },
  { date: 'Apr 24', day: 'Fri', type: 'Social',    title: 'Instagram · Sagaponack Feature',    detail: 'Scheduled post · 9:00 AM' },
  { date: 'Apr 28', day: 'Tue', type: 'Internal',  title: 'Monthly GCI Review',                detail: 'Ed Bruehl · Council · 10:00 AM' },
  { date: 'Apr 30', day: 'Thu', type: 'Event',     title: 'Christie\'s East Hampton Open House', detail: '26 Park Place · 4:00 PM' },
];

const TYPE_COLORS: Record<CalFilter, { bg: string; text: string; border: string }> = {
  All:      { bg: '#1B2A4A', text: '#FAF8F4', border: '#C8AC78' },
  Podcast:  { bg: '#C8AC78', text: '#1B2A4A', border: '#C8AC78' },
  Event:    { bg: '#1B2A4A', text: '#FAF8F4', border: '#1B2A4A' },
  Internal: { bg: '#384249', text: '#FAF8F4', border: '#384249' },
  Social:   { bg: '#FAF8F4', text: '#1B2A4A', border: '#C8AC78' },
};

function CalendarLayer() {
  const [filter, setFilter] = useState<CalFilter>('All');
  const filters: CalFilter[] = ['All', 'Podcast', 'Event', 'Internal', 'Social'];
  const visible = filter === 'All' ? CALENDAR_ITEMS : CALENDAR_ITEMS.filter(i => i.type === filter);

  return (
    <div className="mb-10">
      {/* Section label */}
      <div className="uppercase mb-4" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
        Layer 1 · Calendar · April 2026
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map(f => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 text-[10px] uppercase tracking-widest border transition-all"
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                letterSpacing: '0.18em',
                background: active ? '#1B2A4A' : 'transparent',
                color: active ? '#C8AC78' : '#1B2A4A',
                borderColor: active ? '#C8AC78' : '#1B2A4A',
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Calendar rows */}
      <div className="flex flex-col gap-2">
        {visible.map((item, i) => {
          const c = TYPE_COLORS[item.type];
          return (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 border"
              style={{ background: '#FFFFFF', borderColor: 'rgba(27,42,74,0.12)' }}
            >
              {/* Date block */}
              <div className="shrink-0 w-14 text-center">
                <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#1B2A4A', fontSize: 15, fontWeight: 700, lineHeight: 1 }}>
                  {item.date}
                </div>
                <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: 10 }}>
                  {item.day}
                </div>
              </div>

              {/* Type badge */}
              <div
                className="shrink-0 px-2.5 py-1 text-[9px] uppercase tracking-widest"
                style={{ fontFamily: '"Barlow Condensed", sans-serif', background: c.bg, color: c.text, border: `1px solid ${c.border}`, letterSpacing: '0.16em', minWidth: 64, textAlign: 'center' }}
              >
                {item.type}
              </div>

              {/* Title + detail */}
              <div className="flex-1 min-w-0">
                <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '0.95rem' }}>
                  {item.title}
                </div>
                <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.75rem' }}>
                  {item.detail}
                </div>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="py-8 text-center" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.85rem' }}>
            No items for this filter.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Live Sheet Embed Layer ───────────────────────────────────────────────────

interface SheetEmbedProps {
  title: string;
  subtitle: string;
  sheetId: string;
}

function SheetEmbed({ title, subtitle, sheetId }: SheetEmbedProps) {
  const url = sheetEmbedUrl(sheetId);
  return (
    <div className="mb-8">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.1rem' }}>
            {title}
          </div>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.75rem' }}>
            {subtitle}
          </div>
        </div>
        <a
          href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 text-[10px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#C8AC78', color: '#1B2A4A', letterSpacing: '0.16em' }}
        >
          Open in Sheets ↗
        </a>
      </div>
      <div
        className="w-full border"
        style={{ borderColor: 'rgba(200,172,120,0.4)', background: '#fff' }}
      >
        <iframe
          src={url}
          title={title}
          width="100%"
          height="520"
          frameBorder="0"
          style={{ display: 'block', minHeight: 520 }}
          allowFullScreen
        />
      </div>
    </div>
  );
}

function LiveSheetsLayer() {
  return (
    <div className="mb-10">
      <div className="uppercase mb-6" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
        Layer 2 · Live Operating Sheets
      </div>
      <SheetEmbed
        title="Agent Pipeline · Recruiting"
        subtitle="Future Agents · Active recruiting targets · Status tracking"
        sheetId={SHEETS.agentRecruiting}
      />
      <SheetEmbed
        title="Event Calendar · Auction Events"
        subtitle="Christie's East Hampton · Events · Auction schedule"
        sheetId={SHEETS.auctionEvents}
      />
      <SheetEmbed
        title="Social Media Tracker · Podcast Pipeline"
        subtitle="Content calendar · William Records · Platform scheduling"
        sheetId={SHEETS.socialPodcast}
      />
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
    description: "Full organizational hierarchy from James Christie through the Auction House and Real Estate Division to the East Hampton team. Approved by Claude, Grok, and ChatGPT.",
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
    description: "Single-hamlet deep-dive PDF wireframe for East Hampton Village — market data, listings, last sale, dining, and news.",
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/mMMpkvVbutZzZYks.html',
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
    label: "Estate Advisory Card · Wireframe",
    description: "Christie's East Hampton estate advisory card — client-facing one-page credential document. CIREG brand, Ed Bruehl, doctrine lines.",
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/wvTlDRaTbuGTazWd.html',
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
    description: "Full council brief — Perplexity compiled, ChatGPT reviewed, Claude approved, Ed authorized. Five-layer header directive, PDF engine, MAPS hamlet spec, PIPE scaffold, and 300-day arc.",
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/JBBnSxvSjfkLOjlS.html',
    pinned: true,
  },
];

const ATTORNEY_DOCS: DocItem[] = [
  {
    id: 'attorney-database',
    label: "Attorney Database · East Hampton & South Fork",
    description: "Curated list of real estate attorneys, estate attorneys, and transaction counsel serving the South Fork market. Maintained by Ed Bruehl.",
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

      <div className="px-6 py-8" style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Layer 1 — Calendar */}
        <CalendarLayer />

        {/* Divider */}
        <div className="mb-10 border-t" style={{ borderColor: 'rgba(200,172,120,0.3)' }} />

        {/* Layer 2 — Live Sheets */}
        <LiveSheetsLayer />

        {/* Divider */}
        <div className="mb-10 border-t" style={{ borderColor: 'rgba(200,172,120,0.3)' }} />

        {/* Layer 3 — Canon Documents */}
        <div className="uppercase mb-6" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          Layer 3 · Canon Documents
        </div>

        <DocSection title="Org Chart & Hierarchy" docs={ORG_CHART_DOCS} />
        <DocSection title="Market Report" docs={MARKET_REPORT_DOCS} />
        <CanonPdfSection />
        <DocSection title="Constitution & SOPs" docs={CONSTITUTION_DOCS} />
        <DocSection title="Council Briefs" docs={COUNCIL_BRIEF_DOCS} />
        <DocSection title="Attorney Database" docs={ATTORNEY_DOCS} />
        <DocSection title="Adam Kalb · IBC Materials" docs={IBC_DOCS} />

      </div>
    </div>
  );
}
