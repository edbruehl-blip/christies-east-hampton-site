/**
 * FutureTabPrintCream.tsx — PRODUCTION-WIRED · APRIL 22 2026 LATE EVENING
 * Christie's East Hampton Flagship · /future?pdf=1 · Cream print mirror
 *
 * SUPERSEDES: All prior versions including c168f593 hardcoded snapshot.
 *
 * CANONICAL DATA FLOW · D59 LIVE-PRINT UNITY:
 *   This component reads from the SAME tRPC endpoints the screen dashboard uses.
 *   Every partner card cell traces to a canonical source:
 *     - Office volume + Net Profit + Ed/Ilija pool: trpc.future.ascensionArc (OUTPUTS tab)
 *     - Named producer Personal GCI 2026/27/28: trpc.future.partnerCards (ROSTER tab)
 *     - Personal GCI 2031 (for Scott trajectory): trpc.future.growthModel (ROSTER tab)
 *     - 2036 Personal GCI for Ed: ascensionArc.years[10].edGci (VOLUME tab)
 *     - AnewHomes company total per year: derived from canonical doctrine
 *         ($50K 2026 · $150K 2027 · 12.5% CAGR 2028-2036) — § AnewHomes footnote
 *     - CPS1 + CIRE Node trajectory: derived from canonical doctrine
 *         ($100K 2026 → $1M 2030 → 2% steady-state) — ‡ CPS1 footnote
 *     - Vesting timing: † Zoila footnote doctrine (cliff Nov 4 2026, activates 2027)
 *     - Nest Salary: ° Nest Salary footnote doctrine (Angel + Zoila pro-rated)
 *     - Override percentages: * Governing footnote doctrine
 *
 * ED RULING APRIL 22 2026 (LATE EVENING):
 *   - All chart-canonical fixes from Perp pro forma audit applied
 *   - Personal GCI = 70% × Team GCI (formula, not snapshot)
 *   - Override 5% = 5% × Team GCI (formula, not snapshot)
 *   - Scott Smith 2036 = 20% YoY compound from ROSTER 2031 per * Governing
 *     "20% year-over-year, uncapped". If ROSTER 2031 unavailable, fallback to
 *     v14_3b approved value $324K with doctrine trace pending June 1 review.
 *
 * FALLBACK DISCIPLINE:
 *   If any tRPC wire fails, the component renders canonical fallback values
 *   (the v14_3b wireframe values). Print never renders empty cells, undefined,
 *   or null. Either live data or canonical fallback. Always traceable.
 *
 * WHEN ED CHANGES A SHEET CELL:
 *   On next page load (5-min stale time on cache), both screen and print show
 *   the new value. Same source, same render, two color modes.
 */

