import * as dotenv from 'dotenv';
dotenv.config();

const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const BOARD_ID = 'H2mvEgRi'; // Christies Flagship Mindmap

if (!TRELLO_API_KEY || !TRELLO_TOKEN) {
  console.error('Missing TRELLO_API_KEY or TRELLO_TOKEN');
  process.exit(1);
}

const base = 'https://api.trello.com/1';
const auth = `key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;

// Get all cards on the board
const res = await fetch(`${base}/boards/${BOARD_ID}/cards?${auth}&fields=id,name,desc,idList`);
const cards = await res.json();

console.log(`Total cards: ${cards.length}`);

// Find D2 and D31 cards
const d2 = cards.find(c => c.name && (c.name.includes('Doctrine 2') || c.name.includes('D2') || c.name.toLowerCase().includes('profit pool formula')));
const d31 = cards.find(c => c.name && (c.name.includes('Doctrine 31') || c.name.includes('D31') || c.name.toLowerCase().includes('google drive default') || c.name.toLowerCase().includes('doctrine library')));

console.log('D2 card:', d2 ? `${d2.id} — ${d2.name}` : 'NOT FOUND');
console.log('D31 card:', d31 ? `${d31.id} — ${d31.name}` : 'NOT FOUND');

// Show all card names to help identify the right ones
console.log('\nAll card names:');
cards.forEach(c => console.log(`  ${c.id}: ${c.name}`));
