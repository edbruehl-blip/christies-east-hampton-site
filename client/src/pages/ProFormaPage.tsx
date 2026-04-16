/**
 * ProFormaPage.tsx — Christie's East Hampton · Pro Forma Live Renderer
 *
 * Route: /pro-forma
 * Architecture: Live URL renderer — no nav chrome, document-only.
 * PDF: client-side window.print() via ?pdf=1 (Doctrine 43). No Puppeteer dependency.
 * Sprint 12 fix: PDF button now uses window.print(); 6s timeout fallback for offline rendering.
 *
 * Four pages:
 *   Page 1 — The Ascension Arc (volume trajectory 2025–2036)
 *   Page 2 — The Machine (agent roster + volume)
 *   Page 3 — The Economics (profit pool + AnewHomes split)
 *   Page 4 — Defensible Numbers + Ed contact
 *
 * Data: trpc.future.ascensionArc · trpc.future.volumeData · trpc.pipe.getKpis
 * Brand: Cormorant Garamond + Barlow Condensed · Navy #1B2A4A · Gold #C8AC78 · Cream #FAF8F4
 *
 * Doctrine 20: Gold oklch(0.73 0.07 72) / Charcoal oklch(0.33 0.02 220)
 * Doctrine 14: No website URL in contact block
 * Doctrine 19: No website URL on any external surface
 * Sprint 8 · April 12, 2026 | Sprint 12 PDF fix · April 15, 2026
 */

import { trpc } from '@/lib/trpc';
import { useState, useEffect, useRef } from 'react';

// ─── Doctrine 43 — PDF Light Mode Export Standard (Sprint 11 · April 14, 2026) ───────────────
function useIsPdfMode(): boolean {
  const [isPdf, setIsPdf] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsPdf(params.get('pdf') === '1');
  }, []);
  return isPdf;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const LOGO_BLACK = 'https://d3w216np43fnr4.cloudfront.net/10580/348547/1.png';
const ED_HEADSHOT = 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/INlfZDqMHcqOCvuv.jpg';

const MAX_VOLUME = 3_000_000_000; // D7 · OUTPUTS B42 · Sprint 13

// Net pool fallback — OUTPUTS G32:G42 canonical NOP (Sprint 13, April 15, 2026, Perplexity verified)
// Formula: GCI(2%) − Royalty(5%) − AgentSplits(70%) − Overhead(MAX($200K, GCI×6%))
const NET_POOL_FALLBACK: Record<string, { pool: number; ed: number; ilija: number }> = {
  '2026': { pool: 175_000,     ed: 61_250,      ilija: 113_750 },
  '2027': { pool: 429_534,     ed: 150_337,     ilija: 279_197 },
  '2028': { pool: 964_694,     ed: 337_643,     ilija: 627_051 },
  '2029': { pool: 1_735_967,   ed: 607_588,     ilija: 1_128_379 },
  '2030': { pool: 2_859_800,   ed: 1_000_930,   ilija: 1_858_870 },
  '2031': { pool: 4_633_340,   ed: 1_621_669,   ilija: 3_011_671 },
  '2032': { pool: 5_537_718,   ed: 1_938_201,   ilija: 3_599_517 },
  '2033': { pool: 6_596_643,   ed: 2_308_825,   ilija: 4_287_818 },
  '2034': { pool: 7_889_800,   ed: 2_761_430,   ilija: 5_128_370 },
  '2035': { pool: 9_469_656,   ed: 3_314_380,   ilija: 6_155_277 },
  '2036': { pool: 11_400_000,  ed: 3_990_000,   ilija: 7_410_000 },
};

// Equation 1 cascade — Ed Net Personal Production
// After 70/30 house split + 5% overrides to 3 ICA team members
// Source: Perplexity dispatch April 15, 2026 evening. Verified against OUTPUTS row 46.
const EQ1_CASCADE: Record<string, number> = {
  '2026': 330_000,
  '2027': 990_000,
  '2028': 1_100_000,
  '2029': 1_210_000,
  '2030': 1_320_000,
  '2031': 1_430_000,
  '2032': 1_540_000,
  '2033': 1_650_000,
  '2034': 1_760_000,
  '2035': 1_870_000,
  '2036': 1_980_000,
};

