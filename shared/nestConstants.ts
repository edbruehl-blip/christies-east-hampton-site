/**
 * shared/nestConstants.ts — Nest Salary canon constants
 * Single source of truth. Change here → cascades to every render site.
 * Ed's ruling Apr 24 2026: ANGEL = $70K/yr, ZOILA = $70K/yr.
 */

export const ANGEL_NEST_ANNUAL = 70_000;  // $70K/yr — full 2026 + Q1 2027 only
export const ZOILA_NEST_ANNUAL = 70_000;  // $70K/yr — pro-rated May 4 2026 start

// Zoila starts May 4 2026 → 8 months of 2026 → multiplier 8/12
// Q1 2027 producer-transition stub → 3 months → multiplier 3/12
// Angel full 2026 → 12 months
// Angel Q1 2027 stub → 3 months

export const ZOILA_NEST_2026_PRORATED = Math.round(ZOILA_NEST_ANNUAL * (8 / 12)); // $46,667
export const ZOILA_NEST_2027_Q1_STUB  = Math.round(ZOILA_NEST_ANNUAL * (3 / 12)); // $17,500
export const ANGEL_NEST_2026_FULL     = ANGEL_NEST_ANNUAL;                         // $70,000
export const ANGEL_NEST_2027_Q1_STUB  = Math.round(ANGEL_NEST_ANNUAL * (3 / 12)); // $17,500

/**
 * Format a dollar amount (in dollars) to a compact K string.
 * fmtK(46667) → '$46.7K'
 * fmtK(70000) → '$70K'
 * fmtK(17500) → '$17.5K'
 */
export const fmtK = (n: number): string => {
  const k = n / 1000;
  return Number.isInteger(k) ? `$${k}K` : `$${parseFloat(k.toFixed(1))}K`;
};
