/**
 * server/intel-triage-helper.ts
 * Extracted Trello triage fetch logic for testability.
 * Section 7 · Apr 29 2026
 *
 * DOCTRINE: RECRUITS and FLAGSHIP TEAM list cards are filtered out.
 * Banker-book data must not broadcast publicly.
 */

const BLOCKED_LIST_NAMES = ['RECRUITS', 'FLAGSHIP TEAM', 'BROKER ONBOARDING'];

export interface TriageCard {
  id: string;
  name: string;
  shortUrl: string;
  due: string | null;
  labels: Array<{ color: string; name: string }>;
  listName: string;
  assignees: string[];
}

export interface TriageResult {
  cards: TriageCard[];
  error: boolean;
  errorMessage?: string;
}

export async function fetchTriageCards(
  apiKey: string,
  token: string,
  boardId: string
): Promise<TriageResult> {
  try {
    const base = `https://api.trello.com/1`;
    const auth = `key=${apiKey}&token=${token}`;

    // Fetch cards and lists in parallel
    const [cardsRes, listsRes] = await Promise.all([
      fetch(`${base}/boards/${boardId}/cards?${auth}&fields=id,name,shortUrl,due,labels,idList,idMembers&members=true&member_fields=fullName`),
      fetch(`${base}/boards/${boardId}/lists?${auth}&fields=id,name`),
    ]);

    if (!cardsRes.ok || !listsRes.ok) {
      return { cards: [], error: true, errorMessage: 'Trello API returned non-200' };
    }

    const [rawCards, lists] = await Promise.all([cardsRes.json(), listsRes.json()]);

    // Build list id → name map
    const listMap: Record<string, string> = {};
    for (const list of lists) {
      listMap[list.id] = list.name;
    }

    // Filter out blocked lists and map to TriageCard
    const cards: TriageCard[] = rawCards
      .filter((c: any) => {
        const listName = listMap[c.idList] ?? '';
        return !BLOCKED_LIST_NAMES.some(blocked =>
          listName.toUpperCase().includes(blocked)
        );
      })
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        shortUrl: c.shortUrl,
        due: c.due ?? null,
        labels: (c.labels ?? []).map((l: any) => ({ color: l.color, name: l.name })),
        listName: listMap[c.idList] ?? '',
        assignees: (c.members ?? []).map((m: any) => m.fullName ?? ''),
      }));

    return { cards, error: false };
  } catch (err: any) {
    return { cards: [], error: true, errorMessage: err?.message ?? 'Unknown error' };
  }
}