// Sprint 13: canonical OUTPUTS B32:B42 (Perplexity April 15, 2026)
const OUTLOOK_YEARS = [
  { year: '2026', vol: 75_000_000 },
  { year: '2027', vol: 125_906_749 },
  { year: '2028', vol: 253_866_793 },
  { year: '2029', vol: 456_833_410 },
  { year: '2030', vol: 752_578_949 },
  { year: '2031', vol: 1_219_300_000 },
  { year: '2032', vol: 1_457_294_184 },
  { year: '2033', vol: 1_735_958_623 },
  { year: '2034', vol: 2_076_263_101 },
  { year: '2035', vol: 2_492_014_824 },
  { year: '2036', vol: 3_000_000_000 },
];

// ─── Formatters ───────────────────────────────────────────────────────────────
function fmtDollar(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function fmtFull(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

function profitPool(year: string, liveNetProfit?: number) {
  const live = liveNetProfit && liveNetProfit > 0 ? liveNetProfit : null;
  const fb = NET_POOL_FALLBACK[year];
  const pool = live ?? fb?.pool ?? 0;
  return {
    pool,
    ed: live ? Math.round(pool * 0.35) : (fb?.ed ?? Math.round(pool * 0.35)),
    ilija: live ? Math.round(pool * 0.65) : (fb?.ilija ?? Math.round(pool * 0.65)),
  };
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const PAGE_STYLE: React.CSSProperties = {
  width: '8.5in',
  minHeight: '11in',
  padding: '0.6in 0.65in 0.5in',
  background: '#FAF8F4',
  // NOTE: page-break is handled by print CSS only — do NOT set pageBreakAfter here
  // to avoid double page-break which creates blank pages between content.
  position: 'relative',
  boxSizing: 'border-box',
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 10,
  color: '#384249',
};

const HEADER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1.5px solid #C8AC78',
  paddingBottom: 10,
  marginBottom: 22,
};

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 8,
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: '#C8AC78',
  marginBottom: 6,
};

const PAGE_TITLE: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: 28,
  fontWeight: 300,
  color: '#1B2A4A',
  lineHeight: 1.1,
  marginBottom: 4,
};

const PAGE_SUBTITLE: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 9,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(56,66,73,0.5)',
  marginBottom: 20,
};

const CONFIDENTIAL_BANNER: React.CSSProperties = {
  background: '#1B2A4A',
  color: '#C8AC78',
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 7,
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  textAlign: 'center',
  padding: '4px 0',
  marginBottom: 18,
};

const FOOTNOTE: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 7.5,
  color: 'rgba(56,66,73,0.45)',
  lineHeight: 1.5,
  marginTop: 10,
  paddingTop: 8,
  borderTop: '1px solid rgba(27,42,74,0.08)',
};

const PAGE_FOOTER: React.CSSProperties = {
  position: 'absolute',
  bottom: '0.35in',
  left: '0.65in',
  right: '0.65in',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid rgba(27,42,74,0.1)',
  paddingTop: 6,
};

const FOOTER_SPAN: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 7,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(56,66,73,0.35)',
};

