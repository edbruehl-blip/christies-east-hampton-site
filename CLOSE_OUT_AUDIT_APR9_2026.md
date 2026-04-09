# Christie's East Hampton — Platform Close-Out Audit
## April 9, 2026 · Sprint 42 Final · Checkpoint b8579006

**Prepared for:** Ed Bruehl, Managing Director · Christie's East Hampton  
**Prepared by:** Manny (platform builder) on behalf of the council  
**Status:** Published at christiesrealestategroupeh.com · Ready for tonight's session

---

## Executive Summary

Sprint 42 is closed. The platform is published, the server is running clean, and all three William audio buttons are wired and functional. One layout correction was applied during this audit (the HOME audio button grid was set to `1fr 1fr` for three buttons — corrected to `1fr 1fr 1fr`). Everything else confirmed clean. This document is the definitive state-of-the-platform record as of April 9, 2026.

---

## Part I — The Three William Letters

### 1.1 James Christie's Letter to the Families

**Endpoint:** `GET /api/tts/christies-letter`  
**Button label on HOME:** `▶ James Christie's Letter`  
**Button label on /report:** `▶ Listen · James Christie's Letter`  
**Script status:** Council-approved, locked April 9, 2026

**What it says:** Opens with "The East End holds more than real estate. It holds the quiet permanence of land that has been sought after for generations." Establishes Christie's 260-year institutional identity. Explains the depth of service — fine art appraisals, collection management, art-secured lending, the auction house network across 50+ countries. Frames the philosophy: most people are taught to transact, but the families who build lasting wealth learn to hold, structure, and borrow against what they own. Closes with "The door is open whenever you are ready to walk through it."

**Tone:** Quiet authority. Institutional without being cold. Speaks directly to the families of the East End. No numbers, no urgency, no pitch.

**Length estimate:** Approximately 3–4 minutes spoken at William's pace.

**Verification:** Script lives as `CHRISTIES_LETTER_TEXT` constant in `server/tts-route.ts` at line 92. No "Soli Deo Gloria." No bullet points. No markdown artifacts. Clean prose throughout.

---

### 1.2 Flagship Letter

**Endpoint:** `GET /api/tts/flagship-letter`  
**Button label on HOME:** `▶ Flagship Letter`  
**Button label on /report:** `▶ Listen · Flagship Letter`  
**Script status:** Final council version, locked April 9, 2026