import React, { useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import Chart from 'chart.js/auto';

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL PALETTE · APPROVED ED RULING APRIL 22 2026
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

// Three-office bar colors — Ed-approved chart colors, do not change
const COLOR_EH_FLAGSHIP = '#9e1b32'; // burgundy
const COLOR_SH_FLAGSHIP = '#1a3a5c'; // navy
const COLOR_WH_FLAGSHIP = '#947231'; // gold

// Partner card row accent borders (inline hex, not separate constants)
const ACCENT_PERSONAL = '#9e1b32'; // burgundy — Personal GCI rows
const ACCENT_ANEW     = '#c8946b'; // tan — AnewHomes rows
const ACCENT_OVERRIDE = '#9a9a9a'; // gray — Ed's Team GCI Override rows
const ACCENT_PROFIT   = '#6b2838'; // dark burgundy — Profit Share + CPS1 rows

const SERIF = 'Georgia, serif';

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL DOCTRINE CONSTANTS · TRACE TO FOOTNOTES
// ═══════════════════════════════════════════════════════════════════════════════

// § AnewHomes Co. doctrine — $50K 2026, $150K 2027, 12.5% CAGR thereafter
function computeAnewHomesPool(year: number): number {
  if (year <= 2025) return 0;
  if (year === 2026) return 50_000;
  if (year === 2027) return 150_000;
  // 12.5% CAGR from $150K (2027) for years 2028+
  return Math.round(150_000 * Math.pow(1.125, year - 2027));
}

// ‡ CPS1 + CIRE Node doctrine — ramps $100K → $1M by 2030, then 2% steady-state
function computeCps1(year: number): number {
  if (year <= 2025) return 0;
  if (year === 2026) return 100_000;
  if (year === 2027) return 250_000;
  if (year === 2028) return 500_000;
  if (year === 2029) return 750_000;
  if (year === 2030) return 1_000_000;
  // 2% YoY from $1M (2030) for years 2031+
  return Math.round(1_000_000 * Math.pow(1.02, year - 2030));
}

// AnewHomes participant percentages — sum to 100% across the 6 named participants + Pool reserve
const ANEW_PCT = {
  ed:      0.35,  // Ed Bruehl — Architect
  scott:   0.35,  // Scott Smith — Build Partner
  richard: 0.10,  // Richard Bruehl — Strategic Advisor
  angel:   0.05,
  jarvis:  0.05,
  zoila:   0.05,
  pool:    0.05,  // Reserved (not on cards)
};

// CIREG Profit Share percentages — * Governing doctrine, sum to 100%
const PROFIT_SHARE_PCT = {
  ed:     0.2975, // 29.75%
  ilija:  0.65,   // 65%
  angel:  0.0175, // 1.75%
  jarvis: 0.0175, // 1.75%
  zoila:  0.0175, // 1.75%
};

// Override percentage — Ed's Team GCI × 5%
const OVERRIDE_PCT = 0.05;

// Personal GCI = Team GCI × 70% (* Governing — agent split)
const AGENT_SPLIT = 0.70;

// Nest Salary doctrine — ° footnote
// Angel: $70K full 2026, $17.5K Q1 2027 only, then $0
// Zoila: $46.7K pro-rated from May 4 2026 (8 months × $5,833/mo), $17.5K Q1 2027 only
const NEST_ANGEL  = { 2026: 70_000,  2027: 17_500, 2028: 0, 2036: 0 };
const NEST_ZOILA  = { 2026: 46_700,  2027: 17_500, 2028: 0, 2036: 0 };

// Zoila vesting cliff — † footnote
// AnewHomes 5% and Profit Share 1.75% activate 2027 forward (cliff Nov 4 2026)
// Override applies 2026 + Q1 2027 only ($30K + $9K)
const ZOILA_VESTED = (year: number) => year >= 2027;
const ZOILA_OVERRIDE = { 2026: 30_000, 2027: 9_000, 2028: 0, 2036: 0 };

// ═══════════════════════════════════════════════════════════════════════════════
// FORMATTING HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function fmtK(n: number): string {
  if (n === 0) return '—';
  if (n < 1_000) return `$${n}`;
  if (n < 1_000_000) {
    const k = n / 1_000;
    return Number.isInteger(k) ? `$${k}K` : `$${k.toFixed(1)}K`;
  }
  const m = n / 1_000_000;
  return Number.isInteger(m) ? `$${m}M` : `$${m.toFixed(2)}M`;
}

