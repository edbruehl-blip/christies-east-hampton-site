/**
 * Deal Engine v1 · tRPC Router
 * Christie's East Hampton · ANEW Deal Engine
 *
 * Formulas are verbatim from DISPATCH · MANNY · DEAL ENGINE v1 BUILD · April 21 2026.
 * Acceptance Test 1 (17 Lenape): 12/12 PASS required before deploy.
 *
 * Soli Deo Gloria.
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

// ─── Constants (locked defaults, editable in Pro Mode drawer) ─────────────────
const DEFAULT_APPRECIATION   = 0.05;   // 5%/year
const DEFAULT_EXPENSE_RATIO  = 0.35;   // NOI = Rent × 0.65
const SHORT_TERM_TAX         = 0.46;   // federal + NYS blended
const LONG_TERM_TAX          = 0.35;   // federal 20% + NIIT 3.8% + NYS 10.9%
const SELL_COSTS             = 0.08;   // Southampton standard

// ─── Grade helpers ────────────────────────────────────────────────────────────

function incomeGrade(capRate: number): string {
  if (capRate >= 0.09)  return "A+";
  if (capRate >= 0.08)  return "A";
  if (capRate >= 0.07)  return "B+";
  if (capRate >= 0.06)  return "B";
  if (capRate >= 0.05)  return "C";
  return "D";
}

function basisGrade(equityPct: number): string {
  if (equityPct >= 0.20) return "A";
  if (equityPct >= 0.12) return "B";
  if (equityPct >= 0.05) return "C";
  return "D";
}

function stewardship(ig: string, bg: string): string {
  // Stewardship matrix verbatim from dispatch
  if (bg === "D") return "Pass";
  if (ig === "D" && bg === "C") return "Pass";
  if (ig === "D" && bg === "B") return "Watch";
  if (ig === "D" && bg === "A") return "Hold";
  if (ig === "C" && bg === "C") return "Watch";
  if (ig === "C" && bg === "B") return "Watch";
  if (ig === "C" && bg === "A") return "Hold";
  if (ig === "B" && (bg === "A" || bg === "B")) return "Hold";
  if (ig === "B+" && (bg === "A" || bg === "B")) return "Hold";
  if (ig === "A" && (bg === "A" || bg === "B")) return "Strong Hold";
  if (ig === "A+" && (bg === "A" || bg === "B")) return "Strong Hold";
  // Fallback for any A/A or A/B not caught above
  if ((ig === "A" || ig === "A+") && bg === "A") return "Strong Hold";
  return "Hold";
}

function dealType(capRate: number): string {
  if (capRate < 0.05)  return "Equity Play";
  if (capRate < 0.06)  return "";          // non-breaking space slot
  return "Yield Play";
}

// ─── Core scoring function (pure, testable) ───────────────────────────────────

export interface DealEngineInput {
  purchase:    number;
  addlCap:     number;
  baseValue:   number;
  rent:        number;
  holdYears:   number;
  cocPct:      number;   // e.g. 8 for 8%
  hamlet?:     string;
  // Pro Mode overrides (optional)
  appreciation?:  number;  // decimal, e.g. 0.05
  expenseRatio?:  number;  // decimal, e.g. 0.35
}

export interface DealEngineOutput {
  basis:           number;
  equity:          number;
  equityPct:       number;
  noi:             number;
  capRate:         number;
  incomeGrade:     string;
  basisGrade:      string;
  stewardship:     string;
  dealType:        string;
  coc:             number;
  tenYrValue: {
    floor:   number;
    base:    number;
    stretch: number;
  };
  sellNowAfterTax:   number;
  hold10yrAfterTax:  number;
  taxShortTerm:      number;
  taxLongTerm:       number;
}

export function computeDealEngine(input: DealEngineInput): DealEngineOutput {
  const {
    purchase,
    addlCap,
    baseValue,
    rent,
    holdYears,
    cocPct,
    appreciation = DEFAULT_APPRECIATION,
    expenseRatio = DEFAULT_EXPENSE_RATIO,
  } = input;

  const cocDecimal = cocPct / 100;

  // ── Core formulas verbatim from dispatch ──────────────────────────────────
  const basis      = purchase + addlCap;
  const equity     = baseValue - basis;
  const equityPct  = equity / basis;
  const noi        = rent * (1 - expenseRatio);
  const capRate    = noi / baseValue;
  // CoC denominator = basis (matches the "vs. Basis" label — F6.5c)
  const coc        = basis > 0 ? (noi - cocDecimal * basis) / basis : 0;

  // 10-yr value bands
  const baseGrowth = Math.pow(1 + appreciation, holdYears);
  const floor10    = baseValue * 0.90 * baseGrowth;
  const base10     = baseValue * baseGrowth;
  const stretch10  = baseValue * 1.10 * baseGrowth;

  // After-tax outcomes
  const taxRate         = holdYears < 1 ? SHORT_TERM_TAX : LONG_TERM_TAX;
  const sellNowAfterTax = (baseValue - basis - SELL_COSTS * baseValue) * (1 - taxRate);
  const hold10AfterTax  = (base10 - basis) * (1 - LONG_TERM_TAX);

  // Grades
  const ig = incomeGrade(capRate);
  const bg = basisGrade(equityPct);

  return {
    basis,
    equity,
    equityPct,
    noi,
    capRate,
    incomeGrade: ig,
    basisGrade:  bg,
    stewardship: stewardship(ig, bg),
    dealType:    dealType(capRate),
    coc,
    tenYrValue: { floor: floor10, base: base10, stretch: stretch10 },
    sellNowAfterTax,
    hold10yrAfterTax: hold10AfterTax,
    taxShortTerm: SHORT_TERM_TAX,
    taxLongTerm:  LONG_TERM_TAX,
  };
}

// ─── tRPC Router ──────────────────────────────────────────────────────────────

export const dealEngineRouter = router({
  score: publicProcedure
    .input(z.object({
      purchase:     z.number().positive(),
      addlCap:      z.number().min(0),
      baseValue:    z.number().positive(),
      rent:         z.number().min(0),
      holdYears:    z.number().positive(),
      cocPct:       z.number().min(0),
      hamlet:       z.string().optional(),
      // Pro Mode overrides
      appreciation: z.number().min(0).max(1).optional(),
      expenseRatio: z.number().min(0).max(1).optional(),
    }))
    .query(({ input }) => {
      return computeDealEngine(input);
    }),
});
