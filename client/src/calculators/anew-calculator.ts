/**
 * ANEW CALCULATOR — Extracted from existing codebase. Do not modify logic.
 * Five lenses: Develop & Build, Buy & Hold, Buy Renovate & Hold, Buy & Rent, ANEW Development Partnership.
 * All hamlet intelligence pulled from hamlet-master.ts only.
 *
 * Design tokens: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 */

import { MASTER_HAMLET_DATA, type HamletData } from '../data/hamlet-master';

// ─── Lens Types ────────────────────────────────────────────────────────────────

export type AnewLens =
  | 'anew-build'
  | 'buy-hold'
  | 'buy-renovate-hold'
  | 'buy-rent'
  | 'anew-partnership';

export const LENS_LABELS: Record<AnewLens, string> = {
  'anew-build':         'ANEW Build',
  'buy-hold':           'Buy & Hold',
  'buy-renovate-hold':  'Buy, Renovate & Hold',
  'buy-rent':           'Buy & Rent',
  'anew-partnership':   'ANEW Development Partnership',
};

// ─── Score Thresholds ──────────────────────────────────────────────────────────

export type VerdictLabel =
  | 'Institutional'
  | 'Executable'
  | 'Marginal'
  | 'Pass';

export function getVerdict(score: number): VerdictLabel {
  if (score >= 85) return 'Institutional';
  if (score >= 70) return 'Executable';
  if (score >= 55) return 'Marginal';
  return 'Pass';
}

// ─── Strategic Classification (per Ed's protocol) ─────────────────────────────

export type StrategicClassification =
  | 'Institutional Location'
  | 'Institutional Asset — Executable Entry Basis'
  | null;

export function getStrategicClassification(
  hamletId: string,
  score: number,
  spread: number
): StrategicClassification {
  if (hamletId === 'east-hampton-village') return 'Institutional Location';
  const hamlet = MASTER_HAMLET_DATA.find(h => h.id === hamletId);
  if (!hamlet) return null;
  const isTier1 = hamlet.qsHamletTier >= 4;
  if (isTier1 && spread > 0) return 'Institutional Asset — Executable Entry Basis';
  return null;
}

// ─── Input / Output Interfaces ────────────────────────────────────────────────

export interface AnewBuildInput {
  lens: 'anew-build';
  hamletId: string;
  address: string;
  landValue: number;           // USD
  constructionCost: number;    // USD (hard costs)
  softCosts: number;           // USD
  carry: number;               // USD (financing / holding costs)
  exitPrice: number;           // USD
}

export interface BuyHoldInput {
  lens: 'buy-hold';
  hamletId: string;
  address: string;
  purchasePrice: number;
  closingCosts: number;
  holdYears: number;
  projectedExitPrice: number;
}

export interface BuyRenovateHoldInput {
  lens: 'buy-renovate-hold';
  hamletId: string;
  address: string;
  purchasePrice: number;
  renovationCost: number;
  closingCosts: number;
  holdYears: number;
  projectedExitPrice: number;
}

export interface BuyRentInput {
  lens: 'buy-rent';
  hamletId: string;
  address: string;
  purchasePrice: number;
  closingCosts: number;
  annualRent: number;
  annualExpenses: number;
  holdYears: number;
  projectedExitPrice: number;
}

export interface AnewPartnershipInput {
  lens: 'anew-partnership';
  hamletId: string;
  address: string;
  landValue: number;
  constructionCost: number;
  softCosts: number;
  carry: number;
  exitPrice: number;
  partnershipSplit: number;    // Ed's share 0–1
}

export type AnewInput =
  | AnewBuildInput
  | BuyHoldInput
  | BuyRenovateHoldInput
  | BuyRentInput
  | AnewPartnershipInput;

export interface AnewOutput {
  lens: AnewLens;
  address: string;
  hamletId: string;
  hamletName: string;
  allIn: number;
  exitPrice: number;
  spread: number;
  spreadPct: number;
  score: number;
  verdict: VerdictLabel;
  strategicClassification: StrategicClassification;
  // Display strings
  allInDisplay: string;
  exitDisplay: string;
  spreadDisplay: string;
  spreadPctDisplay: string;
  scoreDisplay: string;
  // Mentor block (rotates by day-of-year)
  mentorLine: string;
}

// ─── Mentor Lines ─────────────────────────────────────────────────────────────

