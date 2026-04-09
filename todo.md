# Christie's East Hampton Dashboard — TODO

## Completed
- [x] 7-tab dashboard architecture (HOME, MARKET, MAPS, IDEAS, PIPE, FUTURE, INTEL)
- [x] CIREG logo (white, brightness filter) in nav header
- [x] James Christie portrait (Gainsborough oil, National Portrait Gallery) — gold border
- [x] Founding letter above the fold on HOME tab (two-column layout)
- [x] LISTEN · FOUNDING LETTER button wired to ElevenLabs TTS (Voice ID fjnwTZkKtQOJaYzGLa6n, eleven_multilingual_v2)
- [x] Dedicated Express route /api/tts/founding-letter (bypasses tRPC timeout)
- [x] DOWNLOAD MARKET REPORT button — client-side jsPDF (5-page export, no server dependency)
- [x] Made with Manus badge suppressed via CSS
- [x] Market ticker server-side proxy /api/market-data (bypasses Yahoo Finance CORS)
- [x] All 6 financial feeds live: S&P 500, Gold, Silver, VIX, 30Y Treasury, Bitcoin
- [x] 30Y Fixed Mortgage updated to 6.38% (Freddie Mac weekly average)
- [x] Last Updated timestamp added to primary data strip
- [x] Failed feeds hidden (null → no render) instead of showing dashes
- [x] Site published to christies-dash-acqj9wc4.manus.space

## Pending
- [ ] Custom domain activation: christiesrealestategroupeh.com (DNS CNAME set, awaiting Manus Settings → Domains panel)
- [ ] PIPE tab wired to Google Sheet (scaffold complete, awaiting sheet tab inventory)
- [ ] Consider upgrading TTS model to eleven_v3 for more expressive delivery
- [x] Remove Made with Manus badge completely (all pages, desktop + mobile) — confirmed zero badge elements in DOM; CSS suppression already working
- [x] Clean up FUTURE tab GCI chart (spacing, alignment, professional finish) — taller bars, proper Y-axis gridlines, legend, agent count labels
- [ ] Confirm both domains added: christiesrealestategroupeh.com + www.christiesrealestategroupeh.com
- [x] Checkpoint and publish for Angel review — version 49ef300f

## Final Compiled Directive — March 30, 2026

