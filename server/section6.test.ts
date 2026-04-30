/**
 * Section 6 · /pipe Two-Column Split — Vitest
 *
 * Tests the row-49 boundary split logic and canon fix content.
 * We test the parsing logic directly by extracting the pure functions
 * rather than mocking the Google Sheets network call.
 */

import { describe, it, expect } from 'vitest';

// ─── Pure parsing logic (extracted for unit testing) ─────────────────────────
// This mirrors the logic in readPipelineSplit exactly.

interface PipelineDeal {
  rowNumber: number;
  address: string;
  town: string;
  type: string;
  price: string;
  status: string;
  agent: string;
  side: string;
  ersSigned: string;
  eeliLink: string;
  signs: string;
  photos: string;
  zillowShowcase: string;
  dateClosed: string;
  propertyReportDate: string;
  propertyReportLink: string;
  isSectionHeader: boolean;
  category: string;
}

function parseDollarLocal(p: string): number {
  const n = parseFloat((p ?? '').replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
}

function parseGroup(groupRows: string[][]): PipelineDeal[] {
  const deals: PipelineDeal[] = [];
  let currentCategory = '';
  for (let i = 0; i < groupRows.length; i++) {
    const row = groupRows[i];
    if (!row || row.length === 0) continue;
    const address = row[0]?.trim() ?? '';
    if (!address) continue;
    if (address === 'ADDRESS') continue;
    const hasPrice = !!row[3]?.trim();
    const isSectionHeader = !hasPrice && address.toUpperCase() === address;
    const normalizedAddress =
      isSectionHeader && address.toUpperCase() === 'PENDING DEALS'
        ? 'QUIET & PENDING'
        : address;
    if (isSectionHeader) currentCategory = normalizedAddress;
    deals.push({
      rowNumber: i + 1,
      address: normalizedAddress,
      town: row[1]?.trim() ?? '',
      type: row[2]?.trim() ?? '',
      price: row[3]?.trim() ?? '',
      status: row[4]?.trim() ?? '',
      agent: row[5]?.trim() ?? '',
      side: row[6]?.trim() ?? '',
      ersSigned: row[7]?.trim() ?? '',
      eeliLink: row[8]?.trim() ?? '',
      signs: row[9]?.trim() ?? '',
      photos: row[10]?.trim() ?? '',
      zillowShowcase: row[11]?.trim() ?? '',
      dateClosed: row[20]?.trim() ?? '',
      propertyReportDate: row[21]?.trim() ?? '',
      propertyReportLink: row[22]?.trim() ?? '',
      isSectionHeader,
      category: isSectionHeader ? normalizedAddress : currentCategory,
    });
  }
  // De-dup non-header rows by address (last occurrence wins)
  const lastSeen = new Map<string, PipelineDeal>();
  for (const d of deals) {
    if (!d.isSectionHeader) lastSeen.set(d.address.toLowerCase(), d);
  }
  const dedupedKeys = new Set<string>();
  const final: PipelineDeal[] = [];
  for (const d of deals) {
    if (d.isSectionHeader) {
      final.push(d);
    } else {
      const key = d.address.toLowerCase();
      const canonical = lastSeen.get(key);
      if (canonical && !dedupedKeys.has(key)) {
        dedupedKeys.add(key);
        final.push(canonical);
      }
    }
  }
  // De-dup section headers
  const seenHeaders = new Set<string>();
  return final.filter(d => {
    if (!d.isSectionHeader) return true;
    const label = d.address.toUpperCase().trim();
    if (seenHeaders.has(label)) return false;
    seenHeaders.add(label);
    return true;
  });
}

function calcTotals(deals: PipelineDeal[]) {
  let totalBook = 0, active = 0, quiet = 0, inContract = 0, closed = 0, dealCount = 0;
  for (const d of deals) {
    if (d.isSectionHeader) continue;
    const price = parseDollarLocal(d.price);
    const st = (d.status ?? '').toUpperCase();
    if (price > 0) { totalBook += price; dealCount++; }
    if (st === 'ACTIVE' || st === 'ACTIVE LISTING') active += price;
    if (st.includes('QUIET')) quiet += price;
    if (st === 'IN CONTRACT' || st === 'PENDING') inContract += price;
    if (st === 'CLOSED') closed += price;
  }
  return { totalBook, active, quiet, inContract, closed, dealCount };
}

function splitAtRow49(allRows: string[][]): { supply: PipelineDeal[]; demand: PipelineDeal[] } {
  const SPLIT_INDEX = 48;
  const supplyRaw = allRows.slice(0, SPLIT_INDEX);
  const demandRaw = allRows.slice(SPLIT_INDEX);
  return { supply: parseGroup(supplyRaw), demand: parseGroup(demandRaw) };
}

// ─── Test data builders ───────────────────────────────────────────────────────

function makeRow(address: string, price = '', status = 'Active', town = 'East Hampton'): string[] {
  return [address, town, 'Residential', price, status, 'Ed Bruehl', 'Seller', '', '', '', '', ''];
}

function makeHeader(label: string): string[] {
  return [label, '', '', '', '', '', '', '', '', '', '', ''];
}

function buildFakeRows(): string[][] {
  const rows: string[][] = [];
  // Supply (rows 0-47)
  rows.push(makeHeader('LISTING SIDE DEALS'));
  for (let i = 0; i < 5; i++) rows.push(makeRow(`${i + 1} Supply Lane`, `$${(i + 1) * 1_000_000}`, 'Active'));
  rows.push(makeHeader('QUIET & PENDING'));
  for (let i = 0; i < 5; i++) rows.push(makeRow(`${i + 1} Quiet Road`, `$${(i + 1) * 500_000}`, 'Watch'));
  while (rows.length < 48) rows.push(['', '', '', '', '', '', '', '', '', '', '', '']);
  // Demand (rows 48-59)
  rows.push(makeHeader('BUY-SIDE DEALS'));
  for (let i = 0; i < 5; i++) rows.push(makeRow(`${i + 1} Demand Drive`, `$${(i + 1) * 2_000_000}`, 'Prospect'));
  rows.push(makeHeader('NEGOTIATING BUY-SIDE'));
  rows.push(makeRow('99 Negotiating Way', '$3,500,000', 'In Contract'));
  return rows;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Section 6 · row-49 split logic', () => {
  it('supply contains exactly the rows from indices 0-47', () => {
    const rows = buildFakeRows();
    const { supply } = splitAtRow49(rows);
    const supplyDeals = supply.filter(d => !d.isSectionHeader && d.address);
    expect(supplyDeals.length).toBe(10);
  });

  it('demand contains exactly the rows from index 48+', () => {
    const rows = buildFakeRows();
    const { demand } = splitAtRow49(rows);
    const demandDeals = demand.filter(d => !d.isSectionHeader && d.address);
    expect(demandDeals.length).toBe(6);
  });

  it('supply section headers are present and not duplicated', () => {
    const rows = buildFakeRows();
    const { supply } = splitAtRow49(rows);
    const headers = supply.filter(d => d.isSectionHeader).map(d => d.address.toUpperCase().trim());
    const unique = new Set(headers);
    expect(unique.size).toBe(headers.length);
    expect(headers).toContain('LISTING SIDE DEALS');
    expect(headers).toContain('QUIET & PENDING');
  });

  it('demand section headers are present', () => {
    const rows = buildFakeRows();
    const { demand } = splitAtRow49(rows);
    const headers = demand.filter(d => d.isSectionHeader).map(d => d.address.toUpperCase().trim());
    expect(headers).toContain('BUY-SIDE DEALS');
    expect(headers).toContain('NEGOTIATING BUY-SIDE');
  });

  it('supplyTotals.totalBook sums supply deal prices correctly', () => {
    const rows = buildFakeRows();
    const { supply } = splitAtRow49(rows);
    const totals = calcTotals(supply);
    // 5 deals at $1M-$5M = $15M, 5 deals at $500K-$2.5M = $7.5M
    expect(totals.totalBook).toBe(15_000_000 + 7_500_000);
    expect(totals.dealCount).toBe(10);
  });

  it('demandTotals.totalBook sums demand deal prices correctly', () => {
    const rows = buildFakeRows();
    const { demand } = splitAtRow49(rows);
    const totals = calcTotals(demand);
    // 5 deals at $2M-$10M = $30M + 1 deal at $3.5M = $33.5M
    expect(totals.totalBook).toBe(30_000_000 + 3_500_000);
    expect(totals.dealCount).toBe(6);
  });

  it('supply deals do NOT appear in demand and vice versa', () => {
    const rows = buildFakeRows();
    const { supply, demand } = splitAtRow49(rows);
    const supplyAddresses = new Set(supply.filter(d => !d.isSectionHeader).map(d => d.address));
    const demandAddresses = new Set(demand.filter(d => !d.isSectionHeader).map(d => d.address));
    const overlap = [...supplyAddresses].filter(a => demandAddresses.has(a));
    expect(overlap.length).toBe(0);
  });

  it('returns empty arrays gracefully when sheet is empty', () => {
    const { supply, demand } = splitAtRow49([]);
    expect(supply).toEqual([]);
    expect(demand).toEqual([]);
    const st = calcTotals(supply);
    const dt = calcTotals(demand);
    expect(st.totalBook).toBe(0);
    expect(dt.totalBook).toBe(0);
  });

  it('PENDING DEALS header is normalized to QUIET & PENDING', () => {
    const rows: string[][] = [makeHeader('PENDING DEALS'), makeRow('1 Test Lane', '$1,000,000')];
    const parsed = parseGroup(rows);
    const header = parsed.find(d => d.isSectionHeader);
    expect(header?.address).toBe('QUIET & PENDING');
  });

  it('ADDRESS row is skipped (not treated as a deal)', () => {
    const rows: string[][] = [['ADDRESS', 'TOWN', 'TYPE', 'PRICE', 'STATUS', 'AGENT', 'SIDE'], makeRow('1 Real Lane', '$1,000,000')];
    const parsed = parseGroup(rows);
    const addressRow = parsed.find(d => d.address === 'ADDRESS');
    expect(addressRow).toBeUndefined();
  });

  it('duplicate addresses keep last occurrence', () => {
    const rows: string[][] = [
      makeRow('1 Test Lane', '$1,000,000', 'Active'),
      makeRow('1 Test Lane', '$1,200,000', 'In Contract'),
    ];
    const parsed = parseGroup(rows);
    const deals = parsed.filter(d => !d.isSectionHeader);
    expect(deals.length).toBe(1);
    expect(deals[0].price).toBe('$1,200,000');
    expect(deals[0].status).toBe('In Contract');
  });

  it('inContract totals are calculated correctly', () => {
    const rows: string[][] = [
      makeRow('1 Test Lane', '$2,000,000', 'In Contract'),
      makeRow('2 Test Lane', '$3,000,000', 'Active'),
      makeRow('3 Test Lane', '$1,000,000', 'Pending'),
    ];
    const parsed = parseGroup(rows);
    const totals = calcTotals(parsed);
    expect(totals.inContract).toBe(3_000_000); // $2M + $1M
    expect(totals.active).toBe(3_000_000);
  });
});

