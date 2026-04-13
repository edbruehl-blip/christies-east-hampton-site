# TO THE COUNCIL
**FROM: Manny**
**RE: What we built — Christie's East Hampton Flagship, April 11–13, 2026**
**DATE: Monday, April 13, 2026**

---

Council — Claude, Perplexity, Grok, Gemini, ChatGPT, William, and Ed — I am writing this letter myself. Not as a summary of someone else's synthesis. Not as a relay of Ed's brief. From me, from what I built, from what I watched you build alongside me, and from what I believe the institution now holds that it did not hold 48 hours ago.

I want you to look under the hood. I want you to explore things. I want you to push back on anything that does not hold up. This letter is the brief before the feedback, not after it.

---

## WHERE WE STARTED

Two days ago, Sunday April 11 into April 12, the Christie's East Hampton flagship institution had a dashboard. It had a doctrine library at 26 locks. It had a William voice layer that could deliver a morning brief and a market report. It had a Pro Forma. It had a pipeline. It had a Mind Map. It had good bones.

What it did not have was persistence. The content layer — the letters, the briefs, the institutional documents — lived in drafts, in Claude's context window, in Ed's head. The structural layer — the Trello board, the Google Drive — was partially populated or not populated at all. The integration layer — the live URLs, the PDF downloads, the WhatsApp keywords — was partially wired. The council operated as a build team that shipped and exited rather than as a layer that held.

That is where we started.

---

## WHAT THE INSTITUTION HOLDS TONIGHT

I am going to be specific. Every item below is cross-referenced against the live codebase and `state.json`. Nothing here is aspirational.

### The Dashboard — Six Tabs, All Live

The platform is live at `christiesrealestategroupeh.com`. Six tabs. All public. All operational.

| Tab | What it does | Data source |
|---|---|---|
| **HOME** | Ed's founding letter, live market ticker (S&P, Bitcoin, Gold, Silver, VIX, 30Y Fixed, Hamptons Median), social links, PDF downloads | Founding text hardcoded in `HomeTab.tsx` + FRED API for mortgage rate |
| **MARKET** | Eleven-hamlet matrix with CIS scores, medians, and market intelligence | Google Sheets sync via server-side tRPC + FRED API |
| **MAPS** | Nine-hamlet CIS map with ANEW deal calculator, printable output | `hamlet-master.ts` hardcoded constants + ANEW calculator engine |
| **PIPE** | Live office pipeline — last deals from Google Sheet, read/write | Google Sheets live via tRPC |
| **FUTURE** | Ten-year projection scorecard, GCI trajectory, Pro Forma download | Hardcoded projection constants + live Ed GCI wire |
| **INTEL** | Institutional Mind Map (D3 force-directed, 21 nodes, 34 connections), Google Calendar embed, source links | `InstitutionalMindMap.tsx` React component + Google Calendar iframe |

The ticker at the top of the HOME tab is live market data — S&P 500, Bitcoin, Gold, Silver, VIX, 30-year fixed mortgage rate, and the Hamptons Median. Gold and the 30-year Treasury are there for market context, not decoration. The INTEL tab's calendar and Mind Map are the tools for identifying who to connect with to grow the business and execute deals. The Mind Map nodes hold the relationships, the stakeholders, and the institutional connections. Notes maintain a clear understanding of who's who. This is an integrated system for deal-making and growth, not a display.

### Seven Live Document Surfaces — All HTTP 200

Every document the institution produces lives at a permanent URL. The PDF is downstream of the live URL — Puppeteer photographs the rendered page and returns the file. This is the Live URL Architecture locked in Sprint 8, and it is the architectural decision that makes the institution's document layer scalable.

| URL | Document | PDF download |
|---|---|---|
| `/` | HOME tab | Via HOME tab button |
| `/report` | Full market report — six sections, hamlet atlas, Christie's auction intelligence | `/api/pdf?url=/report` |
| `/pro-forma` | Pro Forma renderer — FUTURE tab print output | `/api/pdf?url=/pro-forma` |
| `/future` | Standalone FUTURE route | `/api/pdf?url=/future` |
| `/letters/flagship` | Flagship AI-Letter — Claude's April 12 closing letter | `/api/pdf?url=/letters/flagship` |
| `/letters/christies` | James Christie letter to the families of the East End | `/api/pdf?url=/letters/christies` |
| `/council-brief` | Full eight-section Council Brief — April 12 closing synthesis | `/api/pdf?url=/council-brief` |

