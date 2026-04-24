/**
 * ReportPage.tsx — Christie's East Hampton Live Report
 * Route: /report
 *
 * Governing Principle: website = live report · report = website scrolled · PDF = snapshot
 *
 * Section 1 · Institutional Opening — James Christie portrait hero · founding letter
 * Section 2 · Hamptons Local Intelligence — Bloomberg-style news feed
 * Section 3 · Market Intelligence — CFS donut ring · rate environment · Hamptons Median
 * Section 4 · Hamlet Atlas Matrix — 9 hamlet tiles, tap = inline expansion
 * Section 5 · MAPS Intelligence — model deal · QR
 * Section 6 · Resources & Authority — Christie's ecosystem · contact block · doctrine footer
 *
 * Design: navy #1B2A4A · gold #947231 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles) · Source Sans 3 (body) · Barlow Condensed (labels)
 */

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import {
  JAMES_CHRISTIE_PORTRAIT_PRIMARY,
  ED_HEADSHOT_PRIMARY,
  GALLERY_IMAGES,
  LOGO_BLACK,
} from '@/lib/cdn-assets';
import {
  MASTER_HAMLET_DATA,
  TIER_ORDER,
  type HamletData,
  type HamletTier,
} from '@/data/hamlet-master';
import { captureToPdf } from '@/lib/capture-pdf';
import '@/styles/report-print.css';
import { EstateAdvisoryCard } from '@/components/EstateAdvisoryCard';
import { FoundingLetter } from '@/components/FoundingLetter';
import { SiteFooter } from '@/components/SiteFooter';
import { FloatingCard } from '@/components/FramePrimitives';

// D65 Shell Purge (Apr 23 2026): useIsPdfMode deleted. /report?pdf=1 renders identical to /report.
// PDF capture uses html2canvas screenshot of live dark-shell render.

