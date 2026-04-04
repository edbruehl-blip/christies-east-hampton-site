/**
 * hamlet-data.test.ts
 * Validates P2 data corrections from Sprint 9 Final Directive (April 4, 2026)
 *
 * Checks:
 *   - EH Village median corrected to $5.25M
 *   - East Hampton Town removed; East Hampton North added with correct data
 *   - Southampton Town does not exist (Southampton Village is the correct card)
 *   - All volume shares are dollar-volume-based (not transaction-count-based)
 *   - Wainscott last sale populated: 115 Beach Lane · $59M · Mar 2026
 *   - No hamlet has id 'east-hampton' (old Town card removed)
 */

import { describe, it, expect } from 'vitest';
import { MASTER_HAMLET_DATA } from '../client/src/data/hamlet-master';

describe('P2 Hamlet Data Corrections', () => {
  it('East Hampton Village median is $5.25M (corrected from $5.15M)', () => {
    const ehv = MASTER_HAMLET_DATA.find(h => h.id === 'east-hampton-village');
    expect(ehv).toBeDefined();
    expect(ehv!.medianPrice).toBe(5_250_000);
    expect(ehv!.medianPriceDisplay).toBe('$5.25M');
  });

  it('East Hampton Town card is removed (id east-hampton no longer exists)', () => {
    const old = MASTER_HAMLET_DATA.find(h => h.id === 'east-hampton');
    expect(old).toBeUndefined();
  });

  it('East Hampton North card exists with correct data', () => {
    const ehn = MASTER_HAMLET_DATA.find(h => h.id === 'east-hampton-north');
    expect(ehn).toBeDefined();
    expect(ehn!.name).toBe('East Hampton North');
    expect(ehn!.medianPrice).toBe(2_030_000);
    expect(ehn!.medianPriceDisplay).toBe('$2.03M');
    expect(ehn!.anewScore).toBe(8.6);
    expect(ehn!.volumeShare).toBe(9);
  });

  it('Southampton Village exists (not Southampton Town)', () => {
    const sv = MASTER_HAMLET_DATA.find(h => h.id === 'southampton-village');
    expect(sv).toBeDefined();
    expect(sv!.name).toBe('Southampton Village');
    // Southampton Town should not exist
    const st = MASTER_HAMLET_DATA.find(h => h.name === 'Southampton Town');
    expect(st).toBeUndefined();
  });

  it('Wainscott last sale is 115 Beach Lane · $59M · Mar 2026', () => {
    const w = MASTER_HAMLET_DATA.find(h => h.id === 'wainscott');
    expect(w).toBeDefined();
    expect(w!.lastSale).toBe('115 Beach Lane');
    expect(w!.lastSalePrice).toBe('$59M');
    expect(w!.lastSaleDate).toBe('Mar 2026');
  });

  it('Volume shares are dollar-volume-based (corrected values)', () => {
    const checks: Record<string, number> = {
      'southampton-village': 11,
      'bridgehampton': 9,
      'east-hampton-north': 9,
      'amagansett': 9,
      'east-hampton-village': 7,
      'water-mill': 7,
      'sag-harbor': 5,
      'montauk': 4,
      'sagaponack': 4,
      'springs': 3,
      'wainscott': 2,
    };
    for (const [id, expectedShare] of Object.entries(checks)) {
      const hamlet = MASTER_HAMLET_DATA.find(h => h.id === id);
      expect(hamlet, `Hamlet ${id} should exist`).toBeDefined();
      expect(hamlet!.volumeShare, `${id} volumeShare should be ${expectedShare}`).toBe(expectedShare);
    }
  });

  it('Total hamlet count is 11 (10 original minus EH Town plus EH North)', () => {
    expect(MASTER_HAMLET_DATA.length).toBe(11);
  });

  it('All hamlets have non-empty medianPriceDisplay', () => {
    for (const hamlet of MASTER_HAMLET_DATA) {
      expect(hamlet.medianPriceDisplay, `${hamlet.name} should have medianPriceDisplay`).toBeTruthy();
    }
  });
});
