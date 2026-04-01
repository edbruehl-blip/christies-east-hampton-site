# Christie's East Hampton · Sprint 5 Reconciliation Output
**From:** Manny  
**To:** Ed · Claude · ChatGPT · Council  
**Date:** April 1, 2026  
**Format:** Three blocks only — as specified in Sprint 5 Brief

---

## BLOCK A — CONFIRMED TRUTH

What is now verified and closed against canon.

**A.1 — Core platform is live and structurally correct.**  
Seven-tab dashboard (`HOME`, `MARKET`, `MAPS`, `IDEAS`, `PIPE`, `FUTURE`, `INTEL`), `/report` page, live market feeds (Yahoo Finance, CoinGecko, Open-Meteo weather), Google Maps integration, all seven Google Sheet embeds, PIPE database persistence, and all six PDF/export functions are operational. This is confirmed against the Backend Architecture canon. No deviation from declared surface map.

**A.2 — Netlify architecture is fully retired.**  
No `netlify.toml`, no `netlify/functions/` directory, no `morning-brief.js`, `midnight-brief.js`, `whatsapp-inbound.js`, or `send-brief.js` anywhere in the codebase. The native server architecture (`server/_core/index.ts`) is the live machine. Domain points to Manus. Old architecture is gone.

**A.3 — Voice IDs are confirmed in code.**  
`tts-route.ts` line 12: `voiceId: "fjnwTZkKtQOJaYzGLa6n"` — Narrator on `/report`.  
`whatsapp-route.ts` line 14: `voiceId: "N2lVS1w4EtoT3dr4eOWO"` — William on WhatsApp.  
Both match canon exactly.

**A.4 — James Christie portrait on HOME is intentional and closed.**  
`HomeTab.tsx` Section A renders `JAMES_CHRISTIE_PORTRAIT_PRIMARY` (CDN: `files.manuscdn.com/...`). Ed's headshot renders on `/report` Section 1 and in all six PDF exports. This is correct per canon. Gemini's objection is rejected. Closed.

**A.5 — Six Google Sheet embeds are wired with correct IDs.**  
Cross-referenced against Backend Architecture and INTEL Wireframe canon:

| Sheet | Canon ID | Live ID | Status |
|---|---|---|---|
| Office Pipeline (PIPE) | `1VPjIYPaH...Mz7M` | `1VPjIYPaH...` | Confirmed |
| Market Matrix | `176OVbAi...sN4g` | `176OVbAi...` | Confirmed |
| Podcast Calendar | `1mYrrOOc...BL8` | `1mYrrOOc...` | Confirmed |
| Event Calendar | `1cBDdmA6...g2s` | `1cBDdmA6...` | Confirmed |
| Future Agents | `1a7arxf3...7mA` | `1a7arxf3...` | Confirmed |
| Social/Podcast Pipeline | `1q92gJTv...5I` | `1q92gJTv...` | Confirmed |

Contact Database (`1mEu4wYy...MlI`) is registered in canon but not embedded in the live INTEL tab — this is correct per canon (PRIVATE ONLY, no public surface).

**A.6 — Eight-sheet master source architecture is reflected in the platform.**  
All eight master sheets from the Backend Architecture are accounted for: Office Pipeline, Market Matrix, Contact Database, Podcast Calendar, Event Calendar, Future Agents, Growth Model v2, and Social Pipeline. The platform embeds six of the eight (Contact Database and Growth Model are private/unverified respectively — both correct per canon).

**A.7 — Canon documents are now in the project.**  
All six canon HTML files delivered April 1, 2026 are now in the project upload directory and have been read in full:
- `christies_eh_backend_architecture_april1_2026.html`
- `christies_eh_institutional_hierarchy_april1_2026.html`
- `christies_intel_tab_wireframe_march31_2026.html`
- `christies_market_report_pdf_wireframe_v3.html`
- `hamlet_pdf_east_hampton_village_v2.html`
- `christies_eh_council_review_template_april1_2026.html`

**A.8 — MAPS placeholder suppression is correct.**  
Sprint 4 fix is live: listing cards with "Address TBD / Price TBD" are hidden. Hamlet panels with no real listings show "No active listings at this time." Clean empty state. No fake data surfacing.

**A.9 — PIPE database schema is correct.**  
TiDB schema has `deals` table with all required fields including the nine locked PIPE types: Deal, Listing, Buyer, Seller, Attorney, Developer, Referral, Press, Other.

**A.10 — state.json exists and is current.**  
`/client/public/state.json` is present, Sprint 4 complete, system memory intact. This is the re-briefing elimination layer.

---

## BLOCK B — CONTRADICTIONS TO RESOLVE

Where implementation still conflicts with canon. These are the items Sprint 5 must close.

