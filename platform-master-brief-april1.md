# Christie's East Hampton · Platform Master Brief
## April 1, 2026 · Pre-Sprint 5 · Complete System Knowledge

*Written after a full read of every source file, every server route, every data structure, every integration, and every real-world connection in the platform. This document is the single source of truth before Sprint 5 begins.*

---

## I. What This Platform Is

This is a private, authenticated operating dashboard for Ed Bruehl, Managing Director of Christie's International Real Estate Group, East Hampton. It is not a public-facing website. It is an institutional intelligence system — a control room that connects Ed's real-world practice to data, documents, exports, and a voice delivery layer.

The platform lives at a Manus-hosted URL and is accessible only to authenticated users. It has two primary surfaces:

- **The Dashboard** (`/`) — Seven tabs: HOME · MARKET · MAPS · IDEAS · PIPE · FUTURE · INTEL
- **The Market Report** (`/report`) — A standalone six-section live market report with PDF export and dual voice narration

The architecture is React 19 + Tailwind 4 on the frontend, Express 4 + tRPC 11 on the backend, MySQL (TiDB) for the pipeline database, and S3 for file storage. The platform was built across four sprints between March 29 and April 1, 2026.

---

## II. The Seven Tabs — What Each One Does

### HOME Tab
The door. Three sections.

**Section A — Hero:** Full-bleed Christie's Grand Saleroom auction room background image. Left column: James Christie Gainsborough oil portrait (thumbnail, clickable → navigates to `/report`) + Ed Bruehl identity card. Right column: the founding letter in nine paragraphs, signed by Ed Bruehl. The portrait shown here is **James Christie** (the Gainsborough oil), not Ed's headshot. This is intentional — the HOME tab establishes institutional lineage. Ed's headshot appears on `/report` and in all PDF exports.

**Section B — Auction Intelligence:** 3×3 YouTube grid. Nine Ed Bruehl videos with thumbnail previews. Click-to-play inline with autoplay. Videos are hardcoded by YouTube ID.

**Section C — Footer:** Doctrine line ("Always the Family's Interest Before the Sale. The Name Follows."), office address (26 Park Place · East Hampton NY 11937), direct line (646-752-1233), email (ebruehl@christiesrealestate.com).

**Known gap:** No social links on HOME tab. Social links live in the DashboardLayout nav bar (Layer 5), not on the HOME tab itself.

---

### MARKET Tab
The nine-hamlet intelligence dashboard. No external data dependency — all data is hardcoded in `hamlet-master.ts`.

**Hamptons Market Signal Donut:** SVG donut ring with nine segments, each proportional to hamlet volume share. Labels appear for segments ≥ 6%. Dominant corridor is called out below the ring.

**Nine Hamlet Tiles:** Rendered in tier order (Ultra-Trophy → Trophy → Premier → Opportunity). Each tile shows: hamlet name, tier badge, median price, CIS bar (0–10), volume share bar, last notable sale.

**Rate Environment Sidebar:** Pulls live data from `/api/market-data` — S&P 500, Gold, Silver, VIX, 30Y Treasury, Bitcoin, 30Y Fixed Mortgage (hardcoded at 6.38% from Freddie Mac March 27, 2026 weekly average), Hamptons Median ($2.34M, hardcoded).

**The nine hamlets and their data:**

| Hamlet | Tier | Median Price | CIS | Vol. Share |
|--------|------|-------------|-----|-----------|
| Sagaponack | Ultra-Trophy | $7.5M | 9.4 | 4% |
| East Hampton Village | Ultra-Trophy | $5.15M | 9.2 | 12% |
| Bridgehampton | Trophy | $5.1M | 9.1 | 8% |
| Southampton Village | Trophy | $3.55M | 9.0 | 14% |
| Water Mill | Trophy | $4.2M | 8.8 | 7% |
| Amagansett | Premier | $4.25M | 8.9 | 9% |
| East Hampton | Premier | $3.2M | 8.6 | 18% |
| Sag Harbor | Premier | $2.85M | 8.4 | 11% |
| Springs | Opportunity | $1.35M | 6.8 | 17% |

**Known gap:** All median prices, CIS scores, and volume shares are hardcoded in `hamlet-master.ts`. They do not auto-update from any external source. Manual update required when market data changes.

---

### MAPS Tab
The Paumanok intelligence plate + Google Map + hamlet deep-dive panels.