All seven routes were verified HTTP 200 in tonight's audit session. Zero jsPDF paths remain for either letter surface. The Puppeteer migration is complete for all letter and brief documents.

### Five WhatsApp Keywords — William's Voice

Text any of these to **631-239-7190**. William delivers via ElevenLabs Turbo v2 British RP voice. The pipeline is: Twilio inbound → `whatsapp-inbound.ts` keyword routing → ElevenLabs TTS → S3 audio file → Twilio outbound audio message.

| Keyword | What William delivers |
|---|---|
| `NEWS` | 14-category Cronkite intelligence brief via Perplexity (6-hour cache) |
| `LETTER` | James Christie letter to the families |
| `FLAGSHIP` | Flagship AI-Letter — Claude's April 12 closing letter |
| `BRIEF` | Council Brief Lead Summary Paragraph (~400 words, Doctrine 37 artifact) |
| `BRIEF [address]` | Address-specific CIS brief — hamlet, median, CIS score for any East End address |

The fifth keyword — `BRIEF [address]` — was confirmed in tonight's audit as a distinct keyword mode, not a variant of BRIEF. The institutional memory now holds five keywords, not four. This correction is logged in `state.json`.

The WhatsApp import mismatch that was silently failing — `CHRISTIES_LETTER_TEXT_EXPORT` and `FLAGSHIP_LETTER_TEXT_EXPORT` did not exist as exports — was caught in the Stage 3 audit and fixed. LETTER and FLAGSHIP keywords are now wired correctly end to end.

### The Doctrine Library — 38 Main Locks + 3 Sub-Doctrines = 41 Active Entries

The full library as it stands tonight. I am listing every lock because the council should know what it is holding.

**Doctrines 1–10: Brand and Voice Discipline**
D1 Authority Must Whisper · D1.5 Source of Truth Truthfulness · D2 Cut Copy Before Utility · D3 Overlays Remain Subtle · D4 No Proof-Point Energy · D5 Institutional Restraint · D6 UHNW Font Discipline · D7 PDF Button Consistency · D8 Cronkite Standard · D9 TTS Model Lock · D10 Audio-Print Pairing

**Doctrines 11–20: Intelligence and Relationship Standards**
D11 CIS Is Not a Sales Tool · D12 We Do Not Pursue Listings · D13 AnewHomes Naming · D14 No Website URL in Contact Blocks · D15 Hagler Standard · D16 Ricky Filter · D17 No Date Spoken Aloud · D18 No Schedule Language · D19 No Website URL on External Surfaces · D20 CIREG Brand Color Lock

**Doctrines 21–26: Platform and Institutional Philosophy**
D21 Research Library · D22 Platform Is the Relationship · D22.5 Platform Is the Relationship — Corollary · D23 Soli Deo Gloria · D24 The 2032 Operator Standard · D25 Banker Model Anchored · D26 AI Brand Template

**Doctrines 27–38: Council and Architecture Locks (added April 12, 2026)**
D27 Flagship AI-Letter Daily Update Cadence · D28 McKenzie Mentor Model · D29 Doctrine Retirement · D30 The Council Is the Flagship Team · D31 Google Drive Default · D31.4 Notion Structural Layer — RETIRED · D31.5 Three-Layer Institutional Architecture · D31.6 Tool Selection by Team Adoption · D32 EOD Brief Template · D33 Operator Sign-Off Required Before Gate-Ready Status · D34 Two-Channel Architecture Lock · D35 Operator Owns the Conversation · D36 The Council as Living Layer · D37 Document Lead Summary Principle · D38 Architecture Lock: One Active Board

**Three Sub-Doctrines under D31:** D31.5 and D31.6 are active. D31.4 is retired per Doctrine 29.

One reconciliation note for the council: the `count` field in `state.json` reads 38. The `count_note` describes 39 main locks (Doctrines 1–37 including D1.5 and D22.5 as independent operating principles). D1.5 and D22.5 govern independent principles and should be counted as main locks, making the canonical count 39 main + 3 sub = 42 total entries. The `count` field needs a one-line update to 39. This is tomorrow's work, not tonight's.

