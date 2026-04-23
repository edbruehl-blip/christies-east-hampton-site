import 'dotenv/config';

const key = process.env.TRELLO_API_KEY;
const token = process.env.TRELLO_TOKEN;
const cardId = '69OEdJ1i';

const body = `**DISPATCH 06 — ARC CHART CANONICAL REBUILD**
Commit: \`dd53f056\`
Staging: https://3000-iw4lfglyuiop504w6e49h-57a0a822.us2.manus.computer/future?pdf=1

**13/13 PASS**

1. ✅ Arc chart has exactly 3 bands: EH (burgundy #9e1b32) · SH (navy #1a3a5c) · WH (gold #947231)
2. ✅ No AnewHomes band in the arc chart
3. ✅ No CPS1 band in the arc chart
4. ✅ Legend is one row of 3 swatches: East Hampton Flagship · Southampton Flagship · 2028 · Westhampton Flagship · 2030
5. ✅ COLOR_WH_FLAGSHIP = '#947231' unchanged (burnished gold — NOT Hermès orange)
6. ✅ EH bar uses EH_TOTAL (full EH volume, not EH_CORE) — $1.13B at 2036
7. ✅ anewHomes and cps1 arrays deleted from FutureTabPrintCream.tsx
8. ✅ COLOR_ANEWHOMES and COLOR_CPS1 constants deleted — hex values inlined for partner card accent rules
9. ✅ Partner cards still show AnewHomes and CPS1 revenue stream rows (accent rules use inlined hex)
10. ✅ D59 Live-Print Unity: FutureTab.tsx live-screen chart also has 3 bands only
11. ✅ D59 Live-Print Unity: ProFormaPage.tsx arc chart also has 3 bands only
12. ✅ 2-page cream PDF structure preserved — Page 1 of 2 / Page 2 of 2
13. ✅ 54/54 vitest pass — no regressions

**Files changed:**
- \`client/src/pages/tabs/FutureTabPrintCream.tsx\` — 4 surgical edits per dispatch
- \`client/src/pages/tabs/FutureTab.tsx\` — D59 Live-Print Unity applied
- \`client/src/pages/ProFormaPage.tsx\` — D59 Live-Print Unity applied

Ready for Architect review → Ed approval → Publish.
Soli Deo Gloria.`;

const res = await fetch(
  `https://api.trello.com/1/cards/${cardId}/actions/comments?key=${key}&token=${token}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: body }),
  }
);
const data = await res.json();
console.log(res.status, data.id ?? data);
