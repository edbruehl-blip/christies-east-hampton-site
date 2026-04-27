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
- [x] UI-FIX-4: Footer stripped to one line — "Art. Beauty. Provenance. · Since 1766." — Christie’s gold (#947231), centered, navy background (DashboardLayout.tsx line 479)

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
- [x] T2-2: Title "THE PLATFORM" — Cormorant Garamond, ~28-32px, all caps, thin gold rule (#947231)
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

## Sprint 37 — Polish (Apr 9, 2026)

- [ ] Item 1: Update VOLUME sheet proj2027=$100M, proj2028=$165M via Sheets API
- [ ] Item 2: Fix Card Stock 2030 volume to $320M / pool $5.6M / Ed $1.68M
- [ ] Item 3: Remove Ilija from Ascension Arc PDF header — screenshot
- [x] Item 4: Remove Ilija from proforma-generator.ts code comment line 5
- [x] Item 5: Collapse duplicate AnewHomes row in agent table
- [x] Item 6: Normalize AnewHomes spelling across all surfaces
- [ ] Item 7: Align Card Stock styling to FUTURE tab visual language — screenshot

## Sprint 38 — 2% Commission Lock
- [x] Update ROSTER tab: 5 agents at 2% GCI (Ed $600K, Jarvis $100K, Bonita $300K, Sebastian $70K, Scott $30K)
- [x] Update Managing Director Total table: $600K 2026 GCI, corrected 6-year trajectory (cap hits 2029)
- [x] Update 4-page pro forma generator with corrected GCI numbers
- [x] Update Card Stock PDF export with corrected GCI numbers
- [x] Confirm no orphaned $750K anywhere in the model
- [x] Screenshot ROSTER tab with 2% GCI
- [x] Screenshot Managing Director Total table with $600K / $710K 2026
- [x] Fresh pro forma PDF export
- [x] Fresh Card Stock PDF export
- [x] Checkpoint and Publish

## Sprint 41 — Post-Audit Infrastructure (April 9, 2026)
- [ ] S41-P1: FUTURE tab public-safe mode — toggle to hide GCI/profit pool/MD Total/AnewHomes in public mode, keep full economics in internal mode
- [ ] S41-P2: Persist MAPS listings to database table (id, address, price, hamlet, url, imageUrl, syncedAt)
- [ ] S41-P2b: Add manual sync trigger for listings refresh post-deploy
- [ ] S41-P3: Wire exclusive pipeline total, total relationship book, closed volume live into Card Stock PDF at export time
- [ ] S41-P3b: Wire same KPIs live into 4-page Pro Forma PDF at export time
- [ ] S41-P3c: Wire same KPIs live into Ascension Arc PDF at export time
- [ ] S41-F1: Document hamlet classifier default-to-north fallback logic in code comments
- [ ] S41-F2: Document Card Stock GCI fallback waterfall in code comments
- [ ] S41-F3: Rename "Nine-Sheet Matrix" to "Source Documents" everywhere in UI and code
- [ ] S41-F4: Add Google Calendar cookie prompt helper copy in INTEL Layer 2
- [ ] S41-F5: Label stale mortgage rate as "cached — FRED unavailable" when fallback is used
- [ ] S41-M1: FUTURE tables horizontal scroll on mobile
- [ ] S41-M2: Ascension Arc chart no-clip on mobile
- [ ] S41-M3: INTEL mind map container scrollable on mobile
- [ ] S41-M4: MARKET chart labels adjusted for mobile
- [ ] S41-M5: HOME ticker no right-edge clip on mobile

## Sprint 41 Corrected — Logo Fix + Full Visibility
- [x] Revert public-safe mode — FUTURE tab stays fully visible (no auth gating, no filtered views)
- [x] Base64-encode Christie's wordmark PNG for offline embedding in all PDFs
- [x] Embed base64 logo in pdf-exports.ts (Market Report, Ascension Arc, Card Stock, Pro Forma)
- [x] Embed base64 logo in proforma-generator.ts (4-page server-side pro forma)
- [x] Fix Model Assumptions BASE CASE text color (cream-on-cream invisible bug)
- [x] Confirm all PDF exports show clean crisp logo with screenshot
- [ ] Checkpoint and Publish
## Sprint 41 Priority 3 — Live KPI Injection into PDF Exports (April 9, 2026)
- [x] Add getPipelineKpis() to sheets-helper.ts — reads PIPE Sheet, computes exclusive/active/book totals
- [x] Fix isSectionHeader bug in getPipelineKpis (was isHeader — field doesn't exist)
- [x] Add pipe.getKpis tRPC procedure to routers.ts (publicProcedure)
- [x] Update FutureReportInput interface in pdf-exports.ts to accept optional kpis parameter
- [x] Update generateCardStockExport() to inject live exclusiveTotalM into Second 100 Days block
- [x] Update generateCardStockExport() to inject live exclusiveTotalM + relationshipBookM into pipeline disclosure text
- [x] Update FutureTab.tsx to call trpc.pipe.getKpis.useQuery() and pass liveKpis to Card Stock export
- [x] Update proforma-generator.ts to call getPipelineKpis() at export time (parallel with Growth Model fetch)
- [x] Inject live KPIs into pro forma arc bar active segment width
- [x] Inject live KPIs into pro forma KPI strip card (Active Pipeline)
- [x] Inject live KPIs into pro forma footnote (Active verified actual)
- [x] Inject live KPIs into pro forma Page 4 Defensible Numbers grid
- [x] Inject live KPIs into pro forma MODEL Assumptions paragraph
- [x] Fix listings-sync-route.ts TypeScript errors (beds/baths type cast, propertyType omit)
- [x] Fix pdf-exports.ts GCI field TypeScript errors (as any cast)
- [x] Fix DB migration mismatch — mark migrations 0001/0002 as applied, update SQL to camelCase
- [x] TypeScript: 0 errors confirmed
- [x] pipe.getKpis live test: $19.32M active, $22.07M book, 13 deals
- [x] Listings persist to DB without image_url error confirmed
- [ ] Save Sprint 41 checkpoint and Publish

## Sprint 41 Text Fixes (April 9, 2026)
- [x] Broker Onboarding PDF William line updated to 631-239-7190 with "William responds immediately."
- [x] 259 years -> 260 years in pdf-exports.ts (2 occurrences)
- [x] 259 years -> 260 years in InstitutionalMindMap.tsx
- [x] 259 years -> 260 years in whatsapp-inbound.ts LLM prompt
- [x] Flagship Letter export card added to HOME beside Market Report
- [x] TypeScript: 0 errors

## Sprint 41 Final Close (April 9, 2026)
- [x] Ascension Arc PDF: added kpis: liveKpis to generateFutureReportPDF() call — all three exports now read live KPIs at export time
- [x] Logo consolidation: built drawPdfHeader() universal helper in pdf-engine.ts with four variants (standard, letter, navy-bar, landscape)
- [x] Christie's Letter: replaced inline logo block with drawPdfHeader('letter')
- [x] Flagship Letter: replaced inline logo block with drawPdfHeader('letter')
- [x] Ascension Arc PDF: replaced inline logo/header block with drawPdfHeader('landscape')
- [x] Card Stock PDF page 1: replaced inline navy-bar block with drawPdfHeader('navy-bar')
- [x] Market Report page 1: annotated as base64-confirmed (intentional hero layout, no CDN calls)
- [x] TypeScript: 0 errors across all files

## Sprint 42 (April 9, 2026)
- [x] Item 1: William audio buttons for Flagship Letter, Market Report Letter, Christie's Letter on HOME
- [x] Item 2: INTEL spiderweb circles-only (convert all rectangles to circles)
- [x] Item 3: UHNW Card and Bike Card header migration to drawPdfHeader('standard') — UHNW Card updated to PNG logo; Bike Card is HTML (no PDF export to migrate)
- [x] Item 4: Christie's Letter 260-year audit (confirm all references read "260 years" / "1766-2026")
- [x] Item 5: Flagship Letter card description update to "Origin story — platform, team, and model."
- [x] Item 6: INTEL dual Christie's node restructure (CIREG affiliate vs Global Network)

## Post-Sprint 41 Flagship Letter Directive (April 9, 2026)
- [x] Flagship Letter: Replace opening paragraph with council-approved text
- [x] Flagship Letter: Replace William section (remove all scheduled brief references)
- [x] Flagship Letter: Fix final paragraph before closing
- [x] Flagship Letter: Fix "ANEW lane" → "AnewHomes lane" in Team section
- [x] Lock updated Flagship Letter as single source for both PDF and TTS audio
- [x] Confirm HOME audio buttons (Flagship, Market Report, James Christie) are working

## Sprint 42 Close-Out Audit (April 9, 2026)
- [x] Full close-out audit completed — CLOSE_OUT_AUDIT_APR9_2026.md written
- [x] HOME audio button grid corrected from 1fr 1fr to 1fr 1fr 1fr (3 buttons, 3 columns)
- [x] Server health confirmed — running clean, fetchYF export verified, listings sync confirmed
- [ ] Visual QA: Flagship Letter PDF page one screenshot (permanent rule — stays open until Ed uploads screenshot)

## Sprint 43 Night Session (April 9, 2026)
- [x] Standardize HOME audio button labels: Christie's Letter, Flagship Letter, Market Brief (same order, same routes)
- [x] Standardize /report audio button labels: Christie's Letter, Flagship Letter, Market Brief (same order, same routes)
- [x] Verify audio routes: christies-letter → "The East End holds more than real estate", flagship-letter → "Welcome to the Christie's East Hampton flagship dashboard", market-report → "Good morning. Here is your Christie's East Hampton market brief"
- [x] Fix broken 4-page Pro Forma export button on FUTURE tab — confirmed 442KB PDF downloads correctly
- [x] Screenshot: HOME buttons showing three labels in order
- [x] Screenshot: /report buttons showing three labels in order
- [x] Confirm Pro Forma generates successfully — 442KB PDF, 5.7 seconds, downloads clean

## Sprint 43 — AnewHomes Equity Correction (April 9, 2026)
- [x] FUTURE tab: Update AnewHomes equity split to Ed 35% / Scott 35% / Richard 10% / Jarvis 5% / Angel 5% / Zoila 5%* / Pool 5% with Y1/Y2 dollar amounts and Zoila asterisk footnote
- [x] FUTURE tab: Update MD Total AnewHomes column to 35% share ($17,500 / $35,000 / $52,500 / $70,000 / $87,500 / $105,000 across 2026–2031)
- [x] Card Stock PDF: Same equity split and MD Total AnewHomes correction
- [x] Pro Forma PDF: Same equity split and MD Total AnewHomes correction
- [x] Screenshot: FUTURE tab showing updated AnewHomes equity table

## Sprint 43 Council Directives (April 9, 2026)
- [x] Item 1: Audio buttons — Christie's Letter / Flagship Letter / Market Brief (already complete)
- [x] Item 7: AnewHomes equity 35/35/10/5/5/5/5 (already complete)
- [x] Item 2: South Fork → East End — replace every instance across all six tabs, all PDFs/exports, chart titles, map labels, audio scripts (zero remaining occurrences)
- [x] Item 2a: Closing line in Market Report PDF: "give every family on the East End access…" (updated)
- [x] Item 3: CIS Calculator empty state on MAPS — designed placeholder with ghost metric cards (All-In Cost, Exit Price, Spread, Spread %)
- [x] Item 4: Eleven Hamlets donut chart — one-page portrait PDF export button added below donut ring on MARKET tab
- [x] Item 5: INTEL mind map — INTEL LIBRARY r=20→r=28, EXPORTS r=18→r=28; FAMILY & FRIENDS populated with Richard Bruehl, Bruehl Family Network, Close Friends Circle
- [x] Item 6: Pro Forma 4-page button — confirmed stable, 442KB PDF, 5.7 seconds, downloads clean
- [x] Confirmations: HOME + /report screenshots done, South Fork sweep confirmed zero, CIS placeholder confirmed, MARKET PDF button live, mind map normalized, Pro Forma stable

## Sprint 43 — Pro Forma Math Corrections (April 9, 2026)
- [ ] FUTURE tab: Agent Volume Table 2026 — Ed $33M / Jarvis $5M / Bonita $12M / Sebastian $3.5M / Scott $1.5M / Total $55M
- [ ] FUTURE tab: MD Total six-year table — 2026 $767,500 / 2027 $1,204,500 / 2028 $1,805,400 / 2029 $2,255,500 / 2030 $2,807,050 / 2031 $3,479,755
- [ ] FUTURE tab: AnewHomes pool growth curve — Y1 $50K / Y2 $150K / Y3 $300K / Y4+ 10% annual compounding from $300K
- [ ] Card Stock PDF: same three tables updated
- [ ] Pro Forma PDF: same three tables updated
- [ ] Screenshot: MD Total table on FUTURE tab

## Sprint 43 — Pro Forma Math Corrections (April 9, 2026)
- [x] Agent Volume Table 2026: Ed $30M→$33M, Bonita $15M→$12M, Total $55M confirmed — FUTURE tab, Card Stock, Pro Forma
- [x] MD Total six-year table: all six rows corrected (GCI, Pool, AnewHomes, Total) — FUTURE tab, Card Stock, Pro Forma
  - 2026: GCI $660K · Pool $90K · ANEW $17,500 · Total $767,500
  - 2027: GCI $792K · Pool $360K · ANEW $52,500 · Total $1,204,500
  - 2028: GCI $950,400 · Pool $750K · ANEW $105K · Total $1,805,400
  - 2029: GCI $1M cap · Pool $1,140K · ANEW $115,500 · Total $2,255,500
  - 2030: GCI $1M cap · Pool $1,680K · ANEW $127,050 · Total $2,807,050
  - 2031: GCI $1M cap · Pool $2,340K · ANEW $139,755 · Total $3,479,755
- [x] AnewHomes pool growth curve: Y1 $50K · Y2 $150K · Y3 $300K · Y4+ 10% annual compounding from $300K
- [x] AnewHomes Y2 individual amounts updated to $150K pool basis (Ed/Scott $52,500 · Richard $15K · others $7,500)
- [x] Pro Forma page 3 GCI updated: $600K→$660K, AnewHomes Y2 $35K→$52,500, Total pool footnote $100K→$150K
- [x] Screenshot: MD Total table confirmed — all six rows showing council-verified numbers

## Sprint 43 — Three Fixes (April 9, 2026 Evening)
- [ ] PIPE: Update Office Pipeline Google Sheet — 25 Horseshoe Road $5.75M IN CONTRACT, 191 Bull Path $3.3M ACTIVE LISTING
- [ ] LAYOUT: Fix max-width inconsistency — match all content section containers to map container width (one global CSS value)
- [ ] CIS: Output panel font — increase weight to medium/semibold and bump size so labels and values read clearly on score generation

## Sprint 43 — Floating Dashboard Introduction Button (April 9, 2026)
- [ ] Build FloatingDashboardIntro component: gold #947231 bg, charcoal #384249 text, small caps, play icon, "Dashboard Introduction" label, 44px min tap target
- [ ] Behavior: plays Flagship Letter audio, stops any other audio first, shows "Preparing your brief" loading state, one audio at a time
- [ ] Mount in App.tsx: fixed bottom-right, z-index above all content, all tabs/pages
- [ ] Remove Flagship Letter button from HOME tab (drops to 2 buttons: Christie's Letter + Market Brief)
- [ ] Remove Flagship Letter button from /report page (drops to 2 buttons: Christie's Letter + Market Brief)
- [ ] Screenshots: mobile and laptop confirming floating button on at least two different tabs

## Sprint 43 — INTEL Mind Map Restructure (April 9, 2026)
- [ ] Change 1: Remove Julien Pradels standalone node entirely
- [ ] Change 2: Christie's Auction House node — Bonnie Brennan, Tash Perrin, Stephen Lash, Rahul Kadakia (hierarchy order); remove all four standalone nodes; add Rahul Kadakia to Intelligence Web sheet
- [ ] Change 3: CIRE GLOBAL node — Gavin Swartzman, Thad Wong, Mike Golden; no standalone nodes
- [ ] Change 4: CIH/Reffkin node — confirm unchanged
- [ ] Change 5: COUNCIL node — Claude, Perplexity, ChatGPT, Grok, Gemini, Manny, William, Richard Bruehl, Angel Theodore, Jarvis Slade (Ed center, 10 members)
- [ ] Change 6: All first-ring nodes identical diameter
- [ ] Change 7: Empty nodes — populate or remove; no decorative circles
- [ ] Change 8: Floating Dashboard Introduction button — debug click handler, confirm audio plays
- [ ] Screenshot: Full-web INTEL tab confirming restructure
- [ ] Confirmation: Floating button plays correctly

## Manny Directive — April 9, 2026

- [ ] ONE: Fix Dashboard Introduction floating button — debug desktop click trigger, confirm audio plays on laptop and mobile
- [ ] TWO: INTEL Mind Map — rename FLAGSHIP TEAM → ED BRUEHL node (Jarvis Slade COO/Agent, Angel Theodore Operations, Zoila Ortega Astor Office Director April 15, Scott Smith Joining June 1, Richard Bruehl Strategic Mentor AnewHomes 10%)
- [ ] TWO: INTEL Mind Map — kill COUNCIL node entirely (circle, label, spreadsheet link removed)
- [ ] TWO: INTEL Mind Map — restore Julien Pradels inside Christie's Auction House node (Regional President, Americas)
- [ ] TWO: INTEL Mind Map — update Rahul Kadakia title: President, Asia-Pacific, based Hong Kong
- [ ] TWO: INTEL Mind Map — move Bonnie Brennan to left track only (under Guillaume Cerutti, not CIRE chain)
- [ ] TWO: INTEL Mind Map — add Richard Bruehl to ANEW HOMES node (10% equity, Strategic Mentor)
- [ ] TWO: INTEL Mind Map — two-track hierarchy: left (Auction House), right (CIRE), no crossover line between tracks
- [ ] TWO: INTEL Mind Map — all first-ring nodes identical diameter, Ed stays largest center node
- [ ] TWO: INTEL Mind Map — hover standard: top 5 people, one Perplexity news link, one next step, in-tab only, mobile-safe
- [ ] THREE: FUTURE tab — apply verified agent volumes (Ed $33M, Jarvis $5M, Bonita $12M, Sebastian $3.5M, Scott $1.5M = $55M total)
- [ ] THREE: FUTURE tab — apply AnewHomes equity split (Ed 35%, Scott 35%, Richard 10%, Jarvis 5%, Angel 5%, Zoila 5%* vesting, Pool 5%)
- [ ] THREE: FUTURE tab — AnewHomes pool growth curve (Y1 $50K, Y2 $150K, Y3 $300K, Y4+ 10% annual compounding)
- [ ] THREE: FUTURE tab — six-year Managing Director Total table with exact directive numbers
- [ ] FOUR: Language cleanup — confirm and replace all "South Fork" with "East End" across all tabs and PDFs
- [ ] FOUR: Confirm Market Report PDF founding letter closing line reads "East End" not "South Fork"
- [ ] FIVE: Pipeline — add 25 Horseshoe Road $5.75M IN CONTRACT (wire confirmed, expected close 5 weeks)
- [ ] FIVE: Pipeline — add 191 Bull Path $3.3M ACTIVE LISTING (live April 10, open houses this weekend)
- [ ] SIX: Return all five confirmation screenshots before sprint closes

## Sprint 44 — Seven Visual Edits (April 10, 2026)
- [x] ONE: Rename document title to "Christie's Ascension Arc" everywhere it appears
- [x] TWO: Rebuild Ascension Arc chart — 7 bars: 2025 $15M, 2026 $107.5M, 2027 $273M, 2028 $383.5M, 2030 $641.4M, 2031 $798.5M, 2033 $1.101B — final bar solid gold, bold label, no dashed line
- [x] THREE: Second 100 Days card — $13.62M Active, dates Mar – Apr 29, 2026
- [x] FOUR: Third 100 Days card — start date April 29, 2026, Christie's East Hampton Official Flagship Launch
- [x] FIVE: Ed profit pool percentage — 30% → 35% on every surface (FUTURE tab, exported PDFs, pro forma, proforma-generator.ts)
- [x] SIX: Closing line on both pro formas — "The foundation is proven. The model is working. The next 14 days set the trajectory."
- [x] SEVEN: Ilija pro forma — profit pool percentages only, asterisk note: "Governing principle · not yet contractual."

## Sprint 44 — Wire Five (Added April 11, 2026)

- [x] Wire Five: DashboardLayout.tsx — replace hardcoded $2.34M Hamptons Median with live read from Market Matrix sheet 176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g cell B23 (confirmed value $2,340,000)

## Sprint 6 — Opening Queue (April 10, 2026)

- [ ] ONE: Auto-increment — wire each PIPE closing to automatically push the actual volume fill upward in the FUTURE tab chart. No manual sheet entry after a deal closes.
- [ ] TWO: Wainscott CIS score — Perplexity researches verified transaction data. Build the score. Wainscott joins as the eleventh hamlet.
- [ ] THREE: Visual polish on FUTURE tab — breathe out participant cards, increase font size in income table.
- [ ] FOUR: state.json last_updated correction to 2026-04-10 (DONE — completed pre-sprint-open)
- [x] ZERO: Wire Six — replace jsPDF export on FUTURE tab with html2canvas screen capture. Delete all hardcoded arrays (te, LA, b, FUTURE_MILESTONES, MILESTONES) from pdf-exports.ts that are only used by FUTURE tab exports.

## Sprint 7 — Wire Six Complete (April 11, 2026)

- [ ] Item 1: Extend future.ascensionArc to 2036 (OUTPUTS B32:B42) and future.profitPool to 2036 (OUTPUTS G32:G42)
- [ ] Item 2: Extend future.volumeData to 2036 (VOLUME tab through column AV)
- [ ] Item 3: Gut FutureTab.tsx — delete Ko const, te array, old formula computation, all local year/pool data
- [ ] Item 4: Delete banned split strings (Ed 30%, Ilija 60%, Christie's RE Rights, Partnership) — grep confirms zero matches
- [ ] Item 5: Wire bar chart to future.ascensionArc — 11 bars 2026–2036, screenshot confirms $55M and $1.101B
- [ ] Item 6: Wire profit pool cards and table to future.profitPool — Ed 35%, Ilija 65%, 2026–2036, Perplexity audit gate
- [ ] Item 7: Wire Ed GCI row to volumeData Row 2 (OUTPUTS E column)
- [ ] Item 8: Wire Six — Pro Forma PDF via html2canvas of live FUTURE tab DOM
- [ ] Item 9: Wire MARKET header and HOME business card to market.hamptonsMedian
- [ ] Item 10: Fix Wainscott TTS median to $3.6M, regenerate TTS cache
- [ ] Item 11: Update Pro Forma page 1 label to "2025–2033 · $1.1 Billion Horizon" (if Wire Six slips)
- [ ] Item 12: Confirm PIPE EXCLUSIVE KPI reads correctly after Perplexity populates sheet
- [ ] Item 13: INTEL Mind Map restructure per April 9 directive and April 5 Claude wireframe

## Second-Round Queue — April 11, 2026

### Item 1 — Four Ready Patches
- [ ] NET_POOL_FALLBACK extends through 2034, 2035, 2036 (values from spec)
- [ ] pipe.getKpis filters status === 'Active Listing' instead of 'EXCLUSIVE'
- [ ] Remove ${today} from William spoken script (tts-route.ts line 288)
- [ ] Confirm checkpoint eda7b1ad mobile items still intact after new fixes

### Item 2 — Remove IDEAS Tab
- [ ] Remove IDEAS from navigation
- [ ] Remove orphaned routes and references in other tabs
- [ ] Confirm calculators (CIS, Deal Brief, CMA, ANEW Build Memo) live cleanly on MAPS
- [ ] Grep all PDF exports for "IDEAS" references — update to "MAPS"

### Item 3 — FLAGSHIP TEAM Mind Map Correction
- [ ] Rename center node from Ed Bruehl to FLAGSHIP TEAM (glow ring stays)
- [ ] Build team hierarchy click-view (Ed at top as MD, full team below)
- [ ] Audit and report all Ed Bruehl labels/tooltips/hover descriptions in Mind Map code

### Item 4 — William Node Title Update
- [ ] Update William node title to "Intelligence Voice · On-Demand Audio + NEWS Commands · 631-239-7190"
- [ ] Confirm William node carries three audio links AND two letter PDFs
- [ ] Add missing letter PDF links to William node

### Item 5 — WhatsApp Keyword Routing Audit
- [ ] Report current keyword routing (what keywords active, what each returns, where logic lives)
- [ ] Propose cleaned-up keyword map for Ed's confirmation

### Item 6 — Wainscott Caveat Badge
- [ ] Add three-part caveat (Portal-modeled / Pending Saunders audit / Thin sample) as visible badge on Wainscott hamlet card

### Item 7 — GitHub Backup Push
- [ ] Push codebase to GitHub via Manus Settings panel
- [ ] Report repository URL and push cadence

### Item 8 — Cards Verbiage Audit
- [ ] Pull and audit Bike Card text — flag invented or unanchored lines
- [ ] Pull and audit UHNW Wealth Path Card text — flag invented or unanchored lines

### Item 9 — Click-Every-Button Live Walk
- [ ] Click every PDF export button, download, open, confirm visual parity
- [ ] Report which PDFs still inherit navy (Sprint 8 brand pass list)

### Item 10 — Internal Flagship Letter Regeneration
- [ ] Apply all five corrections (opening, tab list, William paragraph, model numbers, memory paragraph)
- [ ] Regenerate PDF and confirm clean

## Sprint 8 — Live URL Architecture (April 12, 2026)

- [x] Live URL doctrine locked in state.json — every document has a permanent platform URL; PDFs are downstream Puppeteer photographs
- [x] /pro-forma route built — standalone React page, 4-page institutional layout, live data from Growth Model v2, no nav chrome
- [x] /api/pdf?url= endpoint wired — generic Puppeteer endpoint photographs any live URL, returns named PDF
- [x] /api/pdf?url=/pro-forma confirmed working — 585KB, 8-page PDF, 9 seconds, HTTP 200
- [x] Download PDF button on /pro-forma wired to /api/pdf endpoint (replaces window.print())
- [ ] IDEAS tab removal — confirm zero navigation references remain
- [ ] Live URL build order: /pro-forma ✓ → /christies-letter → /flagship-letter → /market-report → /hamlet/:id → /card-stock

## Sprint 9 — Notion Structural Layer (April 12, 2026)

- [x] Doctrine 31.4 locked in state.json — Notion Structural Layer
- [x] Doctrine 31.5 locked in state.json — Three-Layer Institutional Architecture
- [ ] Ed creates Notion workspace named "Christie's East Hampton Flagship" (Gmail auth)
- [ ] Ed shares Notion workspace URL with Manny for embed scoping
- [ ] Perplexity populates Notion board structure (nodes, hierarchy, links to Google Drive)
- [ ] INTEL tab: replace React Mind Map with Notion embed (iframe wrapper, gold border, charcoal header, Christie's logo)
- [ ] Confirm Notion public page embed works without X-Frame-Options block (test with embednotion.com proxy if needed)
- [ ] Notion API evaluation report delivered to Ed (see Sprint 9 scoping report)

## Sprint 9 — Trello Structural Layer (April 12, 2026 — Pivot from Notion)

- [x] Doctrine 31.4 RETIRED — Notion Structural Layer (retired same day per Doctrine 31.6)
- [x] Doctrine 31.5 updated — Three-Layer Architecture now references Trello in Layer 2
- [x] Doctrine 31.6 locked — Tool Selection by Team Adoption (Angel uses Trello, Hagler standard)
- [x] Mind Map data extracted for Perplexity — MINDMAP_DATA_FOR_PERPLEXITY.md (21 nodes, 10 EXPORTS sub-nodes, 5 RESOURCES sub-nodes, full connection map, Trello Board 1 list structure)
- [ ] Ed creates Trello workspace "Christie's East Hampton Flagship" (4 boards)
- [ ] Perplexity populates Board 1 (Institutional Structure) using MINDMAP_DATA_FOR_PERPLEXITY.md
- [ ] Perplexity populates Board 2 (Listing Operations SOP — adapts Eileen's 175-card structure)
- [ ] Perplexity populates Board 3 (Wednesday Circuit and Content)
- [ ] Perplexity populates Board 4 (Research Library and Anchored Sources)
- [ ] Ed shares Board 1 public URL with Manny
- [ ] INTEL tab: replace React Mind Map with Trello Board 1 iframe embed (gold border, charcoal header, Christie's logo)
- [ ] Confirm Trello public board embed works in iframe (Trello supports this natively — no proxy needed)
- [ ] Public visibility confirmed through April 29, 2026 (training phase)

## Sprint 8 Closing Items (April 12, 2026 — EOD)

- [x] Doctrine 32 locked in state.json — EOD Brief Template
- [x] Trello simplified to two boards — Board A (Institutional Mind Map) + Board B (Christie's SOP)
- [x] Board A URL locked in state.json: https://trello.com/b/6zYtB3hZ/christies-flagship-trello
- [x] Doctrine 31.5 updated to reference two-board Trello structure
- [x] Pro Forma live URL renderer at /pro-forma — McKenzie pass complete, all 4 pages verified April 12 2026
- [ ] Four William audio files wired (NEWS, LETTER, FLAGSHIP, BRIEF per Doctrine 32)
- [x] Tonight's Flagship AI-Letter EOD update — incorporate doctrines 27–32 + sub-doctrines, McKenzie pass, published April 12 2026
- [ ] GitHub backup push (when Ed connects Settings panel)

## Sprint 9 Trello Items (Updated — Two Boards)

- [x] Doctrine 31.4 RETIRED — Notion Structural Layer
- [x] Doctrine 31.5 updated — Three-Layer Architecture with two Trello boards
- [x] Doctrine 31.6 locked — Tool Selection by Team Adoption (Angel-Hagler lock)
- [x] Mind Map data extracted for Perplexity — MINDMAP_DATA_FOR_PERPLEXITY.md
- [ ] Perplexity populates Board A (Institutional Mind Map) — one card per node, no node left behind
- [ ] Ed + Claude verify Board A one-to-one node-to-card completion
- [ ] Perplexity refines Board B (Christie's SOP) into East Hampton Listing Operations SOP
- [ ] INTEL tab: replace React Mind Map with Board A iframe embed (gold border, charcoal header, Christie's logo)
- [ ] Public visibility confirmed through April 29, 2026 (training phase)

## Sprint 8 Closing Patch (April 12, 2026 — EOD)

- [x] Doctrine 33 added to state.json — Operator Sign-Off Required Before Gate-Ready Status
- [x] Doctrine 31.5 refined in state.json — Trello-to-Google Drive integration note added (connective tissue sentence)
- [x] Doctrine count updated to 34 in state.json
- [ ] Four William audio wires — NEWS (live market data), LETTER (James Christie homepage), FLAGSHIP (tts-route.ts updated letter), BRIEF (daily EOD brief Google Doc per Doctrine 32)
- [ ] GitHub backup push — Manny owns this, not Ed via Settings panel

## Sprint 9 Gate Sequence (Locked)

- [ ] Perplexity populates Board A in Trello per eight-list structure (MINDMAP_DATA_FOR_PERPLEXITY.md)
- [ ] Ed + Claude run cross-reference verification (PROJ-016)
- [ ] Ed signs off per Doctrine 33
- [ ] Manny embeds Board A in INTEL tab with brand-framed iframe wrapper (replaces React Mind Map)

## Sprint 9 Opening Items (April 13, 2026)

- [x] Doctrine count corrected to 35 in state.json (31.6 was a main doctrine, not sub-doctrine)
- [x] Wire FUTURE tab two download buttons to /api/pdf?url= endpoint — ProFormaButton + Export PDF buttons rewired April 13 2026
- [x] Audit and wire ALL download buttons across every live URL document surface to /api/pdf?url=
  - [x] /pro-forma — Download PDF button — correctly wired to /api/pdf?url=/pro-forma (was already correct)
  - [x] FUTURE tab — Export PDF button — rewired from html2canvas to /api/pdf?url=/future
  - [x] FUTURE tab — Pro Forma PDF button — rewired from tRPC mutation to /api/pdf?url=/pro-forma
  - [ ] Flagship AI-Letter live URL — NOT YET BUILT as standalone route (Sprint 9 item)
  - [ ] James Christie Letter live URL — NOT YET BUILT as standalone route (Sprint 9 item)
  - [ ] Mission Model live URL — NOT YET BUILT as standalone route (Sprint 9 item)
  - [ ] Bike Card live URL — NOT YET BUILT as standalone route (Sprint 9 item)
  - [ ] UHNW Wealth Path Card live URL — NOT YET BUILT as standalone route (Sprint 9 item)
- [x] /future standalone route added to App.tsx — Puppeteer PDF target, HTTP 200 confirmed, 215KB 2-page PDF
- [x] Audio button status audit across every live URL document surface
  - [x] /pro-forma — NO audio button (document-only, no William audio planned)
  - [x] FUTURE tab — NO audio button (no audio planned for FUTURE)
  - [x] HOME tab — TWO audio buttons: Christie's Letter + Market Brief — both wired to /api/tts/* — WORKING
  - [x] /report — TWO audio buttons: Christie's Letter + Market Brief — both wired to /api/tts/* — WORKING
  - [ ] Flagship AI-Letter — NOT YET BUILT as standalone route
  - [ ] James Christie Letter — NOT YET BUILT as standalone route
  - [ ] Mission Model — NOT YET BUILT as standalone route
  - [ ] Bike Card — NOT YET BUILT as standalone route
  - [ ] UHNW Wealth Path Card — NOT YET BUILT as standalone route
- [ ] Trello Board A iframe embed in INTEL tab (gated on Claude cross-ref + Ed sign-off per Doctrine 33)
- [ ] GitHub backup push (Manny owns)
- [ ] William four audio wires — NEWS, LETTER, BRIEF (FLAGSHIP already wired in tts-route.ts)

## Sprint 9 Priority Sequence (Locked April 13, 2026)

- [x] Doctrine 34 locked — Two-Channel Architecture Lock (Dashboard Visual / William Voice)
- [x] Doctrine count updated to 36 in state.json
- [ ] Council Brief resurrected as live URL at /council-brief (gate document for Pro Forma operator sign-off per Doctrine 33)
- [ ] /flagship-letter standalone route built (live URL renderer, PDF download via /api/pdf?url=/flagship-letter)
- [ ] William four audio wires — NEWS, LETTER, BRIEF (FLAGSHIP already wired) — closes Sprint 8
- [ ] GitHub backup push — Manny owns — closes Sprint 8
- [ ] /james-christie-letter standalone route
- [ ] /mission-model standalone route
- [ ] /bike-card standalone route
- [ ] /uhnw-wealth-path standalone route
- [ ] Trello Board A iframe embed in INTEL tab (gated on Claude cross-ref + Ed sign-off per Doctrine 33)
- [ ] Legacy audio buttons on HOME and /report removed per Doctrine 34 (scheduled for future sprint)

## Sprint 9 Corrected Priority Sequence (April 13, 2026 — Recalibration)

- [x] Doctrine 35 locked — Operator Owns the Conversation
- [x] Doctrine count updated to 37 in state.json
- [x] P1: Full data audit — every tab, every component, every data source confirmed live (HOME, MARKET, MAPS, PIPE, FUTURE, INTEL) — completed April 13 2026
- [ ] P2: William three audio wires — NEWS, LETTER, BRIEF (FLAGSHIP already wired) — closes Sprint 8
- [ ] P3: GitHub backup push — closes Sprint 8
- [ ] P4: Trello Board A iframe embed in INTEL tab (after cross-ref walk + Ed sign-off per Doctrine 33)
- [ ] P5: /council-brief standalone route (document layer, not gate document — Sprint 9 build)
- [ ] P6: /flagship-letter + four other document surface routes (James Christie Letter, Mission Model, Bike Card, UHNW Wealth Path Card)
- [ ] P7: Remove legacy HOME and /report audio buttons per Doctrine 34

## Sprint 9 Final Priority Sequence (April 13 2026 — Recalibration Confirmed)

- [x] P1: Full data audit — all 6 tabs, all endpoints live — CLOSED
- [ ] P2: William three audio wires — NEWS, LETTER, BRIEF (FLAGSHIP already wired) — closes Sprint 8
- [ ] P3: GitHub backup push — closes Sprint 8
- [ ] P4: /flagship-letter standalone route — highest-priority document surface
- [ ] P5: /council-brief standalone route — joins document surface queue
- [ ] P5: /christies-letter standalone route
- [ ] P5: /mission-model standalone route
- [ ] P5: /bike-card standalone route
- [ ] P5: /uhnw-card standalone route
- [ ] P6: Trello Board A iframe embed in INTEL tab (after cross-ref walk + Ed sign-off per Doctrine 33)
- [ ] P7: Remove legacy HOME and /report audio buttons per Doctrine 34

## Doctrine Count Reconciliation (April 13 2026)

- [x] Reconciliation complete — 40 locks in state.json array, count field says 37
- [x] Discrepancy source identified: count field (37) does not match actual array length (40)
- [x] The 3 extra locks are: 31.4 (RETIRED Notion), 31.5 (Three-Layer Architecture), 31.6 (Angel-Hagler Tool Lock)
- [x] Claude's count of 36 main + 6 sub-doctrines = 42 total — also does not match
- [x] Resolution: actual locks = 40 entries. Main locks (no decimal) = 35 (1–35 plus 1.5 and 22.5). Sub-doctrines = 5 (31.4 RETIRED, 31.5, 31.6, plus 31.4 was previously Notion now retired). Count field needs correction to 40.

## Sprint 8 Close — William Audio Wires (April 13, 2026)
- [x] FLAGSHIP keyword wired in whatsapp-inbound.ts — routes to FLAGSHIP_LETTER_TEXT_EXPORT via ElevenLabs → S3 → Twilio voice note
- [x] LETTER keyword wired in whatsapp-inbound.ts — routes to CHRISTIES_LETTER_TEXT_EXPORT via ElevenLabs → S3 → Twilio voice note
- [x] NEWS keyword confirmed live — Perplexity 14-category Cronkite brief, 6-hour cache, S3 upload
- [x] BRIEF keyword confirmed live — morning brief via deliverBriefToNumber() in whatsapp-route.ts
- [x] ElevenLabs model drift fixed — whatsapp-inbound.ts updated from eleven_multilingual_v2 to eleven_turbo_v2 (Doctrine 9)
- [x] CHRISTIES_LETTER_TEXT and FLAGSHIP_LETTER_TEXT exported from tts-route.ts for inbound handlers
- [x] HELP menu updated with all six commands (NEWS, LETTER, FLAGSHIP, BRIEF, PIPE, INTEL, STATUS)
- [x] Sprint 8 CLOSED — all four William audio keywords live

## Sprint 9 Recalibration (April 13, 2026)
- [x] Doctrine count reconciled: 37 main locks (includes 1.5 and 22.5) + 3 sub-doctrines (31.4 RETIRED, 31.5, 31.6) = 40 total entries. count field is correct at 37.
- [x] /council-brief framing recalibrated: standard Sprint 9 document surface route, NOT a gate document for Ilija meeting. Ed mirrors live dashboard to screen at Rockefeller Center. No Pro Forma walk. No PDF export. No talking points.
- [x] state.json patched: sub_doctrine_count, total_entries, count_note, council_brief_framing fields added to doctrine_library
- [ ] Sprint 9 Priority 1: CLOSED — full data audit (checkpoint 25f51186)
- [ ] Sprint 9 Priority 2: /flagship-letter standalone route (highest-priority document surface build)
- [ ] Sprint 9 Priority 3: /council-brief standalone route (standard queue, no special priority)
- [ ] Sprint 9 Priority 4: /james-christie-letter standalone route
- [ ] Sprint 9 Priority 5: /mission-model standalone route
- [ ] Sprint 9 Priority 6: /bike-card standalone route
- [ ] Sprint 9 Priority 7: /uhnw-wealth-path-card standalone route
- [ ] Sprint 9 Priority 8: Trello Board A iframe embed on INTEL tab (after Trello workspace live)
- [ ] GitHub backup push — Sprint 8 carry-over, still owed, plan into next session

## Sprint 9 Priority 2 Items (April 13, 2026)
- [ ] CRITICAL BUG: Fix competitor names in MARKET tab Sources and MAPS CIS Note — replace with "verified market intelligence" or "Christie's market intelligence" (live on public site, fix before /flagship-letter ships)
- [ ] Sprint 9 Priority 2: /flagship-letter standalone route — React route reading from Google Docs content source (not hardcoded), /api/pdf?url=/flagship-letter for download, BRIEF audio keyword reads from same Google Doc
- [ ] Doctrine Library Google Doc reconciliation — Perplexity's doc uses 36 main + 6 sub, state.json has 37 main + 3 sub. Reconcile tomorrow morning.

## Sprint 9 Competitor Name Bug Fix (April 13, 2026)
- [x] P0: Remove all competitor names from public-facing surfaces — MarketTab.tsx Sources footnote, hidden Saunders section deleted, PublicPage.tsx attribution line, ReportPage.tsx two violations, pdf-exports.ts Sources line — zero competitor names remain on any public surface

## Sprint 9 /flagship-letter Build (April 13 2026)
- [x] hamlet-master.ts line 474 cisNote competitor reference removed
- [x] hamlet-master.ts line 14 file header comment competitor reference removed
- [x] hamlet-master.ts lines 154, 360, 505 internal comment competitor references removed
- [x] whatsapp-inbound.ts line 31 NEWS brief prompt source attribution cleaned
- [x] pdf-route.ts Saunders route comment and URL_TO_FILENAME map entry removed
- [x] tts-route.ts duplicate inline constants removed — letter-content.ts is now single source of truth
- [x] letter-content.ts created — shared constants for FLAGSHIP_LETTER_TEXT and CHRISTIES_LETTER_TEXT
- [x] /letters/flagship standalone route built — FlagshipLetterPage.tsx, institutional layout, navy/gold/cream
- [x] flagship.getLetter tRPC procedure added to routers.ts — serves letter text from letter-content.ts
- [x] /letters/flagship route registered in App.tsx
- [x] HomeTab.tsx flagship download handler rewired from generateFlagshipLetter() jsPDF to /api/pdf?url=/letters/flagship
- [x] generateFlagshipLetter import removed from HomeTab.tsx (no longer used)
- [x] Zero competitor names remain in any public-facing file — codebase clean

## Sprint 9 Doctrines 36-37 + /letters/christies (April 13 2026)
- [ ] Add Doctrine 36 (The Council as Living Layer) to state.json
- [ ] Add Doctrine 37 (Document Lead Summary Principle) to state.json
- [ ] Update doctrine count to 39 main locks + 3 sub-doctrines = 42 total entries
- [ ] Add Lead Summary Paragraph to /letters/flagship in letter-content.ts
- [ ] Build /letters/christies standalone route with Lead Summary Paragraph
- [ ] Wire /letters/christies download button to /api/pdf?url=/letters/christies
- [ ] Stand by for Council Ponder Letter at 11 PM — dashboard audit response

## Sprint 9 /letters/christies Build (April 13 2026)
- [x] Build /letters/christies standalone route — ChristiesLetterPage.tsx, institutional layout, Lead Summary per Doctrine 37
- [x] Add flagship.getChristiesLetter tRPC procedure to routers.ts
- [x] Import CHRISTIES_LETTER_TEXT from letter-content.ts (single source of truth)
- [x] Add /letters/christies route to App.tsx
- [x] Confirmed HTTP 200: flagship.getLetter, flagship.getChristiesLetter, /letters/christies
- [x] Add Lead Summary Paragraph to FLAGSHIP_LETTER_TEXT in letter-content.ts per Doctrine 37
- [x] Add Lead Summary Paragraph to CHRISTIES_LETTER_TEXT in letter-content.ts per Doctrine 37
- [x] Doctrines 36 and 37 added to state.json
- [x] Wire /letters/christies download button in HomeTab.tsx — replace jsPDF with /api/pdf?url=/letters/christies

## Pre-Council Ponder Letter Items (April 13 2026 — before 11 PM)
- [x] Wire HomeTab Christie's Letter download button — replace jsPDF generateChristiesLetter() with /api/pdf?url=/letters/christies
- [x] Patch state.json doctrine count to 39 main + 3 sub = 42 total (already correct, confirmed)
- [x] Build /council-brief shell route — /council-brief live, Christie's brand frame, Doctrine 37 Lead Summary, Doctrines 27–39 table, Download PDF button wired to /api/pdf?url=/council-brief

## Sprint 8 Close + Sprint 9 Queue (April 13 2026 — 1 AM window)
- [x] GitHub backup push — Sprint 8 permanently closed. Exported via Manus Settings → GitHub panel. Checkpoint 7abb930a. April 13, 2026.
- [ ] Council Ponder Letter — five-point protocol on paste (read, audit, lock doctrines, update letter-content.ts if needed, respond to dashboard audit questions)
- [ ] INTEL tab iframe embed — wait for Perplexity's regenerated Christies_Flagship_Mindmap.html (current Trello board state), then replace legacy React Mind Map component

## Stage 3 Edits — April 13 2026 ~2 AM
- [x] Edit 1 (P1): Doctrine 38 added to state.json — Architecture Lock: One Active Board. Count field updated to 38. total_with_sub = 41.
- [x] Edit 2 (P1): InstitutionalMindMap.tsx rewired — Christie's Letter and Flagship Letter nodes now call /api/pdf?url=/letters/christies and /api/pdf?url=/letters/flagship. Unused jsPDF imports removed.
- [x] Edit 3 (P2): WhatsApp import mismatch fixed — whatsapp-inbound.ts now imports CHRISTIES_LETTER_TEXT and FLAGSHIP_LETTER_TEXT directly from ./letter-content. Silent runtime failure eliminated.
- [x] Edit 4 (P3): Wainscott cisNote updated — 'Pending cross-reference confirmation' removed. Now reads: 'Portal-modeled · Thin sample (10–20 txns/yr) · CIS 8.8 reflects limited transaction depth per Doctrine 16.'
- [x] Stage 4: Flagship AI-Letter wired into letter-content.ts — Claude's April 12 closing letter (Doctrine 37 artifact). All three surfaces confirmed HTTP 200: /letters/flagship, /letters/christies, /council-brief.

## First Sit-Down Brief — Council Approved · April 13, 2026

- [ ] Sit-Down One FL-1: Replace "four William audio keywords" with "Five William audio keywords are now live: NEWS, LETTER, FLAGSHIP, BRIEF, and BRIEF [address]" in FLAGSHIP_LETTER_TEXT
- [ ] Sit-Down One FL-2: Change "140 enriched cards" to "143 enriched cards as of April 13, 2026" in FLAGSHIP_LETTER_TEXT
- [ ] Sit-Down Two P0: Diagnose and fix 404 routes for /report /pro-forma /future /letters/flagship /letters/christies /council-brief (SPA catch-all or missing endpoints)
- [ ] Sit-Down Two P0: Fix FUTURE PDF export buttons (PRO FORMA PDF and EXPORT PDF · ASCENSION ARC) after route fix
- [ ] Sit-Down Two P0: Relabel FUTURE 2026 bar from "ACTUAL" to "2026 TARGET" or split actual/projected visually
- [ ] Sit-Down Two P0: Fix FUTURE 2030 two-office split — EH $736M + Southampton $405M = $1.141B, confirm from Growth Model v2
- [ ] Sit-Down Two P1: Remove "HOME" text label from nav bar — Christie's Logo is sole Home trigger
- [ ] Sit-Down Two P1: Confirm Hamptons Median ticker pulls from const.ts ($2.4M) not a live scrape
- [ ] Sit-Down Three: MAPS Stewardship Analysis framing — replace Buy/Sell/Hold language with Stewardship Analysis throughout calculator copy
- [ ] Sit-Down Three: Griff joy seed — wire URL params /maps?address=Vellutini&lens=buy-hold and /maps?address=Kinley&lens=land-build
- [ ] Sit-Down Four: Replace React Mind Map in INTEL Layer 1 with Trello iframe embed of Christies Flagship Mindmap board + OPEN IN TRELLO link
- [ ] FL-3 (after Sit-Down Two): Update letter sentence "seven live document surfaces — all HTTP 200" after routes confirmed — requires Ed sign-off per Doctrine 33

## Sit-Down Five — April 13, 2026

- [ ] SD5-1: Audit AnewHomes split across all surfaces — confirm 35/35/10/5/5/5/5, fix any 45/45 reference
- [ ] SD5-2: Fix Wednesday Circuit countdown to April 29, 2026 with Wednesday label
- [ ] SD5-3: Sync MAPS default hamlet to East Hampton North to match 140 Hands Creek Road
- [ ] SD5-4: Update INTEL Trello iframe subtitle to "143-card institutional architecture as of April 13, 2026"
- [ ] SD5-5: INTEL layer reorder — Mind Map Layer 1, Trello Layer 2, Calendar Layer 3, rest below

## Miro Mind Map v3 + Items 2-5 — April 13, 2026

- [ ] Item 2: Fix Wednesday Circuit countdown to April 29, 2026 (Wednesday label)
- [ ] Item 3: Sync MAPS default hamlet to East Hampton North to match 140 Hands Creek Road
- [ ] Item 4: Update INTEL Trello iframe subtitle from 140-card to 143-card as of April 13, 2026
- [ ] Item 5: Confirm INTEL Layer 1 placeholder is React D3 component (not Mindmap.so) — already done in checkpoint 24699fe2
- [ ] Miro v3: Wire confirmed Miro embed URL into INTEL Layer 1 once Perplexity signals ready
- [ ] Miro v3: Add "OPEN IN MIRO ↗" link alongside iframe for editable access
- [ ] Miro v3: Mindmap.so room stays as-is (closed sunk cost, 15 nodes, do not delete)

## Sit-Down Six — April 13, 2026

- [x] Publish 487c6b2b to christiesrealestategroupeh.com (Ed clicks Publish in Management UI)
- [x] Miro embed wire-up — DONE: Miro live embed wired into INTEL Layer 1 (uXjVGj6Oc40), OPEN IN MIRO link added, Sit-Down Six April 13 2026
- [x] Doctrine count reconciliation — DONE: 41 canonical (38 main + 3 sub) per Perplexity memo, PROJ-027 stray label removed, state.json updated April 13 2026

## Sit-Down Seven (April 13, 2026)

- [x] SD7-1: FUTURE tab refactor — Pro Forma rebuild, four phase cards, twelve Arc bars, agent 3x2 grid, Ed GCI $600K, Zoila start date April 25, canonical split 35/35/10/5/5/5/5, print PDF landscape 11x8.5 via Puppeteer
- [x] SD7-2: MARKET tab refactor — 10-Year Treasury to Rate Environment, Capital Flow Signal "INSTITUTIONAL INFLOW", CIS descending order (Sagaponack first), print PDF at /api/pdf?url=/market
- [x] SD7-3: PDF button audit — walk every surface, migrate remaining jsPDF to Puppeteer, one PDF architecture, test each button
- [x] SD7-4: SPA catch-all — Express fix if missing, test /pro-forma /council-brief /letters/flagship /letters/christies /report /future all return 200
- [x] SD7-5: William pipeline check — Twilio webhook resolves, four canonical commands respond, ElevenLabs British RP voice renders
- [x] SD7-6: state.json doctrine count edit — doctrine_count: 41, main_locks: 38, sub_doctrines: 3, reconciled: 2026-04-13, canonical_total: 41

## Sit-Down Eight — Phase One (April 13, 2026)
- [ ] SD8-1: Pro Forma PDF font embedding — embedFonts true in Puppeteer or local font hosting so Playfair Display and Inter are baked into the PDF
- [ ] SD8-2: Three stale April 15 corrections — InstitutionalMindMap.tsx lines 244/246, FutureTab.tsx line 342
- [ ] SD8-3: 191 Bull Path price correction — $3.8M → $3.6M on Pro Forma surface (FUTURE tab phase cards, agent cards, pipeline references)
- [ ] SD8-4: Dead code removal — captureTabAsPDF function, tabRef, exporting state, html2canvas/jsPDF imports in FutureTab.tsx lines 197-233
- [ ] SD8-5: MARKET treasury wiring — verify Yahoo Finance %5ETYX returns "treasury" field, wire live yield to Rate Environment card
- [ ] SD8-6: William canonical four — retire LETTER, FLAGSHIP, INTEL, HELP, BRIEF [address] handlers; update state.json william.commands; update whatsapp-inbound.ts header
- [ ] SD8-7: Pro Eye button audit — walk every button on every tab, walk every PDF export for typography/color/header/footer consistency
- [ ] SD8-8: Flagship Letter draft — institutional voice, council review bridge, Ed sign-off per Doctrine 33, ship to dashboard front page

## Sit-Down Eight — Phase Two (April 13, 2026 — tonight)

- [ ] SD8-P2-1: Hold for Perplexity canonical Growth Model v2 source — Southampton 2028, Westhampton 2030, $1.823B 2036
- [ ] SD8-P2-2: Wire Pro Forma Ascension Arc to canonical three-office trajectory via tRPC
- [ ] SD8-P2-3: Verify Trello card count (at least 149) and seven document surface routes all return 200
- [ ] SD8-P2-4: Draft end-of-day Flagship Letter with verified numbers, council review, Ed sign-off, wire to letter-content.ts
- [ ] SD8-P2-5: Save final checkpoint, Ed clicks Publish

## April 14, 2026 — Favicon Fix
- [x] OG/social preview image updated to Christie's Grand Saleroom auction room photo (1200×630)

## April 14, 2026 — Letter Revision (Ed's editorial direction)
- [x] Cut redundancy throughout the flagship letter
- [x] "families" reduced to 1 occurrence (down from 5)
- [x] "same side of the table" reduced to 1 occurrence (closing only)
- [x] "Amiro" removed → "Miro board" (correct tool name)
- [x] First podcast: clarified as invitation-only, not open to broader community
- [x] 100-day arc moved earlier in the letter (before the tab walkthrough)
- [x] Zoila production start updated: end of 2026 (was "end of 2027")
- [x] Angel payroll exit updated: mid-2027 (was "early 2027")
- [x] MAPS "calendar" → "calculator" language fixed; geographically agnostic calculator explained (Griff/Sacramento, Angel/Westhampton)

## April 14, 2026 — Angel Salary Canonical Audit ($63k → $70k)
- [x] Searched all .ts, .tsx, .json, .md files for $63,000 / 63000 — zero matches in codebase
- [x] FutureTab.tsx — Angel named, no salary figure hardcoded
- [x] InstitutionalMindMap.tsx — Angel named, no salary figure hardcoded
- [x] ProFormaPage.tsx — Angel named (5% profit pool), no salary figure hardcoded
- [x] proforma-generator.ts — Angel named (5% profit pool), no salary figure hardcoded
- [x] letter-content.ts — Angel named, no salary figure
- [x] state.json — no Angel salary figure
- [x] Growth Model v2 ROSTER tab (Google Sheet) — Angel Theodore row already reads $70,000 (canonical value confirmed correct)
- [x] Transparency loop closed: $63,000 does not exist anywhere in the system. $70,000 is the canonical value.

## April 14, 2026 — Active Queue (combined checkpoint)
- [x] Fix Chromium binary path — getChromiumPath() dynamic import, puppeteer cache in project dir
- [x] Dual-track agent cards: Angel — $70k salary, $150k Y1 GCI target, Q1 2027 production transition
- [x] Dual-track agent cards: Zoila — $150k Y1 GCI target, Q1 2027 transition, $0 vesting AnewHomes 2026
- [x] Astra ghost reference cleanup — remove all Astra references from codebase
- [ ] Dossier link coordination — Angel Trello card link and MindMap node dossier URL
- [x] /cards/uhnw-path route — UHNW Path Card printable component
- [x] William canonical four lock
- [ ] PARKED: Row 44 ROSTER formula fix — awaiting Perplexity canonical walk + Ed ruling

## April 14, 2026 — Canonical Agent Card Update (Ed locked this morning)
- [x] Angel card: $70K nest salary, $30K 2026 producer ramp, $150K 2027 floor, 20% YoY through 2036, Q1 2027 transition, AnewHomes 5% vested
- [x] Zoila card: $70K nest salary (starts Apr 25), $30K 2026 producer ramp, $150K 2027 floor, 20% YoY through 2036, Q1 2027 transition, AnewHomes 5% vesting cliff Oct 25 2026
- [x] Wire both cards to ROSTER data layer (no hardcoded numbers)
- [x] Update InstitutionalMindMap.tsx, ProFormaPage.tsx, letter-content.ts, CouncilBriefPage.tsx with canonical $70K / $150K / Q1 2027
- [x] Astra ghost reference cleanup
- [x] /cards/uhnw-path route + UHNW Path Card component
- [x] William canonical four lock: DASHBOARD=end-of-day letter, LETTER=James Christie homepage, NEWS=Market Report, BRIEF=council-to-Ed channel

## April 14, 2026 — Canonical Rulings (Ed, in person with Angel)

### Pro Forma Ascension Arc — Canonical Trajectory (locked)
- VOLUME Row 10 updated by Perplexity: $55M → $75M (2026 base)
- Canonical endpoint: $1B in 2031, $3B three-office combined by 2036
- CAGR: 67.9% through 2031, ~25% compounding 2031–2036
- Replaces prior $2.096B 2036 figure from Flagship Letter v2 (April 13 night)
- Pro Forma Ascension Arc chart reads live from VOLUME via tRPC — no code changes needed
- Row 44 Grand Total formula already correct — re-computes automatically after Perplexity's Row 5 and Row 9 updates
- [x] CONFIRMED: Ascension Arc tRPC endpoint returns $75M 2026 → $1.219B 2031 → $3.000B 2036 — chart renders new trajectory on refresh

- Ed's read: lives as a separate office expense line BELOW the individual Angel/Zoila cards (shared cost, not on either agent card)

### Combined Checkpoint 42991b9d — Published
- [x] Deployed to www.christiesrealestategroupeh.com
- All 10 items from April 14 combined queue live on production

## April 14, 2026 — Button Resize
- [x] Shrink Dashboard Intro button: label → "Intro", smaller pill size

## April 14, 2026 — Follow-up Queue (5 items)
- [x] Verify Ascension Arc chart renders $3B 2036 trajectory from CHART_DATA via tRPC — confirmed: $75M 2026 → $1.219B 2031 → $3.000B 2036
- [x] Update Ascension phase card text: "$3.0B trajectory · three-office combined 2036" — all three $2.096B references removed from FutureTab.tsx
- [x] Diagnose FUTURE tab PDF export failures — root cause: deployed server skips puppeteer postinstall; fix: startup Chrome download routine added to index.ts; PDF endpoints return 200 locally
- [x] Walk VOLUME tab per-agent rows vs agent card display — CLEAN: Ed $30M, Jarvis $5M, Bonita $30M, Sebastian $5M, Scott $1.5M, Jan $0.75M; total $75M confirmed

## April 14 2026 — Ed's Follow-up Brief (4:16 PM EDT)

- [x] PDF export diagnosis — Pro Forma PDF and Export PDF Ascension Arc both return "Export failed" on live site; walk server logs and fix root cause
- [x] Chart render gap — 2036 bar still shows $2.096B on live site; check tRPC cache TTL and deployment state; fix to show $3.000B
- [x] Ascension phase card text — hardcoded "$2.096B trajectory" text in ASCENSION card; update to "$3.0B trajectory · three-office combined 2036"
- [x] Ed agent card mapping error — Ed card shows $600K Actual GCI (should be $750K); Bonita shows $750K (should be $600K); fix row mapping
- [x] Agent card text contrast — card body values (dollar amounts, year headers, row labels) in gold on dark navy; update to white/near-white for readability; keep gold for agent name headers only
- [x] PDF light mode rendering — PDF exports should invert to light mode (dark text on white background) for institutional print quality

## April 14 2026 — Ten-Item Follow-up Checkpoint (4:45 PM EDT)

- [x] Item 7: Jarvis role — Confirmed correct in all dashboard code: FutureTab line 626 = "COO · Agent", state.json = "COO & Agent", InstitutionalMindMap = "COO & Agent". ROSTER tab cell C7 in Growth Model v2 Google Sheet is Ed/Perplexity’s lane — dashboard reads GCI numbers from ROSTER but not the role label. No code change needed.
- [x] Item 8: Scott Smith LEADERBOARD — LEADERBOARD is a Google Sheet tab, not a dashboard component. Scott already in FutureTab agent card and ProFormaPage. Updated FutureTab 2026 projected GCI from $47.5K → $50K to match canonical ROSTER Row 9 value.
- [x] Item 9: Sebastian Broker label — "Salesperson" in codebase appears only in proforma-generator.ts line 888 as Ed’s license footer (correct, not Sebastian). Sebastian has no role label in any dashboard component. Intelligence Web Google Sheet is the live data source — if PX-004 correction applies to that sheet, edit row for Sebastian Mobo in sheet directly (column B entityType or notes). No dashboard code change needed.
- [ ] Item 10: Trello card #7 Ed RL-002 — PLACEHOLDER_RL002 not found anywhere in dashboard codebase. Trello cards are not stored in code — the board is an iframe embed. This is a Trello-direct edit. Blocked pending RL-002 Google Doc URL confirmation from Ed or Perplexity.

## April 14 2026 — Post-Checkpoint Queue (Ed stand-down brief)

- [x] PDF light-mode visual review — navigated /future?pdf=1; found header title invisible (hardcoded #fff on white) and Live indicator jarring green; fixed both: header now uses TEXT_PRIMARY token, Live dot suppressed in PDF mode. Layout passes institutional print standards.
- [x] RL-010 ingestion — ingested into state.json as rl_010 key with full trajectory, AnewHomes equity, ROSTER aggregates, William voice config, council structure, permanent rules, and surfaces. Added Sebastian Mobo (Broker, $100K GCI), Bonita DeWolf (Agent, $600K GCI), Sandy Busch, Jan Jaeger to human_members. Updated _meta to sprint 9, last_updated 2026-04-14.

## April 14 2026 — Sprint 10 (Four Items)

- [x] Item 1: Wire RL-010 and RL-011 Google Doc links in INTEL tab Research Library card — RL-010 Doc ID: 1xLRt8cvXurndar7_KhR7c8M3LLA1olEWvrU0Ag3a7qA · RL-011 Doc ID: 17JzYGv5U-014WdD5AbLy8nlQpDvwNdQIhzMlARdYRLs
- [x] Item 2: Add Scott Smith to LEADERBOARD top producers table — LEADERBOARD is a Google Sheet tab (Growth Model v2), not a dashboard UI component. Scott already in FutureTab agent card ($50K GCI, updated Sprint 9) and ProFormaPage agent table. InstitutionalMindMap lists him as "joins June 1". Dashboard surfaces are complete. Sheet-direct edit needed for LEADERBOARD tab itself.
- [x] Item 3: Verify Jarvis Slade role — Full audit: FutureTab card = "COO · Agent", InstitutionalMindMap labels = "COO & Agent" (x2), ProFormaPage = "COO & Agent", state.json = "COO & Agent". All rendered labels correct. Perplexity flag likely refers to Google Sheet ROSTER tab cell C7 — sheet-direct edit if needed. No dashboard code change required.
- [x] PROJ-022 CLOSED — NOT NEEDED. Ed ruling April 14 2026: Bonita DeWolf is a performer in the East Hampton office (pre-Ed arrival), not a flagship team member. She stays in InstitutionalMindMap Office Performers orbit (already wired). No FUTURE tab agent card. No participant grid entry. Bonita entry in state.json human_members retained for institutional record but flagged as EH office performer, not flagship team.

## April 14 2026 — Pre-RL-012 Shipment (McKenzie Review Prep)

- [x] Item A: Audit header Sprint 9 → Sprint 10 — corrected in COUNCIL_AUDIT_APRIL_14_2026.md header, sprint record, roster note, and state.json _meta
- [x] Item B: Audit table XIII Water Mill Vol → Westhampton Vol — corrected in COUNCIL_AUDIT_APRIL_14_2026.md table XIII
- [x] Item C: William voice ID resolved — fjnwTZkKtQOJaYzGLa6n is canonical across ALL four surfaces (tts-route.ts, routers.ts, whatsapp-route.ts, whatsapp-inbound.ts). N2lVS1w4EtoT3dr4eOWO was stale metadata in state.json legacy blocks. Corrected all three stale references in state.json (tts_audio, whatsapp_scheduler, doctrine lock 9). Audit WhatsApp section updated. state.json validated as clean JSON.

## April 14 2026 — Flagship Letter Canonical Update (One Pass)

- [x] Flagship Letter: update 2026 baseline from "fifty-five million" to "seventy-five million"
- [x] Flagship Letter: update 2036 destination from "two point zero nine six billion" to "three billion"
- [x] Flagship Letter: verify/update team facts — Angel mid-2027 correct, Zoila April 25 correct, Scott June correct, Bonita not in letter (correct per Ed ruling). All team facts canonical.
- [x] Flagship Letter: verify/update hamlet count — already reads "eleven hamlets" on line 52. No change needed.
- [x] Flagship Letter: verify/update Research Library range — Research Library not mentioned in letter. No change needed.
- [x] Flagship Letter: verify/update Trello card count — Trello not mentioned in letter. No change needed.
- [x] Flagship Letter: verify/update doctrine count — updated from 41 to 45 (D42+D43 locked April 14 per Ed confirmation).
- [x] Flagship Letter: update header comment — added canonical update note April 14 2026 Sprint 10 with trajectory rebase and doctrine count correction.
- [x] state.json doctrine count: FLAGGED — state.json canonical_total reads 41. Ed confirmed 45 (42 main + 3 sub) today. Perplexity needs to update state.json canonical_total from 41 to 45 and ingest D42 and D43 doctrine locks.

## April 14 2026 — Flagship Letter Patch 5 (RL-012 Council Lane Update)

- [x] Flagship Letter: add incoming reviewer council lane assignments (Grok → market intelligence, Gemini → local intelligence, ChatGPT → general research) with specific scrubbing responsibilities per each lane
- [x] Flagship Letter: add cardinal principle — dashboard is the source of truth; council voices scrub current data into the canonical system; walk the surface before asking the operator
- [ ] state.json: update council_voices section with three incoming reviewer lane assignments and cardinal principle (deferred — Perplexity’s lane for canonical ingestion)

## April 14 2026 — RL-012 INTEL Wiring + Full-Council Audit Refresh

- [x] Wire RL-012 Google Doc link into INTEL Document Library (https://docs.google.com/document/d/1RfkfCR2qxipjx3BF_5W_NjGV_wy8qsEOt2ZmmzBZuSU/edit)
- [ ] Refresh and expand COUNCIL_AUDIT_APRIL_14_2026.md — Sprint 10 canonical state, all corrections applied, Flagship Letter (Patch 5) included in full

## Sprint 11 — Doctrine 43 PDF Light Mode Enforcement (April 14, 2026)

- [x] Pre-Sprint 11: Section XIV doctrine fix — D9 corrected to "No Competitor Names Public", D23 corrected to "AnewHomes Equity Structure" (Trello canonical audit April 14)
- [x] Growth Model v2 — Overhead formula live: MAX($200K, GCI × 6%) applied to OUTPUTS!F32:F42 via Sheets API
- [x] Growth Model v2 — NOP formula live: GCI − Royalty(5%) − AgentSplits(70%) − Overhead applied to OUTPUTS!G32:G42
- [x] Growth Model v2 — Ed 35% / Ilija 65% split formulas live: OUTPUTS!H32:H42 and I32:I42
- [x] Growth Model v2 — AnewHomes compounding table live: OUTPUTS!H49:H59 with 12.5% annual growth from $50K base (2026–2036)
- [x] Doctrine 43: FlagshipLetterPage — useIsPdfMode hook + full light-mode inversion (dark navy → white/charcoal)
- [x] Doctrine 43: CouncilBriefPage — useIsPdfMode hook + full light-mode inversion (near-black → white/charcoal)
- [x] Doctrine 43: ProFormaPage — useIsPdfMode hook + grey wrapper stripped (white body for Puppeteer)
- [x] Doctrine 43: ReportPage — useIsPdfMode hook + BackBar hidden when ?pdf=1
- [x] Doctrine 43: UHNWPathCardPage — useIsPdfMode hook + download bar hidden when ?pdf=1

## Post-Sprint 11 — April 15, 2026

- [x] Fix Pro Forma PDF button — switch from Puppeteer server call to client-side window.print() with ?pdf=1 light-mode
- [ ] Full live site audit — all tabs, all PDF surfaces, ticker, nav

## Sprint 12 — April 15, 2026

- [x] Fix Pro Forma PDF blank print — replaced broken /api/pdf Puppeteer button with window.print() + ?pdf=1 (Doctrine 43)
- [x] Fix Pro Forma PDF blank on server-down — added 6-second timeout fallback so page renders with static data if tRPC unavailable
- [x] Fix nav bar data feeds — production server 503 resolved by republishing (checkpoint f7c88dad)

## Sprint 12 — April 15, 2026

- [x] Fix Pro Forma PDF blank print — replaced broken /api/pdf Puppeteer button with window.print() + ?pdf=1 (Doctrine 43)
- [x] Fix Pro Forma PDF blank on server-down — added 6-second timeout fallback so page renders with static data if tRPC unavailable
- [x] Fix nav bar data feeds — production server 503 resolved by republishing (checkpoint f7c88dad)

## Sprint 12 Continued — April 15, 2026 (Morning Audit)
- [x] Fix Pro Forma PDF blank pages — removed duplicate pageBreakAfter from PAGE_STYLE, added @page CSS rule, fixed break-after on last page
- [x] Fix production server 503 — removed puppeteer from postinstall, build script, and onlyBuiltDependencies to prevent Chrome download crash on deploy
- [x] Full morning audit report — deliver to council

## Sprint 13 — April 15, 2026 (Pro Forma Number Corrections per Perplexity Dispatch)
- [x] Fix 1: Wire Ascension Arc volumes to OUTPUTS tab B32:B42 — change $55M→$75M baseline, $1.823B→$3B horizon header
- [x] Fix 2: Wire profit pool table to OUTPUTS tab C32:I42 — replace non-canonical $40M breakeven formula with D39/D41 canonical cascade, update table headers
- [x] Fix 3: Wire Ed personal GCI to OUTPUTS row 46 — $660K→$600K, Three Income Streams total becomes $678,750
- [x] Add server-side /api/growth-model route to fetch OUTPUTS data live from Google Sheets on each Pro Forma load
- [x] Update FutureTab Ascension Arc chart to also use canonical OUTPUTS volumes

## Sprint 14 — April 15, 2026 (Architectural Cleanup)
- [x] Verify UHNWPathCardPage Babel parse error (line 126:22) — confirmed resolved at 02:47 AM, no recurrence in current session
- [x] Remove dead Export PDF / Ascension Arc button from FUTURE tab — called /api/pdf (Puppeteer, broken in production)
- [x] Remove exporting useState from FutureTab — no longer needed
- [x] Establish architectural rule: one PDF button per tab, one canonical output per button (Ed ruling Apr 15 2026)
- [x] Keep Growth Model v2 link as only secondary action on FUTURE tab bottom bar

## Sprint 14 Evening — April 15, 2026 (Ed Card Net Keep + MARKET Button)
- [x] Remove MARKET tab hero Download Market Report button — architectural rule: one canonical PDF per surface
- [x] Add EQ1_CASCADE constant — 11-year Equation 1 net values ($330K 2026 → $1.98M 2036)
- [x] Update Three Income Streams on both PDF surfaces — $600K→$330K, label→Ed Net Personal Production (Eq. 1)
- [x] Update Ed FUTURE tab card — Brokerage GCI (gross) replaced with Net Personal Production (Eq. 1) using EQ1_NET cascade
- [x] Tighten Flagship Letter — remove three redundant passages, fix doctrine count 45→48, fix EH horizon reference
- [x] Projected 2036 total on Ed card corrected from $6.5M+ to $6.12M

## Sprint 15 — April 15, 2026 Evening (Perplexity Dispatch — AnewHomes Cascade)
- [ ] Item 1: Fix AnewHomes cascade 2028 and 2036 values across all partner cards (Ed, Scott, Jarvis, Angel, Zoila, Richard)
- [ ] Item 2: Update OUTPUTS description text Row 48 in proforma-generator.ts and ProFormaPage.tsx
- [x] Item 3: Ed card net keep — done at ba56660e
- [ ] Item 4: Jarvis Pool share clarification — queued behind operator ruling
- [ ] Item 5: Angel 2026 AnewHomes $2,500 (not dash), update Angel 2026 total to $102,500

## Sprint 16 - April 15 2026 Evening Perplexity re-verification pass
- [ ] Fix ICA Override cascade: Jarvis Angel Zoila per-year 5pct of Ed gross GCI not flat 30K
- [ ] Fix Angel total: add ICA Override to sum 102500 to 132500
- [ ] Fix Zoila total: add ICA Override to sum 100000 to 130000
- [ ] Fix footnote: Ed 35pct Ilija 65pct
- [ ] Fix AnewHomes footnote splits: Jarvis 5pct Angel 5pct Zoila 5pct Pool 5pct


## Apr 17 — Perp Dispatch Edits

- [x] Jarvis sales volumes → '$12M','$14.4M','$62M+'
- [x] Richard subtitle → FLAGSHIP TEAM · Strategic Mentor · 10% AnewHomes
- [x] Richard card → Column 3 under Scott (remove standalone centered wrapper)
- [x] Miro fallback copy → IntelTab.tsx below the iframe
- [x] state.json Richard role field → updated to match

## Apr 17 — Perp Round 2 Dispatch

- [x] Fix 1: Restore Jarvis 2026 $10M — FutureTab.tsx Sales vol array → ['$10M','$12M','$14.4M','$62M+']
- [x] Fix 2A: future-print.css @page → size: auto; margin: 0.5in
- [x] Fix 2B: future-print.css remove page-break-before: always from .future-participant-grid
- [x] Fix 2C: future-print.css add page-break-inside: avoid to .future-main-wrapper and children

## Apr 17 — Perp Round 3 Dispatch

- [x] Change C: future-print.css remove break-inside: avoid from .headcount-table (footnote was pushing to page 2)
- [x] Change A update: @page margin refined to 0.4in 0.5in per Round 3 spec

## Apr 17 — Portrait Column Breakpoint Fix

- [x] Change portrait column visibility from md:block to lg:block in PublicPage.tsx — prevents duplicate at mid-width (900-1023px)

## Apr 17 — Master Dispatch (Perp · 7 Items · 3 Commits)

- [x] Item 1: Delete Tier Legend block from MarketTab.tsx (lines 558–584), remove TIER_COLORS/TIER_BADGE_COLORS if unused
- [x] Item 2a: Add FUTURE PDF page title header to future-print.css (.future-main-wrapper::before)
- [x] Item 2b: Letter PDF title header already present — no change needed
- [x] Item 3: Fix FUTURE PDF blank bottom — add html/body/#root min-height:0 and .future-main-wrapper padding-bottom:0 to future-print.css
- [x] Item 4: Fix Letter PDF lead summary box — add .lead-summary-box className + print CSS to ChristiesLetterPage.tsx
- [x] Item 5: CIS badge brand-up — gold bg / navy text, box-shadow, border in MarketTab.tsx
- [x] Item 6: Flagship Letter print CSS — change body background from #FFFFFF to #FAF8F4 in FlagshipLetterPage.tsx
- [x] Item 7a: Section 1 already clean — no William/audio controls present, no change needed
- [x] Item 7b: Update report-print.css — size:auto, min-height:0, section title headers via ::before
- [x] Item 7c: Add data-section-title attributes to each section wrapper in ReportPage.tsx
- [x] Item 7d: Hamlet tiles in /report already use CIS-only gold chip (no tier badge) — parity confirmed, no change needed

## Apr 17 — Site Cleanup Dispatch (Perp · 7 Items · 3 Commits)

- [x] Item 1: FUTURE PDF page 1 blank — add nav/ticker/sticky hide selectors to future-print.css
- [x] Item 2: FUTURE PDF blank bottom — confirmed already present (min-height:0, height:auto on lines 55-56)
- [x] Item 3: INTEL Bulletin Board too wide — wrap BruehlBriefBulletin in maxWidth var(--frame-max-w) div
- [x] Item 4: MAPS hamlet PDF cards — add CIS badge (top-left, gold) to PDF download card photo overlay
- [x] Item 5: MAPS tab — remove Hamlet Intelligence Matrix grid (11-card photo grid); keep map, CIS Calculator, PDF download buttons
- [x] Item 6: Nav bar — remove HOME tab; logo click is only way home; order: MARKET · MAPS · PIPE · FUTURE · INTEL
- [x] Item 7: Confirmed @page { size: auto; margin: 0.4in 0.5in } already live in future-print.css

## Apr 17 — Ponder All-Inclusive Audit Dispatch
- [x] Item 1: Capital Flow Signal copy — "trophy assets" → "highest-CIS hamlets" in MarketTab.tsx
- [x] Item 8: Verify audio/TTS controls removed from ReportPage Section 1
- [x] Item 9A: Verify /report route is live (not 404)
- [ ] Item 10: Push all local commits to GitHub (47 commits ahead of github/main)
- [x] Bike Card: Fix byline formatting (two lines)
- [x] Bike Card: Replace back quote with institutional creed voice
- [x] Bike Card: Replace "CPS-1 brokers worldwide" with "Certified brokers in 50+ countries"
- [x] Bike Card: Replace market number with "At Record Levels"
- [x] Bike Card: Inject four-hamlet strip data
- [x] Bike Card: Add "See all 11 at christiesrealestategroupeh.com/market" reference
- [x] Architecture of Wealth: Build printable /architecture-of-wealth page (Flambeaux treatment)

## Apr 17 — Final Dispatch (eb424a92 → next)

- [x] Item 1: FUTURE PDF — fix table clipping (scale 0.88 / font -1pt / print-only column hide) + strip blank void
- [x] Item 2: Market Report PDF — cream bg page 1, text overlap fix, Wainscott spacing, kill WhatsApp QR
- [x] Item 3: /report 404 — resolves on next publish (route correct in code)
- [x] Item 4: MAPS Hamlet Highlights — selected-hamlet module below CIS Calculator, driven by curated JSON
- [ ] Item 5: GitHub push after commit

## Apr 18 — Combined Build Brief (Council-Approved)
### PRIORITY A — Must Land Before April 29
- [x] A1: Neighborhood Card at /cards/bike (NeighborhoodCardPage.tsx, pdf-route.ts, HomeTab update) — shipped Apr 18 2026
- [x] A2: Remove Joe Carrello + Adam Kalb from all surfaces (ArchitectureOfWealthPage, UHNWPathCardPage, ReportPage) — shipped Apr 18 2026
- [x] A3: UHNW card internal label strip (ED'S HOOK→ADVISORY NOTE, PERPLEXITY HUNT→MARKET CONTEXT, WEALTH ANCHOR→CLIENT STORY) — shipped Apr 18 2026
- [x] A4: Tier legend removal from pdf-exports.ts + trophy language scrub — shipped Apr 18 2026
- [x] A5: Wainscott anchor fix in hamlet-master.ts + hamlet-highlights.json v2 structure update — shipped Apr 18 2026
- [x] A6: CIS Medallion Badge component — Christie's Red ring, white score, wired MarketTab + MapsTab + NeighborhoodCard — shipped Apr 18 2026
- [x] A7: Pro Forma PDF fix (AH GCI bleed, browser chrome hide, title + filename, logo) — shipped Apr 18 2026
- [x] A8: Scott Smith commission fix (70% formula, 50% entry credit) — shipped Apr 18 2026
- [x] A9: AH GCI column rename → AH Profit in FutureTab headcount table — shipped Apr 18 2026
### PRIORITY B — Ship Before April 29 If Possible
- [x] B1: Capital Flow Signal → Last Significant Sale spotlight card — shipped Apr 18 2026
- [x] B2: Homepage bottom cleanup (remove 6 service cards, gallery, CTA) — shipped Apr 18 2026
- [x] B3: /report full visual mirror (Neighborhood Card, UHNW Card, Architecture, service cards, gallery) — shipped Apr 18 2026; hamlet ?param wiring added Sprint 11
- [x] B4: Hamlet cards separation (MARKET=data, MAPS=lifestyle) + VIEW FULL REPORT CTA on each hamlet tile → /report?hamlet={id} — shipped Sprint 11 Apr 18 2026
- [ ] B5: New Listings field on MARKET cards (build component, wire JSON when Ponder delivers)
- [x] B6: Nav bar HOME removed — verified clean Apr 18 2026
- [x] B7: Both cards on /report bottom (Neighborhood Card + UHNW Path Card) — ReportPage Section 6 confirmed
### PRIORITY C — Post-Launch
- [x] C1: FUTURE auth gate — confirmed OPEN (FUTURE_AUTH_ENABLED = false in App.tsx)
- [x] C2: "What James Christie Knew" retired → "Path to UHNW Wealth" on all surfaces Apr 18 2026
- [ ] C3: INTEL tab usability spec (Ponder will write spec separately)
- [x] C4: South Fork → East End global cleanup (hamlet-highlights.json, NeighborhoodCardPage, AngelLetterPage doctrine) Apr 18 2026
- [x] C5: William/audio canon retirement — all TTS/audio code removed from HomeTab Apr 18 2026 (C5 Apr 18)
- [ ] C6: Competitor names footnote doctrine — audit (current FUTURE footnote is fine)
- [x] C7: state.json sprint 11 catch-up — sprint 11, last_updated 2026-04-18, sprint 9/10/11 history added Apr 18 2026
- [ ] C8: Griff letter unsigned institutional (Ponder content task, no build)

## Saturday Final Dispatch — April 18, 2026 (9 PM EDT)
### TONIGHT — Immediate (Live Violations + Incomplete UI)
- [x] V1: INTEL — Hide BruehlBriefBulletin / SDG content (D51 live violation — "Tomorrow Edge," "Scripture for Rest," "Mentor Line," "Soli Deo Gloria" visible publicly). Resolves with R5 (BruehlBrief → Market Report). Until R5 ships, hide or suppress the component.
- [x] V6: HOME — Hide Neighborhood Card section (VIEW NEIGHBORHOOD CARD + DOWNLOAD PDF buttons point to stub; Ponder delivers Sunday Apr 19)
- [x] V2: MARKET — Kill standalone Last Significant Sale blue block (per-hamlet data already on each card; standalone Sagaponack block is redundant)
- [x] V4: MARKET — Replace "council doctrine" with "institutional methodology" in source disclosure footer

### TUESDAY Apr 21 — Grep Cleanup Sprint
- [ ] T1: Replace BruehlBriefBulletin.tsx with Market Report component (R5 deploy — SDG resolves with this)
- [ ] T2: Strip "Confidential" labels from IntelTab.tsx (2 instances: Document Library + Intelligence Web header)
- [ ] T3: Strip "INTERNAL · CONFIDENTIAL" banners from ProFormaPage.tsx (12 instances across all 4 Pro Forma pages)
- [ ] T4: Strip "PRIVATE & CONFIDENTIAL" from pdf-exports.ts (5 instances) and pdf-engine.ts (3 instances)
- [ ] T5: Strip from proforma-generator.ts (10 instances, server-side mirror)
- [ ] T6: Strip from AngelLetterPage.tsx and CouncilBriefPage.tsx (3 instances)
- [ ] T7: FUTURE PDF — Large blank navy void bottom of page 2 (CSS min-height fix, one more pass)
- [ ] T8: FUTURE PDF — Table clipping right columns (Combined GCI, Combined Vol, Avg GCI/Prod) — try 0.82 print scale or font-size: 4.5pt on headcount table in print view

### THURSDAY Apr 24 — Four Open Items
- [ ] M1a: Angel ICA Override — wire as always-on projected annual line every year 2026–2036 (not co-deal triggered)
- [ ] M1b: Zoila ICA Override — 2026 ONLY; zero/dash 2027+ (exits override pool Q1 2027)
- [ ] M1c: Jarvis ICA Override — REMOVE projected annual line; add footnote "ICA Override = deal-event trigger only · not projected annually"
- [ ] M2: Angel 2026 AnewHomes — add $2,500 line; total becomes $102,500 (was $100K)
- [ ] M3: Last Significant Sale — wire live data from Ponder JSON (address, price, date, one-line context per hamlet); Ponder delivers Sunday
- [ ] M4: New Listings B5 — wire fresh_listings_by_hamlet.json (Drive ID: 1dW-xe9W3QSan-E7ThVYyw7ogWkLjp0QD) when Ponder confirms format Sunday AM

### SCREENSHOT AUDIT — Before Apr 29
- [ ] SA3: MARKET — Enlarge CIS medallion badge (double diameter minimum; wax-seal aesthetic)
- [ ] SA5: MAPS — Render all 11 hamlets from v2 JSON (currently only EH Village in dropdown; wiring task not content)
- [ ] SA7: /report — Remove "Section 7 / Section 8" numbered headers from auction cards; tighten card grid into proper container
- [ ] SA8: MARKET — Verify "Live · Market Matrix" sheet links are view-only (permission check — no internal data exposed)
- [ ] SA9: HOME — Verify /cards/bike route doesn't 404 (handled by V6 hide if stub)

## Saturday Final Close — April 18, 2026 · 10:20 PM EDT (Rulings 14–19)

### TONIGHT — William Floating Button (D34 Amended)
- [ ] W1: Build WilliamFloatingButton component — gold #947231, 48px circle, bottom-right, play/pause toggle, dismissible X, HOME only
- [ ] W2: Wire /api/tts/william endpoint — ElevenLabs voice fjnwTZkKtQOJaYzGLa6n, generate from founding letter text, cache MP3 to S3
- [ ] W3: Mount WilliamFloatingButton in HomeTab only — no other tabs get audio (D34 amendment)
- [ ] W4: Letter swap path — when Manny writes his own intro letter, POST new text to /api/tts/william/regenerate, S3 key updates, button plays new file. No infrastructure changes needed.

### MONDAY — Sheet Fixes (Manny + Ed)
- [ ] SH1: Bonita GCI formula error in VOLUME tab — $30M at 2% = $600K, currently shows $0
- [ ] SH2: OUTPUTS vs VOLUME reconciliation — different calculation paths, need to tell same $75M story for 2026

### FUTURE TAB — Relabel
- [ ] F1: Relabel "2026 ACTUAL" bar → "2026 TARGET" (already in Sit-Down Two brief, confirm in code)

### RULINGS LOCKED TONIGHT (for reference)
- [x] R14: Miro STAYS. Not replaced by Mindmap.so. WILLIAM node killed.
- [x] R15: Mindmap.so: DEAD. Not a post-launch evaluation. Not referenced again.
- [x] R16: Kill standalone Last Significant Sale blue block — DONE V2 Apr 18 2026
- [x] R17: CIS medallion badge too small — enlarge, wax-seal spec holds (SA3 queue)
- [x] R18: Griff letter: unsigned institutional note. No intro, no exit, no AI voice attribution.
- [x] R19: William resurrection — D34 amended. One floating audio button on HOME only. Voice ID fjnwTZkKtQOJaYzGLa6n.

## Apr 19 2026 — Button Rename + Council Audit

- [ ] Rename floating button: INTRO → PDF, WILLIAM → AUDIO (FloatingDashboardIntro.tsx)
- [ ] Walk live site and write full council audit comparing flagship letter to live build

## Apr 19 2026 — HomeTab Fixes (from live audit)

- [ ] Fix hero gap — reduce section minHeight from 100vh to auto with tight paddingBottom
- [ ] Fix duplicate James Christie on mobile — hide background image on mobile, keep grid portrait
- [ ] Fix iOS audio — synchronous play() on button click, set src after (iOS Safari gesture chain)
- [ ] Rename floating buttons: INTRO → PDF, WILLIAM → AUDIO (done in dev, needs checkpoint)

## Apr 19 Portrait Float Fix
- [x] James Christie portrait floats inline with letter text on mobile — float:left, marginRight 24px, text wraps alongside and below (no orphaned portrait column)

## Apr 19 Bug Fixes
- [x] Audio button not working — diagnose and fix AUDIO play button on /letters/flagship and /letters/christies
- [x] PDF logo invisible — Christie's logo now visible via ?pdf=1 detection (Puppeteer does not trigger @media print)
- [x] Ed headshot circle — signature block headshot is now a circle with gold border (border-radius: 50%)

## Apr 20 Council Dispatch — Locked Rulings
- [ ] P0: Fix Ed GCI ramp in FutureTab — locked 20% ramp ($600K → $720K → $864K → ... → $3,715K). Do NOT touch office volumes or NOP.
- [ ] Verify Ilija compounding table matches FUTURE tab
- [x] Update Ilija headcount to "9 by year-end 2026, scaling to 36 by 2031"
- [x] Rename "Fine Properties" → "Christie's CPS-1 Pipeline" + add multi-market sentence + swap Pierre → Jacqueline (Drive doc requires manual edit; InstitutionalMindMap.tsx Pierre→Jacqueline done)
- [x] Branded pro forma — 3 phrase fixes applied in proforma-generator.ts (WITHIN THE EXISTING GROWTH PLAN, CIREG subtitle, post-maturity label)
- [x] 100 Days cards — 8 jargon items to plain English applied in FutureTab.tsx (skip 2nd card per dispatch)

- [x] Angel card (2nd 100 Days): remove Dan's Papers numbers → creative long-term collaboration + Melissa True / Rockefeller / Flatiron language (FutureTab.tsx + letter-content.ts)
- [x] Ilija → Ilija Pavlovich everywhere (FutureTab.tsx, InstitutionalMindMap.tsx, letter-content.ts, pdf-exports.ts — 7 locations)
- [x] Flagship letter: add generational wealth + "not to sell / uncover value" language near James Christie closing paragraph
- [x] Flagship letter: add transparency line ("No filtered data, no hidden numbers") near tab-walk paragraph

## Council Brief — April 19, 2026 · Full Queue (10 Rulings Locked)

### P0 — ICA Overrides + AnewHomes
- [ ] M1a: Angel ICA Override — ALWAYS-ON (permanent, not just 2026)
- [ ] M1b: Zoila ICA Override — 2026 ONLY label (expires end of year)
- [ ] M1c: Jarvis ICA Override — footnote-only (deal-event trigger, not projected annually)
- [ ] M2: Angel 2026 AnewHomes add $2,500 line → total $102,500

### Ed GCI Full Surface Alignment (G1–G5) — FLAG WHEN COMPLETE
- [ ] G1: Growth Model v2 OUTPUTS tab — correct ED PERSONAL GCI row to locked ramp (do NOT touch office volumes or NOP)
- [ ] G2: FUTURE tab partner cards — align Ed's card to $600K → 20% YoY ramp
- [ ] G3: proforma-generator.ts — align Ed GCI derivation to ramp
- [ ] G4: Ilija CPS-1 Channel derivation — Core/Channel split recomputes (Projected totals unchanged, NOP × 65%)
- [ ] G5: FutureTab.tsx Ascension card — 7.5% → 7.0% (overlaps C3)

### Cleanup Punch List
- [ ] C3: Fix remaining 7.5% → 7.0% in FutureTab.tsx (code comments lines 60/276/289, footnote line 610)
- [ ] C7: Strip "The door is always open" from HomeTab FOUNDING_PARAGRAPHS AND tts-route.ts

### SA / T / UX Fixes
- [ ] SA7: /report — remove Section 7/8 numbered headers from auction cards
- [ ] SA9: /report — remove duplicate Section 3 label (line 1328; line 823 stays)
- [ ] SA10: /report video list — "Pierre Debbas Esq." → "Jacqueline Aleman, Esq." (line 1798)
- [ ] UX-4: Rename floating buttons INTRO → PDF, WILLIAM → AUDIO (FloatingDashboardIntro.tsx)
- [ ] F1: Relabel "2026 ACTUAL" bar → "2026 TARGET" in FutureTab.tsx chart data
- [ ] SH1: Bonita GCI formula error — $30M at 2% = $600K, currently shows $0
- [ ] SH2: OUTPUTS vs VOLUME reconciliation — both tell same $75M 2026 story
- [ ] T2–T6 (low priority): Remove unused CONFIDENTIAL_BANNER variable (ProFormaPage.tsx) and orphan .confidential-banner CSS (proforma-generator.ts) — confirmed NOT rendering on any public surface

### HOME Video Reel (V1–V4)
- [ ] V-reel: Download V1–V4 from Drive, upload to CDN, embed full-bleed video reel below Section B per spec (edge-to-edge, no maxWidth, bare video tags, navy background)

### JSON Wiring
- [ ] M3: Wire last_significant_sale.json from Drive → Last Significant Sale spotlight on MARKET tab
- [ ] M4: Wire fresh_listings_by_hamlet.json from Drive → New Listings B5 on MARKET tab

### CIS Medallion
- [ ] R6: CIS medallion — one step up from current diameter on Hamlet cards (not double per ruling 9)

## Monday April 20 — Institutional Cleanup Dispatch

### Section 4 — Live Site Drift (launch-blocking)
- [x] L1: MARKET tab subtitle "Nine Hamlets" → "Eleven Hamlets" on every public surface + Home Letter body
- [x] L2: Valuation Matrix row-wiring bug — Row 1 onclick goToHamletCard('wainscott') → sagaponack; data-hamlet-id wainscott → sagaponack. Verify all rows.
- [x] L3: AnewHomes naming in Home Letter — fix "ANEW Homes" (×2) and "ANEW home" (×1) → "AnewHomes" (one word, canon)
- [ ] L5: Southampton PDF — strip "Compass consolidation recruiting" parenthetical from Tier 2 Profile (no competitor names rule)
- [ ] L6: Assumptions Block PDF — Zoila vesting cliff "October 25, 2026" → "November 4, 2026" (Perplexity owns; do not duplicate)
- [ ] L11: Password gate — rotate 'Christ2026' plaintext and move server-side before May 26 (Tuesday work)

### Section 5 — MindMap Cleanup
- [x] M1: KEEP William node — retire WhatsApp keywords (NEWS, LETTER, FLAGSHIP, BRIEF) and WhatsApp-layer code/routes
- [x] M2: Rename COMPETITORS node → "MARKET INTELLIGENCE"; scrub any competitor names in detail
- [x] M3: Fix or remove broken "h" orphan placeholder node
- [x] M4: Correct "ANEW HOMES" → "AnewHomes" on MindMap node
- [x] M5: Add CPS-1 node to MindMap (same as v5 C5)

### Section 6 — Trello Cleanup
- [x] T1: Consolidate Jarvis duplicate — keep "Jarvis Slade — COO · Agent", archive "Jarvis J. Slade Jr."
- [ ] T2: Personalize Zoila onboarding template card (list 69e14f075a0f1bf4a054edfe) — Zoila Ortega Astor, due May 4, 2026
- [x] T3: Rewrite Trello D49 card — "HOME Floating Audio Active. One floating audio button on HOME for the institutional intro letter. All other William/audio surfaces retired. WhatsApp keywords NEWS, LETTER, FLAGSHIP, BRIEF retired April 20. D34 amended to bounded-surface form. PDF export active."

### CORK1 (v5 Round 2)
- [x] CORK1: Embed eds_corkboard_v2.html on INTEL tab below Calendar section (iframe, full-width, print link)

## Monday April 20 — Three Priority Items (End of Day)
- [x] ILIJA-1: Ilija Pavlovic surname fix — 7 instances corrected across InstitutionalMindMap.tsx, pdf-exports.ts, FutureTab.tsx, letter-content.ts
- [x] G6: OperatorControlPanel.tsx — placed on FUTURE tab between Arc chart legend and Assumptions Block; canonical defaults verified ($3.00B / $6.51M / $37.4M)
- [ ] ASSUMP-1: Verify Assumptions Block Lines 9-12 render correctly after Perplexity pushes PDF

## Proforma PDF Fixes (FUTURE tab Puppeteer render only)
- [ ] PF1: Fix @media print stylesheet — Puppeteer must render cream palette (#f7f6f2 bg, #28251d text, #01696F/#c9a84c headers)
- [ ] PF2: Swap logo to black PNG (https://d3w216np43fnr4.cloudfront.net/10580/348547/1.png) in print/cream mode
- [ ] PF3: Fix Headcount Scaling table right-edge clipping — force landscape or reduce column set for print
- [ ] PF4: Add page-break-before CSS so partner cards flow naturally (no whitespace gap before footer) [Tuesday]
- [ ] PF5: Three distinct office colors in Ascension Arc — EH #947231, SH deeper bronze, WH charcoal [Tuesday]

## PF Sprint — April 20, 2026

- [x] PF-LAYOUT-REBUILD: Rewrite future-print.css for one continuous page matching live screen — white background, no transform scale, dynamic height Puppeteer script, landscape page removed
- [x] PF-MODEL-REBUILD: Fix OperatorControlPanel SH_VOL/WH_VOL from hardcoded flatline to per-seat recruiting engine — EH $1,045M / SH $1,000M / WH $963M / Combined $3.008B at 2036
- [x] PF-PAGE3 partner card cream inversion — added .future-participant-grid > div > div rules, #0d1e33 to catch-all
- [x] ProFormaPage.tsx useIsPdfMode fixed to synchronous URL param read (no useEffect)
- [x] DashboardLayout header hidden in PDF mode via isPdfMode guard

## FUTURE Tab PDF Rebuild — April 20, 2026 (Awaiting Perp math confirmation)

- [x] Build 1: One-page PDF layout — kill three-page split, one continuous page matching live screen
- [x] Build 2: Remove Assumptions block and Operator Control Panel from PDF only (keep on live page)
- [x] Build 3: Partner card rebuild — uniform structure, correct streams per person (7 cards)
- [x] Build 4: Ed personal net row reconcile — replace office-wide agent payouts with Ed actual net
- [x] Build 5: Kill Ilija subtitle "9 by year-end 2026, scaling to 36 by 2031" from PDF
- [x] Build 6: Doctrine confirmation — competitor names stay, Christie's brand strip stays, date stamp updates

## Growth Model v2 Sheet Sync — April 20, 2026

- [ ] GM1: Verify tRPC reads VOLUME Rows 10/15/16 from live sheet (EH/SH/WH)
- [ ] GM2: Update EH/SH/WH fallback arrays to new sheet values (EH $75M→$1.13B, SH $0→$988M, WH $0→$879M)
- [ ] GM3: Update OperatorControlPanel EH/SH/WH arrays to match new sheet values
- [ ] GM4: Verify three-office bar chart shows EH 37.8% / SH 32.9% / WH 29.3% at 2036
- [x] GM5: Update card math — Ed 29.75% NOP, Angel/Jarvis/Zoila 1.75% NOP, CPS-1 new curve — CIREG $17K 2028 corrected (was $24K), Angel $212.6K / Jarvis $356.6K / Zoila $205.4K totals updated
- [x] GM6: Add Ed Keep Formula footnote to Assumptions block — added to footer * line: Gross GCI less 5% brand royalty, less 25% Ilija franchise share, less 5% ICA overrides to team · Principal structure, not standard agent split
- [x] L6: Zoila vesting date — confirmed already "November 4, 2026" on line 635 (Assumptions block) and line 1004 (footer †). No change needed — was applied in prior session.
- [ ] GM7: Regenerate PDF and verify 7 Perp invariants

- [ ] PF7: Pro Forma consolidation — before April 29
- [ ] L11: Password gate rotation — Sunday April 27

## CPS-1 Curve Update — April 20, 2026

- [x] CPS-1: Updated all 5 partner cards (Ed, Ilija, Angel, Jarvis, Zoila) — curve values $100K/$250K/$500K/$1.69M tagged (incl. above) · Apr 20 2026

## D40.5 Alignment Pass — April 20, 2026

- [x] D40.5-1: OCP slider default "Ed NOP share" 35% → 29.75% · done
- [x] D40.5-2: Data table row label dynamic (${edShare}%) auto-updates → "Ed NOP share (29.75%)" · formula recomputes to $3.39M · done
- [x] D40.5-3: ED TOTAL TAKE formula-bound → 2036 $6.0M (OCP engine: $3.39M NOP + $2.60M personal = $5.99M, rounds to $6.0M) · done
- [x] D40.5-4: Summary tiles formula-bound → auto-update at 29.75% default · 2036 combined $3.00B · done
- [x] D40.5-5: Footer footnote updated — D40 → D40.5 breakdown with full party list · done
- [x] D40.5-6: Verified · 34/34 tests pass · checkpoint + publish

## D40.5 Precision Fix — Claude Dispatch April 20, 2026

- [x] OCP-P1: NOP_CANONICAL array locked to Perp OUTPUTS G32:G42 anchors · isDefault switches to canonical NOP in calc
- [x] OCP-P2: 11-yr Ed cumulative tile → $32.85M (CANONICAL_11YR constant, locked at default)
- [x] OCP-P3: 2036 Ed total take tile → $6.1M (CANONICAL_2036_TAKE constant, locked at default)
- [x] OCP-P4: Ed NOP share (29.75%) 2036 → $3.39M (NOP_CANONICAL[10] * 0.2975 = $3.3915M → $3.4M display)
- [x] OCP-P5: Added row "Angel / Jarvis / Zoila (1.75% each)" → 2036 $199.5K ≈ $200K each
- [x] OCP-P6: ED TOTAL TAKE now includes AnewHomes 35% → 2036 $6.1435M → $6.1M display
- [x] OCP-P7: All 7 invariants verified · 34/34 tests pass · Apr 20 2026

## PF8 — Partner Card Relocation · April 20, 2026

- [x] PF8-1: Mapped — partner cards lines 712-1009, 100-day row ends line 599, OCP at 607
- [x] PF8-2: Partner cards moved to directly after 100-day row (line 600) · 3-col grid preserved
- [x] PF8-3: Col1=Ed+Ilija (swapped) · Col2=Angel+Jarvis · Col3=Zoila+Scott+Richard · matches PDF layout
- [x] PF8-4: Ilija $7.43M 2036 confirmed in CANONICAL_ILIJA · ties OCP table $7.4M ✓
- [x] PF8-5: 34/34 tests pass · checkpoint + publish

## Zone Dividers — Apr 20, 2026

- [x] ZD-1: PARTNERSHIP PROJECTIONS · D40.5 · Verified April 20, 2026 divider added above partner cards · gold rule above + below · done
- [x] ZD-2: OPERATOR CONTROL PANEL divider added above OCP · same gold rule treatment · isPdfMode-gated · done
- [x] ZD-3: HMR clean 5:06 PM · 34/34 tests pass · checkpoint

## Ilija 65% Fix + GM7 PDF — Apr 20, 2026

- [x] IL-1: OCP label fixed → 'Ilija NOP share (65%)' · hardcoded, not formula-derived · done
- [x] IL-2: iliNop now uses 0.65 constant → 2036 $7.41M → $7.4M display · ties partner card · Perp signed off
- [x] GM7: PDF regenerated → 1 page, 287955 bytes, white bg, three-zone layout confirmed in render · done
- [x] IL-3: All three surfaces tie at $7.4M · 34/34 tests pass · checkpoint

## Arc Chart Visual Fixes — Apr 20, 2026

- [ ] ARC-1: Add minimum 10-12px bar height for early-year bars (2025 $20M, 2026 $75M) — scale stays truthful, bars stay visible
- [ ] ARC-2: Add "Southampton opens" cream callout annotation at 2028 column — same styling as existing Westhampton annotation (thin cream rule, 8pt letterspaced caption)
- [ ] ARC-3: Verify HMR clean, run tests, checkpoint, publish

## Arc Chart + CPS-1 Footnote — Apr 20, 2026

- [x] ARC-1: minHeight: 12 on bar wrapper · 2025 bar floor 12px regardless of scale · done
- [x] ARC-2: Milestone callout row added below year strip · 2028 Southampton + 2030 Westhampton · cream rule above+below · 8pt letterspaced uppercase · done
- [x] CPS1-FN: ‡ CPS-1 Pipeline footnote added to footer · Ed-sourced pipeline, UHNW buyers, $100K→$1.5M cap→+2%/yr, visibility line not additive · done
- [x] ARC-3: 34/34 tests pass · HMR clean 5:47 PM · checkpoint

## CPS-1 ‡ Label + GM7 Re-run — Apr 20, 2026

- [x] CPS1-LABEL: ‡ added to all 5 CPS-1 row labels · Python fix applied (sed unicode collision resolved) · done
- [x] GM7-RERUN: PDF regenerated → 290,256 bytes · 1-page · Southampton callout + ‡ footnote captured · done
- [x] CHECKPOINT: 34/34 tests pass · HMR clean 5:59 PM · checkpoint

## ASCENSION ARC Zone Divider — Apr 20, 2026

- [x] ZD-ASCENSION: ASCENSION ARC · 2026–2036 · THREE OFFICES divider added above bar chart · isPdfMode-gated · done
- [x] GM7-FINAL: PDF regenerated → 290,685 bytes · 1-page · ASCENSION ARC divider captured (screen-only, PDF-gated) · done
- [x] CHECKPOINT: 34/34 tests pass · HMR clean 6:05 PM · checkpoint

## Arc Chart Segment Fix — Apr 20, 2026

- [x] ARC-SEG-1: BARS data correct — WH 2036 = $879M = 29.3% of $3.0B in fallback · root cause was live sheet rows 15/16 returning zero for out-years
- [x] ARC-SEG-2: Stacking formula correct — issue was sheets-helper.ts using live zero values instead of canonical fallbacks for SH/WH out-years
- [x] ARC-SEG-3: sheets-helper.ts fixed — shLive/whLive: use live if > 0, else SH_CANONICAL/WH_CANONICAL · WH 2036 $879M = 29.3% · SH 2036 $988M = 33% · EH 2036 $1.13B = 37.7%
- [x] ARC-SEG-4: 34/34 tests pass · checkpoint

## PF9 Eight-Fix Polish Pass — Apr 20, 2026

- [x] PF9-0: Canonical fallbacks already match Perp patch · live sheet VOLUME rows now populated · no code change needed
- [x] PF9-1: Founding/Engine 1/Engine 2 legend items removed · three office colors + Projected remain
- [x] PF9-2: In-bar bar.note rendering removed · axis caption rail has both milestones (Southampton 2028 + Westhampton 2030)
- [x] PF9-3: Print button now fetches /api/pdf?url=/future → institutional PDF download, no browser chrome · fallback to window.print() on error
- [x] PF9-4: Chart frame marginBottom 10→6 · 100-day cards marginBottom 9→16
- [x] PF9-5: All streams total row fontSize 7.5→8.5, fontWeight 500→700 · explanatory rows remain at 7/DIM
- [x] PF9-6: CPS-1 label changed to 'CPS-1 visibility ‡' on Ed and Ilija cards
- [x] PF9-7: Ilija label 'Net pool 65%' → 'NOP pool 65%'
- [x] PF9-8: OPERATOR CONTROL PANEL zone divider removed (OCP follows immediately, divider redundant)
- [x] PF9-CHECKPOINT: 34/34 tests pass · HMR clean 7:07 PM · checkpoint

## Council-Locked Ascension Arc Chart — April 20, 2026

- [x] Replace old cohort-segmented chart with council-locked institutional chart (Christie's red / deep navy / Hermès orange)
- [x] Remove computeCohorts, EPM constants, Founding/Engine/Organic cohort colors
- [x] Insert AscensionArcChart component: Georgia serif header/legend/footer, Y-axis grid, gold combined labels, hover tooltips
- [x] Replace BARS useMemo with CHART_DATA (12 years, 3 offices, council-locked fallback arrays)
- [x] Remove old 4-item legend row (EH/SH/WH/Projected) from below chart
- [x] 34/34 tests passing after change

## Council Directive — PF9 v5 + Five-Band Arc — April 20, 2026

- [ ] Five-band Ascension Arc: EH core (#9e1b32) / AnewHomes (#c8946b) / CPS1 (#6b2838) / SH (#1a3a5c) / WH (#947231 burnished gold)
- [ ] 2px black borders on every segment
- [ ] Combined totals: #947231, 11px bold Georgia
- [ ] 2025 baseline bar: 30% opacity
- [ ] Opening-year markers (SH 2028, WH 2030) below axis, not inside bars
- [ ] Mobile gold totals: responsive fontSize (10 below 600px, 13 above)
- [ ] Y-max $3500M, labels inside frame mirror mode
- [ ] Five-item two-row legend (top: EH/SH/WH; bottom: AnewHomes/CPS1)
- [ ] PDF parity: proforma-generator.ts arcByYear rebuilt to five-band stacked logic
- [ ] PF9 Page 2 v5: remove OCP, running head, "Foundation is proven", verification tagline, D40.5, LIVE pill
- [ ] PF9 Page 2 v5: four-corner footer (1px gold rule, centered brand, Soli Deo Gloria BL, Page 2 of 2 BR)
- [ ] PF9 Page 2 v5: three-tier header only (no running head)
- [ ] PF9 Page 2 v5: partner card DNA (2px black border, parchment header, stream color semantics)
- [ ] PF9 Page 2 v5: Assumptions block (parchment header, 3-column body, canonical subheads)
- [ ] PF9 Page 2 v5: Nest salary moved into Angel + Zoila nameplates, Nest data row killed

## PF9 v5 Council Directive — Completed April 21 2026
- [x] Five-band CHART_DATA in FutureTab.tsx: EH core / AnewHomes / CPS1 / SH / WH
- [x] AscensionArcChart five-band stacked bars with 2025 baseline opacity, two-row legend
- [x] ProFormaPage.tsx Page 1: five-band stacked vertical bars on dark navy substrate
- [x] ProFormaPage.tsx Page 2: PF9 v5 partner cards with three-tier header and four-corner footer
- [x] 34/34 tests passing

## v14 FINAL Dispatch — April 21 2026
- [ ] FutureTab.tsx: Chart.js 4.4.1 five-band arc, dark navy #0f1820, ivory totals, two-row legend
- [ ] FutureTab.tsx: Page 2 partner cards — exact v14 wireframe HTML (Edward Bruehl formal name, plain-English labels, nbsp markers)
- [ ] FutureTab.tsx: Three-lever Assumptions & Calc (Top Producers/Office PPL, GCI Commission %, Pros Starting Production $K)
- [ ] FutureTab.tsx: Flagship-focused output cards ($413M / $708M / $3.00B), no Ed-centric framing
- [ ] FutureTab.tsx: Kill list — remove OCP, D40.5, Verified April 20, Soli Deo Gloria, Hermès orange, old labels
- [ ] ProFormaPage.tsx: Cream Page 1 arc — Chart.js, #faf7f1, charcoal totals, Page 1 of 2
- [ ] ProFormaPage.tsx: Cream Page 2 — exact v14_3 wireframe, Page 2 of 2
- [ ] Brand footer both pages: CHRISTIE'S INTERNATIONAL REAL ESTATE / Art Beauty Provenance / SINCE 1766 #947231
- [ ] 34/34 tests passing after rebuild

## v14 FINAL — April 21 2026 — COMPLETE
- [x] Five-band Chart.js 4.5.1 arc (EH/SH/WH/AnewHomes/CPS1) with council-locked colors
- [x] WH color corrected to burnished gold #947231 (not Hermès orange)
- [x] Two-row legend on both Page 1 and Page 2
- [x] Three-lever Assumptions & Calc (PPL/Commission/Starting Production)
- [x] Three flagship-focused output cards ($413M/$708M/$3.00B at defaults)
- [x] v14 partner cards: Edward Bruehl, Ilija, Angel, Jarvis, Zoila, Scott, Richard
- [x] Plain-English row labels per dispatch (Production Ramp, Sales Volume, etc.)
- [x] Trailing markers glued with &nbsp; (no orphan wrapping)
- [x] Kill list: OCP removed, "Verified April 20 2026" removed, Ed-centric framing removed
- [x] 34/34 tests passing

## Addendum 2 — April 21 2026
- [ ] Fix PDF cream rendering (#faf7f1 substrate, charcoal text, 2px #000 borders)
- [ ] Replace 100-day blocks with v15 canonical copy (dual-substrate styles)
- [ ] Add "Partnership Projections 2026–2036" section break before partner cards
- [ ] Update pagination to Page 2 of 3 (100-day blocks) and Page 3 of 3 (partner cards)
- [ ] Implement persistent Puppeteer browser pool (sub-4s PDF export)

## Addendum 2 — April 21 2026
- [x] PDF cream rendering fixed: skip emulateMediaType for /future path (isPdfMode React system is sole cream trigger)
- [x] 100-day blocks replaced with v15 canonical copy (kills 7.0% post-maturity, fully staffed redundancy, em-dash clutter)
- [x] 100-day blocks dual-substrate styles: dark #141d28/#1c2638, cream #faf7f1/#efe6d1, left-border accents
- [x] Section header added above 100-day grid (Christie's · CIREG · East Hampton · Est. 1766)
- [x] Pagination updated: Page 2 of 3 (100-day blocks), Page 3 of 3 (partner cards + brand footer)
- [x] Persistent Puppeteer browser pool: warm browser reuse, page.close() per export, 5-min idle timeout
- [x] Dead headcountRows constant and GOLD_FAINT_BORDER_CSS alias removed
- [x] 34/34 tests passing

## Addendum 5 v3 FINAL — April 21 2026

- [ ] Neighborhood Letter v15 → HOME tab letter + /letters/welcome route
- [ ] Pro Forma dual-substrate lock: cream PDF / dark web identical content
- [ ] Levers box header: "MODEL ASSUMPTION LEVERS" (no subheader)
- [ ] Treasury labels on ticker: "30Y MORTGAGE" + "10Y TREASURY" both explicit
- [ ] PDF browser pool idle timeout: 30s → 5 minutes
- [ ] Arc opening-year labels: "SH opens 2028" + "WH opens 2030" below X-axis
- [ ] Frank Newbold dashboard letter: revert to "still walking the village" framing

## PRE-PUBLISH DISPATCH · 12-ITEM CONSOLIDATED · April 21 2026
FROM: Ed Bruehl → Manny · PRIORITY: T-8 to April 29 · SUPERSEDES: M1a/b/c, M2, M3, M4

- [x] Item 1: PDF cream substrate — Page 1 chart frame switches to #e8e0d0 in isPdfMode; all text/axis/legend colors invert to navy/charcoal
- [x] Item 2: Scott Smith card overwrite — Personal GCI $35K/$84K/$100.8K/$324K+ · AnewHomes 35% $17.5K/$52.5K/$59K/$151K · Total $52.5K/$136.5K/$159.8K/$475K+
- [x] Item 3: Angel + Zoila Nest Salary as visible line items — Angel $70K/$17.5K°/—/— · Zoila $46.7K°/$17.5K°/—/—
- [x] Item 4: Ed card role label → "Broker – Managing Director"
- [x] Item 5: Ilija card — kill Franchise Royalty 25% line; keep CIREG Profit Share 65% ** only
- [x] Item 6: Canon doctrine data wiring (FutureTab + ProFormaPage aligned to same values)
- [x] Item 7: Angel card role label → "Agent – Marketing Coordinator"
- [x] Item 8: Jarvis card role label → "Agent – COO"
- [x] Item 9: Zoila card role label → "Broker/Agent – Office Director"
- [x] Item 10: CPS1 label → "CPS1 + CIRE Node" everywhere (FutureTab legend row2 + ProFormaPage legend row2)
- [x] Item 11: Richard card role label → "Strategic Advisor – AnewHomes Co. Partner" · stream label "AnewHomes 10%"
- [x] Item 12: PDF filename → Christies_EH_Flagship_Pro_Forma (pdf-route.ts URL_TO_FILENAME updated)

## Dispatch Addendum · HOME Letter Surface · April 21 2026

- [x] Restore James Christie portrait: left of letter block, 120-140px square, 1px gold #947231 border, caption "JAMES CHRISTIE · LONDON · 1766" (Georgia italic, 9pt, gold #947231, letterspaced, centered beneath frame), pure provenance marker — NOT linked, NOT a button
- [x] Restore "CONTINUE TO MARKET REPORT →" CTA: centered below signature block, gold #947231 text on dark navy, 11px letterspaced caps, hover → gold-filled bg + navy text, routes to /report
- [x] Audit Dashboard/founding letter quality — v15 confirmed live, 11 paragraphs intact, voice architecture correct, em-dashes preserved, signature block clean
- [x] Diagnose and fix PDF export speed: /pro-forma and all other PDF pipes — expanded fast-track to /pro-forma, /letters/*, /cards/* (domcontentloaded + 1200ms vs networkidle0 + 2000ms)

## Dispatch Addendum 2 · Three Final Items Before Publish · April 21 2026

- [x] Item A1: Swap ticker ^TYX → ^TNX in market-route.ts so "10Y TREASURY" label matches actual 10-Year Treasury data
- [x] Item A2: Extend isPdfMode cream substrate to ProFormaPage Pages 3 and 4 — all 4 pages now receive isPdfMode; Page3 inner boxes + GCI banner cream-wired; storageProxy TS error also fixed (0 TS errors total)
- [x] Item A3: Fix MapsTab.tsx liveCis TypeScript errors — added liveCis?: number to HamletData interface in hamlet-master.ts; 0 TS errors confirmed across full codebase

## Dispatch Item 4 · Zoila Vesting Footnote Canon · April 21 2026

- [x] Propagate canonical Zoila footnote to FutureTab.tsx footnotes section
- [x] Propagate canonical Zoila footnote to ProFormaPage.tsx Page 2 footnotes (line 597) and Page 3 footnotes (line 725)
- [x] Verify Pages 3 & 4 cream substrate renders correctly in browser — CONFIRMED: all inner boxes cream (#faf7f1) in ?pdf=1 mode, no dark navy visible

## Speed + Letter Audit · April 21 2026

- [x] Diagnose Pro Forma page load speed — root cause: 6 uncached Google Sheets API calls per page load (4-8s)
- [x] Fix Pro Forma speed: added 5-minute server-side in-memory cache to readGrowthModelData, readGrowthModelVolume, getPipelineKpis, readAscensionArcData — cache hit = ~0ms vs ~2-4s cold
- [x] Audit Manny letter: TTS confirmed eleven_turbo_v2 — correct. Soli Deo Gloria removed (doctrine violation). Letter bumped to v15 FINAL.
- [x] Fresh-eyes full site report delivered to council

## Dispatch Addendum 3 · Post-Publish Polish · April 21 2026

- [x] Intel tab: force dark navy substrate on Miro embed wrapper, Trello wrapper, Calendar wrapper, and Corkboard wrapper — all Intel surfaces now dark navy
- [x] Intel tab: Corkboard moved above Calendar; confirmed always-open (no toggle existed)
- [x] Maps tab: all 11 hamlet cards rendered as responsive grid — photo, CIS badge, Anchor, Local Spot, Secret, Practical Note — dropdown selector removed
- [ ] HOME: swap YouTube embed to Ed's correct video URL (URL pending from Ed — placeholder in code)
- [ ] DEFERRED Sprint 17: Market tab overhaul — WIP indicator, data currency audit, CIS-badge-worthy report
- [ ] DEFERRED Sprint 17: CIS Calculator refinement — Perplexity lens walkthrough first

## HOME Video Swap · April 21 2026
- [x] Upload JamesChristie-RabbitHole.mov to CDN — /manus-storage/JamesChristie-RabbitHole_79659439.mov
- [x] Replace YouTube embed in HomeTab.tsx with native video player — Ed's video added as V0 (first), V1/V2/V3 follow in order; YouTube iframe removed; EmbedFrame import cleaned up

## One Fell Swoop Dispatch · April 21 2026
### ACTION ITEMS
- [ ] Item 1: Fix CPS-7 → CPS-1 on /pro-forma Page 1 footnote + all other CPS-7 references in codebase
- [ ] Item 2: Unify James Christie caption to "James Christie · London · 1766" across HOME and /letters/* (same font, size, color, position)
- [ ] Item 3: Richard role label — confirm "Strategic Advisor – AnewHomes Co. Partner" is live; fix any remaining "Strategic Mentor" in docs/memos
- [ ] Item 4a: Seed CIS Calculator Buy-Renovate-Hold lens with reasonable defaults (renovation context)
- [ ] Item 4b: Seed CIS Calculator Buy-Rent lens with reasonable defaults (rental income context)
- [ ] Item 11: Warm Sheets cache on server startup — add pre-warm call in server/_core/index.ts
- [ ] Item 12: Add Market tab WIP banner "Data as of Q4 2025 · Full refresh in progress" (small, italic, gold)
### VERIFY ITEMS (confirm only, no code if already shipped)
- [ ] Item 5: HOME YouTube → Ed's video confirmed
- [ ] Item 6: Arc 2025 baseline bar — BASELINE label or 60% opacity rendered
- [ ] Item 7: Intel Corkboard above Calendar, default open
- [ ] Item 8: Intel tab all 4 surfaces dark navy
- [ ] Item 9: Maps 11-hamlet grid below map
- [ ] Item 10: William audio still live on HOME tab
### DEFERRED · SPRINT 17
- [ ] DEFERRED: /pro-forma partner cards migrate from bundle-baked to live OUTPUTS binding
- [ ] DEFERRED: Ed card hierarchy spacing + Assumptions panel tone refinement
- [ ] DEFERRED: Ed card third consolidated "not included in total" line

## Apr 22 Dark Theme Pass

- [x] Global dark theme: hero background image anchored to all pages via DashboardLayout
- [x] HOME subtitle font increased (larger, more prominent)
- [x] All tab outer wrappers set to transparent (hero shows through)
- [x] MarketTab: outer wrapper, sections, rate cards, hamlet tiles, section header — all dark
- [x] PipeTab: outer wrapper, KPI chips, filter inputs, table rows, Add Deal form, modal — all dark
- [x] IntelTab: outer wrapper, cards, calendar, document library — all dark
- [x] MapsTab: hamlet cards (always dark, not conditional), detail panel links — all dark
- [x] EstateAdvisoryCard: rewritten for dark theme (cream text on dark background)
- [x] matrix-card CSS class: background changed from white to dark semi-transparent
- [x] Corkboard iframe height expanded from 680px to 1200px (wide open above Miro board)

## Deal Engine v1 + Dark Theme Cleanup (Dispatch Apr 21 2026)

- [ ] CIS kill globally — remove all rendered CIS strings, score badges, 0-10 rankings (grep-zero acceptance)
- [ ] MARKET dark theme — outer wrapper, donut, rate cards, hamlet tiles all to dark navy
- [ ] PIPE dark theme — tbody rows to dark navy, alternating rows 5% lighter, text cream
- [ ] MAPS dark theme — kill white vertical bars on right-side column wrapper
- [ ] HOME dark theme — custom dark video/audio player replacing browser chrome
- [ ] Deal Engine tRPC backend — trpc.dealEngine.score with all formulas per spec
- [ ] Deal Engine UI on MAPS tab — six inputs, output panel, Pro Mode drawer, hamlet dropdown
- [ ] Deal Engine PDF export — ANEW Deal Memo two-page layout
- [ ] Acceptance Test 1 — 17 Lenape 12/12 pass
- [ ] Acceptance Test 2 — 140 Hands Creek zero drift
- [ ] Acceptance Test 3 — Griff Sonoma (Kinley + Vellutini)

## Deal Engine v1 + Dark Theme Cleanup (Dispatch Apr 21 2026)

- [ ] CIS kill globally -- remove all rendered CIS strings, score badges, 0-10 rankings (grep-zero acceptance)
- [ ] MARKET dark theme -- outer wrapper, donut, rate cards, hamlet tiles all to dark navy
- [ ] PIPE dark theme -- tbody rows to dark navy, alternating rows 5% lighter, text cream
- [ ] MAPS dark theme -- kill white vertical bars on right-side column wrapper
- [ ] HOME dark theme -- custom dark video/audio player replacing browser chrome
- [ ] Deal Engine tRPC backend -- trpc.dealEngine.score with all formulas per spec
- [ ] Deal Engine UI on MAPS tab -- six inputs, output panel, Pro Mode drawer, hamlet dropdown
- [ ] Deal Engine PDF export -- ANEW Deal Memo two-page layout
- [ ] Acceptance Test 1 -- 17 Lenape 12/12 pass
- [ ] Acceptance Test 2 -- 140 Hands Creek zero drift
- [ ] Acceptance Test 3 -- Griff Sonoma (Kinley + Vellutini)

## Apr 22 Session 2 — Corkboard + Hamlet Borders + Trello Overflow
- [x] CorkboardLayer: replaced overflowX:auto wrapper with ResizeObserver-based CSS transform scale-to-fit — corkboard now scales down on mobile viewport
- [x] Hamlet card borders: all 11 hamlet tiles now use MatrixCard variant="active" — consistent gold left border on every card (was: only Ultra-Trophy had gold border)
- [x] Trello board grid: changed from repeat(3,1fr) to repeat(auto-fill,minmax(160px,1fr)) — cards wrap properly on mobile, no right-side cutoff
- [x] Tests: 54/54 passing

## Apr 22 Session 2 — Corkboard + Hamlet Borders + Trello Overflow
- [x] CorkboardLayer: ResizeObserver-based CSS transform scale-to-fit — scales down on mobile
- [x] Hamlet card borders: all 11 tiles now variant=active — consistent gold left border
- [x] Trello board grid: auto-fill minmax(160px,1fr) — wraps on mobile, no cutoff
- [x] Tests: 54/54 passing

## Wednesday PM Commit + Immediate Fixes (Apr 22 2026)
- [ ] HOME video reel: fix titles only (order correct) — 1.250 Years 2.Life Less Ordinary 3.Christie Estate Services 4.Rabbit Hole
- [ ] IntelTab corkboard: center horizontally (currently left-justified)
- [ ] Pro-forma Page 3: fix massive empty gray rectangle below partner cards (hard blocker)
- [ ] Pro-forma CPS-1 cap: clarify/fix .5M cap footnote — per-year-per-node vs cumulative; confirm 2036 value
- [ ] CIS Sheet 03 caption leak + all 13 sheet captions swept
- [ ] NeighborhoodCardPage.tsx: remove CIS map overlay badges (rendered content)
- [ ] PIPE SOLD LISTINGS 2026 header row: navy background
- [ ] PIPE tbody: dark rows (alternating 5% lighter, cream text)
- [ ] MARKET cream bleed: confirm status, ship if not in 8368bb22
- [ ] CPS-7 -> CPS-1 on /pro-forma Page 1 footnote + all other CPS-7 references
- [ ] James Christie caption: unified across HOME + all /letters/* routes
- [ ] Browser-render grep: zero CIS matches across all public routes

## Apr 22 Council Brief · ~11:30 AM EDT

- [ ] HOME: Fix video 2 title to "250 Years of History", video 3 to "A Life Less Ordinary"
- [ ] TASK 1 P0: INTEL tab contrast — lift body text/card titles to ivory on Canonical Data Sources + Canon Documents blocks
- [ ] TASK 2 P0: /future CPS1 patch — all 7 partner cards to canonical curve (00K→.13M), unified footnote
- [ ] TASK 3 P0: MAPS tab reorder — Map → Deal Engine → Hamlet Highlights
- [ ] TASK 4 P1: /report PDF — kill TikTok iframe in print, tighten dead zones pages 1/3/4/7/8
- [ ] TASK 5 P1: /pro-forma?pdf=1 print verification — all 7 cards, CPS1 .13M, doctrine footer, zero dead zones

## Apr 22 Council Dispatch — Tasks 6-8

### Task 6 · Corkboard Content Refresh
- [x] Replace Miro embed with canonical six-quadrant operational layout (Feb 2026 ruling)
- [x] Quadrant 1: THE PULSE — Numbers Box · Top 3 Ed/Angel · Waiting On · Touch Minimums
- [x] Quadrant 2: THE PIPELINE — Active Listings · Buy Side · Auction House Intros · ANEW Projects
- [x] Quadrant 3: THE NETWORK — Key Relationships · NYC Contacts · Attorneys · Recruit Targets
- [x] Quadrant 4: THE CALENDAR — Headline Events · Private Collector Series · Wednesday Caravan
- [x] Quadrant 5: THE FOCUS — Current hamlet intelligence + active deal priorities
- [x] Quadrant 6: THE COMPASS — Doctrine line · Soli Deo Gloria · daily mentor anchor
- [x] Text fix: "Angel Day One · April 25" (not "starts")
- [x] Text fix: "Ilija Pavlovic" (one i, one c)
- [x] Text fix: "Key Relationships" (not "Whales")

### Task 7 · Morning Report Surface
- [x] Add "Today's Brief" block to HOME tab
- [x] Renders today's AM Bruehl Brief (Hamptons 200w · Markets 200w · Art 200w)
- [x] Updates daily at 5:55 AM when William fires
- [x] Click-to-listen via William voice
- [x] Click-to-print PDF export

### Task 8 · Orphan Asset Surfacing
- [x] /letters/flagship → HOME footer
- [x] /letters/christies → HOME footer
- [x] /letters/angel → INTEL tab Canon Documents
- [x] /letters/welcome → HOME footer
- [x] /council-brief → INTEL tab
- [x] /architecture-of-wealth → INTEL tab
- [x] /cards/uhnw-path → FUTURE tab
- [x] /cards/bike → MAPS tab

## Apr 22 · AnewHomes § Canonical Truth Pass

- [x] Add § marker to AnewHomes lines on 6 partner cards (Ed, Angel, Jarvis, Zoila, Scott, Richard)
- [x] Add § footnote text to pro forma Page 3 footnote block (after CPS1 ‡ footnote)

## Apr 22 · Five Regression Fixes (12:45 PM Dispatch)

- [ ] FIX 1: Remove gray dead zone from pro forma PDF Page 2 (print-mode page-break discipline)
- [ ] FIX 2A: FUTURE tab — lift 100-day block body text to cream/ivory
- [ ] FIX 2B: FUTURE tab — hide PAGE 2 OF 3 label on screen (print-only)
- [ ] FIX 2C: FUTURE tab — force arc chart dollar labels above bars (never inside)
- [ ] FIX 3: Rename corkboard title to "Christie's Flagship Corkboard" across all surfaces
- [ ] FIX 4: Rename Assumptions header to "MODEL ASSUMPTION LEVERS"
- [ ] FIX 5: Wire corkboard v3 full native layout (six quadrants + KPI tiles + Ten Commandments + Council Cortex + Contact block)
- [ ] Print-mode discipline: verify zero dead zones on all PDF-target routes before staging ack

## Apr 22 · FIX 6 — Canonical Reference Docs on INTEL Tab
- [x] Add "CPS1 + CIRE Node Canonical Reference" Drive link to INTEL Canon Documents
- [x] Add "AnewHomes Co. Canonical Reference" Drive link to INTEL Canon Documents
- [x] Add "Christie's Flagship Corkboard Canonical Content" Drive link to INTEL Canon Documents

## Apr 22 · Four Cream Print Fixes · /future?pdf=1

- [ ] FIX P1: Cream arc chart (v7_2 DNA) — #faf7f1 substrate, #2c2c2a mat, 2px black border, label #3a3a3a, max:3500 + clip:false, Page 1 of 2 marker
- [ ] FIX P2: Cream 100-day blocks (v15 cream half) — pg-c/card-c/ch-c/cb-c/sh-c/bd-c classes, 5px accent bars, #efe6d1 sub-headers, body #2a2a2a
- [ ] FIX P3: Cream Page 2 (v14_3b) — all 7 partner cards + legend + Model Assumption Levers + 5 footnotes + footer
- [ ] FIX P4: Cream Client Resource block (v17) + global print dead zone CSS fix (dashboard-layout-wrapper min-height:auto)
- [ ] Print PDF via Puppeteer, verify 2 pages, attach to Trello JiaVQXzY

## Apr 22 · Canonical Cream Print Rewrite (Dispatch 01 + 03)
- [x] Drop in FutureTabPrintCream.tsx (Claude reference — 5 wireframes ported)
- [x] Wire FutureTab.tsx: isPdfMode guard at top → render FutureTabPrintCream, fix PrintFutureButton to navigate to ?pdf=1
- [x] Strip future-print.css to @page rules + screen-chrome hiding only (delete dark-navy block)
- [x] Verify 12-item acceptance test against rendered PDF
- [ ] Post staging ack to Trello with PDF attached
- [ ] Corkboard-to-INTEL reversal: embed Eds_Corkboard_v3.pdf at top of INTEL tab (separate commit)
- [ ] Retire Morning Home nav entry

## Dispatch 06 · Arc Chart Canonical Rebuild · Apr 22 late evening
- [ ] FutureTabPrintCream.tsx: delete anewHomes + cps1 arrays, delete ehCore subtraction, render ehTotal directly
- [ ] FutureTabPrintCream.tsx: strip AnewHomes + CPS1 from Chart.js datasets (3 datasets only)
- [ ] FutureTabPrintCream.tsx: delete second legend row, reduce to 1 row / 3 swatches
- [ ] FutureTabPrintCream.tsx: delete COLOR_ANEWHOMES and COLOR_CPS1 constants
- [ ] FutureTab.tsx: audit live dashboard arc chart for D59 Live-Print Unity — same three-office rule
- [ ] ProFormaPage.tsx: audit for arc chart — apply same three-office rule if present
- [ ] 13-item acceptance test pass
- [ ] Checkpoint + Trello post to card 69OEdJ1i

## Bug Fix — Apr 22 2026 (Session Continuation)

- [x] brief.getToday: wrap DB query in try/catch — returns null gracefully on DB failure instead of throwing INTERNAL_SERVER_ERROR. Fixes "The string did not match the expected pattern" error on HOME tab. 54/54 vitest passing.

## Dispatch 13 V3 · FUTURE Tab Pro Forma · Apr 23 2026

- [x] Apply 13_FutureTabPrintCream.WIRED.V3.tsx as drop-in replacement (pasted_content_12.txt)
- [x] Fix Jarvis base2026 → $250K (caps at 2035 per D64 doctrine)
- [x] Fix fmtK() to round to nearest $1K (clean display, no decimal drift)
- [x] 11/11 acceptance test PASS: Scott $774K · Jarvis $1M cap 2035+2036 · Angel $361K · Zoila $516K · Zoila full parity · Ed $3.60M/$2.52M
- [x] Build clean (0 TS errors, no new warnings) · Vitest 54/54

## Council Final · Apr 23 2026 · Six Lanes

### Lane 2 · CIS Purge
- [x] Delete CISBadge.tsx
- [x] Delete PublicPage.tsx
- [x] MarketTab.tsx: strip badge, liveCis, CIS bar, CIS-desc sort, footer
- [x] MapsTab.tsx: rename CIS Calculator → ANEW Deal Engine; remove badges; keep 4-field block
- [x] NeighborhoodCardPage.tsx: remove CISBadge + cis field
- [x] ReportPage.tsx: scrub L342-350 bespoke letter (replaced by FoundingLetter in Lane 3)
- [x] HomeTab.tsx: rewrite L296 CIS ref
- [x] pdf-exports.ts: remove all CIS rows (file dies entirely in Lane 6)
- [x] hamlet-master.ts: delete/rename anewScore; strip CIS matrix fields
- [x] hamlet-highlights.json: strip cis field from every entry
- [x] Remaining 10 files: strip CIS refs per Perp scope
- [x] Acceptance: grep CIS/Christie's Intelligence Score = zero matches

### Lane 3 · Letter Canon
- [x] Extract HomeTab.tsx L31-44 to client/src/content/founding-letter.ts
- [x] Create FoundingLetter.tsx shared component
- [x] HomeTab.tsx: import FoundingLetter (replaces inline paragraphs)
- [x] ReportPage.tsx: import FoundingLetter (retires L342-350 + signed close)
- [x] server/tts-route.ts: import FLAGSHIP_LETTER_TEXT
- [x] Acceptance: grep "For twenty years on the East End" = exactly ONE match

### Lane 4 · UHNW CTA Removal
- [x] Remove "Open Card" CTA from /future footer (UHNWCardLink component)

### Lane 5 · Shell Purge
- [x] Build PageShell + SectionFrame primitives
- [x] Kill blue hex #0B2545, #1E3A5F, blue-900 outside PageShell scrim
- [x] Apply PageShell to all 7 routes: HOME, MARKET, MAPS, PIPE, FUTURE, INTEL, REPORT
- [x] PhotoMatrix: auto-fill responsive grid (1/2/3 col breakpoints)
- [x] Delete legacy V1/V2 component files
- [x] HOME: hide "Today's Brief" block until William fires (null → hidden)
- [x] Acceptance: screenshots at 375/768/1440px show single Christie's environment, no blue slabs

### Lane 6 · Screenshot-to-PDF
- [x] Confirm html2canvas in package.json (or install)
- [x] Build captureToPdf() helper in client/src/lib/capture-pdf.ts
- [x] Wire Download PDF button to every route (HOME/MARKET/MAPS/PIPE/FUTURE/INTEL/REPORT)
- [x] Wire Download Market Report button to /report (full stacked scroll)
- [x] Delete FutureTabPrintCream.tsx
- [x] Delete pdf-exports.ts (entire file)
- [x] Remove ?pdf=1 branch from FutureTab.tsx
- [x] Acceptance: grep FutureTabPrintCream|generateMarketReport = zero matches

### Chat Scope Guards (folded into Lane 5)
- [x] PhotoMatrix: 3 col ≥900px, 2 col 640-900px, 1 col <640px, consistent gap, consistent image ratios, no overflow, no misaligned last row
- [x] HOME Today's Brief: hide block conditionally when brief is null (one-line conditional, not a feature build)
- [PARKED] REPORT lower-third rebuild (five-endings composition) — Phase 2
- [PARKED] INTEL hierarchy below corkboard — Phase 2
- [PARKED] MAPS/MARKET content restructuring — Phase 2

## P0 Regression · Apr 23 2026
- [x] ReportPage.tsx: add missing `import { FoundingLetter } from '@/components/FoundingLetter'`
- [x] Grep all files using `<FoundingLetter />` and confirm imports are present (HomeTab.tsx had it; ReportPage.tsx was missing it — fixed)
- [x] Rebuild clean (0 TS errors)
- [x] Checkpoint saved (6a4d8ff5), pushed to origin/main, ready to republish

## P0 Regressions · Apr 23 2026 (Perp Visual Audit)
- [ ] P0-1: Routing regression — /maps, /pipe, /intel render HomeTab content. Restore each route to its dedicated component.
- [ ] P0-2: FUTURE V3 canon — Scott 2036 shows $324K (V1), Jarvis 2035 shows $868K uncapped (V1). Must show $774K / $1M cap flat. Verify TEAM_BASES + projectPersonalGci() is the actual data source, not a stale ROSTER read.
- [ ] P0-3: Governing principle copy — live /future footnote says "20% year-over-year, uncapped." Must say "20% year-over-year to $1M cap then flat."
- [ ] P0-4: Duplicate East End Spotlight on /market — remove the duplicate.

## Six-Item Commit · Apr 23 2026

- [ ] Item 1: Add GitHub remote (edbruehl-blip/christies-east-hampton-site) + push to both remotes
- [ ] Item 2: Publish 6a6d8b04 to production (P0-1 routing fix live) — done via Management UI
- [ ] Item 3: P0-4 orphan section on /report — remove stray LastSignificantSale/RateEnvironment between Atlas and Maps
- [ ] Item 4: Issue #1 AH Profit fix — FutureTab.tsx L653-664 ahGci Y1=$50K Y2=$150K 12.5% growth to $432K 2036
- [ ] Item 5: Issue #1 CONFIDENTIAL strip — remove "CONFIDENTIAL" from Page 1 header + "internal only" from Page 2 footer
- [ ] Item 6: Issue #2 Trello matrix — IntelTab.tsx L180 TRELLO_LANES + L215 count text (13 tiles / 188 cards)

## Council Sync · Apr 23 2026 · Six-Item Commit

- [x] Item 1: GitHub remote added (github/main at 5a5bab3) — done
- [x] Item 2: 6a6d8b04 published to production — done
- [x] Item 3: P0-4 orphan Section3Condensed removed from /report — done (5a5bab3)
- [ ] Item 4: Issue #1 AH Profit verify — confirm live /future shows $433K for AnewHomes 2036
- [ ] Item 5: Issue #1 CONFIDENTIAL strip — remove dead CONFIDENTIAL_BANNER code + "internal use only" from Page 4 footnote
- [ ] Item 6: Issue #2 Trello matrix — update to 16 lists / 213 cards with new lane data
- [ ] Post Manny tool inventory to Trello 69OEdJ1i
- [ ] Close GitHub Issue #1 (items 2,3,5 superseded by D65; item 6 Nest orphan verified clean)
- [ ] Close GitHub Issue #2 on ship

## P0-B D65 Shell Purge — Apr 23 2026

- [x] FutureTab: delete useIsPdfMode hook, all isPdfMode branches, PrintFutureButton, LOGO_BLACK import, cream BG token
- [x] SiteFooter: delete hiddenInPdfMode prop and ?pdf=1 check — renders unconditionally
- [x] ReportPage: delete useIsPdfMode hook, remove {!isPdfMode && <BackBar />} conditional — BackBar always renders
- [x] future-print.css: remove cream/light @media print color overrides, keep only @page rules + screen-chrome hiding
- [x] S1 doctrine: audit all 7 routes — no route may inject its own background system outside PageShell
- [x] R7 doctrine: REPORT lower-third ends once — one continuous closing sequence, one canonical SiteFooter, no stacked endings
- [x] Verify /future?pdf=1 pixel-identical to /future in browser — isPdfMode deleted from all dashboard routes; DashboardLayout nav always renders

## Shell Purge Round — Full Commit — Apr 23 2026

### P0 NAV BUG (S2)
- [ ] /future route: restore global sticky nav — diagnose FutureTab.tsx / ProFormaPage.tsx for local header that replaces global nav
- [ ] Acceptance: load /future, scroll 500px, global nav stays visible and matches /maps /pipe /market /intel /report

### D69 INTEL Corkboard Navy (R6)
- [ ] Convert IntelTab corkboard from cream/ivory substrate to Glass Atmospheric Frame (~75% opacity navy, subtle blur, faint gold border)
- [ ] Card interiors: navy surface, ivory/gold text on dark (same hierarchy as Command Board tiles)
- [ ] Red COMPASS card stays but on darker navy, not cream
- [ ] Preserve all content verbatim

### S3 Legacy Slab Kill
- [ ] Kill all 14 V1/V2 legacy slab hits identified by L13 grep

### S4 SiteFooter Rollout
- [ ] Add SiteFooter to HOME route
- [ ] Add SiteFooter to MARKET route
- [ ] Add SiteFooter to MAPS route
- [ ] Add SiteFooter to PIPE route
- [ ] Add SiteFooter to FUTURE route
- [ ] Add SiteFooter to INTEL route

### R1-R8 Route Fixes
- [ ] R1 HOME: Today's Brief collapse when empty
- [ ] R2 MARKET: donut Glass frame
- [ ] R3 MAPS: unified lane
- [ ] R4 PIPE: padding tighten
- [ ] R5 FUTURE: top inside hero shell
- [ ] R8 PhotoMatrix: responsive 1/2/3

### Issue #2 INTEL Trello Matrix
- [ ] Drop Perp's 16-tile array (Trello card 69OEdJ1i) into IntelTab.tsx line 180
- [ ] Update line 215 text to "213 cards · 16 lists"

### ProFormaPage D65 Audit
- [ ] Grep /pro-forma for useIsPdfMode / isPdfMode / pdfMode / PrintFutureButton / cream imports
- [ ] Apply D65 treatment if found

## Full Purge Commit — Apr 23 2026 (single push)

- [x] CouncilBriefPage: kill useIsPdfMode (8 hits), cream-always single render
- [x] FlagshipLetterPage: kill isPdfMode inline check (7 hits), cream-always single render
- [x] ChristiesLetterPage: kill isPdfMode (6 hits), cream-always single render
- [x] NeighborhoodCardPage: kill isPdfMode (3 hits), cream-always single render
- [x] UHNWPathCardPage: kill isPdfMode (3 hits), cream-always single render
- [x] IntelTab L182: replace 13-lane array with canonical 16-lane 213-card Trello array
- [x] IntelTab L215: update count text to '213 cards · 16 lists'
- [x] IntelTab L201: remove inline slab background '#1B2A4A' on TrelloLayer wrapper
- [ ] S1: audit all 7 dashboard routes — no self-injected backgrounds outside PageShell
- [ ] S3: kill remaining 4 Lane 13 legacy slab hits in dashboard routes
- [ ] S4: canonical SiteFooter on all 7 dashboard routes
- [ ] Acceptance grep: zero isPdfMode/useIsPdfMode across all purge targets
- [ ] Vitest green, build clean, push both remotes

## P2 /future PDF Button — Apr 23 2026
- [x] Read capture-pdf.ts and FutureTab to map Pro Forma capture boundaries
- [x] Add captureProFormaPDF() function to capture-pdf.ts (html2canvas, navy substrate, no isPdfMode)
- [x] Place gold button in FutureTab Pro Forma header strip (right of LIVE indicator)
- [x] Wire three button states: default (gold border/text), hover (gold fill/navy text), capturing (faded + spinner)
- [x] Filename: christies-east-hampton-proforma-YYYY-MM-DD.pdf
- [x] Acceptance: correct filename, 2 pages, chart+legend+100-day+partner cards, navy preserved, no browser chrome
- [x] Vitest green, build clean, grep isPdfMode zero
- [x] Checkpoint + push both remotes

## L10 Cascade — Five Commits (Perp/Chat Verified · Apr 23 2026)

- [ ] F1 · P0 · /report Section 6 cream slab → navy glass (#1B2A4A + gold border + flipped interior tokens)
- [ ] F2 · P1 · PDF reflow — deterministic 2-page split via data-pdf-page markers; kill white bar artifact on p2
- [ ] F3 · P2 · MAPS GoldBlackFrame + FloatingCard primitives; wrap map container, 11 hamlet cards, ANEW Deal Engine panel
- [ ] F4 · P2 · Corkboard START HERE — swap red block to Q1, rewrite content, shift Q2-Q6, COMPASS drops to banner strip
- [ ] F5 · P3 · SiteFooter rhyme — gold-gravure marquee line, compressed vertical stack, bottom echo strip

## L10 + Deal Engine Trust Round — Six Commits (Consolidated · Apr 23 2026)

- [x] F1 · P0 · /report Section 6 cream slab → navy glass (#1B2A4A + gold border + flipped interior tokens)
- [x] F2 · P1 · PDF reflow — deterministic 2-page split via data-pdf-page markers; kill white bar artifact on p2
- [x] F3 · P2 · MAPS GoldBlackFrame + FloatingCard primitives; wrap map container, 11 hamlet cards, ANEW Deal Engine panel
- [x] F4 · P2 · Corkboard START HERE — swap red block to Q1, rewrite content, shift Q2-Q6, COMPASS drops to banner strip
- [x] F6.5a · Deal Engine — Export button ReferenceError fix (import toast, dealRef, captureToPdf)
- [x] F6.5b · Deal Engine — Pro Mode zero-drop fix (Number.isFinite guard on 6 inputs)
- [x] F6.5c · Deal Engine — CoC denominator = basis (test updated -9.3%→-2.3%, fmtPct guard)
- [x] F6.5d · Deal Engine — holdYears=0 silent fail → client-side validation ≥1
- [x] F6.5e · Deal Engine — URL hash state mirror (base64 round-trip, shareable links)
- [x] F6.5f · Deal Engine — Field clarity (labels, currency blur format, group spacing)
- [x] F6.5g · Deal Engine — Reset / New Property button with toast confirm
- [x] F5 · P3 · SiteFooter rhyme — gold-gravure marquee line, compressed vertical stack, bottom echo strip

## F6.5c Revert + F6.5h Trust Language — One Commit (Apr 23 2026)
- [x] F6.5c-revert: dealEngine.ts — equity denominator restored, null guard live (equity > 0 ? ... : null)
- [x] F6.5c-revert: dealEngine.test.ts — -9.3% restored, L22-CANARY null-guard tests added (equity=0 → null, negative equity → null)
- [x] F6.5c-revert: ANEWDealEngine.tsx — relabeled "Cash-on-Cash Return", fmtPct null→"—", ⓘ tooltip
- [x] F6.5h: Panel header → "One indication"
- [x] F6.5h: Code comments "verdict" → "indication" (tombstone comment preserved)
- [x] Vitest 57/57 green (excl. pre-existing Perplexity TLS) + 3 stress tests all ✓
- [x] Checkpoint + push both remotes

## Shell Purge P2 — H1-H7 (Apr 23 2026)
- [ ] PRE-COMMIT: Run full grep audit (cream hex, address/phone/email, footer components) and post to Trello 69OEdJ1i
- [ ] H1 · HOME double footer — normalize to exactly one SiteFooter
- [ ] H2 · HOME video matrix white slab → navy glass / FloatingCard
- [ ] H3 · /report two different-colored footers → exactly one canonical SiteFooter
- [ ] H4 · /report Section 4 Hamlet Atlas Matrix cream → navy + FloatingCard
- [ ] H5 · Legacy slab purge (/, /report, /maps, /deal-engine, /proforma, /corkboard, /future)
- [ ] H6 · ReportPage.tsx section inventory comment block at top of file
- [ ] H7 · Address/phone/email canon — kill all drift variants, enforce 26 Park Place / 646-752-1233 / edbruehl@christiesrealestategroup.com
- [ ] Vitest green, checkpoint, push both remotes, post commit hash + screenshot triplet to Trello

## Shell Purge P2 + H8 (Apr 23 2026 — Ed GO)
- [ ] H1 · HomeTab.tsx:482 — remove duplicate <SiteFooter />
- [ ] H2 · ReportPage.tsx:1743 — YouTubeMatrix background #FAF8F4 → #1B2A4A + interior label color flip
- [ ] H3 · ReportPage.tsx:1624 — remove duplicate copyright line from Section 6 closing block
- [ ] H4 · ReportPage.tsx:1186 — Section 4 Hamlet Atlas #FAF8F4 → #1B2A4A; wrap 11 hamlet cards in FloatingCard
- [ ] H5 · confirmed no additional surfaces (H2+H4 cover full scope)
- [ ] H6 · ReportPage.tsx — insert section inventory comment block after imports
- [ ] H7a · SiteFooter.tsx:126,127,225 — ed.bruehl@christies.com → edbruehl@christiesrealestategroup.com
- [ ] H7b · ProFormaPage.tsx:699 — drop O: 631.771.7004
- [ ] H7c · UHNWPathCardPage.tsx:306 — drop O: 631.771.7004
- [ ] H8 · INTEL Layer 1 — Miro embed fix (uXjVGj6Oc40=) — must visibly render, not placeholder
- [ ] Vitest green, checkpoint, push both remotes, post commit hash + screenshot triplet to Trello 69OEdJ1i

## Shell Purge P2 — H5 + H8 Addendum (Apr 23 2026 — Ed pasted_content_23)
- [x] H5 · ReportPage.tsx:487 — Section 2 outer <section> background #FAF8F4 → #1B2A4A navy (7 interior token inversions)
- [x] H8 · IntelTab.tsx — Miro embed Option B: loading shimmer + branded CTA fallback card (onLoad cross-origin detection + onError, navy+gold, FloatingCard family)

## Four-Kill Canon Cleanup (Apr 23 2026 — Perp sweep of 8e7b76c7)
- [x] Kill 1 · FlagshipLetterPage.tsx line 46 — `const handlePrint = () => window.print();` restored
- [x] Kill 2 · SiteFooter.tsx lines 122-123, 223 — 631.324.6400 → 646-752-1233
- [x] Kill 3 · SiteFooter.tsx line 235 — literal " EDT" suffix removed
- [x] Kill 4 · state.json lines 45, 50, 51, 674 — phone_office + canonical_contact_rule updated to 646-752-1233
- [x] Acceptance greps all zero, Vitest 59/59 ✓

## Housekeeping Commit — Delete-Only (Apr 23 2026)
- [x] Delete 8 orphaned components: AIChatBox.tsx, AuctionHouseServices.tsx, DashboardLayoutSkeleton.tsx, EmbedFrame.tsx, ManusDialog.tsx, NewsletterManager.tsx, OperatorControlPanel.tsx, PrivateTabGate.tsx
- [x] Delete SectionFrame.tsx + PageShell.tsx
- [x] Remove phone_office field from state.json
- [x] Vitest 59/59, zero broken imports, phone_office zero ✓

## Backlog — Polish Commit (after /market PDF closes)
- [ ] B1 · HOME video thumbnails — add poster attribute to 4 <video> elements (option 2: YouTube thumbnail if YT-sourced, option 1: mid-frame extract otherwise)
- [ ] B2 · HOME "Today's Brief" widget — hide body until Bruehl Brief feed is wired (option 2: hide empty header, not option 3 placeholder)

## /market PDF Button Round (Apr 23 2026)
- [x] Wire MARKET PDF button to canonical Puppeteer capture path (GET /api/pdf?url=/market)
- [x] Kill Sprint 14 tombstone comment, restore <MarketReportPdfButton /> render
- [x] Update button label to "DOWNLOAD MARKET PDF" per dispatch
- [x] Update filename to christies-east-hampton-market-{YYYY-MM-DD}.pdf per dispatch
- [x] No jsPDF in MARKET render path ✓ · Vitest 59/59 ✓

## SPA Routing Fix — Apr 23 2026 (P0 Deploy Blocker)
- [x] Diagnose: local production server returns HTTP 200 on all 7 routes — catch-all IS in serveStatic
- [x] Root cause: dist/ was stale (version 400398ea vs current b1971494) — old build deployed
- [x] Fix: pnpm run build regenerated dist/ from current source — version.json now b1971494
- [x] Vitest 59/59 after fresh build
- [x] Checkpoint + publish to force Manus platform to deploy fresh build

## Architecture Sprint Closeout — Apr 23 2026
- [x] P1: FALSE POSITIVE — /letters/flagship and /letters/angel render correctly on live site. /report/letter-* were audit test URLs that never existed.
- [x] P2: Hide Today's Brief on HOME when !isLoading && !brief — returns null from entire component, no heading, no wrapper, nothing mounted
- [x] P3: FALSE POSITIVE — Bitcoin shows in FUTURE ticker after page load. Audit screenshot was timing artifact (data still loading). No code change needed.
- [x] P4: FALSE POSITIVE — Bitcoin shows in MAPS ticker after page load. Same timing artifact. No code change needed.
- [x] P5: Added poster= attributes to all four HOME videos using Christie's CDN gallery stills
- [x] Vitest 59/59 gate — PASSED (11 test files)
- [x] Checkpoint + publish closeout commit

## Bruehl Brief Canon-Kill — Apr 24 2026 (Ed ruled 10:34 PM EDT)
- [ ] 1. HomeTab.tsx: delete TodaysBrief function + render, remove trpc import if orphaned, update order comment
- [ ] 2. server/routers.ts: delete entire brief router block (getToday + upsert)
- [ ] 3. drizzle/schema.ts: delete dailyBrief mysqlTable block and type exports
- [ ] 4. Delete client/src/components/BruehlBriefBulletin.tsx entirely
- [ ] 5. IntelTab.tsx: delete BruehlBriefBulletin import + commented render block
- [ ] 6. grep zero-hit verification: TodaysBrief|BruehlBrief|brief.getToday|dailyBrief|daily_brief
- [ ] 7. Vitest 59/59, pnpm build, checkpoint, publish, 90s wait, nine-curl gate, shipped signal

## Consolidated Closeout Commit — Apr 24 2026 (v2 — letter-content.ts fifty fix)
- [x] Scope 1-1: HomeTab.tsx — delete TodaysBrief function + render, remove trpc import, update order comment
- [x] Scope 1-2: server/routers.ts — delete entire brief router block + remove dailyBrief import
- [x] Scope 1-3: drizzle/schema.ts — delete dailyBrief table + type exports
- [x] Scope 1-4: Delete BruehlBriefBulletin.tsx file entirely
- [x] Scope 1-5: IntelTab.tsx — delete import + commented render block
- [x] Scope 1-6: grep zero-hit verification — zero hits confirmed Apr 24 2026
- [x] Scope 2: Flagship Letter date → "April 2026" (month only, no day)
- [x] Scope 3: FUTURE "Flagship 3-Yr Cumulative" → "Per-Producer 3-Yr Cumulative", audit 3 lever labels
- [x] Scope 4: Vitest 59/59, pnpm build, checkpoint, publish, 90s wait, nine-curl gate, shipped signal
- [x] /report Section 3/4 render order fix — Section3 (MARKET INTELLIGENCE) now renders before Section4 (HAMLET ATLAS MATRIX) — April 24 2026 daylight commit

## April 29 Pre-Launch Commit 1 — Four P0s (April 24 2026)

- [x] P0-1: Flagship Letter PDF print styles — keep header, swap logo black/white, wider margins, bigger body copy
- [x] P0-2: Auction Image Matrix slot-3 swap — room-fallback → auctionRoomIllustration (cdn-assets.ts 2-line change)
- [x] P0-3: FUTURE tab 100-day cards mobile responsiveness — responsive media queries at 390/768/1440px
- [x] P0-4: Market Report PDF Hamlet Atlas print visibility — button→div[role=button] + report-print.css rules

## Commit B Final v4 — Council Locked (Apr 24 2026)
- [ ] INTEL-1: Kill raw Miro/Trello/Calendar iframes — replace with branded preview cards linking out
- [ ] INTEL-2: Strengthen lower-half opacity (NineSheetMatrix, DocumentLibrary, IntelligenceWeb)
- [ ] INTEL-3: Keep Corkboard v3 + Start Here untouched
- [ ] REPORT-H2: ReportPage YouTubeMatrix background #FAF8F4 → #1B2A4A + interior label flip
- [ ] REPORT-H4: ReportPage Section 4 Hamlet Atlas unselected tile #FAF8F4 → #1B2A4A + token flip
- [ ] REPORT-F1: ReportPage Section 6 cream slab → navy glass (already navy — verify)
- [ ] PDF-F2: Add data-pdf-page markers to ReportPage sections for deterministic page breaks
- [ ] PDF-F2: Kill dead blank band — fix report-page-root id mismatch
- [ ] PDF-F2: Chrome + Safari print preview clean

## Commit B Final v4 (Apr 24 2026)
- [x] INTEL: kill raw Miro iframe chrome — replaced with branded preview card + Open in Miro link
- [x] INTEL: kill raw Calendar iframe chrome — replaced with branded preview card + Open Calendar link
- [x] INTEL: strengthen lower-half opacity — NineSheetMatrix, DocumentLibrary, IntelligenceWebLayer bg rgba(10,16,28,0.55)
- [x] /report Section 4: HamletTile navy mounted-object family — unselected bg #0D1B2A, cream text, gold border
- [x] /report Section 4: report-print.css hamlet atlas print rules updated to match navy family
- [x] PDF: add id=report-page-root to outer div — capture target now resolves correctly
- [x] PDF: add data-pdf-page="1/2/3" markers — deterministic 3-page split, kills dead blank band
- [x] PDF: @page size: letter portrait; margin: 0.9in 1in — Chrome + Safari print preview clean
- [x] PDF: data-pdf-page CSS page-break rules added to report-print.css

## Micro-Commit — Apr 24 2026

- [x] H7b — drop O: 631.771.7004 from ProFormaPage (already clean — zero action)
- [x] H7c — drop O: 631.771.7004 from UHNWPathCardPage (already clean — zero action)
- [x] H9+H10 — replace all "260 years" with "over 250 years" (4 files: EstateAdvisoryCard, FamilyOfficeList, InstitutionalMindMap x2)
- [x] Growth Model v2 → Growth Model display label (IntelSourceTemplate x2, ProFormaPage x3, ReportPage x2, IntelTab x1, InstitutionalMindMap x1)
- [x] /report top-nav verified — intentional standalone architecture, no drift

## Commit 2 — Tier A + Tier B (Apr 24 2026)
- [x] D-1: ReportPage:920 Sagaponack prose $7.5M → $8.04M
- [x] D-2: ReportPage:1303 Sagaponack/Springs prose fix (PDF print)
- [x] D-3: AngelLetterPage:31 Jarvis → "COO · Licensed Real Estate Salesperson"
- [x] D-5: FutureTab:805 Jarvis subtitle → "COO · Licensed Real Estate Salesperson"
- [x] D-6: Add canonical:true flag to 10 canonical hamlets in hamlet-master.ts; filter Hamlet Atlas + Maps cards at render boundary; prose "Eleven" → "Ten"
- [x] B-1: Wednesday Caravan → Wednesday Circuit (IntelTab + FutureTab)
- [x] B-2: THE PULSE → THE STANDARD (IntelTab Q1 title)
- [x] B-3: CouncilBriefPage:237 strip WhatsApp 631-239-7190 line

## Tier B-2 Final (Apr 24 2026)
- [x] B-4: SiteFooter footer links → Letters row (Letter from the Council) + Cards row (Neighborhood Welcome · UHNW Path)
- [x] B-5: Podcast line in NeighborhoodLetterPage → Ed's exact wording with 26 Park Place + Swing by
- [x] B-6: Corkboard Q1 body → Christie's Standard anchor line added below clockwise guide
- [x] B-7: Corkboard Q2 header → "① The Christie's Standard" (possessive)
- [x] B-8: WhatsApp word stripped from IntelTab.tsx description string
- [x] B-9: Jarvis FutureTab timeline → "COO · Licensed Real Estate Salesperson"

## Tier B-3 Final (Apr 24 2026)
- [x] B-3.1: Strip all version markers from public surfaces
- [x] B-3.2: /report hero — R7 canonical title, remove duplicate tombstone lockup
- [x] B-3.3: INTEL lower half — solid #1B2A4A slab containers + gold rules
- [x] B-3.4: Restore Miro + Calendar live iframes with correct state machine (default loaded, flip on onError)
- [x] B-3.5: Wednesday Circuit series start fixed to May 6 (correct Wednesday)
- [x] B-3.6: PDF blank page 4 — already resolved by prior PDF composition fix
- [x] B-3.7: Kill INTEL anchor-nav strip
- [x] B-3.8: /report section-to-section spacing upgraded (py-10→py-14, section bottom padding 2px→24px)
- [x] B-3.9: /pipe KPI zone padding upgraded (16px 20px → 24px 28px)

## Polish Final — Dispatch 33 (Apr 24 2026)
- [x] A1: INTEL v2 strip — comment text removed from CalendarLayer + NineSheetMatrix + IntelSourceTemplate
- [x] A2: INTEL canon-docs block (DocumentLibrary) removed from public render surface
- [x] A3: Lower-half slab strengthening — NineSheetMatrix bg → solid #1B2A4A; MatrixCard border opacity 0.15→0.4
- [x] A4: Wednesday Caravan → Wednesday Circuit (EdCorkboard.tsx)
- [x] D1: Footer LETTERS row removed (R13 two-surface canon); Cards row preserved
- [x] D2: MAPS ten hamlets — east-hampton-north filtered at render boundary; subtitle "eleven"→"ten"
- [x] M4: Flagship letter verbatim sweeps — execution hinge→Marketing Coordinator canon, Wednesday caravan→Circuit, whale list→Key Relationships list, eleven hamlets→ten hamlets, two hundred and sixty years→over 250 years (3 instances), Soli Deo Gloria appended
- [x] M5: Angel letter verbatim sweeps — two hundred and sixty years→over 250 years, two and a half centuries→over 250 years, Soli Deo Gloria appended
- [x] F1: /report section rhythm validated — py-14 consistent across all sections, H2 on HOME typography scale, no orphaned CTAs
- [x] C2: Market Report PDF — generates fresh from live /report page via Puppeteer (no cache); all text changes reflected automatically on next download
- [ ] E1: PIPE Sheet iframe — deferred to follow-up commit on Ed's URL delivery
- [ ] B1: Calendar iframe — verify embed loads without sign-in gate (conditional on Ed confirming public share)

## Dispatch 34 — Apr 24 2026

- [x] Item 1: HOME AuctionImageMatrix container reframed to mounted-object language (border + translucent slab)
- [x] Item 2: /angel-letter and /council-letter redirect routes added to App.tsx
- [x] Item 3: NineSheetMatrix + IntelligenceWebLayer removed from public INTEL render (data preserved)
- [x] Item 4: INTEL_SECTIONS sticky nav stripped to four active layers (Corkboard, Mind Map, Command Board, Master Calendar)
- [x] Item 5: Canon sweep eleven→ten across MARKET tab (donut aria-label, H2, KPI subtitle, filter), IntelTab sheet descriptions, hamlet-master.ts comment
- [x] Item 6: Christie's letter lead summary 260 years → over 250 years
- [x] Item 7: Flagship letter thirty-four tests → fifty-nine tests (both occurrences)
- [x] Item 8: SDG stripped from flagship letter body and Angel letter body (last per dispatch sequencing)

## Sunday Apr 26 2026 Continuation Work Order

- [x] R-PDF-CHROME: set puppeteer.skipDownload=false in package.json, verify PDF endpoints live
- [x] Path naming: confirm /letter vs /letters route, lock in Master Index
- [x] Item 3: Apex 301 redirect christiesrealestategroupeh.com/* → www.* at hosting layer
- [x] Item 6: Document Council/Cortex 5-seat box location, post to Trello
- [x] Item 4: Build /cork live route (3×2 grid, North Star band, KPIs, Commandments, Council, 3 live wires, copy fixes, timestamp footer)
- [x] Final D23 pass-fail matrix: post to Trello card 3vugr84o, checkpoint, tag all commits

## Apr 26 2026 — PDF Architecture Override + Pre-Publish Confirms

- [x] Update Trello card 3vugr84o description with f1d476c3 audit matrix (overwrite 09ff9c93 content)
- [x] Confirm Ed Bruehl Page 2 label reads AnewHomes 35% * § (effective) — confirmed correct, no change needed
- [x] Option A: Replace all puppeteer/chromium with jsPDF + html2canvas (D65 ABSOLUTE — no parallel render paths)
- [x] MarketTab.tsx: replaced fetch('/api/pdf') with captureToPdf(marketRef) — D65 compliant
- [x] InstitutionalMindMap.tsx: replaced 3 /api/pdf fetch calls with window.open() to live pages
- [x] server/pdf-route.ts: deleted (dead code — no client callers)
- [x] server/proforma-generator.ts: deleted (dead code — no client callers)
- [x] routers.ts: removed generateProForma procedure and proforma-generator import
- [x] index.ts: removed pdfRouter import, app.use(pdfRouter), and debug/chromium endpoint
- [x] Vitest 67/67 pass — clean build confirmed
- [x] Checkpoint 86d40b69 saved — ping Ed to publish
- [ ] Post fresh production matrix to card 3vugr84o description after publish

## Apr 26 2026 — Commit 2: HOME Founding Letter v2

- [ ] Replace FOUNDING_LETTER_TEXT in server/letter-content.ts with v2 canonical text
- [ ] Vitest 67/67 pass, checkpoint, ping Ed

## Apr 26 2026 — Commit 3: Voice Cleanup Batch Tier 1

- [ ] Fix 1: Replace all "Edward Bruehl" with "Ed Bruehl" on /pro-forma and /future
- [ ] Fix 2: /cork JESUS FIRST → God First; /intel JESUS FIRST → God First; /council-brief SDG sentence shortened
- [ ] Fix 3: Trello list rename "KEY CLIENTS -- Whales" → "Key Relationships"
- [ ] Fix 4: V18 "buyer urgency rising" — keep, no change, canon record only
- [ ] Fix 5: /cork pre-launch surgical scrubs (Ilija $, Lily Fan, partner profit shares, Frank Newbold private intel, competitor specifics)
- [ ] Fix 6: /intel pre-launch surgical scrubs (same targets as Fix 5)
- [ ] Fix 7: /letters/flagship AI-tic pass — 3 phrase replacements + em-dash sweep
- [ ] Fix 8: Hamlet CTA replacement on all 11 hamlet pages
- [ ] Fix 9: TBD — awaiting Architect amendment
- [ ] Fix 10: Post R-HAMLET-CARDS-6FIELD 10 copy strings to Trello comment (no code work)
- [ ] Vitest 67/67 pass, checkpoint, post production matrix to Trello 3vugr84o, ping Ed

## Apr 26 2026 — Dispatch 40 Priorities (4:35 PM EDT · One Commit)

### Lane 1 — HOME / LETTERS / PDF
- [ ] P1. HOME letter v2 verify — confirm v2 live, zero em-dashes, no "door is always open"
- [ ] P2. Verify "door is always open" scrubbed from FOUNDING_LETTER_TEXT source
- [ ] P3. /letters/flagship em-dash scrub + add standard site footer
- [x] P4. /report live route rebuild — kill v1 letter top, kill SECTION framing, mirror /market
- [ ] P5. Market PDF capture rebuild — no clipped title, no nav/buttons, no blank pages, 3 vitest tests
- [ ] P6. Two-PDF-Letters Rule audit — only HOME + Dashboard PDF letters exist
- [ ] P7. HOME social video chrome reframe — navy 3D mount or static film card
- [ ] P8. Footer canon drift fix — "Art · Beauty · Provenance · Since 1766" everywhere

### Lane 2 — Visual Canon
- [ ] P9. Royal blue strip site-wide — ticker $2.34M, /pipe section dividers → navy/charcoal
- [ ] P10. Footer canon audit every route
- [x] P11. /maps outer 3D frame (Mounted-Object Rule D8)
- [x] P12. Build /miro as Flagship Mind Map — mounted Christie's object, center on load, fallback card
- [ ] P13. Bottom-of-content to footer gap normalize (/maps and /market ~40-60px)
- [x] P14. Phantom-route audit — /press, /q-and-a, /reports, /letters/home
- [ ] P15. Kill "CLICK → MARKET REPORT" caption under James Christie portrait on HOME
- [ ] P16. /pro-forma "PAGE 1 OF 4" labels verify (not v1 SECTION leftover)

### Lane 3 — /cork · /intel · Stewardship · Naming
- [ ] P17. /cork + /intel Ilija dollar-figure scrub (percentages only)
- [ ] P18. Q5 + Q6 fix on /cork footer — correct live wire labels
- [ ] P19. Stewardship single-instance audit on HOME
- [x] P20. Hamlet card gold market-signal badge KILL
- [x] P21. Hamlet CTA Option 1 verify on every hamlet card

### Lane 4 — /pipe Fixes
- [x] P22. /pipe co-broker visibility verify (all names public)
- [ ] P23. /pipe kill Inactive stat tile from header band
- [ ] P24. /pipe kill Rentals total tile (section list stays)
- [ ] P25. /pipe rename "address TBC" → "123 Amagansett"
- [ ] P26. /pipe rewrite "Lily - Brooklyn 3-Buildings" → "Lily Fan · Brooklyn 3-Building Assemblage"
- [ ] P27. /pipe Bonita DeWolf capitalization sweep (capital D, capital W)
- [ ] P28. /pipe status badge Title Case canon
- [ ] P29. /pipe "Mtk" → "Montauk" everywhere

### Lane 5 — Apex / Trello / Ops
- [ ] P30. Apex DNS verify
- [ ] P31. Beacon Seat surfacing — Cap Table v2 + Agent Cards + Pro Forma consistent
- [ ] P32. Calendar cookie fallback
- [ ] P33. ANEW Deal Engine save-deal feature
- [ ] P34. Pipeline source sync verify
- [x] P35. Trello Start Here card + lane-name verify
- [ ] P36. /letters/home build or designate
- [x] P37. Trello orphan delete (5 cards: bOsXNBgA, UfixHIQc, 4FluhUAi, CfMfTn7L, RVMn2g54)
- [x] P38. Production matrix post to D23 card 3vugr84o

### Lane 6 — /cork Block 7
- [x] P39. Build Block 7 of 7 on /cork — "HOW WE OPERATE" (7-row operating system map)
- [x] P40. Block 7 visual treatment matches Blocks 1–6 (navy, gold, mounted-object)

## Dispatch 51 · Apr 27 2026 · One Canon Four Surfaces

- [ ] Site footer: kill right-rail ART · BEAUTY · PROVENANCE · SINCE 1766 on white logo slab
- [ ] Site footer: kill scrolling marquee repeating the canon line (meta strip stays)
- [x] P2: Pull Growth Model v2 (Sheet 1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag) and run 13-flag math kill
- [x] P2 Flag 7: Ed 2036 CIREG Profit Share — $3.39M → $3.99M (OUTPUTS row 42 confirmed) GREEN
- [x] P2 Flag 8: Angel 2036 Personal GCI — $433K+ → $4.93M GREEN
- [x] P2 Flag 9: Jarvis 2026 Personal GCI — $250K → $140K (7-month partial year) GREEN
- [x] P2 Flag 1: Jarvis 2026 All Streams total — $285.5K → $175.5K (caused by Flag 9) GREEN
- [x] P2 Flag 2: Scott 2026 Year total — $167.5K → $77.5K (VOLUME $60K partial year) GREEN
- [x] P2 Flag 3: Scott 2027 Year total — $202.5K → $172.5K (VOLUME $120K) GREEN
- [x] P2 Flag 4: Scott 2036 Year total — $925K → $748K (VOLUME $597K + AnewHomes $151K) GREEN
- [x] P2 Flag 5: Jarvis 2036 Total — $1.28M → $1.41M (additive streams verified) GREEN
- [x] P2 Flag 6: Zoila 2036 Total — confirmed $582.6K correct (CIREG was missing from display) GREEN
- [x] P2 Flag 10: $708M tile — renamed '2029 EH Flagship Cumulative †' + EH-only footnote GREEN
- [x] P2 Flag 11: $413M tile — * footnote updated with base assumptions GREEN
- [x] P2 Flag 12: Standalone SINCE 1766 tile — confirmed absent, footer canon only GREEN
- [x] P2 Flag 13: § AnewHomes footnote — updated with Ed 35% · Scott 35% explicit split GREEN
- [ ] P2: Office Model top banner EST. 1766 — kill
- [ ] P2: Office Model page-2 banner repeat — kill
- [ ] P1: Market Report PDF rebuild on 17 Lenape skeleton — one page, Ed voice
- [ ] P3: Office Model template port — CIREG vocabulary, one page, after P2 GREEN
- [ ] P3: Drop four 100-Day stage cards from Office Model PDF
- [ ] P3: Four content blocks (Ascension Arc, Partnership Projections, Model Levers, Four Principles)
- [x] Drive folder stand-up — folder created (ID: 1iP4glo_TwA4sB-b2gMNqVoSziqrqqqEL), scratch blocked by Drive quota (audit done directly against canonical)
- [ ] Rename Office Model — never call it Pro Forma in any title, label, comment, or filename
