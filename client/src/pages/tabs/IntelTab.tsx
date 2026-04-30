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

import React, { useMemo, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { MatrixCard } from '@/components/MatrixCard';
import { IntelligenceWebTabs } from '@/components/IntelligenceWebTabs';
import { EdCorkboard } from '@/components/EdCorkboard';
// ─── Wednesday Circuit Countdown ────────────────────────────────────────────────────────
// Recurring every Wednesday from May 6, 2026

function WednesdayCircuitCountdown() {
  const { daysUntil, nextDate, isToday } = useMemo(() => {
    const now = new Date();
    // Find next Wednesday (day 3) on or after May 6, 2026
    const seriesStart = new Date('2026-05-06T00:00:00');
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // If today is before series start, count to series start
    let target = new Date(seriesStart);
    if (today >= seriesStart) {
      // Find the next Wednesday on or after today
      target = new Date(today);
      const dow = target.getDay(); // 0=Sun, 3=Wed
      const daysToWed = (3 - dow + 7) % 7;
      target.setDate(target.getDate() + daysToWed);
    }
    const diffMs = target.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const dateStr = target.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    return { daysUntil: diffDays, nextDate: dateStr, isToday: diffDays === 0 };
  }, []);

  const LABEL: React.CSSProperties = { fontFamily: '"Barlow Condensed", sans-serif' };
  const SERIF: React.CSSProperties = { fontFamily: '"Cormorant Garamond", serif' };
  const SANS: React.CSSProperties = { fontFamily: '"Source Sans 3", sans-serif' };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 16,
      background: 'rgba(200,172,120,0.08)',
      border: '1px solid rgba(200,172,120,0.3)',
      padding: '8px 16px',
      marginTop: 12,
    }}>
      <div style={{ textAlign: 'center', minWidth: 48 }}>
        <div style={{ ...SERIF, color: '#947231', fontSize: isToday ? '1.5rem' : '2rem', fontWeight: 600, lineHeight: 1 }}>
          {isToday ? 'TODAY' : daysUntil}
        </div>
        {!isToday && (
          <div style={{ ...LABEL, color: 'rgba(200,172,120,0.6)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>
            days
          </div>
        )}
      </div>
      <div style={{ width: 1, height: 32, background: 'rgba(200,172,120,0.2)' }} />
      <div>
        <div style={{ ...LABEL, color: '#947231', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 3 }}>
          Wednesday Circuit
        </div>
        <div style={{ ...SANS, color: 'rgba(250,248,244,0.75)', fontSize: '0.8rem' }}>
          {nextDate}
        </div>
        <div style={{ ...SANS, color: 'rgba(250,248,244,0.35)', fontSize: '0.7rem', marginTop: 2 }}>
          Recurring weekly · Christie's East Hampton
        </div>
      </div>
    </div>
  );
}

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

// ─── Mind Map Layer 1 — Miro Live Embed (wired Sit-Down Six, April 13, 2026) ─────────────────
// Miro embed URL (live read-only): https://miro.com/app/live-embed/uXjVGj6Oc40=/
// Miro board URL (editable, requires Miro sign-in): https://miro.com/app/board/uXjVGj6Oc40=/
// React D3 InstitutionalMindMap placeholder replaced by live Miro embed per Sit-Down Six.
// Mindmap.so is DEAD per doctrine — URL stripped from public render (D36 · Apr 19 2026)

const MIRO_EMBED_URL = 'https://miro.com/app/live-embed/uXjVGj6Oc40=/';
const MIRO_BOARD_URL = 'https://miro.com/app/board/uXjVGj6Oc40=/';

