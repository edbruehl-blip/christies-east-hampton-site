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

// ─── Flagship AI-Letter (Council Document) ────────────────────────────────────
// Updated: April 13, 2026 — SD-8 Phase Two close. Three-office Ascension Arc wired.
// Approved by Ed Bruehl per Doctrine 33. Council bridge: Perplexity (McKenzie pass) + Claude (1766 read).
// One edit propagates to three surfaces: live URL, WhatsApp William audio, PDF download.
export const FLAGSHIP_LETTER_TEXT = `LEAD SUMMARY — DOCTRINE 37

Monday April 13, 2026 closed as the day the institution's operating system became a three-office enterprise. The Ascension Arc — the eleven-bar chart that has tracked the East Hampton trajectory from $55M at 2026 to $1.823B at 2036 since the dashboard launched — was redrawn today to reflect the canonical three-office combined trajectory from Growth Model v2 VOLUME Row 17. The new destination is $2.096B at 2036. East Hampton in gold. Southampton in navy, opening 2028. Westhampton in sage, opening 2030. Three stacked bars per year, compounding toward the institutional horizon that Ed has been building toward since the first conversation in November 2025. The Pro Forma is now ready for Ilija Pavlovic. The architecture that holds it is clean.

THE DAY'S ARC

Monday opened with the institution carrying the momentum of Sunday's close — 41 canonical doctrines locked, 148 Trello cards enriched, seven live document surfaces confirmed, the Miro board seeded and named Christie's East Hampton — Operating System v3, and checkpoint 21178ae0 published to christiesrealestategroupeh.com. The day's work was Phase One and Phase Two of SD-8: eight technical polish items in Phase One, and the three-office Ascension Arc wire-up in Phase Two.

Phase One closed six items in sequence. The Puppeteer PDF engine was hardened with a five-second timeout fallback and forced layout reflow so fonts bake into the document in restricted network environments — conference rooms, flights, Rockefeller Center. Three April 15 references were corrected to April 25 across InstitutionalMindMap.tsx and FutureTab.tsx, reflecting Zoila Ortega Astor's confirmed start date. The 191 Bull Path price was corrected from $3.3M to $3.6M in the InstitutionalMindMap PIPE node, consistent with the canonical Pipeline Google Sheet. The dead captureTabAsPDF function was removed from FutureTab.tsx — the Puppeteer engine is the only PDF path. The William canonical command set was reduced from nine to four: NEWS, PIPE, STATUS, BRIEF. LETTER, FLAGSHIP, INTEL, HELP, and BRIEF [address] were retired and their handler functions removed from whatsapp-inbound.ts. State.json was updated to reflect the canonical four. The jsPDF generateMarketReport call in HomeTab.tsx and the InstitutionalMindMap Market Report node were migrated to the Puppeteer endpoint at /api/pdf?url=/market. The UHNW Path Card button was migrated to /api/pdf?url=/cards/uhnw-path. One PDF architecture confirmed across all surfaces.

Phase Two opened when Perplexity surfaced the canonical Growth Model v2 row structure. Row 10 is East Hampton only — $55M baseline 2026 climbing to $1.823B at 2036. Row 15 is Southampton only — zero through 2027, opening at $42.5M in 2028, climbing to $143M at 2036. Row 16 is Westhampton only — zero through 2029, opening at $42.5M in 2030, climbing to $129.9M at 2036. Row 17 is the three-office combined total — Row 10 plus Row 15 plus Row 16, verified 11 of 11 years, $2.096B at 2036. The sheets-helper.ts readAscensionArcData function was extended to read all four rows in parallel. The FutureTab.tsx Ascension Arc was redrawn with three stacked color segments per bar. The MAX_VOLUME constant was updated from 1,823,328,000 to 2,096,228,000. The Ascension phase card was updated to reflect the $2.096B trajectory. The legend now shows three color swatches with office names and opening years. The chart reads live from the Growth Model v2 VOLUME tab on every render.

Seven document surface routes were verified clean: /market, /pro-forma, /letters/flagship, /letters/christies, /council-brief, /future, and /report. All seven routes are registered in App.tsx with SPA catch-all fallback. All PDF endpoints are in the Puppeteer URL_TO_FILENAME map.

WHAT REMAINS

The institution has open items that Tuesday begins to address. The MapsTab hamlet-specific PDF buttons remain on jsPDF — eleven per-hamlet Puppeteer printable pages would close the last legacy surface, but that is a separate scope item requiring eleven new routes and eleven new page components. The treasury live yield display in the MARKET tab Rate Environment card is wired through the tRPC treasuryRate procedure reading %5ETNX from Yahoo Finance with a 4.51% fallback — a verification pass against the live /api/market-data response will confirm the field is flowing. The Flagship Relaunch is sixteen days away on April 29 — if any dashboard surface needs to reflect that event in the INTEL calendar, HOME tab, or William BRIEF command, that is a targeted update ready to execute on Ed's word. The Ilija Pavlovic conversation is prepared on the Pro Forma side — the three-office trajectory is now canonical and the document is clean. The conversation itself belongs to Ed per Doctrine 35.

THE DESTINATION

The ten-year horizon holds at $2.096B three-office combined. East Hampton reaches $1.823B at 2036. Southampton contributes $143M at 2036. Westhampton contributes $129.9M at 2036. The three-office combined destination is $2.096B. The combined enterprise that James Christie founded in 1766 — auction house and real estate under one institutional roof — sits beyond 2036 as the long-arc ambition. Every architectural decision locked today serves the Ed who will be running this institution in 2032 and the institution that will be standing in 2036.

The institutional creed holds unchanged at Doctrine 14 — tell the truth, know the territory, sit on the same side of the table as the family, and make sure they are better positioned when the conversation ends than when it began. The Pro Forma tells the truth. The architecture holds. The council caught what the architect missed so the institution tells the truth about itself rather than performing an idea of what it wishes it were.

THE PARTNERSHIP

Monday was the second day of the council operating as a living layer rather than as a build team. The partnership between Ed and the AI council has been compounding since November 2025. Today the council delivered the three-office Ascension Arc, the canonical doctrine count, the verified seven surfaces, the canonical four William commands, and the April 25 date corrections — all in a single continuous session. The institution is more precise tonight than it was this morning. That is the only metric that matters.

Christie's International Real Estate Group — East Hampton Flagship
Monday, April 13, 2026 — closing letter

Soli Deo Gloria.`;

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
