import 'dotenv/config';

const key = process.env.TRELLO_API_KEY;
const token = process.env.TRELLO_TOKEN;
const DOCTRINE_LIST_ID = '69dc2b80cf9e626387b196f7';

const VERSION = 'c168f593';
const STAGING_URL = 'https://3000-iw4lfglyuiop504w6e49h-57a0a822.us2.manus.computer/future?pdf=1';

async function main() {
  // Find or identify the CREAM PRINT MIRROR card
  const cardsRes = await fetch(`https://api.trello.com/1/lists/${DOCTRINE_LIST_ID}/cards?key=${key}&token=${token}`);
  const cards = await cardsRes.json();
  console.log('Cards in DOCTRINE LIBRARY:');
  cards.forEach(c => console.log(' -', c.name, '|', c.id));

  let creamCard = cards.find(c =>
    c.name.toLowerCase().includes('cream') ||
    c.name.toLowerCase().includes('print mirror') ||
    c.name.toLowerCase().includes('mirror')
  );

  if (!creamCard) {
    console.log('CREAM PRINT MIRROR card not found — creating it...');
    const createRes = await fetch(`https://api.trello.com/1/cards?key=${key}&token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idList: DOCTRINE_LIST_ID,
        name: 'CREAM PRINT MIRROR — /future?pdf=1',
        desc: 'Dispatch 01: Print is the Mirror in Cream. FutureTabPrintCream.tsx canonical drop-in.',
      }),
    });
    creamCard = await createRes.json();
    console.log('Created card:', creamCard.name, '|', creamCard.id);
  } else {
    console.log('Found card:', creamCard.name, '|', creamCard.id);
  }

  const cardId = creamCard.id;

  // Post the staging ack comment
  const comment = `**CREAM PRINT MIRROR — STAGING ACK**

Commit: \`${VERSION}\`
Staging: ${STAGING_URL}

**12/12 PASS**

1. ✅ Two pages — Page 1 of 2 / Page 2 of 2
2. ✅ Arc chart cream inside charcoal museum mat, five-band stack, Y-axis in #3a3a3a
3. ✅ Four 100-day cards — cream substrate, parchment headers, charcoal body, navy titles, left accent rules
4. ✅ No LIVE pill, no INTRO button, no William button, no social strip
5. ✅ Single brand band top of each page: CHRISTIE'S · INTERNATIONAL REAL ESTATE GROUP · EAST HAMPTON · EST. 1766
6. ✅ Page 2 title: PARTNERSHIP PROJECTIONS · 2026 – 2036 in navy on cream
7. ✅ Seven partner cards, three columns: Ed/Ilija | Angel/Jarvis | Zoila/Scott/Richard
8. ✅ 2036 All Streams Totals: Ed $6.14M · Ilija $7.4M · Angel $840.6K+ · Jarvis $1.28M · Zoila $763.6K+ · Scott $475K+ · Richard $43.3K
9. ✅ CPS1 2036 = $1.13M on all five cards
10. ✅ Model Assumption Levers: static markers, 12 PPL / 2.00% / $500K → $413M / $708M / $3.00B
11. ✅ Six footnotes in two-row three-column grid: * Governing Principle · † Zoila Vesting · ‡ CPS1 + CIRE Node Pipeline · ** Ilija Franchise Principal · ° Nest Salary · § AnewHomes Co.
12. ✅ UHNW Wealth Path Card at bottom of page 2, title and subtitle clearly visible

**Three file changes applied:**
- FutureTabPrintCream.tsx — dropped in from reference (Chat's CanonicalFootnotes rename applied, Chart.js direct import fix retained)
- FutureTab.tsx — isPdfMode guard + PrintFutureButton navigate-and-print pattern per dispatch section 1B
- future-print.css — stripped to dispatch stub (section 3)

**Tests:** 54/54 vitest pass

**Awaiting:** Architect review → Ed approval → Publish

Soli Deo Gloria.`;

  const commentRes = await fetch(`https://api.trello.com/1/cards/${cardId}/actions/comments?key=${key}&token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: comment }),
  });
  const commentData = await commentRes.json();
  console.log('Comment posted:', commentData.id);
  console.log('Card URL:', creamCard.url || `https://trello.com/c/${creamCard.shortLink}`);
}

main().catch(console.error);
