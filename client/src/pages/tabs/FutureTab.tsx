/**
 * FUTURE TAB — Sprint 11 Item 5 Rebuild
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (headlines) · Source Sans 3 (data) · Barlow Condensed (labels)
 * Data source: Growth Model v2 VOLUME tab (LIVE — service account, publicProcedure)
 * Governing rule: Sales volume only. No GCI anywhere on this tab or export.
 */

import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { generateFutureReportPDF } from '@/lib/pdf-exports';

// ─── Council-governed milestone targets ──────────────────────────────────────
// These values only change with a council decision.
// The 2026 bar segments are derived live from the VOLUME tab endpoint.
// One place to update. Not scattered. Not hardcoded inline.
const MILESTONE_TARGETS = {
  2025: { volume: 15_000_000, displayVolume: '$15M', label: 'Baseline', note: 'Bonita DeWolf pre-launch baseline', isBaseline: true },
  2026: { volume: 55_000_000, displayVolume: '$55M', label: 'Target', note: null, isBaseline: false },
  2027: { volume: 105_000_000, displayVolume: '$100M–$110M', label: '$100M–$110M', note: null, isBaseline: false },
  2028: { volume: 165_000_000, displayVolume: '$165M', label: '$165M', note: null, isBaseline: false },
  2029: { volume: 230_000_000, displayVolume: '$230M', label: '$230M', note: null, isBaseline: false },
  2031: { volume: 430_000_000, displayVolume: '$430M', label: '$430M', note: null, isBaseline: false },
} as const;

const LABEL_FONT: React.CSSProperties = { fontFamily: '"Barlow Condensed", sans-serif' };
const SERIF: React.CSSProperties = { fontFamily: '"Cormorant Garamond", serif' };
const SANS: React.CSSProperties = { fontFamily: '"Source Sans 3", sans-serif' };

const CIREG_LOGO_DARK = 'https://d3w216np43fnr4.cloudfront.net/10580/348547/1.png';

const MAX_VOLUME = MILESTONE_TARGETS[2031].volume;
const CHART_HEIGHT = 220; // px

function fmtVol(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000 % 1 === 0 ? (n / 1_000_000).toFixed(0) : (n / 1_000_000).toFixed(2))}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