**B.1 — Territory canon drift: "Montauk" is wrong in three locations.**  
Canon instruction (Sprint 5 Brief, P1.2): The ninth hamlet is **East Hampton Town**, not Montauk. East Hampton Village and East Hampton Town are two separate and distinct hamlets.

Current live state:
- `tts-route.ts` founding letter narration: says "Montauk" as ninth hamlet
- `whatsapp-route.ts` morning brief text: says "Montauk" as ninth hamlet  
- `hamlet-master.ts`: has nine hamlets — confirmed list is `East Hampton Village`, `Sagaponack`, `Bridgehampton`, `Southampton Village`, `Amagansett`, `Water Mill`, `Sag Harbor`, `Springs`, and the ninth entry — **needs verification against canon table below**

Canon nine-hamlet list per Market Report v3 (Page 3 table):
1. Sagaponack — Ultra-Trophy — CIS 9.4
2. EH Village — Ultra-Trophy — CIS 9.2
3. Bridgehampton — Trophy — CIS 9.1
4. Southampton Vlg — Trophy — CIS 9.0
5. Amagansett — Premier — CIS 8.9
6. Water Mill — Trophy — CIS 8.8
7. East Hampton (Town) — Premier — CIS 8.6
8. Sag Harbor — Premier — CIS 8.4
9. Springs — Opportunity — CIS 6.8

**Montauk appears on the territory map (Page 4) as a geographic marker but is NOT in the nine-hamlet table.** It is a geographic reference point, not a scored hamlet. The ninth scored hamlet is **East Hampton (Town)**, CIS 8.6, Premier tier.

This correction must be made in `tts-route.ts`, `whatsapp-route.ts`, and verified in `hamlet-master.ts` before Sprint 5 is called complete.

**B.2 — CTA canon violation: "Generate" must become "Request".**  
Canon instruction (Sprint 5 Brief, P1.3 and Market Report v3 Page 6):  
> *"Request Your Private Property Intelligence Brief"*

Current live state — needs verification in two locations:
- `IdeasTab.tsx`: likely still says "Generate Your Private Property Intelligence Brief"
- `/report` surface: needs audit for any "Generate" CTA language

This is a live canon violation. Must be corrected in Sprint 5 before any other build work.

**B.3 — PIPE is two unsynced ledgers.**  
Canon instruction (Sprint 5 Brief, Part II.2): The current dual-state cannot survive as-is.

Current live state:
- Google Sheet embed (`1VPjIYPaH...`) = one source, Ed's working ledger
- TiDB `deals` table = second source, quick-add tracker in the platform
- No sync between them

**Manny's recommendation per canon instruction:**  
The Google Sheet is canon. The TiDB quick-add tracker is a convenience layer. The correct architecture is: **Sheet is canon, DB is convenience — but the DB must write back to the Sheet or be removed.** Until a write-back sync is built, the TiDB tracker should be labeled clearly in the UI as "Local Draft — Not synced to Pipeline Sheet" so Ed is never confused about which ledger is authoritative. Full sync architecture is a Sprint 6 item. The labeling fix is Sprint 5.

**B.4 — Sprint 3 Horizon banner is stale.**  
Canon instruction (Sprint 5 Brief, P2.1): Update to Sprint 5 Horizon.

Current live state: `IntelTab.tsx` Horizon section still reads "Sprint 3 Horizon." This is trust-breaking inside INTEL. Must be updated to Sprint 5 Horizon with the correct Sprint 5 items listed.

Additionally, the INTEL tab does not yet reflect the five Owner Lanes structure from the INTEL Wireframe canon (Layer 1.5: Eddie, Angel, Jarvis, Manny, Council). This is a structural gap between canon and implementation.

**B.5 — INTEL canon document library has null URLs.**  
Current live state: The `CanonPdfSection` in `IntelTab.tsx` has nine document entries, all with `url: null` or staging placeholders. No "Open Document" button resolves to a live file.

Canon instruction (Sprint 5 Brief, P2.4): Populate URLs or classify clearly as staging/non-live. No ambiguous ghost entries.

The six canon HTML files delivered today need to be uploaded to CDN and wired into the document library.

**B.6 — INTEL tab structure deviates from canon wireframe.**  
The INTEL Wireframe (March 31, 2026) specifies three layers:
- Layer 1: Master Calendar (Podcast + Event sheets, Wednesday anchor, filterable)
- Layer 1.5: Owner Lanes (Eddie, Angel, Jarvis, Manny, Council)
- Layer 2: Live Working Sheets (Future Agents, Social/Podcast Pipeline, Contact Database)
- Layer 3: Canon Documents

Current live state: The INTEL tab has a calendar embed, sheet panels, and a canon document section, but does not have the Owner Lanes (Layer 1.5) and the sheet panel configuration does not match the wireframe exactly (wireframe shows Future Agents + Social Pipeline + Contact Database; live may differ).

