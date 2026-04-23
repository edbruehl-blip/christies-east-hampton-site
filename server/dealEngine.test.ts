/**
 * Deal Engine v1 · Acceptance Test
 * Christie's East Hampton · ANEW Deal Engine
 *
 * ACCEPTANCE TEST 1 · 17 LENAPE · GATE BEFORE DEPLOY
 * All twelve must land. If any fail: fix, re-test, do not deploy.
 *
 * Inputs: Purchase $1,500,000 · Add'l Cap $185,000 · Base $2,100,000 ·
 *         Rent $148,000 · Hold 10 yrs · CoC 8%
 *
 * Expected (12/12):
 *  1. All-In Basis: $1,685,000
 *  2. Equity Day One: $415,000
 *  3. Equity %: 24.6%
 *  4. NOI: $96,200
 *  5. Cap Rate: 4.6%
 *  6. Income Grade: D
 *  7. Basis Grade: A
 *  8. Stewardship: Hold
 *  9. Deal Type: Equity Play
 * 10. Cash-on-Cash (vs. Basis): -2.3%  (denominator = basis, F6.5c)
 * 11. 10-Yr Value (Base): $3,421,000
 * 12. After-Tax Sell Now: $161,000
 * 12b. After-Tax Hold 10-Yr: $1,128,000
 *
 * Soli Deo Gloria.
 */

import { describe, it, expect } from "vitest";
import { computeDealEngine } from "./routers/dealEngine";

// ─── Helper: round to nearest dollar ─────────────────────────────────────────
const round = (n: number) => Math.round(n);
const roundK = (n: number) => Math.round(n / 1000) * 1000;

// ─── ACCEPTANCE TEST 1 · 17 LENAPE ───────────────────────────────────────────
describe("Deal Engine v1 · Acceptance Test 1 · 17 Lenape", () => {
  const result = computeDealEngine({
    purchase:  1_500_000,
    addlCap:     185_000,
    baseValue: 2_100_000,
    rent:        148_000,
    holdYears:        10,
    cocPct:            8,
  });

  it("1. All-In Basis = $1,685,000", () => {
    expect(round(result.basis)).toBe(1_685_000);
  });

  it("2. Equity Day One = $415,000", () => {
    expect(round(result.equity)).toBe(415_000);
  });

  it("3. Equity % = 24.6%", () => {
    // 415,000 / 1,685,000 = 0.24629... → 24.6%
    expect(Math.round(result.equityPct * 1000) / 10).toBe(24.6);
  });

  it("4. NOI = $96,200", () => {
    // 148,000 × 0.65 = 96,200
    expect(round(result.noi)).toBe(96_200);
  });

  it("5. Cap Rate = 4.6%", () => {
    // 96,200 / 2,100,000 = 0.04580... → 4.6%
    expect(Math.round(result.capRate * 1000) / 10).toBe(4.6);
  });

  it("6. Income Grade = D", () => {
    expect(result.incomeGrade).toBe("D");
  });

  it("7. Basis Grade = A", () => {
    expect(result.basisGrade).toBe("A");
  });

  it("8. Stewardship = Hold", () => {
    expect(result.stewardship).toBe("Hold");
  });

  it("9. Deal Type = Equity Play", () => {
    expect(result.dealType).toBe("Equity Play");
  });

  it("10. Cash-on-Cash (vs. Basis) = -2.3%", () => {
    // (96,200 - 0.08 × 1,685,000) / 1,685,000  (denominator = basis, F6.5c)
    // = (96,200 - 134,800) / 1,685,000
    // = -38,600 / 1,685,000
    // = -0.02290... → -2.3%
    expect(Math.round(result.coc * 1000) / 10).toBe(-2.3);
  });

  it("11. 10-Yr Value (Base) = $3,421,000", () => {
    // 2,100,000 × (1.05)^10 = 2,100,000 × 1.62889... = 3,420,672 → $3,421,000
    expect(roundK(result.tenYrValue.base)).toBe(3_421_000);
  });

  it("12. After-Tax Sell Now = $161,000", () => {
    // (2,100,000 - 1,685,000 - 0.08 × 2,100,000) × (1 - 0.35)
    // = (2,100,000 - 1,685,000 - 168,000) × 0.65
    // = 247,000 × 0.65
    // = 160,550 → $161,000
    expect(roundK(result.sellNowAfterTax)).toBe(161_000);
  });

  it("12b. After-Tax Hold 10-Yr = $1,128,000", () => {
    // (3,420,672 - 1,685,000) × (1 - 0.35)
    // = 1,735,672 × 0.65
    // = 1,128,187 → $1,128,000
    expect(roundK(result.hold10yrAfterTax)).toBe(1_128_000);
  });
});

