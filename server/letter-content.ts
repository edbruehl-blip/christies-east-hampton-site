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

// ─── Flagship Letter (Ed Bruehl · canonical v2 · locked Apr 26 2026) ────────────
// P-41B.1: Manny builder letter removed from public routing.
// /letters/flagship now renders Ed voice only — same canonical letter as HOME and /report.
export const FLAGSHIP_LETTER_TEXT = `Greetings,

Many of you have known me for years. Some remember when I left Morgan Stanley after 9/11 and moved to the East End to raise a family. We came for the land, water, light, pace. We stayed because this place became home.

For twenty years, I've helped families buy, sell, and steward property here. The most important lesson hasn't changed: often, the best advice is don't sell. Hamptons real estate isn't inventory. It's legacy. The asset your grandchildren will thank you for. Hold it. Improve it. Structure it. Let it compound across generations.

That's why Christie's made sense. In 1766, James Christie held his first sale in London on one principle: help people understand the true value of what they own before deciding what to do with it. That's how I've always operated. Do what's right. Think long term. No exceptions.

I am honored to be Managing Director of Christie's International Real Estate Group, East Hampton Flagship, at 26 Park Place. This flagship sits at the intersection of three worlds: Christie's London heritage, our New York auction house, and the Hamptons, one of the most significant luxury markets on earth. Spanning nearly 50 countries and territories, the team we're assembling is built on one standard: service first, your interests first, always.

If you or someone you know is ready to operate at this level, we welcome the conversation.

Christie's auction specialists in fine art, jewelry, watches, wine, and automobiles are part of your team. Art appraisals, art-secured lending, and estate continuity across generations come with the service. Your property doesn't just reach buyers. It reaches collectors.

Each week we record "Your Hamptons Real Estate Podcast," featuring the people shaping this community. Each month we gather to spotlight local artists and mentors whose work deserves a larger stage. Join our list and follow along. Christie's auction previews, quarterly calendars, and private collection events come direct.

The flagship is awakening.

We look forward to you swinging by for a cup of coffee or a Yerba Madre. Whether you're buying, selling, or simply interested in the Hamptons, introduce yourself or bring someone you think would make a great mentor or future podcast guest.

Faithfully forward,

Ed Bruehl

Managing Director · Christie's International Real Estate Group · East Hampton Flagship`;
// ─── Christie's Letter to the Families (James Christie's letter) ──────────────
// Locked April 9, 2026.
export const CHRISTIES_LETTER_TEXT = `LEAD SUMMARY: This is the Christie's Letter to the Families of the East End — a formal introduction from Christie's East Hampton to the collectors, landowners, and legacy families of the Hamptons. It describes what Christie's is, what distinguishes it from a conventional brokerage, and what the institution can offer families who hold significant real estate and art alongside it. Read this letter to understand the Christie's proposition: over 250 years of institutional service, a depth of advisory that begins where the closing table ends, and an open door to the auction house, the collector evenings, and the international network. This letter supports every first conversation Ed has with a new family.

The East End holds more than real estate. It holds the quiet permanence of land that has been sought after for generations, by collectors, by families, by those who understand that proximity to beauty is itself a form of wealth.

Christie's has served that understanding for over 250 years. What we bring to East Hampton is not a brokerage. It is an institution that has always believed the finest things deserve the finest representation. The same auction house that has handled Picassos and Monets, Faberge eggs and dynasty estates, is now the institution behind your real estate conversation on the East End.

From fine art appraisals to collection management, from art-secured lending to the auction house relationship that has served collectors for over 250 years, Christie's brings a depth of service that begins where the closing table ends. Every estate holds a story written in objects, and the families who built these collections deserve an advisor who reads the full page.

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

// ─── Founding Letter (Ed Bruehl — neighborhood letter, council-locked April 21 2026) ─
// Single source of truth. Edit here to update HomeTab, ReportPage, and TTS simultaneously.
// v2 (Apr 26 2026): renders with sign-off block: Ed Bruehl / Managing Director / CIREG EH Flagship.
// v2 — April 26, 2026. Material changes: greeting added, sensory list expanded, "never sell" → "often, the best advice is don't sell", "Do what's right" triplet added, recruit CTA added, moat compressed, "door is always open" REMOVED, sign-off rewritten with Ed Bruehl / Managing Director attribution, em-dashes removed per No-Dash Rule.
export const FOUNDING_LETTER_TEXT = `Greetings,
Many of you have known me for years. Some remember when I left Morgan Stanley after 9/11 and moved to the East End to raise a family. We came for the land, water, light, pace. We stayed because this place became home.

For twenty years, I've helped families buy, sell, and steward property here. The most important lesson hasn't changed: often, the best advice is don't sell. Hamptons real estate isn't inventory. It's legacy. The asset your grandchildren will thank you for. Hold it. Improve it. Structure it. Let it compound across generations.

That's why Christie's made sense. In 1766, James Christie held his first sale in London on one principle: help people understand the true value of what they own before deciding what to do with it. That's how I've always operated. Do what's right. Think long term. No exceptions.

I am honored to be Managing Director of Christie's International Real Estate Group, East Hampton Flagship, at 26 Park Place. This flagship sits at the intersection of three worlds: Christie's London heritage, our New York auction house, and the Hamptons, one of the most significant luxury markets on earth. Spanning nearly 50 countries and territories, the team we're assembling is built on one standard: service first, your interests first, always.

If you or someone you know is ready to operate at this level, we welcome the conversation.

Christie's auction specialists in fine art, jewelry, watches, wine, and automobiles are part of your team. Art appraisals, art-secured lending, and estate continuity across generations come with the service. Your property doesn't just reach buyers. It reaches collectors.

Each week we record "Your Hamptons Real Estate Podcast," featuring the people shaping this community. Each month we gather to spotlight local artists and mentors whose work deserves a larger stage. Join our list and follow along. Christie's auction previews, quarterly calendars, and private collection events come direct.

The flagship is awakening.

We look forward to you swinging by for a cup of coffee or a Yerba Madre. Whether you're buying, selling, or simply interested in the Hamptons, introduce yourself or bring someone you think would make a great mentor or future podcast guest.

Faithfully forward,
Ed Bruehl
Managing Director · Christie's International Real Estate Group · East Hampton Flagship`;
