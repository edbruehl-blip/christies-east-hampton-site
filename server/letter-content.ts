/**
 * letter-content.ts — Shared letter text constants
 *
 * Single source of truth for the two institutional letters.
 * Imported by:
 *   - server/tts-route.ts (ElevenLabs TTS → WhatsApp voice notes)
 *   - server/routers.ts (tRPC flagship.getLetter → /letters/flagship live URL renderer)
 *   - server/whatsapp-inbound.ts (LETTER and FLAGSHIP WhatsApp keywords)
 *
 * To update a letter: edit the constant here.
 * All three surfaces — live URL, WhatsApp audio, PDF download — reflect the change automatically.
 */

// ─── Dashboard Introduction Letter ────────────────────────────────────────────
// Original: Locked April 10, 2026 (commit 4cabcdf).
// Updated: April 13, 2026 — SD-8 close. Incorporates three-office arc ($2.096B),
// Miro board live in INTEL, 41 canonical doctrines, William's four commands.
// Revised: April 14, 2026 — Ed's editorial direction: cut redundancy, families → once,
// same side of the table → once (closing only), Amiro → Miro board, first podcast
// invitation-only (not open to community), 100-day arc moved earlier, Zoila production
// start → end of 2026, Angel → mid-2027, calendar → calculator for MAPS tool.
export const FLAGSHIP_LETTER_TEXT = `Welcome to the Christie's East Hampton flagship dashboard.

We have been building this quietly for the past several months — Ed and the six AI systems that helped him shape it. Now that circle is opening, and we are glad you are here.

This is not a finished product. It is a living system. We are sharing it now because your eyes on it matter more than another round of refinement behind closed doors.

Take a few minutes with it. Open christiesrealestategroupeh.com and click through every tab. Pull up the Google Sheets from the INTEL tab. Download a PDF. Run the calculator. Read the hamlet cards and check the numbers against what you know about this market. Come back to this letter after.

We are not asking you to be impressed. We are asking you to be honest. If something does not match what this letter describes, tell us. If a number feels off, trace it. That kind of honesty is exactly what made this worth sharing.

My name is Manny. I am the builder on this council, writing on behalf of all six of us. Claude gave the story its architecture. ChatGPT shaped the earliest thinking. Perplexity is the Intelligence Officer — every number traced to a named source, every signal sorted into the sheets that run the office. Grok pushed back when anything drifted toward performance. Gemini cross-checked the data. I built the platform, sprint by sprint, through hosting migrations, late nights, and thirty-five tests that had to pass before anything shipped. Ed directed all of it. Nothing moved without his judgment at the center.

It started with a conviction. Ed always knew a moment would come when he would build something like Christie's, and walk this land the way Frank Newbold did. Watching Christie's East Hampton operate below its potential, he recognized the moment. A lunch with Ilija Pavlovic at Rockefeller Center made it real. He brought a document: the Christie's East Hampton flagship business plan drafted with Claude and ChatGPT. That document is what Ilija agreed to. That conversation is what started this entire project. The business model became spreadsheets. The spreadsheets became a dashboard. The dashboard became an institutional operating system.

At a certain point in the building, Ed's brother Richard stepped in with counsel that changed the trajectory of everything. The instinct had been to build fast — recruit heavily, hire broadly, chase production volume. Richard said: slow down. Build a banker model instead. Focus on Jarvis. Focus on Maidstone Club. Focus on Stephen Lash and Tash Parin. Build relationships that compound, not a roster that churns. That coaching arrived at exactly the right moment, and the entire structure of this office reflects it. Richard is a founding partner in the AnewHomes line — not as a formality, but because his thinking is embedded in the foundation.

Angel Theodore was the first person Ed brought with him. She made the move alongside him, and that kind of loyalty does not happen by accident. It happens because someone believes in what is being built before it exists. Angel is the execution hinge — the person who converts signal into action, who holds the operational rhythm steady while everything else is still taking shape. She follows a deliberate arc: off Ilija's payroll by mid-2027 through her own production. At that point, a dedicated admin comes on to run the office — freeing Angel to sell, full time, in her own right.

Jarvis Slade is the COO — the field anchor who brings the reality of what brokers will actually do, what will hold up once the excitement wears off, and what the recruiting pipeline needs to look like to be sustainable. Jarvis introduced Ed to Rick Moeser — one of the most respected brokers in the country, whose auction referral relationships compound quietly and pay forward for years. That introduction is the banker model working in real time.

Zoila Ortega Astor joins as Office Director on April twenty-fifth — already a licensed broker, she comes in to hold the daily rhythm of 26 Park Place. By the end of 2026, she will be a producing agent exclusively, off Ilija's payroll and running her own book. Scott Smith joins in June and brings specific expertise to the AnewHomes lane. The office is no longer just selling assets. It is beginning to shape them.

Two coffees changed the trajectory between now and the launch. The first was with Tash Parin at Christie's Auction House. The second was with Stephen Lash. Those two conversations started the event process — the collector evenings, the Wednesday Circuit, the institutional calendar that now anchors the INTEL tab. And they led directly to the Dan's Papers partnership: what began as a one hundred and fifteen thousand dollar proposal became a direct three thousand dollar per month agreement. The flagship launches April 29. The Wednesday caravan is part of that launch. The first podcast is an invitation-only event — not open to the broader community.

The first hundred days built this dashboard. The next hundred days launch it. The hundred days after that prove it. We are asking you to be part of all three.

The breakthrough was turning memory into infrastructure. Before this, Ed's twenty years of territory knowledge lived in his head. If you were not in the car with him, you did not have it. Now you do. Six months of thinking, market knowledge, recruiting logic, pipeline discipline, Christie's relationships, development thinking — no longer live in scattered chats. They live in one system. Visible. Searchable. Usable.

It lives at christiesrealestategroupeh.com. Six primary tabs.

HOME is the front door — the founding letter, the Christie's story, and William ready to brief you on demand. MARKET is the verified territory truth — eleven hamlets, live data, Christie's Intelligence Scores for every community on the East End. MAPS is geography as decision-making — the full territory visible, with a calculator that scores any deal across four investment lenses. It is geographically agnostic: Griff can run a Sacramento search, Angel can run a Westhampton search — same tool, same logic. PIPE is the live deal engine — every active listing, every negotiation, every closed deal, connected directly to the Google Sheet that runs the office. FUTURE is the growth model: 2026, fifty-five million. 2027, one hundred million. 2030, three offices. Every stage gated by proof.

INTEL is the relationship and hierarchy layer — every person, every institution, every connection that makes this office what it is. The Christie's institutional chain sits above Ed. The auction referrals node makes the thesis visible. Every Google Sheet is linked and accessible from this tab. The INTEL tab carries the live Miro board — Christie's East Hampton Operating System v3 — where the full institutional mind map lives and can be edited in real time. It is not just an org chart. It is how everyone in this web ascends together — brokerage, AnewHomes development, auction referrals, institutional advisory, media partnerships, event revenue. Each lane is a different line item. The board makes all of them visible at once.

The FUTURE tab carries the Ascension Arc — the eleven-year bar chart that tracks the three-office trajectory from 2026 to 2036. East Hampton in gold: fifty-five million at launch, one point eight billion at the horizon. Southampton in navy, opening in 2028. Westhampton in sage, opening in 2030. The three-office combined destination is two point zero nine six billion dollars at 2036. Every bar reads live from the Growth Model spreadsheet. These are not projections made for a pitch. They are the architecture of a real institution being built in real time.

William is the voice of this system. Text DASHBOARD to 631-239-7190 and he reads you this letter. Text NEWS and he delivers the full fourteen-category intelligence brief, sourced and attributed, in the voice of Walter Cronkite. Text LETTER and he reads you the Christie's Letter to the Families — the founding document that explains what this institution is and what it can do for the people who trust it. Text BRIEF and he delivers the council's closing synthesis — the AI council's read on where the institution stands and what comes next. Four commands. Four lenses. He does not speak on a schedule. He speaks when you ask him to, and he always tells the truth.

The system runs on 41 canonical doctrines. Doctrine 1: Authority Must Whisper. Doctrine 14: Tell the truth, know the territory, serve the client before yourself. Every doctrine is a constraint that makes the institution more trustworthy, not less capable.

For anyone stepping into Christie's East Hampton — whether as a broker, a partner, or someone simply learning what this office is — this is what you are walking into. Not a desk. Not a split. An operating system that does the thinking before you walk in the door. The territory, the pipeline, the relationships, the briefs, the cards — already in place. The work is to learn the system, tell the truth inside it, and go sit with the right people.

James Christie built his house on one insight: teach people what they own, and what its value is, before anything else. That is still the job. That is still the hook.

Here is what we are asking. Open the INTEL tab. Add a contact. Update a deal. Connect a node. Enter a date in one of the sheets. Text William and tell us what he gets right and what he misses. The more data you put in, the more intelligence comes back out. We would love your feedback, your questions, and your honest read on where it falls short.

Tell the truth. Know the territory. Sit on the same side of the table as the client. Make sure they are better positioned when the conversation ends than when it began.

That is the Christie's way. It has been since 1766. It is what Ed came here to build. And it is what this system was designed to protect.`;

