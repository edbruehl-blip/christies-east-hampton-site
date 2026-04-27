/**
 * ProFormaPage.tsx — Christie's East Hampton · Pro Forma Live Renderer
 *
 * Route: /pro-forma (inside DashboardLayout — navy hero shell)
 *
 * D65 Strict (Apr 23 2026): useIsPdfMode deleted. All 31 isPdfMode branches collapsed
 * to their dark-navy canonical values. Single render path. PDF = html2canvas screenshot
 * of this live navy render. No parallel paths.
 *
 * Four pages:
 *   Page 1 — The Ascension Arc (volume trajectory 2025–2036)
 *   Page 2 — The Machine (agent roster + volume)
 *   Page 3 — The Economics (profit pool + AnewHomes split)
 *   Page 4 — Defensible Numbers + Ed contact
 *
 * Data: trpc.future.ascensionArc · trpc.future.volumeData · trpc.pipe.getKpis
 * Brand: Cormorant Garamond + Barlow Condensed · Navy #1B2A4A · Gold #947231
 *
 * Doctrine 20: Gold oklch(0.73 0.07 72) / Charcoal oklch(0.33 0.02 220)
 * Doctrine 14: No website URL in contact block
 * Doctrine 19: No website URL on any external surface
 */

import { trpc } from '@/lib/trpc';
import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';

// ─── Constants ────────────────────────────────────────────────────────────────
// D65: LOGO_BLACK deleted — ProFormaPage now uses navy shell (dark background)
const LOGO_WHITE = 'https://d3w216np43fnr4.cloudfront.net/10580/348947/1.png';
const ED_HEADSHOT = 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/INlfZDqMHcqOCvuv.jpg';

const MAX_VOLUME = 3_000_000_000; // D7 · OUTPUTS B42 · Sprint 13

// Net pool fallback — OUTPUTS G32:G42 canonical NOP (Sprint 13, April 15, 2026, Perplexity verified)
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

interface FiveBandYear {
  year: string;
  eh: number;
  sh: number;
  wh: number;
  combined: number;
  display: string;
}
const FIVE_BAND_YEARS: FiveBandYear[] = (() => {
  const EH_TOTAL = [75, 125.9, 211.7, 295.5, 410.7, 566.6, 597.6, 676.3, 784.9, 932.6, 1133.3];
  const SH_M     = [0,     0,  42.1, 161.4, 285.2, 422.1, 507.4, 607.3, 698.4, 821.6,  987.8];
  const WH_M     = [0,     0,     0,     0,  56.7, 230.5, 352.3, 452.4, 592.9, 737.8,  878.9];
  const YEARS    = ['2026','2027','2028','2029','2030','2031','2032','2033','2034','2035','2036'];
  return YEARS.map((yr, i) => {
    const eh = EH_TOTAL[i];
    const sh = SH_M[i];
    const wh = WH_M[i];
    const combined = eh + sh + wh;
    let display: string;
    if (yr === '2036') { display = '$3.1B'; }
    else if (combined >= 1000) { display = `$${(combined / 1000).toFixed(2).replace(/\.?0+$/, '')}B`; }
    else if (combined >= 100) { display = `$${Math.round(combined)}M`; }
    else { display = `$${combined.toFixed(1)}M`; }
    return { year: yr, eh, sh, wh, combined, display };
  });
})();
const OUTLOOK_YEARS = FIVE_BAND_YEARS.map(d => ({ year: d.year, vol: d.combined * 1_000_000 }));

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