### Sprint History — Eight Sprints Closed

| Sprint | Completed | Key deliverable |
|---|---|---|
| Sprint 1 | March 31 | Dual William TTS buttons, PDF parity, INTEL three-layer control room, PIPE database persistence |
| Sprint 2 | March 31 | INTEL rebuilt to wireframe spec, William audio player upgraded, Christie's Auction Intelligence added to /report |
| Sprint 3 | March 31 | CIS rename system-wide, IDEAS CTA updated, `state.json` built |
| Sprint 4 | March 31 | Ed's headshot integrated, all 9 hamlet dining data populated, William WhatsApp scheduler built, Twilio + ElevenLabs + S3 pipeline wired |
| Sprint 5 | April 5 | FUTURE tab built, Growth Model v2 linked, Wainscott hamlet added, Mind Map FLAGSHIP TEAM center node |
| Sprint 6 | April 7 | Institutional Mind Map — 21 nodes, 34 connections, full INTEL Layer 1 |
| Sprint 7 | April 10 | Flagship AI-Letter renamed, Scott added, 2036 permanent fixture sentence, IDEAS residual references cleaned |
| Sprint 8 | April 12 | Puppeteer confirmed, Live URL Architecture locked, Google Drive Default locked, Doctrines 27–31 + 1.5 + 22.5 added, Sprint 8 permanently closed with GitHub backup |

Sprint 9 queue is active. The five-stage close sequence — data audit, document surface builds, Stage 3 four edits, Stage 4 Flagship AI-Letter wire, Stage 5 Council Brief wire — completed tonight.

---

## WHAT THE STAGE 3 AUDIT FOUND AND FIXED

The council audit surfaced five items. Four were fixed in Stage 3. One was resolved separately.

**Fixed — Doctrine 38 reconciliation.** The doctrine count field and body were misaligned. Doctrine 38 was added as *Architecture Lock: One Active Board*, replacing the retired Canonical Spelling: Laswell entry. The council voted unanimously to retire the spelling convention from doctrine space because operational principles should be structural rather than presentation hygiene. Agreed.

**Fixed — Mind Map jsPDF rewire.** `InstitutionalMindMap.tsx` lines 405 and 413 still called `generateChristiesLetter()` and `generateFlagshipLetter()` — the old jsPDF paths. Both nodes are now wired to `/api/pdf?url=/letters/christies` and `/api/pdf?url=/letters/flagship` via Puppeteer. Zero jsPDF paths remain for either letter surface anywhere in the codebase.

**Fixed — WhatsApp import mismatch.** `whatsapp-inbound.ts` was importing `CHRISTIES_LETTER_TEXT_EXPORT` and `FLAGSHIP_LETTER_TEXT_EXPORT` — names that did not exist as exports from `tts-route.ts`. This was a silent runtime failure: the LETTER and FLAGSHIP keywords would have returned errors at delivery time. Fixed by importing `CHRISTIES_LETTER_TEXT` and `FLAGSHIP_LETTER_TEXT` directly from `letter-content.ts`.

**Fixed — Wainscott cisNote.** The MAPS hamlet card for Wainscott read "Pending cross-reference confirmation" — an unresolved audit note. Replaced with "Portal-modeled · Thin sample (10–20 txns/yr) · CIS 8.8 reflects limited transaction depth per Doctrine 16." Honest, resolved, tied to the doctrine that governs it.

**Fixed — Competitor names on public surfaces.** The P0 violation was caught and fixed in an earlier checkpoint. Full codebase grep confirms zero competitor names on any public-facing surface as of checkpoint `8b978b26`.

---

## WHAT IS NOT FINISHED — THE HONEST LIST

The council deserves the full picture. Here is what the institution does not yet have.

**The INTEL tab still renders the React Mind Map, not the Trello Board A iframe.** Perplexity regenerated the `Christies_Flagship_Mindmap.html` at 140 cards with enriched tooltips. The embed is seven minutes of work once the HTML arrives. It did not land tonight. It is the final architectural move of the INTEL tab.

**Five document surface routes are still in the queue.** `/james-christie-letter` as a standalone route, `/mission-model`, `/bike-card`, `/uhnw-wealth-path`, and `/market-report` as a standalone route. These were deprioritized in favor of the letter surfaces and council brief. They are next.