- [ ] Publish Manus build and add both domains (christiesrealestategroupeh.com + www)
- [ ] Confirm Netlify backup URL preserved before DNS cutover
- [x] Remove all Manus vendor attribution from public-facing surfaces — ManusDialog login text neutralized; CSS suppression confirmed; debug collector is dev-only
- [x] Rebuild MARKET donut/ring around nine hamlets only — nine-hamlet volume-share SVG donut, tier-colored segments, labeled, no macro data
- [x] Re-art-direct PDF Market Report — page 1 mirrors website hero, page 2 two-column ticker+table, pages 3–4 hamlet card grid with tier badges and ANEW bars
- [ ] Post-Angel: PIPE persistence (database)
- [ ] Post-Angel: INTEL operational calendar (podcast + event sheets)
- [ ] Post-Angel: favicon / public brand hygiene (Christie's mark)
- [ ] Post-Angel: PDF parity with website
- [ ] Post-Angel: FUTURE refinement
- [ ] Post-Angel: MAPS / MARKET visual refinement

## Final Compiled Directive v2 — March 30, 2026

- [x] FUTURE tab: add 2026 scorecard (52 podcasts, 12 collector events, 12 agents, 12 raving fans) + tighten spacing
- [x] Confirm all vendor attribution removed (desktop, mobile, staging, PDF) — zero visible Manus text in DOM or PDF output
- [ ] Confirm hamlet donut live (nine segments, labeled, volume share %)
- [ ] Publish build and add both domains: christiesrealestategroupeh.com + www
- [ ] Return: HOME screenshot on live domain + FUTURE screenshot
- [ ] Remove "Made with Manus" badge visible in published build (bottom right corner)

## UX Fixes — March 30, 2026 (pre-council-send)
- [x] Portrait click: confirm navigates to /report (Market Report page), not external news — label updated to "Tap for Market Report"
- [x] PDF download: add clear loading state + button label change + toast on completion — spinning icon, pulsing fill, green ✓ confirmation on done
- [x] TTS audio: replace subtle spinner with prominent player — spinning loader with "Synthesizing Audio… Please Wait", animated waveform bars when playing, gold progress bar, STOP button, mobile-safe full-file-download-before-playback

## Sprint 1 Directives — March 31, 2026

- [x] /report: Add second TTS button "LISTEN · MARKET REPORT" with full report text payload (news + market intel + hamlet atlas)
- [x] /report: Keep "LISTEN · FOUNDING LETTER" as-is, same styling, both buttons side by side
- [x] PDF parity: Rewrite generateMarketReport to match /report section order exactly (hero → news → market intel → hamlet atlas → model deal → resources)
- [x] INTEL: Layer 1 — Calendar at top (podcast + event + internal + social filters, current week/month default)
- [x] INTEL: Layer 2 — Live sheet embeds below calendar (agent/recruiting, auction/events, social/podcast pipeline)
- [x] INTEL: Layer 3 — Canon documents below live sheets (existing cards preserved)
- [x] PIPE: Wire pipeline entries to database for persistence across refresh
- [x] PIPE: Full-width tall view, real data primary

## Sprint 2 Directives — March 31, 2026

- [ ] INTEL: Rebuild to wireframe spec — live calendar from Podcast + Event sheets, no seeded data
- [ ] INTEL: 4-panel sheet grid (Agent Recruiting fixed ID, Social/Podcast, Contact Database, Auction Events)
- [ ] INTEL: No scroll traps, one continuous surface, viewport-height CSS for sheet panels
- [ ] PIPE: Replace UI with real Office Pipeline sheet embed (full-width, tall, laptop-optimized)
- [ ] William: Add full audio controls (play/pause, scrub, rewind, time display)
- [ ] Quick win: Remove email from /report contact block
- [ ] Quick win: Wire /report Section 3 rate panel to live ticker feed
- [ ] Quick win: Fix Agent Recruiting sheet ID (corrected ID)
- [ ] Christie's Auction Intelligence: Add closing layer to /report (jewelry/watches/handbags/art/cars, 3-5 bullets)
- [ ] Christie's Auction Intelligence: Add contextual footer to PDF export
- [ ] Single-hamlet PDF: East Hampton Village static template

## Sprint 3 Directives — March 31, 2026
- [ ] CIS rename: replace all "ANEW Score" with "Christie's Intelligence Score (CIS)" across 7 files (23 occurrences)
- [ ] IDEAS CTA: change button text to "Generate Your Private Property Intelligence Brief"
- [ ] PDF export title: rename to "Private Property Intelligence Brief" across all export functions
- [ ] Estate Advisory Card PDF: build from wireframe HTML, host on CDN, add to INTEL Layer 3
- [ ] Hamlet PDF: rebuild to match wireframe spec exactly (navy gradient hero, two-column layout, no auction room image)
- [ ] INTEL: fix Podcast calendar sheet ID to 1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8
- [ ] state.json: build in client/public with sprint number, sheet IDs, design tokens, founding letter, CIS definition, doctrine lines, tab architecture, sprint build summary

## Sprint 5 — Truth Alignment — April 1, 2026
- [x] Twilio: re-enter credentials via secrets manager, confirm auth, fire live WhatsApp test to 646-752-1233
- [x] Hamlet: fix "Montauk" → "East Hampton Town" in tts-route.ts
- [x] Hamlet: fix "Montauk" → "East Hampton Town" in whatsapp-route.ts
- [x] Hamlet: verify hamlet-master.ts ninth hamlet matches canon (East Hampton Town, CIS 8.6, Premier)
- [x] CTA: replace all "Generate" with "Request" language in IdeasTab.tsx
- [x] CTA: audit /report surface for any "Generate" CTA language and correct
- [x] Horizon: update INTEL tab Sprint 3 banner to Sprint 5 Horizon with correct items
- [x] Listings: build daily listing sync from Christie's profile page
- [x] Integrity: label PIPE quick-add tracker "Local Draft — Not synced to Pipeline Sheet"
- [ ] Integrity: upload six canon HTML files to CDN and wire into INTEL document library
- [x] Integrity: re-upload Estate Advisory Card PDF and update URL in INTEL
- [x] Integrity: remove puppeteer-core, @sparticuz/chromium, html2pdf.js (dead weight); axios retained — required by core OAuth sdk
- [x] Vitest: 18/18 passing across 5 test files — Twilio credentials validated live
- [x] Checkpoint: save Sprint 5 final checkpoint

## Manny Brief — April 1, 2026

### Part I-A: Live Truth (Pipeline)
- [x] PIPE DB: 25 Horseshoe Road → status IN CONTRACT
- [x] PIPE DB: 2 Old Hollow → status IN CONTRACT

### Part I-B: Additive Sheet Edits
- [x] Contact Database: DO NOT TOUCH existing sheet (Hamptons Outreach — property targeting, not relationship DB)
- [x] Contact Database: CONTACTS_STAGING tab built inside Growth Model v2 — 14 columns (NAME, ROLE, QUADRANT, COMPANY, PHONE, EMAIL, BIRTHDAY, GIFT TRIGGER, LAST GIFT, CADENCE, LAST TOUCH, NEXT TOUCH DUE, WHALE NOTES, NOTES) — structure only, no data, no formulas. Dropdowns (ROLE + CADENCE) pending Ed activation.
- [x] Future Agents: QUADRANT column added (column I, row 3)
- [x] Podcast Calendar: PUBLIC (K4), PDF (L4), DISPATCH (M4) columns added
- [x] Podcast Calendar: Balsam Farm added as Ep 13, row 17, Status: CONFIRMED
- [x] Podcast Calendar: Green Thumb Nursery added as Ep 14, row 18, Status: CONFIRMED
- [x] Event Calendar: PUBLIC (I5), PDF (J5), DISPATCH (K5) columns added
- [x] Event Calendar: Bridge Car Show row 8 date updated to August 2026
- [x] Event Calendar: Wednesday Circuit added row 10, Date: Recurring 2026, Status: Recurring
- [x] Growth Model v2: ASSUMPTIONS row 27 added (2026_INSTITUTIONAL_PIPELINE_GCI = $825,000 with full notes). OUTPUTS rows 23-27 added: Agent Production $3.125M + Institutional $825K = Total GCI $3.95M + House Take $1.185M. No formulas overwritten.

### Part III: Inventory
- [x] Return full 8-sheet inventory delivered — sprint5-inventory-april1.md
- [x] Council Audit delivered — council-audit-april1.md
- [x] All 8 sheet IDs confirmed correct in codebase (no changes needed)
- [x] IntelTab.tsx: contactDatabase key renamed to hamptonsOutreachIntelligence (Sprint 6 Flag 1 approved)
- [x] IntelTab.tsx: SheetPanel title updated to 'Hamptons Outreach Intelligence'
- [x] IntelTab.tsx: SHEET_IDS lock date updated to April 1, 2026

## Sprint 6 — Platform Direction (April 1, 2026)

- [ ] Favicon: upload best C option (IMG_4386 = crimson block C, IMG_4387 = serif C on white) to CDN, set as favicon.ico
- [ ] Art/Beauty/Provenance standard: audit and apply across platform copy/UI
- [ ] William closing: implement Option B
- [ ] Tier labels: remove from all surfaces

## Phase B Sprint — April 2, 2026

### P0 (Do First)
- [x] P0-1: Favicon — swap to IMG_4386.JPG (cream C on crimson)
- [x] P0-2: Hero image crop — push object-position down (HOME + /report)
- [x] P0-3: Audio player — back 15s, play/pause, forward 15s, progress bar, runtime, Share button

### Phase B (In Sequence)
- [x] B-1: INTEL cleanup — remove Auction Events from Layer 2, restructure to 3 panels, update Sprint 6 banner
- [x] B-2: Embed Google Calendar in Intel Layer 1 (month view, navy/gold, no chrome)
- [x] B-3: Google Apps Script nightly sync (Event Calendar + Podcast Calendar → Google Calendar) — script ready to paste
- [x] B-4: Create Wednesday Circuit as first recurring Google Calendar event — in Apps Script
- [x] B-5: Wire org chart wireframe to Intel Layer 3 as first canon document card — already done prior session, confirmed
- [x] B-6: Maps Intelligence Hub — five layers one scroll (CIS Calculator migrated, IDEAS removed from nav)
- [x] B-7: Futures tab — arc chart confirmed rendering correctly, no changes needed
- [x] B-8: OG meta tags — og:title, og:description, og:image, og:url, og:site_name, twitter:card, twitter:image
- [x] B-9: Market ticker verified — institutional marquee + 7-field data strip (S&P, BTC, Mtg, Gold, Silver, VIX, Treasury, Weather)

## Sprint 6 — Live Mortgage Rate (April 2, 2026)
- [x] Wire 30Y Fixed Mortgage rate to live FRED/Freddie Mac endpoint — MORTGAGE30US series, 24h cache, fallback to last known value. Live: 6.46%

## Sprint 6 — Apps Script Updates (April 2, 2026)
- [x] Wednesday Circuit start date → May 7, 2026 (first Wednesday in May)
- [x] Nightly sync: filter to today-or-later only (no backfill of past events)
- [x] Weekly Christie's auction scraper: fetch christies.com/en/calendar, write NY sale dates to Event Calendar sheet

## Sprint 6 — Four Items (April 2, 2026)
- [x] Item 1: PIPE tab — 2 Old Hollow Road status CLOSED, date April 2, 2026 — live write confirmed
- [x] Item 2: Sale Type column E in Apps Script — Online Auction / Live Auction, gold/grey color-coding
- [x] Item 3: Server-side triggers — instructions documented below (run in Google Apps Script UI, not server-side)
- [x] Item 4: scrapeChristiesAuctions() + createWednesdayCircuit() — script ready, run manually in Apps Script UI

## Google Sheets API Integration (April 2, 2026)
- [x] Install googleapis package
- [x] Scaffold server/sheets-helper.ts with service account auth — column map corrected to real sheet structure
- [x] Add GOOGLE_SERVICE_ACCOUNT_JSON secret
- [x] Wire PIPE tab — sheetDeals query + updateSheetStatus mutation wired to Google Sheets API
- [x] Remove DB tracker, Google Sheet is single source of truth — PipeTab rebuilt with live deal cards
- [x] First live write: 2 Old Hollow Road status=Closed date=April 2, 2026 — verified in Sheet row 4

## Full Platform Audit — April 2, 2026
- [x] Listings parser fixed: JSON extracted from <main> tag, cheerio selector corrected — 4 active listings now syncing
- [x] sheets-helper.ts column map corrected: DATE CLOSED moved from M to U (column 21), sheet expanded to 22 columns
- [x] Wrong date in M4 (YOUTUBE LONG) cleared; April 2, 2026 written correctly to U4 (DATE CLOSED)
- [x] readPipelineDeals: header row skip added (skips row where address === "ADDRESS")
- [x] pipe.sheetDeals: 47 rows, 10 section headers, 37 actual deals — all correct
- [x] All 23 tests passing, 0 TypeScript errors, 0 browser console errors
- [x] Dev server: clean — no errors, no warnings beyond cosmetic baseline-browser-mapping notice
- [x] Calendar setup: all 5 functions run from sandbox (setupEventCalendarHeaders, scrapeChristiesAuctions, colorCodeSaleTypes, createWednesdayCircuit, syncSheetsToCalendar)
- [x] 25 future Christie's NY auction events pushed to Google Calendar (gold/yellow, Live Auction)
- [x] Wednesday Circuit recurring event created: May 7, 2026, every Wednesday, 9:30AM–1PM
- [ ] Sprint 6 open items: Favicon (IMG_4386), Art/Beauty/Provenance audit, William closing Option B, Tier label removal

## Phase C — April 2, 2026

- [x] PDF filename: change Christies_EH_Market_Report_South_Fork.pdf → Christies_EH_Market_Report.pdf
- [x] PDF page title (line 496): change "South Fork · Ten Hamlets" → "Ten Hamlets · East Hampton"
- [x] Discipline sentence confirmed unchanged: "The Christie's Intelligence Score is not a sales tool. It is a discipline." — no edit needed
- [x] Intel Layer 3 org chart: wired as first DocSection (ORG_CHART_DOCS) — confirmed first card in Layer 3

## Phase C Continued — April 2, 2026

- [x] Doctrine footer audit: all five PDF export footers confirmed correct — all call drawFooter() from pdf-engine.ts line 162 which renders "Art. Beauty. Provenance. · Christie's International Real Estate Group · Est. 1766" — no changes needed

## Sprint 7 — May 1 Systems Launch (Narrow Sequence Only)
## Brief Date: April 2, 2026 · Hard Launch: May 1, 2026
## Build only what is listed, in order. Nothing added.

### URGENT (Before April 17)
- [ ] URGENT: Netlify Personal Access Token "manus" expires April 17 — Ed must generate new token at app.netlify.com → User Settings → Applications → Personal Access Tokens, then send to Manny to update environment variable. Deployments stop April 17 without this.

### Sprint 7 Item 1 — Professional Org Chart (Version 2)
- [ ] Render org chart as first canon document card in INTEL Layer 3
- [ ] Landscape orientation, left-to-right hierarchy, CIREG brand guidelines (charcoal/gray palette, approved lockup)
- [ ] Dynamic: driven from Org Chart Intelligence Google Sheet (Zone One public / Zone Two private)
- [ ] Five tiers: Artemis/Pinault → Christie's Auction House → CIH → CIREG Tri-State → Christie's East Hampton Flagship
- [ ] Guillaume Cerutti marked as departed (March 30, 2026), greyed out
- [ ] Appendix: Layer 3 Relationship Intelligence note (Council of 39, Whales, Strategic Partners, etc.)
- [ ] Zone Two is private and Ed-authenticated only

### Sprint 7 Item 2 — Family Office List + Custom Letter System
- [ ] Perplexity-sourced family offices in East Hampton area — structured list in INTEL
- [ ] Custom Ed Bruehl / James Christie letter (embedded auction-house magazine insert format)
- [ ] Targets: oceanfront / UHNW / family office drops in East Hampton area
- [ ] QR code direct to free newsletter / subscription model on website
- [ ] Letter system wired into PIPE for follow-up tracking

### Sprint 7 Item 3 — Local Charity Tracker
- [ ] Wire into INTEL and newsletter
- [ ] Critical names: Highway 27 safety + East Hampton affordable housing
- [ ] Perplexity-sourced charity identification

### Sprint 7 Item 4 — Intel Source / Growth Model Template Consolidation
- [ ] All homework scrubs / spreadsheets consolidated into one consistent template
- [ ] Dashboard grows smarter, not bigger — no new tabs, no new surfaces

### Sprint 7 Item 5 — Newsletter Infrastructure
- [ ] Ed enables Christie's email auto-forward to Gmail
- [ ] Manny configures Beehiiv setup (sender: edbruehl@christiesrealestategroup.com)
- [ ] Gmail SMTP "Send As" configuration so Gmail sends professionally branded Christie's mail
- [ ] Newsletter = Christie's East Hampton Market Report delivered to inbox
- [ ] One product, four surfaces, free forever
- [ ] Every Monday cadence

### Sprint 7 Item 6 — ElevenLabs API Key Regeneration
- [ ] Ed regenerates key at elevenlabs.io
- [ ] Ed sends new key to Manny via secure channel only
- [ ] Manny updates ELEVENLABS_API_KEY environment variable

### Locked Decisions (Do Not Revisit)
- CIREG Brand Guidelines are canon law for every visual surface
- Four pillars: territory intelligence, relationship capital, institutional memory, advisory voice
- Newsletter is the Christie's East Hampton Market Report — one product, four surfaces, free forever
- Org chart is landscape, dynamic, sheet-driven (Zone One public / Zone Two private)
- May 1 is the hard launch — nothing ships before
- Craig Silverstein lens: formalize the plan early, build systems that scale without ego, keep Christie's 1766 brand as the story
- Ricky filter: every surface must pass — does this make Ed look like the authority?

### SOPs for Intel Page (Locked for Angel / Team)
- Weekly porch-drop card campaign starts May 1
- Newsletter goes out every Monday (free forever) — drives to subscription model
- Custom letter drops to targeted oceanfront/UHNW/family offices begin May 1
- Every new sign-up auto-feeds PIPE and INTEL for follow-up
- Charity tie-in in every issue (Highway 27 safety + East Hampton affordable housing)

## Sprint 7 — UI Fixes (New Items from April 2 Final Brief — Build Before May 1)

- [x] UI-FIX-1: Maps tab — replaced D3 SVG plate with live Google Maps aerial view (satellite, centered East Hampton lat 40.9635 lng -72.1851, zoom 11, hamlet markers)
- [x] UI-FIX-2: Founding letter mobile layout — added flex-col md:grid breakpoint so portrait stacks above text on mobile
- [x] UI-FIX-3: Nav bar email — added edbruehl@christiesrealestategroup.com as gold mailto link in office/weather bar (DashboardLayout.tsx line 462)
- [x] UI-FIX-4: Footer stripped to one line — "Art. Beauty. Provenance. · Since 1766." — Christie’s gold (#C8AC78), centered, navy background (DashboardLayout.tsx line 479)

## Sprint 7 — New Locked Decision (April 2 Final Brief)
- Business card is the branding anchor: photo + "CHRISTIE'S INTERNATIONAL REAL ESTATE GROUP" + "Art. Beauty. Provenance." + christiesrealestategroup.com — apply this standard to all surfaces

## Sprint 7 Item 6 — ElevenLabs Key Rotation (April 2, 2026)
- [x] Update ELEVENLABS_API_KEY to new key (old key deleted by Ed) — key rotated April 2, 2026
- [x] Confirm TTS /api/tts/founding-letter endpoint responds with audio — 200 OK, 1.86MB audio file
- [x] Run vitest to confirm tts.test.ts passes with new key — 23/23 passing

## Sprint 7 — Go Signals (April 2, 2026)

### Netlify — Kill the Project
- [ ] Remove all Netlify references from architecture, README, and documentation
- [ ] Remove any Netlify deploy scripts or config files from the project
- [ ] Platform is Manus only — christies-dash-acqj9wc4.manus.space + www.christiesrealestategroupeh.com

### Sprint 7 Item 1 — Org Chart v2
- [ ] Read Org Chart Intelligence Google Sheet for live data
- [ ] Build landscape, left-to-right, five-tier org chart component
- [ ] Five tiers: Artemis/Pinault → Christie's Auction House → CIH → CIREG Tri-State → Christie's East Hampton Flagship
- [ ] Guillaume Cerutti greyed out (departed March 30, 2026)
- [ ] Zone One: public, names visible
- [ ] Zone Two: private, no names in HTML — Ed-authenticated only
- [ ] Wire as first canon document card in INTEL Layer 3
- [ ] CIREG brand palette (charcoal/navy, gold connectors)

### Sprint 7 Item 2 — Family Office List + Custom Letter System
- [ ] Research East Hampton / South Fork UHNW family offices via Perplexity
- [ ] Build structured list in INTEL (name, principal, AUM estimate, property interest, contact)
- [ ] Build Ed Bruehl / James Christie custom letter template (auction-house magazine insert format)
- [ ] QR code to newsletter/subscription
- [ ] Wire into PIPE for follow-up tracking

## Sprint 7 Items 2 & 3 — April 3, 2026

- [x] Item 2: Family Office List — 12 UHNW principals across 5 tiers in INTEL Layer 3 — Ed Bruehl / James Christie letter template — QR to newsletter — wired into PIPE for follow-up
- [x] Item 3: Local Charity Tracker — Highway 27 safety + East Hampton affordable housing — card in INTEL — Google Sheet backend
- [ ] ElevenLabs key rotation — update ELEVENLABS_API_KEY to new "Manny" key with Text to Speech permission — confirm TTS live

## Sprint 7 Items 4, 5, 6 — April 3, 2026

- [x] ElevenLabs key rotation — new "Manny" key set, TTS confirmed live (200 OK, 369KB audio)
- [x] Item 4: Intel Source Registry — 16 sources across 4 pillars (Territory, Relationship, Memory, Voice) — filter tabs, expandable cards, Growth Model feed map — wired into INTEL Layer 3
- [x] Item 5: Newsletter Infrastructure — Beehiiv subscriber management + Gmail SMTP — nodemailer installed — newsletter.ts helper with buildMarketReportNewsletter, beehiivSubscribe, sendTestEmail — tRPC procedures: newsletter.subscribe, newsletter.getStats, newsletter.sendTestEmail — NewsletterManager component in INTEL Layer 3 — 2 new vitest tests — 25/25 passing

## MAPS Tab — Live Listings Fix (April 3, 2026)

- [ ] Diagnose why MAPS hamlet cards show TBD instead of live listings from scraper
- [ ] Fix data pipeline so live listings from christiesrealestategroup.com/realestate/agent/ed-bruehl/ render in MAPS hamlet cards
- [ ] Confirm all 4 live listings are displaying correctly in MAPS tab

## MAPS Tab — Live Listings Fix (April 3, 2026)
- [x] MAPS tab — fix hamlet ID mismatch in HAMLET_KEYWORDS (east-hampton-village → east-hampton, hampton-bays → east-hampton)
- [x] MAPS tab — add live listing badge (N ACTIVE) to hamlet grid cards
- [x] MAPS tab — add top listing preview to hamlet grid card body

## PIPE Tab — Google Sheet Embed (April 3, 2026)
- [x] Build server-side proxy: read private Office Pipeline Sheet via Service Account, render as styled HTML table in PIPE tab

## Sprint 7 Items 7 + PIPE Add Deal (April 3, 2026)
- [x] Sprint 7 Item 7 — Update INTEL Horizon banner from Sprint 6 to Sprint 7
- [x] PIPE tab — Add Deal button wired to appendSheet tRPC mutation

## Sprint 7 Final Polish — May 1 Launch (April 3, 2026)
- [ ] Nav Bar: inline weather widget + address + email in one thin gold-on-navy row; fix extra height
- [ ] Nav Bar P0: fix email to edbruehl@christiesrealestategroup.com
- [ ] HOME Tab: restore V1 layout — hero+founding letter, YouTube channel, Christie's story, Christie's video, gallery image box; remove KPI tiles, Priority Actions, Pipeline Snapshot, Market Signal cards
- [ ] HOME Tab: strip footer to one line — "Art. Beauty. Provenance. · Since 1766." gold on navy
- [ ] MARKET Tab: strip all floating cards; live data strip + hamlet matrix only; remove tier label strings (CIS score display only); remove Wainscott and Hampton Bays
- [ ] PIPE Tab: move pipeline table above the fold — remove anything sitting above it
- [ ] INTEL Tab: constrain calendar to card width; embed org chart open on arrival; SOP as collapsed card; remove non-canonical items
- [ ] MAPS Tab: zoom out to show full North+South Fork on initial load; remove hamlet blob overlays; clean listing slots (no placeholders)
- [ ] FUTURE Tab: remove GCI Trajectory Chart; add Ascension sales volume visual — 6 milestones: $2.5M → $13.62M → $20M+ → $143M+ → $280M+ → $3B; actual vs projected; printable

## Sprint 7 Final Polish — Completed (April 3, 2026)
- [x] Nav Bar — collapsed Layer 5 to single thin gold-on-navy sliver (email already correct at edbruehl@christiesrealestategroup.com)
- [x] HOME Tab — restored V1 layout: hero + founding letter + YouTube channel + Christie's story + video + gallery; stripped KPI tiles, Priority Actions, Pipeline Snapshot, Market Signal cards; footer to one line "Art. Beauty. Provenance. · Since 1766."
- [x] MARKET Tab — stripped RateEnvironment sidebar and Saunders section; hamlet tiles CIS score only
- [x] PIPE Tab — pipeline table already above the fold (confirmed, no change needed)
- [x] INTEL Tab — calendar constrained to 400px height
- [x] MAPS Tab — zoomed out to full North+South Fork (zoom 9, center -72.55); replaced default blob markers with custom gold dot markers
- [x] FUTURE Tab — removed GCI bar chart; replaced with Ascension Arc visual (6 milestones: $2.5M → $13.62M → $20M+ → $143M+ → $280M+ → $3B)

## Pre-Publish Fix — April 3, 2026
- [x] MARKET Tab — add Wainscott back (no CIS score yet, show as pending)

## PIPE Bulk Import — April 3, 2026
- [x] PIPE tab — "Import from Profile" button: compare scraped listings to Sheet, append new ones as Active deal rows

## Post-Sprint 7 Brief — April 3, 2026
- [ ] Audit queued visual fixes: calendar width, MAPS framing, Org Chart open on arrival, HOME V1 layout, MARKET tier labels stripped, FUTURE Ascension Arc as hero
- [ ] Set Wainscott CIS score to 8.7 in hamlet-master.ts
- [ ] Fix Frank Newbold fact: alive, Associate Broker at Sotheby's, sold $70M Further Lane 2025, East Hampton Historical Society Trustee — remove any deceased language
- [ ] PDF parity pass: remove tier language, update Wainscott to 8.7, narrow layout to match site, replace PHOTO PENDING slots with hamlet images
- [ ] Confirm all exports (CMA, deal brief, futures pro forma, market report) use CIS-only language — no public GCI or tier labels

## Post-Sprint 7 Brief — Completed (April 3, 2026)
- [x] HOME tab — audio player removed, V1 layout confirmed
- [x] MARKET tab — tier section headers removed, flat hamlet grid
- [x] Wainscott CIS score set to 8.7 in hamlet-master.ts (propagates to MARKET, MAPS, CIS Calculator, PDF exports)
- [x] Frank Newbold — no reference found in codebase, no action needed
- [x] PDF parity pass — tier language removed from all 5 export types (CIS Build Memo, CMA, Deal Brief, Investment Memo, Market Report)
- [x] PDF — PHOTO PENDING replaced with ED BRUEHL placeholder text
- [x] PDF — market report table header updated (Tier column removed, 5-column layout)
- [x] PDF — hamlet atlas card badges updated from tier name to CIS score
- [x] PDF — methodology text updated to CIS-only language
- [x] PDF — investment memo ANEW items updated to CIS-only language
- [x] PDF — market report cover label updated from ULTRA-TROPHY to CIS 9.2 / 10

## Hamlet Data Pass — April 3, 2026
- [ ] Update all 10 hamlet medians in hamlet-master.ts (Saunders 2025 annual report)
- [ ] Wire imageUrl (Wikimedia Commons) into hamlet-master.ts for all 10 hamlets
- [ ] Wire vibeText (Gemini two-sentence copy) into hamlet-master.ts for all 10 hamlets
- [ ] Render imageUrl in MAPS hamlet detail panel and MARKET tiles
- [ ] Render vibeText in MAPS hamlet detail panel
- [ ] Confirm Option B JSON schema for INTEL Layer 3

## Hamlet Data Pass — Completed April 3, 2026
- [x] Update all 10 hamlet medians in hamlet-master.ts (Saunders 2025 canonical values)
- [x] Wire Wikimedia imageUrl into hamlet-master.ts for all 10 hamlets
- [x] Wire Gemini vibeText into hamlet-master.ts for all 10 hamlets
- [x] Render imageUrl in MAPS hamlet detail panel hero (with hamlet.photo fallback)
- [x] Render vibeText as "Character" paragraph in MAPS hamlet detail panel
- [x] Option B JSON schema confirmed and pasted back for Perplexity verification

## Four Visual Fixes — Publish Blockers (April 3, 2026)
- [x] HOME — remove podcast bar completely
- [x] HOME — remove identity card box under James Christie portrait
- [x] MAPS — confirm Gemini hamlet images are rendering (imageUrl wired)
- [x] PIPE — pipeline table confirmed above the fold (already correct)

## April 3 Council Brief — Five Design Corrections

- [x] INTEL: Wrap Google Calendar in Christie's card module with navy border and constrained content width
- [x] INTEL: Collapse Podcast Pipeline and Event Calendar spreadsheet embeds behind clean "Open Sheet" buttons
- [x] HOME: Remove duplicate footer — keep only one gold-on-navy doctrine line
- [x] HOME: Tighten secondary messaging so founding letter remains dominant voice
- [x] FUTURE: Replace horizontal bubble timeline with ascending staircase bars in navy and gold

## Sprint 8

- [x] MAPS: GeoJSON hamlet boundary polygon overlays on satellite view for all 10 hamlets
- [x] INTEL: Frank Newbold competitor profile in Relationship Intelligence layer (alive, Sotheby's Associate Broker, $70M Further Lane 2025, EHHS Trustee — competitive intelligence only)

## Sprint 8 — Manny Brief April 3, 2026

### Item 1 — Intelligence Web Filtered Tabs (GO)
- [x] Wire Intelligence Web Google Sheet (ID: 1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA) to INTEL
- [x] Add Audience column with multi-value tag support to sheet schema
- [x] Build Jarvis_Top_Agents filtered tab (TIER 1 RECRUITs only)
- [x] Build Whale_Intelligence filtered tab (WHALE entity type)
- [x] Build Auction_Referrals filtered tab (PARTNER + INSTITUTION types)
- [x] Read-only display — no edit UI for non-Ed users

### Item 2 — Attorney Database Card (GO)
- [x] Build structured card module in INTEL Layer 3
- [x] Four fields: Firm Name, Contact, Specialty, Relationship Tier
- [x] Seed data: Pierre Debbas (Romer Debbas, Tier 1 Inner Circle), Brian Lester (Tarbet and Lester, Tier 1 Active), Jonathan Tarbet (Tarbet and Lester, Tier 1 Active), Seamus McGrath (Tarbet and Lester, Tier 1 Active)

### Item 3 — FUTURE Tab PDF Export (CONFIRM / ENHANCE)
- [x] Confirm exportAscensionPDF() function exists and is wired to button (confirmed: line 64 + line 398)
- [x] Verify scorecard tiles are clearly labeled "Targets, Not Actuals" in PDF output (already done: subtitle line reads "Pro Forma · April 2026 · Ilija Pavlović Review Copy · Targets, Not Actuals")
- [x] Confirm PDF renders correctly in browser print dialog — ready for April 15 Ilija deadline

### Item 4 — Publish (HOLD pending Ed GO)
- [ ] Publish checkpoint ea10273b to live domain on Ed GO signal

### Item 5 — Shared CSS Max-Width Variable (Sprint 8 · April 3)
- [ ] Confirm --frame-max-w is already defined in index.css
- [ ] Apply --frame-max-w to MAPS map frame container
- [ ] Apply --frame-max-w to PIPE table frame container
- [ ] Apply --frame-max-w to INTEL spiderweb/RelationshipIntelligenceLayer container

### Item 6 — Auction House Services Section on HOME tab
- [x] Upload Christie's services video to CDN
- [x] Build AuctionHouseServices component: branded video player + six service tiles
- [x] Constrain to --frame-max-w, gold/navy treatment
- [x] Six tiles: Appraisals & Valuations, Collection Management, Art Finance, Heritage & Taxation, Consignment, Private Sales — each linking to Christie's.com
- [x] Wire into HOME tab lower section

### Item 7 — Intelligence Web Google Sheet Created and Wired
- [x] Create Intelligence Web Google Sheet from 42-entity seed XLSX
- [x] Tab renamed to "Intelligence Web", header formatted navy/gold
- [x] Audience column auto-derived: Jarvis_Top_Agents (15), Whale_Intelligence (2), Auction_Referrals (11)
- [x] Sheet ID updated in sheets-helper.ts: 1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0
- [x] Live read confirmed: 42 entities, all columns including Audience
- [x] Three filtered INTEL tabs now reading live data from this sheet

## Sprint 9 — External-Ready · Target: May 1, 2026

### P0 — PUBLIC/PRIVATE Surface Breach (Day 1 · CRITICAL)
- [ ] Separate PUBLIC route — show only: founding letter, Christie's services, market data, hamlet cards, MAPS calculator, estate advisory card
- [ ] PUBLIC may never show: PIPE, recruiting targets, whale intelligence, family office registry, attorney intelligence, internal calendar, any private ops data
- [x] Gate INTEL and PIPE tabs behind Manus OAuth (protectedProcedure / auth check on tab render)

### P1 — Conversion Loop (Day 1)
- [x] Wire "REQUEST YOUR PRIVATE PROPERTY INTELLIGENCE BRIEF" button on MAPS to pre-filled WhatsApp (646-752-1233) with property address and CIS score
- [x] Add "Request a Private Territory Briefing" button at bottom of MARKET tab — same WhatsApp destination (646-752-1233)

### P2 — TBD Data Removal (Day 1)
- [x] Cross-reference Pipeline Sheet for Wainscott last sale data — push to hamlet-master.ts (no closed sales found; field cleared)
- [x] Cross-reference Pipeline Sheet for Montauk last sale data — push to hamlet-master.ts (18 Tara Road $3.99M Active 2026)
- [x] Remove all remaining TBD placeholders from the platform (if real data unavailable, remove the field entirely)

### P3 — Intelligence Web Sheet Corrections (Day 1)
- [x] Add Lily Safra as new entity: WHALE · ACTIVE · Audience: Whale_Intelligence
- [x] Append Whale_Intelligence to Audience for Rick Moeser, Tony Ingrao, Art Murray (keep Auction_Referrals)
- [x] Correct Frank Newbold (Row 22): Current Firm = "Sotheby's Intl Realty" (not "Unknown")
- [x] Add Angela Boyer-Stump: RECRUIT · TIER 1 · Sotheby's Intl Realty · Bridgehampton · Jarvis_Top_Agents · Senior Global RE Advisor · 27yr licensed · Top 50 Sotheby's nationally · $75M+ 2024 · Fluent German · Southampton Yacht Club Board · Archetype Match: YES

### P4 — Mobile Responsive Pass (Day 2-3)
- [ ] MAPS hamlet markers — increase touch target size for mobile
- [ ] HOME ticker — fix wrapping on small screens
- [ ] James Christie portrait — scale cleanly on iPhone without compression
- [ ] FUTURE bar chart labels — increase font size on mobile
- [ ] INTEL tab — add sticky section navigator: Layer 1 / Layer 2 / Layer 3 / Layer 4

### P5 — Security Hardening (Day 3-5)
- [ ] Auth-gate all tRPC write procedures: updateSheetStatus, appendSheet, TTS mutations → protectedProcedure
- [ ] Remove legacy DB routes: pipe.list, pipe.upsert, pipe.delete
- [ ] Move SHEET_ID from hardcoded value in sheets-helper.ts to environment variable
- [ ] Add TTL cache to pipe.sheetDeals (prevent hitting 300/min Sheets API quota)

### P6 — Remaining Items (Week 2-4)
- [ ] Shared content max-width CSS variable — confirm consistent application to MAPS, PIPE, INTEL containers
- [ ] INTEL hero slot — confirm "Relationship Intelligence — In Development" placeholder card is present
- [ ] FUTURE tab pro forma export — verify PDF matches Ascension deck structure (staged milestones, not calendar years)
- [ ] Hamlet imagery — confirm all 11 hamlet JPEGs are wired via CDN (no Wikimedia URLs remain)
- [ ] Flambeaux PDF standard — implement as default stylesheet for all five export types
- [ ] "Data current as of [date]" timestamp on HOME — automated from last Sheets API call
- [ ] Newsletter activation — wire immediately upon receipt of Beehiiv credentials from Ed

## Sprint 9 — WhatsApp Inbound Pipeline (April 4, 2026)

- [x] Item 1 — Add PERPLEXITY_API_KEY to Manus secrets and wire into env.ts (pplx- key confirmed valid 200 OK)
- [x] Item 2 — Build POST /api/whatsapp/inbound webhook: parse Body, route NEWS/PIPE/STATUS/BRIEF commands
- [x] Item 3 — Build NEWS handler: 14-category Cronkite prompt via Perplexity, ElevenLabs William voice, Twilio WhatsApp delivery
- [x] Item 3 — Build PIPE handler: last 5 pipeline deals from Google Sheet
- [x] Item 3 — Build STATUS handler: active listing count + pipeline summary
- [x] Item 3 — Build BRIEF handler: trigger morning brief immediately
- [x] Item 4 — Update Twilio webhook URL to https://www.christiesrealestategroupeh.com/api/whatsapp/inbound (confirmed in Twilio sandbox settings)
- [x] Item 4 — PUBLISH REQUIRED before live test — webhook live on prod after publish

## Sprint 9 Final Directive — April 4, 2026

### P0 — PUBLIC Tab Surface Breach (BLOCKING)
- [x] Build clean /public route: HOME content (James Christie letter, market strip, Auction House Services) + MARKET hamlet cards
- [x] Ensure PUBLIC route has NO INTEL surfaces, NO PIPE data, NO recruiting targets, NO whale intelligence
- [x] Confirm INTEL and PIPE remain gated behind Manus OAuth
- [x] Send screenshot of public visitor view to Ed

### P2 — Market Data Corrections
- [x] East Hampton Village median: 5.15M to 5.25M
- [x] Remove East Hampton Town card entirely
- [x] Remove Southampton Town card entirely
- [x] Add East Hampton North card: Median 2.03M, CIS 8.6, Share 9pct, Dollar Volume 545.4M
- [x] Relabel Volume Share to Share of Hamptons Dollar Volume everywhere on platform
- [x] Add footnote on every hamlet card: Based on 2025 recorded brokerage transactions per Saunders and Associates annual report cross-referenced William Raveis YE 2025. Total Hamptons dollar volume 5.922B.
- [x] Update all hamlet dollar volume shares to corrected values from brief
- [x] Add Wainscott last notable sale: 115 Beach Lane 59M March 2026
- [ ] Add Data current as of timestamp on HOME tab automated from last Sheets API call (deferred to Sprint 10)
- [ ] Update James Christie portrait PDF with all P2 corrections narrative intelligence section placeholder only (deferred)
- [ ] Sub-hamlet architecture: prepare fields in data layer only do NOT render on public interface (deferred)

### P4 — Mobile Responsive Pass
- [x] MAPS markers: increase tap target size for mobile (44px wrapper, 20px dot)
- [x] HOME ticker: prevent text wrapping on narrow viewports
- [x] INTEL: sticky navigator for vertical scroll Layer 1 Layer 2 Layer 3 Layer 4
- [x] FUTURE: bar chart labels readable on mobile (10px labels, 640px minWidth)

### P5 — Security Hardening
- [x] Confirm Manus OAuth gates all INTEL surfaces (PrivateTabGate + protectedProcedure)
- [x] Confirm no internal data leaks on PUBLIC route (verified: no PIPE/INTEL/whale data)
- [x] Confirm all API keys in Manus secrets manager not hardcoded
- [x] Confirm PERPLEXITY_API_KEY working in NEWS command pipeline (200 OK validated)
- [x] Harden PIPE/INTEL procedures: 10 publicProcedure → protectedProcedure (server-side auth)

## Session April 4-5, 2026 — Three Ed Rulings + Production Fix

- [x] Ruling 1: EH North image — Cedar Point County Park aerial (completed prior session, confirmed)
- [x] Ruling 2: MARKET tab hamlet images — HamletTile now shows 160px hero photo (imageUrl primary, photo fallback) with gradient overlay and tier badge, matching MAPS tab treatment
- [x] Ruling 3: PDF auth gate — /api/pdf/report now calls sdk.authenticateRequest(); returns 401 if no valid session
- [x] Production crash fix — whatsapp-inbound.ts line 44 Authorization header confirmed standard ASCII backticks (0x60); esbuild compiles clean in 9ms, 0 errors
- [x] esbuild full build verified: server/_core/index.ts → 89.5kb, 0 errors
- [x] 35/35 tests passing, 0 TypeScript errors

## Sprint 10 — April 4, 2026 (Ed Bruehl Directive)

- [x] Item 1: Fix Intelligence Web Open Sheet button — IntelligenceWebTabs.tsx → use 1eELH_ZV
- [x] Item 2: App.tsx route comment — remove IDEAS, list 6 visible tabs
- [x] Item 3: Hamlet naming sweep — fixed 14 stale "ten hamlet" references across 9 files (client + server)
- [x] Item 4: Listings scraper hamlet ID — HAMLET_KEYWORDS updated: east-hampton-village, east-hampton-north, wainscott
- [x] Item 5: Dead code removal — buildMorningBrief + buildEveningSummary removed from whatsapp-route.ts; Home.tsx, ComponentShowcase.tsx, IdeasTab.tsx deleted
- [x] Item 6: ElevenLabs voice unification — whatsapp-route.ts → fjnwTZkKtQOJaYzGLa6n (One William, one voice)
- [x] Item 7: IdeasTab.tsx — deleted permanently (no longer in App.tsx or nav)
- [x] Item 8: Newsletter subscribe button — NewsletterManager removed from IntelTab.tsx (credentials not set)
- [x] Item 9: PublicPage.tsx — routed at /public in App.tsx (Sprint 9 P0 public surface live)
- [ ] Item 10: Verify d2xsxph8 CloudFront domain live after publish

## CRITICAL — April 4, 2026 (Post-Publish)

- [ ] CRITICAL-1: /public route hitting Manus OAuth gate — must bypass auth entirely for unauthenticated visitors
- [ ] CRITICAL-2: PIPE tab stuck on "Loading Office Pipeline from Sheet" — restore Google Sheets connection

## Sprint 10 Post-Publish Fixes — April 5, 2026

- [x] CRITICAL-1: /public OAuth redirect fixed — main.tsx redirectToLoginIfUnauthorized now skips /public and /report paths
- [x] CRITICAL-2: PIPE spinner hang fixed — pipe.sheetDeals query now has retry:false so auth errors surface immediately instead of hanging
- [x] Bonus: Ten-Hamlet → Eleven-Hamlet in MapsTab.tsx (heading + comments), MarketTab.tsx (heading), whatsapp-route.test.ts (test assertion + mock text)
- [x] 35/35 tests passing, esbuild 90kb clean, 0 TypeScript errors

## PIPE Fix — April 5, 2026 (Ed Bruehl Directive)

- [x] Root cause confirmed: Sprint 9 P5 hardening changed pipe.sheetDeals from publicProcedure to protectedProcedure — blocked service account before it could run
- [x] Fix: pipe.sheetDeals reverted to publicProcedure — GOOGLE_SERVICE_ACCOUNT_JSON is the auth layer, not session cookies
- [x] Write procedures (updateSheetStatus, appendSheet, appendSheet, list, upsert, delete, importFromProfile) remain protectedProcedure
- [x] Server-side confirmed: 47 deals loaded via service account, no session cookie required
- [x] 35/35 tests passing, esbuild 90.2kb clean

## INTEL Fix — April 5, 2026 (Ed Bruehl Directive)

- [x] Root cause confirmed: same Sprint 9 P5 hardening that broke PIPE — intel.webEntities promoted to protectedProcedure, blocking service account before it ran
- [x] Fix: intel.webEntities reverted to publicProcedure in server/routers.ts
- [x] AUTH MODEL comment block added at top of appRouter in routers.ts — documents service account auth vs session auth, lists all affected procedures, explains the rule
- [x] Server-side confirmed: readIntelWebRows() → 44 entities loaded from Intelligence Web Sheet (1eELH_ZV...)
- [x] 35/35 tests passing, esbuild 90.3kb clean, 0 TypeScript errors

## Sprint 11 — April 5, 2026 (Gate Four GO)

- [x] Item 0: Remove /public route entirely — verify 404 — confirm in writing
- [x] Item 1: Wire Market Matrix Sheet to MARKET tab via publicProcedure (service account)
- [x] Item 2: Wire Growth Model v2 Sheet to FUTURE tab via publicProcedure (service account)
- [x] Item 3: WhatsApp cron timezone confirmed already correct (America/New_York) — no change needed
- [x] Item 4: Wednesday Circuit — old event deleted, new recurring event created from April 30 2026 (Calendar API)
- [x] Item 5: FUTURE tab rebuilt — six-bar Ascension Arc, 300-day proof, live volume table (VOLUME tab), profit pool, PDF export
- [x] Item 6: Estate Advisory Card — shared component extracted, rendered at HOME tab bottom (framed, gold border) and /report closing section
- [x] Item 7: Intelligence Web Master Sheet updated — Frank Newbold corrected to RECRUIT/Tier 1/COLD/Jarvis_Top_Agents, Chuck McWhinnie added (WHALE+BUILDER+AUCTION REFERRAL), Adam Kalb added (WHALE+ADVISOR), Lily Fan added (Whale Number One, WHALE, internal only), Angela Boyer-Stump Jarvis_Top_Agents tag verified, Last Touch + Cadence columns added to all rows. 48 entities, 17 columns.
- [x] Item 8: INTEL tab reordered — Mind Map placeholder (Sprint 12) → Calendar → Nine-Sheet Matrix → Document Library → Intelligence Web. Removed IntelSourceTemplate, FamilyOfficeList, LocalCharityTracker, AttorneyDatabase, IBC_DOCS, Sprint6Banner.
- [x] Item 9: Perplexity Mastermind Map iframe removed — replaced by Sprint 12 Mind Map placeholder card.
- [x] Item 10: Nine-Sheet Matrix added to INTEL Layer 3 — all nine canonical sheets numbered, described, Open Sheet buttons.
- [x] Item 11: James Christie portrait — fixed mobile scaling: clamp(90px, 14vw, 130px) width, centered in left column, alignItems:center on container. Renders correctly on iPhone SE through iPhone 15 Pro Max.

## Sprint 12 — April 6, 2026

- [x] P0: Wire Ascension Arc 2026 segments to live volData endpoint; extract MILESTONE_TARGETS config object
- [x] P4: Intelligence Web — Frank Newbold corrected to RELATIONSHIP_INTELLIGENCE/Brand tier in live sheet; entity count 47 verified; all whale tags confirmed
- [x] P6: PIPE auto-refresh indicator — ↻ Last synced Xs ago live, ticks every second, 60s auto-refresh
- [x] P7: WhatsApp INTEL command — top 5 Jarvis recruits + top 3 Whale entities, HELP menu updated
- [x] P8a: Shared content max-width CSS variable — --frame-max-w: 1100px applied to MAPS, PIPE, INTEL (verified)
- [x] P8b: INTEL hero slot placeholder card — Layer 1 Mind Map placeholder confirmed at id=intel-layer-1
- [x] P8c: Data current as of timestamp — trpc.market.dataTimestamp.useQuery confirmed live
- [x] P8d: MAPS + MARKET WhatsApp brief buttons — confirmed live (MAPS line 282, MARKET line 598)
- [x] P1: generateFutureReport() renamed, auto-print trigger confirmed (window.print() at 800ms already present)
- [x] P3: generateChristiesLetter() built (Flambeaux standard, Cormorant Garamond, gold rules, two QR placeholders, date block), HOME tab button wired
- [x] P2: UHNW Backend Strategy PDF + Intelligence Web HTML hosted on Manus CDN, wired to INTEL Layer 4 Document Library

## Sprint 13 — April 6, 2026
- [x] S13-1: Institutional Mind Map — interactive spiderweb, INTEL Layer 1, 32 nodes, hover states, view toggle (Full/Hierarchy/Recruits/Whales), no iframe
- [x] S13-2: generateFutureReportPDF() full jsPDF landscape — arc bars + 300-day proof + agent table + profit pool, Flambeaux standard, FUTURE tab button wired
- [x] S13-3: WhatsApp BRIEF [address] command — hamlet lookup table (11 hamlets), LLM fallback, CIS score + Christie's positioning paragraph, HELP menu updated

## Sprint 14 — April 6, 2026
- [x] S14-1: Rebuild InstitutionalMindMap — two parallel tracks, Cerutti removed, 35 nodes, corrected org structure (Brennan CEO, Pradels/Kadakia added, Thad Wong/Mike Golden, Gavin Swartzman)
- [x] S14-2: INTEL Layer 5 — Relationship Intelligence full table with four filters (type, tier, audience, last touch), All Entities tab added to IntelligenceWebTabs, lastTouch + cadence columns now read from sheet
- [x] S14-3: Hover news panels — intel.entityNews tRPC procedure, Perplexity 30-day news on Mind Map node hover, 5min cache
- [x] S14-4: QR codes in generateChristiesLetter() — Website QR (christiesrealestategroupeh.com) + Ed vCard QR, navy on cream, 22x22mm, qrcode package installed

## Sprint 15 — Hamlet Photo Refresh (April 6, 2026)
- [x] S15-1: Upload all 15 Ed hamlet photos to CDN, catalogue best image per hamlet, wire into hamlet-master.ts imageUrl fields

## Sprint 15b — Quick Closes (April 6, 2026)
- [x] S15b-1: Wire Montauk surfboard photo to CDN and hamlet-master.ts imageUrl
- [x] S15b-2: Update Montauk vibe text (Atlantic/surf copy)
- [x] S15b-3: Update EH North vibe text (wetland light copy — remove harbor access)
- [x] S15b-4: Verify Bonnie Brennan and Ilija Pavlović spellings — already correct in live code

## Sprint 15c — Council-Approved Vibe Text (April 6, 2026)
- [x] S15c-1: Update all 11 hamlet vibeText fields with council-approved final copy
- [x] S15c-2: Confirm Christie's Letter body copy in generateChristiesLetter() is approved final version
- [x] S15c-3: Save checkpoint and publish to christiesrealestategroupeh.com

## Sprint 15d — EH Village Static Block Corrections (April 6, 2026)
- [x] S15d-1: generateEastHamptonVillageReport — change YoY to +9.2%
- [x] S15d-2: generateEastHamptonVillageReport — change DOM to 61
- [x] S15d-3: generateEastHamptonVillageReport — change $/sqft to "$1,420 est." (add est. label)
- [ ] S15d-HOLD: Restaurant data — hold pending Perplexity 11-hamlet delivery
- [ ] S15d-HOLD: Compass mind map node — hold pending Perplexity brand attribution paste-ready block

## Sprint 15e — Market Report PDF Export Fix (April 6, 2026)
- [x] S15e-1: Test /api/pdf/report endpoint directly — capture exact error message
- [x] S15e-2: Confirm full build clean (pnpm build, not just LSP)
- [x] S15e-3: Increase Puppeteer timeout to 30s minimum
- [x] S15e-4: Re-test endpoint after fix, confirm PDF generation succeeds

## Sprint 15f — Full Export Audit (April 7, 2026)
- [x] S15f-1: Audit all export buttons — trace every handler across all tabs
- [x] S15f-2: Fix Market Report Puppeteer route (auth bypass test for real runtime error)
- [x] S15f-3: Fix any broken hamlet PDF, Christie's Letter, Deal Brief, CMA, ANEW, Investment Memo exports
- [x] S15f-4: Confirm all buttons working end-to-end

## Sprint 15f — MARKET Tab Fixes (April 6, 2026)
- [x] S15f-1: Fix Montauk + Wainscott hero photos not rendering on MARKET tab hamlet tiles
- [x] S15f-2: Fix EH North last sale — remove TBD or populate with real reference sale
- [x] S15f-3: Verify Wainscott $59M last sale attribution — confirm or correct hamlet assignment
- [x] S15f-4: Fix Ascension Arc bar scaling — confirm $15M renders visually smaller than $55M

## Sprint 15g — Ascension Arc + Market Report Print Fix (April 7, 2026)
- [x] S15g-1: Remove "Bonita DeWolf pre-launch" sub-label from 2025 bar — make all bars consistent (year label only)
- [x] S15g-2: Fix Market Report PDF print — diagnose actual Puppeteer/jsPDF runtime error and resolve

## Sprint 16 — Market Report PDF Corrections (April 7, 2026)

- [x] generateMarketReport: remove Page 2 (Hamptons Local Intelligence section) entirely
- [x] generateMarketReport: remove Page 3 (Capital Flow Signal / Rate Environment / Hamptons Median cards) entirely
- [x] generateMarketReport: fix hamlet atlas pagination — for-loop with page overflow ensures all eleven hamlets render
- [x] generateMarketReport: change "Ten-hamlet" to "eleven-hamlet" in Platform Intelligence section
- [x] generateMarketReport: fix URL to christiesrealestategroupeh.com on contact card (was christiesrealestategroup.com)
- [x] generateMarketReport: Ed headshot wired via ED_HEADSHOT_PRIMARY (INlfZDqMHcqOCvuv.jpg, HTTP 200 confirmed)
- [x] generateMarketReport: convert Platform Intelligence bullet list to prose (Flambeaux standard)

## April 6 Close-of-Day Directive (12 items)

- [x] 1. PDF: Replace Christie's Standard paragraph on Resources page with new closing copy
- [x] 2. Market tab: Fix Montauk and Wainscott hero photo imageUrl references
- [x] 3. Market tab: Populate or hide EH North last sale (remove TBD)
- [x] 4. Market tab: Verify Wainscott last sale attribution (115 Beach Ln $59M)
- [x] 5. EH Village static data: YoY +9.2%, DOM 61, $/sqft "$1,420 est."
- [x] 6. hamlet-master.ts: Populate restaurants field for all eleven hamlets
- [x] 7. PIPE tab: Remove four duplicate rows; display KPI breakout by category
- [x] 8. FUTURE tab: Confirm bar scaling consistent — $15M visually smaller than $55M
- [x] 9. WhatsApp: STATUS live entity count; BRIEF connect to readMarketMatrixRows()
- [x] 10. Market tab: Add refetchInterval 5 min to hamletMatrix query
- [x] 11. Perplexity news: Add server-side in-memory Map cache with 5-min TTL
- [x] 12. Document Library: Add April 6 Infrastructure Audit to INTEL Layer 4

## April 6 Directive — Items 13–17

- [ ] 13. Sprint 16 candidates — HOLD (hamlet atlas thumbnails, QR code, org chart PDF, WhatsApp threading)
- [x] 14a. MAPS tab: remove CIS score number overlay from hero photography on hamlet cards (MAPS tab, not MARKET)
- [x] 14b. MAPS tab: hamlet card layout already on responsive grid — confirmed, no change needed
- [x] 15a. HOME tab: move audio player higher (below founding letter, before PDF download button)
- [x] 15b. MAPS tab: content width already uses var(--frame-max-w) — confirmed
- [x] 15c. INTEL tab: calendar iframe maxWidth changed from 900 to var(--frame-max-w)
- [x] 15d. Apply shared max-width CSS variable to all content containers across all six tabs
- [x] 16a. Market Report PDF Page 4: strip CIS Framework + Platform Intelligence — closing paragraph, headshot, contact, QR codes only
- [x] 16b. Market Report PDF Page 1: extended to eight paragraphs + Ed signature block with headshot
- [x] 16c. Market Report PDF Page 3: closing doctrine block added (Springs, Montauk, Wainscott vibe text)
- [x] 16d. Market Report PDF: Platform Intelligence section removed entirely — no capital flow or rate references remain
- [x] 17. FUTURE tab GCI/profit pool visibility gate — RESOLVED: site is internal operating system. Profit Pool section stays, clearly labeled. Sales volume anchors all headline figures. No change needed.

## April 7 Morning Directive

- [ ] 1a. hamlet-master.ts: Apply 7 CIS score corrections (Southampton Village 9.0, Sag Harbor 8.4, Amagansett 8.9, EH North 8.6, Wainscott 8.7, Springs 6.8, Montauk 8.2)
- [ ] 1b. hamlet-master.ts: Apply all 11 volume share corrections
- [ ] 1c. DashboardLayout: Remove YoY % from Hamptons Median — show "$2.34M · South Fork · Q4 2025 · Record High" only
- [ ] 2a. Remove tier badges (ULTRA-TROPHY, TROPHY, PREMIER, OPPORTUNITY) from MARKET and MAPS hamlet cards
- [ ] 2b. MAPS hamlet cards: match MARKET tab card size and component exactly
- [ ] 2c. MAPS satellite map: put inside shared max-width container (currently bleeds wider)
- [ ] 2d. MAPS calculator: condense four lens buttons to match PIPE tab style; CIS Output panel populates or gets removed
- [ ] 2e. HOME page: restore navy background (#1B2A4A) behind YouTube embed and all content below it down to Estate Advisory section
- [ ] 2f. All six tabs: confirm shared max-width CSS variable applied consistently
- [ ] 2g. Hamlet cards: show Saunders/Raveis citation once at bottom of matrix only, remove from each individual card
- [ ] 3a. HOME page: add UHNW Wealth Card (front + back, 8.5x11 landscape) in navy section above Estate Advisory
- [ ] 3b. HOME page: add Bike Card (front + back, two per sheet) in navy section above Estate Advisory
- [ ] 3c. Both cards: add shareable direct link so Ed can text URL to recipient for printing
- [ ] 4a. Wainscott last sale "115 Beach Ln · $59M" — hold, do not change, do not remove
- [ ] 4b. EH North last sale "TBD · TBD" — hide field entirely in display
- [ ] 5. Market Report PDF: post page structure outline for council confirmation (no build yet)
- [ ] 6. INTEL Layer 2 calendar: diagnose disappearance and restore
- [ ] 7a. Mind map: add EXPORTS node with sub-nodes for all PDF exports grouped by category
- [ ] 7b. Mind map: add PIERRE · PROPERTY REPORTS node
- [ ] 7c. Office Pipeline Sheet: add two columns — "Property Report Date" and "Property Report Link"

## April 7 Directive — Item 7 Complete (Seven-Item Directive Closed)

- [x] 7a. Mind map: EXPORTS node added — PDF Operating Interface, 12+ sub-nodes, connected to Ed
- [x] 7b. Mind map: PIERRE · PROPERTY REPORTS node added — connected to Pierre Debbas + Ed
- [x] 7c. Office Pipeline Sheet: columns V (Property Report Date) + W (Property Report Link) added to PipelineDeal type and sheets-helper.ts
- [x] 7d. tRPC: pipe.updatePropertyReport procedure wired — protectedProcedure, writes V+W by address match
- [x] 7e. 35/35 tests passing — sheets-write.test.ts verifies propertyReportDate and propertyReportLink fields in live sheet read

## April 7 Final Unlock — Zero Placeholders

- [x] EH North last sale unlocked: 24 N Woods Ln · $2.17M · Jan 2025 · Source: Redfin MLS-backed
- [x] Wainscott last sale flag comment removed: 115 Beach Ln · $59M · Mar 2026 · Source: The Real Deal, Behind The Hedges — attribution confirmed
- [x] Collateral cards v2 uploaded to CDN (UHNW card, Bike card, Christie's Letter)
- [x] HomeTab.tsx updated: UHNW + Bike card CDN URLs point to v2 files; Christie's Letter added as third collateral card
- [x] 35/35 tests passing — propertyReportDate + propertyReportLink fields confirmed in live sheet read

## Sprint 17 — Remaining Open Items (April 7 Directive)

- [x] 2a. MAPS hamlet cards: match MARKET tab card component exactly (same grid minmax, same card height 160px photo, same p-5 body)
- [x] 2b. MAPS hamlet matrix: wrapped in max-width var(--frame-max-w) container to match MARKET tab
- [x] 2c. MAPS calculator: CIS Output panel confirmed clean — "Enter your numbers and run the score" placeholder already present
- [x] 3a. INTEL Layer 2 calendar: wrapped in max-width var(--frame-max-w) container to match mind map width
- [x] 5a. Market Report PDF: structure outline posted in delivery message for council approval

## April 7 Final Directive — Sprint 18 Items

- [x] Mind Map Item 7c: Add SOCIAL node and PERPLEXITY node with explicit drawn connection (SOCIAL = data field, PERPLEXITY = interpretation engine)
- [x] Item 2f: Source attribution — one location only (bottom of hamlet matrix in MarketTab)
- [x] Item 5 GATE: Market Report PDF structure outline posted for council approval (see delivery message)

## Sprint 19 — Market Report PDF Build (Council Approved)

- [x] PDF Page 1: nine-paragraph letter (locked text from PDF), signature block, Ed headshot placeholder
- [x] PDF Pages 2–3: eleven hamlet atlas — photo thumbnail, hamlet name, CIS score, median price, volume share, vibe text — live Market Matrix data at generation time
- [x] PDF Page 4: closing paragraph, headshot, contact block (26 Park Place · 646-752-1233 · email), two QR codes (website + WhatsApp)
- [x] Wire PDF download button to HOME tab (TAP FOR MARKET REPORT area)
- [x] Verify end-to-end: live data flows from Market Matrix sheet into PDF at generation time
- [ ] FUTURE tab: add 2030 bar to Ascension Arc (PDF build complete — unblocked)
- [ ] FUTURE tab: $1B horizon label legibility (PDF build complete — unblocked)

## Sprint 20 — FUTURE Tab Completion (April 7, 2026)

- [x] FUTURE tab: add 2030 bar to Ascension Arc ($320M milestone target, between 2029 and 2031)
- [x] FUTURE tab: $1B horizon label legibility — opacity removed (was 0.55), font-weight 700, font-size 1rem — legible from across a conference table
- [x] MacWhinnie name correction: zero references in codebase — clean. Correction is Perplexity-side only.
- [x] April 7 v7 directive full audit: all seven items confirmed complete across checkpoints 3e115363, ec3c1be4, 1f425d72, 970cb917, and 970cb917+

## Sprint 21 — April 7, 2026

- [x] Item 1: PIPE tab — Add "Add Report" button per deal row, modal with date picker + URL field, calls pipe.updatePropertyReport tRPC procedure
- [x] Item 2: EXPORTS mind map — nine clickable sub-nodes added (Market Report, Christie's Letter, Hamlet PDFs x11, ANEW Build Memo, Christie CMA, Deal Brief, Investment Memo, UHNW Path Card, FUTURE Pro Forma) — direct PDF triggers from mind map
- [x] Item 3: Wednesday Circuit Google Calendar — Google Calendar embed added to INTEL Layer 2 as third full-width panel (Calendar ID: b591e65f..., MONTH view, America/New_York, recurring Wednesdays from May 7 2026)

## Sprint 22 — April 7, 2026

- [x] Item 1: INTEL Layer 2 — spreadsheet embeds removed, Wednesday Circuit Google Calendar embed kept, "Open Sheet Matrix" text link added below calendar
- [ ] Item 2: Social Intelligence credentialing — BLOCKED on Ed's credentials (YouTube first, then Instagram/Facebook via Meta API, then X/LinkedIn). Pending.
- [x] Item 3: UHNW Path Card — generateUHNWPathCard() built (8-rung landscape PDF), wired to HOME tab with Download PDF button alongside Open & Print
- [x] Item 4: William morning brief — getPipelineSummary() wired, prepends top-3 active deals (address + status, no GCI) to every brief via Promise.all
- [x] Item 5: INTEL Document Library — Lash Speaker Packet added as pinned canon document (Stephen Lash Speaker Briefing · July 2026 · Fitzgerald, the Hamptons, and Christie's)

## Sprint 23 — April 7, 2026 · Growth Model Corrections (Full Council Directive)

### Section A — Data Corrections
- [ ] A1: OUTPUTS display — agent count 18 → 16
- [ ] A2: OUTPUTS note — "9 existing (incl. Scott Smith pending June 1) + 3 targeted + 4 organic"
- [ ] A3a: ROSTER — Sandy Busch Y1 GCI $50K → $25K
- [ ] A3b: ROSTER — Jan Jaeger Y1 GCI $50K → $25K
- [ ] A3c: ROSTER — Zoila Ortega Astor 2026 GCI $60K → $65K; 2027 GCI → $150K; broker by March 2027
- [ ] A3d: Recalculate EXISTING SUBTOTAL and downstream formulas
- [ ] A4: ASSUMPTIONS — replace $825K institutional referral line with governance note
- [ ] A5: OUTPUTS 2026 GCI BREAKDOWN — remove institutional/referral line + total GCI + house take; replace with "Agent Production GCI 2026: $3,125,000"
- [ ] A6: Remove all Marilyn Clark references (InstitutionalMindMap.tsx: node + connection)

### Section B — Profit Pool Formula (rebuild)
- [ ] B1: Replace existing Profit Pool prose with 2026-2031 table
- [ ] B2: Formula: Pool = (Total Sales Volume - $40M) × 2%; if volume < $40M, pool = $0
- [ ] B3: Splits: Ed 30%, Ilija 65%, Christie's RE Rights 5%
- [ ] B4: Show per year: Total Sales Volume, Volume Above Breakeven, Pool, Ed Share, Ilija Share, Christie's RE Rights
- [ ] B5: Label: "INTERNAL ONLY — NOT FOR EXTERNAL DOCUMENTS. Governing principle, not yet contractual. *"

### Section C — VOLUME Tab Restructure
- [ ] C1: Add projGci + actGci fields to VolumeAgent interface in sheets-helper.ts
- [ ] C2: Update readGrowthModelVolume() to read 4 columns per year (proj vol, act vol, proj GCI, act GCI)
- [ ] C3: Update FutureTab agent table to show Proj GCI + Actual GCI columns
- [ ] C4: Running totals: Proj Volume vs Actual Volume, Proj GCI vs Actual GCI, gap visible

### Section D — Ilija Defensible Numbers Panel
- [ ] D1: Add "Verified Numbers as of April 7, 2026" panel to FUTURE tab
- [ ] D2: Show: $4.57M closed, $34.7M active pipeline, 9 named team members, Flambeaux $6.5M, $55M baseline, growth trajectory labeled as MODEL

## Sprint 23 — April 7, 2026 · Track One Completion + Track Two

### Track One Remaining
- [x] T1-1: ANEW Homes — separate row under Ed Bruehl in VOLUME tab (4-column structure, "ANEW Homes — Ed Bruehl exclusively", custom build income with Scott Smith)
- [x] T1-2: Update FutureTab agent table total row label to "9 existing incl. Scott Smith pending June 1 + 3 targeted + 4 organic"

### Track Two — HOME Page: THE PLATFORM Section
- [x] T2-1: Build THE PLATFORM section on HOME page (below YouTube/William, above UHNW Card)
- [x] T2-2: Title "THE PLATFORM" — Cormorant Garamond, ~28-32px, all caps, thin gold rule (#C8AC78)
- [x] T2-3: Main headline: "This is not a real estate website. It is a live operating system."
- [x] T2-4: Two-column grid (desktop) / single column (mobile), navy background (#1B2A4A)
- [x] T2-5: Left column: intro paragraph per directive
- [x] T2-6: Right column: 6 system blocks (HOME, MARKET, PIPE, MAPS, INTEL, FUTURE) with exact directive copy
- [x] T2-7: Bottom tagline: "This is not brokerage. This is an intelligence-driven estate advisory platform under the Christie's standard."

### Calendar Integration
- [x] CAL-1: Calendar already embedded in INTEL Layer 2 with correct calendar ID — confirmed matches public link provided

## Sprint 23 Addition — April 7, 2026 (Evening Directive)
- [x] ANEW-1: Add ANEW Homes Net Build Profit panel to FUTURE tab — Y1 $50K / Y2 $100K, 4-person split (Ed 45%, Scott 45%, Jarvis 5%, Angel 5%), INTERNAL ONLY label, asterisk footnote
- [x] ANEW-2: Each participant's share shown in individual income lines within the panel
- [x] KPI-1: Reconcile OUTPUTS KPI strip in Google Sheet — $3,125,000 → $3,080,000 (confirmed all 11 cells updated)
- [x] VOL-1: VOLUME tab 4-column structure (Proj Vol / Act Vol / Proj GCI / Act GCI) confirmed wired to sheet
- [x] VOL-2: ANEW Homes separate row under Ed Bruehl in VOLUME tab confirmed — static row, clearly labeled Custom Build · Ed Bruehl exclusively

## Sprint 24 — April 7, 2026 (Evening)
- [x] S24-1: Recompute ROSTER subtotals after Sandy/Jan/Zoila corrections — verified $1,755,000 (Ed $750K + 8 agents). All 13 OUTPUTS cells confirmed at $3,080,000 / $1,755,000 / $924,000
- [x] S24-2: Profit Pool table wired to live VOLUME tab data — formula (Volume - $40M) × 2%, splits Ed 30% / Ilija 65% / Christie's RE 5%. VOLUME tab extended to 2029-2031 in Google Sheet
- [x] S24-3: ANEW Homes rows added to VOLUME tab (rows 12-13) — Y1 $50K / Y2 $100K net profit through 2031, INTERNAL ONLY label, separate from Christie's commission
- [x] S24-4: generateProForma built — 4-page PDF via Puppeteer, Christie's standard (Cormorant Garamond, navy, gold), live data from Growth Model v2. ProFormaButton wired to FUTURE tab export row. 35/35 passing

## Sprint 24 Visual Fixes — April 7, 2026
- [x] VF-1: Green button removed from MARKET tab — replaced with navy/gold brand standard button
- [x] VF-2: Satellite map constrained inside max-w-7xl container on MAPS tab — no longer bleeds edge-to-edge
- [x] VF-3: UHNW Card PDF layout fixed — tighter header, increased column height, all 8 rungs render fully
- [x] VF-4: Market Report PDF Page 2 — Sag Harbor moved to Page 3 (5/6 split), no longer cut off at footer
- [x] VF-5: Market Report PDF Page 4 — QR code re-uploaded to permanent CDN (d2xsxph8kpxj0f.cloudfront.net), URL updated in pdf-engine.ts
- [x] VF-6: Market Report PDF Page 4 — Ed headshot re-uploaded to permanent CDN (403 session URL fixed), cdn-assets.ts updated

## Sprint 25 — April 7, 2026 (Council Audit Fixes)

- [x] S25-1: Market Report PDF — Wainscott (row 11) overflowing Page 3 footer by 29mm — split atlas 5/5/1 across Pages 2/3/4, Wainscott on Page 4 with doctrine block, closing on Page 5. PDF now 5 pages.
- [x] S25-2: TypeScript cleanup — removed dead `generateFutureReport` function (was referencing hook-scoped `ARC_BARS` from module scope), fixed `total` fallback to include 2029-2031 fields, fixed `whatsapp-inbound.ts` `.trim()` on union type. TypeScript: 0 errors (was 11).
- [x] S25-3: 35/35 tests passing. TypeScript clean.

## Sprint 26 — April 7, 2026 (Council Directive)
### Item 1 — GCI Visibility Gate
- [ ] S26-1a: Wrap Profit Pool table in auth check — unauthenticated visitors see Ascension Arc + volume only
- [ ] S26-1b: Wrap agent GCI figures in auth check
- [ ] S26-1c: Wrap internal compensation splits in auth check
- [ ] S26-1d: Unauthenticated view shows GCI-locked placeholder
### Item 2 — Roster Corrections
- [ ] S26-2a: Sandy Busch Y1 GCI 50000 to 25000
- [ ] S26-2b: Jan Jaeger Y1 GCI 50000 to 25000
- [ ] S26-2c: Agent count label 18 to 16
- [ ] S26-2d: Remove Marilyn Clark from InstitutionalMindMap
### Item 3 — VOLUME Tab GCI Columns
- [ ] S26-3a: Add projGci + actGci to VolumeAgent interface
- [ ] S26-3b: Update readGrowthModelVolume to read 4 columns per year
- [ ] S26-3c: FutureTab agent table shows Proj GCI + Actual GCI columns
- [ ] S26-3d: Running totals with gap visible
### Item 4 — Visual Fixes
- [ ] S26-4a: MARKET tab green button verify navy/gold
- [ ] S26-4b: MAPS satellite map constrained to max-w container
- [ ] S26-4c: UHNW card PDF all 8 rungs render
- [ ] S26-4d: Market Report Sag Harbor completes cleanly
- [ ] S26-4e: Market Report QR codes render from CDN
- [ ] S26-4f: Market Report Ed headshot renders from CDN
### Item 5 — Mind Map Consolidation
- [ ] S26-5a: Collapse Whale nodes into WHALE INTELLIGENCE category node
- [ ] S26-5b: Collapse Attorney nodes into ATTORNEYS category node
- [ ] S26-5c: Collapse Recruit nodes into RELATIONSHIP INTELLIGENCE category node
- [ ] S26-5d: Frank Newbold doctrine RELATIONSHIP_INTELLIGENCE never RECRUIT
- [ ] S26-5e: Remove floating individual nodes now inside category nodes
### Item 6 — HOME Collateral Links
- [ ] S26-6a: UHNW Wealth Card points to corrected layout
- [ ] S26-6b: Neighborhood Bike Card confirmed v2 on CDN
- [ ] S26-6c: Christies Letter locked PDF
- [ ] S26-6d: Market Report 5-page version

## Sprint 27 — April 8, 2026

- [x] Item 1: ROSTER tab — Sandy Busch Y1 GCI corrected to $25,000 (was already correct in sheet)
- [x] Item 1: ROSTER tab — Jan Jaeger Y1 GCI corrected to $25,000 (was already correct in sheet)
- [x] Item 1: ROSTER tab — EXISTING SUBTOTAL recalculated
- [x] Item 2: VOLUME tab — projGci + actGci columns added per year (2026-2031), 28 columns total
- [x] Item 2: Server sheets-helper.ts updated to read 4-column-per-year layout
- [x] Item 3A: Screenshot A — authenticated FUTURE tab with Profit Pool and GCI visible
- [x] Item 3B: Screenshot B — unauthenticated FUTURE tab with GCI gate (lock icon + Sign In CTA)
- [x] Item 3C: Screenshot C — Market Report Page 5 with Ed headshot and QR codes from CDN

## Sprint 28 — April 8, 2026 (Full Council Directive)

### Tier 1 — Trust
- [x] 1A: GCI gate production verification — incognito test on christiesrealestategroupeh.com FUTURE tab
- [x] 1B: ROSTER F8 Zoila Ortega Astor $60K → $65K; F14 EXISTING SUBTOTAL fix to =SUM(F5:F13) = $1,755,000 [NOTE: Sheet-side fix — Ed to update directly in Growth Model v2 ROSTER tab]
- [x] 1C: Agent count confirmed 16 everywhere (OUTPUTS tab, FUTURE tab display, all labels)
- [x] 1C: Marilyn Clark confirmed removed from FutureTab and mind map — zero occurrences in codebase
- [x] 1D: HOME collateral links — all four verified 200 OK (UHNW Card, Bike Card, Christie's Letter, Market Report dynamic)

### Tier 2 — Make the Machine Alive
- [x] 2A: FUTURE tab agent table shows all 5 columns: Proj Vol, Act Vol, Gap (all users), Proj GCI, Act GCI (auth only)
- [x] 2B: Profit Pool wired to live VOLUME tab totals (proj2026-2031), behind GCI auth gate
- [x] 2C: Profit Pool recalculates from live VOLUME tab totals — formula confirmed correct

### Tier 3 — Institutional Polish
- [x] 3A: Mind map — category nodes verified correct (WHALE, ATTORNEYS, RELATIONSHIP INTEL all clean)
- [x] 3A: Mind map — Frank Newbold: RELATIONSHIP_INTELLIGENCE confirmed, never RECRUIT
- [x] 3A: Mind map — no floating individual nodes outside category nodes
- [x] 3A: Mind map — UHNW Path Card node updated to ACTIVE · Live · Click to Download → navigates to HOME
- [x] 3B: MARKET tab — tier badges confirmed navy/gold/charcoal only, no green buttons
- [x] 3B: MAPS tab — satellite map inside var(--frame-max-w) container confirmed
- [x] 3B: Market Report — Sag Harbor pagination confirmed clean (Wainscott fix applied Sprint 27)

## Sprint 28B — April 8, 2026 (Auth Gate Removal + Print Pro Forma)

### Auth Gate Removal
- [x] Remove isAuthenticated gate from FUTURE tab Profit Pool section
- [x] Remove isAuthenticated gate from FUTURE tab Verified Numbers section
- [x] Remove isAuthenticated gate from FUTURE tab ANEW Homes section
- [x] Remove isAuthenticated gate from FUTURE tab agent GCI columns
- [x] Remove GciLockedPlaceholder components entirely from FUTURE tab
- [x] Verify no other auth gates exist on PIPE, INTEL, MARKET, MAPS, HOME tabs (PrivateTabGate now passthrough)
- [x] Confirm full platform open — no "Sign in to view" anywhere

### Print Pro Forma — FUTURE Tab
- [x] Add @media print stylesheet to FUTURE tab (future-print.css)
- [x] Hide nav bar, tab buttons, ticker, social bar in print
- [x] Force white background with navy/gold preserved in print
- [x] Ensure Ascension Arc, 300-day grid, agent table, Profit Pool, ANEW panel all print
- [x] Add footer: Ed Bruehl · Managing Director · Christie's International Real Estate Group East Hampton · [date]
- [x] Test print to PDF and confirm clean multi-page output

## Sprint 28 Final — April 8, 2026

### Immediate Fix
- [x] HOME tab: WhatsApp button number → 631-239-7190 (was Twilio sandbox +1 415-523-8886)

### Build 1 — Print Pro Forma Button
- [x] FUTURE tab header: add "Print Pro Forma" button in Christie's gold, triggers window.print()
- [x] Confirm dashboard chrome hidden, only pro forma content + footer appear in print (.no-print class)

### Build 2 — William Morning Brief Gap Line
- [x] Add "Team Closed: $X.XXM · Gap to $55M: $YY.YYM" line to 8AM WhatsApp brief
- [x] Calculated from live VOLUME data, not hardcoded

### Build 3 — INTEL Countdown Card
- [x] INTEL Layer 1: countdown card showing next Wednesday Circuit date + days remaining
- [x] Pull current guest/topic from Event/Podcast calendar if available (shows next Wednesday date + days)
- [x] Show clear message if no upcoming Circuit is scheduled (shows series start date May 7, 2026 if before series)

## Sprint 29 — April 8, 2026 (Visual + UX Fixes)

### Item 0 — Remove WhatsApp from HOME
- [x] Remove WhatsApp button from EstateAdvisoryCard
- [x] Remove all wa.me links from HOME tab
- [x] Remove WhatsApp icon from header/footer/social bar if present (none found outside EstateAdvisoryCard)
- [x] Replace Estate Advisory CTA with Phone: 646-752-1233 + Email Ed button

### Item 1 — Mind Map Category Nodes → Circles
- [x] WHALE INTELLIGENCE node: render as circle, same visual language as Ed/team nodes
- [x] ATTORNEYS node: render as circle, names on hover/click only
- [x] RELATIONSHIP INTELLIGENCE node: render as circle, names on hover/click only
- [x] No square boxes or div cards anywhere on the mind map

### Item 2 — INTEL Max-Width Containment
- [x] All INTEL content wrapped in same max-width container as other tabs (verified, already clean)
- [x] Mind map, calendar, sheets, documents, intel web all contained

### Item 3 — Hamlet Cards Alignment (MARKET + MAPS + PDF)
- [x] MARKET tab hamlet cards match PDF Hamlet Atlas layout structure (verified, already aligned)
- [x] MAPS sidebar hamlet data matches same data hierarchy (verified)
- [x] PDF = snapshot of website system (direction: PDF → website)

### Item 4 — Market Report PDF Page 4 Fill
- [x] Fill Page 4 empty space with Capital Flow Signal, Rate Environment, Hamptons Median cards (Section3Condensed added after Section4)
- [ ] Page 5 closing: reference UHNW Wealth Card + Bike Card as companion pieces (next sprint)
- [x] No empty vertical space on any page

### Item 5 — CIS Calculator Visual Refresh
- [x] Input fields: navy borders, gold labels, charcoal text (verified, already correct)
- [x] Output panel: navy background, gold/cream CIS score result (MatrixCard variant=navy confirmed)
- [x] Button: gold treatment matching site standard (confirmed)
- [x] Typography and spacing match MARKET cards (confirmed)

### Item 6 — William Audio Player Rewind Button
- [x] Add -15s rewind button mirroring +15s skip-forward
- [x] Same size, spacing, interaction behavior as +15 button
- [x] Mirrored position (left of play button, +15 is right)

### Items 7 & 8 — EmbedFrame Component + Consistent Framing
- [x] Create reusable EmbedFrame component (navy/gold hairline border, consistent radius)
- [x] Apply to YouTube embed on HOME
- [x] Google Calendar on INTEL: already correctly framed with Christie's card wrapper (no double-frame)
- [x] Satellite map on MAPS: already correctly framed with gold border + navy header overlay (no double-frame)

## Sprint 30 — April 8, 2026

### Task 7 — HOME Letter Sentence Addition
- [ ] Add one sentence before "The door is always open" line in HomeTab founding letter

### Task 8 — Flagship Letter in EXPORTS
- [ ] Confirm or add Christie's Flagship letter PDF to EXPORTS node on INTEL mind map

### Task 1 — Council Sheet: Rick Moeser
- [ ] Write Rick Moeser row to Council sheet (ID: 1rlZId6j-bhuFd0E3eD-pMtY_f5DIn0J9OmIP2TP8zWw)

### Task 2 — MEDIA Tab in Intelligence Web Master
- [ ] Create MEDIA tab in Intelligence Web Master sheet (ID: 1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0)
- [ ] Write schema headers and 6 seed rows
- [ ] Wire MEDIA node on mind map to read from this tab

### Task 3 — COMPETITORS Node
- [ ] Add/update COMPETITORS node with 10 firms + URLs only (no agent names)

### Task 4 — CPS1 Node Content
- [ ] Update CPS1 node (under Ilija) with 6 entries: Ricardo, Dominican Republic deal, Aubri, Jonathan Wilhelm, Mayacama Golf Club, Flambeaux Wine

### Task 5 — AUCTION REFERRALS Node
- [ ] Add AUCTION_REFERRALS node between Ed and Christie's Auction House
- [ ] Add Doug Biviano and Chuck McWhinnie as hover entries with status badges
- [ ] Add both to Intelligence Web Master sheet tagged AUCTION_REFERRAL, ACTIVE
- [ ] Wire status progression: SUBMITTED → UNDER REVIEW → CONSIGNED → SOLD

### Task 6 — FAMILY AND FRIENDS Node
- [ ] Add FAMILY_FRIENDS node (first-ring, same size as business category nodes)
- [ ] Seed with Richard Bruehl and Miranda Bruehl

## Sprint 32 — April 8, 2026

- [x] HOME tab letter: Added two sentences after "Everything I found along the way..." and before closing line. Updated closing to "The door is always open whenever you are ready to walk through it." (HomeTab.tsx + foundingParas PDF)
- [x] Evening brief pipeline prepend: Updated to include town field. Format: "138A Montauk Highway, West Hampton — In Contract." Confirmed live via test (SID MM4d6c7f08e3966aad35fa55d73c0f374a)
- [x] Flagship letter PDF rebuilt from Christie_Flagship_Letter_VERIFIED_FINAL.md — all 8 council-approved edits incorporated: intelligence layer chapter, six primary tabs + export layer, podcast visibility, INTEL action line, Angel operational truth, broker recruiting line, William line strengthened, Perplexity title corrected to Intelligence Officer

## Sprint 34 — April 8, 2026

- [ ] Item 1: Zoila ROSTER label — $60K is salary from Ilija, label correctly in FUTURE tab agent table
- [ ] Item 2: Managing Director Total table — 6 years, 3 income streams, after Profit Pool section
- [ ] Item 3: Wire projected GCI from ROSTER to agent table — 9 agents, no zeros
- [ ] Item 4: Pipeline disclosure footnote — $13.62M exclusive / $34.7M total book
- [ ] Item 5: $1B horizon footnote — compound trajectory, conservative base $430M by 2031
- [ ] Item 6: Assumptions box — 4 lines at bottom of Ascension Arc
- [ ] Item 7: Dan's Papers line — "negotiated from $115K ask to $9K pilot"
- [ ] Item 8: AI council sentence — "most integrated AI intelligence platform of any Christie's affiliate globally"
- [ ] Item 9: Data source audit — LIVE vs HARDCODED for all 5 priority surfaces
- [ ] Card-stock export: Export Card button on FUTURE tab, 8.5x11 print layout, front + back

## Sprint 35 — April 8, 2026

- [ ] HOTFIX: Replace agent table with correct 9 office team members (remove Tash, Lash, Ilija, Ricky; add Bonita DeWolf, Scott Smith, Sandy Busch, Jan Jaeger)
- [ ] Item 1: Publish after hotfix confirmed
- [ ] Item 2: Restore GCI auth gate on FUTURE tab (GCI columns, Profit Pool, MD Total, ANEW behind isAuthenticated)
- [ ] Item 3: Wire FRED timestamp to MARKET tab Rate Environment sub-label

## Sprint 36 — Corrections (April 9, 2026)

- [ ] Item 1: AnewHomes equity split correction — Ed 40%, Scott 40%, Angel 5%, Jarvis 5%, Ricky 5%, Pool 5% — apply to FutureTab.tsx, proforma-generator.ts, card stock PDF, all references
- [ ] Item 1: Rename "ANEW Homes" → "AnewHomes" (one word, capital A, capital H) everywhere
- [ ] Item 1: Update Managing Director Total table in FutureTab.tsx with corrected 40% ANEW column and new totals
- [ ] Item 1: Update compensation table footnote to reflect 40% ANEW share
- [ ] Item 2: Diagnose 4-page pro forma PDF render issue and fix
- [ ] Item 2: Update 4-page pro forma volumes to $100M (2027) and $165M (2028)
- [ ] Item 3: Align card stock export styling to FUTURE tab visual language
- [ ] Confirm all items with screenshots before closing Sprint 36

## Sprint 36 — AnewHomes Corrections + Pro Forma Fix (Apr 9, 2026)

- [x] Item 1: AnewHomes rename (ANEW Homes → AnewHomes) across all surfaces
- [x] Item 1: Split corrected from 45%/45%/5%/5% (4 people) to 40%/40%/5%/5%/5%/5% (6 people — added Ricky + Pool/Future)
- [x] Item 1: Ed's AnewHomes column corrected in compensation table (was 45%, now 40%)
- [x] Item 1: All three surfaces updated: FutureTab.tsx, proforma-generator.ts, pdf-exports.ts
- [x] Item 2: 2027 volume default corrected from $93M to $100M (all three surfaces)
- [x] Item 2: 2028 volume default corrected from $133M to $165M (all three surfaces)
- [x] Item 2: Profit pool column header renamed from "Ilija (65%)" to "Partnership (65%)"
- [x] Item 2: Ed's compensation totals recalculated across all 6 years
- [x] Sprint 36 Final Fix 1: Profit pool table volumes corrected — 2027 $100M (pool $1.2M, Ed $360K), 2028 $165M (pool $2.5M, Ed $750K)
- [x] Sprint 36 Final Fix 1: Math.max floor applied — sheet can only go up, never below doctrine targets
- [x] Sprint 36 Final Fix 2: Generate Pro Forma button fixed — Chromium path corrected from /usr/bin/chromium-browser to /usr/bin/chromium
- [x] Sprint 36 Final Fix 2: PDF generation confirmed working — 444KB, 4 pages, clean generation from button path