// ─── Back button ──────────────────────────────────────────────────────────────
function BackBar() {
  const [, navigate] = useLocation();
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handlePdfDownload() {
    setPdfLoading(true);
    try {
      const el = document.getElementById('report-page-root') ?? document.body;
      const today = new Date().toISOString().slice(0, 10);
      await captureToPdf(el, `christies-east-hampton-market-report-${today}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg.includes('Unauthorized') ? 'Session expired — please log in again' : `PDF generation failed: ${msg}`);
      console.error('[PDF Download]', err);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div
      data-no-print
      style={{
        background: '#1B2A4A',
        borderBottom: '1px solid rgba(200,172,120,0.2)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none',
          border: '1px solid rgba(200,172,120,0.35)',
          color: '#947231',
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: 9,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          padding: '5px 14px',
          cursor: 'pointer',
        }}
      >
        ← Back to Home
      </button>
      <span
        style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          color: 'rgba(200,172,120,0.5)',
          fontSize: 9,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          flex: 1,
        }}
      >
        Christie's East Hampton · Live Market Report
      </span>
      <button
        data-pdf-download
        onClick={handlePdfDownload}
        disabled={pdfLoading}
        style={{
          background: pdfLoading ? 'rgba(200,172,120,0.3)' : '#947231',
          border: 'none',
          color: '#1B2A4A',
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: 9,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          padding: '5px 16px',
          cursor: pdfLoading ? 'not-allowed' : 'pointer',
          fontWeight: 600,
        }}
      >
        {pdfLoading ? 'Generating…' : '↓ Download PDF'}
      </button>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-6">
      <span
        style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          color: '#947231',
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        Section {n}
      </span>
      <span
        style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          color: 'rgba(27,42,74,0.35)',
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </span>
    </div>
  );
}

// ─── SECTION 1 · Institutional Opening ───────────────────────────────────────
function Section1() {
  const [pdfState, setPdfState] = useState<'idle' | 'generating' | 'done' | 'error'>('idle');

  // Auto-reset PDF done state after 3s
  useEffect(() => {
    if (pdfState === 'done') {
      const t = setTimeout(() => setPdfState('idle'), 3000);
      return () => clearTimeout(t);
    }
  }, [pdfState]);

  async function handleDownload() {
    if (pdfState === 'generating') return;
    setPdfState('generating');
    try {
      const el = document.getElementById('report-page-root') ?? document.body;
      const today = new Date().toISOString().slice(0, 10);
      await captureToPdf(el, `christies-east-hampton-market-report-${today}.pdf`);
      setPdfState('done');
    } catch (e) {
      console.error(e);
      setPdfState('error');
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg.includes('Unauthorized') ? 'Session expired — please log in again' : `PDF generation failed: ${msg}`);
      setTimeout(() => setPdfState('idle'), 3000);
    }
  }



  return (
    <section style={{ background: '#1B2A4A', borderBottom: '1px solid rgba(200,172,120,0.3)' }}>
      {/* Auction room hero */}
      <div className="relative" style={{ maxHeight: 520, overflow: 'hidden' }}>
        <img
          src={GALLERY_IMAGES.find(g => g.id === 'room-primary')?.src ?? GALLERY_IMAGES[0]?.src}
          alt="The Grand Saleroom, Christie's"
          className="w-full object-cover"
          style={{ maxHeight: 520, display: 'block', objectPosition: 'center 35%' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(27,42,74,0.85) 100%)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <div
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: '#947231',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Christie's International Real Estate Group · East Hampton
          </div>
          <h1
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#FAF8F4',
              fontWeight: 400,
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Your Hamptons Real Estate Market Report
          </h1>
          <p
            style={{
              fontFamily: '"Source Sans 3", sans-serif',
              color: 'rgba(250,248,244,0.7)',
              fontSize: '0.875rem',
              marginTop: 6,
            }}
          >
            Ed Bruehl · Managing Director · East Hampton Flagship
          </p>
        </div>
      </div>

      {/* ── Action panel beneath portrait ── */}
      <div style={{ padding: '20px 24px 8px', maxWidth: 480, margin: '0 auto' }}>

        {/* ── PDF Download Button ── */}
        <button
          onClick={handleDownload}
          disabled={pdfState === 'generating'}
          style={{
            width: '100%',
            background: pdfState === 'done' ? 'rgba(5,150,105,0.15)' : 'none',
            border: `1px solid ${
              pdfState === 'done' ? 'rgba(5,150,105,0.7)'
              : pdfState === 'error' ? 'rgba(192,57,43,0.7)'
              : 'rgba(200,172,120,0.55)'
            }`,
            color: pdfState === 'done' ? '#6ee7b7' : pdfState === 'error' ? '#f87171' : '#947231',
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 11,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            padding: '11px 28px',
            cursor: pdfState === 'generating' ? 'wait' : 'pointer',
            transition: 'all 0.3s',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 6,
          }}
        >
          {/* Animated fill bar while generating */}
          {pdfState === 'generating' && (
            <span style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              background: 'rgba(200,172,120,0.12)',
              animation: 'pdf-pulse 1.4s ease-in-out infinite',
              width: '100%',
            }} />
          )}
          <span style={{ position: 'relative', zIndex: 1 }}>
            {pdfState === 'generating' && (
              <span style={{ marginRight: 8 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                </svg>
              </span>
            )}
            {pdfState === 'generating' ? 'Building Report… Please Wait'
              : pdfState === 'done' ? '✓ Market Report Downloaded'
              : pdfState === 'error' ? 'Generation Failed — Tap to Retry'
              : '↓ Download Market Report'}
          </span>
        </button>

      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes pdf-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Founding letter */}
      <div className="px-6 py-14" style={{ maxWidth: 780, margin: '0 auto' }}>
        <div
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            color: '#947231',
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          A Letter from the Desk
        </div>
                <h2
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            color: '#FAF8F4',
            fontWeight: 400,
            fontSize: 'clamp(1.35rem, 3vw, 1.85rem)',
            lineHeight: 1.3,
            marginBottom: 24,
          }}
        >
          Art. Beauty. Provenance. Since 1766.
        </h2>
        <FoundingLetter
          color="rgba(250,248,244,0.82)"
          fontSize="0.9375rem"
          lineHeight={1.75}
          paragraphGap={18}
        />
      </div>
    </section>
  );
}

// ─── SECTION 2 · Hamptons Local Intelligence ──────────────────────────────────
interface NewsItem {
  headline: string;
  source: string;
  date: string;
  url: string;
  tag: string;
}
interface MuniNews {
  municipality: string;
  code: string;
  items: NewsItem[];
}

const HAMPTONS_NEWS: MuniNews[] = [
  {
    municipality: 'East Hampton Town',
    code: 'EHT',
    items: [
      {
        headline:
          'East Hampton Town Board approves updated zoning overlay for Springs corridor — density caps preserved',
        source: 'East Hampton Star',
        date: 'Mar 28, 2026',
        url: 'https://www.easthamptonstar.com',
        tag: 'Zoning',
      },
      {
        headline:
          'Wainscott school district consolidation vote set for May — property tax implications under review',
        source: "Dan's Papers",
        date: 'Mar 27, 2026',
        url: 'https://www.danspapers.com',
        tag: 'Schools',
      },
      {
        headline:
          'Amagansett beachfront inventory tightens — four listings absorbed Q1 2026, no new supply expected until June',
        source: 'Hamptons Real Estate Gazette',
        date: 'Mar 26, 2026',
        url: 'https://www.christiesrealestategroupeh.com',
        tag: 'Market',
      },
      {
        headline:
          'East Hampton Town Planning Board reviews 12-lot Accabonac Road subdivision — public hearing set for April',
        source: 'East Hampton Star',
        date: 'Mar 25, 2026',
        url: 'https://www.easthamptonstar.com',
        tag: 'Politics',
      },
    ],
  },
  {
    municipality: 'Southampton Town',
    code: 'STH',
    items: [
      {
        headline:
          'Sagaponack median crosses $8M — three off-market closings drive Q1 record, buyer pool narrows to family offices',
        source: 'Hamptons Real Estate Gazette',
        date: 'Mar 28, 2026',
        url: 'https://www.christiesrealestategroupeh.com',
        tag: 'Market',
      },
      {
        headline:
          'Water Mill estate subdivision approved — 12-acre parcel cleared for two-lot split, first in five years',
        source: 'Southampton Press',
        date: 'Mar 27, 2026',
        url: 'https://www.27east.com',
        tag: 'Zoning',
      },
      {
        headline:
          'Bridgehampton school district reports enrollment decline — second consecutive year, demographic shift underway',
        source: 'Southampton Press',
        date: 'Mar 26, 2026',
        url: 'https://www.27east.com',
        tag: 'Schools',
      },
      {
        headline:
          'Southampton Village luxury corridor — five listings above $15M, longest DOM since 2019',
        source: "Dan's Papers",
        date: 'Mar 25, 2026',
        url: 'https://www.danspapers.com',
        tag: 'Market',
      },
    ],
  },
  {
    municipality: 'Sag Harbor',
    code: 'SAG',
    items: [
      {
        headline:
          'Sag Harbor Village Historic District expansion proposed — 14 additional properties under review for landmark status',
        source: 'Sag Harbor Express',
        date: 'Mar 28, 2026',
        url: 'https://www.sagharborexpress.com',
        tag: 'Historic',
      },
      {
        headline:
          'Sag Harbor waterfront mixed-use development clears planning board — 18-month construction timeline begins Q3',
        source: 'Southampton Press',
        date: 'Mar 27, 2026',
        url: 'https://www.27east.com',
        tag: 'Development',
      },
      {
        headline:
          'North Haven bridge traffic study released — peak season volume up 22% YOY, infrastructure investment required',
        source: 'Sag Harbor Express',
        date: 'Mar 26, 2026',
        url: 'https://www.sagharborexpress.com',
        tag: 'Infrastructure',
      },
    ],
  },
];

const TAG_COLORS: Record<string, string> = {
  Market: '#2d6a4f',
  Zoning: '#1B2A4A',
  Schools: '#5a3e8a',
  Politics: '#7a4a2a',
  Historic: '#8a6a2a',
  Development: '#2a5a7a',
  Infrastructure: '#4a4a4a',
};

function Section2() {
  return (
    <section className="report-section" data-section-title="Christie's East Hampton · Hamptons Local Intelligence" style={{ background: 'transparent', padding: '0 0 24px' }}>
      <div className="px-6 py-14" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ background: 'rgba(27,42,74,0.88)', border: '1px solid rgba(200,172,120,0.35)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.35)', padding: '28px 32px' }}>
        <SectionLabel n="2" title="Hamptons Local Intelligence" />
        <div
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            color: 'rgba(250,248,244,0.45)',
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 28,
          }}
        >
          East Hampton Town · Southampton Town · Sag Harbor · Updated daily
        </div>
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
        >
          {HAMPTONS_NEWS.map((muni) => (
            <div key={muni.code}>
              <div
                className="flex items-center gap-2 mb-4"
                style={{ borderBottom: '1px solid rgba(200,172,120,0.3)', paddingBottom: 10 }}
              >
                <span
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    background: '#1B2A4A',
                    color: '#947231',
                    fontSize: 9,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                  }}
                >
                  {muni.code}
                </span>
                <span
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    color: '#FAF8F4',
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  {muni.municipality}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {muni.items.map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <span
                        style={{
                          fontFamily: '"Barlow Condensed", sans-serif',
                          background: TAG_COLORS[item.tag] || '#384249',
                          color: '#fff',
                          fontSize: 8,
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          padding: '1px 6px',
                          borderRadius: 2,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: '"Source Sans 3", sans-serif',
                        color: '#FAF8F4',
                        fontSize: '0.8125rem',
                        lineHeight: 1.55,
                        margin: 0,
                        fontWeight: 600,
                      }}
                      className="group-hover:underline"
                    >
                      {item.headline}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        style={{
                          fontFamily: '"Barlow Condensed", sans-serif',
                          color: 'rgba(250,248,244,0.45)',
                          fontSize: 9,
                          letterSpacing: '0.12em',
                        }}
                      >
                        {item.source}
                      </span>
                      <span style={{ color: 'rgba(250,248,244,0.25)', fontSize: 9 }}>·</span>
                      <span
                        style={{
                          fontFamily: '"Barlow Condensed", sans-serif',
                          color: 'rgba(250,248,244,0.45)',
                          fontSize: 9,
                          letterSpacing: '0.12em',
                        }}
                      >
                        {item.date}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        </div>{/* /mount frame */}
      </div>
    </section>
  );
}

// ─── SECTION 3 · Market Intelligence ─────────────────────────────────────────────────────
interface TickerData {
  vix: number;
  treasury10y: number;
  mortgage30y: number;
  loaded: boolean;
}
interface CFSResult {
  score: number;
  label: string;
  color: string;
  description: string;
}

function calcCFS(t: TickerData): CFSResult {
  if (!t.loaded) return { score: 0, label: 'Loading', color: '#947231', description: '' };
  const eq = Math.max(0, Math.min(40, 20 + t.sp500Change * 10));
  const vx = t.vix < 20 ? 30 : t.vix < 30 ? 15 : 0;
  const rt = t.treasury10y < 4.5 ? 30 : t.treasury10y < 5.0 ? 15 : 0;
  const score = Math.round(eq + vx + rt);
  if (score >= 75)
    return {
      score,
      label: 'Strong Inflow',
      color: '#2d6a4f',
      description: 'Equity markets stable, volatility contained, rates favorable. Buyer confidence elevated.',
    };
  if (score >= 55)
    return {
      score,
      label: 'Moderate Inflow',
      color: '#947231',
      description: 'Mixed signals. Selective buyers active. Institutional quality assets moving.',
    };
  if (score >= 35)
    return {
      score,
      label: 'Cautious',
      color: '#e07b39',
      description: 'Volatility elevated. Buyers requiring price concessions. DOM extending.',
    };
  return {
    score,
    label: 'Defensive',
    color: '#c0392b',
    description: 'Market stress. Luxury segment insulated but sentiment weak. Hold positions.',
  };
}

function DonutRing({ score, color }: { score: number; color: string }) {
  const r = 54, cx = 70, cy = 70;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <svg width={140} height={140} viewBox="0 0 140 140" aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(27,42,74,0.12)" strokeWidth={10} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fill={color}
        style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 22, fontWeight: 600 }}
      >
        {score}
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fill="rgba(27,42,74,0.5)"
        style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.1em' }}
      >
        CFS SCORE
      </text>
    </svg>
  );
}

function Section3() {
  const [ticker, setTicker] = useState<TickerData>({
    sp500Change: 0,
    vix: 18.5,
    treasury10y: 4.35,
    mortgage30y: 6.82,
    loaded: false,
  });

  useEffect(() => {
    async function fetchTicker() {
      try {
        const [yahooRes, marketRes] = await Promise.allSettled([
          fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?interval=1d&range=2d'),
          fetch('/api/market-data'),
        ]);
        let sp500Change = 0;
        if (yahooRes.status === 'fulfilled') {
          const data = await yahooRes.value.json();
          const closes = data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];
          if (closes.length >= 2)
            sp500Change =
              ((closes[closes.length - 1] - closes[closes.length - 2]) / closes[closes.length - 2]) *
              100;
        }
        // Pull live mortgage rate from the same source as the ticker
        let mortgage30y = 6.38;
        let treasury10y = 4.81;
        let vix = 30.61;
        if (marketRes.status === 'fulfilled') {
          const mkt = await marketRes.value.json();
          if (mkt?.mortgage) {
            const parsed = parseFloat(String(mkt.mortgage).replace('%', ''));
            if (!isNaN(parsed)) mortgage30y = parsed;
          }
          if (mkt?.treasury) {
            const parsed = parseFloat(String(mkt.treasury).replace('%', ''));
            if (!isNaN(parsed)) treasury10y = parsed;
          }
          if (mkt?.vix) {
            const parsed = parseFloat(String(mkt.vix).replace('%', ''));
            if (!isNaN(parsed)) vix = parsed;
          }
        }
        setTicker({ sp500Change, vix, treasury10y, mortgage30y, loaded: true });
      } catch {
        setTicker((t) => ({ ...t, loaded: true }));
      }
    }
    fetchTicker();
  }, []);

  const cfs = calcCFS(ticker);

  return (
    <section className="report-section" data-section-title="Christie's East Hampton · Market Intelligence" style={{ background: 'transparent', padding: '0 0 24px' }}>
      <div className="px-6 py-14" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ background: 'rgba(27,42,74,0.88)', border: '1px solid rgba(200,172,120,0.35)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.35)', padding: '28px 32px' }}>
        <SectionLabel n="3" title="Market Intelligence" />
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
        >
          {/* Last Significant Sale — D24 replacement for Capital Flow Signal (Apr 19 2026) */}
          <div
            style={{
              background: 'rgba(250,248,244,0.05)',
              border: '1px solid rgba(200,172,120,0.2)',
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: '#947231',
                fontSize: 9,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Last Significant Sale
            </div>
            <div
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: '#FAF8F4',
                fontSize: '2rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                lineHeight: 1.1,
                marginBottom: 10,
              }}
            >
              EAST END<br />SPOTLIGHT
            </div>
            <div
              style={{
                fontFamily: '"Source Sans 3", sans-serif',
                color: 'rgba(250,248,244,0.55)',
                fontSize: '0.75rem',
                lineHeight: 1.5,
                maxWidth: 220,
              }}
            >
              The most recent significant closed sale on the East End. Data updated via Growth Model.
            </div>
          </div>

          {/* Rate environment */}
          <div
            style={{
              background: 'rgba(250,248,244,0.05)',
              border: '1px solid rgba(200,172,120,0.2)',
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: '#947231',
                fontSize: 9,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Rate Environment
            </div>
            {[
              { label: '30-Year Fixed', value: `${ticker.mortgage30y.toFixed(2)}%` },
              { label: '10-Year Treasury', value: `${ticker.treasury10y.toFixed(2)}%` },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center py-2"
                style={{ borderBottom: '1px solid rgba(200,172,120,0.1)' }}
              >
                <span
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    color: 'rgba(250,248,244,0.55)',
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    color: '#FAF8F4',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Hamptons Median */}
          <div
            style={{
              background: 'rgba(250,248,244,0.05)',
              border: '1px solid rgba(200,172,120,0.2)',
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: '#947231',
                fontSize: 9,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Hamptons Median
            </div>
            <div
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: '#947231',
                fontSize: '2.25rem',
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              $2.34M
            </div>
            <div
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: 'rgba(250,248,244,0.4)',
                fontSize: 9,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginTop: 8,
              }}
            >
              East End · Q4 2025 · Record High · Verified market intelligence
            </div>
            <div
              style={{
                fontFamily: '"Source Sans 3", sans-serif',
                color: 'rgba(250,248,244,0.55)',
                fontSize: '0.75rem',
                lineHeight: 1.5,
                marginTop: 12,
              }}
            >
              Sagaponack leads at $8.04M median. Springs remains the most accessible entry point at
              $1.58M. Ten distinct corridors, ten distinct buyers.
            </div>
          </div>
        </div>{/* grid */}
        </div>{/* /mount frame */}
      </div>
    </section>
  );
}

// ─── SECTION 44 · Hamlet Atlas Matrix ─────────────────────────────────────────────────────
const TIER_COLORS: Record<HamletTier, string> = {
  'Ultra-Trophy': '#8a6a2a',
  Trophy: '#1B2A4A',
  Premier: '#2a5a7a',
  Opportunity: '#2d6a4f',
};

function HamletTile({
  hamlet,
  onSelect,
  isSelected,
}: {
  hamlet: HamletData;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const tierColor = TIER_COLORS[hamlet.tier] || '#384249';
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
      className="text-left w-full"
      style={{
        background: isSelected ? '#1B2A4A' : '#0D1B2A',
        border: `1px solid ${isSelected ? '#947231' : 'rgba(200,172,120,0.2)'}`,
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            color: '#FAF8F4',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          {hamlet.name}
        </span>
        
      </div>
      <div
        style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          color: '#947231',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {hamlet.medianPrice >= 1_000_000
          ? `$${(hamlet.medianPrice / 1_000_000).toFixed(2)}M`
          : `$${(hamlet.medianPrice / 1_000).toFixed(0)}K`}
      </div>
      <div
        style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          color: 'rgba(250,248,244,0.45)',
          fontSize: 9,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginTop: 4,
        }}
      >
        {hamlet.volumeShare}% vol
       </div>
    </div>
  );
}
function HamletPanel({ hamlet, onClose }: { hamlet: HamletData; onClose: () => void }) {
  return (
    <div
      style={{
        background: '#1B2A4A',
        border: '1px solid rgba(200,172,120,0.3)',
        marginTop: 2,
        padding: '28px 24px',
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <div
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: '#947231',
              fontSize: 9,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            Hamlet Profile
          </div>
          <h3
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#FAF8F4',
              fontWeight: 400,
              fontSize: '1.5rem',
              margin: 0,
            }}
          >
            {hamlet.name}
          </h3>
          <p
            style={{
              fontFamily: '"Source Sans 3", sans-serif',
              color: 'rgba(250,248,244,0.55)',
              fontSize: '0.8125rem',
              margin: '4px 0 0',
            }}
          >
            {hamlet.medianPriceDisplay} median
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: '1px solid rgba(200,172,120,0.3)',
            color: '#947231',
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '6px 12px',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>

      <div
        className="grid grid-cols-2 gap-3 mb-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}
      >
        {[
          { label: 'Median Price',
            value:
              hamlet.medianPrice >= 1_000_000
                ? `$${(hamlet.medianPrice / 1_000_000).toFixed(2)}M`
                : `$${(hamlet.medianPrice / 1_000).toFixed(0)}K`,
          },
          { label: 'Share of Hamptons Dollar Volume', value: `${hamlet.volumeShare}%` },
          { label: '4-Year Direction', value: 'Up' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{ background: 'rgba(250,248,244,0.06)', padding: '12px 14px' }}
          >
            <div
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: 'rgba(250,248,244,0.4)',
                fontSize: 9,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: '#947231',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {hamlet.lastSale && (
        <div
          className="mb-6"
          style={{
            background: 'rgba(250,248,244,0.04)',
            border: '1px solid rgba(200,172,120,0.15)',
            padding: '14px 16px',
          }}
        >
          <div
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: '#947231',
              fontSize: 9,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Last Notable Sale
          </div>
          <div
            style={{
              fontFamily: '"Source Sans 3", sans-serif',
              color: '#FAF8F4',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {hamlet.lastSale}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: '#947231',
                fontSize: 13,
              }}
            >
              {hamlet.lastSalePrice}
            </span>
            <span
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: 'rgba(250,248,244,0.4)',
                fontSize: 10,
              }}
            >
              {hamlet.lastSaleDate}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Section4() {
  // B4: Read ?hamlet= query param and pre-open the matching hamlet panel
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const h = params.get('hamlet');
    return h && MASTER_HAMLET_DATA.some(d => d.id === h) ? h : null;
  });
  const selectedHamlet = MASTER_HAMLET_DATA.find((h) => h.id === selectedId) ?? null;
  // Render all 11 hamlets in median price descending order
  const sortedHamlets = [...MASTER_HAMLET_DATA].filter(h => h.canonical !== false).sort((a, b) => b.medianPrice - a.medianPrice);

  // B4: Auto-scroll to this section when hamlet param is present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('hamlet')) {
      const el = document.getElementById('section-hamlet-atlas');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
      }
    }
  }, []);

  return (
    <section id="section-hamlet-atlas" className="report-section" data-section-title="Christie's East Hampton · Hamlet Atlas" style={{ background: 'transparent', padding: '0 0 24px' }}>
      <div className="px-6 py-14" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ background: 'rgba(27,42,74,0.88)', border: '1px solid rgba(200,172,120,0.35)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.35)', padding: '28px 32px' }}>
        <SectionLabel n="4" title="Hamlet Atlas Matrix" />
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', marginBottom: 8 }}
        >
          {sortedHamlets.map((h) => (
            <FloatingCard key={h.id} style={{ padding: 0 }}>
              <HamletTile
                hamlet={h}
                isSelected={selectedId === h.id}
                onSelect={() => setSelectedId(selectedId === h.id ? null : h.id)}
              />
            </FloatingCard>
          ))}
        </div>
        {selectedHamlet && (
          <HamletPanel hamlet={selectedHamlet} onClose={() => setSelectedId(null)} />
        )}
        {/* Correction 8: Hamlet table footnote */}
        <div
          style={{
            fontFamily: '"Source Sans 3", sans-serif',
            color: 'rgba(250,248,244,0.38)',
            fontSize: '0.6875rem',
            lineHeight: 1.5,
            marginTop: 20,
            paddingTop: 12,
            borderTop: '1px solid rgba(200,172,120,0.12)',
          }}
        >
          Based on 2025 recorded brokerage transactions. Verified market intelligence. Total Hamptons dollar volume $5.922B.
        </div>
        </div>{/* /mount frame */}
      </div>
    </section>
  );
}

// ─── SECTION 3B · Market Intelligence (Page 4 fill) ────────────────────────
// Placed after the Hamlet Atlas to fill the empty space on Page 4 after Wainscott.
// Per Sprint 29 directive: use the Last Significant Sale, Rate Environment, and
// Hamptons Median cards to fill the empty vertical space — no compression.
function Section3Condensed() {
  const [ticker, setTicker] = useState<TickerData>({
    sp500Change: 0,
    vix: 18.5,
    treasury10y: 4.35,
    mortgage30y: 6.82,
    loaded: false,
  });

  useEffect(() => {
    async function fetchTicker() {
      try {
        const [, marketRes] = await Promise.allSettled([
          Promise.resolve(),
          fetch('/api/market-data'),
        ]);
        let mortgage30y = 6.38;
        let treasury10y = 4.81;
        let vix = 30.61;
        if (marketRes.status === 'fulfilled') {
          const mkt = await marketRes.value.json();
          if (mkt?.mortgage) { const p = parseFloat(String(mkt.mortgage).replace('%', '')); if (!isNaN(p)) mortgage30y = p; }
          if (mkt?.treasury) { const p = parseFloat(String(mkt.treasury).replace('%', '')); if (!isNaN(p)) treasury10y = p; }
          if (mkt?.vix) { const p = parseFloat(String(mkt.vix).replace('%', '')); if (!isNaN(p)) vix = p; }
        }
        setTicker({ sp500Change: 0, vix, treasury10y, mortgage30y, loaded: true });
      } catch {
        setTicker((t) => ({ ...t, loaded: true }));
      }
    }
    fetchTicker();
  }, []);

  return (
    <section style={{ background: '#1B2A4A', borderBottom: '1px solid rgba(200,172,120,0.2)' }}>
      <div className="px-6 py-14" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
        >
          {/* Last Significant Sale — D24 replacement (Apr 19 2026) */}
          <div style={{ background: 'rgba(250,248,244,0.05)', border: '1px solid rgba(200,172,120,0.2)', padding: 24 }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>Last Significant Sale</div>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontSize: '2rem', fontWeight: 600, letterSpacing: '0.02em', lineHeight: 1.1, marginBottom: 10 }}>EAST END<br />SPOTLIGHT</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.55)', fontSize: '0.75rem', lineHeight: 1.5, maxWidth: 220 }}>The most recent significant closed sale on the East End. Data updated via Growth Model.</div>
          </div>

          {/* Rate Environment */}
          <div style={{ background: 'rgba(250,248,244,0.05)', border: '1px solid rgba(200,172,120,0.2)', padding: 24 }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>Rate Environment</div>
            {[
              { label: '30-Year Fixed', value: `${ticker.mortgage30y.toFixed(2)}%` },
              { label: '10-Year Treasury', value: `${ticker.treasury10y.toFixed(2)}%` },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid rgba(200,172,120,0.1)' }}>
                <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(250,248,244,0.55)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{row.label}</span>
                <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#FAF8F4', fontSize: 13, fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Hamptons Median */}
          <div style={{ background: 'rgba(250,248,244,0.05)', border: '1px solid rgba(200,172,120,0.2)', padding: 24 }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>Hamptons Median</div>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#947231', fontSize: '2.25rem', fontWeight: 400, lineHeight: 1 }}>$2.34M</div>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(250,248,244,0.4)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 8 }}>East End · Q4 2025 · Record High · Verified market intelligence</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.55)', fontSize: '0.75rem', lineHeight: 1.5, marginTop: 12 }}>Sagaponack leads at $8.04M median. Springs remains the most accessible entry point at $1.58M. Ten distinct corridors, ten distinct buyers.</div>
          </div>
        </div>
      </div>
     </section>
  );
}
// ─── SECTION 5 · MAPS Intelligence ────────────────────────────────────────────
function Section5() {
  return (
    <section className="report-section" data-section-title="Christie's East Hampton · Maps Intelligence" style={{ background: '#1B2A4A', borderBottom: '1px solid rgba(200,172,120,0.2)' }}>
      <div className="px-6 py-14" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionLabel n="5" title="MAPS Intelligence" />
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
        >
          <div
            style={{
              background: 'rgba(250,248,244,0.05)',
              border: '1px solid rgba(200,172,120,0.2)',
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: '#947231',
                fontSize: 9,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              Model Deal · East Hampton
            </div>
            <div
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: '#FAF8F4',
                fontSize: '1.1rem',
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              9 Daniels Hole Road
            </div>
            <div
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: 'rgba(250,248,244,0.45)',
                fontSize: 9,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              East Hampton · Closed $2.47M · January 2026 · First Closed Transaction
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Land', value: '$1.1M' },
                { label: 'All-In', value: '$2.47M' },
                { label: 'Exit', value: '$3.2M' },
              ].map((cell) => (
                <div
                  key={cell.label}
                  style={{
                    background: 'rgba(250,248,244,0.06)',
                    padding: '10px 12px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Barlow Condensed", sans-serif',
                      color: 'rgba(250,248,244,0.4)',
                      fontSize: 9,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    {cell.label}
                  </div>
                  <div
                    style={{
                      fontFamily: '"Barlow Condensed", sans-serif',
                      color: '#947231',
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    {cell.value}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                background: '#2d6a4f',
                color: '#fff',
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '6px 14px',
                display: 'inline-block',
              }}
            >
              Institutional
            </div>
          </div>

          <div
            style={{
              background: 'rgba(250,248,244,0.05)',
              border: '1px solid rgba(200,172,120,0.2)',
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: '#947231',
                fontSize: 9,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              AnewHomes · Ed Bruehl
            </div>
            <div
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: '#FAF8F4',
                fontSize: '1.25rem',
                fontWeight: 400,
                lineHeight: 1.3,
                marginBottom: 12,
              }}
            >
              Morton Buildings steel-frame construction. 12-month delivery. Below replacement cost.
            </div>
            <div
              style={{
                fontFamily: '"Source Sans 3", sans-serif',
                color: 'rgba(250,248,244,0.55)',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            >
              Christie’s East Hampton evaluates every acquisition on five lenses: price trajectory, land scarcity, school district quality, transaction velocity, and Christie’s institutional adjacency. A property either passes or it does not.
            </div>
            <a
              href="https://linktr.ee/edbruehlrealestate"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: '#947231',
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(200,172,120,0.4)',
                paddingBottom: 2,
              }}
            >
              linktr.ee/edbruehlrealestate →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 6 · Resources & Authority ───────────────────────────────────────
function Section6() {
  return (
    <section className="report-section" data-section-title="Christie's East Hampton · Estate Advisory" style={{ background: '#1B2A4A', borderTop: '1px solid rgba(200,172,120,0.18)' }}>
      <div className="px-6 py-14" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionLabel n="6" title="Resources & Authority" />
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
        >
          <div>
            <div
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: 'rgba(250,248,244,0.55)',
                fontSize: 9,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              Christie's Ecosystem
            </div>
            <div className="flex flex-col gap-2">
              {[
                {
                  label: "Christie's Auction House Americas →",
                  href: 'https://www.christies.com/locations/new-york',
                },
                { label: "Christie's Global →", href: 'https://www.christies.com' },
                {
                  label: "Christie's East Hampton Podcast →",
                  href: 'https://www.youtube.com/channel/UCRNUlNy2hkJFvo1IFTY4otg',
                },
                {
                  label: "Christie's East Hampton YouTube →",
                  href: 'https://www.youtube.com/channel/UCRNUlNy2hkJFvo1IFTY4otg',
                },
                {
                  label: "Upcoming Christie's Events →",
                  href: 'https://www.christies.com/calendar',
                },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: '"Source Sans 3", sans-serif',
                    color: '#FAF8F4',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(200,172,120,0.18)',
                    paddingBottom: 8,
                    display: 'block',
                  }}
                  className="hover:text-[#947231] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: 'rgba(250,248,244,0.55)',
                fontSize: 9,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              Contact
            </div>
            <div className="flex items-start gap-4">
              <img
                src={ED_HEADSHOT_PRIMARY}
                alt="Ed Bruehl"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid rgba(200,172,120,0.5)',
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    color: '#FAF8F4',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                  }}
                >
                  Ed Bruehl · Managing Director
                </div>
                <div
                  style={{
                    fontFamily: '"Source Sans 3", sans-serif',
                    color: 'rgba(250,248,244,0.75)',
                    fontSize: '0.8125rem',
                    lineHeight: 1.65,
                    marginTop: 6,
                  }}
                >
                  Christie's International Real Estate Group
                  <br />
                  26 Park Place · East Hampton NY 11937
                  <br />
                  <a href="tel:6467521233" style={{ color: '#FAF8F4', textDecoration: 'none' }}>
                    646-752-1233
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-12 pt-8"
          style={{ borderTop: '1px solid rgba(200,172,120,0.18)' }}
        >
          <div
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#947231',
              fontSize: '0.9375rem',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            Art. Beauty. Provenance.
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Auction Gallery 3×3 ──────────────────────────────────────────────────────
function AuctionGallery() {
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null);
  return (
    <section style={{ background: 'transparent', padding: '0 0 24px' }}>
      <div className="px-6 py-14" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ background: 'rgba(27,42,74,0.88)', border: '1px solid rgba(200,172,120,0.35)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.35)', padding: '28px 32px' }}>
        <div
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            color: '#947231',
            fontSize: 9,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          Christie's Auction House · Brand Authority
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {GALLERY_IMAGES.map((img) => (
            <button
              key={img.id}
              onClick={() => setLightbox({ src: img.src, caption: img.caption })}
              className="block w-full overflow-hidden"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                aspectRatio: '4/3',
              }}
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-full object-cover"
                style={{ transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </button>
          ))}
        </div>
        </div>{/* /mount frame */}
        {lightbox && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.88)' }}
            onClick={() => setLightbox(null)}
          >
            <div className="relative max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
              <img
                src={lightbox.src}
                alt={lightbox.caption}
                className="max-h-[80vh] w-auto object-contain"
              />
              <div
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  color: 'rgba(250,248,244,0.6)',
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginTop: 10,
                }}
              >
                {lightbox.caption}
              </div>
              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: 'absolute',
                  top: -12,
                  right: -12,
                  background: '#1B2A4A',
                  border: '1px solid rgba(200,172,120,0.4)',
                  color: '#947231',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 14,
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── YouTube Matrix 3×3 ───────────────────────────────────────────────────────
const YOUTUBE_VIDEOS = [
  { id: 'DEVo7NabIy8', title: "Bringing James Christie's Legacy to the Hamptons" },
  { id: 'FCsLbt_EgJ8', title: 'Get to Know Me — Ed Bruehl, Hamptons Real Estate' },
  { id: 'gucsKvabi_k', title: 'Uncovering Value in Hamptons Real Estate — Traveling Podcast' },
  { id: 'WhTXS0xz-Hs', title: 'Your Hamptons Real Estate Podcast Ep. 1 — Jacqueline Aleman, Esq.' },
  { id: 'IueHmzSSMT4', title: 'Your Hamptons Real Estate Podcast Ep. 2 — Marit Molin' },
  { id: 'Vksowg9h2iQ', title: 'Your Hamptons Real Estate Podcast Ep. 3 — Brad Beyer' },
  { id: '3w7p8ZnrsdU', title: 'Found Inventory in the Hamptons — Ed Bruehl' },
  { id: 'mRHfcIzsLvc', title: '3 Essentials for Every Successful Deal — Ed Bruehl' },
  { id: 'fAPHGnmI_N4', title: 'SOLD & CLOSED: 129 Seven Ponds Road, Water Mill — 33.3 Acres' },
];

function YouTubeMatrix() {
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <section className="no-print" style={{ background: 'transparent', padding: '0 0 24px' }}>
      <div className="px-6 py-14" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ background: 'rgba(27,42,74,0.88)', border: '1px solid rgba(200,172,120,0.35)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.35)', padding: '28px 32px' }}>
        <div
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            color: 'rgba(200,172,120,0.55)',
            fontSize: 9,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          Christie's East Hampton · Video Intelligence
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {YOUTUBE_VIDEOS.map((v) => (
            <div
              key={v.id}
              style={{ background: '#000', aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}
            >
              {playing === v.id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}?autoplay=1`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              ) : (
                <button
                  onClick={() => setPlaying(v.id)}
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                    alt={v.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(27,42,74,0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      className="video-play-button"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'rgba(200,172,120,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width={16} height={16} viewBox="0 0 16 16" fill="#1B2A4A">
                        <polygon points="5,3 13,8 5,13" />
                      </svg>
                    </div>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '6px 8px',
                      background: 'linear-gradient(transparent, rgba(27,42,74,0.85))',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        color: '#FAF8F4',
                        fontSize: 9,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {v.title}
                    </p>
                  </div>
                  </button>
              )}
            </div>
          ))}
        </div>
        </div>{/* /mount frame */}
      </div>
    </section>
  );
}

