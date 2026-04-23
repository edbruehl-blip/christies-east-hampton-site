/**
 * FutureTabPrintCream.tsx — PRODUCTION-WIRED v3 · APRIL 23, 2026 · 22:05 ET
 * Christie's East Hampton Flagship · /future?pdf=1 · Cream print mirror
 *
 * SUPERSEDES: v2 (22:15 earlier tonight) and v1 (D12 staged version)
 *
 * ED RULINGS APPLIED (Apr 22 · 22:00 ET):
 *   R1 · Angel comes off Ilija Nest at Q1 2027. Her $70K Nest becomes her Personal
 *        GCI first-full-year baseline, compounding 20% YoY from 2028 forward.
 *        - 2026: Personal $50K (partial) + Nest $70K (Ilija)
 *        - 2027: Personal $70K first full + Nest $17.5K (Q1 transition) = last Nest row
 *        - 2028+: Personal compounds 20% YoY, no Nest
 *   R2 · Zoila first-full-year 2027 = $100K, compound 20% YoY. Partial 2026 = $50K
 *        (her own trades). Nest follows same pattern as Angel (ends Q1 2027).
 *   R3 · Zoila FULL parity with Angel on Override (5%), AnewHomes (5%), CIREG (1.75%)
 *        going forward. D64 doctrine (50/50 split on her own sourced deals) governs
 *        participation mechanics but does not change card display values.
 *   Scott: unchanged · $75K partial 2026, $150K first full 2027, 20% YoY to $1M cap
 *   Jarvis: unchanged · $200K 2026, 20% YoY, hits $1M cap 2035
 *
 * CANONICAL DATA FLOW · D59 LIVE-PRINT UNITY:
 *   Office volume + Net Profit pool: trpc.future.ascensionArc (OUTPUTS tab)
 *   Ed's Team GCI: trpc.future.ascensionArc.years[].edGci (OUTPUTS canon)
 *   Ed's Personal GCI: = Ed's Team GCI × 0.70 (GOVERNING rate)
 *   Team member Personal GCI: projectPersonalGci(TEAM_BASES.member, year)
 *   All rates: GOVERNING constant (agent_split, override, anewhomes, cireg)
 *   AnewHomes pool: computeAnewHomesPool(year) — § doctrine
 *   CPS1 trajectory: computeCps1(year) — ‡ doctrine
 *   Nest salaries: TEAM_NEST (hardcoded, non-projecting — Angel + Zoila only)
 */