// Format with "+" suffix for forward-projected approximations (Scott, Angel, Jarvis, Zoila 2036)
function fmtKApprox(n: number): string {
  if (n === 0) return '—';
  return fmtK(n) + '+';
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL FALLBACK · v14_3b WIREFRAME (used only if all wires fail)
// ═══════════════════════════════════════════════════════════════════════════════

const FALLBACK_OUTPUTS = {
  // Ed's Team GCI per year — OUTPUTS canonical step-function
  edTeamGci: { 2026: 600_000, 2027: 720_000, 2028: 864_000, 2036: 3_600_000 },
  // Net Operating Profit pool per year — OUTPUTS column G
  netProfit: { 2026: 175_000, 2027: 429_534, 2028: 964_694, 2036: 11_400_000 },
  // Ed Personal GCI per year (already 70% of Team)
  edPersonalGci: { 2026: 420_000, 2027: 504_000, 2028: 605_000, 2036: 2_520_000 },
  // Named producer Personal GCI from ROSTER
  angelGci:   { 2026:  17_500, 2027:  84_000, 2028: 100_800, 2031: 174_000 },
  jarvisGci:  { 2026: 140_000, 2027: 168_000, 2028: 201_600, 2031: 348_000 },
  zoilaGci:   { 2026:  17_500, 2027: 105_000, 2028: 126_000, 2031: 217_000 },
  scottGci:   { 2026:  35_000, 2027:  84_000, 2028: 100_800, 2031: 130_000 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PARTNER CARD DERIVATION · LIVE WIRE → CANONICAL VALUES
// ═══════════════════════════════════════════════════════════════════════════════

interface DerivedAgentValues {
  personal: { y26: number; y27: number; y28: number; y36: number };
  // Additional fields per card type built up by deriveCards
}

interface CardData {
  name: string;
  title: string;
  nestNote?: string;
  rows: { label: string; values: [string, string, string, string]; accent: string }[];
  total: { values: [string, string, string, string] };
  footnotes: string[];
}

function deriveCards(opts: {
  edTeamGci: { y26: number; y27: number; y28: number; y36: number };
  netProfit: { y26: number; y27: number; y28: number; y36: number };
  edPersonalGci: { y26: number; y27: number; y28: number; y36: number };
  angelGci: { y26: number; y27: number; y28: number; y36: number };
  jarvisGci: { y26: number; y27: number; y28: number; y36: number };
  zoilaGci: { y26: number; y27: number; y28: number; y36: number };
  scottGci: { y26: number; y27: number; y28: number; y36: number };
}): CardData[] {
  const Y = [2026, 2027, 2028, 2036] as const;

  // AnewHomes pool per year — doctrine
  const anewPool = { y26: computeAnewHomesPool(2026), y27: computeAnewHomesPool(2027), y28: computeAnewHomesPool(2028), y36: computeAnewHomesPool(2036) };

  // CPS1 trajectory per year — doctrine
  const cps1 = { y26: computeCps1(2026), y27: computeCps1(2027), y28: computeCps1(2028), y36: computeCps1(2036) };

  // ── CARD 1: EDWARD BRUEHL ────────────────────────────────────────────────────
  const ed_personal = opts.edPersonalGci;
  const ed_team     = opts.edTeamGci;
  const ed_anew     = { y26: anewPool.y26 * ANEW_PCT.ed, y27: anewPool.y27 * ANEW_PCT.ed, y28: anewPool.y28 * ANEW_PCT.ed, y36: anewPool.y36 * ANEW_PCT.ed };
  const ed_profit   = { y26: opts.netProfit.y26 * PROFIT_SHARE_PCT.ed, y27: opts.netProfit.y27 * PROFIT_SHARE_PCT.ed, y28: opts.netProfit.y28 * PROFIT_SHARE_PCT.ed, y36: opts.netProfit.y36 * PROFIT_SHARE_PCT.ed };
  const ed_cps1     = cps1;
  const ed_total    = {
    y26: ed_personal.y26 + ed_anew.y26 + ed_profit.y26,
    y27: ed_personal.y27 + ed_anew.y27 + ed_profit.y27,
    y28: ed_personal.y28 + ed_anew.y28 + ed_profit.y28,
    y36: ed_personal.y36 + ed_anew.y36 + ed_profit.y36,
  };

  const card1: CardData = {
    name: 'Edward Bruehl',
    title: 'Broker – Managing Director',
    rows: [
      { label: "Ed's Team GCI (reference)",  values: [fmtK(ed_team.y26), fmtK(ed_team.y27), fmtK(ed_team.y28), fmtK(ed_team.y36)], accent: ACCENT_PERSONAL },
      { label: 'Personal GCI',                values: [fmtK(ed_personal.y26), fmtK(ed_personal.y27), fmtK(ed_personal.y28), fmtK(ed_personal.y36)], accent: ACCENT_PERSONAL },
      { label: 'AnewHomes 35% * §',           values: [fmtK(ed_anew.y26), fmtK(ed_anew.y27), fmtK(ed_anew.y28), fmtK(ed_anew.y36)], accent: ACCENT_ANEW },
      { label: 'CIREG Profit Share 29.75% *', values: [fmtK(ed_profit.y26), fmtK(ed_profit.y27), fmtK(ed_profit.y28), fmtK(ed_profit.y36)], accent: ACCENT_PROFIT },
      { label: 'CPS1 + CIRE Node ‡',          values: [fmtK(ed_cps1.y26), fmtK(ed_cps1.y27), fmtK(ed_cps1.y28), fmtK(ed_cps1.y36)], accent: ACCENT_PROFIT },
    ],
    total: { values: [fmtK(ed_total.y26), fmtK(ed_total.y27), fmtK(ed_total.y28), fmtK(ed_total.y36)] },
    footnotes: [
      "Ed's Team GCI reference only — not included in total",
      'CPS1 + CIRE Node visibility only — not included in total',
    ],
  };

  // ── CARD 2: ILIJA PAVLOVIC ───────────────────────────────────────────────────
  const ilija_profit = { y26: opts.netProfit.y26 * PROFIT_SHARE_PCT.ilija, y27: opts.netProfit.y27 * PROFIT_SHARE_PCT.ilija, y28: opts.netProfit.y28 * PROFIT_SHARE_PCT.ilija, y36: opts.netProfit.y36 * PROFIT_SHARE_PCT.ilija };
  const ilija_total  = ilija_profit;

  const card2: CardData = {
    name: 'Ilija Pavlovic',
    title: 'Franchise Principal · CIREG Tri-State',
    rows: [
      { label: 'CIREG Profit Share 65% **', values: [fmtK(ilija_profit.y26), fmtK(ilija_profit.y27), fmtK(ilija_profit.y28), fmtK(ilija_profit.y36)], accent: ACCENT_PROFIT },
      { label: 'CPS1 + CIRE Node ‡',         values: [fmtK(cps1.y26), fmtK(cps1.y27), fmtK(cps1.y28), fmtK(cps1.y36)], accent: ACCENT_PROFIT },
    ],
    total: { values: [fmtK(ilija_total.y26), fmtK(ilija_total.y27), fmtK(ilija_total.y28), fmtK(ilija_total.y36)] },
    footnotes: ['CPS1 + CIRE Node visibility only — not included in total'],
  };

  // ── CARD 3: ANGEL THEODORE ───────────────────────────────────────────────────
  const angel_personal = opts.angelGci;
  const angel_nest     = NEST_ANGEL;
  const angel_anew     = { y26: anewPool.y26 * ANEW_PCT.angel, y27: anewPool.y27 * ANEW_PCT.angel, y28: anewPool.y28 * ANEW_PCT.angel, y36: anewPool.y36 * ANEW_PCT.angel };
  const angel_override = { y26: ed_team.y26 * OVERRIDE_PCT, y27: ed_team.y27 * OVERRIDE_PCT, y28: ed_team.y28 * OVERRIDE_PCT, y36: ed_team.y36 * OVERRIDE_PCT };
  const angel_profit   = { y26: opts.netProfit.y26 * PROFIT_SHARE_PCT.angel, y27: opts.netProfit.y27 * PROFIT_SHARE_PCT.angel, y28: opts.netProfit.y28 * PROFIT_SHARE_PCT.angel, y36: opts.netProfit.y36 * PROFIT_SHARE_PCT.angel };
  const angel_total    = {
    y26: angel_personal.y26 + angel_nest[2026] + angel_anew.y26 + angel_override.y26 + angel_profit.y26,
    y27: angel_personal.y27 + angel_nest[2027] + angel_anew.y27 + angel_override.y27 + angel_profit.y27,
    y28: angel_personal.y28 + angel_nest[2028] + angel_anew.y28 + angel_override.y28 + angel_profit.y28,
    y36: angel_personal.y36 + angel_nest[2036] + angel_anew.y36 + angel_override.y36 + angel_profit.y36,
  };

  const card3: CardData = {
    name: 'Angel Theodore',
    title: 'Agent – Marketing Coordinator',
    nestNote: 'Nest salary $70K/yr · through Q1 2027',
    rows: [
      { label: 'Personal GCI',                 values: [fmtK(angel_personal.y26), fmtK(angel_personal.y27), fmtK(angel_personal.y28), fmtKApprox(angel_personal.y36)], accent: ACCENT_PERSONAL },
      { label: 'Nest Salary °',                values: [fmtK(angel_nest[2026]), fmtK(angel_nest[2027]), fmtK(angel_nest[2028]), fmtK(angel_nest[2036])], accent: ACCENT_ANEW },
      { label: 'AnewHomes 5% §',               values: [fmtK(angel_anew.y26), fmtK(angel_anew.y27), fmtK(angel_anew.y28), fmtK(angel_anew.y36)], accent: ACCENT_ANEW },
      { label: "Ed's Team GCI Override 5%",    values: [fmtK(angel_override.y26), fmtK(angel_override.y27), fmtK(angel_override.y28), fmtK(angel_override.y36)], accent: ACCENT_OVERRIDE },
      { label: 'CIREG Profit Share 1.75%',     values: [fmtK(angel_profit.y26), fmtK(angel_profit.y27), fmtK(angel_profit.y28), fmtK(angel_profit.y36)], accent: ACCENT_PROFIT },
      { label: 'CPS1 + CIRE Node ‡',           values: [fmtK(cps1.y26), fmtK(cps1.y27), fmtK(cps1.y28), fmtK(cps1.y36)], accent: ACCENT_PROFIT },
    ],
    total: { values: [fmtK(angel_total.y26), fmtK(angel_total.y27), fmtK(angel_total.y28), fmtKApprox(angel_total.y36)] },
    footnotes: ['CPS1 + CIRE Node visibility only — not included in total'],
  };

  // ── CARD 4: JARVIS SLADE ─────────────────────────────────────────────────────
  const jarvis_personal = opts.jarvisGci;
  const jarvis_anew     = angel_anew; // Same 5% on same pool
  const jarvis_override = angel_override; // Same 5% on same Ed Team GCI
  const jarvis_profit   = angel_profit; // Same 1.75% on same pool
  const jarvis_total    = {
    y26: jarvis_personal.y26 + jarvis_anew.y26 + jarvis_override.y26 + jarvis_profit.y26,
    y27: jarvis_personal.y27 + jarvis_anew.y27 + jarvis_override.y27 + jarvis_profit.y27,
    y28: jarvis_personal.y28 + jarvis_anew.y28 + jarvis_override.y28 + jarvis_profit.y28,
    y36: jarvis_personal.y36 + jarvis_anew.y36 + jarvis_override.y36 + jarvis_profit.y36,
  };

  const card4: CardData = {
    name: 'Jarvis Slade',
    title: 'Agent – COO',
    rows: [
      { label: 'Personal GCI',                 values: [fmtK(jarvis_personal.y26), fmtK(jarvis_personal.y27), fmtK(jarvis_personal.y28), fmtKApprox(jarvis_personal.y36)], accent: ACCENT_PERSONAL },
      { label: 'AnewHomes 5% §',               values: [fmtK(jarvis_anew.y26), fmtK(jarvis_anew.y27), fmtK(jarvis_anew.y28), fmtK(jarvis_anew.y36)], accent: ACCENT_ANEW },
      { label: "Ed's Team GCI Override 5%",    values: [fmtK(jarvis_override.y26), fmtK(jarvis_override.y27), fmtK(jarvis_override.y28), fmtK(jarvis_override.y36)], accent: ACCENT_OVERRIDE },
      { label: 'CIREG Profit Share 1.75%',     values: [fmtK(jarvis_profit.y26), fmtK(jarvis_profit.y27), fmtK(jarvis_profit.y28), fmtK(jarvis_profit.y36)], accent: ACCENT_PROFIT },
      { label: 'CPS1 + CIRE Node ‡',           values: [fmtK(cps1.y26), fmtK(cps1.y27), fmtK(cps1.y28), fmtK(cps1.y36)], accent: ACCENT_PROFIT },
    ],
    total: { values: [fmtK(jarvis_total.y26), fmtK(jarvis_total.y27), fmtK(jarvis_total.y28), fmtKApprox(jarvis_total.y36)] },
    footnotes: ['CPS1 + CIRE Node visibility only — not included in total'],
  };

  // ── CARD 5: ZOILA ORTEGA ASTOR ───────────────────────────────────────────────
  const zoila_personal = opts.zoilaGci;
  const zoila_nest     = NEST_ZOILA;
  const zoila_anew     = { y26: 0, y27: anewPool.y27 * ANEW_PCT.zoila, y28: anewPool.y28 * ANEW_PCT.zoila, y36: anewPool.y36 * ANEW_PCT.zoila };
  const zoila_override = ZOILA_OVERRIDE;
  const zoila_profit   = { y26: 0, y27: opts.netProfit.y27 * PROFIT_SHARE_PCT.zoila, y28: opts.netProfit.y28 * PROFIT_SHARE_PCT.zoila, y36: opts.netProfit.y36 * PROFIT_SHARE_PCT.zoila };
  const zoila_total    = {
    y26: zoila_personal.y26 + zoila_nest[2026] + zoila_anew.y26 + zoila_override[2026] + zoila_profit.y26,
    y27: zoila_personal.y27 + zoila_nest[2027] + zoila_anew.y27 + zoila_override[2027] + zoila_profit.y27,
    y28: zoila_personal.y28 + zoila_nest[2028] + zoila_anew.y28 + zoila_override[2028] + zoila_profit.y28,
    y36: zoila_personal.y36 + zoila_nest[2036] + zoila_anew.y36 + zoila_override[2036] + zoila_profit.y36,
  };

  const card5: CardData = {
    name: 'Zoila Ortega Astor †',
    title: 'Broker/Agent – Office Director',
    nestNote: 'Nest salary $70K/yr · Start May 4 2026',
    rows: [
      { label: 'Personal GCI',                 values: [fmtK(zoila_personal.y26), fmtK(zoila_personal.y27), fmtK(zoila_personal.y28), fmtKApprox(zoila_personal.y36)], accent: ACCENT_PERSONAL },
      { label: 'Nest Salary °',                values: [fmtK(zoila_nest[2026]), fmtK(zoila_nest[2027]), fmtK(zoila_nest[2028]), fmtK(zoila_nest[2036])], accent: ACCENT_ANEW },
      { label: 'AnewHomes 5% † §',             values: [fmtK(zoila_anew.y26), fmtK(zoila_anew.y27), fmtK(zoila_anew.y28), fmtK(zoila_anew.y36)], accent: ACCENT_ANEW },
      { label: "Ed's Team GCI Override †",     values: [fmtK(zoila_override[2026]), fmtK(zoila_override[2027]), fmtK(zoila_override[2028]), fmtK(zoila_override[2036])], accent: ACCENT_OVERRIDE },
      { label: 'CIREG Profit Share 1.75% †',   values: [fmtK(zoila_profit.y26), fmtK(zoila_profit.y27), fmtK(zoila_profit.y28), fmtK(zoila_profit.y36)], accent: ACCENT_PROFIT },
      { label: 'CPS1 + CIRE Node ‡',           values: [fmtK(cps1.y26), fmtK(cps1.y27), fmtK(cps1.y28), fmtK(cps1.y36)], accent: ACCENT_PROFIT },
    ],
    total: { values: [fmtK(zoila_total.y26), fmtK(zoila_total.y27), fmtK(zoila_total.y28), fmtKApprox(zoila_total.y36)] },
    footnotes: ['CPS1 + CIRE Node visibility only — not included in total'],
  };

  // ── CARD 6: SCOTT SMITH ──────────────────────────────────────────────────────
  // Scott 2036 ruling: 20% YoY compound from ROSTER 2031 per * Governing
  const scott_personal = opts.scottGci;
  const scott_anew     = { y26: anewPool.y26 * ANEW_PCT.scott, y27: anewPool.y27 * ANEW_PCT.scott, y28: anewPool.y28 * ANEW_PCT.scott, y36: anewPool.y36 * ANEW_PCT.scott };
  const scott_total    = {
    y26: scott_personal.y26 + scott_anew.y26,
    y27: scott_personal.y27 + scott_anew.y27,
    y28: scott_personal.y28 + scott_anew.y28,
    y36: scott_personal.y36 + scott_anew.y36,
  };

  const card6: CardData = {
    name: 'Scott Smith *',
    title: 'Agent – AnewHomes Co. Partner',
    rows: [
      { label: 'Personal GCI',     values: [fmtK(scott_personal.y26), fmtK(scott_personal.y27), fmtK(scott_personal.y28), fmtKApprox(scott_personal.y36)], accent: ACCENT_PERSONAL },
      { label: 'AnewHomes 35% §',  values: [fmtK(scott_anew.y26), fmtK(scott_anew.y27), fmtK(scott_anew.y28), fmtK(scott_anew.y36)], accent: ACCENT_ANEW },
    ],
    total: { values: [fmtK(scott_total.y26), fmtK(scott_total.y27), fmtK(scott_total.y28), fmtKApprox(scott_total.y36)] },
    footnotes: [],
  };

  // ── CARD 7: RICHARD BRUEHL ───────────────────────────────────────────────────
  const richard_anew = { y26: anewPool.y26 * ANEW_PCT.richard, y27: anewPool.y27 * ANEW_PCT.richard, y28: anewPool.y28 * ANEW_PCT.richard, y36: anewPool.y36 * ANEW_PCT.richard };

  const card7: CardData = {
    name: 'Richard Bruehl',
    title: 'Strategic Advisor – AnewHomes Co. Partner',
    rows: [
      { label: 'AnewHomes 10% §', values: [fmtK(richard_anew.y26), fmtK(richard_anew.y27), fmtK(richard_anew.y28), fmtK(richard_anew.y36)], accent: ACCENT_ANEW },
    ],
    total: { values: [fmtK(richard_anew.y26), fmtK(richard_anew.y27), fmtK(richard_anew.y28), fmtK(richard_anew.y36)] },
    footnotes: [],
  };

  return [card1, card2, card3, card4, card5, card6, card7];
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function FutureTabPrintCream() {
  // Live wires — same endpoints the screen dashboard uses
  const { data: arcData } = trpc.future.ascensionArc.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });
  const { data: pcData } = trpc.future.partnerCards.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });
  const { data: gmData } = trpc.future.growthModel.useQuery(undefined, {
    retry: false, staleTime: 5 * 60 * 1000,
  });

  // Helper — pull a year from ascensionArc.years[] safely
  const arcYear = (yr: number) => arcData?.years?.find(y => y.year === yr);

  // Build canonical inputs from live wires, with v14_3b fallback per cell
  const opts = {
    edTeamGci: {
      y26: arcYear(2026)?.edGci || FALLBACK_OUTPUTS.edTeamGci[2026],
      y27: arcYear(2027)?.edGci || FALLBACK_OUTPUTS.edTeamGci[2027],
      y28: arcYear(2028)?.edGci || FALLBACK_OUTPUTS.edTeamGci[2028],
      y36: arcYear(2036)?.edGci || FALLBACK_OUTPUTS.edTeamGci[2036],
    },
    netProfit: {
      y26: arcYear(2026)?.netProfit || FALLBACK_OUTPUTS.netProfit[2026],
      y27: arcYear(2027)?.netProfit || FALLBACK_OUTPUTS.netProfit[2027],
      y28: arcYear(2028)?.netProfit || FALLBACK_OUTPUTS.netProfit[2028],
      y36: arcYear(2036)?.netProfit || FALLBACK_OUTPUTS.netProfit[2036],
    },
    edPersonalGci: {
      // Personal GCI = Team GCI × 70% (* Governing)
      y26: (arcYear(2026)?.edGci || FALLBACK_OUTPUTS.edTeamGci[2026]) * AGENT_SPLIT,
      y27: (arcYear(2027)?.edGci || FALLBACK_OUTPUTS.edTeamGci[2027]) * AGENT_SPLIT,
      y28: (arcYear(2028)?.edGci || FALLBACK_OUTPUTS.edTeamGci[2028]) * AGENT_SPLIT,
      y36: (arcYear(2036)?.edGci || FALLBACK_OUTPUTS.edTeamGci[2036]) * AGENT_SPLIT,
    },
    angelGci: extractAgent(pcData, gmData, 'Angel', FALLBACK_OUTPUTS.angelGci),
    jarvisGci: extractAgent(pcData, gmData, 'Jarvis', FALLBACK_OUTPUTS.jarvisGci),
    zoilaGci: extractAgent(pcData, gmData, 'Zoila', FALLBACK_OUTPUTS.zoilaGci),
    scottGci: extractAgent(pcData, gmData, 'Scott', FALLBACK_OUTPUTS.scottGci),
  };

  const cards = deriveCards(opts);

  return (
    <div style={{ background: CREAM, fontFamily: SERIF, color: INK }}>
      <Page1 arcData={arcData} />
      <Page2 cards={cards} />
    </div>
  );
}