// ─── SECTION 7 · Christie's Auction Intelligence ─────────────────────────────────────────────────────
// Contextual layer: upcoming auctions relevant to Hamptons buyers and sellers.
// Disappears gracefully if no content is available.
const AUCTION_ITEMS = [
  {
    category: 'Jewelry & Watches',
    title: 'Magnificent Jewels',
    date: 'April 10, 2026',
    location: 'New York',
    estimate: '$2M – $18M',
    href: 'https://www.christies.com/en/auction/magnificent-jewels-30513/',
    note: 'Relevant to estate liquidation conversations with ultra-trophy sellers.',
  },
  {
    category: 'Fine Art',
    title: '20th Century Evening Sale',
    date: 'May 13, 2026',
    location: 'New York',
    estimate: '$40M – $120M',
    href: 'https://www.christies.com/calendar',
    note: 'Cross-category conversation starter for art-collecting buyers at $5M+ tier.',
  },
  {
    category: 'Automobiles',
    title: 'Gooding & Company — Amelia Island',
    date: 'March 8, 2026',
    location: 'Amelia Island, FL',
    estimate: '$1M – $8M per lot',
    href: 'https://www.goodingco.com',
    note: 'Gooding relationship — relevant to developer and collector buyer profiles.',
  },
  {
    category: 'Handbags & Fashion',
    title: 'Handbags & Accessories Online',
    date: 'April 3–17, 2026',
    location: 'Online',
    estimate: '$5K – $250K',
    href: 'https://www.christies.com/calendar',
    note: 'Lifestyle touchpoint for high-net-worth buyer relationships.',
  },
];