import React, { useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';

declare global {
  interface Window { Chart?: any }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL PALETTE · ED-APPROVED · DO NOT CHANGE
// ═══════════════════════════════════════════════════════════════════════════════

const CREAM       = '#faf7f1';
const PARCHMENT   = '#efe6d1';
const MUSEUM_MAT  = '#2c2c2a';
const NAVY        = '#1a3a5c';
const GOLD        = '#947231';
const INK         = '#111';
const INK_SOFT    = '#2a2a2a';
const INK_FAINT   = '#3a3a3a';
const INK_SUBTLE  = '#5a5a5a';
const INK_ACCENT  = '#5a5041';

const COLOR_EH_FLAGSHIP = '#9e1b32'; // burgundy
const COLOR_SH_FLAGSHIP = '#1a3a5c'; // navy
const COLOR_WH_FLAGSHIP = '#947231'; // gold

const ACCENT_PERSONAL = '#9e1b32';
const ACCENT_ANEW     = '#c8946b';
const ACCENT_OVERRIDE = '#9a9a9a';
const ACCENT_PROFIT   = '#6b2838';

const SERIF = 'Georgia, serif';

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL DOCTRINE · TEAM_BASES + projectPersonalGci
// Ed rulings R1/R2/R3 · Apr 22 2026 · 22:00 ET
// ═══════════════════════════════════════════════════════════════════════════════

interface TeamBase {
  base2026: number;               // Personal GCI in 2026 (partial or full)
  firstFull2027: number | null;   // Personal GCI first-full-year if different from base2026
  cap: number;                    // Personal GCI ceiling ($1M canonical)
}

// DOCTRINE OF RECORD · Team compensation canonical bases
// NO ROSTER DEPENDENCY · this is the only source of truth for team comp math
const TEAM_BASES: Record<string, TeamBase> = {
  // Angel — partial 2026 own trades $50K, off Ilija Nest Q1 2027, first full year $70K
  angel:  { base2026:  50_000, firstFull2027:  70_000, cap: 1_000_000 },
  // Jarvis — full producer Day 1, base 2026 $250K, compounds. Hits cap 2035.
  jarvis: { base2026: 250_000, firstFull2027: null,    cap: 1_000_000 },
  // Zoila — partial 2026 own trades $50K (May 4 start), first full year 2027 $100K
  zoila:  { base2026:  50_000, firstFull2027: 100_000, cap: 1_000_000 },
  // Scott — partial 2026 $75K (June 1 start), first full year 2027 $150K
  scott:  { base2026:  75_000, firstFull2027: 150_000, cap: 1_000_000 },
};

const TEAM_GROWTH_RATE = 0.20;
const TEAM_COMP_CEILING = 1_000_000;

function projectPersonalGci(member: keyof typeof TEAM_BASES, year: number): number {
  const spec = TEAM_BASES[member];
  if (year < 2026) return 0;
  if (year === 2026) return spec.base2026;
  // Start point for compounding: either firstFull2027 (if declared) or base2026
  const startVal = spec.firstFull2027 !== null ? spec.firstFull2027 : spec.base2026;
  if (year === 2027) return startVal;
  let value = startVal;
  for (let y = 2028; y <= year; y++) {
    if (value < spec.cap) value = Math.min(value * (1 + TEAM_GROWTH_RATE), spec.cap);
  }
  return Math.round(value);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL DOCTRINE · NEST SALARY · HARDCODED, NON-PROJECTING (° FOOTNOTE)
// Both Angel and Zoila come off Ilija's Nest by end of Q1 2027.
// Angel 2026: $70K (Ilija base). Angel 2027: $17.5K (Q1 only). Angel 2028+: $0.
// Zoila 2026: $46.7K (pro-rated May 4 start). Zoila 2027: $17.5K (Q1). Zoila 2028+: $0.
// ═══════════════════════════════════════════════════════════════════════════════

const TEAM_NEST: Record<string, Record<number, number>> = {
  angel: { 2026: 70_000, 2027: 17_500, 2028: 0, 2036: 0 },
  zoila: { 2026: 46_700, 2027: 17_500, 2028: 0, 2036: 0 },
};

function getNest(member: 'angel' | 'zoila', year: number): number {
  return TEAM_NEST[member]?.[year] ?? 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL DOCTRINE · ANEWHOMES POOL (§ FOOTNOTE)
// ═══════════════════════════════════════════════════════════════════════════════

function computeAnewHomesPool(year: number): number {
  if (year <= 2025) return 0;
  if (year === 2026) return  50_000;
  if (year === 2027) return 150_000;
  return Math.round(150_000 * Math.pow(1.125, year - 2027));
}

const GOVERNING = {
  agent_split: 0.70,    // Ed Personal = Ed Team × 0.70
  override:    0.05,    // Angel/Jarvis/Zoila each get 5% × Ed Team GCI
  anewhomes: {
    ed: 0.35, scott: 0.35, richard: 0.10,
    angel: 0.05, jarvis: 0.05, zoila: 0.05,  // 5% reserve held, not displayed
  },
  cireg: {
    ed: 0.2975, ilija: 0.65,
    angel: 0.0175, jarvis: 0.0175, zoila: 0.0175,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL DOCTRINE · CPS1 + CIRE NODE (‡ FOOTNOTE · VISIBILITY ONLY)
// ═══════════════════════════════════════════════════════════════════════════════

function computeCps1(year: number): number {
  if (year <= 2025) return 0;
  if (year === 2026) return   100_000;
  if (year === 2027) return   250_000;
  if (year === 2028) return   500_000;
  if (year === 2029) return   750_000;
  if (year === 2030) return 1_000_000;
  return Math.round(1_000_000 * Math.pow(1.02, year - 2030));
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZOILA TRANSITIONAL OVERRIDE († FOOTNOTE · RETIRED under R3)
// R3: Zoila gets FULL parity with Angel going forward. No transitional array needed.
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL FALLBACK · OUTPUTS (used only if tRPC wires fail)
// ═══════════════════════════════════════════════════════════════════════════════

const FALLBACK_OUTPUTS: Record<string, Record<number, number>> = {
  edTeamGci:  { 2026: 600_000,  2027: 720_000,  2028: 864_000,  2036: 3_600_000 },
  netProfit:  { 2026: 174_800,  2027: 430_300,  2028: 964_700,  2036: 11_390_000 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// FORMATTING · clean $K/$M, no "+" suffix (deprecated under TEAM_BASES canon)
// ═══════════════════════════════════════════════════════════════════════════════

function fmtK(n: number): string {
  if (n === 0) return '—';
  if (n < 1_000) return `$${n}`;
  if (n < 1_000_000) {
    const k = Math.round(n / 1_000);
    return `$${k}K`;
  }
  const m = n / 1_000_000;
  return Number.isInteger(m) ? `$${m}M` : `$${m.toFixed(2)}M`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARD DATA DERIVATION · all cells compute from canonical inputs
// ═══════════════════════════════════════════════════════════════════════════════

interface CardData {
  name: string;
  title: string;
  nestNote?: string;
  rows: { label: string; values: [string, string, string, string]; accent: string }[];
  total: { values: [string, string, string, string] };
  footnotes: string[];
}

const DISPLAY_YEARS: [number, number, number, number] = [2026, 2027, 2028, 2036];

function deriveCards(edTeamGci: Record<number, number>, netProfit: Record<number, number>): CardData[] {
  const fmtYears = (calc: (y: number) => number): [string, string, string, string] =>
    DISPLAY_YEARS.map(y => fmtK(calc(y))) as [string, string, string, string];

  const AH  = (y: number) => computeAnewHomesPool(y);
  const CPS = (y: number) => computeCps1(y);
  const T   = (y: number) => edTeamGci[y] ?? 0;
  const NP  = (y: number) => netProfit[y] ?? 0;
  const cpsValues = fmtYears(CPS);

  // ── CARD 1 · EDWARD BRUEHL ───────────────────────────────────────────────────
  const edPersonal = (y: number) => T(y) * GOVERNING.agent_split;
  const edAnew     = (y: number) => AH(y) * GOVERNING.anewhomes.ed;
  const edProfit   = (y: number) => NP(y) * GOVERNING.cireg.ed;
  const edTotal    = (y: number) => edPersonal(y) + edAnew(y) + edProfit(y);

  const card1: CardData = {
    name: 'Edward Bruehl',
    title: 'Broker · Managing Director',
    rows: [
      { label: "Ed's Team GCI (reference)",   values: fmtYears(T),          accent: ACCENT_PERSONAL },
      { label: 'Personal GCI',                 values: fmtYears(edPersonal), accent: ACCENT_PERSONAL },
      { label: 'AnewHomes 35% §',              values: fmtYears(edAnew),     accent: ACCENT_ANEW     },
      { label: 'CIREG Profit Share 29.75%',    values: fmtYears(edProfit),   accent: ACCENT_PROFIT   },
      { label: 'CPS1 + CIRE Node ‡',           values: cpsValues,            accent: ACCENT_PROFIT   },
    ],
    total: { values: fmtYears(edTotal) },
    footnotes: [
      "Ed's Team GCI reference only — not in total",
      'CPS1 + CIRE Node visibility only — not in total',
    ],
  };

  // ── CARD 2 · ILIJA PAVLOVIC ──────────────────────────────────────────────────
  const ilijaProfit = (y: number) => NP(y) * GOVERNING.cireg.ilija;

  const card2: CardData = {
    name: 'Ilija Pavlovic',
    title: 'Franchise Principal · CIREG Tri-State',
    rows: [
      { label: 'CIREG Profit Share 65% **',    values: fmtYears(ilijaProfit), accent: ACCENT_PROFIT },
      { label: 'CPS1 + CIRE Node ‡',           values: cpsValues,             accent: ACCENT_PROFIT },
    ],
    total: { values: fmtYears(ilijaProfit) },
    footnotes: ['CPS1 + CIRE Node visibility only — not in total'],
  };

  // ── CARD 3 · ANGEL THEODORE ──────────────────────────────────────────────────
  const angelPersonal = (y: number) => projectPersonalGci('angel', y);
  const angelNest     = (y: number) => getNest('angel', y);
  const angelAnew     = (y: number) => AH(y) * GOVERNING.anewhomes.angel;
  const angelOverride = (y: number) => T(y) * GOVERNING.override;
  const angelProfit   = (y: number) => NP(y) * GOVERNING.cireg.angel;
  const angelTotal    = (y: number) =>
    angelPersonal(y) + angelNest(y) + angelAnew(y) + angelOverride(y) + angelProfit(y);

  const card3: CardData = {
    name: 'Angel Theodore',
    title: 'Agent · Marketing Coordinator',
    nestNote: "Nest salary · Ilija · through Q1 2027 · Comes onto Ed's payroll 2027",
    rows: [
      { label: 'Personal GCI',                 values: fmtYears(angelPersonal), accent: ACCENT_PERSONAL },
      { label: 'Nest Salary °',                values: fmtYears(angelNest),     accent: ACCENT_ANEW     },
      { label: 'AnewHomes 5% §',               values: fmtYears(angelAnew),     accent: ACCENT_ANEW     },
      { label: "Ed's ICA Override 5%",         values: fmtYears(angelOverride), accent: ACCENT_OVERRIDE },
      { label: 'CIREG Profit Share 1.75%',     values: fmtYears(angelProfit),   accent: ACCENT_PROFIT   },
      { label: 'CPS1 + CIRE Node ‡',           values: cpsValues,               accent: ACCENT_PROFIT   },
    ],
    total: { values: fmtYears(angelTotal) },
    footnotes: ['CPS1 + CIRE Node visibility only — not in total'],
  };

  // ── CARD 4 · JARVIS SLADE ────────────────────────────────────────────────────
  const jarvisPersonal = (y: number) => projectPersonalGci('jarvis', y);
  const jarvisAnew     = angelAnew;
  const jarvisOverride = angelOverride;
  const jarvisProfit   = angelProfit;
  const jarvisTotal    = (y: number) =>
    jarvisPersonal(y) + jarvisAnew(y) + jarvisOverride(y) + jarvisProfit(y);

  const card4: CardData = {
    name: 'Jarvis Slade',
    title: 'Agent · COO',
    rows: [
      { label: 'Personal GCI',                 values: fmtYears(jarvisPersonal), accent: ACCENT_PERSONAL },
      { label: 'AnewHomes 5% §',               values: fmtYears(jarvisAnew),     accent: ACCENT_ANEW     },
      { label: "Ed's ICA Override 5%",         values: fmtYears(jarvisOverride), accent: ACCENT_OVERRIDE },
      { label: 'CIREG Profit Share 1.75%',     values: fmtYears(jarvisProfit),   accent: ACCENT_PROFIT   },
      { label: 'CPS1 + CIRE Node ‡',           values: cpsValues,                accent: ACCENT_PROFIT   },
    ],
    total: { values: fmtYears(jarvisTotal) },
    footnotes: ['CPS1 + CIRE Node visibility only — not in total'],
  };

  // ── CARD 5 · ZOILA ORTEGA ASTOR (R3 FULL PARITY WITH ANGEL) ─────────────────
  const zoilaPersonal = (y: number) => projectPersonalGci('zoila', y);
  const zoilaNest     = (y: number) => getNest('zoila', y);
  const zoilaAnew     = angelAnew;       // full parity
  const zoilaOverride = angelOverride;   // full parity — D64 governs 50/50 on self-sourced deals
  const zoilaProfit   = angelProfit;     // full parity
  const zoilaTotal    = (y: number) =>
    zoilaPersonal(y) + zoilaNest(y) + zoilaAnew(y) + zoilaOverride(y) + zoilaProfit(y);

  const card5: CardData = {
    name: 'Zoila Ortega Astor',
    title: 'Broker/Agent · Office Director',
    nestNote: 'Nest salary · Ilija · through Q1 2027 · Start May 4 2026 (pro-rated)',
    rows: [
      { label: 'Personal GCI',                 values: fmtYears(zoilaPersonal), accent: ACCENT_PERSONAL },
      { label: 'Nest Salary °',                values: fmtYears(zoilaNest),     accent: ACCENT_ANEW     },
      { label: 'AnewHomes 5% §',               values: fmtYears(zoilaAnew),     accent: ACCENT_ANEW     },
      { label: "Ed's ICA Override 5%",         values: fmtYears(zoilaOverride), accent: ACCENT_OVERRIDE },
      { label: 'CIREG Profit Share 1.75%',     values: fmtYears(zoilaProfit),   accent: ACCENT_PROFIT   },
      { label: 'CPS1 + CIRE Node ‡',           values: cpsValues,               accent: ACCENT_PROFIT   },
    ],
    total: { values: fmtYears(zoilaTotal) },
    footnotes: ['CPS1 + CIRE Node visibility only — not in total'],
  };

  // ── CARD 6 · SCOTT SMITH ─────────────────────────────────────────────────────
  const scottPersonal = (y: number) => projectPersonalGci('scott', y);
  const scottAnew     = (y: number) => AH(y) * GOVERNING.anewhomes.scott;
  const scottTotal    = (y: number) => scottPersonal(y) + scottAnew(y);

  const card6: CardData = {
    name: 'Scott Smith',
    title: 'Agent · AnewHomes Co. Partner',
    rows: [
      { label: 'Personal GCI',                 values: fmtYears(scottPersonal), accent: ACCENT_PERSONAL },
      { label: 'AnewHomes 35% §',              values: fmtYears(scottAnew),     accent: ACCENT_ANEW     },
    ],
    total: { values: fmtYears(scottTotal) },
    footnotes: [],
  };

  // ── CARD 7 · RICHARD BRUEHL ──────────────────────────────────────────────────
  const richardAnew = (y: number) => AH(y) * GOVERNING.anewhomes.richard;

  const card7: CardData = {
    name: 'Richard Bruehl',
    title: 'Strategic Advisor · AnewHomes Co. Partner',
    rows: [
      { label: 'AnewHomes 10% §',              values: fmtYears(richardAnew), accent: ACCENT_ANEW },
    ],
    total: { values: fmtYears(richardAnew) },
    footnotes: [],
  };

  return [card1, card2, card3, card4, card5, card6, card7];
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function FutureTabPrintCream() {
  const { data: arcData } = trpc.future.ascensionArc.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });

  const arcYear = (yr: number) => arcData?.years?.find(y => y.year === yr);
  const pull = (getter: (y: any) => number | undefined, fallbackKey: keyof typeof FALLBACK_OUTPUTS, year: number): number =>
    getter(arcYear(year)) ?? FALLBACK_OUTPUTS[fallbackKey][year] ?? 0;

  const edTeamGci: Record<number, number> = {};
  const netProfit: Record<number, number> = {};
  for (const y of DISPLAY_YEARS) {
    edTeamGci[y] = pull((y2: any) => y2?.edGci,      'edTeamGci', y);
    netProfit[y] = pull((y2: any) => y2?.netProfit, 'netProfit', y);
  }

  const cards = deriveCards(edTeamGci, netProfit);

  return (
    <div style={{ background: CREAM, fontFamily: SERIF, color: INK }}>
      <Page1 arcData={arcData} />
      <Page2 cards={cards} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — Ascension Arc chart + 100-day cards
// ═══════════════════════════════════════════════════════════════════════════════

function Page1({ arcData }: { arcData: any }) {
  return (
    <section className="pfc-page pfc-page-1"
      style={{ background: CREAM, padding: '18px 14px 16px', pageBreakAfter: 'always', breakAfter: 'page' }}>
      <BrandBand />
      <ArcChartCream arcData={arcData} />
      <ChartLegend />
      <BrandSignature />
      <HundredDayCards />
      <PageNumber>Page 1 of 2</PageNumber>
    </section>
  );
}

function BrandBand() {
  return (
    <div style={{ textAlign: 'center', fontSize: 8.5, letterSpacing: 3, textTransform: 'uppercase',
      color: INK, paddingBottom: 6, borderBottom: `1px solid ${GOLD}`, marginBottom: 12 }}>
      Christie's · International Real Estate Group · East Hampton · Est. 1766
    </div>
  );
}

function ArcChartCream({ arcData }: { arcData: any }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const init = () => {
      if (!window.Chart || !canvasRef.current) { setTimeout(init, 50); return; }
      const years = ['2025','2026','2027','2028','2029','2030','2031','2032','2033','2034','2035','2036'];
      const ehTotal = years.map((_, i) => {
        const yr = 2025 + i;
        return arcData?.years?.find((y: any) => y.year === yr)?.ehVolume || [20, 75, 125.9, 211.7, 295.5, 410.7, 566.6, 597.6, 676.3, 784.9, 932.6, 1133.3][i];
      });
      const shHampton = years.map((_, i) => {
        const yr = 2025 + i;
        return arcData?.years?.find((y: any) => y.year === yr)?.shVolume || [0, 0, 0, 42.1, 161.4, 285.2, 422.1, 507.4, 607.3, 698.4, 821.6, 987.8][i];
      });
      const whHampton = years.map((_, i) => {
        const yr = 2025 + i;
        return arcData?.years?.find((y: any) => y.year === yr)?.whVolume || [0, 0, 0, 0, 0, 56.7, 230.5, 352.3, 452.4, 592.9, 737.8, 878.9][i];
      });
      const totalByYear = years.map((_, i) => ehTotal[i] + shHampton[i] + whHampton[i]);
      const fmt = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(2)}B` : `$${Math.round(v)}M`;

      const totalLabelsPlugin = {
        id: 'pfc-total-labels',
        afterDatasetsDraw(chart: any) {
          const { ctx, scales: { x, y } } = chart;
          ctx.save();
          ctx.fillStyle = INK_FAINT;
          ctx.font = 'bold 11px Georgia, serif';
          ctx.textAlign = 'center';
          totalByYear.forEach((t, i) => ctx.fillText(fmt(t), x.getPixelForValue(i), y.getPixelForValue(t) - 8));
          ctx.restore();
        },
      };

      new window.Chart(canvasRef.current, {
        type: 'bar',
        data: {
          labels: years,
          datasets: [
            { data: ehTotal,    backgroundColor: COLOR_EH_FLAGSHIP, borderColor: '#000', borderWidth: 2, stack: 'o', barPercentage: 0.85, categoryPercentage: 0.92 },
            { data: shHampton,  backgroundColor: COLOR_SH_FLAGSHIP, borderColor: '#000', borderWidth: 2, stack: 'o', barPercentage: 0.85, categoryPercentage: 0.92 },
            { data: whHampton,  backgroundColor: COLOR_WH_FLAGSHIP, borderColor: '#000', borderWidth: 2, stack: 'o', barPercentage: 0.85, categoryPercentage: 0.92 },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { stacked: true, beginAtZero: true, max: 3500,
                 ticks: { color: INK_FAINT, font: { size: 12, family: 'Georgia, serif', weight: 'bold' as const }, padding: -38, mirror: true, z: 10, callback: (v: any) => `$${v >= 1000 ? (v / 1000).toFixed(1) + 'B' : v + 'M'}` },
                 grid: { color: 'rgba(148,114,49,0.15)' }, border: { color: 'rgba(148,114,49,0.5)' } },
            x: { stacked: true,
                 ticks: { color: INK_FAINT, font: { size: 13, family: 'Georgia, serif', weight: 'bold' as const }, padding: 8 },
                 grid: { display: false }, border: { color: 'rgba(148,114,49,0.5)' } },
          },
        },
        plugins: [totalLabelsPlugin],
      });
    };
    init();
  }, [arcData]);

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <div style={{ background: MUSEUM_MAT, padding: 10, borderRadius: 10 }}>
        <div style={{ background: CREAM, border: '2px solid #000', padding: '14px 18px 18px' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
            <div style={{ fontSize: 20, letterSpacing: 5, color: INK, fontFamily: SERIF }}>
              CHRISTIE'S EAST HAMPTON FLAGSHIP
            </div>
            <div style={{ fontSize: 13, letterSpacing: 2, color: INK_SUBTLE, fontFamily: SERIF, marginTop: 3, fontStyle: 'italic' }}>
              Ascension Arc · 2026 through 2036 and beyond
            </div>
          </div>
          <div style={{ position: 'relative', width: '100%', height: 440, marginTop: 4 }}>
            <canvas ref={canvasRef} role="img" aria-label="Three-office cream ascension arc chart" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartLegend() {
  const Swatch = ({ color }: { color: string }) => (
    <span style={{ width: 13, height: 13, background: color, border: '1px solid #000', display: 'inline-block' }} />
  );
  const item: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 7 };
  return (
    <div style={{ padding: '13px 0', borderTop: '1px solid #c9bf9f', borderBottom: '1px solid #c9bf9f', margin: '16px 0 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 28, fontSize: 11, color: INK_FAINT, fontFamily: SERIF }}>
        <span style={item}><Swatch color={COLOR_EH_FLAGSHIP} /> East Hampton Flagship</span>
        <span style={item}><Swatch color={COLOR_SH_FLAGSHIP} /> Southampton Flagship · 2028</span>
        <span style={item}><Swatch color={COLOR_WH_FLAGSHIP} /> Westhampton Flagship · 2030</span>
      </div>
    </div>
  );
}

function BrandSignature() {
  return (
    <div style={{ marginTop: 18, textAlign: 'center', padding: '12px 0' }}>
      <div style={{ fontSize: 13, color: INK, fontFamily: SERIF, letterSpacing: 5 }}>
        CHRISTIE'S INTERNATIONAL REAL ESTATE
      </div>
      <div style={{ fontSize: 10, color: INK_SUBTLE, fontFamily: SERIF, letterSpacing: 3, marginTop: 5, fontStyle: 'italic' }}>
        Art · Beauty · Provenance
      </div>
      <div style={{ fontSize: 12, color: GOLD, fontFamily: SERIF, letterSpacing: 7, marginTop: 6, fontWeight: 600 }}>
        SINCE 1766
      </div>
    </div>
  );
}

type HundredDayCardProps = { label: string; status: string; dates: string; accent: string; shareholder: string; client: string; team: string };

const HUNDRED_DAY_CARDS: HundredDayCardProps[] = [
  { label: '1st 100 Days', status: 'Done',     dates: 'Dec 2025 – Mar 2026', accent: '#9a9a9a',
    shareholder: '$4.57M closed. 9 Daniels Hole Road $2.47M. 2 Old Hollow $2.10M. Dashboard live Day 1.',
    client: 'AnewHomes proven at $2.47M. Every deal scored before the first showing.',
    team: '26 Park Place operational. Open before the sign went up.' },
  { label: '2nd 100 Days', status: 'Doing',    dates: 'Mar – Apr 29, 2026', accent: GOLD,
    shareholder: '$19.72M in exclusive listings. 25 Horseshoe Road $5.75M in contract. 191 Bull Path $3.60M active.',
    client: "Schneps Media pilot in motion. Dan's Papers channel in play. NYC outreach through Melissa True, Rockefeller and Flatiron desks.",
    team: 'Angel Day One April 25. Zoila start May 4. Flagship relaunch April 29.' },
  { label: '3rd 100 Days', status: 'Incoming', dates: 'Apr 29 – Aug 2026', accent: '#c8946b',
    shareholder: '$75M 2026 trajectory. First Wednesday Caravan live. East End flagship presence.',
    client: "Daily intelligence briefing in market. Every listing at Christie's standard.",
    team: '5 agents on live OS. Scott joins June 1. Southampton pre-launch in motion.' },
  { label: 'Ascension', status: 'Vision',     dates: '2027 – 2036', accent: NAVY,
    shareholder: '$3.00B three-office combined 2036. 36 elite producers at maturity. Profit sharing opens Year 2 (2027).',
    client: "Global Christie's brand. Legacy practice. Not a brokerage.",
    team: 'Three offices fully staffed by 2031. Team complete. Steady growth carries through 2036.' },
];

function HundredDayCards() {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 9 }}>
        {HUNDRED_DAY_CARDS.map((c, i) => <HundredDayCard key={i} {...c} />)}
      </div>
    </div>
  );
}

function HundredDayCard({ label, status, dates, accent, shareholder, client, team }: HundredDayCardProps) {
  return (
    <div style={{ border: '2px solid #000', borderLeft: `5px solid ${accent}`, background: CREAM, overflow: 'hidden' }}>
      <div style={{ background: PARCHMENT, padding: '8px 10px 8px', borderBottom: `1px solid ${GOLD}` }}>
        <div style={{ fontSize: 8.5, letterSpacing: 1.8, color: GOLD, fontWeight: 500, marginBottom: 3, textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 12, letterSpacing: 1.5, color: NAVY, fontWeight: 500, textTransform: 'uppercase', lineHeight: 1.1 }}>{status}</div>
        <div style={{ fontSize: 7.5, color: INK_ACCENT, fontStyle: 'italic', marginTop: 3, letterSpacing: 0.3 }}>{dates}</div>
      </div>
      <div style={{ padding: '9px 10px 10px' }}>
        <SectionLine heading="Shareholder" body={shareholder} />
        <SectionLine heading="Client" body={client} />
        <SectionLine heading="Team" body={team} />
      </div>
    </div>
  );
}

function SectionLine({ heading, body }: { heading: string; body: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 7, letterSpacing: 1.4, color: GOLD, fontWeight: 500, marginBottom: 2, textTransform: 'uppercase' }}>{heading}</div>
      <div style={{ fontSize: 8.5, lineHeight: 1.48, color: INK_SOFT }}>{body}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — Partner card grid + Model Levers + Footnotes
// ═══════════════════════════════════════════════════════════════════════════════

function Page2({ cards }: { cards: CardData[] }) {
  return (
    <section className="pfc-page pfc-page-2"
      style={{ background: CREAM, padding: '22px 14px 16px', pageBreakBefore: 'always', breakBefore: 'page' }}>
      <BrandBand />
      <div style={{ textAlign: 'center', fontSize: 14, letterSpacing: 4, textTransform: 'uppercase', color: NAVY, fontWeight: 500, padding: '2px 0 10px', borderBottom: `1px solid ${GOLD}`, marginBottom: 12 }}>
        Partnership Projections · 2026 – 2036
      </div>
      <PartnerCardGrid cards={cards} />
      <ChartLegend />
      <ModelAssumptionLevers />
      <CanonicalFootnotes />
      <BrandSignature />
      <UHNWCardLink />
      <PageNumber>Page 2 of 2</PageNumber>
    </section>
  );
}

function PartnerCardGrid({ cards }: { cards: CardData[] }) {
  const col1 = [cards[0], cards[1]];
  const col2 = [cards[2], cards[3]];
  const col3 = [cards[4], cards[5], cards[6]];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr)', gap: 7, marginBottom: 11 }}>
      <Column cards={col1} />
      <Column cards={col2} />
      <Column cards={col3} />
    </div>
  );
}

function Column({ cards }: { cards: CardData[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0, justifyContent: 'center' }}>
      {cards.map((card, i) => <PartnerCardView key={i} card={card} />)}
    </div>
  );
}

function PartnerCardView({ card }: { card: CardData }) {
  return (
    <div style={{ border: '2px solid #000', background: CREAM, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
      <div style={{ background: PARCHMENT, padding: '5px 8px 4px', borderBottom: `1px solid ${GOLD}` }}>
        <div style={{ letterSpacing: 1.8, fontSize: 10.5, textTransform: 'uppercase', fontWeight: 500, lineHeight: 1.15 }}>{card.name}</div>
        <div style={{ fontSize: 8.5, color: INK_ACCENT, fontStyle: 'italic', marginTop: 1, lineHeight: 1.25 }}>{card.title}</div>
        {card.nestNote && (
          <div style={{ fontSize: 7.5, color: '#7a6b4a', fontStyle: 'italic', marginTop: 2, lineHeight: 1.25 }}>{card.nestNote}</div>
        )}
      </div>
      <div style={{ padding: '6px 7px 7px' }}>
        <RowHeader />
        {card.rows.map((r, i) => <TableRow key={i} row={r} />)}
        <TotalRow total={card.total} />
        {card.footnotes.map((fn, i) => (
          <div key={i} style={{ fontSize: 6.5, color: INK_ACCENT, fontStyle: 'italic', padding: '2px 0 0 4px', lineHeight: 1.3 }}>
            {fn}
          </div>
        ))}
      </div>
    </div>
  );
}

function RowHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, padding: '1.5px 0 1.5px 4px', lineHeight: 1.2,
      fontSize: 6.5, letterSpacing: 0.5, textTransform: 'uppercase', color: GOLD, fontWeight: 500, marginBottom: 2,
      borderLeft: '2px solid transparent' }}>
      <div style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap' }}>Stream</div>
      <div style={{ width: 30, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0 }}>2026</div>
      <div style={{ width: 30, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0 }}>2027</div>
      <div style={{ width: 30, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0 }}>2028</div>
      <div style={{ width: 36, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0 }}>2036</div>
    </div>
  );
}

function TableRow({ row }: { row: { label: string; values: [string, string, string, string]; accent: string } }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, padding: '1.5px 0 1.5px 4px',
      lineHeight: 1.2, fontSize: 9, borderLeft: `2px solid ${row.accent}`, marginTop: 0.5 }}>
      <div style={{ flex: 1, minWidth: 0, wordBreak: 'keep-all' }}>{row.label}</div>
      {row.values.map((v, i) => (
        <div key={i} style={{ width: i === 3 ? 36 : 30, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0, color: INK_FAINT, fontStyle: 'italic' }}>{v}</div>
      ))}
    </div>
  );
}

function TotalRow({ total }: { total: { values: [string, string, string, string] } }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, padding: '4px 0 1px 4px',
      marginTop: 3, borderTop: '1px solid #000', fontSize: 9.5, fontWeight: 500 }}>
      <div style={{ flex: 1, minWidth: 0, wordBreak: 'keep-all' }}>All Streams Total</div>
      {total.values.map((v, i) => (
        <div key={i} style={{ width: i === 3 ? 36 : 30, textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0, color: GOLD, fontStyle: 'normal', fontWeight: 500 }}>{v}</div>
      ))}
    </div>
  );
}

function ModelAssumptionLevers() {
  return (
    <div style={{ border: '2px solid #000', background: CREAM, marginTop: 16 }}>
      <div style={{ background: PARCHMENT, padding: '9px 12px 8px', borderBottom: `1px solid ${GOLD}` }}>
        <div style={{ letterSpacing: 5, fontSize: 15, textTransform: 'uppercase', fontWeight: 500, textAlign: 'center', color: NAVY }}>
          Model Assumption Levers
        </div>
        <div style={{ fontSize: 9, color: INK_ACCENT, fontStyle: 'italic', textAlign: 'center', marginTop: 3, letterSpacing: 1 }}>
          Three live levers · Output summary
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14, padding: '14px 14px 10px' }}>
        <Lever label="Top Producers / Office"     value="12 PPL"  position={40} />
        <Lever label="Projected GCI Commission"   value="2.00%"   position={25} />
        <Lever label="Pros Starting Production"   value="$500K"   position={16.7} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, padding: '6px 10px 10px' }}>
        <Output label="Flagship 3-Yr Cumulative" value="$413M" />
        <Output label="2029 Flagship Cumulative" value="$708M" />
        <Output label="2036 Combined Volume"     value="$3.00B" />
      </div>
    </div>
  );
}

function Lever({ label, value, position }: { label: string; value: string; position: number }) {
  return (
    <div style={{ padding: '6px 10px 8px', display: 'flex', flexDirection: 'column', gap: 5, borderBottom: '1px solid rgba(148,114,49,0.4)', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <div style={{ fontSize: 7.5, letterSpacing: 1, color: GOLD, textTransform: 'uppercase', lineHeight: 1.25 }}>{label}</div>
        <div style={{ fontSize: 14, color: INK, fontWeight: 500, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>{value}</div>
      </div>
      <div style={{ width: '100%', height: 2, background: 'rgba(148,114,49,0.25)', margin: '4px 0 0', borderRadius: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', width: 10, height: 10, background: GOLD, borderRadius: '50%', border: '1px solid #000', left: `${position}%` }} />
      </div>
    </div>
  );
}

function Output({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: NAVY, padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, minWidth: 0 }}>
      <div style={{ fontSize: 7, letterSpacing: 1, color: '#c9bf9f', textTransform: 'uppercase', lineHeight: 1.2 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#ebe6db', fontWeight: 500, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>{value}</div>
    </div>
  );
}

function CanonicalFootnotes() {
  const cellStyle: React.CSSProperties = { padding: 0 };
  const headingStyle: React.CSSProperties = { fontSize: 8.5, letterSpacing: 1.2, textTransform: 'uppercase', color: NAVY, fontWeight: 500, marginBottom: 3 };
  const bodyStyle: React.CSSProperties = { fontSize: 8, color: INK_SOFT, lineHeight: 1.4 };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, padding: 11, borderTop: '1px solid rgba(148,114,49,0.3)' }}>
        <div style={cellStyle}>
          <div style={headingStyle}>* Governing Principle</div>
          <div style={bodyStyle}>
            Not yet contractual. CIREG Profit Share splits pool as Ed 29.75%, Angel/Jarvis/Zoila 1.75% each, Ilija 65%. Flagship team Personal GCI compounds 20% YoY from each member's first-full-year base until $1M cap, then flat. Ed's Team GCI is the OUTPUTS step-function; Ed's Personal GCI = Team × 70%.
          </div>
        </div>
        <div style={cellStyle}>
          <div style={headingStyle}>° Nest Salary</div>
          <div style={bodyStyle}>
            Ilija-funded bridge salary during onboarding. Angel: $70K 2026, $17.5K through Q1 2027, then ends (Angel's 2027 Personal GCI of $70K replaces the Nest). Zoila: $46.7K 2026 (pro-rated May 4 start), $17.5K through Q1 2027, then ends (Zoila's 2027 Personal GCI of $100K replaces the Nest).
          </div>
        </div>
        <div style={cellStyle}>
          <div style={headingStyle}>‡ CPS1 + CIRE Node Pipeline</div>
          <div style={bodyStyle}>
            Flagship-sourced developer pipeline routed through Flagship ICA. UHNW buyers meet new product in any Christie's market. Ramps $100K (2026) to $1M (2030), then 2% steady-state. Visibility only — not additive to totals. Full doctrine in the Canonical Reference Library.
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, padding: '0 11px 11px' }}>
        <div style={cellStyle}>
          <div style={headingStyle}>** Ilija Franchise Principal</div>
          <div style={bodyStyle}>
            CIREG Profit Share 65% captures full partnership take. 5% Christie's master royalty is Ilija's cost on his side of the partnership. Not surfaced on any partner card.
          </div>
        </div>
        <div style={cellStyle}>
          <div style={headingStyle}>§ AnewHomes Co.</div>
          <div style={bodyStyle}>
            Ed Bruehl's vertically-integrated build platform with Scott Smith as Build Partner (June 1 2026), Richard Bruehl as Strategic Advisor, flagship team carrying equity. Pool $50K 2026 · $150K 2027 · 12.5% CAGR through 2036. Distribution: Ed 35%, Scott 35%, Richard 10%, Angel/Jarvis/Zoila 5% each, 5% pool reserve.
          </div>
        </div>
        <div style={cellStyle}>
          <div style={headingStyle}>Zoila Self-Sourced Deals (D64)</div>
          <div style={bodyStyle}>
            When Zoila is the sourcing producer on a deal, the split is 50/50 Ed-Zoila on that deal, and Zoila does not take her Ed's ICA Override on that deal. On deals sourced by other producers in Ed's ICA, Zoila receives the full 5% Override at parity with Angel and Jarvis.
          </div>
        </div>
      </div>
    </>
  );
}

function UHNWCardLink() {
  return (
    <div style={{ background: CREAM, padding: '14px 14px 16px', height: 'fit-content', minHeight: 'auto', marginTop: 12 }}>
      <div style={{ border: '2px solid #000', background: CREAM, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: 0, overflow: 'hidden' }}>
        <div style={{ background: PARCHMENT, padding: '12px 16px 12px', borderRight: `1px solid ${GOLD}`, flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 7.5, letterSpacing: 1.8, textTransform: 'uppercase', color: GOLD, fontWeight: 500, marginBottom: 4 }}>Client Resource</div>
          <div style={{ fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase', color: NAVY, fontWeight: 500, lineHeight: 1.2 }}>UHNW Wealth Path Card</div>
          <div style={{ fontSize: 9, color: INK_ACCENT, fontStyle: 'italic', marginTop: 4, lineHeight: 1.3, letterSpacing: 0.3 }}>The Christie's Standard applied to UHNW family wealth stewardship.</div>
        </div>
        <div style={{ padding: '12px 18px 12px 14px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
          <div style={{ fontSize: 7, letterSpacing: 1.4, textTransform: 'uppercase', color: GOLD, fontWeight: 500 }}>Open Card</div>
          <div style={{ fontSize: 9, color: NAVY, letterSpacing: 0.3, fontWeight: 500 }}>
            <span style={{ color: GOLD }}>→ </span>
            christiesrealestategroupeh.com/cards/uhnw-path
          </div>
        </div>
      </div>
    </div>
  );
}

function PageNumber({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ textAlign: 'right', fontSize: 7.5, letterSpacing: 1.5, color: INK_SUBTLE, marginTop: 10 }}>
      {children}
    </div>
  );
}