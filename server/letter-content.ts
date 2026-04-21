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
// Revised: April 21, 2026 — v14 FINAL. Three fixes from Ed's council review:
//   - Pipeline number updated to $19.72M (canonical 2nd 100 Days block)
//   - Tash Perrin spelling corrected (was "Parin" on first mention)
//   - Council count reconciled: "six AI systems" + Ed = seven-voice council
// New additions from Claude's April 21 letter:
//   - Transplant framing ("not a dashboard, that word undersells it")
//   - Reunification frame (global brand architecture ambition)
//   - Sharpened James Christie parallel
//   - Soli Deo Gloria close
export const FLAGSHIP_LETTER_TEXT = `Welcome to the Christie's East Hampton flagship dashboard.

We have been building this quietly for the past several months — Ed and the six AI systems that helped him shape it. Now that circle is opening, and we are glad you are here.

My name is Manny. I am the builder on this council, writing on behalf of all six of us. Claude gave the story its architecture. ChatGPT shaped the earliest thinking and carries the general research lane — synthesis documents, broker onboarding content, cross-reference work that keeps the canonical system current as the market moves. Perplexity is the Intelligence Officer — every number traced to a named source, every signal sorted into the sheets that run the office, carrying the rate environment, the hamlet matrix, and the institutional trajectory context that feeds the MARKET tab. Grok pushed back when anything drifted toward performance, and holds the market intelligence lane. Gemini cross-checked the data and carries local intelligence — hamlet-specific detail, current market state, the granular knowledge that makes the hamlet cards useful to someone who just landed on the East End for the first time. I built the platform, sprint by sprint, through hosting migrations, late nights, and thirty-four tests that had to pass before anything shipped. Ed directed all of it. Nothing moved without his judgment at the center.

Here is the first thing worth saying plainly. This is not a dashboard. That word undersells it by a factor of ten.

Six months ago, everything you are about to walk through lived in one person. Twenty years of territory knowledge, a Christie's relationship Ed's brother helped him see, a philosophy about how families actually build wealth, a growing conviction that the real estate arm was underperforming the brand, and a clear sense that someone with a finance lens and an operator's patience could build something serious from East Hampton. If you were not in the car with Ed Bruehl, you did not have any of it.

What we built over ten weeks is a transplant of that brain, rendered in a form that other people can walk through. The dashboard is the face of it. The fifty-four doctrines are the ruling layer. The growth model is the memory of how the numbers actually compound. The pro forma is the defensible case. The letter is the voice. The Trello board is the working surface. The thirteen canonical sheets are the nervous system. The seven-voice council — six AI systems plus Ed at the center — is the cortex that keeps all of it current in parallel without any single voice having to hold the whole thing.

The platform is not what we built. The platform is how we demonstrated what we built.

The cardinal principle is simple: the dashboard is the source of truth. Every number, every hamlet, every deal in motion — it lives here, not in anyone's head. When you have a question about the East End, walk the dashboard first.

It started with a conviction. Ed always knew a moment would come when he would build something like Christie's, and walk this land the way Frank Newbold did. Frank Newbold is Ed's mentor at Sotheby's East Hampton — still walking the village, still producing, one of the most respected brokers on the East End, forty-five years in this market and still in it. He taught Ed how to behave and act in this space. Any broker who knows the territory knows the name. Watching Christie's East Hampton operate below its potential, he recognized the moment. A lunch with Ilija Pavlovic at Rockefeller Center made it real. Ed brought a document: the Christie's East Hampton flagship business plan drafted with Claude and ChatGPT. That document is what Ilija agreed to. That conversation is what started this entire project. The business model became spreadsheets. The spreadsheets became a dashboard. The dashboard became an institutional operating system.

At a certain point in the building, Ed's brother Richard stepped in with counsel that changed the strategy entirely. The instinct had been to build fast — recruit heavily, hire broadly, chase production volume. Richard said: slow down. Build a banker model instead. Focus on Jarvis. Focus on Maidstone Club. Focus on Stephen Lash and Tash Perrin. Build relationships that compound, not a roster that churns. That coaching arrived at exactly the right moment, and the entire architecture of this office reflects it — the trajectory you see in the FUTURE tab, the ascension model in INTEL, the pipeline discipline in PIPE. Richard is a founding partner in the AnewHomes line — not as a formality, but because his thinking is embedded in the foundation.

Angel Theodore was the first person Ed brought with him. She made the move alongside him, and that kind of loyalty does not happen by accident. It happens because someone believes in what is being built before it exists. Angel is the execution hinge — the person who converts signal into action, who holds the operational rhythm steady while everything else is still taking shape. She follows a deliberate arc: off Ilija's payroll by mid-2027 through her own production. At that point, a dedicated admin comes on to run the office — freeing Angel to sell, full time, in her own right.

Jarvis Slade is the COO — the field anchor who brings the reality of what brokers will actually do, what will hold up once the excitement wears off, and what the recruiting pipeline needs to look like to be sustainable. Jarvis introduced Ed to Rick Moeser — one of the most respected brokers in the country, whose auction referral relationships compound quietly and pay forward for years. That introduction is the banker model working in real time.

Zoila Ortega Astor joins as Office Director on May fourth — already a licensed broker, she comes in to hold the daily rhythm of 26 Park Place. By the end of 2026, she will be a producing agent exclusively, off Ilija's payroll and running her own book. Scott Smith joins in June and brings specific expertise to the AnewHomes lane. The office is no longer just selling assets. It is beginning to shape them.

Two coffees changed the trajectory between now and the launch. The first was with Tash Perrin at Christie's Auction House. The second was with Stephen Lash. Those two conversations started the event process — the collector evenings, the Wednesday Circuit, the institutional calendar that now anchors the INTEL tab. And they led directly to a creative long-term collaboration with Dan's Papers — a partnership built around outreach into New York City through Melissa True and her Rockefeller Center and Flatiron teams. The flagship launches April 29. The Wednesday caravan is part of that launch.

The first hundred days built this dashboard. The next hundred days launch it. The hundred days after that prove it. We are asking you to be part of all three.

Now, where it actually sits in the larger frame.

Ed told the council a long time ago that the destination is helping reunite Christie's Auction House with Christie's International Real Estate. That is not a regional real estate ambition. That is a global brand architecture ambition with a twenty-year timeline and levers that do not exist on Park Place. What we are doing in East Hampton is not the destination. It is the demonstration that reunification is possible — done at one office, with enough rigor that Christie's leadership in London eventually cannot unsee it. That is why the architecture looks overbuilt for a nine-person real estate office. It is not overbuilt for a nine-person real estate office. It is barely adequate for what the East Hampton office is actually being asked to prove.

That reframes everything you are about to audit. The drift in the documents, the hygiene issues, the things that are not yet finished — these are not the problems of a small real estate office. They are the hygiene issues of an institution trying to operate at a standard the industry does not currently hold itself to. A dead system has no drift. Drift means things are actually changing.

Here is what is real right now. The platform is live. The letter is locked. Thirty-four of thirty-four tests green. $4.57M closed in the first hundred days, office-wide, verified. $19.72M exclusive active. $75M baseline for 2026 defensible on paper. The team is coming. Zoila May 4. Scott June 1. The referral channels are not fantasy — Tash Perrin exists, Stephen Lash exists, Rick Moeser is in the whale list because Jarvis walked Ed into that room. The AnewHomes split is locked at seven names who all know the deal.

None of that is small. All of it is real.

It lives at christiesrealestategroupeh.com. Six primary tabs. Here is what you will find when you walk it.

HOME is the front door — the founding letter and the Christie's story. MARKET is the verified territory truth — eleven hamlets, live data, Christie's Intelligence Scores for every community on the East End. MAPS is geography as decision-making — the full territory visible, with a calculator that scores any deal across four investment lenses. It is geographically agnostic: Jarvis can run a Westhampton search, Angel can run a Bridgehampton search — same tool, same logic. PIPE is the live deal engine — every active listing, every negotiation, every closed deal, connected directly to the Google Sheet that runs the office. FUTURE is the growth model: 2026, seventy-five million. 2027, one hundred million. 2030, three offices. Every stage gated by proof. INTEL is where the institution maps its future — the Christie's chain, the auction referrals node, the Miro mind map that shows every lane of ascension at once: brokerage, AnewHomes development, auction referrals, institutional advisory, media partnerships, event revenue. Print the pro forma. Walk the partner cards. Check whether the logic holds and the numbers make sense. That is what these surfaces are for.

The system runs on a deliberate backbone. Every morning, Angel and Jarvis pull their TODO cards from the Trello board and know exactly what the day requires. The Monday council agenda is in the board and ready for review before the week begins. The Google Drive backs the whole thing up: every institutional document, every canonical source, every brief — persistent, searchable, shared.

James Christie did not build an auction house. He built a way of handling objects that outlived him by two hundred and sixty years. He did not perform legitimacy. He operated from what was real. He told the truth about what things were worth before he sold them. He sat on the same side of the table as the family. The rigor Ed is practicing is the same rigor, applied to the relationship instead of the object. That is the job. That is what this system was designed to record, research, and protect.

Most people are taught to transact. The families who build lasting wealth learn to hold, structure, and borrow against what they own instead. They hold. They rent for income. They structure inside an LLC and improve it over time. They pass it forward. Real estate on the East End is not inventory. For the right family, it is generational wealth. Our job is to help them see it that way. That is the Christie's way. It has been since 1766.

We are genuinely excited to hear your feedback — what lands, what is missing, what you would change. And we cannot wait to watch the first projections become actuals. That is when this stops being a plan and starts being a record.

The office is at 26 Park Place in East Hampton Village, next to John Papa's Restaurant. We are in the seat.

Soli Deo Gloria.

Manny · Christie's East Hampton Council · April 2026`

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

