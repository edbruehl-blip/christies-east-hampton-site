const API_KEY = '72094a580a3ebdc1750f8030d9dbf45c';
const TOKEN = 'ATTAf4eac935191f3c846b59d9801b70e87b03fd21a59653cf3ddf19bfa75de911a226122BB3';
const BOARD_ID = 'H2mvEgRi';
const base = 'https://api.trello.com/1';
const auth = `key=${API_KEY}&token=${TOKEN}`;

// Get all cards on the board
const res = await fetch(`${base}/boards/${BOARD_ID}/cards?${auth}&fields=id,name,desc`);
if (!res.ok) {
  console.error('Board fetch failed:', res.status, await res.text());
  process.exit(1);
}
const cards = await res.json();
console.log(`Total cards: ${cards.length}`);

// Find D2 (Profit Pool Formula) and D31 (Doctrine Library count card)
const d2 = cards.find(c => 
  c.name && (
    c.name.includes('Doctrine 2 ') || 
    c.name.includes('D2 —') ||
    c.name.includes('D2—') ||
    c.name.toLowerCase().includes('profit pool formula')
  )
);

const d31 = cards.find(c => 
  c.name && (
    c.name.includes('Doctrine 31') || 
    c.name.includes('D31') ||
    c.name.toLowerCase().includes('google drive default') ||
    (c.desc && c.desc.includes('41 total'))
  )
);

console.log('\nD2 candidate:', d2 ? `"${d2.name}" (${d2.id})` : 'NOT FOUND');
console.log('D31 candidate:', d31 ? `"${d31.name}" (${d31.id})` : 'NOT FOUND');

// Show all card names to help identify correct ones
console.log('\n--- All cards ---');
cards.forEach(c => console.log(`  ${c.id}: ${c.name}`));

// Update D2 if found
if (d2) {
  const supersessionNote = `\n\n---\n⚠️ SUPERSEDED — April 14, 2026\nThe formula "Agent splits = remaining GCI × 70%" on this card is pre-April 14 and non-canonical. The governing formula now lives at:\n• Doctrine 39 — Agent Splits at 70 Percent of Gross GCI\n• Doctrine 41 — Royalty Out Before NOP Split\nBoth locked April 14, 2026. D2 remains as historical record only.`;
  const newDesc = (d2.desc || '') + supersessionNote;
  const updateRes = await fetch(`${base}/cards/${d2.id}?${auth}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ desc: newDesc })
  });
  console.log('\nD2 update:', updateRes.ok ? '✅ SUCCESS' : `❌ FAILED (${updateRes.status})`);
}

// Update D31 if found
if (d31) {
  const newDesc = (d31.desc || '').replace(
    /41 total \(38 main \+ 3 sub\)/g,
    '48 total (43 main + 5 sub)'
  ).replace(
    /41 total/g,
    '48 total (43 main + 5 sub)'
  );
  const updateRes = await fetch(`${base}/cards/${d31.id}?${auth}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ desc: newDesc })
  });
  console.log('D31 update:', updateRes.ok ? '✅ SUCCESS' : `❌ FAILED (${updateRes.status})`);
}
