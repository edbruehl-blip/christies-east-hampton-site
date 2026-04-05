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
- [ ] Item 6: ElevenLabs voice unification — whatsapp-route.ts → fjnwTZkKtQOJaYzGLa6n
- [x] Item 7: IdeasTab.tsx — deleted permanently (no longer in App.tsx or nav)
- [x] Item 8: Newsletter subscribe button — NewsletterManager removed from IntelTab.tsx (credentials not set)
- [ ] Item 9: PublicPage.tsx — AWAITING ED RULING (route at /public or delete)
- [ ] Item 10: Verify d2xsxph8 CloudFront domain live after publish