**Paumanok SVG Plate:** D3-rendered topographic contour map of the South Fork. Nine hamlet pins plotted by lat/lng from `hamlet-master.ts`. Tier colors applied to pins. OpenStreetMap attribution in footer.

**Google Map:** Full South Fork view with hamlet pins. Uses the Manus Google Maps proxy — no API key required from Ed. All Google Maps JavaScript API features are available (Places, Geocoder, Directions, Drawing).

**Hamlet Sidebar Grid:** Nine hamlet buttons in tier order. Click → opens inline hamlet panel below the map.

**Hamlet Panel:** Each panel shows: hero photo (Unsplash), tier badge + CIS score, median price, volume share, last notable sale, restaurant guide (3-tier: anchor/mid/local), news links (WSJ Hamptons, Curbed NY, NY Times RE), Zillow link, and active listings.

**Active Listings:** All 27 listing slots across nine hamlets (3 per hamlet) are currently `placeholder: true`. The suppression fix from Sprint 4 is live — placeholder cards are hidden and a clean "No active listings at this time." message appears instead. **This is the most visible gap in the platform.** Real listings need to be seeded manually or via the Sprint 5 daily sync from Ed's Christie's profile page.

**Known gaps:**
- All restaurant `mid` and most `local` entries are still `TBD` in the data
- All 27 listing slots are placeholders
- Hamlet photos are Unsplash stock images, not actual South Fork photography

---

### IDEAS Tab
The ANEW Investment Calculator + Deal Intelligence Engine. The most complex tab.

**Four Calculation Modes:**
1. **ANEW Build** — Land cost + construction cost → exit price → spread → CIS verdict
2. **Buy & Hold** — Acquisition price → projected appreciation → total return
3. **Buy, Renovate & Hold** — Acquisition + renovation → exit price → spread
4. **Buy & Rent** — Rental income + appreciation → total return

**CIS Verdict System:** Four verdicts — Institutional (score ≥ 85), Executable (70–84), Marginal (50–69), Pass (< 50). The score is computed from gross financial attractiveness, tier classification multiplier, and ANEW intelligence contribution.

**Strategic Classification Layer:** If deal is in a Tier 1 corridor AND has a positive spread → "Institutional Asset — Executable Entry Basis." If in EH Village South of Highway → "Institutional Location."

**Six PDF Exports (all client-side jsPDF, no server dependency):**
1. **ANEW Build Memo** (2 pages) — Full ANEW analysis with hamlet context
2. **Christie's CMA** (2 pages) — Comparative market analysis with comparable sales
3. **Deal Brief** (1 page) — Concise deal summary for client meetings
4. **Investment Memo** (2 pages) — Full investment memorandum
5. **Market Report** (5 pages) — Full South Fork market report, all nine hamlets
6. **East Hampton Village Report** (1 page) — Single-hamlet deep-dive template

All six exports include: Christie's logo (black lockup), Ed's headshot (navy jacket), QR code, doctrine lines. No faith language on any export.

**CTA:** "Generate Your Private Property Intelligence Brief" — the primary call to action from the Estate Advisory Card QR code loop.

---

### PIPE Tab
The deal pipeline. Two surfaces.

**Primary Surface:** The real Office Pipeline Google Sheet embedded full-width at viewport height. Sheet ID: `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M`. This is the canonical pipeline. Ed manages it directly in Google Sheets. The embed shows it live inside the dashboard.

**Secondary Surface:** A database-backed quick-add UI above the sheet. Rows added here persist in MySQL (TiDB) via tRPC. Fields: address, hamlet, type (Deal/Listing/Buyer/Seller/Attorney/Developer/Referral/Press/Other), status (Active/Watch/Critical/Stalled/Closed/Dead), ask price, DOM, notes.

**Status color system:** Active (gold), Watch (orange), Critical (red), Stalled (slate), Closed (navy), Dead (gray).

**Known gap:** The custom tracker rows and the Google Sheet are two separate data stores. They do not sync with each other. A row added in the custom tracker does not appear in the sheet, and vice versa.

---

### FUTURE Tab
The growth model and 300-day arc. All data is hardcoded from Growth Model v2.

**2026 Scorecard:** 52 podcasts, 12 collector events, 12 agents (target), 12 raving fans.

**GCI Outlook (2026–2031):**