const MENTOR_LINES = [
  'The best investment on earth is earth. — Louis Glickman',
  'Buy land, they\'re not making it anymore. — Mark Twain',
  'Real estate cannot be lost or stolen, nor can it be carried away. — Franklin D. Roosevelt',
  'Ninety percent of all millionaires become so through owning real estate. — Andrew Carnegie',
  'The wise young man or wage earner of today invests his money in real estate. — Andrew Carnegie',
  'Don\'t wait to buy real estate. Buy real estate and wait. — Will Rogers',
  'Every person who invests in well-selected real estate in a growing section of a prosperous community adopts the surest and safest method of becoming independent. — Theodore Roosevelt',
  'In real estate, you make 10% of your money because you\'re a genius and 90% because you catch a great wave. — Jeff Greene',
  'The major fortunes in America have been made in land. — John D. Rockefeller',
  'Landlords grow rich in their sleep without working, risking or economizing. — John Stuart Mill',
  'To be successful in real estate, you must always and consistently put your clients\' best interests first. — Anthony Hitt',
  'Real estate is not just about property — it\'s about people, relationships, and trust. — Ed Bruehl',
  'The secret of getting ahead is getting started. — Mark Twain',
  'It\'s not about how much money you make, but how much money you keep. — Robert Kiyosaki',
];

function getMentorLine(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return MENTOR_LINES[dayOfYear % MENTOR_LINES.length];
}

// ─── Formatting Helpers ───────────────────────────────────────────────────────