// ─── ACCEPTANCE TEST 3 · GRIFF SONOMA · Kinley Road ─────────────────────────
// Expected: B+/A · Hold · Yield Play · 7.8% cap · 30% equity
describe("Deal Engine v1 · Acceptance Test 3 · Kinley Road (Dry Creek)", () => {
  // Reverse-engineer inputs from expected outputs:
  // Cap rate 7.8% → NOI/BaseValue = 0.078 → NOI = BaseValue × 0.078
  // NOI = Rent × 0.65 → Rent = NOI / 0.65
  // Equity % = 30% → BaseValue - Basis = 0.30 × Basis → BaseValue = 1.30 × Basis
  // Use: BaseValue = 1,000,000, Basis = 769,231 (≈ 30% equity)
  // NOI = 78,000, Rent = 120,000
  // Purchase = 769,231, addlCap = 0 (simplified)
  const result = computeDealEngine({
    purchase:  769_231,
    addlCap:         0,
    baseValue: 1_000_000,
    rent:        120_000,
    holdYears:        10,
    cocPct:            0,
  });

  it("Income Grade = B+", () => {
    // capRate = 78,000 / 1,000,000 = 7.8% → B+
    expect(result.incomeGrade).toBe("B+");
  });

  it("Basis Grade = A", () => {
    // equityPct = 230,769 / 769,231 = 30% → A
    expect(result.basisGrade).toBe("A");
  });

  it("Stewardship = Hold", () => {
    expect(result.stewardship).toBe("Hold");
  });

  it("Deal Type = Yield Play", () => {
    expect(result.dealType).toBe("Yield Play");
  });
});

// ─── ACCEPTANCE TEST 3 · GRIFF SONOMA · Vellutini (Forestville) ──────────────
// Expected: D/C · Pass · 4.0% cap · 11.5% equity
describe("Deal Engine v1 · Acceptance Test 3 · Vellutini (Forestville)", () => {
  // Cap rate 4.0% → NOI = BaseValue × 0.04
  // NOI = Rent × 0.65 → Rent = NOI / 0.65
  // Equity % = 11.5% → BaseValue - Basis = 0.115 × Basis → BaseValue = 1.115 × Basis
  // Use: BaseValue = 1_000_000, Basis = 896_861 (≈ 11.5% equity)
  // NOI = 40,000, Rent = 61,538
  const result = computeDealEngine({
    purchase:  896_861,
    addlCap:         0,
    baseValue: 1_000_000,
    rent:         61_538,
    holdYears:        10,
    cocPct:            0,
  });

  it("Income Grade = D", () => {
    // capRate = 40,000 / 1,000,000 = 4.0% → D
    expect(result.incomeGrade).toBe("D");
  });

  it("Basis Grade = C", () => {
    // equityPct ≈ 11.5% → C (5-11 is C, 12+ is B)
    // 103,139 / 896,861 = 11.5% → C
    expect(result.basisGrade).toBe("C");
  });

  it("Stewardship = Pass", () => {
    expect(result.stewardship).toBe("Pass");
  });
});

// ─── L21 · Output panel renders when ready = true ────────────────────────────
describe("L21 · Output panel ready flag", () => {
  it("returns a result when purchase > 0 and baseValue > 0", () => {
    const result = computeDealEngine({
      purchase:  1_000_000,
      addlCap:         0,
      baseValue: 1_200_000,
      rent:         72_000,
      holdYears:        10,
      cocPct:            0,
    });
    expect(result.basis).toBeGreaterThan(0);
    expect(result.capRate).toBeGreaterThan(0);
    expect(result.stewardship).toBeTruthy();
  });
});

// ─── L22 · CoC denominator guard: basis > 0 ───────────────────────────────────
describe("L22 · CoC denominator guard: basis > 0", () => {
  it("returns finite CoC when basis is near-zero", () => {
    const result = computeDealEngine({
      purchase:  0.001,
      addlCap:   0,
      baseValue: 1_000_000,
      rent:      60_000,
      holdYears: 10,
      cocPct:    0,
    });
    expect(Number.isFinite(result.coc)).toBe(true);
  });
});

// ─── L23 · Pro Mode zero-input passes through ─────────────────────────────────
describe("L23 · Pro Mode zero-input (appreciation = 0)", () => {
  it("appreciation = 0 produces flat 10-yr value (no growth)", () => {
    const result = computeDealEngine({
      purchase:  1_000_000,
      addlCap:         0,
      baseValue: 1_000_000,
      rent:         60_000,
      holdYears:        10,
      cocPct:            0,
      appreciation:      0,
    });
    expect(Math.round(result.tenYrValue.base)).toBe(1_000_000);
  });
});
