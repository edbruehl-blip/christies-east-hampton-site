/*
 * FUTURE TAB — v14 FINAL · April 21 2026
 * Dispatch: Ed Bruehl · Managing Director · Christie's East Hampton
 * Two pages, two substrates, one design.
 * Page 1: Ascension Arc (Chart.js 4.4.1 five-band)
 * Page 2: Partnership Projections (v14 partner cards + 3-lever Assumptions)
 */

import React, { useMemo, useRef, useEffect } from 'react';
import { LOGO_WHITE, LOGO_BLACK } from '@/lib/cdn-assets';
import { trpc } from '@/lib/trpc';
import '@/styles/future-print.css';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// ─── Design tokens ────────────────────────────────────────────────────────────
const NAVY        = '#0f1820';
const GOLD        = '#c8ac78';
const GOLD_FAINT_BORDER = 'rgba(200,172,120,0.40)';
const CHARCOAL    = '#384249';
const DIM         = '#c8c8c8';
const MUTED       = '#a0a8b0';

// Council-locked five-band colors (v14 FINAL · April 21 2026)
const C_EH   = '#9e1b32';  // Christie's red — East Hampton Flagship
const C_SH   = '#1a3a5c';  // Deep ink navy — Southampton Flagship · 2028
const C_WH   = '#947231';  // Burnished gold — Westhampton Flagship · 2030 (NOT Hermès orange)
const C_ANEW = '#c8946b';  // Warm tan — AnewHomes Co.
const C_CPS1 = '#6b2838';  // Deep burgundy — CPS1 · CIRE · CIREG Node

const SANS:  React.CSSProperties = { fontFamily: 'sans-serif' };
const SERIF: React.CSSProperties = { fontFamily: 'Georgia, serif' };

// ─── Canonical arc data (Growth Model V2 OUTPUTS tab) ─────────────────────────
const ARC_YEARS  = ['2025','2026','2027','2028','2029','2030','2031','2032','2033','2034','2035','2036'];
const EH_TOTAL   = [20, 75, 125.9, 211.7, 295.5, 410.7, 566.6, 597.6, 676.3, 784.9, 932.6, 1133.3];
const SH_M       = [0, 0, 0, 42.1, 161.4, 285.2, 422.1, 507.4, 607.3, 698.4, 821.6, 987.8];
const WH_M       = [0, 0, 0, 0, 0, 56.7, 230.5, 352.3, 452.4, 592.9, 737.8, 878.9];
const ANEW_M     = [0, 15, 30, 45, 55, 65, 75, 80, 85, 90, 95, 100];
const CPS1_M     = [0, 20, 50, 70, 85, 95, 100, 102, 104, 106, 108, 110];
// EH core = EH total minus (AnewHomes + CPS1), clamped to 0
const EH_CORE    = EH_TOTAL.map((v, i) => Math.max(0, v - ANEW_M[i] - CPS1_M[i]));
const COMBINED   = ARC_YEARS.map((_, i) => EH_TOTAL[i] + SH_M[i] + WH_M[i]);

function fmtCombined(v: number): string {
  if (v >= 1000) return '$' + (v / 1000).toFixed(2).replace(/\.?0+$/, '') + 'B';
  if (v >= 100) return '$' + Math.round(v) + 'M';
  return '$' + v.toFixed(1) + 'M';
}
const COMBINED_LABELS = COMBINED.map(fmtCombined);

// ─── Chart.js Arc Component ───────────────────────────────────────────────────
interface ArcChartProps {
  isPdfMode: boolean;
}