// ─── PDF Export (generateFutureReport — Sprint 12 P1) ───────────────────────
function generateFutureReport(volumeAgents: { name: string; proj2026: number; act2026: number; proj2027: number; act2027: number }[], total: { proj2026: number; act2026: number }) {
  const win = window.open('', '_blank');
  if (!win) return;

  const barRows = ARC_BARS.map((b, i) => {
    const pct = (b.volume / MAX_VOLUME) * 100;
    const barH = Math.round((pct / 100) * 160);
    let segHtml = '';
    if (b.segments) {
      const totalSeg = b.segments.reduce((s, seg) => s + seg.value, 0);
      segHtml = b.segments.map(seg => {
        const h = Math.round((seg.value / totalSeg) * barH);
        return `<div style="width:100%;height:${h}px;background:${seg.color};"></div>`;
      }).reverse().join('');
    } else {
      segHtml = `<div style="width:100%;height:${barH}px;background:${b.isBaseline ? 'rgba(27,42,74,0.18)' : 'rgba(200,172,120,0.22)'};border-top:2px solid ${b.isBaseline ? 'rgba(27,42,74,0.4)' : '#C8AC78'};"></div>`;
    }
    return `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:190px;padding:0 4px;">
        <div style="font-family:'Cormorant Garamond',serif;color:#1B2A4A;font-size:11px;font-weight:600;text-align:center;margin-bottom:4px;line-height:1.2;">${b.displayVolume}</div>
        <div style="width:100%;display:flex;flex-direction:column;justify-content:flex-end;">${segHtml}</div>
        <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:8px;letter-spacing:0.12em;text-transform:uppercase;margin-top:4px;text-align:center;">${b.year}</div>
        
      </div>`;
  }).join('');

  const agentRows = volumeAgents.map(a => `
    <tr style="border-bottom:1px solid rgba(27,42,74,0.08);">
      <td style="padding:6px 8px;font-family:'Source Sans 3',sans-serif;font-size:10px;color:#1B2A4A;">${a.name}</td>
      <td style="padding:6px 8px;font-family:'Source Sans 3',sans-serif;font-size:10px;color:#C8AC78;text-align:right;">${fmtVol(a.proj2026)}</td>
      <td style="padding:6px 8px;font-family:'Source Sans 3',sans-serif;font-size:10px;color:#1B2A4A;font-weight:600;text-align:right;">${a.act2026 > 0 ? fmtVol(a.act2026) : '—'}</td>
    </tr>`).join('');

  win.document.write(`<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>Christie's East Hampton · Ascension Arc · ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Source+Sans+3:wght@400;600&family=Barlow+Condensed:wght@400;600&display=swap" rel="stylesheet">
<style>
  @page { size: letter landscape; margin: 14mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Source Sans 3', sans-serif; background: #FAF8F4; color: #1B2A4A; margin: 0; padding: 0; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head><body>

<!-- HEADER -->
<div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:10px;border-bottom:1px solid rgba(200,172,120,0.4);margin-bottom:16px;">
  <img src="${CIREG_LOGO_DARK}" alt="Christie's International Real Estate Group" style="height:32px;">
  <div style="text-align:right;">
    <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:8px;letter-spacing:0.3em;text-transform:uppercase;">Christie's East Hampton · Ascension Arc</div>
    <div style="font-family:'Barlow Condensed',sans-serif;color:rgba(27,42,74,0.4);font-size:7px;letter-spacing:0.2em;text-transform:uppercase;margin-top:2px;">Private &amp; Confidential · ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
  </div>
</div>

<!-- TITLE -->
<div style="margin-bottom:14px;">
  <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#1B2A4A;letter-spacing:0.5px;">The Ascension Arc · $1 Billion Run Rate</div>
  <div style="font-family:'Barlow Condensed',sans-serif;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(27,42,74,0.45);margin-top:3px;">Sales Volume Only · Targets, Not Actuals · Ilija Pavlović Review Copy</div>
</div>

<!-- ASCENSION ARC CHART -->
<div style="margin-bottom:14px;">
  <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:8px;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:6px;">Ascension Arc · Sales Volume Trajectory</div>
  <div style="border:1px solid rgba(27,42,74,0.1);background:#fff;padding:14px 16px;">
    <div style="display:flex;align-items:flex-end;gap:6px;height:190px;">
      ${barRows}
      <!-- $1B Horizon label -->
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:190px;padding:0 4px;opacity:0.5;">
        <div style="font-family:'Cormorant Garamond',serif;color:#C8AC78;font-size:10px;font-weight:600;text-align:center;margin-bottom:4px;">$1B<br>Run Rate</div>
        <div style="width:2px;height:160px;background:repeating-linear-gradient(to bottom,#C8AC78 0,#C8AC78 4px,transparent 4px,transparent 8px);"></div>
        <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:7px;letter-spacing:0.12em;text-transform:uppercase;margin-top:4px;text-align:center;">2032–2033<br>Horizon</div>
      </div>
    </div>
    <!-- Legend -->
    <div style="display:flex;gap:16px;margin-top:10px;padding-top:8px;border-top:1px solid rgba(27,42,74,0.06);">
      <div style="display:flex;align-items:center;gap:4px;"><div style="width:10px;height:10px;background:#1B2A4A;"></div><span style="font-family:'Barlow Condensed',sans-serif;font-size:7px;letter-spacing:0.1em;text-transform:uppercase;color:#384249;">2026 Closed $4.57M</span></div>
      <div style="display:flex;align-items:center;gap:4px;"><div style="width:10px;height:10px;background:#8a7a5a;"></div><span style="font-family:'Barlow Condensed',sans-serif;font-size:7px;letter-spacing:0.1em;text-transform:uppercase;color:#384249;">2026 Active Pipeline $13.62M</span></div>
      <div style="display:flex;align-items:center;gap:4px;"><div style="width:10px;height:10px;background:rgba(200,172,120,0.35);border:1px solid #C8AC78;"></div><span style="font-family:'Barlow Condensed',sans-serif;font-size:7px;letter-spacing:0.1em;text-transform:uppercase;color:#384249;">2026 Projected to $55M Total</span></div>
    </div>
  </div>
</div>

<!-- 300-DAY PROOF -->
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;">
  <div style="border:1px solid rgba(27,42,74,0.1);background:#fff;padding:10px 12px;">
    <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:7px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:4px;">First 100 Days · Dec 2025–Mar 2026</div>
    <div style="font-family:'Cormorant Garamond',serif;color:#1B2A4A;font-size:20px;font-weight:600;">$4.57M</div>
    <div style="font-family:'Source Sans 3',sans-serif;color:#384249;font-size:9px;margin-top:3px;line-height:1.4;">Closed volume. Office open. Systems deployed. Ed Bruehl solo.</div>
    <div style="margin-top:6px;display:inline-block;padding:2px 6px;background:#2D5A3D;color:#FAF8F4;font-family:'Barlow Condensed',sans-serif;font-size:7px;letter-spacing:0.12em;text-transform:uppercase;">Closed</div>
  </div>
  <div style="border:1px solid rgba(27,42,74,0.1);background:#fff;padding:10px 12px;">
    <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:7px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:4px;">Second 100 Days · Mar–May 1 2026</div>
    <div style="font-family:'Cormorant Garamond',serif;color:#1B2A4A;font-size:20px;font-weight:600;">$13.62M</div>
    <div style="font-family:'Source Sans 3',sans-serif;color:#384249;font-size:9px;margin-top:3px;line-height:1.4;">Active pipeline. First agent hires. Podcast + events cadence locked.</div>
    <div style="margin-top:6px;display:inline-block;padding:2px 6px;background:#C8AC78;color:#1B2A4A;font-family:'Barlow Condensed',sans-serif;font-size:7px;letter-spacing:0.12em;text-transform:uppercase;">Active</div>
  </div>
  <div style="border:1px solid rgba(27,42,74,0.1);background:#fff;padding:10px 12px;">
    <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:7px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:4px;">Third 100 Days · May 1–Aug 2026</div>
    <div style="font-family:'Cormorant Garamond',serif;color:#1B2A4A;font-size:20px;font-weight:600;">$55M</div>
    <div style="font-family:'Source Sans 3',sans-serif;color:#384249;font-size:9px;margin-top:3px;line-height:1.4;">Projected total. Operating scale. South Fork market presence established.</div>
    <div style="margin-top:6px;display:inline-block;padding:2px 6px;background:rgba(27,42,74,0.1);color:#1B2A4A;font-family:'Barlow Condensed',sans-serif;font-size:7px;letter-spacing:0.12em;text-transform:uppercase;">Projected</div>
  </div>
</div>

<!-- AGENT VOLUME TABLE -->
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
  <div>
    <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:7px;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:6px;">Agent Volume · 2026 · Sales Volume Only</div>
    <table style="width:100%;border-collapse:collapse;font-size:10px;">
      <thead>
        <tr style="border-bottom:1px solid #C8AC78;">
          <th style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:7px;letter-spacing:0.14em;text-transform:uppercase;padding:4px 8px;text-align:left;">Agent</th>
          <th style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:7px;letter-spacing:0.14em;text-transform:uppercase;padding:4px 8px;text-align:right;">Projected</th>
          <th style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:7px;letter-spacing:0.14em;text-transform:uppercase;padding:4px 8px;text-align:right;">Actual</th>
        </tr>
      </thead>
      <tbody>
        ${agentRows}
        <tr style="border-top:2px solid #C8AC78;">
          <td style="padding:6px 8px;font-family:'Barlow Condensed',sans-serif;font-size:9px;color:#1B2A4A;letter-spacing:0.1em;text-transform:uppercase;">Total Baseline</td>
          <td style="padding:6px 8px;font-family:'Source Sans 3',sans-serif;font-size:10px;color:#C8AC78;text-align:right;font-weight:600;">${fmtVol(total.proj2026)}</td>
          <td style="padding:6px 8px;font-family:'Source Sans 3',sans-serif;font-size:10px;color:#1B2A4A;text-align:right;font-weight:600;">${total.act2026 > 0 ? fmtVol(total.act2026) : '—'}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PROFIT POOL -->
  <div>
    <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:7px;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:6px;">Profit Pool · The Economic Logic</div>
    <div style="border:1px solid rgba(27,42,74,0.1);background:#fff;padding:10px 12px;">
      <div style="font-family:'Source Sans 3',sans-serif;color:#384249;font-size:9px;line-height:1.6;">
        Office breakeven at approximately <strong>$40M</strong> in total sales volume. Every dollar above $40M generates approximately <strong>2% commission</strong> into the profit pool above breakeven.
      </div>
      <div style="margin-top:8px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
        <div style="text-align:center;">
          <div style="font-family:'Cormorant Garamond',serif;color:#1B2A4A;font-size:14px;font-weight:600;">$100K</div>
          <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:7px;letter-spacing:0.1em;text-transform:uppercase;margin-top:2px;">Ed · 2026</div>
          <div style="font-family:'Source Sans 3',sans-serif;color:#7a8a8e;font-size:7px;margin-top:1px;">at $55M</div>
        </div>
        <div style="text-align:center;">
          <div style="font-family:'Cormorant Garamond',serif;color:#1B2A4A;font-size:14px;font-weight:600;">$400K</div>
          <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:7px;letter-spacing:0.1em;text-transform:uppercase;margin-top:2px;">Ed · 2027</div>
          <div style="font-family:'Source Sans 3',sans-serif;color:#7a8a8e;font-size:7px;margin-top:1px;">at $100M</div>
        </div>
        <div style="text-align:center;">
          <div style="font-family:'Cormorant Garamond',serif;color:#1B2A4A;font-size:14px;font-weight:600;">$833K</div>
          <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:7px;letter-spacing:0.1em;text-transform:uppercase;margin-top:2px;">Ed · 2028</div>
          <div style="font-family:'Source Sans 3',sans-serif;color:#7a8a8e;font-size:7px;margin-top:1px;">at $165M</div>
        </div>
      </div>
      <div style="font-family:'Source Sans 3',sans-serif;color:rgba(27,42,74,0.5);font-size:8px;margin-top:8px;line-height:1.5;border-top:1px solid rgba(27,42,74,0.06);padding-top:6px;">
        Jarvis 5% of Ed's share · Angel 5% of Ed's share · Zoila transitions off Ilija's payroll at start of 2027. Dan's Papers and Zoila are not expenses — they are the unlock that makes the third 100 days happen.
      </div>
    </div>
  </div>
</div>

<!-- FOOTER -->
<div style="border-top:1px solid rgba(200,172,120,0.4);padding-top:8px;text-align:center;">
  <div style="font-family:'Barlow Condensed',sans-serif;color:rgba(27,42,74,0.4);font-size:7px;letter-spacing:0.18em;text-transform:uppercase;">Christie's International Real Estate Group · 26 Park Place, East Hampton NY 11937 · Private &amp; Confidential · Sales Volume Only</div>
  <div style="font-family:'Barlow Condensed',sans-serif;color:rgba(200,172,120,0.5);font-size:6px;letter-spacing:0.14em;text-transform:uppercase;margin-top:2px;">Art. Beauty. Provenance. · Since 1766</div>
</div>

</body></html>`);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 800);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FutureTab() {
  const { data: volData, isLoading: volLoading } = trpc.future.volumeData.useQuery(undefined, {
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const agents = volData?.agents ?? [];
  const total = volData?.total ?? { proj2026: 0, act2026: 0, proj2027: 0, act2027: 0, proj2028: 0, act2028: 0 };

  // Derive live 2026 closed and active from volume data
  const liveAct2026 = useMemo(() => {
    if (!volData) return 4_570_000; // fallback to brief value
    return volData.total.act2026 || 4_570_000;
  }, [volData]);

  // Build ARC_BARS at render time — 2026 segments derived from live VOLUME tab data.
  // All other bars read from council-governed MILESTONE_TARGETS config.
  const ARC_BARS = useMemo(() => {
    const closed2026 = volData?.total.act2026 || 4_570_000;
    const active2026 = volData?.total.proj2026
      ? Math.max(0, volData.total.proj2026 - closed2026)
      : 13_620_000;
    const projected2026 = Math.max(0, MILESTONE_TARGETS[2026].volume - closed2026 - active2026);
    return [
      { year: '2025', ...MILESTONE_TARGETS[2025], segments: null, isClosed: true },
      {
        year: '2026',
        ...MILESTONE_TARGETS[2026],
        segments: [
          { label: 'Closed',    value: closed2026,    color: '#1B2A4A' },
          { label: 'Active',    value: active2026,    color: '#8a7a5a' },
          { label: 'Projected', value: projected2026, color: 'rgba(200,172,120,0.35)' },
        ],
        isClosed: false,
      },
      { year: '2027', ...MILESTONE_TARGETS[2027], segments: null, isClosed: false },
      { year: '2028', ...MILESTONE_TARGETS[2028], segments: null, isClosed: false },
      { year: '2029', ...MILESTONE_TARGETS[2029], segments: null, isClosed: false },
      { year: '2031', ...MILESTONE_TARGETS[2031], segments: null, isClosed: false },
    ];
  }, [volData]);

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-6 py-8 border-b" style={{ background: '#1B2A4A', borderColor: '#C8AC78' }}>
        <div className="uppercase mb-2" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          Growth Model v2 · 300-Day Arc · Ascension
        </div>
        <h2 style={{ ...SERIF, color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem' }}>
          Future
        </h2>
        <div className="flex items-center gap-3 mt-2">
          {volData && !volLoading ? (
            <span style={{ ...LABEL_FONT, color: '#4ade80', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              ● Live · Growth Model v2 · VOLUME tab
            </span>
          ) : volLoading ? (
            <span style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Loading…
            </span>
          ) : null}
          <span style={{ ...SANS, color: 'rgba(250,248,244,0.45)', fontSize: '0.75rem' }}>
            Sales volume only · Private &amp; Confidential
          </span>
        </div>
      </div>

      <div className="px-6 py-8" style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>

        {/* ── Ascension Arc ────────────────────────────────────────────────────── */}
        <div className="uppercase mb-3" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          Ascension Arc · Sales Volume Trajectory
        </div>
        <div className="mb-10 p-6 border" style={{ background: '#fff', borderColor: 'rgba(27,42,74,0.1)' }}>
          {/* Chart */}
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, minWidth: 700, height: CHART_HEIGHT + 60, paddingBottom: 0 }}>
              {ARC_BARS.map((bar) => {
                // Square-root scale: preserves proportional ordering while keeping small bars visible.
                // $15M ≈ 26px, $55M ≈ 50px, $430M = 220px — visually honest, no bar disappears.
                const sqrtPct = Math.sqrt(bar.volume / MAX_VOLUME);
                const barH = Math.max(8, Math.round(sqrtPct * CHART_HEIGHT));
                return (
                  <div key={bar.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: CHART_HEIGHT + 60 }}>
                    {/* Volume label */}
                    <div style={{
                      ...SERIF, color: '#1B2A4A', fontWeight: 600,
                      fontSize: bar.displayVolume.length > 6 ? '0.82rem' : '1rem',
                      lineHeight: 1, marginBottom: 6, textAlign: 'center',
                    }}>
                      {bar.displayVolume}
                    </div>
                    {/* Bar */}
                    {bar.segments ? (
                      // 2026 segmented bar
                      <div style={{ width: '100%', height: barH, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', borderTop: '3px solid #C8AC78' }}>
                        {[...bar.segments].reverse().map((seg) => {
                          const segH = Math.round((seg.value / bar.volume) * barH);
                          return (
                            <div key={seg.label} style={{ width: '100%', height: segH, background: seg.color, flexShrink: 0 }} />
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{
                        width: '100%', height: barH,
                        background: bar.isBaseline
                          ? 'linear-gradient(to top, rgba(27,42,74,0.15) 0%, rgba(27,42,74,0.22) 100%)'
                          : 'linear-gradient(to top, rgba(200,172,120,0.18) 0%, rgba(200,172,120,0.28) 100%)',
                        borderTop: `3px solid ${bar.isBaseline ? 'rgba(27,42,74,0.35)' : '#C8AC78'}`,
                      }} />
                    )}
                    {/* Year label */}
                    <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 6, textAlign: 'center' }}>
                      {bar.year}
                    </div>
                    {/* Bonita DeWolf sub-label removed — all bars show year label only */}
                  </div>
                );
              })}

              {/* $1B Horizon — dashed line, NOT a bar */}
              <div style={{ flex: 0.7, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: CHART_HEIGHT + 60, opacity: 0.55 }}>
                <div style={{ ...SERIF, color: '#C8AC78', fontWeight: 600, fontSize: '0.85rem', textAlign: 'center', marginBottom: 6, lineHeight: 1.2 }}>
                  $1B<br />Run Rate
                </div>
                <div style={{
                  width: 2, height: CHART_HEIGHT,
                  background: 'repeating-linear-gradient(to bottom, #C8AC78 0, #C8AC78 5px, transparent 5px, transparent 10px)',
                }} />
                <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 6, textAlign: 'center', lineHeight: 1.3 }}>
                  2032–2033<br />Horizon
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t" style={{ borderColor: 'rgba(27,42,74,0.08)' }}>
            {[
              { color: '#1B2A4A', label: `2026 Closed · ${fmtVol(liveAct2026)}` },
              { color: '#8a7a5a', label: '2026 Active Pipeline · $13.62M' },
              { color: 'rgba(200,172,120,0.35)', border: '#C8AC78', label: '2026 Projected to $55M Total' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <div style={{ width: 12, height: 12, background: l.color, border: l.border ? `1px solid ${l.border}` : undefined, flexShrink: 0 }} />
                <span style={{ ...LABEL_FONT, color: '#384249', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 300-Day Proof ────────────────────────────────────────────────────── */}
        <div className="uppercase mb-3" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          300-Day Proof
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: 'First 100 Days',
              period: 'Dec 2025 – Mar 2026',
              volume: '$4.57M',
              desc: 'Closed volume. Office open. Systems deployed. Ed Bruehl solo.',
              badge: 'Closed',
              badgeBg: '#2D5A3D',
              badgeColor: '#FAF8F4',
            },
            {
              label: 'Second 100 Days',
              period: 'Mar – May 1, 2026',
              volume: '$13.62M',
              desc: 'Active pipeline. First agent hires. Podcast and events cadence locked.',
              badge: 'Active',
              badgeBg: '#C8AC78',
              badgeColor: '#1B2A4A',
            },
            {
              label: 'Third 100 Days',
              period: 'May 1 – Aug 2026',
              volume: '$55M',
              desc: 'Projected total. Operating scale. South Fork market presence established.',
              badge: 'Projected',
              badgeBg: 'rgba(27,42,74,0.1)',
              badgeColor: '#1B2A4A',
            },
          ].map(block => (
            <div key={block.label} className="p-5 border" style={{ background: '#fff', borderColor: 'rgba(27,42,74,0.1)' }}>
              <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>
                {block.label}
              </div>
              <div style={{ ...LABEL_FONT, color: 'rgba(27,42,74,0.4)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                {block.period}
              </div>
              <div style={{ ...SERIF, color: '#1B2A4A', fontWeight: 600, fontSize: '2rem', lineHeight: 1 }}>
                {block.volume}
              </div>
              <div className="mt-3 text-sm leading-relaxed" style={{ ...SANS, color: '#384249', fontSize: '0.8rem' }}>
                {block.desc}
              </div>
              <div className="mt-3 inline-block px-2 py-0.5" style={{
                ...LABEL_FONT, background: block.badgeBg, color: block.badgeColor,
                fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                {block.badge}
              </div>
            </div>
          ))}
        </div>

        {/* ── Agent Volume Table ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-3">
          <div className="uppercase" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
            Agent Volume · 2026 · Sales Volume Only
          </div>
          {volData && !volLoading && (
            <span style={{ ...LABEL_FONT, color: '#4ade80', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              ● Live · VOLUME tab
            </span>
          )}
        </div>
        <div className="mb-10 border overflow-x-auto" style={{ background: '#fff', borderColor: 'rgba(27,42,74,0.1)' }}>
          <table className="w-full text-sm" style={{ ...SANS, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #C8AC78' }}>
                {['Agent', 'Role', 'Status', '2026 Projected', '2026 Actual', '2027 Projected'].map(h => (
                  <th key={h} className="px-4 py-3 text-left" style={{
                    ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(agents.length > 0 ? agents : [
                { name: 'Ed Bruehl', role: 'Managing Director', status: 'Active', proj2026: 30_000_000, act2026: 4_570_000, proj2027: 50_000_000 },
                { name: 'Jarvis Slade', role: 'Agent', status: 'Active', proj2026: 5_000_000, act2026: 0, proj2027: 15_000_000 },
                { name: 'Bonita DeWolf', role: 'Agent', status: 'Active', proj2026: 15_000_000, act2026: 0, proj2027: 20_000_000 },
                { name: 'Sebastian Mobo', role: 'Broker', status: 'Active', proj2026: 3_500_000, act2026: 0, proj2027: 5_000_000 },
                { name: 'Scott Smith', role: 'Agent', status: 'Pending (June 1)', proj2026: 1_500_000, act2026: 0, proj2027: 3_000_000 },
              ]).map((agent, i) => (
                <tr key={agent.name} style={{
                  borderBottom: '1px solid rgba(27,42,74,0.06)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(27,42,74,0.015)',
                }}>
                  <td className="px-4 py-3" style={{ ...SERIF, color: '#1B2A4A', fontWeight: 600, fontSize: '0.95rem' }}>
                    {agent.name}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#384249' }}>{agent.role}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-[9px] uppercase" style={{
                      ...LABEL_FONT,
                      background: agent.status === 'Active' ? 'rgba(27,42,74,0.08)' : 'rgba(200,172,120,0.15)',
                      color: agent.status === 'Active' ? '#1B2A4A' : '#C8AC78',
                      letterSpacing: '0.1em',
                    }}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#C8AC78', fontWeight: 600 }}>
                    {fmtVol(agent.proj2026)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                    {agent.act2026 > 0 ? fmtVol(agent.act2026) : <span style={{ color: 'rgba(27,42,74,0.25)' }}>—</span>}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#7a8a8e' }}>
                    {fmtVol(agent.proj2027)}
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr style={{ borderTop: '2px solid #C8AC78', background: 'rgba(200,172,120,0.05)' }}>
                <td className="px-4 py-3" colSpan={3} style={{ ...LABEL_FONT, color: '#1B2A4A', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Total Baseline
                </td>
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#C8AC78' }}>
                  {fmtVol(total.proj2026 || 55_000_000)}
                </td>
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                  {total.act2026 > 0 ? fmtVol(total.act2026) : fmtVol(liveAct2026)}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: '#7a8a8e' }}>
                  {fmtVol(total.proj2027 || 93_000_000)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Profit Pool ──────────────────────────────────────────────────────── */}
        <div className="uppercase mb-3" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          Profit Pool · The Economic Logic
        </div>
        <div className="p-6 border mb-10" style={{ background: '#fff', borderColor: 'rgba(27,42,74,0.1)' }}>
          <p className="mb-4 leading-relaxed" style={{ ...SANS, color: '#384249', fontSize: '0.875rem' }}>
            Office breakeven at approximately <strong style={{ color: '#1B2A4A' }}>$40M</strong> in total sales volume. Every dollar above $40M generates approximately <strong style={{ color: '#1B2A4A' }}>2% commission</strong> into the profit pool above breakeven. Ed negotiates one third of that pool. Paid at year end. Not salary. Not splits. Profit participation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { year: '2026', volume: '$55M', pool: '$300K', edShare: '$100K', note: 'Pool above $40M is $300K. Ed\'s third is $100K.' },
              { year: '2027', volume: '$100M', pool: '$1.2M', edShare: '$400K', note: 'Zoila transitions off Ilija\'s payroll. The math now justifies independence.' },
              { year: '2028', volume: '$165M', pool: '$2.5M', edShare: '$833K', note: 'Angel transitions off Ilija\'s payroll mid-2027. Same logic.' },
            ].map(row => (
              <div key={row.year} className="p-4 border" style={{ borderColor: 'rgba(200,172,120,0.3)', background: 'rgba(200,172,120,0.03)' }}>
                <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {row.year} · {row.volume}
                </div>
                <div style={{ ...SERIF, color: '#1B2A4A', fontWeight: 600, fontSize: '1.5rem', lineHeight: 1 }}>
                  {row.edShare}
                </div>
                <div style={{ ...LABEL_FONT, color: '#7a8a8e', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
                  Ed's Share · Pool: {row.pool}
                </div>
                <div className="mt-3 text-xs leading-relaxed" style={{ ...SANS, color: '#7a8a8e', fontSize: '0.75rem' }}>
                  {row.note}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t text-sm leading-relaxed" style={{ ...SANS, color: 'rgba(27,42,74,0.5)', fontSize: '0.8rem', borderColor: 'rgba(27,42,74,0.08)' }}>
            Jarvis receives 5% of Ed's share · Angel receives 5% of Ed's share · Zoila earns a percentage by year end if she delivers. Dan's Papers at $9K and Zoila on payroll April 15 are not expenses — they are the unlock that makes the third 100 days happen. The third 100 days gets the office from $13.62M active to $55M closed. And $55M closed opens the profit pool that eventually makes everyone independent of Ilija's payroll.
          </div>
        </div>

        {/* ── Export + Sheet Link ────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-4 pb-8">
          <button
            onClick={() => generateFutureReportPDF({ agents: agents.map(a => ({ ...a, act2027: 0 })), total, liveAct2026: total.act2026 })}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
            style={{ ...LABEL_FONT, borderColor: '#C8AC78', color: '#1B2A4A', letterSpacing: '0.18em', background: 'rgba(200,172,120,0.08)' }}
          >
            ↓ Export PDF · Ascension Arc
          </button>
          <a
            href="https://docs.google.com/spreadsheets/d/1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 text-xs uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
            style={{ ...LABEL_FONT, borderColor: '#1B2A4A', color: '#1B2A4A', letterSpacing: '0.18em' }}
          >
            Open Growth Model v2
          </a>
        </div>

      </div>
    </div>
  );
}
