// Run from project root: node post_trello.mjs
// The server already loads .env via the project setup

const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const CARD_ID = 'JiaVQXzY';
const PDF_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/agWgKiAhyVtCEFfl.pdf';

if (!TRELLO_API_KEY || !TRELLO_TOKEN) {
  console.error('Missing Trello credentials. KEY:', TRELLO_API_KEY ? 'SET' : 'NOT SET', 'TOKEN:', TRELLO_TOKEN ? 'SET' : 'NOT SET');
  process.exit(1);
}

const comment = `🟡 STAGING ACK — /future?pdf=1 · 2-Page Cream PDF

**Build complete. Architect review requested before Ed approves.**

✅ 2 pages · letter-size (8.5×11)
✅ Page 1: Ascension Arc chart + 100-Day Blocks (cream substrate)
✅ Page 2: 7 partner cards (3-col grid) + Model Assumption Levers + UHNW Wealth Path Card (cream substrate)
✅ page-break-before: always on Partnership Projections wrapper
✅ All content present — same order, same cards as blue screen
✅ "Page 1 of 2" / "Page 2 of 2" labels correct
✅ 52/54 tests pass (2 pre-existing network failures: Perplexity + Twilio sandbox connectivity)

📄 PDF: ${PDF_URL}

Soli Deo Gloria`;

const url = `https://api.trello.com/1/cards/${CARD_ID}/actions/comments?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;

const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: comment }),
});

const data = await response.json();
if (response.ok) {
  console.log('✅ Trello comment posted successfully. Comment ID:', data.id);
} else {
  console.error('❌ Trello error:', response.status, JSON.stringify(data));
}