| Year | Agents | GCI Target | Avg GCI/Agent | Milestone |
|------|--------|-----------|--------------|-----------|
| 2026 | 15 | $3.575M | $238K | Base case |
| 2027 | 6 | $1.56M | $260K | First team layer |
| 2028 | 10 | $2.50M | $250K | Operating scale |
| 2029 | 14 | $3.08M | $220K | Regional authority |
| 2030 | 18 | $3.60M | $200K | Institutional presence |
| 2031 | 22 | $4.40M | $200K | Full South Fork coverage |

**Agent Roster:** Ed Bruehl (Active/Founding) + 5 open seats (Seats 2–6, Recruiting/Target).

**300-Day Arc:** Four phases — Foundation (1–90), Activation (91–180), Acceleration (181–270), Consolidation (271–300).

**Growth Model v2 Sheet link:** `https://docs.google.com/spreadsheets/d/1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag/edit` (link only — not embedded).

**Known gap:** The FUTURE tab data is manually synced from the sheet. No live connection. When the sheet changes, the tab must be updated manually.

---

### INTEL Tab
The operating control room. Three layers.

**Layer 1 — Master Calendar:** Two Google Sheets embedded side by side at full height. Podcast calendar (ID: `1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8`) and Event calendar (ID: `1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s`). Filter tabs: All / Podcast / Event / Internal / Social. These are live Google Sheets — Ed edits them directly and the dashboard reflects changes immediately.

**Layer 2 — Live Operating Sheets:** Four panels in a 2×2 grid, each a full-height Google Sheet embed with an "Open in Google Sheets" link:
- Agent Recruiting (ID: `1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA`)
- Social / Podcast Tracker (ID: `1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I`)
- Contact Database (ID: `1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI`)
- Auction Events (ID: `1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s` — same as Event calendar)

**Layer 3 — Canon Documents:** Seven document sections, each with labeled cards and "Open PDF" or "Staging" buttons:

| Section | Document | Status | URL |
|---------|----------|--------|-----|
| Org Chart & Hierarchy | Institutional Hierarchy · March 2026 | **Live** | `files.manuscdn.com/…/TtcjzvhlJtbopxGm.html` |
| Market Report | Live Market Report · v2 · March 2026 | **Live** | `files.manuscdn.com/…/vevzqEIvPqAYOdHz.html` |
| Market Report | Hamlet PDF · EH Village · Wireframe | **Staging** | null |
| Constitution & SOPs | Website Wireframe · v2 | **Live** | `files.manuscdn.com/…/EOvOozncXWBiBwbL.html` |
| Constitution & SOPs | Estate Advisory Card · PDF | **Live** | `d2xsxph8kpxj0f.cloudfront.net/…/christies-estate-advisory-card_7b840fde.pdf` |
| Constitution & SOPs | 300-Day Ascension Plan · Wireframe | **Live** | `files.manuscdn.com/…/WXzEqCTtWmVsElaB.html` |
| Council Briefs | Council Brief · March 29, 2026 · FINAL | **Live** | `files.manuscdn.com/…/JBBnSxvSjfkLOjlS.html` |
| Attorney Database | Attorney Database · East Hampton | **Staging** | null |
| Adam Kalb · IBC | IBC Materials · Overview | **Staging** | null |
| Adam Kalb · IBC | IBC Brief | **Staging** | null |

**Canon PDF Section (usePdfAssets hook):** Nine canon PDFs registered, all `url: null`. In production these are invisible. In staging (localhost / manus.computer) they show "Staging" badges. The nine are: ANEW Homes Council Brief, System Map v4.1, Mission & Model, 300-Day Blueprint, Morning Brief (Print), Mission & Model (Condensed), Blueprint (Condensed), James Christie Letter, PDF Arsenal.

**Sprint 3 Horizon Banner:** Still says "Sprint 3 Horizon" with three items: William WhatsApp, State File, Christie AI Tab. **This is stale.** William WhatsApp was delivered in Sprint 4. The banner needs to be updated to Sprint 5 Horizon.

**Known gaps:**
- Sprint 3 Horizon banner is stale (Sprint 4 items already delivered)
- Estate Advisory Card PDF is on old CloudFront domain (`d2xsxph8kpxj0f.cloudfront.net`) — may serve as `application/octet-stream`, not inline-viewable in browser
- Nine canon PDFs (usePdfAssets) all have `url: null` — invisible in production
- Attorney Database: staging only
- Adam Kalb IBC materials: staging only

