/**
 * INTEL TAB — Operating Control Room
 * Sprint 11 — April 5, 2026
 *
 * Layer Order (Sprint 11 Item 8):
 * 1. Mind Map placeholder — full width, reserved for Sprint 12 institutional mind map
 * 2. Master Calendar — live from Podcast + Event Google Sheets
 * 3. Nine-Sheet Matrix — all nine canonical sheets with open links
 * 4. Document Library — org chart, estate advisory card, 300-day plan, market report, council brief
 * 5. Intelligence Web filtered views — Jarvis Top Agents, Whale Intelligence, Auction Referrals
 *
 * Removed (Sprint 11 Item 8):
 * - Perplexity Mastermind Map iframe (Item 9 — replaced by Sprint 12 institutional mind map)
 * - IntelSourceTemplate, FamilyOfficeList, LocalCharityTracker, AttorneyDatabase, IBC_DOCS
 *
 * Added (Sprint 11 Item 10):
 * - Nine-Sheet Matrix: nine labeled boxes, one-line description, Open in Google Sheets button
 */

import { useState } from 'react';
import { MatrixCard } from '@/components/MatrixCard';
import { IntelligenceWebTabs } from '@/components/IntelligenceWebTabs';
import { InstitutionalMindMap } from '@/components/InstitutionalMindMap';

// ─── Source-of-Truth Sheet IDs (locked April 1, 2026) ─────────────────────────

const SHEET_IDS = {
  podcast:                    '1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8',
  event:                      '1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s',
  agentRecruiting:            '1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA',
  socialPodcast:              '1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I',
  hamptonsOutreachIntelligence: '1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI',
  growthModel:                '1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag',
  officePipeline:             '1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M',
  marketMatrix:               '176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g',
  intelligenceWebMaster:      '1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0',
};

function sheetEmbedUrl(id: string) {
  // Requires sheet to be published: File → Share → Publish to web → Web page → Publish
  return `https://docs.google.com/spreadsheets/d/${id}/pub?widget=true&headers=false`;
}

function sheetOpenUrl(id: string) {
  return `https://docs.google.com/spreadsheets/d/${id}/edit`;
}

// ─── Mind Map Layer 1 — Sprint 13 LIVE ───────────────────────────────────────

function MindMapSection() {
  return (
    <div className="px-6 py-8 border-b" style={{ borderColor: 'rgba(200,172,120,0.2)' }}>
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
        <div className="uppercase mb-3" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
          Layer 1 · Institutional Mind Map
        </div>
        <InstitutionalMindMap />
      </div>
    </div>
  );
}

// ─── Calendar Layer (Layer 2) ─────────────────────────────────────────────────