// ─── Shared styles — D65: all dark-navy canonical values ──────────────────────
const PAGE_STYLE: React.CSSProperties = {
  width: '8.5in',
  minHeight: '11in',
  padding: '0.6in 0.65in 0.5in',
  background: '#FAF8F4',
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
  borderBottom: '1.5px solid #947231',
  paddingBottom: 10,
  marginBottom: 22,
};

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 8,
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: '#947231',
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
function PageHeader() {
  return (
    <div style={HEADER_STYLE}>
      <img src={LOGO_WHITE} alt="Christie's International Real Estate Group" style={{ height: 22 }} />
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(56,66,73,0.5)', textAlign: 'right' }}>
        Christie's East Hampton · Pro Forma
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ flex: 1, background: '#fff', border: '1px solid rgba(200,172,120,0.3)', borderLeft: '3px solid #947231', padding: '10px 12px' }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(56,66,73,0.5)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: '#1B2A4A', lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7, color: 'rgba(56,66,73,0.4)', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

// ─── Page 1: The Ascension Arc ────────────────────────────────────────────────
// D65: isPdfMode removed — chart always renders dark-navy frame
function Page1({ generatedAt, activePipelineStr, exclusiveStr, liveNetProfitByYear: _liveNetProfitByYear }: {
  generatedAt: string;
  activePipelineStr: string;
  exclusiveStr: string;
  liveNetProfitByYear: Record<string, number>;
}) {
  const C_EH   = '#9e1b32';
  const C_SH   = '#1a3a5c';
  const C_WH   = '#947231';
  const MAX_M  = 3500;

  const ALL_YEARS: Array<{ year: string; eh: number; sh: number; wh: number; combined: number; display: string; isBaseline?: boolean }> = [
    { year: '2025', eh: 20, sh: 0, wh: 0, combined: 20, display: '$20M', isBaseline: true },
    ...FIVE_BAND_YEARS,
  ];

  const CHART_H = 220;
  const BAR_W   = 38;
  const GAP     = 6;

  const Y_TICKS = [0, 500, 1000, 1500, 2000, 2500, 3000];

  return (
    <div style={PAGE_STYLE}>
      <PageHeader />

      <div style={SECTION_LABEL}>Page 1 of 4</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: '#1B2A4A', lineHeight: 1.1, marginBottom: 2 }}>The Ascension Arc</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, fontStyle: 'italic', color: 'rgba(56,66,73,0.55)', letterSpacing: '0.04em', marginBottom: 4 }}>Christie's East Hampton Flagship · 2025–2036 Sales Volume Trajectory</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a7a5a', marginBottom: 14 }}>FUTURE PROJECTIONS · CPS-1 PRO FORMA · WITHIN THE EXISTING GROWTH PLAN</div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <KpiCard label="Closed · First 100 Days" value="$4.57M" sub="Verified · Office closed period" />
        <KpiCard label="Active Pipeline" value={activePipelineStr} sub={`Live as of ${generatedAt}`} />
        <KpiCard label="2026 Baseline" value="$75M" sub="MODEL · D6 · OUTPUTS B32" />
        <KpiCard label="$3.1B Horizon" value="2036" sub="MODEL · D7 · OUTPUTS B42" />
      </div>

      {/* Chart frame — dark navy (D65 canonical) */}
      <div style={{ background: '#0f1820', borderRadius: 4, padding: '14px 14px 10px', marginBottom: 10, position: 'relative' }}>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 9, color: '#947231', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' }}>
          SALES VOLUME TRAJECTORY · 2025–2036 · ALL OFFICES
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', height: CHART_H, paddingBottom: 20, flexShrink: 0 }}>
            {[...Y_TICKS].reverse().map(t => (
              <div key={t} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 6.5, color: 'rgba(200,172,120,0.5)', letterSpacing: '0.05em' }}>
                {t === 0 ? '$0' : t >= 1000 ? `$${t/1000}B` : `$${t}M`}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, position: 'relative', height: CHART_H }}>
            {Y_TICKS.map(t => (
              <div key={t} style={{
                position: 'absolute',
                left: 0, right: 0,
                bottom: `${20 + (t / MAX_M) * (CHART_H - 20)}px`,
                height: 1,
                background: t === 0 ? 'rgba(200,172,120,0.25)' : 'rgba(200,172,120,0.08)',
              }} />
            ))}

            <div style={{ position: 'absolute', bottom: 20, left: 0, display: 'flex', gap: GAP, alignItems: 'flex-end', height: CHART_H - 20 }}>
              {ALL_YEARS.map((d) => {
                const totalH = ((d.combined) / MAX_M) * (CHART_H - 20);
                const ehH = (d.eh / MAX_M) * (CHART_H - 20);
                const shH = (d.sh / MAX_M) * (CHART_H - 20);
                const whH = (d.wh / MAX_M) * (CHART_H - 20);
                const isBaseline = d.isBaseline;
                const opacity = isBaseline ? 0.35 : 1;
                const labelColor = isBaseline ? 'rgba(200,172,120,0.4)' : '#947231';

                return (
                  <div key={d.year} style={{ width: BAR_W, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Georgia', serif", fontSize: 6, color: labelColor, marginBottom: 2, whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
                      {d.display}
                    </div>
                    <div style={{ width: '100%', height: totalH, display: 'flex', flexDirection: 'column-reverse', opacity }}>
                      <div style={{ height: ehH, background: C_EH, flexShrink: 0 }} />
                      <div style={{ height: shH, background: C_SH, flexShrink: 0 }} />
                      <div style={{ height: whH, background: C_WH, flexShrink: 0 }} />
                    </div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 6.5, color: isBaseline ? 'rgba(200,172,120,0.4)' : '#947231', marginTop: 3, letterSpacing: '0.08em' }}>
                      {d.year}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 18px', marginTop: 10, justifyContent: 'center' }}>
          {[
            [C_EH,   'East Hampton Flagship'],
            [C_SH,   'Southampton Flagship · 2028'],
            [C_WH,   'Westhampton Flagship · 2030'],
          ].map(([bg, label]) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: "Georgia, serif", fontSize: 9, letterSpacing: '0.03em', color: 'rgba(200,172,120,0.85)' }}>
              <span style={{ width: 14, height: 5, background: bg, display: 'inline-block', flexShrink: 0, border: '0.5px solid rgba(0,0,0,0.2)' }} />
              {label}
            </span>
          ))}
        </div>

        {/* D42: standalone SINCE 1766 removed — tagline in PageHeader already carries the year */}
      </div>

      <div style={FOOTNOTE}>
        * All projections labeled MODEL. 2026 Closed ($4.57M) and Active ({exclusiveStr}) are verified actuals.
        2026 baseline ($75M) and all outer years are governing-principle projections, not guarantees.
        AnewHomes and CPS-1 bands show visibility within EH total — not additive to EH volume.
        Data source: Growth Model · Christie's East Hampton.
      </div>

      <div style={PAGE_FOOTER}>
        <span style={FOOTER_SPAN}>Christie's East Hampton · Pro Forma · {generatedAt}</span>
        <span style={FOOTER_SPAN}>Page 1 of 4</span>
      </div>
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

const P2_CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(27,42,74,0.1)',
  borderLeft: '3px solid #947231',
  padding: '8px 10px',
  marginBottom: 6,
};
const P2_SANS = { fontFamily: "'Barlow Condensed', sans-serif" } as React.CSSProperties;
const P2_SERIF = { fontFamily: "'Cormorant Garamond', serif" } as React.CSSProperties;
const P2_GOLD = '#947231';
const P2_MUTED = 'rgba(56,66,73,0.5)';
const P2_DIM = 'rgba(56,66,73,0.45)';
const P2_CHARCOAL = 'rgba(27,42,74,0.12)';