---

## III. The /report Page — Six-Section Market Report

The standalone market report. No nav chrome. Accessed by tapping the James Christie portrait on HOME, or directly at `/report`.

**Section 1 — Institutional Opening:** Full-bleed Grand Saleroom hero image. Title overlay: "Christie's East Hampton." PDF download button (generates 5-page Market Report via jsPDF). Dual William TTS buttons (FOUNDING LETTER + MARKET REPORT). Founding letter in nine paragraphs. Ed's headshot signature block (52px circle, navy jacket).

**Section 2 — Hamptons Local Intelligence:** Bloomberg-style news feed. Seven hamlet news sections (East Hampton Town, East Hampton Village, Bridgehampton, Southampton Town, Water Mill, Sag Harbor, Springs) with hardcoded news items and source links. Mortgage rate panel (live from `/api/market-data`).

**Section 3 — Market Intelligence:** CFS donut ring (same SVG as MARKET tab). Rate environment panel (live data). Hamptons Median ($2.34M, hardcoded).

**Section 4 — Hamlet Atlas Matrix:** Nine hamlet tiles, tap = inline expansion. Each expanded panel shows: hero photo, tier badge, CIS score, median price, volume share, last sale, restaurant guide, news links, Zillow link, active listings (suppressed if all placeholder).

**Section 5 — IDEAS / ANEW Intelligence:** Model deal walkthrough. ANEW chip showing sample score. QR code linking to the Estate Advisory Card PDF. CTA: "Generate Your Private Property Intelligence Brief."

**Section 6 — Resources & Authority:** Christie's ecosystem links. Contact block (address, phone, email). Doctrine footer.

**Section 7 — Christie's Auction Intelligence:** 3×3 YouTube grid (same nine videos as HOME tab Section B).

**Known gaps:**
- `JAMES_CHRISTIE_PORTRAIT_PRIMARY` is imported in ReportPage but never rendered — it is an unused import. The portrait slot in Section 1 shows the Grand Saleroom hero image, not a portrait.
- The founding letter narration (TTS) says "Montauk" as the ninth hamlet. The canonical nine hamlets are: East Hampton Village, Sagaponack, Bridgehampton, Water Mill, Southampton Village, Sag Harbor, Amagansett, Springs, and **East Hampton** (the town). Montauk is not in the ANEW territory. This error appears in three places: `tts-route.ts` line 13, `routers.ts` line 20, and the founding letter text in `HomeTab.tsx` paragraph 5.

---

## IV. The Server — Seven Routes

The Express server runs on a dynamic port (default 3000, auto-increments if busy). All routes are registered in `server/_core/index.ts`.

| Route | File | Purpose | External Dependency |
|-------|------|---------|-------------------|
| `POST /api/oauth/callback` | `_core/oauth.ts` | Manus OAuth authentication | Manus OAuth server |
| `POST /api/trpc/*` | `routers.ts` | All tRPC procedures (auth, TTS, pipeline CRUD) | ElevenLabs (TTS), MySQL |
| `GET /api/pdf/report` | `pdf.ts` | Server-side PDF generation via Puppeteer | Puppeteer + Chromium (orphaned) |
| `GET /api/tts/founding-letter` | `tts-route.ts` | Founding letter audio stream | ElevenLabs API |
| `GET /api/tts/market-report` | `tts-route.ts` | Market report audio stream | ElevenLabs API |
| `GET /api/market-data` | `market-route.ts` | Market data proxy | Yahoo Finance, CoinGecko |
| `POST /api/whatsapp/morning-brief` | `whatsapp-route.ts` | 8AM voice note to William | ElevenLabs + S3 + Twilio |
| `POST /api/whatsapp/evening-summary` | `whatsapp-route.ts` | 8PM voice note to William | ElevenLabs + S3 + Twilio |
| `POST /api/whatsapp/test` | `whatsapp-route.ts` | On-demand test fire | ElevenLabs + S3 + Twilio |

**Orphaned route:** `/api/pdf/report` uses Puppeteer + `@sparticuz/chromium`. The frontend PDF download button on `/report` calls `generateMarketReport()` from `pdf-exports.ts` (client-side jsPDF), not this server route. The server PDF route is not called by any frontend button. It is dead weight — ~150MB of packages for a route that nothing calls.

---

## V. The tRPC Procedures

