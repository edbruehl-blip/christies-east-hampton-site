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

// ─── PDF mode detection ─────────────────────────────────────────────────────
// When Puppeteer navigates with ?pdf=1, the page switches to light-mode styles
// for institutional print quality (dark text on white background).
// Dashboard screen stays dark navy. PDF export inverts to light.
function useIsPdfMode(): boolean {
  const [isPdf, setIsPdf] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsPdf(params.get('pdf') === '1');
  }, []);
  return isPdf;
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

// SD-8 Phase Two: three-office stacked bar colors
const EH_COLOR   = '#c8ac78';                    // East Hampton — gold/amber (matches GOLD)
const SH_COLOR   = '#3a5a7a';                    // Southampton — navy/steel
const WH_COLOR   = '#5a7a5a';                    // Westhampton — warm sage green
const EH_FAINT   = 'rgba(200,172,120,0.20)';
const SH_FAINT   = 'rgba(58,90,122,0.35)';
const WH_FAINT   = 'rgba(90,122,90,0.35)';

// Cohort sub-segment colors — shade variations within each office color family
// Founding (base, full saturation) → Targeted (Engine 1, mid) → Organic (Engine 2, lighter)
const EH_FOUNDING = '#c8ac78';                     // EH base — full gold
const EH_TARGETED = 'rgba(200,172,120,0.72)';      // EH Engine 1 — mid gold
const EH_ORGANIC  = 'rgba(200,172,120,0.45)';      // EH Engine 2 — light gold
const SH_FOUNDING = '#3a5a7a';                     // SH base — full steel
const SH_TARGETED = 'rgba(58,90,122,0.72)';        // SH Engine 1 — mid steel
const SH_ORGANIC  = 'rgba(58,90,122,0.45)';        // SH Engine 2 — light steel
const WH_FOUNDING = '#5a7a5a';                     // WH base — full sage
const WH_TARGETED = 'rgba(90,122,90,0.72)';        // WH Engine 1 — mid sage
const WH_ORGANIC  = 'rgba(90,122,90,0.45)';        // WH Engine 2 — light sage

// EPM cohort ramp parameters (from ASSUMPTIONS + ROSTER)
// Founding: Ed + named producers (5 seats EH, 3 SH, 2 WH at open)
// Targeted: Engine 1 hires ($500K→$750K→$1M ramp)
// Organic: Engine 2 hires ($250K→$500K→$750K ramp)
const EPM_FOUNDING_SEATS = { eh: 5, sh: 3, wh: 2 };
const EPM_ENGINE1_GCI_Y1 = 500_000;  // Engine 1 Y1 GCI per seat
const EPM_ENGINE2_GCI_Y1 = 250_000;  // Engine 2 Y1 GCI per seat

/**
 * Compute cohort sub-segments for one office zone.
 * Splits the total office GCI into Founding / Targeted / Organic proportions
 * based on EPM ramp parameters and years since office opened.
 * Totals always sum to `total` — no rounding drift.
 */
function computeCohorts(total: number, yearsOpen: number, _unused: number): { founding: number; targeted: number; organic: number } {
  if (total <= 0 || yearsOpen < 0) return { founding: total, targeted: 0, organic: 0 };
  // Founding team GCI grows at 20% compound from base $600K/seat
  const foundingGciPerSeat = 600_000 * Math.pow(1.2, yearsOpen);
  // Engine 1: seats ramp in over years 1-4, each at $500K→$750K→$1M
  const engine1Seats = Math.min(Math.max(yearsOpen, 0), 4); // up to 4 targeted seats
  const engine1GciPerSeat = EPM_ENGINE1_GCI_Y1 * Math.pow(1.5, Math.min(yearsOpen, 2));
  // Engine 2: organic seats from year 2 onward
  const engine2Seats = Math.max(yearsOpen - 1, 0) * 2;
  const engine2GciPerSeat = EPM_ENGINE2_GCI_Y1 * Math.pow(1.5, Math.min(Math.max(yearsOpen - 1, 0), 2));
  // Raw proportions
  const rawFounding = foundingGciPerSeat;
  const rawTargeted = engine1Seats * engine1GciPerSeat;
  const rawOrganic  = engine2Seats * engine2GciPerSeat;
  const rawTotal = rawFounding + rawTargeted + rawOrganic || 1;
  // Scale to actual total, preserve exact sum
  const founding = Math.round(total * rawFounding / rawTotal);
  const targeted = Math.round(total * rawTargeted / rawTotal);
  const organic  = total - founding - targeted; // remainder avoids rounding drift
  return { founding: Math.max(founding, 0), targeted: Math.max(targeted, 0), organic: Math.max(organic, 0) };
}

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
  if (n >= 1_000_000) return `$${Math.round(n / 1_000_000)}M`;           // $939M, $799M etc.
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

