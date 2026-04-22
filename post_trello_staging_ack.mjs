import { config } from 'dotenv';
config();

const key = process.env.TRELLO_API_KEY;
const token = process.env.TRELLO_TOKEN;
const cardId = 'JiaVQXzY';
const stagingUrl = 'https://3000-iw4lfglyuiop504w6e49h-57a0a822.us2.manus.computer/future?pdf=1';
const commitHash = '391eca96';

const comment = `🟢 STAGING ACK — Canonical Cream Print Rewrite

Commit: ${commitHash}
Staging URL: ${stagingUrl}

12/12 PASS:
1. ✅ Two pages, Page 1 of 2 / Page 2 of 2
2. ✅ Arc chart cream inside charcoal museum mat, five-band stack, Y-axis in #3a3a3a
3. ✅ Four 100-day cards, cream + parchment headers, charcoal body, navy titles, left accent rules
4. ✅ No LIVE pill, no INTRO button, no William button, no social strip
5. ✅ Single brand band top of each page: CHRISTIE'S · INTERNATIONAL REAL ESTATE GROUP · EAST HAMPTON · EST. 1766
6. ✅ Page 2 title Partnership Projections · 2026 – 2036 in navy on cream
7. ✅ Seven partner cards, three columns (Ed/Ilija | Angel/Jarvis | Zoila/Scott/Richard)
8. ✅ 2036 All Streams Totals: Ed $6.14M · Ilija $7.4M · Angel $840.6K+ · Jarvis $1.28M · Zoila $763.6K+ · Scott $475K+ · Richard $43.3K
9. ✅ CPS1 2036 = $1.13M on all five cards
10. ✅ Model Assumption Levers: static markers, 12 PPL / 2.00% / $500K → $413M / $708M / $3.00B
11. ✅ Six footnotes in two-row three-column grid, correct order
12. ✅ UHNW Wealth Path Card at bottom of page 2, title and subtitle clearly visible

Doctrine 43: window.print() only. No Puppeteer.
Awaiting Architect review before Ed approves.
Soli Deo Gloria.`;

const resp = await fetch(`https://api.trello.com/1/cards/${cardId}/actions/comments?key=${key}&token=${token}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: comment })
});
const data = await resp.json();
console.log('Status:', resp.status);
console.log('Comment ID:', data.id || data.message || JSON.stringify(data).slice(0, 100));