// ─── Page Header ──────────────────────────────────────────────────────────────
function PageHeader({ generatedAt }: { generatedAt: string }) {
  return (
    <div style={HEADER_STYLE}>
      <img src={LOGO_BLACK} alt="Christie's International Real Estate Group" style={{ height: 22 }} />
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(56,66,73,0.5)', textAlign: 'right' }}>
        Christie's East Hampton · Pro Forma<br />
        Generated {generatedAt} · Data: Growth Model v2
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ flex: 1, background: '#fff', border: '1px solid rgba(200,172,120,0.3)', borderLeft: '3px solid #C8AC78', padding: '10px 12px' }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(56,66,73,0.5)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: '#1B2A4A', lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7, color: 'rgba(56,66,73,0.4)', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

// ─── Page 1: The Ascension Arc ────────────────────────────────────────────────
function Page1({ generatedAt, activePipelineStr, exclusiveStr, liveNetProfitByYear }: {
  generatedAt: string;
  activePipelineStr: string;
  exclusiveStr: string;
  liveNetProfitByYear: Record<string, number>;
}) {
  const activeRaw = parseFloat(exclusiveStr.replace(/[^0-9.]/g, '')) * 1_000_000 || 0;

  return (
    <div style={PAGE_STYLE}>
      <div style={CONFIDENTIAL_BANNER}>INTERNAL · CONFIDENTIAL · NOT FOR DISTRIBUTION</div>
      <PageHeader generatedAt={generatedAt} />

      <div style={SECTION_LABEL}>Page 1 of 4</div>
      <div style={PAGE_TITLE}>The Ascension Arc</div>
      <div style={PAGE_SUBTITLE}>2025–2036 Sales Volume Trajectory · $3B Horizon</div>

      {/* KPI Strip */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <KpiCard label="Closed · First 100 Days" value="$4.57M" sub="Verified · Office closed period" />
        <KpiCard label="Active Pipeline" value={activePipelineStr} sub={`Live as of ${generatedAt}`} />
        <KpiCard label="2026 Baseline Projection" value="$75M" sub="MODEL · D6 · OUTPUTS B32" />
        <KpiCard label="$3B Horizon" value="2036" sub="MODEL · D7 · OUTPUTS B42" />
      </div>

      {/* Arc Bars */}
      <div style={SECTION_LABEL}>Volume Trajectory · 2025–2036</div>

      {/* 2025 baseline */}
      <ArcBarRow year="2025" vol={15_000_000} maxVol={MAX_VOLUME} isBaseline />

      {OUTLOOK_YEARS.map(({ year, vol }) => {
        const closedPct = year === '2026' ? Math.min((vol / MAX_VOLUME) * 100, (4_570_000 / MAX_VOLUME) * 100) : 0;
        const activePct = year === '2026' ? Math.min((vol / MAX_VOLUME) * 100 - closedPct, (activeRaw / MAX_VOLUME) * 100) : 0;
        const projPct = (vol / MAX_VOLUME) * 100 - closedPct - activePct;
        return (
          <div key={year} style={{ display: 'flex', alignItems: 'center', marginBottom: 7, gap: 10 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.12em', color: '#C8AC78', width: 32, flexShrink: 0 }}>{year}</div>
            <div style={{ flex: 1, height: 18, background: 'rgba(27,42,74,0.06)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ height: '100%', display: 'flex' }}>
                {year === '2026' ? (
                  <>
                    <div style={{ width: `${closedPct}%`, background: '#1B2A4A' }} />
                    <div style={{ width: `${activePct}%`, background: '#8a7a5a' }} />
                    <div style={{ width: `${projPct}%`, background: 'rgba(200,172,120,0.4)' }} />
                  </>
                ) : (
                  <div style={{ width: `${(vol / MAX_VOLUME) * 100}%`, background: vol >= 1_000_000_000 ? '#C8AC78' : 'rgba(27,42,74,0.5)' }} />
                )}
              </div>
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8.5, color: '#384249', width: 60, flexShrink: 0, textAlign: 'right' }}>{fmtDollar(vol)}</div>
          </div>
        );
      })}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {[['#1B2A4A', 'Closed'], ['#8a7a5a', 'Active'], ['rgba(200,172,120,0.4)', 'Projected']].map(([bg, label]) => (
          <span key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(56,66,73,0.5)' }}>
            <span style={{ width: 12, height: 8, background: bg as string, display: 'inline-block' }} />
            {label}
          </span>
        ))}
      </div>

      <div style={FOOTNOTE}>
        * All projections labeled MODEL. 2026 Closed ($4.57M) and Active ({exclusiveStr}) are verified actuals.
        2026 baseline ($75M) and all outer years are governing-principle projections, not guarantees.
        Data source: Growth Model v2 · Christie's East Hampton · INTERNAL ONLY.
      </div>

      <div style={PAGE_FOOTER}>
        <span style={FOOTER_SPAN}>Christie's East Hampton · Pro Forma · {generatedAt}</span>
        <span style={FOOTER_SPAN}>INTERNAL · CONFIDENTIAL · Page 1 of 4</span>
      </div>
    </div>
  );
}

function ArcBarRow({ year, vol, maxVol, isBaseline }: { year: string; vol: number; maxVol: number; isBaseline?: boolean }) {
  const pct = Math.min(100, (vol / maxVol) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 7, gap: 10 }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.12em', color: isBaseline ? 'rgba(56,66,73,0.4)' : '#C8AC78', width: 32, flexShrink: 0 }}>{year}</div>
      <div style={{ flex: 1, height: 18, background: 'rgba(27,42,74,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ height: '100%', display: 'flex' }}>
          <div style={{ width: `${pct}%`, background: isBaseline ? 'rgba(27,42,74,0.2)' : 'rgba(27,42,74,0.5)' }} />
        </div>
      </div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8.5, color: isBaseline ? 'rgba(56,66,73,0.4)' : '#384249', width: 60, flexShrink: 0, textAlign: 'right' }}>{fmtDollar(vol)}</div>
    </div>
  );
}

// ─── Page 2: The Machine ──────────────────────────────────────────────────────
interface AgentRow {
  name: string;
  role: string;
  status: string;
  proj2026: number;
  act2026: number;
  proj2027: number;
}

function Page2({ generatedAt, agents, total }: {
  generatedAt: string;
  agents: AgentRow[];
  total: { proj2026: number; act2026: number; proj2027: number };
}) {
  return (
    <div style={PAGE_STYLE}>
      <div style={CONFIDENTIAL_BANNER}>INTERNAL · CONFIDENTIAL · NOT FOR DISTRIBUTION</div>
      <PageHeader generatedAt={generatedAt} />

      <div style={SECTION_LABEL}>Page 2 of 4</div>
      <div style={PAGE_TITLE}>The Machine</div>
      <div style={PAGE_SUBTITLE}>Agent Roster · 9 Named + 7 TBD = 16 for 2026 · Sales Volume</div>

      <div style={{ background: 'rgba(200,172,120,0.1)', border: '1px solid rgba(200,172,120,0.4)', borderLeft: '3px solid #C8AC78', padding: '6px 10px', marginBottom: 12, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8AC78' }}>
        ★ Sales Volume Only — GCI Internal · Not for External Distribution
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9 }}>
        <thead>
          <tr style={{ borderBottom: '1.5px solid #C8AC78', background: 'rgba(27,42,74,0.02)' }}>
            {['Agent', 'Role', 'Status', '2026 Proj Vol', '2026 Actual', '2027 Proj Vol', '2027 Actual'].map(h => (
              <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontSize: 7.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8AC78', fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {agents.map((a, i) => (
            <tr key={a.name} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)', background: i % 2 === 1 ? 'rgba(27,42,74,0.015)' : 'transparent' }}>
              <td style={{ padding: '5px 8px', color: '#384249', fontSize: 9 }}>{a.name}</td>
              <td style={{ padding: '5px 8px', color: '#384249', fontSize: 9 }}>{a.role}</td>
              <td style={{ padding: '5px 8px', color: '#384249', fontSize: 9 }}>{a.status}</td>
              <td style={{ padding: '5px 8px', color: '#384249', fontSize: 9 }}>{fmtDollar(a.proj2026)}</td>
              <td style={{ padding: '5px 8px', color: a.act2026 > 0 ? '#1B2A4A' : 'rgba(56,66,73,0.3)', fontSize: 9 }}>{a.act2026 > 0 ? fmtDollar(a.act2026) : '—'}</td>
              <td style={{ padding: '5px 8px', color: '#384249', fontSize: 9 }}>{fmtDollar(a.proj2027)}</td>
              <td style={{ padding: '5px 8px', color: 'rgba(56,66,73,0.3)', fontSize: 9 }}>—</td>
            </tr>
          ))}
          <tr style={{ borderTop: '1px solid rgba(200,172,120,0.3)', background: 'rgba(27,42,74,0.02)', fontSize: 8 }}>
            <td colSpan={7} style={{ padding: '4px 8px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 7.5, color: 'rgba(56,66,73,0.4)' }}>
              + 3 Targeted Hires 2026 ($375K each) + 4 Organic Adds ($50K each) — not shown individually
            </td>
          </tr>
          <tr style={{ borderTop: '1.5px solid #C8AC78', background: 'rgba(27,42,74,0.03)', fontWeight: 600 }}>
            <td colSpan={3} style={{ padding: '5px 8px', color: '#1B2A4A', fontWeight: 600, fontSize: 9 }}>TOTAL (Baseline)</td>
            <td style={{ padding: '5px 8px', color: '#C8AC78', fontWeight: 600, fontSize: 9 }}>{fmtDollar(total.proj2026)}</td>
            <td style={{ padding: '5px 8px', color: '#1B2A4A', fontWeight: 600, fontSize: 9 }}>{fmtDollar(total.act2026)}</td>
            <td style={{ padding: '5px 8px', color: '#C8AC78', fontWeight: 600, fontSize: 9 }}>{fmtDollar(total.proj2027)}</td>
            <td style={{ padding: '5px 8px', color: 'rgba(56,66,73,0.3)', fontSize: 9 }}>—</td>
          </tr>
          <tr style={{ borderTop: '1px dashed rgba(200,172,120,0.5)', background: 'rgba(200,172,120,0.04)' }}>
            <td colSpan={3} style={{ padding: '5px 8px', color: '#8a7a5a', fontStyle: 'italic', fontSize: 9 }}>AnewHomes — Custom Build · Ed Bruehl exclusively</td>
            <td style={{ padding: '5px 8px', color: '#8a7a5a', fontSize: 9 }}>$50K net*</td>
            <td style={{ padding: '5px 8px', color: 'rgba(56,66,73,0.3)', fontSize: 9 }}>—</td>
            <td style={{ padding: '5px 8px', color: '#8a7a5a', fontSize: 9 }}>$150K net*</td>
            <td style={{ padding: '5px 8px', color: 'rgba(56,66,73,0.3)', fontSize: 9 }}>—</td>
          </tr>
        </tbody>
      </table>

      <div style={FOOTNOTE}>
        * AnewHomes figures are net build profit, not sales volume. Separate from Christie's commission income.
        Agent count: 9 existing (including Scott Smith pending June 1) + 3 targeted + 4 organic = 16 for 2026.
        All projections labeled MODEL. Actual columns update as deals close in PIPE.
        Scott Smith start date pending June 1, 2026 confirmation.
      </div>

      <div style={PAGE_FOOTER}>
        <span style={FOOTER_SPAN}>Christie's East Hampton · Pro Forma · {generatedAt}</span>
        <span style={FOOTER_SPAN}>INTERNAL · CONFIDENTIAL · Page 2 of 4</span>
      </div>
    </div>
  );
}

// ─── Page 3: The Economics ────────────────────────────────────────────────────
function Page3({ generatedAt, liveNetProfitByYear }: {
  generatedAt: string;
  liveNetProfitByYear: Record<string, number>;
}) {
  const pool2026 = profitPool('2026', liveNetProfitByYear['2026']);

  return (
    <div style={PAGE_STYLE}>
      <div style={CONFIDENTIAL_BANNER}>INTERNAL · CONFIDENTIAL · NOT FOR DISTRIBUTION</div>
      <PageHeader generatedAt={generatedAt} />

      <div style={SECTION_LABEL}>Page 3 of 4</div>
      <div style={PAGE_TITLE}>The Economics</div>
      <div style={PAGE_SUBTITLE}>Profit Pool · Ed's Three Income Streams · AnewHomes Split</div>

      <div style={{ background: 'rgba(200,172,120,0.1)', border: '1px solid rgba(200,172,120,0.4)', borderLeft: '3px solid #C8AC78', padding: '6px 10px', marginBottom: 12, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8AC78' }}>
        ★ INTERNAL ONLY — GCI and Profit Pool · Not for External Documents · Governing Principle *
      </div>

      <div style={{ ...SECTION_LABEL, marginBottom: 8 }}>Profit Pool · 2026–2036 Projection</div>
      <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', padding: '8px 10px', marginBottom: 10, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8.5, color: '#384249', lineHeight: 1.6 }}>
        Formula: Gross GCI = Office Volume × 2%. Royalty = GCI × 5%. Agent Splits = GCI × 70%.
        Overhead = MAX($200K, GCI × 6%). <strong>Net Operating Profit = GCI − Royalty − Splits − Overhead.</strong>
        Split: <strong>Ed 35%</strong> · <strong>Ilija 65%</strong> · two parties only.
        Paid at year end. Not salary. Not splits. Profit participation. Source: Growth Model v2 OUTPUTS D39/D41.
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, marginBottom: 14 }}>
        <thead>
          <tr style={{ borderBottom: '1.5px solid #C8AC78', background: 'rgba(27,42,74,0.02)' }}>
            {['Year', 'Office Volume', 'Gross GCI (2%)', 'Net Operating Profit', 'Ed (35%)', 'Ilija (65%)'].map(h => (
              <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontSize: 7.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8AC78', fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {OUTLOOK_YEARS.map(({ year, vol }, i) => {
            const p = profitPool(year, liveNetProfitByYear[year]);
            const above = Math.max(0, vol - 40_000_000);
            return (
              <tr key={year} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)', background: i % 2 === 1 ? 'rgba(27,42,74,0.015)' : 'transparent' }}>
                <td style={{ padding: '5px 8px', color: '#C8AC78', fontWeight: 600, letterSpacing: '0.1em', fontSize: 9 }}>{year}</td>
                <td style={{ padding: '5px 8px', fontSize: 9 }}>{fmtFull(vol)}</td>
                <td style={{ padding: '5px 8px', color: '#C8AC78', fontWeight: 600, fontSize: 9 }}>{fmtFull(Math.round(vol * 0.02))}</td>
                <td style={{ padding: '5px 8px', color: '#C8AC78', fontWeight: 600, fontSize: 9 }}>{p.pool > 0 ? fmtFull(p.pool) : '$0'}</td>
                <td style={{ padding: '5px 8px', fontWeight: 600, fontSize: 9 }}>{p.ed > 0 ? fmtFull(p.ed) : '$0'}</td>
                <td style={{ padding: '5px 8px', fontSize: 9 }}>{p.ilija > 0 ? fmtFull(p.ilija) : '$0'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Two income blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        {/* Ed's Three Income Streams */}
        <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', padding: '12px 14px' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8AC78', marginBottom: 8, borderBottom: '1px solid rgba(200,172,120,0.3)', paddingBottom: 5 }}>Ed Bruehl · Three Income Streams · 2026</div>
          {[
            ['Ed Net Personal Production (Eq. 1)', `${fmtFull(EQ1_CASCADE['2026'])}*`],
            ['Profit Pool Share — Ed 35% (Eq. 2)', `${fmtFull(pool2026.ed)}*`],
            ['AnewHomes Net Build Profit — Ed 35% (Eq. 3)', '$17,500*'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9 }}>
              <span style={{ color: 'rgba(56,66,73,0.7)' }}>{label}</span>
              <span style={{ color: '#1B2A4A', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(27,42,74,0.1)', marginTop: 6, paddingTop: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9 }}>
              <span style={{ fontWeight: 600, color: '#1B2A4A' }}>Total 2026 (MODEL)</span>
              <span style={{ color: '#C8AC78', fontWeight: 600 }}>{fmtFull(EQ1_CASCADE['2026'] + pool2026.ed + 17_500)}*</span>
            </div>
          </div>
        </div>

        {/* AnewHomes Split */}
        <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', padding: '12px 14px' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8AC78', marginBottom: 8, borderBottom: '1px solid rgba(200,172,120,0.3)', paddingBottom: 5 }}>AnewHomes · Net Build Profit Split</div>
          {[
            ['Ed Bruehl (35%)', '$17,500 Y1 / $52,500 Y2*'],
            ['Scott Smith (35%)', '$17,500 Y1 / $52,500 Y2*'],
            ['Richard Bruehl (10%)', '$5,000 Y1 / $15,000 Y2*'],
            ['Jarvis Slade (5%)', '$2,500 Y1 / $7,500 Y2*'],
            ['Angel Theodore (5%)', '$2,500 Y1 / $7,500 Y2*'],
            ['Zoila Ortega Astor (5%†)', '$2,500 Y1 / $7,500 Y2*'],
            ['Pool / Future (5%)', '$2,500 Y1 / $7,500 Y2*'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9 }}>
              <span style={{ color: 'rgba(56,66,73,0.7)' }}>{label}</span>
              <span style={{ color: '#1B2A4A', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(27,42,74,0.1)', marginTop: 6, paddingTop: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9 }}>
              <span style={{ fontWeight: 600, color: '#1B2A4A' }}>Total Net Profit</span>
              <span style={{ color: '#C8AC78', fontWeight: 600 }}>$50,000 Y1 / $150,000 Y2*</span>
            </div>
          </div>
        </div>
      </div>

      <div style={FOOTNOTE}>
        * Governing principle only — not yet contractual. All figures labeled MODEL.
        Profit pool activates above $40M total sales volume.
        AnewHomes pool growth: Y1 $50K · Y2 $150K · 12.5% annual growth thereafter. Ed 35%.
        Morton steel-frame custom builds. ADU Garage Living Unit drives Year 1 income.
        Net profit after ALL build costs. Separate from Christie's commission income entirely.
        All seven AnewHomes participants aware and agreeable. Not yet formalized.
        † Zoila Ortega Astor start date May 4, 2026 · 6-month vesting period · cliff November 4, 2026 · activates 2027 forward. Reverts to pool if she does not make the cut.
      </div>

      <div style={PAGE_FOOTER}>
        <span style={FOOTER_SPAN}>Christie's East Hampton · Pro Forma · {generatedAt}</span>
        <span style={FOOTER_SPAN}>INTERNAL · CONFIDENTIAL · Page 3 of 4</span>
      </div>
    </div>
  );
}

// ─── Page 4: Defensible Numbers ───────────────────────────────────────────────
function Page4({ generatedAt, activePipelineStr, exclusiveStr }: {
  generatedAt: string;
  activePipelineStr: string;
  exclusiveStr: string;
}) {
  const defCards = [
    { value: '$4.57M', label: 'Closed Volume', note: 'Verified · First 100 days, office closed' },
    { value: activePipelineStr, label: 'Active Pipeline', note: `Live as of ${generatedAt}` },
    { value: '$75M', label: '2026 Baseline', note: 'MODEL · D6 · OUTPUTS B32' },
    { value: '9', label: 'Named Team Members', note: 'Incl. Scott Smith pending June 1' },
    { value: '$6.5M', label: 'Flambeaux Signed', note: 'Verified · In active pipeline' },
    { value: '$3B', label: '2036 Horizon', note: 'MODEL · D7 · OUTPUTS B42' },
  ];

  return (
    <div style={PAGE_STYLE}>
      <div style={CONFIDENTIAL_BANNER}>INTERNAL · CONFIDENTIAL · NOT FOR DISTRIBUTION</div>
      <PageHeader generatedAt={generatedAt} />

      <div style={SECTION_LABEL}>Page 4 of 4</div>
      <div style={PAGE_TITLE}>Defensible Numbers</div>
      <div style={PAGE_SUBTITLE}>Verified Actuals as of {generatedAt} · Growth Trajectory Labeled MODEL</div>

      {/* Defensible grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        {defCards.map(({ value, label, note }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderTop: '2px solid #C8AC78', padding: '10px 12px' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: '#1B2A4A', lineHeight: 1, marginBottom: 3 }}>{value}</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(56,66,73,0.5)' }}>{label}</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7, color: 'rgba(56,66,73,0.35)', marginTop: 2 }}>{note}</div>
          </div>
        ))}
      </div>

      {/* MODEL assumptions */}
      <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', padding: '10px 14px', marginBottom: 14 }}>
        <div style={{ ...SECTION_LABEL, marginBottom: 6 }}>Growth Trajectory — MODEL Assumptions</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8.5, color: '#384249', lineHeight: 1.7 }}>
          All figures beyond verified actuals ($4.57M closed, {exclusiveStr} active) are governing-principle projections.
          The $75M 2026 baseline (OUTPUTS B32) assumes 5 named agents at stated volume. Targeted hires and
          organic adds are upside above the baseline. Net Operating Profit formula: GCI − Royalty − Splits − Overhead.
          All outer-year projections (2027–2036) are MODEL and subject to revision as the team grows.
        </div>
      </div>

      {/* Contact card */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: '#1B2A4A', padding: '18px 20px', marginTop: 16 }}>
        <img src={ED_HEADSHOT} alt="Ed Bruehl" style={{ width: 70, height: 70, objectFit: 'cover', objectPosition: 'top' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: '#FAF8F4', lineHeight: 1.1, marginBottom: 2 }}>Ed Bruehl</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8AC78', marginBottom: 10 }}>Managing Director · Christie's East Hampton</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, color: 'rgba(250,248,244,0.7)', lineHeight: 1.7 }}>
            M: 646.752.1233 · O: 631.771.7004<br />
            edbruehl@christiesrealestategroup.com<br />
            26 Park Place · East Hampton, NY 11937<br />
            Christie's International Real Estate Group · Est. 1766
          </div>
        </div>
      </div>

      <div style={{ ...FOOTNOTE, marginTop: 12 }}>
        This document is prepared for internal use only. All projections are governing-principle models,
        not guarantees. Verified actuals are noted explicitly. No GCI figure appears without the asterisk
        and "governing principle" label. This document is not for external distribution.
        Christie's International Real Estate Group · {generatedAt}
      </div>

      <div style={PAGE_FOOTER}>
        <span style={FOOTER_SPAN}>Christie's East Hampton · Pro Forma · {generatedAt}</span>
        <span style={FOOTER_SPAN}>INTERNAL · CONFIDENTIAL · Page 4 of 4</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProFormaPage() {
  const isPdfMode = useIsPdfMode();
  const { data: arcData, isLoading: arcLoading } = trpc.future.ascensionArc.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });
  const { data: volData, isLoading: volLoading } = trpc.future.volumeData.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });
  const { data: kpisData } = trpc.pipe.getKpis.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });

  const generatedAt = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Live pipeline KPIs — fall back to last-known values if sheet unavailable
  const activePipelineStr = kpisData?.relationshipBookM ?? '$14.5M';
  const exclusiveStr = kpisData?.exclusiveTotalM ?? '$6.5M';

  // Build live net profit lookup from arcData
  const liveNetProfitByYear: Record<string, number> = {};
  if (arcData?.years) {
    for (const y of arcData.years) {
      liveNetProfitByYear[String(y.year)] = y.netProfit;
    }
  }

  // Agent roster from volumeData — fall back to static roster if sheet unavailable
  const agents: AgentRow[] = volData?.agents?.length ? volData.agents : [
    { name: 'Ed Bruehl', role: 'Managing Director', status: 'Active', proj2026: 20_000_000, act2026: 4_570_000, proj2027: 30_000_000 },
    { name: 'Jarvis Slade', role: 'COO & Agent', status: 'Active', proj2026: 8_000_000, act2026: 0, proj2027: 15_000_000 },
    { name: 'Angel Theodore', role: 'Operations', status: 'Active', proj2026: 0, act2026: 0, proj2027: 0 },
    { name: 'Zoila Ortega Astor', role: 'Office Director', status: 'Joining May 4', proj2026: 5_000_000, act2026: 0, proj2027: 10_000_000 },
    { name: 'Scott Smith', role: 'Agent', status: 'Joining Jun 1', proj2026: 5_000_000, act2026: 0, proj2027: 12_000_000 },
    { name: 'Richard Bruehl', role: 'Strategic Mentor', status: 'Active', proj2026: 0, act2026: 0, proj2027: 0 },
  ];

  const total = volData?.total ?? {
    proj2026: 75_000_000,  // D6 · OUTPUTS B32 · Sprint 13
    act2026: 4_570_000,
    proj2027: 125_906_749, // OUTPUTS B33 · Sprint 13
  };

  // Timeout fallback: if data hasn't loaded in 6 seconds, render with static fallbacks
  // This ensures the page is never blank when the server is slow or unavailable.
  const [loadTimeout, setLoadTimeout] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!arcLoading && !volLoading) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    timeoutRef.current = setTimeout(() => setLoadTimeout(true), 6000);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [arcLoading, volLoading]);
  const isLoading = (arcLoading || volLoading) && !loadTimeout;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#FAF8F4', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(56,66,73,0.5)' }}>
        Loading Pro Forma · Christie's East Hampton
      </div>
    );
  }

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Barlow+Condensed:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #FAF8F4; }
        @page {
          size: 8.5in 11in;
          margin: 0;
        }
        @media print {
          body { background: #FAF8F4 !important; }
          /* One clean page break per content div — no trailing blank pages */
          .pro-forma-page {
            break-after: page;
            page-break-after: always;
          }
          .pro-forma-page:last-child {
            break-after: avoid;
            page-break-after: avoid;
          }
          /* Hide the print/back button bar */
          .no-print { display: none !important; }
          /* Ensure wrapper has no padding that would push content onto extra pages */
          .pro-forma-wrapper { padding: 0 !important; background: #FAF8F4 !important; }
        }
      `}</style>

      {/* Print button — hidden in print/Puppeteer mode */}
      <div className="no-print" style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, display: 'flex', gap: 8 }}>
        <button
          onClick={() => {
            // Doctrine 43: client-side window.print() — no Puppeteer dependency.
            // If already in ?pdf=1 mode, print directly.
            if (isPdfMode) {
              window.print();
              return;
            }
            // Otherwise open a new tab with ?pdf=1 and trigger print after render.
            const printWin = window.open('/pro-forma?pdf=1', '_blank');
            if (!printWin) {
              alert('Pop-up blocked. Please allow pop-ups for this site and try again.');
              return;
            }
            printWin.addEventListener('load', () => {
              // Extra delay for Google Fonts + chart render
              setTimeout(() => {
                printWin.focus();
                printWin.print();
              }, 2000);
            });
          }}
          style={{ background: '#1B2A4A', color: '#C8AC78', border: 'none', padding: '8px 16px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          ↓ Print PDF
        </button>
        <button
          onClick={() => window.close()}
          style={{ background: 'transparent', color: 'rgba(56,66,73,0.5)', border: '1px solid rgba(56,66,73,0.2)', padding: '8px 16px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          ← Back
        </button>
      </div>

      <div className="pro-forma-wrapper" style={{ background: isPdfMode ? '#FFFFFF' : '#e8e6e0', padding: isPdfMode ? '0' : '24px 0', minHeight: '100vh' }}>
        <div className="pro-forma-page"><Page1 generatedAt={generatedAt} activePipelineStr={activePipelineStr} exclusiveStr={exclusiveStr} liveNetProfitByYear={liveNetProfitByYear} /></div>
        <div className="pro-forma-page"><Page2 generatedAt={generatedAt} agents={agents} total={total} /></div>
        <div className="pro-forma-page"><Page3 generatedAt={generatedAt} liveNetProfitByYear={liveNetProfitByYear} /></div>
        <div className="pro-forma-page"><Page4 generatedAt={generatedAt} activePipelineStr={activePipelineStr} exclusiveStr={exclusiveStr} /></div>
      </div>
    </>
  );
}