// ─── Christie's Letter to the Families (James Christie's letter) ──────────────
// Locked April 9, 2026.
export const CHRISTIES_LETTER_TEXT = `LEAD SUMMARY: This is the Christie's Letter to the Families of the East End — a formal introduction from Christie's East Hampton to the collectors, landowners, and legacy families of the Hamptons. It describes what Christie's is, what distinguishes it from a conventional brokerage, and what the institution can offer families who hold significant real estate and art alongside it. Read this letter to understand the Christie's proposition: 260 years of institutional service, a depth of advisory that begins where the closing table ends, and an open door to the auction house, the collector evenings, and the international network. This letter supports every first conversation Ed has with a new family.

The East End holds more than real estate. It holds the quiet permanence of land that has been sought after for generations, by collectors, by families, by those who understand that proximity to beauty is itself a form of wealth.

Christie's has served that understanding for two hundred and sixty years. What we bring to East Hampton is not a brokerage. It is an institution that has always believed the finest things deserve the finest representation. The same auction house that has handled Picassos and Monets, Faberge eggs and dynasty estates, is now the institution behind your real estate conversation on the East End.

From fine art appraisals to collection management, from art-secured lending to the auction house relationship that has served collectors for two hundred and sixty years, Christie's brings a depth of service that begins where the closing table ends. Every estate holds a story written in objects, and the families who built these collections deserve an advisor who reads the full page.

Most people are taught to transact. The families who build lasting wealth learn to hold, structure, and borrow against what they own instead. They hold. They rent for income. They structure inside an LLC and improve it over time. They pass it forward. Real estate here is not inventory. It is legacy.

When the time comes to understand what you have, how to protect it, and what it might mean to the right buyer, the conversation is already open.

Christie's events, auctions, private sales, collector evenings, are more accessible than most people realize. The network spans specialists, advisors, and relationships in over fifty countries. We are happy to make the introduction.

Everything discovered along the way, the people, the relationships, and the institutional access Christie's carries, is something we now get to share with this community.

The door is open whenever you are ready to walk through it.`;