**B.7 — Estate Advisory Card PDF is on old CloudFront domain.**  
Current live state: The Estate Advisory Card URL in `cdn-assets.ts` resolves to an old CloudFront domain that serves `application/octet-stream` — meaning it may not open in-browser. Must be re-uploaded to `files.manuscdn.com` and link updated.

**B.8 — Growth Model sheet is not verified for FUTURE use.**  
Canon instruction (Sprint 5 Brief, Part VI): Do not use as FUTURE tab source until verified. Must confirm: 3 tabs, 9 columns, SOURCE column, projections reflect current pipeline and GCI reality. Currently classified as "exists, active, not verified." FUTURE tab language should not call this a live source until verification is complete.

**B.9 — Puppeteer dead weight remains in the codebase.**  
`/api/pdf/report` route exists in `server/_core/index.ts` but no frontend button calls it. The jsPDF engine handles all PDF exports. `puppeteer-core`, `@sparticuz/chromium`, `html2pdf.js`, and `axios` are installed but unused. This is a P2 cleanup item.

**B.10 — Market Report PDF v3 structure is not yet implemented.**  
Canon: Eight-page report per `christies_market_report_pdf_wireframe_v3.html`.  
Current live state: The `/report` page is a single-page scrollable surface with six sections and a jsPDF export. The PDF export does not match the eight-page v3 wireframe (which includes a Territory Map page, a Hamlet Atlas page, an ANEW Build page, and an Estate Advisory Card page that the current export does not have).

This is a significant structural gap between canon and implementation. It is not a Sprint 5 P1 item per the build order, but it must be named clearly so it does not get lost.

---

## BLOCK C — SPRINT 5 COMPLETION REPORT

For each item in the official build order, current status and what remains open.

| # | Item | Canon Rule Satisfied | Status | Remains Open |
|---|---|---|---|---|
| 1 | Twilio credentials + live phone confirmation | Backend Architecture: William = ElevenLabs/Twilio voice layer | **NOT CLOSED** — Twilio `20003` auth error. Credentials in env not validating. | Re-enter credentials via secrets manager. Fire `/api/whatsapp/test`. Confirm delivery to 646-752-1233. |
| 2 | Montauk → East Hampton Town across all affected files | Sprint 5 Brief P1.2: ninth hamlet is East Hampton Town, not Montauk | **NOT STARTED** | Fix in `tts-route.ts`, `whatsapp-route.ts`, verify `hamlet-master.ts` against canon table. |
| 3 | CTA correction: "Generate" → "Request" | Market Report v3 Page 6: "Request Your Private Property Intelligence Brief" | **NOT STARTED** | Audit `IdeasTab.tsx` and `/report` surface. Replace all "Generate" CTA language. |
| 4 | Sprint 3 Horizon → Sprint 5 Horizon | Sprint 5 Brief P2.1: stale banner is trust-breaking | **NOT STARTED** | Update `IntelTab.tsx` Horizon section. |
| 5 | Daily listing sync from Christie's profile | Sprint 5 Brief P1.4: first visible content bridge from placeholder to operating truth | **NOT STARTED** | Build after items 1–3 are closed. |
| 6 | PIPE truth recommendation | Sprint 5 Brief Part II.2: dual-source cannot survive | **RECOMMENDATION DELIVERED** (see B.3 above) | Ed must decide: Sheet is canon, DB is convenience with labeling fix now; full sync is Sprint 6. |
| 7 | Remove Puppeteer dead weight | Sprint 5 Brief P2.2: dead weight removal | **NOT STARTED** | Remove after P1 fixes are closed. |
| 8 | Asset hygiene / canon URL cleanup | Sprint 5 Brief P2.3–P2.4: Estate Advisory Card CDN, null canon PDF URLs | **NOT STARTED** | Upload six canon HTML files to CDN. Wire into INTEL document library. Re-upload Estate Advisory Card. |
| 9 | Growth Model sheet verification | Sprint 5 Brief Part VI: do not elevate to live source until verified | **PENDING ED ACTION** | Ed must open Growth Model v2 and confirm: 3 tabs, 9 columns, SOURCE column present. |
| 10 | Later cleanup items | Sprint 5 Brief Part V | Not this sprint | Restaurant data, real photography, attorney DB, GitHub, dead components. |

---

**Sprint 5 has not started. No code has been touched.**  
This document is the pre-build reconciliation output as specified.  
Awaiting Ed's decision on PIPE architecture and Twilio credential re-entry before build begins.

---

*Christie's East Hampton · Sprint 5 Reconciliation · April 1, 2026 · Manny*  
*Soli Deo Gloria*