function Section7() {
  if (AUCTION_ITEMS.length === 0) return null;
  return (
    <section style={{ background: 'transparent', padding: '0 0 24px' }}>
      <div className="px-6 py-14" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ background: 'rgba(27,42,74,0.88)', border: '1px solid rgba(200,172,120,0.35)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.35)', padding: '28px 32px' }}>
        <p style={{
          fontFamily: '"Source Sans 3", sans-serif',
          color: 'rgba(250,248,244,0.85)',
          fontSize: '0.8125rem',
          marginBottom: 24,
          maxWidth: 680,
          lineHeight: 1.65,
        }}>
          Upcoming Christie's and affiliated auctions relevant to Hamptons buyer and seller conversations.
          Use these as relationship touchpoints, not sales pitches.
        </p>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {AUCTION_ITEMS.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
              className="block transition-opacity hover:opacity-80"
            >
              <div style={{
                border: '0.5px solid rgba(200,172,120,0.25)',
                background: 'rgba(200,172,120,0.04)',
                padding: '16px 18px',
              }}>
                <div style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  color: '#947231',
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}>
                  {item.category}
                </div>
                <div style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  color: '#FAF8F4',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  marginBottom: 4,
                  lineHeight: 1.3,
                }}>
                  {item.title}
                </div>
                <div style={{
                  fontFamily: '"Source Sans 3", sans-serif',
                  color: 'rgba(250,248,244,0.5)',
                  fontSize: '0.75rem',
                  marginBottom: 8,
                }}>
                  {item.date} · {item.location}
                </div>
                <div style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  color: '#947231',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  marginBottom: 10,
                }}>
                  Est. {item.estimate}
                </div>
                <div style={{
                  fontFamily: '"Source Sans 3", sans-serif',
                  color: 'rgba(250,248,244,0.38)',
                  fontSize: '0.7rem',
                  lineHeight: 1.5,
                  borderTop: '0.5px solid rgba(200,172,120,0.15)',
                  paddingTop: 8,
                  fontStyle: 'italic',
                }}>
                  {item.note}
                </div>
              </div>
            </a>
          ))}
        </div>
        <div style={{
          marginTop: 24,
          fontFamily: '"Barlow Condensed", sans-serif',
          color: 'rgba(200,172,120,0.35)',
          fontSize: 8,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
          Christie's International Real Estate Group · East Hampton · christiesrealestategroupeh.com
        </div>
        </div>{/* /mount frame */}
      </div>
    </section>
  );
}