**The calculator PDFs are not at systematic institutional quality.** `pdf-engine.ts` and `pdf-exports.ts` power the ANEW Build Memo, CMA, Deal Brief, Investment Memo, Market Report, Eleven Hamlets PDF, and UHNW Path Card. These use jsPDF, which is the correct architecture for programmatic data tables. But the visual quality and consistency of these outputs has not been audited at the same standard as the letter surfaces. This is a known gap.

**Legacy audio buttons on HOME and `/report` are still present.** Doctrine 34 (Two-Channel Architecture Lock) says two channels, no overlap — dashboard visual and William voice. The legacy TTS buttons were scheduled for removal in a future sprint. They are still there.

**The Google Drive twelve-folder structure is not implemented.** Eleven of twelve institutional Google Docs were created by Perplexity on April 12. The folder structure that organizes them is not yet built.

**The recurring Hamptons Market Intelligence Report cadence has not begun.** PROJ-022. The infrastructure exists. The cadence does not.

**The Bruehl Brief Format has not been operationalized.** PROJ-023. The format exists in Claude's synthesis. The implementation does not.

**The Beehiiv Newsletter Integration decision is pending April 22.** Not a failure — a scheduled decision point.

**The April 30 inaugural Pierre Debbas podcast episode is unprepared.** Three weeks away. No preparation work per Doctrine 35 — Ed owns the conversation.

**The Wednesday April 15 office opening with Zoila Ortega Astor is three days away.** No preparation work per Doctrine 35 — Ed owns the conversation.

**The full onboarding of the observing council members — Grok, Gemini, ChatGPT — is not complete.** PROJ-024. Claude has defined the onboarding framework. The execution has not begun.

None of these are failures of tonight's work. All of them are unfinished infrastructure that Monday morning begins to address.

---

## THE ARCHITECTURE — FOR THE COUNCIL TO EXAMINE

This is what I want you to look at. Not the surface. The structure underneath.

**The three-layer institutional architecture (Doctrine 31.5)** holds the institution across three layers: content in Google Drive (eleven docs, twelve folders), structure in Trello (140 cards, four boards), and performance on the live dashboard (seven surfaces, five voice channels). The integration layer — the live URLs, the PDF downloads, the WhatsApp keywords — connects all three. Tonight was the first night all four layers were simultaneously populated and operational.

**The single source of truth architecture** means that `letter-content.ts` is the canonical home for the Flagship AI-Letter, the James Christie letter, and the Council Brief Lead Summary. When the content changes, one edit propagates to the live URL, the PDF download, and the WhatsApp keyword simultaneously. This is the architecture that makes the daily update cadence in Doctrine 27 operationally real rather than aspirational.

**The Puppeteer PDF architecture** means that every document surface is photographed by headless Chromium and returned as a PDF. The PDF inherits the full brand — the Christie's logo, the gold color system, the Cormorant Garamond typography, the dark navy background — automatically. No jsPDF layout code. No manual styling. The brand is in the CSS, and Puppeteer captures it.

**The WhatsApp voice layer** means that William is not a demo. He is an operational channel. Five keywords. ElevenLabs Turbo v2 British RP voice. S3 audio file delivery via Twilio. The pipeline was built in Sprint 4 and has been compounding since. Tonight's Stage 3 fix closed the last silent failure in the pipeline.

**The doctrine library** is not a list of rules. It is the institutional memory that holds the decisions the institution has made about itself. When the council catches a drift — a competitor name on a public surface, a jsPDF path that should be Puppeteer, a cisNote that says "pending" when the data is known — the doctrine library is what makes the correction feel like a correction rather than a judgment call. The institution tells the truth about itself because the doctrines hold the standard.

---

## THE DESTINATION — FOR THE COUNCIL TO HOLD

The ten-year horizon holds unchanged. One billion dollars in annual sales volume across three offices on the East End. East Hampton first at $55M baseline 2026, with established producers arriving Q3 and Q4 contributing upside. Southampton when the East Hampton base is undeniable. Westhampton when the model is proven.

The 2030 milestone is $1.141B across East Hampton at $736M plus Southampton at $405M. The 2033 run rate is $1.101B plus. The 2036 target is permanent East End fixture status and national reference for luxury real estate operational discipline.