function CalendarLayer() {
  return (
    <div className="px-6 py-8">
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
      {/* Layer label */}
      <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
        Layer 2 · Master Calendar
      </div>

      {/* Christie's card module */}
      <div style={{
        border: '1px solid #1B2A4A',
        borderRadius: 2,
        overflow: 'hidden',
        background: '#fff',
      }}>
        {/* Card header */}
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
            Open Google Calendar ↗
          </a>
        </div>

        {/* Two-panel embed: Podcast left, Event right */}
        {/* NOTE: Sheets must be published to web for iframe embed to work without login. */}
        {/* File → Share → Publish to web → Entire Document → Web page → Publish */}
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ minHeight: 520 }}>
          <div style={{ borderRight: '1px solid rgba(27,42,74,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="px-3 py-2 text-[9px] uppercase tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.18em', background: 'rgba(27,42,74,0.04)', borderBottom: '1px solid rgba(27,42,74,0.08)', flexShrink: 0 }}>
              Podcast Calendar
            </div>
            <iframe
              src={sheetEmbedUrl(SHEET_IDS.podcast)}
              title="Podcast Calendar"
              width="100%"
              style={{ display: 'block', border: 'none', flex: 1, minHeight: 480 }}
            />
            {/* Fallback link in case sheet is not published */}
            <div className="px-3 py-2 text-center" style={{ background: 'rgba(27,42,74,0.02)', borderTop: '1px solid rgba(27,42,74,0.06)' }}>
              <a href={sheetOpenUrl(SHEET_IDS.podcast)} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Open Podcast Calendar ↗
              </a>
            </div>
          </div>
          <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="px-3 py-2 text-[9px] uppercase tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.18em', background: 'rgba(27,42,74,0.04)', borderBottom: '1px solid rgba(27,42,74,0.08)', flexShrink: 0 }}>
              Event Calendar
            </div>
            <iframe
              src={sheetEmbedUrl(SHEET_IDS.event)}
              title="Event Calendar"
              width="100%"
              style={{ display: 'block', border: 'none', flex: 1, minHeight: 480 }}
            />
            {/* Fallback link in case sheet is not published */}
            <div className="px-3 py-2 text-center" style={{ background: 'rgba(27,42,74,0.02)', borderTop: '1px solid rgba(27,42,74,0.06)' }}>
              <a href={sheetOpenUrl(SHEET_IDS.event)} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Open Event Calendar ↗
              </a>
            </div>
          </div>
        </div>

        {/* Wednesday Circuit — Google Calendar embed (full-width, below the two-panel grid) */}
        <div style={{ borderTop: '1px solid rgba(27,42,74,0.12)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="px-3 py-2 flex items-center justify-between" style={{ background: 'rgba(27,42,74,0.04)', borderBottom: '1px solid rgba(27,42,74,0.08)', flexShrink: 0 }}>
            <div className="text-[9px] uppercase tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.18em' }}>
              Wednesday Circuit · Recurring Every Wednesday from May 7, 2026
            </div>
            <a
              href={`https://calendar.google.com/calendar/r?cid=b591e65ffdfeee02ac8b410880b54bfdd20f29bec8b910fcefa51dd3c8cc97ab`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.6)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}
            >
              Open Calendar ↗
            </a>
          </div>
          <iframe
            src="https://calendar.google.com/calendar/embed?src=b591e65ffdfeee02ac8b410880b54bfdd20f29bec8b910fcefa51dd3c8cc97ab&ctz=America%2FNew_York&mode=MONTH&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0"
            title="Wednesday Circuit Calendar"
            width="100%"
            height="520"
            style={{ display: 'block', border: 'none' }}
          />
        </div>
      </div>
      </div>
    </div>
  );
}
// ─── Nine-Sheet Matrix (Layer 3 — Sprint 11 Item 10) ─────────────────────────


interface SheetEntry {
  id: string;
  name: string;
  description: string;
  sheetId: string;
  badge?: string;
}

