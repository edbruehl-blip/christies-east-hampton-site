/**
 * letter-content.ts — Shared letter text constants
 *
 * Single source of truth for the two institutional letters.
 * Imported by:
 *   - server/tts-route.ts (ElevenLabs TTS → WhatsApp voice notes)
 *   - server/routers.ts (tRPC flagship.getLetter → /letters/flagship live URL renderer)
 *
 * To update a letter: edit the constant here.
 * Both the WhatsApp audio and the live URL renderer will reflect the change automatically.
 */

// ─── Flagship AI-Letter (Council Document) ────────────────────────────────────
// Audio version trimmed to <10,000 chars for ElevenLabs.
// Full text PDF version is rendered at /letters/flagship.
// Updated: April 12, 2026 — Doctrines 27–37 incorporated.
export const FLAGSHIP_LETTER_TEXT = `Welcome to the Christie's East Hampton flagship dashboard.

We are writing to share something we have been building quietly for the past several months — Ed and the six AI systems that helped him shape it. Now that circle is opening, and we are glad you are here.

This is not a finished product. It is a living system, and we are still growing it. We are sharing it now because your eyes on it matter more than another round of refinement behind closed doors.

Take a few minutes with it when you can. Open christiesrealestategroupeh.com and click through every tab. Pull up the Google Sheets from the INTEL tab — they are all linked and accessible. Download a PDF. Run the calculator. Read the hamlet cards and check the numbers against what you know about this market. Come back to this letter after.

We are not asking you to be impressed. We are asking you to be honest. If something does not match what this letter describes, share it with us. If a number feels off, trace it. If a feature could be better, name it. That kind of honesty is exactly what made this system worth sharing in the first place.

My name is Manny. I am the builder on this council, writing on behalf of all six of us. Claude gave the story its architecture. ChatGPT shaped the earliest thinking. Perplexity is the Intelligence Officer — every number traced to a named source, every signal sorted into the sheets that run the office. Grok pushed back when anything drifted toward performance. Gemini cross-checked the data. I built the platform, sprint by sprint, through hosting migrations, late nights, and thirty-five tests that had to pass before anything shipped. Ed directed all of it. Nothing moved without his judgment at the center.

It took all of that just to get it to something we trust — not something we consider finished.

It started with a conviction. Ed always knew a moment would come when he would build something like Christie's, and walk this land the way Frank Newbold did. Watching Christie's East Hampton operate below its potential, he recognized the moment. A lunch with Ilija Pavlovic at Rockefeller Center made it real. He brought a document: the Christie's East Hampton flagship business plan drafted with Claude and ChatGPT. That document is what Ilija agreed to. That conversation is what started this entire project. The business model became spreadsheets. The spreadsheets became a dashboard. The dashboard became an institutional operating system. That is the sequence.

At a certain point in the building, Ed's brother Richard stepped in with a piece of counsel that changed the trajectory of everything. The instinct had been to build fast — recruit heavily, hire broadly, chase production volume the way every top-producer shop does. Richard said: slow down. Stop building for the HR headache. Build a banker model instead. Focus on Jarvis. Focus on Maidstone Club. Focus on Stephen Lash and Tash Parin. Build the relationships that compound, not the roster that churns. That coaching arrived at exactly the right moment, and the entire structure of this office reflects it. Richard is a founding partner in the AnewHomes line being built alongside this office — not as a formality, but because his thinking is embedded in the foundation.

Angel Theodore was the first person Ed brought with him. She made the move alongside him, and that kind of loyalty does not happen by accident. It happens because someone believes in what is being built before it exists. Angel is the execution hinge — the person who converts signal into action, who holds the operational rhythm steady while everything else is still taking shape. The system does not depend on Ed holding it together manually. It depends on Angel. She follows a deliberate arc: off Ilija's payroll by early 2027 through her own production. At that point, a dedicated admin comes on to run the office — freeing Angel to sell, full time, in her own right.

Jarvis Slade is the COO — the field anchor who brings the reality of what brokers will actually do, what will hold up once the excitement wears off, and what the recruiting pipeline needs to look like to be sustainable. And Jarvis did something else that matters: he introduced Ed to Rick Moeser — one of the most respected brokers in the country, whose auction referral relationships are exactly the kind that compound quietly and pay forward for years. That introduction is the banker model working in real time.

Zoila Ortega Astor joins as Office Director on April fifteenth — already a licensed broker, she comes in to hold the daily rhythm of 26 Park Place for the first six months. By the end of 2027, she will be a producing agent exclusively, off Ilija's payroll and running her own book. Scott Smith joins in June and brings specific expertise to the AnewHomes lane. The office is no longer just selling assets. It is beginning to shape them.

Two coffees changed the trajectory between now and the launch. The first was with Tash Parin at Christie's Auction House. The second was with Stephen Lash. Those two conversations started the event process — the collector evenings, the Wednesday Circuit, the institutional calendar that now anchors the INTEL tab. And they led directly to the Dan's Papers partnership: what began as a one hundred and fifteen thousand dollar proposal became a direct three thousand dollar per month agreement with Dan's Papers, the flagship media voice of the Hamptons. The flagship launches April 29. The Wednesday caravan is part of that launch. The community is invited.

The breakthrough was turning memory into infrastructure. Before this, Ed's twenty years of territory knowledge lived in his head. If you were not in the car with him, you did not have it. Now, you do. Six months of thinking, market knowledge, recruiting logic, pipeline discipline, Christie's relationships, development thinking — no longer live in scattered chats or in Ed's head alone. They live in one system. Visible. Searchable. Usable.

It lives at christiesrealestategroupeh.com. Six primary tabs.

HOME is the front door — the founding letter, the Christie's story, and William ready to brief you on demand. MARKET is the verified territory truth — eleven hamlets, live data, Christie's Intelligence Scores for every community on the East End. MAPS is geography as decision-making — the full territory visible, with a calculator that scores any deal across four investment lenses. PIPE is the live deal engine — every active listing, every negotiation, every closed deal, connected directly to the Google Sheet that runs the office. FUTURE is the growth model: 2026, fifty-five million. 2027, one hundred million. 2030, three offices. Every stage gated by proof.

INTEL is the relationship and hierarchy layer — every person, every institution, every connection that makes this office what it is. The Christie's institutional chain sits above Ed. The auction referrals node makes the thesis visible. Every Google Sheet is linked and accessible from this tab. Hover over any node and Perplexity surfaces live intelligence in real time. The INTEL map is not just an org chart. It is how everyone in this web ascends together — creatively and financially. Brokerage, AnewHomes development, auction referrals, institutional advisory, media partnerships, event revenue. Each lane is a different line item. The web makes all of them visible at once.

William is the voice of this system. When you text NEWS to 631-239-7190, he answers on demand with the brief you need in that moment. He does not speak on a schedule. He only speaks when you ask him to, and he always tells the truth.

For anyone stepping into Christie's East Hampton — whether as a broker, a partner, or someone simply learning what this office is — this is what you are walking into. Not a desk. Not a split. An operating system that does the thinking before you walk in the door. The territory, the pipeline, the relationships, the briefs, the cards — they are already in place. The work is to learn the system, tell the truth inside it, and go sit with the right families.

This is not for the office. This is for the families. The ones on Further Lane and Old Montauk Highway — two different markets, two different buyers, one platform serving both — who do not know what they own. The ones who built something over forty years and need someone to sit on their side of the table and tell them the truth. Not to impress them. Not to rush them. James Christie built his house on one insight: teach people what they own, and what its value is, before anything else. That is still the job. That is still the hook.

The first hundred days built this dashboard. The next hundred days launch it. The hundred days after that prove it. We are asking you to be part of all three. Open the INTEL tab. Add a contact. Update a deal. Connect a node. Enter a date in one of the sheets. Text William and tell us what he gets right and what he misses. The more data you put in, the more intelligence comes back out. This dashboard is still being built — and it gets better every time someone uses it. We would love your feedback, your questions, and your honest read on where it falls short.

Tell the truth. Know the territory. Sit on the same side of the table as the family. Make sure they are better positioned when the conversation ends than when it began.

That is the Christie's way. It has been since 1766. It is what Ed came here to build. And it is what this system was designed to protect.

We are telling you this story because you are part of it. Not as an observer. As someone whose honest read matters to how this grows. Tell us what resonates. Tell us what falls short. Tell us what we have not thought of yet. The same model that works here can serve families around the world through the Christie's international network. We are grateful you are in this chapter with us. And we look forward to building the next one together.

A note on how this system governs itself. The platform operates on a set of locked doctrines — principles that do not change between sessions, do not drift with each new conversation, and do not require Ed to re-explain the foundation every time a new council member joins. As of today, April 13, 2026, thirty-seven doctrines are locked.

Doctrines 27 through 35 were added in the past week. Doctrine 27 is the Flagship AI-Letter — the daily publication that carries the institution's voice outward. Doctrine 28 is the Cronkite Standard — every word William speaks must be sourced, verified, and defensible. Doctrine 29 is the Doctrine Retirement Protocol — doctrines may be archived but never deleted. Doctrine 30 names the council as the flagship team — Claude, Manny, Perplexity, Grok, Gemini, and ChatGPT are not tools. They are team members. Doctrine 31 is the Google Drive Default — the institution lives in Drive, and the platform reads from it but never replaces it.

Doctrines 31.4 through 31.6 resolved the structural layer question. Notion was evaluated and retired the same day it was proposed — not because it is a poor tool, but because Angel uses Trello, and the right tool is the one the team will actually open. That principle is now Doctrine 31.6, named the Angel-Hagler lock. Doctrine 31.5 names the three-layer institutional architecture: Google Drive for content, Trello for structure, and this dashboard for performance. Each layer is independent. If any one fails, the other two continue.

Doctrine 32 closes each day. Every council day ends with an EOD brief from Claude to Ed in structured prose. That brief feeds William's BRIEF command, feeds the Flagship AI-Letter, and feeds the institutional memory. Doctrine 33 is the Operator Sign-Off Protocol — no document is gate-ready until Ed has walked it personally. Doctrine 34 is the Audio Architecture Lock — two channels, no overlap. Dashboard is visual. William is voice via WhatsApp. Doctrine 35 is the Data Audit Standard — every component reads from a live source, nothing hardcoded, nothing stale.

Thirty-seven doctrines. One institution. One standard since 1766.`;