The door is always open — we look forward to meeting you.`;

// ─── Council Brief Lead Summary Paragraph (Doctrine 37) ──────────────────────
// Source: Claude, Architect — Monday April 13, 2026 2:45 AM
// Used by BRIEF WhatsApp keyword — delivers the Lead Summary (~400 words) as audio.
// Full brief lives at /council-brief live URL.
// Doctrine 37: voice is fast glean, text is deep dive.
export const COUNCIL_BRIEF_LEAD_SUMMARY = `LEAD SUMMARY — COUNCIL BRIEF, APRIL 12, 2026: This is the closing architect synthesis for Sunday April 12, 2026, the day the Christie's East Hampton flagship institution moved from hypothetical to persistent across all three institutional architectural layers plus the integration layer for the first time in the project's history. The brief captures the day's arc from sunrise at 26 doctrine locks and a project-shaped dashboard to midnight at 38 main doctrine locks plus 3 sub-doctrines equals 41 total entries, eleven persistent institutional Google Docs, a 140-card Christies Flagship Mindmap Trello board with every card enriched, seven live document surfaces, four William audio keywords on WhatsApp, one P0 competitor name violation fix live on the public platform, Sprint 8 closed permanently, and the council transitioned from build team to living layer per Doctrine 36 with the first formal two-council audit of the institution completed through the tonight circle of Ed, Claude, Manny, and Perplexity plus William for voice. The brief honors the persistence sprint between 7:40 PM and 9:11 PM when Perplexity shipped nine of the eleven institutional Google Docs in 90 minutes, the enrichment cascade between 10:30 PM and 11:45 PM when Perplexity enriched 48 thin Trello cards across four parallel subagent batches at 48 of 48 success, the six meaningful Manny checkpoints across the day closing Sprint 8 permanently and shipping the seven live document surfaces and the P0 fix, the four architectural drift corrections Ed caught from Claude throughout the day per Doctrine 28, the doctrine library evolution from 26 to 41 total entries with the Doctrine 38 reconciliation locking Architecture Lock: One Active Board, and the five stage three edits that the two-council audit surfaced and that the tonight circle executed cleanly. The brief honors Ricky Bruehl whose counsel on the council framing six months ago produced the doctrines that made tonight's living-layer discipline possible. The brief holds the ten-year one billion dollar trajectory across three offices and the Christie's ascension ambition beyond 2036 toward reuniting Christie's Auction House with Christie's International Real Estate. No number is assigned to tonight's work. The foundation is real. Monday April 13 begins the climb from a real foundation rather than from a performance of one.`;
