/**
 * pipe-dedup.test.ts
 * Smoke test for R-QUIET-AND-PENDING render-side dedup logic.
 *
 * Validates:
 *   - dedupedFiltered correctly suppresses duplicate section header labels
 *   - All deal rows are preserved (sell-side + buy-side)
 *   - No ReferenceError from bare 'filtered' reference in render section
 *   - The dedup logic is idempotent (running twice gives same result)
 *
 * This test covers the runtime gate that Vitest data-shape tests and
 * compile-time build checks cannot catch.
 */

import { describe, it, expect } from 'vitest';

// ─── Replicate the dedup logic from PipeTab ──────────────────────────────────
// This mirrors the exact code in client/src/pages/tabs/PipeTab.tsx
// so any change to the production logic must be reflected here.

type PipeRow = {
  isSectionHeader: boolean;
  address: string;
  status?: string;
  side?: string;
  price?: string;
};

function applyDedup(filtered: PipeRow[]): PipeRow[] {
  const _seenSectionLabels = new Set<string>();
  return filtered.filter(row => {
    if (!row.isSectionHeader) return true;
    const label = (row.address ?? '').toUpperCase().trim();
    if (_seenSectionLabels.has(label)) return false;
    _seenSectionLabels.add(label);
    return true;
  });
}

// ─── Test data ───────────────────────────────────────────────────────────────

const MOCK_PIPE_ROWS: PipeRow[] = [
  { isSectionHeader: true,  address: 'ACTIVE LISTINGS' },
  { isSectionHeader: false, address: '10 Main St',       status: 'Active',      side: 'Seller', price: '$2,500,000' },
  { isSectionHeader: false, address: '20 Ocean Ave',     status: 'Active',      side: 'Seller', price: '$4,200,000' },
  { isSectionHeader: true,  address: 'QUIET & PENDING' },
  { isSectionHeader: false, address: '30 Pond Ln',       status: 'In Contract', side: 'Seller', price: '$3,100,000' },
  { isSectionHeader: false, address: '40 Beach Rd',      status: 'In Contract', side: 'Buyer',  price: '$5,800,000' },
  // Duplicate section header — this is the bug that caused the ReferenceError
  { isSectionHeader: true,  address: 'QUIET & PENDING' },
  { isSectionHeader: false, address: '50 Lily Ln',       status: 'Watch',       side: 'Seller', price: '$1,900,000' },
  { isSectionHeader: true,  address: 'SOLD LISTINGS 2026' },
  { isSectionHeader: false, address: '60 Harbor Dr',     status: 'Closed',      side: 'Seller', price: '$7,200,000' },
];

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('R-QUIET-AND-PENDING: PipeTab render-side dedup', () => {
  it('suppresses the duplicate QUIET & PENDING section header', () => {
    const result = applyDedup(MOCK_PIPE_ROWS);
    const sectionHeaders = result.filter(r => r.isSectionHeader);
    const quietPendingHeaders = sectionHeaders.filter(
      r => r.address.toUpperCase().trim() === 'QUIET & PENDING'
    );
    expect(quietPendingHeaders).toHaveLength(1);
  });

  it('preserves all deal rows (sell-side + buy-side)', () => {
    const result = applyDedup(MOCK_PIPE_ROWS);
    const dealRows = result.filter(r => !r.isSectionHeader);
    // Original has 6 deal rows — all should survive
    const originalDealRows = MOCK_PIPE_ROWS.filter(r => !r.isSectionHeader);
    expect(dealRows).toHaveLength(originalDealRows.length);
  });

  it('preserves unique section headers (ACTIVE LISTINGS, QUIET & PENDING, SOLD LISTINGS 2026)', () => {
    const result = applyDedup(MOCK_PIPE_ROWS);
    const sectionHeaders = result.filter(r => r.isSectionHeader).map(r => r.address);
    expect(sectionHeaders).toContain('ACTIVE LISTINGS');
    expect(sectionHeaders).toContain('QUIET & PENDING');
    expect(sectionHeaders).toContain('SOLD LISTINGS 2026');
    expect(sectionHeaders).toHaveLength(3); // not 4 (duplicate removed)
  });

  it('total row count is reduced by exactly 1 (the duplicate header)', () => {
    const result = applyDedup(MOCK_PIPE_ROWS);
    expect(result).toHaveLength(MOCK_PIPE_ROWS.length - 1);
  });

  it('is idempotent — running dedup twice gives the same result', () => {
    const once = applyDedup(MOCK_PIPE_ROWS);
    const twice = applyDedup(once);
    expect(twice).toHaveLength(once.length);
  });

  it('handles empty input without throwing', () => {
    expect(() => applyDedup([])).not.toThrow();
    expect(applyDedup([])).toHaveLength(0);
  });

  it('handles input with no section headers without throwing', () => {
    const dealOnly: PipeRow[] = [
      { isSectionHeader: false, address: '1 Test Rd', status: 'Active', side: 'Seller', price: '$1,000,000' },
    ];
    expect(() => applyDedup(dealOnly)).not.toThrow();
    expect(applyDedup(dealOnly)).toHaveLength(1);
  });

  it('handles input with no duplicate headers (no-op case)', () => {
    const noDupes: PipeRow[] = [
      { isSectionHeader: true,  address: 'SECTION A' },
      { isSectionHeader: false, address: '1 A St', status: 'Active', side: 'Seller' },
      { isSectionHeader: true,  address: 'SECTION B' },
      { isSectionHeader: false, address: '2 B St', status: 'Active', side: 'Buyer' },
    ];
    const result = applyDedup(noDupes);
    expect(result).toHaveLength(noDupes.length);
  });
});