function AscensionArcChart({ isPdfMode }: ArcChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart | null>(null);

  const bgColor    = isPdfMode ? '#faf7f1' : NAVY;
  const textColor  = isPdfMode ? '#3a3a3a' : '#ebe6db';
  const gridColor  = isPdfMode ? 'rgba(148,114,49,0.15)' : 'rgba(148,114,49,0.08)';
  const axisColor  = isPdfMode ? 'rgba(148,114,49,0.5)' : 'rgba(148,114,49,0.35)';
  const labelColor = isPdfMode ? '#3a3a3a' : '#ebe6db';

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) { chartRef.current.destroy(); }

    const totalPlugin = {
      id: 'arcTotals',
      afterDatasetsDraw(chart: Chart) {
        const { ctx, scales: { x, y } } = chart as any;
        ctx.save();
        ctx.fillStyle = labelColor;
        ctx.font = 'bold 11px Georgia, serif';
        ctx.textAlign = 'center';
        COMBINED.forEach((t, i) => {
          ctx.fillText(COMBINED_LABELS[i], x.getPixelForValue(i), y.getPixelForValue(t) - 8);
        });
        ctx.restore();
      },
    };

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: ARC_YEARS,
        datasets: [
          { data: EH_CORE, backgroundColor: C_EH,   borderColor: '#000', borderWidth: 2, stack: 'o', barPercentage: 0.85, categoryPercentage: 0.92 },
          { data: ANEW_M,  backgroundColor: C_ANEW, borderColor: '#000', borderWidth: 2, stack: 'o', barPercentage: 0.85, categoryPercentage: 0.92 },
          { data: CPS1_M,  backgroundColor: C_CPS1, borderColor: '#000', borderWidth: 2, stack: 'o', barPercentage: 0.85, categoryPercentage: 0.92 },
          { data: SH_M,    backgroundColor: C_SH,   borderColor: '#000', borderWidth: 2, stack: 'o', barPercentage: 0.85, categoryPercentage: 0.92 },
          { data: WH_M,    backgroundColor: C_WH,   borderColor: '#000', borderWidth: 2, stack: 'o', barPercentage: 0.85, categoryPercentage: 0.92 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const v = ctx.raw as number;
                if (!v) return '';
                const labels = ['EH Core','AnewHomes','CPS1','Southampton','Westhampton'];
                const lbl = labels[ctx.datasetIndex] ?? '';
                return `${lbl}: ${v >= 1000 ? '$' + (v/1000).toFixed(2) + 'B' : '$' + v.toFixed(1) + 'M'}`;
              },
            },
          },
        },
        scales: {
          y: {
            stacked: true,
            beginAtZero: true,
            max: 3500,
            ticks: {
              color: textColor,
              font: { size: 12, family: 'Georgia, serif', weight: 'bold' },
              padding: -38,
              mirror: true,
              z: 10,
              callback: (v) => {
                const n = v as number;
                return n >= 1000 ? '$' + (n / 1000).toFixed(1) + 'B' : '$' + n + 'M';
              },
            },
            grid: { color: gridColor },
            border: { color: axisColor },
          },
          x: {
            stacked: true,
            ticks: {
              color: textColor,
              font: { size: 13, family: 'Georgia, serif', weight: 'bold' },
              padding: 8,
            },
            grid: { display: false },
            border: { color: axisColor },
          },
        },
      },
      plugins: [totalPlugin as any],
    });

    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, [isPdfMode]);

  const legendRow1 = [
    { color: C_EH,   label: 'East Hampton Flagship' },
    { color: C_SH,   label: 'Southampton Flagship · 2028' },
    { color: C_WH,   label: 'Westhampton Flagship · 2030' },
  ];
  const legendRow2 = [
    { color: C_ANEW, label: 'AnewHomes Co.' },
    { color: C_CPS1, label: 'CPS1 · CIRE · CIREG Node' },
  ];
  const lgTextColor = isPdfMode ? '#3a3a3a' : '#ddd';

  return (
    <div style={{ background: bgColor, borderRadius: 4, padding: '14px 18px', marginBottom: 16 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <div style={{ ...SERIF, fontSize: 20, letterSpacing: 5, color: isPdfMode ? '#111' : '#ebe6db', textTransform: 'uppercase', fontWeight: 400 }}>
          Christie&rsquo;s East Hampton Flagship
        </div>
        <div style={{ ...SERIF, fontSize: 13, letterSpacing: 2, color: isPdfMode ? '#5a5a5a' : '#ebe6db', fontStyle: 'italic', marginTop: 3, opacity: 0.75 }}>
          Ascension Arc &middot; 2026 through 2036 and beyond
        </div>
      </div>

      {/* Canvas */}
      <div style={{ position: 'relative', width: '100%', height: 440, marginTop: 4 }}>
        <canvas ref={canvasRef} role="img" aria-label="Five-band Ascension Arc chart 2025–2036" />
      </div>

      {/* Legend row 1 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 20, flexWrap: 'wrap', ...SERIF, fontSize: 11, color: lgTextColor }}>
        {legendRow1.map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 16, height: 5, background: color, border: '0.5px solid rgba(0,0,0,0.2)', flexShrink: 0 }} />
            {label}
          </span>
        ))}
      </div>
      {/* Legend row 2 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 12, flexWrap: 'wrap', ...SERIF, fontSize: 11, color: lgTextColor }}>
        {legendRow2.map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 16, height: 5, background: color, border: '0.5px solid rgba(0,0,0,0.2)', flexShrink: 0 }} />
            {label}
          </span>
        ))}
      </div>

      {/* Brand footer */}
      <div style={{ marginTop: 36, textAlign: 'center' }}>
        <div style={{ ...SERIF, fontSize: 14, color: isPdfMode ? '#111' : '#ebe6db', letterSpacing: 6, opacity: 0.9 }}>
          CHRISTIE&rsquo;S INTERNATIONAL REAL ESTATE
        </div>
        <div style={{ ...SERIF, fontSize: 12, color: isPdfMode ? '#5a5a5a' : '#ebe6db', letterSpacing: 4, marginTop: 10, fontStyle: 'italic', opacity: 0.7 }}>
          Art &middot; Beauty &middot; Provenance
        </div>
        <div style={{ ...SERIF, fontSize: 14, color: C_WH, letterSpacing: 8, marginTop: 14, fontWeight: 600 }}>
          SINCE 1766
        </div>
      </div>
    </div>
  );
}

// ─── Three-Lever Assumptions & Calc ──────────────────────────────────────────
function AssumptionsCalc({ isPdfMode }: { isPdfMode: boolean }) {
  const [ppl, setPpl]     = React.useState(12);
  const [comm, setComm]   = React.useState(2.00);
  const [start, setStart] = React.useState(500);

  const factor = (ppl / 12) * (comm / 2.00) * (start / 500);
  function fmtOut(v: number): string {
    return v >= 1000 ? '$' + (v / 1000).toFixed(2) + 'B' : '$' + Math.round(v) + 'M';
  }

  const bgCard   = isPdfMode ? '#faf7f1' : '#141d28';
  const bgHeader = isPdfMode ? '#efe6d1' : '#1c2638';
  const borderC  = isPdfMode ? '#000' : 'rgba(148,114,49,0.4)';
  const hdrBorderB = isPdfMode ? '#947231' : 'rgba(148,114,49,0.5)';
  const titleColor = isPdfMode ? '#1a3a5c' : '#ebe6db';
  const subtitleColor = isPdfMode ? '#5a5041' : '#9a9a8a';
  const labelColor = isPdfMode ? '#947231' : '#c8ac78';
  const valueColor = isPdfMode ? '#111' : '#ebe6db';
  const outBg    = '#1a3a5c';
  const outLabel = '#c9bf9f';
  const outValue = '#ebe6db';
  const notesHdr = isPdfMode ? '#1a3a5c' : '#c8ac78';
  const notesText = isPdfMode ? '#2a2a2a' : '#c0bba8';
  const notesBorder = isPdfMode ? 'rgba(148,114,49,0.3)' : 'rgba(148,114,49,0.25)';
  const rngBg    = isPdfMode ? 'rgba(148,114,49,0.25)' : 'rgba(148,114,49,0.3)';
  const thumbBg  = isPdfMode ? '#947231' : '#c8ac78';
  const inputBorderB = isPdfMode ? 'rgba(148,114,49,0.4)' : 'rgba(148,114,49,0.3)';

  const sliderStyle: React.CSSProperties = {
    WebkitAppearance: 'none',
    appearance: 'none',
    width: '100%',
    height: 2,
    background: rngBg,
    outline: 'none',
    cursor: 'pointer',
    marginTop: 4,
    borderRadius: 1,
  };

  return (
    <div style={{ border: `${isPdfMode ? '2px' : '1px'} solid ${borderC}`, background: bgCard, marginBottom: 16 }}>
      <div style={{ background: bgHeader, padding: '9px 12px 8px', borderBottom: `1px solid ${hdrBorderB}` }}>
        <div style={{ ...SERIF, letterSpacing: 5, fontSize: 15, textTransform: 'uppercase', fontWeight: 500, textAlign: 'center', color: titleColor }}>
          Assumptions &amp; Calc
        </div>
        <div style={{ ...SERIF, fontSize: 9, color: subtitleColor, fontStyle: 'italic', textAlign: 'center', marginTop: 3, letterSpacing: 1 }}>
          Three live levers &middot; Output summary
        </div>
      </div>

      {/* Three levers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14, padding: '14px 14px 10px' }}>
        {/* Lever 1: Top Producers / Office */}
        <div style={{ padding: '6px 10px 8px', display: 'flex', flexDirection: 'column', gap: 5, borderBottom: `1px solid ${inputBorderB}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <div style={{ ...SANS, fontSize: 7.5, letterSpacing: 1, color: labelColor, textTransform: 'uppercase', lineHeight: 1.25 }}>Top Producers / Office</div>
            <div style={{ ...SERIF, fontSize: 14, color: valueColor, fontWeight: 500, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>{ppl} PPL</div>
          </div>
          {!isPdfMode && (
            <input type="range" min={4} max={24} step={1} value={ppl}
              onChange={e => setPpl(+e.target.value)}
              style={sliderStyle}
            />
          )}
        </div>
        {/* Lever 2: Projected GCI Commission */}
        <div style={{ padding: '6px 10px 8px', display: 'flex', flexDirection: 'column', gap: 5, borderBottom: `1px solid ${inputBorderB}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <div style={{ ...SANS, fontSize: 7.5, letterSpacing: 1, color: labelColor, textTransform: 'uppercase', lineHeight: 1.25 }}>Projected GCI Commission</div>
            <div style={{ ...SERIF, fontSize: 14, color: valueColor, fontWeight: 500, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>{comm.toFixed(2)}%</div>
          </div>
          {!isPdfMode && (
            <input type="range" min={1} max={5} step={0.05} value={comm}
              onChange={e => setComm(+e.target.value)}
              style={sliderStyle}
            />
          )}
        </div>
        {/* Lever 3: Pros Starting Production */}
        <div style={{ padding: '6px 10px 8px', display: 'flex', flexDirection: 'column', gap: 5, borderBottom: `1px solid ${inputBorderB}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <div style={{ ...SANS, fontSize: 7.5, letterSpacing: 1, color: labelColor, textTransform: 'uppercase', lineHeight: 1.25 }}>Pros Starting Production</div>
            <div style={{ ...SERIF, fontSize: 14, color: valueColor, fontWeight: 500, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>${start}K</div>
          </div>
          {!isPdfMode && (
            <input type="range" min={200} max={2000} step={50} value={start}
              onChange={e => setStart(+e.target.value)}
              style={sliderStyle}
            />
          )}
        </div>
      </div>

      {/* Three output cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, padding: '6px 10px 10px' }}>
        {[
          { label: 'Flagship 3-Yr Cumulative', val: fmtOut(413 * factor) },
          { label: '2029 Flagship Cumulative',  val: fmtOut(708 * factor) },
          { label: '2036 Combined Volume',       val: fmtOut(3000 * factor) },
        ].map(({ label, val }) => (
          <div key={label} style={{ background: outBg, padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, border: isPdfMode ? 'none' : '1px solid rgba(148,114,49,0.3)' }}>
            <div style={{ ...SANS, fontSize: 7, letterSpacing: 1, color: outLabel, textTransform: 'uppercase', lineHeight: 1.2 }}>{label}</div>
            <div style={{ ...SERIF, fontSize: 13, color: outValue, fontWeight: 500, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Three footnote columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, padding: 11, borderTop: `1px solid ${notesBorder}` }}>
        <div>
          <div style={{ ...SANS, fontSize: 8.5, letterSpacing: 1.2, textTransform: 'uppercase', color: notesHdr, fontWeight: 500, marginBottom: 3 }}>* Governing Principle</div>
          <div style={{ ...SANS, fontSize: 8, color: notesText, lineHeight: 1.4 }}>Not yet contractual. Profit pool = GCI less 5% royalty, 70% agent splits, and overhead. Flagship team takes 35% (Ed 29.75%, Angel 1.75%, Jarvis 1.75%, Zoila 1.75%). Franchise takes 65%. 20% year-over-year, uncapped.</div>
        </div>
        <div>
          <div style={{ ...SANS, fontSize: 8.5, letterSpacing: 1.2, textTransform: 'uppercase', color: notesHdr, fontWeight: 500, marginBottom: 3 }}>&dagger; Zoila Vesting</div>
          <div style={{ ...SANS, fontSize: 8, color: notesText, lineHeight: 1.4 }}>AnewHomes 5% and Profit Share 1.75% vest over six months from May 4 2026. Cliff November 4 2026. Activates 2027 forward. ICA Override applies 2026 and Q1 2027 only.</div>
        </div>
        <div>
          <div style={{ ...SANS, fontSize: 8.5, letterSpacing: 1.2, textTransform: 'uppercase', color: notesHdr, fontWeight: 500, marginBottom: 3 }}>&Dagger; CPS-1 Pipeline</div>
          <div style={{ ...SANS, fontSize: 8, color: notesText, lineHeight: 1.4 }}>Flagship-sourced developer pipeline routed through Flagship ICA. UHNW buyers meet new product in any Christie&rsquo;s market. $100K 2026 ramping to $1.5M cap by 2029&ndash;2030. Visibility only &mdash; not additive to totals.</div>
        </div>
      </div>
    </div>
  );
}

// ─── Partner Card Components (v14 wireframe) ──────────────────────────────────
interface StreamRow {
  label: React.ReactNode;
  v26: string;
  v27: string;
  v28: string;
  v36: string;
  color: string;
}
interface CardProps {
  name: React.ReactNode;
  subtitle: string;
  nestNote?: string;
  streams: StreamRow[];
  totLabel: string;
  tot: [string, string, string, string];
  isPdfMode: boolean;
  shortYears?: boolean;
}

function PartnerCard({ name, subtitle, nestNote, streams, totLabel, tot, isPdfMode, shortYears }: CardProps) {
  const bgCard   = isPdfMode ? '#faf7f1' : '#141d28';
  const bgHeader = isPdfMode ? '#efe6d1' : '#1c2638';
  const borderC  = isPdfMode ? '2px solid #000' : '1px solid rgba(148,114,49,0.4)';
  const hdrBorderB = isPdfMode ? '#947231' : 'rgba(148,114,49,0.5)';
  const nameColor = isPdfMode ? '#111' : '#ebe6db';
  const subColor  = isPdfMode ? '#5a5041' : '#9a9a8a';
  const nestColor = isPdfMode ? '#7a6b4a' : '#c8ac78';
  const hdrColor  = isPdfMode ? '#947231' : '#c8ac78';
  const lblColor  = isPdfMode ? '#3a3a3a' : '#d8d6c8';
  const valColor  = isPdfMode ? '#3a3a3a' : '#9aa5b0';
  const totValColor = isPdfMode ? '#947231' : '#c8ac78';
  const totBorder = isPdfMode ? '#000' : 'rgba(148,114,49,0.5)';
  const totTextColor = isPdfMode ? '#111' : '#ebe6db';

  const yrs = shortYears ? ['26','27','28','2036'] : ['2026','2027','2028','2036'];

  return (
    <div style={{ border: borderC, background: bgCard, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', marginBottom: 7 }}>
      <div style={{ background: bgHeader, padding: '5px 8px 4px', borderBottom: `1px solid ${hdrBorderB}` }}>
        <div style={{ ...SANS, letterSpacing: 1.8, fontSize: 10.5, textTransform: 'uppercase', fontWeight: 500, lineHeight: 1.15, color: nameColor }}>{name}</div>
        <div style={{ ...SERIF, fontSize: 8.5, color: subColor, fontStyle: 'italic', marginTop: 1, lineHeight: 1.25 }}>{subtitle}</div>
        {nestNote && <div style={{ ...SERIF, fontSize: 7.5, color: nestColor, fontStyle: 'italic', marginTop: 2, lineHeight: 1.25, opacity: 0.85 }}>{nestNote}</div>}
      </div>
      <div style={{ padding: '6px 7px 7px' }}>
        {/* Column headers */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, padding: '1.5px 0 1.5px 4px', lineHeight: 1.2, marginBottom: 2 }}>
          <div style={{ flex: 1, minWidth: 0, ...SANS, fontSize: 6.5, letterSpacing: 0.5, textTransform: 'uppercase', color: hdrColor, fontWeight: 500, whiteSpace: 'nowrap' }}>Stream</div>
          {yrs.map(y => <div key={y} style={{ width: y === '2036' ? 36 : 30, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0, ...SANS, fontSize: 6.5, letterSpacing: 0.5, textTransform: 'uppercase', color: hdrColor, fontWeight: 500 }}>{y}</div>)}
        </div>
        {/* Stream rows */}
        {streams.map((row, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'baseline', gap: 2, padding: '1.5px 0 1.5px 4px', lineHeight: 1.2, borderLeft: `2px solid ${row.color}`, marginTop: 0.5 }}>
            <div style={{ flex: 1, minWidth: 0, wordBreak: 'keep-all', overflowWrap: 'normal', hyphens: 'none', ...SANS, fontSize: 9, color: lblColor }}>{row.label}</div>
            {[row.v26, row.v27, row.v28, row.v36].map((v, i) => (
              <div key={i} style={{ width: i === 3 ? 36 : 30, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0, ...SERIF, fontSize: 9, color: valColor, fontStyle: 'italic' }}>{v}</div>
            ))}
          </div>
        ))}
        {/* Total row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, padding: '4px 0 1px 4px', marginTop: 3, borderTop: `1px solid ${totBorder}`, ...SANS, fontSize: 9.5, fontWeight: 500, color: totTextColor }}>
          <div style={{ flex: 1, minWidth: 0, wordBreak: 'keep-all' }}>{totLabel}</div>
          {tot.map((v, i) => (
            <div key={i} style={{ width: i === 3 ? 36 : 30, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0, ...SERIF, color: totValColor, fontStyle: 'normal', fontWeight: 500 }}>{v}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Legend Block (shared between page 1 and page 2) ─────────────────────────
function LegendBlock({ isPdfMode }: { isPdfMode: boolean }) {
  const textColor = isPdfMode ? '#111' : '#ebe6db';
  const borderColor = isPdfMode ? 'rgba(148,114,49,0.3)' : 'rgba(148,114,49,0.3)';
  const row1 = [
    { color: C_EH,   label: 'East Hampton Flagship' },
    { color: C_SH,   label: 'Southampton Flagship · 2028' },
    { color: C_WH,   label: 'Westhampton Flagship · 2030' },
  ];
  const row2 = [
    { color: C_ANEW, label: 'AnewHomes Co.' },
    { color: C_CPS1, label: 'CPS1 · CIRE · CIREG Node' },
  ];
  return (
    <div style={{ padding: '13px 0', marginBottom: 13, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 22, flexWrap: 'wrap', ...SERIF, fontSize: 10, color: textColor, letterSpacing: 0.3 }}>
        {row1.map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 16, height: 5, background: color, flexShrink: 0, border: '0.5px solid rgba(0,0,0,0.2)' }} />
            {label}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 22, flexWrap: 'wrap', marginTop: 8, ...SERIF, fontSize: 10, color: textColor, letterSpacing: 0.3 }}>
        {row2.map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 16, height: 5, background: color, flexShrink: 0, border: '0.5px solid rgba(0,0,0,0.2)' }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Brand Footer ─────────────────────────────────────────────────────────────
function BrandFooter({ isPdfMode, pageNum }: { isPdfMode: boolean; pageNum?: string }) {
  const borderColor = isPdfMode ? '#947231' : 'rgba(148,114,49,0.4)';
  const textColor   = isPdfMode ? '#111' : '#ebe6db';
  const mutedColor  = isPdfMode ? '#5a5a5a' : '#9a9a8a';
  return (
    <div style={{ textAlign: 'center', paddingTop: 14, borderTop: `1px solid ${borderColor}`, position: 'relative', marginTop: 16 }}>
      <div style={{ ...SERIF, fontSize: 12, letterSpacing: 5, color: textColor }}>{`CHRISTIE'S INTERNATIONAL REAL ESTATE`}</div>
      <div style={{ ...SERIF, fontSize: 9.5, letterSpacing: 2.5, fontStyle: 'italic', color: mutedColor, marginTop: 4 }}>Art &middot; Beauty &middot; Provenance</div>
      <div style={{ ...SERIF, fontSize: 11, letterSpacing: 7, color: C_WH, marginTop: 6, fontWeight: 600 }}>SINCE 1766</div>
      {pageNum && <div style={{ position: 'absolute', right: 0, bottom: 0, ...SERIF, fontSize: 7.5, letterSpacing: 1.5, color: mutedColor }}>{pageNum}</div>}
    </div>
  );
}

// ─── PDF mode detection ───────────────────────────────────────────────────────
function useIsPdfMode(): boolean {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search).get('pdf') === '1';
  }
  return false;
}

// ─── Print Future Button ──────────────────────────────────────────────────────
function PrintFutureButton() {
  const [loading, setLoading] = React.useState(false);
  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pdf?url=/future');
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Christies_EH_Partnership_Projections.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('[PDF]', e);
      window.print();
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="no-print future-intro-button"
      data-print-hide="true"
      style={{ ...SANS, background: 'transparent', border: `0.5px solid ${GOLD}`, color: loading ? 'rgba(200,172,120,0.5)' : GOLD, padding: '5px 14px', fontSize: 7, letterSpacing: '1px', textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer' }}
    >
      {loading ? 'Generating\u2026' : '\u2193 Download \u00b7 PDF'}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FutureTab() {
  const isPdfMode = useIsPdfMode();

  const BG = isPdfMode ? '#faf7f1' : NAVY;
  const TEXT_PRIMARY = isPdfMode ? '#111' : '#ebe6db';

  // tRPC wires (live data from Growth Model V2)
  const { data: arcData, isLoading: arcLoading } = trpc.future.ascensionArc.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });
  const { data: poolData } = trpc.future.profitPool.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });
  const { data: volData, isLoading: volLoading } = trpc.future.volumeData.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });
  const { data: kpisData } = trpc.pipe.getKpis.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });
  const { data: gmData } = trpc.future.growthModel.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });

  const agents = volData?.agents ?? [];
  const total = volData?.total ?? {
    proj2026: 0, act2026: 0, projGci2026: 0, actGci2026: 0,
    proj2027: 0, act2027: 0, projGci2027: 0, actGci2027: 0,
    proj2028: 0, act2028: 0, projGci2028: 0, actGci2028: 0,
    proj2029: 0, act2029: 0, projGci2029: 0, actGci2029: 0,
    proj2030: 0, act2030: 0, projGci2030: 0, actGci2030: 0,
    proj2031: 0, act2031: 0, projGci2031: 0, actGci2031: 0,
    proj2032: 0, act2032: 0, projGci2032: 0, actGci2032: 0,
    proj2033: 0, act2033: 0, projGci2033: 0, actGci2033: 0,
    proj2034: 0, act2034: 0, projGci2034: 0, actGci2034: 0,
    proj2035: 0, act2035: 0, projGci2035: 0, actGci2035: 0,
    proj2036: 0, act2036: 0, projGci2036: 0, actGci2036: 0,
  };

  const livePoolRows = useMemo(() => {
    if (!poolData?.length) return null;
    return poolData.map(y => ({
      year: String(y.year),
      vol: y.officeVolume,
      netProfit: y.netProfit,
      edPool: y.edPool,
      ilijaPool: y.ilijaPool,
    }));
  }, [poolData]);

  function fmtM(n: number): string {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 20_000_000) return `$${Math.round(n / 1_000_000)}M`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
    return `$${n.toLocaleString()}`;
  }

  const GOLD_FAINT_BG     = 'rgba(200,172,120,0.13)';
  const MAX_VOLUME = 3_000_000_000;
  function barPct(vol: number): number {
    return Math.max(2, Math.min(92, Math.round(Math.sqrt(vol / MAX_VOLUME) * 92)));
  }

  // ─── Partner card data ────────────────────────────────────────────────────
  const ilijaPool2026 = livePoolRows?.find(r => r.year === '2026')?.ilijaPool;
  const ilijaPool2027 = livePoolRows?.find(r => r.year === '2027')?.ilijaPool;
  const ilijaPool2028 = livePoolRows?.find(r => r.year === '2028')?.ilijaPool;
  const ilijaPool2036 = livePoolRows?.find(r => r.year === '2036')?.ilijaPool;

  const edStreams: StreamRow[] = [
    { label: 'Gross GCI (office)',       v26: '$600K',  v27: '$720K',  v28: '$864K',  v36: '$3.72M', color: C_EH },
    { label: 'Net Personal Production',  v26: '$420K',  v27: '$504K',  v28: '$605K',  v36: '$2.60M', color: C_EH },
    { label: 'Profit Share 29.75%',      v26: '$52K',   v27: '$128K',  v28: '$287K',  v36: '$3.39M', color: C_CPS1 },
    { label: <>AnewHomes 35%</>,         v26: '$17.5K', v27: '$52.5K', v28: '$59K',   v36: '$151K',  color: C_ANEW },
    { label: <>CPS-1 visibility&nbsp;&zwj;&#8203;&#8203;&#8203;</>, v26: '$100K', v27: '$250K', v28: '$500K', v36: '$1.69M', color: C_CPS1 },
  ];

  const ilijaStreams: StreamRow[] = [
    { label: <>Profit Share 65%&nbsp;*</>,                    v26: ilijaPool2026 ? fmtM(ilijaPool2026) : '$114K', v27: ilijaPool2027 ? fmtM(ilijaPool2027) : '$279K', v28: ilijaPool2028 ? fmtM(ilijaPool2028) : '$627K', v36: ilijaPool2036 ? fmtM(ilijaPool2036) : '$7.4M', color: C_SH },
    { label: 'Franchise Royalty 25% Ed Gross (incl.)',         v26: '$150K',  v27: '$180K',  v28: '$216K',  v36: '$929K',  color: C_SH },
    { label: <>CPS-1 visibility&nbsp;&zwj;&#8203;&#8203;&#8203;</>, v26: '$100K', v27: '$250K', v28: '$500K', v36: '$1.69M', color: C_CPS1 },
  ];

  const angelStreams: StreamRow[] = [
    { label: 'Production Ramp',          v26: '$25K',   v27: '$120K',  v28: '$144K',  v36: '$619K+', color: C_EH },
    { label: <>AnewHomes 5%&nbsp;*</>,   v26: '$2.5K',  v27: '$7.5K',  v28: '$8.4K',  v36: '$21.6K', color: C_ANEW },
    { label: 'ICA Override',             v26: '$30K',   v27: '$36K',   v28: '$43K',   v36: '$186K',  color: '#9a9a9a' },
    { label: 'Profit Share 1.75%',       v26: '$3K',    v27: '$8K',    v28: '$17K',   v36: '$200K',  color: C_CPS1 },
    { label: <>CPS-1 (incl.)&nbsp;&zwj;&#8203;&#8203;&#8203;</>, v26: '$100K', v27: '$250K', v28: '$500K', v36: '$1.69M', color: C_CPS1 },
  ];

  const jarvisStreams: StreamRow[] = [
    { label: 'Sales Volume',             v26: '$10M',   v27: '$12M',   v28: '$14M',   v36: '$62M+',  color: C_EH },
    { label: 'Projected GCI',            v26: '$200K',  v27: '$240K',  v28: '$288K',  v36: '$1.24M+',color: C_EH },
    { label: <>AnewHomes 5%</>,          v26: '$2.5K',  v27: '$7.5K',  v28: '$8.4K',  v36: '$21.6K', color: C_ANEW },
    { label: 'ICA Override',             v26: '$30K',   v27: '$36K',   v28: '$43K',   v36: '$186K',  color: '#9a9a9a' },
    { label: 'Profit Share 1.75%',       v26: '$3K',    v27: '$8K',    v28: '$17K',   v36: '$200K',  color: C_CPS1 },
    { label: <>CPS-1 (incl.)&nbsp;&zwj;&#8203;&#8203;&#8203;</>, v26: '$100K', v27: '$250K', v28: '$500K', v36: '$1.69M', color: C_CPS1 },
  ];

  const zoilaStreams: StreamRow[] = [
    { label: 'Production Ramp',                v26: '$25K',  v27: '$150K', v28: '$180K', v36: '$774K+', color: C_EH },
    { label: <>AnewHomes 5%&nbsp;&dagger;</>,   v26: '$0',    v27: '$7.5K', v28: '$8.4K', v36: '$21.6K', color: C_ANEW },
    { label: <>ICA Override&nbsp;&dagger;</>,   v26: '$30K',  v27: '$9K',   v28: '\u2014', v36: '\u2014', color: '#9a9a9a' },
    { label: <>Profit Share 1.75%&nbsp;&dagger;</>, v26: '$0', v27: '$8K',  v28: '$17K',  v36: '$200K',  color: C_CPS1 },
    { label: <>CPS-1 (incl.)&nbsp;&zwj;&#8203;&#8203;&#8203;</>, v26: '$100K', v27: '$250K', v28: '$500K', v36: '$1.69M', color: C_CPS1 },
  ];

  const scottStreams: StreamRow[] = [
    { label: 'Gross GCI',                v26: '$37.5K', v27: '$90K',   v28: '$108K',  v36: '$464K+', color: C_EH },
    { label: 'Agent Take 70%',           v26: '$26.3K', v27: '$63K',   v28: '$75.6K', v36: '$324K+', color: C_EH },
    { label: 'Sales Volume',             v26: '$3.75M', v27: '$4.5M',  v28: '$5.4M',  v36: '$23.2M+',color: C_EH },
    { label: <>AnewHomes 35%</>,         v26: '$17.5K', v27: '$52.5K', v28: '$59K',   v36: '$151K',  color: C_ANEW },
  ];

  const richardStreams: StreamRow[] = [
    { label: <>AnewHomes&nbsp;*</>,      v26: '$5K',    v27: '$15K',   v28: '$16.9K', v36: '$43.3K', color: C_ANEW },
  ];


  return (
    <div className="future-main-wrapper" style={{ background: BG, padding: '18px 22px 32px', fontFamily: 'Georgia, serif', color: TEXT_PRIMARY, overflowX: 'hidden' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Print-only header ──────────────────────────────────────────────── */}
        <div className="future-print-header" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(200,172,120,0.4)', paddingBottom: 8, marginBottom: 12 }}>
          <img src={isPdfMode ? LOGO_BLACK : LOGO_WHITE} alt="Christie's International Real Estate Group" style={{ height: 22, width: 'auto' }} />
          <div style={{ ...SANS, fontSize: 8, color: isPdfMode ? '#1B2A4A' : GOLD, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Future Projections &middot; Christie&apos;s East Hampton</div>
        </div>

        {/* ── Page header ────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${GOLD}`, paddingBottom: 8, marginBottom: 16, gap: 6 }}>
          <div style={{ ...SANS, fontSize: 8.5, color: GOLD, letterSpacing: 1.5 }}>
            CHRISTIE&apos;S &middot; INTERNATIONAL REAL ESTATE GROUP &middot; EAST HAMPTON &middot; EST. 1766
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!isPdfMode && ((arcData && !arcLoading) || (volData && !volLoading)) ? (
              <span style={{ ...SANS, color: '#4ade80', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase' }}>&#9679; Live</span>
            ) : null}
            <PrintFutureButton />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* PAGE 1 · Ascension Arc                                            */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <AscensionArcChart isPdfMode={isPdfMode} />

        {/* ── 100-Day Cards (4 cards) ─────────────────────────────────────────── */}
        <div className="future-cards-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginBottom: 16 }}>
          {[
            {
              phase: '1st 100 Days', status: 'Done', date: 'Dec 2025 \u2013 Mar 2026',
              shareholder: <><strong>$4.57M closed.</strong> 9 Daniels Hole $2.47M. 2 Old Hollow $2.1M. Dashboard live Day 1.</>,
              client: 'AnewHomes proven at $2.47M. Every deal scored before a showing.',
              team: '26 Park Place operational. Open before the sign went up.',
            },
            {
              phase: '2nd 100 Days', status: 'Doing', date: 'Mar \u2013 Apr 29 2026',
              shareholder: <><strong>$13.62M active.</strong> 25 Horseshoe $5.75M in contract. 191 Bull Path $3.6M live.</>,
              client: "Creative long-term collaboration with Dan's Papers — outreach into NYC through Melissa True and her Rockefeller and Flatiron teams. Export suite in every deal.",
              team: 'Zoila incoming May 4. Flagship Relaunch April 29.',
            },
            {
              phase: '3rd 100 Days', status: 'Incoming', date: 'Apr 29 \u2013 Aug 2026',
              shareholder: <><strong>$75M target.</strong> First Wednesday Caravan. East End market presence locked.</>,
              client: "Daily intelligence briefing. Every listing at Christie's standard.",
              team: '5 agents on live OS. Scott incoming June. Southampton hiring pipeline started.',
            },
            {
              phase: 'Ascension', status: 'Vision', date: '2027 \u2013 2036',
              shareholder: <><strong>$3.0B · three-office combined 2036.</strong> 36 elite producers. 7.0% post-maturity. Growth from adding agents (\u2154) plus market appreciation (\u2153). Profit sharing begins Year 2 (2027).</>,
              client: "Global Christie's brand. Legacy practice beyond a brokerage.",
              team: "36 elite producers across three offices by 2031 \u00b7 Steady growth through 2036 \u2014 fully staffed \u00b7 All offices fully staffed \u2014 team complete.",
            },
          ].map(c => (
            <div key={c.phase} style={{ background: isPdfMode ? '#eeecea' : '#0d1e33', border: `0.5px solid ${GOLD_FAINT_BORDER}`, borderRadius: 4, padding: '7px 9px' }}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 500 }}>{c.phase}</div>
              <div style={{ ...SANS, fontSize: 7, color: '#888', letterSpacing: 1, textTransform: 'uppercase' }}>{c.status}</div>
              <div style={{ ...SANS, fontSize: 7, color: DIM, paddingBottom: 5, marginBottom: 5, borderBottom: `0.5px solid #1e2d3d` }}>{c.date}</div>
              <div style={{ ...SANS, fontSize: 7, color: GOLD, letterSpacing: 0.8, textTransform: 'uppercase', margin: '4px 0 2px' }}>Shareholder</div>
              <div style={{ ...SANS, fontSize: 7.5, color: '#aaa', lineHeight: 1.6 }}>{c.shareholder}</div>
              <div style={{ ...SANS, fontSize: 7, color: GOLD, letterSpacing: 0.8, textTransform: 'uppercase', margin: '4px 0 2px' }}>Client</div>
              <div style={{ ...SANS, fontSize: 7.5, color: '#aaa', lineHeight: 1.6 }}>{c.client}</div>
              <div style={{ ...SANS, fontSize: 7, color: GOLD, letterSpacing: 0.8, textTransform: 'uppercase', margin: '4px 0 2px' }}>Team</div>
              <div style={{ ...SANS, fontSize: 7.5, color: '#aaa', lineHeight: 1.6 }}>{c.team}</div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* PAGE 2 · Partnership Projections                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}

        {/* Page 2 header */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ ...SANS, fontSize: 8.5, letterSpacing: 3, textTransform: 'uppercase', color: isPdfMode ? '#111' : '#ebe6db', paddingBottom: 4, opacity: 0.9 }}>
            Christie&apos;s &middot; International Real Estate Group &middot; East Hampton &middot; Est. 1766
          </div>
          <div style={{ ...SERIF, textAlign: 'center', fontSize: 14, letterSpacing: 4, textTransform: 'uppercase', color: isPdfMode ? '#1a3a5c' : '#ebe6db', fontWeight: 500, padding: '2px 0 10px', borderBottom: `1px solid ${isPdfMode ? '#947231' : 'rgba(148,114,49,0.5)'}` }}>
            Partnership Projections &middot; 2026 &ndash; 2036
          </div>
        </div>

        {/* Partner cards grid */}
        <div className="future-participant-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr) minmax(0,1fr)', gap: 7, marginBottom: 11, boxSizing: 'border-box' }}>

          {/* Column 1: Edward Bruehl + Ilija Pavlovic */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0, justifyContent: 'center' }}>
            <PartnerCard
              name="Edward Bruehl"
              subtitle="Managing Director · Christie's East Hampton"
              streams={edStreams}
              totLabel="All streams total"
              tot={['$490K','$684K','$951K','$6.1M']}
              isPdfMode={isPdfMode}
            />
            <PartnerCard
              name="Ilija Pavlovic"
              subtitle="Franchise Principal · CIREG Tri-State"
              streams={ilijaStreams}
              totLabel="All streams total"
              tot={[
                ilijaPool2026 ? fmtM(ilijaPool2026) : '$114K',
                ilijaPool2027 ? fmtM(ilijaPool2027) : '$279K',
                ilijaPool2028 ? fmtM(ilijaPool2028) : '$627K',
                ilijaPool2036 ? fmtM(ilijaPool2036) : '$7.4M',
              ]}
              isPdfMode={isPdfMode}
            />
          </div>

          {/* Column 2: Angel Theodore + Jarvis Slade */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0, justifyContent: 'center' }}>
            <PartnerCard
              name="Angel Theodore"
              subtitle="Mktg Coord + Sales · Producer transition Q1 2027"
              nestNote="Nest salary $70K/yr · through Q1 2027"
              streams={angelStreams}
              totLabel="All streams total"
              tot={['$130K','$189K','$212K','$1.03M']}
              isPdfMode={isPdfMode}
              shortYears
            />
            <PartnerCard
              name="Jarvis Slade"
              subtitle="COO · Agent"
              streams={jarvisStreams}
              totLabel="Projected"
              tot={['$235K','$291K','$356K','$1.65M']}
              isPdfMode={isPdfMode}
              shortYears
            />
          </div>

          {/* Column 3: Zoila + Scott + Richard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0, justifyContent: 'center' }}>
            <PartnerCard
              name={<>Zoila Ortega Astor&nbsp;&dagger;</>}
              subtitle="Office Director · Producer transition Q1 2027"
              nestNote="Nest salary $70K/yr · Start May 4 2026"
              streams={zoilaStreams}
              totLabel="All streams total"
              tot={['$125K','$192K','$205K','$996K+']}
              isPdfMode={isPdfMode}
              shortYears
            />
            <PartnerCard
              name={<>Scott Smith&nbsp;*</>}
              subtitle="Agent · AnewHomes Build Partner"
              streams={scottStreams}
              totLabel="Projected"
              tot={['$43.8K','$115K','$134K','$476K+']}
              isPdfMode={isPdfMode}
              shortYears
            />
            <PartnerCard
              name="Richard Bruehl"
              subtitle="Flagship Team · Strategic Mentor · 10% AnewHomes"
              streams={richardStreams}
              totLabel="Projected"
              tot={['$5K','$15K','$17K','$43K']}
              isPdfMode={isPdfMode}
              shortYears
            />
          </div>
        </div>

        {/* Legend block */}
        <LegendBlock isPdfMode={isPdfMode} />

        {/* Assumptions & Calc */}
        <AssumptionsCalc isPdfMode={isPdfMode} />

        {/* Brand footer */}
        <BrandFooter isPdfMode={isPdfMode} />

        {/* Page 2 of 2 pagination */}
        <div style={{ ...SANS, fontSize: 7, color: MUTED, letterSpacing: 1.2, textTransform: 'uppercase', textAlign: 'center', marginTop: 10, opacity: 0.55 }}>
          Page 2 of 2
        </div>

      </div>

      {/* Print footer */}
      <div className="future-print-footer">
        <span className="footer-left">Ed Bruehl &nbsp;&middot;&nbsp; Managing Director</span>
        <span className="footer-center">Christie&apos;s &nbsp;&middot;&nbsp; International Real Estate Group &nbsp;&middot;&nbsp; East Hampton</span>
        <span className="footer-right">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>
  );
}
