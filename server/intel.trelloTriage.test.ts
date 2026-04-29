/**
 * server/intel.trelloTriage.test.ts
 * Vitest unit tests for the intel triage helper.
 * Section 7 · Apr 29 2026
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTriageCards } from './intel-triage-helper';

// ─── Mock global fetch ────────────────────────────────────────────────────────
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeCard(id: string, name: string, idList: string, members: any[] = []) {
  return { id, name, shortUrl: `https://trello.com/c/${id}`, due: null, labels: [], idList, members };
}

function makeList(id: string, name: string) {
  return { id, name };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('fetchTriageCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns cards with listName populated', async () => {
    const cards = [makeCard('c1', 'Deploy Section 7', 'l1')];
    const lists = [makeList('l1', 'THIS WEEK')];

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => cards })
      .mockResolvedValueOnce({ ok: true, json: async () => lists });

    const result = await fetchTriageCards('key', 'token', 'boardId');

    expect(result.error).toBe(false);
    expect(result.cards).toHaveLength(1);
    expect(result.cards[0].name).toBe('Deploy Section 7');
    expect(result.cards[0].listName).toBe('THIS WEEK');
  });

  it('filters out RECRUITS list cards', async () => {
    const cards = [
      makeCard('c1', 'Recruit A', 'l-recruits'),
      makeCard('c2', 'Safe Card', 'l-week'),
    ];
    const lists = [
      makeList('l-recruits', 'RECRUITS'),
      makeList('l-week', 'THIS WEEK'),
    ];

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => cards })
      .mockResolvedValueOnce({ ok: true, json: async () => lists });

    const result = await fetchTriageCards('key', 'token', 'boardId');

    expect(result.error).toBe(false);
    expect(result.cards).toHaveLength(1);
    expect(result.cards[0].name).toBe('Safe Card');
  });

  it('filters out FLAGSHIP TEAM list cards', async () => {
    const cards = [
      makeCard('c1', 'Team Member', 'l-flagship'),
      makeCard('c2', 'Pipeline Deal', 'l-pipeline'),
    ];
    const lists = [
      makeList('l-flagship', 'FLAGSHIP TEAM'),
      makeList('l-pipeline', 'ACTIVE PIPELINE'),
    ];

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => cards })
      .mockResolvedValueOnce({ ok: true, json: async () => lists });

    const result = await fetchTriageCards('key', 'token', 'boardId');

    expect(result.error).toBe(false);
    expect(result.cards).toHaveLength(1);
    expect(result.cards[0].listName).toBe('ACTIVE PIPELINE');
  });

  it('returns error:true when fetch throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchTriageCards('key', 'token', 'boardId');

    expect(result.error).toBe(true);
    expect(result.cards).toEqual([]);
  });

  it('returns error:true when Trello API returns non-200', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    const result = await fetchTriageCards('key', 'token', 'boardId');

    expect(result.error).toBe(true);
    expect(result.cards).toEqual([]);
  });

  it('maps member fullName to assignees array', async () => {
    const cards = [makeCard('c1', 'Deal Card', 'l1', [{ fullName: 'Ed Bruehl' }])];
    const lists = [makeList('l1', 'ACTIVE PIPELINE')];

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => cards })
      .mockResolvedValueOnce({ ok: true, json: async () => lists });

    const result = await fetchTriageCards('key', 'token', 'boardId');

    expect(result.cards[0].assignees).toContain('Ed Bruehl');
  });
});
