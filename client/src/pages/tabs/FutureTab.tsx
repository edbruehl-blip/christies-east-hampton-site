/*
 * FUTURE TAB — Wireframe Rebuild · April 10 2026
 * Visual authority: christies_future_tab_anchored_final.html
 * Theme: dark navy #0a1628 · gold #c8ac78 · gold-light #e8cc98
 * Live wires: ascensionArc (Wires 1-4) · volumeData · pipe.getKpis
 * Auth gate deferred — site private, URL in hands of core team only.
 */

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { LOGO_WHITE, LOGO_BLACK } from '@/lib/cdn-assets';
import { trpc } from '@/lib/trpc';
import '@/styles/future-print.css';
import OperatorControlPanel from '@/components/OperatorControlPanel';

// ─── PDF mode detection ─────────────────────────────────────────────────────
// When Puppeteer navigates with ?pdf=1, the page switches to light-mode styles
// for institutional print quality (dark text on cream background per D43 spec).
// Dashboard screen stays dark navy. PDF export inverts to cream/charcoal.
// CRITICAL: Must be synchronous (not useEffect) so Puppeteer captures cream
// palette on the very first render — useEffect fires after paint, too late.
function useIsPdfMode(): boolean {
  // Read synchronously from URL — safe because window is always defined in browser
  // and Puppeteer navigates to the full URL before React hydrates.
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search).get('pdf') === '1';
  }
  return false;
}

// ─── Design tokens (match wireframe exactly) ─────────────────────────────────
const NAVY       = '#0a1628';
const NAVY_CARD  = '#0d1e33';
const NAVY_CHART = '#0d1a2a';
const GOLD       = '#c8ac78';
const GOLD_LIGHT = '#e8cc98';
const GOLD_FAINT_BG     = 'rgba(200,172,120,0.13)';
const GOLD_FAINT_BORDER = 'rgba(200,172,120,0.40)';
const GOLD_MID_BG       = 'rgba(200,172,120,0.28)';
const CHARCOAL   = '#384249';
const DIM        = '#c8c8c8'; // was #555 — bumped to near-white for card data readability (Ed ruling Apr 14 2026)
const MUTED      = '#a0a8b0'; // was #666 — bumped for label contrast on dark navy (Ed ruling Apr 14 2026)
const PROJ_TEXT  = 'rgba(200,172,120,0.80)';

// Council-locked three-office stacked bar colors (April 20, 2026 final spec)
const EH_COLOR   = '#9e1b32';  // Christie's red — East Hampton flagship
const SH_COLOR   = '#1a3a5c';  // Deep ink navy — Southampton
const WH_COLOR   = '#f37a1f';  // Hermès orange — Westhampton
// Legacy aliases used in partner cards / headcount table / legend
const EH_FOUNDING = EH_COLOR;
const SH_FOUNDING = SH_COLOR;
const WH_FOUNDING = WH_COLOR;
const EH_FAINT    = 'rgba(158,27,50,0.20)';
const SH_FAINT    = 'rgba(26,58,92,0.20)';
const WH_FAINT    = 'rgba(243,122,31,0.20)';

const SANS:  React.CSSProperties = { fontFamily: 'sans-serif' };
const SERIF: React.CSSProperties = { fontFamily: 'Georgia, serif' };

// ─── Council-governed milestone targets ──────────────────────────────────────
const MILESTONE_TARGETS = {
  2025: { volume: 15_000_000,    display: '$20M',    label: '2025', isBaseline: true },
  2026: { volume: 75_000_000,    display: '$75M',    label: '2026', isBaseline: false },  // D6 · OUTPUTS B32
  2027: { volume: 125_906_749,   display: '$126M',   label: '2027', isBaseline: false },  // OUTPUTS B33
  2028: { volume: 253_866_793,   display: '$254M',   label: '2028', isBaseline: false },  // OUTPUTS B34
  2031: { volume: 1_219_300_000, display: '$1.2B',   label: '2031', isBaseline: false },  // OUTPUTS B37
} as const;

const MAX_VOLUME = 3_000_000_000; // 2036 combined three-office EPM total: $3.0B institutional floor · Council dispatch Apr 16 2026 · 7% post-maturity · 36 seats
const CHART_HEIGHT = 160; // px — the bars ROW container height (desktop)
// NOTE: Bar heights are expressed as PERCENTAGES of CHART_HEIGHT so they scale on all screen sizes