All tRPC procedures are in `server/routers.ts`.

| Namespace | Procedure | Type | Purpose |
|-----------|-----------|------|---------|
| `auth` | `me` | query | Returns current user from session cookie |
| `auth` | `logout` | mutation | Clears session cookie |
| `tts` | `foundingLetter` | mutation | Calls ElevenLabs, returns base64 MP3 |
| `tts` | `marketReport` | mutation | Calls ElevenLabs, returns base64 MP3 |
| `tts` | `ping` | query | Returns `{ configured: true/false }` |
| `pipe` | `list` | query | Returns all pipeline rows ordered by sortOrder + createdAt |
| `pipe` | `upsert` | mutation | Insert or update a pipeline row |
| `pipe` | `delete` | mutation | Delete a pipeline row by ID |
| `system` | `notifyOwner` | mutation | Sends notification to platform owner |

**Note:** The tRPC TTS procedures (`tts.foundingLetter`, `tts.marketReport`) are not used by the `/report` page. The `/report` page calls the raw Express routes (`/api/tts/founding-letter`, `/api/tts/market-report`) directly via `fetch()`. The tRPC TTS procedures exist as an alternative path but are not wired to any frontend button.

---

## VI. External Integrations — Complete Map

### ElevenLabs
- **Voice ID (TTS route + tRPC):** `fjnwTZkKtQOJaYzGLa6n` — used for the founding letter and market report narration on `/report`
- **Voice ID (WhatsApp route):** `N2lVS1w4EtoT3dr4eOWO` — "William" — used for the 8AM and 8PM voice notes
- **Model:** `eleven_multilingual_v2` (both voices)
- **API key env var:** `ELEVENLABS_API_KEY`
- **Status:** Configured. TTS on `/report` is live. WhatsApp voice synthesis is wired but untested end-to-end.

