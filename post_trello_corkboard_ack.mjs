import { config } from 'dotenv';
config();

const key = process.env.TRELLO_API_KEY;
const token = process.env.TRELLO_TOKEN;
const cardId = 'JiaVQXzY';
const stagingUrl = 'https://3000-iw4lfglyuiop504w6e49h-57a0a822.us2.manus.computer/intel';
const commitHash = '09fb1303';

const comment = `🟢 STAGING ACK — Corkboard-to-INTEL Reversal

Commit: ${commitHash}
Staging URL: ${stagingUrl}

Acceptance Test: 3/3 PASS
1. ✅ Full Corkboard visible in first viewport — THE PULSE · THE PIPELINE · THE NETWORK · THE CALENDAR · THE FOCUS · THE COMPASS · team roster (Angel April 25, Zoila May 4, Scott June 1) · Key Relationships · Territory strip
2. ✅ No scroll required to reach it — Corkboard is the first block below the INTEL sticky nav
3. ✅ No "Morning Home" link anywhere in the nav — never existed, confirmed clean

Note: EdCorkboard.tsx (HTML option b per dispatch 03) was already mounted as the first INTEL block from a prior sprint. The dispatch confirms the current state is canonical. No new code required.

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