function P2StreamRow({ label, vals, isTotal }: { label: string; vals: string[]; isTotal?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...P2_SANS, fontSize: isTotal ? 7.5 : 7, lineHeight: 1.65, color: isTotal ? P2_GOLD : P2_MUTED, fontWeight: isTotal ? 600 : 400, borderTop: isTotal ? `0.5px solid ${P2_CHARCOAL}` : undefined, paddingTop: isTotal ? 3 : undefined, marginTop: isTotal ? 2 : undefined }}>
      <span>{label}</span>
      {vals.map((v, i) => (
        <span key={i} style={{ textAlign: 'right', color: isTotal ? P2_GOLD : P2_DIM, fontStyle: isTotal ? 'normal' : 'italic', fontSize: isTotal ? 7.5 : 6.5 }}>{v}</span>
      ))}
    </div>
  );
}

function P2Card({ name, subtitle, nestSalary, streams, total }: {
  name: string;
  subtitle: string;
  nestSalary?: string;
  streams: Array<{ label: string; vals: string[] }>;
  total: string[];
}) {
  return (
    <div style={P2_CARD}>
      <div style={{ ...P2_SANS, fontSize: 9, color: P2_GOLD, fontWeight: 500, marginBottom: 1 }}>{name}</div>
      <div style={{ ...P2_SANS, fontSize: 6.5, color: P2_MUTED, marginBottom: nestSalary ? 1 : 4 }}>{subtitle}</div>
      {nestSalary && <div style={{ ...P2_SANS, fontSize: 6, color: P2_GOLD, opacity: 0.7, marginBottom: 4 }}>Nest salary {nestSalary}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, marginBottom: 3 }}>
        {['Stream','2026','2027','2028','2036'].map(h => (
          <span key={h} style={{ ...P2_SANS, fontSize: 7, color: P2_GOLD, textAlign: h === 'Stream' ? 'left' : 'right' as const }}>{h}</span>
        ))}
      </div>
      {streams.map(r => <P2StreamRow key={r.label} label={r.label} vals={r.vals} />)}
      <P2StreamRow label="All streams total" vals={total} isTotal />
    </div>
  );
}