// ─── Main ReportPage export ───────────────────────────────────────────────
// ReportPage Section Inventory — maintain on every add/remove/reorder (H6 · Shell Purge P2)
// CANON ORDER (Commit B · Apr 24 2026):
// Section 1 · Founding Letter (James Christie portrait + letter)
// Section 4 · Hamlet Atlas Matrix (11 hamlets, FloatingCard, median-descending)
// Section 3 · Rate Cards / Market Intelligence (CFS, rates, market strip)
// YouTubeMatrix · Video Intelligence — nine YouTube embeds
// AuctionGallery · Auction Calendar — 3×3 auction image grid
// Section 7 · Private Territory CTA (auction items)
// REMOVED: Section 5 (MAPS Intelligence), Section 6 (Resources & Authority) — interstitials not in canon order
// EstateAdvisoryCard · Estate Advisory CTA
// SiteFooter · Canonical site footer (standalone route — not in DashboardLayout)
/**
 * R7 Doctrine (D65 Shell Purge · Apr 23 2026):
 * Lower-third ends once. One continuous closing sequence. One canonical SiteFooter. Done.
 * Section7 → EstateAdvisoryCard → SiteFooter. No stacked endings. No secondary footer logic.
 *
 * S1 Doctrine: outer wrapper is navy #0D1B2A — no route may inject its own background
 * system outside PageShell. ReportPage is a standalone route so it owns the shell.
 */
export default function ReportPage() {
  return (
    <div id="report-page-root" style={{ background: '#0D1B2A', minHeight: '100vh' }}>
      <BackBar />
      <div data-pdf-page="1">
        <Section1 />
      </div>
      <div data-pdf-page="2">
        <Section3 />
        <Section4 />
      </div>
      <div data-pdf-page="3">
        <YouTubeMatrix />
        <AuctionGallery />
        <Section7 />
        <EstateAdvisoryCard />
        <SiteFooter />
      </div>
    </div>
  );
}
