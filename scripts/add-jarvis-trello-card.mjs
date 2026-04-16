/**
 * Add Jarvis Slade card to Christie's East Hampton Command Board
 * Board: https://trello.com/b/H2mvEgRi
 * List: FLAGSHIP TEAM
 *
 * Council Brief April 17, 2026
 */

const BOARD_ID = 'H2mvEgRi';

// Trello API credentials — read from env
const API_KEY = process.env.TRELLO_API_KEY;
const TOKEN   = process.env.TRELLO_TOKEN;

if (!API_KEY || !TOKEN) {
  console.error('Missing TRELLO_API_KEY or TRELLO_TOKEN env vars');
  process.exit(1);
}

async function trelloGet(path) {
  const url = `https://api.trello.com/1${path}?key=${API_KEY}&token=${TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Trello GET ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function trelloPost(path, body) {
  const url = `https://api.trello.com/1${path}?key=${API_KEY}&token=${TOKEN}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Trello POST ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  // 1. Get all lists on the board
  const lists = await trelloGet(`/boards/${BOARD_ID}/lists`);
  console.log('Lists on board:', lists.map(l => `${l.name} (${l.id})`).join(', '));

  // 2. Find FLAGSHIP TEAM list
  const flagshipList = lists.find(l => l.name.toUpperCase().includes('FLAGSHIP TEAM'));
  if (!flagshipList) {
    console.error('FLAGSHIP TEAM list not found. Available lists:', lists.map(l => l.name).join(', '));
    process.exit(1);
  }
  console.log(`Found list: ${flagshipList.name} (${flagshipList.id})`);

  // 3. Check if Jarvis card already exists
  const cards = await trelloGet(`/lists/${flagshipList.id}/cards`);
  const existing = cards.find(c => c.name.toLowerCase().includes('jarvis'));
  if (existing) {
    console.log(`Jarvis card already exists: "${existing.name}" (${existing.id}) — skipping creation.`);
    return;
  }

  // 4. Create Jarvis Slade card
  const card = await trelloPost('/cards', {
    idList: flagshipList.id,
    name: 'Jarvis Slade — COO · Agent',
    desc: `Shareholder, customer, team. Corporate COO lens on the flagship operation. Owns the pro forma review, the 100-day accountability structure, and the operational discipline of the team.

Income streams visible on FUTURE tab: Sales vol, GCI, AnewHomes 5% equity, ICA Override.

First action: Open Growth Model v2. Review OUTPUTS. Flag anything that does not trace.

Meeting rhythm: Mondays with Ed and Angel. Wednesdays the Circuit.`,
    pos: 'bottom',
  });

  console.log(`✓ Jarvis Slade card created: "${card.name}" (${card.id})`);
  console.log(`  URL: ${card.url}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