function Page2({ generatedAt, agents: _agents, total: _total }: {
  generatedAt: string;
  agents: AgentRow[];
  total: { proj2026: number; act2026: number; proj2027: number };
}) {
  const page2Style: React.CSSProperties = { ...PAGE_STYLE, minHeight: 'auto', paddingBottom: '0.5in' };
  const page2Footer: React.CSSProperties = { ...PAGE_FOOTER, position: 'relative', bottom: 'auto', left: 'auto', right: 'auto', marginTop: 12 };
  return (
    <div style={page2Style}>
      <PageHeader />

      <div style={{ ...P2_SANS, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: P2_GOLD, marginBottom: 4 }}>Page 2 of 4</div>
      <div style={{ ...P2_SERIF, fontSize: 26, fontWeight: 300, color: '#1B2A4A', lineHeight: 1.1, marginBottom: 2 }}>The Machine</div>
      <div style={{ ...P2_SERIF, fontSize: 11, fontStyle: 'italic', color: P2_MUTED, letterSpacing: '0.04em', marginBottom: 4 }}>Flagship Team · Income Streams · 2026–2036</div>
      <div style={{ ...P2_SANS, fontSize: 7.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a7a5a', marginBottom: 12 }}>GOVERNING PRINCIPLE · NOT YET CONTRACTUAL · PROJECTED = ITALIC · ACTUAL = GOLD BOLD</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <div>
          <P2Card
            name="Ed Bruehl"
            subtitle="Broker – Managing Director"
            streams={[
              { label: "Ed's Team GCI (ref. only)",    vals: ['$600K','$720K','$864K','$3.60M'] },
              { label: 'Personal GCI',                 vals: ['$420K','$504K','$605K','$2.60M'] },
              { label: 'AnewHomes 35% * §',            vals: ['$17.5K','$52.5K','$59K','$151K'] },
              { label: 'CIREG Profit Share 29.75%',    vals: ['$52K','$128K','$287K','$3.39M'] },
              { label: 'CPS1 + CIRE Node ‡ (ref.)',   vals: ['$100K','$250K','$500K','$1.13M'] },
            ]}
            total={['$489.5K','$684.5K','$951K','$6.14M']}
          />
          <P2Card
            name="Ilija Pavlovic"
            subtitle="Franchise Principal · CIREG Tri-State"
            streams={[
              { label: 'CIREG Profit Share 65% **',    vals: ['$114K','$279K','$627K','$7.4M'] },
              { label: 'CPS1 + CIRE Node ‡ (ref.)',   vals: ['$100K','$250K','$500K','$1.13M'] },
            ]}
            total={['$114K','$279K','$627K','$7.4M']}
          />
        </div>
        <div>
          <P2Card
            name="Angel Theodore"
            subtitle="Agent – Marketing Coordinator"
            nestSalary="$70K/yr · through Q1 2027"
            streams={[
              { label: 'Personal GCI',                 vals: ['$17.5K','$84K','$100.8K','$433K+'] },
              { label: 'Nest Salary °',                vals: ['$70K','$17.5K°','—','—'] },
              { label: 'AnewHomes 5% §',               vals: ['$2.5K','$7.5K','$8.4K','$21.6K'] },
              { label: "Ed's Team GCI Override 5%",   vals: ['$30K','$36K','$43K','$186K'] },
              { label: 'CIREG Profit Share 1.75%',     vals: ['$3K','$8K','$17K','$200K'] },
              { label: 'CPS1 + CIRE Node ‡ (ref.)',   vals: ['$100K','$250K','$500K','$1.13M'] },
            ]}
            total={['$123K','$152.5K','$168.2K','$840.6K+']}
          />
          <P2Card
            name="Jarvis Slade"
            subtitle="Agent – COO"
            streams={[
              { label: 'Personal GCI',                 vals: ['$140K','$168K','$201.6K','$868K+'] },
              { label: 'AnewHomes 5% §',               vals: ['$2.5K','$7.5K','$8.4K','$21.6K'] },
              { label: "Ed's Team GCI Override 5%",   vals: ['$30K','$36K','$43K','$186K'] },
              { label: 'CIREG Profit Share 1.75%',     vals: ['$3K','$8K','$17K','$200K'] },
              { label: 'CPS1 + CIRE Node ‡ (ref.)',   vals: ['$100K','$250K','$500K','$1.13M'] },
            ]}
            total={['$175.5K','$219.5K','$270K','$1.28M']}
          />
        </div>
        <div>
          <P2Card
            name="Zoila Ortega Astor †"
            subtitle="Broker/Agent – Office Director"
            nestSalary="$70K/yr · Start May 4 2026"
            streams={[
              { label: 'Personal GCI',                 vals: ['$17.5K','$105K','$126K','$542K+'] },
              { label: 'Nest Salary ° †',              vals: ['$46.7K°','$17.5K°','—','—'] },
              { label: 'AnewHomes 5% † §',             vals: ['$0','$7.5K','$8.4K','$21.6K'] },
              { label: "Ed's Team GCI Override †",    vals: ['$30K','$9K','—','—'] },
              { label: 'CIREG Profit Share 1.75% †',  vals: ['$0','$8K','$17K','$200K'] },
              { label: 'CPS1 + CIRE Node ‡ (ref.)',   vals: ['$100K','$250K','$500K','$1.13M'] },
            ]}
            total={['$94.2K','$112K','$109.4K','$582.6K']}
          />
          <P2Card
            name="Scott Smith *"
            subtitle="Agent – AnewHomes Co. Partner"
            streams={[
              { label: 'Personal GCI',                 vals: ['$35K','$84K','$100.8K','$324K+'] },
              { label: 'AnewHomes 25% §',              vals: ['$12.5K','$37.5K','$42.2K','$108K'] },
            ]}
            total={['$47.5K','$121.5K','$143K','$432K+']}
          />
          <P2Card
            name="Richard Bruehl"
            subtitle="Strategic Advisor – AnewHomes Co. Partner"
            streams={[
              { label: 'AnewHomes 25% §',              vals: ['$12.5K','$37.5K','$42.2K','$108K'] },
            ]}
            total={['$12.5K','$37.5K','$42.2K','$108K']}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8, paddingTop: 6, borderTop: `0.5px solid ${P2_CHARCOAL}` }}>
        <div style={{ ...P2_SANS, fontSize: 6.5, color: P2_DIM, fontStyle: 'italic', lineHeight: 1.6, flex: 1 }}>
          * Governing principle · not yet contractual · Net pool = GCI (vol×2%) minus 5% franchise royalty minus 70% agent splits minus overhead<br />
          CIREG Profit Share: Ed 29.75% / Angel 1.75% / Jarvis 1.75% / Zoila 1.75% (inside Ed's 35%) · Ilija 65%<br />
          AnewHomes Pool 3 (Delaware): Ed 30% (35% effective) · Richard 25% · Scott 25% · Jarvis 5% · Angel 5% · Zoila 5% vesting · Founder-Held 5%<br />
          Flagship ICA (NY · 6 seats): Ed 75% · Angel 5% · Jarvis 5% · Zoila 5% · Founder-Held 5% · Beacon 5%. Independent of AnewHomes — no funnel.<br />
          ** Ilija CIREG 65% is his full take; 5% Christie's royalty is Ilija's cost, not surfaced on cards<br />
          † Zoila: AnewHomes 5% and CIREG Profit Share 1.75% vest over six months from May 4 2026. Cliff November 4 2026. Activates 2027 forward. Ed's Team GCI Override applies 2026 and Q1 2027 only.<br />
          ‡ CPS1 + CIRE Node: Flagship-sourced developer pipeline routed through Flagship ICA. UHNW buyers meet new product in any Christie's market. Ramps $100K (2026) to $1M (2030), then 2% steady-state. Visibility only — not additive to totals. Full doctrine: Christie's East Hampton Canonical Reference Library.<br />
          § AnewHomes Co.: Ed Bruehl's vertically-integrated build platform with Scott Smith as Build Partner (June 1 2026 start), Richard Bruehl as Strategic Advisor, and flagship team carrying equity. Growth trajectory: $50K 2026 (proof-of-concept) · $150K 2027 (Scott fully onboarded) · 12.5% CAGR 2028–2036 (company total $433K by 2036). Conservative base case pending post-June 1 doctrine review with Scott. Full doctrine: Christie's East Hampton Canonical Reference Library.<br />
          ° Nest Salary pro-rated: Angel $70K full 2026 + $17.5K Q1 2027 · Zoila $46.7K from May 4 2026 + $17.5K Q1 2027
        </div>
        <div style={{ ...P2_SERIF, fontSize: 8, color: '#888', fontStyle: 'italic', whiteSpace: 'nowrap', marginLeft: 12 }}>
          The foundation is proven. The model is working.
        </div>
      </div>

      <div style={page2Footer}>
        <span style={FOOTER_SPAN}>Christie's East Hampton · Pro Forma · {generatedAt}</span>
        <span style={FOOTER_SPAN}>Page 2 of 4</span>
      </div>
    </div>
  );
}

// ─── Page 3: The Economics ────────────────────────────────────────────────────
// D65: isPdfMode removed — all backgrounds collapsed to canonical cream page values
function Page3({ generatedAt, liveNetProfitByYear }: {
  generatedAt: string;
  liveNetProfitByYear: Record<string, number>;
}) {
  const pool2026 = profitPool('2026', liveNetProfitByYear['2026']);

  return (
    <div style={PAGE_STYLE}>
      <PageHeader />

      <div style={SECTION_LABEL}>Page 3 of 4</div>
      <div style={PAGE_TITLE}>The Economics</div>
      <div style={PAGE_SUBTITLE}>Profit Pool · Ed's Three Income Streams · AnewHomes Split</div>

      <div style={{ background: 'rgba(200,172,120,0.1)', border: '1px solid rgba(200,172,120,0.4)', borderLeft: '3px solid #947231', padding: '6px 10px', marginBottom: 12, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#947231' }}>
        ★ GCI and Profit Pool · Governing Principle *
      </div>

      <div style={{ ...SECTION_LABEL, marginBottom: 8 }}>Profit Pool · 2026–2036 Projection</div>
      <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', padding: '8px 10px', marginBottom: 10, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8.5, color: '#384249', lineHeight: 1.6 }}>
        Formula: Gross GCI = Office Volume × 2%. Royalty = GCI × 5%. Agent Splits = GCI × 70%.
        Overhead = MAX($200K, GCI × 6%). <strong>Net Operating Profit = GCI − Royalty − Splits − Overhead.</strong>
        Split: <strong>Ed 35%</strong> · <strong>Ilija 65%</strong> · two parties only.
        Paid at year end. Not salary. Not splits. Profit participation. Source: Growth Model OUTPUTS D39/D41.
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, marginBottom: 14 }}>
        <thead>
          <tr style={{ borderBottom: '1.5px solid #947231', background: 'rgba(27,42,74,0.02)' }}>
            {['Year', 'Office Volume', 'Gross GCI (2%)', 'Net Operating Profit', 'Ed (35%)', 'Ilija (65%)'].map(h => (
              <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontSize: 7.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#947231', fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {OUTLOOK_YEARS.map(({ year, vol }, i) => {
            const p = profitPool(year, liveNetProfitByYear[year]);
            return (
              <tr key={year} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)', background: i % 2 === 1 ? 'rgba(27,42,74,0.015)' : 'transparent' }}>
                <td style={{ padding: '5px 8px', color: '#947231', fontWeight: 600, letterSpacing: '0.1em', fontSize: 9 }}>{year}</td>
                <td style={{ padding: '5px 8px', fontSize: 9 }}>{fmtFull(vol)}</td>
                <td style={{ padding: '5px 8px', color: '#947231', fontWeight: 600, fontSize: 9 }}>{fmtFull(Math.round(vol * 0.02))}</td>
                <td style={{ padding: '5px 8px', color: '#947231', fontWeight: 600, fontSize: 9 }}>{p.pool > 0 ? fmtFull(p.pool) : '$0'}</td>
                <td style={{ padding: '5px 8px', fontWeight: 600, fontSize: 9 }}>{p.ed > 0 ? fmtFull(p.ed) : '$0'}</td>
                <td style={{ padding: '5px 8px', fontSize: 9 }}>{p.ilija > 0 ? fmtFull(p.ilija) : '$0'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', padding: '12px 14px' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#947231', marginBottom: 8, borderBottom: '1px solid rgba(200,172,120,0.3)', paddingBottom: 5 }}>Ed Bruehl · Three Income Streams · 2026</div>
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
              <span style={{ color: '#947231', fontWeight: 600 }}>{fmtFull(EQ1_CASCADE['2026'] + pool2026.ed + 17_500)}*</span>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', padding: '12px 14px' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#947231', marginBottom: 8, borderBottom: '1px solid rgba(200,172,120,0.3)', paddingBottom: 5 }}>AnewHomes Pool 3 · Net Build Profit Split § ¶</div>
          {[
            ['Ed Bruehl (30%)', '$15,000 Y1 / $45,000 Y2*'],
            ['Richard Bruehl (25%)', '$12,500 Y1 / $37,500 Y2*'],
            ['Scott Smith (25%)', '$12,500 Y1 / $37,500 Y2*'],
            ['Jarvis Slade (5%)', '$2,500 Y1 / $7,500 Y2*'],
            ['Angel Theodore (5%)', '$2,500 Y1 / $7,500 Y2*'],
            ['Zoila Ortega Astor (5%†)', '$2,500 Y1 / $7,500 Y2*'],
            ['Founder-Held · Unallocated · 5% ¶', '$2,500 Y1 / $7,500 Y2*'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9 }}>
              <span style={{ color: 'rgba(56,66,73,0.7)' }}>{label}</span>
              <span style={{ color: '#1B2A4A', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(27,42,74,0.1)', marginTop: 6, paddingTop: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9 }}>
              <span style={{ fontWeight: 600, color: '#1B2A4A' }}>Total Net Profit</span>
              <span style={{ color: '#947231', fontWeight: 600 }}>$50,000 Y1 / $150,000 Y2*</span>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', padding: '12px 14px' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#947231', marginBottom: 8, borderBottom: '1px solid rgba(200,172,120,0.3)', paddingBottom: 5 }}>Flagship ICA · Sub-Distribution · 6 Seats ‡</div>
          {[
            ['Ed Bruehl (75%) ‡', 'Pending Eq2/ICA reconciliation*'],
            ['Angel Theodore (5%)', 'Pending Eq2/ICA reconciliation*'],
            ['Jarvis Slade (5%)', 'Pending Eq2/ICA reconciliation*'],
            ['Zoila Ortega Astor (5%†)', 'Pending Eq2/ICA reconciliation*'],
            ['Founder-Held · Unallocated · 5% ¶', 'Pending Eq2/ICA reconciliation*'],
            ['Beacon (5%) ‡', 'Pending Eq2/ICA reconciliation*'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8 }}>
              <span style={{ color: 'rgba(56,66,73,0.7)' }}>{label}</span>
              <span style={{ color: '#1B2A4A', fontWeight: 600, fontSize: 7 }}>{value}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(27,42,74,0.1)', marginTop: 6, paddingTop: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8 }}>
              <span style={{ fontWeight: 600, color: '#1B2A4A' }}>Total Seats</span>
              <span style={{ color: '#947231', fontWeight: 600 }}>6 · 100 units</span>
            </div>
          </div>
        </div>
      </div>

      <div style={FOOTNOTE}>
        * Governing principle only — not yet contractual. All figures labeled MODEL.
        Profit pool activates above $40M total sales volume.
        AnewHomes pool growth: Y1 $50K · Y2 $150K · 12.5% annual growth thereafter. Ed 30% base · 35% effective until Founder-Held seat is allocated.
        § D19 Compliance: Ed Bruehl holds 30% base in AnewHomes Pool 3. Effective share is 35% until Founder-Held · Unallocated seat allocates to a named participant. Founder-Held is Class B, non-voting, reserve unit. Ed's income card reflects 35% effective per D19 doctrine.
        ¶ Founder-Held · Unallocated: Class B reserve unit. Not yet assigned. Reverts to pool upon allocation event. Visible on all financial surfaces per D19.
        ‡ Flagship ICA: Ed Bruehl's vertically-integrated capital allocation vehicle. Beacon (5%) is a strategic reserve Class B unit held for institutional partnership. Flagship ICA routes developer pipeline through CPS1 + CIRE Node. Full doctrine: Christie's East Hampton Canonical Reference Library.
        Morton steel-frame custom builds. ADU Garage Living Unit drives Year 1 income. Net profit after ALL build costs. Separate from Christie's commission income entirely.
        All AnewHomes participants aware and agreeable. Not yet formalized.
        † Zoila Ortega Astor: AnewHomes 5% and CIREG Profit Share 1.75% vest over six months from May 4 2026. Cliff November 4 2026. Activates 2027 forward. Ed's Team GCI Override applies 2026 and Q1 2027 only. Reverts to pool if she does not make the cut.
      </div>

      <div style={PAGE_FOOTER}>
        <span style={FOOTER_SPAN}>Christie's East Hampton · Pro Forma · {generatedAt}</span>
        <span style={FOOTER_SPAN}>Page 3 of 4</span>
      </div>
    </div>
  );
}

// ─── Page 4: Defensible Numbers ───────────────────────────────────────────────
// D65: isPdfMode removed — contact card always renders navy (dark canonical)
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
      <PageHeader />

      <div style={SECTION_LABEL}>Page 4 of 4</div>
      <div style={PAGE_TITLE}>Defensible Numbers</div>
      <div style={PAGE_SUBTITLE}>Verified Actuals as of {generatedAt} · Growth Trajectory Labeled MODEL</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        {defCards.map(({ value, label, note }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderTop: '2px solid #947231', padding: '10px 12px' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: '#1B2A4A', lineHeight: 1, marginBottom: 3 }}>{value}</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(56,66,73,0.5)' }}>{label}</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 7, color: 'rgba(56,66,73,0.35)', marginTop: 2 }}>{note}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', padding: '10px 14px', marginBottom: 14 }}>
        <div style={{ ...SECTION_LABEL, marginBottom: 6 }}>Growth Trajectory — MODEL Assumptions</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8.5, color: '#384249', lineHeight: 1.7 }}>
          All figures beyond verified actuals ($4.57M closed, {exclusiveStr} active) are governing-principle projections.
          The $75M 2026 baseline (OUTPUTS B32) assumes 5 named agents at stated volume. Targeted hires and
          organic adds are upside above the baseline. Net Operating Profit formula: GCI − Royalty − Splits − Overhead.
          All outer-year projections (2027–2036) are MODEL and subject to revision as the team grows.
        </div>
      </div>

      {/* Contact card — D65: always navy (dark canonical) */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: '#1B2A4A', padding: '18px 20px', marginTop: 16 }}>
        <img src={ED_HEADSHOT} alt="Ed Bruehl" style={{ width: 70, height: 70, objectFit: 'cover', objectPosition: 'top' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: '#FAF8F4', lineHeight: 1.1, marginBottom: 2 }}>Ed Bruehl</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 10 }}>Managing Director · Christie's East Hampton</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, color: 'rgba(250,248,244,0.7)', lineHeight: 1.7 }}>
            M: 646.752.1233<br />
            edbruehl@christiesrealestategroup.com<br />
            26 Park Place · East Hampton, NY 11937<br />
            Christie's International Real Estate Group · Est. 1766
          </div>
        </div>
      </div>

      <div style={{ ...FOOTNOTE, marginTop: 12 }}>
        All projections are governing-principle models, not guarantees. Verified actuals are noted explicitly.
        No GCI figure appears without the asterisk and "governing principle" label.
        Christie's International Real Estate Group · {generatedAt}
      </div>

      <div style={PAGE_FOOTER}>
        <span style={FOOTER_SPAN}>Christie's East Hampton · Pro Forma · {generatedAt}</span>
        <span style={FOOTER_SPAN}>Page 4 of 4</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
