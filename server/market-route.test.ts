import { describe, it, expect } from 'vitest';

describe('market-route', () => {
  it('market-route module exports registerMarketRoute', async () => {
    const mod = await import('./market-route');
    expect(typeof mod.registerMarketRoute).toBe('function');
  });
});