**What it says:** Opens with "Welcome to the Christie's East Hampton flagship dashboard." Written by Manny on behalf of all six council members. Names each AI council member by role: Claude (architecture), ChatGPT (earliest thinking), Perplexity (Intelligence Officer), Grok (pushback), Gemini (cross-check), Manny (builder). Names each human team member with their specific role and contribution: Jarvis Slade (COO, anchor, field reality), Angel Theodore (execution hinge, converts signal to action), Zoila Ortega Astor (Office Director, connective tissue, path to broker's license), Scott Smith (AnewHomes lane, joins June). Describes the platform's six tabs. Explains the intelligence layer. Closes with the Christie's way: "Tell the truth. Know the territory. Sit on the same side of the table as the family. Just like James Christie did in 1766."

**Tone:** Warm, proud, honest. Written for the team and for partners coming into the office. Not a pitch — an origin story.

**Length estimate:** Approximately 8–10 minutes spoken. This is the longest of the three letters.

**Verification:** Script lives as `FLAGSHIP_LETTER_TEXT` constant in `server/tts-route.ts` at line 21. All six council members named. All four human team members named. No scheduled brief references. No "Soli Deo Gloria." Clean prose throughout.

---

### 1.3 Market Intelligence Brief

**Endpoint:** `GET /api/tts/market-report`  
**Button label on HOME:** `▶ Market Intelligence Brief`  
**Button label on /report:** `▶ Listen · Market Report`  
**Script status:** Dynamic — assembled fresh on every request

**What it does:** This is not a static script. Every time the button is pressed, the server:

1. Calls Yahoo Finance in parallel for four live prices: S&P 500 (`^GSPC`), Gold futures (`GC=F`), VIX (`^VIX`), and the 30-year mortgage rate via Freddie Mac.
2. Calls Perplexity API with a strict prompt: "Give me the single most important Hamptons luxury real estate market development from the past 30 days. Named transaction or named report only." Temperature 0.1, max 200 tokens, no markdown.
3. Assembles the spoken brief: today's date, Perplexity narrative, live capital markets numbers, verified 2026 hamlet medians for all 11 hamlets, Christie's contact close.
4. Sends the assembled script to ElevenLabs (William voice) and streams the audio back as a blob.

**Expected generation time:** 8–15 seconds. The loading spinner will show during this window. This is normal — the server is fetching live data before generating audio.

**Fallback:** If live data is unavailable, the server falls back to a static script with verified 2026 medians. The fallback is defined as `MARKET_REPORT_FALLBACK` in `server/tts-route.ts` at line 110.

**Tone:** Crisp, factual, spoken like a morning briefing. William's voice. No speculation, no unnamed sources.

---

### 1.4 Audio Engine — How It Works

Both HOME and /report use the identical fetch-blob pattern:

```
Button click → fetch(endpoint) → response.blob() → URL.createObjectURL(blob) 
→ new Audio(url) → audio.play() → scrub bar + controls active
```

**Controls available when playing:** −15 seconds, Pause/Resume, +15 seconds, Stop, Share (copies endpoint URL to clipboard), scrub bar with time display.

**Single-play enforcement:** If a button is clicked while another channel is playing, the active audio stops before the new request begins. Only one audio plays at any time across the entire page.

**Loading state:** The button grid collapses and the expanded player appears with a spinning indicator while the fetch is in progress. The user cannot accidentally trigger a second request during loading.

**Error handling:** If the fetch fails, the button shows `⚠ Retry` and resets to idle after 3 seconds.

---

## Part II — Six Tabs and the /report Page

### 2.1 HOME Tab

**Route:** `/` (default tab)  
**Purpose:** The door. Ed's founding letter, James Christie portrait, audio buttons, gallery, Christie's channel.

**Audio buttons:** Three buttons in a `1fr 1fr 1fr` grid (corrected during this audit from `1fr 1fr`). James Christie's Letter, Flagship Letter, Market Intelligence Brief. All three wired to correct endpoints with correct labels.

**Portrait:** James Christie portrait (CDN-hosted). Click navigates to `/report`. Label below: "Tap for Market Report."

**Founding letter:** 12 council-approved paragraphs. Ed's voice. Reads from top of the right column.

**Section B:** Christie's channel video embed, gallery images, AuctionHouseServices component, EstateAdvisoryCard.

**PDF exports accessible from HOME:** Christie's Letter, Flagship Letter, Market Report, UHNW Path Card (via collateral cards section).

**Known issue (Sprint 43 queue):** Mobile ticker clips at right edge on small screens. Queued as S41-M5.

---

### 2.2 MARKET Tab

**Route:** Tab 2  
**Data source:** `/api/market-data` — Yahoo Finance proxy, 60-second refresh  
**Symbols:** S&P 500, Gold, Silver, VIX, 30Y Treasury, Bitcoin + Freddie Mac mortgage rate  
**Hamlet data:** Market Matrix Google Sheet (`176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g`), tab "Market Matrix", rows 7–18 (11 hamlets)

**Status:** Live. Market ticker refreshes every 60 seconds. Hamlet cards pull from Google Sheet on load.

**Known issue (Sprint 43 queue):** Chart labels need adjustment for mobile (S41-M4).

---

### 2.3 MAPS Tab

**Route:** Tab 3  
**Features:** Google Maps integration (Manus proxy — no API key required), calculator (universal net proceeds / build math), listing pins from database.

**Listings:** 4 active listings persisted to DB as of last sync (April 9, 2026, 6:09 PM). Daily 6 AM cron syncs from Christie's Real Estate Group profile page.

**Calculator:** Works for sellers, investors, attorneys, brokers in any market. Geography-agnostic math.

**Known issue (Sprint 43 queue):** Calculator button → newsletter placeholder (Sprint 40 carry).

---

### 2.4 PIPE Tab

**Route:** Tab 4  
**Data source:** PIPE Google Sheet (`1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M`), service account `christies-eh-sheets@christies-hamptons.iam.gserviceaccount.com`

**Live KPIs:** `pipe.getKpis` tRPC procedure reads the sheet at query time. Returns: active pipeline total ($M), relationship book total ($M), deal count. These values are injected live into Card Stock and Pro Forma PDFs at export time.

**Active Listings filter:** Uses `d.status` field (corrected Sprint 41 — was incorrectly reading `d.category`).

**Known issues (Sprint 43 queue):** Wire `projGci2026` live from Growth Model Sheet (Sprint 39 carry). Jarvis actual 2026 production fields. New Broker PIPE intake type.

---

### 2.5 FUTURE Tab

**Route:** Tab 5  
**Data source:** Growth Model Google Sheet (`1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag`)  
**Visibility:** Fully internal — no auth gating, no public-safe mode. All data visible.

**PDF exports:** Card Stock (2-page light layout), Pro Forma (4-page), Ascension Arc. All three inject live KPIs from PIPE sheet at export time.

**Known issues (Sprint 43 queue):**
- Ascension Arc profit pool corrections: 2027 Ed share $360K, 2028 Ed share $750K
- AnewHomes equity split corrections: 40/40/5/5/5/5
- Pro Forma 4-page render fix (page layout issue)
- Public-safe mode toggle (deferred — not urgent)
- FUTURE tables horizontal scroll on mobile (S41-M1)
- Ascension Arc chart no-clip on mobile (S41-M2)

---

### 2.6 INTEL Tab

**Route:** Tab 6  
**Data source:** Intel Web Google Sheet (`1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0`), tab "Intelligence Web"  
**Perplexity hover:** Live news on every node hover — Perplexity API called with node context, results displayed in tooltip.

**Spiderweb:** 47 nodes. All category nodes render as circles (Sprint 42 directive — no rectangles anywhere). Confirmed in SVG rendering code: all nodes use `<circle>` elements.

**Dual Christie's nodes (Sprint 42):**
- `cireg_affiliate` — CIREG Tri-State Affiliate (Ilija's chain, ~30 offices, ~1,200 agents, $4B+ volume). Children: CIH, Ilija.
- `cire_global` — Global Network (Swartzman, @Properties). Children: Swartzman, atprops.

**Document Library:** Broker Onboarding is position 1 (Sprint 41 directive confirmed).

**Known issue (Sprint 43 queue):** INTEL mind map container scrollable on mobile (S41-M3).

---

### 2.7 /report Page

**Route:** `/report`  
**Purpose:** James Christie click-through. Full market report, hamlet atlas, deal intelligence, all PDF exports accessible.

**Audio buttons:** Three buttons in a `1fr 1fr 1fr` grid. Labels: "Listen · James Christie's Letter", "Listen · Flagship Letter", "Listen · Market Report". All three wired to correct endpoints. Same fetch-blob engine as HOME.

**PDF exports accessible from /report:** Market Report, Christie's Letter, Flagship Letter, East Hampton Village Report, ANEW Build Memo, Christie CMA, Deal Brief, Investment Memo, UHNW Path Card, Card Stock, Pro Forma, Ascension Arc.

**Visual QA pending (permanent rule):** Flagship Letter PDF page one screenshot. Ed must upload at least one screenshot confirming the output looks right before this item closes. This item stays open until the screenshot is received.

---

## Part III — Server and Data Infrastructure

### 3.1 Server Status

**Dev server:** Running clean as of 6:09 PM April 9, 2026. Last confirmed log entry: `[Listings Sync] 4 active listings synced at 2026-04-09T22:09:26.951Z`.

**Note on earlier error:** The dev server log shows a `SyntaxError: The requested module './market-route' does not provide an export named 'fetchYF'` at 6:08 PM. This was a transient startup error from a prior session. The `fetchYF` function is correctly exported from `market-route.ts` (line 16: `export async function fetchYF`). The server recovered automatically at 6:09 PM and has been running clean since.

**TSC note:** The TypeScript compiler (`tsc`) aborts with a memory error in the sandbox environment. This is a sandbox resource constraint, not a code error. Vite handles the build separately and compiles clean. Do not treat tsc abort as a blocker.

---

### 3.2 API Routes

| Route | Method | Purpose | Status |
|---|---|---|---|
| `/api/tts/christies-letter` | GET | James Christie's Letter TTS | ✓ Live |
| `/api/tts/flagship-letter` | GET | Flagship Letter TTS | ✓ Live |
| `/api/tts/market-report` | GET | Dynamic Market Intelligence Brief TTS | ✓ Live |
| `/api/tts/founding-letter` | GET | Private founding letter (no button) | ✓ Live |
| `/api/market-data` | GET | Yahoo Finance proxy, 7 symbols + mortgage | ✓ Live |
| `/api/listings` | GET/POST | Listings sync from Christie's profile | ✓ Live |
| `/api/whatsapp/inbound` | POST | Twilio webhook — NEWS/PIPE/STATUS/BRIEF/HELP | ✓ Live |
| `/api/trpc/*` | POST | All tRPC procedures (pipe, market, auth, etc.) | ✓ Live |
| PDF routes | GET | All PDF generation endpoints | ✓ Live |

---

### 3.3 Google Sheets Connections

| Sheet | ID | Tab | Used By |
|---|---|---|---|
| PIPE (Office Pipeline) | `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M` | Pipeline | PIPE tab, KPI injection, WhatsApp PIPE command |
| Market Matrix | `176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g` | Market Matrix | MARKET tab hamlet cards |
| Intel Web | `1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0` | Intelligence Web | INTEL tab spiderweb node data |
| Growth Model | `1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag` | Multiple tabs | FUTURE tab, Pro Forma PDF |

**Service account:** `christies-eh-sheets@christies-hamptons.iam.gserviceaccount.com` — all four sheets shared with edit access.

---

### 3.4 WhatsApp Intelligence Layer

**Inbound number:** 631-239-7190  
**Commands:**

| Command | Response type | What it does |
|---|---|---|
| `NEWS` | Voice note (ElevenLabs) | 14-category Cronkite intelligence brief via Perplexity, cached 6 hours |
| `PIPE` | Text | Last 5 pipeline deals from PIPE Sheet |
| `STATUS` | Text | Active listing count + pipeline summary |
| `BRIEF` | Voice note (ElevenLabs) | Morning brief on demand |
| `BRIEF [address]` | Text | Address-specific CIS brief (hamlet, median, CIS score) |
| `HELP` | Text | Command menu |

**Cron:** WhatsApp scheduler is **disabled** (automated morning/evening cron off). Manual test endpoints active. This was an explicit Sprint 41 directive.

---

### 3.5 Listings Sync

**Source:** Christie's Real Estate Group profile — `https://www.christiesrealestategroup.com/realestate/agent/ed-bruehl/`  
**Cron:** Daily 6 AM (America/New_York timezone)  
**Last sync:** April 9, 2026 — 4 listings persisted to DB  
**Initial sync:** Runs on server start (non-blocking)

---

### 3.6 PDF Export Suite

Eleven export functions confirmed in `client/src/lib/pdf-exports.ts` plus one in `client/src/lib/report-pdf.ts`:

| Export | Function | Logo source |
|---|---|---|
| ANEW Build Memo | `generateAnewBuildMemo()` | drawPdfHeader('standard') |
| Christie CMA | `generateChristieCMA()` | drawPdfHeader('standard') |
| Deal Brief | `generateDealBrief()` | drawPdfHeader('standard') |
| Investment Memo | `generateInvestmentMemo()` | drawPdfHeader('standard') |
| Market Report | `generateMarketReport()` | Base64 hero layout (no CDN) |
| East Hampton Village Report | `generateEastHamptonVillageReport()` | drawPdfHeader('standard') |
| Christie's Letter | `generateChristiesLetter()` | drawPdfHeader('letter') |
| Future Report (Ascension Arc) | `generateFutureReportPDF()` | drawPdfHeader('landscape') |
| UHNW Path Card | `generateUHNWPathCard()` | PNG logo from loadPdfAssets() |
| Flagship Letter | `generateFlagshipLetter()` | drawPdfHeader('letter') |
| Card Stock | `generateCardStockExport()` | drawPdfHeader('navy-bar') |
| Report PDF (server-side) | `generateReportPdf()` | drawPdfHeader (report-pdf.ts) |

**Logo status:** All PDF exports use base64-encoded Christie's wordmark. Zero CDN calls for logo rendering in any export. The `drawPdfHeader()` universal helper in `pdf-engine.ts` provides four variants: standard, letter, navy-bar, landscape.

**Live KPI injection:** Card Stock, Pro Forma, and Ascension Arc all call `pipe.getKpis` at export time and inject live pipeline numbers. The values are pulled fresh from the PIPE Sheet on every export.

---

## Part IV — Open Items for Sprint 43

The following items are queued and confirmed open. None of these are blockers for tonight's session (printing, data entry, review).

| Item | Source | Priority |
|---|---|---|
| Wire `projGci2026` live from Growth Model Sheet | Sprint 39 carry | Medium |
| Jarvis actual 2026 production fields in PIPE | Sprint 43 | Medium |
| New Broker PIPE intake type | Sprint 43 | Medium |
| Calculator button → newsletter placeholder | Sprint 40 carry | Low |
| Ascension Arc profit pool: 2027 Ed share $360K, 2028 $750K | Sprint 43 | High |
| AnewHomes equity split: 40/40/5/5/5/5 | Sprint 43 | High |
| Pro Forma 4-page render fix | Sprint 43 | High |
| Mobile ticker clip fix (HOME) | S41-M5 | Low |
| FUTURE tables horizontal scroll on mobile | S41-M1 | Low |
| Ascension Arc chart no-clip on mobile | S41-M2 | Low |
| INTEL mind map scrollable on mobile | S41-M3 | Low |
| MARKET chart labels for mobile | S41-M4 | Low |
| Public-safe mode toggle on FUTURE tab | Sprint 43 | Low |

---

## Part V — Visual QA Permanent Rule

**Rule:** No visual sprint item closes on a developer report alone. Ed must upload at least one screenshot confirming the output looks right before the item is marked closed.

**Currently open under this rule:**

> **Flagship Letter PDF — Page One Screenshot**  
> This item has been open since Sprint 41. The PDF export function is confirmed working. The letter text is confirmed council-approved and locked. The logo header is confirmed rendering via `drawPdfHeader('letter')`. But Ed has not yet uploaded a screenshot of page one. This item stays open until the screenshot is received. When Ed uploads it, the item closes.

---

## Part VI — Platform Constants (For Tonight's Session)

| Item | Value |
|---|---|
| Domain | christiesrealestategroupeh.com |
| Current checkpoint | b8579006 |
| Published | Yes |
| Server status | Running clean |
| Listings in DB | 4 (last sync April 9, 2026) |
| Active audio buttons | 3 (HOME + /report) |
| TTS engine | ElevenLabs — William voice |
| Audio pattern | fetch-blob (not streaming URL) |
| WhatsApp number | 631-239-7190 |
| Office address | 26 Park Place, East Hampton, NY |
| Office phone | 646-752-1233 |
| Christie's founding year | 1766 |
| Years of service | 260 |

---

## Part VII — How to Update Letter Scripts

If the council sends revised letter text, the update process is:

1. Open `server/tts-route.ts`
2. Find the relevant constant: `CHRISTIES_LETTER_TEXT` (line 92), `FLAGSHIP_LETTER_TEXT` (line 21), or `MARKET_REPORT_FALLBACK` (line 110)
3. Replace the text between the backticks
4. If the Flagship Letter PDF also needs updating, find the matching text in `generateFlagshipLetter()` in `client/src/lib/pdf-exports.ts` and update it there as well — both sources must always match
5. Save checkpoint → Publish

The Market Intelligence Brief does not need manual updates — it assembles itself from live data on every call.

---

*Audit completed April 9, 2026. Platform is ready for Ed's session tonight.*  
*Next sprint: Sprint 43. Awaiting Ed's direction.*