function fmtUSD(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

// ─── Scoring Engine ───────────────────────────────────────────────────────────

/**
 * Core GFA (Gross Financial Attractiveness) score.
 * Inputs: spread percentage, hamlet multiplier, hamlet tier.
 * Range: 0–100.
 */
function calcGFA(spreadPct: number, hamlet: HamletData): number {
  // Base score from spread: 0% = 0, 20%+ = 60 (capped)
  const spreadBase = Math.min(spreadPct * 300, 60);
  // Hamlet quality score: tier 1–5 maps to 0–30
  const hamletQuality = hamlet.qsHamletTier * 6;
  // ANEW score contribution: 0–10 maps to 0–10
  const anewContrib = hamlet.anewScore;
  const raw = spreadBase + hamletQuality + anewContrib;
  return Math.min(Math.round(raw), 100);
}

// ─── Lens Calculators ─────────────────────────────────────────────────────────

function calcAnewBuild(input: AnewBuildInput, hamlet: HamletData): AnewOutput {
  const allIn = input.landValue + input.constructionCost + input.softCosts + input.carry;
  const spread = input.exitPrice - allIn;
  const spreadPct = allIn > 0 ? spread / allIn : 0;
  const score = calcGFA(spreadPct, hamlet);
  return {
    lens: 'anew-build',
    address: input.address,
    hamletId: input.hamletId,
    hamletName: hamlet.name,
    allIn,
    exitPrice: input.exitPrice,
    spread,
    spreadPct,
    score,
    verdict: getVerdict(score),
    strategicClassification: getStrategicClassification(input.hamletId, score, spread),
    allInDisplay: fmtUSD(allIn),
    exitDisplay: fmtUSD(input.exitPrice),
    spreadDisplay: fmtUSD(spread),
    spreadPctDisplay: fmtPct(spreadPct),
    scoreDisplay: `${score}`,
    mentorLine: getMentorLine(),
  };
}

function calcBuyHold(input: BuyHoldInput, hamlet: HamletData): AnewOutput {
  const allIn = input.purchasePrice + input.closingCosts;
  const spread = input.projectedExitPrice - allIn;
  const spreadPct = allIn > 0 ? spread / allIn : 0;
  const score = calcGFA(spreadPct / Math.max(input.holdYears, 1), hamlet);
  return {
    lens: 'buy-hold',
    address: input.address,
    hamletId: input.hamletId,
    hamletName: hamlet.name,
    allIn,
    exitPrice: input.projectedExitPrice,
    spread,
    spreadPct,
    score,
    verdict: getVerdict(score),
    strategicClassification: getStrategicClassification(input.hamletId, score, spread),
    allInDisplay: fmtUSD(allIn),
    exitDisplay: fmtUSD(input.projectedExitPrice),
    spreadDisplay: fmtUSD(spread),
    spreadPctDisplay: fmtPct(spreadPct),
    scoreDisplay: `${score}`,
    mentorLine: getMentorLine(),
  };
}

function calcBuyRenovateHold(input: BuyRenovateHoldInput, hamlet: HamletData): AnewOutput {
  const allIn = input.purchasePrice + input.renovationCost + input.closingCosts;
  const spread = input.projectedExitPrice - allIn;
  const spreadPct = allIn > 0 ? spread / allIn : 0;
  const score = calcGFA(spreadPct / Math.max(input.holdYears, 1), hamlet);
  return {
    lens: 'buy-renovate-hold',
    address: input.address,
    hamletId: input.hamletId,
    hamletName: hamlet.name,
    allIn,
    exitPrice: input.projectedExitPrice,
    spread,
    spreadPct,
    score,
    verdict: getVerdict(score),
    strategicClassification: getStrategicClassification(input.hamletId, score, spread),
    allInDisplay: fmtUSD(allIn),
    exitDisplay: fmtUSD(input.projectedExitPrice),
    spreadDisplay: fmtUSD(spread),
    spreadPctDisplay: fmtPct(spreadPct),
    scoreDisplay: `${score}`,
    mentorLine: getMentorLine(),
  };
}

function calcBuyRent(input: BuyRentInput, hamlet: HamletData): AnewOutput {
  const allIn = input.purchasePrice + input.closingCosts;
  const totalRentIncome = (input.annualRent - input.annualExpenses) * input.holdYears;
  const exitValue = input.projectedExitPrice;
  const totalReturn = totalRentIncome + exitValue;
  const spread = totalReturn - allIn;
  const spreadPct = allIn > 0 ? spread / allIn : 0;
  const score = calcGFA(spreadPct / Math.max(input.holdYears, 1), hamlet);
  return {
    lens: 'buy-rent',
    address: input.address,
    hamletId: input.hamletId,
    hamletName: hamlet.name,
    allIn,
    exitPrice: exitValue,
    spread,
    spreadPct,
    score,
    verdict: getVerdict(score),
    strategicClassification: getStrategicClassification(input.hamletId, score, spread),
    allInDisplay: fmtUSD(allIn),
    exitDisplay: fmtUSD(exitValue),
    spreadDisplay: fmtUSD(spread),
    spreadPctDisplay: fmtPct(spreadPct),
    scoreDisplay: `${score}`,
    mentorLine: getMentorLine(),
  };
}

function calcAnewPartnership(input: AnewPartnershipInput, hamlet: HamletData): AnewOutput {
  const totalAllIn = input.landValue + input.constructionCost + input.softCosts + input.carry;
  const totalSpread = input.exitPrice - totalAllIn;
  const edShare = totalSpread * input.partnershipSplit;
  const spreadPct = totalAllIn > 0 ? totalSpread / totalAllIn : 0;
  const score = calcGFA(spreadPct, hamlet);
  return {
    lens: 'anew-partnership',
    address: input.address,
    hamletId: input.hamletId,
    hamletName: hamlet.name,
    allIn: totalAllIn,
    exitPrice: input.exitPrice,
    spread: edShare,
    spreadPct,
    score,
    verdict: getVerdict(score),
    strategicClassification: getStrategicClassification(input.hamletId, score, edShare),
    allInDisplay: fmtUSD(totalAllIn),
    exitDisplay: fmtUSD(input.exitPrice),
    spreadDisplay: fmtUSD(edShare),
    spreadPctDisplay: fmtPct(spreadPct),
    scoreDisplay: `${score}`,
    mentorLine: getMentorLine(),
  };
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export function runAnewCalculator(input: AnewInput): AnewOutput {
  const hamlet = MASTER_HAMLET_DATA.find(h => h.id === input.hamletId);
  if (!hamlet) throw new Error(`Unknown hamlet: ${input.hamletId}`);

  switch (input.lens) {
    case 'anew-build':        return calcAnewBuild(input, hamlet);
    case 'buy-hold':          return calcBuyHold(input, hamlet);
    case 'buy-renovate-hold': return calcBuyRenovateHold(input, hamlet);
    case 'buy-rent':          return calcBuyRent(input, hamlet);
    case 'anew-partnership':  return calcAnewPartnership(input, hamlet);
  }
}

// ─── Preloaded Defaults (per spec) ────────────────────────────────────────────

export const PRELOADED_DEFAULTS: Record<string, AnewInput> = {
  'anew-build': {
    lens: 'anew-build',
    hamletId: 'east-hampton',
    address: '140 Hands Creek Road',
    landValue: 3_500_000,
    constructionCost: 3_800_000,
    softCosts: 600_000,
    carry: 400_000,
    exitPrice: 9_900_000,
  } as AnewBuildInput,
  'buy-hold': {
    lens: 'buy-hold',
    hamletId: 'springs',
    address: '239 Old Stone Highway',
    purchasePrice: 1_990_000,
    closingCosts: 60_000,
    holdYears: 5,
    projectedExitPrice: 2_650_000,
  } as BuyHoldInput,
  'buy-renovate-hold': {
    lens: 'buy-renovate-hold',
    hamletId: 'east-hampton',
    address: '',
    purchasePrice: 0,
    renovationCost: 0,
    closingCosts: 0,
    holdYears: 3,
    projectedExitPrice: 0,
  } as BuyRenovateHoldInput,
  'buy-rent': {
    lens: 'buy-rent',
    hamletId: 'east-hampton',
    address: '',
    purchasePrice: 0,
    closingCosts: 0,
    annualRent: 0,
    annualExpenses: 0,
    holdYears: 5,
    projectedExitPrice: 0,
  } as BuyRentInput,
  'anew-partnership': {
    lens: 'anew-partnership',
    hamletId: 'east-hampton',
    address: '',
    landValue: 0,
    constructionCost: 0,
    softCosts: 0,
    carry: 0,
    exitPrice: 0,
    partnershipSplit: 0.5,
  } as AnewPartnershipInput,
};