// H8 · Option B — styled branded CTA fallback card
// Detects iframe load failure via onLoad (checks contentWindow access) + onError.
// Live embed shown when browser allows third-party cookies; CTA card shown otherwise.
function MindMapSection() {
  const [embedBlocked, setEmbedBlocked] = React.useState(false);
  return (
    <div className="px-6 py-8" style={{ background: 'transparent' }}>
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
        <div style={{ background: 'rgba(27,42,74,0.92)', border: '1px solid rgba(200,172,120,0.35)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.35)', padding: '32px 28px' }}>
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 10 }}>
                Layer 2 · Institutional Mind Map
              </div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.35rem', margin: 0 }}>
                Christie's Flagship Mind Map
              </h3>
              <p className="mt-1 text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.7)' }}>
                Institutional architecture · Ed at center · Auction House Track + Real Estate Track · Five radiating rings
              </p>
            </div>
            <a
              href={MIRO_BOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                border: '1px solid rgba(200,172,120,0.6)',
                color: '#947231',
                padding: '8px 22px',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: 2,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                transition: 'background 0.15s',
              }}
            >
              Open in Miro ↗
            </a>
          </div>
          {/* Live Miro embed — shown unless onError fires */}
          {!embedBlocked && (
            <iframe
              src={MIRO_EMBED_URL}
              style={{ width: '100%', height: 480, border: 'none', borderRadius: 4, display: 'block' }}
              allow="fullscreen; clipboard-read; clipboard-write"
              onError={() => setEmbedBlocked(true)}
              title="Christie's Flagship Mind Map"
            />
          )}
          {/* Branded fallback card — shown only when live embed is blocked */}
          {embedBlocked && (
          <div style={{
            background: '#0D1520',
            border: '1px solid rgba(200,172,120,0.2)',
            borderRadius: 4,
            padding: '48px 32px',
            textAlign: 'center',
            minHeight: 280,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
          }}>
            {/* Gold rule */}
            <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, transparent, #947231, transparent)' }} />
            {/* Miro icon placeholder */}
            <div style={{
              width: 56, height: 56,
              border: '1px solid rgba(200,172,120,0.35)',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(200,172,120,0.06)',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.7 }}>
                <circle cx="12" cy="12" r="10" stroke="#947231" strokeWidth="1.2" />
                <circle cx="12" cy="12" r="3" fill="#947231" opacity="0.6" />
                <line x1="12" y1="2" x2="12" y2="6" stroke="#947231" strokeWidth="1.2" />
                <line x1="12" y1="18" x2="12" y2="22" stroke="#947231" strokeWidth="1.2" />
                <line x1="2" y1="12" x2="6" y2="12" stroke="#947231" strokeWidth="1.2" />
                <line x1="18" y1="12" x2="22" y2="12" stroke="#947231" strokeWidth="1.2" />
                <line x1="4.9" y1="4.9" x2="7.8" y2="7.8" stroke="#947231" strokeWidth="1.2" />
                <line x1="16.2" y1="16.2" x2="19.1" y2="19.1" stroke="#947231" strokeWidth="1.2" />
                <line x1="19.1" y1="4.9" x2="16.2" y2="7.8" stroke="#947231" strokeWidth="1.2" />
                <line x1="7.8" y1="16.2" x2="4.9" y2="19.1" stroke="#947231" strokeWidth="1.2" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontSize: '1.2rem', fontWeight: 400, marginBottom: 8 }}>
                Christie's Flagship Mind Map
              </div>
              <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.5)', fontSize: '0.78rem', lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>
                47 nodes · Ed at center · Auction House Track + Real Estate Track · Five radiating rings · Live on Miro
              </div>
            </div>
            <a
              href={MIRO_BOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 28px',
                background: 'transparent',
                border: '1px solid rgba(200,172,120,0.6)',
                color: '#947231',
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: 2,
                transition: 'background 0.2s',
              }}
            >
              Open Mind Map in Miro ↗
            </a>
            {/* Gold rule */}
            <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, transparent, #947231, transparent)' }} />
          </div>
          )}
          {/* Footer caption */}
          {embedBlocked && (
          <div className="mt-3 text-center" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.35)', fontSize: 10 }}>
            Live Miro board · Institutional architecture · Edits made in Miro reflect on next load
          </div>
          )}
          {/* Section 7D — CTA parity: OPEN FULL MAP → */}
          {!embedBlocked && (
            <div style={{ marginTop: 12, textAlign: 'right' as const }}>
              <a
                href={MIRO_BOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  background: '#c9a84c',
                  color: '#0a1628',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase' as const,
                  fontWeight: 700,
                  padding: '8px 20px',
                  borderRadius: 2,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Open Full Map →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TRELLO_BOARD_URL = 'https://trello.com/b/H2mvEgRi';

// ─── Option A: Branded static tile (no iframe, no Trello API key needed) ─────
// 16 lanes · 213 cards · navy/gold · Cormorant Garamond · Perp audit Apr 23 2026
// Static counts canonical as of April 23, 2026 · Issue #2 fix · GitHub Issue #2
// TRELLO_LANES static list removed — replaced by live trpc.intel.trelloTriage query (Section 7 · Apr 29 2026)
// Banker-book data (RECRUITS 28, FLAGSHIP TEAM 7) must not broadcast publicly.

// ─── Section 7 · Command Board Triage Strip ───────────────────────────────────
// Live Trello data via trpc.intel.trelloTriage · 10 filter pills · Apr 29 2026
// Banker-book data (RECRUITS, FLAGSHIP TEAM counts) NOT rendered publicly.
// Only card names, assignees, due dates, labels, and list names are shown.

const TRIAGE_PILLS = [
  { label: 'All',     filter: '' },
  { label: 'Mine',    filter: 'Ed Bruehl' },
  { label: 'Angel',   filter: 'Angel Theodore' },
  { label: 'Jarvis',  filter: 'Jarvis' },
  { label: 'Zoila',   filter: 'Zoila' },
  { label: 'Scott',   filter: 'Scott' },
  { label: 'Richard', filter: 'Richard' },
  { label: 'Griff',   filter: 'Griff' },
  { label: 'Agenda',  filter: 'AGENDA' },
  { label: 'Mtg',     filter: 'MTG' },
];

function TrelloLayer() {
  const NAVY    = '#0a1628';
  const GOLD    = '#c9a84c';
  const CREAM   = '#faf8f4';
  const MUTED   = 'rgba(250,248,244,0.75)';
  const LABEL_S: React.CSSProperties = { fontFamily: '"Barlow Condensed", sans-serif' };
  const SERIF_S: React.CSSProperties = { fontFamily: '"Cormorant Garamond", serif' };
  const SANS_S:  React.CSSProperties = { fontFamily: '"Source Sans 3", sans-serif' };

  const [activePill, setActivePill] = React.useState('');
  const { data, isLoading, error } = trpc.intel.trelloTriage.useQuery(
    { pill: activePill },
    { staleTime: 2 * 60 * 1000, refetchOnWindowFocus: false }
  );

  const cards = data?.cards ?? [];

  // Filter by pill
  const filtered = React.useMemo(() => {
    if (!activePill) return cards.slice(0, 12);
    const f = activePill.toLowerCase();
    if (f === 'agenda') {
      return cards.filter((c: any) => c.listName?.toLowerCase().includes('agenda')).slice(0, 12);
    }
    if (f === 'mtg') {
      return cards.filter((c: any) =>
        c.listName?.toLowerCase().includes('mtg') ||
        c.name?.toLowerCase().includes('mtg') ||
        c.labels?.some((l: any) => l.name?.toLowerCase().includes('mtg'))
      ).slice(0, 12);
    }
    return cards.filter((c: any) =>
      c.assignees?.some((a: string) => a.toLowerCase().includes(f)) ||
      c.listName?.toLowerCase().includes(f)
    ).slice(0, 12);
  }, [cards, activePill]);

  // Label color map
  const labelColor = (color: string) => {
    const map: Record<string, string> = {
      red: '#e05555', green: '#4caf7d', blue: '#4a90d9', yellow: '#c9a84c',
      orange: '#e08c3a', purple: '#9c6dd8', pink: '#d96da0', sky: '#5bc4e0',
      lime: '#8bc34a', black: '#555', null: '#947231',
    };
    return map[color] ?? '#947231';
  };

  return (
    <div className="px-6 py-8" style={{ background: 'transparent' }}>
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
        <div style={{ background: 'rgba(27,42,74,0.88)', border: '1px solid rgba(200,172,120,0.35)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.35)', padding: '20px 24px' }}>

          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div style={{ ...LABEL_S, color: GOLD, letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 4 }}>
                Layer 1 · Command Board
              </div>
              <h3 style={{ ...SERIF_S, color: CREAM, fontWeight: 400, fontSize: '1.35rem', margin: 0, letterSpacing: '0.04em' }}>
                Christie’s East Hampton · Command Board
              </h3>
              <p style={{ ...SANS_S, color: MUTED, fontSize: 11, marginTop: 4 }}>
                Live Operating Board · Open Trello to view
              </p>
            </div>
            <a
              href={TRELLO_BOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...LABEL_S,
                border: `1px solid ${GOLD}`,
                color: GOLD,
                padding: '6px 18px',
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: 2,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                transition: 'background 0.15s',
              }}
            >
              Open in Trello ↗
            </a>
          </div>

          {/* 9 filter pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {TRIAGE_PILLS.map(pill => (
              <button
                key={pill.label}
                onClick={() => setActivePill(activePill === pill.filter ? '' : pill.filter)}
                style={{
                  ...LABEL_S,
                  fontSize: 9,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '4px 12px',
                  borderRadius: 2,
                  border: `1px solid ${activePill === pill.filter ? GOLD : 'rgba(200,172,120,0.3)'}`,
                  background: activePill === pill.filter ? 'rgba(201,168,76,0.18)' : 'transparent',
                  color: activePill === pill.filter ? GOLD : 'rgba(200,172,120,0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Triage strip */}
          {isLoading && (
            <div style={{ ...SANS_S, color: MUTED, fontSize: 11, padding: '24px 0', textAlign: 'center' }}>
              Loading live board…
            </div>
          )}
          {!isLoading && (error || data?.error) && (
            <div style={{ background: NAVY, border: `1px solid ${GOLD}`, borderRadius: 4, padding: '20px 20px 16px' }}>
              <div style={{ ...SANS_S, color: MUTED, fontSize: 11, marginBottom: 16 }}>
                Live board data unavailable. Open Trello directly to view the Command Board.
              </div>
              <a
                href={TRELLO_BOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  background: GOLD, color: NAVY, ...LABEL_S,
                  fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase',
                  fontWeight: 700, padding: '10px 0', borderRadius: 2,
                  textDecoration: 'none', boxSizing: 'border-box' as const,
                }}
              >
                Open Full Board →
              </a>
            </div>
          )}
          {!isLoading && !error && !data?.error && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filtered.length === 0 && (
                <div style={{ ...SANS_S, color: MUTED, fontSize: 11, padding: '16px 0', textAlign: 'center' }}>
                  No cards match this filter.
                </div>
              )}
              {filtered.map((card: any) => (
                <a
                  key={card.id}
                  href={card.shortUrl || TRELLO_BOARD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    background: 'rgba(201,168,76,0.04)',
                    border: '0.5px solid rgba(200,172,120,0.2)',
                    borderRadius: 3,
                    padding: '10px 14px',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.10)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.04)')}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
                      {card.labels?.map((lbl: any, i: number) => (
                        <span key={i} style={{
                          display: 'inline-block',
                          width: 8, height: 8, borderRadius: '50%',
                          background: labelColor(lbl.color),
                          flexShrink: 0,
                        }} />
                      ))}
                      <span style={{ ...SERIF_S, color: CREAM, fontSize: 13, fontWeight: 500, letterSpacing: '0.03em', lineHeight: 1.3 }}>
                        {card.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ ...LABEL_S, color: 'rgba(200,172,120,0.5)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                        {card.listName}
                      </span>
                      {card.assignees?.length > 0 && (
                        <span style={{ ...SANS_S, color: 'rgba(250,248,244,0.4)', fontSize: 9 }}>
                          · {card.assignees.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  {card.due && (
                    <span style={{ ...LABEL_S, color: 'rgba(200,172,120,0.55)', fontSize: 9, letterSpacing: '0.1em', flexShrink: 0 }}>
                      {new Date(card.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </a>
              ))}
              {/* Full-width Open Board button */}
              <a
                href={TRELLO_BOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  background: GOLD, color: NAVY, ...LABEL_S,
                  fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase',
                  fontWeight: 700, padding: '10px 0', borderRadius: 2,
                  textDecoration: 'none', boxSizing: 'border-box' as const,
                  marginTop: 4,
                }}
              >
                Open Full Board →
              </a>
            </div>
          )}
        </div>{/* /mount frame */}
      </div>
    </div>
  );
}

// ─── Calendar Layer (Layer 2) ─────────────────────────────────────────────────────

const GOOGLE_CAL_EMBED_URL = 'https://calendar.google.com/calendar/embed?src=b591e65ffdfeee02ac8b410880b54bfdd20f29bec8b910fcefa51dd3c8cc97ab&ctz=America%2FNew_York&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&mode=MONTH';
function CalendarLayer() {
  const GOOGLE_CAL_URL = 'https://calendar.google.com/calendar/r';
  const GOOGLE_CAL_CID_URL = 'https://calendar.google.com/calendar/r?cid=b591e65ffdfeee02ac8b410880b54bfdd20f29bec8b910fcefa51dd3c8cc97ab';
  const [calBlocked, setCalBlocked] = React.useState(false);
  return (
    <div className="px-6 py-8 border-t" style={{ borderColor: 'rgba(200,172,120,0.2)', background: 'transparent' }}>
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
        <div style={{ background: 'rgba(27,42,74,0.92)', border: '1px solid rgba(200,172,120,0.35)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.35)', padding: '32px 28px' }}>
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 10 }}>
                Layer 3 · Master Calendar
              </div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.35rem', margin: 0 }}>
                Christie's East Hampton · Master Calendar
              </h3>
              <p className="mt-1 text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.7)' }}>
                Podcast · Event · Internal · Social · Wednesday Circuit
              </p>
            </div>
            <a
              href={GOOGLE_CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                border: '1px solid rgba(200,172,120,0.6)',
                color: '#947231',
                padding: '8px 22px',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: 2,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                transition: 'background 0.15s',
              }}
            >
              Open Calendar ↗
            </a>
          </div>
          {/* Live Google Calendar embed — shown unless onError fires */}
          {!calBlocked && (
            <iframe
              src={GOOGLE_CAL_EMBED_URL}
              style={{ width: '100%', height: 480, border: 'none', borderRadius: 4, display: 'block' }}
              onError={() => setCalBlocked(true)}
              title="Christie's East Hampton Calendar"
            />
          )}
          {/* Branded fallback card — shown only when live embed is blocked */}
          {calBlocked && (
          <div style={{
            background: '#0D1520',
            border: '1px solid rgba(200,172,120,0.2)',
            borderRadius: 4,
            padding: '40px 32px',
            minHeight: 220,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            textAlign: 'center',
          }}>
            {/* Gold rule */}
            <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, transparent, #947231, transparent)' }} />
            {/* Calendar icon */}
            <div style={{
              width: 56, height: 56,
              border: '1px solid rgba(200,172,120,0.35)',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(200,172,120,0.06)',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.7 }}>
                <rect x="3" y="4" width="18" height="17" rx="2" stroke="#947231" strokeWidth="1.2" />
                <line x1="3" y1="9" x2="21" y2="9" stroke="#947231" strokeWidth="1.2" />
                <line x1="8" y1="2" x2="8" y2="6" stroke="#947231" strokeWidth="1.2" />
                <line x1="16" y1="2" x2="16" y2="6" stroke="#947231" strokeWidth="1.2" />
                <rect x="7" y="12" width="3" height="3" rx="0.5" fill="#947231" opacity="0.5" />
                <rect x="13" y="12" width="3" height="3" rx="0.5" fill="#947231" opacity="0.5" />
                <rect x="7" y="17" width="3" height="2" rx="0.5" fill="#947231" opacity="0.3" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontSize: '1.15rem', fontWeight: 400, marginBottom: 8 }}>
                Wednesday Circuit · Recurring Every Wednesday from May 6, 2026
              </div>
              <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.5)', fontSize: '0.78rem', lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>
                Podcast · Event · Internal · Social calendars · All Christie's East Hampton events
              </div>
            </div>
            {/* Two CTA buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a
                href={GOOGLE_CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(200,172,120,0.6)',
                  color: '#947231',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: 2,
                  transition: 'background 0.2s',
                }}
              >
                Open Google Calendar ↗
              </a>
              <a
                href={GOOGLE_CAL_CID_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 24px',
                  background: 'rgba(200,172,120,0.08)',
                  border: '1px solid rgba(200,172,120,0.25)',
                  color: 'rgba(200,172,120,0.7)',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: 2,
                  transition: 'background 0.2s',
                }}
              >
                Subscribe to Wednesday Circuit ↗
              </a>
            </div>
            {/* Gold rule */}
            <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, transparent, #947231, transparent)' }} />
          </div>
          )}
          {/* Wednesday Circuit countdown */}
          <div className="mt-4 flex justify-center">
            <WednesdayCircuitCountdown />
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
  tabGid?: string; // Optional GID for linking to a specific tab within the sheet
}

const NINE_SHEETS: SheetEntry[] = [
  {
    id: 'growth-model',
    name: 'Growth Model',
    description: 'Agent volume projections, GCI model, ROSTER, LEADERBOARD, OUTPUTS, and recruiting pipeline. Single source of truth for the Ascension Arc.',
    sheetId: SHEET_IDS.growthModel,
    badge: 'FUTURE Tab',
  },
  {
    id: 'office-pipeline',
    name: 'Office Pipeline',
    description: 'Live deal tracker: active deals across all ten canonical hamlets. Status, price, hamlet, agent, and notes. Drives the PIPE tab in real time.',
    sheetId: SHEET_IDS.officePipeline,
    badge: 'PIPE Tab',
  },
  {
    id: 'market-matrix',
    name: 'Market Matrix',
    description: 'Ten-hamlet market data matrix: 2025 medians, dollar volume share, sales counts, and four-year direction. Drives the MARKET tab.',
    sheetId: SHEET_IDS.marketMatrix,
    badge: 'MARKET Tab',
  },
  {
    id: 'future-agents',
    name: 'Future Agents Recruiting',
    description: 'Tier 1 and Tier 2 agent recruiting targets: status, firm, territory, and outreach cadence. Jarvis Top Agents audience.',
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
    description: 'All Christie\'s East Hampton events: Private Collector Series, caravan, office meetings, and community events. Syncs to Google Calendar via Apps Script.',
    sheetId: SHEET_IDS.event,
    badge: 'INTEL Layer 2',
  },
  {
    id: 'podcast-calendar',
    name: 'Podcast Calendar',
    description: 'Weekly podcast episode schedule: guest, topic, recording date, and publication date. Angel\'s production master.',
    sheetId: SHEET_IDS.podcast,
    badge: 'INTEL Layer 2',
  },
  {
    id: 'hamptons-outreach',
    name: 'Hamptons Outreach Intelligence',
    description: 'UHNW targeting intelligence: Tier A and Tier B principals, outreach sequence, campaign playbook, and Christie\'s Neighborhood Card mailer list. Master sheet with 10 tabs.',
    sheetId: SHEET_IDS.hamptonsOutreachIntelligence,
    badge: 'Internal',
  },
  // ── 4 Operational Tabs from Hamptons_Outreach_COMPLETE (Perplexity directive, April 8, 2026)
  // These are active operational documents Angel uses weekly. Must be accessible from Layer 3.
  {
    id: 'outreach-uhnw-oceanfront',
    name: 'UHNW Oceanfront · 314-Property Outreach List',
    description: '314 oceanfront UHNW principals: Tier A and Tier B. Column T: MAGAZINE TIER 1 (being populated by Perplexity). Active outreach campaign list. Angel uses weekly.',
    sheetId: SHEET_IDS.hamptonsOutreachIntelligence,
    badge: 'Outreach · Active',
  },
  {
    id: 'outreach-campaign-playbook',
    name: 'Campaign Playbook · Outreach Structure',
    description: 'Outreach campaign structure and playbook. Governs the oceanfront letter campaign sequence, timing, and follow-up protocol.',
    sheetId: SHEET_IDS.hamptonsOutreachIntelligence,
    badge: 'Outreach · Active',
  },
  {
    id: 'outreach-proof-points',
    name: 'Proof Points · Oceanfront Auction Letter',
    description: 'Proof points for the oceanfront auction letter campaign. Christie\'s credentials, comparable sales, and institutional authority statements.',
    sheetId: SHEET_IDS.hamptonsOutreachIntelligence,
    badge: 'Outreach · Active',
  },
  {
    id: 'outreach-sop-angel',
    name: 'SOP · Angel · Weekly Mail Campaign',
    description: 'Standard operating procedure for the weekly mail campaign. Angel\'s weekly production schedule, mailing cadence, and execution checklist.',
    sheetId: SHEET_IDS.hamptonsOutreachIntelligence,
    badge: 'SOP · Angel',
  },
];

function NineSheetMatrix() {
  return (
    <div className="px-6 py-8" style={{ background: 'rgba(27, 42, 74, 0.75)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', borderTop: '1px solid rgba(200,172,120,0.4)', borderBottom: '1px solid rgba(200,172,120,0.4)' }}>
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 10 }}>
          Layer 4 · Thirteen-Sheet Matrix
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.2rem', marginBottom: 6 }}>
          Canonical Data Sources
        </div>
        <div className="mb-6 text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.85)' }}>
          Thirteen Google Sheets powering the Christie's East Hampton platform: nine canonical data sources plus four active operational tabs from the Hamptons Outreach Intelligence sheet. Each opens directly in Google Sheets.
        </div>

        <div className="grid grid-cols-1 gap-3" style={{ maxWidth: 860 }}>
          {NINE_SHEETS.map((sheet, i) => (
            <div
              key={sheet.id}
              style={{
                border: '1px solid rgba(200,172,120,0.15)',
                borderLeft: '3px solid rgba(200,172,120,0.5)',
                background: 'rgba(13,27,42,0.7)',
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
                  <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '0.98rem' }}>
                    {sheet.name}
                  </div>
                  {sheet.badge && (
                    <span style={{
                      fontFamily: '"Barlow Condensed", sans-serif',
                      fontSize: 8,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#947231',
                      background: 'rgba(200,172,120,0.1)',
                      border: '1px solid rgba(200,172,120,0.3)',
                      borderRadius: 2,
                      padding: '2px 7px',
                    }}>
                      {sheet.badge}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.85)', fontSize: '0.78rem', lineHeight: 1.45 }}>
                  {sheet.description}
                </div>
              </div>

              {/* Open button */}
              <a
                href={sheet.tabGid
                  ? `https://docs.google.com/spreadsheets/d/${sheet.sheetId}/edit#gid=${sheet.tabGid}`
                  : sheetOpenUrl(sheet.sheetId)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-block px-4 py-2 text-[9px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
                style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#947231', color: '#1B2A4A', letterSpacing: '0.16em', whiteSpace: 'nowrap' }}
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
    id: 'broker-onboarding-final',
    label: 'Broker Onboarding — What You Are Walking Into',
    description: 'Five sections: What This Office Is, What You Are Joining, The Five Roles, The Deal Flow, The Wednesday Circuit, and The Christie\'s Standard. Issued by Ed Bruehl, Managing Director. Christie\'s International Real Estate Group · East Hampton.',
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/Christie_Broker_Onboarding_FINAL_d7d66dab.pdf',
    pinned: true,
  },
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
    description: 'Christie\'s East Hampton estate advisory card: client-facing credential document. CIREG brand, Ed Bruehl, doctrine lines. Send as PDF in 30 seconds from any Christie\'s meeting.',
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/christies-estate-advisory-card_e0fc3254.pdf',
    pinned: true,
  },
  {
    id: '300day-ascension',
    label: '300-Day Ascension Plan · Wireframe',
    description: 'Full 300-day growth arc from foundation through market authority: agent recruitment, GCI targets, institutional positioning milestones.',
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/WXzEqCTtWmVsElaB.html',
  },
  {
    id: 'market-report-live-v2',
    label: 'Christie\'s Hamptons Live Market Report',
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
    label: 'Modern Day Path · UHNW Backend Strategy',
    description: 'UHNW targeting intelligence — Tier A and Tier B principals, art-secured lending pathway, Christie’s auction house referral architecture, and the Christie’s Neighborhood Card mailer playbook. Art-secured lending terminology applied throughout.',
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/Modern_Day_Path_UHNW_Backend_Strategy_56d7c1aa.pdf',
    pinned: true,
  },
  {
    id: 'intelligence-web-canonical',
    label: 'Christie’s Intelligence Web · Canonical Map',
    description: 'Full institutional relationship map — 47 entities across RECRUIT, WHALE, COMPETITOR, PARTNER, ATTORNEY, ADVISOR, MEDIA, INSTITUTION, and COUNCIL types. Interactive spiderweb visualization. Frank Newbold: RELATIONSHIP_INTELLIGENCE · Brand tier.',
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/Christies_Intelligence_Web_Locked_7c609b20.html',
    pinned: true,
  },
  {
    id: 'infrastructure-audit-april-2026',
    label: 'Platform Infrastructure Audit · April 6, 2026',
    description: 'Full operating manual for the Christie’s East Hampton Intelligence Platform. Nine Google Sheets, six CDN documents, five INTEL tab layers, all tRPC procedures, caching architecture, messaging pipeline, PDF engine, and twelve identified gaps. The canonical reference for how the platform thinks, grows, and reports.',
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/infrastructure_audit_april6_2026_208e007c.pdf',
    pinned: true,
  },
  {
    id: 'lash-speaker-packet-july-2026',
    label: 'Stephen Lash Speaker Briefing · July 2026 · Fitzgerald, the Hamptons, and Christie\'s',
    description: 'Three-thread research brief for the July 2026 Lash event. Thread 1: Murphy-Fitzgerald East Hampton connection — Sara Wiborg Murphy, The Dunes, Ring Lardner at 15 West End Road, and the direct East Hampton origin of The Great Gatsby. Thread 2: East Hampton board map — chairs of EHHS, Guild Hall, LongHouse, Village Preservation Society, and LVIS, plus cross-board connectors. Thread 3: Christie\'s Long Island auction history — the Goldman Gatsby inscription (GBP 226,800), de Kooning\'s East Hampton studio, and the Riggio/Newhouse/Ross collector relationships.',
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/lash_speaker_packet_july2026_1b529cb1.pdf',
    pinned: true,
  },
  {
    id: 'rl-010-canonical-state',
    label: 'RL-010 · Canonical State of the Institution · April 14, 2026',
    description: 'Locked canonical state document — full institutional trajectory 2026–2036, AnewHomes equity structure, ROSTER aggregates, William voice configuration, council structure, permanent rules, and all platform surfaces. Authority: Ed Bruehl operator rulings with Claude Opus architect synthesis and Perplexity Intelligence Officer audit closure. Single source of truth for the institution.',
    url: 'https://docs.google.com/document/d/1xLRt8cvXurndar7_KhR7c8M3LLA1olEWvrU0Ag3a7qA/edit',
    pinned: true,
  },
  {
    id: 'rl-011-griff-status-reports',
    label: 'RL-011 · Griff Status Reports',
    description: 'Griff status reports — ongoing intelligence briefings and status updates. Maintained by Perplexity Intelligence Officer. Part of the Christie\'s East Hampton Research Library (RL-001 through RL-011).',
    url: 'https://docs.google.com/document/d/17JzYGv5U-014WdD5AbLy8nlQpDvwNdQIhzMlARdYRLs/edit',
    pinned: true,
  },
  {
    id: 'rl-012-council-onboarding-brief',
    label: 'RL-012 · Council Onboarding Brief · April 14, 2026',
    description: 'Full council onboarding brief for incoming reviewers Grok, Gemini, and ChatGPT. Covers institutional trajectory, team structure, AnewHomes equity, William voice pipeline, dashboard architecture, and the cardinal principle: the dashboard is the source of truth. Drafted by Claude Opus, patched by Perplexity Intelligence Officer, confirmed by Ed Bruehl. Five canonical patches applied.',
    url: 'https://docs.google.com/document/d/1RfkfCR2qxipjx3BF_5W_NjGV_wy8qsEOt2ZmmzBZuSU/edit',
    pinned: true,
  },
];

// Task 8 · Orphan Asset Links for INTEL tab Canon Documents
// FIX 6 · Apr 22 · Three canonical reference Drive docs added
const INTEL_DASHBOARD_LINKS = [
  { label: 'Council Brief', href: '/council-brief', description: 'Full council brief — five-layer header directive, PDF engine, MAPS hamlet spec, PIPE scaffold, and 300-day arc.', external: false },
  { label: 'Architecture of Wealth', href: '/architecture-of-wealth', description: 'Institutional wealth architecture — the Christie’s Standard applied to UHNW families on the East End.', external: false },
  { label: 'Letter to Angel', href: '/letters/angel', description: 'Onboarding letter to Angel — the Day One brief, institutional context, and operational mandate.', external: false },
  { label: 'CPS1 + CIRE Node · Canonical Reference', href: 'https://docs.google.com/document/d/13iw0I835xr5Kc8A59jlsWMy-YDAPOkHrKeSN3RBTMs0/edit', description: 'Locked growth curve: 2026 $100K · 2027 $250K · 2028 $500K · 2029 $750K · 2030 $1.0M · 2031–2036 2% YoY · 2036 $1.13M. Visibility line only. Supersedes all prior $1.5M cap language. Ratified April 22, 2026.', external: true },
  { label: 'AnewHomes Co. · Canonical Reference', href: 'https://docs.google.com/document/d/1zAtjB7ikC01A9d9rNdNBvOSbLCQZuoyXTqB0EF-nYUA/edit', description: 'Definition, origin ruling, equity cap table (Ed 35 · Scott 35 · Richard 10 · Jarvis 5 · Angel 5 · Zoila 5 · Pool 5), revenue source, 6-of-7 partner card render spec, ratified footnote language. Ratified April 22, 2026.', external: true },
  { label: 'Christie’s Flagship Corkboard · Canonical Content', href: 'https://docs.google.com/document/d/1yFAoW_RiTbHyVwm4dTtUe76LP05b_-7VUO4SDuLOV4U/edit', description: 'Six-quadrant operational layout source-of-truth. Q1 PULSE · Q2 PIPELINE · Q3 NETWORK · Q4 CALENDAR · Q5 FOCUS · Q6 NORTH STAR. Data fields for all quadrants. Ratified April 22, 2026.', external: true },
];

function DocumentLibrary() {
  const [, navigate] = useLocation();

  return (
    <div className="px-6 py-8" style={{ background: 'rgba(27, 42, 74, 0.75)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', borderTop: '1px solid rgba(200,172,120,0.2)', borderBottom: '1px solid rgba(200,172,120,0.2)' }}>
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 10 }}>
          Layer 5 · Document Library
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.2rem', marginBottom: 24 }}>
          Canon Documents
        </div>

        {/* Dashboard routes — Task 8 orphan surfacing + FIX 6 Drive docs */}
        <div className="flex flex-col gap-3 mb-6" style={{ maxWidth: 860 }}>
          {INTEL_DASHBOARD_LINKS.map(link => (
            <MatrixCard key={link.href} variant="default" className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1rem', lineHeight: 1.35 }}>
                    {link.label}
                  </div>
                  <div className="mt-1.5 text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.85)' }}>
                    {link.description}
                  </div>
                </div>
                <div className="shrink-0">
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
                      style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#947231', color: '#947231', letterSpacing: '0.16em' }}
                    >
                      Open Drive
                    </a>
                  ) : (
                    <button
                      onClick={() => navigate(link.href)}
                      className="inline-block px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
                      style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#947231', color: '#947231', letterSpacing: '0.16em', background: 'transparent', cursor: 'pointer' }}
                    >
                      Open
                    </button>
                  )}
                </div>
              </div>
            </MatrixCard>
          ))}
        </div>

        <div className="flex flex-col gap-3" style={{ maxWidth: 860 }}>
          {DOCUMENT_LIBRARY.map(doc => (
            <MatrixCard key={doc.id} variant={doc.pinned ? 'active' : 'default'} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1rem', lineHeight: 1.35 }}>
                    {doc.label}
                  </div>
                  <div className="mt-1.5 text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.85)' }}>
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
                      style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#947231', color: '#947231', letterSpacing: '0.16em' }}
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
    <div className="px-6 py-8" style={{ background: 'rgba(27, 42, 74, 0.75)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', borderTop: '1px solid rgba(200,172,120,0.2)', borderBottom: '1px solid rgba(200,172,120,0.2)' }}>
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 10 }}>
          Layer 6 · Relationship Intelligence
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.2rem', marginBottom: 6 }}>
          Intelligence Web
        </div>
        <div className="mb-6 text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.85)' }}>
          48 entities · Jarvis Top Agents · Whale Intelligence · Auction Referrals.
        </div>
        <IntelligenceWebTabs />
      </div>
    </div>
  );
}

// ─── CORK1 — Ed's Corkboard (Day One · Key Relationships · First-Name-Only Ilija) ──────────────
// Embedded below Calendar section per Apr 22 dispatch.
// Source: eds_corkboard.html — uploaded to CDN Apr 20 2026.

function CorkboardLayer() {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const applyScale = () => {
      const naturalW = inner.scrollWidth;
      const scale = Math.min(1, wrap.offsetWidth / naturalW);
      // Center: offset left by half the unused space after scaling
      const leftOffset = Math.max(0, (wrap.offsetWidth - naturalW * scale) / 2);
      inner.style.transform = `translateX(${leftOffset}px) scale(${scale})`;
      inner.style.transformOrigin = 'top left';
      wrap.style.height = `${inner.scrollHeight * scale}px`;
    };
    applyScale();
    const ro = new ResizeObserver(applyScale);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ background: 'transparent', width: '100%', overflow: 'hidden' }}
    >
      <div ref={innerRef} style={{ display: 'inline-block' }}>
        <EdCorkboard />
      </div>
    </div>
  );
}