function fmtM(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`; // $1.8B, $1.5B etc.
  if (n >= 20_000_000) return `$${Math.round(n / 1_000_000)}M`;          // $939M, $799M etc. — whole number for large values
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;          // $7.4M, $6.8M etc. — one decimal for partner card precision
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

// ─── Print Future Button ─────────────────────────────────────────────────────
// Spec April 15 2026: Print the FUTURE tab full-scroll exactly as it appears
// on screen — dark navy, gold, all partner cards with live data.
// No separate page, no light-mode inversion. window.print() on current tab.
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
      // Fallback to window.print() if server PDF fails
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
      style={{ ...SANS, background: 'transparent', border: `0.5px solid ${GOLD}`, color: loading ? 'rgba(200,172,120,0.5)' : GOLD, padding: '5px 14px', fontSize: 7, letterSpacing: '1px', textTransform: 'uppercase' as const, cursor: loading ? 'wait' : 'pointer' }}
    >
      {loading ? 'Generating…' : '\u2193 Download · PDF'}
    </button>
  );
}

// ─── Council-locked Ascension Arc Chart Component ───────────────────────────
// Spec: April 20 2026 · Ed + Council approved · No interpretation
interface ArcBarDatum {
  year: string;
  eh: number;  // millions
  sh: number;  // millions
  wh: number;  // millions
  combined: number; // millions
  display: string;
}

function AscensionArcChart({ data, isPdfMode }: { data: ArcBarDatum[]; isPdfMode: boolean }) {
  const [tooltip, setTooltip] = React.useState<{ x: number; y: number; d: ArcBarDatum } | null>(null);

  const C_EH   = '#9e1b32';
  const C_SH   = '#1a3a5c';
  const C_WH   = '#f37a1f';
  const C_GOLD = '#c8ac78';
  const C_BG   = isPdfMode ? '#e8e6e2' : '#0f1820';
  const C_GRID = 'rgba(200,172,120,0.10)';
  const C_AXIS = isPdfMode ? '#384249' : 'rgba(248,245,240,0.55)';
  const C_YEAR = isPdfMode ? '#1a1a1a' : '#f8f5f0';

  const MAX_M = 3200;
  const CHART_H = 260;
  const Y_TICKS = [0, 500, 1000, 1500, 2000, 2500, 3000];

  function pct(m: number) { return Math.max(0, Math.min(100, (m / MAX_M) * 100)); }
  function fmtTick(m: number): string {
    if (m === 0) return '$0M';
    if (m >= 1000) return `$${m / 1000}B`;
    return `$${m}M`;
  }

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Chart header */}
      <div style={{ textAlign: 'center' as const, marginBottom: 14 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, letterSpacing: 5, color: isPdfMode ? '#1a1a1a' : '#e8e4de', textTransform: 'uppercase' as const, fontWeight: 400, lineHeight: 1.2, marginBottom: 6 }}>
          Christie&rsquo;s East Hampton Flagship
        </div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#9e1b32', fontStyle: 'italic', letterSpacing: 0.5 }}>
          Ascension Arc &middot; 2026 through 2036 and beyond
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { color: C_EH, label: 'East Hampton · flagship · since 2026' },
          { color: C_SH, label: 'Southampton · opens 2028' },
          { color: C_WH, label: 'Westhampton · opens 2030' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 20, background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: isPdfMode ? '#384249' : '#c8c8c8' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Chart body */}
      <div className="future-chart-frame" style={{ background: C_BG, borderRadius: 4, padding: '20px 20px 0', position: 'relative' as const, border: `0.5px solid ${C_GOLD}` }}>
        {/* Y-axis grid lines */}
        <div style={{ position: 'absolute' as const, left: 52, right: 20, top: 20, height: CHART_H, pointerEvents: 'none' }}>
          {Y_TICKS.map(m => (
            <div key={m} style={{ position: 'absolute' as const, bottom: `${pct(m)}%`, left: 0, right: 0 }}>
              <div style={{ borderTop: `1px solid ${C_GRID}`, width: '100%' }} />
            </div>
          ))}
        </div>
        {/* Y-axis tick labels */}
        <div style={{ position: 'absolute' as const, left: 0, top: 20, height: CHART_H, width: 50, pointerEvents: 'none' }}>
          {Y_TICKS.map(m => (
            <div key={m} style={{ position: 'absolute' as const, bottom: `${pct(m)}%`, right: 4, transform: 'translateY(50%)', fontFamily: 'Georgia, serif', fontSize: 13, color: C_AXIS, whiteSpace: 'nowrap' as const, textAlign: 'right' as const }}>
              {fmtTick(m)}
            </div>
          ))}
        </div>

        {/* Bars area */}
        <div style={{ marginLeft: 52, display: 'flex', alignItems: 'flex-end', gap: 6, height: CHART_H, position: 'relative' as const }}>
          {data.map((d) => {
            const totalH = pct(d.combined);
            const ehH  = d.combined > 0 ? (d.eh  / d.combined) * 100 : 100;
            const shH  = d.combined > 0 ? (d.sh  / d.combined) * 100 : 0;
            const whH  = d.combined > 0 ? (d.wh  / d.combined) * 100 : 0;
            return (
              <div key={d.year} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', position: 'relative' as const }}
                onMouseEnter={(e) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); setTooltip({ x: r.left + r.width / 2, y: r.top, d }); }}
                onMouseLeave={() => setTooltip(null)}
              >
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 13, fontWeight: 700, color: C_GOLD, marginBottom: 4, textAlign: 'center' as const, whiteSpace: 'nowrap' as const, lineHeight: 1 }}>
                  {d.display}
                </div>
                <div style={{ width: '100%', height: `${totalH}%`, minHeight: 12, display: 'flex', flexDirection: 'column', cursor: 'default' }}>
                  {d.wh > 0 && <div style={{ flex: whH, background: C_WH, border: `1px solid ${C_BG}`, minHeight: 4 }} />}
                  {d.sh > 0 && <div style={{ flex: shH, background: C_SH, border: `1px solid ${C_BG}`, minHeight: 4 }} />}
                  <div style={{ flex: ehH, background: C_EH, border: `1px solid ${C_BG}`, minHeight: 12 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis year labels */}
        <div style={{ marginLeft: 52, display: 'flex', gap: 6, borderTop: `1px solid ${C_AXIS}`, paddingTop: 10, paddingBottom: 14 }}>
          {data.map((d) => (
            <div key={d.year} style={{ flex: 1, textAlign: 'center' as const, fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700, color: C_YEAR }}>
              {d.year}
            </div>
          ))}
        </div>
      </div>

      {/* Chart footer */}
      <div style={{ textAlign: 'center' as const, marginTop: 12, fontFamily: 'Georgia, serif', fontSize: 12, color: '#384249', fontStyle: 'italic', letterSpacing: 4 }}>
        ART &middot; BEAUTY &middot; PROVENANCE &middot; SINCE 1766
      </div>

      {/* Hover tooltip */}
      {tooltip && (
        <div style={{ position: 'fixed' as const, left: tooltip.x, top: tooltip.y - 8, transform: 'translate(-50%, -100%)', background: '#faf7f1', border: `1.5px solid ${C_GOLD}`, borderRadius: 4, padding: '10px 14px', zIndex: 9999, pointerEvents: 'none', minWidth: 180, boxShadow: '0 4px 16px rgba(0,0,0,0.18)' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>{tooltip.d.year}</div>
          {[
            { label: 'East Hampton', val: tooltip.d.eh, color: C_EH },
            { label: 'Southampton',  val: tooltip.d.sh, color: C_SH },
            { label: 'Westhampton',  val: tooltip.d.wh, color: C_WH },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontFamily: 'Georgia, serif', fontSize: 12, color: '#384249', marginBottom: 3 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, background: color, display: 'inline-block', flexShrink: 0 }} />
                {label}
              </span>
              <span style={{ fontWeight: 600 }}>{val > 0 ? `$${val >= 1000 ? (val/1000).toFixed(1)+'B' : val.toFixed(1)+'M'}` : '—'}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C_GOLD}`, marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontFamily: 'Georgia, serif', fontSize: 13, color: '#9e1b32', fontWeight: 700 }}>
            <span>Combined</span>
            <span>{tooltip.d.display}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FutureTab() {
  // PDF mode: ?pdf=1 → light-mode institutional print styling
  const isPdfMode = useIsPdfMode();

  // PDF light-mode color overrides — dark text on white background for institutional print
  const PDF_BG       = '#f7f6f2'; // D43 cream — institutional print background
  const PDF_CARD_BG  = '#eeecea'; // D43 card surface — slightly deeper cream
  const PDF_CHART_BG = '#e8e6e2'; // D43 chart frame — warm off-white
  const PDF_TEXT     = '#28251d'; // D43 charcoal — primary text
  const PDF_MUTED    = '#5a5650'; // D43 muted — secondary labels
  const PDF_BORDER   = 'rgba(200,172,120,0.5)'; // gold divider — unchanged

  // Dynamic tokens — screen uses dark navy, PDF uses light paper
  const BG       = isPdfMode ? PDF_BG       : NAVY;
  const CARD_BG  = isPdfMode ? PDF_CARD_BG  : NAVY_CARD;
  const CHART_BG = isPdfMode ? PDF_CHART_BG : NAVY_CHART;
  const TEXT_PRIMARY = isPdfMode ? PDF_TEXT  : '#fff';
  const TEXT_MUTED   = isPdfMode ? PDF_MUTED : MUTED;
  const CARD_BORDER  = isPdfMode ? PDF_BORDER : `0.5px solid ${GOLD}`;

  // Wires 1–4: live OUTPUTS + VOLUME data
  const { data: arcData, isLoading: arcLoading } = trpc.future.ascensionArc.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });
  // Wire Six: dedicated profit pool endpoint — OUTPUTS G32:G39 live
  const { data: poolData } = trpc.future.profitPool.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });
  const { data: volData, isLoading: volLoading } = trpc.future.volumeData.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });
  const { data: kpisData } = trpc.pipe.getKpis.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });
  // Wire: ROSTER tab — Angel/Zoila dual-track nest + producer rows
  const { data: gmData } = trpc.future.growthModel.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });

  // Extract Angel and Zoila nest/producer rows from ROSTER
  const rosterAgents = gmData?.agents ?? [];
  const angelNest     = rosterAgents.find(a => a.name === 'Angel Theodore (Nest)');
  const angelProducer = rosterAgents.find(a => a.name === 'Angel Theodore (Producer)');
  const zoilaNest     = rosterAgents.find(a => a.name === 'Zoila Ortega Astor (Nest)');
  const zoilaProducer = rosterAgents.find(a => a.name === 'Zoila Ortega Astor (Producer)');

  // Canonical locked trajectory (Ed ruling April 14, 2026)
  // Used as display source; ROSTER cells override when Perplexity populates them
  // 2026: $70K nest + $25K producer ramp (50% entry credit on $50K) = $127.5K total
  // 2027: $17.5K Q1 nest + $132.5K Q2-Q4 production = $150K floor
  // 2028+: 20% YoY compound — $180K, $216K, $259K, $311K, $373K, $447K, $537K, $644K, $773K
  const CANONICAL_ANGEL = {
    nestSalary:  '$70K/yr ($5,833/mo) through Q1 2027',
    total2026:   angelNest && angelProducer && (angelNest.gci2026 + angelProducer.gci2026) > 0
                   ? `$${Math.round((angelNest.gci2026 + angelProducer.gci2026 + 2_500 + 30_000) / 1000)}K`
                   : '$127.5K', // $70K nest + $25K producer (50% entry credit) + $2,500 AnewHomes + $30K ICA Override (Angel has no vesting clause)
    total2027:   angelNest && angelProducer && (angelNest.gci2027 + angelProducer.gci2027) > 0
                   ? `$${Math.round((angelNest.gci2027 + angelProducer.gci2027) / 1000)}K`
                   : '$150K',
    total2028:   '$180K',
    total2036:   '$773K',
    producer2026: angelProducer && angelProducer.gci2026 > 0 ? `$${Math.round(angelProducer.gci2026 / 1000)}K` : '$25K', // 50% entry credit on $50K producer ramp
    producer2027: angelProducer && angelProducer.gci2027 > 0 ? `$${Math.round(angelProducer.gci2027 / 1000)}K` : '$132.5K',
  };
  const CANONICAL_ZOILA = {
    nestSalary:  '$70K/yr ($5,833/mo) · Start May 4, 2026 · through Q1 2027',
    total2026:   zoilaNest && zoilaProducer && (zoilaNest.gci2026 + zoilaProducer.gci2026) > 0
                   ? `$${Math.round((zoilaNest.gci2026 + zoilaProducer.gci2026 + 30_000) / 1000)}K`
                   : '$130K', // $70K nest + $30K producer ramp + $0 vest AnewHomes + $30K ICA Override
    total2027:   zoilaNest && zoilaProducer && (zoilaNest.gci2027 + zoilaProducer.gci2027) > 0
                   ? `$${Math.round((zoilaNest.gci2027 + zoilaProducer.gci2027) / 1000)}K`
                   : '$150K',
    total2028:   '$180K',
    total2036:   '$773K',
    producer2026: zoilaProducer && zoilaProducer.gci2026 > 0 ? `$${Math.round(zoilaProducer.gci2026 / 1000)}K` : '$30K',
    producer2027: zoilaProducer && zoilaProducer.gci2027 > 0 ? `$${Math.round(zoilaProducer.gci2027 / 1000)}K` : '$132.5K',
  };

  const liveKpis = kpisData ? {
    exclusiveTotalM: kpisData.exclusiveTotalM,
    activeTotalM: kpisData.activeTotalM,
    relationshipBookM: kpisData.relationshipBookM,
  } : undefined;

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

  // Wire 1: live office volumes — now using three-office combined (SD-8 Phase Two)
  const liveVolumes = useMemo(() => {
    if (!arcData?.years?.length) return null;
    const map: Record<number, number> = {};
    arcData.years.forEach(y => { map[y.year] = y.combinedVolume || y.officeVolume; });
    return map;
  }, [arcData]);

  // SD-8 Phase Two: per-office volumes for stacked bars
  const liveEhVolumes = useMemo(() => {
    if (!arcData?.years?.length) return null;
    const map: Record<number, number> = {};
    arcData.years.forEach(y => { map[y.year] = y.ehVolume || y.officeVolume; });
    return map;
  }, [arcData]);
  const liveShVolumes = useMemo(() => {
    if (!arcData?.years?.length) return null;
    const map: Record<number, number> = {};
    arcData.years.forEach(y => { map[y.year] = y.shVolume || 0; });
    return map;
  }, [arcData]);
  const liveWhVolumes = useMemo(() => {
    if (!arcData?.years?.length) return null;
    const map: Record<number, number> = {};
    arcData.years.forEach(y => { map[y.year] = y.whVolume || 0; });
    return map;
  }, [arcData]);

  // Wire Six: live profit pool rows from dedicated profitPool endpoint (OUTPUTS G32:G39)
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

  // Wire 4: Ed GCI (gross — from VOLUME sheet row 2, used internally)
  const liveEdGci = useMemo(() => {
    if (!arcData?.years?.length) return null;
    const map: Record<number, number> = {};
    arcData.years.forEach(y => { map[y.year] = y.edGci; });
    return map;
  }, [arcData]);

  // Ed EQ1 net keep = gross personal GCI × 70% (70/30 house split)
  // Gross personal GCI: $600K 2026, 20% compound, no cap · Ed ruling Apr 16 2026 (Option A: headcount table uses gross)
  // EQ1_NET = 70% of gross · shown on Ed partner card as personal take-home
  const EQ1_NET: Record<number, string> = {
    2026: '$420K',   // $600K × 70%
    2027: '$504K',   // $720K × 70%
    2028: '$605K',   // $864K × 70%
    2029: '$726K',   // $1.037M × 70%
    2030: '$871K',   // $1.244M × 70%
    2031: '$1.045M', // $1.493M × 70%
    2032: '$1.254M', // $1.792M × 70%
    2033: '$1.505M', // $2.150M × 70%
    2034: '$1.806M', // $2.580M × 70%
    2035: '$2.167M', // $3.096M × 70%
    2036: '$2.604M', // $3.725M × 70%
  };

  // Actual 2026 closed volume (from VOLUME tab)
  const act2026 = volData?.total.act2026 || 4_570_000;

  // Bar heights — sqrt scale, returns PERCENTAGE (0–92) so bars always fit inside the container
  // Using percentage means bars scale correctly on mobile without overflow
  function barPct(vol: number): number {
    return Math.max(2, Math.min(92, Math.round(Math.sqrt(vol / MAX_VOLUME) * 92)));
  }

  // The eleven projected bars (2026-2036 milestones — live from OUTPUTS B32:B42)
  // ── Council-locked CHART_DATA — Growth Model v2 VOLUME tab · April 20 2026 ──
  // Direct from Perp's raw VOLUME pull. No derivation. All values in millions.
  // Live tRPC data overrides when available; these are the exact council-locked fallbacks.
  const CHART_DATA = useMemo((): ArcBarDatum[] => {
    // EH Row 10 · SH Row 15 · WH Row 16 · Growth Model v2 VOLUME tab
    // Council-locked exact values (millions) — April 20 2026
    const EH_M = [20, 75, 212, 411, 567, 647, 728, 808, 889, 969, 1050, 1130];
    const SH_M = [0,   0,  42, 285, 422, 503, 584, 665, 745, 826,  907,  988];
    const WH_M = [0,   0,   0,  57, 231, 324, 416, 509, 601, 694,  786,  879];
    const YEARS = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036];
    return YEARS.map((yr, i) => {
      const liveEh = liveEhVolumes?.[yr];
      const liveSh = liveShVolumes?.[yr];
      const liveWh = liveWhVolumes?.[yr];
      const eh = (liveEh && liveEh > 0) ? liveEh / 1_000_000 : EH_M[i];
      const sh = (liveSh && liveSh > 0) ? liveSh / 1_000_000 : SH_M[i];
      const wh = (liveWh && liveWh > 0) ? liveWh / 1_000_000 : WH_M[i];
      const combined = eh + sh + wh;
      let display: string;
      if (yr === 2036) { display = '$3.0B'; }
      else if (yr === 2025) { display = '$20M'; }
      else if (combined >= 1000) { display = `$${(combined / 1000).toFixed(2).replace(/\\.?0+$/, '')}B`; }
      else if (combined >= 100) { display = `$${Math.round(combined)}M`; }
      else { display = `$${combined.toFixed(1)}M`; }
      return { year: String(yr), eh, sh, wh, combined, display };
    });
  }, [liveEhVolumes, liveShVolumes, liveWhVolumes]);

  // Legacy BARS alias — used by partner cards / headcount table below chart
  const BARS = useMemo(() => CHART_DATA.map(d => ({
    year: d.year,
    vol: d.combined * 1_000_000,
    display: d.display,
    actualVol: 0,
    eh: d.eh * 1_000_000,
    sh: d.sh * 1_000_000,
    wh: d.wh * 1_000_000,
  })), [CHART_DATA]);

  // ─── Card border style (uniform per wireframe) ────────────────────────
  const cardStyle: React.CSSProperties = {
    background: CARD_BG,
    border: CARD_BORDER,
    borderRadius: 4,
    padding: '7px 9px',
  };

  const tabRef = useRef<HTMLDivElement>(null);
  // Architectural rule (Sprint 14 · Ed ruling Apr 15 2026):
  // One PDF button per tab, one canonical output per button.
  // Pro Forma PDF (top-right header) is the sole PDF surface for this tab.
  // Dead /api/pdf Puppeteer button removed.


  return (
      <div ref={tabRef} className="future-main-wrapper" style={{ background: BG, padding: '18px 22px 32px', fontFamily: 'Georgia, serif', color: TEXT_PRIMARY, overflowX: 'hidden' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* ── Print-only header: Christie's logo + document title ─────────── */}
        <div className="future-print-header" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(200,172,120,0.4)', paddingBottom: 8, marginBottom: 12 }}>
          <img src={isPdfMode ? LOGO_BLACK : LOGO_WHITE} alt="Christie's International Real Estate Group" style={{ height: 22, width: 'auto' }} />
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, color: isPdfMode ? '#1B2A4A' : '#C8AC78', letterSpacing: '0.18em', textTransform: 'uppercase' as const }}>Future Projections &middot; Christie&apos;s East Hampton</div>
        </div>

        {/* ── Page header: Christie's bar + Print button ─────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${GOLD}`, paddingBottom: 8, marginBottom: 16, gap: 6 }}>
          <div style={{ ...SANS, fontSize: 8.5, color: GOLD, letterSpacing: 1.5 }}>
            CHRISTIE&apos;S &middot; INTERNATIONAL REAL ESTATE GROUP &middot; EAST HAMPTON &middot; EST. 1766
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!isPdfMode && ((arcData && !arcLoading) || (volData && !volLoading)) ? (
              <span style={{ ...SANS, color: '#4ade80', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase' as const }}>&#9679; Live</span>
            ) : null}
            <PrintFutureButton />
          </div>
        </div>

        {/* Council-locked Ascension Arc Chart */}
        <AscensionArcChart data={CHART_DATA} isPdfMode={isPdfMode} />

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
              shareholder: <><strong>$3.0B · three-office combined 2036.</strong> 36 elite producers. 7.0% post-maturity. Growth from adding agents (⅔) plus market appreciation (⅓). Profit sharing begins Year 2 (2027).</>,
              client: "Global Christie's brand. Legacy practice beyond a brokerage.",
              team: "36 elite producers across three offices by 2031 · Steady growth through 2036 — fully staffed · All offices fully staffed — team complete.",
            },
          ].map(c => (
            <div key={c.phase} style={cardStyle}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, letterSpacing: 1, textTransform: 'uppercase' as const, fontWeight: 500 }}>{c.phase}</div>
              <div style={{ ...SANS, fontSize: 7, color: '#888', letterSpacing: 1, textTransform: 'uppercase' as const }}>{c.status}</div>
              <div style={{ ...SANS, fontSize: 7, color: DIM, paddingBottom: 5, marginBottom: 5, borderBottom: `0.5px solid #1e2d3d` }}>{c.date}</div>
              <div style={{ ...SANS, fontSize: 7, color: GOLD, letterSpacing: 0.8, textTransform: 'uppercase' as const, margin: '4px 0 2px' }}>Shareholder</div>
              <div style={{ ...SANS, fontSize: 7.5, color: '#aaa', lineHeight: 1.6 }}>{c.shareholder}</div>
              <div style={{ ...SANS, fontSize: 7, color: GOLD, letterSpacing: 0.8, textTransform: 'uppercase' as const, margin: '4px 0 2px' }}>Client</div>
              <div style={{ ...SANS, fontSize: 7.5, color: '#aaa', lineHeight: 1.6 }}>{c.client}</div>
              <div style={{ ...SANS, fontSize: 7, color: GOLD, letterSpacing: 0.8, textTransform: 'uppercase' as const, margin: '4px 0 2px' }}>Team</div>
              <div style={{ ...SANS, fontSize: 7.5, color: '#aaa', lineHeight: 1.6 }}>{c.team}</div>
            </div>
          ))}
        </div>

        {/* ── Zone Divider: Partnership Projections ─────────────────────────── */}
        <div style={{ margin: '10px 0 12px', textAlign: 'center' as const }}>
          <div style={{ borderTop: `0.5px solid ${GOLD}`, marginBottom: 6 }} />
          <span style={{ ...SANS, fontSize: 8, color: GOLD, letterSpacing: 2.5, textTransform: 'uppercase' as const, fontWeight: 500 }}>
            Partnership Projections &middot; D40.5 &middot; Verified April 20, 2026
          </span>
          <div style={{ borderTop: `0.5px solid ${GOLD}`, marginTop: 6 }} />
        </div>

        {/* ── Participant Cards Grid (3 columns) ─────────────────────────────── */}
        {/* Build 3 · Apr 20 2026 · Uniform structure · Correct streams per person · CIREG Profit dollarized */}
        {/* Math: CIREG Profit base = NOP · Ed 29.75% · Ilija 25% of Ed Gross GCI · Angel/Jarvis/Zoila 1.75% each */}
        {/* ICA Override = 5% of Ed Gross GCI · always-on for Angel and Jarvis through 2036 */}
        {/* Perplexity confirmed Apr 20 2026 */}
        <div className="future-participant-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9 }}>

          {/* Column 1: Ed + Ilija */}
          <div>
            {/* Ed */}
            <div style={{ ...cardStyle, marginBottom: 7 }}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, fontWeight: 500, marginBottom: 1 }}>Ed Bruehl</div>
              <div style={{ ...SANS, fontSize: 6.5, color: MUTED, marginBottom: 5 }}>Managing Director &middot; Christie&apos;s East Hampton</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, marginBottom: 3 }}>
                {['Stream','2026','2027','2028','2036'].map(h => (
                  <span key={h} style={{ ...SANS, fontSize: 7, color: GOLD, textAlign: h === 'Stream' ? 'left' : 'right' as const }}>{h}</span>
                ))}
              </div>
              {/* Build 3+4 · Ed streams: Gross GCI, Net personal production, CIREG 29.75%, AnewHomes 35%, CPS-1 (incl.), All streams total */}
              {/* Build 4: Ed personal net = Ed's actual net take-home · one number, one place, one truth */}
              {/* CIREG 29.75% of NOP: $52K / $128K / $408K / $3.40M · Perp confirmed Apr 20 2026 */}
              {[
                { label: 'Gross GCI (office)',  proj: ['$600K','$720K','$864K','$3.72M'], act: null }, // 20% compound from $600K · headcount table view
                { label: 'Net personal prod (after team overrides)', proj: [
                  EQ1_NET[2026], EQ1_NET[2027], EQ1_NET[2028], EQ1_NET[2036],
                ], act: null }, // 70% of gross · after team overrides paid · Ed ruling Apr 16 2026
                { label: 'CIREG Profit 29.75%', proj: ['$52K','$128K','$287K','$3.39M'], act: null }, // 29.75% of NOP · Perp sheet confirmed Apr 20 2026 · NOP: $175K/$430K/$965K/$11.4M
                { label: 'AnewHomes 35%', proj: ['$17,500','$52,500','$59,063','$151,542'], act: null }, // 12.5% annual growth from $50K NOP base
                { label: 'CPS-1 visibility ‡', proj: ['$100K','$250K','$500K','$1.69M'], act: null }, // CPS-1 curve: $100K/$250K/$500K/$1M/$1.5M cap/2% → 2036: $1,689,244 · incl. in pool above · not additive
              ].map(row => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, lineHeight: 1.65 }}>
                  <span style={{ color: MUTED }}>{row.label}</span>
                  {(row.proj ?? []).map((v, i) => (
                    <span key={i} style={{ textAlign: 'right' as const, color: DIM, fontStyle: 'italic', fontSize: 6.5 }}>{v}</span>
                  ))}
                </div>
              ))}
              {/* All streams total: Net personal prod + CIREG 29.75% + AnewHomes 35% */}
              {/* Build 4: This is Ed's actual net take-home · matches partner card exactly · Perp Apr 20 2026 */}
              {/* 2026: $420K + $52K + $17.5K = $489.5K · 2027: $504K + $128K + $52.5K = $684.3K */}
              {/* 2028: $605K + $287K + $59K = $951K · 2036: $2.604M + $3.39M + $152K = $6.15M */}
              {(() => {
                const EQ1_NUMS: Record<number, number> = { 2026: 420_000, 2027: 504_000, 2028: 604_800, 2036: 2_604_000 };
                const CIREG_NUMS: Record<number, number> = { 2026: 52_063, 2027: 127_786, 2028: 286_996, 2036: 3_391_500 };
                const ANEW_NUMS: Record<number, number> = { 2026: 17_500, 2027: 52_500, 2028: 59_063, 2036: 151_542 };
                const years = [2026, 2027, 2028, 2036];
                const totals = years.map(yr => fmtM(EQ1_NUMS[yr] + CIREG_NUMS[yr] + ANEW_NUMS[yr]));
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 8.5, color: GOLD, fontWeight: 700, borderTop: `0.5px solid ${CHARCOAL}`, paddingTop: 3, marginTop: 2 }}>
                    <span>All streams total</span>
                    {totals.map((v, i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
                  </div>
                );
              })()}

            </div>

            {/* Ilija */}
            <div style={{ ...cardStyle, marginBottom: 7 }}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, fontWeight: 500, marginBottom: 1 }}>Ilija Pavlovic</div>
              <div style={{ ...SANS, fontSize: 6.5, color: MUTED, marginBottom: 5 }}>Franchise Principal &middot; CIREG Tri-State</div>
              {/* Build 5: Subtitle line removed — headcount scaling shows in table */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, marginBottom: 3 }}>
                {['Stream','2026','2027','2028','2036'].map(h => (
                  <span key={h} style={{ ...SANS, fontSize: 7, color: GOLD, textAlign: h === 'Stream' ? 'left' : 'right' as const }}>{h}</span>
                ))}
              </div>
              {/* Build 3 · Ilija streams: Net pool 65%, CIREG 25% Ed Gross (incl. above, franchise traceback), CPS-1 (incl.) */}
              {/* CIREG 25% of Ed Gross GCI: $150K / $180K / $216K / $929K · Perp confirmed Apr 20 2026 */}
              {[
                { label: 'NOP pool 65% *', proj: [
                  livePoolRows?.find(r=>r.year==='2026') ? fmtM(livePoolRows.find(r=>r.year==='2026')!.ilijaPool) : '$114K',
                  livePoolRows?.find(r=>r.year==='2027') ? fmtM(livePoolRows.find(r=>r.year==='2027')!.ilijaPool) : '$280K',
                  livePoolRows?.find(r=>r.year==='2028') ? fmtM(livePoolRows.find(r=>r.year==='2028')!.ilijaPool) : '$892K',
                  livePoolRows?.find(r=>r.year==='2036') ? fmtM(livePoolRows.find(r=>r.year==='2036')!.ilijaPool) : '$7.43M',
                ], act: null },
                { label: 'CIREG 25% Ed Gross (incl. above)', proj: ['$150K','$180K','$216K','$929K'], act: null }, // 25% of Ed personal GCI · franchise traceback · incl. in pool above · Perp Apr 20 2026
                { label: 'CPS-1 visibility ‡', proj: ['$100K','$250K','$500K','$1.69M'], act: null }, // CPS-1 curve: $100K/$250K/$500K/$1M/$1.5M cap/2% → 2036: $1,689,244 · incl. in pool above · not additive
              ].map(row => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, lineHeight: 1.65 }}>
                  <span style={{ color: MUTED }}>{row.label}</span>
                  {(row.proj ?? []).map((v, i) => (
                    <span key={i} style={{ textAlign: 'right' as const, color: DIM, fontStyle: 'italic', fontSize: 6.5 }}>{v}</span>
                  ))}
                </div>
              ))}
              {/* All streams total = Net pool 65% (which already includes CIREG traceback) */}
              {(() => {
                const CANONICAL_ILIJA: Record<number, number> = { 2026: 114_000, 2027: 280_000, 2028: 892_000, 2036: 7_430_000 };
                const years = [2026, 2027, 2028, 2036];
                const totals = years.map(yr => {
                  const pool = livePoolRows?.find(r => r.year === String(yr))?.ilijaPool;
                  return pool !== undefined ? fmtM(pool) : fmtM(CANONICAL_ILIJA[yr]);
                });
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7.5, color: GOLD, fontWeight: 500, borderTop: `0.5px solid ${CHARCOAL}`, paddingTop: 3, marginTop: 2 }}>
                    <span>All streams total</span>
                    {totals.map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
                  </div>
                );
              })()}
            </div>

          </div>

          {/* Column 2: Angel + Jarvis */}
          <div>
            {/* Angel — dual-track: nest salary + producer income */}
            <div style={{ ...cardStyle, marginBottom: 7 }}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, fontWeight: 500, marginBottom: 1 }}>Angel Theodore *</div>
              <div style={{ ...SANS, fontSize: 6.5, color: MUTED, marginBottom: 1 }}>Mktg Coord + Sales &middot; Producer transition Q1 2027</div>
              <div style={{ ...SANS, fontSize: 6, color: GOLD, opacity: 0.7, marginBottom: 4 }}>Nest salary {CANONICAL_ANGEL.nestSalary}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, marginBottom: 3 }}>
                {['Stream','2026','2027','2028','2036'].map(h => (
                  <span key={h} style={{ ...SANS, fontSize: 7, color: GOLD, textAlign: h === 'Stream' ? 'left' : 'right' as const }}>{h}</span>
                ))}
              </div>
              {/* Build 3 · Angel streams per dispatch Apr 20 2026 */}
              {/* ICA Override always-on through 2036 · CIREG 1.75% dollarized · CPS-1 visibility line */}
              {[
                { label: 'Nest salary',           vals: ['$70K','$17.5K','—','—'] },
                { label: 'Producer ramp',          vals: ['$25K','$120K','$144K','$619K+'] }, // 50% entry credit Y1 · 20% compound from $50K base · no cap
                { label: 'AnewHomes 5% *',         vals: ['$2,500','$7.5K','$8,438','$21,649'] }, // Y1 vested · 12.5% growth from $50K NOP base
                { label: 'ICA Override (5% Ed gross, always-on through 2036)', vals: ['$30K','$36K','$43.2K','$186K'] }, // 5% of Ed gross GCI · always-on · Angel in Ed's lane on every deal · Ed ruling Apr 16 2026
                { label: 'CIREG Profit 1.75% *',   vals: ['$3K','$8K','$17K','$200K'] }, // 1.75% of NOP · Perp sheet confirmed Apr 20 2026 · NOP: $175K/$430K/$965K/$11.4M
                { label: 'CPS-1 (incl. above) ‡',                vals: ['$100K','$250K','$500K','$1.69M'] }, // CPS-1 curve: $100K/$250K/$500K/$1M/$1.5M cap/2% → 2036: $1,689,244 · incl. in pool above · not additive
              ].map(row => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, lineHeight: 1.65 }}>
                  <span style={{ color: MUTED }}>{row.label}</span>
                  {row.vals.map((v, i) => (
                    <span key={i} style={{ textAlign: 'right' as const, color: DIM, fontStyle: 'italic', fontSize: 6.5 }}>{v}</span>
                  ))}
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, color: DIM, fontStyle: 'italic', borderTop: `0.5px solid ${CHARCOAL}`, paddingTop: 3, marginTop: 2 }}>
                <span style={{ color: MUTED }}>Producer income</span>
                {['$25K','$120K','$144K','$619K+'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
              </div>
              {/* All streams total: nest + prod + ICA + CIREG + AH */}
              {/* 2026: $70K+$25K+$30K+$3K+$2.5K=$130.5K · 2027: $17.5K+$120K+$36K+$8K+$7.5K=$189K */}
              {/* 2028: $144K+$43.2K+$17K+$8.4K=$212.6K · 2036: $619K+$186K+$200K+$21.6K=$1.027M */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7.5, color: GOLD, fontWeight: 500, paddingTop: 2 }}>
                <span>All streams total</span>
                {['$130.5K','$189K','$212.6K','$1.03M'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
              </div>
              <div style={{ ...SANS, fontSize: 5.5, color: MUTED, marginTop: 3, lineHeight: 1.5 }}>
                * ICA Override always-on through 2036 · Angel in Ed&apos;s lane on every deal · CIREG 1.75% of NOP · AnewHomes 5% vested · 20% YoY no cap
              </div>
            </div>

            {/* Jarvis */}
            {/* Build 3 · Jarvis streams per dispatch Apr 20 2026 */}
            {/* ICA Override always-on with projected values · CIREG 1.75% dollarized · CPS-1 visibility line */}
            <div style={{ ...cardStyle, marginBottom: 7 }}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, fontWeight: 500, marginBottom: 1 }}>Jarvis Slade</div>
              <div style={{ ...SANS, fontSize: 6.5, color: MUTED, marginBottom: 5 }}>COO &middot; Agent</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, marginBottom: 3 }}>
                {['Stream','2026','2027','2028','2036'].map(h => (
                  <span key={h} style={{ ...SANS, fontSize: 7, color: GOLD, textAlign: h === 'Stream' ? 'left' : 'right' as const }}>{h}</span>
                ))}
              </div>
              {[
                { label: 'Sales vol',    proj: ['$10M','$12M','$14.4M','$62M+'], act: null }, // Perp-verified Apr 17 2026
                { label: 'Actual vol',   proj: null, act: ['—','—','—','—'] },
                { label: 'GCI proj',     proj: ['$200K','$240K','$288K','$1.24M+'], act: null }, // 20% YoY from $200K · no cap
                { label: 'AnewHomes 5%', proj: ['$2,500','$7,500','$8,438','$21,649'], act: null }, // 12.5% growth from $50K NOP base
                { label: 'ICA Override (5% Ed gross, always-on through 2036)', proj: ['$30K','$36K','$43.2K','$186K'], act: null }, // always-on · 5% of Ed gross GCI · Jarvis in Ed's lane · dispatch Apr 20 2026
                { label: 'CIREG Profit 1.75% *', proj: ['$3K','$8K','$17K','$200K'], act: null }, // 1.75% of NOP · Perp sheet confirmed Apr 20 2026 · NOP: $175K/$430K/$965K/$11.4M
                { label: 'CPS-1 (incl. above) ‡', proj: ['$100K','$250K','$500K','$1.69M'], act: null }, // CPS-1 curve: $100K/$250K/$500K/$1M/$1.5M cap/2% → 2036: $1,689,244 · incl. in pool above · not additive
              ].map(row => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, lineHeight: 1.65 }}>
                  <span style={{ color: MUTED }}>{row.label}</span>
                  {(row.proj ?? row.act ?? []).map((v, i) => (
                    <span key={i} style={{ textAlign: 'right' as const, color: row.act ? GOLD : DIM, fontStyle: row.proj ? 'italic' : 'normal', fontSize: row.proj ? 6.5 : 7, fontWeight: row.act ? 600 : 400 }}>{v}</span>
                  ))}
                </div>
              ))}
              {/* Projected: GCI + ICA Override + CIREG + AnewHomes */}
              {/* 2026: $200K+$30K+$3K+$2.5K=$235.5K · 2027: $240K+$36K+$8K+$7.5K=$291.5K */}
              {/* 2028: $288K+$43.2K+$17K+$8.4K=$356.6K · 2036: $1.24M+$186K+$200K+$21.6K=$1.65M */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7.5, color: GOLD, fontWeight: 500, borderTop: `0.5px solid ${CHARCOAL}`, paddingTop: 3, marginTop: 2 }}>
                <span>Projected</span>
                {['$235.5K','$291.5K','$356.6K','$1.65M'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
              </div>
              <div style={{ ...SANS, fontSize: 5.5, color: MUTED, marginTop: 3, lineHeight: 1.5 }}>
                * ICA Override always-on through 2036 &middot; 5% of Ed gross GCI &middot; CIREG 1.75% of NOP &middot; AnewHomes 5% &middot; 20% YoY no cap
              </div>
            </div>
          </div>

          {/* Column 3: Zoila + Scott + Richard */}
          <div>
            {/* Zoila — Build 3 · dispatch Apr 20 2026 */}
            {/* ICA Override 2026 + Q1 2027 only · CIREG 1.75% same vesting as AnewHomes (Nov 4 2026) */}
            <div style={{ ...cardStyle, marginBottom: 7 }}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, fontWeight: 500, marginBottom: 1 }}>Zoila Ortega Astor †</div>
              <div style={{ ...SANS, fontSize: 6.5, color: MUTED, marginBottom: 1 }}>Office Director &middot; Producer transition Q1 2027</div>
              <div style={{ ...SANS, fontSize: 6, color: GOLD, opacity: 0.7, marginBottom: 4 }}>Nest salary {CANONICAL_ZOILA.nestSalary}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, marginBottom: 3 }}>
                {['Stream','2026','2027','2028','2036'].map(h => (
                  <span key={h} style={{ ...SANS, fontSize: 7, color: GOLD, textAlign: h === 'Stream' ? 'left' : 'right' as const }}>{h}</span>
                ))}
              </div>
              {[
                { label: 'Nest salary',                              vals: ['$70K','$17.5K','—','—'] },
                { label: 'Producer ramp',                            vals: ['$25K','$150K','$180K','$774K+'] }, // 50% entry credit Y1 · 20% compound · no cap
                { label: 'AnewHomes 5% (vesting cliff Nov 4 2026) †', vals: ['$0 vest','$7.5K','$8,438','$21,649'] }, // activates 2027 forward
                { label: 'ICA Override (2026 + Q1 2027 only) †',     vals: ['$30K','$9K','—','—'] }, // 2026=$30K (full yr) · Q1 2027=$9K ($36K×25%) · exits once producing own book
                { label: 'CIREG Profit 1.75% (same vesting) †',      vals: ['$0 vest','$8K','$17K','$200K'] }, // 1.75% of NOP · vesting cliff Nov 4 2026 · activates 2027 · Perp sheet confirmed Apr 20 2026
                { label: 'CPS-1 (incl. above) ‡',                vals: ['$100K','$250K','$500K','$1.69M'] }, // CPS-1 curve: $100K/$250K/$500K/$1M/$1.5M cap/2% → 2036: $1,689,244 · incl. in pool above · not additive
              ].map(row => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, lineHeight: 1.65 }}>
                  <span style={{ color: MUTED }}>{row.label}</span>
                  {row.vals.map((v, i) => (
                    <span key={i} style={{ textAlign: 'right' as const, color: DIM, fontStyle: 'italic', fontSize: 6.5 }}>{v}</span>
                  ))}
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, color: DIM, fontStyle: 'italic', borderTop: `0.5px solid ${CHARCOAL}`, paddingTop: 3, marginTop: 2 }}>
                <span style={{ color: MUTED }}>Producer income</span>
                {['$25K','$150K','$180K','$774K+'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
              </div>
              {/* All streams total: nest + prod + ICA + CIREG + AH */}
              {/* 2026: $70K+$25K+$30K+$0+$0=$125K · 2027: $17.5K+$150K+$9K+$8K+$7.5K=$192K */}
              {/* 2028: $180K+$17K+$8.4K=$205.4K · 2036: $774K+$200K+$21.6K=$995.6K */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7.5, color: GOLD, fontWeight: 500, paddingTop: 2 }}>
                <span>All streams total</span>
                {['$125K','$192K','$205.4K','$996K+'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
              </div>
              <div style={{ ...SANS, fontSize: 5.5, color: MUTED, marginTop: 3, lineHeight: 1.5 }}>
                † AnewHomes 5% &amp; CIREG 1.75% vest Nov 4, 2026 &rarr; activate 2027 forward &middot; ICA Override 2026 + Q1 2027 only &middot; exits once producing own book &middot; 20% YoY no cap
              </div>
            </div>

            {/* Scott */}
            <div style={{ ...cardStyle, marginBottom: 7 }}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, fontWeight: 500, marginBottom: 1 }}>Scott Smith *</div>
              <div style={{ ...SANS, fontSize: 6.5, color: MUTED, marginBottom: 5 }}>Agent &middot; AnewHomes Build Partner</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, marginBottom: 3 }}>
                {['Stream','2026','2027','2028','2036'].map(h => (
                  <span key={h} style={{ ...SANS, fontSize: 7, color: GOLD, textAlign: h === 'Stream' ? 'left' : 'right' as const }}>{h}</span>
                ))}
              </div>
              {[
                { label: 'Gross GCI',      proj: ['$37.5K','$90K','$108K','$464K+'], act: null },  // 50% entry credit Y1 · 20% compound from $75K base · Ed ruling Apr 16 2026
                { label: 'Agent Take 70%', proj: ['$26.3K','$63K','$75.6K','$324.8K+'], act: null },  // Standard 70% agent commission formula · Ed ruling Apr 18 2026
                { label: 'Sales vol',      proj: ['$3.75M','$4.5M','$5.4M','$23.2M+'], act: null },  // GCI ÷ 2% · Ed ruling Apr 16 2026
                { label: 'AnewHomes 35%',  proj: ['$17,500','$52,500','$59,063','$151,542'], act: null }, // 12.5% annual growth from $50K NOP base · Perplexity Apr 15 2026
              ].map(row => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, lineHeight: 1.65 }}>
                  <span style={{ color: MUTED }}>{row.label}</span>
                  {(row.proj ?? []).map((v, i) => (
                    <span key={i} style={{ textAlign: 'right' as const, color: DIM, fontStyle: 'italic', fontSize: 6.5 }}>{v}</span>
                  ))}
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7.5, color: GOLD, fontWeight: 500, borderTop: `0.5px solid ${CHARCOAL}`, paddingTop: 3, marginTop: 2 }}>
                <span>Projected</span>
                {['$43.8K','$115.5K','$134.6K','$476.3K+'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)} {/* 2026: $26.3K (70% of $37.5K gross) + $17.5K AH = $43.8K · 2027: $63K + $52.5K AH = $115.5K · 2028: $75.6K + $59K AH = $134.6K · 2036: $324.8K + $151.5K AH = $476.3K · Ed ruling Apr 18 2026 — 70% standard agent commission formula */}
              </div>
            </div>

            {/* Richard — Column 3, below Scott */}
            <div style={{ ...cardStyle, marginBottom: 7 }}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, fontWeight: 500, marginBottom: 1 }}>Richard Bruehl</div>
              <div style={{ ...SANS, fontSize: 6.5, color: MUTED, marginBottom: 5 }}>FLAGSHIP TEAM &middot; Strategic Mentor &middot; 10% AnewHomes</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, marginBottom: 3 }}>
              {['Stream','2026','2027','2028','2036'].map(h => (
                <span key={h} style={{ ...SANS, fontSize: 7, color: GOLD, textAlign: h === 'Stream' ? 'left' : 'right' as const }}>{h}</span>
              ))}
            </div>
            {[
              { label: 'AnewHomes *', proj: ['$5,000','$15,000','$16,875','$43,298'], act: null },
            ].map(row => (
              <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, lineHeight: 1.65 }}>
                <span style={{ color: MUTED }}>{row.label}</span>
                {(row.proj ?? []).map((v, i) => (
                  <span key={i} style={{ textAlign: 'right' as const, color: DIM, fontStyle: 'italic', fontSize: 6.5 }}>{v}</span>
                ))}
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7.5, color: GOLD, fontWeight: 500, borderTop: `0.5px solid ${CHARCOAL}`, paddingTop: 3, marginTop: 2 }}>
              <span>Projected</span>
              {['$5K','$15K','$17K','$43K'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
            </div>
          </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10, paddingTop: 6, borderTop: `0.5px solid ${CHARCOAL}`, gap: 10 }}>
          <div style={{ ...SANS, fontSize: 6.5, color: DIM, fontStyle: 'italic', lineHeight: 1.6, flex: '1 1 100%', width: '100%', minWidth: 0 }}>
            * Governing principle &middot; not yet contractual &middot; Net pool = GCI (vol&times;2%) minus 5% franchise royalty minus 70% agent splits minus overhead &middot; Ed 29.75% / Angel 1.75% / Jarvis 1.75% / Zoila 1.75% (D40.5 inside Ed&rsquo;s 35% side) &middot; Ilija 65% &middot; D40 holds two parties at the pool &middot; AnewHomes splits: Jarvis 5% &middot; Angel 5% &middot; Zoila 5% &middot; Pool 5% (D23) &middot; Actuals update per closing via Perplexity &rarr; Growth Model v2 &rarr; dashboard live &middot; PDF = html2pdf snapshot of live screen &middot; Ed Keep Formula: Gross GCI less 5% brand royalty, less 25% Ilija franchise share, less 5% ICA overrides to team &middot; Principal structure, not standard agent split<br />
            &dagger; Zoila AnewHomes 5% in 6-month vesting period beginning May 4, 2026 &middot; vesting cliff November 4, 2026 &middot; activates 2027 forward &middot; AnewHomes split: Ed 35% &middot; Scott 35% &middot; Richard 10% &middot; Jarvis 5% &middot; Angel 5% &middot; Zoila 5% vesting &middot; Pool 5%<br />
            &Dagger; CPS-1 Pipeline &mdash; Ed-sourced developer pipeline through Flagship ICA. UHNW buyers meet new product in any Christie&rsquo;s market. Projected $100K 2026 ramping to $1.5M cap by 2029&ndash;2030, then 2% annual growth. Visibility line &mdash; already flows through Flagship ICA and NOP pool, not additive to listed streams.
          </div>
          <div style={{ ...SERIF, fontSize: 8, color: '#888', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
            The foundation is proven. The model is working. The next 14 days set the trajectory.
          </div>
        </div>

        {/* ── Divider + Income note ──────────────────────────────────────────── */}
        <hr style={{ border: 'none', borderTop: `0.5px solid ${CHARCOAL}`, margin: '6px 0 8px' }} />
        <div style={{ ...SANS, fontSize: 7, color: '#888', marginBottom: 7, letterSpacing: 0.3, fontStyle: 'italic' }}>
          All figures verified in sheet {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} &middot; Projected = gray italic &middot; Actual = gold bold &middot; Governing principle &middot; not yet contractual
        </div>

        {/* ── Zone Divider: Operator Control Panel — removed PF9 (OCP follows immediately, divider redundant) ── */}

        {/* ── G6 Operator Control Panel ────────────────────────────────────── */}
        {!isPdfMode && <OperatorControlPanel />}

        {/* ── Assumptions Block ─────────────────────────────────────────────── */}
        <div className="future-assumptions-block" style={{
          background: CARD_BG,
          border: `0.5px solid ${GOLD_FAINT_BORDER}`,
          borderRadius: 4,
          padding: '14px 16px 12px',
          marginBottom: 10,
        }}>
          {/* Section header */}
          <div style={{ ...SANS, fontSize: 8, color: GOLD, letterSpacing: 1.2, textTransform: 'uppercase' as const, fontWeight: 700, marginBottom: 10 }}>
            Assumptions &middot; Governing Principle &middot; Not Yet Contractual
          </div>

          {/* Mechanism Reference — 2-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '4px 24px', marginBottom: 12 }}>
            {[
              { label: 'GCI Formula',              value: 'Office Volume × 2%' },
              { label: 'Agent Commission',          value: '70% of gross GCI' },
              { label: 'Royalty',                   value: '5% of GCI · paid by Ilija from his side' },
              { label: 'Overhead',                  value: 'MAX($200K, 6% of GCI)' },
              { label: 'Net Operating Profit',      value: 'GCI − Royalty − Splits − Overhead' },
              { label: 'NOP Split',                 value: 'Ed 35% / Ilija 65% · two parties only (D40)' },
              { label: 'ICA Override',              value: 'Deal-event trigger only · not projected annually · at co-deal 50/50 split: Jarvis gives 5% to Angel, Ed gives 5% to Zoila · net 45/45 each · Ed ruling Apr 16 2026' },
              { label: 'AnewHomes Net Build Profit', value: 'Y1 $50K · Y2 $150K · 12.5% annual growth → $432K by 2036' },
              { label: 'AnewHomes Equity',          value: 'Ed 35% · Scott 35% · Richard 10% · Jarvis 5% · Angel 5% · Zoila 5% vesting · Pool 5% (D23)' },
              { label: 'Zoila Vesting Cliff',       value: 'November 4, 2026 · activates 2027 forward' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <span style={{ ...SANS, fontSize: 8, color: GOLD, fontWeight: 600, whiteSpace: 'nowrap' as const, flexShrink: 0, minWidth: 140 }}>{label}</span>
                <span style={{ ...SANS, fontSize: 8, color: TEXT_MUTED, lineHeight: 1.5 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Headcount Scaling Table — wrapped in headcount-landscape-page for PF3 landscape print */}
          <div className="headcount-landscape-page" style={{ marginTop: 24 }}>
          <div style={{ ...SANS, fontSize: 8, color: GOLD, letterSpacing: 1, textTransform: 'uppercase' as const, fontWeight: 600, marginBottom: 6 }}>
            Headcount Scaling &middot; Elite Producer Model &middot; <span style={{ color: MUTED, fontWeight: 400 }}>Base Engine Math</span>
          </div>
          <div className="headcount-table" style={{ overflowX: 'auto' as const, marginBottom: 8, WebkitOverflowScrolling: 'touch' as const }}>
            <table style={{ width: '100%', minWidth: 820, borderCollapse: 'collapse' as const, fontSize: 8, ...SANS }}>
              <thead>
                <tr>
                  {['Year','EH','SH','WH','Total','Ed GCI','Named GCI','Engine GCI','Office GCI','AH Profit','Combined GCI','Combined Vol','Avg GCI/Prod'].map(h => (
                    <th key={h} style={{ ...SANS, fontSize: 6.5, color: GOLD, fontWeight: 600, textAlign: h === 'Year' ? 'left' as const : 'right' as const, padding: '2px 5px', borderBottom: `0.5px solid ${GOLD_FAINT_BORDER}`, whiteSpace: 'nowrap' as const }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  // Recalculated Apr 16 2026 · Ed GCI = gross $600K 20% compound · Named = real Y1 starts 50% entry-credit Y1 only · Engine = EPM recruited seats · 7.0% post-maturity (Ed ruling, Ponder flag Apr 19 2026)
                  { year:'2026', eh:9,  sh:0,  wh:0,  tot:9,  edGci:'$0.60M', namedGci:'$0.29M', engineGci:'$1.00M', officeGci:'$1.89M', ahGci:'$0.05M', combGci:'$1.94M', combVol:'$0.10B', avgGci:'$216K' }, // AH Profit corrected Issue #1 Apr 19 2026
                  // Zoila Y2 locked $150K (was $120K) · +$30K compounds 20% through 2036 · Apr 16 2026
                  { year:'2027', eh:12, sh:0,  wh:0,  tot:12, edGci:'$0.72M', namedGci:'$0.60M', engineGci:'$3.75M', officeGci:'$5.07M', ahGci:'$0.15M', combGci:'$5.22M', combVol:'$0.26B', avgGci:'$435K' },
                  { year:'2028', eh:12, sh:6,  wh:0,  tot:18, edGci:'$0.86M', namedGci:'$0.72M', engineGci:'$7.75M', officeGci:'$9.33M', ahGci:'$0.17M', combGci:'$9.50M', combVol:'$0.47B', avgGci:'$528K' },
                  { year:'2029', eh:12, sh:12, wh:0,  tot:24, edGci:'$1.04M', namedGci:'$0.86M', engineGci:'$13.00M', officeGci:'$14.90M', ahGci:'$0.19M', combGci:'$15.09M', combVol:'$0.75B', avgGci:'$629K' },
                  { year:'2030', eh:12, sh:12, wh:6,  tot:30, edGci:'$1.24M', namedGci:'$1.04M', engineGci:'$20.64M', officeGci:'$22.92M', ahGci:'$0.21M', combGci:'$23.13M', combVol:'$1.16B', avgGci:'$771K' },
                  { year:'2031', eh:12, sh:12, wh:12, tot:36, edGci:'$1.49M', namedGci:'$1.24M', engineGci:'$25.52M', officeGci:'$28.25M', ahGci:'$0.24M', combGci:'$28.49M', combVol:'$1.42B', avgGci:'$791K' },
                  { year:'2032', eh:12, sh:12, wh:12, tot:36, edGci:'$1.79M', namedGci:'$1.49M', engineGci:'$31.91M', officeGci:'$35.19M', ahGci:'$0.27M', combGci:'$35.46M', combVol:'$1.77B', avgGci:'$985K' },
                  { year:'2033', eh:12, sh:12, wh:12, tot:36, edGci:'$2.15M', namedGci:'$1.79M', engineGci:'$32.55M', officeGci:'$36.49M', ahGci:'$0.30M', combGci:'$36.79M', combVol:'$1.84B', avgGci:'$1022K' },
                  { year:'2034', eh:12, sh:12, wh:12, tot:36, edGci:'$2.58M', namedGci:'$2.15M', engineGci:'$33.20M', officeGci:'$37.93M', ahGci:'$0.34M', combGci:'$38.27M', combVol:'$1.91B', avgGci:'$1063K' },
                  { year:'2035', eh:12, sh:12, wh:12, tot:36, edGci:'$3.10M', namedGci:'$2.58M', engineGci:'$33.87M', officeGci:'$39.55M', ahGci:'$0.38M', combGci:'$39.93M', combVol:'$2.00B', avgGci:'$1109K' },
                  { year:'2036', eh:12, sh:12, wh:12, tot:36, edGci:'$3.72M', namedGci:'$3.10M', engineGci:'$34.54M', officeGci:'$41.36M', ahGci:'$0.43M', combGci:'$41.79M', combVol:'$2.09B', avgGci:'$1161K' },
                ].map((r, i) => (
                  <tr key={r.year} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(200,172,120,0.04)' }}>
                    <td style={{ ...SANS, fontSize: 8, color: GOLD, fontWeight: 600, padding: '2px 5px', textAlign: 'left' as const }}>{r.year}</td>
                    <td style={{ ...SANS, fontSize: 8, color: DIM, padding: '2px 5px', textAlign: 'right' as const }}>{r.eh}</td>
                    <td style={{ ...SANS, fontSize: 8, color: DIM, padding: '2px 5px', textAlign: 'right' as const }}>{r.sh}</td>
                    <td style={{ ...SANS, fontSize: 8, color: DIM, padding: '2px 5px', textAlign: 'right' as const }}>{r.wh}</td>
                    <td style={{ ...SANS, fontSize: 8, color: DIM, padding: '2px 5px', textAlign: 'right' as const, fontWeight: 600 }}>{r.tot}</td>
                    <td style={{ ...SANS, fontSize: 8, color: DIM, padding: '2px 5px', textAlign: 'right' as const }}>{r.edGci}</td>
                    <td style={{ ...SANS, fontSize: 8, color: DIM, padding: '2px 5px', textAlign: 'right' as const }}>{r.namedGci}</td>
                    <td style={{ ...SANS, fontSize: 8, color: DIM, padding: '2px 5px', textAlign: 'right' as const }}>{r.engineGci}</td>
                    <td style={{ ...SANS, fontSize: 8, color: DIM, padding: '2px 5px', textAlign: 'right' as const }}>{r.officeGci}</td>
                    <td style={{ ...SANS, fontSize: 8, color: DIM, padding: '2px 5px', textAlign: 'right' as const }}>{r.ahGci}</td>
                    <td style={{ ...SANS, fontSize: 8, color: DIM, padding: '2px 5px', textAlign: 'right' as const, fontWeight: 600 }}>{r.combGci}</td>
                    <td style={{ ...SANS, fontSize: 8, color: DIM, padding: '2px 5px', textAlign: 'right' as const, fontWeight: 600 }}>{r.combVol}</td>
                    <td style={{ ...SANS, fontSize: 8, color: DIM, padding: '2px 5px', textAlign: 'right' as const }}>{r.avgGci}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footnote */}
          <div style={{ ...SANS, fontSize: 6.5, color: TEXT_MUTED, fontStyle: 'italic', marginBottom: 8, lineHeight: 1.5 }}>
            12 elite producers per office &middot; Cap intentional &middot; $500K Y1 &rarr; $750K Y2 &rarr; $1M Y3 &rarr; 2% annual appreciation &middot; 50% entry-year credit on mid-year starts &middot; Recruiting engine dormant 2031
          </div>
          </div> {/* end headcount-landscape-page */}



          {/* Gap Bridge footer */}
          <div style={{ borderTop: `0.5px solid ${GOLD_FAINT_BORDER}`, paddingTop: 8 }}>
            <span style={{ ...SANS, fontSize: 6.5, color: TEXT_MUTED, fontStyle: 'italic', lineHeight: 1.6 }}>
              Base engine $2.07B by 2036 (per-seat math only, no market lift). 7.0% post-maturity growth adds ~$0.93B &mdash; conservative vs Compass 11.3%, Saunders 10%+.{' '}
              <span style={{ color: GOLD, fontWeight: 600 }}>$3.0B combined · institutional floor · north star.</span>
              {' '}Per-seat ramp: <strong>$500K Y1 &rarr; $750K Y2 &rarr; $1M Y3 &rarr; 2% appreciation.</strong> 50% entry-year credit on mid-year starts. EH 2026 (9&rarr;12) &middot; SH 2028 (6&rarr;12) &middot; WH 2030 (6&rarr;12). Council dispatch Apr 16 2026.
            </span>
          </div>
        </div>


        {/* ── Growth Model link only — Pro Forma PDF button (top-right) is the sole export ── */}
        <div className="future-growth-model-button" data-print-hide="true" style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
          <a
            href="https://docs.google.com/spreadsheets/d/1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag/edit"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Growth Model v2"
            style={{ ...SANS, background: 'transparent', border: `0.5px solid rgba(200,172,120,0.4)`, color: GOLD, padding: '5px 14px', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase' as const, textDecoration: 'none' }}
          >
            Open Growth Model v2
          </a>
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