// Helper — find an agent in partnerCards or growthModel data, project 2036 from 2031 at 20% YoY
function extractAgent(
  pcData: any,
  gmData: any,
  partialName: string,
  fallback: { 2026: number; 2027: number; 2028: number; 2031: number },
): { y26: number; y27: number; y28: number; y36: number } {
  const pcAgent = pcData?.agents?.find((a: any) => String(a.name).toLowerCase().includes(partialName.toLowerCase()));
  const gmAgent = gmData?.agents?.find((a: any) => String(a.name).toLowerCase().includes(partialName.toLowerCase()));

  const y26 = pcAgent?.gci2026 || gmAgent?.gci2026 || fallback[2026];
  const y27 = pcAgent?.gci2027 || gmAgent?.gci2027 || fallback[2027];
  const y28 = pcAgent?.gci2028 || gmAgent?.gci2028 || fallback[2028];
  const y31 = gmAgent?.gci2031 || fallback[2031];

  // 2036 = 20% YoY compound from 2031 (5 years) per * Governing "20% year-over-year, uncapped"
  const y36 = Math.round(y31 * Math.pow(1.20, 5));

  return { y26, y27, y28, y36 };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1: Brand band → Arc chart → Legend → Brand signature → 100-day cards
// ═══════════════════════════════════════════════════════════════════════════════

function Page1({ arcData }: { arcData: any }) {
  return (
    <section
      className="pfc-page pfc-page-1"
      style={{ background: CREAM, padding: '18px 14px 16px', pageBreakAfter: 'always', breakAfter: 'page' }}
    >
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
    <div style={{
      textAlign: 'center', fontSize: 8.5, letterSpacing: 3, textTransform: 'uppercase',
      color: INK, paddingBottom: 6, borderBottom: `1px solid ${GOLD}`, marginBottom: 12,
    }}>
      Christie's · International Real Estate Group · East Hampton · Est. 1766
    </div>
  );
}

function ArcChartCream({ arcData }: { arcData: any }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const init = () => {
      if (!canvasRef.current) return;

      const years = ['2025','2026','2027','2028','2029','2030','2031','2032','2033','2034','2035','2036'];

      // Wire to live ascensionArc data (CHART_DATA via VOLUME tab in OUTPUTS)
      // Fallback to canonical CHART_DATA values if wire fails (Perp-verified zero drift)
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
          totalByYear.forEach((t, i) => {
            ctx.fillText(fmt(t), x.getPixelForValue(i), y.getPixelForValue(t) - 8);
          });
          ctx.restore();
        },
      };

      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
      chartRef.current = new Chart(canvasRef.current, {
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
            y: {
              stacked: true, beginAtZero: true, max: 3500,
              ticks: { color: INK_FAINT, font: { size: 12, family: 'Georgia, serif', weight: 'bold' as const }, padding: -38, mirror: true, z: 10, callback: (v: any) => `$${v >= 1000 ? (v / 1000).toFixed(1) + 'B' : v + 'M'}` },
              grid: { color: 'rgba(148,114,49,0.15)' },
              border: { color: 'rgba(148,114,49,0.5)' },
            },
            x: {
              stacked: true,
              ticks: { color: INK_FAINT, font: { size: 13, family: 'Georgia, serif', weight: 'bold' as const }, padding: 8 },
              grid: { display: false },
              border: { color: 'rgba(148,114,49,0.5)' },
            },
          },
        },
        plugins: [totalLabelsPlugin],
      });
    };
    init();
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
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