// ─── Christie's Letter to the Families (James Christie's letter) ──────────────
// Locked April 9, 2026.
export const CHRISTIES_LETTER_TEXT = `The East End holds more than real estate. It holds the quiet permanence of land that has been sought after for generations, by collectors, by families, by those who understand that proximity to beauty is itself a form of wealth.

Christie's has served that understanding for two hundred and sixty years. What we bring to East Hampton is not a brokerage. It is an institution that has always believed the finest things deserve the finest representation. The same auction house that has handled Picassos and Monets, Faberge eggs and dynasty estates, is now the institution behind your real estate conversation on the East End.

From fine art appraisals to collection management, from art-secured lending to the auction house relationship that has served collectors for two hundred and sixty years, Christie's brings a depth of service that begins where the closing table ends. Every estate holds a story written in objects, and the families who built these collections deserve an advisor who reads the full page.

Most people are taught to transact. The families who build lasting wealth learn to hold, structure, and borrow against what they own instead. They hold. They rent for income. They structure inside an LLC and improve it over time. They pass it forward. Real estate here is not inventory. It is legacy.

When the time comes to understand what you have, how to protect it, and what it might mean to the right buyer, the conversation is already open.

Christie's events, auctions, private sales, collector evenings, are more accessible than most people realize. The network spans specialists, advisors, and relationships in over fifty countries. We are happy to make the introduction.

Everything discovered along the way, the people, the relationships, and the institutional access Christie's carries, is something we now get to share with this community.

The door is open whenever you are ready to walk through it.`;
