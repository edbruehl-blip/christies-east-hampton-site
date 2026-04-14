/*
 * FUTURE TAB — Wireframe Rebuild · April 10 2026
 * Visual authority: christies_future_tab_anchored_final.html
 * Theme: dark navy #0a1628 · gold #c8ac78 · gold-light #e8cc98
 * Live wires: ascensionArc (Wires 1-4) · volumeData · pipe.getKpis
 * Auth gate deferred — site private, URL in hands of core team only.
 */

import React, { useMemo, useRef, useState } from 'react';
import { trpc } from '@/lib/trpc';
import '@/styles/future-print.css';

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
const DIM        = '#555';
const MUTED      = '#666';
const PROJ_TEXT  = 'rgba(200,172,120,0.80)';

// SD-8 Phase Two: three-office stacked bar colors
const EH_COLOR   = '#c8ac78';                    // East Hampton — gold/amber (matches GOLD)
const SH_COLOR   = '#3a5a7a';                    // Southampton — navy/steel
const WH_COLOR   = '#5a7a5a';                    // Westhampton — warm sage green
const EH_FAINT   = 'rgba(200,172,120,0.20)';
const SH_FAINT   = 'rgba(58,90,122,0.35)';
const WH_FAINT   = 'rgba(90,122,90,0.35)';

const SANS:  React.CSSProperties = { fontFamily: 'sans-serif' };
const SERIF: React.CSSProperties = { fontFamily: 'Georgia, serif' };

// ─── Council-governed milestone targets ──────────────────────────────────────
const MILESTONE_TARGETS = {
  2025: { volume: 15_000_000,    display: '$20M',    label: '2025', isBaseline: true },
  2026: { volume: 55_000_000,    display: '$55M',    label: '2026', isBaseline: false },
  2027: { volume: 273_000_000,   display: '$273M',   label: '2027', isBaseline: false },
  2028: { volume: 383_500_000,   display: '$383M',   label: '2028', isBaseline: false },
  2031: { volume: 798_500_000,   display: '$798M',   label: '2031', isBaseline: false },
} as const;

const MAX_VOLUME = 2_096_228_000; // 2036 three-office combined volume from VOLUME Row 17 (SD-8 Phase Two)
const CHART_HEIGHT = 200; // px — matches wireframe bars-row height

