# Christie's East Hampton · Master System Audit
**Prepared by Manny · April 5, 2026 · Version 1.0**
*Full inventory of every page, tab, backend route, data source, external connection, CDN asset, scheduled job, and infrastructure component.*

---

## 1. Platform Overview

**Live domain:** [christiesrealestategroupeh.com](https://www.christiesrealestategroupeh.com)
**Staging domain:** [christies-dash-acqj9wc4.manus.space](https://christies-dash-acqj9wc4.manus.space)
**Infrastructure:** Manus managed hosting · Node.js/Express server · React 19 frontend · MySQL/TiDB database · AWS S3 file storage
**Current checkpoint:** `3ce0c12c` · April 5, 2026
**Test suite:** 35/35 passing · esbuild 90.3KB clean

---

## 2. Client-Side Routes (Pages)

Three distinct URL destinations exist on the platform. All are served by the same Express server.

| Route | Component | Auth Required | Purpose |
|---|---|---|---|
| `/` (all paths except below) | `Dashboard` → `DashboardLayout` | No (tabs visible to all; write operations require login) | Six-tab operating dashboard |
| `/report` | `ReportPage` | No | Full six-section live market report — standalone, no nav chrome |
| `/public` | `PublicPage` | No | Public-facing surface — founding letter, eleven hamlet cards, private advisory CTA |

**Note on auth:** The dashboard is visible without login. Only write procedures (status edits, deal appends, profile imports) require an active Manus OAuth session. The global redirect handler in `main.tsx` is whitelisted for `/public` and `/report` — those routes will never trigger an OAuth redirect regardless of session state.

---

## 3. Dashboard Tabs (Six)

The dashboard renders one of six tab components inside `DashboardLayout`. Tabs are switched client-side with no page reload.

### 3.1 HOME
**File:** `client/src/pages/tabs/HomeTab.tsx`

The founding letter tab. Renders the full Christie's East Hampton founding letter with Ed's portrait, the Christie's services grid (six service cards linking to christies.com), the Christie's appraisals video, and the William audio player (ElevenLabs TTS of the founding letter). The "Tap for Market Report" portrait link navigates to `/report`.

**Live data on this tab:** None. All content is static text and CDN assets. The market ticker and weather strip are rendered by `DashboardLayout` (header), not HomeTab itself.

### 3.2 MARKET
**File:** `client/src/pages/tabs/MarketTab.tsx`

The market intelligence tab. Renders the eleven-hamlet data grid with CIS scores, median prices, volume share, and year-over-year data. Also renders the ANEW scoring framework, rate environment panel (30Y fixed, 10Y Treasury, VIX, S&P 500), and capital flow signal.

**Live data on this tab:** Market ticker data from `/api/market-data` (Yahoo Finance + CoinGecko + FRED). Hamlet data is static from `client/src/data/hamlet-master.ts` — it is the canonical source of truth for all eleven hamlet metrics and is not yet live-synced from a sheet.

### 3.3 MAPS
**File:** `client/src/pages/tabs/MapsTab.tsx`

The territory intelligence tab. Renders an interactive Google Maps view with hamlet boundary overlays, the eleven hamlet cards with photography and listing data, and the Christie's Intelligence Score calculator (ANEW four-lens scoring tool).

**Live data on this tab:** Christie's listing data from `/api/listings` (in-memory cache, refreshed by 6AM daily cron). Hamlet boundary polygons from `client/src/data/hamlet-boundaries.ts` (static). Hamlet photography from Manus CDN. Map tiles from Google Maps via Manus proxy (no API key required from Ed).

### 3.4 PIPE
**File:** `client/src/pages/tabs/PipeTab.tsx`

The office pipeline tab. Reads live deal data from the Office Pipeline Google Sheet via `trpc.pipe.sheetDeals`. Renders a deal table with address, town, type, price, status, agent, side, ERS signed, EELI link, signs, photos, Zillow Showcase, and close date. Allows Ed to update deal status and append new deals (both write to the Sheet directly — the Sheet is the single source of truth).

**Live data on this tab:** `trpc.pipe.sheetDeals` → `readPipelineDeals()` → Google Sheets API → Office Pipeline Sheet `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M`. Auth: `GOOGLE_SERVICE_ACCOUNT_JSON` (service account, no session cookie required). **47 deals confirmed live as of April 5, 2026.**

**Write operations (protectedProcedure — Ed must be logged in):**
- `trpc.pipe.updateSheetStatus` — writes status + close date to Sheet columns E and U
- `trpc.pipe.appendSheet` — appends a new 21-column row (A–U) to the Sheet
- `trpc.pipe.importFromProfile` — scrapes Christie's profile page and appends new listings

### 3.5 FUTURE
**File:** `client/src/pages/tabs/FutureTab.tsx`

The growth planning tab. Renders the 300-day ascension plan, GCI targets, agent recruitment scorecard, phase milestones, and the Growth Model v2 link. Content is static/manually synced — it does not pull live data from the Growth Model sheet at runtime. The Growth Model v2 sheet is linked for direct access but not embedded or read by any live procedure.

**Live data on this tab:** None. All content is hard-coded from the Growth Model v2 baseline. The CIREG logo is served from the Christie's International CDN (`d3w216np43fnr4.cloudfront.net`).

### 3.6 INTEL
**File:** `client/src/pages/tabs/IntelTab.tsx`

The operating control room. The most complex tab — four layers of intelligence.

**Layer 1 — Master Calendar:** Google Calendar iframe embed (Christie's EH Operations calendar, ID: `b591e65ffdfeee02ac8b410880b54bfdd20f29bec8b910fcefa51dd3c8cc97ab@group.calendar.google.com`). Fed by nightly Apps Script sync from Event Calendar and Podcast Calendar sheets. Contains 25 Christie's NY auction events and the Wednesday Circuit recurring event.

**Layer 2 — Four-Panel Sheet Grid:** Three live Google Sheet embeds (iframes):
- Agent Recruiting Sheet (`1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA`)
- Social/Podcast Pipeline Sheet (`1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I`)
- Hamptons Outreach Intelligence Sheet (`1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI`) — UHNW targeting, ninth sheet

**Layer 3 — Canon Document Library:** Six document sections with CDN-hosted HTML/PDF links:

| Section | Document | URL | Status |
|---|---|---|---|
| Org Chart | CIREG Ecosystem Map · April 2, 2026 | `d2xsxph8kpxj0f.cloudfront.net/.../cireg-org-chart-v2-april-2026_cf381d58.html` | Live |
| Market Report | Live Market Report Wireframe v2 | `files.manuscdn.com/.../vevzqEIvPqAYOdHz.html` | Live |
| Constitution | Website Wireframe v2 | `files.manuscdn.com/.../EOvOozncXWBiBwbL.html` | Live |
| Constitution | Estate Advisory Card PDF | `d2xsxph8kpxj0f.cloudfront.net/.../christies-estate-advisory-card_e0fc3254.pdf` | Live |
| Constitution | 300-Day Ascension Plan | `files.manuscdn.com/.../WXzEqCTtWmVsElaB.html` | Live |
| Council Brief | Council Brief · March 29, 2026 | `files.manuscdn.com/.../JBBnSxvSjfkLOjlS.html` | Live |
| Market Report | Hamlet PDF · East Hampton Village | — | Pending |
| Attorney DB | Attorney Database | — | Pending |
| IBC | Adam Kalb · IBC Materials | — | Pending |

**Layer 4 — Intelligence Web:** `trpc.intel.webEntities` → `readIntelWebRows()` → Intelligence Web Master Sheet (`1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0`). Renders three sub-tabs: Jarvis Top Agents (RECRUIT/TIER 1), Whale Intelligence (WHALE), Auction Referrals (PARTNER/INSTITUTION). **44 entities confirmed live as of April 5, 2026.**

**Additional INTEL components:**
- `FamilyOfficeList` — static curated list of family offices
- `LocalCharityTracker` — static charity and community organization tracker
- `IntelSourceTemplate` — 15-source data registry (visual documentation of all platform data sources)
- `AttorneyDatabase` — static attorney database (South Fork real estate and estate counsel)
- Perplexity Mastermind Map iframe — `perplexity.ai/computer/a/christie-s-mastermind-map-0qAECI9PRi6bRbieIPaj_g` *(fragile — recommend replacing with hosted PDF)*

---

## 4. Standalone Pages

### 4.1 /report — Live Market Report
**File:** `client/src/pages/ReportPage.tsx`

Six-section full-page market report. Sections: (1) Founding Letter, (2) East Hampton Town intelligence, (3) Southampton Town intelligence, (4) Sag Harbor intelligence, (5) Market Intelligence / rate environment, (6) Hamlet Atlas with all eleven hamlets.

Features: TTS audio playback (founding letter + market report via ElevenLabs), PDF download (via `/api/pdf/report` → Puppeteer), direct Yahoo Finance fetch for S&P 500 close price, CDN assets (Ed headshot, CIREG logos, QR code).

### 4.2 /public — Public-Facing Surface
**File:** `client/src/pages/PublicPage.tsx`

No auth required. No internal data exposed. Renders: founding letter, eleven hamlet intelligence cards (CIS scores, medians, volume share, last notable sale — all from `hamlet-master.ts`), Christie's services grid, private advisory CTA ("Request Territory Briefing · 646-752-1233"). Back button to internal dashboard. No market ticker, no weather, no pipeline data.

---

## 5. Backend Routes (Express)

All routes are registered in `server/_core/index.ts`.

| Method | Path | Handler File | Auth | Purpose |
|---|---|---|---|---|
| All | `/api/oauth/callback` | `server/_core/oauth.ts` | None | Manus OAuth callback — sets session cookie |
| All | `/api/trpc/*` | `server/routers.ts` | Per-procedure | tRPC API gateway |
| GET | `/api/market-data` | `server/market-route.ts` | None | Market ticker proxy (Yahoo/CoinGecko/FRED) |
| POST | `/api/tts/founding-letter` | `server/tts-route.ts` | None | ElevenLabs TTS for founding letter |
| POST | `/api/tts/market-report` | `server/tts-route.ts` | None | ElevenLabs TTS for market report |
| POST | `/api/whatsapp/morning-brief` | `server/whatsapp-route.ts` | `X-William-Secret` header | Trigger morning brief manually |
| POST | `/api/whatsapp/evening-summary` | `server/whatsapp-route.ts` | `X-William-Secret` header | Trigger evening summary manually |
| POST | `/api/whatsapp/test` | `server/whatsapp-route.ts` | `X-William-Secret` header | Send test voice note |
| POST | `/api/whatsapp/inbound` | `server/whatsapp-inbound.ts` | Twilio signature | Inbound WhatsApp command handler |
| GET | `/api/listings` | `server/listings-sync-route.ts` | None | Christie's listings (cached, grouped by hamlet) |
| POST | `/api/listings/sync` | `server/listings-sync-route.ts` | None | Force-refresh listings from Christie's |
| GET | `/api/pdf/report` | `server/pdf-route.ts` | Manus SDK auth | Puppeteer PDF render of `/report` |

---

## 6. tRPC Procedures

All tRPC procedures are defined in `server/routers.ts`. The AUTH MODEL comment block at line 101 governs which procedures use which auth layer.

| Namespace | Procedure | Type | Auth Layer | Purpose |
|---|---|---|---|---|
| `auth` | `me` | query | None | Returns current user from session |
| `auth` | `logout` | mutation | None | Clears session cookie |
| `tts` | `foundingLetter` | mutation | None | ElevenLabs TTS — founding letter |
| `tts` | `marketReport` | mutation | None | ElevenLabs TTS — market report |
| `tts` | `ping` | query | None | Validates ElevenLabs API key is set |
| `pipe` | `sheetDeals` | query | **Service account** | Reads 47 deals from Office Pipeline Sheet |
| `pipe` | `updateSheetStatus` | mutation | Session cookie | Writes status + close date to Sheet |
| `pipe` | `appendSheet` | mutation | Session cookie | Appends new deal row to Sheet |
| `pipe` | `list` | query | Session cookie | Reads pipeline from MySQL DB (legacy) |
| `pipe` | `upsert` | mutation | Session cookie | Upserts pipeline entry in MySQL DB |
| `pipe` | `delete` | mutation | Session cookie | Deletes pipeline entry from MySQL DB |
| `pipe` | `importFromProfile` | mutation | Session cookie | Scrapes Christie's profile → appends to Sheet |
| `intel` | `webEntities` | query | **Service account** | Reads 44 entities from Intelligence Web Sheet |
| `market` | `dataTimestamp` | query | **Service account** | Returns last Sheets API call timestamp |
| `newsletter` | `subscribe` | mutation | None | Beehiiv subscriber creation |
| `newsletter` | `getStats` | query | Session cookie | Beehiiv subscriber stats |
| `newsletter` | `sendTestEmail` | mutation | None | Gmail SMTP test email |
| `system` | `notifyOwner` | mutation | Session cookie | Push notification to platform owner |

---

## 7. Google Sheets (Nine Total)

The service account email is: `christies-eh-sheets@christies-hamptons.iam.gserviceaccount.com`
GCP Project: `959012447001` · Google Sheets API: Enabled · Google Drive API: **Enabled April 5, 2026**

| # | Name | Sheet ID | Live Connection | How Used |
|---|---|---|---|---|
| 1 | **Office Pipeline** | `1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M` | Server-side read/write | PIPE tab — single source of truth for 47 deals |
| 2 | **Intelligence Web Master** | `1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0` | Server-side read | INTEL Layer 4 — Jarvis / Whale / Auction Referrals |
| 3 | **Future Agents Recruiting** | `1a7arxf3_eTAnF7QlD3M-Fwnt7RhOaMWfLlTbA9MJ7mA` | iframe embed | INTEL Layer 2 — Agent Recruiting panel |
| 4 | **Social Pipeline** | `1q92gJTv1RGX_JGka0KhVv9obePvCOaVdmYjEPuhjc5I` | iframe embed | INTEL Layer 2 — Social/Podcast Pipeline panel |
| 5 | **Event Calendar** | `1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s` | iframe embed + Apps Script source | INTEL Layer 1 (calendar source) + Layer 2 embed |
| 6 | **Podcast Calendar** | `1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8` | Apps Script source | INTEL Layer 1 (calendar source only) |
| 7 | **Growth Model v2** | `1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag` | Link only | INTEL Intel Source Registry + FUTURE tab (direct link, not embedded or read live) |
| 8 | **Market Matrix** | `176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g` | **None — orphaned** | Not connected to any live procedure or embed. Candidate for retirement. |
| 9 | **Hamptons Outreach Intelligence** | `1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI` | iframe embed | INTEL Layer 2 — Outreach Intelligence panel (UHNW targeting). Not in Ed's original list of eight. |

---

## 8. Google Calendar

| Calendar | ID | How Used |
|---|---|---|
| Christie's EH Operations | `b591e65ffdfeee02ac8b410880b54bfdd20f29bec8b910fcefa51dd3c8cc97ab@group.calendar.google.com` | INTEL Layer 1 — full-page iframe embed (month view, navy/gold). Fed by nightly Apps Script sync from Event Calendar and Podcast Calendar sheets. Contains 25 Christie's NY auction events + Wednesday Circuit recurring event (May 7, 2026 onward). |

---

## 9. External API Connections

### 9.1 Market Data (Server-Side Proxy)
All market data is fetched server-side at `/api/market-data` and cached to prevent CORS issues in production.

| Feed | Provider | Endpoint | Cache | Data Points |
|---|---|---|---|---|
| S&P 500 | Yahoo Finance | `query1.finance.yahoo.com/v8/finance/chart/%5EGSPC` | 60s | Price, % change |
| Gold | Yahoo Finance | `query1.finance.yahoo.com/v8/finance/chart/GC=F` | 60s | Price /oz, % change |
| Silver | Yahoo Finance | `query1.finance.yahoo.com/v8/finance/chart/SI=F` | 60s | Price /oz, % change |
| VIX | Yahoo Finance | `query1.finance.yahoo.com/v8/finance/chart/%5EVIX` | 60s | Index level |
| 30Y Treasury | Yahoo Finance | `query1.finance.yahoo.com/v8/finance/chart/%5ETYX` | 60s | Yield % |
| Bitcoin | CoinGecko | `api.coingecko.com/api/v3/simple/price` | 60s | USD price, 24h change |
| 30Y Fixed Mortgage | FRED / Freddie Mac | `fred.stlouisfed.org/graph/fredgraph.csv?id=MORTGAGE30US` | **24h** | Rate % |

### 9.2 Weather (Client-Side)
Weather is fetched directly from the browser — no server proxy.

| Feed | Provider | Coordinates | Data Points |
|---|---|---|---|
| Current weather | Open-Meteo | `lat=40.9637, lng=-72.1848` (East Hampton) | Temperature (°F), weather code (mapped to text description) |

### 9.3 ElevenLabs (Voice Synthesis)
Two voice IDs are in use — one for the dashboard/report TTS, one for WhatsApp inbound commands.

| Voice ID | Name | Used In |
|---|---|---|
| `fjnwTZkKtQOJaYzGLa6n` | William (dashboard) | Founding letter TTS, market report TTS, WhatsApp morning/evening briefs |
| `N2lVS1w4EtoT3dr4eOWO` | William (inbound) | WhatsApp inbound NEWS command voice note |

Model: `eleven_multilingual_v2` · Settings: stability 0.5–0.55, similarity_boost 0.75

### 9.4 Twilio WhatsApp
**Outbound (scheduled):** `POST /api/whatsapp/morning-brief` and `POST /api/whatsapp/evening-summary`
**Inbound (webhook):** `POST /api/whatsapp/inbound` — registered at Twilio as the webhook URL for the WhatsApp number.

| Direction | Trigger | Content |
|---|---|---|
| Outbound | 8AM daily cron | Morning brief — Hamptons market + hamlet data + live market context, delivered as ElevenLabs voice note |
| Outbound | 8PM daily cron | Evening pipeline summary — deal count, status breakdown, delivered as ElevenLabs voice note |
| Inbound | `NEWS` command | 14-category Cronkite intelligence brief via Perplexity → ElevenLabs voice note (6h cache) |
| Inbound | `PIPE` command | Last 5 pipeline deals from Office Pipeline Sheet (text reply) |
| Inbound | `STATUS` command | Active listing count + platform summary (text reply) |
| Inbound | `BRIEF` command | Triggers morning brief immediately (voice note) |
| Inbound | `HELP` command | Lists available commands (text reply) |

### 9.5 Perplexity AI
Used exclusively for WhatsApp inbound `NEWS` and `BRIEF` commands.
Model: `sonar` · Max tokens: 600 · Temperature: 0.2
Prompt: 14-category Cronkite-style intelligence brief with strict source attribution rules.

### 9.6 Christie's Listings Scraper
**Source:** `https://www.christiesrealestategroup.com/realestate/listingsv2/` (discovered endpoint, not a public API)
**Trigger:** 6AM daily cron + server startup + manual `POST /api/listings/sync`
**Cache:** In-memory, keyed by `lastSyncAt`
**Output:** Typed `EeleListing` objects classified into eleven hamlet IDs by keyword matching. Used by MAPS hamlet cards and `pipe.importFromProfile`.

### 9.7 Beehiiv (Newsletter — Dormant)
Newsletter infrastructure is built but not yet activated. Requires `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` secrets.
- `newsletter.subscribe` — public, accepts email/name
- `newsletter.getStats` — protected, returns subscriber count
- `buildMarketReportNewsletter()` — builds branded HTML weekly report email

### 9.8 Gmail SMTP (Newsletter — Dormant)
Requires `GMAIL_SMTP_USER` and `GMAIL_APP_PASSWORD` secrets. Used for test emails and newsletter delivery fallback.

---

## 10. Scheduled Jobs (Cron)

All crons run server-side via `node-cron` in `server/_core/index.ts`.

| Schedule | Timezone | Job | Handler |
|---|---|---|---|
| `0 0 6 * * *` (6:00 AM daily) | America/New_York | Christie's listings sync | `syncListings()` → in-memory cache |
| `0 8 * * *` (8:00 AM daily) | Server default (UTC) | William morning brief via WhatsApp | `startWhatsAppScheduler()` |
| `0 20 * * *` (8:00 PM daily) | Server default (UTC) | William evening pipeline summary via WhatsApp | `startWhatsAppScheduler()` |

**Note:** The WhatsApp scheduler crons run in server default timezone (UTC). If the server is in UTC, 8AM UTC = 4AM EDT. This may need adjustment to `America/New_York` timezone to match the listings cron.

---

## 11. Database Schema (MySQL/TiDB)

Two tables. The database is a secondary store — Google Sheets is the primary source of truth for pipeline data.

| Table | Columns | Purpose |
|---|---|---|
| `users` | id, openId, name, email, loginMethod, role (user/admin), createdAt, updatedAt, lastSignedIn | Manus OAuth user records |
| `pipeline` | id, address, hamlet, type, status, askPrice, dom, notes, sortOrder, createdAt, updatedAt | Legacy pipeline DB (secondary to Google Sheet) |

---

## 12. CDN Assets

All static assets are hosted on the Manus CDN. No images or media are stored in the project directory.

**Manus CDN base:** `https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/`
**Manus files CDN:** `https://files.manuscdn.com/user_upload_by_module/session_file/115914870/`
**Christie's International CDN:** `https://d3w216np43fnr4.cloudfront.net/10580/`

| Asset | CDN | File |
|---|---|---|
| Sagaponack beach photo | Manus CDN | `sagaponack_beach_79562586.jpg` |
| Sagaponack hamlet card | Manus CDN | `01_sagaponack_da3d0919.jpg` |
| East Hampton Village beach | Manus CDN | `eh_village_main_beach_77916dfb.jpg` |
| East Hampton Village card | Manus CDN | `02_east_hampton_village_69834421.jpg` |
| Bridgehampton Mecox | Manus CDN | `bridgehampton_mecox_c2a4b82f.jpg` |
| Bridgehampton card | Manus CDN | `03_bridgehampton_cd70aff1.jpg` |
| Southampton Coopers Beach | Manus CDN | `southampton_coopers_beach_fe6759c5.jpg` |
| Southampton card | Manus CDN | `05_southampton_village_da26a626.jpg` |
| Water Mill windmill | Manus CDN | `water_mill_windmill_8a45de1b.jpg` |
| Water Mill card | Manus CDN | `04_water_mill_8b4c3753.jpg` |
| Sag Harbor marina | Manus CDN | `sag_harbor_marina_f2b1b7c1.jpg` |
| Sag Harbor card | Manus CDN | `08_sag_harbor_fa9f5673.jpg` |
| Amagansett beach | Manus CDN | `amagansett_beach_1a94cf78.jpg` |
| Amagansett card | Manus CDN | `06_amagansett_74af9d55.jpg` |
| East Hampton North cedar | Manus CDN | `eh_north_cedar_point_df0d3cd5.jpg` |
| Springs Accabonac | Manus CDN | `springs_accabonac_eb4003dc.jpg` |
| Springs card | Manus CDN | `10_springs_a5e1792f.jpg` |
| Montauk lighthouse | Manus CDN | `montauk_lighthouse_8f675846.jpg` |
| Montauk card | Manus CDN | `09_montauk_a5e39554.jpg` |
| Wainscott Georgica | Manus CDN | `wainscott_georgica_c2860cc0.jpg` |
| Wainscott card | Manus CDN | `07_wainscott_6758074b.jpg` |
| Christie's appraisals video | Manus CDN | `christies-valuations-appraisals_87b12f78.mov` |
| CIREG org chart v2 | Manus CDN | `cireg-org-chart-v2-april-2026_cf381d58.html` |
| Estate advisory card PDF | Manus CDN | `christies-estate-advisory-card_e0fc3254.pdf` |
| QR code (Linktree) | Manus files CDN | `PyhWsQjMFaamcdei.png` |
| Market report wireframe v2 | Manus files CDN | `vevzqEIvPqAYOdHz.html` |
| Website wireframe v2 | Manus files CDN | `EOvOozncXWBiBwbL.html` |
| 300-Day Ascension Plan | Manus files CDN | `WXzEqCTtWmVsElaB.html` |
| Council Brief March 2026 | Manus files CDN | `JBBnSxvSjfkLOjlS.html` |
| CIREG white logo | Christie's CDN | `10580/348947/1.png` |
| CIREG black logo | Christie's CDN | `10580/348547/1.png` |

---

## 13. Secrets / Environment Variables

| Variable | Used In | Status |
|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | `server/sheets-helper.ts` | Active — service account for Sheets reads/writes |
| `ELEVENLABS_API_KEY` | `server/tts-route.ts`, `server/whatsapp-route.ts`, `server/whatsapp-inbound.ts`, `server/routers.ts` | Active |
| `TWILIO_ACCOUNT_SID` | `server/whatsapp-route.ts`, `server/whatsapp-inbound.ts` | Active |
| `TWILIO_AUTH_TOKEN` | `server/whatsapp-route.ts`, `server/whatsapp-inbound.ts` | Active |
| `TWILIO_WHATSAPP_FROM` | `server/whatsapp-route.ts` | Active |
| `WILLIAM_WHATSAPP_TO` | `server/whatsapp-route.ts` | Active |
| `PERPLEXITY_API_KEY` | `server/whatsapp-inbound.ts` | Active |
| `DATABASE_URL` | `server/db.ts` | Active — MySQL/TiDB |
| `JWT_SECRET` | `server/_core/cookies.ts` | Active — session signing |
| `VITE_APP_ID` | `server/_core/env.ts` | Active — Manus OAuth |
| `OAUTH_SERVER_URL` | `server/_core/oauth.ts` | Active — Manus OAuth |
| `VITE_OAUTH_PORTAL_URL` | `client/src/const.ts` | Active — Manus OAuth login redirect |
| `BUILT_IN_FORGE_API_KEY` | `server/_core/sdk.ts` | Active — Manus platform APIs |
| `BUILT_IN_FORGE_API_URL` | `server/_core/sdk.ts` | Active — Manus platform APIs |
| `BEEHIIV_API_KEY` | `server/newsletter.ts` | **Dormant — newsletter not yet activated** |
| `BEEHIIV_PUBLICATION_ID` | `server/newsletter.ts` | **Dormant — newsletter not yet activated** |
| `GMAIL_SMTP_USER` | `server/newsletter.ts` | **Dormant — newsletter not yet activated** |
| `GMAIL_APP_PASSWORD` | `server/newsletter.ts` | **Dormant — newsletter not yet activated** |

---

## 14. Utility Scripts (Not Runtime)

Scripts in `/scripts/` are one-off admin tools run manually from the terminal. They are not part of the deployed application.

| Script | Purpose |
|---|---|
| `scripts/fix-date-column.mjs` | One-time fix for date column formatting in Office Pipeline Sheet |
| `scripts/pipe-update.mjs` | Manual pipeline status update utility |
| `scripts/read-org-chart-sheet.mjs` | Reads Hamptons Outreach Intelligence Sheet (`1mEu4wYyWOXit...`) for org chart data |
| `scripts/run-color-circuit-sync.mjs` | Syncs Event/Podcast sheets to Google Calendar, creates Wednesday Circuit event, color-codes rows |
| `scripts/run-setup-and-scrape.mjs` | Setup and scrape utility for Event Calendar |
| `scripts/test-calendar-access.mjs` | Tests service account access to the shared Google Calendar |
| `scripts/test-listings-parse.mjs` | Tests Christie's listings scraper parsing |
| `GOOGLE_APPS_SCRIPT_CALENDAR_SYNC.gs` | Google Apps Script source for nightly calendar sync (runs in Google's cloud, not on the server) |

---

## 15. Open Items and Decisions Needed

The following items are documented and tracked but require Ed's direction before implementation.

| Item | Category | Status | Decision Needed |
|---|---|---|---|
| **Market Matrix sheet** (`176OVbAi6PrIVlglnvIdpENWBJWYSp4OtxJ-Ad9-sN4g`) | Data | Orphaned — not connected to any live procedure | Retire or connect? |
| **Hamptons Outreach Intelligence sheet** (`1mEu4wYyWOXit...`) | Data | Live as iframe embed; not in original sheet list | Export and review? |
| **Perplexity Mastermind Map embed** | INTEL Layer 3 | Fragile iframe — breaks if Perplexity deletes the artifact | Replace with hosted PDF or remove? |
| **WhatsApp cron timezone** | Infrastructure | 8AM/8PM crons run in server UTC, not America/New_York | Confirm intended send time |
| **Newsletter activation** | Feature | Built, dormant — requires Beehiiv + Gmail SMTP secrets | GO signal from Ed |
| **Org Chart v2** | INTEL Layer 3 | Live. Org Chart v3 (with new hires) pending Ed GO signal | Confirm GO for v3 |
| **Hamlet PDF — East Hampton Village** | INTEL Layer 3 | Pending — placeholder in doc library | Build when ready |
| **Attorney Database** | INTEL Layer 3 | Pending — placeholder in doc library | Populate when ready |
| **IBC Materials (Adam Kalb)** | INTEL Layer 3 | Pending — placeholder in doc library | Provide materials |
| **FUTURE tab live data** | Feature | Growth Model v2 is linked but not read live | Connect live or keep static? |
| **Hamlet-master.ts live sync** | Feature | Hamlet metrics are static; not pulled from Market Matrix sheet | Connect live or keep static? |

---

## 16. Platform Health (April 5, 2026)

| Check | Status |
|---|---|
| Live domain | ✓ christiesrealestategroupeh.com resolving |
| HOME tab | ✓ Founding letter, services grid, audio player, video — all rendering |
| MARKET tab | ✓ Eleven hamlet grid, ANEW framework, rate environment — all rendering |
| MAPS tab | ✓ Google Maps, hamlet cards, CIS calculator — all rendering |
| PIPE tab | ✓ 47 deals loading from Office Pipeline Sheet via service account |
| FUTURE tab | ✓ 300-day plan, GCI targets, CIREG logos — all rendering |
| INTEL tab | ✓ Calendar embed, three sheet panels, doc library, 44 entities in Layer 4 — all rendering |
| /public | ✓ Loads without OAuth redirect in incognito/unauthenticated |
| /report | ✓ Six sections, TTS audio, PDF download — all rendering |
| Market ticker | ✓ S&P, BTC, Gold, Silver, VIX, 30Y Treasury, Mortgage, Hamptons Median — all live |
| Weather | ✓ 53°F Drizzle · East Hampton · April 5, 2026 |
| WhatsApp briefs | ✓ Scheduler running (timezone confirmation pending) |
| Test suite | ✓ 35/35 passing |
| Build | ✓ esbuild 90.3KB clean, zero TypeScript errors |

---

*Prepared by Manny · Christie's East Hampton Re-platform · April 5, 2026*
*Checkpoint `3ce0c12c` · 35/35 tests · esbuild 90.3KB*