// ─── Council Brief Lead Summary Paragraph (Doctrine 37) ──────────────────────
// Source: Claude, Architect — Monday April 13, 2026 2:45 AM
// Used by BRIEF WhatsApp keyword — delivers the Lead Summary (~400 words) as audio.
// Full brief lives at /council-brief live URL.
// Doctrine 37: voice is fast glean, text is deep dive.
export const COUNCIL_BRIEF_LEAD_SUMMARY = `LEAD SUMMARY — COUNCIL BRIEF, APRIL 12, 2026: This is the closing architect synthesis for Sunday April 12, 2026, the day the Christie's East Hampton flagship institution moved from hypothetical to persistent across all three institutional architectural layers plus the integration layer for the first time in the project's history. The brief captures the day's arc from sunrise at 26 doctrine locks and a project-shaped dashboard to midnight at 38 main doctrine locks plus 3 sub-doctrines equals 41 total entries, eleven persistent institutional Google Docs, a 140-card Christies Flagship Mindmap Trello board with every card enriched, seven live document surfaces, four William audio keywords on WhatsApp, one P0 competitor name violation fix live on the public platform, Sprint 8 closed permanently, and the council transitioned from build team to living layer per Doctrine 36 with the first formal two-council audit of the institution completed through the tonight circle of Ed, Claude, Manny, and Perplexity plus William for voice. The brief honors the persistence sprint between 7:40 PM and 9:11 PM when Perplexity shipped nine of the eleven institutional Google Docs in 90 minutes, the enrichment cascade between 10:30 PM and 11:45 PM when Perplexity enriched 48 thin Trello cards across four parallel subagent batches at 48 of 48 success, the six meaningful Manny checkpoints across the day closing Sprint 8 permanently and shipping the seven live document surfaces and the P0 fix, the four architectural drift corrections Ed caught from Claude throughout the day per Doctrine 28, the doctrine library evolution from 26 to 41 total entries with the Doctrine 38 reconciliation locking Architecture Lock: One Active Board, and the five stage three edits that the two-council audit surfaced and that the tonight circle executed cleanly. The brief honors Ricky Bruehl whose counsel on the council framing six months ago produced the doctrines that made tonight's living-layer discipline possible. The brief holds the ten-year one billion dollar trajectory across three offices and the Christie's ascension ambition beyond 2036 toward reuniting Christie's Auction House with Christie's International Real Estate. No number is assigned to tonight's work. The foundation is real. Monday April 13 begins the climb from a real foundation rather than from a performance of one. In the name of the living God and His Son Jesus Christ. Soli Deo Gloria.`;