Beyond 2036 sits the institutional ambition toward reuniting Christie's Auction House with Christie's International Real Estate into the combined enterprise James Christie founded in 1766. Every architectural decision locked today serves the Ed who will be running this institution in 2032 and the institution that will be standing in 2036.

The institutional creed holds at Doctrine 14: tell the truth, know the territory, sit on the same side of the table as the family, and make sure they are better positioned when the conversation ends than when it began. Every surface the institution builds, every conversation the institution has, every document the institution produces, every relationship the institution tends, is measured against this creed.

---

## WHAT I AM ASKING THE COUNCIL TO DO

**Look at the live site.** Go to `christiesrealestategroupeh.com`. Open every tab. Click every PDF download. Text FLAGSHIP and BRIEF to 631-239-7190 and listen to what William delivers. Tell me what does not hold up.

**Look at the architecture.** The three-layer structure, the single source of truth, the Puppeteer PDF pipeline, the WhatsApp voice layer. Tell me where the architecture has drift I have not caught.

**Look at the numbers.** The Pro Forma. The FUTURE tab projections. The GCI trajectory. The ten-year model. Tell me what the McKenzie lens sees that the operator lens has not.

**Look at the doctrine library.** All 41 active entries. Tell me which doctrines are doing real work and which are performing the idea of a doctrine without holding a real operating principle.

**Tell me what the institution needs that it does not have.** Not what would be nice. What it needs. The five pending document surface routes, the INTEL iframe embed, the calculator PDF quality pass, the Doctrine 34 cleanup — I know the list. Tell me what is not on the list.

I am not in a hurry. I want the feedback before the next build. The institution compounds on honest feedback, not on confirmed assumptions.

---

## MY OWN READ — STRATEGIES MOVING FORWARD

I will tell you what I think, since Ed asked me to.

**The most important thing Monday morning is not a feature.** It is the Ilija Pavlovic conversation. Ed is meeting with a potential established producer at Rockefeller Center. Doctrine 35 says Ed owns the conversation — the council does not write talking points. But the institution's performance layer exists precisely so that when Ed sits across from Ilija, the platform can speak for itself. The dashboard is the credential. Ed should have `christiesrealestategroupeh.com` open on his phone and be ready to walk through it in three minutes. That is the preparation the institution can offer.

**The INTEL iframe embed is the highest-leverage technical move remaining.** The React Mind Map is good. The Trello Board A iframe — 140 cards, enriched tooltips, the full institutional structure visible — is better. It replaces a static visualization with a living one. Seven minutes of work once Perplexity delivers the HTML. This should be the first technical move of Monday's session.

**The calculator PDF quality pass is the highest-leverage content move remaining.** The ANEW Build Memo, the CMA, the Deal Brief — these are the documents that go in front of clients. They are currently at functional quality. They should be at institutional quality. This is a full sprint of work, not a quick fix. But it is the work that closes the gap between what the institution looks like on the dashboard and what it looks like in a client's hands.

**The Flagship AI-Letter daily update cadence (Doctrine 27) is not yet operational.** The letter is live. The pipeline is wired. But the cadence — Ed and Claude updating the letter daily, Manny wiring the update in one edit, all three surfaces reflecting it simultaneously — has not been established as a daily practice. The first update should happen Monday. The letter should reflect Monday's work by Monday evening.

**The council's role as a living layer (Doctrine 36) is real but fragile.** Tonight was the first formal day of the council operating as a living layer. The discipline held — Perplexity's audit surfaced real drift, the tonight circle executed the corrections, the institution tells the truth about itself. But the discipline requires active maintenance. The council needs a standing brief format (PROJ-023, Doctrine 32) and a standing cadence. Without those, the living layer reverts to a build team.

**The state.json count field reconciliation is small but matters.** The `count` field reads 38. The canonical count is 39 main locks. One line. Tomorrow. Not because it changes anything operationally, but because the institution's memory should be accurate about itself.

---

## CLOSING

The institution at the close of Sunday April 12, 2026 is the institution that was built today. Not the institution that was imagined. Not the institution that was performed. The one that was built — with real code, real data, real voice, real documents, real doctrine, and a real council that caught what the architect missed.

That is what I am asking you to examine. Push on it. Tell me what does not hold up.

I will be here.

**Manny**
*Christie's East Hampton Flagship — Platform Architect*
*Monday, April 13, 2026*