// D65: useIsPdfMode deleted. Wrapped in DashboardLayout — navy hero shell, global nav, canonical SiteFooter.
export default function ProFormaPage() {
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

  const activePipelineStr = kpisData?.relationshipBookM ?? '$14.5M';
  const exclusiveStr = kpisData?.exclusiveTotalM ?? '$6.5M';

  const liveNetProfitByYear: Record<string, number> = {};
  if (arcData?.years) {
    for (const y of arcData.years) {
      liveNetProfitByYear[String(y.year)] = y.netProfit;
    }
  }

  const agents: AgentRow[] = volData?.agents?.length ? volData.agents : [
    { name: 'Ed Bruehl', role: 'Managing Director', status: 'Active', proj2026: 20_000_000, act2026: 4_570_000, proj2027: 30_000_000 },
    { name: 'Jarvis Slade', role: 'COO & Agent', status: 'Active', proj2026: 8_000_000, act2026: 0, proj2027: 15_000_000 },
    { name: 'Angel Theodore', role: 'Operations', status: 'Active', proj2026: 0, act2026: 0, proj2027: 0 },
    { name: 'Zoila Ortega Astor', role: 'Office Director', status: 'Joining May 4', proj2026: 5_000_000, act2026: 0, proj2027: 10_000_000 },
    { name: 'Scott Smith', role: 'Agent', status: 'Joining Jun 1', proj2026: 5_000_000, act2026: 0, proj2027: 12_000_000 },
    { name: 'Richard Bruehl', role: 'Strategic Mentor', status: 'Active', proj2026: 0, act2026: 0, proj2027: 0 },
  ];

  const total = volData?.total ?? {
    proj2026: 75_000_000,
    act2026: 4_570_000,
    proj2027: 125_906_749,
  };

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
      <DashboardLayout activeTab="future" onTabChange={() => {}}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,248,244,0.4)' }}>
          Loading Pro Forma · Christie's East Hampton
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="future" onTabChange={() => {}}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Barlow+Condensed:wght@300;400;500;600&display=swap');
        @page { size: 8.5in 11in; margin: 0; }
        @media print {
          .pro-forma-page { break-after: page; page-break-after: always; }
          .pro-forma-page:last-child { break-after: avoid; page-break-after: avoid; }
          .no-print { display: none !important; }
          .pro-forma-wrapper { padding: 0 !important; }
        }
      `}</style>

      {/* Print button — D65: direct window.print(), no ?pdf=1 redirect */}
      <div className="no-print" style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, display: 'flex', gap: 8 }}>
        <button
          onClick={() => window.print()}
          style={{ background: '#1B2A4A', color: '#947231', border: 'none', padding: '8px 16px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          ↓ Print PDF
        </button>
      </div>

      <div className="pro-forma-wrapper" style={{ background: '#e8e6e0', padding: '24px 0', minHeight: '100vh' }}>
        <div className="pro-forma-page"><Page1 generatedAt={generatedAt} activePipelineStr={activePipelineStr} exclusiveStr={exclusiveStr} liveNetProfitByYear={liveNetProfitByYear} /></div>
        <div className="pro-forma-page"><Page2 generatedAt={generatedAt} agents={agents} total={total} /></div>
        <div className="pro-forma-page"><Page3 generatedAt={generatedAt} liveNetProfitByYear={liveNetProfitByYear} /></div>
        <div className="pro-forma-page"><Page4 generatedAt={generatedAt} activePipelineStr={activePipelineStr} exclusiveStr={exclusiveStr} /></div>
      </div>
    </DashboardLayout>
  );
}
