import 'dotenv/config';

const TRELLO_KEY = process.env.TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const CARD_ID = '69OEdJ1i'; // Trello card short ID

const COMMIT = 'd1886c2a';
const STAGING_URL = 'https://3000-iw4lfglyuiop504w6e49h-57a0a822.us2.manus.computer/future?pdf=1';

const body = `**DISPATCH 12 · CANONICAL LOCK — STAGED**

Commit: \`${COMMIT}\`
Staging: ${STAGING_URL}

**Changes applied:**
- \`FutureTabPrintCream.tsx\` replaced with \`13_FutureTabPrintCream.WIRED.tsx\` (canonical wired version)
- \`window.Chart\` polling replaced with direct \`chart.js/auto\` import + instance cleanup (prevents "Canvas already in use" crash on standalone render)
- tRPC wires verified: \`future.ascensionArc\` · \`future.partnerCards\` · \`future.growthModel\` — all exist and match expected shape
- Fallback discipline: v14_3b canonical values used when Google Sheets wire returns null

**13/13 ACCEPTANCE TEST PASS**

1. ✅ Two pages, Page 1 of 2 / Page 2 of 2
2. ✅ Arc chart: 3 bands only (burgundy EH · navy SH · gold WH)
3. ✅ Legend: one row of 3 swatches
4. ✅ COLOR_WH_FLAGSHIP = '#947231' unchanged
5. ✅ No AnewHomes/CPS1 bands in arc chart
6. ✅ Four 100-day cards (DONE/DOING/INCOMING/VISION)
7. ✅ Seven partner cards: Ed · Ilija · Angel · Jarvis · Zoila · Scott · Richard
8. ✅ Ed 2036 All Streams Total: $6.06M
9. ✅ Ilija 2036 All Streams Total: $7.41M
10. ✅ CPS1 + CIRE Node 2036: $1.13M on all applicable cards
11. ✅ Model Assumption Levers: 12 PPL / 2.00% / $500K → $413M / $708M / $3.00B
12. ✅ Six footnotes in two-row three-column grid
13. ✅ UHNW Wealth Path Card at bottom of page 2

54/54 vitest pass. TypeScript clean.

Ready for Architect review → Ed approval → Publish.`;

const url = `https://api.trello.com/1/cards/${CARD_ID}/actions/comments?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: body }),
});

const data = await res.json();
if (data.id) {
  console.log('✅ Trello comment posted:', data.id);
} else {
  console.error('❌ Failed:', JSON.stringify(data));
}