function fmtM(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`; // $1.8B, $1.5B etc.
  if (n >= 1_000_000) return `$${Math.round(n / 1_000_000)}M`;           // $939M, $799M etc.
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

// ─── Pro Forma Button ─────────────────────────────────────────────────────────
function ProFormaButton() {
  const [loading, setLoading] = React.useState(false);
  const handleGenerate = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const date = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
      const res = await fetch('/api/pdf?url=/pro-forma');
      if (!res.ok) throw new Error(`PDF endpoint returned ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Christies_EH_Pro_Forma_${date}.pdf`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
    } catch (err) {
      console.error('Pro forma generation failed:', err);
      alert('Pro forma generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      style={{ ...SANS, background: 'transparent', border: `0.5px solid ${GOLD}`, color: GOLD, padding: '5px 14px', fontSize: 7, letterSpacing: '1px', textTransform: 'uppercase' as const, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.5 : 1 }}
    >
      {loading ? 'Generating…' : '\u2193 Pro Forma PDF'}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FutureTab() {
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

  // Wire 4: Ed GCI
  const liveEdGci = useMemo(() => {
    if (!arcData?.years?.length) return null;
    const map: Record<number, number> = {};
    arcData.years.forEach(y => { map[y.year] = y.edGci; });
    return map;
  }, [arcData]);

  // Actual 2026 closed volume (from VOLUME tab)
  const act2026 = volData?.total.act2026 || 4_570_000;

  // Bar heights — sqrt scale, max = CHART_HEIGHT
  function barPct(vol: number) {
    return Math.max(4, Math.round(Math.sqrt(vol / MAX_VOLUME) * CHART_HEIGHT));
  }

  // The eleven projected bars (2026-2036 milestones — live from OUTPUTS B32:B42)
  const BARS = useMemo(() => {
    const vol2026 = liveVolumes?.[2026] ?? 55_000_000;
    const vol2027 = liveVolumes?.[2027] ?? 273_000_000;
    const vol2028 = liveVolumes?.[2028] ?? 383_500_000;
    const vol2029 = liveVolumes?.[2029] ?? 498_600_000;
    const vol2030 = liveVolumes?.[2030] ?? 641_400_000;
    const vol2031 = liveVolumes?.[2031] ?? 798_500_000;
    const vol2032 = liveVolumes?.[2032] ?? 938_700_000;
    const vol2033 = liveVolumes?.[2033] ?? 1_101_000_000;
    const vol2034 = liveVolumes?.[2034] ?? 1_301_200_000;
    const vol2035 = liveVolumes?.[2035] ?? 1_539_440_000;
    const vol2036 = liveVolumes?.[2036] ?? 2_096_228_000;
    const eh2026 = liveEhVolumes?.[2026] ?? 55_000_000;
    const eh2027 = liveEhVolumes?.[2027] ?? 273_000_000;
    const eh2028 = liveEhVolumes?.[2028] ?? 383_500_000;
    const eh2029 = liveEhVolumes?.[2029] ?? 498_600_000;
    const eh2030 = liveEhVolumes?.[2030] ?? 641_400_000;
    const eh2031 = liveEhVolumes?.[2031] ?? 798_500_000;
    const eh2032 = liveEhVolumes?.[2032] ?? 938_700_000;
    const eh2033 = liveEhVolumes?.[2033] ?? 1_101_000_000;
    const eh2034 = liveEhVolumes?.[2034] ?? 1_301_200_000;
    const eh2035 = liveEhVolumes?.[2035] ?? 1_539_440_000;
    const eh2036 = liveEhVolumes?.[2036] ?? 1_823_328_000;
    const sh2026 = liveShVolumes?.[2026] ?? 0;
    const sh2027 = liveShVolumes?.[2027] ?? 0;
    const sh2028 = liveShVolumes?.[2028] ?? 42_500_000;
    const sh2029 = liveShVolumes?.[2029] ?? 0;
    const sh2030 = liveShVolumes?.[2030] ?? 0;
    const sh2031 = liveShVolumes?.[2031] ?? 0;
    const sh2032 = liveShVolumes?.[2032] ?? 0;
    const sh2033 = liveShVolumes?.[2033] ?? 0;
    const sh2034 = liveShVolumes?.[2034] ?? 0;
    const sh2035 = liveShVolumes?.[2035] ?? 0;
    const sh2036 = liveShVolumes?.[2036] ?? 143_000_000;
    const wh2026 = liveWhVolumes?.[2026] ?? 0;
    const wh2027 = liveWhVolumes?.[2027] ?? 0;
    const wh2028 = liveWhVolumes?.[2028] ?? 0;
    const wh2029 = liveWhVolumes?.[2029] ?? 0;
    const wh2030 = liveWhVolumes?.[2030] ?? 42_500_000;
    const wh2031 = liveWhVolumes?.[2031] ?? 0;
    const wh2032 = liveWhVolumes?.[2032] ?? 0;
    const wh2033 = liveWhVolumes?.[2033] ?? 0;
    const wh2034 = liveWhVolumes?.[2034] ?? 0;
    const wh2035 = liveWhVolumes?.[2035] ?? 0;
    const wh2036 = liveWhVolumes?.[2036] ?? 129_900_000;
    return [
      { year: '2025', vol: 15_000_000,   display: '$20M',        actualVol: 0,       isBaseline: true,  eh: 15_000_000, sh: 0, wh: 0 },
      { year: '2026', vol: vol2026,      display: fmtM(vol2026), actualVol: act2026, note: '2026 TARGET · EH Flagship',  eh: eh2026, sh: sh2026, wh: wh2026 },
      { year: '2027', vol: vol2027,      display: fmtM(vol2027), actualVol: 0,       eh: eh2027, sh: sh2027, wh: wh2027 },
      { year: '2028', vol: vol2028,      display: fmtM(vol2028), actualVol: 0,       note: 'Southampton opens',  eh: eh2028, sh: sh2028, wh: wh2028 },
      { year: '2029', vol: vol2029,      display: fmtM(vol2029), actualVol: 0,       eh: eh2029, sh: sh2029, wh: wh2029 },
      { year: '2030', vol: vol2030,      display: fmtM(vol2030), actualVol: 0,       note: 'Westhampton opens',  eh: eh2030, sh: sh2030, wh: wh2030 },
      { year: '2031', vol: vol2031,      display: fmtM(vol2031), actualVol: 0,       eh: eh2031, sh: sh2031, wh: wh2031 },
      { year: '2032', vol: vol2032,      display: fmtM(vol2032), actualVol: 0,       eh: eh2032, sh: sh2032, wh: wh2032 },
      { year: '2033', vol: vol2033,      display: fmtM(vol2033), actualVol: 0,       eh: eh2033, sh: sh2033, wh: wh2033 },
      { year: '2034', vol: vol2034,      display: fmtM(vol2034), actualVol: 0,       eh: eh2034, sh: sh2034, wh: wh2034 },
      { year: '2035', vol: vol2035,      display: fmtM(vol2035), actualVol: 0,       eh: eh2035, sh: sh2035, wh: wh2035 },
      { year: '2036', vol: vol2036,      display: '$2.096B',     actualVol: 0,       note: "$2.096B · Three-Office Ascension Arc Complete", isFinal: true, eh: eh2036, sh: sh2036, wh: wh2036 },
    ];
  }, [liveVolumes, liveEhVolumes, liveShVolumes, liveWhVolumes, act2026]);

  // ─── Card border style (uniform per wireframe) ────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: NAVY_CARD,
    border: `0.5px solid ${GOLD}`,
    borderRadius: 4,
    padding: '7px 9px',
  };

  const tabRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);


  return (
    <div ref={tabRef} style={{ background: NAVY, minHeight: '100vh', padding: '18px 22px 32px', fontFamily: 'Georgia, serif', color: '#fff', overflowX: 'hidden' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${GOLD}`, paddingBottom: 8, marginBottom: 12, gap: 6 }}>
          <div style={{ ...SANS, fontSize: 8.5, color: GOLD, letterSpacing: 1.5, flexShrink: 0 }}>
            CHRISTIE&apos;S &middot; INTERNATIONAL REAL ESTATE GROUP &middot; EAST HAMPTON &middot; EST. 1766
          </div>
          <div style={{ ...SANS, fontSize: 16, color: '#fff', letterSpacing: 3, textTransform: 'uppercase' as const, flex: '1 1 auto', textAlign: 'center' as const }}>
            Ascension Arc
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            {(arcData && !arcLoading) || (volData && !volLoading) ? (
              <span style={{ ...SANS, color: '#4ade80', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase' as const }}>&#9679; Live</span>
            ) : null}
            <ProFormaButton />
          </div>
        </div>

        {/* ── Chart Frame ────────────────────────────────────────────────────── */}
        <div className="future-chart-frame" style={{ border: `0.5px solid ${GOLD}`, borderRadius: 4, background: NAVY_CHART, padding: '30px 14px 0', marginBottom: 10 }}>
          {/* Bars row */}
          <div className="future-bars-row" style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: CHART_HEIGHT, paddingBottom: 10 }}>

            {BARS.map((bar) => {
              const projH = barPct(bar.vol);
              const actH  = bar.actualVol > 0 ? Math.max(14, Math.round((bar.actualVol / bar.vol) * projH)) : 0;
              const isBaseline = bar.year === '2025';
              // Three-office stacked heights (SD-8 Phase Two)
              const ehH = bar.eh > 0 ? Math.max(4, Math.round(barPct(bar.eh))) : 0;
              const shH = bar.sh > 0 ? Math.max(4, Math.round(barPct(bar.sh))) : 0;
              const whH = bar.wh > 0 ? Math.max(4, Math.round(barPct(bar.wh))) : 0;
              const stackedH = ehH + shH + whH;
              const gapH = Math.max(0, projH - stackedH);

              return (
                <div key={bar.year} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  {/* Dollar label above bar */}
                  <div className="future-bar-label" style={{ ...SANS, fontSize: 13, color: GOLD, fontWeight: 600, marginBottom: 4, textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {bar.display}
                  </div>
                  {/* Bar column */}
                  <div style={{ width: '100%', height: projH, display: 'flex', flexDirection: 'column' }}>
                    {isBaseline ? (
                      /* 2025 baseline — simple dim bar */
                      <div style={{ width: '100%', height: '100%', background: '#1e2d3d', borderRadius: '2px 2px 0 0', border: '0.5px solid #2a3a4a', borderBottom: 'none' }} />
                    ) : (
                      <>
                        {/* Projected gap (faint outline) */}
                        {gapH > 0 && (
                          <div style={{ width: '100%', height: gapH, background: EH_FAINT, border: `0.5px solid ${GOLD_FAINT_BORDER}`, borderBottom: 'none', borderRadius: '2px 2px 0 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4px 3px', overflow: 'hidden', flexShrink: 0 }}>
                            {bar.note && (
                              <div className="arc-note-desktop" style={{ ...SANS, fontSize: 8, color: PROJ_TEXT, textAlign: 'center', fontStyle: 'italic', lineHeight: 1.5 }}>
                                {bar.note}
                              </div>
                            )}
                          </div>
                        )}
                        {/* Westhampton layer (sage green) — top of stack */}
                        {whH > 0 && (
                          <div style={{ width: '100%', height: whH, background: WH_COLOR, flexShrink: 0, borderTop: `1px solid rgba(90,122,90,0.6)` }} />
                        )}
                        {/* Southampton layer (navy/steel) */}
                        {shH > 0 && (
                          <div style={{ width: '100%', height: shH, background: SH_COLOR, flexShrink: 0, borderTop: `1px solid rgba(58,90,122,0.6)` }} />
                        )}
                        {/* East Hampton layer (gold/amber) — base */}
                        {ehH > 0 && (
                          <div style={{ width: '100%', height: ehH, background: actH > 0 ? GOLD : EH_COLOR, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2px 2px 0', flexShrink: 0 }}>
                            {actH > 0 && (
                              <>
                                <div style={{ width: '100%', height: 2, background: GOLD_LIGHT, flexShrink: 0 }} />
                                <div style={{ ...SANS, fontSize: 7, color: NAVY, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', padding: '1px 2px 0', letterSpacing: '0.08em' }}>2026 YTD</div>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}



          </div>

          {/* Year strip */}
          <div style={{ display: 'flex', gap: 8, borderTop: `0.5px solid ${CHARCOAL}`, padding: '8px 0 10px' }}>
            {BARS.map(b => b.year).map(yr => (
              <div key={yr} className="future-year-label" style={{ flex: 1, ...SANS, fontSize: 10, color: GOLD, fontWeight: 700, textAlign: 'center' }}>{yr}</div>
            ))}
          </div>
        </div>

        {/* ── Legend ──────────────────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 9, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, ...SANS, fontSize: 7.5, color: '#888' }}>
            <div style={{ width: 11, height: 11, borderRadius: 1, background: EH_COLOR, flexShrink: 0 }} />
            East Hampton &middot; 2026–2036
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, ...SANS, fontSize: 7.5, color: '#888' }}>
            <div style={{ width: 11, height: 11, borderRadius: 1, background: SH_COLOR, flexShrink: 0 }} />
            Southampton &middot; opens 2028
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, ...SANS, fontSize: 7.5, color: '#888' }}>
            <div style={{ width: 11, height: 11, borderRadius: 1, background: WH_COLOR, flexShrink: 0 }} />
            Westhampton &middot; opens 2030
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, ...SANS, fontSize: 7.5, color: '#888' }}>
            <div style={{ width: 11, height: 11, borderRadius: 1, background: EH_FAINT, border: `0.5px solid ${GOLD_FAINT_BORDER}`, flexShrink: 0 }} />
            Projected — live from Growth Model v2 VOLUME Row 17
          </div>
        </div>

        {/* ── 100-Day Cards (4 cards) ─────────────────────────────────────────── */}
        <div className="future-cards-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginBottom: 9 }}>
          {[
            {
              phase: '1st 100 Days', status: 'Done', date: 'Dec 2025 \u2013 Mar 2026',
              shareholder: <><strong>$4.57M closed.</strong> 9 Daniels Hole $2.47M. 2 Old Hollow $2.1M. OS live Day 1.</>,
              client: 'ANEW proven at $2.47M. Every deal scored before a showing.',
              team: '26 Park Place operational. Open before the sign went up.',
            },
            {
              phase: '2nd 100 Days', status: 'Doing', date: 'Mar \u2013 Apr 29 2026',
              shareholder: <><strong>$13.62M active.</strong> 25 Horseshoe $5.75M in contract. 191 Bull Path $3.6M live.</>,
              client: "Dan's Papers from $115K to $9K. Export suite in every deal.",
              team: 'Zoila incoming April 25. Flagship Relaunch April 29.',
            },
            {
              phase: '3rd 100 Days', status: 'Incoming', date: 'Apr 29 \u2013 Aug 2026',
              shareholder: <><strong>$55M target.</strong> First Wednesday Caravan. East End market presence locked.</>,
              client: "AI Council daily. Every listing at Christie's standard.",
              team: '15 agents on live OS. Southampton bench seeded.',
            },
            {
              phase: 'Ascension', status: 'Vision', date: '2027 \u2013 2036',
              shareholder: <><strong>$2.096B trajectory.</strong> Three offices. Year 2 Profit Pool activates. 32 agents by 2036.</>,
              client: "Global Christie's brand. Legacy practice beyond a brokerage.",
              team: "EH + Southampton (2028) + Westhampton (2030) compounding to $2.096B.",
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

        {/* ── Divider + Income note ──────────────────────────────────────────── */}
        <hr style={{ border: 'none', borderTop: `0.5px solid ${CHARCOAL}`, margin: '6px 0 8px' }} />
        <div style={{ ...SANS, fontSize: 7, color: '#888', marginBottom: 7, letterSpacing: 0.3, fontStyle: 'italic' }}>
          All figures verified in sheet {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} &middot; Projected = gray italic &middot; Actual = gold bold &middot; Governing principle &middot; not yet contractual
        </div>

        {/* ── Participant Cards Grid (3 columns) ─────────────────────────────── */}
        <div className="future-participant-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9 }}>

          {/* Column 1: Ilija + Ed */}
          <div>
            {/* Ilija */}
            <div style={{ ...cardStyle, marginBottom: 7 }}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, fontWeight: 500, marginBottom: 1 }}>Ilija Pavlovic</div>
              <div style={{ ...SANS, fontSize: 6.5, color: MUTED, marginBottom: 5 }}>Franchise Principal &middot; CIREG Tri-State</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, marginBottom: 3 }}>
                {['Stream','2026','2027','2028','2036'].map(h => (
                  <span key={h} style={{ ...SANS, fontSize: 7, color: GOLD, textAlign: h === 'Stream' ? 'left' : 'right' as const }}>{h}</span>
                ))}
              </div>
              {[
                { label: 'Net pool 65% *', proj: [
                  livePoolRows?.find(r=>r.year==='2026') ? fmtM(livePoolRows.find(r=>r.year==='2026')!.ilijaPool) : '—',
                  livePoolRows?.find(r=>r.year==='2027') ? fmtM(livePoolRows.find(r=>r.year==='2027')!.ilijaPool) : '—',
                  livePoolRows?.find(r=>r.year==='2028') ? fmtM(livePoolRows.find(r=>r.year==='2028')!.ilijaPool) : '—',
                  livePoolRows?.find(r=>r.year==='2036') ? fmtM(livePoolRows.find(r=>r.year==='2036')!.ilijaPool) : '—',
                ], act: null },
                { label: 'Actual to date',  proj: null, act: ['—','—','—','—'] },
              ].map(row => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, lineHeight: 1.65 }}>
                  <span style={{ color: MUTED }}>{row.label}</span>
                  {(row.proj ?? row.act ?? []).map((v, i) => (
                    <span key={i} style={{ textAlign: 'right' as const, color: row.act ? GOLD : DIM, fontStyle: row.proj ? 'italic' : 'normal', fontSize: row.proj ? 6.5 : 7, fontWeight: row.act ? 600 : 400 }}>{v}</span>
                  ))}
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7.5, color: GOLD, fontWeight: 500, borderTop: `0.5px solid ${CHARCOAL}`, paddingTop: 3, marginTop: 2 }}>
                <span>Projected</span>
                {[
                  livePoolRows?.find(r=>r.year==='2026') ? fmtM(livePoolRows.find(r=>r.year==='2026')!.ilijaPool) : '—',
                  livePoolRows?.find(r=>r.year==='2027') ? fmtM(livePoolRows.find(r=>r.year==='2027')!.ilijaPool) : '—',
                  livePoolRows?.find(r=>r.year==='2028') ? fmtM(livePoolRows.find(r=>r.year==='2028')!.ilijaPool) : '—',
                  livePoolRows?.find(r=>r.year==='2036') ? fmtM(livePoolRows.find(r=>r.year==='2036')!.ilijaPool) : '—',
                ].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
              </div>
            </div>

            {/* Ed */}
            <div style={{ ...cardStyle, marginBottom: 7 }}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, fontWeight: 500, marginBottom: 1 }}>Ed Bruehl</div>
              <div style={{ ...SANS, fontSize: 6.5, color: MUTED, marginBottom: 5 }}>Managing Director &middot; Christie&apos;s East Hampton</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, marginBottom: 3 }}>
                {['Stream','2026','2027','2028','2036'].map(h => (
                  <span key={h} style={{ ...SANS, fontSize: 7, color: GOLD, textAlign: h === 'Stream' ? 'left' : 'right' as const }}>{h}</span>
                ))}
              </div>
              {[
                { label: 'Brokerage GCI',  proj: [
                  liveEdGci?.[2026] ? fmtM(liveEdGci[2026]) : '$600K',
                  liveEdGci?.[2027] ? fmtM(liveEdGci[2027]) : '$1.8M',
                  liveEdGci?.[2028] ? fmtM(liveEdGci[2028]) : '$2.0M',
                  liveEdGci?.[2036] ? fmtM(liveEdGci[2036]) : '$3.6M',
                ], act: null },
                { label: 'Actual GCI',      proj: null, act: [liveEdGci?.[2026] ? `${fmtM(liveEdGci[2026])} \u2191` : '$91K \u2191','—','—','—'] },
                { label: 'Net pool 35% *', proj: [
                  livePoolRows?.find(r=>r.year==='2026') ? fmtM(livePoolRows.find(r=>r.year==='2026')!.edPool) : '—',
                  livePoolRows?.find(r=>r.year==='2027') ? fmtM(livePoolRows.find(r=>r.year==='2027')!.edPool) : '—',
                  livePoolRows?.find(r=>r.year==='2028') ? fmtM(livePoolRows.find(r=>r.year==='2028')!.edPool) : '—',
                  livePoolRows?.find(r=>r.year==='2036') ? fmtM(livePoolRows.find(r=>r.year==='2036')!.edPool) : '—',
                ], act: null },
                { label: 'AnewHomes 35%', proj: ['$17,500','$52,500','$175,000','$175,000'], act: null },
              ].map(row => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, lineHeight: 1.65 }}>
                  <span style={{ color: MUTED }}>{row.label}</span>
                  {(row.proj ?? row.act ?? []).map((v, i) => (
                    <span key={i} style={{ textAlign: 'right' as const, color: row.act ? GOLD : DIM, fontStyle: row.proj ? 'italic' : 'normal', fontSize: row.proj ? 6.5 : 7, fontWeight: row.act ? 600 : 400 }}>{v}</span>
                  ))}
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7.5, color: GOLD, fontWeight: 500, borderTop: `0.5px solid ${CHARCOAL}`, paddingTop: 3, marginTop: 2 }}>
                <span>Projected</span>
                {['$657K','$2.32M','$2.86M','$6.5M+'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
              </div>
            </div>
          </div>

          {/* Column 2: Angel + Jarvis */}
          <div>
            {/* Angel */}
            <div style={{ ...cardStyle, marginBottom: 7 }}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, fontWeight: 500, marginBottom: 1 }}>Angel Theodore *</div>
              <div style={{ ...SANS, fontSize: 6.5, color: MUTED, marginBottom: 5 }}>Operations &middot; Producer 2027</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, marginBottom: 3 }}>
                {['Stream','2026','2027','2028','2036'].map(h => (
                  <span key={h} style={{ ...SANS, fontSize: 7, color: GOLD, textAlign: h === 'Stream' ? 'left' : 'right' as const }}>{h}</span>
                ))}
              </div>
              {[
                { label: 'Sales vol',    proj: ['$3M','$6M','$7.2M','$15M+'], act: null },
                { label: 'Actual vol',   proj: null, act: ['—','—','—','—'] },
                { label: 'GCI proj',     proj: ['$60K','$120K','$144K','$300K+'], act: null },
                { label: 'AnewHomes 5%', proj: ['$2,500','$7,500','$25,000','$25,000'], act: null },
                { label: 'Pool share *', proj: ['$1,986','$23,382','$34,019','$137K+'], act: null },
              ].map(row => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, lineHeight: 1.65 }}>
                  <span style={{ color: MUTED }}>{row.label}</span>
                  {(row.proj ?? row.act ?? []).map((v, i) => (
                    <span key={i} style={{ textAlign: 'right' as const, color: row.act ? GOLD : DIM, fontStyle: row.proj ? 'italic' : 'normal', fontSize: row.proj ? 6.5 : 7, fontWeight: row.act ? 600 : 400 }}>{v}</span>
                  ))}
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7.5, color: GOLD, fontWeight: 500, borderTop: `0.5px solid ${CHARCOAL}`, paddingTop: 3, marginTop: 2 }}>
                <span>Projected</span>
                {['$62K','$143K','$178K','$437K+'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
              </div>
            </div>

            {/* Jarvis */}
            <div style={{ ...cardStyle, marginBottom: 7 }}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, fontWeight: 500, marginBottom: 1 }}>Jarvis Slade</div>
              <div style={{ ...SANS, fontSize: 6.5, color: MUTED, marginBottom: 5 }}>COO &middot; Agent</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, marginBottom: 3 }}>
                {['Stream','2026','2027','2028','2036'].map(h => (
                  <span key={h} style={{ ...SANS, fontSize: 7, color: GOLD, textAlign: h === 'Stream' ? 'left' : 'right' as const }}>{h}</span>
                ))}
              </div>
              {[
                { label: 'Sales vol',    proj: ['$5M','$15M','$20M','$50M+'], act: null },
                { label: 'Actual vol',   proj: null, act: ['—','—','—','—'] },
                { label: 'GCI proj',     proj: ['$100K','$300K','$400K','$1M+'], act: null },
                { label: 'AnewHomes 5%', proj: ['$2,500','$7,500','$25,000','$25,000'], act: null },
                { label: 'Pool share *', proj: ['$1,986','$23,382','$34,019','$137K+'], act: null },
              ].map(row => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, lineHeight: 1.65 }}>
                  <span style={{ color: MUTED }}>{row.label}</span>
                  {(row.proj ?? row.act ?? []).map((v, i) => (
                    <span key={i} style={{ textAlign: 'right' as const, color: row.act ? GOLD : DIM, fontStyle: row.proj ? 'italic' : 'normal', fontSize: row.proj ? 6.5 : 7, fontWeight: row.act ? 600 : 400 }}>{v}</span>
                  ))}
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7.5, color: GOLD, fontWeight: 500, borderTop: `0.5px solid ${CHARCOAL}`, paddingTop: 3, marginTop: 2 }}>
                <span>Projected</span>
                {['$102K','$323K','$434K','$1.14M+'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
              </div>
            </div>
          </div>

          {/* Column 3: Zoila + Scott + Richard */}
          <div>
            {/* Zoila */}
            <div style={{ ...cardStyle, marginBottom: 7 }}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, fontWeight: 500, marginBottom: 1 }}>Zoila Ortega Astor *</div>
              <div style={{ ...SANS, fontSize: 6.5, color: MUTED, marginBottom: 3 }}>Office Director &middot; Producer 2027</div>
              <div style={{ ...SANS, fontSize: 6.5, color: GOLD, letterSpacing: 0.5, marginBottom: 5 }}>Start Date: April 25, 2026</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, marginBottom: 3 }}>
                {['Stream','2026','2027','2028','2036'].map(h => (
                  <span key={h} style={{ ...SANS, fontSize: 7, color: GOLD, textAlign: h === 'Stream' ? 'left' : 'right' as const }}>{h}</span>
                ))}
              </div>
              {[
                { label: 'Sales vol',    proj: ['$6M','$7M','$8.4M','$20M+'], act: null },
                { label: 'GCI / salary', proj: ['$100K','$140K','$168K','$400K+'], act: null },
                { label: 'AnewHomes 5% †', proj: ['$0 vest','$7,500','$25,000','$25,000'], act: null },
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
                {['$100K','$140K','$168K','$400K+'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
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
                { label: 'Sales vol',      proj: ['$1.5M','$5M','$15M','$35M+'], act: null },
                { label: 'AnewHomes 35%',  proj: ['$17,500','$52,500','$175,000','$175,000'], act: null },
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
                {['$47.5K','$152K','$475K','$875K+'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
              </div>
            </div>

            {/* Richard */}
            <div style={{ ...cardStyle, marginBottom: 7 }}>
              <div style={{ ...SANS, fontSize: 9, color: GOLD, fontWeight: 500, marginBottom: 1 }}>Richard Bruehl</div>
              <div style={{ ...SANS, fontSize: 6.5, color: MUTED, marginBottom: 5 }}>Advisory &middot; AnewHomes</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, marginBottom: 3 }}>
                {['Stream','2026','2027','2028','2036'].map(h => (
                  <span key={h} style={{ ...SANS, fontSize: 7, color: GOLD, textAlign: h === 'Stream' ? 'left' : 'right' as const }}>{h}</span>
                ))}
              </div>
              {[
                { label: 'AnewHomes *', proj: ['$5,000','$15,000','$50,000','$50,000'], act: null },
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
                {['$5K','$15K','$50K','$50K'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10, paddingTop: 6, borderTop: `0.5px solid ${CHARCOAL}`, gap: 10 }}>
          <div style={{ ...SANS, fontSize: 6.5, color: DIM, fontStyle: 'italic', lineHeight: 1.6, flex: '1 1 100%', width: '100%', minWidth: 0 }}>
            * Governing principle &middot; not yet contractual &middot; internal only &middot; Net pool = GCI (vol&times;2%) minus 5% franchise royalty minus 70% agent splits minus overhead &middot; Ed 35% / Ilija 65% &middot; two parties only &middot; Pool share = 5% of Ed&apos;s 35% for Jarvis and Angel &middot; Actuals update per closing via Perplexity &rarr; Growth Model v2 &rarr; dashboard live &middot; PDF = html2pdf snapshot of live screen<br />
            &dagger; Zoila AnewHomes 5% in 6-month vesting period beginning April 25, 2026 &middot; vesting cliff October 25, 2026 &middot; activates 2027 forward &middot; AnewHomes split: Ed 35% &middot; Scott 35% &middot; Richard 10% &middot; Jarvis 5% &middot; Angel 5% &middot; Zoila 5% vesting &middot; Pool 5%
          </div>
          <div style={{ ...SERIF, fontSize: 8, color: '#888', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
            The foundation is proven. The model is working. The next 14 days set the trajectory.
          </div>
        </div>

        {/* ── Export buttons ──────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14, justifyContent: 'center' }}>
          <button
            onClick={async () => {
              if (exporting) return;
              setExporting(true);
              try {
                const date = new Date().toLocaleDateString('en-US',{month:'2-digit',day:'2-digit',year:'numeric'}).replace(/\//g,'-');
                const res = await fetch('/api/pdf?url=/future');
                if (!res.ok) throw new Error(`PDF endpoint returned ${res.status}`);
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Christies_EH_Ascension_Arc_${date}.pdf`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
              } catch (e) {
                console.error('Export failed', e);
                alert('Export failed. Please try again.');
              } finally {
                setExporting(false);
              }
            }}
            disabled={exporting}
            style={{ ...SANS, background: 'transparent', border: `0.5px solid ${GOLD}`, color: GOLD, padding: '5px 14px', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase' as const, cursor: exporting ? 'wait' : 'pointer', opacity: exporting ? 0.6 : 1 }}
          >
            {exporting ? 'Generating\u2026' : '\u2193 Export PDF \u00b7 Ascension Arc'}
          </button>
          <a
            href="https://docs.google.com/spreadsheets/d/1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag/edit"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...SANS, background: 'transparent', border: `0.5px solid rgba(200,172,120,0.4)`, color: GOLD, padding: '5px 14px', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase' as const, textDecoration: 'none' }}
          >
            Open Growth Model v2
          </a>
        </div>

      </div>

      {/* Print footer */}
      <div className="future-print-footer">
        <span className="footer-left">Ed Bruehl &middot; Managing Director</span>
        <span className="footer-center">Christie&apos;s International Real Estate Group East Hampton</span>
        <span className="footer-right">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>
  );
}