// ─── Print Future Button ─────────────────────────────────────────────────────
// Spec April 15 2026: Print the FUTURE tab full-scroll exactly as it appears
// on screen — dark navy, gold, all partner cards with live data.
// No separate page, no light-mode inversion. window.print() on current tab.
function PrintFutureButton() {
  const handlePrint = () => {
    const prev = document.title;
    document.title = "Christies_EH_Future_Projections";
    window.print();
    document.title = prev;
  };
  return (
    <button
      onClick={handlePrint}
      className="no-print future-intro-button"
      data-print-hide="true"
      style={{ ...SANS, background: 'transparent', border: `0.5px solid ${GOLD}`, color: GOLD, padding: '5px 14px', fontSize: 7, letterSpacing: '1px', textTransform: 'uppercase' as const, cursor: 'pointer' }}
    >
      &#8595; Print &middot; PDF
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FutureTab() {
  // PDF mode: ?pdf=1 → light-mode institutional print styling
  const isPdfMode = useIsPdfMode();

  // PDF light-mode color overrides — dark text on white background for institutional print
  const PDF_BG       = '#ffffff';
  const PDF_CARD_BG  = '#f8f6f2';
  const PDF_CHART_BG = '#f4f2ee';
  const PDF_TEXT     = '#1a2a3a';
  const PDF_MUTED    = '#4a5568';
  const PDF_BORDER   = 'rgba(200,172,120,0.5)';

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
  const BARS = useMemo(() => {
    // Sprint 13: canonical OUTPUTS B32:B42 fallback values (Perplexity April 15, 2026)
    const vol2026 = liveVolumes?.[2026] ?? 75_000_000;
    const vol2027 = liveVolumes?.[2027] ?? 125_906_749;
    const vol2028 = liveVolumes?.[2028] ?? 253_866_793;
    const vol2029 = liveVolumes?.[2029] ?? 622_000_000;   // Council EPM Apr 16 2026
    const vol2030 = liveVolumes?.[2030] ?? 1_270_000_000;  // Council EPM Apr 16 2026
    const vol2031 = liveVolumes?.[2031] ?? 1_980_000_000;  // Council EPM Apr 16 2026
    const vol2032 = liveVolumes?.[2032] ?? 2_250_000_000;  // Council EPM Apr 16 2026
    const vol2033 = liveVolumes?.[2033] ?? 2_450_000_000;  // Council EPM Apr 16 2026
    const vol2034 = liveVolumes?.[2034] ?? 2_620_000_000;  // Council EPM Apr 16 2026
    const vol2035 = liveVolumes?.[2035] ?? 2_800_000_000;  // Council EPM Apr 16 2026
    const vol2036 = liveVolumes?.[2036] ?? 3_000_000_000;  // Council EPM Apr 16 2026 · institutional floor
    // EH volumes — Council EPM dispatch Apr 16 2026 · per-seat math + 7% post-maturity lift
    const eh2026 = liveEhVolumes?.[2026] ?? 75_000_000;
    const eh2027 = liveEhVolumes?.[2027] ?? 126_000_000;
    const eh2028 = liveEhVolumes?.[2028] ?? 285_000_000;
    const eh2029 = liveEhVolumes?.[2029] ?? 385_000_000;
    const eh2030 = liveEhVolumes?.[2030] ?? 608_000_000;
    const eh2031 = liveEhVolumes?.[2031] ?? 779_000_000;
    const eh2032 = liveEhVolumes?.[2032] ?? 811_000_000;
    const eh2033 = liveEhVolumes?.[2033] ?? 853_000_000;
    const eh2034 = liveEhVolumes?.[2034] ?? 907_000_000;
    const eh2035 = liveEhVolumes?.[2035] ?? 974_000_000;
    const eh2036 = liveEhVolumes?.[2036] ?? 1_045_000_000;
    // SH opens 2028 · WH opens 2030 · Council EPM dispatch Apr 16 2026
    // Per-seat: $500K Y1 · $750K Y2 · $1M Y3+ · 7% post-maturity · Vol = GCI ÷ 2%
    // Combined three-office 2036 = $3.0B · institutional floor · north star
    const sh2026 = liveShVolumes?.[2026] ?? 0;
    const sh2027 = liveShVolumes?.[2027] ?? 0;
    const sh2028 = liveShVolumes?.[2028] ?? 76_000_000;
    const sh2029 = liveShVolumes?.[2029] ?? 237_000_000;
    const sh2030 = liveShVolumes?.[2030] ?? 515_000_000;
    const sh2031 = liveShVolumes?.[2031] ?? 742_000_000;
    const sh2032 = liveShVolumes?.[2032] ?? 779_000_000;
    const sh2033 = liveShVolumes?.[2033] ?? 815_000_000;
    const sh2034 = liveShVolumes?.[2034] ?? 873_000_000;
    const sh2035 = liveShVolumes?.[2035] ?? 931_000_000;
    const sh2036 = liveShVolumes?.[2036] ?? 1_000_000_000;
    const wh2026 = liveWhVolumes?.[2026] ?? 0;
    const wh2027 = liveWhVolumes?.[2027] ?? 0;
    const wh2028 = liveWhVolumes?.[2028] ?? 0;
    const wh2029 = liveWhVolumes?.[2029] ?? 0;
    const wh2030 = liveWhVolumes?.[2030] ?? 147_000_000;
    const wh2031 = liveWhVolumes?.[2031] ?? 460_000_000;
    const wh2032 = liveWhVolumes?.[2032] ?? 660_000_000;
    const wh2033 = liveWhVolumes?.[2033] ?? 782_000_000;
    const wh2034 = liveWhVolumes?.[2034] ?? 839_000_000;
    const wh2035 = liveWhVolumes?.[2035] ?? 895_000_000;
    const wh2036 = liveWhVolumes?.[2036] ?? 963_000_000;
    return [
      // vol = combined EH+SH+WH total — drives bar height AND label (fixed Apr 16 2026)
      { year: '2025', vol: 15_000_000,                    display: '$20M',        actualVol: 0,       isBaseline: true,  eh: 15_000_000, sh: 0, wh: 0 },
      { year: '2026', vol: eh2026+sh2026+wh2026,          display: fmtM(eh2026+sh2026+wh2026), actualVol: act2026, note: '2026 TARGET · EH Flagship',  eh: eh2026, sh: sh2026, wh: wh2026 },
      { year: '2027', vol: eh2027+sh2027+wh2027,          display: fmtM(eh2027+sh2027+wh2027), actualVol: 0,       eh: eh2027, sh: sh2027, wh: wh2027 },
      { year: '2028', vol: eh2028+sh2028+wh2028,          display: fmtM(eh2028+sh2028+wh2028), actualVol: 0,       note: 'Southampton opens',  eh: eh2028, sh: sh2028, wh: wh2028 },
      { year: '2029', vol: eh2029+sh2029+wh2029,          display: fmtM(eh2029+sh2029+wh2029), actualVol: 0,       eh: eh2029, sh: sh2029, wh: wh2029 },
      { year: '2030', vol: eh2030+sh2030+wh2030,          display: fmtM(eh2030+sh2030+wh2030), actualVol: 0,       note: 'Westhampton opens',  eh: eh2030, sh: sh2030, wh: wh2030 },
      { year: '2031', vol: eh2031+sh2031+wh2031,          display: fmtM(eh2031+sh2031+wh2031), actualVol: 0,       eh: eh2031, sh: sh2031, wh: wh2031 },
      { year: '2032', vol: eh2032+sh2032+wh2032,          display: fmtM(eh2032+sh2032+wh2032), actualVol: 0,       eh: eh2032, sh: sh2032, wh: wh2032 },
      { year: '2033', vol: eh2033+sh2033+wh2033,          display: fmtM(eh2033+sh2033+wh2033), actualVol: 0,       eh: eh2033, sh: sh2033, wh: wh2033 },
      { year: '2034', vol: eh2034+sh2034+wh2034,          display: fmtM(eh2034+sh2034+wh2034), actualVol: 0,       eh: eh2034, sh: sh2034, wh: wh2034 },
      { year: '2035', vol: eh2035+sh2035+wh2035,          display: fmtM(eh2035+sh2035+wh2035), actualVol: 0,       eh: eh2035, sh: sh2035, wh: wh2035 },
      { year: '2036', vol: eh2036+sh2036+wh2036,          display: '$3.0B',       actualVol: 0,       note: "$3.0B · Three-Office Ascension Arc Complete · EPM · 36 seats · institutional floor", isFinal: true, eh: eh2036, sh: sh2036, wh: wh2036 },
    ];
  }, [liveVolumes, liveEhVolumes, liveShVolumes, liveWhVolumes, act2026]);

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

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${GOLD}`, paddingBottom: 8, marginBottom: 12, gap: 6 }}>
          <div style={{ ...SANS, fontSize: 8.5, color: GOLD, letterSpacing: 1.5, flexShrink: 0 }}>
            CHRISTIE&apos;S &middot; INTERNATIONAL REAL ESTATE GROUP &middot; EAST HAMPTON &middot; EST. 1766
          </div>
          <div style={{ ...SANS, fontSize: 16, color: TEXT_PRIMARY, letterSpacing: 3, textTransform: 'uppercase' as const, flex: '1 1 auto', textAlign: 'center' as const }}>
            Ascension Arc &middot; <span style={{ fontSize: 8, color: MUTED, fontWeight: 400, letterSpacing: 0.5 }}>Canonical Adjusted Trajectory</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            {!isPdfMode && ((arcData && !arcLoading) || (volData && !volLoading)) ? (
              <span style={{ ...SANS, color: '#4ade80', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase' as const }}>&#9679; Live</span>
            ) : null}
            <PrintFutureButton />
          </div>
        </div>

        {/* ── Chart Frame ────────────────────────────────────────────────────── */}
        <div className="future-chart-frame" style={{ border: `0.5px solid ${GOLD}`, borderRadius: 4, background: CHART_BG, padding: '14px 14px 0', marginBottom: 10 }}>
          {/* Dollar labels row — sits above the bars, outside the fixed-height bars container */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            {BARS.map((bar) => (
              <div key={bar.year} className="future-bar-label" style={{ flex: 1, minWidth: 0, ...SANS, fontSize: 8, color: GOLD, fontWeight: 600, textAlign: 'center', whiteSpace: 'normal', overflow: 'visible', lineHeight: 1.2, wordBreak: 'break-all' }}>
                {bar.display}
              </div>
            ))}
          </div>
          {/* Bars row — fixed height container, bars use % heights so they always fit */}
          <div className="future-bars-row" style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: CHART_HEIGHT, overflow: 'hidden' }}>

            {BARS.map((bar) => {
              // All heights are PERCENTAGES of the container (0–92%)
              const projPct = barPct(bar.vol); // e.g. 92 for the tallest bar
              const actPct  = bar.actualVol > 0 ? Math.max(8, Math.round((bar.actualVol / bar.vol) * projPct)) : 0;
              const isBaseline = bar.year === '2025';
              // Three-office stacked percentages — each segment is proportional to its share of combined vol
              // MUST use (office_vol / combined_vol) * projPct so EH always grows visually (SD-8 Phase Two fix Apr 16 2026)
              const combined = bar.eh + bar.sh + bar.wh;
              const ehPct = combined > 0 && bar.eh > 0 ? Math.max(2, Math.round((bar.eh / combined) * projPct)) : (projPct > 0 ? projPct : 0);
              const shPct = combined > 0 && bar.sh > 0 ? Math.max(1, Math.round((bar.sh / combined) * projPct)) : 0;
              const whPct = combined > 0 && bar.wh > 0 ? Math.max(1, Math.round((bar.wh / combined) * projPct)) : 0;
              const stackedPct = ehPct + shPct + whPct;
              const gapPct = Math.max(0, projPct - stackedPct);

              return (
                <div key={bar.year} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  {/* Bar column — height is a PERCENTAGE of the container so it always fits */}
                  <div style={{ width: '100%', height: `${projPct}%`, minHeight: '4%', display: 'flex', flexDirection: 'column' }}>
                    {isBaseline ? (
                      /* 2025 baseline — simple dim bar */
                      <div style={{ width: '100%', height: '100%', background: '#1e2d3d', borderRadius: '2px 2px 0 0', border: '0.5px solid #2a3a4a', borderBottom: 'none' }} />
                    ) : (
                      <>
                        {/* Projected gap (faint outline) */}
                        {gapPct > 0 && (
                          <div style={{ width: '100%', flex: `0 0 ${gapPct / projPct * 100}%`, background: EH_FAINT, border: `0.5px solid ${GOLD_FAINT_BORDER}`, borderBottom: 'none', borderRadius: '2px 2px 0 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4px 3px', overflow: 'hidden' }}>
                            {bar.note && (
                              <div className="arc-note-desktop" style={{ ...SANS, fontSize: 8, color: PROJ_TEXT, textAlign: 'center', fontStyle: 'italic', lineHeight: 1.5 }}>
                                {bar.note}
                              </div>
                            )}
                          </div>
                        )}
                        {/* Westhampton — cohort sub-segments (Founding/Targeted/Organic) */}
                        {whPct > 0 && (() => {
                          const wh = computeCohorts(bar.wh, parseInt(bar.year) - 2030, 0);
                          return (
                            <div style={{ width: '100%', flex: `0 0 ${whPct / projPct * 100}%`, display: 'flex', flexDirection: 'column', borderTop: `1px solid rgba(90,122,90,0.6)` }}>
                              {wh.organic  > 0 && <div title={`WH Organic: ${fmtM(wh.organic)}`}  style={{ flex: wh.organic,  background: WH_ORGANIC,  minHeight: 1 }} />}
                              {wh.targeted > 0 && <div title={`WH Engine 1: ${fmtM(wh.targeted)}`} style={{ flex: wh.targeted, background: WH_TARGETED, minHeight: 1 }} />}
                              {wh.founding > 0 && <div title={`WH Founding: ${fmtM(wh.founding)}`} style={{ flex: wh.founding, background: WH_FOUNDING, minHeight: 1 }} />}
                            </div>
                          );
                        })()}
                        {/* Southampton — cohort sub-segments */}
                        {shPct > 0 && (() => {
                          const sh = computeCohorts(bar.sh, parseInt(bar.year) - 2028, 0);
                          return (
                            <div style={{ width: '100%', flex: `0 0 ${shPct / projPct * 100}%`, display: 'flex', flexDirection: 'column', borderTop: `1px solid rgba(58,90,122,0.6)` }}>
                              {sh.organic  > 0 && <div title={`SH Organic: ${fmtM(sh.organic)}`}  style={{ flex: sh.organic,  background: SH_ORGANIC,  minHeight: 1 }} />}
                              {sh.targeted > 0 && <div title={`SH Engine 1: ${fmtM(sh.targeted)}`} style={{ flex: sh.targeted, background: SH_TARGETED, minHeight: 1 }} />}
                              {sh.founding > 0 && <div title={`SH Founding: ${fmtM(sh.founding)}`} style={{ flex: sh.founding, background: SH_FOUNDING, minHeight: 1 }} />}
                            </div>
                          );
                        })()}
                        {/* East Hampton — cohort sub-segments */}
                        {ehPct > 0 && (() => {
                          const eh = computeCohorts(bar.eh, parseInt(bar.year) - 2026, 0);
                          return (
                            <div style={{ width: '100%', flex: `0 0 ${ehPct / projPct * 100}%`, display: 'flex', flexDirection: 'column' }}>
                              {actPct > 0 && <div style={{ width: '100%', height: 2, background: GOLD_LIGHT, flexShrink: 0 }} />}
                              {eh.organic  > 0 && <div title={`EH Organic: ${fmtM(eh.organic)}`}  style={{ flex: eh.organic,  background: EH_ORGANIC,  minHeight: 1 }} />}
                              {eh.targeted > 0 && <div title={`EH Engine 1: ${fmtM(eh.targeted)}`} style={{ flex: eh.targeted, background: EH_TARGETED, minHeight: 1 }} />}
                              {eh.founding > 0 && <div title={`EH Founding: ${fmtM(eh.founding)}`} style={{ flex: eh.founding, background: EH_FOUNDING, minHeight: 1 }} />}
                            </div>
                          );
                        })()}
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
        {/* ── 100-Day Cards (4 cards) ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 9, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, ...SANS, fontSize: 7.5, color: '#888' }}>
            <div style={{ width: 11, height: 11, borderRadius: 1, background: EH_FOUNDING, flexShrink: 0 }} />
            East Hampton &middot; 2026–2036
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, ...SANS, fontSize: 7.5, color: '#888' }}>
            <div style={{ width: 11, height: 11, borderRadius: 1, background: SH_FOUNDING, flexShrink: 0 }} />
            Southampton &middot; opens 2028
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, ...SANS, fontSize: 7.5, color: '#888' }}>
            <div style={{ width: 11, height: 11, borderRadius: 1, background: WH_FOUNDING, flexShrink: 0 }} />
            Westhampton &middot; opens 2030
          </div>
          <div style={{ width: 1, height: 10, background: '#2a3a4a', flexShrink: 0, margin: '0 2px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, ...SANS, fontSize: 7, color: '#666' }}>
            <div style={{ width: 9, height: 9, borderRadius: 1, background: EH_FOUNDING, flexShrink: 0 }} />
            Founding
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, ...SANS, fontSize: 7, color: '#666' }}>
            <div style={{ width: 9, height: 9, borderRadius: 1, background: EH_TARGETED, border: '0.5px solid rgba(200,172,120,0.4)', flexShrink: 0 }} />
            Engine 1
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, ...SANS, fontSize: 7, color: '#666' }}>
            <div style={{ width: 9, height: 9, borderRadius: 1, background: EH_ORGANIC, border: '0.5px solid rgba(200,172,120,0.25)', flexShrink: 0 }} />
            Engine 2
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, ...SANS, fontSize: 7.5, color: '#888' }}>
            <div style={{ width: 11, height: 11, borderRadius: 1, background: EH_FAINT, border: `0.5px solid ${GOLD_FAINT_BORDER}`, flexShrink: 0 }} />
            Projected — live from Growth Model v2
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
              team: 'Zoila incoming May 4. Flagship Relaunch April 29.',
            },
            {
              phase: '3rd 100 Days', status: 'Incoming', date: 'Apr 29 \u2013 Aug 2026',
              shareholder: <><strong>$75M target.</strong> First Wednesday Caravan. East End market presence locked.</>,
              client: "AI Council daily. Every listing at Christie's standard.",
              team: '5 agents on live OS. Scott incoming June. Southampton bench seeded.',
            },
            {
              phase: 'Ascension', status: 'Vision', date: '2027 \u2013 2036',
              shareholder: <><strong>$3.0B · three-office combined 2036.</strong> 36 elite producers. 7.5% post-maturity. Two-thirds seats, one-third market. Year 2 Profit Pool activates.</>,
              client: "Global Christie's brand. Legacy practice beyond a brokerage.",
              team: "36 elite producers across three offices by 2031 · pure compound mode through 2036 · recruiting engine dormant.",
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

        {/* ── Assumptions Block ─────────────────────────────────────────────── */}
        <div style={{
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

          {/* Headcount Scaling Table */}
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
                  // Recalculated Apr 16 2026 · Ed GCI = gross $600K 20% compound · Named = real Y1 starts 50% entry-credit Y1 only · Engine = EPM recruited seats · 7.5% post-maturity (Ed ruling B)
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



          {/* Gap Bridge footer */}
          <div style={{ borderTop: `0.5px solid ${GOLD_FAINT_BORDER}`, paddingTop: 8 }}>
            <span style={{ ...SANS, fontSize: 6.5, color: TEXT_MUTED, fontStyle: 'italic', lineHeight: 1.6 }}>
              Base engine $2.07B by 2036 (per-seat math only, no market lift). 7.5% post-maturity growth adds ~$0.93B &mdash; conservative vs Compass 11.3%, Saunders 10%+.{' '}
              <span style={{ color: GOLD, fontWeight: 600 }}>$3.0B combined · institutional floor · north star.</span>
              {' '}Per-seat ramp: <strong>$500K Y1 &rarr; $750K Y2 &rarr; $1M Y3 &rarr; 2% appreciation.</strong> 50% entry-year credit on mid-year starts. EH 2026 (9&rarr;12) &middot; SH 2028 (6&rarr;12) &middot; WH 2030 (6&rarr;12). Council dispatch Apr 16 2026.
            </span>
          </div>
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
                { label: 'Net pool 65% *', proj: [ // Ilija 65% of office net pool — dynamic from OUTPUTS
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
              {/* Ed dual-line GCI display · gross (office view) + net keep (personal view) · Ed ruling Apr 16 2026 */}
              {[
                { label: 'GCI Gross (office)',  proj: ['$600K','$720K','$864K','$3.72M'], act: null }, // 20% compound from $600K · headcount table view
                { label: 'Ed Keep (70%)',        proj: ['$420K','$504K','$605K','$2.60M'], act: null }, // 70/30 EQ1 split · personal card view
              ].map(row => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, lineHeight: 1.65 }}>
                  <span style={{ color: MUTED }}>{row.label}</span>
                  {(row.proj ?? []).map((v, i) => (
                    <span key={i} style={{ textAlign: 'right' as const, color: DIM, fontStyle: 'italic', fontSize: 6.5, fontWeight: 400 }}>{v}</span>
                  ))}
                </div>
              ))}
              <div style={{ borderTop: `0.5px solid ${CHARCOAL}`, marginTop: 3, marginBottom: 3 }} />
              {[
                { label: 'Net Personal Prod (Eq. 1)',  proj: [
                  EQ1_NET[2026],
                  EQ1_NET[2027],
                  EQ1_NET[2028],
                  EQ1_NET[2036],
                ], act: null },
                { label: 'Projected 2026',  proj: null, act: [EQ1_NET[2026] + ' \u2191','—','—','—'] },
                { label: 'Net pool 35% *', proj: [
                  livePoolRows?.find(r=>r.year==='2026') ? fmtM(livePoolRows.find(r=>r.year==='2026')!.edPool) : '—',
                  livePoolRows?.find(r=>r.year==='2027') ? fmtM(livePoolRows.find(r=>r.year==='2027')!.edPool) : '—',
                  livePoolRows?.find(r=>r.year==='2028') ? fmtM(livePoolRows.find(r=>r.year==='2028')!.edPool) : '—',
                  livePoolRows?.find(r=>r.year==='2036') ? fmtM(livePoolRows.find(r=>r.year==='2036')!.edPool) : '—',
                ], act: null },
                { label: 'AnewHomes 35%', proj: ['$17,500','$52,500','$59,063','$151,542'], act: null }, // 12.5% annual growth from $50K NOP base · Perplexity Apr 15 2026
              ].map(row => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7, lineHeight: 1.65 }}>
                  <span style={{ color: MUTED }}>{row.label}</span>
                  {(row.proj ?? row.act ?? []).map((v, i) => (
                    <span key={i} style={{ textAlign: 'right' as const, color: row.act ? GOLD : DIM, fontStyle: row.proj ? 'italic' : 'normal', fontSize: row.proj ? 6.5 : 7, fontWeight: row.act ? 600 : 400 }}>{v}</span>
                  ))}
                </div>
              ))}
              {/* Ed Projected — formula-bound to OUTPUTS row 30 (livePoolRows.edPool) per architect lane ruling April 15 2026
                   EQ1_NET + AnewHomes 35% + Net pool 35% = Projected
                   2026 canonical: $420K + $17,500 + $61,250 = $498,750 (70/30 split · Apr 16 2026) */}
              {(() => {
                // 70/30 split · locked ruling Apr 16 2026
                const EQ1_NUMS: Record<number, number> = { 2026: 420_000, 2027: 504_000, 2028: 604_800, 2036: 2_604_000 }; // 70% of gross $600K 20% compound · Ed ruling Apr 16 2026
                const ANEW_NUMS: Record<number, number> = { 2026: 17_500, 2027: 52_500, 2028: 59_063, 2036: 151_542 };
                const CANONICAL_POOL: Record<number, number> = { 2026: 61_250, 2027: 280_000, 2028: 700_000, 2036: 3_990_000 };
                const years = [2026, 2027, 2028, 2036];
                const projTotals = years.map(yr => {
                  const pool = livePoolRows?.find(r => r.year === String(yr))?.edPool ?? CANONICAL_POOL[yr];
                  return fmtM(EQ1_NUMS[yr] + ANEW_NUMS[yr] + pool);
                });
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7.5, color: GOLD, fontWeight: 500, borderTop: `0.5px solid ${CHARCOAL}`, paddingTop: 3, marginTop: 2 }}>
                    <span>Projected</span>
                    {projTotals.map((v, i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)}
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
              {[
                { label: 'Nest salary',      vals: ['$70K','$17.5K','—','—'] },
                { label: 'Producer ramp',    vals: ['$25K','$120K','$144K','$619K+'] }, // 50% entry credit Y1 ($25K of $50K target) · 20% compound from $50K base · no cap · Ed ruling Apr 16 2026
                { label: 'AnewHomes 5% *',   vals: ['$2,500','$7.5K','$8,438','$21,649'] }, // Y1 vested · Y2 $7.5K · Y3+ 12.5% growth from $50K NOP base
                { label: 'ICA Override *',   vals: ['$30K','$36K','$43.2K','$186K'] }, // Always projected · 5% of Ed gross GCI ($600K×5%=$30K · $720K×5%=$36K · $864K×5%=$43.2K · $3.72M×5%=$186K) · Angel in Ed's lane on every deal · Ed ruling Apr 16 2026
                { label: 'Team + pool',      vals: ['—','incl.','incl.','incl.'] },
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
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7.5, color: GOLD, fontWeight: 500, paddingTop: 2 }}>
                <span>All streams total</span>
                {['$127.5K','$181K','$195.6K','$827K+'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)} {/* 2026: $70K nest + $25K prod (50% entry) + $30K ICA + $2.5K AH = $127.5K · 2027: $17.5K nest + $120K prod + $36K ICA + $7.5K AH = $181K · 2028: $144K + $43.2K ICA + $8.4K AH = $195.6K · 2036: $619K + $186K ICA + $21.6K AH = $826.6K · Ed ruling Apr 16 2026 */}
              </div>
              <div style={{ ...SANS, fontSize: 5.5, color: MUTED, marginTop: 3, lineHeight: 1.5 }}>
                * Four streams: production splits (50/50 w/ Ed) &middot; ICA Override 5% Ed gross GCI (always projected · Angel in Ed’s lane on every deal) &middot; AnewHomes 5% equity (vested) &middot; team participation % &middot; 20% YoY no cap
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
                { label: 'Sales vol',    proj: ['$10M','$12M','$14.4M','$62M+'], act: null }, // Perp-verified Apr 17 2026 · 2026=$10M · 2027=$12M · 2028=$14.4M · 2036=$62M+ (exact $61.9M, rounded up per Ed ruling)
                { label: 'Actual vol',   proj: null, act: ['—','—','—','—'] },
                { label: 'GCI proj',     proj: ['$200K','$240K','$288K','$1.24M+'], act: null }, // 20% YoY from $200K · no cap · Ed ruling Apr 16 2026
                { label: 'AnewHomes 5%', proj: ['$2,500','$7,500','$8,438','$21,649'], act: null }, // 12.5% growth from $50K NOP base
                { label: 'ICA Override *',   proj: ['—','—','—','—'], act: null }, // Deal-event trigger only · activates on co-deal where Jarvis brings buyer/seller · Ed ruling Apr 16 2026
                { label: 'Net pool ref †',   proj: [
                  livePoolRows?.find(r=>r.year==='2026') ? fmtM(livePoolRows.find(r=>r.year==='2026')!.edPool + livePoolRows.find(r=>r.year==='2026')!.ilijaPool) : '—',
                  livePoolRows?.find(r=>r.year==='2027') ? fmtM(livePoolRows.find(r=>r.year==='2027')!.edPool + livePoolRows.find(r=>r.year==='2027')!.ilijaPool) : '—',
                  livePoolRows?.find(r=>r.year==='2028') ? fmtM(livePoolRows.find(r=>r.year==='2028')!.edPool + livePoolRows.find(r=>r.year==='2028')!.ilijaPool) : '—',
                  livePoolRows?.find(r=>r.year==='2036') ? fmtM(livePoolRows.find(r=>r.year==='2036')!.edPool + livePoolRows.find(r=>r.year==='2036')!.ilijaPool) : '—',
                ], act: null }, // Total NOP pool for reference — Jarvis participates via ICA Override (5% Ed GCI), not direct NOP split (D40: Ed 35% / Ilija 65% only)
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
                {['$202.5K','$247.5K','$296.4K','$988K+'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)} {/* GCI + AnewHomes 5% only · ICA Override excluded (deal-event, not projected) · Ed ruling Apr 16 2026 */}
              </div>
              <div style={{ ...SANS, fontSize: 5.5, color: MUTED, marginTop: 3, lineHeight: 1.5 }}>
                * ICA Override = deal-event trigger only &middot; activates when Jarvis brings buyer or seller on a co-deal &middot; at 50/50 split Jarvis gives 5% to Angel, Ed gives 5% to Zoila &middot; net 45/45 each &middot; not projected annually &middot; Ed ruling Apr 16 2026 &middot;
                &dagger; Net pool ref = total NOP pool shown for context only &middot; Jarvis participates via ICA Override on co-deal events, not direct split (D40: Ed 35% / Ilija 65% only)
              </div>
            </div>
          </div>

          {/* Column 3: Zoila + Scott + Richard */}
          <div>
            {/* Zoila — dual-track: nest salary + producer income */}
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
                { label: 'Nest salary',       vals: ['$70K','$17.5K','—','—'] },
                { label: 'Producer ramp',     vals: ['$25K','$150K','$180K','$774K+'] }, // 50% entry credit Y1 ($25K of $50K target) · $150K Y2 · 20% compound · no cap · Ed ruling Apr 16 2026
                { label: 'AnewHomes 5% †',    vals: ['$0 vest','$7.5K','$8,438','$21,649'] }, // vesting cliff Nov 4 2026 · activates 2027 · 12.5% growth from $50K NOP base
                { label: 'ICA Override †',   vals: ['$30K','—','—','—'] }, // 2026 only · exits pool once producing own book · 5% Ed gross GCI 2026=$30K · Ed ruling Apr 16 2026
                { label: 'Team + pool',       vals: ['—','incl.','incl.','incl.'] },
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
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr', gap: 2, ...SANS, fontSize: 7.5, color: GOLD, fontWeight: 500, paddingTop: 2 }}>
                <span>All streams total</span>
                {['$125K','$175K','$188.4K','$796K+'].map((v,i) => <span key={i} style={{ textAlign: 'right' as const }}>{v}</span>)} {/* 2026: $70K nest + $25K prod (50% entry) + $30K ICA + $0 AH vest = $125K · 2027: $17.5K nest + $150K prod + $0 ICA + $7.5K AH = $175K · 2028: $180K prod + $8.4K AH = $188.4K · 2036: $774K prod + $21.6K AH = $795.6K · Ed ruling Apr 16 2026 */}
              </div>
              <div style={{ ...SANS, fontSize: 5.5, color: MUTED, marginTop: 3, lineHeight: 1.5 }}>
                † AnewHomes 5% equity vesting cliff Nov 4, 2026 &rarr; activates 2027 forward &middot; ICA Override 2026 only · exits pool once producing own book &middot; Three streams from 2027: production splits (50/50 w/ Ed) &middot; AnewHomes 5% equity (vesting) &middot; team participation % &middot; 20% YoY no cap
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
            * Governing principle &middot; not yet contractual &middot; Net pool = GCI (vol&times;2%) minus 5% franchise royalty minus 70% agent splits minus overhead &middot; Ed 35% / Ilija 65% (D40) &middot; two parties only &middot; AnewHomes splits: Jarvis 5% &middot; Angel 5% &middot; Zoila 5% &middot; Pool 5% (D23) &middot; Actuals update per closing via Perplexity &rarr; Growth Model v2 &rarr; dashboard live &middot; PDF = html2pdf snapshot of live screen<br />
            &dagger; Zoila AnewHomes 5% in 6-month vesting period beginning May 4, 2026 &middot; vesting cliff November 4, 2026 &middot; activates 2027 forward &middot; AnewHomes split: Ed 35% &middot; Scott 35% &middot; Richard 10% &middot; Jarvis 5% &middot; Angel 5% &middot; Zoila 5% vesting &middot; Pool 5%
          </div>
          <div style={{ ...SERIF, fontSize: 8, color: '#888', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
            The foundation is proven. The model is working. The next 14 days set the trajectory.
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