const NINE_SHEETS: SheetEntry[] = [
  {
    id: 'growth-model',
    name: 'Growth Model v2',
    description: 'Agent volume projections, GCI model, ROSTER, LEADERBOARD, OUTPUTS, and recruiting pipeline. Single source of truth for the Ascension Arc.',
    sheetId: SHEET_IDS.growthModel,
    badge: 'FUTURE Tab',
  },
  {
    id: 'office-pipeline',
    name: 'Office Pipeline',
    description: 'Live deal tracker — active deals across all eleven hamlets. Status, price, hamlet, agent, and notes. Drives the PIPE tab in real time.',
    sheetId: SHEET_IDS.officePipeline,
    badge: 'PIPE Tab',
  },
  {
    id: 'market-matrix',
    name: 'Market Matrix',
    description: 'Eleven-hamlet market data matrix — CIS scores, 2025 medians, dollar volume share, sales counts, and four-year direction. Drives the MARKET tab.',
    sheetId: SHEET_IDS.marketMatrix,
    badge: 'MARKET Tab',
  },
  {
    id: 'future-agents',
    name: 'Future Agents Recruiting',
    description: 'Tier 1 and Tier 2 agent recruiting targets — status, firm, territory, and outreach cadence. Jarvis Top Agents audience.',
    sheetId: SHEET_IDS.agentRecruiting,
    badge: 'INTEL Layer 2',
  },
  {
    id: 'intel-web-master',
    name: 'Intelligence Web Master',
    description: '47 entities across RECRUIT, WHALE, COMPETITOR, PARTNER, ATTORNEY, ADVISOR, MEDIA, INSTITUTION, and COUNCIL types. 17 columns including Last Touch and Cadence.',
    sheetId: SHEET_IDS.intelligenceWebMaster,
    badge: 'INTEL Layer 5',
  },
  {
    id: 'social-pipeline',
    name: 'Social Pipeline',
    description: 'Content calendar, social post tracker, and podcast episode pipeline. Coordinates Angel\'s weekly production schedule.',
    sheetId: SHEET_IDS.socialPodcast,
    badge: 'INTEL Layer 2',
  },
  {
    id: 'event-calendar',
    name: 'Event Calendar',
    description: 'All Christie\'s East Hampton events — Private Collector Series, caravan, office meetings, and community events. Syncs to Google Calendar via Apps Script.',
    sheetId: SHEET_IDS.event,
    badge: 'INTEL Layer 2',
  },
  {
    id: 'podcast-calendar',
    name: 'Podcast Calendar',
    description: 'Weekly podcast episode schedule — guest, topic, recording date, and publication date. Angel\'s production master.',
    sheetId: SHEET_IDS.podcast,
    badge: 'INTEL Layer 2',
  },
  {
    id: 'hamptons-outreach',
    name: 'Hamptons Outreach Intelligence',
    description: 'UHNW targeting intelligence — Tier A and Tier B principals, outreach sequence, campaign playbook, and Christie\'s Neighborhood Card mailer list.',
    sheetId: SHEET_IDS.hamptonsOutreachIntelligence,
    badge: 'Internal',
  },
];