### Twilio WhatsApp
- **From:** `whatsapp:+16312397190` (Christie's East Hampton Twilio number)
- **To:** `whatsapp:+16467521233` (Ed's cell — William)
- **Account SID env var:** `TWILIO_ACCOUNT_SID` (starts with AC)
- **Auth Token env var:** `TWILIO_AUTH_TOKEN`
- **From env var:** `TWILIO_WHATSAPP_FROM`
- **To env var:** `WILLIAM_WHATSAPP_TO`
- **Scheduler:** node-cron, `America/New_York` timezone, 8AM + 8PM daily
- **Status:** Credentials entered. Scheduler running. **Not yet live-tested.** A Twilio `20003` authentication error was observed in server logs. Credentials need to be verified against the Twilio console before the crons can be trusted.

### Yahoo Finance (via server proxy)
- **Tickers:** `^GSPC` (S&P 500), `GC=F` (Gold), `SI=F` (Silver), `^VIX`, `^TYX` (30Y Treasury)
- **Route:** `GET /api/market-data`
- **Status:** Live. Fetched in parallel on every market data request. 10-second timeout per ticker.

### CoinGecko
- **Asset:** Bitcoin (BTC/USD + 24h change)
- **Route:** `GET /api/market-data` (same endpoint as Yahoo Finance)
- **Status:** Live. 8-second timeout.

### Open-Meteo (weather)
- **Location:** East Hampton, NY (lat 40.9637, lng -72.1848)
- **Called from:** DashboardLayout Layer 5 (client-side fetch, no server proxy)
- **Status:** Live. Returns temperature (°F) + WMO weather code → human-readable description.

### Google Maps (Manus proxy)
- **Used in:** MAPS tab (MapView component)
- **Authentication:** Manus proxy handles all auth — no API key required from Ed
- **Features available:** All Google Maps JavaScript API features (Places, Geocoder, Directions, Drawing, Visualization)
- **Status:** Live.

### Google Sheets (embedded iframes)
All sheets are embedded as read-only iframes. Ed edits them directly in Google Sheets; the dashboard reflects changes on next load.

| Sheet | ID | Tab | Purpose |
|-------|-----|-----|---------|
| Podcast Calendar | `1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8` | INTEL Layer 1 | Podcast schedule |
| Event Calendar | `1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s` | INTEL Layer 1 + Layer 2 | Event schedule |
| Agent Recruiting | `1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA` | INTEL Layer 2 | Agent pipeline |
| Social / Podcast | `1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I` | INTEL Layer 2 | Social + podcast tracker |
| Contact Database | `1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI` | INTEL Layer 2 | Contact CRM |
| Office Pipeline | `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M` | PIPE | Primary deal pipeline |
| Growth Model v2 | `1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag` | FUTURE | GCI model + agent roster |

### MySQL / TiDB (Manus-hosted)
- **Tables:** `users`, `pipeline`
- **Used for:** PIPE tab custom tracker (quick-add rows)
- **Status:** Live. Two migrations applied.

### S3 (Manus-hosted)
- **Used for:** WhatsApp voice note audio files (ElevenLabs MP3 → S3 → Twilio media URL)
- **Helper:** `server/storage.ts` → `storagePut()`
- **Status:** Wired. Untested end-to-end (dependent on Twilio credential resolution).

### Manus CDN (`files.manuscdn.com`)
All static assets (images, logos, portraits) are hosted on the Manus CDN. The CDN base URL is `https://files.manuscdn.com/user_upload_by_module/session_file/115914870/`.

**Key assets:**
- James Christie portrait (Gainsborough oil): `CVWbttyPodJyWigp.jpg`
- Ed's headshot (navy jacket, confirmed PRIMARY): `INlfZDqMHcqOCvuv.jpg`
- Christie's logo white (official CIREG PNG): `d3w216np43fnr4.cloudfront.net/10580/348947/1.png`
- Christie's logo black (official CIREG PNG): `d3w216np43fnr4.cloudfront.net/10580/348547/1.png`
- Grand Saleroom (room-primary): `DtTxqkdyvvLrygvu.jpg`
- 9 GALLERY_IMAGES + 20 AUCTION_LOT_LIBRARY images on CDN

---

## VII. The DashboardLayout — Five Layers

The nav bar wraps all seven tabs. It has five distinct layers:

| Layer | Content | Data Source |
|-------|---------|------------|
| 1 | Christie's logo (white PNG) + Ed headshot (32px circle) + tab navigation | Static / CDN |
| 2 | Institutional ticker marquee (55s loop) | Hardcoded text |
| 3 | Market data bar (S&P, Gold, Silver, VIX, Treasury, BTC, Mortgage) | `/api/market-data` (live) |
| 4 | Tab buttons (HOME · MARKET · MAPS · IDEAS · PIPE · FUTURE · INTEL) | State |
| 5 | Social icons (7) + office address + live weather | Open-Meteo (live) |

**Seven social links:**
1. Instagram: `instagram.com/edbruehlrealestate`
2. Threads: `threads.net/@edbruehl`
3. X / Twitter: `twitter.com/edbruehlre`
4. TikTok: `tiktok.com/@edbruehlrealestate`
5. YouTube: `youtube.com/channel/UCRNUlNy2hkJFvo1IFTY4otg`
6. Facebook: `facebook.com/edbruehlrealestate`
7. LinkedIn: `linkedin.com/in/edbruehl`

**Ticker text:** "Stewarding Hamptons legacies · Enjoy it · Improve it · Pass it on · Art · Beauty · Provenance · Since 1766 · Christie's East Hampton · Exceptional Service"

**Mobile nav:** Hamburger menu on screens below `md` breakpoint. Slides in from left.

---

## VIII. Voice Architecture — Two Voices, Two Purposes

The platform has two distinct voice identities:

**Voice 1 — The Narrator (fjnwTZkKtQOJaYzGLa6n)**
Used on `/report` for the founding letter and market report narration. This is the institutional voice — slower, more formal, appropriate for a client-facing audio experience. Called via raw Express routes (`/api/tts/founding-letter`, `/api/tts/market-report`). Audio is streamed directly to the browser as an MP3 blob, played via a custom audio player with play/pause, scrub, rewind, and time display.

**Voice 2 — William (N2lVS1w4EtoT3dr4eOWO)**
Used for the 8AM and 8PM WhatsApp voice notes to Ed's phone. This is the operational voice — conversational, brief, designed for a voice-note format. Audio is synthesized server-side, uploaded to S3, and delivered via Twilio as a WhatsApp media message.

**The hamlet list discrepancy:** Both voices narrate "East Hampton Village. Sagaponack. Bridgehampton. Water Mill. Southampton. Sag Harbor. Amagansett. Springs. **Montauk**." The correct ninth hamlet is **East Hampton** (the town), not Montauk. Montauk is outside the nine-hamlet ANEW territory. This error exists in three files: `tts-route.ts`, `routers.ts`, and `HomeTab.tsx`. It is a one-line fix in each file.

---

## IX. The PDF Engine — Six Exports

All six PDF exports are client-side, using jsPDF. No server dependency. They generate and download in the browser.

**Shared header function (`drawHeader`):** Christie's black logo (PNG from CloudFront), Ed's headshot (navy jacket, from Manus CDN), property address subtitle, gold rule, navy header band.

**Shared footer:** Doctrine line, QR code (links to `christiesrealestategroupeh.com`), page number.

**Export 1 — ANEW Build Memo (2pp):** Full ANEW analysis. Page 1: deal inputs + CIS verdict + spread calculation. Page 2: South Fork market context + hamlet comps table.

**Export 2 — Christie's CMA (2pp):** Comparative market analysis. Page 1: property details + hamlet median + CIS. Page 2: comparable sales table + recommendation narrative.

**Export 3 — Deal Brief (1pp):** Concise deal summary. All key metrics on one page. Designed for client meetings.

**Export 4 — Investment Memo (2pp):** Full investment memorandum. Page 1: executive summary + financial analysis. Page 2: hamlet context + investment thesis.

**Export 5 — Market Report (5pp):** Full South Fork market report. Page 1: cover. Pages 2–3: nine hamlet tiles with all data. Page 4: rate environment + market signals. Page 5: resources + contact.

**Export 6 — East Hampton Village Report (1pp):** Single-hamlet deep-dive template. Can be adapted for any hamlet via `generateHamletReport(hamlet)`.

**Known gap:** The server-side PDF route (`/api/pdf/report` via Puppeteer) is orphaned. No frontend button calls it. The ~150MB Puppeteer + Chromium stack is dead weight.

---

## X. The Database — Schema

Two tables in MySQL (TiDB):

**`users` table:** id, openId (Manus OAuth), name, email, loginMethod, role (user/admin), createdAt, updatedAt, lastSignedIn.

**`pipeline` table:** id, address, hamlet, type, status, askPrice, dom (days on market), notes, sortOrder, createdAt, updatedAt.

Two migrations applied:
- `0000_white_rocket_racer.sql` — initial schema
- `0001_dizzy_tusk.sql` — pipeline table addition

---

## XI. State.json — System Memory

Located at `client/public/state.json`. Publicly accessible at `/state.json`. Contains:

- Platform identity (name, version, domain, stack)
- Sprint history (Sprints 1–4 with deliverables)
- Sprint 5 horizon items
- WhatsApp scheduler config
- Estate Advisory Card loop config
- Founding letter text (canonical version)
- Doctrine lines (8 lines including *Soli Deo Gloria*)
- System memory (voice IDs, sheet IDs, CDN base)

**Status:** Current through Sprint 4. Sprint 3 Horizon banner in INTEL tab still references Sprint 3 items — needs to be updated to Sprint 5 Horizon.

---

## XII. GitHub / Version Control

The project uses a Manus-managed S3 git remote:
`s3://vida-prod-gitrepo/webdev-git/115914870/Acqj9Wc4PB2323zvtzuKaz`

This is not a GitHub repository. It is an internal Manus git store. There is no public GitHub remote. The Sprint 5 horizon items include creating a private GitHub repository (`christies-east-hampton`), but this has not been done yet.

**Current HEAD:** `229d597` — Sprint 4 checkpoint (April 1, 2026)

**Four checkpoints:**
- `229d597` — Sprint 4 (current)
- `19d3aee` — Sprint 3
- `871520e` — Sprint 2
- `cb2e6ad` — Sprint 1

---

## XIII. Known Issues — Prioritized

### P1 — Blocking or Client-Visible

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 1 | Twilio auth error (20003) — WhatsApp not delivering | `whatsapp-route.ts` + env | Re-enter credentials via secrets manager; verify in Twilio console |
| 2 | "Montauk" in hamlet list (should be "East Hampton") | `tts-route.ts` L13, `routers.ts` L20, `HomeTab.tsx` P5 | One-line fix in three files |
| 3 | Sprint 3 Horizon banner is stale | `IntelTab.tsx` | Update to Sprint 5 Horizon |
| 4 | All 27 listing slots are placeholder — MAPS shows empty state | `hamlet-master.ts` | Sprint 5: daily listing sync from Christie's profile |

### P2 — Important but Not Blocking

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 5 | Estate Advisory Card PDF on old CloudFront domain | `IntelTab.tsx` L302 | Re-upload to `files.manuscdn.com`, update URL |
| 6 | Nine canon PDFs all `url: null` — invisible in production | `usePdfAssets.ts` | Ed supplies files; upload and update URLs |
| 7 | Puppeteer + Chromium (~150MB) orphaned — no frontend calls `/api/pdf/report` | `pdf.ts`, `package.json` | Remove `puppeteer-core`, `@sparticuz/chromium`, `html2pdf.js`, `axios` |
| 8 | `JAMES_CHRISTIE_PORTRAIT_PRIMARY` imported but never rendered in ReportPage | `ReportPage.tsx` L23 | Remove unused import |
| 9 | FUTURE tab data is manually synced — no live sheet connection | `FutureTab.tsx` | Sprint 5: embed Growth Model sheet or add live sync |

### P3 — Polish and Completeness

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 10 | All hamlet restaurant `mid` entries are TBD | `hamlet-master.ts` | Ed supplies restaurant data |
| 11 | All hamlet photos are Unsplash stock | `hamlet-master.ts` | Replace with actual South Fork photography |
| 12 | Attorney Database: staging only | `IntelTab.tsx` | Ed supplies attorney list |
| 13 | Adam Kalb IBC materials: staging only | `IntelTab.tsx` | Adam Kalb supplies materials |
| 14 | PIPE custom tracker and Google Sheet are separate data stores | `PipeTab.tsx` | Sprint 5: decide on single source of truth |
| 15 | `Home.tsx` page exists but is never rendered (Dashboard bypasses it) | `Home.tsx` | Remove or repurpose |
| 16 | `ComponentShowcase.tsx` exists but is not registered as a route | `App.tsx` | Remove |

---

## XIV. What Is Fully Working Right Now

The following is confirmed working as of Sprint 4 checkpoint `229d597`:

- Seven-tab dashboard renders correctly on desktop
- DashboardLayout five-layer nav bar with live market data, live weather, social links
- HOME tab: James Christie portrait, founding letter, 9-video YouTube grid, footer
- MARKET tab: nine-hamlet donut ring, nine hamlet tiles, live rate environment
- MAPS tab: Paumanok SVG plate, Google Map with hamlet pins, hamlet panels, listing suppression
- IDEAS tab: ANEW calculator (four modes), six PDF exports, CIS verdict system
- PIPE tab: Office Pipeline sheet embed + custom tracker with database persistence
- FUTURE tab: Growth Model v2 data, 300-day arc, agent roster
- INTEL tab: Live calendar (two sheets), four-panel sheet grid, canon document library
- `/report` page: six sections + Section 7 auction intelligence, PDF download, dual TTS audio player
- `/api/market-data`: Yahoo Finance + CoinGecko proxy, live
- `/api/tts/founding-letter` and `/api/tts/market-report`: ElevenLabs streaming, live
- WhatsApp scheduler: wired, crons running, **credentials unverified**
- state.json: current through Sprint 4
- 13 vitest passing across 4 test files
- TypeScript: 0 errors

---

## XV. Sprint 5 — Recommended Build Order

Based on the full audit, the following is the recommended Sprint 5 sequence:

1. **Fix Twilio credentials** — re-enter via secrets manager, fire live test, confirm voice note on Ed's phone. This closes the most important open loop.
2. **Fix hamlet list** — replace "Montauk" with "East Hampton" in three files. One-line fix, three locations.
3. **Update Sprint 3 Horizon banner** — update to Sprint 5 Horizon in INTEL tab.
4. **Remove Puppeteer dead weight** — four packages, clean bundle.
5. **Daily 6AM listing sync** — scrape `christiesrealestategroup.com/realestate/agent/ed-bruehl/`, seed MAPS hamlet listings and PIPE tab. This closes the most visible platform gap.
6. **Re-upload Estate Advisory Card** to `files.manuscdn.com`, update URL in INTEL.
7. **Private GitHub repo** — export to `christies-east-hampton` private repo.
8. **Claude API layer** — Christie's AI tab inside the dashboard.

---

*This document was written on April 1, 2026 after a full read of every source file in the platform. It reflects the exact state of the codebase at checkpoint `229d597`. Nothing was fixed, redesigned, or interpreted. Only what is actually there.*

*Soli Deo Gloria.*