// ─── Sticky Section Navigator ─────────────────────────────────────────────────

const INTEL_SECTIONS = [
  { id: 'intel-layer-corkboard', label: 'Corkboard · Day One' },
  { id: 'intel-layer-1', label: 'Command Board' },
  { id: 'intel-layer-2', label: 'Mind Map' },
  { id: 'intel-layer-3', label: 'Master Calendar' },
  // Layers 4–6 removed from public surface per D34 Apr 24 2026
  // Layer order swapped: Trello = Layer 1, Miro = Layer 2 · Section 7 · Apr 29 2026
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
        background: 'rgba(27, 42, 74, 0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
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
          onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = '#947231'; (e.target as HTMLButtonElement).style.borderBottomColor = '#947231'; }}
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
    <div className="min-h-screen" style={{ background: 'transparent' }}>

      {/* Anchor nav removed per B-3.7 — section eyebrows provide orientation */}

      {/* CORK1 — Ed's Corkboard · FIRST per Apr 22 dispatch */}
      <div id="intel-layer-corkboard" />
      <CorkboardLayer />

      <div style={{ height: 1, background: 'rgba(200,172,120,0.2)' }} />

      {/* Section 7C — Trajectory Banner · Apr 29 2026 */}
      <div style={{
        background: 'rgba(10,22,40,0.95)',
        borderTop: '1px solid rgba(200,172,120,0.3)',
        borderBottom: '1px solid rgba(200,172,120,0.3)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap' as const,
        gap: 12,
      }}>
        <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' as const }}>
          THE TRAJECTORY · 100 DAYS → 10 YEARS
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' as const }}>
          {[
            { label: 'CLOSED YTD', value: '$4.57M' },
            { label: 'EXCLUSIVE ACTIVE', value: '$13.62M' },
            { label: '2026 TARGET', value: '$75M' },
            { label: '2036 VISION', value: '$3B' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center' as const }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#faf8f4', fontSize: '1.1rem', fontWeight: 500 }}>{item.value}</div>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.55)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
        {/* Section 7E — Public Launch Badge · auto-sunsets Apr 29 EOD */}
        {new Date() <= new Date('2026-04-30T00:00:00-04:00') && (
          <div style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            background: 'rgba(201,168,76,0.15)',
            border: '1px solid rgba(201,168,76,0.5)',
            color: '#c9a84c',
            fontSize: 9,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            padding: '4px 12px',
            borderRadius: 2,
          }}>
            PUBLIC LAUNCH · APR 29 2026
          </div>
        )}
      </div>

      {/* Layer 1 — Command Board (Trello) · swapped to Layer 1 per Section 7 · Apr 29 2026 */}
      <div id="intel-layer-1" />
      <TrelloLayer />

      <div style={{ height: 1, background: 'rgba(200,172,120,0.2)' }} />

      {/* Layer 2 — Institutional Mind Map (Miro) · swapped to Layer 2 per Section 7 · Apr 29 2026 */}
      <div id="intel-layer-2" />
      <MindMapSection />

      <div style={{ height: 1, background: 'rgba(200,172,120,0.2)' }} />

      {/* Layer 3 — Master Calendar */}
      <div id="intel-layer-3" />
      <CalendarLayer />

      {/* Layer 4 — Thirteen-Sheet Matrix — removed from public surface per D34 Apr 24 2026; data preserved in NINE_SHEETS array above */}
      {/* Layer 5 — Document Library — removed from public surface per A2 Apr 24 2026; data preserved in DOCUMENT_LIBRARY + INTEL_DASHBOARD_LINKS arrays above */}
      {/* Layer 6 — Intelligence Web — removed from public surface per D34 Apr 24 2026; data preserved in IntelligenceWebTabs component */}

      {/* Section 9 — BruehlBriefBulletin removed — canon-kill Apr 24 2026 */}

      {/* Doctrine footer */}
      <div className="px-6 py-4 text-center border-t" style={{ background: 'rgba(27, 42, 74, 0.75)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', borderColor: '#947231' }}>
        <div style={{ fontFamily: '"Source Sans 3", sans-serif', fontStyle: 'italic', color: 'rgba(200,172,120,0.65)', fontSize: '0.72rem' }}>
          Art · Beauty · Provenance · Since 1766 · 26 Park Place, East Hampton, NY 11937 · 646-752-1233
        </div>
      </div>

    </div>
  );
}