function NineSheetMatrix() {
  return (
    <div className="px-6 py-8 border-t" style={{ borderColor: 'rgba(200,172,120,0.2)' }}>
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
          Layer 3 · Nine-Sheet Matrix
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.2rem', marginBottom: 6 }}>
          Canonical Data Sources
        </div>
        <div className="mb-6 text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
          All nine Google Sheets powering the Christie's East Hampton platform. Each opens directly in Google Sheets.
        </div>

        <div className="grid grid-cols-1 gap-3" style={{ maxWidth: 860 }}>
          {NINE_SHEETS.map((sheet, i) => (
            <div
              key={sheet.id}
              style={{
                border: '1px solid rgba(27,42,74,0.12)',
                borderLeft: '3px solid rgba(200,172,120,0.5)',
                background: '#fff',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              {/* Index number */}
              <div style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: 11,
                color: 'rgba(200,172,120,0.5)',
                letterSpacing: '0.1em',
                minWidth: 20,
                textAlign: 'center',
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Sheet info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '0.98rem' }}>
                    {sheet.name}
                  </div>
                  {sheet.badge && (
                    <span style={{
                      fontFamily: '"Barlow Condensed", sans-serif',
                      fontSize: 8,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#C8AC78',
                      background: 'rgba(200,172,120,0.1)',
                      border: '1px solid rgba(200,172,120,0.3)',
                      borderRadius: 2,
                      padding: '2px 7px',
                    }}>
                      {sheet.badge}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.78rem', lineHeight: 1.45 }}>
                  {sheet.description}
                </div>
              </div>

              {/* Open button */}
              <a
                href={sheetOpenUrl(sheet.sheetId)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-block px-4 py-2 text-[9px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
                style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#C8AC78', color: '#1B2A4A', letterSpacing: '0.16em', whiteSpace: 'nowrap' }}
              >
                Open Sheet ↗
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Document Library (Layer 4) ───────────────────────────────────────────────
// Sprint 11 Item 8: Keep only — Org Chart, Estate Advisory Card PDF,
// 300-Day Ascension Plan, Market Report wireframe, Council Brief.
// Remove: IntelSourceTemplate, FamilyOfficeList, LocalCharityTracker,
//         AttorneyDatabase, IBC_DOCS, CanonPdfSection (dynamic).

interface DocItem {
  id: string;
  label: string;
  description: string;
  url: string | null;
  pinned?: boolean;
}

const DOCUMENT_LIBRARY: DocItem[] = [
  {
    id: 'org-chart-v2',
    label: 'CIREG Ecosystem · Organizational Map · April 2, 2026',
    description: 'Five-tier institutional hierarchy: Artémis / Pinault Family → Christie\'s Auction House → CIH → CIREG Tri-State → Christie\'s East Hampton Flagship. CIREG Brand Guidelines compliant. Guillaume Cerutti marked departed March 30, 2026.',
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/cireg-org-chart-v2-april-2026_cf381d58.html',
    pinned: true,
  },
  {
    id: 'estate-advisory-card',
    label: 'Estate Advisory Card · PDF',
    description: 'Christie\'s East Hampton estate advisory card — client-facing credential document. CIREG brand, Ed Bruehl, doctrine lines. Send as PDF in 30 seconds from any Christie\'s meeting.',
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/christies-estate-advisory-card_e0fc3254.pdf',
    pinned: true,
  },
  {
    id: '300day-ascension',
    label: '300-Day Ascension Plan · Wireframe',
    description: 'Full 300-day growth arc from foundation through market authority — agent recruitment, GCI targets, institutional positioning milestones.',
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/WXzEqCTtWmVsElaB.html',
  },
  {
    id: 'market-report-live-v2',
    label: 'Christie\'s Hamptons Live Market Report · v2 · March 2026',
    description: 'Full live market report wireframe — six sections, hamlet atlas, ANEW intelligence, rate environment, and resources. Council-approved March 29, 2026.',
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/vevzqEIvPqAYOdHz.html',
  },
  {
    id: 'council-brief-march-2026',
    label: 'Council Brief · March 29, 2026 · FINAL',
    description: 'Full council brief — five-layer header directive, PDF engine, MAPS hamlet spec, PIPE scaffold, and 300-day arc.',
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/JBBnSxvSjfkLOjlS.html',
    pinned: true,
  },
  // P2 — Sprint 12: UHNW assets hosted on Manus CDN
  {
    id: 'uhnw-backend-strategy',
    label: 'Modern Day Path · UHNW Backend Strategy · April 2026',
    description: 'UHNW targeting intelligence — Tier A and Tier B principals, art-secured lending pathway, Christie’s auction house referral architecture, and the Christie’s Neighborhood Card mailer playbook. Art-secured lending terminology applied throughout.',
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/Modern_Day_Path_UHNW_Backend_Strategy_56d7c1aa.pdf',
    pinned: true,
  },
  {
    id: 'intelligence-web-canonical',
    label: 'Christie’s Intelligence Web · Canonical Map · April 2026',
    description: 'Full institutional relationship map — 47 entities across RECRUIT, WHALE, COMPETITOR, PARTNER, ATTORNEY, ADVISOR, MEDIA, INSTITUTION, and COUNCIL types. Interactive spiderweb visualization. Frank Newbold: RELATIONSHIP_INTELLIGENCE · Brand tier.',
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/Christies_Intelligence_Web_Locked_7c609b20.html',
    pinned: true,
  },
  {
    id: 'infrastructure-audit-april-2026',
    label: 'Platform Infrastructure Audit · April 6, 2026',
    description: 'Full operating manual for the Christie’s East Hampton Intelligence Platform. Nine Google Sheets, six CDN documents, five INTEL tab layers, all tRPC procedures, caching architecture, WhatsApp pipeline, PDF engine, and twelve identified gaps. The canonical reference for how the platform thinks, grows, and reports.',
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/infrastructure_audit_april6_2026_208e007c.pdf',
    pinned: true,
  },
];

function DocumentLibrary() {
  return (
    <div className="px-6 py-8 border-t" style={{ borderColor: 'rgba(200,172,120,0.2)' }}>
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
          Layer 4 · Document Library
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.2rem', marginBottom: 24 }}>
          Canon Documents
        </div>

        <div className="flex flex-col gap-3" style={{ maxWidth: 860 }}>
          {DOCUMENT_LIBRARY.map(doc => (
            <MatrixCard key={doc.id} variant={doc.pinned ? 'active' : 'default'} className="p-5">
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
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
                      style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#C8AC78', color: '#1B2A4A', letterSpacing: '0.16em' }}
                    >
                      {doc.url.endsWith('.html') ? 'Open Document' : 'Open PDF'}
                    </a>
                  ) : null}
                </div>
              </div>
            </MatrixCard>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Intelligence Web Layer (Layer 5) ────────────────────────────────────────

function IntelligenceWebLayer() {
  return (
    <div className="px-6 py-8 border-t" style={{ borderColor: 'rgba(200,172,120,0.2)' }}>
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
          Layer 5 · Relationship Intelligence
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.2rem', marginBottom: 6 }}>
          Intelligence Web
        </div>
        <div className="mb-6 text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
          48 entities · Jarvis Top Agents · Whale Intelligence · Auction Referrals · Internal use only.
        </div>
        <IntelligenceWebTabs />
      </div>
    </div>
  );
}

// ─── Sticky Section Navigator ─────────────────────────────────────────────────

const INTEL_SECTIONS = [
  { id: 'intel-layer-1', label: 'Layer 1 · Mind Map' },
  { id: 'intel-layer-2', label: 'Layer 2 · Calendar' },
  { id: 'intel-layer-3', label: 'Layer 3 · Nine Sheets' },
  { id: 'intel-layer-4', label: 'Layer 4 · Documents' },
  { id: 'intel-layer-5', label: 'Layer 5 · Intel Web' },
];

function IntelStickyNav() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: '#1B2A4A',
        borderBottom: '1px solid rgba(200,172,120,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        overflowX: 'auto',
        padding: '0 16px',
      }}
    >
      {INTEL_SECTIONS.map(s => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(200,172,120,0.8)',
            background: 'transparent',
            border: 'none',
            padding: '10px 14px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            borderBottom: '2px solid transparent',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = '#C8AC78'; (e.target as HTMLButtonElement).style.borderBottomColor = '#C8AC78'; }}
          onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = 'rgba(200,172,120,0.8)'; (e.target as HTMLButtonElement).style.borderBottomColor = 'transparent'; }}
        >
          {s.label}
        </button>
      ))}
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
          Mind Map · Calendar · Nine-Sheet Matrix · Canon Documents · Intelligence Web.
        </p>
      </div>

      {/* Sticky section navigator */}
      <IntelStickyNav />

      {/* Layer 1 — Institutional Mind Map (Sprint 12 reserved) */}
      <div id="intel-layer-1" />
      <MindMapSection />

      <div style={{ height: 1, background: 'rgba(200,172,120,0.2)' }} />

      {/* Layer 2 — Master Calendar */}
      <div id="intel-layer-2" />
      <CalendarLayer />

      <div style={{ height: 1, background: 'rgba(200,172,120,0.2)' }} />

      {/* Layer 3 — Nine-Sheet Matrix */}
      <div id="intel-layer-3" />
      <NineSheetMatrix />

      {/* Layer 4 — Document Library */}
      <div id="intel-layer-4" />
      <DocumentLibrary />

      {/* Layer 5 — Intelligence Web */}
      <div id="intel-layer-5" />
      <IntelligenceWebLayer />

      {/* Doctrine footer */}
      <div className="px-6 py-4 text-center border-t" style={{ background: '#1B2A4A', borderColor: '#C8AC78' }}>
        <div style={{ fontFamily: '"Source Sans 3", sans-serif', fontStyle: 'italic', color: 'rgba(200,172,120,0.65)', fontSize: '0.72rem' }}>
          Art. Beauty. Provenance. · 26 Park Place, East Hampton, NY 11937 · 646-752-1233
        </div>
      </div>

    </div>
  );
}