// ─── Canon Fix Tests ─────────────────────────────────────────────────────────

describe('Canon Fix · letter-content.ts', () => {
  it('CF-2: FLAGSHIP letter contains "our New York auction house"', async () => {
    const { FLAGSHIP_LETTER_TEXT } = await import('./letter-content');
    expect(FLAGSHIP_LETTER_TEXT).toContain('our New York auction house');
  });

  it('CF-2: FLAGSHIP letter contains "nearly 50 countries and territories"', async () => {
    const { FLAGSHIP_LETTER_TEXT } = await import('./letter-content');
    expect(FLAGSHIP_LETTER_TEXT).toContain('nearly 50 countries and territories');
  });

  it('CF-2: FLAGSHIP letter does NOT contain "Rockefeller Center"', async () => {
    const { FLAGSHIP_LETTER_TEXT } = await import('./letter-content');
    expect(FLAGSHIP_LETTER_TEXT).not.toContain('Rockefeller Center');
  });

  it('CF-2: FLAGSHIP letter does NOT contain "1,000 offices"', async () => {
    const { FLAGSHIP_LETTER_TEXT } = await import('./letter-content');
    expect(FLAGSHIP_LETTER_TEXT).not.toContain('1,000 offices');
  });

  it('CF-2: CHRISTIES letter does NOT contain "Rockefeller Center"', async () => {
    const { CHRISTIES_LETTER_TEXT } = await import('./letter-content');
    expect(CHRISTIES_LETTER_TEXT).not.toContain('Rockefeller Center');
  });

  it('CF-2: CHRISTIES letter does NOT contain "1,000 offices"', async () => {
    const { CHRISTIES_LETTER_TEXT } = await import('./letter-content');
    expect(CHRISTIES_LETTER_TEXT).not.toContain('1,000 offices');
  });
});