// 100-day cards — doctrine artifacts (status update content), hardcoded by design
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
// PAGE 2: Partner cards (live-wired) → Legend → Levers → Footnotes → UHNW
// ═══════════════════════════════════════════════════════════════════════════════

function Page2({ cards }: { cards: CardData[] }) {
  return (
    <section
      className="pfc-page pfc-page-2"
      style={{ background: CREAM, padding: '22px 14px 16px', pageBreakBefore: 'always', breakBefore: 'page' }}
    >
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
            Not yet contractual. Profit pool = GCI less 5% royalty, 70% agent splits, and overhead. Flagship team takes 35% (Ed 29.75%, Angel 1.75%, Jarvis 1.75%, Zoila 1.75%). Franchise takes 65%. 20% year-over-year, uncapped. Scott Smith 2036 forward-projected from ROSTER 2031 at 20% YoY per this doctrine.
          </div>
        </div>
        <div style={cellStyle}>
          <div style={headingStyle}>† Zoila Vesting</div>
          <div style={bodyStyle}>
            AnewHomes 5% and CIREG Profit Share 1.75% vest over six months from May 4 2026. Cliff November 4 2026. Activates 2027 forward. Ed's Team GCI Override applies 2026 and Q1 2027 only.
          </div>
        </div>
        <div style={cellStyle}>
          <div style={headingStyle}>‡ CPS1 + CIRE Node Pipeline</div>
          <div style={bodyStyle}>
            Flagship-sourced developer pipeline routed through Flagship ICA. UHNW buyers meet new product in any Christie's market. Ramps $100K (2026) to $1M (2030), then 2% steady-state. Visibility only — not additive to totals. Full doctrine: Christie's East Hampton Canonical Reference Library.
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
          <div style={headingStyle}>° Nest Salary</div>
          <div style={bodyStyle}>
            Pro-rated through Q1 2027 producer transition. Angel: $70K/yr full 2026, $17.5K Q1 2027 only. Zoila: $46.7K pro-rated from May 4 2026, $17.5K Q1 2027 only.
          </div>
        </div>
        <div style={cellStyle}>
          <div style={headingStyle}>§ AnewHomes Co.</div>
          <div style={bodyStyle}>
            Ed Bruehl's vertically-integrated build platform with Scott Smith as Build Partner (June 1 2026 start), Richard Bruehl as Strategic Advisor, and flagship team carrying equity. Growth trajectory: $50K 2026 · $150K 2027 · 12.5% CAGR 2028-2036 (company total $433K by 2036). Conservative base case pending post-June 1 doctrine review with Scott. Full doctrine: Christie's East Hampton Canonical Reference Library.
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
